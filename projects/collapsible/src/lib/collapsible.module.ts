// External modules
import { NgModule } from '@angular/core';

// Directives
import { CollapsibleDirective } from './directives/collapsible/collapsible.directive';
import { ToggleDirective } from './directives/toggle/toggle.directive';
import { ExpandDirective } from './directives/expand/expand.directive';
import { CollapseDirective } from './directives/collapse/collapse.directive';

// List of directives
const DIRECTIVES = [
  CollapsibleDirective,
  ToggleDirective,
  ExpandDirective,
  CollapseDirective
];

@NgModule({
  declarations: [DIRECTIVES],
  exports: [DIRECTIVES]
})
export class CollapsibleModule { }
