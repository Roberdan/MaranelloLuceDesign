/**
 * Maranello Luce Design - Base interactive controls
 * Detail panel open/close, drawer, org tree, command palette,
 * notifications, drill down.
 */
/** Open a detail panel by element id. */
export declare function openDetailPanel(id: string): void;
/** Close a detail panel by element id. */
export declare function closeDetailPanel(id: string): void;
/** Open a mobile drawer by element id. */
export declare function openDrawer(id: string): void;
/** Close a mobile drawer by element id. */
export declare function closeDrawer(id: string): void;
/** Initialize org tree expand/collapse and node selection. */
export declare function initOrgTree(container: HTMLElement): void;
/** Toggle notification center visibility. */
export declare function toggleNotifications(id: string): void;
/** Initialize drill-down expand/collapse controls. */
export declare function initDrillDown(container: HTMLElement): void;
