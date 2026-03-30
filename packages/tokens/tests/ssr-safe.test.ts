// @vitest-environment node

import { describe, expect, it } from 'vitest';

describe('SSR-safe imports', () => {
  it('imports the root token module without document', async () => {
    const mod = await import('../src/ts/index');
    expect(typeof mod.setTheme).toBe('function');
    expect(mod.eventBus).toBeInstanceOf(mod.EventBus);
  });
});
