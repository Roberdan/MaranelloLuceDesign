/**
 * Maranello Luce Design - Data binding core
 * Binds data from URLs to DOM elements, emits/listens to events.
 */

import { eventBus } from './core/events';
import { escapeHtml, ALLOWED_BIND_PROPERTIES } from './core/sanitize';

interface BindOptions {
  url?: string;
  fetch?: () => Promise<unknown>;
  map?: (data: unknown, el?: Element) => unknown;
  property?: string;
  interval?: number;
  onUpdate?: (el: Element, value: unknown) => void;
  onError?: (el: Element, err: unknown) => void;
}

/** Emit a custom event on the document (legacy compatibility). */
export function emit(name: string, detail: unknown): void {
  eventBus.emit(name as string & keyof Record<string, unknown>, detail);
}

/** Listen for a custom event on the document (legacy compatibility). */
export function on(name: string, handler: (detail: unknown) => void): void {
  eventBus.on(name as string & keyof Record<string, unknown>, handler);
}

function toElementArray(selector: string | Element): Element[] {
  if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
  return [selector];
}

const UNSAFE_STYLE_RE = /url\s*\(\s*javascript:/i;
const EXPRESSION_RE = /expression\s*\(/i;

function setElementProperty(el: Element, property: string, value: unknown): void {
  if (!ALLOWED_BIND_PROPERTIES.has(property) && !property.startsWith('style.') && !property.startsWith('data-')) {
    console.warn('[Maranello] bind: property "%s" not in whitelist', property);
  }
  if (property === 'textContent') {
    el.textContent = value == null ? '' : String(value);
  } else if (property === 'innerHTML') {
    el.innerHTML = value == null ? '' : escapeHtml(String(value));
  } else if (property.startsWith('style.')) {
    if (el instanceof HTMLElement) {
      const strVal = value == null ? '' : String(value);
      if (UNSAFE_STYLE_RE.test(strVal) || EXPRESSION_RE.test(strVal)) {
        console.warn('[Maranello] bind: blocked unsafe style value for "%s"', property);
        return;
      }
      (el.style as unknown as Record<string, string>)[property.slice(6)] = strVal;
    }
  } else if (property.startsWith('data-')) {
    const attrValue = typeof value === 'object' && value !== null
      ? JSON.stringify(value) : String(value ?? '');
    el.setAttribute(property, attrValue);
  } else {
    (el as unknown as Record<string, unknown>)[property] = value;
  }
}

/** Bind data from a URL or fetch function to DOM elements. */
export function bind(
  selector: string | Element,
  options: BindOptions,
): number | undefined {
  const elements = toElementArray(selector);
  const opts = {
    property: 'textContent',
    interval: 0,
    map: (data: unknown) => data,
    ...options,
  };

  function update(): void {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error('bind: missing URL'));
      return fetch(opts.url).then((r) => r.json() as Promise<unknown>);
    });
    fetchFn().then((data) => {
      for (const el of elements) {
        const value = opts.map(data, el);
        setElementProperty(el, opts.property, value);
        el.classList.add('mn-anim-count');
        setTimeout(() => el.classList.remove('mn-anim-count'), 300);
        if (opts.onUpdate) opts.onUpdate(el, value);
      }
    }).catch((err: unknown) => {
      if (opts.onError) {
        for (const el of elements) opts.onError(el, err);
      }
    });
  }

  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return undefined;
}

/** Auto-bind elements with data-mn-bind attributes. */
export function autoBind(): void {
  document.querySelectorAll('[data-mn-bind]').forEach((el) => {
    const config: Record<string, string> = {};
    const rawBind = (el as HTMLElement).dataset.mnBind;
    if (!rawBind) return;
    rawBind.split(';').forEach((pair) => {
      const kv = pair.split(':');
      if (kv.length === 2) {
        const key = kv[0].trim();
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          console.warn('[Maranello] autoBind: rejected unsafe key "%s"', key);
          return;
        }
        config[key] = kv[1].trim();
      }
    });
    if (config.url) {
      bind(el, {
        url: config.url,
        property: config.prop ?? 'textContent',
        interval: parseInt(config.refresh ?? '', 10) || 0,
      });
    }
  });
}

/** Register drill-down click handlers on matching elements. */
export function onDrillDown(
  selector: string,
  handler: (element: Element, contextData: Record<string, string | null>) => void,
): void {
  document.querySelectorAll(selector).forEach((el) => {
    if (el instanceof HTMLElement) el.style.cursor = 'pointer';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.classList.add('mn-hover-lift');

    function trigger(): void {
      const context: Record<string, string | null> = {};
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-')) {
          context[attr.name.slice(5)] = attr.value;
        }
      });
      context.text = el.textContent;
      handler(el, context);
    }

    el.addEventListener('click', trigger);
    el.addEventListener('keydown', (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        keyEvent.preventDefault();
        trigger();
      }
    });
  });
}
