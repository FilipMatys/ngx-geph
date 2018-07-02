// External modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

// Projects
import { SelectModule } from "select";
import { TabsModule } from "tabs";
import { AccordionModule } from "accordion";
import { PaginationModule } from "pagination";
import { ListModule } from "list";
import { CollapsibleModule } from "collapsible";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SelectModule,
    TabsModule,
    FormsModule,
    AccordionModule,
    PaginationModule,
    ListModule,
    CollapsibleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
