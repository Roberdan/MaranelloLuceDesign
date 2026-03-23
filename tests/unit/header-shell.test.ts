/**
 * HeaderShell unit tests.
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi } from 'vitest';

import { header } from '../../src/ts/header';
import { headerShell } from '../../src/ts/header-shell';
import { headerShell as headerShellFromIndex } from '../../src/ts/index';

describe('headerShell', () => {
  it('exports from index and keeps header callable', () => {
    expect(typeof header).toBe('function');
    expect(typeof headerShell).toBe('function');
    expect(typeof headerShellFromIndex).toBe('function');
  });

  it('renders declarative sections and primitive markers', () => {
    const host = document.createElement('div');
    const ctrl = headerShell(host, {
      sections: [
        { type: 'brand', label: 'Maranello', logoSrc: '/brand.svg', logoAlt: 'Brand' },
        {
          type: 'actions',
          role: 'pre',
          items: [{ id: 'overview', label: 'Overview', active: true }],
        },
        { type: 'divider' },
        { type: 'spacer' },
        {
          type: 'search',
          placeholder: 'Search projects',
          shortcut: '⌘K',
          filters: [{ id: 'status', label: 'Status', multi: true, options: [{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' }] }],
        },
        {
          type: 'actions',
          role: 'post',
          items: [{ id: 'alerts', title: 'Alerts', icon: '<svg><circle cx="12" cy="12" r="5" /></svg>' }],
        },
        { type: 'theme' },
        { type: 'profile', name: 'Roberdan' },
      ],
    });

    expect(host.querySelector('.mn-header-shell')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="brand"]')).not.toBeNull();
    expect(host.querySelector('.mn-header-shell__brand img')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="pre-actions"]')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="search"]')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="post-actions"]')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="theme"]')).not.toBeNull();
    expect(host.querySelector('[data-shell-role="profile"]')).not.toBeNull();
    expect(host.querySelector('.mn-header-shell__divider')).not.toBeNull();
    expect(host.querySelector('.mn-header-shell__spacer')).not.toBeNull();

    ctrl.destroy();
  });

  it('keeps internal state and emits action/search/filter events live while typing', () => {
    const host = document.createElement('div');
    const onAction = vi.fn();
    const onSearch = vi.fn();
    const onFilter = vi.fn();

    const ctrl = headerShell(host, {
      sections: [
        { type: 'actions', role: 'pre', items: [{ id: 'table', label: 'Table' }] },
        {
          type: 'search',
          placeholder: 'Search',
          filters: [{ id: 'status', label: 'Status', options: [{ id: 'all', label: 'All' }, { id: 'watch', label: 'Watch' }] }],
        },
      ],
      callbacks: { onAction, onSearch, onFilter },
    });

    (host.querySelector('[data-header-shell-action-id="table"]') as HTMLButtonElement).click();
    const input = host.querySelector('.mn-header-shell__search-input') as HTMLInputElement;
    input.value = 'north';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    ctrl.setFilter('status', ['watch']);

    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'table' }));
    expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ query: 'north' }));
    expect(onFilter).toHaveBeenCalledWith(expect.objectContaining({ groupId: 'status' }));
    expect(ctrl.getState().query).toBe('north');
    expect(ctrl.getState().filters.status).toEqual(['watch']);

    ctrl.destroy();
  });

  it('supports segmented/cluster action presentation with event bubbling', () => {
    const host = document.createElement('div');
    const seen: string[] = [];
    host.addEventListener('header-shell-action', (event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      seen.push(detail.id);
    });
    const ctrl = headerShell(host, {
      sections: [
        { type: 'actions', role: 'pre', presentation: 'segmented', items: [{ id: 'gantt', label: 'Gantt' }] },
        { type: 'actions', role: 'post', presentation: 'cluster', items: [{ id: 'alerts', title: 'Alerts', icon: '<svg><circle cx=\"12\" cy=\"12\" r=\"5\" /></svg>' }] },
      ],
    });

    expect(host.querySelector('[data-presentation="segmented"]')).not.toBeNull();
    expect(host.querySelector('[data-presentation="cluster"]')).not.toBeNull();
    const alertsButton = host.querySelector('[data-header-shell-action-id="alerts"]') as HTMLButtonElement;
    expect(alertsButton.textContent).toBe('');
    alertsButton.click();
    expect(ctrl.getState().activeActionId).toBe('alerts');
    expect(seen).toEqual(['alerts']);
    ctrl.destroy();
  });

  it('wires declarative theme and profile sections with callback/state sync', () => {
    const host = document.createElement('div');
    const onTheme = vi.fn();
    const ctrl = headerShell(host, {
      sections: [{ type: 'theme', modes: ['nero', 'avorio'] }, { type: 'profile', name: 'Allegra Bianchi' }],
      callbacks: { onTheme },
    });
    const toggle = host.querySelector('mn-theme-toggle') as HTMLElement;
    toggle.dispatchEvent(new CustomEvent('mn-theme-change', { detail: { theme: 'avorio' }, bubbles: true }));
    expect(onTheme).toHaveBeenCalledWith({ mode: 'avorio' });
    expect(ctrl.getState().themeMode).toBe('avorio');
    expect(host.querySelector('.mn-profile-trigger')).not.toBeNull();
    ctrl.destroy();
  });

  it('supports grouped filter organization with multi-select and controller updates', () => {
    const host = document.createElement('div');
    const ctrl = headerShell(host, {
      sections: [{
        type: 'search',
        filters: [
          {
            id: 'status',
            label: 'Status',
            multi: true,
            options: [{ id: 'all', label: 'All' }, { id: 'watch', label: 'Watch' }, { id: 'active', label: 'Active' }],
          },
          {
            id: 'region',
            label: 'Region',
            options: [{ id: 'all', label: 'All' }, { id: 'na', label: 'NA' }],
          },
        ],
      }],
    });

    expect(host.querySelectorAll('[data-filter-group-id]').length).toBe(2);
    ctrl.setFilter('status', ['watch', 'active']);
    ctrl.setFilter('region', ['na']);
    expect(ctrl.getState().filters.status).toEqual(['watch', 'active']);
    expect(ctrl.getState().filters.region).toEqual(['na']);
    ctrl.setFilter('status', []);
    expect(ctrl.getState().filters.status).toEqual(['all']);
    ctrl.destroy();
  });
});
