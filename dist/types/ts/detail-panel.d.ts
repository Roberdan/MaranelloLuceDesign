/**
 * Maranello Luce Design - Detail panel controller
 * Creates and manages a detail panel instance with edit/save/close lifecycle.
 */
import type { DetailPanelOptions, DetailPanelController } from './core/types';
/** Create a detail panel inside the given container element. */
export declare function createDetailPanel(container: HTMLElement, opts?: DetailPanelOptions): DetailPanelController;
