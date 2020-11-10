// Interfaces
import { ISpreadsheetColumn } from "./column.interface";
import { ISpreadsheetRow } from "./row.interface";

/**
 * Spreadsheet cell change event
 */
export interface ISpreadsheetCellChangeEvent {
    prev?: any;
    current?: any;
    column?: ISpreadsheetColumn;
    row?: ISpreadsheetRow;
    origin?: number;
}