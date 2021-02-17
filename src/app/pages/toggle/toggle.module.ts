// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ToggleModule } from "toggle";

// Pages
import { TogglePage } from "./toggle.page";

@NgModule({
    imports: [
        CommonModule,
        ToggleModule,
        RouterModule.forChild([
            {
                path: "",
                component: TogglePage
            }
        ])
    ],
    declarations: [TogglePage]
})
export class TogglePageModule { }