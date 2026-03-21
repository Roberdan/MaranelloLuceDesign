/**
 * Maranello Luce Design - Theme toggle controller
 * 4-mode cycling: Editorial (mixed) > Nero (full dark) > Avorio (full light) > Colorblind
 */

import type { ThemeMode } from './core/types';
import { setTheme, cycleTheme, getTheme } from './core/utils';

export interface ThemeGaugeInstance {
  redraw: () => void;
}

export interface ThemeToggleController {
  getMode: () => ThemeMode;
  setMode: (mode: ThemeMode) => void;
  destroy: () => void;
}

const ICONS: Record<ThemeMode, string> = {
  editorial: '\u25D1',
  nero: '\u25CF',
  avorio: '\u25CB',
  colorblind: '\u25D0',
  sugar: '\u25A8',
};

const LABELS: Record<ThemeMode, string> = {
  editorial: 'Editorial (mixed)',
  nero: 'Full Nero',
  avorio: 'Full Avorio',
  colorblind: 'Colorblind-safe',
  sugar: 'Sugar',
};

/**
 * Initialize theme toggle on a button element.
 * Cycles through the four theme modes on click, redrawing gauges after each switch.
 */
export function initThemeToggle(
  toggleId: string | HTMLElement,
  gaugeInstances: ThemeGaugeInstance[] = [],
  onAutoContrast?: (selector: string) => void,
): ThemeToggleController {
  const toggle = typeof toggleId === 'string'
    ? document.getElementById(toggleId)
    : toggleId;
  if (!toggle) {
    return {
      getMode: () => getTheme(),
      setMode: (m: ThemeMode) => setTheme(m),
      destroy: () => {},
    };
  }

  let current = getTheme();
  toggle.textContent = ICONS[current];
  toggle.title = LABELS[current];

  function applyTheme(): void {
    toggle!.textContent = ICONS[current];
    toggle!.title = LABELS[current];
    requestAnimationFrame(() => {
      gaugeInstances.forEach((g) => g.redraw());
      if (onAutoContrast) onAutoContrast('.mn-treemap__cell');
    });
  }

  const onClick = (): void => {
    current = cycleTheme();
    applyTheme();
  };

  toggle.addEventListener('click', onClick);

  return {
    getMode: () => current,
    setMode: (mode: ThemeMode) => {
      current = mode;
      setTheme(mode);
      applyTheme();
    },
    destroy: () => {
      toggle.removeEventListener('click', onClick);
    },
  };
}
