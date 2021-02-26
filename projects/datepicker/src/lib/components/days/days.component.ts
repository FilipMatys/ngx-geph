// External modules
import { Component, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef } from "@angular/core";
import Moment from "moment";
import { DatepickerView } from "../../enums/view.enum";

// Interfaces
import { IDatepickerConfig } from "../../interfaces/config";
import { IDatepickerDay } from "../../interfaces/day.interface";
import { IDatepickerFormatter } from "../../interfaces/formatter.interface";
import { IDatepickerWeek } from "../../interfaces/week.interface";

@Component({
    selector: "ngx-datepicker-days",
    templateUrl: "./days.component.html",
    styleUrls: ["./days.component.scss"]
})
export class DatepickerDaysComponent implements OnInit {

    @HostBinding("class.ngx-datepicker-days")
    public readonly hasDefaultClass: boolean = true;

    @Input("value")
    public value: Date;

    @Input("config")
    public config: IDatepickerConfig;

    @Input("nextTemplateRef")
    public nextTemplateRef: TemplateRef<HTMLElement>;

    @Input("previousTemplateRef")
    public previousTemplateRef: TemplateRef<HTMLElement>;

    @Output("select")
    public readonly selectEvent: EventEmitter<Date> = new EventEmitter<Date>();

    @Output("view")
    public readonly viewEvent: EventEmitter<number> = new EventEmitter<number>();

    // Selected date
    public selected: Date;

    // View base
    public base: Date;

    // List of weeks
    public weeks: IDatepickerWeek[] = [];

    // List of weekday
    public weekdays: number[] = Array.from({ length }, (_, index) => index + 1);

    // Year getter
    public get year(): number {
        // Return year
        return Moment(this.base).year();
    }

    // Month getter
    public get month(): number {
        // Return month
        return Moment(this.base).month();
    }

    // Default day formatter function
    private readonly defaultDayFormatterFn: IDatepickerFormatter = (day: number) => `${day}`;

    // Day formatter function
    public get dayFormatterFn(): IDatepickerFormatter {
        // Check for config
        if (!this.config || !this.config.formatters || !this.config.formatters.dayFormatterFn) {
            // Return default formatter function
            return this.defaultDayFormatterFn;
        }

        // Return function from config
        return this.config.formatters.dayFormatterFn;
    }

    // Default week formatter function
    private readonly defaultWeekFormatterFn: IDatepickerFormatter = (week: number) => `${week}`;

    // Week formatter function
    public get weekFormatterFn(): IDatepickerFormatter {
        // Check for config
        if (!this.config || !this.config.formatters || !this.config.formatters.weekFormatterFn) {
            // Return default formatter function
            return this.defaultWeekFormatterFn;
        }

        // Return function from config
        return this.config.formatters.weekFormatterFn;
    }

    // Default weekday formatter function
    private readonly defaultWeekdayFormatterFn: IDatepickerFormatter = (weekday: number) => `${weekday}`;

    // Weekday formatter function
    public get weekdayFormatterFn(): IDatepickerFormatter {
        // Check for config
        if (!this.config || !this.config.formatters || !this.config.formatters.weekdayFormatterFn) {
            // Return default formatter function
            return this.defaultWeekdayFormatterFn;
        }

        // Return function from config
        return this.config.formatters.weekdayFormatterFn;
    }

    // Default month formatter function
    private readonly defaultMonthFormatterFn: IDatepickerFormatter = (month: number) => `${month}`;

    // Month formatter function
    public get monthFormatterFn(): IDatepickerFormatter {
        // Check for config
        if (!this.config || !this.config.formatters || !this.config.formatters.monthFormatterFn) {
            // Return default formatter function
            return this.defaultMonthFormatterFn;
        }

        // Return function from config
        return this.config.formatters.monthFormatterFn;
    }

    // Default year formatter function
    private readonly defaultYearFormatterFn: IDatepickerFormatter = (year: number) => `${year}`;

    // Year formatter function
    public get yearFormatterFn(): IDatepickerFormatter {
        // Check for config
        if (!this.config || !this.config.formatters || !this.config.formatters.yearFormatterFn) {
            // Return default formatter function
            return this.defaultYearFormatterFn;
        }

        // Return function from config
        return this.config.formatters.yearFormatterFn;
    }

    /**
     * On init hook
     */
    public async ngOnInit(): Promise<void> {
        // Get selected
        if (this.value) {
            // Assign date from value
            this.selected = Moment(this.value).clone().toDate();
        }

        // Now assign base
        this.base = Moment(this.selected).clone().toDate();

        // Build
        this.build();
    }

    /**
     * On next click
     * @param event 
     */
    public async onNextClick(event: Event): Promise<void> {
        // Prevent event propagation
        event.stopPropagation();

        // Next
        this.next();
    }

    /**
     * On previous click
     * @param event 
     */
    public async onPreviousClick(event: Event): Promise<void> {
        // Prevent event propagation
        event.stopPropagation();

        // Previous
        this.previous();
    }

    /**
     * On day click
     * @param event 
     * @param day 
     */
    public onDayClick(event: Event, day: IDatepickerDay): void {
        // Prevent event propagation
        event.stopPropagation();

        // Select
        this.select(day);
    }

    /**
     * Select month click
     * @param event 
     */
    public onSelectMonthClick(event: Event): void {
        // Prevent event propagation
        event.stopPropagation();

        // Select month
        this.selectMonth();
    }

    /**
     * Select month
     */
    private async selectMonth(): Promise<void> {
        // Send view change event
        this.viewEvent.emit(DatepickerView.MONTHS);
    }

    /**
     * Select day
     * @param day 
     */
    private async select(day: IDatepickerDay): Promise<void> {
        // Select day
        this.selected = Moment(day.date).toDate();

        // Emit select date
        this.selectEvent.emit(this.selected);

        // Check if selected is the same month as base
        if (!Moment(this.selected).isSame(this.base, "month")) {
            // Set new base
            this.base = Moment(this.selected).clone().toDate();

            // Rebuild view
            return this.build();
        }

        // Make sure all other days are not selected
        this.weeks.forEach((week) => week.days.forEach((day) => day.isSelected = false));

        // Set day as selected
        day.isSelected = true;
    }

    /**
     * Next
     * @description Move view to next period
     */
    private async next(): Promise<void> {
        // Increase base
        this.base = Moment(this.base).add(1, "month").toDate();

        // Build
        this.build();
    }

    /**
     * Previous
     * @description Move view to previous period
     */
    private async previous(): Promise<void> {
        // Decrease base
        this.base = Moment(this.base).subtract(1, "month").toDate();

        // Build
        this.build();
    }

    /**
     * Build
     */
    private async build(): Promise<void> {
        // First get first date of base month
        const firstDayOfMonth = Moment(this.base).startOf("month");
        // Now get start of week
        const firstDay = firstDayOfMonth.clone().startOf("isoWeek");

        // Init current as first day of week
        const current = firstDay.clone();

        // Reset weeks
        this.weeks = [];

        // Iterate 6 weeks
        for (let index = 0; index < 7; index++) {
            // Init week
            const week: IDatepickerWeek = { number: current.isoWeek(), days: [] };

            // Add days of the week
            for (let index = 0; index < 7; index++) {
                // Init new day
                const day: IDatepickerDay = { number: current.date() };

                // Set values
                day.date = current.toDate();
                day.isCurrentMonth = current.isSame(this.base, "month");
                day.isToday = current.isSame(new Date(), "date");

                // Check for selected
                if (this.selected) {
                    // Set selected flag
                    day.isSelected = current.isSame(this.selected, "date");
                }

                // Add day to week
                week.days.push(day);

                // Increase current
                current.add(1, "day");
            }

            // Add week to list
            this.weeks.push(week);
        }
    }
}