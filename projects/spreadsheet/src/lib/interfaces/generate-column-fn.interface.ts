// Interfaces
import { ISpreadsheetColumn } from "./column.interface";

/**
 * Spreadsheet generate column fn
 * @description Function to generate spreadsheet column
 */
export interface ISpreadsheetGenerateColumnFn {
    (column: ISpreadsheetColumn, index: number): ISpreadsheetColumn;
}