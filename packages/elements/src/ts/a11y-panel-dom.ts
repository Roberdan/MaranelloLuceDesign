/**
 * Maranello Luce Design - Accessibility panel DOM builder
 * Builds the panel UI, handles settings persistence and application.
 */

import type { A11ySettings } from './core/types';
import { createElement } from './core/utils';
import { icons } from './icons';
import { getLocale } from './locale';

const STORAGE_KEY = 'mn-a11y';

export const DEFAULTS: Readonly<A11ySettings> = {
  fontSize: 'md',
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  lineSpacing: 'normal',
  dyslexiaFont: false,
};

interface SizeEntry { label: string; scale: number }
interface LineSpacingEntry { label: string; value: string }

const SIZES: Record<string, SizeEntry> = {
  sm: { label: 'S', scale: 0.875 },
  md: { label: 'M', scale: 1.0 },
  lg: { label: 'L', scale: 1.125 },
  xl: { label: 'XL', scale: 1.25 },
};

const LINE_SPACINGS: Record<string, LineSpacingEntry> = {
  normal: { label: '1\u00d7', value: 'normal' },
  relaxed: { label: '1.5\u00d7', value: '1.75' },
  loose: { label: '2\u00d7', value: '2.0' },
};

export interface A11yPanelRefs {
  fab: HTMLButtonElement;
  panel: HTMLDivElement;
  sizeButtons: Record<string, HTMLButtonElement>;
  lsButtons: Record<string, HTMLButtonElement>;
  resetBtn: HTMLButtonElement;
}

export function loadSettings(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) as Partial<A11ySettings> };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

export function saveSettings(s: A11ySettings): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
  catch { /* ignore */ }
}

let _dyslexicFontLoaded = false;

function loadDyslexicFont(): void {
  if (_dyslexicFontLoaded || document.fonts.check('12px OpenDyslexic')) { _dyslexicFontLoaded = true; return; }
  _dyslexicFontLoaded = true;
  // Try local dist font first, fall back to CDN for non-bundled consumers
  const style = document.createElement('style');
  style.textContent = [
    "@font-face{font-family:'OpenDyslexic';font-weight:400;font-display:swap;",
    "src:url('dist/fonts/opendyslexic-regular.woff2') format('woff2'),",
    "url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.woff2') format('woff2')}",
    "@font-face{font-family:'OpenDyslexic';font-weight:700;font-display:swap;",
    "src:url('dist/fonts/opendyslexic-bold.woff2') format('woff2'),",
    "url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Bold.woff2') format('woff2')}",
  ].join('');
  document.head.appendChild(style);
}

export function applySettings(settings: A11ySettings): void {
  const root = document.documentElement;
  const body = document.body;
  const sz = SIZES[settings.fontSize] ?? SIZES.md;
  root.style.fontSize = `${sz.scale * 16}px`;
  root.classList.remove('mn-reduced-motion', 'mn-high-contrast');
  body.classList.toggle('mn-a11y-reduced-motion', settings.reducedMotion);
  body.classList.toggle('mn-a11y-high-contrast', settings.highContrast);
  root.classList.toggle('mn-no-focus-ring', !settings.focusVisible);

  if (settings.dyslexiaFont) loadDyslexicFont();
  body.classList.toggle('mn-a11y-dyslexia-font', settings.dyslexiaFont);

  const ls = LINE_SPACINGS[settings.lineSpacing] ?? LINE_SPACINGS.normal;
  if (ls.value === 'normal') {
    root.style.removeProperty('--mn-line-height');
    body.style.removeProperty('line-height');
  } else {
    root.style.setProperty('--mn-line-height', ls.value);
    body.style.lineHeight = ls.value;
  }
}

function slidersIcon(): string {
  return icons.sliders ? icons.sliders() : '';
}

type BooleanSettingKey = 'reducedMotion' | 'highContrast' | 'focusVisible' | 'dyslexiaFont';

function makeToggle(
  settings: A11ySettings,
  label: string,
  key: BooleanSettingKey,
): HTMLDivElement {
  const row = createElement('div', 'mn-a11y-panel__row');
  row.appendChild(createElement('span', 'mn-a11y-panel__row-label', { text: label }));

  const on = settings[key];
  const toggle = createElement('button', `mn-a11y-toggle${on ? ' mn-a11y-toggle--on' : ''}`, {
    role: 'switch',
    'aria-checked': String(on),
    'aria-label': label,
  });
  toggle.appendChild(createElement('span', 'mn-a11y-toggle__thumb'));

  toggle.addEventListener('click', () => {
    settings[key] = !settings[key];
    const nowOn = settings[key];
    toggle.classList.toggle('mn-a11y-toggle--on', nowOn);
    toggle.setAttribute('aria-checked', String(nowOn));
    applySettings(settings);
    saveSettings(settings);
  });

  row.appendChild(toggle);
  return row;
}

export function buildPanel(settings: A11ySettings): A11yPanelRefs {
  const loc = getLocale().a11y;

  const fab = createElement('button', 'mn-a11y-fab', {
    'aria-label': `${loc.display} settings`,
    title: `${loc.display} settings`,
  });
  fab.innerHTML = slidersIcon();

  const panel = createElement('div', 'mn-a11y-panel', {
    role: 'dialog',
    'aria-label': 'Accessibility settings',
  });

  const title = createElement('div', 'mn-a11y-panel__title');
  title.innerHTML = `${slidersIcon()} ${loc.display}`;
  panel.appendChild(title);

  // Font-size group
  const fsGroup = createElement('div', 'mn-a11y-panel__group');
  fsGroup.appendChild(createElement('div', 'mn-a11y-panel__label', { text: loc.textSize }));
  const fsRow = createElement('div', 'mn-a11y-panel__size-btns');
  const sizeButtons: Record<string, HTMLButtonElement> = {};

  for (const key of Object.keys(SIZES)) {
    const btn = createElement('button', 'mn-a11y-panel__size-btn', {
      text: SIZES[key].label,
      'aria-label': `Font size ${SIZES[key].label}`,
    });
    if (settings.fontSize === key) btn.classList.add('mn-a11y-panel__size-btn--active');
    btn.addEventListener('click', () => {
      settings.fontSize = key;
      for (const k of Object.keys(sizeButtons)) {
        sizeButtons[k].classList.toggle('mn-a11y-panel__size-btn--active', k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    sizeButtons[key] = btn;
    fsRow.appendChild(btn);
  }
  fsGroup.appendChild(fsRow);
  panel.appendChild(fsGroup);

  // Line-spacing group
  const lsGroup = createElement('div', 'mn-a11y-panel__group');
  lsGroup.appendChild(createElement('div', 'mn-a11y-panel__label', { text: loc.lineSpacing }));
  const lsRow = createElement('div', 'mn-a11y-panel__size-btns');
  const lsButtons: Record<string, HTMLButtonElement> = {};

  for (const key of Object.keys(LINE_SPACINGS)) {
    const btn = createElement('button', 'mn-a11y-panel__size-btn', {
      text: LINE_SPACINGS[key].label,
      'aria-label': `Line spacing ${LINE_SPACINGS[key].label}`,
    });
    if (settings.lineSpacing === key) btn.classList.add('mn-a11y-panel__size-btn--active');
    btn.addEventListener('click', () => {
      settings.lineSpacing = key;
      for (const k of Object.keys(lsButtons)) {
        lsButtons[k].classList.toggle('mn-a11y-panel__size-btn--active', k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    lsButtons[key] = btn;
    lsRow.appendChild(btn);
  }
  lsGroup.appendChild(lsRow);
  panel.appendChild(lsGroup);

  panel.appendChild(createElement('div', 'mn-a11y-panel__divider'));
  panel.appendChild(makeToggle(settings, loc.dyslexiaFont, 'dyslexiaFont'));
  panel.appendChild(makeToggle(settings, loc.reducedMotion, 'reducedMotion'));
  panel.appendChild(makeToggle(settings, loc.highContrast, 'highContrast'));
  panel.appendChild(makeToggle(settings, loc.focusIndicators, 'focusVisible'));
  panel.appendChild(createElement('div', 'mn-a11y-panel__divider'));

  const resetBtn = createElement('button', 'mn-a11y-panel__reset', { text: loc.resetDefaults });
  panel.appendChild(resetBtn);

  return { fab, panel, sizeButtons, lsButtons, resetBtn };
}
