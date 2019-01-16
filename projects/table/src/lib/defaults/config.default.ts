// Interfaces
import { ITableConfig } from "../interfaces/config.interface";

// Defaults
import { tableSortDefault } from "./sort.default";

/**
 * Default table configuration
 */
export var tableConfigDefault: ITableConfig<any> = {
    // Track record by default function
    trackRecordBy: (index: number, item: any) => item,
    // Assign table sort default
    sort: tableSortDefault,
    // Allow rock click
    allowRowClick: true
}