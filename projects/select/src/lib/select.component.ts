// External modules
import { Component, Input, Output, ContentChild, TemplateRef, HostBinding, HostListener, ElementRef, EventEmitter, ViewChild, forwardRef, ViewChildren, QueryList, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent, Observable, Subject } from 'rxjs';

// Interfaces
import { ISelectConfig } from "./interfaces/select.interfaces";

// Enums
import { SelectMode } from "./enums/mode.enum";

// Constants
import { KEY_CODES } from "./constants/key-codes.const";

// Directives
import { SelectOptionDirective, ISelectOptionContext } from "./directives/option.directive";
import { SelectValueDirective, ISelectValueContext } from "./directives/value.directive";
import { SelectClearDirective, ISelectClearContext } from "./directives/clear.directive";
import { SelectToggleDirective } from "./directives/toggle.directive";

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

	// Make enums available to template
	public readonly SelectMode = SelectMode;

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

		// Check mode
		if (this.mode === SelectMode.AUTOFILL && value) {
			// Assign value to input
			this.autofillInput.nativeElement.value = this.config.autofillPropertySelectorFn(value);
		}
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
		mode: SelectMode.STANDARD,
		allowClear: false,
		isSelectionAlwaysRendered: false,
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

	// Select mode
	@Input("mode")
	public set mode(value: number) {
		// Assign mode
		this.config.mode = value;
	}

	/**
	 * Mode getter
	 */
	public get mode(): number {
		return this.config.mode || SelectMode.STANDARD;
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

	// Closed flag
	@HostBinding("class.ngx-select--closed")
	public get isSelectionClosed(): boolean {
		return !this.isSelectionOpen;
	}

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

		// Check for mode
		if (this.mode === SelectMode.AUTOFILL) {
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

	// Toggle template
	@ContentChild(SelectToggleDirective, { read: TemplateRef })
	public selectToggleTemplate: TemplateRef<any>;

	// Search input
	@ViewChild('searchInput')
	public searchInputRef: ElementRef<HTMLInputElement>;

	// Autofill input
	@ViewChild("autofillInput")
	public autofillInput: ElementRef<HTMLInputElement>;

	// Options container
	@ViewChild("optionsContainer")
	public optionsContainerRef: ElementRef<HTMLElement>;

	// List of option references
	@ViewChildren(SelectOptionComponent, { read: ElementRef })
	public optionRefs: QueryList<ElementRef<HTMLElement>>;

	// Focused option index
	public focusedOptionIndex: number = 0;

	// Component focus flag
	private _hasComponentFocus: boolean = false;
	private _hasSearchInputFocus: boolean = false;
	private _hasAutofillInputFocus: boolean = false;

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
	 * On autofill input focus
	 * @param event 
	 */
	public onAutofillInputFocus(event: Event): void {
		// Set input focus
		this._hasAutofillInputFocus = true;

		// Also select input value
		(event.target as HTMLInputElement).select();

		// Emit focus change
		this.focusChangeSource.next();

		// Listen to autofill input change
		this.listenToAutofillInput();
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

		// Listen to search input
		this.listenToSearchInput();
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
	 * On toggle click
	 * @param event 
	 */
	public onToggleClick(event: Event): void {
		// Check disabled or readonly
		if (this.disabled || this.readonly) {
			// Do nothing
			return;
		}

		// Toggle selection
		this.toggleSelection();
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
	 * Open selection
	 * @param config
	 */
	private openSelection(config: any = { waitForSearch: false }) {
		// Check if selection is up
		if (this.isSelectionOpen) {
			return;
		}

		// Show selection
		this.isSelectionOpen = true;

		// Reload options if get options is set
		if (this.config.getOptions && !config.waitForSearch) {
			// Check mode
			if (this.mode === SelectMode.AUTOFILL) {
				// Reload options with input value
				this.reloadOptions(this.autofillInput.nativeElement.value);
			}
			else {
				// Reload options
				this.reloadOptions();
			}

		}

		// Initialize search input if is allowed
		if (this.config.allowSearch) {
			// Set focus
			this.setFocusOnSearchInput();
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

		// Reset
		this.reset();

		// Hide selection
		this.isSelectionOpen = false;

		// Reset focused option index
		this.focusedOptionIndex = 0;
	}

	/**
	 * Register to focus change
	 */
	private registerToFocusChange(): void {
		this.focusChange$
			// Wait 50ms to get the most recent value 
			.pipe((debounceTime(100)))
			// Subscribe to focus change
			.subscribe(() => this.handleFocusChange(this._hasSearchInputFocus || this._hasComponentFocus || this._hasAutofillInputFocus));
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

		// Check mode
		if (this.mode === SelectMode.AUTOFILL && !this.value) {
			// Reset input value if not value is set
			this.autofillInput.nativeElement.value = "";
		}

		// Close selection as the component received "blur" event
		this.closeSelection();
	}

	/**
	 * Listen to autofill input
	 */
	private async listenToAutofillInput(): Promise<void> {
		// Create observable from typing event
		const keyupSubscription = fromEvent(this.autofillInput.nativeElement, "keyup")
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
			// Debounce event
			.pipe(debounceTime(this.config.autofillInputDelay))
			.subscribe(async (event: KeyboardEvent) => {
				// Get selection start
				const selectionStart = this.autofillInput.nativeElement.selectionStart;
				// Get value
				const value = this.autofillInput.nativeElement.value;

				// Check if there is any value
				if (!value) {
					// Reset value
					this.value = null;

					// Do not do anything else
					return;
				}

				// Init found option
				let option = null;

				// Get list of options
				const options = await this.config.getOptions(value);

				// Check code again
				switch (event.key) {
					case KEY_CODES.DELETE:
					case KEY_CODES.BACKSPACE:
						// Get option that equals
						option = options.find((option) => this.config.autofillPropertySelectorFn(option) === value);
						break;

					default:
						// Get option that starts
						option = options.find((option) => this.config.autofillPropertySelectorFn(option).startsWith(value));
						break;
				}

				// Now check of option was found
				if (!option) {
					// Reset value
					this.value = null;

					// Do not do anything else
					return;
				}

				// Assign value
				this.value = option;

				// Update input selection
				const start = selectionStart;
				const end = this.config.autofillPropertySelectorFn(option).length;
				const field = this.autofillInput.nativeElement;

				// Check selection range
				if (field.setSelectionRange) {
					// Set selection range
					field.setSelectionRange(start, end);
				}
				else if (field["createTextRange"]) {
					// Create range
					const range = (field["createTextRange"] as any)();

					// Collapse
					range.collapse(true);

					// Move start and end
					range.moveStart("character", start);
					range.moveEnd("character", end);

					// Select given range
					range.select();
				}
				else if (typeof field.selectionStart !== "undefined") {
					// Set start and end
					field.selectionStart = start;
					field.selectionEnd = end;
				}
			});

		// Listen to blur event
		const blurSubscription = fromEvent(this.autofillInput.nativeElement, "blur")
			.subscribe((event: FocusEvent) => {
				// Unsubscribe
				keyupSubscription && keyupSubscription.unsubscribe();
				blurSubscription && blurSubscription.unsubscribe();

				// Set input focus
				this._hasAutofillInputFocus = false;

				// Emit focus change
				this.focusChangeSource.next();
			});
	}

	/**
	 * Listen to search input
	 */
	private async listenToSearchInput(): Promise<void> {
		// Create observable from typing event
		const keyupSubscription = fromEvent(this.searchInputRef.nativeElement, "keyup")
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
				const value = this.searchInputRef.nativeElement.value;

				// Emit
				this.searchInputChange.emit(value);

				// Check if getOptions is set
				if (!this.config.getOptions) {
					return;
				}

				// Reload options
				await this.reloadOptions(value);

				// Reset focused option
				this.focusedOptionIndex = 0;
			});

		// Listen to blur event
		const blurSubscription = fromEvent(this.searchInputRef.nativeElement, "blur")
			.subscribe((event: FocusEvent) => {
				// Unsubscribe
				keyupSubscription && keyupSubscription.unsubscribe();
				blurSubscription && blurSubscription.unsubscribe();

				// Set input focus
				this._hasSearchInputFocus = false;

				// Reset search input focus flag
				this.focusChangeSource.next();
			});
	}

	/**
	 * Set focus on search input
	 */
	private async setFocusOnSearchInput(): Promise<void> {
		// Pospone execution
		await new Promise<void>((resolve) => setTimeout(() => resolve()));

		// Set focus
		this.searchInputRef.nativeElement.focus();

		// Check mode
		if (this.mode === SelectMode.AUTOFILL) {
			// Propagate value
			this.searchInputRef.nativeElement.value = this.autofillInput.nativeElement.value;
		}
	}

	/**
	 * Set focus on autofill input
	 */
	private async setFocusOnAutofillInput(): Promise<void> {
		// Pospone execution
		await new Promise<void>((resolve) => setTimeout(() => resolve()));

		// Set focus
		this.autofillInput.nativeElement.focus();
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

		// Check for control keys
		if (event.ctrlKey || event.altKey) {
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

			// Tab/Left/Right
			case KEY_CODES.TAB:
			case KEY_CODES.ARROW_LEFT:
			case KEY_CODES.ARROW_RIGHT:
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

			// Default
			default:
				// Handle default
				this.handleDefaultKeydownClosed(event);
				break;

		}
	}

	/**
	 * Handle default keydown closed
	 * @param event 
	 */
	private handleDefaultKeydownClosed(event: KeyboardEvent): void {
		// Check search
		if (!this.config.allowSearch || (this.mode === SelectMode.AUTOFILL && this._hasAutofillInputFocus)) {
			// Do nothing
			return;
		}

		// Create character check function
		const isCharacterKeyEvent = (event: KeyboardEvent): boolean => /^.$/u.test(event.key);

		// Check if event was raised by character key
		if (!isCharacterKeyEvent(event)) {
			// Do nothing
			return;
		}

		// Check mode
		switch (this.mode) {
			// Standard mode
			case SelectMode.STANDARD:
				// Set loading flag
				this.isLoading = true;

				// Open selection
				this.openSelection({ waitForSearch: true });

				// Assign value
				setTimeout(() => this.searchInputRef.nativeElement.value = event.key);
				break;

			// Autofill mode
			case SelectMode.AUTOFILL:
				// Assign value
				this.setFocusOnAutofillInput();

				// Assign value
				this.autofillInput.nativeElement.value = event.key;
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
	 * Handle tab keydown open
	 * @param event 
	 */
	private handleTabKeydownOpen(event: KeyboardEvent): void {
		// Check whether to select option
		if (!this.isLoading && (this.options || []).length && (this.focusedOptionIndex in this.options)) {
			// Select option
			this.selectOption(this.options[this.focusedOptionIndex]);
		}
		else {
			// Close selection
			this.closeSelection();
		}
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

		// Check if option exists
		if (!(this.focusedOptionIndex in this.options)) {
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

		// Prevent event propagation
		event.stopPropagation();
		event.stopImmediatePropagation();

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

		// Prevent event propagation
		event.stopPropagation();
		event.stopImmediatePropagation();

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
		if (top >= bTop && bottom <= bBottom) {
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
