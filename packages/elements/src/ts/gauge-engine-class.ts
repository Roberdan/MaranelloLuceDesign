/**
 * Maranello Luce Design - GaugeEngine class module
 * Typed factory and lifecycle utilities for FerrariGauge instances.
 * Re-exports the core FerrariGauge class for convenience.
 */
import { FerrariGauge } from './gauge-engine';
import type { GaugeConfig, GaugeSize } from './core/types';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export { FerrariGauge } from './gauge-engine';
export { buildGaugePalette } from './gauge-engine-palette';
export type { GaugeRenderPalette } from './gauge-engine-palette';
export type { GaugeDrawState } from './gauge-engine-draw';
export type { GaugeConfig, GaugeSize } from './core/types';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** Options for creating a gauge via the factory function. */
export interface GaugeFactoryOptions {
  /** Target canvas element or CSS selector. */
  target: HTMLCanvasElement | string;
  /** Gauge data configuration (overrides data-gauge attribute). */
  config?: GaugeConfig;
  /** Size preset key (overrides data-size attribute). */
  size?: GaugeSize;
  /** Whether to animate on creation (default: true). */
  animate?: boolean;
}

/** Tracks a created gauge with its canvas reference for lifecycle management. */
export interface GaugeEntry {
  gauge: FerrariGauge;
  canvas: HTMLCanvasElement;
}

// ---------------------------------------------------------------------------
// Size presets (mirrors FerrariGauge.SIZES for external access)
// ---------------------------------------------------------------------------

export const GAUGE_SIZES: Record<'sm' | 'md' | 'lg' | 'fluid', number> = {
  sm: 120,
  md: 220,
  lg: 320,
  fluid: 0,
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Resolve a canvas element from a selector string or direct reference.
 * Returns null if the element is not found or is not a canvas.
 */
function resolveCanvas(
  target: HTMLCanvasElement | string,
): HTMLCanvasElement | null {
  if (typeof target === 'string') {
    const el = document.querySelector<HTMLCanvasElement>(target);
    return el instanceof HTMLCanvasElement ? el : null;
  }
  return target instanceof HTMLCanvasElement ? target : null;
}

/**
 * Create a single FerrariGauge instance with explicit options.
 * Returns null if the target canvas cannot be resolved.
 */
export function createGauge(
  opts: GaugeFactoryOptions,
): FerrariGauge | null {
  const canvas = resolveCanvas(opts.target);
  if (!canvas) return null;

  if (opts.config) {
    canvas.dataset.gauge = JSON.stringify(opts.config);
  }
  if (opts.size !== undefined) {
    canvas.dataset.size = String(opts.size);
  }

  return new FerrariGauge(canvas);
}

/**
 * Create gauges for all matching canvas elements within a container.
 * Returns an array of GaugeEntry objects for lifecycle management.
 */
export function createGaugesInContainer(
  container: HTMLElement | string = document.body,
  selector: string = '.mn-gauge__canvas',
): GaugeEntry[] {
  const root =
    typeof container === 'string'
      ? document.querySelector<HTMLElement>(container)
      : container;
  if (!root) return [];

  const entries: GaugeEntry[] = [];
  root.querySelectorAll<HTMLCanvasElement>(selector).forEach((canvas) => {
    const gauge = new FerrariGauge(canvas);
    entries.push({ gauge, canvas });
  });
  return entries;
}

/**
 * Redraw all gauges in an array of entries.
 * Useful after theme changes or container resizes.
 */
export function redrawAll(entries: GaugeEntry[]): void {
  for (const entry of entries) {
    entry.gauge.redraw();
  }
}

/**
 * Re-initialize all gauges (recalculates size from container bounds).
 * Useful after layout changes that affect canvas parent dimensions.
 */
export function reinitAll(entries: GaugeEntry[]): void {
  for (const entry of entries) {
    entry.gauge.init();
  }
}
