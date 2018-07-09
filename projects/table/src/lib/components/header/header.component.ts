// External modules
import { Component, Inject, Input, OnInit, OnDestroy, HostListener, HostBinding } from "@angular/core";

// Data
import { TableSortDirection } from "../../enums/sort-direction.enum";

// Components
import { TableComponent } from "../../table.component";

@Component({
    selector: "ngx-table-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class TableHeaderComponent implements OnInit, OnDestroy {

    // Is sortable flag
    @Input("sortable")
    @HostBinding("class.sortable")
    public isSortable: boolean = false;

    @HostBinding("class.ascending")
    public get isAcending(): boolean {
        return this.sortDirection === TableSortDirection.ASCENDING;
    }

    @HostBinding("class.descending")
    public get isDescending(): boolean {
        return this.sortDirection === TableSortDirection.DESCENDING;
    }

    // Sort direction
    public sortDirection: number = TableSortDirection.NONE;

    @HostListener("click", ["$event"])
    public onClick(event: Event) {
        // On header click
        this.table.onHeaderClick(event, this);
    }

    /**
     * Constructor
     * @param table 
     */
    constructor(@Inject(TableComponent) private table: TableComponent) {}

    /**
     * On init hook
     */
    public ngOnInit() {
        this.table.registerHeader(this);
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy() {
        this.table.unregisterHeader(this);
    }
}