// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// Components
import { PaginationComponent } from './pagination.component';
import { PaginationPageComponent } from "./components/page/page.component";
import { PaginationFirstComponent } from './components/first/first.component';
import { PaginationLastComponent } from './components/last/last.component';
import { PaginationPrevComponent } from './components/prev/prev.component';
import { PaginationNextComponent } from './components/next/next.component';
import { PaginationSummaryComponent } from './components/summary/summary.component';

// List of components
export const COMPONENTS = [
  PaginationComponent,
  PaginationPageComponent,
  PaginationFirstComponent,
  PaginationLastComponent,
  PaginationPrevComponent,
  PaginationNextComponent,
  PaginationSummaryComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class PaginationModule { }
