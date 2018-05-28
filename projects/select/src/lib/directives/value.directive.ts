// External modules
import { Directive } from "@angular/core";

// Select value context
export interface ISelectValueContext<T> {
    $implicit: T;
}

@Directive({
    selector: '[ngxSelectValue]'
})
export class SelectValueDirective {}