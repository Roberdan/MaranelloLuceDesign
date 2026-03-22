import type { ProfileMenuSection } from './core/types';
export interface HeaderV2Brand {
    label?: string;
    logo?: string;
    href?: string;
}
export interface HeaderV2Action {
    id: string;
    label?: string;
    title?: string;
    icon?: string;
    active?: boolean;
    pressed?: boolean;
    onClick?: () => void;
}
export interface HeaderV2Group {
    id: string;
    items: HeaderV2Action[];
}
export interface HeaderV2Search {
    placeholder?: string;
    shortcut?: string;
    filterLabel?: string;
    onSearch?: (query: string) => void;
    onFilter?: () => void;
}
export interface HeaderV2Profile {
    name: string;
    avatarUrl?: string;
    sections?: ProfileMenuSection[];
}
export interface HeaderV2Status {
    label: string;
    tone?: 'ok' | 'warn' | 'error';
}
export interface HeaderV2Options {
    brand?: HeaderV2Brand;
    groups?: HeaderV2Group[];
    actions?: HeaderV2Action[];
    search?: HeaderV2Search;
    status?: HeaderV2Status;
    profile?: HeaderV2Profile;
}
export interface HeaderV2Controller {
    setActive(id: string): void;
    setPressed(ids: string[]): void;
    destroy(): void;
}
export declare function headerV2(container: HTMLElement, options?: HeaderV2Options): HeaderV2Controller;
