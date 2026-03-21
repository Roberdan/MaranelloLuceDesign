/**
 * Verify that index.css and maranello.css resolve to the same set of CSS files.
 * index.css uses direct imports; maranello.css uses barrel aggregators.
 * Both must include every leaf CSS file in src/css/.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const CSS_SRC = join(import.meta.dirname, '../../src/css');

/** Extract @import file references from a CSS file (non-recursive). */
function extractImports(filePath: string): string[] {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf8');
  const imports: string[] = [];
  const re = /@import\s+(?:url\(['"]?|['"])\.\/([^'")\s]+)['"]?\)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    imports.push(m[1]);
  }
  return imports;
}

/** Recursively resolve all leaf CSS files imported by an entrypoint. */
function resolveAllLeafFiles(entrypoint: string): Set<string> {
  const leaves = new Set<string>();
  const visited = new Set<string>();

  function walk(filePath: string): void {
    const normalized = resolve(filePath);
    if (visited.has(normalized)) return;
    visited.add(normalized);

    const imports = extractImports(normalized);
    if (imports.length === 0) {
      // Leaf file (no further imports) — add it
      const base = normalized.replace(resolve(CSS_SRC) + '/', '');
      leaves.add(base);
      return;
    }

    for (const imp of imports) {
      const resolved = join(CSS_SRC, imp);
      if (existsSync(resolved)) {
        const subImports = extractImports(resolved);
        if (subImports.length > 0) {
          // Barrel file — recurse into it
          walk(resolved);
        } else {
          // Leaf file
          leaves.add(imp);
        }
      }
    }
  }

  walk(entrypoint);
  return leaves;
}

describe('CSS entrypoint parity', () => {
  const indexPath = join(CSS_SRC, 'index.css');
  const maranelloPath = join(CSS_SRC, 'maranello.css');

  it('index.css exists', () => {
    expect(existsSync(indexPath)).toBe(true);
  });

  it('maranello.css exists', () => {
    expect(existsSync(maranelloPath)).toBe(true);
  });

  it('index.css includes all theme files from maranello.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const themeFiles = [
      'themes-base.css',
      'themes-avorio-components.css',
      'themes-colorblind-components.css',
      'themes-colorblind-layouts.css',
      'themes-sugar-components.css',
      'themes-sugar-colorblind.css',
    ];
    for (const f of themeFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('index.css includes all responsive files', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const responsiveFiles = [
      'responsive-tokens.css',
      'responsive-layouts.css',
      'responsive-data.css',
      'responsive-forms.css',
      'responsive-charts.css',
    ];
    for (const f of responsiveFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('index.css includes integration.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    expect(indexContent).toContain('integration.css');
  });

  it('index.css includes all layout files from maranello.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const layoutFiles = [
      'layouts-app-shell.css',
      'layouts-dashboard-renderer.css',
      'layouts-facet-workbench.css',
      'layouts-entity-workbench.css',
      'layouts-state-scaffold.css',
      'layouts-chat-fab.css',
      'layouts-data-table-v2.css',
      'layouts-detail-panel-extras.css',
      'layouts-convergio-toolbar.css',
      'layouts-mapbox.css',
      'layouts-mesh-mission.css',
      'layouts-widget.css',
      'layouts-grid-templates.css',
      'layouts-search-drawer.css',
      'layouts-notification-center.css',
      'layouts-decision-matrix.css',
      'layouts-nine-box-matrix.css',
      'layouts-approval-chain.css',
      'layouts-agent-trace.css',
      'layouts-audit-log.css',
      'layouts-customer-journey.css',
      'layouts-admin-shell.css',
      'layouts-settings-panel.css',
      'layouts-sim-panel-2.css',
    ];
    for (const f of layoutFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('index.css includes all component files from maranello.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const componentFiles = [
      'components-source-card.css',
      'components-swot-matrix.css',
      'components-token-meter.css',
      'components-streaming-text.css',
      'components-kpi-scorecard.css',
      'components-cohort-grid.css',
      'components-agent-cost.css',
      'components-business-model-canvas.css',
      'components-user-table.css',
      'components-section-card.css',
    ];
    for (const f of componentFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('index.css includes all pattern files from maranello.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const patternFiles = [
      'patterns-strip-dashboard.css',
      'patterns-activity-feed.css',
    ];
    for (const f of patternFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('index.css includes all form files from maranello.css', () => {
    const indexContent = readFileSync(indexPath, 'utf8');
    const formFiles = [
      'forms-fields-advanced.css',
      'forms-date-range.css',
      'forms-async-select.css',
    ];
    for (const f of formFiles) {
      expect(indexContent).toContain(f);
    }
  });

  it('every leaf file in maranello.css is also reachable from index.css', () => {
    const maranelloLeaves = resolveAllLeafFiles(maranelloPath);
    const indexLeaves = resolveAllLeafFiles(indexPath);

    const missing: string[] = [];
    for (const leaf of maranelloLeaves) {
      if (!indexLeaves.has(leaf)) {
        missing.push(leaf);
      }
    }

    expect(missing).toEqual([]);
  });
});
