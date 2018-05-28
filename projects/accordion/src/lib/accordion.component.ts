// External modules
import { Component, Input } from '@angular/core';

// Components
import { AccordionItemComponent } from "./components/item/item.component";

@Component({
  selector: 'ngx-accordion',
  template: '<ng-content select="ngx-accordion-item"></ng-content>',
  styles: []
})
export class AccordionComponent {

  // List of accordion items
  private items: AccordionItemComponent[] = [];

  // Single item flag
  @Input("single")
  public isOnlySingleItemAllowed: boolean = false;

  /**
   * On item click
   * @param event 
   * @param item 
   */
  public onItemClick(event: Event, item: AccordionItemComponent) {
    // Stop event propagation
    event.stopPropagation();

    // Set item to be active
    item.isActive = !item.isActive;

    // Check whether only single item is allowed
    if (!item.isActive && !this.isOnlySingleItemAllowed) {
      return;
    }

    // Close other items
    this.items.forEach((i) => {
      // Check if is the same item
      if (i === item) {
        return;
      }

      // Make inactive
      i.isActive = false;
    });
  }  

  /**
   * Register accordion item
   * @param item 
   */
  public register(item: AccordionItemComponent) {
    // Add item to list
    this.items.push(item);
  }

  /**
   * Unregister item
   * @param item 
   */
  public unregister(item: AccordionItemComponent) {
    // Get item
    const index = this.items.indexOf(item);

    // Check if index is set
    if (index === -1) {
      return;
    }

    // Remove item
    this.items.splice(index, 1);
  }
}
