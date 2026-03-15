/**
 * Keyboard navigation & ARIA tests for interactive controls.
 * Covers: focus trap (a11y panel), theme rotary, Ferrari controls, command palette.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

function mkEl(tag: string, cls = ''): HTMLElement {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

function fire(el: EventTarget, key: string, opts: Partial<KeyboardEventInit> = {}): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
}

describe('focus trap: mn-a11y-fallback', () => {
  it('panel has role=dialog and aria-modal', async () => {
    const { buildA11yFallback } = await import('../../src/wc/mn-a11y-fallback.js');
    const host = mkEl('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const ctrl = buildA11yFallback(shadow);
    const panel = shadow.querySelector('[role="dialog"]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    ctrl.destroy();
  });

  it('FAB has aria-expanded and aria-controls', async () => {
    const { buildA11yFallback } = await import('../../src/wc/mn-a11y-fallback.js');
    const host = mkEl('div');
    const shadow = host.attachShadow({ mode: 'open' });
    const ctrl = buildA11yFallback(shadow);
    const fab = shadow.querySelector('.mn-a11y-fab') as HTMLElement;
    expect(fab.getAttribute('aria-expanded')).toBe('false');
    expect(fab.getAttribute('aria-controls')).toBe('mn-a11y-panel');
    ctrl.destroy();
  });
});

describe('theme rotary keyboard', () => {
  let container: HTMLElement;
  let ctrl: { destroy: () => void };

  beforeEach(async () => {
    container = mkEl('div');
    document.body.appendChild(container);
    const { themeRotary } = await import('../../src/ts/theme-rotary');
    ctrl = themeRotary({ container });
  });

  afterEach(() => { ctrl?.destroy(); container?.remove(); });

  it('has role=radiogroup', () => {
    const root = container.querySelector('[role="radiogroup"]');
    expect(root).not.toBeNull();
  });

  it('position labels have role=radio', () => {
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios.length).toBe(4);
  });

  it('is keyboard focusable', () => {
    const root = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(root?.getAttribute('tabindex')).toBe('0');
  });
});

describe('cruise lever keyboard', () => {
  let container: HTMLElement;
  let ctrl: { getValue: () => number; setValue: (v: number) => void; destroy: () => void };

  beforeEach(async () => {
    container = mkEl('div');
    document.body.appendChild(container);
    const { cruiseLever } = await import('../../src/ts/controls-ferrari');
    ctrl = cruiseLever(container, { positions: ['OFF', 'SET', 'RES'] });
  });

  afterEach(() => { ctrl?.destroy(); container?.remove(); });

  it('has role=slider with aria-value attributes', () => {
    const root = container.querySelector('[role="slider"]') as HTMLElement;
    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-valuemin')).toBe('0');
    expect(root?.getAttribute('aria-valuemax')).toBe('2');
  });

  it('ArrowUp increments value', () => {
    const root = container.querySelector('[role="slider"]') as HTMLElement;
    fire(root, 'ArrowUp');
    expect(ctrl.getValue()).toBe(1);
    expect(root.getAttribute('aria-valuenow')).toBe('1');
  });

  it('ArrowDown decrements value', () => {
    ctrl.setValue(2);
    const root = container.querySelector('[role="slider"]') as HTMLElement;
    fire(root, 'ArrowDown');
    expect(ctrl.getValue()).toBe(1);
  });

  it('Home goes to min, End goes to max', () => {
    ctrl.setValue(1);
    const root = container.querySelector('[role="slider"]') as HTMLElement;
    fire(root, 'Home');
    expect(ctrl.getValue()).toBe(0);
    fire(root, 'End');
    expect(ctrl.getValue()).toBe(2);
  });
});

describe('toggle lever ARIA', () => {
  it('has role=switch and aria-checked', async () => {
    const container = mkEl('div');
    document.body.appendChild(container);
    const { toggleLever } = await import('../../src/ts/controls-ferrari');
    const ctrl = toggleLever(container, { initial: false });
    const root = container.querySelector('[role="switch"]') as HTMLElement;
    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-checked')).toBe('false');
    fire(root, ' ');
    expect(root.getAttribute('aria-checked')).toBe('true');
    ctrl.destroy();
    container.remove();
  });
});

describe('command palette ARIA', () => {
  let container: HTMLElement;
  let ctrl: { open: () => void; close: () => void };

  beforeEach(async () => {
    container = mkEl('div');
    container.id = 'test-cp';
    container.innerHTML = `
      <input class="mn-command-palette__input" />
      <div class="mn-command-palette__list">
        <div class="mn-command-palette__item"><span class="mn-command-palette__item-text">One</span></div>
        <div class="mn-command-palette__item"><span class="mn-command-palette__item-text">Two</span></div>
      </div>`;
    document.body.appendChild(container);
    const { commandPalette } = await import('../../src/ts/command-palette');
    ctrl = commandPalette('test-cp');
  });

  afterEach(() => { container?.remove(); });

  it('input has role=combobox', () => {
    const input = container.querySelector('input');
    expect(input?.getAttribute('role')).toBe('combobox');
  });

  it('list has role=listbox', () => {
    const list = container.querySelector('.mn-command-palette__list');
    expect(list?.getAttribute('role')).toBe('listbox');
  });

  it('items have role=option', () => {
    const items = container.querySelectorAll('[role="option"]');
    expect(items.length).toBe(2);
  });
});
