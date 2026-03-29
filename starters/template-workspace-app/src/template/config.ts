import { createShellConfig } from '@convergio/starter-shared-shell';

export const shellConfig = createShellConfig({
  id: 'template-workspace-app',
  title: 'Workspace App',
  subtitle: 'Operations-ready SaaS shell',
  mode: 'workspace',
  defaultTheme: 'nero',
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
    title: 'Team workspace',
    description: 'Project switcher, tasks, approvals, and a persistent activity panel.',
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
