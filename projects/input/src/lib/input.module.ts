// External modules
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

// Components
import { InputComponent } from './input.component';
import { InputPrefixComponent } from './components/prefix/prefix.component';
import { InputPostfixComponent } from './components/postfix/postfix.component';

// List of components
const COMPONENTS = [
  InputComponent,
  InputPrefixComponent,
  InputPostfixComponent
];

@NgModule({
  imports: [
    FormsModule
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class InputModule { }
