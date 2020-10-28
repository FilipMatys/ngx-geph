// External modules
import { Component, HostBinding, Input } from "@angular/core";

// Components
import { SpreadsheetCellComponent } from "../cell/cell.component";

@Component({
    selector: "ngx-spreadsheet-selected",
    templateUrl: "./selected.component.html",
    styleUrls: ["./selected.component.scss"]
})
export class SpreadsheetSelectedComponent {

    @Input("cell")
    private _cell: SpreadsheetCellComponent;

    /**
     * Width
     * @description Width based on cell
     */
    @HostBinding("style.width.px")
    public get width(): number {
        // Check cell
        if (!this._cell) {
            return 0;
        }

        // Get cell width
        return this._cell.getNativeElement().offsetWidth + 1;
    }

    /**
     * Height
     * @description Height based on cell
     */
    @HostBinding("style.height.px")
    public get height(): number {
        // Check cell
        if (!this._cell) {
            return 0;
        }

        // Get cell height
        return this._cell.getNativeElement().offsetHeight;
    }

    /**
     * Position X
     * @description Position X getter
     */
    @HostBinding("style.left.px")
    public get positionX(): number {
        // Check cell
        if (!this._cell) {
            return 0;
        }

        // Get cell position x
        return this._cell.getNativeElement().offsetLeft - 1;
    }

    /**
     * Position Y
     * @description Position Y getter
     */
    @HostBinding("style.top.px")
    public get positionY(): number {
        // Check cell
        if (!this._cell) {
            return 0;
        }

        // Get cell position y
        return this._cell.getNativeElement().offsetTop - 1;
    }
}