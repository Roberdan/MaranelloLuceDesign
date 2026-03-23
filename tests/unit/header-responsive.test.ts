/**
 * HeaderShell responsive/demo contract tests.
 * @vitest-environment happy-dom
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const demoHtml = readFileSync(path.join(rootDir, 'demo/header-responsive.html'), 'utf8');
const demoFilterJs = readFileSync(path.join(rootDir, 'demo/header-responsive-filter-board.js'), 'utf8');
const demoShellJs = readFileSync(path.join(rootDir, 'demo/header-responsive-shell.js'), 'utf8');
const rootHtml = readFileSync(path.join(rootDir, 'header-responsive.html'), 'utf8');

describe('headerShell responsive demo', () => {
  it('uses mn-header-shell as a real consumer with declarative sections', () => {
    expect(demoHtml).toContain('id="navbar"');
    expect(demoHtml).not.toContain('id="navbar-left"');
    expect(demoHtml).toContain('../src/wc/mn-header-shell.js');
    expect(demoShellJs).toContain("document.createElement('mn-header-shell')");
    expect(demoShellJs).toContain('headerHost.config = {');
    expect(demoShellJs).toContain("type: 'brand'");
    expect(demoShellJs).toContain("logoSrc: brandLogo");
    expect(demoShellJs).toContain("type: 'search'");
    expect(demoShellJs).toContain("type: 'theme'");
    expect(demoShellJs).toContain("type: 'profile'");
    expect(demoShellJs).toContain("icon: icon('pipeline')");
    expect(demoHtml).toContain('header-responsive-filter-board.js');
    expect(demoFilterJs).toContain('shell-filter-trigger');
  });

  it('keeps a grouped filter menu model in the demo config', () => {
    expect(demoShellJs).toContain("id: 'status'");
    expect(demoShellJs).toContain("id: 'region'");
    expect(demoShellJs).toContain("id: 'priority'");
    expect(demoShellJs).toContain('multi: true');
    expect(demoShellJs).toContain('onFilter: function (payload)');
    expect(demoShellJs).toContain('filteredRecords()');
    expect(demoFilterJs).toContain('legacy-filter-board');
    expect(demoFilterJs).toContain('Save as default');
    expect(demoShellJs).toContain('mn-header-shell-defaults');
  });

  it('keeps the demo header-only while preserving route discoverability', () => {
    expect(demoShellJs).not.toContain('M.createLayout');
    expect(demoShellJs).not.toContain('layout.register');
    expect(demoShellJs).not.toContain('layout.showView');
    expect(demoShellJs).toContain('headerHost.whenReady');
    expect(demoHtml).not.toContain('id="mn-grid"');
    expect(demoHtml).not.toContain('data-width="640"');
    expect(demoHtml).not.toContain('mn-shell-demo__qa');
    expect(rootHtml).toContain('demo/header-responsive.html');
  });
});
