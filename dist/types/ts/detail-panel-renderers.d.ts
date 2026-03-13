/**
 * Maranello Luce Design - Detail panel field renderers (read-only mode)
 * Renders field values as DOM elements based on field type.
 */
import type { DetailRenderer, DetailPersonItem } from './core/types';
declare function getInitials(name: string): string;
declare function formatDateSimple(s: unknown): string;
/** Update a status <select> element border/text color from a color map. */
export declare function updateStatusSelectColor(sel: HTMLSelectElement, colors?: Record<string, string>): void;
/** Render person search result items into a dropdown container. */
export declare function renderPersonResults(container: HTMLElement, items: Array<string | DetailPersonItem>, input: HTMLInputElement, onChange: (val: string) => void): void;
declare const renderers: Record<string, DetailRenderer>;
export { renderers, getInitials, formatDateSimple };
