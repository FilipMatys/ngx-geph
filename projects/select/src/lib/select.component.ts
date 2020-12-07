// External modules
import { Component, Input, Output, ContentChild, TemplateRef, HostBinding, HostListener, ElementRef, EventEmitter, ViewChild, forwardRef, ViewChildren, QueryList, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, Observable, Subject } from 'rxjs';

// Interfaces
import { ISelectConfig } from "./interfaces/select.interfaces";

// Constants
import { KEY_CODES } from "./constants/key-codes.const";

// Directives
import { SelectOptionDirective, ISelectOptionContext } from "./directives/option.directive";
import { SelectValueDirective, ISelectValueContext } from "./directives/value.directive";
import { SelectClearDirective, ISelectClearContext } from "./directives/clear.directive";

// Components
import { SelectOptionComponent } from "./components/option/option.component";

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
export class SelectComponent implements ControlValueAccessor, OnInit {

	// Bind select class
	@HostBinding("class.ngx-select")
	public selectClass: boolean = true;

	@Input("tabIndex")
	@HostBinding("attr.tabIndex")
	public tabIndex?: number = 0;

	@Input("value")
	private _value: any;

	// Focus change source
	private readonly focusChangeSource: Subject<void> = new Subject<void>();
	private readonly focusChange$: Observable<void> = this.focusChangeSource.asObservable();

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
	@HostBinding("class.ngx-select--readonly")
	public readonly: boolean = false;

	// Disabled flag
	@Input("disabled")
	@HostBinding("class.ngx-select--disabled")
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
	@HostBinding("class.ngx-select--open")
	public isSelectionOpen: boolean = false;

	// Focused flag
	@HostBinding("class.ngx-select--focused")
	public isFocused: boolean = false;

	/**
	 * On click
	 * @param even 
	 */
	@HostListener("click", ["$event"])
	public onClick(event: Event): void {
		// Check disabled or readonly
		if (this.disabled || this.readonly) {
			// Do nothing
			return;
		}

		// Close selection
		this.toggleSelection();
	}

	/**
	 * On focus
	 * @param event 
	 */
	@HostListener("focus", ["$event"])
	public onFocus(event: Event): void {
		// Check disabled or readonly
		if (this.disabled || this.readonly) {
			// Do nothing
			return;
		}

		// Set component focus flag
		this._hasComponentFocus = true;

		// Set that component is focused
		this.focusChangeSource.next();

		// Open selection
		this.openSelection();
	}

	/**
	 * On blur
	 * @param event 
	 */
	@HostListener("blur", ["$event"])
	public onBlur(event: Event): void {
		// Reset component focus flag
		this._hasComponentFocus = false;

		// Reset focus flag
		this.focusChangeSource.next();
	}

	/**
	 * On keydown
	 * @param event 
	 */
	@HostListener("keydown", ["$event"])
	public onKeydown(event: KeyboardEvent): void {
		// Handle keydown
		this.handleKeydown(event);
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
	public searchInputRef: ElementRef;

	// Options container
	@ViewChild("optionsContainer")
	public optionsContainerRef: ElementRef<HTMLElement>;

	// List of option references
	@ViewChildren(SelectOptionComponent, { read: ElementRef })
	public optionRefs: QueryList<ElementRef<HTMLElement>>;

	// Focused option index
	public focusedOptionIndex: number = undefined;

	// Safety timeout
	private safetyActivationTimeout: any;

	// Component focus flag
	private _hasComponentFocus: boolean = false;
	private _hasSearchInputFocus: boolean = false;

	/**
	 * Select constructor
	 * @param element 
	 */
	constructor(private element: ElementRef) { }

	/**
	 * On init hook
	 */
	public ngOnInit(): void {
		// Register to focus change
		this.registerToFocusChange();
	}

	/**
	 * Write value
	 * @param value 
	 */
	public writeValue(value: any) {
		// Assign value
		this._value = value;
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

		// Select option
		this.selectOption(option);
	}

	/**
	 * On search input focus
	 * @param event 
	 */
	public onSearchInputFocus(event: Event): void {
		// Set input focus
		this._hasSearchInputFocus = true;

		// Set search input focus flag
		this.focusChangeSource.next();
	}

	/**
	 * On search input blur
	 * @param event 
	 */
	public onSearchInputBlur(event: Event): void {
		// Set input focus
		this._hasSearchInputFocus = false;

		// Reset search input focus flag
		this.focusChangeSource.next();
	}

	/**
	 * On search input click
	 * @param event 
	 */
	public onSearchInputClick(event: Event): void {
		// Prevent event propagation
		event.stopPropagation();
	}

	/**
	 * Toggle selection
	 */
	private toggleSelection(): void {
		// Toggle selection based on state
		this.isSelectionOpen ? this.closeSelection() : this.openSelection();
	}

	/**
	 * Select option
	 * @param option 
	 */
	private selectOption(option: any): void {
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
	 * Check safety activation time out
	 */
	private checkSafetyActivationTimeout(): boolean {
		// Check if time out is set
		if (this.safetyActivationTimeout) {
			// Time out is on
			return true;
		}

		// Otherwise set timeout
		this.safetyActivationTimeout = setTimeout(() => {
			// Clear timeout
			clearTimeout(this.safetyActivationTimeout);

			// Reset variable
			this.safetyActivationTimeout = undefined;
		}, 100);

		// Safety was not active
		return false;
	}

	/** 
	 * Open selection 
	 */
	private openSelection() {
		// Check if selection is up
		if (this.isSelectionOpen) {
			return;
		}

		// Check safety
		if (this.checkSafetyActivationTimeout()) {
			// Do nothing when safety is on
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
	private closeSelection(): void {
		// Do not close when is not open
		if (!this.isSelectionOpen) {
			return;
		}

		// Check safety
		if (this.checkSafetyActivationTimeout()) {
			// Do nothing when safety is on
			return;
		}

		// Reset
		this.reset();

		// Hide selection
		this.isSelectionOpen = false;

		// Reset focused option index
		this.focusedOptionIndex = undefined;
	}

	/**
	 * Register to focus change
	 */
	private registerToFocusChange(): void {
		this.focusChange$
			// Wait 50ms to get the most recent value 
			.pipe((debounceTime(100)))
			// Subscribe to focus change
			.subscribe(() => this.handleFocusChange(this._hasSearchInputFocus || this._hasComponentFocus));
	}

	/**
	 * Handle focus change
	 * @param value 
	 */
	private async handleFocusChange(value: boolean): Promise<void> {
		// Assign focused value
		this.isFocused = value;

		// Check if component is now focused
		if (this.isFocused) {
			// Do nothing
			return;
		}

		// Close selection as the component received "blur" event
		this.closeSelection();
	}

	/**
	 * Listen to search input
	 */
	private listenToSearchInput() {
		// Set timeout to make sure search input is attached
		setTimeout(() => {
			// Create observable from typing event
			fromEvent(this.searchInputRef.nativeElement, "keyup")
				.pipe(filter((event: KeyboardEvent) => {
					// Check key value
					if (event.shiftKey || event.ctrlKey || event.altKey) {
						// Ignore control keys
						return false;
					}

					// Get key
					const key = event.key;

					// Check key
					switch (key) {
						// Component control keys
						case KEY_CODES.TAB:
						case KEY_CODES.ARROW_DOWN:
						case KEY_CODES.ARROW_UP:
						case KEY_CODES.ARROW_LEFT:
						case KEY_CODES.ARROW_RIGHT:
						case KEY_CODES.ENTER:
							return false;
					}

					// Pass the key
					return true;
				}))
				.pipe(debounceTime(this.config.searchInputDelay), distinctUntilChanged())
				.subscribe(async (event: KeyboardEvent) => {
					// Get value
					const value = (event.target as any).value;

					// Emit
					this.searchInputChange.emit(value);

					// Check if getOptions is set
					if (!this.config.getOptions) {
						return;
					}

					// Reload options
					await this.reloadOptions(value);

					// Check if there is focused option
					if (typeof this.focusedOptionIndex !== "undefined") {
						// Set proper focused option index
						this.focusedOptionIndex = (this.options || []).length ? 0 : undefined;
					}
				});
		});
	}

	/**
	 * Set focus on search input
	 */
	private setFocusOnSearchInput() {
		setTimeout(() => this.searchInputRef.nativeElement.focus());
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
			this.searchInputRef.nativeElement.value = "";
		}
	}

	/**
	 * Reload options
	 * @param term 
	 */
	private async reloadOptions(term?: string): Promise<void> {
		// Set loading
		this.isLoading = true;

		// Reset list of options
		this.options = [];

		try {
			// Get and set options
			this.options = await this.config.getOptions(term);
		}
		catch (err) {
			// Emit error
			this.getOptionsError.emit(err);
		}
		finally {
			// Set is loading
			this.isLoading = false;
		}
	}

	/**
	 * Handle key down
	 * @param event 
	 */
	private handleKeydown(event: KeyboardEvent): void {
		// Check readonly or disabled
		if (this.readonly || this.disabled) {
			// Do nothing
			return;
		}

		// Check if select is open
		this.isSelectionOpen ? this.handleKeydownOpen(event) : this.handleKeydownClosed(event);
	}

	/**
	 * Handle key down open
	 * @param event 
	 */
	private handleKeydownOpen(event: KeyboardEvent): void {
		// Get key
		const key = event.key;

		// Check key
		switch (key) {
			// Escape
			case KEY_CODES.ESCAPE:
				// Handle escape
				this.handleEscapeKeydownOpen(event);
				break;

			// Enter
			case KEY_CODES.ENTER:
				// Handle enter
				this.handleEnterKeydownOpen(event);
				break;

			// Arrow down
			case KEY_CODES.ARROW_DOWN:
				// Handle arrow down
				this.handleArrowDownKeydownOpen(event);
				break;

			// Arrow up
			case KEY_CODES.ARROW_UP:
				// Handle arrow up
				this.handleArrowUpKeydownOpen(event);
				break;

			// Tab
			case KEY_CODES.TAB:
				// Handle tab key
				this.handleTabKeydownOpen(event);
				break;
		}
	}

	/**
	 * Handle key down closed
	 * @param event 
	 */
	private handleKeydownClosed(event: KeyboardEvent): void {
		// Get key
		const key = event.key;

		// Check key
		switch (key) {
			// Enter
			case KEY_CODES.ENTER:
				// Handle enter
				this.handleEnterKeydownClosed(event);
				break;

			// Arrow down
			case KEY_CODES.ARROW_DOWN:
				// Handle arrow down
				this.handleArrowDownKeydownClosed(event);
				break;
		}
	}
	/**
	 * Handle enter keydown closed
	 * @param event 
	 */
	private handleEnterKeydownClosed(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Open selection
		this.openSelection();
	}

	/**
	 * Handle arrow down keydown closed
	 * @param event 
	 */
	private handleArrowDownKeydownClosed(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Open selection
		this.openSelection();

		// Set focused option index
		this.focusedOptionIndex = 0;
	}

	/**
	 * Handle tab keydown open
	 * @param event 
	 */
	private handleTabKeydownOpen(event: KeyboardEvent): void {
		// Close selection
		this.closeSelection();
	}

	/**
	 * Handle keydown open
	 * @param event 
	 */
	private handleEscapeKeydownOpen(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Close selection
		this.closeSelection();

		// Set focus on this component
		setTimeout(() => this.element.nativeElement.focus());
	}

	/**
	 * Handle enter keydown open
	 * @param even 
	 */
	private handleEnterKeydownOpen(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Check if is loading
		if (this.isLoading) {
			// Do nothing
			return;
		}

		// Check options length
		if (!(this.options || []).length) {
			// Do nothing
			return;
		}

		// Check if focused is defined
		if (typeof this.focusedOptionIndex === "undefined") {
			// Do nothing
			return;
		}

		// Select option
		this.selectOption(this.options[this.focusedOptionIndex]);

		// Set focus on this component
		setTimeout(() => this.element.nativeElement.focus());
	}

	/**
	 * Handle arrow down keydown open
	 * @param event 
	 */
	private handleArrowDownKeydownOpen(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Check if is loading
		if (this.isLoading) {
			// Do nothing
			return;
		}

		// Check options length
		if (!(this.options || []).length) {
			// Do nothing
			return;
		}

		// Increase focused option index
		this.increaseFocusedOptionIndex();
	}

	/**
	 * Handle arrow up keydown open
	 * @param event 
	 */
	private handleArrowUpKeydownOpen(event: KeyboardEvent): void {
		// Prevent default
		event.preventDefault();

		// Check if is loading
		if (this.isLoading) {
			// Do nothing
			return;
		}

		// Check options length
		if (!(this.options || []).length) {
			// Do nothing
			return;
		}

		// Decrease focused option index
		this.decreaseFocusedOptionIndex();
	}

	/**
	 * Increase focused option index
	 */
	private increaseFocusedOptionIndex(): void {
		// Check if index is defined
		if (typeof this.focusedOptionIndex === "undefined") {
			// Define value
			this.focusedOptionIndex = 0;

			// Do nothing else
			return;
		}

		// Get increased value
		const value = this.focusedOptionIndex + 1;

		// Assign normalized value
		this.focusedOptionIndex = value % (this.options || []).length;

		// Scroll container to focused option
		this.scrollContainerToFocusedOption();
	}

	/**
	 * Decrease focused option index
	 */
	private decreaseFocusedOptionIndex(): void {
		// Check if index is defined
		if (typeof this.focusedOptionIndex === "undefined") {
			// Define value
			this.focusedOptionIndex = 0;

			// Do nothing else
			return;
		}

		// Check for zero
		if (this.focusedOptionIndex === 0) {
			// Assign index if the last option
			this.focusedOptionIndex = this.options.length - 1;
		}
		else {
			// Get increased value
			const value = this.focusedOptionIndex - 1;

			// Assign normalized value
			this.focusedOptionIndex = value % (this.options || []).length;
		}

		// Scroll container to focused option
		this.scrollContainerToFocusedOption();
	}

	/**
	 * Scroll to container to focused option
	 */
	private scrollContainerToFocusedOption(): void {
		// Check if container is set
		if (!this.optionsContainerRef) {
			// Do nothing
			return;
		}

		// Get scroll view height
		const scrollViewHeight = this.optionsContainerRef.nativeElement.clientHeight;

		// Get scroll top
		const scrollTop = this.optionsContainerRef.nativeElement.scrollTop;

		// Now get boundaries of the container based on scroll top value
		const [bTop, bBottom] = [scrollTop, scrollTop + scrollViewHeight];

		// Now we need to get position of the focused option to check whether its within boundaries 
		// of the scroll container
		const optionRef = this.optionRefs.find((_, idx) => idx === this.focusedOptionIndex);

		// Check if option ref was found
		if (!optionRef) {
			// Do nothing
			return;
		}

		// Get top and bottom position
		const top = optionRef.nativeElement.offsetTop;
		const bottom = optionRef.nativeElement.offsetHeight + top;

		// Now it is time to check whether the option is within the boundaries
		if (top >= bTop && bottom <= bTop) {
			// Nothing to do
			return;
		}

		// Now check if item is above the boundaries
		if (top < bTop) {
			// We need to move to the top of the item
			this.optionsContainerRef.nativeElement.scrollTo(0, top);

			// Do nothing else
			return;
		}

		// Check if item is below the boundaries
		if (bottom > bBottom) {
			// We need to move the view to the bottom
			this.optionsContainerRef.nativeElement.scrollTo(0, bottom - scrollViewHeight);

			// Do nothing else
			return;
		}
	}
}
