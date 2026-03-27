/**
 * Maranello Luce Design - Agent Cost Breakdown
 * FinOps dashboard table for AI agent token usage, cost attribution,
 * budget tracking, and trend analysis. Datadog/Vantage quality.
 */

import { escapeHtml } from './core/sanitize';
import { cssVar } from './core/utils';

export interface AgentCostRow {
  id: string;
  agentName: string;
  model: string;
  totalTokens: number;
  cachedTokens?: number;
  cost: number;
  costDelta?: number;
  calls: number;
  avgLatencyMs?: number;
  budget?: number;
  tags?: string[];
}

export interface AgentCostBreakdownOptions {
  currency?: string;
  period?: string;
  onSelect?: (row: AgentCostRow) => void;
  onBudgetAlert?: (row: AgentCostRow) => void;
  sortable?: boolean;
}

export interface AgentCostBreakdownController {
  update: (rows: AgentCostRow[]) => void;
  destroy: () => void;
}

type SortDir = 'asc' | 'desc';
interface SortState { key: string; dir: SortDir }

const COMPACT_FMT = new Intl.NumberFormat('en-US', {
  notation: 'compact', maximumFractionDigits: 1,
});

const CURRENCY_FMT = (currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 2,
  });

const COLS: { key: string; label: string; cls: string }[] = [
  { key: 'agentName', label: 'Agent', cls: '' },
  { key: 'model', label: 'Model', cls: '' },
  { key: 'totalTokens', label: 'Tokens', cls: 'num' },
  { key: 'cachedPct', label: 'Cached%', cls: 'num' },
  { key: 'cost', label: 'Cost', cls: 'num' },
  { key: 'costDelta', label: '\u0394', cls: 'num' },
  { key: 'calls', label: 'Calls', cls: 'num' },
  { key: 'avgLatencyMs', label: 'Avg Latency', cls: 'num hide-mobile' },
  { key: 'budget', label: 'Budget', cls: '' },
  { key: 'tags', label: 'Tags', cls: 'hide-mobile' },
];

function cachedPct(row: AgentCostRow): number {
  if (!row.cachedTokens || !row.totalTokens) return 0;
  return (row.cachedTokens / row.totalTokens) * 100;
}

function sortVal(row: AgentCostRow, key: string): number | string {
  if (key === 'cachedPct') return cachedPct(row);
  const v = row[key as keyof AgentCostRow];
  return (v ?? 0) as number | string;
}

function sortRows(rows: AgentCostRow[], st: SortState): AgentCostRow[] {
  return [...rows].sort((a, b) => {
    const va = sortVal(a, st.key);
    const vb = sortVal(b, st.key);
    const cmp = typeof va === 'string'
      ? (va as string).localeCompare(vb as string)
      : (va as number) - (vb as number);
    return st.dir === 'asc' ? cmp : -cmp;
  });
}

function modelAttr(model: string): string {
  const m = model.toLowerCase();
  if (m.includes('sonnet')) return 'sonnet';
  if (m.includes('haiku')) return 'haiku';
  if (m.includes('opus')) return 'opus';
  return 'other';
}

function cachedClass(pct: number): string {
  if (pct > 30) return 'mn-cost-breakdown__cached--high';
  if (pct >= 10) return 'mn-cost-breakdown__cached--mid';
  return 'mn-cost-breakdown__cached--low';
}

function budgetHtml(row: AgentCostRow): string {
  if (row.budget == null) return '<td class="mn-cost-breakdown__cell">&mdash;</td>';
  const pct = Math.min((row.cost / row.budget) * 100, 100);
  const alert = pct > 80 ? ' mn-cost-breakdown__budget--alert' : '';
  return `<td class="mn-cost-breakdown__cell">
    <span class="mn-cost-breakdown__budget-label">${COMPACT_FMT.format(row.budget)}</span>
    <span class="mn-cost-breakdown__budget-bar">
      <span class="mn-cost-breakdown__budget-fill${alert}" style="width:${pct.toFixed(1)}%"></span>
    </span></td>`;
}

function deltaHtml(delta: number | undefined): string {
  if (delta == null) return '<td class="mn-cost-breakdown__cell num">&mdash;</td>';
  const cls = delta > 0 ? 'mn-cost-breakdown__delta--up' : 'mn-cost-breakdown__delta--down';
  const arrow = delta > 0 ? '\u25B2' : '\u25BC';
  return `<td class="mn-cost-breakdown__cell num ${cls}">${arrow} ${Math.abs(delta).toFixed(1)}%</td>`;
}

function tagsHtml(tags: string[] | undefined): string {
  if (!tags?.length) return '<td class="mn-cost-breakdown__cell hide-mobile">&mdash;</td>';
  const pills = tags.slice(0, 2).map(t =>
    `<span class="mn-cost-breakdown__tag">${escapeHtml(t)}</span>`
  ).join('');
  return `<td class="mn-cost-breakdown__cell hide-mobile">${pills}</td>`;
}

function rowHtml(row: AgentCostRow, fmt: Intl.NumberFormat): string {
  const cp = cachedPct(row);
  const lat = row.avgLatencyMs != null ? `${row.avgLatencyMs.toLocaleString()}ms` : '&mdash;';
  return `<tr data-id="${escapeHtml(row.id)}">
    <td class="mn-cost-breakdown__cell"><strong>${escapeHtml(row.agentName)}</strong></td>
    <td class="mn-cost-breakdown__cell">
      <span class="mn-cost-breakdown__model" data-model="${modelAttr(row.model)}">${escapeHtml(row.model)}</span></td>
    <td class="mn-cost-breakdown__cell num">${COMPACT_FMT.format(row.totalTokens)}</td>
    <td class="mn-cost-breakdown__cell num">
      <span class="${cachedClass(cp)}">${cp.toFixed(0)}%</span></td>
    <td class="mn-cost-breakdown__cell num"><strong>${fmt.format(row.cost)}</strong></td>
    ${deltaHtml(row.costDelta)}
    <td class="mn-cost-breakdown__cell num">${row.calls.toLocaleString()}</td>
    <td class="mn-cost-breakdown__cell num hide-mobile">${lat}</td>
    ${budgetHtml(row)}
    ${tagsHtml(row.tags)}</tr>`;
}

function footerHtml(rows: AgentCostRow[], fmt: Intl.NumberFormat): string {
  const totTokens = rows.reduce((s, r) => s + r.totalTokens, 0);
  const totCost = rows.reduce((s, r) => s + r.cost, 0);
  const totCalls = rows.reduce((s, r) => s + r.calls, 0);
  return `<tr class="mn-cost-breakdown__footer-row">
    <td class="mn-cost-breakdown__cell" colspan="2"><strong>Total</strong></td>
    <td class="mn-cost-breakdown__cell num"><strong>${COMPACT_FMT.format(totTokens)}</strong></td>
    <td class="mn-cost-breakdown__cell">&nbsp;</td>
    <td class="mn-cost-breakdown__cell num"><strong>${fmt.format(totCost)}</strong></td>
    <td class="mn-cost-breakdown__cell">&nbsp;</td>
    <td class="mn-cost-breakdown__cell num"><strong>${totCalls.toLocaleString()}</strong></td>
    <td class="mn-cost-breakdown__cell hide-mobile" colspan="3">&nbsp;</td></tr>`;
}

export function agentCostBreakdown(
  el: HTMLElement,
  rows: AgentCostRow[],
  opts?: AgentCostBreakdownOptions,
): AgentCostBreakdownController {
  const currency = opts?.currency ?? 'USD';
  const period = opts?.period ?? 'This period';
  const sortable = opts?.sortable !== false;
  const fmt = CURRENCY_FMT(currency);
  const ac = new AbortController();
  const sort: SortState = { key: 'cost', dir: 'desc' };

  function renderAll(data: AgentCostRow[]): void {
    const sorted = sortRows(data, sort);
    const totalCost = data.reduce((s, r) => s + r.cost, 0);
    /* Check budget alerts */
    if (opts?.onBudgetAlert) {
      for (const r of data) {
        if (r.budget != null && r.cost > r.budget * 0.8) opts.onBudgetAlert(r);
      }
    }
    const thCells = COLS.map(c => {
      const aria = sortable && sort.key === c.key
        ? ` aria-sort="${sort.dir === 'asc' ? 'ascending' : 'descending'}"`
        : '';
      const sortCls = sortable ? ' sortable' : '';
      return `<th class="mn-cost-breakdown__th ${c.cls}${sortCls}" data-sort="${c.key}"${aria}>${c.label}</th>`;
    }).join('');
    el.innerHTML = `<div class="mn-cost-breakdown">
      <div class="mn-cost-breakdown__header">
        <div class="mn-cost-breakdown__title-group">
          <h3 class="mn-cost-breakdown__title">Agent Cost Breakdown</h3>
          <span class="mn-cost-breakdown__period">${escapeHtml(period)}</span>
        </div>
        <span class="mn-cost-breakdown__total">${fmt.format(totalCost)}</span>
      </div>
      <div class="mn-cost-breakdown__table-wrap">
        <table class="mn-cost-breakdown__table" role="table">
          <thead><tr>${thCells}</tr></thead>
          <tbody>${sorted.map(r => rowHtml(r, fmt)).join('')}</tbody>
          <tfoot>${footerHtml(data, fmt)}</tfoot>
        </table>
      </div></div>`;
  }

  let current = rows.slice();
  renderAll(current);

  /* Sort on TH click */
  if (sortable) {
    el.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest<HTMLElement>('.mn-cost-breakdown__th');
      if (!th?.dataset.sort) return;
      const key = th.dataset.sort;
      sort.dir = sort.key === key && sort.dir === 'asc' ? 'desc' : 'asc';
      sort.key = key;
      renderAll(current);
    }, { signal: ac.signal });
  }

  /* Row select */
  if (opts?.onSelect) {
    el.addEventListener('click', (e) => {
      const tr = (e.target as HTMLElement).closest<HTMLElement>('tbody tr[data-id]');
      if (!tr) return;
      const id = tr.dataset.id;
      const row = current.find(r => r.id === id);
      if (row) opts.onSelect!(row);
    }, { signal: ac.signal });
  }

  return {
    update(newRows: AgentCostRow[]): void {
      current = newRows.slice();
      renderAll(current);
    },
    destroy(): void {
      ac.abort();
      el.innerHTML = '';
    },
  };
}
