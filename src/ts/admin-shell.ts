/**
 * Maranello Luce Design - Admin Shell
 * Full-screen admin layout with fixed overlay, collapsible sidebar, content slot.
 */
import {
  groupBySection, buildHeader, buildSearch,
  buildNavItem, buildTopbar,
} from './admin-shell-render';

export interface AdminShellNavItem {
  id: string;
  label: string;
  icon: string;
  section?: string;
  badge?: string | number;
}

export interface AdminShellOpts {
  sidebar: {
    header?: { icon?: string; title: string; badge?: string };
    search?: {
      placeholder?: string;
      shortcut?: string;
      onSearch?: (q: string) => void;
    };
    nav: AdminShellNavItem[];
    footer?: HTMLElement | string;
  };
  collapsible?: boolean;
  initialCollapsed?: boolean;
  topBar?: boolean;
  onNavigate: (pageId: string) => void;
  initialPage?: string;
}

export interface AdminShellController {
  contentEl: HTMLElement;
  setPage: (id: string) => void;
  setTitle: (title: string) => void;
  collapse: (val: boolean) => void;
  destroy: () => void;
}

/** Find nav item by id. */
function findItem(nav: AdminShellNavItem[], id: string): AdminShellNavItem | undefined {
  return nav.find(n => n.id === id);
}

/**
 * Create a full-screen admin shell with collapsible sidebar and content area.
 * Mounts a fixed overlay grid below the navbar with navigation and a content slot.
 */
export function adminShell(
  el: HTMLElement,
  opts: AdminShellOpts,
): AdminShellController {
  const ac = new AbortController();
  const collapsible = opts.collapsible ?? true;
  const showTopBar = opts.topBar ?? true;
  let activePage = opts.initialPage ?? opts.sidebar.nav[0]?.id ?? '';

  /* Root shell */
  el.innerHTML = '';
  el.classList.add('mn-admin-shell');
  if (opts.initialCollapsed) el.classList.add('mn-admin-shell--collapsed');

  /* Sidebar */
  const sidebar = document.createElement('nav');
  sidebar.className = 'mn-admin-sidebar';
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Admin navigation');
  el.appendChild(sidebar);

  /* Sidebar header */
  if (opts.sidebar.header) {
    sidebar.appendChild(buildHeader(opts.sidebar.header));
  }

  /* Search */
  let searchWrap: HTMLElement | null = null;
  const filterNav = (q: string): void => {
    const lower = q.toLowerCase();
    const btns = sidebar.querySelectorAll<HTMLButtonElement>('.mn-admin-nav-item');
    btns.forEach(btn => {
      const label = btn.querySelector('.mn-admin-nav-item__label')?.textContent ?? '';
      btn.style.display = label.toLowerCase().includes(lower) ? '' : 'none';
    });
    opts.sidebar.search?.onSearch?.(q);
  };
  if (opts.sidebar.search) {
    searchWrap = buildSearch(opts.sidebar.search, ac, filterNav);
    sidebar.appendChild(searchWrap);
  }

  /* Keyboard shortcut for search focus */
  if (opts.sidebar.search?.shortcut) {
    const key = opts.sidebar.search.shortcut.toLowerCase();
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key && !isInputFocused()) {
        e.preventDefault();
        const input = searchWrap?.querySelector<HTMLInputElement>('input');
        input?.focus();
      }
    }, { signal: ac.signal });
  }

  /* Nav sections */
  const navContainer = document.createElement('div');
  navContainer.className = 'mn-admin-sidebar__nav';
  sidebar.appendChild(navContainer);

  function renderNav(): void {
    navContainer.innerHTML = '';
    const groups = groupBySection(opts.sidebar.nav);
    for (const [section, items] of groups) {
      if (section) {
        const heading = document.createElement('div');
        heading.className = 'mn-admin-sidebar__section-title';
        heading.textContent = section;
        navContainer.appendChild(heading);
      }
      for (const item of items) {
        navContainer.appendChild(
          buildNavItem(item, item.id === activePage, ac, handleNav),
        );
      }
    }
  }

  function handleNav(id: string): void {
    activePage = id;
    highlightActive();
    const item = findItem(opts.sidebar.nav, id);
    if (item && titleEl) titleEl.textContent = item.label;
    opts.onNavigate(id);
  }

  function highlightActive(): void {
    const btns = navContainer.querySelectorAll<HTMLButtonElement>('.mn-admin-nav-item');
    btns.forEach(btn => {
      const isActive = btn.dataset.navId === activePage;
      btn.classList.toggle('mn-admin-nav-item--active', isActive);
      if (isActive) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
  }

  renderNav();

  /* Collapse toggle */
  if (collapsible) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mn-admin-sidebar__collapse-btn';
    toggle.setAttribute('aria-label', 'Toggle sidebar');
    toggle.textContent = '\u00AB';
    toggle.addEventListener('click', () => {
      el.classList.toggle('mn-admin-shell--collapsed');
    }, { signal: ac.signal });
    sidebar.appendChild(toggle);
  }

  /* Footer */
  if (opts.sidebar.footer) {
    if (typeof opts.sidebar.footer === 'string') {
      const span = document.createElement('span');
      span.className = 'mn-admin-sidebar__footer';
      span.textContent = opts.sidebar.footer;
      sidebar.appendChild(span);
    } else {
      sidebar.appendChild(opts.sidebar.footer);
    }
  }

  /* Content area */
  const content = document.createElement('div');
  content.className = 'mn-admin-content';
  el.appendChild(content);

  let titleEl: HTMLElement | null = null;
  if (showTopBar) {
    const initLabel = findItem(opts.sidebar.nav, activePage)?.label ?? '';
    const topbar = buildTopbar(initLabel);
    titleEl = topbar.titleEl;
    content.appendChild(topbar.el);
  }

  const body = document.createElement('div');
  body.className = 'mn-admin-content__body';
  content.appendChild(body);

  return {
    contentEl: body,

    setPage(id: string): void {
      activePage = id;
      highlightActive();
      const item = findItem(opts.sidebar.nav, id);
      if (item && titleEl) titleEl.textContent = item.label;
      opts.onNavigate(id);
    },

    setTitle(title: string): void {
      if (titleEl) titleEl.textContent = title;
    },

    collapse(val: boolean): void {
      el.classList.toggle('mn-admin-shell--collapsed', val);
    },

    destroy(): void {
      ac.abort();
      el.innerHTML = '';
      el.classList.remove('mn-admin-shell', 'mn-admin-shell--collapsed');
    },
  };
}

/** Check if an input/textarea/select is currently focused. */
function isInputFocused(): boolean {
  const tag = document.activeElement?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}
