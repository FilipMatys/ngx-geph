// Component
import { Component, Input, HostBinding, OnInit, Inject, OnDestroy } from "@angular/core";

// Parent component
import { AccordionComponent } from "../../accordion.component";

@Component({
    selector: "ngx-accordion-item",
    template: `
        <ng-content select="ngx-accordion-heading"></ng-content>
        <ng-container *ngIf="isActive">
            <ng-content select="ngx-accordion-content"></ng-content>
        </ng-container>
    `
})
export class AccordionItemComponent implements OnInit, OnDestroy {

    // Active flag
    @Input("active")
    @HostBinding("class.active")
    public isActive: boolean = false;

    @Input("disabled")
    @HostBinding("class.disabled")
    public isDisabled: boolean = false;

    /**
     * Constructor
     * @param accordion 
     */
    constructor(@Inject(AccordionComponent) private accordion: AccordionComponent) {}

    /**
     * On init hook
     */
    public ngOnInit(): any {
        // Add itself to accordion
        this.accordion.register(this);
    }

    /**
     * On heading click
     * @param event 
     */
    public onHeadingClick(event: Event) {
        // Check if item is disabled
        if (this.isDisabled) {
            return;
        }

        // Propagate event
        this.accordion.onItemClick(event, this);
    }

    /**
     * On destroy hook
     */
    public ngOnDestroy(): any {
        // Remove itself from accordion
        this.accordion.unregister(this);
    }
}