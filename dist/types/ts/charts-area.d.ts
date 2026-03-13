/**
 * Maranello Luce Design - Area chart (Canvas 2D)
 */
import type { AreaDataset, AreaChartOptions } from './core/types';
/** Render a multi-dataset area chart on a canvas element. */
export declare function areaChart(canvas: HTMLCanvasElement, datasets: AreaDataset[], opts?: AreaChartOptions): HTMLCanvasElement | undefined;
