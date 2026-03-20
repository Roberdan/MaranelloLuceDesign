#!/usr/bin/env node
/**
 * WCAG 2.2 AA Contrast Ratio Checker
 * Parses tokens-color.css + themes-base.css, resolves var() chains,
 * computes luminance ratios for critical text/bg pairs per theme.
 * Exit 0 = pass, Exit 1 = failure.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS_DIR = join(ROOT, 'src', 'css');

/* ── Parse CSS custom properties into { varName: rawValue } ── */
function parseVars(css, selectorFilter) {
  const map = {};
  let inside = false;
  let depth = 0;
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

/* ── Resolve var() references recursively ── */
function resolve(value, vars, seen = new Set()) {
  if (!value || seen.has(value)) return value;
  seen.add(value);
  const m = value.match(/var\(\s*(--.+?)\s*\)/);
  if (m) return resolve(vars[m[1]] || value, vars, seen);
  return value;
}

/* ── Hex/named → [r, g, b] ── */
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return null;
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

/* ── WCAG relative luminance ── */
function luminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/* ── Contrast ratio ── */
function contrastRatio(c1, c2) {
  const l1 = luminance(c1), l2 = luminance(c2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ── Read CSS files ── */
const tokensCss = readFileSync(join(CSS_DIR, 'tokens-color.css'), 'utf8');
const themesCss = readFileSync(join(CSS_DIR, 'themes-base.css'), 'utf8');

const rootVars = parseVars(tokensCss);

/* ── Build theme variable maps ── */
const themes = {
  editorial:  { ...rootVars },
  nero:       { ...rootVars, ...parseVars(themesCss, 'body.mn-nero') },
  avorio:     { ...rootVars, ...parseVars(themesCss, 'body.mn-avorio') },
  colorblind: { ...rootVars, ...parseVars(themesCss, 'body.mn-colorblind') },
  sugar:      { ...rootVars, ...parseVars(themesCss, 'body.mn-sugar') },
};

/* ── Critical contrast pairs: [fgVar, bgVar, minRatio, label] ── */
const PAIRS = [
  ['--mn-text',      '--mn-surface',  4.5, 'text/surface'],
  ['--mn-text-muted','--mn-surface',  4.5, 'muted/surface'],
  ['--mn-accent',    '--mn-surface',  3.0, 'accent/surface (large)'],
  ['--mn-accent-text','--mn-accent',  4.5, 'accent-text/accent'],
];

/* ── Also check paired colors (defined in tokens-color.css) ── */
const pairCount = 12;
for (let i = 1; i <= pairCount; i++) {
  PAIRS.push([`--mn-pair-${i}-text`, `--mn-pair-${i}-bg`, 4.5, `pair-${i}`]);
}

let failures = 0;
let passes = 0;

for (const [themeName, vars] of Object.entries(themes)) {
  for (const [fgVar, bgVar, minRatio, label] of PAIRS) {
    const fgHex = resolve(vars[fgVar], vars);
    const bgHex = resolve(vars[bgVar], vars);
    if (!fgHex || !bgHex) continue;

    const fgRgb = hexToRgb(fgHex);
    const bgRgb = hexToRgb(bgHex);
    if (!fgRgb || !bgRgb) continue;

    const ratio = contrastRatio(fgRgb, bgRgb);
    if (ratio < minRatio) {
      console.error(`FAIL [${themeName}] ${label}: ${fgHex}/${bgHex} = ${ratio.toFixed(2)}:1 (need ${minRatio}:1)`);
      failures++;
    } else {
      passes++;
    }
  }
}

console.log(`\nContrast check: ${passes} passed, ${failures} failed`);
if (failures > 0) { console.error('BLOCKED: Fix contrast ratios before merge.'); process.exit(1); }
console.log('All WCAG AA contrast ratios OK');
