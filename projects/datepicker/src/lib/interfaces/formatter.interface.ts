// External modules
import { Observable } from "rxjs";

/**
 * Datepicker formatter interface
 */
export interface IDatepickerFormatter {
    (value: number): string | Promise<string> | Observable<string>;
}