// External modules
import { Component, Inject, HostListener } from "@angular/core";

// Components
import { SelectComponent } from "../../select.component";

@Component({
    selector: "ngx-select-clear",
    templateUrl: "./clear.component.html"
})
export class SelectClearComponent {

    /**
     * Click listener
     * @param event 
     */
    @HostListener("click", ["$event"])
    public onClick(event: Event) {
        // Propagate to parent
        this.parent.onClearClick(event);
    }

    /**
     * Constructor
     * @param parent 
     */
    constructor(@Inject(SelectComponent) private parent: SelectComponent) {}
}