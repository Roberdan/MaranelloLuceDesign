import { profileMenu } from './profile-menu';
import { sanitizeSvg } from './core/sanitize';
import { getTheme } from './core/utils';
import { emitShellEvent } from './header-shell-events';
import { createFilterState, setFilterValues } from './header-shell-filters';
import { normalizeSections, type HeaderShellAction, type HeaderShellFilterGroup, type HeaderShellOptions, type HeaderShellSection, type HeaderShellState } from './header-shell-config';
import type { ThemeMode } from './core/types';
export type { HeaderShellAction, HeaderShellFilterGroup, HeaderShellOptions, HeaderShellSection, HeaderShellState };
export interface HeaderShellController { getState(): HeaderShellState; setQuery(query: string): void; setFilter(groupId: string, values: string[]): void; destroy(): void; }
function getInitialActiveActionId(sections: HeaderShellSection[]): string {
  for (const section of sections) {
    const active = section.type === 'actions' && (section.presentation || (section.role === 'pre' ? 'segmented' : 'cluster')) === 'segmented'
      ? section.items.find((action) => action.active)
      : undefined;
    if (active) return active.id;
  }
  return '';
}
function applySvg(host: HTMLElement, svg: string | undefined, className: string): void {
  if (!svg) return;
  const safe = sanitizeSvg(svg);
  if (!safe) return;
  const icon = document.createElement('span');
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = safe;
  host.appendChild(icon);
}

function buildAction(action: HeaderShellAction, role: 'pre' | 'post', isSelectable: boolean, isActive: boolean, onClick: (id: string, role: 'pre' | 'post', isSelectable: boolean) => void): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'mn-header-shell__action';
  el.dataset.headerShellActionId = action.id;
  if (isSelectable) el.dataset.headerShellSelectable = 'true';
  const title = action.title || action.label || action.id;
  el.setAttribute('aria-label', title);
  if (action.title) el.title = action.title;
  applySvg(el, action.icon, 'mn-header-shell__icon');
  if (action.label) { const label = document.createElement('span'); label.textContent = action.label; el.appendChild(label); }
  if (isActive) el.classList.add('mn-header-shell__action--active');
  if (action.pressed) el.setAttribute('aria-pressed', 'true');
  if (action.disabled) el.disabled = true;
  el.addEventListener('click', () => onClick(action.id, role, isSelectable));
  return el;
}
function buildFilters(host: HTMLElement, groups: HeaderShellFilterGroup[] | undefined, state: HeaderShellState, onFilter: (groupId: string, values: string[]) => void): HTMLElement | null {
  if (!groups || !groups.length) return null;
  const panel = document.createElement('div');
  panel.className = 'mn-header-shell__filters';
  groups.forEach((group) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'mn-header-shell__filter-group';
    fieldset.setAttribute('data-filter-group-id', group.id);
    const legend = document.createElement('legend');
    legend.textContent = group.label;
    fieldset.appendChild(legend);
    group.options.forEach((option) => {
      const btn = document.createElement('button');
      const selected = !!(state.filters[group.id] && state.filters[group.id].indexOf(option.id) !== -1);
      btn.type = 'button';
      btn.className = 'mn-header-shell__filter-option';
      btn.textContent = option.label;
      if (selected) btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', String(selected));
      btn.addEventListener('click', () => {
        const defaultId = group.options[0]?.id;
        const current = state.filters[group.id] || (defaultId ? [defaultId] : []);
        let next: string[];
        if (!group.multi) {
          next = [option.id];
        } else if (option.id === defaultId) {
          next = defaultId ? [defaultId] : [];
        } else {
          const normalized = defaultId && current[0] === defaultId ? [] : current.slice();
          const index = normalized.indexOf(option.id);
          if (index === -1) normalized.push(option.id);
          else normalized.splice(index, 1);
          next = normalized.length ? normalized : (defaultId ? [defaultId] : []);
        }
        onFilter(group.id, next);
      });
      fieldset.appendChild(btn);
    });
    panel.appendChild(fieldset);
  });
  host.appendChild(panel);
  return panel;
}
function applySelection(buttons: NodeListOf<HTMLButtonElement>, activeId: string): void {
  buttons.forEach((button) => button.dataset.headerShellActionId === activeId ? button.classList.add('mn-header-shell__action--active') : button.classList.remove('mn-header-shell__action--active'));
}
export function headerShell(container: HTMLElement, options: HeaderShellOptions): HeaderShellController {
  const sections = normalizeSections(options.sections || []);
  const nav = document.createElement('nav');
  nav.className = 'mn-header-shell';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', options.ariaLabel || 'Header shell navigation');
  const cleanups: Array<() => void> = [];
  const filterGroups = sections.find((section) => section.type === 'search' && section.filters) as Extract<HeaderShellSection, { type: 'search' }> | undefined;
  const state: HeaderShellState = { query: '', filters: createFilterState(filterGroups?.filters), activeActionId: getInitialActiveActionId(sections), themeMode: getTheme() };
  const onAction = (id: string, role: 'pre' | 'post', isSelectable: boolean): void => {
    if (isSelectable) {
      state.activeActionId = id;
      applySelection(nav.querySelectorAll<HTMLButtonElement>('button[data-header-shell-selectable="true"]'), id);
    }
    const detail = { id, role };
    options.callbacks?.onAction?.(detail);
    emitShellEvent(nav, 'header-shell-action', detail);
  };
  const onFilter = (groupId: string, values: string[]): void => {
    if (!filterGroups || !filterGroups.filters) return;
    const group = filterGroups.filters.find((item) => item.id === groupId);
    if (!group) return;
    const next = setFilterValues(state.filters, group, values);
    nav.querySelectorAll('.mn-header-shell__filters').forEach((panel) => panel.remove());
    const searchHost = nav.querySelector('.mn-header-shell__search');
    if (searchHost instanceof HTMLElement) buildFilters(searchHost, filterGroups.filters, state, onFilter);
    const detail = { groupId, values: next };
    options.callbacks?.onFilter?.(detail);
    emitShellEvent(nav, 'header-shell-filter', detail);
  };
  sections.forEach((section) => {
    if (section.type === 'divider') {
      const divider = document.createElement('span');
      divider.className = 'mn-header-shell__divider';
      divider.setAttribute('aria-hidden', 'true');
      nav.appendChild(divider);
      return;
    }
    if (section.type === 'spacer') {
      const spacer = document.createElement('span');
      spacer.className = 'mn-header-shell__spacer';
      nav.appendChild(spacer);
      return;
    }
    if (section.type === 'brand') {
      const brand = document.createElement(section.href ? 'a' : 'span');
      brand.className = 'mn-header-shell__brand';
      brand.setAttribute('data-shell-role', 'brand');
      if (section.href && brand instanceof HTMLAnchorElement) brand.href = section.href;
      if (section.logoSrc) {
        const image = document.createElement('img');
        image.className = 'mn-header-shell__brand-logo';
        image.src = section.logoSrc;
        image.alt = section.logoAlt || '';
        brand.appendChild(image);
      }
      applySvg(brand, section.logo, 'mn-header-shell__brand-logo');
      if (section.label) {
        const label = document.createElement('span');
        label.textContent = section.label;
        brand.appendChild(label);
      }
      nav.appendChild(brand);
      return;
    }
    if (section.type === 'actions') {
      const group = document.createElement('div');
      group.className = 'mn-header-shell__actions';
      group.setAttribute('data-shell-role', section.role === 'pre' ? 'pre-actions' : 'post-actions');
      const presentation = section.presentation || (section.role === 'pre' ? 'segmented' : 'cluster');
      group.setAttribute('data-presentation', presentation);
      group.classList.add(`mn-header-shell__actions--${presentation}`);
      const isSelectable = presentation === 'segmented';
      section.items.forEach((action) => group.appendChild(buildAction(action, section.role, isSelectable, isSelectable ? action.id === state.activeActionId : !!action.active, onAction)));
      nav.appendChild(group);
      return;
    }
    if (section.type === 'search') {
      const search = document.createElement('div');
      search.className = 'mn-header-shell__search';
      search.setAttribute('data-shell-role', 'search');
      const input = document.createElement('input');
      input.className = 'mn-header-shell__search-input';
      input.type = 'search';
      input.placeholder = section.placeholder || 'Search';
      const emitSearch = (): void => { state.query = input.value; const detail = { query: input.value }; options.callbacks?.onSearch?.(detail); emitShellEvent(nav, 'header-shell-search', detail); };
      input.addEventListener('input', emitSearch);
      input.addEventListener('search', emitSearch);
      search.appendChild(input);
      buildFilters(search, section.filters, state, onFilter);
      if (section.shortcut) {
        const kbd = document.createElement('kbd');
        kbd.className = 'mn-header-shell__shortcut';
        kbd.textContent = section.shortcut;
        search.appendChild(kbd);
      }
      nav.appendChild(search);
      return;
    }
    if (section.type === 'theme') {
      const wrap = document.createElement('div');
      wrap.className = 'mn-header-shell__theme';
      wrap.setAttribute('data-shell-role', 'theme');
      const modes = section.modes && section.modes.length ? section.modes : undefined;
      const mode = modes && modes.indexOf(state.themeMode) === -1 ? modes[0] : state.themeMode;
      const toggle = document.createElement('mn-theme-toggle');
      state.themeMode = mode;
      if (modes) { const value = modes.join(','); wrap.setAttribute('data-theme-modes', value); toggle.setAttribute('modes', value); }
      toggle.setAttribute('mode', mode);
      toggle.addEventListener('mn-theme-change', (event) => {
        const detail = (event as CustomEvent<{ theme?: ThemeMode }>).detail;
        const mode = detail && detail.theme ? detail.theme : state.themeMode;
        state.themeMode = mode;
        options.callbacks?.onTheme?.({ mode });
        emitShellEvent(nav, 'header-shell-theme', { mode });
      });
      wrap.appendChild(toggle);
      nav.appendChild(wrap);
      return;
    }
    if (section.type === 'profile') {
      const wrap = document.createElement('div');
      wrap.className = 'mn-header-shell__profile';
      wrap.setAttribute('data-shell-role', 'profile');
      const ctrl = profileMenu(wrap, { name: section.name, avatarUrl: section.avatarUrl, sections: section.sections });
      cleanups.push(() => ctrl.destroy());
      nav.appendChild(wrap);
    }
  });
  container.appendChild(nav);
  return {
    getState(): HeaderShellState {
      const filters: Record<string, string[]> = {};
      Object.keys(state.filters).forEach((key) => {
        filters[key] = state.filters[key].slice();
      });
      return { query: state.query, filters, activeActionId: state.activeActionId, themeMode: state.themeMode };
    },
    setQuery(query: string): void {
      state.query = query;
      const input = nav.querySelector('.mn-header-shell__search-input') as HTMLInputElement | null;
      if (input) input.value = query;
    },
    setFilter(groupId: string, values: string[]): void {
      onFilter(groupId, values);
    },
    destroy(): void {
      cleanups.forEach((fn) => fn());
      nav.remove();
    },
  };
}
