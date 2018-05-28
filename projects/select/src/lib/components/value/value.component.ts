// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-select-value",
    template: "<ng-content></ng-content>",
    styleUrls: ["./value.component.scss"]
})
export class SelectValueComponent {

    // Bind select value class
    @HostBinding("class.select-value")
    public selectValueClass: boolean = true;
}