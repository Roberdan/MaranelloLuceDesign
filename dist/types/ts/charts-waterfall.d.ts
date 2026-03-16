export interface WaterfallSegment {
    label: string;
    value: number;
    isTotal?: boolean;
}
export interface WaterfallChartOptions {
    segments: WaterfallSegment[];
    unit?: string;
    animate?: boolean;
    height?: number;
}
/**
 * Render a waterfall chart on a canvas element.
 * Positive values rise, negative values fall, isTotal draws from zero.
 */
export declare function waterfallChart(canvas: HTMLCanvasElement, opts: WaterfallChartOptions): void;
