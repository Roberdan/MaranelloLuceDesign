/**
 * HeaderShell unit tests.
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { header } from '../../src/ts/header';
import { headerShell } from '../../src/ts/header-shell';
import { headerShell as headerShellFromIndex } from '../../src/ts/index';

describe('headerShell', () => {
  afterEach(() => {
    document.body.className = '';
  });

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

  it('keeps segmented actions selected when cluster utilities are clicked', () => {
    const host = document.createElement('div');
    const seen: string[] = [];
    host.addEventListener('header-shell-action', (event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      seen.push(detail.id);
    });
    const ctrl = headerShell(host, {
      sections: [
        { type: 'actions', role: 'pre', presentation: 'segmented', items: [{ id: 'gantt', label: 'Gantt', active: true }, { id: 'table', label: 'Table' }] },
        { type: 'actions', role: 'post', presentation: 'cluster', items: [{ id: 'alerts', title: 'Alerts', icon: '<svg><circle cx=\"12\" cy=\"12\" r=\"5\" /></svg>' }] },
      ],
    });

    expect(host.querySelector('[data-presentation="segmented"]')).not.toBeNull();
    expect(host.querySelector('[data-presentation="cluster"]')).not.toBeNull();
    expect(ctrl.getState().activeActionId).toBe('gantt');
    const alertsButton = host.querySelector('[data-header-shell-action-id="alerts"]') as HTMLButtonElement;
    const ganttButton = host.querySelector('[data-header-shell-action-id="gantt"]') as HTMLButtonElement;
    expect(alertsButton.textContent).toBe('');
    alertsButton.click();
    expect(ctrl.getState().activeActionId).toBe('gantt');
    expect(ganttButton.classList.contains('mn-header-shell__action--active')).toBe(true);
    expect(alertsButton.classList.contains('mn-header-shell__action--active')).toBe(false);
    expect(seen).toEqual(['alerts']);
    ctrl.destroy();
  });

  it('preserves the current theme and passes allowed theme modes through to the toggle', () => {
    const host = document.createElement('div');
    const onTheme = vi.fn();
    document.body.classList.add('mn-avorio');
    const ctrl = headerShell(host, {
      sections: [{ type: 'theme', modes: ['nero', 'avorio'] }, { type: 'profile', name: 'Allegra Bianchi' }],
      callbacks: { onTheme },
    });
    const toggle = host.querySelector('mn-theme-toggle') as HTMLElement;
    expect(toggle.getAttribute('mode')).toBe('avorio');
    expect(toggle.getAttribute('modes')).toBe('nero,avorio');
    toggle.dispatchEvent(new CustomEvent('mn-theme-change', { detail: { theme: 'avorio' }, bubbles: true }));
    expect(onTheme).toHaveBeenCalledWith({ mode: 'avorio' });
    expect(ctrl.getState().themeMode).toBe('avorio');
    expect(host.querySelector('.mn-profile-trigger')).not.toBeNull();
    ctrl.destroy();
    document.body.className = '';
    const nextHost = document.createElement('div');
    const nextCtrl = headerShell(nextHost, { sections: [{ type: 'theme', modes: ['nero', 'avorio'] }] });
    expect((nextHost.querySelector('mn-theme-toggle') as HTMLElement).getAttribute('mode')).toBe('nero');
    expect(nextCtrl.getState().themeMode).toBe('nero');
    nextCtrl.destroy();
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
    const initialStatusButtons = host.querySelectorAll('[data-filter-group-id="status"] .mn-header-shell__filter-option');
    expect(initialStatusButtons[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(initialStatusButtons[1]?.getAttribute('aria-pressed')).toBe('false');
    ctrl.setFilter('status', ['watch', 'active']);
    ctrl.setFilter('region', ['na']);
    expect(ctrl.getState().filters.status).toEqual(['watch', 'active']);
    expect(ctrl.getState().filters.region).toEqual(['na']);
    const nextStatusButtons = host.querySelectorAll('[data-filter-group-id="status"] .mn-header-shell__filter-option');
    expect(nextStatusButtons[0]?.getAttribute('aria-pressed')).toBe('false');
    expect(nextStatusButtons[1]?.getAttribute('aria-pressed')).toBe('true');
    ctrl.setFilter('status', []);
    expect(ctrl.getState().filters.status).toEqual(['all']);
    ctrl.destroy();
  });

  it('updates filter buttons in place instead of remounting the filter panel', () => {
    const host = document.createElement('div');
    const ctrl = headerShell(host, {
      sections: [{
        type: 'search',
        filters: [{ id: 'status', label: 'Status', options: [{ id: 'all', label: 'All' }, { id: 'watch', label: 'Watch' }] }],
      }],
    });

    const filterPanel = host.querySelector('.mn-header-shell__filters');
    const watchButton = host.querySelector('[data-filter-group-id="status"] [data-filter-option-id="watch"]') as HTMLButtonElement;
    watchButton.focus();
    watchButton.click();
    const nextPanel = host.querySelector('.mn-header-shell__filters');
    const nextWatchButton = host.querySelector('[data-filter-group-id="status"] [data-filter-option-id="watch"]') as HTMLButtonElement;
    expect(nextPanel).toBe(filterPanel);
    expect(nextWatchButton).toBe(watchButton);
    expect(nextWatchButton.getAttribute('aria-pressed')).toBe('true');
    ctrl.destroy();
  });

  it('keeps empty filter groups from leaking undefined values into state', () => {
    const host = document.createElement('div');
    const ctrl = headerShell(host, { sections: [{ type: 'search', filters: [{ id: 'empty', label: 'Empty', options: [] }] }] });
    ctrl.setFilter('empty', ['missing']);
    expect(ctrl.getState().filters.empty).toEqual([]);
    ctrl.destroy();
  });
});
