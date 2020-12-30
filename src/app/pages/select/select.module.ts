// External modules
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { SelectModule } from "select";

// Pages
import { SelectPage } from "./select.page";

@NgModule({
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: "",
                component: SelectPage
            }
        ])
    ],
    declarations: [SelectPage]
})
export class SelectPageModule { }