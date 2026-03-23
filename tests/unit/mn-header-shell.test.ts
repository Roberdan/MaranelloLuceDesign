/**
 * Unit tests for the <mn-header-shell> Web Component wrapper.
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAvailableTags } from '../../src/wc/index';

type MnHeaderShellElement = HTMLElement & {
  config: unknown;
  whenReady?: () => Promise<unknown>;
  setFilter?: (groupId: string, values: string[]) => void;
  getState?: () => { filters?: Record<string, string[]>; activeActionId?: string };
};

async function waitFor(assertion: () => void, attempts = 100): Promise<void> {
  let lastError: unknown = null;
  for (let index = 0; index < attempts; index += 1) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
  }
  throw lastError;
}

describe('mn-header-shell', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('self-registers and appears in WC registry tags', async () => {
    await import('../../src/wc/mn-header-shell.js');
    expect(customElements.get('mn-header-shell')).toBeTruthy();
    expect(getAvailableTags()).toContain('mn-header-shell');
  });

  it('renders rich shell sections through the config property', async () => {
    await import('../../src/wc/mn-header-shell.js');
    const shell = document.createElement('mn-header-shell') as MnHeaderShellElement;
    shell.config = {
      sections: [
        { type: 'brand', label: 'Maranello', logoSrc: '/brand.svg' },
        { type: 'spacer' },
        { type: 'search', placeholder: 'Search teams...' },
        { type: 'theme' },
        { type: 'profile', name: 'Roberdan' },
      ],
    };

    document.body.appendChild(shell);
    await shell.whenReady?.();
    await waitFor(() => expect(shell.querySelector('.mn-header-shell')).toBeTruthy());
    expect((shell.querySelector('.mn-header-shell__search-input') as HTMLInputElement)?.placeholder).toBe('Search teams...');
    expect(shell.querySelector('mn-theme-toggle')).toBeTruthy();
  });

  it('rebuilds when config is reassigned', async () => {
    await import('../../src/wc/mn-header-shell.js');
    const shell = document.createElement('mn-header-shell') as MnHeaderShellElement;
    document.body.appendChild(shell);

    shell.config = { sections: [{ type: 'brand', label: 'First' }] };
    await shell.whenReady?.();
    await waitFor(() => expect(shell.textContent).toContain('First'));

    shell.config = { sections: [{ type: 'brand', label: 'Second' }] };
    await shell.whenReady?.();
    await waitFor(() => expect(shell.textContent).toContain('Second'));
    expect(shell.textContent).not.toContain('First');
    expect(shell.querySelectorAll('.mn-header-shell').length).toBe(1);
  });

  it('preserves bubbling shell events and controller helpers on the host', async () => {
    await import('../../src/wc/mn-header-shell.js');
    const shell = document.createElement('mn-header-shell') as MnHeaderShellElement;
    const onEvent = vi.fn();
    shell.addEventListener('header-shell-action', onEvent);
    shell.config = {
      sections: [
        { type: 'actions', role: 'pre', items: [{ id: 'overview', label: 'Overview', active: true }] },
        { type: 'actions', role: 'post', items: [{ id: 'alerts', title: 'Alerts' }] },
        { type: 'search', filters: [{ id: 'status', label: 'Status', options: [{ id: 'all', label: 'All' }, { id: 'watch', label: 'Watch' }] }] },
      ],
    };
    document.body.appendChild(shell);

    await shell.whenReady?.();
    await waitFor(() => expect(shell.querySelector('[data-header-shell-action-id="alerts"]')).toBeTruthy());
    (shell.querySelector('[data-header-shell-action-id="alerts"]') as HTMLButtonElement).click();
    await waitFor(() => expect(onEvent).toHaveBeenCalledTimes(1));
    expect(onEvent.mock.calls[0][0].detail.id).toBe('alerts');

    shell.setFilter?.('status', ['watch']);
    expect(shell.getState?.().filters?.status).toEqual(['watch']);
    expect(shell.getState?.().activeActionId).toBe('overview');
  });
});
