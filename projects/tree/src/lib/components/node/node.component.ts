// External modules
import { Component, HostBinding, Input, TemplateRef } from "@angular/core";

// Interfaces
import { ITreeNode } from "../../interfaces/node.interface";
import { ITreeConfig } from "../../interfaces/config.interface";

// Directives
import { TreeNodeContentDirective } from "../../directives/content/content.directive";

@Component({
    selector: "ngx-tree-node",
    templateUrl: "./node.component.html",
    styleUrls: ["./node.component.scss"]
})
export class TreeNodeComponent {

    @Input("node")
    public node: ITreeNode;

    @Input("parent")
    public parent: ITreeNode;

    @Input("index")
    public index: number;

    @Input("level")
    public level: number;

	@Input("config")
	public config: ITreeConfig;

    @HostBinding("class.ngx-tree-node")
    public hasDefaultClass: boolean = true;

    @HostBinding("class.ngx-tree-node--expanded")
    public get isExpanded(): boolean { return this.node.isExpanded; }  

    @HostBinding("class.ngx-tree-node--collapsed")
    public get isCollapsed(): boolean { return !this.node.isExpanded; } 
    
    @HostBinding("class.ngx-tree-node--hidden")
    public get isHidden(): boolean { return this.node.isHidden; };
    
    @HostBinding("class.ngx-tree-node--visible")
    public get isVisible(): boolean { return !this.node.isHidden; };

	// Content template
    @Input("contentTemplate")
	public contentTemplate: TemplateRef<TreeNodeContentDirective>;
}