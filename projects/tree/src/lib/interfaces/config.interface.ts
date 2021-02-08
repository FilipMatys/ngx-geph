// Interfaces
import { ITreeNode } from "./node.interface";

/**
 * Tree config
 */
export class ITreeConfig {

    /**
     * Track node by
     * @description Custom function for items tracking 
     * @default Track by item
     */
    trackNodeBy?: (index: number, node: ITreeNode<any>) => any;
}