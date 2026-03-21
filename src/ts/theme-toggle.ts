/**
 * Maranello Luce Design - Theme toggle controller
 * 5-mode cycling: Editorial > Nero > Avorio > Colorblind > Sugar
 */

import type { ThemeMode } from './core/types';
import { setTheme, cycleTheme, getTheme } from './core/utils';
import { icons } from './icons';

export interface ThemeGaugeInstance {
  redraw: () => void;
}

export interface ThemeToggleController {
  getMode: () => ThemeMode;
  setMode: (mode: ThemeMode) => void;
  destroy: () => void;
}

const ICON_NAMES: Record<ThemeMode, string> = {
  editorial: 'contrast',
  nero: 'moon',
  avorio: 'sun',
  colorblind: 'eye',
  sugar: 'sparkle',
};

const LABELS: Record<ThemeMode, string> = {
  editorial: 'Editorial (mixed)',
  nero: 'Full Nero',
  avorio: 'Full Avorio',
  colorblind: 'Colorblind-safe',
  sugar: 'Sugar',
};

function themeIcon(mode: ThemeMode): string {
  const name = ICON_NAMES[mode];
  const factory = icons[name];
  if (!factory) return '';
  const svg = factory();
  return `<span class="mn-icon mn-icon--sm" aria-hidden="true">${svg}</span>`;
}

/**
 * Initialize theme toggle on a button element.
 * Cycles through the five theme modes on click, redrawing gauges after each switch.
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
  toggle.innerHTML = themeIcon(current);
  toggle.title = LABELS[current];

  function applyTheme(): void {
    toggle!.innerHTML = themeIcon(current);
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
