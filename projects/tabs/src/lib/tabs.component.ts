// External modules
import { Component, ContentChildren, QueryList, AfterContentInit, Input, ViewChild, HostBinding } from '@angular/core';

// Directives
import { TabDirective } from "./directives/tab/tab.directive";

// Outlets
import { TabsContentOutlet } from "./outlets/content/content.outlet";

@Component({
	selector: 'ngx-tabs',
	templateUrl: "./tabs.component.html"
})
export class TabsComponent implements AfterContentInit {

	@HostBinding("class.ngx-tabs")
	public ngxTabs: boolean = true;

	@Input("tabs")
	public set tabIdentifiers(tabs: string[]) {
		// Set tabs
		this._tabIdentifiers = tabs;

		// Rebuild
		this.rebuild();
	}

	// Tab identifiers
	private _tabIdentifiers: string[];

	// Active index
	@Input("index")
	public set activeIndex(index: number) {
		// Check if index changed
		if (this._activeIndex === index) {
			// There is nothing to be done
			return;
		}

		// Set active index
		this._activeIndex = index;

		// Rebuild
		this.rebuild();
	}

	/**
	 * Active index getter
	 */
	public get activeIndex(): number {
		return this._activeIndex;
	}

	// Active index
	private _activeIndex: number = 0;

	// Content outlet
	@ViewChild(TabsContentOutlet, { static: true })
	public contentOutlet: TabsContentOutlet;

	// List of tab definitions
	@ContentChildren(TabDirective)
	public tabDefinitions: QueryList<TabDirective>;

	// List of tabs
	public tabs: TabDirective[] = [];

	/**
	 * After content init hook
	 */
	public ngAfterContentInit() {
		//Rebuild
		this.rebuild();
	}

	/**
	 * On tab click
	 * @param event 
	 * @param tab 
	 * @param index 
	 */
	public onTabClick(event: Event, tab: TabDirective, index: number) {
		// Prevent event propagation
		event.stopPropagation();

		// Check if selected index is the same 
		if (this._activeIndex === index) {
			// Do nothing
			return;
		}

		// Set active index
		this._activeIndex = index;

		// Get content view ref
		let cVRef = this.contentOutlet.viewContainerRef;

		// Clear
		cVRef.clear();

		// Create view
		cVRef.createEmbeddedView(tab.content);
	}

	/**
	 * Rebuild tabs
	 */
	private rebuild() {
		// Check if tabs are defined
		if (!this.tabDefinitions) {
			return;
		}

		// Reset tabs
		this.tabs = [];

		// Check if tab identifiers are set
		if (this._tabIdentifiers) {
			// Add tab definitions based on identifiers
			this._tabIdentifiers.forEach((identifier) => {
				// Add tab to list
				this.tabs.push(this.tabDefinitions.find(td => td.name === identifier));
			});
		}
		else {
			// Assign tab definitions
			this.tabs = this.tabDefinitions.toArray();
		}

		// Get content view ref
		let cVRef = this.contentOutlet.viewContainerRef;

		// Create view
		cVRef.clear();

		// Check length of tabs
		if (!this.tabs.length) {
			return;
		}

		// Create view
		cVRef.createEmbeddedView(this.tabs[this._activeIndex].content);
	}
}
