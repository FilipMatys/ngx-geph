// External modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { TreeComponent } from "./tree.component";
import { TreeNodeComponent } from "./components/node/node.component";

// Directives
import { TreeNodeContentDirective } from "./directives/content/content.directive";

@NgModule({
	imports: [CommonModule],
	declarations: [
		TreeComponent,
		TreeNodeComponent,
		TreeNodeContentDirective
	],
	exports: [
		TreeComponent,
		TreeNodeComponent,
		TreeNodeContentDirective
	]
})
export class TreeModule { }
