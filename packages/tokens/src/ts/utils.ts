/**
 * @maranello/tokens - Shared utilities
 * DOM helpers, formatting, math, and canvas setup.
 */

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
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return dpr;
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

/** Escape HTML special characters to prevent XSS injection. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
