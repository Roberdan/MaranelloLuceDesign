import type { SharedShellConfig } from '@convergio/shared-shell-starter';

/**
 * A single project entry in the workspace project switcher.
 * Each project is an isolated delivery context (portfolio, program, or workstream).
 */
export interface ProjectEntry {
  id: string;
  label: string;
  icon?: string;
}

/**
 * Configuration for the command palette surface.
 * Drives both the UI placeholder and the keyboard shortcut that opens the palette.
 */
export interface CommandPaletteConfig {
  placeholder: string;
  hotkey: string;
}

/**
 * Optional activity feed configuration.
 * When provided, the workspace fetches and renders a live activity stream.
 */
export interface ActivityFeedConfig {
  endpoint: string;
}

/**
 * Controls how task context is surfaced in the detail panel.
 */
export interface TaskContextConfig {
  showInDetailPanel: boolean;
}

/**
 * Full workspace configuration extending the shared shell base.
 * Adds project switching, command palette, activity feed, and task context.
 */
export interface WorkspaceConfig extends SharedShellConfig {
  projects: ProjectEntry[];
  commandPalette: CommandPaletteConfig;
  activityFeed?: ActivityFeedConfig;
  taskContext?: TaskContextConfig;
}

const DEFAULT_PROJECTS: ProjectEntry[] = [
  { id: 'alpha-platform', label: 'Alpha Platform', icon: 'grid' },
  { id: 'client-portal', label: 'Client Portal', icon: 'browser' },
  { id: 'data-pipeline', label: 'Data Pipeline', icon: 'flow' },
];

const DEFAULT_COMMAND_PALETTE: CommandPaletteConfig = {
  placeholder: 'Search commands, projects, and work items...',
  hotkey: 'cmd+k',
};

const DEFAULT_CONFIG: WorkspaceConfig = {
  appName: 'Convergio Workspace',
  appDescription: 'General-purpose SaaS workspace with project switching and command surfaces',
  currentPath: '/dashboard',
  themes: ['editorial', 'avorio', 'navy', 'sugar', 'colorblind', 'dim'],
  header: {
    brandLabel: 'Convergio',
    productLabel: 'Workspace',
    homeHref: '/',
    primaryActions: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
      { id: 'command', label: 'Command', href: '/command', badge: 'K' },
    ],
    utilityActions: [
      { id: 'notifications', label: 'Notifications', href: '/notifications' },
      { id: 'help', label: 'Help', href: '/help' },
    ],
    searchPlaceholder: 'Search projects, tasks, and people',
  },
  navigation: [
    {
      id: 'core',
      label: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'home' },
        { id: 'projects', label: 'Projects', href: '/projects', icon: 'folder' },
      ],
    },
    {
      id: 'delivery',
      label: 'Delivery',
      items: [
        { id: 'tasks', label: 'Tasks', href: '/tasks', icon: 'check-square' },
        { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'bar-chart' },
      ],
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        { id: 'settings', label: 'Settings', href: '/settings', icon: 'sliders' },
      ],
    },
  ],
  content: {
    title: 'Workspace dashboard',
    eyebrow: 'Overview',
    body: '<section data-slot="primary">Active projects and recent activity</section>',
    supporting: '<section data-slot="supporting">Signals, trends, and AI recommendations</section>',
  },
  detailPanel: {
    title: 'Item details',
    description: 'Selected item details remain visible while navigating.',
    body: '<section data-slot="detail">Owner, dates, status, and related work</section>',
  },
  projects: DEFAULT_PROJECTS,
  commandPalette: DEFAULT_COMMAND_PALETTE,
  activityFeed: {
    endpoint: '/api/activity',
  },
  taskContext: {
    showInDetailPanel: true,
  },
};

/**
 * Factory that produces a WorkspaceConfig with sensible SaaS defaults.
 * Any field in overrides is merged shallowly over the default config.
 *
 * @param overrides - Partial config to merge into the defaults.
 * @returns A complete WorkspaceConfig ready for use.
 */
export function createWorkspaceConfig(overrides?: Partial<WorkspaceConfig>): WorkspaceConfig {
  const base: WorkspaceConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  if (overrides === undefined) {
    return base;
  }
  return { ...base, ...overrides };
}
