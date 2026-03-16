/**
 * Unit tests for charts-cost-timeline (canvas chart).
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { costTimeline, type CostTimelineOptions } from '../../src/ts/charts-cost-timeline';

function mockCtx(): Record<string, unknown> {
  return {
    scale: vi.fn(), clearRect: vi.fn(), save: vi.fn(), restore: vi.fn(),
    beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
    fill: vi.fn(), stroke: vi.fn(), arc: vi.fn(), fillRect: vi.fn(),
    strokeRect: vi.fn(), fillText: vi.fn(), setLineDash: vi.fn(),
    roundRect: vi.fn(), clip: vi.fn(), rect: vi.fn(), rotate: vi.fn(),
    translate: vi.fn(), measureText: vi.fn(() => ({ width: 40 })),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: '',
    canvas: {} as HTMLCanvasElement,
  };
}

function makeOpts(): CostTimelineOptions {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    series: [
      { id: 'infra', label: 'Infrastructure', values: [1200, 1350, 1100, 1500, 1400] },
      { id: 'agents', label: 'AI Agents', values: [800, 950, 1100, 1250, 1600] },
    ],
    animate: false,
    height: 200,
    stacked: true,
    unit: '$',
  };
}

let canvas: HTMLCanvasElement;
let ctx: Record<string, unknown>;

beforeEach(() => {
  canvas = document.createElement('canvas');
  const wrapper = document.createElement('div');
  wrapper.appendChild(canvas);
  ctx = mockCtx();
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(
    { width: 400, height: 200, top: 0, left: 0, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) },
  );
});

describe('costTimeline', () => {
  it('returns a controller with update and destroy', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    expect(ctrl).toHaveProperty('update');
    expect(ctrl).toHaveProperty('destroy');
    ctrl.destroy();
  });

  it('calls getContext to acquire 2D drawing context', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
    ctrl.destroy();
  });

  it('draws on the canvas context', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    ctrl.destroy();
  });

  it('sets role=img on the canvas for accessibility', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    expect(canvas.getAttribute('role')).toBe('img');
    ctrl.destroy();
  });

  it('creates an sr-only sibling element', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    const srOnly = canvas.nextElementSibling;
    expect(srOnly?.classList.contains('mn-sr-only')).toBe(true);
    ctrl.destroy();
  });

  it('update redraws the chart with new options', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    const callsBefore = (ctx.beginPath as ReturnType<typeof vi.fn>).mock.calls.length;
    ctrl.update({ labels: ['Q1', 'Q2', 'Q3'], series: [{ id: 'rev', label: 'Revenue', values: [500, 600, 700] }] });
    expect((ctx.beginPath as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(callsBefore);
    ctrl.destroy();
  });

  it('destroy removes sr-only sibling', () => {
    const ctrl = costTimeline(canvas, makeOpts());
    expect(canvas.nextElementSibling?.classList.contains('mn-sr-only')).toBe(true);
    ctrl.destroy();
    expect(canvas.nextElementSibling).toBeNull();
  });

  it('renders Y-axis labels with currency unit', () => {
    costTimeline(canvas, makeOpts());
    const fillTextCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls;
    const yLabels = fillTextCalls.filter((c: string[]) => typeof c[0] === 'string' && c[0].startsWith('$'));
    expect(yLabels.length).toBeGreaterThan(0);
  });

  it('renders X-axis labels from config', () => {
    costTimeline(canvas, makeOpts());
    const fillTextCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls;
    const labels = fillTextCalls.map((c: string[]) => c[0]);
    expect(labels).toContain('Jan');
  });
});
