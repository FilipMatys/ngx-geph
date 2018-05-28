// External modules
import { Component, OnInit, ContentChild, AfterContentInit, Input } from '@angular/core';

// Components
import { PaginationFirstComponent } from "./components/first/first.component";
import { PaginationLastComponent } from "./components/last/last.component";
import { PaginationPrevComponent } from "./components/prev/prev.component";
import { PaginationNextComponent } from "./components/next/next.component";

@Component({
  selector: 'ngx-pagination',
  templateUrl: "./pagination.component.html"
})
export class PaginationComponent implements AfterContentInit {

  // Current value
  @Input("value")
  public value: number;

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
   * On first click
   * @param event 
   */
  private onFirstClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();
  }

  /**
   * On last click
   * @param event 
   */
  private onLastClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();
  }

  /**
   * On prev click
   * @param event 
   */
  private onPrevClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();
  }

  /**
   * On next click
   * @param event 
   */
  private onNextClick(event: Event) {
    // Stop event propagation
    event.stopPropagation();
  }
}
