/**
 * Maranello Luce Design - Shared utilities
 * Extracted from common patterns across all source files.
 */

import type { ThemeMode } from './types';

const BODY_CLASSES: Record<ThemeMode, string> = {
  editorial: '',
  nero: 'mn-nero',
  avorio: 'mn-avorio',
  colorblind: 'mn-colorblind',
  sugar: 'mn-sugar',
  navy: 'mn-navy',
};

const THEME_ORDER: ThemeMode[] = ['editorial', 'nero', 'avorio', 'colorblind', 'sugar', 'navy'];

/** Read a CSS custom property value, with fallback.
 *  Reads from document.body so theme overrides (body.mn-sugar, body.mn-avorio)
 *  are resolved — :root tokens still inherit via cascade. */
export function cssVar(name: string, fallback: string = ''): string {
  if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') return fallback;
  const el = document.body ?? document.documentElement;
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** Get the current active theme mode. */
export function getTheme(): ThemeMode {
  const cl = document.body.classList;
  if (cl.contains('mn-nero')) return 'nero';
  if (cl.contains('mn-avorio')) return 'avorio';
  if (cl.contains('mn-colorblind')) return 'colorblind';
  if (cl.contains('mn-sugar')) return 'sugar';
  if (cl.contains('mn-navy')) return 'navy';
  return 'editorial';
}

/** Set the active theme mode. Removes all other theme classes first. */
export function setTheme(mode: ThemeMode): void {
  for (const cls of Object.values(BODY_CLASSES)) {
    if (cls) document.body.classList.remove(cls);
  }
  const cls = BODY_CLASSES[mode];
  if (cls) document.body.classList.add(cls);
  try {
    localStorage.setItem('mn-theme', mode);
  } catch (_err) {
    /* Storage can be blocked in privacy modes; class-based theme still applies. */
  }
}

/** Cycle to the next theme in order. */
export function cycleTheme(): ThemeMode {
  const current = getTheme();
  const idx = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  setTheme(next);
  return next;
}

/** Read the accent color from CSS custom properties. */
export function getAccent(fallback: string = '#FFC72C'): string {
  return cssVar('--mn-accent', fallback);
}

/**
 * Read live token colors from CSS custom properties.
 * Use includePrimitives only for legacy consumers during migration.
 */
export function palette(
  el: Element = document.documentElement,
  opts?: { includePrimitives?: boolean },
): Record<string, string> {
  const read = (name: string) => getComputedStyle(el).getPropertyValue(name).trim();
  const semantic = {
    surface:        read('--mn-surface'),
    surfaceRaised:  read('--mn-surface-raised'),
    surfaceSunken:  read('--mn-surface-sunken'),
    surfaceInput:   read('--mn-surface-input'),
    surfaceOverlay: read('--mn-surface-overlay'),
    text:           read('--mn-text'),
    textMuted:      read('--mn-text-muted'),
    textTertiary:   read('--mn-text-tertiary'),
    border:         read('--mn-border'),
    borderSubtle:   read('--mn-border-subtle'),
    accent:         read('--mn-accent'),
    accentHover:    read('--mn-accent-hover'),
    signalOk:       read('--signal-ok'),
    signalWarning:  read('--signal-warning'),
    signalDanger:   read('--signal-danger'),
    signalInfo:     read('--signal-info'),
    hoverBg:        read('--mn-hover-bg'),
    focusRing:      read('--mn-focus-ring'),
  };
  if (!opts?.includePrimitives) return semantic;
  return {
    ...semantic,
    giallo:       read('--mn-accent'),
    rosso:        read('--mn-error'),
    verde:        read('--signal-ok'),
    azzurro:      read('--signal-info'),
    biancoCaldo:  read('--mn-text'),
    grigioChiaro: read('--mn-text-tertiary'),
    grigioMedio:  read('--mn-text-muted'),
    neroAssoluto: read('--mn-text-inverse'),
  };
}

/** Debounce a function call. */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}

/** Throttle a function call. */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn(...args);
    } else if (timer === null) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

/** Create a DOM element with class and optional attributes. */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'text') el.textContent = val;
      else el.setAttribute(key, val);
    }
  }
  return el;
}

/** Format a number with locale-aware separators. */
export function formatNumber(
  value: number,
  opts?: { decimals?: number; locale?: string },
): string {
  const decimals = opts?.decimals ?? 0;
  const locale = opts?.locale ?? 'en-US';
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format a date string (ISO) to a human-readable form. */
export function formatDate(
  dateStr: string,
  opts?: { locale?: string; format?: 'short' | 'long' },
): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const locale = opts?.locale ?? 'en-US';
  const style = opts?.format === 'short' ? 'short' : 'long';
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: style,
    year: 'numeric',
  });
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Set up a hi-DPI canvas context. Returns the scaling factor. */
export function hiDpiCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): number {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return dpr;
}

/* Re-export escapeHtml from sanitize module for backward compatibility. */
export { escapeHtml } from './sanitize';
