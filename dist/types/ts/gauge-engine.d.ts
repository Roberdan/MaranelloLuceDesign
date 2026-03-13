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
    constructor(canvas: HTMLCanvasElement);
    get palette(): import("./gauge-engine-palette").GaugeRenderPalette;
    /** Initialize canvas size from data attribute or parent bounds. */
    init(): void;
    /** Redraw at full progress. */
    redraw(): void;
    /** Animate from 0 to full with ease-in-out-cubic. */
    animate(): void;
    /** Convert degrees to radians. */
    rad(deg: number): number;
    /** Draw the gauge at a given animation progress (0..1). */
    draw(progress: number): void;
}
