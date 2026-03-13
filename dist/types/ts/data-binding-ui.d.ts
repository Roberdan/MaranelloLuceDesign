/**
 * Maranello Luce Design - Data binding UI utilities
 * Binds sliders, controls, gauges, and charts to data sources.
 */
interface GaugeLike {
    config: {
        complications?: Record<string, unknown>;
        [key: string]: unknown;
    };
    animate: () => void;
}
interface SliderLike {
    setValue: (value: unknown) => void;
}
interface BoundControlElement extends Element {
    _mnSlider?: SliderLike;
}
interface ChartBindOptions {
    url?: string;
    fetch?: () => Promise<unknown>;
    map?: (data: unknown) => unknown;
    interval?: number;
    chartOpts?: Record<string, unknown>;
}
interface ControlBindOptions {
    url: string;
    mapRead?: (data: unknown) => unknown;
    mapWrite?: (value: unknown) => string;
}
/** Update an existing gauge's configuration and re-animate. */
export declare function updateGauge(canvas: HTMLCanvasElement, newConfig: Partial<GaugeLike['config']>, gaugeMap?: Map<HTMLCanvasElement, GaugeLike>): void;
/** Bind a chart to a data source with optional polling. */
export declare function bindChart(canvas: HTMLCanvasElement, chartType: string, options: ChartBindOptions, chartRegistry?: Record<string, (c: HTMLCanvasElement, d: unknown, o: Record<string, unknown>) => void>): number | undefined;
/** Auto-initialize sliders from data attributes. */
export declare function autoBindSliders(initSlider?: (el: Element, config: Record<string, string | number>) => void): void;
/** Bind a control element to a REST endpoint. */
export declare function bindControl(el: BoundControlElement, options: ControlBindOptions): void;
export {};
