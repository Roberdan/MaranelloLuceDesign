export interface ConfidenceChartOptions {
    labels: string[];
    values: number[];
    lower: number[];
    upper: number[];
    unit?: string;
    color?: string;
    animate?: boolean;
    height?: number;
}
/**
 * Render a confidence interval chart on a canvas element.
 * Shows a central value line with a shaded band between lower and upper bounds.
 */
export declare function confidenceChart(canvas: HTMLCanvasElement, opts: ConfidenceChartOptions): void;
