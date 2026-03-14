/**
 * Maranello Luce Design - Data table renderers
 * Cell renderers, row builders, pagination, and DOM helpers.
 */

import type { DataTableColumn, DataTableOptions } from './core/types';
import { createElement } from './core/utils';
import { escapeHtml, isValidColor, sanitizeHtml } from './core/sanitize';

export interface DataTableStatusMeta { cls: string; icon: string }
export interface DataTableState<RowT = Record<string, unknown>> {
  data: RowT[];
  sortKey: string | null;
  sortDir: number;
  filters: Record<string, string>;
  page: number;
  expandedGroups: Record<string, boolean>;
  selected: number | null;
  colHighlight: number;
}

export const STATUS_MAP: Record<string, DataTableStatusMeta> = {
  'active': { cls: 'active', icon: '\u25CF' },
  'stage 3': { cls: 'active', icon: '\u25CF' },
  'completed': { cls: 'active', icon: '\u2713' },
  'at risk': { cls: 'warning', icon: '\u25CF' },
  'warning': { cls: 'warning', icon: '\u25B2' },
  'blocked': { cls: 'danger', icon: '\u25CF' },
  'on hold': { cls: 'danger', icon: '\u25A0' },
  'stage 1': { cls: 'info', icon: '\u25CF' },
  'stage 2': { cls: 'info', icon: '\u25CF' },
  'planned': { cls: 'info', icon: '\u25CB' },
  'stage 4': { cls: 'warning', icon: '\u25CF' },
};

export function el(tag: string, cls: string, attrs?: Record<string, string>): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = escapeHtml(String(v));
      else e.setAttribute(k, v);
    }
  }
  return e;
}

export function escHtml(s: unknown): string {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const cellRenderers: Record<string, (val: unknown, row?: unknown, col?: unknown) => string> = {
  text: (val) => '<span class="mn-dt__cell-text">' + escHtml(val) + '</span>',
  number: (val) => '<span class="mn-dt__cell-number">' + escHtml(val) + '</span>',
  status: (val) => {
    const key = String(val ?? '').toLowerCase();
    const st = STATUS_MAP[key] ?? { cls: 'info', icon: '\u25CF' };
    return '<span class="mn-status mn-status--' + st.cls + '"><span class="mn-status__dot"></span> ' + escHtml(val) + '</span>';
  },
  progress: (val) => {
    const pct = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
    const cls = pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red';
    return '<div class="mn-dt__cell-progress"><div class="mn-progress" style="width:64px">'
      + '<div class="mn-progress__fill mn-progress__fill--' + cls + '" style="width:' + pct + '%"></div></div>'
      + '<span class="mn-dt__cell-pct">' + Math.round(pct) + '%</span></div>';
  },
  date: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const d = new Date(String(val));
    return '<span class="mn-dt__cell-date">' + String(d.getDate()).padStart(2, '0') + '/'
      + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getFullYear()).slice(2) + '</span>';
  },
  tag: (val) => !val ? '' : '<span class="mn-tag mn-tag--light mn-tag--xs">' + escHtml(val) + '</span>',
  person: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const initials = String(val).split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    return '<div class="mn-dt__cell-person"><span class="mn-dt__avatar">' + initials
      + '</span><span class="mn-dt__cell-text">' + escHtml(val) + '</span></div>';
  },
  badge: (val) => {
    if (val == null) return '<span class="mn-dt__cell-text">\u2014</span>';
    const num = Number(val);
    const cls = num >= 7 ? 'green' : num >= 4 ? 'yellow' : 'red';
    return '<span class="mn-dt__badge mn-dt__badge--' + cls + '">' + escHtml(val) + '</span>';
  },
  custom: (val, row, col) => {
    const c = col as DataTableColumn | undefined;
    if (c?.render) {
      // Sanitize custom renderer output before innerHTML assignment to prevent XSS
      const raw = String(c.render(val, row as Record<string, unknown>));
      const safe = sanitizeHtml(raw);
      return safe.replace(/style="[^"]*color:\s*([^;"]+)/g, (match, colorVal) => {
        return isValidColor(colorVal.trim()) ? match : match.replace(colorVal, 'inherit');
      });
    }
    return escHtml(val);
  },
};

export function buildRow<RowT extends Record<string, unknown>>(
  row: RowT, rowIdx: number, opts: DataTableOptions<RowT>,
  state: DataTableState<RowT>, tbody: HTMLTableSectionElement,
): HTMLTableRowElement {
  const tr = el('tr', 'mn-dt__row') as HTMLTableRowElement;
  tr.setAttribute('role', 'row');
  tr.setAttribute('data-row-idx', String(rowIdx));
  if (opts.selectable) { tr.classList.add('mn-dt__row--selectable'); tr.setAttribute('tabindex', '0'); }
  if (state.selected === rowIdx) tr.classList.add('mn-dt__row--selected');
  if (opts.stripedRows && rowIdx % 2 === 1) tr.classList.add('mn-dt__row--striped');
  opts.columns.forEach((col, ci) => {
    const td = el('td', 'mn-dt__td');
    td.setAttribute('role', 'gridcell');
    td.setAttribute('data-col', String(ci));
    if (col.align === 'right') td.style.textAlign = 'right';
    if (col.align === 'center') td.style.textAlign = 'center';
    const renderer = cellRenderers[col.type ?? 'text'] ?? cellRenderers.text;
    td.innerHTML = renderer(row[col.key], row, col);
    tr.appendChild(td);
  });
  tr.addEventListener('click', () => {
    state.selected = rowIdx;
    tbody.querySelectorAll('.mn-dt__row--selected').forEach((r) => r.classList.remove('mn-dt__row--selected'));
    tr.classList.add('mn-dt__row--selected');
    if (opts.onRowClick) opts.onRowClick(row, rowIdx);
  });
  tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); tr.click(); } });
  if (opts.crosshair) {
    tr.addEventListener('mouseenter', () => {
      const prev = tbody.querySelector('.mn-dt__row--hovered');
      if (prev) prev.classList.remove('mn-dt__row--hovered');
      tr.classList.add('mn-dt__row--hovered');
    });
  }
  return tr;
}

export function buildGroupHeader(
  groupName: string, count: number, isExpanded: boolean,
  colSpan: number, state: DataTableState,
  renderFn: () => void,
): HTMLTableRowElement {
  const tr = el('tr', 'mn-dt__group-row') as HTMLTableRowElement;
  tr.setAttribute('role', 'row');
  const td = el('td', 'mn-dt__group-cell');
  td.setAttribute('colspan', String(colSpan));
  td.setAttribute('role', 'gridcell');
  const chevron = el('span', 'mn-dt__group-chevron' + (isExpanded ? ' mn-dt__group-chevron--open' : ''));
  chevron.innerHTML = '\u25B8';
  const statusDot = el('span', 'mn-dt__group-dot');
  const st = STATUS_MAP[groupName.toLowerCase()];
  if (st) statusDot.classList.add('mn-dt__group-dot--' + st.cls);
  const label = el('span', 'mn-dt__group-label', { text: groupName.toUpperCase() });
  const badge = el('span', 'mn-dt__group-count', { text: String(count) });
  [chevron, statusDot, label, badge].forEach((n) => { td.appendChild(document.createTextNode(' ')); td.appendChild(n); });
  tr.appendChild(td);
  tr.style.cursor = 'pointer';
  tr.setAttribute('tabindex', '0');
  tr.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  tr.addEventListener('click', () => { state.expandedGroups[groupName] = !state.expandedGroups[groupName]; renderFn(); });
  tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tr.click(); } });
  return tr;
}

export function buildPagination(
  totalRows: number, paginationEl: HTMLDivElement | null,
  pageSize: number, state: DataTableState, renderFn: () => void,
): void {
  if (!paginationEl || pageSize <= 0) return;
  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(totalRows / pageSize);
  if (totalPages <= 1) return;
  const srTotal = el('span', 'mn-sr-only', { text: totalRows + ' total rows' });
  const prevBtn = el('button', 'mn-dt__page-btn', { text: '\u2190', 'aria-label': 'Previous page' }) as HTMLButtonElement;
  prevBtn.disabled = state.page === 0;
  prevBtn.addEventListener('click', () => { if (state.page > 0) { state.page--; renderFn(); } });
  paginationEl.appendChild(prevBtn);
  paginationEl.appendChild(srTotal);

  // Render up to 5 numbered page buttons with a sliding window
  const windowSize = 5;
  let winStart = Math.max(0, state.page - Math.floor(windowSize / 2));
  const winEnd = Math.min(totalPages, winStart + windowSize);
  if (winEnd - winStart < windowSize) winStart = Math.max(0, winEnd - windowSize);
  for (let p = winStart; p < winEnd; p++) {
    const isActive = p === state.page;
    const pageBtn = el('button', 'mn-dt__page-btn' + (isActive ? ' mn-dt__page-btn--active' : ''), {
      text: String(p + 1),
      'aria-label': 'Page ' + (p + 1),
    }) as HTMLButtonElement;
    if (isActive) {
      pageBtn.setAttribute('aria-current', 'page');
      pageBtn.disabled = true;
    }
    const captured = p;
    pageBtn.addEventListener('click', () => { state.page = captured; renderFn(); });
    paginationEl.appendChild(pageBtn);
  }

  const nextBtn = el('button', 'mn-dt__page-btn', { text: '\u2192', 'aria-label': 'Next page' }) as HTMLButtonElement;
  nextBtn.disabled = state.page >= totalPages - 1;
  nextBtn.addEventListener('click', () => { if (state.page < totalPages - 1) { state.page++; renderFn(); } });
  paginationEl.appendChild(nextBtn);
}

export function buildEmptyRow(emptyMessage: string, colSpan: number): HTMLTableRowElement {
  const tr = el('tr', 'mn-dt__empty-row') as HTMLTableRowElement;
  const td = el('td', 'mn-dt__empty-cell', { text: emptyMessage });
  td.setAttribute('colspan', String(colSpan));
  tr.appendChild(td);
  return tr;
}

export function positionColHighlight(
  ci: number, headerRow: HTMLElement,
  scrollWrap: HTMLElement, colHighlightEl: HTMLElement,
): void {
  const ths = headerRow.querySelectorAll<HTMLElement>('.mn-dt__th');
  if (ci < 0 || ci >= ths.length) { colHighlightEl.style.display = 'none'; return; }
  const th = ths[ci];
  const scrollRect = scrollWrap.getBoundingClientRect();
  const thRect = th.getBoundingClientRect();
  colHighlightEl.style.display = 'block';
  colHighlightEl.style.left = (thRect.left - scrollRect.left + scrollWrap.scrollLeft) + 'px';
  colHighlightEl.style.width = thRect.width + 'px';
  colHighlightEl.style.top = '0';
  colHighlightEl.style.height = scrollWrap.scrollHeight + 'px';
}
