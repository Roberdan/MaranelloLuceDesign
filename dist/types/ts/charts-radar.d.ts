/**
 * Maranello Luce Design - Radar/spider chart (Canvas 2D)
 */
import type { RadarDataItem, RadarOptions } from './core/types';
/** Render a radar (spider) chart on a canvas element. */
export declare function radar(canvas: HTMLCanvasElement, data: RadarDataItem[], opts?: RadarOptions): HTMLCanvasElement | undefined;
