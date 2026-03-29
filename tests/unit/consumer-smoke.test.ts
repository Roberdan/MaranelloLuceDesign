import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '../..');
const TSC = join(ROOT, 'node_modules/typescript/bin/tsc');
const TOKENS_DIR = join(ROOT, 'packages/tokens');
const ELEMENTS_DIR = join(ROOT, 'packages/elements');

type SmokeContext = {
  tempDir: string;
  packsDir: string;
  appDir: string;
};

let smoke: SmokeContext;

function run(cwd: string, command: string, args: string[]): string {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function writeConsumerFixture(appDir: string): void {
  writeFileSync(
    join(appDir, 'package.json'),
    JSON.stringify(
      {
        name: 'consumer-smoke',
        private: true,
        type: 'module',
        dependencies: {
          '@convergio/design-tokens': 'file:../packs/convergio-design-tokens-6.3.2.tgz',
          '@convergio/design-elements': 'file:../packs/convergio-design-elements-6.3.2.tgz',
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(appDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          lib: ['ES2020', 'DOM'],
        },
        include: ['root.ts', 'charts.ts', 'tokens.ts'],
      },
      null,
      2,
    ),
  );

  writeFileSync(join(appDir, 'root.ts'), "import { toast } from '@convergio/design-elements';\nvoid toast;\n");
  writeFileSync(join(appDir, 'charts.ts'), "import { barChart } from '@convergio/design-elements/charts';\nvoid barChart;\n");
  writeFileSync(join(appDir, 'tokens.ts'), "import { setTheme } from '@convergio/design-tokens';\nvoid setTheme;\n");
}

beforeAll(() => {
  const tempDir = mkdtempSync(join(tmpdir(), 'convergio-consumer-'));
  const packsDir = join(tempDir, 'packs');
  const appDir = join(tempDir, 'app');

  smoke = { tempDir, packsDir, appDir };
  run(ROOT, 'mkdir', ['-p', packsDir, appDir]);

  run(ROOT, 'pnpm', ['--filter', '@convergio/design-tokens', 'build']);
  run(ROOT, 'pnpm', ['--filter', '@convergio/design-elements', 'build']);
  run(TOKENS_DIR, 'npm', ['pack', '--silent', '--pack-destination', packsDir]);
  run(ELEMENTS_DIR, 'npm', ['pack', '--silent', '--pack-destination', packsDir]);
  writeConsumerFixture(appDir);
  run(appDir, 'npm', ['install', '--silent']);
}, 120_000);

afterAll(() => {
  rmSync(smoke.tempDir, { recursive: true, force: true });
});

describe('packed consumer install', () => {
  it('installs the published package files needed by consumers', () => {
    expect(existsSync(join(smoke.appDir, 'node_modules/@convergio/design-elements/dist/esm/index.js'))).toBe(true);
    expect(existsSync(join(smoke.appDir, 'node_modules/@convergio/design-elements/dist/esm/charts/index.js'))).toBe(true);
    expect(existsSync(join(smoke.appDir, 'node_modules/@convergio/design-elements/dist/esm/wc/register-all.js'))).toBe(true);
    expect(existsSync(join(smoke.appDir, 'node_modules/@convergio/design-elements/dist/types/wc/index.d.ts'))).toBe(true);
  });

  it('imports root, subpath, and wc barrel entrypoints in ESM without a DOM', () => {
    const script = [
      "await import('@convergio/design-elements');",
      "await import('@convergio/design-elements/charts');",
      "await import('@convergio/design-elements/wc');",
      "await import('@convergio/design-elements/register-all');",
      "console.log('ok');",
    ].join('\n');
    const output = run(smoke.appDir, 'node', ['--input-type=module', '-e', script]);
    expect(output).toContain('ok');
  });

  it('supports CommonJS require for root and documented subpaths', () => {
    const output = run(smoke.appDir, 'node', [
      '-e',
      [
        "const root = require('@convergio/design-elements');",
        "const charts = require('@convergio/design-elements/charts');",
        "const registerAll = require('@convergio/design-elements/register-all');",
        "if (typeof root.toast !== 'function') throw new Error('missing root export');",
        "if (typeof charts.barChart !== 'function') throw new Error('missing charts export');",
        "if (typeof registerAll.registerAll !== 'function') throw new Error('missing registerAll export');",
        "console.log('ok');",
      ].join('\n'),
    ]);
    expect(output).toContain('ok');
  });

  it('type-checks with NodeNext resolution', () => {
    const output = run(smoke.appDir, 'node', [TSC, '-p', '.', '--pretty', 'false']);
    expect(output).toBe('');
  });
});
