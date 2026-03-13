/**
 * Maranello Luce Design - Data binding UI utilities
 * Binds sliders, controls, gauges, and charts to data sources.
 */

import { eventBus } from './core/events';

interface GaugeLike {
  config: { complications?: Record<string, unknown>; [key: string]: unknown };
  animate: () => void;
}

interface SliderLike {
  setValue: (value: unknown) => void;
}

interface BoundControlElement extends Element {
  _mnSlider?: SliderLike;
}

interface ChartBindOptions {
  url?: string;
  fetch?: () => Promise<unknown>;
  map?: (data: unknown) => unknown;
  interval?: number;
  chartOpts?: Record<string, unknown>;
}

interface ControlBindOptions {
  url: string;
  mapRead?: (data: unknown) => unknown;
  mapWrite?: (value: unknown) => string;
}

/** Update an existing gauge's configuration and re-animate. */
export function updateGauge(
  canvas: HTMLCanvasElement,
  newConfig: Partial<GaugeLike['config']>,
  gaugeMap?: Map<HTMLCanvasElement, GaugeLike>,
): void {
  const gauge = gaugeMap?.get(canvas);
  if (!gauge) return;
  Object.assign(gauge.config, newConfig);
  if (newConfig.complications && gauge.config.complications) {
    Object.assign(gauge.config.complications, newConfig.complications);
  } else if (newConfig.complications) {
    gauge.config.complications = { ...newConfig.complications };
  }
  gauge.animate();
}

/** Bind a chart to a data source with optional polling. */
export function bindChart(
  canvas: HTMLCanvasElement,
  chartType: string,
  options: ChartBindOptions,
  chartRegistry?: Record<string, (c: HTMLCanvasElement, d: unknown, o: Record<string, unknown>) => void>,
): number | undefined {
  const opts = {
    interval: 0,
    map: (d: unknown) => d,
    ...options,
  };
  const maybeFn = chartRegistry?.[chartType];
  if (!maybeFn) {
    console.warn('bindChart: unknown chart type', chartType);
    return undefined;
  }
  const chartFn = maybeFn;

  function update(): void {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error('missing URL'));
      return fetch(opts.url).then((r) => r.json());
    });
    fetchFn().then((raw) => {
      const data = opts.map!(raw);
      chartFn(canvas, data, opts.chartOpts ?? {});
      eventBus.emit('chart-update', { canvas, type: chartType, data });
    }).catch((err: unknown) => {
      console.warn('bindChart error:', err);
    });
  }

  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return undefined;
}

/** Auto-initialize sliders from data attributes. */
export function autoBindSliders(
  initSlider?: (el: Element, config: Record<string, string | number>) => void,
): void {
  document.querySelectorAll('[data-mn-slider]').forEach((el) => {
    const config: Record<string, string | number> = {};
    const rawSlider = (el as HTMLElement).dataset.mnSlider;
    if (!rawSlider) return;
    rawSlider.split(';').forEach((pair) => {
      const kv = pair.split(':');
      if (kv.length === 2) {
        const key = kv[0].trim();
        const rawValue = kv[1].trim();
        const numericValue = Number(rawValue);
        config[key] = isNaN(numericValue) ? rawValue : numericValue;
      }
    });
    if (initSlider) initSlider(el, config);
  });
}

/** Bind a control element to a REST endpoint. */
export function bindControl(
  el: BoundControlElement,
  options: ControlBindOptions,
): void {
  const opts = {
    mapRead: (d: unknown) => (d as { value?: unknown }).value,
    mapWrite: (v: unknown) => JSON.stringify({ value: v }),
    ...options,
  };

  if (opts.url) {
    fetch(opts.url)
      .then((r) => r.json())
      .then((data: unknown) => {
        const val = opts.mapRead(data);
        if (el._mnSlider) el._mnSlider.setValue(val);
      })
      .catch((err: unknown) => {
        console.warn('bindControl: failed to read initial value', err);
      });
  }

  eventBus.on('slider-change', (detail: unknown) => {
    const d = detail as { element?: Element; value?: unknown };
    if (d.element !== el) return;
    if (opts.url) {
      fetch(opts.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: opts.mapWrite(d.value),
      }).catch((err: unknown) => {
        console.warn('bindControl: failed to write value', err);
      });
    }
  });
}
