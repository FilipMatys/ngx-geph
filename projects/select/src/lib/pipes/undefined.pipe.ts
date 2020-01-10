// External modules
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "isUndefined",
    pure: true
})
export class SelectIsUndefinedPipe implements PipeTransform {

    /**
     * Check if value is undefined
     * @param value 
     */
    public transform(value: any): boolean {
        return typeof value === "undefined" || value === null;
    }
}