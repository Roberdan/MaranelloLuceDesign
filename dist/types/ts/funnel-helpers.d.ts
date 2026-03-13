/**
 * Maranello Luce Design - Funnel/Sankey SVG helpers
 */
/** Relative luminance of a hex color. */
export declare function hexLum(hex: string): number;
/** Auto-select text color for contrast against a background. */
export declare function autoTextColor(bg: string): string;
/** Resolve a container argument to an Element. */
export declare function resolveContainer(c: string | Element | null | undefined): Element | null;
/** Create an SVG element with attributes. */
export declare function svgEl(tag: string, attrs?: Record<string, string | number>): SVGElement;
/** Create an SVG text element. */
export declare function svgText(attrs: Record<string, string | number>, text: string): SVGElement;
/** Build a trapezoid path for connectors between funnel stages. */
export declare function trapPath(x1: number, w1: number, x2: number, w2: number, y1: number, y2: number): string;
/** Build cumulative reach counts (bottom-up). */
export declare function cumulativeReach(counts: number[]): number[];
