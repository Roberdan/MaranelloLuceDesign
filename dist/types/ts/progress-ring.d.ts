/**
 * Maranello Luce Design - Progress ring (SVG-based)
 */
import type { ProgressRingOptions } from './core/types';
interface ProgressRingController {
    setValue: (newVal: number) => void;
}
/** Render an animated SVG progress ring inside a container. */
export declare function progressRing(container: HTMLElement, opts?: ProgressRingOptions): ProgressRingController;
export {};
