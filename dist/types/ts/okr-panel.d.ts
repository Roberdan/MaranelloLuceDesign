/**
 * Maranello Luce Design - OKR Panel: Main Factory
 * Creates an OKR dashboard panel with hero gauge, summary cards, and objective cards.
 * @version 2.0.0
 */
import type { OkrPanelOptions, OkrPanelController } from './okr-panel-utils';
export type { OkrPanelOptions, OkrPanelController } from './okr-panel-utils';
/**
 * Create an OKR dashboard panel inside the given container.
 * Returns a controller with update() and destroy() methods.
 */
export declare function okrPanel(container: string | Element, opts?: OkrPanelOptions): OkrPanelController | null;
