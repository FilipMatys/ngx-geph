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
				path: "table",
				loadChildren: () => import("./pages/table/table.module").then((m) => m.TablePageModule)
			},
			{
				path: "tabs",
				loadChildren: () => import("./pages/tabs/tabs.module").then((m) => m.TabsPageModule)
			},
			{
				path: "select",
				loadChildren: () => import("./pages/select/select.module").then((m) => m.SelectPageModule)
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
