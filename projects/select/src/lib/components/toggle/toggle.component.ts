// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-select-toggle",
    template: "<ng-content></ng-content>"
})
export class SelectToggleComponent {

    // Bind select toggle class
    @HostBinding("class.ngx-select-toggle")
    public selectToggleClass: boolean = true;
}