/**
 * Build verification tests.
 * Checks that dist/ outputs exist, meet size limits, and contain no domain-specific tokens.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, statSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { Window } from 'happy-dom';

const DIST = join(import.meta.dirname, '../../dist');
const ROOT = join(import.meta.dirname, '../..');
const cjsRequire = createRequire(import.meta.url);
const DIST_CJS = join(DIST, 'cjs');

type DomGlobals = {
  window?: Window;
  document?: Document;
  customElements?: CustomElementRegistry;
  HTMLElement?: typeof HTMLElement;
  CustomEvent?: typeof CustomEvent;
  Node?: typeof Node;
  MutationObserver?: typeof MutationObserver;
  getComputedStyle?: typeof getComputedStyle;
  requestAnimationFrame?: typeof requestAnimationFrame;
  cancelAnimationFrame?: typeof cancelAnimationFrame;
};

async function withHappyDom<T>(run: () => T | Promise<T>): Promise<T> {
  const globalScope = globalThis as typeof globalThis & DomGlobals;
  const previous: DomGlobals = {
    window: globalScope.window,
    document: globalScope.document,
    customElements: globalScope.customElements,
    HTMLElement: globalScope.HTMLElement,
    CustomEvent: globalScope.CustomEvent,
    Node: globalScope.Node,
    MutationObserver: globalScope.MutationObserver,
    getComputedStyle: globalScope.getComputedStyle,
    requestAnimationFrame: globalScope.requestAnimationFrame,
    cancelAnimationFrame: globalScope.cancelAnimationFrame,
  };
  const window = new Window();
  globalScope.window = window;
  globalScope.document = window.document;
  globalScope.customElements = window.customElements;
  globalScope.HTMLElement = window.HTMLElement;
  globalScope.CustomEvent = window.CustomEvent;
  globalScope.Node = window.Node;
  globalScope.MutationObserver = window.MutationObserver;
  globalScope.getComputedStyle = window.getComputedStyle.bind(window);
  globalScope.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalScope.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  try {
    return await run();
  } finally {
    globalScope.window = previous.window;
    globalScope.document = previous.document;
    globalScope.customElements = previous.customElements;
    globalScope.HTMLElement = previous.HTMLElement;
    globalScope.CustomEvent = previous.CustomEvent;
    globalScope.Node = previous.Node;
    globalScope.MutationObserver = previous.MutationObserver;
    globalScope.getComputedStyle = previous.getComputedStyle;
    globalScope.requestAnimationFrame = previous.requestAnimationFrame;
    globalScope.cancelAnimationFrame = previous.cancelAnimationFrame;
  }
}

function clearCjsDistRequireCache() {
  Object.keys(cjsRequire.cache).forEach((key) => {
    if (key.startsWith(DIST_CJS)) delete cjsRequire.cache[key];
  });
}

// Domain-specific strings that must NOT appear in published dist
const FORBIDDEN_TOKENS = [
  'VirtualBPM',
  'convergio',
  'ca-virtualbpm',
  'livelymoss',
  'roberdan',
  'virtualbpm.azurewebsites.net',
  'dashboard.db',
];

describe('dist output files exist', () => {
  it('ESM bundle exists', () => {
    expect(existsSync(join(DIST, 'esm/index.js'))).toBe(true);
  });

  it('CJS bundle exists', () => {
    expect(existsSync(join(DIST, 'cjs/index.cjs'))).toBe(true);
  });

  it('IIFE bundle exists', () => {
    expect(existsSync(join(DIST, 'iife/maranello.min.js'))).toBe(true);
  });

  it('TypeScript declaration file exists', () => {
    expect(existsSync(join(DIST, 'types/ts/index.d.ts'))).toBe(true);
  });
});

describe('IIFE bundle size', () => {
  const IIFE_MAX_BYTES = 450 * 1024; // 450 KB (v4.17.0 adds presentation runtime: AppShell, ViewRegistry, PanelOrchestrator, FacetWorkbench, EntityWorkbench, DashboardRenderer, AsyncSelect, StateScaffold, NavigationModel)

  it(`IIFE bundle is under ${IIFE_MAX_BYTES / 1024} KB`, () => {
    const path = join(DIST, 'iife/maranello.min.js');
    if (!existsSync(path)) return; // skip if not built
    const { size } = statSync(path);
    expect(size).toBeLessThan(IIFE_MAX_BYTES);
  });
});

describe('dist scrub check — no domain tokens', () => {
  const filesToCheck = [
    'iife/maranello.min.js',
    'esm/index.js',
    'cjs/index.cjs',
  ];

  for (const relPath of filesToCheck) {
    it(`${relPath} contains no project-specific identifiers`, () => {
      const fullPath = join(DIST, relPath);
      if (!existsSync(fullPath)) return; // skip if not built
      const content = readFileSync(fullPath, 'utf8');
      for (const token of FORBIDDEN_TOKENS) {
        expect(
          content,
          `Found forbidden token "${token}" in ${relPath}`,
        ).not.toContain(token);
      }
    });
  }
});

describe('sub-package bundles exist', () => {
  const subPkgs = ['charts', 'gantt', 'gauge', 'controls', 'forms'];

  for (const pkg of subPkgs) {
    it(`esm/${pkg}/index.js exists`, () => {
      const p = join(DIST, 'esm', pkg, 'index.js');
      if (!existsSync(join(DIST, 'esm', pkg))) return;
      expect(existsSync(p)).toBe(true);
    });

    it(`cjs/${pkg}/index.cjs exists`, () => {
      const p = join(DIST, 'cjs', pkg, 'index.cjs');
      if (!existsSync(join(DIST, 'cjs', pkg))) return;
      expect(existsSync(p)).toBe(true);
    });
  }
});

describe('dist/wc/ web components', () => {
  it('wc/ directory has 22+ files', () => {
    const wcDir = join(DIST, 'wc');
    if (!existsSync(wcDir)) return;
    const { readdirSync } = require('node:fs');
    const files = readdirSync(wcDir);
    expect(files.length).toBeGreaterThanOrEqual(22);
  });

  it('esm wc barrel and per-component module exist', () => {
    expect(existsSync(join(DIST, 'esm/wc/index.js'))).toBe(true);
    expect(existsSync(join(DIST, 'esm/wc/mn-header-shell.js'))).toBe(true);
  });

  it('cjs wc barrel and per-component module exist', () => {
    expect(existsSync(join(DIST, 'cjs/wc/index.cjs'))).toBe(true);
    expect(existsSync(join(DIST, 'cjs/wc/mn-header-shell.cjs'))).toBe(true);
  });

  it('wc type declarations exist for barrel and per-component import paths', () => {
    expect(existsSync(join(DIST, 'types/wc/index.d.ts'))).toBe(true);
    expect(existsSync(join(DIST, 'types/wc/mn-header-shell.d.ts'))).toBe(true);
  });

  it('rewrites local CJS WC requires to emitted .cjs files', () => {
    const headerShell = readFileSync(join(DIST, 'cjs/wc/mn-header-shell.cjs'), 'utf8');
    const a11y = readFileSync(join(DIST, 'cjs/wc/mn-a11y.cjs'), 'utf8');
    const appShell = readFileSync(join(DIST, 'cjs/wc/mn-app-shell.cjs'), 'utf8');
    const barrel = readFileSync(join(DIST, 'cjs/wc/index.cjs'), 'utf8');
    expect(headerShell).toContain('require("./mn-theme-toggle.cjs")');
    expect(headerShell).not.toContain('require("./mn-theme-toggle.js")');
    expect(headerShell).toContain('import("../index.cjs")');
    expect(headerShell).not.toContain('import("../ts/header-shell.js")');
    expect(a11y).toContain('require("./mn-a11y-fallback.cjs")');
    expect(a11y).not.toContain('require("./mn-a11y-fallback.js")');
    expect(appShell).toContain('require("../index.cjs")');
    expect(appShell).not.toContain('require("../ts/app-shell.js")');
    expect(barrel).toContain('import("./mn-header-shell.cjs")');
    expect(barrel).not.toMatch(/import\("\.\/mn-[^"]+\.js"\)/);
  });

  it('initializes import.meta.url from __filename in emitted CJS WC modules', () => {
    const toast = readFileSync(join(DIST, 'cjs/wc/mn-toast.cjs'), 'utf8');
    expect(toast).toContain('pathToFileURL(__filename).href');
    expect(toast).toContain('new URL(".", import_meta.url)');
  });

  it('does not ship stale sourcemaps for post-processed CJS WC modules', () => {
    expect(existsSync(join(DIST, 'cjs/wc/index.cjs.map'))).toBe(false);
    expect(existsSync(join(DIST, 'cjs/wc/mn-header-shell.cjs.map'))).toBe(false);
  });

  it('loads emitted CJS WC modules under a DOM runtime', async () => {
    await withHappyDom(() => {
      clearCjsDistRequireCache();
      expect(() => cjsRequire(join(DIST, 'cjs/wc/mn-header-shell.cjs'))).not.toThrow();
      expect(() => cjsRequire(join(DIST, 'cjs/wc/mn-toast.cjs'))).not.toThrow();
      expect(() => cjsRequire(join(DIST, 'cjs/wc/mn-a11y.cjs'))).not.toThrow();
    });
  });

  it('registers emitted CJS WC barrel modules under a DOM runtime', async () => {
    await withHappyDom(async () => {
      clearCjsDistRequireCache();
      const barrel = cjsRequire(join(DIST, 'cjs/wc/index.cjs'));
      await barrel.registerAll();
      expect(barrel.isRegistered('mn-header-shell')).toBe(true);
      expect(barrel.isRegistered('mn-theme-toggle')).toBe(true);
      expect(barrel.isRegistered('mn-toast')).toBe(true);
    });
  });
});

describe('header shell responsive packaging', () => {
  it('keeps component CSS free of inline responsive media blocks', () => {
    const content = readFileSync(join(ROOT, 'src/css/components-header-shell.css'), 'utf8');
    expect(content).not.toContain('@media');
  });

  it('imports responsive-header-shell.css from both CSS entrypoints', () => {
    const indexCss = readFileSync(join(ROOT, 'src/css/index.css'), 'utf8');
    const maranelloCss = readFileSync(join(ROOT, 'src/css/maranello.css'), 'utf8');
    expect(indexCss).toContain("responsive-header-shell.css");
    expect(maranelloCss).toContain("responsive-header-shell.css");
  });
});

describe('TypeScript declarations', () => {
  it('declaration file exports VERSION', () => {
    const path = join(DIST, 'types/ts/index.d.ts');
    if (!existsSync(path)) return;
    const content = readFileSync(path, 'utf8');
    expect(content).toContain('VERSION');
  });

  it('declaration file exports EventBus', () => {
    const path = join(DIST, 'types/ts/index.d.ts');
    if (!existsSync(path)) return;
    const content = readFileSync(path, 'utf8');
    expect(content).toContain('EventBus');
  });

  it('declaration file exports cssVar utility', () => {
    const path = join(DIST, 'types/ts/index.d.ts');
    if (!existsSync(path)) return;
    const content = readFileSync(path, 'utf8');
    expect(content).toContain('cssVar');
  });
});
