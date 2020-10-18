// External modules
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";

// Interfaces
import { ISpreadsheetCoordinates } from "../interfaces/coordinates.interface";

// Components
import { SpreadsheetCellComponent } from "../components/cell/cell.component";

@Injectable()
export class SpreadsheetService {

	// Cell source
	private cellSource: ReplaySubject<SpreadsheetCellComponent> = new ReplaySubject<SpreadsheetCellComponent>(1); 
	private cell$: Observable<SpreadsheetCellComponent> = this.cellSource.asObservable();

	// Get cell source
	private getCellSource: Subject<ISpreadsheetCoordinates> = new Subject<ISpreadsheetCoordinates>();
	public getCell$: Observable<ISpreadsheetCoordinates> = this.getCellSource.asObservable();

	/**
	 * Get cell
	 * @param coordinates
	 */
	public async getCell(coordinates: ISpreadsheetCoordinates): Promise<SpreadsheetCellComponent> {
		// Emit get cell
		this.getCellSource.next(coordinates);

		// Create new promise
		return new Promise<SpreadsheetCellComponent>((resolve) => {
			// Subscribe to cell
			this.cell$.subscribe((cell) => resolve(cell));
		});
	}

	/**
	 * Pass cell
	 * @param cell 
	 */
	public async cell(cell: SpreadsheetCellComponent): Promise<void> {
		// Emit cell
		this.cellSource.next(cell);
	}
}
