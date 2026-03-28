/**
 * Integration tests for packages/elements WC registry and register-all.
 * Verifies the WC tag list and exported utilities are complete and correct.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { getAvailableTags, isRegistered } from '../../src/wc/index.js';

const REGISTER_ALL_PATH = join(import.meta.dirname, '../../src/wc/register-all.ts');

describe('WC registry — tag list', () => {
  it('exports the correct count of WC tags (31)', () => {
    const tags = getAvailableTags();
    expect(tags).toHaveLength(31);
  });

  it('includes mn-gauge', () => {
    const tags = getAvailableTags();
    expect(tags).toContain('mn-gauge');
  });

  it('includes mn-kanban-board', () => {
    const tags = getAvailableTags();
    expect(tags).toContain('mn-kanban-board');
  });

  it('does NOT include mn-app-shell', () => {
    const tags = getAvailableTags();
    expect(tags).not.toContain('mn-app-shell');
  });

  it('all tags carry the mn- prefix', () => {
    const tags = getAvailableTags();
    const invalid = tags.filter((t) => !t.startsWith('mn-'));
    expect(invalid, `Tags missing mn- prefix: ${invalid.join(', ')}`).toHaveLength(0);
  });

  it('returns a stable list with no duplicates', () => {
    const tags = getAvailableTags();
    const unique = new Set(tags);
    expect(unique.size, 'Duplicate tags found in WC_TAGS').toBe(tags.length);
  });
});

describe('WC registry — isRegistered()', () => {
  it('returns false for mn-gauge before registration', () => {
    // In happy-dom test env, no WC is registered without importing the module
    expect(isRegistered('mn-gauge')).toBe(false);
  });
});

describe('register-all.ts', () => {
  it('file exists at src/wc/register-all.ts', () => {
    expect(existsSync(REGISTER_ALL_PATH)).toBe(true);
  });

  it('exports registerAll function', async () => {
    const mod = await import('../../src/wc/register-all.js');
    expect(typeof mod.registerAll).toBe('function');
  });
});
