import { build } from 'esbuild';

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
