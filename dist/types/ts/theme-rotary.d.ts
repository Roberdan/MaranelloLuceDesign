/**
 * Maranello Luce Design - Theme Rotary Controller
 * Outer ring: 4 color theme positions (editorial, nero, avorio, colorblind).
 */
import type { ThemeMode } from './core/types';
export interface ThemeRotaryOptions {
    container: HTMLElement;
    size?: number;
    onChange?: (theme: ThemeMode) => void;
}
export interface ThemeRotaryController {
    getTheme: () => ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    destroy: () => void;
}
/** Create a theme rotary controller. */
export declare function themeRotary(opts: ThemeRotaryOptions): ThemeRotaryController;
