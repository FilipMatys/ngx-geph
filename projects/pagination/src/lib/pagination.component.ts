// External modules
import { Component, OnInit, ContentChild, AfterContentInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

// Data
import { IPageChangeEvent } from "./interfaces/pagination.interfaces";

// Components
import { PaginationFirstComponent } from "./components/first/first.component";
import { PaginationLastComponent } from "./components/last/last.component";
import { PaginationPrevComponent } from "./components/prev/prev.component";
import { PaginationNextComponent } from "./components/next/next.component";

@Component({
  selector: 'ngx-pagination',
  templateUrl: "./pagination.component.html"
})
export class PaginationComponent implements OnChanges, AfterContentInit {

  // Current value
  @Input("value")
  public value: number = 1;

  // Size
  @Input("size")
  public size: number = 10;

  // Total
  @Input("total")
  public total: number = 1;

  // List of pages
  public pages: number[] = [];

  // Page change event
  @Output("pageChange")
  public pageChange: EventEmitter<IPageChangeEvent> = new EventEmitter<IPageChangeEvent>();

  // First button
  @ContentChild(PaginationFirstComponent)
  public first: PaginationFirstComponent;

  // Last button
  @ContentChild(PaginationLastComponent)
  public last: PaginationLastComponent;

  // Prev button
  @ContentChild(PaginationPrevComponent)
  public prev: PaginationPrevComponent;

  // Next button
  @ContentChild(PaginationNextComponent)
  public next: PaginationNextComponent;

  /**
   * After content init hook
   */
  public ngAfterContentInit(): void {
    // Check for first 
    if (this.first) {
      this.first.firstClick.subscribe((event) => this.onFirstClick(event));
    }

    // Check for last
    if (this.last) {
      this.last.lastClick.subscribe((event) => this.onLastClick(event));
    }

    // Check for prev
    if (this.prev) {
      this.prev.prevClick.subscribe((event) => this.onPrevClick(event));
    }

    // Check for next
    if (this.next) {
      this.next.nextClick.subscribe((event) => this.onNextClick(event));
    }
  }

  /**
   * On changes hook
   */
  public ngOnChanges(): void {
    // Build pagination
    this.build();
  }

  /**
   * On page click
   * @param event 
   * @param page 
   */
  public onPageClick(event: Event, page: number) {
    // Stop event propagation
    event.stopPropagation();

    // Set original
    const original: number = this.value;

    // Set page
    this.value = page;

    // Rebuild
    this.build();

    // Emit change
    this.pageChange.emit({
      from: original,
      to: this.value
    });
  }

  /**
   * On first click
   * @param event 
   */
  private onFirstClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();

    // Check value
    if (this.value === 1) {
      return;
    }

    // Original
    const original: number = this.value;

    // Assign value
    this.value = 1;

    // Rebuild
    this.build();

    // Emit change
    this.pageChange.emit({
      from: original,
      to: this.value
    });
  }

  /**
   * On last click
   * @param event 
   */
  private onLastClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();

    // Check value
    if (this.value === this.total) {
      return;
    }

    // Original
    const original: number = this.value;

    // Assign value
    this.value = this.total;

    // Rebuild
    this.build();

    // Emit change
    this.pageChange.emit({
      from: original,
      to: this.value
    });
  }

  /**
   * On prev click
   * @param event 
   */
  private onPrevClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();

    // Check value
    if (this.value === 1) {
      return;
    }

    // Change value
    this.value = this.value - 1;

    // Rebuild
    this.build();

    // Emit change
    this.pageChange.emit({
      from: this.value + 1,
      to: this.value
    });
  }

  /**
   * On next click
   * @param event 
   */
  private onNextClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();

    // Check value
    if (this.value === this.total) {
      return;
    }

    // Change value
    this.value = this.value + 1;

    // Rebuild
    this.build();

    // Emit change
    this.pageChange.emit({
      from: this.value - 1,
      to: this.value
    });
  }

  /**
   * Build pagination
   */
  private build() {
    // Get starting number
    let start = this.value - Math.floor(this.size / 2);

    // If start if lower than 1, set it to 1
    if (start < 1) {
      start = 1;
    }

    // Also get maximum number
    let max: number = this.total - this.size + 1;
    
    // Normalize max
    if (max < 0) {
      max = 1;
    }

    // Check start
    if (start > max) {
      start = max;
    }

    // Reset pages
    this.pages = [];

    // Create list of pages
    for (let page = start, index = 0; index < this.size && page <= this.total ; page++, index++) {
      this.pages.push(page);
    }
  }
}
