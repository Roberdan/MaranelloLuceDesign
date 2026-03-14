/**
 * Maranello Luce Design - Shared utilities
 * Extracted from common patterns across all source files.
 */
import type { ThemeMode } from './types';
/** Read a CSS custom property value, with fallback. */
export declare function cssVar(name: string, fallback?: string): string;
/** Get the current active theme mode. */
export declare function getTheme(): ThemeMode;
/** Set the active theme mode. Removes all other theme classes first. */
export declare function setTheme(mode: ThemeMode): void;
/** Cycle to the next theme in order. */
export declare function cycleTheme(): ThemeMode;
/** Read the accent color from CSS custom properties. */
export declare function getAccent(fallback?: string): string;
/** Debounce a function call. */
export declare function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void;
/** Throttle a function call. */
export declare function throttle<T extends (...args: never[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void;
/** Create a DOM element with class and optional attributes. */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attrs?: Record<string, string>): HTMLElementTagNameMap[K];
/** Format a number with locale-aware separators. */
export declare function formatNumber(value: number, opts?: {
    decimals?: number;
    locale?: string;
}): string;
/** Format a date string (ISO) to a human-readable form. */
export declare function formatDate(dateStr: string, opts?: {
    locale?: string;
    format?: 'short' | 'long';
}): string;
/** Clamp a value between min and max. */
export declare function clamp(value: number, min: number, max: number): number;
/** Linear interpolation. */
export declare function lerp(a: number, b: number, t: number): number;
/** Set up a hi-DPI canvas context. Returns the scaling factor. */
export declare function hiDpiCanvas(canvas: HTMLCanvasElement, width: number, height: number): number;
export { escapeHtml } from './sanitize';
