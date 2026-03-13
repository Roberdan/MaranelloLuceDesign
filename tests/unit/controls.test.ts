/**
 * Unit tests for controls: dialogs, tabs, drag, and a11y-panel defaults.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- initDropdown ---
describe('initDropdown', () => {
  function makeDropdown() {
    const el = document.createElement('div');
    el.innerHTML = `
      <button class="mn-dropdown__trigger"><span>Select</span></button>
      <ul class="mn-dropdown__menu">
        <li class="mn-dropdown__item" tabindex="-1">Option A</li>
        <li class="mn-dropdown__item" tabindex="-1">Option B</li>
      </ul>
    `;
    document.body.appendChild(el);
    return el;
  }

  it('throws if trigger element is missing', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = document.createElement('div');
    expect(() => initDropdown(el)).toThrow('Dropdown: missing .mn-dropdown__trigger');
  });

  it('sets aria-haspopup on trigger', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    initDropdown(el);
    const trigger = el.querySelector('.mn-dropdown__trigger');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('sets role=listbox on menu', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    initDropdown(el);
    const menu = el.querySelector('.mn-dropdown__menu');
    expect(menu?.getAttribute('role')).toBe('listbox');
  });

  it('sets role=option on items', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    initDropdown(el);
    const items = el.querySelectorAll('.mn-dropdown__item');
    items.forEach((item) => {
      expect(item.getAttribute('role')).toBe('option');
    });
  });

  it('returns open/close controller', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    const ctrl = initDropdown(el);
    expect(typeof ctrl.open).toBe('function');
    expect(typeof ctrl.close).toBe('function');
  });

  it('open adds mn-dropdown--open class', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    const ctrl = initDropdown(el);
    ctrl.open();
    expect(el.classList.contains('mn-dropdown--open')).toBe(true);
  });

  it('close removes mn-dropdown--open class', async () => {
    const { initDropdown } = await import('../../src/ts/controls-dialogs');
    const el = makeDropdown();
    const ctrl = initDropdown(el);
    ctrl.open();
    ctrl.close();
    expect(el.classList.contains('mn-dropdown--open')).toBe(false);
  });
});

// --- initTabs ---
describe('initTabs', () => {
  function makeTabs() {
    const el = document.createElement('div');
    el.innerHTML = `
      <button class="mn-tabs__tab mn-tabs__tab--active">Tab 1</button>
      <button class="mn-tabs__tab">Tab 2</button>
      <button class="mn-tabs__tab">Tab 3</button>
      <div class="mn-tabs__panel">Panel 1</div>
      <div class="mn-tabs__panel">Panel 2</div>
      <div class="mn-tabs__panel">Panel 3</div>
    `;
    return el;
  }

  it('returns activate controller', async () => {
    const { initTabs } = await import('../../src/ts/controls-dialogs');
    const el = makeTabs();
    const ctrl = initTabs(el);
    expect(typeof ctrl.activate).toBe('function');
  });

  it('sets role=tab on each tab', async () => {
    const { initTabs } = await import('../../src/ts/controls-dialogs');
    const el = makeTabs();
    initTabs(el);
    el.querySelectorAll('.mn-tabs__tab').forEach((tab) => {
      expect(tab.getAttribute('role')).toBe('tab');
    });
  });

  it('activate sets correct active class on tab', async () => {
    const { initTabs } = await import('../../src/ts/controls-dialogs');
    const el = makeTabs();
    const ctrl = initTabs(el);
    ctrl.activate(1);
    const tabs = el.querySelectorAll('.mn-tabs__tab');
    expect(tabs[1].classList.contains('mn-tabs__tab--active')).toBe(true);
    expect(tabs[0].classList.contains('mn-tabs__tab--active')).toBe(false);
  });

  it('activate shows matching panel', async () => {
    const { initTabs } = await import('../../src/ts/controls-dialogs');
    const el = makeTabs();
    const ctrl = initTabs(el);
    ctrl.activate(2);
    const panels = el.querySelectorAll('.mn-tabs__panel');
    expect(panels[2].classList.contains('mn-tabs__panel--active')).toBe(true);
    expect(panels[0].classList.contains('mn-tabs__panel--active')).toBe(false);
  });

  it('sets aria-selected correctly', async () => {
    const { initTabs } = await import('../../src/ts/controls-dialogs');
    const el = makeTabs();
    const ctrl = initTabs(el);
    ctrl.activate(0);
    const tabs = el.querySelectorAll('.mn-tabs__tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });
});

// --- a11y DEFAULTS ---
describe('a11y DEFAULTS', () => {
  it('has expected default values', async () => {
    const { DEFAULTS } = await import('../../src/ts/a11y-panel-dom');
    expect(DEFAULTS.fontSize).toBe('md');
    expect(DEFAULTS.reducedMotion).toBe(false);
    expect(DEFAULTS.highContrast).toBe(false);
    expect(DEFAULTS.focusVisible).toBe(true);
    expect(DEFAULTS.lineSpacing).toBe('normal');
  });
});

// --- loadSettings fallback ---
describe('loadSettings', () => {
  it('returns defaults when localStorage is empty', async () => {
    localStorage.clear();
    const { loadSettings, DEFAULTS } = await import('../../src/ts/a11y-panel-dom');
    const s = loadSettings();
    expect(s.fontSize).toBe(DEFAULTS.fontSize);
    expect(s.reducedMotion).toBe(DEFAULTS.reducedMotion);
    expect(s.focusVisible).toBe(DEFAULTS.focusVisible);
  });

  it('merges stored settings with defaults', async () => {
    localStorage.setItem('mn-a11y', JSON.stringify({ fontSize: 'lg' }));
    const { loadSettings } = await import('../../src/ts/a11y-panel-dom');
    const s = loadSettings();
    expect(s.fontSize).toBe('lg');
    expect(typeof s.reducedMotion).toBe('boolean');
    localStorage.clear();
  });
});
