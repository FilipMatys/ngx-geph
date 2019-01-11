// Data
import { ITableSort } from "./sort.interface";

// Table config interface
export interface ITableConfig<T> {
    sort?: ITableSort;
    trackRecordBy?: (index: number, item: T) => any;
}