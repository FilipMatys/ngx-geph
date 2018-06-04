// External modules
import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class CollapsibleService {

	// Collapse
	private collapseSource: Subject<string> = new Subject<string>();
	public collapse$: Observable<string> = this.collapseSource.asObservable();

	// Toggle
	private toggleSource: Subject<string> = new Subject<string>();
	public toggle$: Observable<string> = this.toggleSource.asObservable();

	// Expand
	private expandSource: Subject<string> = new Subject<string>();
	public expand$: Observable<string> = this.expandSource.asObservable();

	/**
	 * Collapse
	 * @param identifier 
	 */
	public collapse(identifier: string): void {
		this.collapseSource.next(identifier);
	}

	/**
	 * Toggle
	 * @param identifier 
	 */
	public toggle(identifier: string): void {
		this.toggleSource.next(identifier);
	}

	/**
	 * Expand
	 * @param identifier 
	 */
	public expand(identifier: string): void {
		this.expandSource.next(identifier);
	}
}
