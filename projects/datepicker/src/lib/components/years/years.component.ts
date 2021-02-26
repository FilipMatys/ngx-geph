// External modules
import { Component, EventEmitter, HostBinding, Input, OnInit, Output, Renderer2, TemplateRef } from "@angular/core";
import Moment from "moment";

// Interfaces
import { IDatepickerConfig } from "../../interfaces/config";
import { IDatepickerFormatter } from "../../interfaces/formatter.interface";

@Component({
    selector: "ngx-datepicker-years",
    templateUrl: "./years.component.html",
    styleUrls: ["./years.component.scss"]
})
export class DatepickerYearsComponent implements OnInit {

    @HostBinding("class.ngx-datepicker-years")
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
    public readonly selectEvent: EventEmitter<number> = new EventEmitter<number>();

    // Selected year
    public selected: number = undefined;

    // View base
    public base: number = undefined;

    // List of years
    public years: number[] = [];

    // Set view size
    private readonly VIEW_SIZE: number = 12;

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
     * Constructor
     * @param renderer 
     */
    constructor(private readonly renderer: Renderer2) { }

    /**
     * On init hook
     */
    public async ngOnInit(): Promise<void> {
        // Get selected
        if (this.value) {
            // Assign year from value
            this.selected = Moment(this.value).year();
        }

        // Now assign base
        this.base = this.selected || Moment(new Date()).year();

        // Build view
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
     * On year click
     * @param event 
     * @param year
     */
    public onYearClick(event: Event, year: number): void {
        // Prevent event propagation
        event.stopPropagation();

        // Select year
        this.select(year);
    }

    /**
     * Next
     * @description Move view to next period
     */
    private async next(): Promise<void> {
        // Increase base
        this.base = this.base + this.VIEW_SIZE;

        // Build
        this.build();
    }

    /**
     * Previous
     * @description Move view to previous period
     */
    private async previous(): Promise<void> {
        // Decrease base
        this.base = this.base - this.VIEW_SIZE;

        // Build
        this.build();
    }

    /**
     * Build
     */
    private async build(): Promise<void> {
        // Get start of decade
        const start = this.base - (this.base % this.VIEW_SIZE);

        // Generate list of years to choose from
        this.years = Array.from({ length: this.VIEW_SIZE }, (_, index) => index + start);
    }

    /**
     * Select year
     * @param year 
     */
    private async select(year: number): Promise<void> {
        // Assign selected
        this.selected = year;

        // Emit select event
        this.selectEvent.emit(year);
    }
}