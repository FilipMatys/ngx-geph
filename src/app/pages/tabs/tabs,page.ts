// External modules
import { Component } from "@angular/core";

@Component({
    selector: "page-tabs",
    templateUrl: "./tabs.page.html",
    styleUrls: ["./tabs.page.scss"]
})
export class TabsPage {

    // Tag visibility toggle
    public isTabVisible: boolean;

    /**
     * On toggle tab click
     * @param event 
     */
    public onToggleTabClick(event: Event): void {
        // Toggle tab
        this.toggleTab();
    } 

    /**
     * Toggle tab
     */
    private toggleTab(): void {
        // Toggle tab
        this.isTabVisible = !this.isTabVisible;
    }

}