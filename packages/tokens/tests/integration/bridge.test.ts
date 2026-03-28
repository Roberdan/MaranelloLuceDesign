/**
 * Integration tests for bridge-shadcn.css
 * Verifies the Maranello → shadcn/ui token bridge maps all required variables.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

const BRIDGE_PATH = join(import.meta.dirname, '../../src/css/bridge-shadcn.css');

const REQUIRED_SHADCN_VARS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--radius',
];

describe('bridge-shadcn.css', () => {
  let css: string;

  beforeAll(() => {
    css = readFileSync(BRIDGE_PATH, 'utf-8');
  });

  it('reads the bridge file successfully', () => {
    expect(css.length).toBeGreaterThan(0);
  });

  it('maps --background to var(--mn-surface)', () => {
    expect(css).toContain('--background: var(--mn-surface)');
  });

  it('maps --foreground to var(--mn-text)', () => {
    expect(css).toContain('--foreground: var(--mn-text)');
  });

  it('maps --primary to var(--mn-accent)', () => {
    expect(css).toContain('--primary: var(--mn-accent)');
  });

  it('maps --destructive to var(--mn-error)', () => {
    expect(css).toContain('--destructive: var(--mn-error)');
  });

  it('maps --border to var(--mn-border)', () => {
    expect(css).toContain('--border: var(--mn-border)');
  });

  it('maps --ring to var(--mn-focus-ring)', () => {
    expect(css).toContain('--ring: var(--mn-focus-ring)');
  });

  it('maps --radius to var(--radius-md)', () => {
    expect(css).toContain('--radius: var(--radius-md)');
  });

  it('contains all required shadcn variables', () => {
    const missing = REQUIRED_SHADCN_VARS.filter((v) => {
      // Match `--variable:` declaration (property side, not value side)
      const pattern = new RegExp(`${v.replace('--', '--')}:\\s*var\\(`);
      return !pattern.test(css);
    });
    expect(missing, `Missing shadcn variables: ${missing.join(', ')}`).toHaveLength(0);
  });

  it('applies to :root and [data-theme] selectors', () => {
    expect(css).toContain(':root');
    expect(css).toContain('[data-theme]');
  });
});
