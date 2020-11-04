// External modules
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

// Interfaces
import { ITableConfig } from "./interfaces/config.interface";

// Tokens
import { CONFIG } from "./symbols/config.token";

// Components
import { TableComponent } from "./table.component";
import { TableHeaderComponent } from "./components/header/header.component";

// Directives
import { TableColumnDefinitionDirective } from "./directives/column/column-definition.directive";
import { TableCellDefinitionDirective } from "./directives/cell/cell-definition.directive";
import { TableHeaderDefinitionDirective } from "./directives/header/header-definition.directive";
import { TableFooterDefinitionDirective } from "./directives/footer/footer-definition.directive";
import { TableExpansionDefinitionDirective } from "./directives/expansion/expansion-definition.directive";
import { TableEmptyDefinitionDirective } from "./directives/empty/empty-definition.directive";

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TableComponent,
		TableHeaderComponent,
		TableColumnDefinitionDirective,
		TableCellDefinitionDirective,
		TableHeaderDefinitionDirective,
		TableFooterDefinitionDirective,
		TableExpansionDefinitionDirective,
		TableEmptyDefinitionDirective
	],
	exports: [
		TableComponent,
		TableHeaderComponent,
		TableColumnDefinitionDirective,
		TableCellDefinitionDirective,
		TableHeaderDefinitionDirective,
		TableFooterDefinitionDirective,
		TableExpansionDefinitionDirective,
		TableEmptyDefinitionDirective
	]
})
export class TableModule {

	/**
	 * Import module with configuration
	 * @param config 
	 */
	public static forRoot(config: ITableConfig<any>): ModuleWithProviders<TableModule> {
		return {
			ngModule: TableModule,
			providers: [
				{ provide: CONFIG, useValue: config }
			]
		}
	}
}
