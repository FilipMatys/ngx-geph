// External modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Projects
import { SelectModule } from "select";
import { TabsModule } from "tabs";
import { AccordionModule } from "accordion";
import { PaginationModule } from "pagination";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SelectModule,
    TabsModule,
    AccordionModule,
    PaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
