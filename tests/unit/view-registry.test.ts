/**
 * Unit tests for ViewRegistry singleton.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ViewRegistry } from '../../src/ts/view-registry';
import type { ViewConfig } from '../../src/ts/view-registry';

function makeConfig(id: string, overrides?: Partial<ViewConfig>): ViewConfig {
  return {
    id,
    title: `View ${id}`,
    defaultPlacement: 'page',
    factory: () => null,
    ...overrides,
  };
}

describe('ViewRegistry', () => {
  beforeEach(() => {
    ViewRegistry.reset();
  });

  it('getInstance() returns a singleton', () => {
    const a = ViewRegistry.getInstance();
    const b = ViewRegistry.getInstance();
    expect(a).toBe(b);
  });

  it('reset() clears singleton so next getInstance() is fresh', () => {
    const a = ViewRegistry.getInstance();
    a.register(makeConfig('x'));
    ViewRegistry.reset();
    const b = ViewRegistry.getInstance();
    expect(b.get('x')).toBeUndefined();
    expect(a).not.toBe(b);
  });

  it('register() adds a view config', () => {
    const reg = ViewRegistry.getInstance();
    const cfg = makeConfig('dashboard');
    reg.register(cfg);
    expect(reg.has('dashboard')).toBe(true);
  });

  it('register() throws on duplicate id', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('dup'));
    expect(() => reg.register(makeConfig('dup'))).toThrow('already registered');
  });

  it('get() retrieves registered view config', () => {
    const reg = ViewRegistry.getInstance();
    const cfg = makeConfig('detail', { title: 'Detail Panel', defaultPlacement: 'side-panel' });
    reg.register(cfg);

    const result = reg.get('detail');
    expect(result).toBeDefined();
    expect(result?.title).toBe('Detail Panel');
    expect(result?.defaultPlacement).toBe('side-panel');
  });

  it('get() returns undefined for unregistered id', () => {
    const reg = ViewRegistry.getInstance();
    expect(reg.get('nonexistent')).toBeUndefined();
  });

  it('has() returns false for unregistered id', () => {
    const reg = ViewRegistry.getInstance();
    expect(reg.has('ghost')).toBe(false);
  });

  it('unregister() removes a view and returns true', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('temp'));
    expect(reg.unregister('temp')).toBe(true);
    expect(reg.get('temp')).toBeUndefined();
    expect(reg.has('temp')).toBe(false);
  });

  it('unregister() returns false for unknown id', () => {
    const reg = ViewRegistry.getInstance();
    expect(reg.unregister('missing')).toBe(false);
  });

  it('list() returns all registered configs', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('a'));
    reg.register(makeConfig('b'));
    reg.register(makeConfig('c'));

    const all = reg.list();
    expect(all.length).toBe(3);
    const ids = all.map(v => v.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).toContain('c');
  });

  it('list() returns frozen array', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('frozen'));
    const list = reg.list();
    expect(Object.isFrozen(list)).toBe(true);
  });

  it('clear() removes all registered views', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('x'));
    reg.register(makeConfig('y'));
    reg.clear();
    expect(reg.list().length).toBe(0);
    expect(reg.has('x')).toBe(false);
    expect(reg.has('y')).toBe(false);
  });

  it('stores optional fields like icon and sizeHint', () => {
    const reg = ViewRegistry.getInstance();
    reg.register(makeConfig('rich', {
      icon: 'chart',
      sizeHint: { width: '400px', height: '300px' },
      tag: 'mn-custom',
    }));

    const cfg = reg.get('rich');
    expect(cfg?.icon).toBe('chart');
    expect(cfg?.sizeHint?.width).toBe('400px');
    expect(cfg?.tag).toBe('mn-custom');
  });
});
