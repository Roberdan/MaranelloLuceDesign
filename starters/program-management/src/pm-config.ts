import type { SharedShellConfig } from '@convergio/shared-shell-starter';

export interface CommandRailItem {
  id: string;
  label: string;
  icon?: string;
  action: 'navigate' | 'filter' | 'create' | 'command';
}

export interface KpiStripEntry {
  id: string;
  label: string;
  value: string;
  format?: 'number' | 'currency' | 'percent';
}

export interface ColumnDef {
  id: string;
  label: string;
  field: string;
  width?: number;
  sortable?: boolean;
}

export interface PortfolioListConfig {
  columns: ColumnDef[];
  groupBy?: string;
  sortBy?: string;
}

export interface TimelineBoardConfig {
  viewMode: 'gantt' | 'kanban' | 'calendar';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TabDef {
  id: string;
  label: string;
}

export interface EntityDetailConfig {
  tabs: TabDef[];
  defaultTab: string;
}

export interface ProgramManagementConfig extends SharedShellConfig {
  commandRail: CommandRailItem[];
  kpiStrip: KpiStripEntry[];
  portfolioList: PortfolioListConfig;
  timelineBoard?: TimelineBoardConfig;
  entityDetail: EntityDetailConfig;
}

function buildDefaultBase(): ProgramManagementConfig {
  const shell: SharedShellConfig = {
    appName: 'Program Management Office',
    appDescription: 'Portfolio and program delivery tracking for enterprise PMO',
    currentPath: '/portfolio',
    themes: ['editorial', 'navy', 'avorio', 'sugar', 'colorblind', 'high-contrast'],
    header: {
      brandLabel: 'Convergio',
      productLabel: 'PMO',
      homeHref: '/portfolio',
      primaryActions: [
        { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
        { id: 'programs', label: 'Programs', href: '/programs' },
        { id: 'projects', label: 'Projects', href: '/projects' },
        { id: 'resources', label: 'Resources', href: '/resources' },
        { id: 'reports', label: 'Reports', href: '/reports' },
      ],
      searchPlaceholder: 'Search programs and projects',
      utilityActions: [
        { id: 'alerts', label: 'Alerts', href: '/alerts' },
        { id: 'settings', label: 'Settings', href: '/settings' },
      ],
    },
    navigation: [
      {
        id: 'delivery',
        label: 'Delivery',
        items: [
          { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
          { id: 'programs', label: 'Programs', href: '/programs' },
          { id: 'projects', label: 'Projects', href: '/projects' },
        ],
      },
      {
        id: 'planning',
        label: 'Planning',
        items: [
          { id: 'timeline', label: 'Timeline', href: '/timeline' },
          { id: 'resources', label: 'Resources', href: '/resources' },
          { id: 'capacity', label: 'Capacity', href: '/capacity' },
        ],
      },
      {
        id: 'insights',
        label: 'Insights',
        items: [
          { id: 'reports', label: 'Reports', href: '/reports' },
          { id: 'analytics', label: 'Analytics', href: '/analytics' },
        ],
      },
    ],
    content: {
      title: 'Portfolio overview',
      eyebrow: 'Program Management Office',
      body: '<section data-slot="primary">Portfolio and program content</section>',
      supporting: '<section data-slot="supporting">KPI strip and delivery signals</section>',
    },
    detailPanel: {
      title: 'Program details',
      description: 'Selected program details with milestones, risks, and team.',
      body: '<section data-slot="detail">Program entity detail with tabs</section>',
    },
  };

  const pmExtensions = {
    commandRail: [
      { id: 'all-programs', label: 'All Programs', action: 'navigate' as const },
      { id: 'filter-at-risk', label: 'At Risk', action: 'filter' as const },
      { id: 'filter-on-track', label: 'On Track', action: 'filter' as const },
      { id: 'new-program', label: 'New Program', action: 'create' as const },
      { id: 'ai-summary', label: 'AI Summary', action: 'command' as const },
    ],
    kpiStrip: [
      { id: 'active-programs', label: 'Active Programs', value: '24', format: 'number' as const },
      { id: 'on-track', label: 'On Track', value: '79', format: 'percent' as const },
      { id: 'at-risk', label: 'At Risk', value: '4', format: 'number' as const },
      { id: 'budget-consumed', label: 'Budget Consumed', value: '6200000', format: 'currency' as const },
      { id: 'open-risks', label: 'Open Risks', value: '17', format: 'number' as const },
      { id: 'velocity', label: 'Sprint Velocity', value: '142', format: 'number' as const },
    ],
    portfolioList: {
      columns: [
        { id: 'name', label: 'Program Name', field: 'name', sortable: true },
        { id: 'status', label: 'Status', field: 'status', width: 120, sortable: true },
        { id: 'owner', label: 'Owner', field: 'owner', width: 160 },
        { id: 'start', label: 'Start Date', field: 'startDate', width: 140, sortable: true },
        { id: 'end', label: 'Target End', field: 'endDate', width: 140, sortable: true },
        { id: 'budget', label: 'Budget', field: 'budget', width: 140, sortable: true },
        { id: 'completion', label: '% Complete', field: 'completion', width: 120, sortable: true },
      ],
      groupBy: 'status',
      sortBy: 'endDate',
    },
    timelineBoard: {
      viewMode: 'gantt' as const,
      dateRange: {
        start: '2025-01-01',
        end: '2025-12-31',
      },
    },
    entityDetail: {
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'milestones', label: 'Milestones' },
        { id: 'risks', label: 'Risks & Issues' },
        { id: 'team', label: 'Team' },
        { id: 'budget', label: 'Budget' },
        { id: 'documents', label: 'Documents' },
      ],
      defaultTab: 'overview',
    },
  };

  return { ...shell, ...pmExtensions };
}

export function createProgramManagementConfig(
  overrides?: Partial<ProgramManagementConfig>,
): ProgramManagementConfig {
  const base = buildDefaultBase();

  if (!overrides) {
    return base;
  }

  return { ...base, ...overrides };
}
