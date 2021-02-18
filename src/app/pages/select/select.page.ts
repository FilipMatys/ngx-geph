// External modules
import { Component } from "@angular/core";

// Components
import { ISelectConfig, SelectMode } from "select";

@Component({
    selector: "page-select",
    templateUrl: "./select.page.html",
    styleUrls: ["./select.page.scss"]
})
export class SelectPage {

    // Selected
    public selected: string = "BigBang";

    // Options select config
    public optionsSelectConfig: ISelectConfig<string> = {
        allowClear: true,
        isSelectionAlwaysRendered: true,
        mode: SelectMode.STANDARD,
        allowSearch: true,
        searchPlaceholder: "Search",
        autofillPropertySelectorFn: (option) => option,
        getOptions: async (term) => {
            if (!term) {
                return this.options;
            }

            return this.options.filter((option) => option.includes(term));
        }
    }

    // List of options
    public options: string[] = [
        "BigBang",
        "Shinee",
        "Ftisland",
        "The Vane",
        "B14A",
        "N.Flying",
        "10cm"
    ];
}