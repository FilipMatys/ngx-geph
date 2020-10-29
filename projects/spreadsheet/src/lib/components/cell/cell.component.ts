// External modules
import { Component, ElementRef, Input } from "@angular/core";

// Interfaces
import { ISpreadsheetColumn } from "../../interfaces/column.interface";

@Component({
    selector: "[ngxSpreadsheetCell]",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.scss"]
})
export class SpreadsheetCellComponent<TRecord = any> {

    @Input("rowIndex")
    private _rowIndex: number;

    @Input("columnIndex")
    private _columnIndex: number;

    @Input("column")
    private _column: ISpreadsheetColumn;

    @Input("record")
    private _record: TRecord;

    /**
     * Value
     * @description Cell value getter
     */
    public get value(): any {
        // Check if record is defined
        if (!this._record) {
            return null;
        }

        // Check if column value is defined
        if (!(this._column.identifier in this._record)) {
            return null;
        }

        // Otherwise return value
        return this._record[this._column.identifier || this._column.label];
    }

    /**
     * Constructor
     * @param elementRef
     */
    constructor(private elementRef: ElementRef) { }

    /**
     * Get native element
     */
    public getNativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}