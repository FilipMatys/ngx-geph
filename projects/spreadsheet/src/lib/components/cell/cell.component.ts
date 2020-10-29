// External modules
import { Component, ElementRef, Input } from "@angular/core";

// Interfaces
import { ISpreadsheetColumn } from "../../interfaces/column.interface";

// Services
import { SpreadsheetService } from "../../services/spreadsheet.service";

@Component({
    selector: "[ngxSpreadsheetCell]",
    templateUrl: "./cell.component.html",
    styleUrls: ["./cell.component.scss"]
})
export class SpreadsheetCellComponent {

    @Input("rowIndex")
    private _rowIndex: number;

    @Input("columnIndex")
    private _columnIndex: number;

    @Input("column")
    private _column: ISpreadsheetColumn;

    /**
     * Value
     * @description Cell value getter
     */
    public get value(): any {
        return null;
    }

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
     * Get native element
     */
    public getNativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}