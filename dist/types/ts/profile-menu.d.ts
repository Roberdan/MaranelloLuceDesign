/**
 * Maranello Luce Design - Profile menu controller
 * Dropdown user menu with keyboard navigation and avatar display.
 */
import type { ProfileMenuSection } from './core/types';
export interface ProfileMenuUser {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
}
export interface ProfileMenuOptions extends ProfileMenuUser {
    sections?: ProfileMenuSection[];
}
export interface ProfileMenuController {
    open: () => void;
    close: () => void;
    setUser: ((user: ProfileMenuUser) => void) & ((name: string, email?: string, avatarUrl?: string | null) => void);
    destroy: () => void;
}
export declare function profileMenu(trigger: HTMLElement, options?: ProfileMenuOptions): ProfileMenuController;
