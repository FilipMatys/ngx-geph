// External modules
import { Directive, HostListener, Input } from "@angular/core";

// Components
import { TooltipComponent } from "../components/tooltip/tooltip.component";

@Directive({
    selector: "[ngx-tooltip]"
})
export class TooltipDirective {

    @Input("ngx-tooltip")
    private tooltip: TooltipComponent;

    @HostListener("click", ["$event"])
    public onClick(event: Event): void {
        // Toggle 
        this.toggle();
    }

    /**
     * Toggle tooltip
     */
    public async toggle(): Promise<void> {
        // Check for tooltip
        if (!this.tooltip) {
            // Do nothing
            return;
        }

        // Toggle tooltip
        await this.tooltip.toggle();
    }

    /**
     * Show tooltip
     */
    public async show(): Promise<void> {
        // Check for tooltip
        if (!this.tooltip) {
            // Do nothing
            return;
        }

        // Show tooltip
        await this.tooltip.show();
    }

    /**
     * Hide tooltip
     */
    public async hide(): Promise<void> {
        // Check for tooltip
        if (!this.tooltip) {
            // Do nothing
            return;
        }

        // Hide tooltip
        await this.tooltip.hide();
    }
}