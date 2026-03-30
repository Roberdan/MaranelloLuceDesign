/**
 * Shared shell starter tests.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest';

import {
  createSharedShellFiles,
  renderSharedShell,
  type SharedShellConfig,
} from '../../starters/shared-shell/src/index';

function makeConfig(): SharedShellConfig {
  return {
    appName: 'Convergio Workspace',
    appDescription: 'AI-ready shell for business workflows',
    currentPath: '/workbench',
    themes: ['editorial', 'avorio', 'navy'],
    header: {
      brandLabel: 'Convergio',
      productLabel: 'Workspace',
      homeHref: '/',
      primaryActions: [
        { id: 'overview', label: 'Overview', href: '/overview' },
        { id: 'command', label: 'Command', href: '/command', badge: 'AI' },
      ],
      searchPlaceholder: 'Search work items',
      utilityActions: [
        { id: 'alerts', label: 'Alerts', href: '/alerts' },
      ],
    },
    navigation: [
      {
        id: 'delivery',
        label: 'Delivery',
        items: [
          { id: 'workbench', label: 'Workbench', href: '/workbench', icon: '▣' },
          { id: 'programs', label: 'Programs', href: '/programs', icon: '◎' },
        ],
      },
    ],
    content: {
      title: 'Program workbench',
      eyebrow: 'Active delivery',
      body: '<section data-slot="primary">Live portfolio content</section>',
      supporting: '<section data-slot="supporting">Signals and AI summaries</section>',
    },
    detailPanel: {
      title: 'Work item details',
      description: 'Selected entity details stay visible while navigating the board.',
      body: '<section data-slot="detail">Owner, dates, risks, and AI recommendations</section>',
    },
  };
}

describe('shared-shell starter', () => {
  it('renders shell landmarks from typed configuration', () => {
    const host = document.createElement('div');
    const shell = renderSharedShell(host, makeConfig());

    expect(host.querySelector('header[data-shared-shell="header"]')).not.toBeNull();
    expect(host.querySelector('nav[aria-label="Primary navigation"]')).not.toBeNull();
    expect(host.querySelector('main[data-shared-shell="content"]')).not.toBeNull();
    expect(host.querySelector('aside[aria-label="Detail panel"]')).not.toBeNull();
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('Workbench');
    expect(shell.getState().activeItemId).toBe('workbench');
  });

  it('keeps the detail panel optional and updates active navigation without hardcoded pages', () => {
    const host = document.createElement('div');
    const config = makeConfig();
    config.detailPanel = undefined;
    const shell = renderSharedShell(host, config);

    shell.setActiveItem('programs');

    expect(host.querySelector('aside[aria-label="Detail panel"]')).toBeNull();
    expect(shell.getState().activeItemId).toBe('programs');
    expect(host.querySelector('[aria-current="page"]')?.textContent).toContain('Programs');
  });

  it('generates a Next starter file set without deployment-host assumptions', () => {
    const files = createSharedShellFiles(makeConfig());

    expect(files['app/layout.tsx']).toContain('SharedShellConfig');
    expect(files['app/page.tsx']).toContain('Program workbench');
    expect(files['src/shared-shell/config.ts']).toContain('Convergio Workspace');
    expect(files['src/shared-shell/runtime.ts']).toContain('renderSharedShell');
    expect(files['app/layout.tsx']).not.toMatch(/vercel\.app|azurecontainerapps\.io/i);
  });
});
