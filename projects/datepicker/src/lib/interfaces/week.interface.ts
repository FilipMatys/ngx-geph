import { IDatepickerDay } from "./day.interface";

/**
 * Datepicker week
 * @description Week interface for datepicker
 */
export interface IDatepickerWeek {
    /**
     * Number
     * @description Week number
     */
    number?: number;

    /**
     * Days
     * @description Week days
     */
    days?: IDatepickerDay[];
}