/**
 * Spreadsheet row
 * @description Spreadsheet row interface
 */
export interface ISpreadsheetRow {
    label?: string;
    index?: number;
    isReadonly?: boolean;
    isDisabled?: boolean;
}