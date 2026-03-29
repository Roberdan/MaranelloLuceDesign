import { createShellConfig } from '@convergio/starter-shared-shell';

export const shellConfig = createShellConfig({
  id: 'template-program-management',
  title: 'Program Management',
  subtitle: 'Virtual BPM-inspired delivery board',
  mode: 'program-management',
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
    title: 'Program delivery board',
    description: 'Portfolio list, timeline thinking, executive strip, and persistent entity context.',
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
