// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Directives
import { FormDirective } from "./directives/form/form.directive";
import { FormInputDirective } from "./directives/input/input.directive";
import { FormMessageDirective } from "./directives/message/message.directive";

// Outlets
import { FormMessagesOutletDirective } from "./outlets/messages/messages.outlet";

@NgModule({
	imports: [CommonModule],
	declarations: [
		FormDirective,
		FormInputDirective,
		FormMessageDirective,
		FormMessagesOutletDirective
	],
	exports: [
		FormDirective,
		FormInputDirective,
		FormMessageDirective,
		FormMessagesOutletDirective
	]
})
export class FormModule { }
