// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { SpreadsheetComponent } from "./spreadsheet.component";
import { SpreadsheetCellComponent } from "./components/cell/cell.component";
import { SpreadsheetSelectedComponent } from "./components/selected/selected.component";

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SpreadsheetComponent,
		SpreadsheetCellComponent,
		SpreadsheetSelectedComponent
	],
	exports: [SpreadsheetComponent]
})
export class SpreadsheetModule { }
