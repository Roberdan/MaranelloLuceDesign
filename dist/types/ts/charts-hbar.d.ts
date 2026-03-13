/**
 * Maranello Luce Design - Horizontal bar chart (DOM-based)
 */
import type { HBarChartOptions, HBarChartController } from './core/types';
/** Create a horizontal bar chart inside a container element. */
export declare function hBarChart(container: string | Element | null | undefined, opts?: HBarChartOptions): HBarChartController | null;
