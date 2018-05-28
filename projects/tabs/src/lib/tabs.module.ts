// External modules
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { TabsComponent } from './tabs.component';
import { TabsLabelComponent } from "./components/label/label.component";
import { TabsContentComponent } from "./components/content/content.component";

// Directives
import { TabDirective } from "./directives/tab/tab.directive";
import { TabLabelDirective } from "./directives/label/label.directive";
import { TabContentDirective } from "./directives/content/content.directive";

// Outlets
import { TabsContentOutlet } from "./outlets/content/content.outlet";

// List of components
const TABS_COMPONENTS = [
  TabsComponent,
  TabsLabelComponent,
  TabsContentComponent
];

// List of directives
const TABS_DIRECTIVES = [
  TabDirective,
  TabLabelDirective,
  TabContentDirective
];

// List of outlets
const TABS_OUTLETS = [
  TabsContentOutlet
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TABS_COMPONENTS,
    TABS_DIRECTIVES,
    TABS_OUTLETS
  ],
  exports: [
    TABS_COMPONENTS,
    TABS_DIRECTIVES
  ]
})
export class TabsModule { }
