// External modules
import { Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";

// Interfaces
import { IDatepickerFormatter } from "../interfaces/formatter.interface";

@Pipe({ name: "format" })
export class DatepickerFormatPipe implements PipeTransform {

    /**
     * Transform value
     * @param value 
     * @param args 
     */
    public transform(value: number, formatterFn: IDatepickerFormatter): string | Promise<string> | Observable<string> {
        // Transform value using passed formatter function
        return formatterFn(value);
    }
}