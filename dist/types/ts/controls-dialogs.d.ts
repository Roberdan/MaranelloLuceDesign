/**
 * Maranello Luce Design - Dialog and widget controls
 * Dropdown, tabs init with full keyboard navigation and ARIA support.
 * Modal and toast live in dedicated modules (modal.ts, toast.ts).
 */
export interface DropdownController {
    open: () => void;
    close: () => void;
}
/**
 * Initialize a dropdown element with keyboard navigation and ARIA roles.
 * Expects `.mn-dropdown__trigger`, `.mn-dropdown__menu`, and `.mn-dropdown__item` children.
 */
export declare function initDropdown(el: HTMLElement): DropdownController;
export interface TabsController {
    activate: (index: number) => void;
}
/**
 * Initialize a tab group with keyboard navigation.
 * Expects `.mn-tabs__tab` and `.mn-tabs__panel` children.
 */
export declare function initTabs(el: HTMLElement): TabsController;
