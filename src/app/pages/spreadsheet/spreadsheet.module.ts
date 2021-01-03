// External modules
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

// Library
import { SpreadsheetModule } from "spreadsheet";

// Page
import { SpreadsheetPage } from "./spreadsheet.page";

@NgModule({
    imports: [
        CommonModule,
        SpreadsheetModule,
        RouterModule.forChild([
            { path: "", component: SpreadsheetPage }
        ])
    ],
    declarations: [SpreadsheetPage]
})
export class SpreadsheetPageModule { }