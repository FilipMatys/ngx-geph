// External modules
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

// Library
import { DrawerModule } from "drawer";

// Page
import { DrawerPage } from "./drawer.page";

@NgModule({
    imports: [
        CommonModule,
        DrawerModule,
        RouterModule.forChild([
            { path: "", component: DrawerPage }
        ])
    ],
    declarations: [DrawerPage]
})
export class DrawerPageModule { }