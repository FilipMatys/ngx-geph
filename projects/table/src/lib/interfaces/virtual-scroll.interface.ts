/**
 * Virtual scroll interface
 * @description Virtual scroll configuration
 */
export interface ITableVirtualScroll {
    allow?: boolean;
    rowHeight?: number;
    paddingRowsCount?: number;
    stickyHead?: boolean;
    stickyFoot?: boolean;
}