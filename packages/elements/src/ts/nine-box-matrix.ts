/**
 * GE-McKinsey 9-box strategic matrix — DOM-based interactive grid.
 * Click-to-select items, click/arrow-key to move between cells.
 */
import { escapeHtml } from './core/sanitize';

export interface NineBoxItem {
  id: string;
  label: string;
  x: 1 | 2 | 3;
  y: 1 | 2 | 3;
  subtitle?: string;
  color?: string;
}

export interface NineBoxMatrixOptions {
  items: NineBoxItem[];
  xLabel?: string;
  yLabel?: string;
  xAxisLabels?: [string, string, string];
  yAxisLabels?: [string, string, string];
  onSelect?: (item: NineBoxItem) => void;
  onMove?: (item: NineBoxItem, newX: 1 | 2 | 3, newY: 1 | 2 | 3) => void;
}

export interface NineBoxMatrixController {
  update: (items: NineBoxItem[]) => void;
  moveItem: (id: string, x: 1 | 2 | 3, y: 1 | 2 | 3) => void;
  getItems: () => NineBoxItem[];
  destroy: () => void;
}

type Coord = 1 | 2 | 3;
type Tier = 'invest' | 'selective' | 'divest';

function getTier(x: Coord, y: Coord): Tier {
  const s = x + y;
  if (s >= 6) return 'invest';
  if (s >= 5) return (x === 3 && y === 2) || (x === 2 && y === 3) ? 'invest' : 'selective';
  if (s === 4) return 'selective';
  if (s === 3) return (x === 1 && y === 2) || (x === 2 && y === 1) ? 'divest' : 'selective';
  return 'divest';
}

function clampCoord(v: number): Coord {
  return Math.max(1, Math.min(3, v)) as Coord;
}

function makeDiv(cls: string, text?: string): HTMLDivElement {
  const d = document.createElement('div');
  d.className = cls;
  if (text) d.textContent = text;
  return d;
}

function makeSpan(cls: string, text: string): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = cls;
  s.textContent = text;
  return s;
}

export function nineBoxMatrix(
  el: HTMLElement,
  opts: NineBoxMatrixOptions,
): NineBoxMatrixController {
  const xLabel = opts.xLabel ?? 'Business Strength';
  const yLabel = opts.yLabel ?? 'Industry Attractiveness';
  const xAxis = opts.xAxisLabels ?? ['Low', 'Medium', 'High'];
  const yAxis = opts.yAxisLabels ?? ['Low', 'Medium', 'High'];
  let items = [...opts.items];
  let selectedId: string | null = null;
  const ac = new AbortController();

  function render(): void {
    el.innerHTML = '';
    const root = makeDiv('mn-nine-box');
    const yLabelEl = makeDiv('mn-nine-box__y-label', yLabel);
    yLabelEl.setAttribute('aria-hidden', 'true');
    root.appendChild(yLabelEl);

    const body = makeDiv('mn-nine-box__body');
    const yTicks = makeDiv('mn-nine-box__y-ticks');
    yTicks.setAttribute('aria-hidden', 'true');
    for (let r = 2; r >= 0; r--) yTicks.appendChild(makeSpan('', yAxis[r]));

    const gridRow = makeDiv('mn-nine-box__grid-row');
    gridRow.appendChild(yTicks);

    const grid = makeDiv('mn-nine-box__grid');
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', `${yLabel} vs ${xLabel} matrix`);

    for (let y = 3; y >= 1; y--) {
      for (let x = 1; x <= 3; x++) {
        const cx = x as Coord, cy = y as Coord;
        const cell = makeDiv('mn-nine-box__cell');
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('data-tier', getTier(cx, cy));
        cell.setAttribute('data-x', String(cx));
        cell.setAttribute('data-y', String(cy));
        cell.tabIndex = 0;
        cell.setAttribute('aria-label',
          `${yLabel}: ${yAxis[cy - 1]}, ${xLabel}: ${xAxis[cx - 1]}`);
        for (const item of items.filter(i => i.x === cx && i.y === cy)) {
          cell.appendChild(buildItem(item));
        }
        grid.appendChild(cell);
      }
    }

    gridRow.appendChild(grid);
    body.appendChild(gridRow);

    const xLabelsRow = makeDiv('mn-nine-box__x-labels');
    xLabelsRow.setAttribute('aria-hidden', 'true');
    for (const lbl of xAxis) xLabelsRow.appendChild(makeSpan('', lbl));
    body.appendChild(xLabelsRow);

    const xLabelEl = makeDiv('mn-nine-box__x-label', xLabel);
    xLabelEl.setAttribute('aria-hidden', 'true');
    body.appendChild(xLabelEl);

    root.appendChild(body);
    el.appendChild(root);
    bindEvents();
  }

  function buildItem(item: NineBoxItem): HTMLElement {
    const div = makeDiv('mn-nine-box__item');
    if (selectedId === item.id) div.classList.add('mn-nine-box__item--selected');
    div.setAttribute('role', 'button');
    div.tabIndex = 0;
    div.setAttribute('data-id', item.id);
    div.setAttribute('aria-label', escapeHtml(item.label));
    if (item.color) div.style.borderColor = item.color;
    div.appendChild(makeSpan('mn-nine-box__item-label', item.label));
    if (item.subtitle) div.appendChild(makeSpan('mn-nine-box__item-sub', item.subtitle));
    return div;
  }

  function selectItem(id: string | null): void {
    selectedId = id;
    for (const itemEl of el.querySelectorAll('.mn-nine-box__item')) {
      itemEl.classList.toggle('mn-nine-box__item--selected',
        itemEl.getAttribute('data-id') === id);
    }
    for (const cellEl of el.querySelectorAll('.mn-nine-box__cell')) {
      cellEl.classList.toggle('mn-nine-box__cell--drop-target', id !== null);
    }
    if (id) {
      const item = items.find(i => i.id === id);
      if (item) opts.onSelect?.(item);
    }
  }

  function doMove(id: string, x: Coord, y: Coord): void {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.x = x;
    item.y = y;
    opts.onMove?.(item, x, y);
    selectedId = null;
    render();
  }

  function handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const itemEl = target.closest<HTMLElement>('.mn-nine-box__item');
    if (itemEl) {
      const id = itemEl.getAttribute('data-id');
      if (id) selectItem(selectedId === id ? null : id);
      return;
    }
    const cellEl = target.closest<HTMLElement>('.mn-nine-box__cell');
    if (cellEl && selectedId) {
      doMove(selectedId,
        Number(cellEl.getAttribute('data-x')) as Coord,
        Number(cellEl.getAttribute('data-y')) as Coord);
    }
  }

  function handleKey(e: Event): void {
    const ke = e as KeyboardEvent;
    const target = ke.target as HTMLElement;
    if (target.classList.contains('mn-nine-box__item')) {
      if (ke.key === 'Enter' || ke.key === ' ') {
        ke.preventDefault();
        const id = target.getAttribute('data-id');
        if (id) selectItem(selectedId === id ? null : id);
        return;
      }
      if (selectedId && target.getAttribute('data-id') === selectedId) {
        const item = items.find(i => i.id === selectedId);
        if (!item) return;
        let nx = item.x, ny = item.y;
        if (ke.key === 'ArrowRight') nx = clampCoord(nx + 1);
        else if (ke.key === 'ArrowLeft') nx = clampCoord(nx - 1);
        else if (ke.key === 'ArrowUp') ny = clampCoord(ny + 1);
        else if (ke.key === 'ArrowDown') ny = clampCoord(ny - 1);
        else return;
        ke.preventDefault();
        if (nx !== item.x || ny !== item.y) doMove(selectedId, nx, ny);
      }
      return;
    }
    if (target.classList.contains('mn-nine-box__cell') && selectedId) {
      if (ke.key === 'Enter' || ke.key === ' ') {
        ke.preventDefault();
        doMove(selectedId,
          Number(target.getAttribute('data-x')) as Coord,
          Number(target.getAttribute('data-y')) as Coord);
      }
    }
  }

  function bindEvents(): void {
    el.addEventListener('click', handleClick, { signal: ac.signal });
    el.addEventListener('keydown', handleKey, { signal: ac.signal });
  }

  render();

  return {
    update(newItems: NineBoxItem[]): void {
      items = [...newItems];
      selectedId = null;
      render();
    },
    moveItem(id: string, x: Coord, y: Coord): void { doMove(id, x, y); },
    getItems(): NineBoxItem[] { return items.map(i => ({ ...i })); },
    destroy(): void { ac.abort(); el.innerHTML = ''; },
  };
}
