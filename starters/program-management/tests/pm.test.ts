/**
 * Program management starter tests.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';

import {
  createProgramManagementConfig,
  type ProgramManagementConfig,
} from '../src/index';

describe('createProgramManagementConfig', () => {
  it('returns a valid config with required top-level fields', () => {
    const config = createProgramManagementConfig();

    expect(config.appName).toBe('Program Management Office');
    expect(config.appDescription).toContain('PMO');
    expect(config.currentPath).toBe('/portfolio');
    expect(Array.isArray(config.themes)).toBe(true);
    expect(config.themes.length).toBeGreaterThanOrEqual(3);
  });

  it('returns a command rail with at least navigate, filter, create, and command actions', () => {
    const config = createProgramManagementConfig();
    const actions = config.commandRail.map((item) => item.action);

    expect(actions).toContain('navigate');
    expect(actions).toContain('filter');
    expect(actions).toContain('create');
    expect(actions).toContain('command');

    for (const item of config.commandRail) {
      expect(typeof item.id).toBe('string');
      expect(typeof item.label).toBe('string');
      expect(['navigate', 'filter', 'create', 'command']).toContain(item.action);
    }
  });

  it('returns a KPI strip with realistic PMO metrics and valid formats', () => {
    const config = createProgramManagementConfig();

    expect(config.kpiStrip.length).toBeGreaterThanOrEqual(4);

    const formats = config.kpiStrip
      .filter((k) => k.format !== undefined)
      .map((k) => k.format);

    expect(formats).toContain('number');
    expect(formats).toContain('currency');
    expect(formats).toContain('percent');

    const labels = config.kpiStrip.map((k) => k.label);
    expect(labels.some((l) => l.toLowerCase().includes('program') || l.toLowerCase().includes('track'))).toBe(true);
  });

  it('returns a portfolio list with sortable columns covering name, status, and dates', () => {
    const config = createProgramManagementConfig();
    const fields = config.portfolioList.columns.map((c) => c.field);

    expect(fields).toContain('name');
    expect(fields).toContain('status');
    expect(fields).toContain('startDate');
    expect(fields).toContain('endDate');

    const sortable = config.portfolioList.columns.filter((c) => c.sortable);
    expect(sortable.length).toBeGreaterThanOrEqual(3);
  });

  it('returns a gantt-mode timeline board with a valid date range', () => {
    const config = createProgramManagementConfig();

    expect(config.timelineBoard).toBeDefined();
    expect(config.timelineBoard?.viewMode).toBe('gantt');
    expect(config.timelineBoard?.dateRange?.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(config.timelineBoard?.dateRange?.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns entity detail tabs including overview, milestones, risks, and team', () => {
    const config = createProgramManagementConfig();
    const tabIds = config.entityDetail.tabs.map((t) => t.id);

    expect(tabIds).toContain('overview');
    expect(tabIds).toContain('milestones');
    expect(tabIds).toContain('risks');
    expect(tabIds).toContain('team');
    expect(config.entityDetail.defaultTab).toBe('overview');
  });

  it('returns standard SharedShell navigation with Portfolio, Programs, Projects, Resources, Reports', () => {
    const config = createProgramManagementConfig();
    const allNavItems = config.navigation.flatMap((section) => section.items);
    const navLabels = allNavItems.map((item) => item.label);

    expect(navLabels).toContain('Portfolio');
    expect(navLabels).toContain('Programs');
    expect(navLabels).toContain('Projects');
    expect(navLabels).toContain('Resources');
    expect(navLabels).toContain('Reports');
  });

  it('merges overrides while preserving base values for unspecified fields', () => {
    const overrides: Partial<ProgramManagementConfig> = {
      appName: 'Acme PMO',
      currentPath: '/programs',
      timelineBoard: {
        viewMode: 'kanban',
      },
    };

    const config = createProgramManagementConfig(overrides);

    expect(config.appName).toBe('Acme PMO');
    expect(config.currentPath).toBe('/programs');
    expect(config.timelineBoard?.viewMode).toBe('kanban');

    // Base fields preserved
    expect(config.commandRail.length).toBeGreaterThan(0);
    expect(config.kpiStrip.length).toBeGreaterThan(0);
    expect(config.portfolioList.columns.length).toBeGreaterThan(0);
    expect(config.entityDetail.tabs.length).toBeGreaterThan(0);
  });

  it('accepts realistic program names in overrides without type errors', () => {
    const config = createProgramManagementConfig({
      appName: 'Platform Migration Q2',
      appDescription: 'Cloud Infrastructure Modernization initiative tracker',
    });

    expect(config.appName).toBe('Platform Migration Q2');
    expect(config.appDescription).toContain('Cloud Infrastructure Modernization');
  });
});
