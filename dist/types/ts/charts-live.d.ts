/**
 * Maranello Luce Design - Live/real-time graph (Canvas 2D)
 */
import type { LiveGraphOptions } from './core/types';
/** Render a live/real-time line graph with glow effect. */
export declare function liveGraph(canvas: HTMLCanvasElement, data: number[], opts?: LiveGraphOptions): HTMLCanvasElement | undefined;
