// External modules
import { Component, OnInit } from "@angular/core";
import { ITableConfig } from "table";

@Component({
    selector: "page-table",
    templateUrl: "./table.page.html",
    styleUrls: ["./table.page.scss"]
})
export class TablePage implements OnInit {

    // Table config
    public readonly tableConfig: ITableConfig<any> = {
        virtualScroll: {
            allow: true,
            rowHeight: 30.4,
            paddingRowsCount: 4,
            stickyHead: true,
            stickyFoot: true
        },
        trackRecordBy: (index, item) => item.age,
        allowRowClick: false,
        sort: {
            allow: false,
            multi: false,
            mapSetFn: () => [{}]
        }
    }

    // Number of items to generate
    private readonly ITEMS_COUNT: number = 100000;

    // Items
    public items: any[] = [];

    /**
     * On init hook
     */
    public ngOnInit(): void {
        // Generate items
        for (let index = 0; index < this.ITEMS_COUNT; index++) {
            // Add new item
            this.items.push({
                name: `Item_${index}`,
                age: (((index * 2) / 5) + index * 2) % 100
            });
        }
    }

    /**
     * On add row click
     * @param event 
     */
    public onAddRowClick(event: Event): void {
        // Prevent event propagation
        event.stopPropagation();

        // Add row
        this.addRow();
    }

    /**
     * Add row
     */
    private addRow(): void {
        // Get index
        const index = (this.items || []).length;

        // Add item
        this.items.push({
            name: `Item_${index}`,
            age: (((index * 2) / 5) + index * 2) % 100
        });
    }
}