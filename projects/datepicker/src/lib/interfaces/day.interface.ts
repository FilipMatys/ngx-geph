/**
 * Datepicker day
 * @description Day interface for datepicker
 */
export interface IDatepickerDay {
    /**
     * Number
     * @description Day number
     */
    number?: number;

    /**
     * Date
     * @description Specific date
     */
    date?: Date;

    /**
     * Is today
     * @description Today flag
     */
    isToday?: boolean;

    /**
     * Is current month
     * @description Current month flag
     */
    isCurrentMonth?: boolean;

    /**
     * Is selected
     * @description Selected flag
     */
    isSelected?: boolean;
}