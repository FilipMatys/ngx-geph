// External modules
import { Component, ContentChild, ElementRef, HostBinding, Renderer2 } from "@angular/core";

// Directives
import { TooltipCloseDirective } from "../../directives/close.directive";

@Component({
    selector: "ngx-tooltip",
    templateUrl: "./tooltip.component.html",
    styleUrls: ["./tooltip.component.scss"]
})
export class TooltipComponent {

    @HostBinding("class.ngx-tooltip")
    public hasDefaultClass: boolean = true;

    // Tooltip close directive
    @ContentChild(TooltipCloseDirective, { read: ElementRef })
    public closeElementRef: ElementRef;

    // Visibility flag
    private _isVisible: boolean = false;

    @HostBinding("class.ngx-tooltip--visible")
    public get isVisible(): boolean { return this._isVisible };

    @HostBinding("class.ngx-tooltip--hidden")
    public get isHidden(): boolean { return !this._isVisible; };

    // Close listener
    public closeListener: () => void;

    /**
     * Constructor
     * @param renderer 
     */
    constructor(private readonly renderer: Renderer2) { }

    /**
     * Toggle tooltip
     */
    public async toggle(): Promise<void> {
        // Toggle based on visible flag
        await (this._isVisible ? this.hide() : this.show());
    }

    /**
     * Show tooltip
     */
    public async show(): Promise<void> {
        // Set as visible
        this._isVisible = true;

        // Check for close ref
        if (this.closeElementRef) {
            // Attach listener
            this.closeListener = this.renderer.listen(this.closeElementRef.nativeElement, "click", (event) => this.hide() as any);
        }
    }

    /**
     * Hide tooltip
     */
    public async hide(): Promise<void> {
        // Set as invisible
        this._isVisible = false;

        // Call close listener
        this.closeListener && this.closeListener();
    }
}