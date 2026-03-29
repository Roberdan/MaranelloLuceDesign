import { describe, expect, it } from 'vitest';
import {
  createApiClientConfig,
  createAgentRequestContext,
  createShellConfig,
  filterNavigationByRole,
} from '../../starters/shared-shell/src/index';

describe('shared-shell foundation', () => {
  it('creates immutable shell config copies', () => {
    const config = createShellConfig({
      id: 'workspace',
      title: 'Workspace',
      mode: 'workspace',
      defaultTheme: 'nero',
      toolbarActions: [{ id: 'search', label: 'Search' }],
      featureFlags: { agentPanel: true },
    });

    expect(config.title).toBe('Workspace');
    expect(Object.isFrozen(config)).toBe(true);
    expect(config.toolbarActions).toHaveLength(1);
  });

  it('filters navigation by role', () => {
    const navigation = filterNavigationByRole({
      primary: [
        { id: 'overview', label: 'Overview', href: '#' },
        { id: 'admin', label: 'Admin', href: '#admin', roles: ['admin'] },
      ],
    }, ['operator']);

    expect(navigation.primary.map((item) => item.id)).toEqual(['overview']);
  });

  it('copies agent request context data', () => {
    const context = createAgentRequestContext({
      userId: 'demo',
      roles: ['admin'],
      featureFlags: { agentPanel: true },
    });

    expect(context).toEqual({
      userId: 'demo',
      roles: ['admin'],
      featureFlags: { agentPanel: true },
    });
  });

  it('copies API client config', () => {
    const config = createApiClientConfig({
      baseUrl: 'https://example.test',
      headers: { authorization: 'Bearer token' },
    });

    expect(config.baseUrl).toBe('https://example.test');
    expect(config.headers?.authorization).toBe('Bearer token');
  });
});
