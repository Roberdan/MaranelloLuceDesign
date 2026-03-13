/** Maranello Luce Design - Drag interaction controls (rotary knob + slider) */
import type { RotaryOptions, RotaryController, SliderOptions, SliderController } from './core/types';
/** Initialize a rotary knob with drag, click, and keyboard support. */
export declare function initRotary(el: HTMLElement, options?: RotaryOptions): RotaryController;
/** Initialize a slider with drag, touch, and keyboard support. */
export declare function initSlider(el: HTMLElement, options?: SliderOptions): SliderController;
