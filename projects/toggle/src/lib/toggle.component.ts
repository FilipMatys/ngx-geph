// External modules
import { Component, ContentChild, forwardRef, HostBinding, HostListener, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

// Constants
import { KEY_CODES } from "./constants/key-codes.const";

// Directives
import { ToggleActiveDirective } from "./directives/active.directive";
import { ToggleInactiveDirective } from "./directives/inactive.directive";

@Component({
	selector: "ngx-toggle",
	templateUrl: "./toggle.component.html",
	styleUrls: ["./toggle.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ToggleComponent),
			multi: true
		}
	]
})
export class ToggleComponent implements ControlValueAccessor {

	@HostBinding("class.ngx-toggle")
	public isNgxToggle: boolean = true;

	@HostBinding("class.ngx-toggle--active")
	public get isActive(): boolean {
		return this._value;
	}

	@HostBinding("class.ngx-toggle--inactive")
	public get isInactive(): boolean {
		return !this._value;
	}

	@Input("tabIndex")
	@HostBinding("attr.tabIndex")
	public tabIndex?: number = 0;

	// Readonly flag
	@Input("readonly")
	@HostBinding("class.ngx-toggle--readonly")
	public isReadonly: boolean = false;

	// Disabled flag
	@Input("disabled")
	@HostBinding("class.ngx-toggle--disabled")
	public isDisabled: boolean = false;

	// Active template
	@ContentChild(ToggleActiveDirective, { read: TemplateRef })
	public toggleActiveTemplate: TemplateRef<any>;

	// Inactive template
	@ContentChild(ToggleInactiveDirective, { read: TemplateRef })
	public toggleInactiveTemplate: TemplateRef<any>;

	@Input("value")
	private _value: boolean = false;

	// Value getter
	public get value(): boolean { return this._value }

	// Value setter
	public set value(value: boolean) {
		// Assign value
		this._value = value;

		// Propagate change
		this.propagateChange(this._value);
	}

	/**
	 * On click
	 * @param even 
	 */
	@HostListener("click", ["$event"])
	public onClick(event: Event): void {
		// Check disabled or readonly
		if (this.isDisabled || this.isReadonly) {
			// Do nothing
			return;
		}

		// Close value
		this.toggleValue();
	}

	@HostListener("keydown", ["$event"])
	public onKeydown(event: KeyboardEvent): void {
		// Check disabled or readonly
		if (this.isDisabled || this.isReadonly) {
			// Do nothing
			return;
		}

		// Handle key down
		this.handleKeydown(event);
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
	 * Toggle value
	 */
	private async toggleValue(): Promise<void> {
		// Toggle value
		this.value = !this._value;
	}

	/**
	 * Handle keydown
	 * @param event 
	 */
	private async handleKeydown(event: KeyboardEvent): Promise<void> {
		// Check control keys
		if (event.ctrlKey || event.altKey || event.shiftKey) {
			// Do nothing
			return;
		}

		// Get key
		const key = event.key;

		// Check key value
		switch (key) {
			// Enter
			case KEY_CODES.ENTER:
				// Handle Enter
				this.handleEnterKeydown(event);
				break;

			// Digits
			case KEY_CODES.DIGIT_0:
			case KEY_CODES.DIGIT_1:
				// Handle digit
				this.handleDigitKeydown(event);
				break;
		}
	}

	/**
	 * Handle enter keydown
	 * @param event 
	 */
	private async handleEnterKeydown(event: KeyboardEvent): Promise<void> {
		// Prevent default
		event.preventDefault();

		// Toggle value
		this.toggleValue();
	}

	/**
	 * Handle digit keydown
	 * @param event 
	 */
	private async handleDigitKeydown(event: KeyboardEvent): Promise<void> {
		// Prevent default
		event.preventDefault();

		// Set value
		this.value = !!Number(event.key);
	}
}
