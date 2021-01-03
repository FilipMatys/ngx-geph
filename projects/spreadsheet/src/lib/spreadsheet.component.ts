// External modules
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, NgZone, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { debounceTime } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

// Interfaces
import { ISpreadsheetRow } from "./interfaces/row.interface";
import { ISpreadsheetRows } from "./interfaces/rows.interface";
import { ISpreadsheetData } from "./interfaces/data.interface";
import { ISpreadsheetColumn } from "./interfaces/column.interface";
import { ISpreadsheetColumns } from "./interfaces/columns.interface";
import { ISpreadsheetCellChangeEvent } from "./interfaces/cell-change-event.interface";
import { ISpreadsheetRowsDefinition } from "./interfaces/rows-definition.interface";
import { ISpreadsheetColumnsDefinition } from "./interfaces/columns-definition.interface";
import { ISpreadsheetGenerateColumnFn } from "./interfaces/generate-column-fn.interface";
import { ISpreadsheetGenerateRowFn } from "./interfaces/generate-row-fn.interface";

// Enums
import { SpreadsheetMode } from "./enums/mode.enum";
import { SpreadsheetDataType } from "./enums/data-type.enum";
import { SpreadsheetCellChangeEventOrigin } from "./enums/cell-change-event-origin.enum";

// Services
import { SpreadsheetUtilityService } from "./services/utility.service";

// Components
import { SpreadsheetCellComponent } from "./components/cell/cell.component";


@Component({
	selector: "ngx-spreadsheet",
	templateUrl: "./spreadsheet.component.html",
	styleUrls: ["./spreadsheet.component.scss"]
})
export class SpreadsheetComponent implements OnInit, OnDestroy {

	/**
	 * Spreadsheet class
	 */
	@HostBinding("class.ngx-spreadsheet")
	public ngxSpreadsheet: boolean = true;

	@HostBinding("class.ngx-spreadsheet--focused")
	public isFocused: boolean = false;

	// Focus change observable
	private readonly focusChangeSource: Subject<void> = new Subject<void>();
	private readonly focusChange$: Observable<void> = this.focusChangeSource.asObservable();

	@Input("tabIndex")
	@HostBinding("attr.tabIndex")
	public tabIndex: number = 0;

	// List of cells
	@ViewChildren(SpreadsheetCellComponent)
	public cells: QueryList<SpreadsheetCellComponent>;

	// Selected input
	@ViewChild('selectedInput')
	public selectedInput: ElementRef;

	// Component focus flag
	private _hasComponentFocus: boolean = false;

	// Selected input focus flag
	private _hasSelectedInputFocus: boolean = false;
	private _hasSelectedInputValueChanged: boolean = false;

	// Rows mode
	private _rowsMode: number = SpreadsheetMode.DYNAMIC;
	// Columns mode
	private _columnsMode: number = SpreadsheetMode.STATIC;

	// Generate row function
	private _generateRowFn: ISpreadsheetGenerateRowFn;
	// Generate column function
	private _generateColumnFn: ISpreadsheetGenerateColumnFn;

	// Spreadsheet data
	@Input("data")
	public data: ISpreadsheetData<any> = [];

	// Columns definition
	@Input("columns")
	public set columnsDefinition(value: ISpreadsheetColumnsDefinition) {
		// Check if mode is defined
		if (typeof value.mode !== "undefined") {
			// Assign mode
			this._columnsMode = value.mode;
		}

		// Assign function
		this._generateColumnFn = value.generateColumnFn;

		// Check for columns
		if (value.columns) {
			// Assign custom columns
			this._columns = value.columns || [];

			// Do nothing else
			return;
		}

		// Init number of columns with the number provided (or default)
		const numberOfColumns = value.numberOfColumns || 10;

		// Generate columns
		this._columns = Array.from({ length: numberOfColumns }, (_, index) => this.generateColumn(index));
	}

	// Rows definition
	@Input("rows")
	public set rowsDefinition(value: ISpreadsheetRowsDefinition) {
		// Check if mode is defined
		if (typeof value.mode !== "undefined") {
			// Assign mode
			this._rowsMode = value.mode;
		}

		// Assign function
		this._generateRowFn = value.generateRowFn;

		// Check for rows
		if (value.rows) {
			// Assign custom rows
			this._rows = value.rows || [];

			// Do nothing else
			return;
		}

		// Init rows with the number provided (or default)
		const numberOfRows = value.numberOfRows || 10;

		// Generate rows
		this._rows = Array.from({ length: numberOfRows }, (_, index) => this.generateRow(index));
	};

	/**
	 * Cell change event
	 * @description Event fired on cell change
	 */
	@Output("cellChange")
	public cellChangeEvent: EventEmitter<ISpreadsheetCellChangeEvent> = new EventEmitter();

	/**
	 * Rows
	 * @description Rows getter
	 */
	public get rows(): ISpreadsheetRows {
		return this._rows;
	}

	/**
	 * Columns
	 * @description Columns getter
	 */
	public get columns(): ISpreadsheetColumns {
		return this._columns;
	}

	/**
	 * Hovered row index
	 * @description Hovered row index getter
	 */
	public get hoveredRowIndex(): number {
		return this._hoveredRowIndex;
	}

	/**
	 * Hovered column index
	 * @description Hovered column index getter
	 */
	public get hoveredColumnIndex(): number {
		return this._hoveredColumnIndex;
	}

	/**
	 * Selected rows indexes
	 * @description Selected rows indexes getter
	 */
	public get selectedRowsIndexes(): number[] {
		return this._selectedRowsIndexes;
	}

	/**
	 * Selected columns indexes
	 * @description Selected columns indexes getter
	 */
	public get selectedColumnsIndexes(): number[] {
		return this._selectedColumnsIndexes;
	}

	/**
	 * Selected row index
	 * @description Selected row index getter
	 */
	public get selectedRowIndex(): number {
		return this._selectedRowIndex;
	}

	/**
	 * Selected column index
	 * @description Selected column index getter
	 */
	public get selectedColumnIndex(): number {
		return this._selectedColumnIndex;
	}

	/**
	 * Selected cell
	 * @description Selected cell getter
	 */
	public get selectedCell(): SpreadsheetCellComponent {
		return this._selectedCell;
	}

	@HostListener("focus", ["$event"])
	public onFocus(event: FocusEvent): void {
		// Set component focus flag
		this._hasComponentFocus = true;

		// Emit focus change
		this.focusChangeSource.next();

		// Check if tab key is active
		if (!this.isTabKeyActive || this._selectedCell) {
			// Do nothing
			return;
		}

		// Select first cell
		if (!this.isShiftKeyActive) {
			// Select first cell
			this.selectCell(0, 0);
		}
		else {
			// Select last cell
			this.selectCell(this._rows.length - 1, this._columns.length - 1);
		}
	}

	@HostListener("blur", ["$event"])
	public onBlur(event: Event): void {
		// Reset component focus flag
		this._hasComponentFocus = false;

		// Emit focus change
		this.focusChangeSource.next();
	}

	@HostListener("document:copy", ["$event"])
	public onCopy(event: ClipboardEvent): void {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Process copy event
		this.processCopyEvent(event);
	}

	@HostListener("document:paste", ["$event"])
	public onPaste(event: ClipboardEvent): void {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Check for focus
		if (this._hasSelectedInputFocus) {
			// Do nothing
			return;
		}

		// Process paste event
		this.processPasteEvent(event);
	}

	@HostListener("keydown", ["$event"])
	public onKeydown(event: KeyboardEvent): void {
		// Check for ctrl and meta key
		if (event.ctrlKey || event.metaKey) {
			// Do nothing
			return;
		}

		// Check key
		switch (event.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "ArrowDown":
			case "ArrowUp":
				// Process arrow key event
				this.processArrowKeyEvent(event);

				// Do nothing else
				return;

			case "Backspace":
				// Process backspace key event
				this.processBackspaceKeyEvent(event);

				// Do nothing else
				return;

			case "Delete":
				// Process delete key event
				this.processDeleteKeyEvent(event);

				// Do nothing else
				return;

			case "Escape":
				// Process escape key event
				this.processEscapeKeyEvent(event);

				// Do nothing else
				return;

			case "Enter":
				// Process enter key event
				this.processEnterKeyEvent(event);

				// Do nothing else
				return;

			case "Tab":
				// Process tab key event
				this.processTabKeyEvent(event);

				// Do nothing else
				return;

			default:
				// Process default
				this.processDefaultKeyEvent(event);

				// Do nothing else
				return;
		}
	}

	// Hovered indexes
	private _hoveredRowIndex: number = undefined;
	private _hoveredColumnIndex: number = undefined;

	// Selected indexes
	private _selectedRowIndex: number = undefined;
	private _selectedColumnIndex: number = undefined;
	private _selectedRowsIndexes: number[] = [];
	private _selectedColumnsIndexes: number[] = [];

	// Selected cell
	private _selectedCell: SpreadsheetCellComponent;

	// List of rows
	private _rows: ISpreadsheetRows = [];
	// List of columns
	private _columns: ISpreadsheetColumns = [];

	// Document click listener
	private documentClickListener: () => void;
	private documentShiftListener: () => void;
	private documentTabListener: () => void;
	private documentShiftTabListener: () => void;

	// Is keys active flags
	private isShiftKeyActive: boolean = false;
	private isTabKeyActive: boolean = false;

	/**
	 * Constructor
	 * @param ngZone 
	 * @param renderer 
	 * @param element 
	 * @param service 
	 */
	constructor(
		private readonly ngZone: NgZone,
		private readonly renderer: Renderer2,
		private readonly element: ElementRef,
		private readonly service: SpreadsheetUtilityService
	) { }

	/**
	 * On init hook
	 */
	public ngOnInit(): void {
		// Run outside angular zone
		this.ngZone.runOutsideAngular(() => {
			// Register to document click
			this.documentClickListener = this.renderer.listen("document", "click", (event: MouseEvent) => this.handleDocumentClick(event) as any);
			// Register to shift key
			this.documentShiftListener = this.renderer.listen("document", "keydown.shift", (event: KeyboardEvent) => this.handleDocumentShiftKeydown(event) as any);
			// Register to tab key
			this.documentTabListener = this.renderer.listen("document", "keydown.tab", (event: KeyboardEvent) => this.handleDocumentTabKeydown(event) as any);
			// Register to shift tab key
			this.documentTabListener = this.renderer.listen("document", "keydown.shift.tab", (event: KeyboardEvent) => this.handleDocumentShiftTabKeydown(event) as any);
		});

		// Register to focus change
		this.registerToFocusChange();
	}

	/**
	 * On destroy hook
	 */
	public ngOnDestroy(): void {
		// Document click listener
		this.documentClickListener && this.documentClickListener();
		// Document shift listener
		this.documentShiftListener && this.documentShiftListener();
		// Document tab listener
		this.documentTabListener && this.documentTabListener();
		// Document shift tab listener
		this.documentShiftTabListener && this.documentShiftTabListener();
	}

	/**
	 * On selected input focus
	 * @param event 
	 */
	public onSelectedInputFocus(event: Event): void {
		// Set flag
		this._hasSelectedInputFocus = true;
		this._hasSelectedInputValueChanged = true;

		// Emit focus change
		this.focusChangeSource.next();
	}

	/**
	 * On selected input blur
	 * @param event 
	 */
	public onSelectedInputBlur(event: Event): void {
		// Set flag
		this._hasSelectedInputFocus = false;

		// Emit focus change
		this.focusChangeSource.next();
	}

	/**
	 * On cell mouse enter
	 * @param event 
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	public onCellMouseEnter(event: Event, rowIndex: number, columnIndex: number): void {
		// Prevent event propagation
		event.stopPropagation();

		// Set hovered indexes
		this.setHoveredIndexes(rowIndex, columnIndex);
	}

	/**
	 * On cell mouse leave
	 * @param event 
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	public onCellMouseLeave(event: Event, rowIndex: number, columnIndex: number): void {
		// Prevent event propagation
		event.stopPropagation();

		// Reset hovered indexes
		this.resetHoveredIndexes();
	}

	/**
	 * On cell click
	 * @param event 
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	public onCellClick(event: Event, rowIndex: number, columnIndex: number): void {
		// Prevent event propagation
		event.stopPropagation();

		// Dispatch click event on the component as we want to support multiple 
		// spreadsheets within page and clicking on a cell of another spreadsheet
		// has to bubble out 
		this.element.nativeElement.dispatchEvent(new Event("click", { bubbles: true }));

		// Select cell
		this.selectCell(rowIndex, columnIndex);
	}

	/**
	 * Generate row
	 * @param index 
	 */
	private generateRow(index: number): ISpreadsheetRow {
		// First get row using the default function
		const row = this.service.generateRow(index);

		// Now check for custom function
		if (this._generateRowFn) {
			// Process row using custom function
			return this._generateRowFn(row, index);
		}

		// Otherwise return default row
		return row;
	}

	/**
	 * Generate column
	 * @param index 
	 */
	private generateColumn(index: number): ISpreadsheetColumn {
		// First get column using the default function
		const column = this.service.generateColumn(index);

		// Now check for custom function
		if (this._generateColumnFn) {
			// Process column using custom function
			return this._generateColumnFn(column, index);
		}

		// Otherwise return default column
		return column;
	}

	/**
	 * Set hovered indexes
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	private async setHoveredIndexes(rowIndex: number, columnIndex: number): Promise<void> {
		// Set indexes
		this._hoveredRowIndex = rowIndex;
		this._hoveredColumnIndex = columnIndex;
	}

	/**
	 * Reset hovered index
	 */
	private async resetHoveredIndexes(): Promise<void> {
		// Reset indexes
		this._hoveredColumnIndex = this._hoveredRowIndex = undefined;
	}

	/**
	 * Reset select
	 */
	private async resetSelect(): Promise<void> {
		// Before resetting, check for updates to selected cell
		if (this._selectedCell) {
			// Check for change flag
			if (this._hasSelectedInputValueChanged) {
				// Assign value to selected cell
				await this.assignValueToSelectedCell(this.selectedInput.nativeElement.value, SpreadsheetCellChangeEventOrigin.EDIT);

				// Reset flag
				this._hasSelectedInputValueChanged = false;
			}

			// Check if input has focus
			if (this._hasSelectedInputFocus) {
				// Blur input
				this.selectedInput.nativeElement.blur();
			}
		}

		// Reset indexes
		this._selectedColumnIndex = this._selectedRowIndex = undefined;
		this._selectedColumnsIndexes = this._selectedColumnsIndexes = [];

		// Reset cell
		this._selectedCell = null;
	}

	/**
	 * Handle document click
	 * @param event 
	 */
	private async handleDocumentClick(event: MouseEvent): Promise<void> {
		// Check click target
		if (!this.element || this.element.nativeElement.contains(event.target)) {
			// Do nothing
			return;
		}

		// Reset select
		this.ngZone.run(() => this.resetSelect());
	}

	/**
	 * Handle document shift keydown
	 * @param event 
	 */
	private async handleDocumentShiftKeydown(event: KeyboardEvent): Promise<void> {
		// Set shift key active flag
		this.isShiftKeyActive = true;

		// Register to shift keyup
		const documentShiftListener = this.renderer.listen("document", "keyup.shift", (event: KeyboardEvent) => {
			// Remove listener
			documentShiftListener();

			// Reset flag
			this.isShiftKeyActive = false;
		});
	}

	/**
	 * Handle document shift tab keydown
	 * @param event 
	 */
	private async handleDocumentShiftTabKeydown(event: KeyboardEvent): Promise<void> {
		// Set tab key active flag
		this.isTabKeyActive = true;

		// Register to tab keyup
		const documentTabListener = this.renderer.listen("document", "keyup.shift.tab", (event: KeyboardEvent) => {
			// Remove listener
			documentTabListener();

			// Reset flag
			this.isTabKeyActive = false;
		});
	}

	/**
	 * Handle document tab keydown
	 * @param event 
	 */
	private async handleDocumentTabKeydown(event: KeyboardEvent): Promise<void> {
		// Set tab key active flag
		this.isTabKeyActive = true;

		// Register to tab keyup
		const documentTabListener = this.renderer.listen("document", "keyup.tab", (event: KeyboardEvent) => {
			// Remove listener
			documentTabListener();

			// Reset flag
			this.isTabKeyActive = false;
		});
	}

	/**
	 * Select cell
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	private async selectCell(rowIndex: number, columnIndex: number): Promise<void> {
		// Init spreadsheet modification flag
		let isModified: boolean = false;

		// Before selecting new cell, check for selected input
		if (this._selectedCell) {
			// Check for change flag
			if (this._hasSelectedInputValueChanged) {
				// Assign value to selected cell
				await this.assignValueToSelectedCell(this.selectedInput.nativeElement.value, SpreadsheetCellChangeEventOrigin.EDIT);

				// Reset flag
				this._hasSelectedInputValueChanged = false;
			}

			// Check if input has focus
			if (this._hasSelectedInputFocus) {
				// Blur input
				this.selectedInput.nativeElement.blur();
			}
		}

		// Check boundaries of row index (start)
		if (rowIndex < 0) {
			// Do nothing
			return;
		}

		// Check boundaries of column index (start)
		if (columnIndex < 0) {
			// Do nothing
			return;
		}

		// Check boundaries of column index
		if (columnIndex > (this.columns.length - 1)) {
			// Check for mode
			if (this._columnsMode !== SpreadsheetMode.DYNAMIC) {
				// Do nothing
				return;
			}

			// Otherwise add new column
			this._columns.push(this.generateColumn(this._columns.length));

			// Set is modified flag
			isModified = true;
		}

		// Check bottom boundaries of row index (end)
		if (rowIndex > (this._rows.length - 1)) {
			// Check for mode
			if (this._rowsMode !== SpreadsheetMode.DYNAMIC) {
				// Do nothing
				return;
			}

			// Otherwise add new row
			this._rows.push(this.generateRow((this._rows.length)));

			// Set is modified flag
			isModified = true;
		}

		// Check for selected cell
		if (this._selectedCell) {
			// Reset value as we are going to change it
			this.selectedInput.nativeElement.value = "";
		}

		// Set selected indexes
		this._selectedRowIndex = rowIndex;
		this._selectedColumnIndex = columnIndex;
		this._selectedRowsIndexes = [rowIndex];
		this._selectedColumnsIndexes = [columnIndex];

		// Check modified status
		if (!isModified) {
			// Get index within list of cells
			const index = (rowIndex * this.columns.length) + columnIndex;

			// Assign selected cell
			const selectedCell = this.cells.find((_, idx) => idx === index);

			// Assign cell
			return this.assignSelectedCell(selectedCell);
		}

		// Otherwise we need to wait for view children to update
		const subscription = this.cells.changes.subscribe(async () => {
			// Unsubscribe from cell changes
			subscription.unsubscribe();

			// Assign selected cell
			await this.assignSelectedCell();
		});
	}

	/**
	 * Assign selected cell
	 * @description This is a backup function to assign
	 * selected cell in case the cell was not found before 
	 */
	private async assignSelectedCell(cell?: SpreadsheetCellComponent): Promise<void> {
		// Check for cell
		if (cell) {
			// Assign passed cell
			this._selectedCell = cell;
		}
		else {
			// Get index within list of cells
			const index = (this._selectedRowIndex * this.columns.length) + this._selectedColumnIndex;

			// Assign selected cell
			Promise.resolve(null).then(() => this._selectedCell = this.cells.find((_, idx) => idx === index))
		}
	}

	/**
	 * Process backspace key event
	 * @param event 
	 */
	private async processBackspaceKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Check for input focus
		if (this._hasSelectedInputFocus) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];
		// Get selected row
		const row = this.rows[this._selectedRowIndex];

		// Check if column or row is disabled
		if ((column.isDisabled || column.isReadonly) || (row.isDisabled || row.isReadonly)) {
			// Do nothing
			return;
		}

		// Reset input value
		this.selectedInput.nativeElement.value = "";

		// Set focus
		this.selectedInput.nativeElement.focus();
	}

	/**
	 * Process tab key event
	 * @param event 
	 */
	private async processTabKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Init selected indexes
		let selectedRowIndex = this._selectedRowIndex;
		let selectedColumnIndex = this._selectedColumnIndex;

		// Check for shift
		if (event.shiftKey) {
			// Check out of bounds movement
			if (selectedColumnIndex === 0 && selectedRowIndex === 0) {
				// Reset selected and do nothing else
				return this.resetSelect();
			}

			// Prevent default
			event.preventDefault();

			// Check column index
			if (selectedColumnIndex === 0) {
				// Select last column of the previous row
				await this.selectCell(selectedRowIndex - 1, this.columns.length - 1);
			}
			else {
				// Select previous column of current row
				await this.selectCell(selectedRowIndex, selectedColumnIndex - 1);
			}
		}
		else {
			// Check out of bounds movement
			if (selectedColumnIndex >= (this.columns.length - 1) && selectedRowIndex >= (this.rows.length - 1)) {
				// Reset selected and do nothing else
				return this.resetSelect();
			}

			// Prevent default
			event.preventDefault();

			// Check column index
			if (selectedColumnIndex >= (this.columns.length - 1)) {
				// Select first column of the next row
				await this.selectCell(selectedRowIndex + 1, 0);
			}
			else {
				// Select next column of current row
				await this.selectCell(selectedRowIndex, selectedColumnIndex + 1);
			}
		}

		// Set focus back to this component
		setTimeout(() => this.element.nativeElement.focus());
	}

	/**
	 * Process delete key event
	 * @param event 
	 */
	private async processDeleteKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Check if data are set for selected row
		if (!this.data[this._selectedRowIndex] || this._hasSelectedInputFocus) {
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get column
		const column = this.columns[this._selectedColumnIndex];
		// Get row
		const row = this.rows[this._selectedRowIndex];

		// Check if column or row is disabled
		if ((column.isDisabled || column.isReadonly) || (row.isDisabled || row.isReadonly)) {
			// Do nothing
			return;
		}

		// Assign null value to selected cell
		this.assignValueToSelectedCell(null, SpreadsheetCellChangeEventOrigin.EDIT);
	}

	/**
	 * Parse value for column
	 * @param value 
	 * @param column 
	 */
	private async parseValueForColumn(value: any, column: ISpreadsheetColumn): Promise<any> {
		// Check if value is set
		if (typeof value === "undefined" || value === null) {
			// Return undefined
			return undefined;
		}

		// Otherwise parse value based on type
		switch (column.dataType) {
			// NUMBER
			case SpreadsheetDataType.NUMBER:
				// First check if value set
				if (value === "") {
					// Return undefined
					return undefined;
				}

				// Parse value as number
				return this.service.parseNumber(value);

			// STRING, default
			case SpreadsheetDataType.STRING:
			default:
				return `${value}`;
		}
	}

	/**
	 * Assign value to cell
	 * @param value 
	 * @param rowIndex 
	 * @param columnIndex 
	 * @param origin 
	 */
	private async assignValueToCell(value: any, rowIndex: number, columnIndex: number, origin: number): Promise<void> {
		// Get record (default or empty)
		const record = this.data[rowIndex] || {};

		// Get column
		const column = this.columns[columnIndex];
		// Get row
		const row = this.rows[rowIndex];

		// Check if column or row is readonly or disabled
		if ((column.isReadonly || column.isDisabled) || (row.isReadonly || row.isDisabled)) {
			// Do nothing
			return;
		}

		// Get key to value within record
		const key = (typeof column.identifier === "undefined") ? column.label : column.identifier;

		// Get prev value
		const prevValue = record[key];

		// Get next value
		const nextValue = await this.parseValueForColumn(value, column);

		// Assign next value to record
		record[key] = nextValue;

		// Also assign record to data
		this.data[rowIndex] = record;

		// Now check values
		if (prevValue === nextValue) {
			// Do nothing else
			return;
		}

		// Init cell change event
		const cellChangeEvent: ISpreadsheetCellChangeEvent = {};

		// Assign data
		cellChangeEvent.column = column;
		cellChangeEvent.row = { ...this.rows[rowIndex], index: rowIndex };
		cellChangeEvent.prev = prevValue;
		cellChangeEvent.current = nextValue;
		cellChangeEvent.origin = origin;

		// Emit cell change event
		this.cellChangeEvent.emit(cellChangeEvent);
	}

	/**
	 * Assign value to selected cell
	 * @param value 
	 * @param origin 
	 */
	private async assignValueToSelectedCell(value: any, origin: number): Promise<void> {
		// Assign value to cell
		return this.assignValueToCell(value, this._selectedRowIndex, this._selectedColumnIndex, origin);
	}

	/**
	 * Process enter event
	 * @param event 
	 */
	private async processEnterKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Now check if component has focus
			if (this._hasComponentFocus) {
				// Prevent default
				event.preventDefault();

				// Select first cell
				return await this.selectCell(0, 0);
			}

			// Do nothing
			return;
		}

		// Check for selected input
		if (!this.selectedInput || !this.selectedInput.nativeElement) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get column
		const column = this.columns[this._selectedColumnIndex];
		// Get row
		const row = this.rows[this._selectedRowIndex];

		// Check if column or row is disabled
		if ((column.isDisabled || column.isReadonly) || (row.isDisabled || row.isReadonly)) {
			// Do nothing
			return;
		}

		// Check focus
		if (!this._hasSelectedInputFocus) {
			// Set focus
			this.selectedInput.nativeElement.focus();

			// Set changed flag
			this._hasSelectedInputValueChanged = true;

			// Do nothing else
			return;
		}

		// Assign value only when not undefined
		if (typeof this.selectedInput.nativeElement.value !== "undefined") {
			// Assign value to selected cell
			await this.assignValueToSelectedCell(this.selectedInput.nativeElement.value, SpreadsheetCellChangeEventOrigin.EDIT);
		}

		// Blur input
		this.selectedInput.nativeElement.blur();

		// Set changed flag
		this._hasSelectedInputValueChanged = false;

		// Set focus back to this component
		setTimeout(() => this.element.nativeElement.focus());
	}

	/**
	 * Process escape key event
	 * @param event 
	 */
	private async processEscapeKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Check for selected input
		if (!this.selectedInput || !this.selectedInput.nativeElement) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];
		// Get selected row
		const row = this.rows[this._selectedRowIndex];

		// Check if column or row is disabled
		if ((column.isDisabled || column.isReadonly) || (row.isDisabled || row.isReadonly)) {
			// Do nothing
			return;
		}

		// Reset changed flag
		this._hasSelectedInputValueChanged = false;

		// Check if input has focus
		if (!this._hasSelectedInputFocus) {
			// Reset selected
			await this.resetSelect();
		}
		else {
			// Reset value
			this.selectedInput.nativeElement.value = this._selectedCell.value;

			// Blur
			this.selectedInput.nativeElement.blur();

			// Set focus back to this component
			setTimeout(() => this.element.nativeElement.focus());
		}
	}

	/**
	 * Process arrow key event
	 * @param event
	 */
	private async processArrowKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Now check if component has focus
			if (this._hasComponentFocus) {
				// Prevent default
				event.preventDefault();

				// Select first cell
				return await this.selectCell(0, 0);
			}

			// Do nothing
			return;
		}

		// Get selected indexes
		let rowIndex = this._selectedRowIndex;
		let columnIndex = this._selectedColumnIndex;

		// Check for specific key
		switch (event.key) {
			// Arrow left
			case "ArrowLeft":
				// Check for focus
				if (this._hasSelectedInputFocus) {
					// Do nothing as input has focus
					return;
				}

				columnIndex--;
				break;

			// Arrow right
			case "ArrowRight":
				// Check for focus
				if (this._hasSelectedInputFocus) {
					// Do nothing as input has focus
					return;
				}

				columnIndex++;
				break;

			// Arrow down
			case "ArrowDown":
				rowIndex++;
				break;

			// Arrow up
			case "ArrowUp":
				rowIndex--;
				break;
		}

		// Prevent event default
		event.preventDefault();

		// Select cell
		await this.selectCell(rowIndex, columnIndex);

		// Set focus back to this component
		setTimeout(() => this.element.nativeElement.focus());
	}

	/**
	 * Process copy event
	 * @param event
	 */
	private async processCopyEvent(event: ClipboardEvent): Promise<void> {
		// Get record (or default as empty)
		const record = this.data[this._selectedRowIndex] || {};

		// Get column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled) {
			// Do nothing
			return;
		}

		// Get value
		const value = record[(typeof column.identifier === "undefined") ? column.label : column.identifier] || "";

		// Set clipboard data from the cell
		event.clipboardData.setData("text", `${value}`);

		// Prevent default
		event.preventDefault();
	}

	/**
	 * Process default key event
	 * @param event 
	 */
	private async processDefaultKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Check for input focus
		if (this._hasSelectedInputFocus) {
			// Do nothing
			return;
		}

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];
		// Get selected row
		const row = this.rows[this._selectedRowIndex];

		// Check if column or row is disabled
		if ((column.isDisabled || column.isReadonly) || (row.isDisabled || row.isReadonly)) {
			// Do nothing
			return;
		}

		// Create character check function
		const isCharacterKeyEvent = (event: KeyboardEvent): boolean => /^.$/u.test(event.key);


		// Check if event was raised by character key
		if (!isCharacterKeyEvent(event)) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Assign key to input
		this.selectedInput.nativeElement.value = event.key;
		// Set focus
		this.selectedInput.nativeElement.focus();

		// Set changed flag
		this._hasSelectedInputValueChanged = true;
	}

	/**
	 * Process paste event
	 * @param event 
	 */
	private async processPasteEvent(event: ClipboardEvent): Promise<void> {
		// First get data
		const data = event.clipboardData.getData("text");

		// Check data
		if (typeof data === "undefined") {
			// Do nothing
			return;
		}

		// Otherwise split data into lines
		const lines = data.split(/\r?\n/).filter((line) => line.length);

		// Now process each line
		for (let index = 0, rowIndex = this._selectedRowIndex; index < lines.length; index++, rowIndex++) {
			// Get line
			const line = lines[index];

			// Split line into values
			const values = line.split("\t");

			// Now it is time to process the values
			for (let vIndex = 0, columnIndex = this._selectedColumnIndex; vIndex < values.length && columnIndex < this.columns.length; vIndex++, columnIndex++) {
				// Get value
				const value = values[vIndex];

				// Assign value to cell
				await this.assignValueToCell(value, rowIndex, columnIndex, SpreadsheetCellChangeEventOrigin.CLIPBOARD);
			}
		}
	}

	/**
	 * Register to focus change
	 */
	private registerToFocusChange(): void {
		this.focusChange$
			// Wait 50ms to get the most recent value 
			.pipe((debounceTime(50)))
			.subscribe(() => this.isFocused = this._hasComponentFocus || this._hasSelectedInputFocus);
	}
}
