/**
 * Maranello Luce Design - Data table logic
 * Sorting, filtering, grouping, and rendering orchestration.
 */

import type { DataTableOptions } from './core/types';
import { buildRow, buildGroupHeader, buildPagination, buildEmptyRow } from './data-table-render';
import type { DataTableState } from './data-table-render';

export function compare(a: unknown, b: unknown, dir: number): number {
  if (a == null && b == null) return 0;
  if (a == null) return dir;
  if (b == null) return -dir;
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir;
  return String(a).localeCompare(String(b)) * dir;
}

export function matchFilter(val: unknown, query: string): boolean {
  if (!query) return true;
  return String(val ?? '').toLowerCase().includes(query.toLowerCase());
}

export function handleSort(
  key: string, ci: number, state: DataTableState, headerRow: HTMLElement, renderFn: () => void,
  onSort?: (key: string, dir: 'asc' | 'desc') => void,
): void {
  if (state.sortKey === key) state.sortDir = state.sortDir === 1 ? -1 : 1;
  else { state.sortKey = key; state.sortDir = 1; }
  headerRow.querySelectorAll<HTMLElement>('.mn-dt__th').forEach((th, i) => {
    if (i === ci) {
      th.setAttribute('aria-sort', state.sortDir === 1 ? 'ascending' : 'descending');
      th.classList.add('mn-dt__th--sorted');
      th.classList.toggle('mn-dt__th--desc', state.sortDir === -1);
    } else {
      th.setAttribute('aria-sort', 'none');
      th.classList.remove('mn-dt__th--sorted', 'mn-dt__th--desc');
    }
  });
  if (onSort) onSort(key, state.sortDir === 1 ? 'asc' : 'desc');
  renderFn();
}

export function handleFilter(
  key: string, val: string, state: DataTableState, renderFn: () => void,
  onFilter?: (filters: Record<string, string>) => void,
): void {
  if (val) state.filters[key] = val;
  else delete state.filters[key];
  state.page = 0;
  if (onFilter) onFilter({ ...state.filters });
  renderFn();
}

export function getProcessedData<RowT extends Record<string, unknown>>(state: DataTableState<RowT>): RowT[] {
  let rows = state.data.slice();
  const filterKeys = Object.keys(state.filters);
  if (filterKeys.length > 0) rows = rows.filter((row) => filterKeys.every((k) => matchFilter(row[k], state.filters[k])));
  if (state.sortKey !== null) rows.sort((a, b) => compare(a[state.sortKey as string], b[state.sortKey as string], state.sortDir));
  return rows;
}

interface GroupResult<RowT> { groups: Record<string, RowT[]>; order: string[] }

export function getGroupedData<RowT extends Record<string, unknown>>(
  rows: RowT[], groupBy?: string, groupOrder?: string[],
): GroupResult<RowT> | null {
  if (!groupBy) return null;
  const groups: Record<string, RowT[]> = {};
  const order: string[] = [];
  for (const row of rows) {
    const gv = String(row[groupBy] ?? 'Other');
    if (!groups[gv]) { groups[gv] = []; order.push(gv); }
    groups[gv].push(row);
  }
  if (groupOrder) order.sort((a, b) => {
    let ia = groupOrder.indexOf(a);
    let ib = groupOrder.indexOf(b);
    if (ia === -1) ia = 999;
    if (ib === -1) ib = 999;
    return ia - ib;
  });
  return { groups, order };
}

export function render<RowT extends Record<string, unknown>>(
  state: DataTableState<RowT>, opts: DataTableOptions<RowT>,
  tbody: HTMLTableSectionElement, paginationEl: HTMLDivElement | null, liveRegion?: HTMLElement,
): void {
  if (state.data == null) console.warn('[Maranello] dataTable: data is null or undefined');
  tbody.innerHTML = '';
  const rows = getProcessedData(state);
  const grouped = getGroupedData(rows, opts.groupBy, opts.groupOrder);
  const colSpan = opts.columns.length;
  const renderFn = () => render(state, opts, tbody, paginationEl, liveRegion);

  if (rows.length === 0) {
    tbody.appendChild(buildEmptyRow(opts.emptyMessage ?? 'No data found', colSpan));
    buildPagination(0, paginationEl, opts.pageSize ?? 0, state, renderFn);
    announce('Showing 0 of ' + state.data.length + ' rows', liveRegion);
    return;
  }

  if (grouped) {
    let rowIdx = 0;
    for (const gname of grouped.order) {
      const grow = grouped.groups[gname];
      const isCollapsed = state.groupCollapsed[gname] === true || state.expandedGroups[gname] === false;
      const isExpanded = !isCollapsed;
      const header = buildGroupHeader(gname, grow.length, isExpanded, colSpan, state, renderFn);
      header.setAttribute('data-group', gname);
      tbody.appendChild(header);
      if (isExpanded) for (const row of grow) tbody.appendChild(buildRow(row, rowIdx++, opts, state, tbody));
      else rowIdx += grow.length;
    }
    buildPagination(rows.length, paginationEl, opts.pageSize ?? 0, state, renderFn);
  } else {
    const pageSize = opts.pageSize ?? 0;
    const start = pageSize > 0 ? state.page * pageSize : 0;
    const end = pageSize > 0 ? Math.min(start + pageSize, rows.length) : rows.length;
    for (let i = start; i < end; i++) tbody.appendChild(buildRow(rows[i], i, opts, state, tbody));
    buildPagination(rows.length, paginationEl, pageSize, state, renderFn);
  }

  const totalData = state.data.length;
  const hasFilters = Object.keys(state.filters).length > 0;
  const sortDir = state.sortDir === 1 ? 'ascending' : 'descending';
  const pgSize = opts.pageSize ?? 0;
  const totalPages = pgSize > 0 ? Math.ceil(rows.length / pgSize) : 1;
  let msg = state.sortKey && hasFilters
    ? 'Sorted by ' + state.sortKey + ' ' + sortDir + '. Showing ' + rows.length + ' of ' + totalData + ' rows'
    : state.sortKey
      ? 'Sorted by ' + state.sortKey + ' ' + sortDir
      : hasFilters
        ? 'Showing ' + rows.length + ' of ' + totalData + ' rows'
        : rows.length + ' rows';
  if (pgSize > 0) msg += '. Page ' + (state.page + 1) + ' of ' + totalPages;
  announce(msg, liveRegion);
}

function announce(msg: string, liveRegion?: HTMLElement): void {
  if (liveRegion) liveRegion.textContent = msg;
}
