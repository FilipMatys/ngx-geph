// External modules
import { InjectionToken } from "@angular/core";

// Interfaces
import { ITableConfig } from "../interfaces/config.interface";

// Config token
export const CONFIG = new InjectionToken<ITableConfig<any>>("config");