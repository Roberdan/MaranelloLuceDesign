import { describe, expect, it } from 'vitest';

import {
  createWorkspaceConfig,
  type WorkspaceConfig,
} from '../src/index';

describe('createWorkspaceConfig', () => {
  describe('default config shape', () => {
    it('returns a config with the expected app identity', () => {
      const config = createWorkspaceConfig();
      expect(config.appName).toBe('Convergio Workspace');
      expect(config.appDescription).toContain('SaaS workspace');
      expect(config.currentPath).toBe('/dashboard');
    });

    it('includes all six supported themes', () => {
      const config = createWorkspaceConfig();
      expect(config.themes).toContain('editorial');
      expect(config.themes).toContain('avorio');
      expect(config.themes).toContain('navy');
      expect(config.themes).toContain('sugar');
      expect(config.themes).toContain('colorblind');
      expect(config.themes).toContain('dim');
      expect(config.themes).toHaveLength(6);
    });

    it('provides a header with brand, product, primary actions, and search', () => {
      const config = createWorkspaceConfig();
      const { header } = config;
      expect(header.brandLabel).toBe('Convergio');
      expect(header.productLabel).toBe('Workspace');
      expect(header.homeHref).toBe('/');
      expect(header.primaryActions.length).toBeGreaterThanOrEqual(2);
      expect(header.searchPlaceholder).toBeTruthy();
    });

    it('has utility actions for notifications and help', () => {
      const config = createWorkspaceConfig();
      const ids = (config.header.utilityActions ?? []).map((a) => a.id);
      expect(ids).toContain('notifications');
      expect(ids).toContain('help');
    });
  });

  describe('navigation sections', () => {
    it('includes a core section with Dashboard and Projects', () => {
      const config = createWorkspaceConfig();
      const core = config.navigation.find((s) => s.id === 'core');
      expect(core).toBeDefined();
      const itemIds = (core?.items ?? []).map((i) => i.id);
      expect(itemIds).toContain('dashboard');
      expect(itemIds).toContain('projects');
    });

    it('includes a delivery section with Tasks and Analytics', () => {
      const config = createWorkspaceConfig();
      const delivery = config.navigation.find((s) => s.id === 'delivery');
      expect(delivery).toBeDefined();
      const itemIds = (delivery?.items ?? []).map((i) => i.id);
      expect(itemIds).toContain('tasks');
      expect(itemIds).toContain('analytics');
    });

    it('includes an admin section with Settings', () => {
      const config = createWorkspaceConfig();
      const admin = config.navigation.find((s) => s.id === 'admin');
      expect(admin).toBeDefined();
      const itemIds = (admin?.items ?? []).map((i) => i.id);
      expect(itemIds).toContain('settings');
    });

    it('has at least three navigation sections', () => {
      const config = createWorkspaceConfig();
      expect(config.navigation.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('project entries', () => {
    it('includes at least one project entry', () => {
      const config = createWorkspaceConfig();
      expect(config.projects.length).toBeGreaterThanOrEqual(1);
    });

    it('each project has a non-empty id and label', () => {
      const config = createWorkspaceConfig();
      for (const project of config.projects) {
        expect(project.id.length).toBeGreaterThan(0);
        expect(project.label.length).toBeGreaterThan(0);
      }
    });

    it('project labels do not use placeholder names', () => {
      const config = createWorkspaceConfig();
      const labels = config.projects.map((p) => p.label.toLowerCase());
      for (const label of labels) {
        expect(label).not.toContain('test');
        expect(label).not.toContain('studio a');
        expect(label).not.toContain('studio b');
      }
    });
  });

  describe('command palette', () => {
    it('provides a placeholder string', () => {
      const config = createWorkspaceConfig();
      expect(config.commandPalette.placeholder.length).toBeGreaterThan(0);
    });

    it('provides a hotkey string', () => {
      const config = createWorkspaceConfig();
      expect(config.commandPalette.hotkey.length).toBeGreaterThan(0);
    });

    it('default hotkey is cmd+k', () => {
      const config = createWorkspaceConfig();
      expect(config.commandPalette.hotkey).toBe('cmd+k');
    });
  });

  describe('optional sections', () => {
    it('has an activity feed with an endpoint by default', () => {
      const config = createWorkspaceConfig();
      expect(config.activityFeed).toBeDefined();
      expect(config.activityFeed?.endpoint).toBeTruthy();
    });

    it('has task context configured to show in detail panel by default', () => {
      const config = createWorkspaceConfig();
      expect(config.taskContext).toBeDefined();
      expect(config.taskContext?.showInDetailPanel).toBe(true);
    });

    it('has a detail panel with title and body', () => {
      const config = createWorkspaceConfig();
      expect(config.detailPanel).toBeDefined();
      expect(config.detailPanel?.title.length).toBeGreaterThan(0);
      expect(config.detailPanel?.body.length).toBeGreaterThan(0);
    });
  });

  describe('override merging', () => {
    it('merges a custom appName while preserving other defaults', () => {
      const config = createWorkspaceConfig({ appName: 'Acme Workspace' });
      expect(config.appName).toBe('Acme Workspace');
      expect(config.projects.length).toBeGreaterThanOrEqual(1);
      expect(config.commandPalette.hotkey).toBe('cmd+k');
    });

    it('replaces projects array when overridden', () => {
      const customProjects = [
        { id: 'enterprise-hub', label: 'Enterprise Hub', icon: 'building' },
      ];
      const config = createWorkspaceConfig({ projects: customProjects });
      expect(config.projects).toHaveLength(1);
      expect(config.projects[0].id).toBe('enterprise-hub');
    });

    it('replaces command palette when overridden', () => {
      const config = createWorkspaceConfig({
        commandPalette: { placeholder: 'Find anything', hotkey: 'ctrl+space' },
      });
      expect(config.commandPalette.hotkey).toBe('ctrl+space');
      expect(config.commandPalette.placeholder).toBe('Find anything');
    });

    it('allows disabling task context in detail panel via override', () => {
      const config = createWorkspaceConfig({
        taskContext: { showInDetailPanel: false },
      });
      expect(config.taskContext?.showInDetailPanel).toBe(false);
    });

    it('allows removing the activity feed via override', () => {
      const config = createWorkspaceConfig({ activityFeed: undefined });
      expect(config.activityFeed).toBeUndefined();
    });

    it('preserves type safety: WorkspaceConfig is assignable', () => {
      const config: WorkspaceConfig = createWorkspaceConfig();
      expect(config.appName).toBeDefined();
      expect(config.projects).toBeDefined();
    });
  });
});
