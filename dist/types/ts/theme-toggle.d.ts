/**
 * Maranello Luce Design - Theme toggle controller
 * 4-mode cycling: Editorial (mixed) > Nero (full dark) > Avorio (full light) > Colorblind
 */
import type { ThemeMode } from './core/types';
export interface ThemeGaugeInstance {
    redraw: () => void;
}
export interface ThemeToggleController {
    getMode: () => ThemeMode;
    setMode: (mode: ThemeMode) => void;
    destroy: () => void;
}
/**
 * Initialize theme toggle on a button element.
 * Cycles through the four theme modes on click, redrawing gauges after each switch.
 */
export declare function initThemeToggle(toggleId: string, gaugeInstances?: ThemeGaugeInstance[], onAutoContrast?: (selector: string) => void): ThemeToggleController;
