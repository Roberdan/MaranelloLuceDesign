/**
 * Maranello Luce Design - Donut chart (Canvas 2D)
 */
import type { DonutSegment, DonutOptions } from './core/types';
/** Render a donut chart on a canvas element. */
export declare function donut(canvas: HTMLCanvasElement, segments: DonutSegment[], opts?: DonutOptions): HTMLCanvasElement | undefined;
