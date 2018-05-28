// External modules
import { Component, EventEmitter, Output, HostListener } from "@angular/core";

@Component({
    selector: "ngx-pagination-first",
    template: "<ng-content></ng-content>"
})
export class PaginationFirstComponent {

    @HostListener("click", ["$event"])
    public onFirstClick(event: Event) {
        // Emit first click
        this.firstClick.emit(event);
    }

    @Output("firstClick")
    public firstClick: EventEmitter<Event> = new EventEmitter();
}