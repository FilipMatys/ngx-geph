// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { SelectComponent } from "./select.component";
import { SelectOptionComponent } from "./components/option/option.component";
import { SelectValueComponent } from "./components/value/value.component";
import { SelectEmptyComponent } from "./components/empty/empty.component";
import { SelectLoadingComponent } from "./components/loading/loading.component";
import { SelectClearComponent } from "./components/clear/clear.component";

// Directives
import { SelectOptionDirective } from "./directives/option.directive";
import { SelectValueDirective } from "./directives/value.directive";

// List of components
const SELECT_COMPONENTS = [
  SelectComponent,
  SelectOptionComponent,
  SelectValueComponent,
  SelectEmptyComponent,
  SelectLoadingComponent,
  SelectClearComponent
];

// List of directives
const SELECT_DIRECTIVES = [
  SelectValueDirective,
  SelectOptionDirective
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SELECT_COMPONENTS,
    SELECT_DIRECTIVES
  ],
  exports: [
    SELECT_COMPONENTS,
    SELECT_DIRECTIVES
  ]
})
export class SelectModule { }
