import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');

function readFile(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8');
}

describe('metadata alignment — v6.1.0', () => {
  it('AGENT.md references v6.1.0', () => {
    const content = readFile('AGENT.md');
    expect(content).toContain('v6.1.0');
  });

  it('AGENT.md references 6 themes', () => {
    const content = readFile('AGENT.md');
    expect(content).toMatch(/6 themes/i);
  });

  it('AGENT.md references 31 WC tags', () => {
    const content = readFile('AGENT.md');
    expect(content).toMatch(/31 WC/i);
  });

  it('NaSra.agent.md references v6.1.0', () => {
    const content = readFile('.github/agents/NaSra.agent.md');
    expect(content).toContain('v6.1.0');
  });

  it('CLAUDE.md header references v6.1.0', () => {
    const content = readFile('CLAUDE.md');
    const firstLine = content.split('\n')[0];
    expect(firstLine).toContain('v6.1.0');
  });

  it('hero.js does not reference MIT license', () => {
    const content = readFile('demo/sections/hero.js');
    expect(content.toLowerCase()).not.toContain('mit license');
    expect(content.toLowerCase()).not.toContain('mit lic');
  });

  it('hero.js references MPL-2.0', () => {
    const content = readFile('demo/sections/hero.js');
    expect(content).toMatch(/MPL/);
  });

  it('hero.js has no raw hex colors in gauge configs', () => {
    const content = readFile('demo/sections/hero.js');
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('needleColor') || line.includes('arcColor')) {
        expect(line).not.toMatch(/#[0-9a-fA-F]{6}/);
      }
    }
  });

  it('CONSUMER_CONTRACT.md references 6 themes in cycling order', () => {
    const content = readFile('CONSUMER_CONTRACT.md');
    expect(content).toMatch(/6 themes/i);
    expect(content).toContain('Editorial > Nero > Avorio > Colorblind > Sugar > Navy > (loop)');
  });

  it('packages/tokens/package.json is v6.1.0', () => {
    const pkg = JSON.parse(readFile('packages/tokens/package.json'));
    expect(pkg.version).toBe('6.1.0');
  });

  it('packages/elements/package.json is v6.1.0', () => {
    const pkg = JSON.parse(readFile('packages/elements/package.json'));
    expect(pkg.version).toBe('6.1.0');
  });

  it('packages/elements/src/ts/index.ts VERSION matches package.json version', () => {
    const pkg = JSON.parse(readFile('packages/elements/package.json'));
    const content = readFile('packages/elements/src/ts/index.ts');
    expect(content).toContain(`VERSION = '${pkg.version}'`);
  });
});
