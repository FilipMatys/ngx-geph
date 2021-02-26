// External modules
import { Component } from "@angular/core";

// Module
import { IDatepickerConfig } from "datepicker";

@Component({
    selector: "page-datepicker",
    templateUrl: "./datepicker.page.html",
    styleUrls: ["./datepicker.page.scss"]
})
export class DatepickerPage {

    // Config
    public readonly config: IDatepickerConfig = { 
        isDialogAlwaysRendered: true,
        formatters: {
            monthFormatterFn: (month: number) => `${month}M`
        } 
    };

    // Init value
    public value: Date = new Date();
}