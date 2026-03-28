/**
 * @maranello/elements — Web Components registry tests.
 * Verifies the WC_TAGS array and register-all module.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { getAvailableTags } from '../src/wc/index';

describe('WC_TAGS registry', () => {
  const tags = getAvailableTags();

  it('returns the WC_TAGS array with expected count', () => {
    // 31 tags per the WC index
    expect(tags.length).toBe(31);
  });

  it('does NOT include mn-app-shell', () => {
    expect(tags).not.toContain('mn-app-shell');
  });

  it('includes mn-gauge', () => {
    expect(tags).toContain('mn-gauge');
  });

  it('includes mn-kanban-board', () => {
    expect(tags).toContain('mn-kanban-board');
  });

  it('includes mn-dashboard', () => {
    expect(tags).toContain('mn-dashboard');
  });

  it('includes mn-async-select', () => {
    expect(tags).toContain('mn-async-select');
  });
});

describe('register-all module', () => {
  it('register-all.ts exists in wc directory', () => {
    const registerAllPath = path.resolve(
      __dirname,
      '../src/wc/register-all.ts',
    );
    expect(fs.existsSync(registerAllPath)).toBe(true);
  });
});
