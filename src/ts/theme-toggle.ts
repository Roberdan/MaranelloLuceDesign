/**
 * Maranello Luce Design - Theme toggle controller
 * 5-mode cycling: Editorial > Nero > Avorio > Colorblind > Sugar
 */

import type { ThemeMode } from './core/types';
import { setTheme, cycleTheme, getTheme } from './core/utils';
import { platformIcons } from './icons-platform';
import { actionIcons } from './icons-actions';

export interface ThemeGaugeInstance {
  redraw: () => void;
}

export interface ThemeToggleController {
  getMode: () => ThemeMode;
  setMode: (mode: ThemeMode) => void;
  destroy: () => void;
}

const THEME_ICONS: Record<ThemeMode, () => string> = {
  editorial: platformIcons.contrast,
  nero: platformIcons.moon,
  avorio: platformIcons.sun,
  colorblind: actionIcons.eye,
  sugar: platformIcons.sparkle,
};

const LABELS: Record<ThemeMode, string> = {
  editorial: 'Editorial (mixed)',
  nero: 'Full Nero',
  avorio: 'Full Avorio',
  colorblind: 'Colorblind-safe',
  sugar: 'Sugar',
};

function themeIcon(mode: ThemeMode): string {
  const factory = THEME_ICONS[mode];
  if (!factory) return '';
  return `<span class="mn-icon mn-icon--sm" aria-hidden="true">${factory()}</span>`;
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
  toggle.setAttribute('aria-label', LABELS[current]);

  function applyTheme(): void {
    toggle!.innerHTML = themeIcon(current);
    toggle!.title = LABELS[current];
    toggle!.setAttribute('aria-label', LABELS[current]);
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
