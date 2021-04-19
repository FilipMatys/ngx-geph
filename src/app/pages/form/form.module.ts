// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormModule } from "form";

// Pages
import { FormPage } from "./form.page";

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        RouterModule.forChild([
            {
                path: "",
                component: FormPage
            }
        ])
    ],
    declarations: [FormPage]
})
export class FormPageModule { }