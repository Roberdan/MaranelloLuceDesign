import { build } from 'esbuild';
import { mkdirSync, readdirSync, existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'src/wc';
const wcDistDir = 'dist/wc';
const esmWcDir = 'dist/esm/wc';

mkdirSync(wcDistDir, { recursive: true });
mkdirSync(esmWcDir, { recursive: true });

if (!existsSync(srcDir)) {
  console.log('WC: no source directory found');
  process.exit(0);
}

const files = readdirSync(srcDir).filter(
  (f) => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.d.ts')
);

// Filter WC component files (mn-*.js)
const wcComponents = files.filter((f) => f.match(/^mn-[\w-]+\.js$/));

// Filter type definitions and index
const typeAndIndex = files.filter((f) => f.endsWith('.d.ts') || f.endsWith('index.ts'));

if (wcComponents.length === 0) {
  console.log('WC: no component files found');
  process.exit(0);
}

async function buildWCs() {
  try {
    // Build each WC component with esbuild
    await Promise.all(
      wcComponents.map((file) =>
        build({
          entryPoints: [join(srcDir, file)],
          outfile: join(wcDistDir, file),
          format: 'esm',
          bundle: false,
          target: 'es2020',
          sourcemap: true,
          logLevel: 'silent',
        })
      )
    );

    console.log(`WC: transpiled ${wcComponents.length} component(s) to ${wcDistDir}`);

    // Copy type definitions
    typeAndIndex.forEach((file) => {
      if (file.endsWith('.d.ts')) {
        copyFileSync(join(srcDir, file), join(wcDistDir, file));
      }
    });

    // Build WC barrel (index.ts) if it exists
    const indexFile = typeAndIndex.find((f) => f === 'index.ts');
    if (indexFile) {
      await build({
        entryPoints: [join(srcDir, indexFile)],
        outfile: join(esmWcDir, 'index.js'),
        format: 'esm',
        bundle: false,
        target: 'es2020',
        sourcemap: true,
        logLevel: 'silent',
      });

      console.log(`WC: built barrel export to ${esmWcDir}/index.js`);
    }

    console.log(`WC: build complete (${wcComponents.length} WCs + barrel)`);
  } catch (err) {
    console.error('WC: build failed', err);
    process.exit(1);
  }
}

buildWCs();
