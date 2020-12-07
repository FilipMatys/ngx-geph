// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-tabs-label",
    template: "<ng-content></ng-content>"
})
export class TabsLabelComponent {

    // Tabs label
    @HostBinding("class.ngx-tabs-label")
    public ngxTabsLabel: boolean = true;
}