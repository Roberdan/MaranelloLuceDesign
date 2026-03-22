import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');

function readFile(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8');
}

describe('metadata alignment — v5.8.0', () => {
  it('AGENT.md references v5.8.0', () => {
    const content = readFile('AGENT.md');
    expect(content).toContain('v5.8.0');
  });

  it('AGENT.md references 5 themes', () => {
    const content = readFile('AGENT.md');
    expect(content).toMatch(/5 themes/i);
  });

  it('AGENT.md references 32 WC tags', () => {
    const content = readFile('AGENT.md');
    expect(content).toContain('32');
  });

  it('NaSra.agent.md references v5.8.0', () => {
    const content = readFile('.github/agents/NaSra.agent.md');
    expect(content).toContain('v5.8.0');
  });

  it('CLAUDE.md header references v5.8.0', () => {
    const content = readFile('CLAUDE.md');
    const firstLine = content.split('\n')[0];
    expect(firstLine).toContain('v5.8.0');
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
});
