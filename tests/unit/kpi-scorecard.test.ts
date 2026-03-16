/**
 * Unit tests for kpi-scorecard component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const SAMPLE_ROWS = [
  { id: 'revenue', label: 'Revenue', target: 1_000_000, actual: 950_000, format: 'currency' as const },
  { id: 'churn', label: 'Churn Rate', unit: '%', target: 5, actual: 3.2, format: 'percent' as const },
  { id: 'nps', label: 'Net Promoter Score', target: 70, actual: 82, trend: [65, 68, 72, 78, 82] },
];

describe('kpiScorecard', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(
    rows = SAMPLE_ROWS,
    opts?: Parameters<typeof import('../../src/ts/kpi-scorecard').kpiScorecard>[2],
  ) {
    const { kpiScorecard } = await import('../../src/ts/kpi-scorecard');
    return kpiScorecard(container, rows, opts);
  }

  it('renders a table with role=table and aria-label', async () => {
    await create();
    const table = container.querySelector('table');
    expect(table?.getAttribute('role')).toBe('table');
    expect(table?.getAttribute('aria-label')).toBe('KPI Scorecard');
  });

  it('renders 6 column headers', async () => {
    await create();
    const ths = container.querySelectorAll('th');
    expect(ths.length).toBe(6);
    expect(ths[0].textContent).toBe('Metric');
    expect(ths[5].textContent).toBe('Status');
  });

  it('renders one row per KPI', async () => {
    await create();
    const rows = container.querySelectorAll('.mn-kpi__row');
    expect(rows.length).toBe(3);
  });

  it('shows metric label with unit', async () => {
    await create();
    const labels = container.querySelectorAll('.mn-kpi__label');
    const churnLabel = labels[1];
    expect(churnLabel?.textContent).toContain('Churn Rate');
    expect(churnLabel?.querySelector('.mn-kpi__unit')?.textContent).toBe('%');
  });

  it('formats currency values with dollar sign', async () => {
    await create();
    const values = container.querySelectorAll('.mn-kpi__value');
    /* Target cell for Revenue row */
    expect(values[0]?.textContent).toContain('$');
  });

  it('shows positive delta with + sign', async () => {
    await create();
    const npsRow = container.querySelectorAll('.mn-kpi__row')[2];
    const delta = npsRow?.querySelector('.mn-kpi__delta--pos');
    expect(delta).not.toBeNull();
    expect(delta?.textContent).toContain('+');
  });

  it('shows negative delta class for below-target', async () => {
    await create();
    const revenueRow = container.querySelectorAll('.mn-kpi__row')[0];
    const delta = revenueRow?.querySelector('.mn-kpi__delta--neg');
    expect(delta).not.toBeNull();
  });

  it('resolves status green when actual >= target', async () => {
    await create();
    const npsRow = container.querySelectorAll('.mn-kpi__row')[2];
    const dot = npsRow?.querySelector('.mn-kpi__status-dot--green');
    expect(dot).not.toBeNull();
  });

  it('resolves status yellow when actual >= 80% of target', async () => {
    await create();
    const revenueRow = container.querySelectorAll('.mn-kpi__row')[0];
    const dot = revenueRow?.querySelector('.mn-kpi__status-dot--yellow');
    expect(dot).not.toBeNull();
  });

  it('fires onSelect when a row is clicked', async () => {
    const spy = vi.fn();
    const ctrl = await create(SAMPLE_ROWS, { onSelect: spy });
    const row = container.querySelector('.mn-kpi__row') as HTMLElement;
    row?.click();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].id).toBe('revenue');
  });

  it('update replaces rows', async () => {
    const ctrl = await create();
    const updated = [
      { id: 'arpu', label: 'ARPU', target: 50, actual: 55, format: 'currency' as const },
    ];
    ctrl.update(updated);
    const rows = container.querySelectorAll('.mn-kpi__row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('ARPU');
  });

  it('destroy clears container and aborts listeners', async () => {
    const ctrl = await create();
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
  });

  it('uses custom currency symbol', async () => {
    const rows = [
      { id: 'mrr', label: 'MRR', target: 80_000, actual: 85_000, format: 'currency' as const },
    ];
    await create(rows, { currency: '\u20AC' });
    const value = container.querySelector('.mn-kpi__value');
    expect(value?.textContent).toContain('\u20AC');
  });
});
