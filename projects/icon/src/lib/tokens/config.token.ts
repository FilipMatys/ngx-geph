// External modules
import { InjectionToken } from "@angular/core";

// Interfaces
import { IIconModuleConfig } from "../interfaces/icon.interfaces";

// Create injection token
export const ICON_CONFIG = new InjectionToken<IIconModuleConfig>("config");