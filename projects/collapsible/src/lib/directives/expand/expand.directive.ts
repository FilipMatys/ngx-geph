// External modules
import { Directive, TemplateRef, ViewContainerRef, Input, Renderer } from "@angular/core";

// Services
import { CollapsibleService } from "../../collapsible.service";

@Directive({
    selector: "[ngxCollapsibleExpand]"
})
export class ExpandDirective {

    @Input("ngxCollapsibleExpand")
    public identifier: string = "default";
    
    /**
     * Constructor
     * @param collapsibeService 
     * @param templateRef 
     * @param viewContainerRef 
     * @param renderer
     */
    constructor(
        private collapsibeService: CollapsibleService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer
    ) { 
        // Create view
        let element = this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];

        // Listen to click event
        this.renderer.listen(element, "click", (e) => this.onClick(e));
    }

    /**
     * On click
     * @param event 
     */
    private onClick(event: Event) {
        // Emit expand
        this.collapsibeService.expand(this.identifier);
    }
}