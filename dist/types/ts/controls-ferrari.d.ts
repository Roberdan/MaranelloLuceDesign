/**
 * Maranello Luce Design - Ferrari-style controls
 * Manettino rotary dial, toggle lever, cruise lever, stepped dial.
 */
import type { FerrariToggleOptions, CruiseLeverOptions, IndexedControlController, BooleanControlController } from './core/types';
/** Create a cruise lever control. */
export declare function cruiseLever(container: HTMLElement, opts?: CruiseLeverOptions): IndexedControlController;
/** Create a toggle lever (on/off switch). */
export declare function toggleLever(container: HTMLElement, opts?: FerrariToggleOptions): BooleanControlController;
