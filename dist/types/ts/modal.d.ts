/**
 * Maranello Luce Design - Modal dialog component
 * Handles backdrop, focus trapping, and keyboard dismissal.
 */
/**
 * Open a modal by its backdrop element ID.
 * Sets up focus trap and Escape key to close.
 */
export declare function openModal(id: string): void;
/**
 * Close a modal by its backdrop element ID.
 * Removes focus trap listener.
 */
export declare function closeModal(id: string): void;
