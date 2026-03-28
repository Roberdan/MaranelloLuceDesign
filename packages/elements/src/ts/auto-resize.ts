/**
 * Maranello Luce Design — autoResize utility
 * Wraps a canvas+factory in a ResizeObserver so charts re-render on container resize.
 */
import { debounce } from './core/utils';

type ChartFactory = (
  canvas: HTMLCanvasElement,
  data: unknown,
  opts?: Record<string, unknown>,
) => unknown;

/**
 * Observe the canvas parent for size changes and re-render automatically.
 * Returns a cleanup function that disconnects the observer.
 */
export function autoResize(
  canvas: HTMLCanvasElement,
  factory: ChartFactory,
  data: unknown,
  opts?: Record<string, unknown>,
): () => void {
  if (typeof window === 'undefined' || !window.ResizeObserver) return () => {};
  const parent = canvas.parentElement;
  if (!parent) return () => {};

  let ctrl: Record<string, unknown> | null = null;

  const resize = debounce(() => {
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    if (ctrl && typeof (ctrl as Record<string, unknown>).destroy === 'function') {
      (ctrl.destroy as () => void)();
    }
    ctrl = factory(canvas, data, { ...opts, width: rect.width, height: rect.height }) as Record<string, unknown>;
  }, 150);

  const observer = new ResizeObserver(resize);
  observer.observe(parent);

  // Initial render
  resize();

  return () => {
    observer.disconnect();
    if (ctrl && typeof (ctrl as Record<string, unknown>).destroy === 'function') {
      (ctrl.destroy as () => void)();
    }
  };
}

/**
 * Auto-resize all canvases matching the selector.
 * Each canvas must have data-chart-type and data-chart-data attributes.
 * Returns a single cleanup function that disconnects all observers.
 */
export function autoResizeAll(
  selector: string = 'canvas[data-auto-resize]',
  chartLib?: Record<string, ChartFactory>,
): () => void {
  const canvases = document.querySelectorAll<HTMLCanvasElement>(selector);
  const cleanups: (() => void)[] = [];

  const lib = chartLib || (typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>).Maranello as Record<string, ChartFactory> : null);
  if (!lib) return () => {};

  canvases.forEach((canvas) => {
    const type = canvas.dataset.chartType;
    if (!type) return;
    const factory = lib[type] as ChartFactory;
    if (typeof factory !== 'function') return;
    let data: unknown[], opts: Record<string, unknown>;
    try {
      data = JSON.parse(canvas.dataset.chartData || '[]');
      opts = JSON.parse(canvas.dataset.chartOptions || '{}');
    } catch {
      data = [];
      opts = {};
    }
    cleanups.push(autoResize(canvas, factory, data, opts));
  });

  return () => cleanups.forEach((fn) => fn());
}
