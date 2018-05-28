// Select config interface
export interface ISelectConfig<T> {
    allowSearch?: boolean;
    searchInputDelay?: number;
    getOptions?: (term: string) => Promise<T[]>;
}