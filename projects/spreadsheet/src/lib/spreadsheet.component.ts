// External modules
import { Component, HostListener } from "@angular/core";
import { SpreadsheetCellComponent } from "./components/cell/cell.component";

// Interfaces
import { ISpreadsheetColumns } from "./interfaces/columns.interface";

// Services
import { SpreadsheetService } from "./services/spreadsheet.service";

@Component({
	selector: "ngx-spreadsheet",
	templateUrl: "./spreadsheet.component.html",
	styleUrls: ["./spreadsheet.component.scss"],
	providers: [SpreadsheetService]
})
export class SpreadsheetComponent {

	// List of spreadsheet columns
	public columns: ISpreadsheetColumns = [
		{ label: "A" },
		{ label: "B" },
		{ label: "C" },
		{ label: "D" },
		{ label: "E" },
		{ label: "F" },
		{ label: "G" },
		{ label: "H" },
	];

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

	@HostListener("window:keydown", ["$event"])
	public onKeydown(event: KeyboardEvent): void {
		// Check key
		switch (event.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "ArrowDown":
			case "ArrowUp":
				// Process arrow key event
				this.processArrowKeyEvent(event);

				// Do nothing else
				break;
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

	/**
	 * Constructor
	 * @param service 
	 */
	constructor(private service: SpreadsheetService) { }

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
	 * Select cell
	 * @param rowIndex 
	 * @param columnIndex 
	 * @param target
	 * @param cell
	 */
	private async selectCell(rowIndex: number, columnIndex: number, cell?: SpreadsheetCellComponent): Promise<void> {
		// Set selected indexes
		this._selectedRowIndex = rowIndex;
		this._selectedColumnIndex = columnIndex;
		this._selectedRowsIndexes = [rowIndex];
		this._selectedColumnsIndexes = [columnIndex];

		cell = cell || await this.service.getCell({ rowIndex, columnIndex });

		// Assign selected cell
		this._selectedCell = cell;
	}

	/**
	 * Process arrow key event
	 * @param event
	 */
	private async processArrowKeyEvent(event: KeyboardEvent): Promise<void> {
		// Check if any cell is selected
		if (!this._selectedCell) {
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
				columnIndex--;
				break;

			// Arrow right
			case "ArrowRight":
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

		// Prevent event default
		event.preventDefault();

		// Get cell based on row and column index
		const cell = await this.service.getCell({ rowIndex, columnIndex });

		// Check if any cell was found
		if (!cell) {
			// Do nothing
			return;
		}

		// Select cell
		await this.selectCell(rowIndex, columnIndex, cell);
	}
}
