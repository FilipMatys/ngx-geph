// Interfaces
import { ISpreadsheetRow } from "./row.interface";

/**
 * Spreadsheet generate row fn
 * @description Function to generate spreadsheet row
 */
export interface ISpreadsheetGenerateRowFn {
    (row: ISpreadsheetRow, index: number): ISpreadsheetRow;
}