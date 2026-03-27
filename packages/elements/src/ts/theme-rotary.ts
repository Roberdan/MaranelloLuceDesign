/**
 * Maranello Luce Design - Theme Rotary Controller
 * Outer ring: 4 color theme positions (editorial, nero, avorio, colorblind).
 */

import type { ThemeMode } from './core/types';
import { getTheme, setTheme, createElement } from './core/utils';
import { eventBus } from './core/events';

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

const THEME_POSITIONS: { mode: ThemeMode; label: string; angle: number }[] = [
  { mode: 'editorial', label: 'ED', angle: -45 },
  { mode: 'nero',      label: 'NR', angle: 45 },
  { mode: 'avorio',    label: 'AV', angle: 135 },
  { mode: 'colorblind', label: 'CB', angle: 225 },
];

const STYLE_ID = 'mn-theme-rotary-css';

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
.mn-theme-rotary{display:inline-flex;flex-direction:column;align-items:center;user-select:none;gap:8px}
.mn-theme-rotary__dial{position:relative;border-radius:50%}
.mn-theme-rotary__ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--mn-border);pointer-events:none}
.mn-theme-rotary__pointer{position:absolute;top:8px;left:50%;width:2px;border-radius:1px;background:var(--mn-accent);transform:translateX(-50%) rotate(0deg);transform-origin:50% calc(var(--rotary-center) - 8px);pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1)}
.mn-theme-rotary__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:.55rem;color:var(--mn-text-muted);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);white-space:nowrap;transition:color .15s}
.mn-theme-rotary__pos--active{color:var(--mn-text);font-weight:700}
.mn-theme-rotary__center{position:absolute;top:50%;left:50%;border-radius:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center}
`;
  document.head.appendChild(s);
}

function angleForTheme(mode: ThemeMode): number {
  return THEME_POSITIONS.find((p) => p.mode === mode)?.angle ?? -45;
}

/** Create a theme rotary controller. */
export function themeRotary(opts: ThemeRotaryOptions): ThemeRotaryController {
  ensureStyles();
  const { container, size = 140 } = opts;
  const center = size / 2;
  const labelRadius = size / 2 + 18;
  const pointerLen = size * 0.18;
  const centerSize = size * 0.32;

  const root = createElement('div', 'mn-theme-rotary');
  const dial = createElement('div', 'mn-theme-rotary__dial');
  dial.style.width = dial.style.height = size + 'px';
  root.appendChild(dial);

  // outer ring decoration
  const ring = createElement('div', 'mn-theme-rotary__ring');
  dial.appendChild(ring);

  // pointer
  const pointer = createElement('div', 'mn-theme-rotary__pointer');
  pointer.style.height = pointerLen + 'px';
  pointer.style.setProperty('--rotary-center', center + 'px');
  dial.appendChild(pointer);

  // position labels around dial
  const labels = new Map<ThemeMode, HTMLElement>();
  for (const pos of THEME_POSITIONS) {
    const rad = (pos.angle - 90) * (Math.PI / 180);
    const lx = center + Math.cos(rad) * labelRadius;
    const ly = center + Math.sin(rad) * labelRadius;

    const el = createElement('div', 'mn-theme-rotary__pos');
    el.textContent = pos.label;
    el.style.left = lx + 'px';
    el.style.top = ly + 'px';
    el.dataset.theme = pos.mode;
    el.addEventListener('click', () => applyTheme(pos.mode));
    dial.appendChild(el);
    labels.set(pos.mode, el);
  }

  // decorative center hub
  const centerBtn = createElement('div', 'mn-theme-rotary__center');
  centerBtn.style.width = centerBtn.style.height = centerSize + 'px';
  centerBtn.style.background = 'radial-gradient(circle at 40% 35%, var(--mn-border), var(--mn-surface-raised))';
  centerBtn.style.boxShadow = '0 3px 8px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.15)';
  centerBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="var(--mn-accent)" opacity="0.7"/></svg>';
  dial.appendChild(centerBtn);

  container.appendChild(root);

  /* ARIA: radiogroup pattern with aria-activedescendant */
  const rotaryId = 'mn-rotary-' + Math.random().toString(36).slice(2, 7);
  root.setAttribute('role', 'radiogroup');
  root.setAttribute('aria-label', 'Theme selector');
  root.setAttribute('tabindex', '0');

  for (const [mode, el] of labels) {
    el.id = `${rotaryId}-${mode}`;
    el.setAttribute('role', 'radio');
    el.setAttribute('aria-checked', String(mode === getTheme()));
  }
  root.setAttribute('aria-activedescendant', `${rotaryId}-${getTheme()}`);

  root.addEventListener('keydown', (e: KeyboardEvent) => {
    const current = getTheme();
    const idx = THEME_POSITIONS.findIndex((p) => p.mode === current);
    let next = idx;

    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown':
        e.preventDefault();
        next = (idx + 1) % THEME_POSITIONS.length;
        break;
      case 'ArrowLeft': case 'ArrowUp':
        e.preventDefault();
        next = (idx - 1 + THEME_POSITIONS.length) % THEME_POSITIONS.length;
        break;
      case 'Home': e.preventDefault(); next = 0; break;
      case 'End': e.preventDefault(); next = THEME_POSITIONS.length - 1; break;
      case ' ': case 'Enter': e.preventDefault(); return;
      default: return;
    }
    applyTheme(THEME_POSITIONS[next].mode);
  });

  function applyTheme(mode: ThemeMode): void {
    setTheme(mode);
    updateVisual();
    eventBus.emit('theme:change', { theme: mode });
    opts.onChange?.(mode);
  }

  function updateVisual(): void {
    const current = getTheme();
    const angle = angleForTheme(current);
    pointer.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    root.setAttribute('aria-activedescendant', `${rotaryId}-${current}`);

    for (const [mode, el] of labels) {
      const active = mode === current;
      el.classList.toggle('mn-theme-rotary__pos--active', active);
      el.setAttribute('aria-checked', String(active));
    }
  }

  // initial render
  updateVisual();

  return {
    getTheme,
    setTheme: applyTheme,
    destroy: () => { root.remove(); },
  };
}
