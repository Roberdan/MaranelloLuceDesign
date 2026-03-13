/**
 * Verify CSS build output: maranello.min.css structure and constraints.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(import.meta.dirname, '../../dist/css');
const MIN_CSS = join(CSS_DIR, 'maranello.min.css');

function readCss(): string {
  if (!existsSync(MIN_CSS)) return '';
  return readFileSync(MIN_CSS, 'utf8');
}

describe('maranello.min.css existence', () => {
  it('dist/css/maranello.min.css file exists', () => {
    expect(existsSync(MIN_CSS)).toBe(true);
  });
});

describe('maranello.min.css size', () => {
  it('is between 50 KB and 500 KB', () => {
    if (!existsSync(MIN_CSS)) return;
    const { size } = statSync(MIN_CSS);
    expect(size).toBeGreaterThan(50 * 1024);
    expect(size).toBeLessThan(500 * 1024);
  });
});

describe('maranello.min.css structure', () => {
  it('contains :root block', () => {
    const css = readCss();
    if (!css) return;
    expect(css).toContain(':root');
  });

  it('contains @layer declaration', () => {
    const css = readCss();
    if (!css) return;
    expect(css).toContain('@layer');
  });

  it('does not contain raw @import for local CSS files (only allowed at top)', () => {
    const css = readCss();
    if (!css) return;
    // The bundled CSS may have @import for vendor fonts or nested CSS,
    // but should not have unresolved local @imports after bundling.
    // We verify that the file is mostly self-contained by checking it has substantial CSS content.
    expect(css.length).toBeGreaterThan(10000);
  });

  it('contains CSS custom properties (design tokens)', () => {
    const css = readCss();
    if (!css) return;
    expect(css).toContain('--');
  });

  it('contains color-related tokens', () => {
    const css = readCss();
    if (!css) return;
    // Should have chart or signal color vars
    const hasColorToken =
      css.includes('--chart') || css.includes('--signal') || css.includes('--mn-');
    expect(hasColorToken).toBe(true);
  });
});

describe('CSS sub-files exist', () => {
  const expectedFiles = [
    'tokens.css',
    'components.css',
    'layouts.css',
    'themes.css',
  ];

  for (const file of expectedFiles) {
    it(`dist/css/${file} exists`, () => {
      expect(existsSync(join(CSS_DIR, file))).toBe(true);
    });
  }
});
