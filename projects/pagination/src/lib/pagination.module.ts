// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { PaginationComponent } from './pagination.component';
import { PaginationPageComponent } from "./components/page/page.component";
import { PaginationFirstComponent } from './components/first/first.component';
import { PaginationLastComponent } from './components/last/last.component';
import { PaginationPrevComponent } from './components/prev/prev.component';
import { PaginationNextComponent } from './components/next/next.component';

// List of components
export const COMPONENTS = [
  PaginationComponent,
  PaginationPageComponent,
  PaginationFirstComponent,
  PaginationLastComponent,
  PaginationPrevComponent,
  PaginationNextComponent
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class PaginationModule { }
