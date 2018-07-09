// External modules
import { Component, Input, HostBinding, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ngx-input',
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true
		}
	]
})
export class InputComponent implements ControlValueAccessor {

	// Value
	@Input("value")
	private _value: any;

	// Value getter
	get value() {
		return this._value;
	}

	// Value setter
	set value(value) {
		// Assign value
		this._value = value;

		// Also propagate change
		this.propagateChange(this._value);
	}

	// Type
	@Input("type")
	public type: string = "text";

	// Placeholder
	@Input("placeholder")
	public placeholder: string = "";

	// Disabled
	@Input("disabled")
	@HostBinding("class.disabled")
	public isDisabled: boolean = false;

	// Readonly
	@Input("readonly")
	@HostBinding("class.readonly")
	public isReadonly: boolean = false;

	// Autocomplete
	@Input("autocomplete")
	public autocomplete: "on" | "off" = "off";

	// Step
	@Input("step")
	public step: number;

	/**
	 * Write value
	 * @param value 
	 */
	public writeValue(value: any) {
		if (value !== undefined) {
			this.value = value;
		}
	}

	/**
	 * Propagate change
	 */
	public propagateChange = (_: any) => { };

	/**
	 * Register on change
	 * @param fn 
	 */
	public registerOnChange(fn) {
		this.propagateChange = fn;
	}

	/**
	 * Register on touched
	 */
	public registerOnTouched() { }

	/**
	 * On input handler
	 * @param event 
	 */
	public onInput(event: Event) {
		// Check for type
		if (this.type === "number") {
			return this.value = Number((event.target as any).value);
		}

		// Assign row value
		this.value = (event.target as any).value;
	}
}
