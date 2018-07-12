// Calendar day interface
export interface ICalendarDay<E> {
    date?: Date;
    day?: number;
    isToday?: boolean;
    isCurrentMonth?: boolean;
    isWeekend?: boolean;
}