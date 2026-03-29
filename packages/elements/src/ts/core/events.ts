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

interface ListenerEntry {
  original: EventCallback;
  wrapped: EventListener;
}

const PREFIX = 'mn:';

function getDefaultEventTarget(): EventTarget {
  return typeof document !== 'undefined' ? document : new EventTarget();
}

export class EventBus<EventMap extends Record<string, unknown> = Record<string, unknown>> {
  private readonly target: EventTarget;
  private readonly listeners = new Map<string, ListenerEntry[]>();

  constructor(target: EventTarget = getDefaultEventTarget()) {
    this.target = target;
  }

  on<K extends string & keyof EventMap>(
    name: K,
    handler: EventCallback<EventMap[K]>,
  ): void {
    const wrapped: EventListener = (e: Event) => {
      handler((e as CustomEvent).detail as EventMap[K]);
    };
    const key = PREFIX + name;
    this.target.addEventListener(key, wrapped);

    const entries = this.listeners.get(key) ?? [];
    entries.push({ original: handler as EventCallback, wrapped });
    this.listeners.set(key, entries);
  }

  emit<K extends string & keyof EventMap>(name: K, detail: EventMap[K]): void {
    this.target.dispatchEvent(
      new CustomEvent(PREFIX + name, { detail, bubbles: false }),
    );
  }

  off<K extends string & keyof EventMap>(
    name: K,
    handler: EventCallback<EventMap[K]>,
  ): void {
    const key = PREFIX + name;
    const entries = this.listeners.get(key);
    if (!entries) return;

    const idx = entries.findIndex((e) => e.original === handler);
    if (idx === -1) return;

    this.target.removeEventListener(key, entries[idx].wrapped);
    entries.splice(idx, 1);
    if (entries.length === 0) this.listeners.delete(key);
  }

  removeAll(): void {
    for (const [key, entries] of this.listeners) {
      for (const entry of entries) {
        this.target.removeEventListener(key, entry.wrapped);
      }
    }
    this.listeners.clear();
  }
}

/** Default shared event bus (mirrors legacy M.emit/M.on on document) */
export const eventBus = new EventBus();
