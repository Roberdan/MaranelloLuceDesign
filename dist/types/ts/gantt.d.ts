/**
 * Maranello Luce Design - Gantt chart factory
 * Creates an interactive, canvas-based Gantt timeline.
 */
import type { GanttTask, GanttController } from './core/types';
/** Create an interactive Gantt chart inside a container element. */
export declare function gantt(container: HTMLElement | null, tasks: GanttTask[], userOpts?: Record<string, unknown>): GanttController | null;
