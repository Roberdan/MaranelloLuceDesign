/**
 * @maranello/elements — runtime isolation verification.
 * Ensures headless element sources do NOT import app-shell runtime modules.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const TS_DIR = path.resolve(__dirname, '../src/ts');

/** Recursively collect all .ts files in a directory. */
function collectTsFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectTsFiles(full));
    } else if (entry.name.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

describe('no app-shell runtime imports in @maranello/elements', () => {
  const tsFiles = collectTsFiles(TS_DIR);

  it('collects at least one .ts file', () => {
    expect(tsFiles.length).toBeGreaterThan(0);
  });

  it('no file imports AppShellController', () => {
    const violations: string[] = [];
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/import\s.*AppShellController/.test(content)) {
        violations.push(path.relative(TS_DIR, file));
      }
    }
    expect(violations).toEqual([]);
  });

  it('no file imports ViewRegistry (except as type-only)', () => {
    const violations: string[] = [];
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Match value imports of ViewRegistry, skip type-only imports
      const lines = content.split('\n');
      for (const line of lines) {
        if (
          /import\s/.test(line) &&
          /ViewRegistry/.test(line) &&
          !/import\s+type\b/.test(line)
        ) {
          violations.push(path.relative(TS_DIR, file));
          break;
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('no file imports NavigationModel', () => {
    const violations: string[] = [];
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/import\s.*NavigationModel/.test(content)) {
        violations.push(path.relative(TS_DIR, file));
      }
    }
    expect(violations).toEqual([]);
  });

  it('no file imports PanelOrchestrator', () => {
    const violations: string[] = [];
    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/import\s.*PanelOrchestrator/.test(content)) {
        violations.push(path.relative(TS_DIR, file));
      }
    }
    expect(violations).toEqual([]);
  });

  it('no file imports StateScaffold (except dashboard-widget-scaffold.ts)', () => {
    const violations: string[] = [];
    for (const file of tsFiles) {
      const basename = path.basename(file);
      if (basename === 'dashboard-widget-scaffold.ts') continue;
      const content = fs.readFileSync(file, 'utf-8');
      if (/import\s.*StateScaffold/.test(content)) {
        violations.push(path.relative(TS_DIR, file));
      }
    }
    expect(violations).toEqual([]);
  });
});
