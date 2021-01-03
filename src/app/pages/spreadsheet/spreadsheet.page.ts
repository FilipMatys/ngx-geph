// External modules
import { Component } from "@angular/core";
import { ISpreadsheetColumnsDefinition, ISpreadsheetRowsDefinition, SpreadsheetMode } from "spreadsheet";

@Component({
    selector: "page-spreadsheet",
    templateUrl: "./spreadsheet.page.html",
    styleUrls: ["./spreadsheet.page.scss"]
})
export class SpreadsheetPage {

    public readonly rowsDefinition: ISpreadsheetRowsDefinition = {
        mode: SpreadsheetMode.STATIC,
        numberOfRows: 10
    }

    public readonly columnsDefinition: ISpreadsheetColumnsDefinition = {
        mode: SpreadsheetMode.STATIC,
        numberOfColumns: 10
    }
}