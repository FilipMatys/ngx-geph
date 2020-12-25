// Interfaces
import { ITableConfig } from "../interfaces/config.interface";

/**
 * Default table configuration
 */
export var tableConfigDefault: ITableConfig<any> = {
    // Track record by default function
    trackRecordBy: (index: number, item: any) => item,
    // Allow rock click
    allowRowClick: true
}