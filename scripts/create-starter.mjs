#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const manifestPath = resolve(root, 'starters/template-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const args = process.argv.slice(2);

if (args.includes('--help') || args.length < 4) {
  console.log('Usage: node scripts/create-starter.mjs --template <id> --target <dir-in-workspace>');
  process.exit(0);
}

function readArg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

const templateId = readArg('--template');
const target = readArg('--target');
const entry = manifest.templates.find((item) => item.id === templateId);
const generatedSegments = new Set([
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'out',
]);
const generatedFiles = new Set([
  '.DS_Store',
]);

if (!entry) {
  console.error(`Unknown template: ${templateId}`);
  process.exit(1);
}

const sourceDir = resolve(root, entry.path);
const targetDir = resolve(root, target);
const targetPathFromWorkspaceRoot = relative(root, targetDir);

if (!targetPathFromWorkspaceRoot || targetPathFromWorkspaceRoot.startsWith('..')) {
  console.error(`Target must stay inside this workspace so starter workspace dependencies remain valid: ${targetDir}`);
  process.exit(1);
}

function shouldCopy(sourcePath) {
  const pathFromTemplateRoot = relative(sourceDir, sourcePath);
  if (!pathFromTemplateRoot) return true;

  return !pathFromTemplateRoot
    .split(/[\\/]+/)
    .some((segment) => generatedSegments.has(segment) || generatedFiles.has(segment));
}

if (existsSync(targetDir)) {
  console.error(`Target already exists: ${targetDir}`);
  process.exit(1);
}
mkdirSync(targetDir, { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true, filter: shouldCopy });
console.log(`Created ${templateId} starter at ${targetDir}`);
