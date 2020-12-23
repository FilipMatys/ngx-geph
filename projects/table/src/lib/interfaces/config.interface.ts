// Data
import { ITableSort } from "./sort.interface";
import { ITableVirtualScroll } from "./virtual-scroll.interface";

// Table config interface
export interface ITableConfig<T> {
    
    /**
     * Sort
     * @description Sort configuration
     * @default Sort is disabled on default.
     */
    sort?: ITableSort<any>;
    
    /**
     * Allow row click
     * @description Allows row clicks and attaches 
     * 'clickable' class to table
     * @default true
     */
    allowRowClick?: boolean;
    
    /**
     * Track record by
     * @description Custom function for items tracking 
     * @default Track by item
     */
    trackRecordBy?: (index: number, item: T) => any;

    /**
     * Virtual scroll
     * @description Virtual scroll configuration
     */
    virtualScroll?: ITableVirtualScroll;
}