import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

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
  external: ['mapbox-gl', '@maranello/tokens'],
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
