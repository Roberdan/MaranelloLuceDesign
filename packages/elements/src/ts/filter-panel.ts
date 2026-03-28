/**
 * Maranello Luce Design - Filter panel controller
 * Multi-column dropdown for filtering data with single/multi-select columns.
 */

import { buildFilterPanel } from './filter-panel-dom';

export interface FilterPanelItem {
  label: string;
  value: string;
  selected?: boolean;
  count?: number;
  color?: string;
}

export interface FilterPanelColumn {
  id: string;
  title: string;
  type: 'single-select' | 'multi-select';
  items: FilterPanelItem[];
}

export interface FilterPanelOptions {
  columns: FilterPanelColumn[];
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
  onSaveDefault?: (filters: Record<string, string | string[]>) => void;
  onClear?: () => void;
}

export interface FilterPanelController {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
  getFilters: () => Record<string, string | string[]>;
  destroy: () => void;
}

/** Collect current filter state from columns config. */
function collectFilters(columns: FilterPanelColumn[]): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  for (const col of columns) {
    const selected = col.items.filter(i => i.selected === true);
    if (col.type === 'single-select') {
      result[col.id] = selected.length > 0 ? selected[0].value : '';
    } else {
      result[col.id] = selected.map(i => i.value);
    }
  }
  return result;
}

/** Position the dropdown below the anchor element. */
function positionPanel(panel: HTMLElement, anchor: HTMLElement): void {
  const rect = anchor.getBoundingClientRect();
  panel.style.position = 'fixed';
  panel.style.top = rect.bottom + 4 + 'px';
  panel.style.left = rect.left + 'px';

  /* Adjust if overflowing right edge */
  requestAnimationFrame(() => {
    const pRect = panel.getBoundingClientRect();
    if (pRect.right > window.innerWidth - 8) {
      panel.style.left = Math.max(8, window.innerWidth - pRect.width - 8) + 'px';
    }
    /* Adjust if overflowing bottom edge */
    if (pRect.bottom > window.innerHeight - 8) {
      panel.style.top = rect.top - pRect.height - 4 + 'px';
    }
  });
}

/** Handle item click for single-select column. */
function handleSingleSelect(
  col: FilterPanelColumn,
  itemIdx: number,
  itemEls: HTMLDivElement[],
): void {
  for (let i = 0; i < col.items.length; i++) {
    const wasSelected = col.items[i].selected === true;
    const nowSelected = i === itemIdx;
    col.items[i].selected = nowSelected;
    if (wasSelected && !nowSelected) {
      itemEls[i].classList.remove('mn-filter-panel__item--selected');
      itemEls[i].setAttribute('aria-selected', 'false');
    } else if (nowSelected) {
      itemEls[i].classList.add('mn-filter-panel__item--selected');
      itemEls[i].setAttribute('aria-selected', 'true');
    }
  }
}

/** Handle item click for multi-select column. */
function handleMultiSelect(
  col: FilterPanelColumn,
  itemIdx: number,
  itemEls: HTMLDivElement[],
): void {
  const item = col.items[itemIdx];
  const next = !(item.selected === true);
  item.selected = next;
  const el = itemEls[itemIdx];
  if (next) {
    el.classList.add('mn-filter-panel__item--selected');
    el.setAttribute('aria-selected', 'true');
  } else {
    el.classList.remove('mn-filter-panel__item--selected');
    el.setAttribute('aria-selected', 'false');
  }
}

export function filterPanel(
  anchor: HTMLElement,
  options: FilterPanelOptions,
): FilterPanelController {
  const columns = options.columns;
  let panelEl: HTMLDivElement | null = null;
  let allItemEls: HTMLDivElement[][] = [];
  let open = false;
  let focusColIdx = 0;
  let focusRowIdx = -1;

  function onSave(): void {
    if (options.onSaveDefault) options.onSaveDefault(collectFilters(columns));
  }

  function onClear(): void {
    for (const col of columns) {
      for (const item of col.items) item.selected = false;
    }
    /* Update DOM */
    for (let c = 0; c < allItemEls.length; c++) {
      for (let r = 0; r < allItemEls[c].length; r++) {
        allItemEls[c][r].classList.remove('mn-filter-panel__item--selected');
        allItemEls[c][r].setAttribute('aria-selected', 'false');
      }
    }
    if (options.onClear) options.onClear();
    if (options.onFilterChange) options.onFilterChange(collectFilters(columns));
  }

  function setFocus(colIdx: number, rowIdx: number): void {
    if (!allItemEls.length) return;
    focusColIdx = Math.max(0, Math.min(colIdx, allItemEls.length - 1));
    const colItems = allItemEls[focusColIdx];
    if (!colItems.length) return;
    focusRowIdx = ((rowIdx % colItems.length) + colItems.length) % colItems.length;
    colItems[focusRowIdx].focus();
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (!open) return;
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        doClose();
        anchor.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocus(focusColIdx, focusRowIdx + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocus(focusColIdx, focusRowIdx - 1);
        break;
      case 'Tab':
        if (e.shiftKey) {
          if (focusColIdx > 0) {
            e.preventDefault();
            setFocus(focusColIdx - 1, 0);
          }
        } else {
          if (focusColIdx < allItemEls.length - 1) {
            e.preventDefault();
            setFocus(focusColIdx + 1, 0);
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusRowIdx >= 0 && allItemEls[focusColIdx]) {
          allItemEls[focusColIdx][focusRowIdx].click();
        }
        break;
    }
  }

  function onOutsideClick(e: MouseEvent): void {
    const target = e.target as Node | null;
    if (target && panelEl && !panelEl.contains(target) && !anchor.contains(target)) {
      doClose();
    }
  }

  function doOpen(): void {
    if (open) return;
    open = true;
    focusColIdx = 0;
    focusRowIdx = -1;

    const dom = buildFilterPanel(columns, onSave, onClear);
    panelEl = dom.el;
    allItemEls = dom.itemEls;

    /* Wire up item click handlers */
    for (let c = 0; c < columns.length; c++) {
      for (let r = 0; r < allItemEls[c].length; r++) {
        const colIdx = c;
        const rowIdx = r;
        allItemEls[c][r].addEventListener('click', () => {
          if (columns[colIdx].type === 'single-select') {
            handleSingleSelect(columns[colIdx], rowIdx, allItemEls[colIdx]);
          } else {
            handleMultiSelect(columns[colIdx], rowIdx, allItemEls[colIdx]);
          }
          if (options.onFilterChange) options.onFilterChange(collectFilters(columns));
        });
      }
    }

    document.body.appendChild(panelEl);
    positionPanel(panelEl, anchor);

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onOutsideClick, true);
  }

  function doClose(): void {
    if (!open) return;
    open = false;
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('mousedown', onOutsideClick, true);
    if (panelEl && panelEl.parentNode) {
      panelEl.parentNode.removeChild(panelEl);
    }
    panelEl = null;
    allItemEls = [];
  }

  return {
    open: doOpen,
    close: doClose,
    isOpen: () => open,
    getFilters: () => collectFilters(columns),
    destroy(): void {
      doClose();
    },
  };
}
