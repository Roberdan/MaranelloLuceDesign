interface ChartMeta {
    type: string;
    [key: string]: unknown;
}
/** Attach full chart interaction (crosshair, tooltip, keyboard). */
export declare function chartInteract(canvas: HTMLCanvasElement, meta: ChartMeta, series?: string[]): {
    hide: () => void;
    update: (newMeta: Partial<ChartMeta>) => void;
} | void;
/** Attach sparkline hover interaction with overlay canvas. */
export declare function sparklineInteract(canvas: HTMLCanvasElement, data: number[], opts?: Record<string, unknown>): void;
export {};
