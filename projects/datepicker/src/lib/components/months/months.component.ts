// External modules
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from "@angular/core";
import Moment from "moment";

// Enums
import { DatepickerView } from "../../enums/view.enum";

// Interfaces
import { IDatepickerConfig } from "../../interfaces/config";
import { IDatepickerFormatter } from "../../interfaces/formatter.interface";

@Component({
    selector: "ngx-datepicker-months",
    templateUrl: "./months.component.html",
    styleUrls: ["./months.component.scss"]
})
export class DatepickerMonthsComponent implements OnInit {

    @HostBinding("class.ngx-datepicker-months")
    public readonly hasDefaultClass: boolean = true;

    @Input("value")
    public value: Date;

    @Input("config")
    public config: IDatepickerConfig;

    @Output("select")
    public readonly selectEvent: EventEmitter<number> = new EventEmitter<number>();

    @Output("view")
    public readonly viewEvent: EventEmitter<number> = new EventEmitter<number>();

    // Current year
    public year: number;

    // Selected month
    public selected: number = undefined;

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

    // List of months
    public readonly months: number[] = Array.from(Array(12).keys());

    /**
     * On init hook
     */
    public async ngOnInit(): Promise<void> {
        // Check for input value
        if (!this.value) {
            // Do nothing
            return;
        }

        // Get moment date
        const mDate = Moment(this.value);

        // Set selected month
        this.selected = mDate.month();

        // Also set year as we also need it
        this.year = mDate.year();
    }

    /**
     * On month click
     * @param event 
     * @param month
     */
    public onMonthClick(event: Event, month: number): void {
        // Prevent event propagation
        event.stopPropagation();

        // Select month
        this.select(month);
    }

    /**
     * Select year click
     * @param event 
     */
    public onSelectYearClick(event: Event): void {
        // Prevent event propagation
        event.stopPropagation();

        // Select year
        this.selectYear();
    }

    /**
     * Select year
     */
    private async selectYear(): Promise<void> {
        // Send view change event
        this.viewEvent.emit(DatepickerView.YEARS);
    }

    /**
     * Select month
     * @param month 
     */
    private async select(month: number): Promise<void> {
        // Assign selected
        this.selected = month;

        // Emit select event
        this.selectEvent.emit(month);
    }
}