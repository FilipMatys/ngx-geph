// External modules
import { Component, ElementRef, HostListener, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";

// Interfaces
import { ISpreadsheetData } from "./interfaces/data.interface";
import { ISpreadsheetColumns } from "./interfaces/columns.interface";
import { ISpreadsheetRows } from "./interfaces/rows.interface";
import { ISpreadsheetRow } from "./interfaces/row.interface";

// Enums
import { SpreadsheetRowsMode } from "./enums/rows-mode.enum";

// Components
import { SpreadsheetCellComponent } from "./components/cell/cell.component";
import { SpreadsheetDataType } from "./enums/data-type.enum";

@Component({
	selector: "ngx-spreadsheet",
	templateUrl: "./spreadsheet.component.html",
	styleUrls: ["./spreadsheet.component.scss"]
})
export class SpreadsheetComponent {

	// List of cells
	@ViewChildren(SpreadsheetCellComponent)
	public cells: QueryList<SpreadsheetCellComponent>;

	// Selected input
	@ViewChild('selectedInput')
	public selectedInput: ElementRef;

	// Selected input focus flag
	private _hasSelectedInputFocus: boolean = false;

	// Rows mode
	private _rowsMode?: number = SpreadsheetRowsMode.DYNAMIC;

	// Spreadsheet data
	@Input("data")
	public data: ISpreadsheetData<any> = [];

	// List of spreadsheet columns
	@Input("columns")
	public columns: ISpreadsheetColumns = [];

	// Rows definition
	@Input("rows")
	public set rowsDefinition(value: ISpreadsheetRows) {
		// Check if mode is defined
		if (typeof value.mode !== "undefined") {
			// Assign mode
			this._rowsMode = value.mode;
		}

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
		this._rows = Array.from({ length: numberOfRows }, () => { return {} });
	};

	/**
	 * Rows
	 * @description Rows getter
	 */
	public get rows(): ISpreadsheetRow[] {
		return this._rows;
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

	@HostListener("document:click", ["$event"])
	public onClick(event: Event): void {
		// Check click target
		if (!this.element || this.element.nativeElement.contains(event.target)) {
			// Do nothing
			return;
		}


		// Reset select
		this.resetSelect();
	}

	@HostListener("copy", ["$event"])
	public onCopy(event: ClipboardEvent): void {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Process copy event
		this.processCopyEvent(event);
	}

	@HostListener("paste", ["$event"])
	public onPaste(event: ClipboardEvent): void {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

		// Process paste event
		this.processPasteEvent(event);
	}

	@HostListener("document:keydown", ["$event"])
	public onKeydown(event: KeyboardEvent): void {
		// Check if any cell is selected
		if (!this._selectedCell) {
			// Do nothing
			return;
		}

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
				this.processEnterEvent(event);

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
	private _rows: ISpreadsheetRow[] = [];

	/**
	 * Constructor
	 * @param element
	 */
	constructor(private element: ElementRef) { }

	/**
	 * On selected input focus
	 * @param event 
	 */
	public onSelectedInputFocus(event: Event): void {
		// Set flag
		this._hasSelectedInputFocus = true;
	}

	/**
	 * On selected input blur
	 * @param event 
	 */
	public onSelectedInputBlur(event: Event): void {
		// Set flag
		this._hasSelectedInputFocus = false;
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
		// Reset indexes
		this._selectedColumnIndex = this._selectedRowIndex = undefined;

		// Reset cell
		this._selectedCell = null;
	}

	/**
	 * Select cell
	 * @param rowIndex 
	 * @param columnIndex 
	 */
	private async selectCell(rowIndex: number, columnIndex: number): Promise<void> {
		// Before selecting new cell, check for selected input
		if (this._selectedCell) {
			// Assign value
			await this.assignValueToSelectedCell(this.selectedInput.nativeElement.value);

			// Blur input
			this.selectedInput.nativeElement.blur();
		}

		// Check boundaries of row index
		if (rowIndex < 0) {
			// Do nothing
			return;
		}

		// Check boundaries of column index
		if (columnIndex < 0 || columnIndex > (this.columns.length - 1)) {
			// Do nothing
			return;
		}

		// Check bottom boundaries of row index
		if (rowIndex > (this._rows.length - 1)) {
			// Check for mode
			if (this._rowsMode !== SpreadsheetRowsMode.DYNAMIC) {
				// Do nothing
				return;
			}

			// Otherwise add new row
			this._rows.push({});
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

		// Get index within list of cells
		const index = (rowIndex * this.columns.length) + columnIndex;

		// Assign selected cell
		const selectedCell = this.cells.find((_, idx) => idx === index);

		// Check if cell was found
		if (selectedCell) {
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
			this._selectedCell = this.cells.find((_, idx) => idx === index);
		}

		// Check if selected cell is set
		if (!this._selectedCell) {
			// Do nothing else
			return;
		}

		// Also make sure value is assigned
		setTimeout(() => this.selectedInput.nativeElement.value = this._selectedCell.value || "");
	}

	/**
	 * Process backspace key event
	 * @param event 
	 */
	private async processBackspaceKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check for input focus
		if (this._hasSelectedInputFocus) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled || column.isReadonly) {
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
		// Prevent default
		event.preventDefault();

		// Init selected indexes
		let selectedRowIndex = this._selectedRowIndex;
		let selectedColumnIndex = this._selectedColumnIndex;

		// Check for shift
		if (event.shiftKey) {
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
	}

	/**
	 * Process delete key event
	 * @param event 
	 */
	private async processDeleteKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if data are set for selected row
		if (!this.data[this._selectedRowIndex] || this._hasSelectedInputFocus) {
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled || column.isReadonly) {
			// Do nothing
			return;
		}

		// Reset value of given record
		this.data[this._selectedRowIndex][column.identifier || column.label] = null;
	}

	/**
	 * Assign value to selected cell
	 * @param value 
	 */
	private async assignValueToSelectedCell(value: any): Promise<void> {
		// Get record (or default as empty)
		const record = this.data[this._selectedRowIndex] || {};

		// Get column
		const column = this.columns[this._selectedColumnIndex];

		// Check column data type
		switch (column.dataType) {
			// NUMBER
			case SpreadsheetDataType.NUMBER:
				// Set value
				record[column.identifier || column.label] = Number(value);
				break;

			// DEFAULT
			default:
				// Set value
				record[column.identifier || column.label] = `${value}`;
				break;

		}

		// Assign record (in case new was created)
		this.data[this._selectedRowIndex] = record;
	}

	/**
	 * Process enter event
	 * @param event 
	 */
	private async processEnterEvent(event: KeyboardEvent): Promise<void> {
		// Check for selected input
		if (!this.selectedInput || !this.selectedInput.nativeElement) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled || column.isReadonly) {
			// Do nothing
			return;
		}

		// Check focus
		if (!this._hasSelectedInputFocus) {
			// Set focus
			this.selectedInput.nativeElement.focus();

			// Do nothing else
			return;
		}

		// Assign value
		await this.assignValueToSelectedCell(this.selectedInput.nativeElement.value);

		// Blur input
		this.selectedInput.nativeElement.blur();
	}

	/**
	 * Process escape key event
	 * @param event 
	 */
	private async processEscapeKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check for selected input
		if (!this.selectedInput || !this.selectedInput.nativeElement) {
			// Do nothing
			return;
		}

		// Prevent default
		event.preventDefault();

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled || column.isReadonly) {
			// Do nothing
			return;
		}

		// Reset value
		this.selectedInput.nativeElement.value = this._selectedCell.value;

		// Blur
		this.selectedInput.nativeElement.blur();
	}

	/**
	 * Process arrow key event
	 * @param event
	 */
	private async processArrowKeyEvent(event: KeyboardEvent): Promise<void> {
		// Prevent event default
		event.preventDefault();

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

		// Select cell
		await this.selectCell(rowIndex, columnIndex);
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
		const value = record[column.identifier || column.label] || "";

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
		// Check for input focus
		if (this._hasSelectedInputFocus) {
			// Do nothing
			return;
		}

		// Get selected column
		const column = this.columns[this._selectedColumnIndex];

		// Check if column is disabled
		if (column.isDisabled || column.isReadonly) {
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

			// Get record data for given row or init default
			const record = this.data[rowIndex] || {};

			// Now it is time to process the values
			for (let vIndex = 0, columnIndex = this._selectedColumnIndex; vIndex < values.length && columnIndex < this.columns.length; vIndex++, columnIndex++) {
				// Get value
				const value = values[vIndex];

				// Get column
				const column = this.columns[columnIndex];

				// Check if column is disabled
				if (column.isDisabled || column.isReadonly) {
					// Skip this column
					continue;
				}

				// Check column data type
				switch (column.dataType) {
					// NUMBER
					case SpreadsheetDataType.NUMBER:
						// Set value
						record[column.identifier || column.label] = Number(value);
						break;

					// DEFAULT
					default:
						// Set value
						record[column.identifier || column.label] = `${value}`;
						break;

				}
			}

			// Assign record
			this.data[rowIndex] = record;
		}
	}
}
