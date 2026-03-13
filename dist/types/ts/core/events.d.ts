/**
 * Maranello Luce Design - Typed EventBus
 * Replaces M.emit / M.on / M.off from data-binding-events.ts
 *
 * Usage:
 *   import { eventBus } from '@maranello/core/events';
 *   eventBus.on('slider-change', (detail) => { ... });
 *   eventBus.emit('slider-change', { value: 42 });
 *   eventBus.off('slider-change', handler);
 */
export type EventCallback<T = unknown> = (detail: T) => void;
export declare class EventBus<EventMap extends Record<string, unknown> = Record<string, unknown>> {
    private readonly target;
    private readonly listeners;
    constructor(target?: EventTarget);
    on<K extends string & keyof EventMap>(name: K, handler: EventCallback<EventMap[K]>): void;
    emit<K extends string & keyof EventMap>(name: K, detail: EventMap[K]): void;
    off<K extends string & keyof EventMap>(name: K, handler: EventCallback<EventMap[K]>): void;
    removeAll(): void;
}
/** Default shared event bus (mirrors legacy M.emit/M.on on document) */
export declare const eventBus: EventBus<Record<string, unknown>>;
