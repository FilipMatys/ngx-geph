// External modules
import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

// Interfaces
import { ISpreadsheetColumn } from "../../interfaces/column.interface";
import { ISpreadsheetCoordinates } from "../../interfaces/coordinates.interface";

// Services
import { SpreadsheetService } from "../../services/spreadsheet.service";

@Component({
    selector: "[ngxSpreadsheetCell]",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.scss"]
})
export class SpreadsheetCellComponent implements OnInit, OnDestroy {

    @Input("rowIndex")
    private _rowIndex: number;

    @Input("columnIndex")
    private _columnIndex: number;

    @Input("column")
    private _column: ISpreadsheetColumn;

    // Get cell subscription
    private getCellSubscription: Subscription;

    /**
     * Constructor
     * @param elementRef
     * @param service
     */
    constructor(
        private elementRef: ElementRef,
        private service: SpreadsheetService
    ) { }

    /**
     * On init hook
     */
    public ngOnInit(): void {
        // Subscribe to get cell event
        this.getCellSubscription = this.service.getCell$
            // Filter event to this cell
            .pipe(filter((value) => value.columnIndex === this._columnIndex && value.rowIndex === this._rowIndex))
            // Subscribe to the event
            .subscribe((value) => this.processGetCell(value));
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy(): void {
        // Unsubscribe subscriptions
        this.getCellSubscription && this.getCellSubscription.unsubscribe();
    }

    /**
     * Get native element
     */
    public getNativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    /**
     * Process get cell
     * @param coordinates 
     */
    private async processGetCell(coordinates: ISpreadsheetCoordinates): Promise<void> {
        // Emit this component as result
        this.service.cell(this);
    }
}