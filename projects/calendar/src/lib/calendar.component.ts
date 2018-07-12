// External modules
import { Component, Input, OnInit, ContentChild, TemplateRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import * as _moment from "moment";
const Moment = _moment;

// Data
import { ICalendarDay } from './interfaces/day.interface';
import { ICalendarConfig } from "./interfaces/config.interface";

// Directives
import { CalendarDayDirective } from "./directives/day/day.directive";
import { CalendarLabelDirective } from "./directives/label/label.directive";
import { CalendarPrevDirective } from './directives/prev/prev.directive';
import { CalendarNextDirective } from './directives/next/next.directive';
import { CalendarCurrentDirective } from './directives/current/current.directive';

@Component({
	selector: 'ngx-calendar',
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CalendarComponent),
			multi: true
		}
	]
})
export class CalendarComponent implements OnInit {

	// Model value
	@Input("value")
	public _value: Date;

	// Value getter
	public get value() { return this._value };

	// Value setter
	public set value(value: any) {
		// Assign value
		this._value = value;

		// Propagate change
		this.propagateChange(this._value);
	}

	// Configuration
	@Input("config")
	public config: ICalendarConfig = {
		startingDay: 0
	};

	// Day template
	@ContentChild(CalendarDayDirective, { read: TemplateRef })
	public dayTemplate: TemplateRef<any>;

	// Label template
	@ContentChild(CalendarLabelDirective, { read: TemplateRef })
	public labelTemplate: TemplateRef<any>;

	// Prev template
	@ContentChild(CalendarPrevDirective, { read: TemplateRef })
	public prevTemplate: TemplateRef<any>;

	// Next template
	@ContentChild(CalendarNextDirective, { read: TemplateRef })
	public nextTemplate: TemplateRef<any>;

	// Current template
	@ContentChild(CalendarCurrentDirective, { read: TemplateRef })
	public currentTemplate: TemplateRef<any>;

	// Selected date
	public selected = Moment();

	// Week names
	public weekNames: number[] = [];

	// Calendar weeks
	public weeks: ICalendarDay<any>[][] = [];

	/**
	 * On init hook
	 */
	public ngOnInit() {
		// Init selected
		this.selected = this.value ? Moment(this.value) : this.selected;

		// Build week names
		this.buildWeekNames();

		// Build calendar month
		this.buildMonth();
	}

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
	 * On next month click
	 * @param event 
	 */
	public onNextMonthClick(event: Event) {
		// Prevent event propagation
		event.stopPropagation();

		// Add month
		this.selected.add(1, "month");

		// Build month
		this.buildMonth();
	}

	/**
	 * On prev month click
	 * @param event 
	 */
	public onPrevMonthClick(event: Event) {
		// Prevent event propagation
		event.stopPropagation();

		// Substract month
		this.selected.subtract(1, "month");

		// Build month
		this.buildMonth();
	}

	/**
	 * On day click
	 * @param event 
	 * @param day 
	 */
	public onDayClick(event: Event, day: ICalendarDay<any>) {
		// Prevent event propagation
		event.stopPropagation();

		// Assign date
		this.value = day.date;

		// Check if date is out of current month
		if (day.date.getMonth() !== this.selected.month()) {
			// Set new month and rebuild
			this.selected.month(day.date.getMonth());
			this.buildMonth();
		}
	}

	/**
	 * Build week names
	 */
	private buildWeekNames() {
		// Init names
		let names: number[] = [];

		// Iterate
		for (let index = this.config.startingDay, cnt = 0; cnt < 7; index++ , cnt++)
			names.push(index);

		// Assign names
		this.weekNames = names;
	}

	/**
	 * Build month
	 */
	private buildMonth() {
		// Get start of month
		let startOfMonth = this.selected.clone().startOf("month");

		// Get difference between starting day and start of month
		let difference = startOfMonth.weekday() - this.config.startingDay;

		// Get start day
		let start = startOfMonth.add(-Math.abs(difference), "day");

		// Build weeks
		this.buildWeeks(start);
	}

	/**
	 * Build weeks
	 * @param start 
	 */
	private buildWeeks(start) {
		// Init weeks
		let weeks: ICalendarDay<any>[][] = [];

		// Get current
		let current = start.clone();

		// Iterate weeks
		do {
			// Init days
			let days: ICalendarDay<any>[] = [];

			// Create days of week
			for (let index = 0; index < 7; index++) {
				days.push({
					date: current.toDate(),
					day: current.date(),
					isCurrentMonth: current.month() === this.selected.month(),
					isToday: Moment().isSame(current, "day"),
					isWeekend: current.weekday() === 6 || current.weekday() === 0
				});

				// Add day
				current.add(1, "day");
			}

			// Add days to weeks
			weeks.push(days);
		} while (current.month() === this.selected.month());

		// Assign weeks
		this.weeks = weeks;
	}
}
