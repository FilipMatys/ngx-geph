// External modules
import { Component, Input, QueryList, ContentChildren, AfterContentChecked, EventEmitter, Output, HostBinding, Injector } from '@angular/core';

// Data
import { TableSortDirection } from './enums/sort-direction.enum';
import { IRowClickEvent } from "./interfaces/row-click-event.interface";
import { ITableConfig } from './interfaces/config.interface';
import { ITableSortColumn } from './interfaces/sort-column.interface';

// Tokens
import { CONFIG } from './symbols/config.token';

// Default values
import { tableConfigDefault } from "./defaults/config.default";
import { tableSortDefault } from "./defaults/sort.default";

// Directives
import { TableColumnDefinitionDirective } from "./directives/column/column-definition.directive";

// Components
import { TableHeaderComponent } from './components/header/header.component';

@Component({
	selector: 'ngx-table',
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"]
})
export class TableComponent implements AfterContentChecked {

	// List of columns
	@Input("columns")
	public set columns(value: string[]) {
		// Assign value
		this._columns = value;

		// Build table
		this.build();
	}

	// List of columns
	private _columns: string[] = [];

	// Data
	@Input("data")
	public data: any[] = [];


	@Input("sort")
	public set sort(value: any[]) {
		// Assign value
		this._sort = this.config.sort.mapSetFn(value);

		// Update headers
		this.updateHeaders();
	}

	// List of sort columns
	private _sort: ITableSortColumn[] = [];

	// Table config setter
	@Input("config")
	public set config(value: ITableConfig<any>) {
		// First make sure config is set
		let config = Object.assign(tableConfigDefault, value);
		// Also make sure sort is set
		config.sort = Object.assign(tableSortDefault, config.sort);

		// Finally assign confit
		this._config = config;
	};

	// Table config getter
	public get config(): ITableConfig<any> {
		return this._config;
	}

	// Table config
	private _config: ITableConfig<any> = tableConfigDefault;

	// Row click
	@Output("rowClick")
	public rowClick: EventEmitter<IRowClickEvent<any>> = new EventEmitter<IRowClickEvent<any>>();

	// Sort change
	@Output("sortChange")
	public sortChange: EventEmitter<ITableSortColumn[]> = new EventEmitter<ITableSortColumn[]>();

	// Clickable class binding
	@HostBinding("class.clickable")
	public get isClickable(): boolean { return this._config.allowRowClick; }

	// List of column definitions
	@ContentChildren(TableColumnDefinitionDirective)
	public columnDefinitions: QueryList<TableColumnDefinitionDirective>;

	// List of output column definitions
	// This is created from definitions based on columns array
	public outputColumnDefinitions: TableColumnDefinitionDirective[] = [];

	// List of headers
	public headers: TableHeaderComponent[] = [];

	/**
	 * Constructor
	 * @param injector 
	 */
	constructor(private injector: Injector) {
		// Get module configuration
		try {
			// Get config
			let config = Object.assign(tableConfigDefault, this.injector.get(CONFIG));
			// Also make sure sort is set
			config.sort = Object.assign(tableSortDefault, config.sort);

			// Finally assign confit
			this._config = config;
		}
		catch (e) { }
	}

	/**
	 * On changes hook
	 */
	public ngAfterContentChecked() {
		// Build
		this.build();
	}

	/**
	 * Register header
	 * @param header 
	 */
	public registerHeader(header: TableHeaderComponent) {
		// Add header to list
		this.headers.push(header);

		// Update header
		this.updateHeader(header);
	}

	/**
	 * Unregister header 
	 */
	public unregisterHeader(header: TableHeaderComponent) {
		// Get index
		let idx = this.headers.indexOf(header);

		// Check if header was found
		if (idx !== -1) {
			this.headers.splice(idx, 1);
		}
	}

	/**
	 * On header click
	 * @param event
	 * @param header 
	 */
	public onHeaderClick(event: Event, header: TableHeaderComponent) {
		// Check if table is sortable
		if (header.isSortable && this.config && (this.config.sort || {}).allow) {
			// Call sort change hook
			this.onSortChange(event, header);
		}
	}

	/**
	 * On row click
	 * @param event 
	 * @param item 
	 * @param index 
	 */
	public onRowClick(event: Event, item: any, index: number): void {
		// Stop event propagation
		event.stopPropagation();

		// Check if click events are allowed
		if (!this._config.allowRowClick) {
			// Do not emit row click event
			return;
		}

		// Emit row click event
		this.rowClick.emit({ item, index });
	}

	/**
	 * On sort change
	 * @param event
	 * @param header 
	 */
	private onSortChange(event: Event, header: TableHeaderComponent) {
		// Get header index
		let idx = this.headers.indexOf(header);

		// Check for index
		if (idx === -1) {
			return;
		}

		// Get identifier
		let identifier = this.outputColumnDefinitions[idx].identifier;

		// Check for multi
		if (!this.config.sort.multi || !(event as any).ctrlKey) {
			// Preserve direction
			let oldDirection = header.sortDirection;

			// Reset all headers
			this.headers.forEach(h => h.sortDirection = TableSortDirection.NONE);

			// Set new direction for header
			header.sortDirection = this.getSortTransition(oldDirection);

			// Reset sort
			this._sort = [{ column: identifier, direction: header.sortDirection }];
		}
		else {
			// Set new direction for header
			header.sortDirection = this.getSortTransition(header.sortDirection);

			// Make sure sort is set
			this._sort = this._sort || [];

			// Check if sort contains given column, if so, we need to remove it, because
			// the column has to be at the end of the list
			let cIndex = this._sort.map(s => s.column).indexOf(identifier);

			// Check if columns was found
			if (cIndex !== -1) {
				this._sort.splice(cIndex, 1);
			}

			// Add column
			this._sort.push({ column: identifier, direction: header.sortDirection });
		}

		// Emit sort change
		this.sortChange.emit(this.config.sort.mapGetFn(this._sort));
	}

	/**
	 * Get sort transition
	 * @param direction 
	 */
	private getSortTransition(direction: number): number {
		switch (direction) {
			// NONE
			case TableSortDirection.NONE:
				return TableSortDirection.ASCENDING;
			// ASCENDING
			case TableSortDirection.ASCENDING:
				return TableSortDirection.DESCENDING;
			// DESCENDING
			case TableSortDirection.DESCENDING:
			default:
				return TableSortDirection.ASCENDING;
		}
	}

	/**
	 * Update headers
	 */
	private updateHeaders() {
		this.headers.forEach(h => this.updateHeader(h));
	}

	/**
	 * Update header
	 * @param header 
	 */
	private updateHeader(header: TableHeaderComponent) {
		// Check sorting
		if (!this.config || !this.config.sort || !this.config.sort.allow) {
			return header.sortDirection = TableSortDirection.NONE;
		}

		// Get header index
		let idx = this.headers.indexOf(header);

		// Check index
		if (idx === -1) {
			return;
		}

		// Get identifier
		let identifier = this.outputColumnDefinitions[idx].identifier;

		// Find given column
		if (!(this._sort || []).some((c) => {
			// Check if identifier matches
			if (c.column !== identifier) {
				return false;
			}

			// Set proper direction
			header.sortDirection = c.direction;
			return true;
		})) {
			// Set sort direction to none
			header.sortDirection = TableSortDirection.NONE;
		}
	}

	/**
	 * Build table
	 */
	private build() {
		// Check if there are any column definitions
		if (!this.columnDefinitions) {
			// Reset output
			return this.outputColumnDefinitions = [];
		}

		// Check columns length
		if (!this._columns || !this._columns.length) {
			// Set all column definitions
			return this.outputColumnDefinitions = this.columnDefinitions.toArray();
		}

		// Init list
		const output: TableColumnDefinitionDirective[] = [];

		// Iterate columns
		this._columns.forEach((column) => {
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
