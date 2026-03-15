#!/usr/bin/env node
// inject-version.mjs — Sync demo/index.html footer version from package.json.
// Run automatically as part of `npm run build`. Zero runtime deps.
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const htmlPath = join(ROOT, 'demo', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
// Replace `vX.Y.Z —` prefix in the footer version line only
const updated = html.replace(/(v)\d+\.\d+\.\d+( — \d+ themes)/, `$1${version}$2`);
if (updated === html) {
  console.log(`Version: demo footer already at v${version}`);
} else {
  writeFileSync(htmlPath, updated);
  console.log(`Version: demo footer updated to v${version}`);
}
