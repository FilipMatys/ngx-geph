// Interfaces
import { ISpreadsheetRow } from "./row.interface";

/**
 * Spreadsheet rows
 * @description Spreadsheet rows interface
 */
export interface ISpreadsheetRows {
    /**
     * Mode
     * @description Defines mode in which
     * the rows should be rendered
     */
    mode?: number;

    /**
     * Number of rows
     * @description Number of rows to
     * start with unless CUSTOM mode 
     * is set
     */
    numberOfRows?: number;

    /**
     * Rows
     * @description Actual rows to use
     * when CUSTOM mode is set
     */
    rows?: ISpreadsheetRow[];
}