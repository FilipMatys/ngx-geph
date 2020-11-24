// External modules
import { Injectable } from "@angular/core";

@Injectable()
export class SpreadsheetUtilityService {

    /**
     * Parse number
     * @param value 
     * @param locales 
     */
    public parseNumber(value: string, locales: readonly string[] = navigator.languages): number {
        // First get example of formatted number using locales
        const example = Intl.NumberFormat(locales as string[]).format(1.1);

        // Init clean pattern regexp
        const cleanPattern = new RegExp(`[^-+0-9${ example.charAt(1) }]`, 'g');

        // Clean input value
        const cleaned = value.replace(cleanPattern, "");

        // Now normalize value, replacing locale decimal for javascript decimal
        const normalized = cleaned.replace(example.charAt(1), ".");

        // Parse float
        const result = parseFloat(normalized);

        // Make sure number is returned
        return !isNaN(result) ? result : 0;
    }
}