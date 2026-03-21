/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sparklineMock, createGaugeMock } = vi.hoisted(() => ({
  sparklineMock: vi.fn(),
  createGaugeMock: vi.fn(() => ({ redraw: vi.fn(), destroy: vi.fn(), config: {} })),
}));

vi.mock('../src/ts/charts', () => ({
  sparkline: sparklineMock,
  donut: vi.fn(),
  barChart: vi.fn(),
  hBarChart: vi.fn(),
  areaChart: vi.fn(),
  liveGraph: vi.fn(),
  halfGauge: vi.fn(),
  progressRing: vi.fn(),
  flipCounter: vi.fn(),
  radar: vi.fn(),
  bubble: vi.fn(),
}));

vi.mock('../src/ts/gauge-engine-class', () => ({
  createGauge: createGaugeMock,
}));

import { DashboardRenderer, type DashboardSchema } from '../src/ts/dashboard-renderer';

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  sparklineMock.mockReset();
  createGaugeMock.mockClear();
});

describe('DashboardRenderer', () => {
  it('renders 3 cells for 3-widget schema', () => {
    const schema: DashboardSchema = {
      rows: [{ columns: [
        { type: 'stat-card', dataKey: 'a' },
        { type: 'legend', dataKey: 'b' },
        { type: 'table-summary', dataKey: 'c' },
      ] }],
    };
    new DashboardRenderer(container, { schema, data: { a: { value: 1 }, b: [{ label: 'x', color: '#fff' }], c: { headers: ['h'], rows: [[1]] } } });
    expect(container.querySelectorAll('.mn-dashboard-cell')).toHaveLength(3);
  });

  it('chart widget creates canvas and calls chart factory', () => {
    const schema: DashboardSchema = {
      rows: [{ columns: [{ type: 'chart', dataKey: 'trend', options: { chartType: 'sparkline' } }] }],
    };
    new DashboardRenderer(container, { schema, data: { trend: [1, 2, 3] } });
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(sparklineMock).toHaveBeenCalledTimes(1);
  });

  it('gauge widget creates canvas', () => {
    const schema: DashboardSchema = {
      rows: [{ columns: [{ type: 'gauge', dataKey: 'fuel' }] }],
    };
    new DashboardRenderer(container, { schema, data: { fuel: { value: 42 } } });
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(createGaugeMock).toHaveBeenCalledTimes(1);
  });

  it('null data sets loading scaffold', () => {
    const schema: DashboardSchema = { rows: [{ columns: [{ type: 'stat-card', dataKey: 'status' }] }] };
    new DashboardRenderer(container, { schema, data: { status: null } });
    expect(container.querySelector('.mn-scaffold--loading')).not.toBeNull();
  });

  it('empty array sets empty scaffold', () => {
    const schema: DashboardSchema = { rows: [{ columns: [{ type: 'legend', dataKey: 'items' }] }] };
    new DashboardRenderer(container, { schema, data: { items: [] } });
    expect(container.querySelector('.mn-scaffold--empty')).not.toBeNull();
  });

  it('Error data sets error scaffold', () => {
    const schema: DashboardSchema = { rows: [{ columns: [{ type: 'stat-card', dataKey: 'status' }] }] };
    new DashboardRenderer(container, { schema, data: { status: new Error('boom') } });
    expect(container.querySelector('.mn-scaffold--error')).not.toBeNull();
  });

  it('setData updates single widget', () => {
    const leftRender = vi.fn((el: HTMLElement, data: unknown) => { el.textContent = String(data); });
    const rightRender = vi.fn((el: HTMLElement, data: unknown) => { el.textContent = String(data); });
    const schema: DashboardSchema = {
      rows: [{ columns: [
        { type: 'custom', dataKey: 'left', options: { render: leftRender } },
        { type: 'custom', dataKey: 'right', options: { render: rightRender } },
      ] }],
    };
    const renderer = new DashboardRenderer(container, { schema, data: { left: 1, right: 2 } });
    leftRender.mockClear();
    rightRender.mockClear();

    renderer.setData('left', 9);

    expect(leftRender).toHaveBeenCalledTimes(1);
    expect(rightRender).toHaveBeenCalledTimes(0);
  });

  it('setData after error correctly renders widget in content host', () => {
    const renderFn = vi.fn((el: HTMLElement, data: unknown) => { el.textContent = String(data); });
    const schema: DashboardSchema = {
      rows: [{ columns: [{ type: 'custom', dataKey: 'w', options: { render: renderFn } }] }],
    };
    const renderer = new DashboardRenderer(container, { schema, data: { w: new Error('fail') } });
    expect(container.querySelector('.mn-scaffold--error')).not.toBeNull();

    renderer.setData('w', 'ok');
    expect(container.querySelector('.mn-scaffold--ready')).not.toBeNull();
    expect(renderFn).toHaveBeenCalledTimes(1);
    const widgetHost = container.querySelector('.mn-dashboard-widget-host');
    expect(widgetHost).not.toBeNull();
    expect(widgetHost!.textContent).toBe('ok');
  });

  it('destroy cleans up widgets and container', () => {
    const schema: DashboardSchema = { rows: [{ columns: [{ type: 'stat-card', dataKey: 'x' }] }] };
    const renderer = new DashboardRenderer(container, { schema, data: { x: { value: 10 } } });
    renderer.destroy();
    expect(container.innerHTML).toBe('');
    expect(renderer.getWidget('x')).toBeUndefined();
  });
});
