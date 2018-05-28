// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './components/item/item.component';
import { AccordionHeadingComponent } from './components/heading/heading.component';
import { AccordionContentComponent } from './components/content/content.component';

// Components
export const COMPONENTS = [
  AccordionComponent,
  AccordionItemComponent,
  AccordionHeadingComponent,
  AccordionContentComponent
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class AccordionModule { }
