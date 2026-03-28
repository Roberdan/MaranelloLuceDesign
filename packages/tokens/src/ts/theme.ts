/**
 * @maranello/tokens - Theme management
 * Read, set, and cycle through the five Ferrari Luce themes.
 */

import type { ThemeMode } from './types';

export const THEME_ORDER: ThemeMode[] = [
  'editorial',
  'nero',
  'avorio',
  'colorblind',
  'sugar',
];

export const BODY_CLASSES: Record<ThemeMode, string> = {
  editorial: '',
  nero: 'mn-nero',
  avorio: 'mn-avorio',
  colorblind: 'mn-colorblind',
  sugar: 'mn-sugar',
};

/** Get the current active theme mode from body classes. */
export function getTheme(): ThemeMode {
  const cl = document.body.classList;
  if (cl.contains('mn-nero')) return 'nero';
  if (cl.contains('mn-avorio')) return 'avorio';
  if (cl.contains('mn-colorblind')) return 'colorblind';
  if (cl.contains('mn-sugar')) return 'sugar';
  return 'editorial';
}

/** Set the active theme mode. Removes all other theme classes first. */
export function setTheme(mode: ThemeMode): void {
  for (const cls of Object.values(BODY_CLASSES)) {
    if (cls) document.body.classList.remove(cls);
  }
  const cls = BODY_CLASSES[mode];
  if (cls) document.body.classList.add(cls);
  try {
    localStorage.setItem('mn-theme', mode);
  } catch (_err) {
    /* Storage can be blocked in privacy modes; class-based theme still applies. */
  }
}

/** Cycle to the next theme in order. */
export function cycleTheme(): ThemeMode {
  const current = getTheme();
  const idx = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  setTheme(next);
  return next;
}

/** Read the accent color from CSS custom properties. */
export function getAccent(fallback: string = '#FFC72C'): string {
  const el = document.body ?? document.documentElement;
  return getComputedStyle(el).getPropertyValue('--mn-accent').trim() || fallback;
}
