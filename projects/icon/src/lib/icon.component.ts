// External modules
import { Component, Input, Inject } from '@angular/core';

// Interfaces
import { IIconModuleConfig } from './interfaces/icon.interfaces';

// Tokens
import { ICON_CONFIG } from './tokens/config.token';

@Component({
  selector: 'ngx-icon',
  templateUrl: "./icon.component.html"
})
export class IconComponent {

  // Icon name
  @Input("name")
  public name: string;

  // Icon type
  @Input("type")
  public type: string = "material";

  /**
   * Constructor
   * @param config 
   */
  constructor(@Inject(ICON_CONFIG) config: IIconModuleConfig) {
    // Check for config
    if (config && config.defaultType) {
      // Assign default type
      this.type = config.defaultType;
    }
  }
}