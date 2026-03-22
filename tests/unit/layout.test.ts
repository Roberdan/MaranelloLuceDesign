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
  left.hidden = true;

  const center = document.createElement('div');
  center.id = 'mn-slot-center';

  const right = document.createElement('div');
  right.id = 'mn-slot-right';
  right.hidden = true;

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
    ctrl.showView('dash');
    expect(ctrl.state.view).toBe('dash');
  });

  // -- showView --
  it('showView() updates state.view', () => {
    ctrl.register('overview', makeView('Overview'));
    ctrl.showView('overview');
    expect(ctrl.state.view).toBe('overview');
  });

  it('showView() preserves manual right toggle (slot independence)', () => {
    ctrl.register('v1', makeView('View 1'));
    ctrl.openRight();
    expect(ctrl.state.right).toBe(true);
    ctrl.showView('v1'); // no right config — manual toggle persists
    expect(ctrl.state.right).toBe(true);
  });

  it('showView() closes view-driven right on switch', () => {
    ctrl.register('copilot', makeView('Copilot', { right: { render: () => {} } }));
    ctrl.register('gantt', makeView('Gantt'));
    ctrl.showView('copilot');
    expect(ctrl.state.right).toBe(true);
    ctrl.showView('gantt'); // no right config — view-driven closes
    expect(ctrl.state.right).toBe(false);
  });

  it('showView() throws for unregistered view', () => {
    expect(() => ctrl.showView('ghost')).toThrow();
  });

  // -- fullpage --
  it('fullpage view hides strip, left, and right', () => {
    ctrl.register('editor', makeView('Editor', { fullpage: true }));
    ctrl.toggleLeft();
    ctrl.openRight();
    ctrl.showView('editor');
    expect(ctrl.state.fullpage).toBe(true);
    expect(ctrl.state.strip).toBe(false);
    expect(ctrl.state.left).toBe(false);
    expect(ctrl.state.right).toBe(false);
  });

  it('exiting fullpage restores all slot states', () => {
    ctrl.register('editor', makeView('Editor', { fullpage: true }));
    ctrl.register('dash', makeView('Dashboard'));
    ctrl.toggleLeft();
    expect(ctrl.state.strip).toBe(true);
    expect(ctrl.state.left).toBe(true);
    ctrl.showView('editor');
    expect(ctrl.state.strip).toBe(false);
    expect(ctrl.state.left).toBe(false);
    ctrl.showView('dash');
    expect(ctrl.state.strip).toBe(true);
    expect(ctrl.state.left).toBe(true);
  });

  // -- slot independence --
  it('toggleLeft does not affect strip or right', () => {
    expect(ctrl.state.strip).toBe(true);
    expect(ctrl.state.right).toBe(false);
    ctrl.toggleLeft();
    expect(ctrl.state.left).toBe(true);
    expect(ctrl.state.strip).toBe(true);
    expect(ctrl.state.right).toBe(false);
  });

  it('toggleStrip does not affect left or right', () => {
    ctrl.toggleLeft();
    expect(ctrl.state.left).toBe(true);
    ctrl.toggleStrip();
    expect(ctrl.state.strip).toBe(false);
    expect(ctrl.state.left).toBe(true);
    expect(ctrl.state.right).toBe(false);
  });

  it('showView does not touch slots without config', () => {
    ctrl.register('gantt', makeView('Gantt'));
    ctrl.toggleLeft(); // manual
    ctrl.toggleStrip(); // manual
    ctrl.showView('gantt');
    expect(ctrl.state.left).toBe(true);  // manual persists
    expect(ctrl.state.strip).toBe(false); // manual persists
  });

  // -- view-driven vs manual toggle --
  it('view-driven left closes on switch, manual left persists', () => {
    ctrl.register('copilot', makeView('Copilot', {
      left: { render: () => {} },
    }));
    ctrl.register('gantt', makeView('Gantt'));
    ctrl.register('table', makeView('Table'));

    // Manual toggle pipeline
    ctrl.showView('gantt');
    ctrl.toggleLeft(); // manual
    expect(ctrl.state.left).toBe(true);

    // Switch view — manual left persists
    ctrl.showView('table');
    expect(ctrl.state.left).toBe(true);

    // View-driven left
    ctrl.showView('copilot');
    expect(ctrl.state.left).toBe(true);

    // Switch away — view-driven left closes
    ctrl.showView('gantt');
    expect(ctrl.state.left).toBe(false);
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
    ctrl.openRight();
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

    btn.click();
    expect(ctrl.state.view).toBe('');

    btn.remove();
  });

  // -- DOM hidden attribute sync --
  it('applies hidden attribute to right slot when closed', () => {
    const right = document.getElementById('mn-slot-right') as HTMLElement;
    expect(right.hidden).toBe(true);
    ctrl.openRight();
    expect(right.hidden).toBe(false);
    ctrl.closeRight();
    expect(right.hidden).toBe(true);
  });

  it('applies hidden attribute to left slot', () => {
    const left = document.getElementById('mn-slot-left') as HTMLElement;
    expect(left.hidden).toBe(true);
    ctrl.toggleLeft();
    expect(left.hidden).toBe(false);
  });

  it('applies fullpage class to grid', () => {
    ctrl.register('fp', makeView('Fullpage', { fullpage: true }));
    ctrl.showView('fp');
    expect(grid.classList.contains('mn-layout--fullpage')).toBe(true);
  });

  // -- slot content rendering --
  it('calls render callback on showView', () => {
    const renderFn = vi.fn();
    ctrl.register('copilot', makeView('Copilot', {
      left: { render: renderFn },
    }));
    ctrl.showView('copilot');
    expect(renderFn).toHaveBeenCalledTimes(1);
    expect(renderFn.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
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
