/**
 * Maranello Luce Design - Web Components registry
 * Each WC self-registers via customElements.define() on import.
 *
 * Usage:
 *   import { registerAll } from '@maranello/wc';
 *   registerAll(); // ensures all WCs are loaded and registered
 */
declare const WC_TAGS: readonly ["mn-a11y", "mn-chart", "mn-chat", "mn-command-palette", "mn-data-table", "mn-date-picker", "mn-detail-panel", "mn-ferrari-control", "mn-funnel", "mn-gantt", "mn-gauge", "mn-hbar", "mn-login", "mn-map", "mn-mapbox", "mn-modal", "mn-okr", "mn-profile", "mn-speedometer", "mn-system-status", "mn-tab", "mn-tabs", "mn-theme-rotary", "mn-section-nav", "mn-theme-toggle", "mn-toast"];
type WcTag = (typeof WC_TAGS)[number];
/** Import all WC modules (side-effect: each calls customElements.define). */
export declare function registerAll(): Promise<void>;
/** Check if a specific WC tag is already registered. */
export declare function isRegistered(tag: WcTag): boolean;
/** Get list of all WC tags managed by this design system. */
export declare function getAvailableTags(): readonly string[];
/** Get list of currently registered WC tags. */
export declare function getRegistered(): string[];
export {};
