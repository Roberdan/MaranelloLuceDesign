// @vitest-environment node

/**
 * Consumer smoke test — validates that source entrypoints are SSR-safe
 * in Node environment. Imports from packages source -- not dist -- so
 * vitest can run without a prior build step.
 *
 * For full published-package validation, see tests/consumer-nextjs/.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const TOKENS_ROOT = join(import.meta.dirname, '../../packages/tokens');
const ELEMENTS_ROOT = join(import.meta.dirname, '../../packages/elements');

describe('Consumer smoke: @convergio/design-tokens (SSR)', () => {
  it('root import works in Node', async () => {
    const mod = await import(join(TOKENS_ROOT, 'src/ts/index'));
    expect(typeof mod.setTheme).toBe('function');
    expect(typeof mod.cycleTheme).toBe('function');
    expect(typeof mod.palette).toBe('function');
    expect(mod.eventBus).toBeDefined();
  });

  it('EventBus works without document', async () => {
    const { EventBus } = await import(join(TOKENS_ROOT, 'src/ts/events'));
    const bus = new EventBus();
    let called = false;
    bus.on('test' as never, () => { called = true; });
    bus.emit('test' as never, {} as never);
    expect(called).toBe(true);
  });

  it('CSS entrypoints exist on disk', () => {
    expect(existsSync(join(TOKENS_ROOT, 'dist/css/index.css'))).toBe(true);
    expect(existsSync(join(TOKENS_ROOT, 'dist/css/themes.css'))).toBe(true);
  });
});

describe('Consumer smoke: @convergio/design-elements (SSR)', () => {
  it('root barrel import works in Node', async () => {
    const mod = await import(join(ELEMENTS_ROOT, 'src/ts/index'));
    expect(mod).toBeDefined();
    expect(typeof mod.createLayout).toBe('function');
    expect(typeof mod.gantt).toBe('function');
    expect(typeof mod.dataTable).toBe('function');
    expect(typeof mod.FerrariGauge).toBe('function');
    expect(typeof mod.sparkline).toBe('function');
  });

  it('header + headerShell importable without crash', async () => {
    const mod = await import(join(ELEMENTS_ROOT, 'src/ts/index'));
    expect(typeof mod.header).toBe('function');
    expect(typeof mod.headerShell).toBe('function');
  });

  it('charts re-exports importable without crash', async () => {
    const mod = await import(join(ELEMENTS_ROOT, 'src/ts/index'));
    expect(typeof mod.sparkline).toBe('function');
    expect(typeof mod.donut).toBe('function');
    expect(typeof mod.barChart).toBe('function');
  });

  it('gauge engine importable without crash', async () => {
    const mod = await import(join(ELEMENTS_ROOT, 'src/ts/index'));
    expect(typeof mod.FerrariGauge).toBe('function');
  });

  it('registerAll returns early in SSR', async () => {
    const { registerAll, isRegistered, getRegistered } = await import(
      join(ELEMENTS_ROOT, 'src/wc/index')
    );
    await registerAll();
    expect(isRegistered('mn-gauge' as never)).toBe(false);
    expect(getRegistered()).toEqual([]);
  });

  it('CSS entrypoint exists on disk', () => {
    expect(existsSync(join(ELEMENTS_ROOT, 'dist/css/index.css'))).toBe(true);
  });

  it('WC dist files exist', () => {
    expect(existsSync(join(ELEMENTS_ROOT, 'dist/esm/wc/index.js'))).toBe(true);
    expect(existsSync(join(ELEMENTS_ROOT, 'dist/types/wc/index.d.ts'))).toBe(true);
    expect(existsSync(join(ELEMENTS_ROOT, 'dist/types/wc/register-all.d.ts'))).toBe(true);
  });

  it('types export path resolves', () => {
    expect(existsSync(join(ELEMENTS_ROOT, 'dist/types/index.d.ts'))).toBe(true);
  });
});
