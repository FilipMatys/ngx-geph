// External modules
import { Directive, ContentChild, Input, TemplateRef } from "@angular/core";

// Directives
import { TableHeaderDefinitionDirective } from "../header/header-definition.directive";
import { TableCellDefinitionDirective } from "../cell/cell-definition.directive";
import { TableFooterDefinitionDirective } from "../footer/footer-definition.directive";

@Directive({
    selector: "[ngxColumnDefinition]",
})
export class TableColumnDefinitionDirective {

    // Identifier
    @Input("ngxColumnDefinition")
    public identifier: string;

    // Header definition
    @ContentChild(TableHeaderDefinitionDirective, { read: TemplateRef, static: false })
    public header: TemplateRef<any>;

    // Cell definition
    @ContentChild(TableCellDefinitionDirective, { read: TemplateRef, static: false })
    public cell: TemplateRef<any>;

    // Footer definition
    @ContentChild(TableFooterDefinitionDirective, { read: TemplateRef, static: false })
    public footer: TemplateRef<any>;
}