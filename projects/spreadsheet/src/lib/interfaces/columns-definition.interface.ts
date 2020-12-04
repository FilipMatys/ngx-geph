// Interfaces
import { ISpreadsheetColumn } from "./column.interface";
import { ISpreadsheetColumns } from "./columns.interface";

/**
 * Spreadsheet columns definition
 * @description Spreadsheet columns definition interface
 */
export interface ISpreadsheetColumnsDefinition {

    /**
     * Mode
     * @description Defines mode in which
     * the columns should be rendered
     */
    mode?: number;

    /**
     * Number of columns
     * @description Number of columns to
     * start with
     */
    numberOfColumns?: number;

    /**
     * Column generator fn
     * @description Custom function to generate
     * column based on index
     */
    generateColumnFn?: (column: ISpreadsheetColumn, index: number) => ISpreadsheetColumn;

    /**
     * Columns
     * @description Actual columns to
     * use
     */
    columns?: ISpreadsheetColumns;
}