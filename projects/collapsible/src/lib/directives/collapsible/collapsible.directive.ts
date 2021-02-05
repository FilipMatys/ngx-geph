// External modules
import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef, HostBinding } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

// Services
import { CollapsibleService } from "../../collapsible.service";

@Directive({
    selector: "[ngxCollapsible]"
})
export class CollapsibleDirective implements OnInit, OnDestroy {

    // Toggle subscription
    private toggleSubscription: Subscription;
    // Collapse subscription
    private collapseSubscription: Subscription;
    // Expand subscription
    private expandSubscription: Subscription;

    // Collapsible identifier
    @Input("ngxCollapsible")
    public identifier: string = "default";

    // Init collapsible as collapsed
    @Input("ngxCollapsibleIsCollapsedAsDefault")
    public isCollapsedAsDefault: boolean = false;

    @HostBinding("class.ngx-collapsible")
    public hasDefaultClass: boolean = true;

    /**
     * Constructor
     * @param service 
     * @param templateRef 
     * @param viewContainerRef 
     */
    constructor(
        private readonly service: CollapsibleService,
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainerRef: ViewContainerRef
    ) { }

    /**
     * On init hook
     */
    public ngOnInit(): void {
        // Check default collapsible state
        if (!this.isCollapsedAsDefault) {
            // Create view
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }

        // Subscribe to collapse
        this.collapseSubscription = this.service.collapse$
            .pipe(filter(identifier => identifier === this.identifier))
            .subscribe(() => this.onCollapse());

        // Subscribe to toggle
        this.toggleSubscription = this.service.toggle$
            .pipe(filter(identifier => identifier === this.identifier))
            .subscribe(() => this.onToggle());

        // Subscribe to expand
        this.expandSubscription = this.service.expand$
            .pipe(filter(identifier => identifier === this.identifier))
            .subscribe(() => this.onExpand());
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy() {
        // Unsubscribe
        this.collapseSubscription && this.collapseSubscription.unsubscribe();
        this.toggleSubscription && this.toggleSubscription.unsubscribe();
        this.expandSubscription && this.expandSubscription.unsubscribe();
    }

    /**
     * On collapse
     */
    private onCollapse() {
        // Clear view container
        this.viewContainerRef.clear();
    }

    /**
     * On toggle
     */
    private onToggle() {
        // Check if there are any views attached
        if (this.viewContainerRef.length) {
            return this.viewContainerRef.clear();
        }

        // Create view
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

    /**
     * On expand
     */
    private onExpand() {
        // Check if there are any views attached
        if (this.viewContainerRef.length) {
            // Do nothing
            return;
        }

        // Create view
        this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
}