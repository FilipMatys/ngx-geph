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
import { TableModule } from "table";
import { CardModule } from "card";
import { InputModule } from "input";
import { LayoutModule } from "layout";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SelectModule,
    InputModule,
    TabsModule,
    FormsModule,
    LayoutModule,
    //CalendarModule,
    AccordionModule,
    PaginationModule,
    TableModule.forRoot({
      allowRowClick: false,
      sort: {
        allow: true
      }
    }),
    ListModule,
    CardModule,
    CollapsibleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
