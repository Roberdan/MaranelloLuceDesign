/**
 * Maranello Luce Design - Accessibility panel controller
 * Wires up the a11y FAB, panel, reset, keyboard, and outside-click behavior.
 */
import type { A11yPanelController } from './core/types';
/**
 * Create and mount the accessibility panel.
 * Returns a controller with getSettings, reset, and destroy methods.
 */
export declare function a11yPanel(): A11yPanelController;
