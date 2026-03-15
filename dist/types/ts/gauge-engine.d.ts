/** FerrariGauge: full-featured canvas gauge with animation support. */
export declare class FerrariGauge {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    config: Record<string, unknown>;
    dpr: number;
    size: number;
    cx: number;
    cy: number;
    radius: number;
    density: 'sm' | 'md' | 'lg';
    private srSpan;
    private _resizeObserver;
    constructor(canvas: HTMLCanvasElement);
    get palette(): import("./gauge-engine-palette").GaugeRenderPalette;
    /** Initialize canvas size from data attribute or parent bounds. */
    init(): void;
    /** Set up ARIA attributes and screen-reader helpers on the canvas. */
    private initA11y;
    /** Build an accessible label from gauge config values. */
    private buildA11yLabel;
    /** Sync aria-label and sr-only span with current config. */
    private updateA11y;
    /** Redraw at full progress. */
    redraw(): void;
    /** Animate from 0 to full with ease-in-out-cubic. */
    animate(): void;
    /** Convert degrees to radians. */
    rad(deg: number): number;
    /** Draw the gauge at a given animation progress (0..1). */
    draw(progress: number): void;
    /** Attach ResizeObserver for size='fluid' mode. */
    private _attachFluidObserver;
    /** Clean up ResizeObserver and screen reader helpers. */
    destroy(): void;
}
