// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-select-clear",
    templateUrl: "./clear.component.html"
})
export class SelectClearComponent {

    // Bind select clear class
    @HostBinding("class.ngx-select-clear")
    public selectClearClass: boolean = true;
}