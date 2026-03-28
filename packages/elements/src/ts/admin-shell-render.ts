/**
 * Maranello Luce Design - Admin Shell Render helpers
 * DOM construction for adminShell sidebar, topbar, and content area.
 */
import { escapeHtml } from './core/sanitize';
import { icons } from './icons';
import type { AdminShellNavItem, AdminShellOpts } from './admin-shell';

/** Render an icon SVG string by key, falling back to empty span. */
export function iconHtml(key: string, cls: string): string {
  const factory = icons[key];
  if (!factory) return `<span class="${escapeHtml(cls)}"></span>`;
  return `<span class="${escapeHtml(cls)}">${factory()}</span>`;
}

/** Group nav items by their section property. Preserves insertion order. */
export function groupBySection(
  items: AdminShellNavItem[],
): Map<string, AdminShellNavItem[]> {
  const map = new Map<string, AdminShellNavItem[]>();
  for (const item of items) {
    const key = item.section ?? '';
    const arr = map.get(key);
    if (arr) arr.push(item);
    else map.set(key, [item]);
  }
  return map;
}

/** Build sidebar header element. */
export function buildHeader(
  cfg: NonNullable<AdminShellOpts['sidebar']['header']>,
): HTMLElement {
  const hdr = document.createElement('div');
  hdr.className = 'mn-admin-sidebar__header';
  if (cfg.icon) {
    const ico = document.createElement('span');
    ico.className = 'mn-admin-sidebar__header-icon';
    ico.innerHTML = icons[cfg.icon]?.() ?? '';
    hdr.appendChild(ico);
  }
  const title = document.createElement('span');
  title.className = 'mn-admin-sidebar__header-title';
  title.textContent = cfg.title;
  hdr.appendChild(title);
  if (cfg.badge) {
    const badge = document.createElement('span');
    badge.className = 'mn-admin-sidebar__header-badge';
    badge.textContent = cfg.badge;
    hdr.appendChild(badge);
  }
  return hdr;
}

/** Build search input element. */
export function buildSearch(
  cfg: NonNullable<AdminShellOpts['sidebar']['search']>,
  ac: AbortController,
  onInput: (q: string) => void,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'mn-admin-sidebar__search';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'mn-admin-sidebar__search-input';
  input.placeholder = cfg.placeholder ?? 'Find...';
  input.setAttribute('aria-label', cfg.placeholder ?? 'Find...');
  wrap.appendChild(input);
  if (cfg.shortcut) {
    const kbd = document.createElement('kbd');
    kbd.className = 'mn-admin-sidebar__search-kbd';
    kbd.textContent = cfg.shortcut;
    wrap.appendChild(kbd);
  }
  input.addEventListener('input', () => onInput(input.value), { signal: ac.signal });
  return wrap;
}

/** Build a single nav button. */
export function buildNavItem(
  item: AdminShellNavItem,
  active: boolean,
  ac: AbortController,
  onClick: (id: string) => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mn-admin-nav-item';
  if (active) btn.classList.add('mn-admin-nav-item--active');
  btn.dataset.navId = item.id;
  if (active) btn.setAttribute('aria-current', 'page');

  const ico = document.createElement('span');
  ico.className = 'mn-admin-nav-item__icon';
  ico.innerHTML = icons[item.icon]?.() ?? '';
  btn.appendChild(ico);

  const label = document.createElement('span');
  label.className = 'mn-admin-nav-item__label';
  label.textContent = item.label;
  btn.appendChild(label);

  if (item.badge != null) {
    const badge = document.createElement('span');
    badge.className = 'mn-admin-nav-item__badge';
    badge.textContent = String(item.badge);
    btn.appendChild(badge);
  }

  btn.addEventListener('click', () => onClick(item.id), { signal: ac.signal });
  return btn;
}

/** Build the topbar with breadcrumb and title. */
export function buildTopbar(
  pageLabel: string,
): { el: HTMLElement; breadcrumbEl: HTMLElement; titleEl: HTMLElement } {
  const bar = document.createElement('div');
  bar.className = 'mn-admin-topbar';
  const breadcrumb = document.createElement('span');
  breadcrumb.className = 'mn-admin-topbar__breadcrumb';
  breadcrumb.textContent = 'Admin';
  bar.appendChild(breadcrumb);
  const sep = document.createElement('span');
  sep.className = 'mn-admin-topbar__sep';
  sep.textContent = '\u203A';
  bar.appendChild(sep);
  const title = document.createElement('span');
  title.className = 'mn-admin-topbar__title';
  title.textContent = pageLabel;
  bar.appendChild(title);
  return { el: bar, breadcrumbEl: breadcrumb, titleEl: title };
}
