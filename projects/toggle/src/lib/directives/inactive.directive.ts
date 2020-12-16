// External modules
import { Directive, HostBinding } from "@angular/core";

@Directive({ 
    selector: "[ngxToggleInactive]" 
})
export class ToggleInactiveDirective {

    @HostBinding("class.ngx-toggle-inactive")
    public isNgxToggleInactive: boolean = true;
}