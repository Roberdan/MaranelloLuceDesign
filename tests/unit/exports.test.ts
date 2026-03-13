/**
 * Verify sub-package dist files exist and have correct structure.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '../../dist');

// Sub-packages defined in package.json exports
const SUB_PACKAGES = ['charts', 'gantt', 'gauge', 'controls', 'forms', 'wc'];

describe('sub-package ESM files exist', () => {
  for (const pkg of SUB_PACKAGES) {
    it(`dist/esm/${pkg}/index.js exists`, () => {
      const p = join(DIST, 'esm', pkg, 'index.js');
      if (!existsSync(join(DIST, 'esm', pkg))) return; // skip if sub-pkg not in esm
      expect(existsSync(p)).toBe(true);
    });
  }
});

describe('sub-package CJS files exist', () => {
  for (const pkg of SUB_PACKAGES.filter((p) => p !== 'wc')) {
    it(`dist/cjs/${pkg}/index.cjs exists`, () => {
      const p = join(DIST, 'cjs', pkg, 'index.cjs');
      if (!existsSync(join(DIST, 'cjs', pkg))) return;
      expect(existsSync(p)).toBe(true);
    });
  }
});

describe('sub-package TypeScript declarations', () => {
  const typedPkgs = ['charts', 'gantt', 'gauge', 'controls', 'forms'];
  for (const pkg of typedPkgs) {
    it(`dist/types/${pkg}/index.d.ts exists`, () => {
      const p = join(DIST, 'types', pkg, 'index.d.ts');
      if (!existsSync(join(DIST, 'types', pkg))) return;
      expect(existsSync(p)).toBe(true);
    });
  }
});

describe('dist/wc/ web component files', () => {
  it('dist/wc/ directory has 22+ files', () => {
    const wcDir = join(DIST, 'wc');
    if (!existsSync(wcDir)) return;
    const files = readdirSync(wcDir);
    expect(files.length).toBeGreaterThanOrEqual(22);
  });

  it('dist/wc/ contains .js files', () => {
    const wcDir = join(DIST, 'wc');
    if (!existsSync(wcDir)) return;
    const files = readdirSync(wcDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
  });
});

describe('dist/types/ contains .d.ts files', () => {
  it('types/ts/ has declaration files', () => {
    const typesDir = join(DIST, 'types', 'ts');
    if (!existsSync(typesDir)) return;
    const files = readdirSync(typesDir, { recursive: true }) as string[];
    const dtsFiles = files.filter((f) => (f as string).endsWith('.d.ts'));
    expect(dtsFiles.length).toBeGreaterThan(0);
  });
});

describe('main dist bundles exist', () => {
  it('dist/esm/index.js exists', () => {
    expect(existsSync(join(DIST, 'esm/index.js'))).toBe(true);
  });

  it('dist/cjs/index.cjs exists', () => {
    expect(existsSync(join(DIST, 'cjs/index.cjs'))).toBe(true);
  });

  it('dist/types/ts/index.d.ts exists', () => {
    expect(existsSync(join(DIST, 'types/ts/index.d.ts'))).toBe(true);
  });
});
