/**
 * Maranello Luce Design - GaugeEngine class module
 * Typed factory and lifecycle utilities for FerrariGauge instances.
 * Re-exports the core FerrariGauge class for convenience.
 */
import { FerrariGauge } from './gauge-engine';
import type { GaugeConfig, GaugeSize } from './core/types';
export { FerrariGauge } from './gauge-engine';
export { buildGaugePalette } from './gauge-engine-palette';
export type { GaugeRenderPalette } from './gauge-engine-palette';
export type { GaugeDrawState } from './gauge-engine-draw';
export type { GaugeConfig, GaugeSize } from './core/types';
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
export declare const GAUGE_SIZES: Record<'sm' | 'md' | 'lg' | 'fluid', number>;
/**
 * Create a single FerrariGauge instance with explicit options.
 * Returns null if the target canvas cannot be resolved.
 */
export declare function createGauge(opts: GaugeFactoryOptions): FerrariGauge | null;
/**
 * Create gauges for all matching canvas elements within a container.
 * Returns an array of GaugeEntry objects for lifecycle management.
 */
export declare function createGaugesInContainer(container?: HTMLElement | string, selector?: string): GaugeEntry[];
/**
 * Redraw all gauges in an array of entries.
 * Useful after theme changes or container resizes.
 */
export declare function redrawAll(entries: GaugeEntry[]): void;
/**
 * Re-initialize all gauges (recalculates size from container bounds).
 * Useful after layout changes that affect canvas parent dimensions.
 */
export declare function reinitAll(entries: GaugeEntry[]): void;
