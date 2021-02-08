// External modules
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

// Library
import { TreeModule } from "tree";

// Page
import { TreePage } from "./tree.page";

@NgModule({
    imports: [
        CommonModule,
        TreeModule,
        RouterModule.forChild([
            { path: "", component: TreePage }
        ])
    ],
    declarations: [TreePage]
})
export class TreePageModule { }