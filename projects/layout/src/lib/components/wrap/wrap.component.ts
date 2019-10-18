// External components
import { Component, Input, HostBinding } from "@angular/core";

// Enums
import { Orientation } from "../../enums/orientation.enum";

@Component({
    selector: "ngx-wrap-layout",
    templateUrl: "./wrap.component.html",
    styleUrls: ["./wrap.component.scss"]
})
export class WrapComponent {

    /**
     * Orientation
     */
    @Input("orientation")
    @HostBinding("class")
    public orientation: string = Orientation.Horizontal;

}