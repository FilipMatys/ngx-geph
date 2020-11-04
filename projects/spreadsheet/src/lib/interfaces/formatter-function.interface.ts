/**
 * Spreadsheet formatter function
 * @description Function for format cell value
 */
export interface ISpreadsheetFormatterFunction<TValue> {
    (value: TValue): string;
}