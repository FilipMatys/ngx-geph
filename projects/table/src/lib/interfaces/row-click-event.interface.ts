// Row click event
export interface IRowClickEvent<T> {
    event: Event;
    item: T;
    index: number;
}