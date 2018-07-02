// External modules
import { Component, Input, Output, ContentChild, TemplateRef, HostBinding, HostListener, ElementRef, EventEmitter, ViewChild, Renderer, forwardRef, AfterContentInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

// Interfaces
import { ISelectConfig } from "./interfaces/select.interfaces";

// Directives
import { SelectOptionDirective, ISelectOptionContext } from "./directives/option.directive";
import { SelectValueDirective, ISelectValueContext } from "./directives/value.directive";

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
		// Assign value
		this._value = value;

		// Propagate change
		this.propagateChange(this._value);
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
		searchInputDelay: 300
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

	// Search input delay
	@Input("searchInputDelay")
	public set searchInputDelay(value: number) {
		// Assign search input delay
		this.config.searchInputDelay = value;
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
	public isSelectionOpen: boolean = false;

	/**
	 * On select click
	 * @param event 
	 */
	@HostListener("click", ["$event"])
	public onSelectClick(event: Event) {
		// Stop event propagation
		event.stopPropagation();

		// Check disabled or readonly
		if (this.disabled || this.readonly) {
			// Do nothing
			return;
		}

		// Open selection
		this.openSelection();
	}

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

	// Search input
	@ViewChild('searchInput')
	public searchInput: ElementRef;

	/**
	 * Select constructor
	 * @param element 
	 * @param renderer
	 */
	constructor(
		private element: ElementRef,
		private renderer: Renderer
	) { }

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
	 * On clear click
	 * @param event 
	 */
	public onClearClick(event: Event) {
		// Stop event propagation
		event.stopPropagation();

		// Close
		this.closeSelection();

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

		// Assign value
		this.value = option;

		// Close selection
		this.closeSelection();
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
		setTimeout(() => this.renderer.invokeElementMethod(this.searchInput.nativeElement, "focus"));
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
