import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');

function readJson(rel: string): Record<string, unknown> {
  return JSON.parse(readFileSync(resolve(ROOT, rel), 'utf8'));
}

describe('monorepo scaffold', () => {
  it('pnpm-workspace.yaml exists and lists packages/*', () => {
    const wsPath = resolve(ROOT, 'pnpm-workspace.yaml');
    expect(existsSync(wsPath)).toBe(true);
    const content = readFileSync(wsPath, 'utf8');
    const ws = parse(content) as { packages: string[] };
    expect(ws.packages).toContain('packages/*');
  });

  it('root package.json is private', () => {
    const pkg = readJson('package.json');
    expect(pkg.private).toBe(true);
  });

  it('root package.json has workspace scripts', () => {
    const pkg = readJson('package.json') as { scripts: Record<string, string> };
    expect(pkg.scripts.build).toBe('pnpm -r run build');
    expect(pkg.scripts.test).toBe('pnpm -r run test');
    expect(pkg.scripts.clean).toBe('pnpm -r run clean');
  });

  it('root package.json keeps existing devDependencies', () => {
    const pkg = readJson('package.json') as { devDependencies: Record<string, string> };
    expect(pkg.devDependencies.vitest).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
    expect(pkg.devDependencies.esbuild).toBeDefined();
  });

  it('@convergio/design-tokens package.json is correct', () => {
    const pkg = readJson('packages/tokens/package.json') as Record<string, unknown>;
    expect(pkg.name).toBe('@convergio/design-tokens');
    expect(pkg.version).toBe('6.0.0');
    expect(pkg.type).toBe('module');
    expect(pkg.license).toBe('MPL-2.0');
  });

  it('@convergio/design-elements package.json is correct', () => {
    const pkg = readJson('packages/elements/package.json') as Record<string, unknown>;
    expect(pkg.name).toBe('@convergio/design-elements');
    expect(pkg.version).toBe('6.0.0');
    expect(pkg.type).toBe('module');
    expect(pkg.license).toBe('MPL-2.0');
    const peers = pkg.peerDependencies as Record<string, string>;
    expect(peers['@convergio/design-tokens']).toBe('^6.0.0');
  });

  it('per-package tsconfig.json files extend root', () => {
    for (const sub of ['tokens', 'elements']) {
      const tsconfig = readJson(`packages/${sub}/tsconfig.json`) as Record<string, unknown>;
      expect(tsconfig.extends).toBe('../../tsconfig.json');
      const opts = tsconfig.compilerOptions as Record<string, string>;
      expect(opts.rootDir).toBe('src');
      expect(opts.outDir).toBe('dist');
      expect(opts.declarationDir).toBe('dist/types');
    }
  });

  it('empty src directories exist', () => {
    const dirs = [
      'packages/tokens/src/css',
      'packages/tokens/src/ts',
      'packages/elements/src/ts',
      'packages/elements/src/wc',
      'packages/elements/src/css',
    ];
    for (const d of dirs) {
      expect(existsSync(resolve(ROOT, d))).toBe(true);
    }
  });
});
