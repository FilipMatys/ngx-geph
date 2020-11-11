import { Component } from '@angular/core';
import { ISelectConfig } from 'select';
import { ITableConfig, TableSortDirection, ITableSortColumn } from "table";
import { ISpreadsheetColumns, ISpreadsheetData, SpreadsheetFontWeight, SpreadsheetTextAlign, ISpreadsheetRows, SpreadsheetRowsMode, SpreadsheetDataType } from "spreadsheet";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DecimalPipe]
})
export class AppComponent {
  title = 'ngx';

  public spreadsheetColumns: ISpreadsheetColumns = [
    {
      label: "A",
      isReadonly: false,
      dataType: SpreadsheetDataType.NUMBER,
      formatterFn: (value) => this.decimal.transform(value, "1.2-2"),
      style: {
        textAlign: SpreadsheetTextAlign.RIGHT
      }
    },
    {
      label: "B",
      isDisabled: false,
      formatterFn: (value) => "-"
    },
    {
      label: "C",
      style: {
        fontWeight: SpreadsheetFontWeight.BOLDER,
        textAlign: SpreadsheetTextAlign.CENTER
      }
    }
  ];

  public spreadsheetData: ISpreadsheetData<any> = [
    {
      a: 25,
      b: "458",
      c: 47
    },
    {
      a: 29,
      c: 11
    }
  ]

  public spreadsheetRows: ISpreadsheetRows = {
    mode: SpreadsheetRowsMode.DYNAMIC
  }

  public options: string[] = ['Hello', 'Mr', 'Frodo'];

  public selectValue: string = 'Hello';

  public booleanSelectValue: boolean = true;

  public multiSelectValue: string[];

  public activeTabIndex: number = 0;

  public currentPage: number = 3;

  public tabs: string[] = ['tab1', 'tab2', 'tab3'];

  public onSelectComponentModelChange(event): void {
    console.log("onSelectComponentModelChange", event);
  }

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

  /**
   * Constructor
   * @param decimal 
   */
  constructor(private readonly decimal: DecimalPipe) {}

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

  public onCellChange(event): void {
    console.log(event);
  }

  /**
   * On multi select value change
   * @param event 
   */
  public onMultiSelectValueChange(event: Event): void {
    console.log("On multi change", event);
  }
}
