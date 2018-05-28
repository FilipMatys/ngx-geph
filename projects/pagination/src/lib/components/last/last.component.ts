// External modules
import { Component, EventEmitter, Output, HostListener } from "@angular/core";

@Component({
    selector: "ngx-pagination-last",
    template: "<ng-content></ng-content>"
})
export class PaginationLastComponent {

    @HostListener("click", ["$event"])
    public onLastClick(event: Event) {
        // Emit last click
        this.lastClick.emit(event);
    }

    @Output("lastClick")
    public lastClick: EventEmitter<Event> = new EventEmitter();
}