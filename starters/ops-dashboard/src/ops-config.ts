import type { SharedShellConfig } from '@convergio/shared-shell-starter';

export interface StripZoneConfig {
  type: 'gauge' | 'pipeline' | 'trend' | 'board';
  label: string;
  dataEndpoint?: string;
}

export interface AlertConfig {
  endpoint: string;
  refreshInterval: number;
}

export interface StatusBoardConfig {
  columns: string[];
  swimlanes: string[];
}

export interface TimelineViewConfig {
  range: 'day' | 'week' | 'month';
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'daterange' | 'search';
}

export interface OpsDashboardConfig extends SharedShellConfig {
  dashboardStrip: StripZoneConfig[];
  alerts?: AlertConfig;
  statusBoard?: StatusBoardConfig;
  timelineView?: TimelineViewConfig;
  filters?: FilterConfig[];
}

const DEFAULT_STRIP_ZONES: StripZoneConfig[] = [
  { type: 'gauge', label: 'CPU Utilization', dataEndpoint: '/api/metrics/cpu' },
  { type: 'pipeline', label: 'CI/CD Pipeline', dataEndpoint: '/api/pipelines/status' },
  { type: 'trend', label: 'Error Rate (1h)', dataEndpoint: '/api/metrics/error-rate' },
  { type: 'board', label: 'Service Health', dataEndpoint: '/api/services/health' },
];

const DEFAULT_FILTERS: FilterConfig[] = [
  { id: 'environment', label: 'Environment', type: 'select' },
  { id: 'time-range', label: 'Time Range', type: 'daterange' },
  { id: 'service', label: 'Service', type: 'search' },
  { id: 'severity', label: 'Severity', type: 'select' },
];

const DEFAULT_STATUS_BOARD: StatusBoardConfig = {
  columns: ['Service', 'Status', 'Uptime', 'Last Incident', 'On-Call'],
  swimlanes: ['Production', 'Staging', 'DR'],
};

const DEFAULT_ALERT_CONFIG: AlertConfig = {
  endpoint: '/api/alerts',
  refreshInterval: 30000,
};

export function createOpsDashboardConfig(
  overrides: Partial<OpsDashboardConfig> = {},
): OpsDashboardConfig {
  const base: OpsDashboardConfig = {
    appName: 'IT Operations Center',
    appDescription: 'Real-time infrastructure and service monitoring',
    currentPath: '/overview',
    themes: ['nero', 'editorial', 'navy'],
    header: {
      brandLabel: 'Convergio',
      productLabel: 'Ops Center',
      homeHref: '/',
      primaryActions: [
        { id: 'new-incident', label: 'New Incident', href: '/incidents/new' },
        { id: 'runbook', label: 'Runbook', href: '/runbooks' },
      ],
      searchPlaceholder: 'Search services, incidents, alerts',
    },
    navigation: [
      {
        id: 'monitoring',
        label: 'Monitoring',
        items: [
          { id: 'overview', label: 'Overview', href: '/overview' },
          { id: 'incidents', label: 'Incidents', href: '/incidents' },
          { id: 'deployments', label: 'Deployments', href: '/deployments' },
        ],
      },
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        items: [
          { id: 'services', label: 'Services', href: '/services' },
          { id: 'nodes', label: 'Nodes', href: '/nodes' },
          { id: 'alerts', label: 'Alerts', href: '/alerts' },
        ],
      },
    ],
    content: {
      title: 'Operations Overview',
      eyebrow: 'Infrastructure health',
      body: '<section data-slot="primary">Dashboard strip and live metrics</section>',
    },
    dashboardStrip: DEFAULT_STRIP_ZONES,
    alerts: DEFAULT_ALERT_CONFIG,
    statusBoard: DEFAULT_STATUS_BOARD,
    timelineView: { range: 'day' },
    filters: DEFAULT_FILTERS,
  };

  const clone: OpsDashboardConfig = JSON.parse(JSON.stringify(base));
  return {
    ...clone,
    ...overrides,
    dashboardStrip: overrides.dashboardStrip ?? clone.dashboardStrip,
    filters: overrides.filters ?? clone.filters,
  };
}
