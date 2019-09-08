// External modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from "@angular/common";

// Components
import { IconComponent } from './icon.component';

// Interfaces
import { IIconModuleConfig } from './interfaces/icon.interfaces';

// Tokens
import { ICON_CONFIG } from './tokens/config.token';

@NgModule({
  imports: [CommonModule],
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule { 

  /**
   * Configure module
   * @param config 
   */
  public static configure(config: IIconModuleConfig): ModuleWithProviders {
    return {
      ngModule: IconModule,
      providers: [
        { provide: ICON_CONFIG, useValue: config }
      ]
    }
  }
}
