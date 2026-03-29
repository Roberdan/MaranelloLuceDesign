export type ShellSlotName =
  | 'nav'
  | 'toolbar'
  | 'filterBar'
  | 'executiveStrip'
  | 'main'
  | 'secondary'
  | 'detail'
  | 'bottom'
  | 'agent';

export interface ShellAction {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  tone?: 'default' | 'accent' | 'danger';
}

export interface ShellPanelTab {
  id: string;
  label: string;
}

export interface ShellPanelConfig {
  title: string;
  description?: string;
  tabs?: ShellPanelTab[];
}

export interface ShellFeatureFlags {
  agentPanel?: boolean;
  detailPanel?: boolean;
  executiveStrip?: boolean;
  commandPalette?: boolean;
}

export interface ShellConfig {
  id: string;
  title: string;
  subtitle?: string;
  mode: 'workspace' | 'dashboard' | 'cockpit' | 'program-management';
  defaultTheme: 'editorial' | 'nero' | 'avorio' | 'colorblind' | 'sugar' | 'navy';
  toolbarActions: ShellAction[];
  quickActions?: ShellAction[];
  panel?: ShellPanelConfig;
  featureFlags: ShellFeatureFlags;
}

export function createShellConfig(config: ShellConfig): ShellConfig {
  return Object.freeze({
    ...config,
    toolbarActions: config.toolbarActions.slice(),
    quickActions: (config.quickActions || []).slice(),
    panel: config.panel
      ? { ...config.panel, tabs: config.panel.tabs ? config.panel.tabs.slice() : undefined }
      : undefined,
    featureFlags: { ...config.featureFlags },
  });
}
