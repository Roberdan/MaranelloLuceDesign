import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, extname, join } from 'path';

const targetDir = process.argv[2];

if (!targetDir) {
  console.error('Usage: node scripts/fix-dts-imports.mjs <types-dir>');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function withJsExtension(specifier) {
  if (!specifier.startsWith('.')) return specifier;
  if (extname(specifier)) return specifier;
  return `${specifier}.js`;
}

function resolveSpecifier(file, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  if (extname(specifier)) return specifier;

  const baseDir = dirname(file);
  if (existsSync(join(baseDir, `${specifier}.d.ts`))) return `${specifier}.js`;
  if (existsSync(join(baseDir, specifier, 'index.d.ts'))) return `${specifier}/index.js`;
  return withJsExtension(specifier);
}

function rewriteSpecifiers(file, content) {
  const importPattern = /((?:import|from)\s*\(?\s*['"])(\.\.?\/[^'")]+)(['"]\s*\)?)/g;
  const exportFromPattern = /(export\s+(?:type\s+)?(?:\*|\{[^}]*\})\s+from\s+['"])(\.\.?\/[^'")]+)(['"])/g;

  const next = content.replace(
    importPattern,
    (_, prefix, specifier, suffix) =>
      `${prefix}${resolveSpecifier(file, specifier)}${suffix}`,
  );

  return next.replace(
    exportFromPattern,
    (_, prefix, specifier, suffix) =>
      `${prefix}${resolveSpecifier(file, specifier)}${suffix}`,
  );
}

for (const file of walk(targetDir)) {
  if (!file.endsWith('.d.ts')) continue;
  const current = readFileSync(file, 'utf8');
  const next = rewriteSpecifiers(file, current);
  if (next !== current) writeFileSync(file, next);
}
