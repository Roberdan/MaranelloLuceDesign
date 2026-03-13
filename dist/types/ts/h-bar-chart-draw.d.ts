/** Compute relative luminance of a hex color (WCAG formula). */
export declare function hexLum(hex: string): number;
/** Create an HTML element with optional class and text. */
export declare function createEl(tag: string, cls?: string, text?: string): HTMLElement;
/** Clamp value between min and max. */
export declare function clampVal(v: number, min: number, max: number): number;
/** Normalize a color string to 6-digit hex, with CSS var fallback. */
export declare function normalizeHex(color: string | null | undefined): string;
/** Build evenly-spaced tick values from 0 to maxValue. */
export declare function buildTicks(maxValue: number): number[];
export interface ListenerRecord {
    el: HTMLElement;
    evt: string;
    handler: EventListener;
}
export interface NormalizedBar {
    label: string;
    value: number;
    color: string;
}
export interface HBarRenderState {
    disposed: boolean;
    timers: number[];
    listeners: ListenerRecord[];
    activeIndex: number;
    opts: {
        title?: string;
        bars?: Array<{
            label?: string;
            value?: number;
            color?: string;
        }>;
        unit?: string;
        maxValue?: number;
        showValues?: boolean;
        showGrid?: boolean;
        sortDescending?: boolean;
        animate?: boolean;
        barHeight?: number;
        onClick?: (bar: NormalizedBar, index: number) => void;
    };
}
export interface HBarRenderContext {
    state: HBarRenderState;
    root: HTMLElement;
    frame: HTMLElement;
    titleEl: HTMLElement;
    gridLayer: HTMLElement;
    rowsLayer: HTMLElement;
    axisLabels: HTMLElement;
    tooltip: HTMLElement;
}
/** Clean up pending animation timers. */
export declare function cleanupTimers(state: HBarRenderState): void;
/** Register an event listener and track it for cleanup. */
export declare function addListener(state: HBarRenderState, el: HTMLElement, evt: string, handler: EventListener): void;
/** Show tooltip near the cursor. */
export declare function showTip(tooltip: HTMLElement, frame: HTMLElement, text: string, evt: MouseEvent): void;
/** Hide tooltip. */
export declare function hideTip(tooltip: HTMLElement): void;
/** Normalize raw bar data into a consistent shape. */
export declare function normalizeBars(bars: Array<{
    label?: string;
    value?: number;
    color?: string;
}>, sortDescending: boolean): NormalizedBar[];
/** Render the full horizontal bar chart into its DOM context. */
export declare function renderHBar(ctx: HBarRenderContext): void;
