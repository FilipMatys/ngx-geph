// External module
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-tabs-labels",
    template: "<ng-content select=\"ngx-tabs-label\"></ng-content>"
})
export class TabsLabelsComponent {

    // Tabs labels
    @HostBinding("class.ngx-tabs-labels")
    public ngxTabsLabels: boolean = true;
}