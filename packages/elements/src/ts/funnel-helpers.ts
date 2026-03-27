/**
 * Maranello Luce Design - Funnel/Sankey SVG helpers
 */

/** Relative luminance of a hex color. */
export function hexLum(hex: string): number {
  let h = (hex || '#888888').replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Auto-select text color for contrast against a background. */
export function autoTextColor(bg: string): string {
  return hexLum(bg) > 0.35 ? '#111' : '#fff';
}

/** Resolve a container argument to an Element. */
export function resolveContainer(c: string | Element | null | undefined): Element | null {
  if (typeof c === 'string') return document.querySelector(c);
  return c instanceof Element ? c : null;
}

/** Create an SVG element with attributes. */
export function svgEl(tag: string, attrs?: Record<string, string | number>): SVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) { for (const k of Object.keys(attrs)) el.setAttribute(k, String(attrs[k])); }
  return el;
}

/** Create an SVG text element. */
export function svgText(attrs: Record<string, string | number>, text: string): SVGElement {
  const el = svgEl('text', attrs);
  el.textContent = text;
  return el;
}

/** Build a trapezoid path for connectors between funnel stages. */
export function trapPath(x1: number, w1: number, x2: number, w2: number, y1: number, y2: number): string {
  const l1 = x1, r1 = x1 + w1, l2 = x2, r2 = x2 + w2, my = (y1 + y2) / 2;
  return 'M' + l1 + ',' + y1 + ' C' + l1 + ',' + my + ' ' + l2 + ',' + my + ' ' + l2 + ',' + y2 +
    ' L' + r2 + ',' + y2 + ' C' + r2 + ',' + my + ' ' + r1 + ',' + my + ' ' + r1 + ',' + y1 + ' Z';
}

/** Build cumulative reach counts (bottom-up). */
export function cumulativeReach(counts: number[]): number[] {
  const reach: number[] = new Array(counts.length);
  let sum = 0;
  for (let i = counts.length - 1; i >= 0; i--) { sum += counts[i]; reach[i] = sum; }
  return reach;
}
