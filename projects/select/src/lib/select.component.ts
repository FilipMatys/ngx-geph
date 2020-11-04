// External modules
import { Component, Input, Output, ContentChild, TemplateRef, HostBinding, HostListener, ElementRef, EventEmitter, ViewChild, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

// Interfaces
import { ISelectConfig } from "./interfaces/select.interfaces";

// Directives
import { SelectOptionDirective, ISelectOptionContext } from "./directives/option.directive";
import { SelectValueDirective, ISelectValueContext } from "./directives/value.directive";
import { SelectClearDirective, ISelectClearContext } from "./directives/clear.directive";

@Component({
	selector: "ngx-select",
	templateUrl: "./select.component.html",
	styleUrls: ["./select.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SelectComponent),
			multi: true
		}
	],
})
export class SelectComponent {

	@Input("value")
	private _value: any;

	// Value getter
	public get value() { return this._value };

	// Value setter
	public set value(value: any) {
		// Propagate change
		let propagateChange: boolean = true;

		// Value changed fn
		let isValueChangedFn = this.config.isValueChangedFn || ((prev, next) => true);

		// Check for single
		if (!this.config.multi) {
			// Check whether values are different
			propagateChange = isValueChangedFn(this._value, value);
		}
		// Compare multi
		else {
			// Make sure both are set
			if (!this._value || !value) {
				propagateChange = true;
			}
			else {
				// Propagate change if lengths are different
				propagateChange = this._value.length !== value.length;
			}
		}

		// Assign value
		this._value = value;

		// Propagate change
		propagateChange && this.propagateChange(this._value);
	}

	// List of options
	@Input("options")
	public options: any[] = [];

	// Placeholder
	@Input("placeholder")
	public placeholder: string = "";

	// Configuration
	@Input("config")
	public config: ISelectConfig<any> = {
		allowSearch: false,
		allowClear: false,
		searchPlaceholder: "",
		searchInputDelay: 300,
		isValueChangedFn: (prev, next) => true
	}

	// Allow search flag
	@Input("allowSearch")
	public set allowSearch(value: boolean) {
		// Set allow search
		this.config.allowSearch = value;
	}

	// Allow clear
	@Input("allowClear")
	public set allowClear(value: boolean) {
		// Set allow clear
		this.config.allowClear = value;
	}

	// Allow multi select
	@Input("multi")
	public set multi(value: boolean) {
		// Assign multi flag
		this.config.multi = value;
	}

	// Search input delay
	@Input("searchInputDelay")
	public set searchInputDelay(value: number) {
		// Assign search input delay
		this.config.searchInputDelay = value;
	}

	// Search placeholder
	@Input("searchPlaceholder")
	public set searchPlaceholder(value: string) {
		// Assign search placeholder
		this.config.searchPlaceholder = value;
	}

	// Readonly flag
	@Input("readonly")
	@HostBinding("class.readonly")
	public readonly: boolean = false;

	// Disabled flag
	@Input("disabled")
	@HostBinding("class.disabled")
	public disabled: boolean = false;

	// Is loading flag
	@Input("isLoading")
	public isLoading: boolean = false;

	// Get options error event
	@Output('getOptionsError')
	public getOptionsError: EventEmitter<any> = new EventEmitter<any>();

	// Search input change
	@Output('searchInputChange')
	public searchInputChange: EventEmitter<string> = new EventEmitter<string>();

	// Is selection open flag
	@HostBinding("class.open")
	public isSelectionOpen: boolean = false;

	/**
	 * On document click
	 * @param event 
	 */
	@HostListener('document:click', ['$event'])
	public onDocumentClick(event: Event) {
		// Check if target is within component
		if (!this.element || this.element.nativeElement.contains(event.target)) {
			return;
		}

		// Close selection
		this.closeSelection();
	}

	// Option template
	@ContentChild(SelectOptionDirective, { read: TemplateRef })
	public selectOptionTemplate: TemplateRef<ISelectOptionContext<any>>;

	// Value template
	@ContentChild(SelectValueDirective, { read: TemplateRef })
	public selectValueTemplate: TemplateRef<ISelectValueContext<any>>;

	// Clear template
	@ContentChild(SelectClearDirective, { read: TemplateRef })
	public selectClearTemplate: TemplateRef<ISelectClearContext<any>>;

	// Search input
	@ViewChild('searchInput')
	public searchInput: ElementRef;

	/**
	 * Select constructor
	 * @param element 
	 */
	constructor(private element: ElementRef) { }

	/**
	 * Write value
	 * @param value 
	 */
	public writeValue(value: any) {
		// Check if value is defined
		if (value === undefined) {
			return;
		}

		// Assign value
		this.value = value;
	}

	/** Propagate change */
	public propagateChange = (_: any) => { };

	/**
	 * Register on change
	 * @param fn 
	 */
	public registerOnChange(fn) {
		this.propagateChange = fn;
	}

	/** Register on touched */
	public registerOnTouched() { }

	/**
	 * On select click
	 * @param event 
	 */
	public onSelectClick(event: Event) {
		// Prevent event propagation
		event.stopPropagation();

		// Dispatch click event on the component as we want to support multiple 
		// selects within page and clicking on a select has to bubble out 
		this.element.nativeElement.dispatchEvent(new Event("click", { bubbles: true }));

		// Check disabled or readonly
		if (this.disabled || this.readonly) {
			// Do nothing
			return;
		}

		// Toggle selection
		this.toggleSelection();
	}

	/**
	 * On clear click
	 * @param event 
	 * @param index
	 */
	public onClearClick(event: Event, index?: number): void {
		// Stop event propagation
		event.stopPropagation();

		// Close
		this.closeSelection();

		// Check for multi
		if (this.config.multi && index !== undefined) {
			// Remove item from select
			(this.value as Array<any>).splice(index, 1);

			// Propagate change
			this.propagateChange(this.value);

			// Do nothing else
			return;
		}

		// Clear value
		this.value = null;
	}

	/**
	 * On option click
	 * @param event 
	 * @param option 
	 */
	public onOptionClick(event: Event, option: any) {
		// Stop event propagation
		event.stopPropagation();

		// Check for multi
		if (this.config.multi) {
			// Check if value is set
			if (!this.value) {
				// Init value with selected option
				this.value = [option];
			}
			else {
				// Add option to values
				(this.value as Array<any>).push(option);

				// Propagate change
				this.propagateChange(this.value);
			}
		}
		else {
			// Assign value
			this.value = option;
		}

		// Close selection
		this.closeSelection();
	}

	/**
	 * Toggle selection
	 */
	private toggleSelection(): void {
		// Toggle selection based on state
		this.isSelectionOpen ? this.closeSelection() : this.openSelection();
	}

	/** 
	 * Open selection 
	 */
	private openSelection() {
		// Check if selection is up
		if (this.isSelectionOpen) {
			return;
		}

		// Show selection
		this.isSelectionOpen = true;

		// Reload options if get options is set
		if (this.config.getOptions) {
			this.reloadOptions();
		}

		// Initialize search input if is allowed
		if (this.config.allowSearch) {
			// Set focus
			this.setFocusOnSearchInput();
			// Listen to changes
			this.listenToSearchInput();
		}
	}

	/** 
	 * Close selection 
	 */
	private closeSelection() {
		// Do not close when is not open
		if (!this.isSelectionOpen) {
			return;
		}

		// Reset
		this.reset();

		// Hide selection
		this.isSelectionOpen = false;
	}

	/**
	 * Listen to search input
	 */
	private listenToSearchInput() {
		// Set timeout to make sure search input is attached
		setTimeout(() => {
			// Create observable from typing event
			fromEvent(this.searchInput.nativeElement, "keyup")
				.pipe(debounceTime(this.config.searchInputDelay), distinctUntilChanged())
				.subscribe((event: any) => {
					// Get value
					let value = event.target.value;

					// Emit
					this.searchInputChange.emit(value);

					// Check if getOptions is set
					if (!this.config.getOptions) {
						return;
					}

					// Reload options
					this.reloadOptions(value);
				});
		});
	}

	/**
	 * Set focus on search input
	 */
	private setFocusOnSearchInput() {
		setTimeout(() => this.searchInput.nativeElement.focus());
	}

	/**
	 * Reset
	 */
	private reset() {
		// Reset options if get options is set
		if (this.config.getOptions) {
			this.options = [];
		}

		// Reset input if is allowed
		if (this.config.allowSearch) {
			this.searchInput.nativeElement.value = "";
		}
	}

	/**
	 * Reload options
	 * @param term 
	 */
	private reloadOptions(term?: string) {
		// Set loading
		this.isLoading = true;

		// Reset list of options
		this.options = [];

		// Get options
		this.config.getOptions(term)
			.then((options) => {
				// Assign options
				this.options = options;

				// Set loading
				this.isLoading = false;
			})
			.catch((err) => {
				// Emit error
				this.getOptionsError.emit(err);

				// Set is loading
				this.isLoading = false;
			});
	}
}
