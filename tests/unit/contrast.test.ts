import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CSS_DIR = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..', 'src', 'css');

function parseVars(css: string, selectorFilter?: string): Record<string, string> {
  const map: Record<string, string> = {};
  let inside = false, depth = 0;
  for (const line of css.split('\n')) {
    if (selectorFilter && line.includes(selectorFilter)) inside = true;
    if (inside || !selectorFilter) {
      if (line.includes('{')) depth++;
      // Capture vars before closing the block (handles one-line rules)
      if (line.includes('--')) {
        for (const m of line.matchAll(/(--.+?):\s*(.+?)\s*;/g)) {
          map[m[1].trim()] = m[2].trim();
        }
      }
      if (line.includes('}')) { depth--; if (depth <= 0) inside = false; }
    }
  }
  return map;
}

function resolve(value: string, vars: Record<string, string>, seen = new Set<string>()): string {
  if (!value || seen.has(value)) return value;
  seen.add(value);
  const m = value.match(/var\(\s*(--.+?)\s*\)/);
  if (m) return resolve(vars[m[1]] || value, vars, seen);
  return value;
}

function hexToRgb(hex: string): [number, number, number] | null {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return null;
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(c1: [number, number, number], c2: [number, number, number]): number {
  const l1 = luminance(c1), l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const tokensCss = readFileSync(join(CSS_DIR, 'tokens-color.css'), 'utf8');
const themesCss = readFileSync(join(CSS_DIR, 'themes-base.css'), 'utf8');
const sugarCbCss = readFileSync(join(CSS_DIR, 'themes-sugar-colorblind.css'), 'utf8');
const rootVars = parseVars(tokensCss);

const sugarVars = parseVars(themesCss, 'body.mn-sugar');
const colorblindVars = parseVars(themesCss, 'body.mn-colorblind');
const sugarCbVars = parseVars(sugarCbCss, 'body.mn-sugar.mn-colorblind');

const themes: Record<string, Record<string, string>> = {
  editorial: { ...rootVars },
  nero: { ...rootVars, ...parseVars(themesCss, 'body.mn-nero') },
  avorio: { ...rootVars, ...parseVars(themesCss, 'body.mn-avorio') },
  colorblind: { ...rootVars, ...colorblindVars },
  sugar: { ...rootVars, ...sugarVars },
  'sugar-colorblind': { ...rootVars, ...sugarVars, ...colorblindVars, ...sugarCbVars },
};

describe('WCAG AA contrast ratios', () => {
  const PAIRS: [string, string, number, string][] = [
    ['--mn-text', '--mn-surface', 4.5, 'text/surface'],
    ['--mn-text-muted', '--mn-surface', 4.5, 'muted/surface'],
    ['--mn-accent', '--mn-surface', 3.0, 'accent/surface'],
    ['--mn-accent-text', '--mn-accent', 4.5, 'accent-text/accent'],
  ];

  for (const [themeName, vars] of Object.entries(themes)) {
    describe(themeName, () => {
      for (const [fgVar, bgVar, minRatio, label] of PAIRS) {
        const fg = resolve(vars[fgVar], vars);
        const bg = resolve(vars[bgVar], vars);
        if (!fg || !bg) continue;
        const fgRgb = hexToRgb(fg);
        const bgRgb = hexToRgb(bg);
        if (!fgRgb || !bgRgb) continue;

        it(`${label}: ${fg} on ${bg} >= ${minRatio}:1`, () => {
          const ratio = contrastRatio(fgRgb, bgRgb);
          expect(ratio).toBeGreaterThanOrEqual(minRatio);
        });
      }
    });
  }

  describe('paired colors', () => {
    for (let i = 1; i <= 12; i++) {
      const fg = resolve(rootVars[`--mn-pair-${i}-text`], rootVars);
      const bg = resolve(rootVars[`--mn-pair-${i}-bg`], rootVars);
      if (!fg || !bg) continue;
      const fgRgb = hexToRgb(fg);
      const bgRgb = hexToRgb(bg);
      if (!fgRgb || !bgRgb) continue;

      it(`pair-${i}: ${fg} on ${bg} >= 4.5:1`, () => {
        expect(contrastRatio(fgRgb, bgRgb)).toBeGreaterThanOrEqual(4.5);
      });
    }
  });
});
