/**
 * Maranello Luce Design - Filter panel DOM builder
 * Creates the dropdown structure: columns, items, footer.
 */

import { createElement } from './core/utils';
import { escapeHtml } from './core/sanitize';
import { isValidColor } from './core/sanitize';
import type { FilterPanelColumn, FilterPanelItem } from './filter-panel';

export interface FilterPanelDom {
  el: HTMLDivElement;
  columnEls: HTMLDivElement[];
  itemEls: HTMLDivElement[][];
}

/** Build a single item row inside a column. */
function buildItem(item: FilterPanelItem, selected: boolean): HTMLDivElement {
  const attrs: Record<string, string> = { role: 'option', tabindex: '-1' };
  if (item.value) attrs['data-value'] = item.value;
  const row = createElement('div', 'mn-filter-panel__item', attrs);
  if (selected) {
    row.setAttribute('aria-selected', 'true');
    row.classList.add('mn-filter-panel__item--selected');
  } else {
    row.setAttribute('aria-selected', 'false');
  }

  if (item.color) {
    const dot = createElement('span', 'mn-filter-panel__dot');
    if (isValidColor(item.color)) {
      dot.style.setProperty('--mn-dot-color', item.color);
    }
    row.appendChild(dot);
  }

  const label = createElement('span', 'mn-filter-panel__label');
  label.textContent = item.label;
  row.appendChild(label);

  if (item.count !== undefined) {
    const count = createElement('span', 'mn-filter-panel__count');
    count.textContent = String(item.count);
    row.appendChild(count);
  }

  const check = createElement('span', 'mn-filter-panel__check');
  check.setAttribute('aria-hidden', 'true');
  row.appendChild(check);

  return row;
}

/** Build a single column with title and item list. */
function buildColumn(col: FilterPanelColumn): { el: HTMLDivElement; itemEls: HTMLDivElement[] } {
  const wrapper = createElement('div', 'mn-filter-panel__column');

  const title = createElement('div', 'mn-filter-panel__column-title');
  title.textContent = col.title;
  wrapper.appendChild(title);

  const list = createElement('div', 'mn-filter-panel__list', {
    role: 'listbox',
    'aria-label': col.title,
  });
  if (col.type === 'multi-select') {
    list.setAttribute('aria-multiselectable', 'true');
  }

  const itemEls: HTMLDivElement[] = [];
  for (const item of col.items) {
    const row = buildItem(item, item.selected === true);
    itemEls.push(row);
    list.appendChild(row);
  }

  wrapper.appendChild(list);
  return { el: wrapper, itemEls };
}

/** Build the full filter panel dropdown. */
export function buildFilterPanel(
  columns: FilterPanelColumn[],
  onSave: () => void,
  onClear: () => void,
): FilterPanelDom {
  const el = createElement('div', 'mn-filter-panel', {
    role: 'dialog',
    'aria-label': 'Filter panel',
  });

  const colsWrap = createElement('div', 'mn-filter-panel__columns');
  const columnEls: HTMLDivElement[] = [];
  const itemEls: HTMLDivElement[][] = [];

  for (const col of columns) {
    const result = buildColumn(col);
    columnEls.push(result.el);
    itemEls.push(result.itemEls);
    colsWrap.appendChild(result.el);
  }

  el.appendChild(colsWrap);

  const footer = createElement('div', 'mn-filter-panel__footer');

  const saveBtn = createElement('button', 'mn-filter-panel__save-btn', {
    type: 'button',
  });
  saveBtn.textContent = 'SAVE AS DEFAULT';
  saveBtn.addEventListener('click', onSave);
  footer.appendChild(saveBtn);

  const clearBtn = createElement('button', 'mn-filter-panel__clear-btn', {
    type: 'button',
  });
  clearBtn.textContent = 'CLEAR';
  clearBtn.addEventListener('click', onClear);
  footer.appendChild(clearBtn);

  el.appendChild(footer);

  return { el, columnEls, itemEls };
}
