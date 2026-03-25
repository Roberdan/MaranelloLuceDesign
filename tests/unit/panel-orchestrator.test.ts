/**
 * Unit tests for PanelOrchestrator.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ViewConfig, Placement } from '../../src/ts/view-registry';

function makeView(id: string, placement: Placement = 'page'): ViewConfig {
  return {
    id,
    title: `View ${id}`,
    defaultPlacement: placement,
    factory: vi.fn((_container: HTMLElement) => ({ destroy: vi.fn() })),
  };
}

describe('PanelOrchestrator', () => {
  let registry: import('../../src/ts/view-registry').ViewRegistry;
  let nav: import('../../src/ts/navigation-model').NavigationModel;
  let orch: import('../../src/ts/panel-orchestrator').PanelOrchestrator;

  beforeEach(async () => {
    const { ViewRegistry } = await import('../../src/ts/view-registry');
    const { NavigationModel } = await import('../../src/ts/navigation-model');
    const { PanelOrchestrator } = await import('../../src/ts/panel-orchestrator');

    ViewRegistry.reset();
    registry = ViewRegistry.getInstance();
    nav = new NavigationModel();
    orch = new PanelOrchestrator(registry, nav);
  });

  afterEach(() => {
    orch.destroy();
    nav.destroy();
    registry.clear();
    document.body.innerHTML = '';
  });

  it('constructor accepts ViewRegistry and NavigationModel', () => {
    expect(orch).toBeDefined();
    expect(orch.getOpen().size).toBe(0);
  });

  it('open creates a PanelHandle with correct properties', () => {
    const view = makeView('detail', 'side-panel');
    registry.register(view);

    const handle = orch.open('detail');

    expect(handle.viewId).toBe('detail');
    expect(handle.placement).toBe('side-panel');
    expect(handle.container).toBeInstanceOf(HTMLElement);
    expect(handle.container.dataset.viewId).toBe('detail');
    expect(typeof handle.close).toBe('function');
    expect(typeof handle.moveTo).toBe('function');
  });

  it('open calls factory with container', () => {
    const view = makeView('settings', 'page');
    registry.register(view);

    orch.open('settings');

    expect(view.factory).toHaveBeenCalledOnce();
    const callArgs = (view.factory as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(HTMLElement);
  });

  it('open with explicit target overrides defaultPlacement', () => {
    const view = makeView('report', 'page');
    registry.register(view);

    const handle = orch.open('report', 'bottom-dock');

    expect(handle.placement).toBe('bottom-dock');
  });

  it('open throws for unregistered view', () => {
    expect(() => orch.open('nonexistent')).toThrow('View "nonexistent" is not registered');
  });

  it('open returns existing handle on duplicate call', () => {
    const view = makeView('dash', 'page');
    registry.register(view);

    const h1 = orch.open('dash');
    const h2 = orch.open('dash');

    expect(h1).toBe(h2);
    expect(view.factory).toHaveBeenCalledOnce();
  });

  it('close removes the panel and cleans up DOM', () => {
    const view = makeView('panel-a', 'side-panel');
    registry.register(view);

    const handle = orch.open('panel-a');
    expect(orch.isOpen('panel-a')).toBe(true);
    expect(handle.container.parentElement).not.toBeNull();

    orch.close('panel-a');

    expect(orch.isOpen('panel-a')).toBe(false);
    expect(orch.getOpen().size).toBe(0);
  });

  it('close is a no-op for unknown view', () => {
    expect(() => orch.close('ghost')).not.toThrow();
  });

  it('handle.close() delegates to orchestrator.close', () => {
    const view = makeView('closable', 'page');
    registry.register(view);

    const handle = orch.open('closable');
    handle.close();

    expect(orch.isOpen('closable')).toBe(false);
  });

  it('move changes placement of an open panel', () => {
    const view = makeView('movable', 'page');
    registry.register(view);

    orch.open('movable');
    orch.move('movable', 'side-panel');

    const entry = orch.getOpen().get('movable');
    expect(entry?.placement).toBe('side-panel');
    expect(entry?.handle.placement).toBe('side-panel');
  });

  it('move throws for view that is not open', () => {
    expect(() => orch.move('absent', 'page')).toThrow('View "absent" is not open');
  });

  it('move is no-op when target matches current placement', () => {
    const view = makeView('stable', 'page');
    registry.register(view);

    orch.open('stable');
    const containerBefore = orch.getOpen().get('stable')?.handle.container;

    orch.move('stable', 'page');

    const containerAfter = orch.getOpen().get('stable')?.handle.container;
    expect(containerBefore).toBe(containerAfter);
  });

  it('handle.moveTo() delegates to orchestrator.move', () => {
    const view = makeView('delegate-move', 'page');
    registry.register(view);

    const handle = orch.open('delegate-move');
    handle.moveTo('bottom-dock');

    expect(orch.getOpen().get('delegate-move')?.placement).toBe('bottom-dock');
  });

  it('swap exchanges placements of two open panels', () => {
    const vA = makeView('view-a', 'page');
    const vB = makeView('view-b', 'side-panel');
    registry.register(vA);
    registry.register(vB);

    orch.open('view-a');
    orch.open('view-b');

    orch.swap('view-a', 'view-b');

    expect(orch.getOpen().get('view-a')?.placement).toBe('side-panel');
    expect(orch.getOpen().get('view-b')?.placement).toBe('page');
  });

  it('swap throws when either view is not open', () => {
    const view = makeView('only-one', 'page');
    registry.register(view);
    orch.open('only-one');

    expect(() => orch.swap('only-one', 'missing')).toThrow('Both views must be open to swap');
  });

  it('swap in same placement reorders DOM siblings', () => {
    const vA = makeView('same-a', 'page');
    const vB = makeView('same-b', 'page');
    registry.register(vA);
    registry.register(vB);

    const hA = orch.open('same-a');
    const hB = orch.open('same-b');
    const slot = hA.container.parentElement!;

    expect(slot.children[0]).toBe(hA.container);
    expect(slot.children[1]).toBe(hB.container);

    orch.swap('same-a', 'same-b');

    expect(slot.children[0]).toBe(hB.container);
    expect(slot.children[1]).toBe(hA.container);
  });

  it('swap adjacent siblings where first is immediately before second', () => {
    const vA = makeView('adj-a', 'page');
    const vB = makeView('adj-b', 'page');
    registry.register(vA);
    registry.register(vB);

    const hA = orch.open('adj-a');
    const hB = orch.open('adj-b');
    const slot = hA.container.parentElement!;

    orch.swap('adj-a', 'adj-b');

    expect(slot.children[0]).toBe(hB.container);
    expect(slot.children[1]).toBe(hA.container);
  });

  it('swap non-adjacent siblings in same slot', () => {
    const vA = makeView('non-a', 'page');
    const vB = makeView('non-b', 'page');
    const vC = makeView('non-c', 'page');
    registry.register(vA);
    registry.register(vB);
    registry.register(vC);

    const hA = orch.open('non-a');
    orch.open('non-b');
    const hC = orch.open('non-c');
    const slot = hA.container.parentElement!;

    orch.swap('non-a', 'non-c');

    expect(slot.children[0]).toBe(hC.container);
    expect(slot.children[2]).toBe(hA.container);
  });

  it('closeAll closes every open panel', () => {
    registry.register(makeView('x1', 'page'));
    registry.register(makeView('x2', 'side-panel'));
    orch.open('x1');
    orch.open('x2');

    orch.closeAll();

    expect(orch.getOpen().size).toBe(0);
  });

  it('destroy clears all state', () => {
    registry.register(makeView('d1', 'page'));
    orch.open('d1');

    orch.destroy();

    expect(orch.getOpen().size).toBe(0);
  });

  it('navigation model receives push on open', () => {
    const view = makeView('nav-test', 'page');
    registry.register(view);
    const spy = vi.fn();
    nav.onNavigate(spy);

    orch.open('nav-test');

    expect(spy).toHaveBeenCalled();
    const lastCall = spy.mock.calls[spy.mock.calls.length - 1];
    expect(lastCall[0].viewId).toBe('nav-test');
    expect(lastCall[1]).toBe('push');
  });

  it('container has mn-panel-view class', () => {
    registry.register(makeView('cls', 'page'));
    const handle = orch.open('cls');
    expect(handle.container.classList.contains('mn-panel-view')).toBe(true);
  });
});
