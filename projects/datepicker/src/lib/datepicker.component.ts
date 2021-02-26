// External modules
import { Component, ContentChild, forwardRef, HostBinding, HostListener, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import Moment from "moment";

// Enums
import { DatepickerView } from "./enums/view.enum";

// Interfaces
import { IDatepickerConfig } from "./interfaces/config";

// Directives
import { DatepickerNextDirective } from "./directives/next.directive";
import { DatepickerPreviousDirective } from "./directives/previous.directive";
import { DatepickerValueDirective } from "./directives/value.directive";
import { DatepickerConfirmDirective } from "./directives/confirm.directive";
import { DatepickerCancelDirective } from "./directives/cancel.directive";

@Component({
	selector: "ngx-datepicker",
	templateUrl: "./datepicker.component.html",
	styleUrls: ["./datepicker.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DatepickerComponent),
			multi: true
		}
	]
})
export class DatepickerComponent implements ControlValueAccessor {

	@Input("value")
	private _value: Date;

	@Input("config")
	public config: IDatepickerConfig;

	// Public value getter
	public get value(): Date { return this._value };

	// Value setter
	public set value(date: Date) {
		// Assign value
		this._value = date;

		// Propagate change
		this.propagateChange(this._value);
	}

	// Make enums available to template
	public DatepickerView = DatepickerView;

	// Selected date
	public selected: Date;

	@HostBinding("class.ngx-datepicker")
	public readonly hasDefaultClass: boolean = true;

	// Readonly flag
	@Input("readonly")
	@HostBinding("class.ngx-datepicker--readonly")
	public isReadonly: boolean = false;

	// Disabled flag
	@Input("disabled")
	@HostBinding("class.ngx-datepicker--disabled")
	public isDisabled: boolean = false;

	// Is open flag
	@HostBinding("class.ngx-datepicker--open")
	public isOpen: boolean = false;

	// Is closed flag
	@HostBinding("class.ngx-datepicker--closed")
	public get isClosed(): boolean { return !this.isOpen; }

	// Tab index
	@Input("tabIndex")
	@HostBinding("attr.tabIndex")
	public tabIndex: number = 0;

	@HostListener("blur", ["$event"])
	public onBlur(event: Event): void {
		// Close
		this.close();
	}

	// Placeholder
	@Input("placeholder")
	public placeholder: string = "";

	// Active view
	public activeView: number = DatepickerView.DAYS;

	// Value template reference
	@ContentChild(DatepickerValueDirective, { read: TemplateRef })
	public valueTemplateRef: TemplateRef<HTMLElement>;

	// Next template reference
	@ContentChild(DatepickerNextDirective, { read: TemplateRef })
	public nextTemplateRef: TemplateRef<HTMLElement>;

	// Previous template reference
	@ContentChild(DatepickerPreviousDirective, { read: TemplateRef })
	public previousTemplateRef: TemplateRef<HTMLElement>;

	// Confirm template ref
	@ContentChild(DatepickerConfirmDirective, { read: TemplateRef })
	public confirmTemplateRef: TemplateRef<HTMLElement>;

	// Cancel template ref
	@ContentChild(DatepickerCancelDirective, { read: TemplateRef })
	public cancelTemplateRef: TemplateRef<HTMLElement>;

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
	 * On confirm click
	 * @param event 
	 */
	public onConfirmClick(event: Event): void {
		// Prevent event propagation
		event.stopPropagation();

		// Confirm
		this.confirm();
	}

	/**
	 * On cancel click
	 * @param event 
	 */
	public onCancelClick(event: Event): void {
		// Prevent event propagation
		event.stopPropagation();

		// Close
		this.close();
	}

	/**
	 * On input click
	 * @param event 
	 */
	public onInputClick(event: Event): void {
		// Toggle
		this.toggle();
	}

	/**
	 * On day select
	 * @param day 
	 */
	public onDaySelect(day: Date): void {
		// Select day
		this.selectDay(day);
	}

	/**
	 * On month select
	 * @param month 
	 */
	public onMonthSelect(month: number): void {
		// Select month
		this.selectMonth(month);
	}

	/**
	 * On year select
	 * @param year 
	 */
	public onYearSelect(year: number): void {
		// Select year
		this.selectYear(year);
	}

	/**
	 * On view
	 * @param view 
	 */
	public onViewChangeRequest(view: number): void {
		// Set active view
		this.setActiveView(view);
	}

	/**
	 * Set active view
	 * @param view 
	 */
	private async setActiveView(view: number): Promise<void> {
		// Assign view
		this.activeView = view;
	}

	/**
	 * Select year
	 * @param year 
	 */
	private async selectYear(year: number): Promise<void> {
		// Assign selected year
		this.selected = Moment(this.selected).year(year).toDate();

		// Set view to months
		this.activeView = DatepickerView.MONTHS;
	}

	/**
	 * Select month
	 * @param month 
	 */
	private async selectMonth(month: number): Promise<void> {
		// Assign selected month
		this.selected = Moment(this.selected).month(month).toDate();

		// Set view to days
		this.activeView = DatepickerView.DAYS;
	}

	/**
	 * Select day
	 * @param day 
	 */
	private async selectDay(day: Date): Promise<void> {
		// Assign day
		this.selected = day;
	}

	/**
	 * Confirm
	 * @description Confirm date
	 */
	private async confirm(): Promise<void> {
		// Assign value
		this.value = Moment(this.selected).toDate();

		// Close dialog
		this.close();
	}

	/**
	 * Toggle
	 * @description Toggle dialog
	 */
	private async toggle(): Promise<void> {
		// Check for readonly or disabled
		if (this.isReadonly || this.isDisabled) {
			// Make sure we are closing
			return this.close();
		}

		// Check if current state is closed
		if (this.isClosed) {
			// Init selected from value or default
			this.selected = Moment(this.value || new Date()).toDate();
		}

		// Toggle open flag
		this.isOpen = !this.isOpen;
	}

	/**
	 * Close
	 * @description Close dialog
	 */
	private async close(): Promise<void> {
		// Reset open flag
		this.isOpen = false;
	}
}
