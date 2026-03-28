/**
 * Build Demo — copies IIFE bundle from @maranello/elements to root dist/
 * so demo/index.html and demo/e2e.html can load it at ../dist/iife/maranello.min.js.
 */
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const iifeSource = 'packages/elements/dist/iife/maranello.min.js';
const iifeMapSource = 'packages/elements/dist/iife/maranello.min.js.map';
const iifeOutDir = 'dist/iife';

mkdirSync(iifeOutDir, { recursive: true });

if (existsSync(iifeSource)) {
  copyFileSync(iifeSource, join(iifeOutDir, 'maranello.min.js'));
  console.log('Demo: copied IIFE bundle to dist/iife/maranello.min.js');
} else {
  console.error('Demo: IIFE bundle not found at', iifeSource);
  console.error('Demo: run "pnpm -r run build" first');
  process.exit(1);
}

if (existsSync(iifeMapSource)) {
  copyFileSync(iifeMapSource, join(iifeOutDir, 'maranello.min.js.map'));
  console.log('Demo: copied IIFE source map');
}
