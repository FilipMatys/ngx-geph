// External modules
import { Component, Input, QueryList, ContentChildren, AfterContentChecked } from '@angular/core';

// Directives
import { TableColumnDefinitionDirective } from "./directives/column/column-definition.directive";

@Component({
	selector: 'ngx-table',
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"]
})
export class TableComponent implements AfterContentChecked {

	// List of columns
	@Input("columns")
	private columns: string[] = [];

	// Data
	@Input("data")
	public data: any[] = [];

	// List of column definitions
	@ContentChildren(TableColumnDefinitionDirective)
	public columnDefinitions: QueryList<TableColumnDefinitionDirective>;

	// List of output column definitions
	// This is created from definitions based on columns array
	public outputColumnDefinitions: TableColumnDefinitionDirective[] = [];

	/**
	 * On changes hook
	 */
	public ngAfterContentChecked() {
		// Build
		this.build();
	}

	/**
	 * Build table
	 */
	private build() {
		// Check columns length
		if (!this.columns || !this.columns.length) {
			// Set all column definitions
			return this.outputColumnDefinitions = this.columnDefinitions.toArray();
		}

		// Init list
		const output: TableColumnDefinitionDirective[] = [];

		// Iterate columns
		this.columns.forEach((column) => {
			// Get definition
			let def = this.columnDefinitions.find(t => t.identifier === column);

			// Check if def is set
			if (def) {
				output.push(def);
			}
		});

		// Assign output
		this.outputColumnDefinitions = output;
	}
}
