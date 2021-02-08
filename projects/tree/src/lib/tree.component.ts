// External modules
import { Component, ContentChild, HostBinding, Input, TemplateRef } from "@angular/core";

// Interfaces
import { ITreeNode } from "./interfaces/node.interface";
import { ITreeConfig } from "./interfaces/config.interface";

// Directives
import { TreeNodeContentDirective } from "./directives/content/content.directive";

@Component({
	selector: "ngx-tree",
	templateUrl: "./tree.component.html",
	styleUrls: ["./tree.component.scss"]
})
export class TreeComponent {

	@Input("nodes")
	public nodes: ITreeNode[] = [];

	@Input("config")
	public config: ITreeConfig;

	@HostBinding("class.ngx-tree")
	public hasDefaultClass: boolean = true;

	// Node content template
	@ContentChild(TreeNodeContentDirective, { read: TemplateRef })
	public nodeContentTemplate: TemplateRef<TreeNodeContentDirective>;
}
