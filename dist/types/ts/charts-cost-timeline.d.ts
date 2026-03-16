export interface CostSeries {
    id: string;
    label: string;
    color?: string;
    values: number[];
}
export interface CostTimelineOptions {
    labels: string[];
    series: CostSeries[];
    height?: number;
    stacked?: boolean;
    animate?: boolean;
    unit?: string;
    onHover?: (label: string, values: Record<string, number>) => void;
}
export interface CostTimelineController {
    update: (opts: Partial<CostTimelineOptions>) => void;
    destroy: () => void;
}
export declare function costTimeline(canvas: HTMLCanvasElement, opts: CostTimelineOptions): CostTimelineController;
