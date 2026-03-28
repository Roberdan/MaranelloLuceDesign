/**
 * Maranello Luce Design - Data table renderers
 * Cell renderers, row builders, pagination, and DOM helpers.
 */

import type { DataTableOptions } from './core/types';
import { escapeHtml } from './core/sanitize';
import { eventBus } from './core/events';
import { cellRenderers } from './data-table-cells';

export interface DataTableStatusMeta { cls: string; icon: string }
export interface DataTableState<RowT = Record<string, unknown>> {
  data: RowT[];
  sortKey: string | null;
  sortDir: number;
  filters: Record<string, string>;
  page: number;
  expandedGroups: Record<string, boolean>;
  groupCollapsed: Record<string, boolean>;
  selected: number | null;
  colHighlight: number;
}

export const STATUS_MAP: Record<string, DataTableStatusMeta> = {
  'active': { cls: 'active', icon: '\u25CF' }, 'stage 3': { cls: 'active', icon: '\u25CF' },
  'completed': { cls: 'active', icon: '\u2713' }, 'at risk': { cls: 'warning', icon: '\u25CF' },
  'warning': { cls: 'warning', icon: '\u25B2' }, 'blocked': { cls: 'danger', icon: '\u25CF' },
  'on hold': { cls: 'danger', icon: '\u25A0' }, 'stage 1': { cls: 'info', icon: '\u25CF' },
  'stage 2': { cls: 'info', icon: '\u25CF' }, 'planned': { cls: 'info', icon: '\u25CB' },
  'stage 4': { cls: 'warning', icon: '\u25CF' },
};

const V2_CELL_TYPES = ['metric', 'person', 'progress', 'action', 'link', 'icon'];
void V2_CELL_TYPES;

export { cellRenderers };

export function el(tag: string, cls: string, attrs?: Record<string, string>): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') e.textContent = v;
    else if (k === 'html') e.innerHTML = escapeHtml(String(v));
    else e.setAttribute(k, v);
  }
  return e;
}

export function escHtml(s: unknown): string {
  return s == null ? '' : escapeHtml(String(s));
}

export function buildRow<RowT extends Record<string, unknown>>(
  row: RowT, rowIdx: number, opts: DataTableOptions<RowT>, state: DataTableState<RowT>, tbody: HTMLTableSectionElement,
): HTMLTableRowElement {
  const tr = el('tr', 'mn-dt__row') as HTMLTableRowElement;
  tr.setAttribute('role', 'row');
  tr.setAttribute('data-row-idx', String(rowIdx));
  if (opts.selectable) tr.classList.add('mn-dt__row--selectable');
  if (opts.onDrillDown) tr.classList.add('mn-dt__row--drilldown');
  if (opts.selectable || opts.onDrillDown) tr.setAttribute('tabindex', '0');
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
    if (col.type === 'action') td.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const btn = t.closest<HTMLButtonElement>('.mn-dt__action-btn');
      if (!btn) return;
      e.stopPropagation();
      const detail = { actionId: btn.dataset.actionId ?? '', row };
      eventBus.emit('table-action', detail);
      tr.dispatchEvent(new CustomEvent('mn:table-action', { detail, bubbles: true }));
    });
    if (opts.onCellClick) {
      td.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = row[col.key];
        opts.onCellClick!(row, col, value);
        tr.dispatchEvent(new CustomEvent('mn:table-cell-click', {
          detail: { row, column: col, value }, bubbles: true,
        }));
      });
    }
    tr.appendChild(td);
  });

  tr.addEventListener('click', () => {
    state.selected = rowIdx;
    tbody.querySelectorAll('.mn-dt__row--selected').forEach((r) => r.classList.remove('mn-dt__row--selected'));
    tr.classList.add('mn-dt__row--selected');
    if (opts.onRowClick) opts.onRowClick(row, rowIdx);
  });

  const triggerDrill = (event: Event): void => {
    if (!opts.onDrillDown) return;
    opts.onDrillDown(row, event);
    eventBus.emit('table-drilldown', { row, event });
    tr.dispatchEvent(new CustomEvent('mn:table-drilldown', { detail: { row, event }, bubbles: true }));
  };

  tr.addEventListener('dblclick', triggerDrill);
  tr.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    tr.click();
    triggerDrill(e);
  });

  if (opts.crosshair) tr.addEventListener('mouseenter', () => {
    const prev = tbody.querySelector('.mn-dt__row--hovered');
    if (prev) prev.classList.remove('mn-dt__row--hovered');
    tr.classList.add('mn-dt__row--hovered');
  });

  return tr;
}

export function buildGroupHeader(
  groupName: string, count: number, isExpanded: boolean, colSpan: number, state: DataTableState, renderFn: () => void,
): HTMLTableRowElement {
  const tr = el('tr', 'mn-dt__group-row') as HTMLTableRowElement;
  tr.setAttribute('role', 'rowgroup');
  tr.setAttribute('tabindex', '0');
  tr.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  const td = el('td', 'mn-dt__group-cell');
  td.setAttribute('colspan', String(colSpan));
  const statusCls = STATUS_MAP[groupName.toLowerCase()]?.cls;
  td.innerHTML = '<span class="mn-dt__group-chevron' + (isExpanded ? ' mn-dt__group-chevron--open' : '') + '">\u25B8</span>'
    + '<span class="mn-dt__group-dot' + (statusCls ? ' mn-dt__group-dot--' + statusCls : '') + '"></span>'
    + '<span class="mn-dt__group-label">' + escHtml(groupName.toUpperCase()) + '</span>'
    + '<span class="mn-dt__group-count">' + count + '</span>';
  tr.appendChild(td);
  const toggle = () => {
    const nextCollapsed = isExpanded;
    state.groupCollapsed[groupName] = nextCollapsed;
    state.expandedGroups[groupName] = !nextCollapsed;
    renderFn();
  };
  tr.addEventListener('click', toggle);
  tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  return tr;
}

export function buildPagination(
  totalRows: number, paginationEl: HTMLDivElement | null, pageSize: number, state: DataTableState, renderFn: () => void,
): void {
  if (!paginationEl || pageSize <= 0) return;
  paginationEl.innerHTML = '';
  const totalPages = Math.ceil(totalRows / pageSize);
  if (totalPages <= 1) return;
  const prevBtn = el('button', 'mn-dt__page-btn', { text: '\u2190', 'aria-label': 'Previous page' }) as HTMLButtonElement;
  prevBtn.disabled = state.page === 0;
  prevBtn.addEventListener('click', () => { if (state.page > 0) { state.page--; renderFn(); } });
  paginationEl.appendChild(prevBtn);
  const windowSize = 5;
  let winStart = Math.max(0, state.page - Math.floor(windowSize / 2));
  const winEnd = Math.min(totalPages, winStart + windowSize);
  if (winEnd - winStart < windowSize) winStart = Math.max(0, winEnd - windowSize);
  for (let p = winStart; p < winEnd; p++) {
    const pageBtn = el('button', 'mn-dt__page-btn' + (p === state.page ? ' mn-dt__page-btn--active' : ''), {
      text: String(p + 1), 'aria-label': 'Page ' + (p + 1),
    }) as HTMLButtonElement;
    if (p === state.page) { pageBtn.setAttribute('aria-current', 'page'); pageBtn.disabled = true; }
    pageBtn.addEventListener('click', () => { state.page = p; renderFn(); });
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
  ci: number, headerRow: HTMLElement, scrollWrap: HTMLElement, colHighlightEl: HTMLElement,
): void {
  const ths = headerRow.querySelectorAll<HTMLElement>('.mn-dt__th');
  if (ci < 0 || ci >= ths.length) { colHighlightEl.style.display = 'none'; return; }
  const thRect = ths[ci].getBoundingClientRect();
  const scrollRect = scrollWrap.getBoundingClientRect();
  colHighlightEl.style.display = 'block';
  colHighlightEl.style.left = (thRect.left - scrollRect.left + scrollWrap.scrollLeft) + 'px';
  colHighlightEl.style.width = thRect.width + 'px';
  colHighlightEl.style.top = '0';
  colHighlightEl.style.height = scrollWrap.scrollHeight + 'px';
}
