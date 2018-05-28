// External modules
import { Component, HostListener, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "ngx-pagination-prev",
    template: "<ng-content></ng-content>"
})
export class PaginationPrevComponent {

    // Click event listener
    @HostListener("click", ["$event"])
    public onPrevClick(event: Event) {
        // Propagate event
        this.prevClick.emit(event);
    }

    @Output("prevClick")
    public prevClick: EventEmitter<Event> = new EventEmitter<Event>();
}