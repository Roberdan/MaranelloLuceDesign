/**
 * Maranello Luce Design - Chart helpers and shared chart utilities
 */
import { cssVar } from './core/utils';

const dpr = window.devicePixelRatio || 1;

/** Build the default chart color series from CSS custom properties. */
export function buildSeries(): string[] {
  return [
    cssVar('--chart-default', '#FFC72C'), cssVar('--signal-danger', '#DC0000'),
    cssVar('--signal-ok', '#00A651'), cssVar('--arancio', '#D4622B'),
    cssVar('--chart-bar', '#4EA8DE'), cssVar('--grigio-alluminio', '#c8c8c8'),
    '#E8A838', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1',
  ];
}

export const SERIES = buildSeries();

/** Set up a hi-DPI canvas and return its 2D context. */
export function chartHiDpi(
  canvas: HTMLCanvasElement, w: number, h: number,
): CanvasRenderingContext2D {
  const cw = Math.max(w, 20);
  const ch = Math.max(h, 20);
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = cw + 'px';
  canvas.style.height = ch + 'px';
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  return ctx;
}

/** Get usable dimensions from canvas parent or data attributes. */
export function getCanvasSize(
  canvas: HTMLCanvasElement, defaultW = 200, defaultH = 100,
): { width: number; height: number } {
  const dw = parseInt(canvas.getAttribute('data-width') ?? '', 10);
  const dh = parseInt(canvas.getAttribute('data-height') ?? '', 10);
  if (dw > 0 && dh > 0) return { width: dw, height: dh };

  const aw = parseInt(canvas.getAttribute('width') ?? '', 10);
  const ah = parseInt(canvas.getAttribute('height') ?? '', 10);
  if (aw > 0 && ah > 0) return { width: aw, height: ah };

  if (canvas.parentElement) {
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width > 10 && rect.height > 10) {
      return { width: rect.width, height: rect.height };
    }
  }

  return { width: defaultW, height: defaultH };
}

/** Parse a hex color to rgba string with given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Create a vertical gradient from a hex color (top alpha to bottom 0). */
export function hexFillGradient(
  ctx: CanvasRenderingContext2D, hex: string, h: number, opacity: number,
): CanvasGradient {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgba(${r},${g},${b},${opacity})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  return grad;
}

/** Apply accessibility attributes to a canvas chart element. */
export function applyChartA11y(canvas: HTMLCanvasElement, label: string): void {
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
  canvas.textContent = label;
  const srSpan = document.createElement('span');
  srSpan.className = 'mn-sr-only';
  srSpan.textContent = label;
  if (canvas.parentElement) {
    canvas.parentElement.insertBefore(srSpan, canvas.nextSibling);
  }
}

/** Draw a smooth bezier curve through data points. */
export function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  data: number[],
  getX: (i: number) => number,
  getY: (v: number) => number,
  smooth: boolean,
): void {
  ctx.moveTo(getX(0), getY(data[0]));
  if (smooth && data.length > 2) {
    for (let i = 1; i < data.length; i++) {
      const cpx = (getX(i - 1) + getX(i)) / 2;
      ctx.bezierCurveTo(cpx, getY(data[i - 1]), cpx, getY(data[i]), getX(i), getY(data[i]));
    }
  } else {
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i]));
    }
  }
}
