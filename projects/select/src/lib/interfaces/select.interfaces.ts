// Select config interface
export interface ISelectConfig<TOption> {
    mode?: number;
    allowSearch?: boolean;
    allowClear?: boolean;
    isSelectionAlwaysRendered?: boolean;
    autofillInputDelay?: number;
    searchInputDelay?: number;
    searchPlaceholder?: string;
    multi?: boolean;
    getOptions?: (term: string) => Promise<TOption[]>;
    isValueChangedFn?: (prev: TOption, next: TOption) => boolean;
    autofillPropertySelectorFn?: (option: TOption) => string;
}