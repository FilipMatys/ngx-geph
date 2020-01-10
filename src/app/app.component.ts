import { Component } from '@angular/core';
import { ISelectConfig } from 'select';
import { ITableConfig, TableSortDirection, ITableSortColumn } from "table";
import { ITableSort } from 'projects/table/src/public_api';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx';

  public options: string[] = ['Hello', 'Mr', 'Frodo'];

  public selectValue: string = 'Hello';

  public booleanSelectValue: boolean = true;

  public multiSelectValue: string[];

  public activeTabIndex: number = 0;

  public currentPage: number = 3;

  public tabs: string[] = ['tab1', 'tab2', 'tab3'];

  public config: ISelectConfig<string> = {
    allowSearch: true,
    allowClear: true,
    getOptions: (term) => Promise.resolve(this.options.filter(o => !term || o.startsWith(term))),
    searchInputDelay: 300,
    searchPlaceholder: "Hledat..."
  }

  public selectBooleanConfig: ISelectConfig<boolean> = {
    allowClear: true,
    allowSearch: false,
    getOptions: async () => [true, false] 
  }

  public multiConfig: ISelectConfig<string> = {
    allowSearch: true,
    allowClear: true,
    multi: true,
    getOptions: (term) => Promise.resolve(this.options.filter(o => !term || o.startsWith(term))),
    searchInputDelay: 300,
    searchPlaceholder: "Hledat..."
  }

  public tableConfig: ITableConfig<string> = {
    allowRowClick: false,
    sort: {
      multi: true,
      mapGetFn: (columns) => columns.map(c => c.column)
    }
  }

  // Table sort
  public tableSort: ITableSortColumn[] = [
    { column: "Header1", direction: TableSortDirection.DESCENDING }
  ];

  // Input value
  public inputValue: string = "Some input value";

  public onTabIndexSelect(index) {
    this.activeTabIndex = index;
  }

  public onTwoTabsClick() {
    this.tabs = ['tab1', 'tab2'];
  }

  public onThreeTabsClick() {
    this.tabs = ['tab1', 'tab2', 'tab3'];
  }

  public onRowClick(event: any): void {
    console.log(event);
  }


  public onSortChange(event: any) {
    console.log(event);
  }

  public onInputLog(event: Event) {
    console.log(this.inputValue);
  }

  /**
   * On multi select value change
   * @param event 
   */
  public onMultiSelectValueChange(event: Event): void {
    console.log("On multi change", event);
  }
}
