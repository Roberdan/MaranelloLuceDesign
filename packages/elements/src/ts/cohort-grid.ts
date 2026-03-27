/**
 * Maranello Luce Design - Cohort retention grid
 * Heatmap table showing cohort retention over time periods.
 */

import { escapeHtml } from './core/sanitize';
import { cssVar, lerp, clamp, formatNumber } from './core/utils';

export interface CohortRow {
  label: string;
  initialSize: number;
  retention: number[];
}

export interface CohortGridOptions {
  periodLabels?: string[];
  showAbsolute?: boolean;
  onHover?: (row: CohortRow, periodIdx: number, value: number) => void;
  colorHigh?: string;
  colorLow?: string;
}

export interface CohortGridController {
  update: (rows: CohortRow[], opts?: Partial<CohortGridOptions>) => void;
  destroy: () => void;
}

/** Parse a hex color (#RGB or #RRGGBB) into [r, g, b]. */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Resolve a color option to a hex string. */
function resolveColor(color: string | undefined, cssVarName: string, fallback: string): string {
  if (color && color.startsWith('#')) return color;
  if (color && color.startsWith('--')) return cssVar(color, fallback);
  return cssVar(cssVarName, fallback);
}

/** Interpolate between two RGB colors based on a 0-1 value. */
function lerpColor(
  low: [number, number, number],
  high: [number, number, number],
  t: number,
): string {
  const ct = clamp(t, 0, 1);
  const r = Math.round(lerp(low[0], high[0], ct));
  const g = Math.round(lerp(low[1], high[1], ct));
  const b = Math.round(lerp(low[2], high[2], ct));
  return `rgb(${r},${g},${b})`;
}

/** Determine text contrast: light or dark based on background luminance. */
function contrastText(r: number, g: number, b: number): string {
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? 'var(--mn-text-inverse)' : 'var(--mn-text)';
}

/** Format a cell value for display. */
function formatCellValue(retention: number, initialSize: number, showAbsolute: boolean): string {
  if (showAbsolute) return formatNumber(Math.round(initialSize * retention));
  return `${(retention * 100).toFixed(0)}%`;
}

/** Build the period label for a given index. */
function periodLabel(labels: string[] | undefined, idx: number): string {
  if (labels && labels[idx]) return labels[idx];
  return `Period ${idx}`;
}

/** Count the maximum number of periods across all rows. */
function maxPeriods(rows: CohortRow[]): number {
  let max = 0;
  for (const row of rows) {
    if (row.retention.length > max) max = row.retention.length;
  }
  return max;
}

/** Build the full table DOM and attach event listeners. */
function buildTable(
  el: HTMLElement,
  rows: CohortRow[],
  opts: CohortGridOptions,
  ac: AbortController,
): void {
  const showAbs = opts.showAbsolute ?? false;
  const highHex = resolveColor(opts.colorHigh, '--signal-ok', '#00A651');
  const lowHex = resolveColor(opts.colorLow, '--signal-danger', '#DC0000');
  const rgbHigh = parseHex(highHex);
  const rgbLow = parseHex(lowHex);
  const periods = maxPeriods(rows);

  const wrapper = document.createElement('div');
  wrapper.className = 'mn-cohort';

  const table = document.createElement('table');
  table.className = 'mn-cohort__table';
  table.setAttribute('role', 'table');
  table.setAttribute('aria-label', 'Cohort retention grid');

  /* Header row */
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const thCohort = document.createElement('th');
  thCohort.className = 'mn-cohort__th mn-cohort__cell-label';
  thCohort.setAttribute('scope', 'col');
  thCohort.setAttribute('role', 'columnheader');
  thCohort.textContent = 'Cohort';
  headerRow.appendChild(thCohort);

  for (let i = 0; i < periods; i++) {
    const th = document.createElement('th');
    th.className = 'mn-cohort__th';
    th.setAttribute('scope', 'col');
    th.setAttribute('role', 'columnheader');
    th.textContent = periodLabel(opts.periodLabels, i);
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  /* Body rows */
  const tbody = document.createElement('tbody');
  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'mn-cohort__row';

    const labelCell = document.createElement('td');
    labelCell.className = 'mn-cohort__cell-label';
    labelCell.innerHTML =
      `${escapeHtml(row.label)} <span class="mn-cohort__size">(n=${escapeHtml(formatNumber(row.initialSize))})</span>`;
    tr.appendChild(labelCell);

    for (let i = 0; i < periods; i++) {
      const td = document.createElement('td');
      const retention = row.retention[i];

      if (retention === undefined || retention === null) {
        td.className = 'mn-cohort__cell mn-cohort__cell--empty';
        td.textContent = '\u2014';
        td.setAttribute('aria-label',
          `${escapeHtml(row.label)} ${periodLabel(opts.periodLabels, i)}: no data`);
      } else {
        const value = formatCellValue(retention, row.initialSize, showAbs);
        const bg = lerpColor(rgbLow, rgbHigh, retention);
        const ct = clamp(retention, 0, 1);
        const r = Math.round(lerp(rgbLow[0], rgbHigh[0], ct));
        const g = Math.round(lerp(rgbLow[1], rgbHigh[1], ct));
        const b = Math.round(lerp(rgbLow[2], rgbHigh[2], ct));

        td.className = i === 0 ? 'mn-cohort__cell mn-cohort__cell--base' : 'mn-cohort__cell';
        td.textContent = value;
        td.style.backgroundColor = bg;
        td.style.color = contrastText(r, g, b);
        td.setAttribute('aria-label',
          `${escapeHtml(row.label)} ${periodLabel(opts.periodLabels, i)}: ${value}`);

        if (opts.onHover) {
          const capturedRow = row;
          const capturedIdx = i;
          td.addEventListener('mouseover', () => {
            opts.onHover!(capturedRow, capturedIdx, retention);
          }, { signal: ac.signal });
        }
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  wrapper.appendChild(table);
  el.appendChild(wrapper);
}

/**
 * Create a cohort retention heatmap grid inside the given element.
 * Renders a table with color-interpolated cells based on retention rates.
 */
export function cohortGrid(
  el: HTMLElement,
  rows: CohortRow[],
  opts?: CohortGridOptions,
): CohortGridController {
  let ac = new AbortController();
  const resolved = opts ?? {};

  buildTable(el, rows, resolved, ac);

  return {
    update(newRows: CohortRow[], newOpts?: Partial<CohortGridOptions>) {
      ac.abort();
      ac = new AbortController();
      el.innerHTML = '';
      const merged = { ...resolved, ...newOpts };
      buildTable(el, newRows, merged, ac);
    },
    destroy() {
      ac.abort();
      el.innerHTML = '';
    },
  };
}
