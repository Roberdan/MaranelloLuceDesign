/**
 * Maranello Luce Design — Mobile sidebar toggle
 * Toggles mn-sidebar--mobile-open class with backdrop, ESC close, matchMedia auto-close.
 */
/**
 * Initialize sidebar toggle for a specific sidebar and trigger element.
 * Returns a cleanup function.
 */
export declare function initSidebarToggle(sidebarEl: HTMLElement, triggerEl: HTMLElement): () => void;
/**
 * Auto-detect sidebar and hamburger trigger by convention.
 * Sidebar: .mn-sidebar, Trigger: [data-sidebar-toggle] or .mn-sidebar-toggle
 */
export declare function initSidebarToggleAuto(): (() => void) | null;
