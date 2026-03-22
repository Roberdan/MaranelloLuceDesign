/**
 * Maranello Luce Design - Header (3-zone navbar)
 * Lightweight flex navbar with brand, nav buttons, search, and profile zones.
 */
import type { ProfileMenuSection } from './core/types';
export interface HeaderBrand {
    label: string;
    logo?: string;
    href?: string;
}
export interface HeaderButton {
    id: string;
    label?: string;
    /** Tooltip + aria-label. Falls back to label if omitted. */
    title?: string;
    icon?: string;
    active?: boolean;
    onClick?: () => void;
}
export interface HeaderSearch {
    type: 'search';
    placeholder?: string;
    shortcut?: string;
    onSearch?: (query: string) => void;
    filterButton?: {
        label: string;
        onClick: () => void;
    };
}
export interface HeaderProfile {
    type: 'profile';
    name: string;
    avatarUrl?: string;
    sections?: ProfileMenuSection[];
}
type HeaderItem = HeaderButton | 'separator' | HeaderProfile;
export interface HeaderOptions {
    brand?: HeaderBrand;
    left?: (HeaderButton | 'separator')[];
    center?: HeaderSearch;
    right?: (HeaderItem)[];
}
export interface HeaderController {
    setActive(buttonId: string): void;
    destroy(): void;
}
export declare function header(container: HTMLElement, options?: HeaderOptions): HeaderController;
export {};
