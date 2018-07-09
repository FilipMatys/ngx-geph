// External modules
import { NgModule } from '@angular/core';

// Components
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './components/header/header.component';
import { CardContentComponent } from './components/content/content.component';
import { CardFooterComponent } from './components/footer/footer.component';

// List of components
const COMPONENTS = [
  CardComponent,
  CardHeaderComponent,
  CardContentComponent, 
  CardFooterComponent
];

@NgModule({
  imports: [
  ],
  declarations: [COMPONENTS],
  exports: [COMPONENTS]
})
export class CardModule { }
