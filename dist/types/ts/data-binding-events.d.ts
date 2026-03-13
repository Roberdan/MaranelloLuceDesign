/**
 * Maranello Luce Design - Data binding event helpers
 * Re-exports event-aware data binding functions from data-binding and core/events.
 * Original IIFE (window.Maranello.emit/on/bind/autoBind/onDrillDown) converted to ESM.
 */
import type { EventCallback } from './core/events';
import { eventBus } from './core/events';
export type { EventCallback };
/** Drill-down context extracted from an element's data-* attributes. */
export interface DrillDownContext {
    text: string | null;
    [key: string]: string | null;
}
/** Handler invoked when a drill-down element is activated. */
export type DrillDownHandler = (element: Element, context: DrillDownContext) => void;
/** Options for the bind() helper. */
export interface ElementBindOptions {
    url?: string;
    fetch?: () => Promise<unknown>;
    map?: (data: unknown, el?: Element) => unknown;
    property?: string;
    interval?: number;
    onUpdate?: (el: Element, value: unknown) => void;
    onError?: (el: Element, err: unknown) => void;
}
export { eventBus };
/** Emit a namespaced event on the shared bus. */
export declare function emit(name: string, detail: unknown): void;
/** Subscribe to a namespaced event on the shared bus. */
export declare function on(name: string, handler: EventCallback): void;
/** Unsubscribe from a namespaced event on the shared bus. */
export declare function off(name: string, handler: EventCallback): void;
export { bind, autoBind, onDrillDown } from './data-binding';
