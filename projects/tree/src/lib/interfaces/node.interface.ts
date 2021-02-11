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
     * Is hidden
     * @description Is hidden flag
     */
    isHidden?: boolean;

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