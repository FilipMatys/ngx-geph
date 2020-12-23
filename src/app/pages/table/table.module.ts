// External modules
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TableModule } from "table";

// Pages
import { TablePage } from "./table.page";

@NgModule({
    imports: [
        CommonModule,
        TableModule,
        RouterModule.forChild([
            {
                path: "",
                component: TablePage
            }
        ])
    ],
    declarations: [TablePage]
})
export class TablePageModule {}