import { createShellConfig } from '@convergio/starter-shared-shell';

export const shellConfig = createShellConfig({
  id: 'template-ops-dashboard',
  title: 'Ops Dashboard',
  subtitle: 'Signals, telemetry, and incident flow',
  mode: 'dashboard',
  defaultTheme: 'navy',
  toolbarActions: [
    { id: 'search', label: 'Search' },
    { id: 'command', label: 'Command' },
    { id: 'profile', label: 'Profile' },
  ],
  quickActions: [
    { id: 'refresh', label: 'Refresh' },
    { id: 'export', label: 'Export' },
  ],
  panel: {
    title: 'Operational command center',
    description: 'Alerts, SLOs, deployments, and intervention context with a dense command surface.',
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'activity', label: 'Activity' },
      { id: 'impact', label: 'Impact' },
    ],
  },
  featureFlags: {
    agentPanel: true,
    detailPanel: true,
    executiveStrip: true,
    commandPalette: true,
  },
});
