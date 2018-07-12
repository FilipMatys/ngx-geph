// External modules
import { Component, Input, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-calendar-day",
    template: "<ng-content></ng-content>",
    styleUrls: ["./day.component.scss"]
})
export class CalendarDayComponent {

    // Today flag
    @Input("today")
    @HostBinding("class.today")
    public isToday: boolean = false;

    // Current month flag
    @Input("current")
    @HostBinding("class.current")
    public isCurrentMonth: boolean = false;

    // Weekend flag
    @Input("weekend")
    @HostBinding("class.weekend")
    public isWeekend: boolean = false;
}