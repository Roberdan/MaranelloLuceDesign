import { build } from 'esbuild';

await build({
  entryPoints: ['src/ts/index.ts'],
  bundle: true,
  format: 'esm',
  outdir: 'dist/esm',
  sourcemap: true,
  target: 'es2020',
  treeShaking: true,
});
