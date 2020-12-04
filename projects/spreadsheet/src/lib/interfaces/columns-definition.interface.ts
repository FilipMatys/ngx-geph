// Interfaces
import { ISpreadsheetColumns } from "./columns.interface";

/**
 * Spreadsheet columns definition
 * @description Spreadsheet columns definition interface
 */
export interface ISpreadsheetColumnsDefinition {

    /**
     * Columns
     * @description Actual columns to
     * use
     */
    columns?: ISpreadsheetColumns;
}