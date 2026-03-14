/**
 * Maranello Luce Design - Base interactive controls
 * Detail panel open/close, drawer, org tree, command palette,
 * notifications, drill down.
 */
/** Open a detail panel by element id. */
export declare function openDetailPanel(id: string): void;
/** Close a detail panel by element id. */
export declare function closeDetailPanel(id: string): void;
/** Open a mobile drawer by element id. Traps focus and closes on Escape. */
export declare function openDrawer(id: string, triggerEl?: HTMLElement): void;
/** Close a mobile drawer by element id. Returns focus to trigger. */
export declare function closeDrawer(id: string, triggerEl?: HTMLElement | null): void;
/** Initialize org tree expand/collapse, node selection, and keyboard nav. */
export declare function initOrgTree(container: HTMLElement): void;
/** Toggle notification center visibility. */
export declare function toggleNotifications(id: string): void;
/** Initialize drill-down expand/collapse controls. */
export declare function initDrillDown(container: HTMLElement): void;
