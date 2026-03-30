// @vitest-environment node

/**
 * @convergio/design-elements — SSR safety verification.
 * Ensures the ESM barrel and key exports can be imported in Node.js
 * without crashing (no document/window/navigator at module scope).
 */
import { describe, expect, it } from 'vitest';

describe('SSR-safe imports (Node environment, no DOM)', () => {
  it('imports the root barrel without crashing', async () => {
    const mod = await import('../src/ts/index');
    expect(typeof mod.header).toBe('function');
    expect(typeof mod.eventBus).toBe('object');
    expect(typeof mod.createLayout).toBe('function');
  });

  it('exports core types and functions', async () => {
    const mod = await import('../src/ts/index');
    expect(typeof mod.gantt).toBe('function');
    expect(typeof mod.dataTable).toBe('function');
    expect(typeof mod.FerrariGauge).toBe('function');
    expect(typeof mod.headerShell).toBe('function');
    expect(typeof mod.sparkline).toBe('function');
    expect(typeof mod.toast).toBe('function');
  });

  it('exports EventBus that works without document', async () => {
    const { EventBus } = await import('../src/ts/core/events');
    const bus = new EventBus();
    expect(bus).toBeDefined();
    let received = false;
    bus.on('test' as never, () => { received = true; });
    bus.emit('test' as never, undefined as never);
    expect(received).toBe(true);
  });

  it('registerAll returns early in Node (no customElements)', async () => {
    const { registerAll, isRegistered, getRegistered } = await import('../src/wc/index');
    await registerAll();
    expect(isRegistered('mn-gauge' as never)).toBe(false);
    expect(getRegistered()).toEqual([]);
  });
});
