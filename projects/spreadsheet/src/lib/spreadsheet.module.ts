// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { SpreadsheetComponent } from "./spreadsheet.component";

// Services
import { SpreadsheetService } from "./services/spreadsheet.service";
import { SpreadsheetSelectedComponent } from "./components/selected/selected.component";

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SpreadsheetComponent,
		SpreadsheetSelectedComponent
	],
	exports: [SpreadsheetComponent],
	providers: [SpreadsheetService]
})
export class SpreadsheetModule { }
