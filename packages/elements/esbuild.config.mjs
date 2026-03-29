import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const external = ['mapbox-gl', '@convergio/design-tokens'];
const subpathEntries = [
  'src/ts/charts/index.ts',
  'src/ts/gantt/index.ts',
  'src/ts/gauge/index.ts',
  'src/ts/controls/index.ts',
  'src/ts/forms/index.ts',
];

// ESM with code splitting
await build({
  entryPoints: ['src/ts/index.ts'],
  bundle: true,
  format: 'esm',
  outdir: 'dist/esm',
  splitting: true,
  sourcemap: true,
  target: 'es2020',
  treeShaking: true,
  external,
});

// ESM subpath bundles for documented consumer imports
await build({
  entryPoints: subpathEntries,
  bundle: true,
  format: 'esm',
  outdir: 'dist/esm',
  outbase: 'src/ts',
  splitting: false,
  sourcemap: true,
  target: 'es2020',
  treeShaking: true,
  external,
});

// CJS bundles for Node/CommonJS consumers
await build({
  entryPoints: ['src/ts/index.ts', ...subpathEntries],
  bundle: true,
  format: 'cjs',
  outdir: 'dist/cjs',
  outbase: 'src/ts',
  outExtension: { '.js': '.cjs' },
  sourcemap: false,
  target: 'es2020',
  treeShaking: true,
  external,
});

// IIFE for CDN / demo page (window.Maranello namespace)
// maranello.ts assigns to window.Maranello internally — no globalName needed
await build({
  entryPoints: ['src/ts/maranello.ts'],
  bundle: true,
  format: 'iife',
  outfile: 'dist/iife/maranello.min.js',
  minify: true,
  sourcemap: true,
  target: 'es2020',
  treeShaking: true,
  external: ['mapbox-gl'],
  banner: {
    js: `/* Maranello Luce Design v${pkg.version} | MPL-2.0 */`,
  },
});
