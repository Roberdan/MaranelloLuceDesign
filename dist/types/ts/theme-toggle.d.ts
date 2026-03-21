/**
 * Maranello Luce Design - Theme toggle controller
 * 5-mode cycling: Editorial > Nero > Avorio > Colorblind > Sugar
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
 * Cycles through the five theme modes on click, redrawing gauges after each switch.
 */
export declare function initThemeToggle(toggleId: string | HTMLElement, gaugeInstances?: ThemeGaugeInstance[], onAutoContrast?: (selector: string) => void): ThemeToggleController;
