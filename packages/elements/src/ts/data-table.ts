/**
 * Maranello Luce Design - Data table factory
 * Creates a full-featured data table with sorting, filtering,
 * grouping, pagination, and crosshair highlighting.
 */

import type { DataTableOptions, DataTableController } from './core/types';
import { el, positionColHighlight } from './data-table-render';
import type { DataTableState } from './data-table-render';
import { handleSort, handleFilter, getProcessedData, render } from './data-table-logic';

/** Create a data table in the given container. */
export function dataTable<RowT extends Record<string, unknown>>(
  container: HTMLElement | string,
  opts: DataTableOptions<RowT>,
): DataTableController<RowT> | null {
  const resolved: DataTableOptions<RowT> = {
    data: [],
    pageSize: 0,
    selectable: true,
    crosshair: true,
    stickyHeader: true,
    compact: false,
    emptyMessage: 'No data found',
    showFilters: true,
    stripedRows: false,
    resizableColumns: false,
    ...opts,
  };

  let containerEl: HTMLElement;
  if (typeof container === 'string') {
    const found = document.querySelector(container);
    if (!(found instanceof HTMLElement)) return null;
    containerEl = found;
  } else {
    containerEl = container;
  }

  const state: DataTableState<RowT> = {
    data: (resolved.data ?? []).slice(),
    sortKey: null,
    sortDir: 1,
    filters: {},
    page: 0,
    expandedGroups: {},
    groupCollapsed: {},
    selected: null,
    colHighlight: -1,
  };

  containerEl.innerHTML = '';
  containerEl.classList.add('mn-dt');
  if (resolved.compact) containerEl.classList.add('mn-dt--compact');
  if (resolved.crosshair) containerEl.classList.add('mn-dt--crosshair');
  if (resolved.onDrillDown) containerEl.classList.add('mn-dt--drilldown');

  const scrollWrap = el('div', 'mn-dt__scroll');
  const table = el('table', 'mn-dt__table');
  table.setAttribute('role', 'grid');
  table.setAttribute('aria-label', resolved.ariaLabel ?? 'Data table');

  const thead = el('thead', 'mn-dt__head');
  const headerRow = el('tr', 'mn-dt__header-row');
  headerRow.setAttribute('role', 'row');
  const filterRow = resolved.showFilters ? el('tr', 'mn-dt__filter-row') : null;
  if (filterRow) filterRow.setAttribute('role', 'row');

  const tbody = el('tbody', 'mn-dt__body') as HTMLTableSectionElement;
  tbody.setAttribute('role', 'rowgroup');

  const liveRegion = el('div', 'mn-sr-only');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');

  function doRender(): void { render(state, resolved, tbody, paginationEl, liveRegion); }

  resolved.columns.forEach((col, ci) => {
    const th = el('th', 'mn-dt__th');
    th.setAttribute('role', 'columnheader');
    th.setAttribute('scope', 'col');
    th.setAttribute('data-col', String(ci));
    if (col.width) th.style.width = typeof col.width === 'number' ? col.width + 'px' : String(col.width);
    if (col.minWidth) th.style.minWidth = typeof col.minWidth === 'number' ? col.minWidth + 'px' : String(col.minWidth);
    if (col.align === 'right') th.style.textAlign = 'right';
    if (col.align === 'center') th.style.textAlign = 'center';

    const label = el('span', 'mn-dt__th-label', { text: col.label ?? col.key });
    if (col.sortable) {
      th.classList.add('mn-dt__th--sortable');
      th.setAttribute('tabindex', '0');
      th.setAttribute('aria-sort', 'none');
      th.appendChild(label);
      th.appendChild(el('span', 'mn-dt__sort-icon', { html: '\u21C5' }));
      th.addEventListener('click', () => handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort));
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort);
        }
      });
    } else {
      th.appendChild(label);
    }
    headerRow.appendChild(th);

    if (filterRow) {
      const ftd = el('th', 'mn-dt__filter-cell');
      ftd.setAttribute('data-col', String(ci));
      if (col.filterable) {
        const input = el('input', 'mn-dt__filter-input') as HTMLInputElement;
        input.type = 'text';
        input.placeholder = 'Filter…';
        input.setAttribute('aria-label', 'Filter ' + (col.label ?? col.key));
        input.addEventListener('input', () => {
          handleFilter(col.key, input.value, state, doRender, resolved.onFilter);
        });
        ftd.appendChild(input);
      }
      filterRow.appendChild(ftd);
    }
  });

  thead.appendChild(headerRow);
  if (filterRow) thead.appendChild(filterRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  scrollWrap.appendChild(table);
  containerEl.appendChild(scrollWrap);
  containerEl.appendChild(liveRegion);

  let paginationEl: HTMLDivElement | null = null;
  if ((resolved.pageSize ?? 0) > 0) {
    paginationEl = el('div', 'mn-dt__pagination') as HTMLDivElement;
    containerEl.appendChild(paginationEl);
  }

  const colHighlightEl = el('div', 'mn-dt__col-highlight') as HTMLDivElement;
  colHighlightEl.style.display = 'none';
  scrollWrap.appendChild(colHighlightEl);

  if (resolved.crosshair) {
    tbody.addEventListener('mousemove', (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const td = target.closest('td');
      if (!td) return;
      const ci = td.cellIndex;
      if (ci !== state.colHighlight) {
        state.colHighlight = ci;
        positionColHighlight(ci, headerRow, scrollWrap, colHighlightEl);
      }
    });
    tbody.addEventListener('mouseleave', () => {
      state.colHighlight = -1;
      colHighlightEl.style.display = 'none';
      const prev = tbody.querySelector('.mn-dt__row--hovered');
      if (prev) prev.classList.remove('mn-dt__row--hovered');
    });
  }

  if (resolved.groupBy) {
    for (const row of state.data) {
      const v = row[resolved.groupBy as keyof RowT];
      if (v != null) {
        state.expandedGroups[String(v)] = true;
        state.groupCollapsed[String(v)] = false;
      }
    }
  }
  doRender();

  return {
    setData: (data) => { state.data = data.slice(); state.page = 0; doRender(); },
    addRow: (row) => { state.data.push(row); doRender(); },
    removeRow: (idx) => { state.data.splice(idx, 1); doRender(); },
    setFilter: (key, val) => handleFilter(key, val, state, doRender, resolved.onFilter),
    clearFilters: () => {
      state.filters = {};
      containerEl.querySelectorAll<HTMLInputElement>('.mn-dt__filter-input').forEach((inp) => { inp.value = ''; });
      doRender();
    },
    setGroup: (key) => { (resolved as unknown as Record<string, unknown>).groupBy = key; doRender(); },
    getSelected: () => state.selected != null ? [state.data[state.selected]] : [],
    getFilteredData: () => getProcessedData(state),
    refresh: () => doRender(),
    destroy: () => {
      containerEl.innerHTML = '';
      containerEl.classList.remove('mn-dt', 'mn-dt--compact', 'mn-dt--crosshair', 'mn-dt--drilldown');
    },
  };
}
