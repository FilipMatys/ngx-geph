// External modules
import { Component, HostBinding } from "@angular/core";

@Component({
    selector: 'ngx-select-option',
    template: '<ng-content></ng-content>',
    styleUrls: ['./option.component.scss']
})
export class SelectOptionComponent {

    // Bind select options class to component
    @HostBinding("class.ngx-select-option")
    public selectOptionClass: boolean = true;
}