/**
 * Maranello Luce Design - Ferrari dial controls
 * Manettino rotary switch and stepped rotary dial.
 */
import type { ManettinoOptions, SteppedDialOptions, IndexedControlController } from './core/types';
/** Create a manettino rotary dial control. */
export declare function manettino(container: HTMLElement, opts?: ManettinoOptions): IndexedControlController;
/** Create a stepped rotary dial control. */
export declare function steppedRotary(container: HTMLElement, opts?: SteppedDialOptions): IndexedControlController;
