/**
 * Maranello Luce Design - Spark bar chart (Canvas 2D)
 * Vertical bar chart with rounded tops, grid lines, and labels.
 */
import type { BarDataItem, BarChartOptions } from './core/types';
/** Render a vertical bar chart on a canvas element. */
export declare function barChart(canvas: HTMLCanvasElement, data: BarDataItem[], opts?: BarChartOptions): HTMLCanvasElement | undefined;
