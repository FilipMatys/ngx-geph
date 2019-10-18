// External components
import { Component, Input, HostBinding } from "@angular/core";

// Enums
import { Orientation } from "../../enums/orientation.enum";

@Component({
    selector: "ngx-stack-layout",
    templateUrl: "./stack.component.html",
    styleUrls: ["./stack.component.scss"]
})
export class StackComponent {

    /**
     * Orientation
     */
    @Input("orientation")
    @HostBinding("class")
    public orientation: string = Orientation.Horizontal;

}