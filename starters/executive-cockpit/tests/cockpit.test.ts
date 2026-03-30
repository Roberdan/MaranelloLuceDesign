import { describe, expect, it } from 'vitest';
import { createCockpitConfig } from '../src/index';

describe('createCockpitConfig', () => {
  it('returns a config with required hero KPIs', () => {
    const config = createCockpitConfig();
    expect(config.heroKpis).toBeDefined();
    expect(config.heroKpis.length).toBeGreaterThan(0);
  });

  it('hero KPIs have required id, label, and value fields', () => {
    const config = createCockpitConfig();
    for (const kpi of config.heroKpis) {
      expect(kpi.id).toBeTruthy();
      expect(kpi.label).toBeTruthy();
      expect(kpi.value).toBeTruthy();
    }
  });

  it('includes revenue KPI with upward trend', () => {
    const config = createCockpitConfig();
    const revenue = config.heroKpis.find((k) => k.id === 'revenue');
    expect(revenue).toBeDefined();
    expect(revenue?.trend).toBe('up');
    expect(revenue?.unit).toBe('USD');
  });

  it('returns a narrative hero with headline and summary', () => {
    const config = createCockpitConfig();
    expect(config.narrativeHero).toBeDefined();
    expect(config.narrativeHero?.headline).toBeTruthy();
    expect(config.narrativeHero?.summary.length).toBeGreaterThan(50);
  });

  it('returns board summaries with columns and row count', () => {
    const config = createCockpitConfig();
    expect(config.boardSummaries).toBeDefined();
    expect(config.boardSummaries?.length).toBeGreaterThan(0);
    for (const board of config.boardSummaries ?? []) {
      expect(board.id).toBeTruthy();
      expect(board.title).toBeTruthy();
      expect(board.columns.length).toBeGreaterThan(0);
      expect(board.rows).toBeGreaterThan(0);
    }
  });

  it('returns drill-down paths mapped to KPI ids', () => {
    const config = createCockpitConfig();
    expect(config.drillDownPaths).toBeDefined();
    expect(config.drillDownPaths?.['revenue']).toBe('/revenue');
    expect(config.drillDownPaths?.['headcount']).toBe('/people');
  });

  it('extends SharedShellConfig with required shell fields', () => {
    const config = createCockpitConfig();
    expect(config.appName).toBe('Executive Cockpit');
    expect(config.themes).toContain('editorial');
    expect(config.header.brandLabel).toBe('Convergio');
  });

  it('includes CEO/CFO nav items: Overview, Revenue, Operations, Portfolio, People', () => {
    const config = createCockpitConfig();
    const navIds = config.navigation.flatMap((s) => s.items.map((i) => i.id));
    expect(navIds).toContain('overview');
    expect(navIds).toContain('revenue');
    expect(navIds).toContain('operations');
    expect(navIds).toContain('portfolio');
    expect(navIds).toContain('people');
  });

  it('merges overrides into the base config', () => {
    const config = createCockpitConfig({ appName: 'CFO Dashboard' });
    expect(config.appName).toBe('CFO Dashboard');
    expect(config.heroKpis.length).toBeGreaterThan(0);
  });

  it('allows overriding hero KPIs while preserving other defaults', () => {
    const customKpis = [
      { id: 'capex', label: 'CapEx YTD', value: '$310M', trend: 'down' as const, unit: 'USD' },
    ];
    const config = createCockpitConfig({ heroKpis: customKpis });
    expect(config.heroKpis).toHaveLength(1);
    expect(config.heroKpis[0].id).toBe('capex');
    expect(config.narrativeHero).toBeDefined();
  });
});
