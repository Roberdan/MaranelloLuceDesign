/**
 * Unit tests for layout state machine (createLayout).
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLayout } from '../../src/ts/layout';
import type { LayoutController, LayoutViewConfig } from '../../src/ts/layout';

function buildGrid(): HTMLElement {
  const grid = document.createElement('div');
  grid.id = 'mn-grid';

  const strip = document.createElement('div');
  strip.id = 'mn-slot-strip';

  const left = document.createElement('div');
  left.id = 'mn-slot-left';

  const center = document.createElement('div');
  center.id = 'mn-slot-center';

  const right = document.createElement('div');
  right.id = 'mn-slot-right';

  grid.append(strip, left, center, right);
  document.body.appendChild(grid);
  return grid;
}

function makeView(label: string, overrides?: Partial<LayoutViewConfig>): LayoutViewConfig {
  return { label, ...overrides };
}

describe('createLayout', () => {
  let grid: HTMLElement;
  let ctrl: LayoutController;

  beforeEach(() => {
    grid = buildGrid();
    ctrl = createLayout(grid);
  });

  afterEach(() => {
    ctrl.destroy();
    grid.remove();
  });

  // -- register --
  it('register() stores view config', () => {
    ctrl.register('dash', makeView('Dashboard'));
    // Verify by showing it (would throw if not registered)
    ctrl.showView('dash');
    expect(ctrl.state.view).toBe('dash');
  });

  // -- showView --
  it('showView() updates state.view', () => {
    ctrl.register('overview', makeView('Overview'));
    ctrl.showView('overview');
    expect(ctrl.state.view).toBe('overview');
  });

  it('showView() closes right slot', () => {
    ctrl.register('v1', makeView('View 1'));
    ctrl.openRight();
    expect(ctrl.state.right).toBe(true);
    ctrl.showView('v1');
    expect(ctrl.state.right).toBe(false);
  });

  it('showView() throws for unregistered view', () => {
    expect(() => ctrl.showView('ghost')).toThrow();
  });

  // -- fullpage --
  it('fullpage view hides strip, left, and right', () => {
    ctrl.register('editor', makeView('Editor', { fullpage: true }));
    ctrl.toggleLeft(); // show left
    ctrl.openRight();  // show right
    ctrl.showView('editor');
    expect(ctrl.state.fullpage).toBe(true);
    expect(ctrl.state.strip).toBe(false);
    expect(ctrl.state.left).toBe(false);
    expect(ctrl.state.right).toBe(false);
  });

  it('exiting fullpage restores strip state', () => {
    ctrl.register('editor', makeView('Editor', { fullpage: true }));
    ctrl.register('dash', makeView('Dashboard'));
    // strip starts visible (true)
    expect(ctrl.state.strip).toBe(true);
    ctrl.showView('editor');
    expect(ctrl.state.strip).toBe(false);
    ctrl.showView('dash');
    expect(ctrl.state.strip).toBe(true);
  });

  // -- toggleLeft / toggleRight / toggleStrip --
  it('toggleLeft() flips left state', () => {
    expect(ctrl.state.left).toBe(false);
    ctrl.toggleLeft();
    expect(ctrl.state.left).toBe(true);
    ctrl.toggleLeft();
    expect(ctrl.state.left).toBe(false);
  });

  it('toggleRight() flips right state', () => {
    expect(ctrl.state.right).toBe(false);
    ctrl.toggleRight();
    expect(ctrl.state.right).toBe(true);
    ctrl.toggleRight();
    expect(ctrl.state.right).toBe(false);
  });

  it('toggleStrip() flips strip state', () => {
    expect(ctrl.state.strip).toBe(true);
    ctrl.toggleStrip();
    expect(ctrl.state.strip).toBe(false);
    ctrl.toggleStrip();
    expect(ctrl.state.strip).toBe(true);
  });

  // -- openRight / closeRight --
  it('openRight() sets right to true', () => {
    ctrl.openRight();
    expect(ctrl.state.right).toBe(true);
    ctrl.openRight(); // idempotent
    expect(ctrl.state.right).toBe(true);
  });

  it('closeRight() sets right to false', () => {
    ctrl.openRight();
    ctrl.closeRight();
    expect(ctrl.state.right).toBe(false);
  });

  // -- wireButtons --
  it('wireButtons() attaches click listeners via buttonId', () => {
    const btn = document.createElement('button');
    btn.id = 'btn-reports';
    document.body.appendChild(btn);

    ctrl.register('reports', makeView('Reports', { buttonId: 'btn-reports' }));
    ctrl.wireButtons();
    btn.click();
    expect(ctrl.state.view).toBe('reports');

    btn.remove();
  });

  // -- layout-changed event --
  it('fires layout-changed event with correct detail on showView', () => {
    ctrl.register('dash', makeView('Dashboard'));
    const spy = vi.fn();
    grid.addEventListener('layout-changed', spy);

    ctrl.showView('dash');
    expect(spy).toHaveBeenCalledTimes(1);

    const detail = (spy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.view).toBe('dash');
    expect(typeof detail.fullpage).toBe('boolean');
    expect(typeof detail.strip).toBe('boolean');
    expect(typeof detail.left).toBe('boolean');
    expect(typeof detail.right).toBe('boolean');

    grid.removeEventListener('layout-changed', spy);
  });

  it('fires layout-changed event on toggle methods', () => {
    const spy = vi.fn();
    grid.addEventListener('layout-changed', spy);

    ctrl.toggleLeft();
    ctrl.toggleRight();
    ctrl.toggleStrip();
    expect(spy).toHaveBeenCalledTimes(3);

    grid.removeEventListener('layout-changed', spy);
  });

  // -- destroy --
  it('destroy() removes button listeners', () => {
    const btn = document.createElement('button');
    btn.id = 'btn-clean';
    document.body.appendChild(btn);

    ctrl.register('clean', makeView('Clean', { buttonId: 'btn-clean' }));
    ctrl.wireButtons();
    ctrl.destroy();

    // After destroy, clicking button should not change state
    btn.click();
    expect(ctrl.state.view).toBe('');

    btn.remove();
  });

  // -- DOM hidden attribute sync --
  it('applies hidden attribute to right slot when closed', () => {
    const right = grid.querySelector('#mn-slot-right') as HTMLElement;
    expect(right.hidden).toBe(true); // starts hidden
    ctrl.openRight();
    expect(right.hidden).toBe(false);
    ctrl.closeRight();
    expect(right.hidden).toBe(true);
  });

  it('applies hidden attribute to left slot', () => {
    const left = grid.querySelector('#mn-slot-left') as HTMLElement;
    expect(left.hidden).toBe(true);
    ctrl.toggleLeft();
    expect(left.hidden).toBe(false);
  });

  it('applies fullpage class to grid', () => {
    ctrl.register('fp', makeView('Fullpage', { fullpage: true }));
    ctrl.showView('fp');
    expect(grid.classList.contains('mn-layout--fullpage')).toBe(true);
  });

  // -- defaults to getElementById when no arg --
  it('falls back to document.getElementById when no gridEl arg', () => {
    const ctrl2 = createLayout();
    ctrl2.register('test', makeView('Test'));
    ctrl2.showView('test');
    expect(ctrl2.state.view).toBe('test');
    ctrl2.destroy();
  });
});
