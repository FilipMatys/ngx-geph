// Select config interface
export interface ISelectConfig<T> {
    allowSearch?: boolean;
    allowClear?: boolean;
    searchInputDelay?: number;
    searchPlaceholder?: string;
    multi?: boolean;
    getOptions?: (term: string) => Promise<T[]>;
    compareFn?: (prev: T, next: T) => boolean;
}