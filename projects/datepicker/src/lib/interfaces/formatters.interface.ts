// Interfaces
import { IDatepickerFormatter } from "./formatter.interface";

/**
 * Datepicker formatter interface
 */
export interface IDatepickerFormatters {
    /**
     * Day formatter function
     * @description Function to format day
     */
    dayFormatterFn?: IDatepickerFormatter;

    /**
     * Month formatter function
     * @description Function to format month
     */
    monthFormatterFn?: IDatepickerFormatter;

    /**
     * Year formatter function
     * @description Function to format year
     */
    yearFormatterFn?: IDatepickerFormatter;

    /**
     * Week formatter function
     * @description Function to format week
     */
    weekFormatterFn?: IDatepickerFormatter;

    /**
     * Weekday formatter function
     * @description Function to format weekday
     */
    weekdayFormatterFn?: IDatepickerFormatter;
}