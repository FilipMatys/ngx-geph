// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { SpreadsheetComponent } from "./spreadsheet.component";
import { SpreadsheetCellComponent } from "./components/cell/cell.component";
import { SpreadsheetSelectedComponent } from "./components/selected/selected.component";

// Pipes
import { SpreadsheetFormatterPipe } from "./pipes/formatter.pipe";

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SpreadsheetComponent,
		SpreadsheetCellComponent,
		SpreadsheetSelectedComponent,
		SpreadsheetFormatterPipe
	],
	exports: [SpreadsheetComponent]
})
export class SpreadsheetModule { }
