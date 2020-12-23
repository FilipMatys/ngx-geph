// External modules
import { Component, Input, QueryList, ContentChildren, AfterContentChecked, EventEmitter, Output, HostBinding, Injector, TemplateRef, ContentChild, OnInit, NgZone, OnDestroy, Renderer2, DoCheck, IterableDiffers, IterableDiffer, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { asapScheduler, fromEvent, Subscription } from 'rxjs';
import { auditTime, debounceTime, startWith } from 'rxjs/operators';

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
import { TableExpansionDefinitionDirective } from "./directives/expansion/expansion-definition.directive";
import { TableEmptyDefinitionDirective } from "./directives/empty/empty-definition.directive";

// Components
import { TableHeaderComponent } from './components/header/header.component';

@Component({
	selector: 'ngx-table',
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.scss"]
})
export class TableComponent implements AfterContentChecked, OnInit, OnDestroy, DoCheck {

	// List of columns
	@Input("columns")
	public set columns(value: string[]) {
		// Assign value
		this._columns = value;

		// Build table
		this.build();
	}

	@Input("scrollContainer")
	public set scrollContainer(container: HTMLElement) {
		// Assign scroll container
		this._scrollContainer = container;

		// Make sure to unsubscribe scroll container subscription
		this._scrollContainerScrolledSubscription && this._scrollContainerScrolledSubscription.unsubscribe();

		// Check for container
		if (!container) {
			// Do nothing
			return;
		}

		// Run outside of angular zone
		this.ngZone.runOutsideAngular(() => {
			// Set to be position relative
			this.renderer.setStyle(this._scrollContainer, "position", "relative");

			// Subscribe to scroll event
			this._scrollContainerScrolledSubscription = fromEvent(this._scrollContainer, "scroll")
				.pipe(startWith(null!))
				.pipe(auditTime(0, asapScheduler))
				.subscribe((event) => this.handleScrollContainerScroll(event));
		});
	};

	@Input("scrollSpacer")
	public set scrollSpacer(spacer: HTMLElement) {
		// Assign spacer
		this._scrollSpacer = spacer;

		// Check for spacer
		if (!spacer) {
			// Do nothing
			return;
		}

		// Run outside angular zone
		this.ngZone.runOutsideAngular(() => {
			// Set styles for spacer
			this.renderer.setStyle(this._scrollSpacer, "position", "absolute");
			this.renderer.setStyle(this._scrollSpacer, "width", "1px");
			this.renderer.setStyle(this._scrollSpacer, "top", 0);
			this.renderer.setStyle(this._scrollSpacer, "left", 0);
		});
	}

	// List of columns
	private _columns: string[] = [];

	// Scroll container
	private _scrollContainer: HTMLElement;

	// Scroll spacer
	private _scrollSpacer: HTMLElement;

	// Scroll container scrolled subscription
	private _scrollContainerScrolledSubscription: Subscription;

	// Iterable differ
	private _iterableDiffer: IterableDiffer<any>;

	// Total height
	public totalHeight: number = 0;
	public startNode: number = 0;
	public offsetY: number = 0;
	public visibleNodesCount: number = 0;

	// Data
	@Input("data")
	private _data: any[] = [];

	// List of items
	private _items: any[] = [];

	// Items getter
	public get items(): any[] {
		// Return items
		return this._items;
	}

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
		const config = Object.assign({}, tableConfigDefault, value);
		// Also make sure sort is set
		config.sort = Object.assign({}, tableSortDefault, config.sort);

		// Finally assign config
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
	@HostBinding("class.ngx-table--clickable")
	public get isClickable(): boolean { return this._config.allowRowClick; }

	// Head element ref
	@ViewChild("head", { read: ElementRef, static: true })
	public headElementRef: ElementRef<HTMLElement>;

	// Foot element ref
	@ViewChild("foot", { read: ElementRef, static: false })
	public footElementRef: ElementRef<HTMLElement>;

	// List of column definitions
	@ContentChildren(TableColumnDefinitionDirective)
	public columnDefinitions: QueryList<TableColumnDefinitionDirective>;

	// Expansion definition
	@ContentChild(TableExpansionDefinitionDirective, { read: TemplateRef })
	public expansionDefinition: TemplateRef<TableExpansionDefinitionDirective>;

	// Empty definition
	@ContentChild(TableEmptyDefinitionDirective, { read: TemplateRef })
	public emptyDefinition: TemplateRef<TableEmptyDefinitionDirective>

	// List of output column definitions
	// This is created from definitions based on columns array
	public outputColumnDefinitions: TableColumnDefinitionDirective[] = [];

	// List of headers
	public headers: TableHeaderComponent[] = [];

	/**
	 * Constructor
	 * @param ngZone 
	 * @param renderer 
	 * @param injector 
	 * @param elementRef 
	 * @param iterableDiffers 
	 * @param changeDetectorRef
	 */
	constructor(
		private readonly ngZone: NgZone,
		private readonly renderer: Renderer2,
		private readonly injector: Injector,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly iterableDiffers: IterableDiffers,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		// Init iterable differ
		this._iterableDiffer = this.iterableDiffers.find([]).create(null);
	}

	/**
	 * On init hook
	 */
	public ngOnInit(): void {
		// Process component configuration
		try {
			// Get global config
			const global = this.injector.get(CONFIG);

			// Check if current config is set
			if (!this._config) {
				// Assign global config and do nothing else
				const config = Object.assign({}, tableConfigDefault, global || {});
				// Also make sure sort is set
				config.sort = Object.assign({}, tableSortDefault, config.sort || {});

				// Assign config
				this._config = config;

				// Return
				return;
			}

			// Make sure undefined value are set from default and global config
			this._config = Object.assign({}, tableConfigDefault, global || {}, this._config || {});
		}
		catch (e) { }
	}

	/**
	 * Do check hook
	 */
	public ngDoCheck(): void {
		// Check if data changed
		if (this._iterableDiffer.diff(this._data)) {
			// Check for virtual scroll config
			if (!this._config.virtualScroll || !this._config.virtualScroll.allow) {
				// Assign data
				this._items = this._data;
			}
			else {
				// Emit scroll handler
				this.handleScrollContainerScroll(null);
			}
		}
	}

	/**
	 * On destroy hook
	 */
	public ngOnDestroy(): void {
		// Unsubscribe from subscriptions
		this._scrollContainerScrolledSubscription && this._scrollContainerScrolledSubscription.unsubscribe();
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
	 * Handle scroll container scroll
	 * @param event 
	 */
	private async handleScrollContainerScroll(event: Event): Promise<void> {
		// Make sure virtual scroll is allowed
		if (!this._config.virtualScroll || !this._config.virtualScroll.allow) {
			// Do nothing
			return;
		}

		// Get head height
		const headHeight: number = this.headElementRef ? this.headElementRef.nativeElement.clientHeight : 0;
		const footHeight: number = this.footElementRef ? this.footElementRef.nativeElement.clientHeight : 0;

		// Get scroll position and height
		const scrollPosition = this._scrollContainer.scrollTop;
		const scrollHeight = this._scrollContainer.offsetHeight;

		// Get total height needed for items (including header and footer)
		const totalHeight: number = (this._data || []).length * this._config.virtualScroll.rowHeight + headHeight + footHeight;
		// Get padding
		const nodePadding: number = this._config.virtualScroll.paddingRowsCount;
		// Get start node
		const startNode: number = Math.max(0, Math.floor(scrollPosition / this.config.virtualScroll.rowHeight) - nodePadding);

		// Get number of visible items
		const visibleNodesCount = Math.ceil(scrollHeight / this.config.virtualScroll.rowHeight) + 2 * nodePadding;

		// Get offset
		const offsetY = startNode * this.config.virtualScroll.rowHeight;

		// Changed flags
		let totalHeightChanged: boolean = false;
		let offsetChanged: boolean = false;
		let startNodeChanged: boolean = false;
		let visibleNodesCountChanged: boolean = false;

		// Check total height
		if (totalHeightChanged = this.totalHeight !== totalHeight) {
			// Set total height
			this.totalHeight = totalHeight;
		}

		// Check start node
		if (startNodeChanged = this.startNode !== startNode) {
			// Set start node
			this.startNode = startNode;
		}

		// Check visible nodes count
		if (visibleNodesCountChanged = this.visibleNodesCount !== visibleNodesCount) {
			// Assign visible nodes count
			this.visibleNodesCount = visibleNodesCount;
		}

		// Check offset
		if (offsetChanged = this.offsetY !== offsetY) {
			// Assign offset
			this.offsetY = offsetY;
		}

		// Check if total height changed
		if (totalHeightChanged) {
			// Set new spacer height
			this.renderer.setStyle(this._scrollSpacer, "height", `${totalHeight}px`);
		}

		// Check if offset changed
		if (offsetChanged) {
			// Update element offset
			this.renderer.setStyle(this.elementRef.nativeElement, "transform", `translateY(${offsetY}px)`);
		}

		// Check for sticky head
		if (this._config.virtualScroll.stickyHead) {
			// Calculate offset
			const headOffsetY = Math.max(scrollPosition - offsetY, 0);

			// Set offset to head
			this.renderer.setStyle(this.headElementRef.nativeElement, "transform", `translateY(${headOffsetY}px)`);
		}

		// Check for sticky foot
		if (this._config.virtualScroll.stickyFoot && this.footElementRef) {
			// Get number of rendered items
			const renderedCount = Math.min(visibleNodesCount, (this._data || []).length - startNode);

			// Calculate offset
			const footOffsetY = Math.min((scrollPosition + scrollHeight) - (offsetY + headHeight + footHeight + renderedCount * this._config.virtualScroll.rowHeight));

			// Set offset to foot
			this.renderer.setStyle(this.footElementRef.nativeElement, "transform", `translateY(${footOffsetY}px)`);
		}

		// Check for start node and visible nodes count changes
		if (startNodeChanged || visibleNodesCountChanged) {
			// Run code inside Angular zone
			this.ngZone.run(() => {
				// Assign items
				this._items = (this._data || []).slice(startNode, startNode + visibleNodesCount);

				// Mark changes for check
				this.changeDetectorRef.markForCheck();
			});
		}
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
