// External modules
import { Directive, ViewContainerRef } from "@angular/core";

@Directive({ selector: "[contentOutlet]" })
export class TabsContentOutlet {
    
    /**
     * Constructor
     * @param viewContainerRef 
     */
    constructor(public viewContainerRef: ViewContainerRef) {}
}