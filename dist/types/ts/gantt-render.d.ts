type Snap = Record<string, unknown>;
/** Render grid lines adapted to current scale. */
export declare function renderGrid(ctx: CanvasRenderingContext2D, s: Snap): void;
/** Render row backgrounds, bars, labels. */
export declare function renderRows(ctx: CanvasRenderingContext2D, s: Snap): void;
/** Render TODAY vertical marker. */
export declare function renderToday(ctx: CanvasRenderingContext2D, s: Snap): void;
/** Render two-tier adaptive header. */
export declare function renderHeader(ctx: CanvasRenderingContext2D, s: Snap): void;
/** Render sidebar labels, chevrons, badges. */
export declare function renderSidebar(ctx: CanvasRenderingContext2D, s: Snap): void;
/** Render scroll indicators. */
export declare function renderScrollbars(ctx: CanvasRenderingContext2D, s: Snap): void;
export {};
