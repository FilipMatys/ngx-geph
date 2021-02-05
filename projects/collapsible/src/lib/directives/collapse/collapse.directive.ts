// External modules
import { Directive, TemplateRef, ViewContainerRef, Input, Renderer2, HostBinding } from "@angular/core";

// Services
import { CollapsibleService } from "../../collapsible.service";

@Directive({
    selector: "[ngxCollapsibleCollapse]"
})
export class CollapseDirective {

    @Input("ngxCollapsibleCollapse")
    public identifier: string = "default";

    @HostBinding("class.ngx-collapsible-collapse")
    public hasDefaultClass: boolean = true;

    /**
     * Constructor
     * @param collapsibleService 
     * @param templateRef 
     * @param viewContainerRef 
     * @param renderer
     */
    constructor(
        private readonly service: CollapsibleService,
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly renderer: Renderer2
    ) {
        // Create view
        const element = this.viewContainerRef.createEmbeddedView(this.templateRef).rootNodes[0];

        // Listen to click event
        this.renderer.listen(element, "click", (e) => this.collapse(e));
    }

    /**
     * Collapse
     * @param event 
     */
    private collapse(event: Event): void {
        // Emit collapse
        this.service.collapse(this.identifier);
    }
}