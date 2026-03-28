/**
 * CSS Build Script — LightningCSS bundler
 * Bundles maranello.css (full + minified), index.css, and copies individual files.
 */
import { mkdirSync, readdirSync, copyFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const srcDir = 'packages/elements/src/css';
const outDir = 'dist/css';

// Graceful check for lightningcss
let lightningcss;
try {
  lightningcss = await import('lightningcss');
} catch {
  console.error('CSS: lightningcss not installed. Run: npm install lightningcss');
  process.exit(1);
}

const { bundle } = lightningcss;

mkdirSync(outDir, { recursive: true });

if (!existsSync(srcDir)) {
  console.log('CSS: no source files found');
  process.exit(0);
}

// Browser targets for autoprefixing (last 2 major versions)
const targets = { chrome: (110 << 16), firefox: (110 << 16), safari: (15 << 16) };

/**
 * Bundle a CSS entry file with LightningCSS, resolving all @import directives.
 * @param {string} entry - source file path relative to cwd
 * @param {string} output - output file path relative to cwd
 * @param {object} opts - { minify?: boolean }
 */
function bundleCSS(entry, output, opts = {}) {
  const result = bundle({
    filename: resolve(entry),
    minify: opts.minify ?? false,
    sourceMap: false,
    errorRecovery: true,
    targets,
  });
  writeFileSync(output, result.code);
  const kb = (result.code.length / 1024).toFixed(1);
  console.log(`CSS: created ${output} (${kb} KB${opts.minify ? ', minified' : ''})`);
}

// 1. Bundle maranello.css (readable)
const maranelloSrc = join(srcDir, 'maranello.css');
if (existsSync(maranelloSrc)) {
  bundleCSS(maranelloSrc, join(outDir, 'maranello.css'));
  bundleCSS(maranelloSrc, join(outDir, 'maranello.min.css'), { minify: true });
} else {
  console.warn('CSS: maranello.css not found — skipping bundle');
}

// 2. Bundle index.css (readable, imports inlined)
// index.css uses bare-specifier @import '@maranello/tokens/css' for package consumers.
// LightningCSS cannot resolve bare specifiers, so skip if it fails.
const indexSrc = join(srcDir, 'index.css');
if (existsSync(indexSrc)) {
  try {
    bundleCSS(indexSrc, join(outDir, 'index.css'));
  } catch (err) {
    if (err.data === 'ResolverError') {
      console.warn('CSS: index.css uses bare-specifier imports — skipping (use maranello.css instead)');
    } else {
      throw err;
    }
  }
} else {
  console.warn('CSS: index.css not found — skipping bundle');
}

// 3. Copy individual CSS files for per-component imports
// Skip entry files already bundled above to avoid overwriting bundled output
const bundled = new Set(['maranello.css', 'index.css']);
const files = readdirSync(srcDir).filter((f) => f.endsWith('.css') && !bundled.has(f));
for (const file of files) {
  copyFileSync(join(srcDir, file), join(outDir, file));
}
console.log(`CSS: copied ${files.length} individual file(s) to ${outDir}`);
