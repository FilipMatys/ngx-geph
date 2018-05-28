// External modules
import { Component, HostListener, Inject } from "@angular/core";

// Components
import { AccordionItemComponent } from "../item/item.component";

@Component({
    selector: "ngx-accordion-heading",
    template: "<ng-content></ng-content>"
})
export class AccordionHeadingComponent {

    // Listener to click event
    @HostListener("click", ["$event"])
    public onHeadingClick(event: Event) {
        // Propagate click
        this.item.onHeadingClick(event);
    }

    /**
     * Constructor
     * @param item 
     */
    constructor(@Inject(AccordionItemComponent) private item: AccordionItemComponent) {}
}
