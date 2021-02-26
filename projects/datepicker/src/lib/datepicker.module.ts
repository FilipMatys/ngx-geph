// External modules
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Components
import { DatepickerComponent } from "./datepicker.component";
import { DatepickerDaysComponent } from "./components/days/days.component";
import { DatepickerMonthsComponent } from "./components/months/months.component";
import { DatepickerYearsComponent } from "./components/years/years.component";

// Directives
import { DatepickerNextDirective } from "./directives/next.directive";
import { DatepickerPreviousDirective } from "./directives/previous.directive";
import { DatepickerValueDirective } from "./directives/value.directive";
import { DatepickerCancelDirective } from "./directives/cancel.directive";
import { DatepickerConfirmDirective } from "./directives/confirm.directive";

// Pipes
import { DatepickerFormatPipe } from "./pipes/format.pipe";

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		DatepickerComponent,
		DatepickerDaysComponent,
		DatepickerMonthsComponent,
		DatepickerYearsComponent,
		DatepickerNextDirective,
		DatepickerPreviousDirective,
		DatepickerValueDirective,
		DatepickerCancelDirective,
		DatepickerConfirmDirective,
		DatepickerFormatPipe
	],
	exports: [
		DatepickerComponent,
		DatepickerNextDirective,
		DatepickerPreviousDirective,
		DatepickerValueDirective,
		DatepickerCancelDirective,
		DatepickerConfirmDirective
	]
})
export class DatepickerModule { }
