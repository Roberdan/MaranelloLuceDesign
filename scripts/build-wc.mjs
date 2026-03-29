import { build } from 'esbuild';
import { mkdirSync, readdirSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'src/wc';
const browserWcDir = 'dist/wc';
const esmWcDir = 'dist/esm/wc';
const cjsWcDir = 'dist/cjs/wc';
const typesWcDir = 'dist/types/wc';

[browserWcDir, esmWcDir, cjsWcDir, typesWcDir].forEach((dir) => mkdirSync(dir, { recursive: true }));

if (!existsSync(srcDir)) {
  console.log('WC: no source directory found');
  process.exit(0);
}

const files = readdirSync(srcDir).filter(
  (f) => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.d.ts')
);

// Filter WC component files (mn-*.js)
const wcComponents = files.filter((f) => f.match(/^mn-[\w-]+\.js$/));

const typeFiles = files.filter((f) => f.endsWith('.d.ts'));
const indexFile = files.find((f) => f === 'index.ts');
const registerAllFile = files.find((f) => f === 'register-all.ts');
const wcEntries = wcComponents.map((file) => join(srcDir, file));
const packageEntries = [
  indexFile ? join(srcDir, indexFile) : null,
  registerAllFile ? join(srcDir, registerAllFile) : null,
  ...wcEntries,
].filter(Boolean);

if (wcComponents.length === 0) {
  console.log('WC: no component files found');
  process.exit(0);
}

function patchCjsModule(file) {
  const path = join(cjsWcDir, file);
  const content = readFileSync(path, 'utf8');
  const next = content
    .replace(/require\("(\.\/[^"]+)\.js"\)/g, 'require("$1.cjs")')
    .replace(/import\("(\.\/[^"]+)\.js"\)/g, 'import("$1.cjs")')
    .replace(/require\("\.\.\/ts\/[^"]+\.js"\)/g, 'require("../index.cjs")')
    .replace(/import\("\.\.\/ts\/[^"]+\.js"\)/g, 'import("../index.cjs")')
    .replace(
      /const import_meta = \{\};/g,
      'const import_meta = { url: require("url").pathToFileURL(__filename).href };'
    );
  if (next !== content) writeFileSync(path, next);
}

function patchCjsModules() {
  readdirSync(cjsWcDir)
    .filter((file) => file.endsWith('.cjs'))
    .forEach((file) => patchCjsModule(file));
}

async function buildWCs() {
  try {
    await Promise.all(
      [
        build({
          entryPoints: wcEntries,
          outdir: browserWcDir,
          format: 'esm',
          bundle: true,
          target: 'es2020',
          outbase: srcDir,
          sourcemap: true,
          logLevel: 'silent',
        }),
        build({
          entryPoints: packageEntries,
          outdir: esmWcDir,
          format: 'esm',
          bundle: false,
          target: 'es2020',
          outbase: srcDir,
          sourcemap: true,
          logLevel: 'silent',
        }),
        build({
          entryPoints: packageEntries,
          outdir: cjsWcDir,
          format: 'cjs',
          bundle: false,
          target: 'es2020',
          outbase: srcDir,
          outExtension: { '.js': '.cjs' },
          sourcemap: false,
          logLevel: 'silent',
        }),
      ]
    );
    patchCjsModules();

    console.log(`WC: transpiled ${wcComponents.length} browser component(s) to ${browserWcDir}`);
    console.log(`WC: built ${wcComponents.length} ESM component(s) to ${esmWcDir}`);
    console.log(`WC: built ${wcComponents.length} CJS component(s) to ${cjsWcDir}`);

    typeFiles.forEach((file) => {
      const source = join(srcDir, file);
      copyFileSync(source, join(browserWcDir, file));
      copyFileSync(source, join(typesWcDir, file));
    });

    wcComponents.forEach((file) => {
      writeFileSync(join(typesWcDir, file.replace(/\.js$/, '.d.ts')), 'export {};\n');
    });

    console.log(`WC: build complete (${wcComponents.length} WCs + package entrypoints)`);
  } catch (err) {
    console.error('WC: build failed', err);
    process.exit(1);
  }
}

buildWCs();
