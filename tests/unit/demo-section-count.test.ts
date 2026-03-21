import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('demo section count coherence', () => {
  const appPath = resolve(__dirname, '../../demo/app.js');
  const htmlPath = resolve(__dirname, '../../demo/index.html');
  const appSrc = readFileSync(appPath, 'utf8');
  const htmlSrc = readFileSync(htmlPath, 'utf8');

  it('index.html counter total matches actual SECTIONS map size', () => {
    // Count import() entries in the SECTIONS Map
    const imports = appSrc.match(/import\(/g);
    const sectionCount = imports ? imports.length : 0;

    // Extract the "N / M" label from demo-pg-label
    const labelMatch = htmlSrc.match(/id="demo-pg-label"[^>]*>(\d+)\s*\/\s*(\d+)/);
    expect(labelMatch).not.toBeNull();
    const totalInLabel = parseInt(labelMatch![2], 10);

    expect(totalInLabel).toBe(sectionCount);
  });

  it('nav link count matches SECTIONS map size', () => {
    const imports = appSrc.match(/import\(/g);
    const sectionCount = imports ? imports.length : 0;

    // Count <a href="#..."> in demo-nav__links
    const linksBlock = htmlSrc.match(
      /class="demo-nav__links"[\s\S]*?<\/ul>/
    );
    expect(linksBlock).not.toBeNull();
    const navLinks = linksBlock![0].match(/<a href="#/g);
    const navCount = navLinks ? navLinks.length : 0;

    expect(navCount).toBe(sectionCount);
  });

  it('safeErr uses semantic tokens not primitive tokens', () => {
    // safeErr should not reference primitive tokens like --rosso-corsa or --grigio-medio
    const safeErrMatch = appSrc.match(
      /function safeErr[\s\S]*?^}/m
    );
    expect(safeErrMatch).not.toBeNull();
    const safeErrBody = safeErrMatch![0];

    expect(safeErrBody).not.toContain('--rosso-corsa');
    expect(safeErrBody).not.toContain('--grigio-medio');
    expect(safeErrBody).not.toContain('--grigio-chiaro');
  });
});
