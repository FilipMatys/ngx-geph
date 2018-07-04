// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { TableComponent } from './table.component';
import { TableRowComponent } from './components/row/row.component';
import { TableCellComponent } from './components/cell/cell.component';
import { TableHeaderComponent } from './components/header/header.component';
import { TableFooterComponent } from './components/footer/footer.component';

// Directives
import { TableColumnDefinitionDirective } from "./directives/column/column-definition.directive";
import { TableCellDefinitionDirective } from './directives/cell/cell-definition.directive';
import { TableHeaderDefinitionDirective } from './directives/header/header-definition.directive';
import { TableFooterDefinitionDirective } from './directives/footer/footer-definition.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    TableRowComponent,
    TableCellComponent,
    TableHeaderComponent,
    TableFooterComponent,
    TableColumnDefinitionDirective,
    TableCellDefinitionDirective,
    TableHeaderDefinitionDirective,
    TableFooterDefinitionDirective
  ],
  exports: [
    TableComponent,
    TableCellComponent,
    TableHeaderComponent,
    TableFooterComponent,
    TableColumnDefinitionDirective,
    TableCellDefinitionDirective,
    TableHeaderDefinitionDirective,
    TableFooterDefinitionDirective
  ]
})
export class TableModule { }
