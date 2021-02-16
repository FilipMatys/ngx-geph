// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TooltipModule } from "tooltip";

// Pages
import { TooltipPage } from "./tooltip.page";

@NgModule({
    imports: [
        CommonModule,
        TooltipModule,
        RouterModule.forChild([
            {
                path: "",
                component: TooltipPage
            }
        ])
    ],
    declarations: [TooltipPage]
})
export class TooltipPageModule { }