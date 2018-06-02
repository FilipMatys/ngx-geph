// External modules
import { NgModule } from '@angular/core';

// Components
import { ListComponent } from './list.component';
import { ListItemComponent } from "./components/item/item.component";
import { ListHeaderComponent } from './components/header/header.component';
import { ListGroupComponent } from './components/group/group.component';
import { ListDividerComponent } from './components/divider/divider.component';

// List of components
const COMPONENTS = [
  ListComponent,
  ListItemComponent,
  ListHeaderComponent,
  ListGroupComponent,
  ListDividerComponent
];

@NgModule({
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ]
})
export class ListModule { }
