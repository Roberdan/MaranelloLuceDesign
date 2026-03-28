/**
 * Maranello Luce Design — Heatmap component
 * Headless factory for capacity/data heatmaps with color-scale interpolation.
 * Reuses .mn-cap-grid CSS classes from layouts-capacity-heatmap.css.
 */
import { createElement, clamp, lerp } from './core/utils';
import { isValidColor, escapeHtml } from './core/sanitize';

export interface HeatmapCell {
  value: number;
  label?: string;
  color?: string;
  tooltip?: string;
}

export interface HeatmapRow {
  label: string;
  cells: HeatmapCell[];
}

export interface HeatmapOptions {
  rows: HeatmapRow[];
  columnLabels?: string[];
  colorScale?: string[];
  minValue?: number;
  maxValue?: number;
  showValues?: boolean;
  cellSize?: 'sm' | 'md' | 'lg';
  onCellClick?: (row: HeatmapRow, cell: HeatmapCell, rowIndex: number, colIndex: number) => void;
  onCellHover?: (row: HeatmapRow, cell: HeatmapCell, rowIndex: number, colIndex: number) => void;
  ariaLabel?: string;
}

export interface HeatmapController {
  update: (rows: HeatmapRow[], columnLabels?: string[]) => void;
  destroy: () => void;
}

const DEFAULT_SCALE = ['#1a1a2e', '#DC0000', '#FFC72C', '#00A651'];
const EVENT_NAME = 'mn-heatmap-cell-click';

/** Parse hex (#RGB or #RRGGBB) to [r, g, b]. */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Interpolate across a multi-stop color scale. t clamped to 0..1. */
function interpolateColor(scale: string[], t: number): string {
  const ct = clamp(t, 0, 1);
  const idx = ct * (scale.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, scale.length - 1);
  const f = idx - lo;
  const cLo = parseHex(scale[lo]);
  const cHi = parseHex(scale[hi]);
  const r = Math.round(lerp(cLo[0], cHi[0], f));
  const g = Math.round(lerp(cLo[1], cHi[1], f));
  const b = Math.round(lerp(cLo[2], cHi[2], f));
  return `rgb(${r},${g},${b})`;
}

/** Choose text color for readability based on background luminance. */
function contrastText(bg: string): string {
  const match = bg.match(/(\d+)/g);
  if (!match || match.length < 3) return 'var(--mn-text)';
  const lum = (0.299 * Number(match[0]) + 0.587 * Number(match[1]) + 0.114 * Number(match[2])) / 255;
  return lum > 0.5 ? 'var(--mn-text-inverse)' : '#fff';
}

/** Auto-detect min/max from data when not provided. */
function resolveRange(rows: HeatmapRow[], min?: number, max?: number): [number, number] {
  let lo = min ?? Infinity;
  let hi = max ?? -Infinity;
  if (min === undefined || max === undefined) {
    for (const row of rows) {
      for (const cell of row.cells) {
        if (min === undefined && cell.value < lo) lo = cell.value;
        if (max === undefined && cell.value > hi) hi = cell.value;
      }
    }
  }
  if (lo === hi) hi = lo + 1;
  return [lo, hi];
}

function cellColor(cell: HeatmapCell, scale: string[], min: number, max: number): string {
  if (cell.color && isValidColor(cell.color)) return cell.color;
  return interpolateColor(scale, (cell.value - min) / (max - min));
}

function cellAriaLabel(row: HeatmapRow, cell: HeatmapCell, colLabel?: string): string {
  if (cell.tooltip) return cell.tooltip;
  const col = colLabel ?? (cell.label ?? '');
  return `${escapeHtml(row.label)}, ${escapeHtml(col)}: ${cell.value}`;
}

/** Attach click, keyboard, and hover listeners to a cell element. */
function attachCellListeners(
  cellEl: HTMLElement, opts: HeatmapOptions,
  row: HeatmapRow, cell: HeatmapCell, ri: number, ci: number,
  ac: AbortController,
): void {
  if (opts.onCellClick) {
    cellEl.addEventListener('click', () => {
      opts.onCellClick!(row, cell, ri, ci);
    }, { signal: ac.signal });
  }
  cellEl.addEventListener('click', () => {
    cellEl.dispatchEvent(new CustomEvent(EVENT_NAME, {
      bubbles: true, detail: { row, cell, rowIndex: ri, colIndex: ci },
    }));
  }, { signal: ac.signal });
  cellEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cellEl.click(); }
  }, { signal: ac.signal });
  if (opts.onCellHover) {
    cellEl.addEventListener('mouseenter', () => {
      opts.onCellHover!(row, cell, ri, ci);
    }, { signal: ac.signal });
  }
}

/** Build the full grid DOM and attach to container. */
function buildGrid(container: HTMLElement, opts: HeatmapOptions, ac: AbortController): void {
  const scale = (opts.colorScale ?? DEFAULT_SCALE).filter(c => isValidColor(c));
  const safeScale = scale.length >= 2 ? scale : DEFAULT_SCALE;
  const showValues = opts.showValues !== false;
  const sizeClass = opts.cellSize ? ` mn-cap-heatmap--${opts.cellSize}` : '';
  const [min, max] = resolveRange(opts.rows, opts.minValue, opts.maxValue);

  const root = createElement('div', `mn-cap-heatmap${sizeClass}`, {
    role: 'grid', 'aria-label': opts.ariaLabel ?? 'Heatmap',
  });

  /* Column headers */
  if (opts.columnLabels && opts.columnLabels.length > 0) {
    const headerRow = createElement('div', 'mn-cap-grid__header', { role: 'row' });
    headerRow.appendChild(createElement('span', 'mn-cap-grid__row-label'));
    for (const label of opts.columnLabels) {
      headerRow.appendChild(createElement('span', 'mn-cap-grid__col-label', {
        role: 'columnheader', text: label,
      }));
    }
    root.appendChild(headerRow);
  }

  /* Data rows */
  for (let ri = 0; ri < opts.rows.length; ri++) {
    const row = opts.rows[ri];
    const rowEl = createElement('div', 'mn-cap-grid__row', { role: 'row' });
    rowEl.appendChild(createElement('span', 'mn-cap-grid__row-label', { text: row.label }));

    for (let ci = 0; ci < row.cells.length; ci++) {
      const cell = row.cells[ci];
      const bg = cellColor(cell, safeScale, min, max);
      const colLabel = opts.columnLabels ? opts.columnLabels[ci] : undefined;
      const cellEl = createElement('div', 'mn-cap-grid__cell', {
        role: 'gridcell', tabindex: '0',
        'aria-label': cellAriaLabel(row, cell, colLabel),
      });
      cellEl.style.backgroundColor = bg;
      cellEl.style.color = contrastText(bg);
      if (showValues) cellEl.textContent = String(cell.value);
      attachCellListeners(cellEl, opts, row, cell, ri, ci, ac);
      rowEl.appendChild(cellEl);
    }
    root.appendChild(rowEl);
  }
  container.appendChild(root);
}

/**
 * Create a heatmap grid inside the given container.
 * Returns a controller for updates and cleanup, or null if container not found.
 */
export function heatmap(
  container: HTMLElement | string,
  options: HeatmapOptions,
): HeatmapController | null {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) {
    console.warn(`[Maranello] heatmap: container not found — "${container}"`);
    return null;
  }

  let ac = new AbortController();
  buildGrid(el, options, ac);

  return {
    update(rows: HeatmapRow[], columnLabels?: string[]) {
      ac.abort();
      ac = new AbortController();
      el.textContent = '';
      buildGrid(el, { ...options, rows, columnLabels: columnLabels ?? options.columnLabels }, ac);
    },
    destroy() {
      ac.abort();
      el.textContent = '';
    },
  };
}
