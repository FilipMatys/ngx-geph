// External modules
import { Directive, HostBinding } from "@angular/core";

@Directive({ 
    selector: "[ngxToggleActive]" 
})
export class ToggleActiveDirective {

    @HostBinding("class.ngx-toggle-active")
    public isNgxToggleActive: boolean = true;
 }