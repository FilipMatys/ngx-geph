// Select config interface
export interface ISelectConfig<T> {
    allowSearch?: boolean;
    allowClear?: boolean;
    searchInputDelay?: number;
    searchPlaceholder?: string;
    getOptions?: (term: string) => Promise<T[]>;
}