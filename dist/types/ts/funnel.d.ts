/**
 * Maranello Luce Design - Funnel/Sankey pipeline visualization (SVG)
 * Per-stage exit branches for On Hold / Withdrawn.
 */
import type { SankeyOptions, SankeyController } from './core/types';
/** Create an SVG Sankey funnel inside a container. */
export declare function funnel(container: string | Element | null, options?: SankeyOptions): SankeyController;
