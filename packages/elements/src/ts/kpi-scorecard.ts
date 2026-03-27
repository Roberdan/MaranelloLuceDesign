/**
 * Maranello Luce Design - KPI Scorecard (headless)
 * Renders a table of KPI rows with delta, status, and sparkline trend.
 */
import { escapeHtml } from './core/sanitize';
import { cssVar } from './core/utils';

export type KpiStatus = 'green' | 'yellow' | 'red' | 'neutral';

export interface KpiRow {
  id: string;
  label: string;
  unit?: string;
  target: number;
  actual: number;
  trend?: number[];
  status?: KpiStatus;
  format?: 'number' | 'percent' | 'currency';
}

export interface KpiScorecardOptions {
  currency?: string;
  onSelect?: (row: KpiRow) => void;
  animate?: boolean;
}

export interface KpiScorecardController {
  update: (rows: KpiRow[]) => void;
  destroy: () => void;
}

const STATUS_LABELS: Record<KpiStatus, string> = {
  green: 'On track',
  yellow: 'At risk',
  red: 'Off track',
  neutral: '\u2014',
};

const STATUS_VARS: Record<KpiStatus, string> = {
  green: '--signal-ok',
  yellow: '--signal-warning',
  red: '--signal-danger',
  neutral: '--mn-text-muted',
};

function resolveStatus(row: KpiRow): KpiStatus {
  if (row.status) return row.status;
  if (row.actual >= row.target) return 'green';
  if (row.actual >= row.target * 0.8) return 'yellow';
  return 'red';
}

function fmtValue(val: number, fmt: KpiRow['format'], currency: string): string {
  if (fmt === 'percent') return `${val}%`;
  if (fmt === 'currency') {
    return `${currency}${new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(val)}`;
  }
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(val);
}

function fmtDelta(delta: number, fmt: KpiRow['format'], currency: string): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${fmtValue(delta, fmt, currency)}`;
}

/** Draw a tiny sparkline polyline on a 60x24 canvas. */
function drawSparkline(canvas: HTMLCanvasElement, data: number[], color: string): void {
  const w = 60;
  const h = 24;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const pad = 2;

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - mn) / range) * (h - pad * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/** Resolve a CSS var token to a computed hex/color string. */
function resolveColor(varName: string, fallback: string): string {
  return cssVar(varName, fallback);
}

const HEADERS = ['Metric', 'Target', 'Actual', 'Delta', 'Trend', 'Status'];

function buildHead(): string {
  const ths = HEADERS.map(
    (h) => `<th class="mn-kpi__th" scope="col" role="columnheader">${h}</th>`,
  ).join('');
  return `<thead><tr>${ths}</tr></thead>`;
}

function buildRow(row: KpiRow, currency: string): string {
  const s = resolveStatus(row);
  const delta = row.actual - row.target;
  const deltaCls = delta >= 0 ? 'mn-kpi__delta--pos' : 'mn-kpi__delta--neg';
  const dotCls = `mn-kpi__status-dot mn-kpi__status-dot--${s}`;
  const label = escapeHtml(row.label);
  const unit = row.unit ? ` <span class="mn-kpi__unit">${escapeHtml(row.unit)}</span>` : '';
  const fmt = row.format ?? 'number';

  return [
    `<tr class="mn-kpi__row" role="row" tabindex="0" data-id="${escapeHtml(row.id)}">`,
    `<td class="mn-kpi__td mn-kpi__label">${label}${unit}</td>`,
    `<td class="mn-kpi__td mn-kpi__value">${fmtValue(row.target, fmt, currency)}</td>`,
    `<td class="mn-kpi__td mn-kpi__value">${fmtValue(row.actual, fmt, currency)}</td>`,
    `<td class="mn-kpi__td ${deltaCls}">${fmtDelta(delta, fmt, currency)}</td>`,
    `<td class="mn-kpi__td mn-kpi__trend"></td>`,
    `<td class="mn-kpi__td"><span class="${dotCls}"></span> ${escapeHtml(STATUS_LABELS[s])}</td>`,
    '</tr>',
  ].join('');
}

/** Create a KPI Scorecard table inside the given element. */
export function kpiScorecard(
  el: HTMLElement,
  rows: KpiRow[],
  opts?: KpiScorecardOptions,
): KpiScorecardController {
  const currency = opts?.currency ?? '$';
  const onSelect = opts?.onSelect;
  const ac = new AbortController();

  function render(data: KpiRow[]): void {
    const bodyHtml = data.map((r) => buildRow(r, currency)).join('');
    el.innerHTML = [
      '<div class="mn-kpi">',
      `<table class="mn-kpi__table" role="table" aria-label="KPI Scorecard">`,
      buildHead(),
      `<tbody>${bodyHtml}</tbody>`,
      '</table></div>',
    ].join('');

    /* Draw sparklines into canvas cells */
    const trendCells = el.querySelectorAll<HTMLTableCellElement>('.mn-kpi__trend');
    data.forEach((row, i) => {
      if (!row.trend || row.trend.length < 2) return;
      const cell = trendCells[i];
      if (!cell) return;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      const s = resolveStatus(row);
      const color = resolveColor(STATUS_VARS[s], '#FFC72C');
      drawSparkline(canvas, row.trend, color);
      cell.appendChild(canvas);
    });

    /* Row click / keyboard handlers */
    if (onSelect) {
      el.querySelectorAll<HTMLTableRowElement>('.mn-kpi__row').forEach((tr, i) => {
        const row = data[i];
        tr.addEventListener('click', () => onSelect(row), { signal: ac.signal });
        tr.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(row);
          }
        }, { signal: ac.signal });
      });
    }
  }

  render(rows);

  return {
    update(newRows: KpiRow[]): void {
      render(newRows);
    },
    destroy(): void {
      ac.abort();
      el.innerHTML = '';
    },
  };
}
