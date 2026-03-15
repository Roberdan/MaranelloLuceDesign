/**
 * Maranello Luce Design - Label rendering for data-driven neural nodes.
 */
import type { InternalNode } from './neural-nodes-types';
export declare function drawLabels(ctx: CanvasRenderingContext2D, nodes: InternalNode[], hovered: number, fontBase: string, alpha: (color: string, opacity: number) => string): void;
