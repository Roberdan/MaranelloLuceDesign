/**
 * Maranello Luce Design — Audit Log component
 * Dense timeline-style log inspired by Stripe/GitHub audit UIs.
 */
import { escapeHtml } from './core/sanitize';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical' | 'success';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole?: string;
  action: string;
  resource?: string;
  severity: AuditSeverity;
  metadata?: Record<string, string>;
  ipAddress?: string;
}

export interface AuditLogOptions {
  maxEntries?: number;
  filterable?: boolean;
  onSelect?: (entry: AuditEntry) => void;
  live?: boolean;
}

export interface AuditLogController {
  prepend: (entry: AuditEntry) => void;
  append: (entry: AuditEntry) => void;
  setFilter: (severity: AuditSeverity | 'all') => void;
  clear: () => void;
  destroy: () => void;
}

const SEVERITIES: readonly AuditSeverity[] = ['info', 'warning', 'error', 'critical', 'success'];

const SEV_LABELS: Record<AuditSeverity | 'all', string> = {
  all: 'All', info: 'Info', warning: 'Warning',
  error: 'Error', critical: 'Critical', success: 'Success',
};

/** Build a single audit entry DOM node. */
function buildEntry(entry: AuditEntry, ac: AbortController, onSelect?: (e: AuditEntry) => void): HTMLElement {
  const li = document.createElement('li');
  li.className = 'mn-audit__entry';
  li.dataset.severity = entry.severity;
  li.dataset.id = entry.id;
  li.setAttribute('role', 'listitem');
  li.setAttribute('tabindex', '0');
  li.setAttribute('aria-expanded', 'false');

  const dot = document.createElement('span');
  dot.className = 'mn-audit__timeline-dot';
  dot.setAttribute('aria-hidden', 'true');

  const body = document.createElement('div');
  body.className = 'mn-audit__body';

  const meta = document.createElement('div');
  meta.className = 'mn-audit__meta';
  const ts = document.createElement('time');
  ts.className = 'mn-audit__timestamp';
  ts.textContent = entry.timestamp;
  const actorSpan = document.createElement('span');
  actorSpan.className = 'mn-audit__actor';
  actorSpan.innerHTML = escapeHtml(entry.actor)
    + (entry.actorRole ? ` <span class="mn-audit__actor-badge">${escapeHtml(entry.actorRole)}</span>` : '');
  meta.append(ts, actorSpan);

  const actionDiv = document.createElement('div');
  actionDiv.className = 'mn-audit__action';
  actionDiv.innerHTML = `<strong>${escapeHtml(entry.action)}</strong>`
    + (entry.resource ? ` <span class="mn-audit__resource">${escapeHtml(entry.resource)}</span>` : '');

  body.append(meta, actionDiv);

  /* Expandable metadata section */
  const expand = document.createElement('div');
  expand.className = 'mn-audit__expand';
  expand.setAttribute('aria-hidden', 'true');
  if (entry.metadata || entry.ipAddress) {
    const chips = document.createElement('div');
    chips.className = 'mn-audit__chips';
    const mkChip = (key: string, val: string) => {
      const c = document.createElement('span');
      c.className = 'mn-audit__chip';
      c.innerHTML = `<span class="mn-audit__chip-key">${escapeHtml(key)}</span> ${escapeHtml(val)}`;
      chips.appendChild(c);
    };
    if (entry.ipAddress) mkChip('IP', entry.ipAddress);
    if (entry.metadata) for (const [k, v] of Object.entries(entry.metadata)) mkChip(k, v);
    expand.appendChild(chips);
  }
  body.appendChild(expand);
  li.append(dot, body);

  const toggle = () => {
    const open = li.getAttribute('aria-expanded') === 'true';
    li.setAttribute('aria-expanded', String(!open));
    expand.setAttribute('aria-hidden', String(open));
    if (!open) onSelect?.(entry);
  };
  li.addEventListener('click', toggle, { signal: ac.signal });
  li.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape' && li.getAttribute('aria-expanded') === 'true') {
      li.setAttribute('aria-expanded', 'false');
      expand.setAttribute('aria-hidden', 'true');
    }
  }, { signal: ac.signal });

  return li;
}

/** Update count badges on filter tabs. */
function updateCounts(header: HTMLElement, list: HTMLElement): void {
  const items = list.querySelectorAll<HTMLElement>('.mn-audit__entry');
  const counts: Record<string, number> = { all: items.length };
  for (const sev of SEVERITIES) counts[sev] = 0;
  items.forEach(li => { const s = li.dataset.severity ?? ''; counts[s] = (counts[s] ?? 0) + 1; });
  header.querySelectorAll<HTMLElement>('.mn-audit__tab').forEach(tab => {
    const badge = tab.querySelector('.mn-audit__tab-count');
    if (badge) badge.textContent = String(counts[tab.dataset.filter ?? 'all'] ?? 0);
  });
}

/** Prune oldest entries beyond maxEntries limit. */
function prune(list: HTMLElement, max: number): void {
  while (list.children.length > max) list.removeChild(list.lastChild as Node);
}

export function auditLog(
  el: HTMLElement,
  entries: AuditEntry[] = [],
  opts: AuditLogOptions = {},
): AuditLogController {
  const max = opts.maxEntries ?? 100;
  const filterable = opts.filterable ?? true;
  const ac = new AbortController();
  let activeFilter: AuditSeverity | 'all' = 'all';

  el.classList.add('mn-audit');
  el.setAttribute('role', 'log');
  el.setAttribute('aria-label', 'Audit log');
  el.innerHTML = '';

  /* Header with filter tabs */
  const header = document.createElement('div');
  header.className = 'mn-audit__header';

  const tabBar = document.createElement('div');
  tabBar.className = 'mn-audit__tabs';
  tabBar.setAttribute('role', 'tablist');

  if (filterable) {
    for (const key of ['all' as const, ...SEVERITIES]) {
      const btn = document.createElement('button');
      btn.className = 'mn-audit__tab';
      btn.dataset.filter = key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', key === 'all' ? 'true' : 'false');
      btn.innerHTML = `${SEV_LABELS[key]} <span class="mn-audit__tab-count">0</span>`;
      tabBar.appendChild(btn);
    }
  }
  header.appendChild(tabBar);
  el.appendChild(header);

  /* Live region for screen readers */
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'mn-sr-only';
  el.appendChild(liveRegion);

  /* List container */
  const list = document.createElement('ul');
  list.className = 'mn-audit__list';
  list.setAttribute('role', 'list');
  el.appendChild(list);

  /* Render initial entries */
  for (const entry of entries) {
    list.appendChild(buildEntry(entry, ac, opts.onSelect));
  }
  prune(list, max);
  updateCounts(header, list);

  /* Tab click handler */
  const applyFilter = (sev: AuditSeverity | 'all') => {
    activeFilter = sev;
    tabBar.querySelectorAll<HTMLElement>('.mn-audit__tab').forEach(tab => {
      tab.setAttribute('aria-selected', tab.dataset.filter === sev ? 'true' : 'false');
    });
    list.querySelectorAll<HTMLElement>('.mn-audit__entry').forEach(li => {
      li.style.display = (sev === 'all' || li.dataset.severity === sev) ? '' : 'none';
    });
  };
  tabBar.addEventListener('click', (e: Event) => {
    const tab = (e.target as HTMLElement).closest<HTMLElement>('.mn-audit__tab');
    if (tab?.dataset.filter) applyFilter(tab.dataset.filter as AuditSeverity | 'all');
  }, { signal: ac.signal });

  const addEntry = (entry: AuditEntry, position: 'prepend' | 'append') => {
    const node = buildEntry(entry, ac, opts.onSelect);
    if (opts.live && position === 'prepend') node.classList.add('mn-audit__entry--slide-in');
    if (position === 'prepend') {
      list.insertBefore(node, list.firstChild);
      liveRegion.textContent = `${entry.actor}: ${entry.action}`;
    } else {
      list.appendChild(node);
    }
    if (activeFilter !== 'all' && entry.severity !== activeFilter) node.style.display = 'none';
    prune(list, max);
    updateCounts(header, list);
  };

  return {
    prepend: (entry) => addEntry(entry, 'prepend'),
    append: (entry) => addEntry(entry, 'append'),
    setFilter: applyFilter,
    clear: () => { list.innerHTML = ''; updateCounts(header, list); },
    destroy: () => { ac.abort(); el.innerHTML = ''; el.classList.remove('mn-audit'); },
  };
}
