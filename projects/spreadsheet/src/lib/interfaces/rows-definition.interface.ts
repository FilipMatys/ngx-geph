// Interfaces
import { ISpreadsheetRows } from "./rows.interface";

/**
 * Spreadsheet rows definition
 * @description Spreadsheet rows interface
 */
export interface ISpreadsheetRowsDefinition {
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
    rows?: ISpreadsheetRows;
}