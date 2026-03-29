import { createShellConfig } from '@convergio/starter-shared-shell';

export const shellConfig = createShellConfig({
  id: 'template-executive-cockpit',
  title: 'Executive Cockpit',
  subtitle: 'Decision-oriented portfolio view',
  mode: 'cockpit',
  defaultTheme: 'editorial',
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
    title: 'Leadership cockpit',
    description: 'High-signal overview, portfolio health, and narrative drill-down surfaces.',
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
