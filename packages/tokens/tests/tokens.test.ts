import { describe, it, expect, beforeEach, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  SEMANTIC_COLOR, COLOR, FONT, TEXT_SIZE, SPACE, DURATION, EASE,
  RADIUS, SHADOW, SCOPE_COLOR, Z_INDEX, THEME_ORDER,
  getTheme, setTheme, cycleTheme, cssVar, palette,
  setLocale, getLocale, resetLocale,
  debounce, throttle, clamp, lerp, EventBus, eventBus,
} from '../src/ts/index';
import type { ThemeMode } from '../src/ts/index';

const CSS_DIR = resolve(__dirname, '../src/css');
const readCss = (f: string) => readFileSync(resolve(CSS_DIR, f), 'utf8');

// 1. Token CSS files exist
describe('Token CSS files', () => {
  it.each(['tokens-color.css', 'tokens-spacing-type.css', 'themes-base.css',
    'bridge-shadcn.css', 'themes.css', 'index.css',
  ])('%s exists', (f) => { expect(existsSync(resolve(CSS_DIR, f))).toBe(true); });
});

// 2. theme CSS files contain all 6 non-default theme selectors
describe('theme CSS files', () => {
  it('contains all non-default theme selectors', () => {
    const base = readCss('themes-base.css');
    const navy = readCss('themes-navy.css');
    const all = base + navy;
    for (const s of ['body.mn-nero', 'body.mn-avorio', 'body.mn-colorblind', 'body.mn-sugar', 'body.mn-navy'])
      expect(all).toContain(s);
  });
});

// 3. bridge-shadcn.css maps shadcn variables
describe('bridge-shadcn.css', () => {
  it('maps background, foreground, primary, border, ring, radius', () => {
    const css = readCss('bridge-shadcn.css');
    for (const v of ['--background', '--foreground', '--primary', '--border', '--ring', '--radius'])
      expect(css).toContain(`${v}:`);
  });
});

// 4. Token constants have expected keys
describe('Token constants', () => {
  it('SEMANTIC_COLOR has ACCENT, ERROR, SURFACE, TEXT, BORDER, FOCUS_RING', () => {
    expect(SEMANTIC_COLOR.ACCENT).toBe('--mn-accent');
    expect(SEMANTIC_COLOR.ERROR).toBe('--mn-error');
    expect(SEMANTIC_COLOR.SURFACE).toBe('--mn-surface');
    expect(SEMANTIC_COLOR.TEXT).toBe('--mn-text');
    expect(SEMANTIC_COLOR.BORDER).toBe('--mn-border');
    expect(SEMANTIC_COLOR.FOCUS_RING).toBe('--mn-focus-ring');
  });
  it('COLOR legacy maps to semantic tokens', () => {
    expect(COLOR.ROSSO_CORSA).toBe('--mn-error');
    expect(COLOR.GIALLO_FERRARI).toBe('--mn-accent');
    expect(COLOR.SIGNAL_DANGER).toBe('--signal-danger');
  });
  it('FONT has BODY, MONO, DISPLAY', () => {
    expect(FONT.BODY).toBe('--font-body');
    expect(FONT.MONO).toBe('--font-mono');
    expect(FONT.DISPLAY).toBe('--font-display');
  });
  it('TEXT_SIZE NANO-XXL, SPACE XXS-XXL', () => {
    for (const k of ['NANO', 'MICRO', 'SMALL', 'BASE', 'LARGE', 'XL', 'XXL'])
      expect(TEXT_SIZE).toHaveProperty(k);
    for (const k of ['XXS', 'XS', 'SM', 'MD', 'LG', 'XL', 'XXL'])
      expect(SPACE).toHaveProperty(k);
  });
  it('DURATION, EASE, RADIUS, SHADOW, SCOPE_COLOR, Z_INDEX', () => {
    expect(DURATION.FAST).toBe('--duration-fast');
    expect(EASE.IN_OUT).toBe('--ease-in-out');
    expect(RADIUS.FULL).toBe('--radius-full');
    expect(Object.keys(SHADOW)).toEqual(['SM', 'MD', 'LG']);
    expect(SCOPE_COLOR.GLOBAL).toBe('--scope-global');
    expect(Object.keys(Z_INDEX)).toEqual(['DROPDOWN', 'MODAL', 'TOAST', 'TOOLTIP']);
  });
});

// 5. ThemeMode compile-time check
describe('ThemeMode type', () => {
  it('accepts all six valid theme values matching THEME_ORDER', () => {
    const themes: ThemeMode[] = ['editorial', 'nero', 'avorio', 'colorblind', 'sugar', 'navy'];
    expect(THEME_ORDER).toEqual(themes);
  });
});

// 6. setTheme / getTheme round-trip
describe('setTheme / getTheme', () => {
  beforeEach(() => { document.body.className = ''; });
  it('defaults to editorial when no class set', () => {
    expect(getTheme()).toBe('editorial');
  });
  it('round-trips nero via classList', () => {
    setTheme('nero');
    expect(getTheme()).toBe('nero');
    expect(document.body.classList.contains('mn-nero')).toBe(true);
  });
  it('round-trips avorio', () => {
    setTheme('avorio');
    expect(getTheme()).toBe('avorio');
    expect(document.body.classList.contains('mn-avorio')).toBe(true);
  });
  it('removes previous theme class when switching', () => {
    setTheme('sugar');
    setTheme('colorblind');
    expect(document.body.classList.contains('mn-sugar')).toBe(false);
    expect(document.body.classList.contains('mn-colorblind')).toBe(true);
  });
  it('editorial produces empty body className', () => {
    setTheme('editorial');
    expect(document.body.className).toBe('');
  });
});

// 7. cycleTheme
describe('cycleTheme', () => {
  beforeEach(() => { document.body.className = ''; });
  it('cycles through all 6 themes in order', () => {
    const r: ThemeMode[] = [];
    for (let i = 0; i < 6; i++) r.push(cycleTheme());
    expect(r).toEqual(['nero', 'avorio', 'colorblind', 'sugar', 'navy', 'editorial']);
  });
  it('wraps back to nero after full cycle', () => {
    setTheme('navy');
    expect(cycleTheme()).toBe('editorial');
    expect(cycleTheme()).toBe('nero');
  });
});

// 8. palette()
describe('palette', () => {
  it('returns semantic keys by default', () => {
    const p = palette();
    for (const k of ['surface', 'text', 'accent', 'border', 'focusRing'])
      expect(p).toHaveProperty(k);
  });
  it('includes primitives when opted in, excludes when not', () => {
    const inc = palette(document.documentElement, { includePrimitives: true });
    for (const k of ['giallo', 'rosso', 'neroAssoluto']) expect(inc).toHaveProperty(k);
    expect(palette(document.documentElement, { includePrimitives: false })).not.toHaveProperty('giallo');
  });
});

// 9. cssVar()
describe('cssVar', () => {
  it('returns fallback for unset variable', () => {
    expect(cssVar('--mn-nonexistent', '#FF0000')).toBe('#FF0000');
  });
  it('returns empty string as default fallback', () => {
    expect(cssVar('--mn-nonexistent')).toBe('');
  });
});

// 10. Locale functions
describe('Locale', () => {
  beforeEach(() => { resetLocale(); });
  it('exports setLocale, getLocale, resetLocale as functions', () => {
    for (const fn of [setLocale, getLocale, resetLocale]) expect(typeof fn).toBe('function');
  });
  it('returns English defaults initially', () => {
    const l = getLocale();
    expect(l.themes.editorial).toBe('Editorial');
    expect(l.a11y.reducedMotion).toBe('Reduced Motion');
    expect(l.stateScaffold.loading).toBe('Loading...');
    expect(l.filterPanel.clear).toBe('CLEAR');
  });
  it('merges overrides while preserving unset defaults', () => {
    setLocale({ themes: { nero: 'Dunkel' }, a11y: { display: 'Anzeige' } });
    const l = getLocale();
    expect(l.themes.nero).toBe('Dunkel');
    expect(l.themes.editorial).toBe('Editorial');
    expect(l.a11y.display).toBe('Anzeige');
    expect(l.a11y.textSize).toBe('Text Size');
  });
  it('resetLocale restores defaults', () => {
    setLocale({ themes: { nero: 'Dunkel' } });
    resetLocale();
    expect(getLocale().themes.nero).toBe('Nero');
  });
});

// 11. Utility functions
describe('Utility functions', () => {
  it('clamp constrains values to [min, max]', () => {
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(-10, 0, 100)).toBe(0);
  });
  it('lerp interpolates linearly', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
  });
  it('debounce delays invocation until after wait', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d(); d(); d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
  it('throttle limits call frequency', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t(); expect(fn).toHaveBeenCalledTimes(1);
    t(); t(); expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});

// 12. EventBus: on/emit/off lifecycle
describe('EventBus', () => {
  it('emits and receives events with typed detail', () => {
    const bus = new EventBus<{ 'telemetry-update': { rpm: number } }>();
    const h = vi.fn();
    bus.on('telemetry-update', h);
    bus.emit('telemetry-update', { rpm: 8500 });
    expect(h).toHaveBeenCalledWith({ rpm: 8500 });
  });
  it('off removes a specific handler', () => {
    const bus = new EventBus<{ 'lap-complete': { time: number } }>();
    const h = vi.fn();
    bus.on('lap-complete', h);
    bus.off('lap-complete', h);
    bus.emit('lap-complete', { time: 78.4 });
    expect(h).not.toHaveBeenCalled();
  });
  it('supports multiple handlers on the same event', () => {
    const bus = new EventBus<{ 'pit-stop': { duration: number } }>();
    const a = vi.fn(), b = vi.fn();
    bus.on('pit-stop', a);
    bus.on('pit-stop', b);
    bus.emit('pit-stop', { duration: 2.4 });
    expect(a).toHaveBeenCalledWith({ duration: 2.4 });
    expect(b).toHaveBeenCalledWith({ duration: 2.4 });
  });
  it('removeAll clears all listeners', () => {
    const bus = new EventBus<{ 'flag': string }>();
    const h = vi.fn();
    bus.on('flag', h);
    bus.removeAll();
    bus.emit('flag', 'checkered');
    expect(h).not.toHaveBeenCalled();
  });
  it('shared eventBus singleton exists', () => {
    expect(eventBus).toBeInstanceOf(EventBus);
  });
});
