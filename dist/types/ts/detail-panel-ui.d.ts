/**
 * Maranello Luce Design - Detail panel UI (DOM construction + body rendering)
 * Builds the panel skeleton, tabs, footer, and renders fields via renderers/editors.
 */
import type { DetailPanelOptions, DetailPanelState, DetailField } from './core/types';
/** DOM references returned by buildDOM. */
export interface DetailPanelDOM {
    backdrop: HTMLElement;
    titleEl: HTMLElement;
    editBtn: HTMLButtonElement;
    saveBtn: HTMLButtonElement;
    cancelBtn: HTMLButtonElement;
    closeBtn: HTMLButtonElement;
    tabBar: HTMLElement | null;
    body: HTMLElement;
    footer: HTMLElement;
}
/** Show a toast notification inside the panel. */
export declare function showToast(panel: HTMLElement, message: string, type?: string): void;
/** Render a loading skeleton into the panel body. */
export declare function renderSkeleton(body: HTMLElement): void;
/** Validate a single field value against its validation rules. */
export declare function validateField(value: unknown, field: DetailField): string | null;
/** Build the full detail panel DOM structure inside a container. */
export declare function buildDOM(container: HTMLElement, opts: DetailPanelOptions, activeTab: string | null, onTabClick: (tab: string) => void): DetailPanelDOM;
/** Render fields into the panel body based on current state. */
export declare function renderBody(body: HTMLElement, state: DetailPanelState, opts: DetailPanelOptions): void;
