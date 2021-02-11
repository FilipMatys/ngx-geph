// External modules
import { Component } from "@angular/core";

// Component
import { ITreeNode, ITreeConfig } from "tree";

@Component({
    selector: "page-tree",
    templateUrl: "./tree.page.html",
    styleUrls: ["./tree.page.scss"]
})
export class TreePage {

    // Tree config
    public config: ITreeConfig = {
        trackNodeBy: (index: number, node: ITreeNode) => index
    };

    // Tree nodes
    public nodes: ITreeNode<any>[] = [
        {
            data: { title: "Tesla" },
            children: [
                {
                    data: { title: "Model S" },
                    children: [
                        {
                            data: { title: "Long Range" }
                        },
                        {
                            data: { title: "Plaid" }
                        },
                        {
                            data: { title: "Plaid+" }
                        },
                    ]
                },
                {
                    data: { title: "Model 3" }
                },
                {
                    data: { title: "Model X" }
                },
                {
                    data: { title: "Model Y" }
                }
            ]
        },
        {
            data: { title: "Volkswagen" },
            children: [
                {
                    data: { title: "ID.3" }
                },
                {
                    data: { title: "ID.4" },
                    isHidden: true
                },
                {
                    data: { title: "ID.5" }
                },
                {
                    data: { title: "ID.6" }
                }
            ]
        }
    ];

    /**
     * On toggle node click
     * @param event 
     * @param node 
     */
    public onToggleNodeClick(event: Event, node: ITreeNode): void {
        // Prevent event propagation
        event.stopPropagation();

        // Toggle node
        node.isExpanded = !node.isExpanded;
    }
}