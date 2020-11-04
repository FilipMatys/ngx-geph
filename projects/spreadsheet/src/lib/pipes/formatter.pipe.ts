// External modules
import { Pipe, PipeTransform } from "@angular/core";

// Interfaces
import { ISpreadsheetFormatterFunction } from "../interfaces/formatter-function.interface";

@Pipe({
    name: "formatter",
    pure: true
})
export class SpreadsheetFormatterPipe implements PipeTransform {

    /**
     * Transform value
     * @param value 
     * @param formatterFn 
     */
    public transform(value: any, formatterFn?: ISpreadsheetFormatterFunction<any>): string {
        // Check if value is defined
        if (typeof value === "undefined" || value === "") {
            return "";
        }

        // Use formatter if formatter exists, otherwise return plain value
        return formatterFn ? formatterFn(value) : value;
    }
}