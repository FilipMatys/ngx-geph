/**
 * Node
 * @description Tree node
 */
export interface ITreeNode<TNodeData = any> {

    /**
     * Is expanded
     * @description Expansion flag
     */
    isExpanded?: boolean;

    /**
     * Data
     * @description Node data
     */
    data: TNodeData;

    /**
     * Children
     * @description Node children
     */
    children?: ITreeNode<TNodeData>[];
}