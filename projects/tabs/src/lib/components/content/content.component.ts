// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: "ngx-tabs-content",
    template: "<ng-content></ng-content>"
})
export class TabsContentComponent {

    // Tabs content
    @HostBinding("class.ngx-tabs-content")
    public ngxTabsContent: boolean = true;
}