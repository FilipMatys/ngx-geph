// Interfaces
import { ITableSort } from "../interfaces/sort.interface";
import { ITableSortColumn } from "../interfaces/sort-column.interface";

/**
 * Default sort configuration
 */
export var tableSortDefault: ITableSort<ITableSortColumn> = {
    allow: false,
    multi: false,
    mapSetFn: (columns: ITableSortColumn[]) => columns,
    mapGetFn: (columns: ITableSortColumn[]) => columns
}