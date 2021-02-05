// External modules
import { Directive, TemplateRef, ViewContainerRef, Input, Renderer2, HostBinding } from "@angular/core";

// Services
import { CollapsibleService } from "../../collapsible.service";

@Directive({
    selector: "[ngxCollapsibleExpand]"
})
export class ExpandDirective {

    @Input("ngxCollapsibleExpand")
    public identifier: string = "default";

    @HostBinding("class.ngx-collapsible-expand")
    public hasDefaultClass: boolean = true;

    /**
     * Constructor
     * @param service 
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
        this.renderer.listen(element, "click", (e) => this.expand(e));
    }

    /**
     * Expand
     * @param event 
     */
    private expand(event: Event): void {
        // Emit expand
        this.service.expand(this.identifier);
    }
}