// External modules
import { Component, ViewChild } from "@angular/core";
import { DrawerComponent } from "drawer";

@Component({
    selector: "page-drawer",
    templateUrl: "./drawer.page.html",
    styleUrls: ["./drawer.page.scss"]
})
export class DrawerPage {

    @ViewChild(DrawerComponent)
    public drawer: DrawerComponent;

    public onCollapseClick(event: Event): void {
        console.log(this.drawer);
        this.drawer.collapse();   
    }

    public onToggleClick(event: Event): void {
        this.drawer.toggle();   
    }

    public onExpandClick(event: Event): void {
        this.drawer.expand();   
    }
}