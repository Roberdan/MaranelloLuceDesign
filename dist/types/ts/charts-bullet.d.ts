/**
 * Maranello Luce Design - Bullet Chart
 * Stephen Few-style target-vs-actual chart.
 * Three layers: qualitative bands → value bar (centered, narrower) → target marker.
 */
export interface BulletRange {
    max: number;
    color?: string;
    label?: string;
}
export interface BulletChartOptions {
    value: number;
    target: number;
    max: number;
    label?: string;
    unit?: string;
    ranges?: BulletRange[];
    height?: number;
    animate?: boolean;
}
export declare function bulletChart(canvas: HTMLCanvasElement, opts: BulletChartOptions): void;
