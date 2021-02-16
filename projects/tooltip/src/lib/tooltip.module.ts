// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Components
import { TooltipComponent } from "./components/tooltip/tooltip.component";

// Directives
import { TooltipDirective } from "./directives/tooltip.directive";
import { TooltipCloseDirective } from "./directives/close.directive";

@NgModule({
	imports: [CommonModule],
	declarations: [
		TooltipDirective,
		TooltipCloseDirective,
		TooltipComponent
	],
	exports: [
		TooltipDirective,
		TooltipCloseDirective,
		TooltipComponent
	]
})
export class TooltipModule { }
