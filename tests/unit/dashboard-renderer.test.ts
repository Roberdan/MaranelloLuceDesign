/**
 * Unit tests for DashboardRenderer.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { DashboardSchema } from '../../src/ts/dashboard-renderer';
function simpleSchema(spans?: number[]): DashboardSchema {
  return {
    rows: [
      {
        columns: [
          { type: 'custom', dataKey: 'revenue', span: spans?.[0] ?? 6,
            options: { render: vi.fn() } },
          { type: 'custom', dataKey: 'users', span: spans?.[1] ?? 6,
            options: { render: vi.fn() } },
        ],
      },
    ],
  };
}

function multiRowSchema(): DashboardSchema {
  return {
    rows: [
      {
        columns: [
          { type: 'custom', dataKey: 'kpis', span: 12,
            options: { render: vi.fn() } },
        ],
      },
      {
        columns: [
          { type: 'custom', dataKey: 'chart', span: 8,
            options: { render: vi.fn() } },
          { type: 'custom', dataKey: 'status', span: 4,
            options: { render: vi.fn() } },
        ],
      },
    ],
  };
}

describe('DashboardRenderer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.body.innerHTML = '';
  });

  async function create(
    schema: DashboardSchema = simpleSchema(),
    data?: Record<string, unknown>,
  ) {
    const { DashboardRenderer } = await import('../../src/ts/dashboard-renderer');
    return new DashboardRenderer(container, { schema, data });
  }

  it('renders schema with rows and columns', async () => {
    await create();

    const rows = container.querySelectorAll('.mn-dashboard-row');
    expect(rows.length).toBe(1);
    const cells = container.querySelectorAll('.mn-dashboard-cell');
    expect(cells.length).toBe(2);
  });

  it('renders multiple rows correctly', async () => {
    await create(multiRowSchema());

    const rows = container.querySelectorAll('.mn-dashboard-row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelectorAll('.mn-dashboard-cell').length).toBe(1);
    expect(rows[1].querySelectorAll('.mn-dashboard-cell').length).toBe(2);
  });

  it('adds mn-dashboard-renderer class to container', async () => {
    await create();
    expect(container.classList.contains('mn-dashboard-renderer')).toBe(true);
  });

  it('respects column span as gridColumn style', async () => {
    await create(simpleSchema([4, 8]));

    const cells = container.querySelectorAll('.mn-dashboard-cell');
    expect(cells[0].getAttribute('style')).toContain('span 4');
    expect(cells[1].getAttribute('style')).toContain('span 8');
  });

  it('clamps span to 1..12 range', async () => {
    const schema: DashboardSchema = {
      rows: [{
        columns: [
          { type: 'custom', dataKey: 'wide', span: 20,
            options: { render: vi.fn() } },
          { type: 'custom', dataKey: 'tiny', span: -5,
            options: { render: vi.fn() } },
        ],
      }],
    };
    await create(schema);

    const cells = container.querySelectorAll('.mn-dashboard-cell');
    expect(cells[0].getAttribute('style')).toContain('span 12');
    expect(cells[1].getAttribute('style')).toContain('span 1');
  });

  it('sets data-dashboard-key attribute on cells', async () => {
    await create();

    const cells = container.querySelectorAll('.mn-dashboard-cell');
    expect(cells[0].getAttribute('data-dashboard-key')).toBe('revenue');
    expect(cells[1].getAttribute('data-dashboard-key')).toBe('users');
  });

  it('setData triggers widget render with provided value', async () => {
    const schema = simpleSchema();
    const renderer = await create(schema);

    renderer.setData('revenue', { value: 125000, label: 'Q1 Revenue' });

    const renderFn = schema.rows[0].columns[0].options!.render as ReturnType<typeof vi.fn>;
    expect(renderFn).toHaveBeenCalled();
  });

  it('setData with initial data renders on construction', async () => {
    const schema = simpleSchema();
    const data = { revenue: { value: 50000 }, users: { value: 1200 } };
    await create(schema, data);

    const revRender = schema.rows[0].columns[0].options!.render as ReturnType<typeof vi.fn>;
    const usrRender = schema.rows[0].columns[1].options!.render as ReturnType<typeof vi.fn>;
    expect(revRender).toHaveBeenCalled();
    expect(usrRender).toHaveBeenCalled();
  });

  it('setSchema hot-swaps layout completely', async () => {
    const renderer = await create();

    const newSchema: DashboardSchema = {
      rows: [{
        columns: [
          { type: 'custom', dataKey: 'single', span: 12,
            options: { render: vi.fn() } },
        ],
      }],
    };
    renderer.setSchema(newSchema);

    const rows = container.querySelectorAll('.mn-dashboard-row');
    expect(rows.length).toBe(1);
    const cells = container.querySelectorAll('.mn-dashboard-cell');
    expect(cells.length).toBe(1);
    expect(cells[0].getAttribute('data-dashboard-key')).toBe('single');
  });

  it('setSchema preserves existing data for matching keys', async () => {
    const schema = simpleSchema();
    const renderer = await create(schema, { revenue: { value: 99 } });

    const newSchema: DashboardSchema = {
      rows: [{
        columns: [
          { type: 'custom', dataKey: 'revenue', span: 12,
            options: { render: vi.fn() } },
        ],
      }],
    };
    renderer.setSchema(newSchema);
    renderer.setData('revenue', { value: 200 });

    const renderFn = newSchema.rows[0].columns[0].options!.render as ReturnType<typeof vi.fn>;
    expect(renderFn).toHaveBeenCalled();
  });

  it('getWidget returns widget controller for a data key', async () => {
    const renderer = await create(simpleSchema(), { revenue: { value: 10 } });

    const ctrl = renderer.getWidget('revenue');
    expect(ctrl).toBeDefined();
    expect(typeof (ctrl as { render: unknown }).render).toBe('function');
    expect(typeof (ctrl as { update: unknown }).update).toBe('function');
    expect(typeof (ctrl as { destroy: unknown }).destroy).toBe('function');
  });

  it('getWidget returns undefined for unknown key', async () => {
    const renderer = await create();
    expect(renderer.getWidget('nonexistent')).toBeUndefined();
  });

  it('each cell contains a StateScaffold wrapper', async () => {
    await create();

    const scaffolds = container.querySelectorAll('.mn-scaffold');
    expect(scaffolds.length).toBe(2);
  });

  it('widget without data shows loading state', async () => {
    await create();

    const loading = container.querySelectorAll('.mn-scaffold--loading');
    expect(loading.length).toBe(2);
  });

  it('setData with Error shows error state', async () => {
    const renderer = await create();

    renderer.setData('revenue', new Error('API failure'));

    const cell = container.querySelector('[data-dashboard-key="revenue"]');
    const scaffold = cell?.querySelector('.mn-scaffold');
    expect(scaffold?.classList.contains('mn-scaffold--error')).toBe(true);
  });

  it('setData with empty array shows empty state', async () => {
    const renderer = await create();

    renderer.setData('revenue', []);

    const cell = container.querySelector('[data-dashboard-key="revenue"]');
    const scaffold = cell?.querySelector('.mn-scaffold');
    expect(scaffold?.classList.contains('mn-scaffold--empty')).toBe(true);
  });

  it('destroy removes all content and class', async () => {
    const renderer = await create();

    renderer.destroy();

    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-dashboard-renderer')).toBe(false);
  });

  it('destroy after setSchema does not throw', async () => {
    const renderer = await create();
    renderer.setSchema(multiRowSchema());
    expect(() => renderer.destroy()).not.toThrow();
    expect(container.innerHTML).toBe('');
  });

  it('cells use section element', async () => {
    await create();
    expect(container.querySelectorAll('section.mn-dashboard-cell').length).toBe(2);
  });
});
