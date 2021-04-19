// External modules
import { Directive, HostBinding, Input } from "@angular/core";

@Directive({ selector: "[ngxFormInput]" })
export class FormInputDirective {

    @HostBinding("class.ngx-form-input")
    public hasDefaultClass: boolean = true;

    @Input("id")
    public identifier: string;

    @Input("isValid")
    @HostBinding("class.ngx-form-input--valid")
    public isValid: boolean;

    @HostBinding("class.ngx-form-input--invalid")
    public get isInvalid(): boolean {
        return typeof this.isValid !== "undefined" && !this.isValid;
    }
}