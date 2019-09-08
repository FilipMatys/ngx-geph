// External modules
import { Directive } from "@angular/core";

// Select clear context
export interface ISelectClearContext<T> {
    $implicit: T;
    index?: number;
}

@Directive({
    selector: '[ngxSelectClear]'
})
export class SelectClearDirective {}