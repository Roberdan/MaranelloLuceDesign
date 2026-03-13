/**
 * Maranello Luce Design - Accessibility panel DOM builder
 * Builds the panel UI, handles settings persistence and application.
 */
import type { A11ySettings } from './core/types';
export declare const DEFAULTS: Readonly<A11ySettings>;
export interface A11yPanelRefs {
    fab: HTMLButtonElement;
    panel: HTMLDivElement;
    sizeButtons: Record<string, HTMLButtonElement>;
    lsButtons: Record<string, HTMLButtonElement>;
    resetBtn: HTMLButtonElement;
}
export declare function loadSettings(): A11ySettings;
export declare function saveSettings(s: A11ySettings): void;
export declare function applySettings(settings: A11ySettings): void;
export declare function buildPanel(settings: A11ySettings): A11yPanelRefs;
