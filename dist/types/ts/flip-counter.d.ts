/**
 * Maranello Luce Design - Animated flip counter (DOM-based)
 */
import type { FlipCounterOptions } from './core/types';
interface FlipCounterController {
    setValue: (v: number) => void;
    getValue: () => number;
    increment: (by?: number) => void;
    decrement: (by?: number) => void;
}
/** Create an animated flip counter inside a container element. */
export declare function flipCounter(containerEl: HTMLElement, opts?: FlipCounterOptions): FlipCounterController;
export {};
