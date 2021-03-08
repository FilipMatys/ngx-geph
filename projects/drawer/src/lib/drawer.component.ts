// External modules
import { Component, HostBinding, Input, NgZone, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { BehaviorSubject, fromEvent, Subscription } from "rxjs";

// Enums
import { DrawerState } from "./enums/state.enum";

@Component({
	selector: "ngx-drawer",
	templateUrl: "./drawer.component.html",
	styleUrls: ["./drawer.component.scss"]
})
export class DrawerComponent implements OnInit, OnDestroy {

	// Default component class
	@HostBinding("class.ngx-drawer")
	public hasDefaultClass: boolean = true;

	// Expanded flag
	@HostBinding("class.ngx-drawer--expanded")
	public get isExpanded(): boolean {
		return this.state$.value === DrawerState.EXPANDED;
	}

	// Expanding flag
	@HostBinding("class.ngx-drawer--expanding")
	public get isExpanding(): boolean {
		return this.state$.value === DrawerState.EXPANDING;
	}

	// Collapsed flag
	@HostBinding("class.ngx-drawer--collapsed")
	public get isCollapsed(): boolean {
		return this.state$.value === DrawerState.COLLAPSED;
	}

	// Collapsing flag
	@HostBinding("class.ngx-drawer--collapsing")
	public get isCollapsing(): boolean {
		return this.state$.value === DrawerState.COLLAPSING;
	}

	@Input("collapsingDuration")
	public collapsingDuration: number = 200;

	@Input("expandingDuration")
	public expandingDuration: number = 200;

	@Input("overlay")
	public overlayElement: HTMLElement;

	// State
	private readonly state$: BehaviorSubject<number> = new BehaviorSubject<number>(DrawerState.COLLAPSED);

	// Overlay click subscription
	private overlayClickSubscription: Subscription;

	/**
	 * Constructor
	 * @param ngZone
	 * @param renderer 
	 */
	constructor(
		private readonly ngZone: NgZone,
		private readonly renderer: Renderer2
	) { }

	/**
	 * On init hook
	 */
	public ngOnInit(): void {
		// Register to overlay
		this.registerOverlay();
	}

	/**
	 * On destroy hook
	 */
	public ngOnDestroy(): void {
		// Unsubscribe
		this.overlayClickSubscription && this.overlayClickSubscription.unsubscribe();
	}

	/**
	 * Collapse side nav
	 */
	public collapse(): void {
		// Only allow collapse when state is expanded
		if (this.state$.value !== DrawerState.EXPANDED) {
			// Nothing to do
			return;
		}

		// Emit collapsing state
		this.state$.next(DrawerState.COLLAPSING);

		// Collapse with timeout
		setTimeout(() => this.state$.next(DrawerState.COLLAPSED), this.collapsingDuration);
	}

	/**
	 * Expand side nav
	 */
	public expand(): void {
		// Only allow expand when state is collapsed
		if (this.state$.value !== DrawerState.COLLAPSED) {
			// Nothing to do
			return;
		}

		// Emit collapsing state
		this.state$.next(DrawerState.EXPANDING);

		// Collapse with timeout
		setTimeout(() => this.state$.next(DrawerState.EXPANDED), this.expandingDuration);
	}

	/**
	 * Toggle navigation
	 */
	public toggle(): void {
		// Check state
		switch (this.state$.value) {
			// Expanded
			case DrawerState.EXPANDED:
				// Collapse
				return this.collapse();

			// Collapsed
			case DrawerState.COLLAPSED:
				// Expand
				return this.expand();
		}
	}

	/**
	 * Register to overlay
	 */
	private async registerOverlay(): Promise<void> {
		// Check if overlay is set
		if (!this.overlayElement) {
			// Nothing to do
			return;
		}

		// Add default class to overlay
		this.renderer.addClass(this.overlayElement, "ngx-drawer-overlay");

		// Register to drawer events
		this.state$.subscribe((state) => {
			// Check state
			switch (state) {
				// Collapsed
				case DrawerState.COLLAPSED:
					// Remove classes
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsing");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanding");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanded");

					// Add class 
					this.renderer.addClass(this.overlayElement, "ngx-drawer-overlay--collapsed");

					// Unsubscribe from click subscription
					this.overlayClickSubscription && this.overlayClickSubscription.unsubscribe();
					break;

				// Collapsing
				case DrawerState.COLLAPSING:
					// Remove classes
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsed");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanding");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanded");

					// Add class 
					this.renderer.addClass(this.overlayElement, "ngx-drawer-overlay--collapsing");
					break;

				// Expanded
				case DrawerState.EXPANDED:
					// Remove classes
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsing");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsed");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanding");

					// Add class 
					this.renderer.addClass(this.overlayElement, "ngx-drawer-overlay--expanded");

					// Add click event to collapse drawer
					this.overlayClickSubscription = this.ngZone.runOutsideAngular(() => fromEvent(this.overlayElement, "click")
						.subscribe(() => this.ngZone.run(() => this.collapse())));
					break;

				// Expanding
				case DrawerState.EXPANDING:
					// Remove classes
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsing");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--collapsed");
					this.renderer.removeClass(this.overlayElement, "ngx-drawer-overlay--expanded");

					// Add class 
					this.renderer.addClass(this.overlayElement, "ngx-drawer-overlay--expanding");
					break;
			}
		});
	}
}
