// Interfaces
import { ITableSortColumn } from "./sort-column.interface";

// Table sort interface
export interface ITableSort<TKey> {

    /**
     * Allow
     * @description Allows sorting
     */
    allow?: boolean;

    /**
     * Multi
     * @description Allows sorting by multiple columns
     */
    multi?: boolean;

    /**
     * Mapping get function
     * @description Mapping function to transfer sort state
     * tu custom output
     */
    mapGetFn?: (columns: ITableSortColumn[]) => TKey[]; 

    /**
     * Mapping set function
     * @description Mapping function to transfer custom input
     * to sort state
     */
    mapSetFn?: (columns: TKey[]) => ITableSortColumn[];
}