/**
 * Maranello Luce Design - Profile menu DOM helpers
 * Avatar generation, dropdown construction.
 */
import type { ProfileMenuItem, ProfileMenuSection } from './core/types';
export type { ProfileMenuItem, ProfileMenuSection };
export declare function initials(name: string): string;
export declare function buildTriggerAvatar(name: string, url: string | null | undefined): HTMLSpanElement;
export declare function buildLargeAvatar(name: string, url: string | null | undefined): HTMLSpanElement;
export interface DropdownBuildResult {
    el: HTMLDivElement;
    itemEls: HTMLDivElement[];
}
export declare function buildDropdown(opts: {
    name: string;
    email: string;
    avatarUrl: string | null;
    sections: ProfileMenuSection[];
}, closeFn: () => void): DropdownBuildResult;
