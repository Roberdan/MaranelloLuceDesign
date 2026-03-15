type ChartFactory = (canvas: HTMLCanvasElement, data: unknown, opts?: Record<string, unknown>) => unknown;
/**
 * Observe the canvas parent for size changes and re-render automatically.
 * Returns a cleanup function that disconnects the observer.
 */
export declare function autoResize(canvas: HTMLCanvasElement, factory: ChartFactory, data: unknown, opts?: Record<string, unknown>): () => void;
/**
 * Auto-resize all canvases matching the selector.
 * Each canvas must have data-chart-type and data-chart-data attributes.
 * Returns a single cleanup function that disconnects all observers.
 */
export declare function autoResizeAll(selector?: string, chartLib?: Record<string, ChartFactory>): () => void;
export {};
