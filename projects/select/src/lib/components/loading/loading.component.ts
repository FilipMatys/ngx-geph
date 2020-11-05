// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-select-loading",
    template: "<ng-content></ng-content>",
    styleUrls: ["./loading.component.scss"]
})
export class SelectLoadingComponent {

    @HostBinding("class.ngx-select-loading")
    public selectLoadingClass: boolean = true;
}