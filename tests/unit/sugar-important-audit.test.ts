/**
 * Sugar theme !important audit — enforces reduced reliance on !important.
 * Each !important that remains must have an intentional comment explaining why.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_PATH = join(
  import.meta.dirname,
  '../../src/css/themes-sugar-components.css',
);
const content = readFileSync(CSS_PATH, 'utf8');

describe('Sugar theme !important audit', () => {
  it('has <= 77 !important declarations (40% reduction from 128)', () => {
    const count = (content.match(/!important/g) || []).length;
    expect(count).toBeLessThanOrEqual(77);
  });

  it('every remaining !important has an intentional comment on its rule', () => {
    const lines = content.split('\n');
    const violations: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes('!important')) continue;

      // The line itself or the line directly above must have /* intentional: ... */
      const prev = i > 0 ? lines[i - 1] : '';
      const hasComment =
        line.includes('/* intentional:') || prev.includes('/* intentional:');
      if (!hasComment) {
        violations.push(`Line ${i + 1}: ${line.trim().slice(0, 80)}`);
      }
    }

    expect(
      violations,
      `Found ${violations.length} !important without /* intentional: ... */ comment:\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });

  it('file stays under 250 lines', () => {
    const lineCount = content.split('\n').length;
    expect(lineCount).toBeLessThanOrEqual(250);
  });

  it('remains inside @layer themes block', () => {
    expect(content.trimStart()).toMatch(/^@layer themes\s*\{/);
    expect(content.trimEnd()).toMatch(/\}\s*\/\*\s*end @layer themes\s*\*\/$/);
  });
});
