#!/usr/bin/env node
/**
 * Semantic Design Audit — Signal Token & Danger-Button Checks
 * Per-theme checks:
 *   1. signal-ok / signal-warning / signal-danger must not resolve to the same color value
 *      (exact match after var() resolution) (P0)
 *   2. --mn-accent must differ from --mn-error (P1 warning, P0 if component CSS lacks a fix)
 *   3. danger-button text contrast on --mn-error bg must be >= 4.5:1 (P0, WCAG 2.2 SC 1.4.3)
 * Outputs a machine-readable JSON report; exits 1 on any P0 finding.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS  = join(ROOT, 'packages', 'tokens', 'src', 'css');
const PKG  = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/* ── CSS var parser ── */
function parseVars(css, selectorFilter) {
  const map = {};
  let inside = false, depth = 0;
  for (const line of css.split('\n')) {
    if (selectorFilter && line.includes(selectorFilter)) inside = true;
    if (inside || !selectorFilter) {
      if (line.includes('{')) depth++;
      if (line.includes('--')) {
        for (const m of line.matchAll(/(--.+?):\s*(.+?)\s*;/g))
          map[m[1].trim()] = m[2].trim();
      }
      if (line.includes('}')) { depth--; if (depth <= 0) inside = false; }
    }
  }
  return map;
}

/* ── Resolve var() chains (max depth 10) ── */
function resolve(val, vars, depth = 0) {
  if (!val || depth > 10) return val;
  const m = val.match(/var\(\s*(--.+?)\s*\)/);
  return m ? resolve(vars[m[1]] || val, vars, depth + 1) : val;
}

/* ── #hex → [r,g,b] ── */
function hexToRgb(h) {
  h = h.replace(/^#/, '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) return null;
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

/* ── WCAG luminance ── */
function lum([r,g,b]) {
  return [r,g,b].reduce((acc,c,i) => {
    const s = c / 255;
    const lin = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    return acc + lin * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function contrast(c1, c2) {
  const [l1, l2] = [lum(c1), lum(c2)];
  return (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05);
}

/* ── Load CSS ── */
const tokensCss = readFileSync(join(CSS, 'tokens-color.css'), 'utf8');
const themesCss = readFileSync(join(CSS, 'themes-base.css'), 'utf8');
const sugarCbCss = readFileSync(join(CSS, 'themes-sugar-colorblind.css'), 'utf8');
const rootVars  = parseVars(tokensCss);

const THEMES = {
  editorial:       { ...rootVars },
  nero:            { ...rootVars, ...parseVars(themesCss, 'body.mn-nero') },
  avorio:          { ...rootVars, ...parseVars(themesCss, 'body.mn-avorio') },
  colorblind:      { ...rootVars, ...parseVars(themesCss, 'body.mn-colorblind') },
  sugar:           { ...rootVars, ...parseVars(themesCss, 'body.mn-sugar') },
  sugarColorblind: {
    ...rootVars,
    ...parseVars(themesCss, 'body.mn-sugar'),
    ...parseVars(sugarCbCss, 'body.mn-sugar.mn-colorblind'),
  },
};

/* ── Audit state ── */
const findings = { P0: [], P1: [], P2: [] };
const contrastReport = [];

function p0(component, theme, issue, fix) {
  findings.P0.push({ component, theme, severity: 'P0', issue, fix });
}
function p1(component, theme, issue, fix) {
  findings.P1.push({ component, theme, severity: 'P1', issue, fix });
}

/* ── Per-theme signal checks ── */
for (const [theme, vars] of Object.entries(THEMES)) {
  const ok  = resolve(vars['--signal-ok'],      vars);
  const wrn = resolve(vars['--signal-warning'],  vars);
  const dng = resolve(vars['--signal-danger'],   vars);
  const err = resolve(vars['--mn-error'],        vars);
  const acc = resolve(vars['--mn-accent'],       vars);
  const errRgb = err ? hexToRgb(err) : null;

  /* 1. Signal distinctness */
  if (ok && wrn && ok === wrn)
    p0('signal-dots', theme, `--signal-ok (${ok}) == --signal-warning (${wrn})`,
       'Give signal-ok and signal-warning distinct hex values');
  if (ok && dng && ok === dng)
    p0('signal-dots', theme, `--signal-ok (${ok}) == --signal-danger (${dng})`,
       'Give signal-ok and signal-danger distinct hex values');
  if (wrn && dng && wrn === dng)
    p0('signal-dots', theme, `--signal-warning (${wrn}) == --signal-danger (${dng})`,
       'Give signal-warning and signal-danger distinct hex values');

  /* 2. Accent vs Error (P1 — visual fix expected at component level) */
  if (acc && err && acc === err)
    p1('mn-form-btn--primary / --danger', theme,
       `--mn-accent (${acc}) == --mn-error (${err}): primary and danger share the same fill`,
       'Apply outline/ghost override for .mn-form-btn--danger in a theme CSS file');

  /* 3. Danger-button text contrast on error background.
     WCAG 2.2 SC 1.4.3 (Contrast Minimum, Level AA): ≥4.5:1 for normal text.
     --mn-danger-text defaults to white (bianco-puro); themes may override.
     Use #C94000 (dark vermillion) for colorblind --mn-error to achieve 4.5:1. */
  const dangerTxt = resolve(vars['--mn-danger-text'], vars);
  const dangerTxtRgb = dangerTxt ? hexToRgb(dangerTxt) : null;
  if (dangerTxtRgb && errRgb) {
    const ratio = contrast(dangerTxtRgb, errRgb);
    contrastReport.push({ theme, pair: 'mn-danger-text/mn-error (danger btn)', ratio: +ratio.toFixed(2), pass: ratio >= 4.5 });
    if (ratio < 4.5)
      p0('mn-form-btn--danger text', theme,
         `--mn-danger-text (${dangerTxt}) on --mn-error (${err}) = ${ratio.toFixed(2)}:1 (need ≥4.5:1 per WCAG SC 1.4.3)`,
         'Set --mn-danger-text to a color with ≥4.5:1 contrast on --mn-error background');
  }
}

/* ── Report ── */
const p0count = findings.P0.length;
const p1count = findings.P1.length;

const report = {
  version: PKG.version,
  themes_audited: Object.keys(THEMES).length,
  findings: { P0: p0count, P1: p1count, P2: 0 },
  signal_findings: [...findings.P0, ...findings.P1],
  contrast_on_error: contrastReport,
  pass: p0count === 0,
};

console.log(JSON.stringify(report, null, 2));

if (p0count > 0) {
  console.error(`\nSEMANTIC AUDIT BLOCKED: ${p0count} P0 finding(s)`);
  findings.P0.forEach(f =>
    console.error(`  [P0] [${f.theme}] ${f.component}: ${f.issue}\n        Fix: ${f.fix}`)
  );
  process.exit(1);
}

if (p1count > 0) {
  console.warn(`\nSEMANTIC AUDIT: ${p1count} P1 warning(s) (non-blocking)`);
  findings.P1.forEach(f =>
    console.warn(`  [P1] [${f.theme}] ${f.component}: ${f.issue}`)
  );
}

console.log(`\nSemantic signal audit OK — ${p0count} P0, ${p1count} P1`);
