// Interfaces
import { IDatepickerFormatters } from "./formatters.interface";

/**
 * Datepicker config interface
 * @description Configuration for datepicker
 */
export interface IDatepickerConfig {
    /**
     * Formatters
     * @description Functions to format date
     * and time values
     */
    formatters?: IDatepickerFormatters;

    /**
     * Is dialog always rendered
     * @description Is dialog always rendered flag
     */
    isDialogAlwaysRendered?: boolean;
}