// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { SelectComponent } from "./select.component";
import { SelectOptionComponent } from "./components/option/option.component";
import { SelectValueComponent } from "./components/value/value.component";
import { SelectEmptyComponent } from "./components/empty/empty.component";
import { SelectLoadingComponent } from "./components/loading/loading.component";
import { SelectToggleComponent } from "./components/toggle/toggle.component";
import { SelectClearComponent } from "./components/clear/clear.component";

// Pipes
import { SelectIsUndefinedPipe } from "./pipes/undefined.pipe";

// Directives
import { SelectOptionDirective } from "./directives/option.directive";
import { SelectValueDirective } from "./directives/value.directive";
import { SelectClearDirective } from "./directives/clear.directive";
import { SelectToggleDirective } from "./directives/toggle.directive";

// List of pipes
const SELECT_PIPES = [
  SelectIsUndefinedPipe
]
 
// List of components
const SELECT_COMPONENTS = [
  SelectComponent,
  SelectOptionComponent,
  SelectValueComponent,
  SelectEmptyComponent,
  SelectLoadingComponent,
  SelectClearComponent,
  SelectToggleComponent
];

// List of directives
const SELECT_DIRECTIVES = [
  SelectValueDirective,
  SelectOptionDirective,
  SelectClearDirective,
  SelectToggleDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SELECT_COMPONENTS,
    SELECT_DIRECTIVES,
    SELECT_PIPES
  ],
  exports: [
    SELECT_COMPONENTS,
    SELECT_DIRECTIVES
  ]
})
export class SelectModule { }
