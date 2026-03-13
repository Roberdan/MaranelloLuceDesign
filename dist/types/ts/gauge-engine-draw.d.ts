/**
 * Maranello Luce Design - Gauge engine draw routines
 * Renders ticks, needle, center text, sub-dials, odometer, arc bar, and LEDs.
 */
import type { GaugeRenderPalette } from './gauge-engine-palette';
export interface GaugeDrawState {
    ctx: CanvasRenderingContext2D;
    cx: number;
    cy: number;
    radius: number;
    size: number;
    config: Record<string, unknown>;
    palette: GaugeRenderPalette;
    density: 'sm' | 'md' | 'lg';
    rad: (deg: number) => number;
}
/** Main draw function for the Ferrari gauge. Called per animation frame. */
export declare function drawGauge(state: GaugeDrawState, progress: number): void;
