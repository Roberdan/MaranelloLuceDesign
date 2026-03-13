/**
 * Maranello Luce Design - Gauge engine draw detail routines
 * Needle, center text, sub-dials, odometer, status LED, trend arrow.
 */
import type { GaugeDrawState } from './gauge-engine-draw';
export declare function drawNeedle(s: GaugeDrawState, progress: number, sa: number, totalSweep: number, value: number, max: number, color: string): void;
export declare function drawCenterText(s: GaugeDrawState, c: Record<string, unknown>): void;
export declare function drawSubDials(s: GaugeDrawState, c: Record<string, unknown>, progress: number): void;
export declare function drawOdometer(s: GaugeDrawState, c: Record<string, unknown>): void;
export declare function drawStatusLed(s: GaugeDrawState, c: Record<string, unknown>): void;
export declare function drawTrend(s: GaugeDrawState, c: Record<string, unknown>): void;
