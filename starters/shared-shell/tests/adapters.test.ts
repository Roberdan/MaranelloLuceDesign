import { describe, expect, it } from 'vitest';

import {
  hasPermission,
  type AIAdapter,
  type AuthAdapter,
  type RBACAdapter,
  type TelemetryAdapter,
  type APIAdapter,
  type FeatureFlagAdapter,
  type SharedShellAdapters,
} from '../src/adapters';

describe('adapter contracts', () => {
  describe('AIAdapter', () => {
    it('accepts a minimal AI adapter config', () => {
      const ai: AIAdapter = {
        routePath: '/api/ai/chat',
        model: 'claude-sonnet-4-6',
      };
      expect(ai.routePath).toBe('/api/ai/chat');
      expect(ai.model).toBe('claude-sonnet-4-6');
      expect(ai.actions).toBeUndefined();
    });

    it('accepts actions and system prompt', () => {
      const ai: AIAdapter = {
        routePath: '/api/ai/chat',
        model: 'claude-opus-4-6',
        actions: [{ id: 'summarize', label: 'Summarize', description: 'Summarize the view' }],
        systemPrompt: 'You are a workspace assistant.',
      };
      expect(ai.actions).toHaveLength(1);
      expect(ai.systemPrompt).toContain('workspace');
    });
  });

  describe('AuthAdapter', () => {
    it('defines provider, sign-in, sign-out, and session endpoint', () => {
      const auth: AuthAdapter = {
        provider: 'nextauth',
        signInPath: '/auth/signin',
        signOutPath: '/auth/signout',
        sessionEndpoint: '/api/auth/session',
      };
      expect(auth.provider).toBe('nextauth');
      expect(auth.sessionEndpoint).toBe('/api/auth/session');
    });
  });

  describe('RBACAdapter + hasPermission', () => {
    const rbac: RBACAdapter = {
      roles: ['viewer', 'editor', 'admin'],
      grants: {
        viewer: ['read'],
        editor: ['read', 'write'],
        admin: ['read', 'write', 'delete', 'manage'],
      },
      defaultRole: 'viewer',
    };

    it('grants permission when role includes it', () => {
      expect(hasPermission(rbac, 'admin', 'manage')).toBe(true);
      expect(hasPermission(rbac, 'editor', 'write')).toBe(true);
    });

    it('denies permission when role lacks it', () => {
      expect(hasPermission(rbac, 'viewer', 'write')).toBe(false);
      expect(hasPermission(rbac, 'editor', 'delete')).toBe(false);
    });

    it('denies permission for unknown role', () => {
      expect(hasPermission(rbac, 'ghost', 'read')).toBe(false);
    });
  });

  describe('TelemetryAdapter', () => {
    it('accepts a telemetry config with auto-events', () => {
      const telemetry: TelemetryAdapter = {
        provider: 'posthog',
        envKey: 'POSTHOG_API_KEY',
        autoEvents: ['page_view', 'nav_click', 'shell_init'],
      };
      expect(telemetry.autoEvents).toHaveLength(3);
      expect(telemetry.provider).toBe('posthog');
    });
  });

  describe('APIAdapter', () => {
    it('defines base URL env and endpoint catalog', () => {
      const api: APIAdapter = {
        baseUrlEnv: 'API_BASE_URL',
        endpoints: [
          { id: 'listProjects', method: 'GET', path: '/api/projects' },
          { id: 'createTask', method: 'POST', path: '/api/tasks' },
        ],
      };
      expect(api.endpoints).toHaveLength(2);
      expect(api.endpoints[0].method).toBe('GET');
    });
  });

  describe('FeatureFlagAdapter', () => {
    it('declares provider and defaults', () => {
      const flags: FeatureFlagAdapter = {
        provider: 'env',
        defaults: { aiPanel: true, darkMode: false },
      };
      expect(flags.defaults.aiPanel).toBe(true);
      expect(flags.defaults.darkMode).toBe(false);
    });
  });

  describe('SharedShellAdapters composite', () => {
    it('bundles all adapters into a single typed config', () => {
      const adapters: SharedShellAdapters = {
        ai: { routePath: '/api/ai/chat', model: 'claude-sonnet-4-6' },
        auth: {
          provider: 'clerk',
          signInPath: '/sign-in',
          signOutPath: '/sign-out',
          sessionEndpoint: '/api/session',
        },
        rbac: {
          roles: ['user', 'admin'],
          grants: { user: ['read'], admin: ['read', 'write'] },
          defaultRole: 'user',
        },
        telemetry: {
          provider: 'segment',
          envKey: 'SEGMENT_WRITE_KEY',
          autoEvents: ['page_view'],
        },
        api: {
          baseUrlEnv: 'BACKEND_URL',
          endpoints: [{ id: 'health', method: 'GET', path: '/health' }],
        },
        featureFlags: { provider: 'launchdarkly', defaults: { beta: false } },
      };

      expect(adapters.ai?.model).toBe('claude-sonnet-4-6');
      expect(adapters.auth?.provider).toBe('clerk');
      expect(adapters.rbac?.roles).toContain('admin');
      expect(adapters.telemetry?.autoEvents).toContain('page_view');
      expect(adapters.api?.endpoints).toHaveLength(1);
      expect(adapters.featureFlags?.defaults.beta).toBe(false);
    });
  });
});
