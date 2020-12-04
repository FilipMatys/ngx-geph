// External modules
import { Injectable } from "@angular/core";

// Interfaces
import { ISpreadsheetRow } from "../interfaces/row.interface";
import { ISpreadsheetColumn } from "../interfaces/column.interface";

// Constants
import { ALPHABET } from "../constants/alphabet.const";

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
        const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, 'g');

        // Clean input value
        const cleaned = value.replace(cleanPattern, "");

        // Now normalize value, replacing locale decimal for javascript decimal
        const normalized = cleaned.replace(example.charAt(1), ".");

        // Parse float
        const result = parseFloat(normalized);

        // Make sure number is returned
        return !isNaN(result) ? result : 0;
    }

    /**
     * Generate row
     * @param index 
     */
    public generateRow(index: number): ISpreadsheetRow {
        // Init row
        const row: ISpreadsheetRow = { label: `${index + 1}`, index: index };

        // Return row
        return row;
    }

    /**
     * Generate column
     * @param index 
     */
    public generateColumn(index: number): ISpreadsheetColumn {
        // Init column
        const column: ISpreadsheetColumn = {};

        // Assign both label and identifier
        column.label = column.identifier = this.generateColumnLabel(index);

        // Return column
        return column;
    }

    /**
     * Generate column label
     * @param index 
     */
    private generateColumnLabel(index: number): string {
        // Init remainders
        const remainders: string[] = [];


        // Init value to work upon
        let division = index;
        let remainder = division % ALPHABET.length;

        // Add remainder
        remainders.push(`${ALPHABET[remainder]}`);

        // Check division
        while (division >= ALPHABET.length) {
            // Get new division value
            division = Math.floor(division / ALPHABET.length);

            // Add remainder
            remainders.unshift(`${ALPHABET[division - 1]}`);
        }

        // Return generated label
        return remainders.join("").toUpperCase();
    }
}