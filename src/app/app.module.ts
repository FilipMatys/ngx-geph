// External modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';

// App component
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		FormsModule,
		BrowserModule,
		RouterModule.forRoot([
			{
				path: "drawer",
				loadChildren: () => import("./pages/drawer/drawer.module").then((m) => m.DrawerPageModule)
			},
			{
				path: "table",
				loadChildren: () => import("./pages/table/table.module").then((m) => m.TablePageModule)
			},
			{
				path: "form",
				loadChildren: () => import("./pages/form/form.module").then((m) => m.FormPageModule)
			},
			{
				path: "tabs",
				loadChildren: () => import("./pages/tabs/tabs.module").then((m) => m.TabsPageModule)
			},
			{
				path: "tree",
				loadChildren: () => import("./pages/tree/tree.module").then((m) => m.TreePageModule)
			},
			{
				path: "select",
				loadChildren: () => import("./pages/select/select.module").then((m) => m.SelectPageModule)
			},
			{
				path: "tooltip",
				loadChildren: () => import("./pages/tooltip/tooltip.module").then((m) => m.TooltipPageModule)
			},
			{
				path: "datepicker",
				loadChildren: () => import("./pages/datepicker/datepicker.module").then((m) => m.DatepickerPageModule)
			},
			{
				path: "toggle",
				loadChildren: () => import("./pages/toggle/toggle.module").then((m) => m.TogglePageModule)
			},
			{
				path: "spreadsheet",
				loadChildren: () => import("./pages/spreadsheet/spreadsheet.module").then((m) => m.SpreadsheetPageModule)
			}
		])
	],
	declarations: [
		AppComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
