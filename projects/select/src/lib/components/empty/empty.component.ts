// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-select-empty",
    template: "<ng-content></ng-content>",
    styleUrls: ["./empty.component.scss"]
})
export class SelectEmptyComponent {

    @HostBinding("class.ngx-select-empty")
    public selectEmptyClass: boolean = true;
}