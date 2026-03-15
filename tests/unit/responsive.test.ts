/**
 * Unit tests for responsive CSS files + autoResize utility.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = join(import.meta.dirname, '../../dist/css');
const SRC_DIR = join(import.meta.dirname, '../../src');

describe('responsive CSS files exist in dist', () => {
  const files = [
    'responsive-tokens.css',
    'responsive-layouts.css',
    'responsive-data.css',
    'responsive-forms.css',
    'responsive-charts.css',
  ];

  files.forEach((file) => {
    it(`dist/css/${file} exists`, () => {
      expect(existsSync(join(CSS_DIR, file))).toBe(true);
    });
  });
});

describe('maranello.css contains responsive @media rules', () => {
  it('has mobile breakpoint (max-width: 640px)', () => {
    const css = readFileSync(join(CSS_DIR, 'maranello.css'), 'utf8');
    expect(css).toContain('@media (max-width: 640px)');
  });

  it('has tablet breakpoint (max-width: 1024px)', () => {
    const css = readFileSync(join(CSS_DIR, 'maranello.css'), 'utf8');
    expect(css).toContain('max-width: 1024px');
  });

  it('contains responsive utility classes', () => {
    const css = readFileSync(join(CSS_DIR, 'maranello.css'), 'utf8');
    expect(css).toContain('.mn-hide-mobile');
    expect(css).toContain('.mn-show-mobile');
    expect(css).toContain('.mn-stack-mobile');
    expect(css).toContain('.mn-full-mobile');
    expect(css).toContain('.mn-hide-tablet');
    expect(css).toContain('.mn-hide-desktop');
  });
});

describe('autoResize utility', () => {
  it('src/ts/auto-resize.ts exists', () => {
    expect(existsSync(join(SRC_DIR, 'ts/auto-resize.ts'))).toBe(true);
  });

  it('exports autoResize function', () => {
    const src = readFileSync(join(SRC_DIR, 'ts/auto-resize.ts'), 'utf8');
    expect(src).toContain('export function autoResize');
  });

  it('exports autoResizeAll function', () => {
    const src = readFileSync(join(SRC_DIR, 'ts/auto-resize.ts'), 'utf8');
    expect(src).toContain('export function autoResizeAll');
  });

  it('uses ResizeObserver with debounce', () => {
    const src = readFileSync(join(SRC_DIR, 'ts/auto-resize.ts'), 'utf8');
    expect(src).toContain('ResizeObserver');
    expect(src).toContain('debounce');
  });
});

describe('sidebar-toggle utility', () => {
  it('src/ts/sidebar-toggle.ts exists', () => {
    expect(existsSync(join(SRC_DIR, 'ts/sidebar-toggle.ts'))).toBe(true);
  });

  it('exports initSidebarToggle', () => {
    const src = readFileSync(join(SRC_DIR, 'ts/sidebar-toggle.ts'), 'utf8');
    expect(src).toContain('export function initSidebarToggle');
  });
});
