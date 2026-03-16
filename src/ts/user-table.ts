/**
 * Maranello Luce Design - Admin user table
 * Rich, Stripe-quality user management table with search, selection,
 * avatar initials, status/role badges, and inline row actions.
 */

import { escapeHtml } from './core/sanitize';
import { debounce } from './core/utils';

export type UserRole = 'admin' | 'member' | 'viewer' | 'billing';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'invited';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive?: string;
  avatarUrl?: string;
  teams?: string[];
}

export interface UserTableOptions {
  searchable?: boolean;
  selectable?: boolean;
  onSelect?: (user: AdminUser) => void;
  onAction?: (user: AdminUser, action: 'edit' | 'suspend' | 'delete' | 'resend-invite') => void;
  pageSize?: number;
}

export interface UserTableController {
  update: (users: AdminUser[]) => void;
  setFilter: (query: string) => void;
  getSelected: () => AdminUser[];
  destroy: () => void;
}

const CLS = 'mn-user-table';
const AVATAR_COLORS = 6;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return Math.abs(h) % AVATAR_COLORS;
}

function statusLabel(s: UserStatus): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Render the teams badges (max 2 visible, +N overflow). */
function teamsHtml(teams: string[] | undefined): string {
  if (!teams || teams.length === 0) return '<span class="' + CLS + '__empty">&mdash;</span>';
  const visible = teams.slice(0, 2).map(t =>
    `<span class="${CLS}__team">${escapeHtml(t)}</span>`
  );
  if (teams.length > 2) visible.push(`<span class="${CLS}__team ${CLS}__team--more">+${teams.length - 2}</span>`);
  return visible.join('');
}

function avatarHtml(user: AdminUser): string {
  if (user.avatarUrl) {
    return `<img class="${CLS}__avatar" src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)}" />`;
  }
  const ci = nameHash(user.name);
  return `<div class="${CLS}__avatar ${CLS}__avatar--initials" data-color="${ci}">${escapeHtml(initials(user.name))}</div>`;
}

function actionsHtml(user: AdminUser): string {
  const sus = user.status === 'invited'
    ? `<button class="${CLS}__action" data-act="resend-invite" title="Resend invite" aria-label="Resend invite to ${escapeHtml(user.name)}">&#8617;</button>`
    : `<button class="${CLS}__action" data-act="suspend" title="Suspend" aria-label="Suspend ${escapeHtml(user.name)}">&#8856;</button>`;
  return `<div class="${CLS}__actions">`
    + `<button class="${CLS}__action" data-act="edit" title="Edit" aria-label="Edit ${escapeHtml(user.name)}">&#9998;</button>`
    + sus
    + `<button class="${CLS}__action ${CLS}__action--danger" data-act="delete" title="Delete" aria-label="Delete ${escapeHtml(user.name)}">&#10005;</button>`
    + `</div>`;
}

function rowHtml(user: AdminUser, selectable: boolean): string {
  const chk = selectable
    ? `<td class="${CLS}__td ${CLS}__td--check"><input type="checkbox" class="${CLS}__check" aria-label="Select ${escapeHtml(user.name)}" /></td>`
    : '';
  return `<tr class="${CLS}__row" role="row" tabindex="0" data-uid="${escapeHtml(user.id)}">`
    + chk
    + `<td class="${CLS}__td ${CLS}__td--user"><div class="${CLS}__identity">${avatarHtml(user)}<div class="${CLS}__name-group"><span class="${CLS}__name">${escapeHtml(user.name)}</span><span class="${CLS}__email">${escapeHtml(user.email)}</span></div></div></td>`
    + `<td class="${CLS}__td"><span class="${CLS}__status ${CLS}__status--${user.status}" aria-label="Status: ${statusLabel(user.status)}">${statusLabel(user.status)}</span></td>`
    + `<td class="${CLS}__td"><span class="${CLS}__role">${escapeHtml(user.role)}</span></td>`
    + `<td class="${CLS}__td ${CLS}__td--teams">${teamsHtml(user.teams)}</td>`
    + `<td class="${CLS}__td ${CLS}__td--last">${user.lastActive ? escapeHtml(user.lastActive) : '&mdash;'}</td>`
    + `<td class="${CLS}__td ${CLS}__td--actions">${actionsHtml(user)}</td>`
    + `</tr>`;
}

/** Create a rich admin user table inside the given element. */
export function userTable(
  el: HTMLElement,
  users: AdminUser[],
  opts?: UserTableOptions,
): UserTableController {
  const o = { searchable: true, selectable: true, pageSize: 10, ...opts };
  const ac = new AbortController();
  const sig = ac.signal;
  let data = users.slice();
  let filtered = data;
  let selected = new Set<string>();
  let query = '';

  function applyFilter(): void {
    const q = query.toLowerCase();
    filtered = q ? data.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : data;
  }

  function renderCount(): void {
    const badge = el.querySelector(`.${CLS}__count`);
    if (badge) badge.textContent = `${filtered.length} user${filtered.length !== 1 ? 's' : ''}`;
  }

  function renderBody(): void {
    const tbody = el.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = filtered.map(u => rowHtml(u, o.selectable)).join('');
    renderCount();
    // Restore checkbox state
    if (o.selectable) {
      tbody.querySelectorAll<HTMLInputElement>(`.${CLS}__check`).forEach(cb => {
        const uid = cb.closest('tr')?.dataset.uid ?? '';
        cb.checked = selected.has(uid);
      });
    }
  }

  // Build toolbar
  const toolbar = o.searchable
    ? `<div class="${CLS}__toolbar"><input type="search" class="${CLS}__search" placeholder="Search users\u2026" aria-label="Search users" /><span class="${CLS}__count"></span></div>`
    : `<div class="${CLS}__toolbar"><span class="${CLS}__count"></span></div>`;

  const thCheck = o.selectable ? `<th class="${CLS}__th ${CLS}__th--check" scope="col"><input type="checkbox" class="${CLS}__check-all" aria-label="Select all" /></th>` : '';
  const head = `<thead><tr role="row">${thCheck}<th class="${CLS}__th" scope="col">User</th><th class="${CLS}__th" scope="col">Status</th><th class="${CLS}__th" scope="col">Role</th><th class="${CLS}__th ${CLS}__th--teams" scope="col">Teams</th><th class="${CLS}__th" scope="col">Last active</th><th class="${CLS}__th ${CLS}__th--actions" scope="col"><span class="mn-sr-only">Actions</span></th></tr></thead>`;

  el.innerHTML = toolbar + `<div class="${CLS}__wrap"><table class="${CLS}" role="table">${head}<tbody></tbody></table></div>`;

  applyFilter();
  renderBody();

  // Search handler
  if (o.searchable) {
    const input = el.querySelector<HTMLInputElement>(`.${CLS}__search`);
    const handler = debounce((e: Event) => {
      query = (e.target as HTMLInputElement).value;
      applyFilter();
      renderBody();
    }, 150);
    input?.addEventListener('input', handler, { signal: sig });
  }

  // Delegated click on tbody for row select + actions
  const tbody = el.querySelector('tbody') as HTMLTableSectionElement;
  tbody.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const actionBtn = target.closest<HTMLButtonElement>(`.${CLS}__action`);
    if (actionBtn) {
      e.stopPropagation();
      const uid = actionBtn.closest('tr')?.dataset.uid ?? '';
      const user = data.find(u => u.id === uid);
      const act = actionBtn.dataset.act as 'edit' | 'suspend' | 'delete' | 'resend-invite';
      if (user && o.onAction) o.onAction(user, act);
      return;
    }
    const checkbox = target.closest<HTMLInputElement>(`.${CLS}__check`);
    if (checkbox) {
      const uid = checkbox.closest('tr')?.dataset.uid ?? '';
      if (checkbox.checked) selected.add(uid); else selected.delete(uid);
      return;
    }
    const row = target.closest<HTMLTableRowElement>(`.${CLS}__row`);
    if (row) {
      const uid = row.dataset.uid ?? '';
      const user = data.find(u => u.id === uid);
      if (user && o.onSelect) o.onSelect(user);
    }
  }, { signal: sig });

  // Keyboard: Enter/Space on row triggers onSelect
  tbody.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const row = (e.target as HTMLElement).closest<HTMLTableRowElement>(`.${CLS}__row`);
    if (!row) return;
    e.preventDefault();
    const uid = row.dataset.uid ?? '';
    const user = data.find(u => u.id === uid);
    if (user && o.onSelect) o.onSelect(user);
  }, { signal: sig });

  // Select-all checkbox
  if (o.selectable) {
    const checkAll = el.querySelector<HTMLInputElement>(`.${CLS}__check-all`);
    checkAll?.addEventListener('change', () => {
      const checked = checkAll.checked;
      selected = checked ? new Set(filtered.map(u => u.id)) : new Set();
      tbody.querySelectorAll<HTMLInputElement>(`.${CLS}__check`).forEach(cb => { cb.checked = checked; });
    }, { signal: sig });
  }

  return {
    update(users: AdminUser[]): void {
      data = users.slice();
      selected.clear();
      applyFilter();
      renderBody();
    },
    setFilter(q: string): void {
      query = q;
      const input = el.querySelector<HTMLInputElement>(`.${CLS}__search`);
      if (input) input.value = q;
      applyFilter();
      renderBody();
    },
    getSelected(): AdminUser[] {
      return data.filter(u => selected.has(u.id));
    },
    destroy(): void {
      ac.abort();
      el.innerHTML = '';
    },
  };
}
