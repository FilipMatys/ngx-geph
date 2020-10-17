// External modules
import { Directive, Input, ContentChild, TemplateRef } from "@angular/core";

// Directives
import { TabLabelDirective } from "../label/label.directive";
import { TabContentDirective } from "../content/content.directive";

@Directive({
    selector: "[ngxTab]"
})
export class TabDirective {

    // Tab
    @Input("ngxTab")
    public name: string;

    @ContentChild(TabLabelDirective, { read: TemplateRef, static: false })
    public label: TemplateRef<any>;

    @ContentChild(TabContentDirective, { read: TemplateRef, static: false })
    public content: TemplateRef<any>;
}