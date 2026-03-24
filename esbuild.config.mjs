import { build } from 'esbuild';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const banner = `/* Maranello Luce Design v5.14.1 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */`;

const shared = {
  bundle: true,
  sourcemap: true,
  treeShaking: true,
  external: ['mapbox-gl'],
  banner: { js: banner },
  target: 'es2020',
};

/** Sub-package entry points (barrel files created by other tasks). */
const subPackages = ['charts', 'gauge', 'gantt', 'controls', 'forms'];

/**
 * Resolve entry points, skipping sub-packages whose barrel file
 * does not exist yet (other plan tasks create them).
 */
function resolveEntries() {
  const root = resolve('src/ts/index.ts');
  const entries = [root];
  const skipped = [];

  for (const pkg of subPackages) {
    const barrel = resolve(`src/ts/${pkg}/index.ts`);
    if (existsSync(barrel)) {
      entries.push(barrel);
    } else {
      skipped.push(pkg);
    }
  }

  if (skipped.length) {
    console.warn(`Skipping missing barrel files: ${skipped.join(', ')}`);
  }
  return entries;
}

/**
 * ESM build: all entry points with code splitting.
 * Shared chunks land in dist/esm/chunks/.
 */
function buildEsm(entries) {
  return build({
    ...shared,
    entryPoints: entries,
    format: 'esm',
    outdir: 'dist/esm',
    outbase: 'src/ts',
    splitting: true,
    chunkNames: 'chunks/[name]-[hash]',
  });
}

/**
 * CJS build: one build() call per entry point (CJS cannot use splitting).
 * Main entry  -> dist/cjs/index.cjs
 * Sub-package -> dist/cjs/{name}/index.cjs
 */
function buildCjs(entries) {
  return Promise.all(
    entries.map((entry) => {
      const isMain = entry.endsWith('src/ts/index.ts');
      const outdir = isMain ? 'dist/cjs' : `dist/cjs/${entryName(entry)}`;
      return build({
        ...shared,
        entryPoints: [entry],
        format: 'cjs',
        outdir,
        outExtension: { '.js': '.cjs' },
      });
    }),
  );
}

/** IIFE build: single minified bundle for CDN / script-tag consumers. */
function buildIife() {
  return build({
    ...shared,
    entryPoints: ['src/ts/maranello.ts'],
    format: 'iife',
    outfile: 'dist/iife/maranello.min.js',
    minify: true,
  });
}

/** Extract sub-package name from an entry path (e.g. "charts" from ".../charts/index.ts"). */
function entryName(entry) {
  const parts = entry.replace(/\\/g, '/').split('/');
  return parts[parts.length - 2]; // directory name before index.ts
}

async function run() {
  const entries = resolveEntries();
  console.log(`Entry points (${entries.length}): ${entries.map((e) => e.replace(resolve('.') + '/', '')).join(', ')}`);

  await Promise.all([buildEsm(entries), buildCjs(entries), buildIife()]);

  console.log('Build complete: ESM (split), CJS (per-entry), IIFE (minified)');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
