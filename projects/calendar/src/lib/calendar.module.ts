// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { CalendarComponent } from './calendar.component';
import { CalendarDayComponent } from './components/day/day.component';
import { CalendarWeekComponent } from './components/week/week.component';
import { CalendarLabelComponent } from './components/label/label.component';
import { CalendarHeaderComponent } from './components/header/header.component';
import { CalendarDayDirective } from './directives/day/day.directive';
import { CalendarLabelDirective } from './directives/label/label.directive';
import { CalendarPrevDirective } from './directives/prev/prev.directive';
import { CalendarNextDirective } from './directives/next/next.directive';
import { CalendarCurrentDirective } from './directives/current/current.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CalendarComponent,
    CalendarDayComponent,
    CalendarWeekComponent,
    CalendarLabelComponent,
    CalendarHeaderComponent,
    CalendarDayDirective,
    CalendarLabelDirective,
    CalendarPrevDirective,
    CalendarNextDirective,
    CalendarCurrentDirective
  ],
  exports: [
    CalendarComponent,
    CalendarDayDirective,
    CalendarLabelDirective,
    CalendarPrevDirective,
    CalendarNextDirective,
    CalendarCurrentDirective
  ]
})
export class CalendarModule { }
