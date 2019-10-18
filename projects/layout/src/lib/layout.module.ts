// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { StackComponent } from "./components/stack/stack.component";
import { WrapComponent } from "./components/wrap/wrap.component";

@NgModule({
	imports: [CommonModule],
	declarations: [StackComponent, WrapComponent],
	exports: [StackComponent, WrapComponent]
})
export class LayoutModule { }
