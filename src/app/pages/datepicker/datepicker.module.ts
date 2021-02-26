// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DatepickerModule } from "datepicker";
import { FormsModule } from "@angular/forms";

// Pages
import { DatepickerPage } from "./datepicker.page";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DatepickerModule,
        RouterModule.forChild([
            {
                path: "",
                component: DatepickerPage
            }
        ])
    ],
    declarations: [DatepickerPage]
})
export class DatepickerPageModule { }