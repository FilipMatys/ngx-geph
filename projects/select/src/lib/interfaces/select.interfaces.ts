// Select config interface
export interface ISelectConfig<T> {
    allowSearch?: boolean;
    allowClear?: boolean;
    searchInputDelay?: number;
    getOptions?: (term: string) => Promise<T[]>;
}