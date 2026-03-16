/**
 * Unit tests for cohort-grid component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const SAMPLE_ROWS = [
  { label: 'January 2026', initialSize: 1200, retention: [1.0, 0.85, 0.72, 0.61] },
  { label: 'February 2026', initialSize: 980, retention: [1.0, 0.90, 0.78] },
  { label: 'March 2026', initialSize: 1100, retention: [1.0, 0.88] },
];

describe('cohortGrid', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(
    rows = SAMPLE_ROWS,
    opts?: Parameters<typeof import('../../src/ts/cohort-grid').cohortGrid>[2],
  ) {
    const { cohortGrid } = await import('../../src/ts/cohort-grid');
    return cohortGrid(container, rows, opts);
  }

  it('renders a table with role=table and aria-label', async () => {
    await create();
    const table = container.querySelector('table');
    expect(table?.getAttribute('role')).toBe('table');
    expect(table?.getAttribute('aria-label')).toBe('Cohort retention grid');
  });

  it('renders header row with Cohort and period columns', async () => {
    await create(SAMPLE_ROWS, { periodLabels: ['Week 0', 'Week 1', 'Week 2', 'Week 3'] });
    const ths = container.querySelectorAll('th');
    expect(ths[0]?.textContent).toBe('Cohort');
    expect(ths[1]?.textContent).toBe('Week 0');
  });

  it('uses default Period N labels when none provided', async () => {
    await create();
    const ths = container.querySelectorAll('th');
    expect(ths[1]?.textContent).toBe('Period 0');
    expect(ths[2]?.textContent).toBe('Period 1');
  });

  it('renders one body row per cohort', async () => {
    await create();
    const rows = container.querySelectorAll('.mn-cohort__row');
    expect(rows.length).toBe(3);
  });

  it('shows cohort label with initial size', async () => {
    await create();
    const label = container.querySelector('tbody .mn-cohort__cell-label');
    expect(label?.textContent).toContain('January 2026');
    expect(label?.textContent).toContain('1,200');
  });

  it('displays retention as percentage by default', async () => {
    await create();
    const cells = container.querySelectorAll('.mn-cohort__cell');
    const firstDataCell = cells[0];
    expect(firstDataCell?.textContent).toBe('100%');
  });

  it('displays absolute values when showAbsolute is true', async () => {
    await create(SAMPLE_ROWS, { showAbsolute: true });
    const cells = container.querySelectorAll('.mn-cohort__cell');
    /* First cell: 1.0 * 1200 = 1200 */
    expect(cells[0]?.textContent).toBe('1,200');
  });

  it('sets background color on retention cells', async () => {
    await create();
    const cell = container.querySelector('.mn-cohort__cell') as HTMLElement;
    expect(cell?.style.backgroundColor).toBeTruthy();
  });

  it('marks first column cells as base', async () => {
    await create();
    const baseCells = container.querySelectorAll('.mn-cohort__cell--base');
    expect(baseCells.length).toBe(3);
  });

  it('renders empty cells with dash for missing data', async () => {
    /* March row only has 2 retention values but grid has 4 columns */
    await create();
    const emptyCells = container.querySelectorAll('.mn-cohort__cell--empty');
    expect(emptyCells.length).toBeGreaterThan(0);
    expect(emptyCells[0]?.textContent).toBe('\u2014');
  });

  it('sets aria-label on data cells', async () => {
    await create();
    const cell = container.querySelector('.mn-cohort__cell');
    const ariaLabel = cell?.getAttribute('aria-label');
    expect(ariaLabel).toContain('January 2026');
  });

  it('fires onHover callback on mouseover', async () => {
    const spy = vi.fn();
    await create(SAMPLE_ROWS, { onHover: spy });
    const cell = container.querySelector('.mn-cohort__cell') as HTMLElement;
    cell?.dispatchEvent(new Event('mouseover'));
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].label).toBe('January 2026');
  });

  it('update replaces rows and rebuilds table', async () => {
    const ctrl = await create();
    const newRows = [
      { label: 'April 2026', initialSize: 800, retention: [1.0, 0.92] },
    ];
    ctrl.update(newRows);
    expect(container.textContent).toContain('April 2026');
    expect(container.textContent).not.toContain('January 2026');
  });

  it('destroy clears container', async () => {
    const ctrl = await create();
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
  });
});
