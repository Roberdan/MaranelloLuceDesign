import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const CKB_PATH = join(ROOT, 'packages/elements/dist/knowledge/ckb.json');
const SCHEMA_PATH = join(ROOT, 'packages/elements/src/knowledge/ckb-schema.json');
const WC_DIR = join(ROOT, 'packages/elements/src/wc');

function loadCkb() {
  if (!existsSync(CKB_PATH)) {
    throw new Error('CKB not found — run "node scripts/generate-ckb.mjs" first');
  }
  return JSON.parse(readFileSync(CKB_PATH, 'utf8'));
}

describe('Component Knowledge Base (CKB)', () => {
  const ckb = loadCkb();

  describe('structure', () => {
    it('has required top-level fields', () => {
      expect(ckb).toHaveProperty('version');
      expect(ckb).toHaveProperty('generated');
      expect(ckb).toHaveProperty('packageVersion');
      expect(ckb).toHaveProperty('webComponents');
      expect(ckb).toHaveProperty('tsModules');
      expect(ckb).toHaveProperty('compositionRules');
      expect(ckb).toHaveProperty('mappingHints');
      expect(ckb).toHaveProperty('themes');
      expect(ckb).toHaveProperty('constraints');
    });

    it('generated timestamp is valid ISO date', () => {
      expect(new Date(ckb.generated).toISOString()).toBe(ckb.generated);
    });
  });

  describe('web components', () => {
    it('covers at least 31 web components', () => {
      expect(ckb.webComponents.length).toBeGreaterThanOrEqual(31);
    });

    it('all WC tags start with mn-', () => {
      for (const wc of ckb.webComponents) {
        expect(wc.tag).toMatch(/^mn-/);
      }
    });

    it('every source WC file is covered', () => {
      const wcFiles = readdirSync(WC_DIR)
        .filter(f => f.startsWith('mn-') && f.endsWith('.js') && f !== 'mn-a11y-fallback.js')
        .map(f => f.replace('.js', ''));
      const coveredTags = new Set(ckb.webComponents.map(w => w.tag));
      const missing = wcFiles.filter(tag => !coveredTags.has(tag));
      expect(missing).toEqual([]);
    });

    it('does not include stale mn-login', () => {
      const tags = ckb.webComponents.map(w => w.tag);
      expect(tags).not.toContain('mn-login');
    });

    it('does not include helper files like mn-a11y-fallback', () => {
      const tags = ckb.webComponents.map(w => w.tag);
      expect(tags).not.toContain('mn-a11y-fallback');
    });

    it('each WC has required fields', () => {
      for (const wc of ckb.webComponents) {
        expect(wc).toHaveProperty('tag');
        expect(wc).toHaveProperty('sourceFile');
        expect(wc).toHaveProperty('description');
        expect(wc).toHaveProperty('attributes');
        expect(wc).toHaveProperty('events');
        expect(wc).toHaveProperty('importPath');
        expect(typeof wc.ssrSafe).toBe('boolean');
        expect(typeof wc.themeAware).toBe('boolean');
      }
    });

    it('importPath follows @convergio/design-elements/wc/<tag> pattern', () => {
      for (const wc of ckb.webComponents) {
        expect(wc.importPath).toBe(`@convergio/design-elements/wc/${wc.tag}`);
      }
    });

    it('key WCs have bestFor metadata', () => {
      const keyed = ['mn-gauge', 'mn-data-table', 'mn-chart', 'mn-chat', 'mn-gantt', 'mn-header-shell'];
      for (const tag of keyed) {
        const wc = ckb.webComponents.find(w => w.tag === tag);
        expect(wc, `${tag} should exist`).toBeDefined();
        expect(wc.bestFor.length, `${tag} should have bestFor`).toBeGreaterThan(0);
      }
    });
  });

  describe('TypeScript modules', () => {
    it('has at least 50 TS modules', () => {
      expect(Object.keys(ckb.tsModules).length).toBeGreaterThanOrEqual(50);
    });

    it('each module has sourceFile and exports', () => {
      for (const [name, mod] of Object.entries(ckb.tsModules)) {
        expect(mod, `${name} should have sourceFile`).toHaveProperty('sourceFile');
        expect(mod, `${name} should have exports`).toHaveProperty('exports');
      }
    });
  });

  describe('composition rules', () => {
    it('has at least 10 composition rules', () => {
      expect(ckb.compositionRules.length).toBeGreaterThanOrEqual(10);
    });

    it('each rule has required fields', () => {
      for (const rule of ckb.compositionRules) {
        expect(rule).toHaveProperty('id');
        expect(rule).toHaveProperty('pattern');
        expect(rule).toHaveProperty('components');
        expect(rule.components.length).toBeGreaterThan(0);
      }
    });

    it('includes key patterns', () => {
      const ids = ckb.compositionRules.map(r => r.id);
      expect(ids).toContain('filterable-table');
      expect(ids).toContain('kpi-dashboard');
      expect(ids).toContain('ai-chat');
      expect(ids).toContain('app-shell');
    });
  });

  describe('mapping hints', () => {
    it('has at least 8 mapping hints', () => {
      expect(ckb.mappingHints.length).toBeGreaterThanOrEqual(8);
    });

    it('each hint has required fields', () => {
      for (const hint of ckb.mappingHints) {
        expect(hint).toHaveProperty('id');
        expect(hint).toHaveProperty('apiPattern');
        expect(hint).toHaveProperty('suggestedComponent');
      }
    });

    it('covers key API patterns', () => {
      const ids = ckb.mappingHints.map(h => h.id);
      expect(ids).toContain('list-to-table');
      expect(ids).toContain('streaming-chat');
      expect(ids).toContain('health-check');
      expect(ids).toContain('numeric-kpis');
    });
  });

  describe('workflow templates', () => {
    it('has workflowTemplates array', () => {
      expect(ckb).toHaveProperty('workflowTemplates');
      expect(Array.isArray(ckb.workflowTemplates)).toBe(true);
    });

    it('has at least 8 workflow templates', () => {
      expect(ckb.workflowTemplates.length).toBeGreaterThanOrEqual(8);
    });

    it('each template has required fields', () => {
      for (const wf of ckb.workflowTemplates) {
        expect(wf).toHaveProperty('workflow');
        expect(wf).toHaveProperty('label');
        expect(wf).toHaveProperty('description');
        expect(wf).toHaveProperty('components');
        expect(wf.components.length).toBeGreaterThan(0);
        expect(wf).toHaveProperty('tags');
        expect(wf.tags.length).toBeGreaterThan(0);
      }
    });

    it('includes key workflows', () => {
      const ids = ckb.workflowTemplates.map(w => w.workflow);
      expect(ids).toContain('crm-dashboard');
      expect(ids).toContain('data-browser');
      expect(ids).toContain('app-shell');
      expect(ids).toContain('ai-chat-interface');
    });

    it('component refs have id and role', () => {
      for (const wf of ckb.workflowTemplates) {
        for (const comp of wf.components) {
          expect(typeof comp.id).toBe('string');
          expect(typeof comp.role).toBe('string');
        }
      }
    });
  });

  describe('themes', () => {
    it('has exactly 6 themes', () => {
      expect(ckb.themes).toHaveLength(6);
    });

    it('includes all theme IDs', () => {
      const ids = ckb.themes.map(t => t.id);
      expect(ids).toContain('editorial');
      expect(ids).toContain('nero');
      expect(ids).toContain('avorio');
      expect(ids).toContain('colorblind');
      expect(ids).toContain('sugar');
      expect(ids).toContain('navy');
    });
  });

  describe('constraints', () => {
    it('has safari constraints', () => {
      expect(ckb.constraints.safari.length).toBeGreaterThan(0);
    });

    it('mentions structuredClone ban', () => {
      expect(ckb.constraints.safari.some(s => s.includes('structuredClone'))).toBe(true);
    });

    it('has WCAG requirement', () => {
      expect(ckb.constraints.wcag).toContain('WCAG');
    });

    it('has token rules', () => {
      expect(ckb.constraints.tokens).toContain('semantic');
    });

    it('max file lines is 250', () => {
      expect(ckb.constraints.maxFileLines).toBe(250);
    });
  });

  describe('schema file exists', () => {
    it('ckb-schema.json is present', () => {
      expect(existsSync(SCHEMA_PATH)).toBe(true);
    });
  });
});
