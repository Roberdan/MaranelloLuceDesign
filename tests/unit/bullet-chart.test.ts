/**
 * Unit tests for bullet-chart (canvas-based).
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bulletChart, type BulletChartOptions } from '../../src/ts/charts-bullet';

function makeOpts(overrides: Partial<BulletChartOptions> = {}): BulletChartOptions {
  return {
    value: 72,
    target: 85,
    max: 100,
    label: 'Revenue Q4',
    unit: '%',
    animate: false,
    ...overrides,
  };
}

function mockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    font: '',
    textBaseline: '',
    textAlign: '',
  };
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  // Provide offsetWidth fallback since happy-dom has no layout
  Object.defineProperty(canvas, 'offsetWidth', { value: 400, configurable: true });
  return canvas;
}

function getCtx(canvas: HTMLCanvasElement): Record<string, ReturnType<typeof vi.fn>> {
  return canvas.getContext('2d') as unknown as Record<string, ReturnType<typeof vi.fn>>;
}

let canvas: HTMLCanvasElement;

beforeEach(() => {
  canvas = mockCanvas();
  // Mock getComputedStyle for resolve() calls inside the module
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    getPropertyValue: () => '#888888',
  } as unknown as CSSStyleDeclaration);
});

describe('bulletChart', () => {
  it('sets role=img on canvas', () => {
    bulletChart(canvas, makeOpts());
    expect(canvas.getAttribute('role')).toBe('img');
  });

  it('sets descriptive aria-label with value, target, and percentage', () => {
    bulletChart(canvas, makeOpts({ value: 72, target: 85, max: 100, unit: '%' }));
    const label = canvas.getAttribute('aria-label') ?? '';
    expect(label).toContain('Revenue Q4');
    expect(label).toContain('value 72%');
    expect(label).toContain('target 85%');
    expect(label).toContain('72% of max');
  });

  it('draws qualitative bands, value bar, and target marker', () => {
    bulletChart(canvas, makeOpts());
    const ctx = getCtx(canvas);
    // 3 default bands + 1 value bar = at least 4 fill calls via roundRect
    expect(ctx.roundRect.mock.calls.length).toBeGreaterThanOrEqual(4);
    // target marker drawn with fillRect
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  it('draws the value label text', () => {
    bulletChart(canvas, makeOpts({ value: 72, unit: '%' }));
    const ctx = getCtx(canvas);
    const textCalls = ctx.fillText.mock.calls.map((c: unknown[]) => c[0]);
    expect(textCalls).toContain('72%');
  });

  it('draws the target label text', () => {
    bulletChart(canvas, makeOpts({ target: 85, unit: '%' }));
    const ctx = getCtx(canvas);
    const textCalls = ctx.fillText.mock.calls.map((c: unknown[]) => c[0]);
    expect(textCalls).toContain('85%');
  });

  it('draws the label text when provided', () => {
    bulletChart(canvas, makeOpts({ label: 'Revenue Q4' }));
    const ctx = getCtx(canvas);
    const textCalls = ctx.fillText.mock.calls.map((c: unknown[]) => c[0]);
    expect(textCalls).toContain('Revenue Q4');
  });

  it('handles zero max gracefully (0% in aria-label)', () => {
    bulletChart(canvas, makeOpts({ value: 0, target: 0, max: 0 }));
    const label = canvas.getAttribute('aria-label') ?? '';
    expect(label).toContain('0% of max');
  });

  it('uses custom ranges when provided', () => {
    const ranges = [
      { max: 30, color: '#ff0000', label: 'Poor' },
      { max: 70, color: '#ffaa00', label: 'Fair' },
      { max: 100, color: '#00aa00', label: 'Good' },
    ];
    bulletChart(canvas, makeOpts({ ranges }));
    const ctx = getCtx(canvas);
    // 3 custom bands + 1 value bar = 4 roundRect+fill pairs
    expect(ctx.roundRect.mock.calls.length).toBeGreaterThanOrEqual(4);
  });

  it('sets canvas dimensions based on devicePixelRatio', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    bulletChart(canvas, makeOpts());
    // Canvas physical size should be 2x logical
    const ctx = getCtx(canvas);
    expect(ctx.scale).toHaveBeenCalledWith(2, 2);
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
  });

  it('omits label drawing when label is undefined', () => {
    bulletChart(canvas, makeOpts({ label: undefined }));
    const ctx = getCtx(canvas);
    const textCalls = ctx.fillText.mock.calls.map((c: unknown[]) => c[0]);
    expect(textCalls).not.toContain('Revenue Q4');
  });

  it('returns void (no controller)', () => {
    const result = bulletChart(canvas, makeOpts());
    expect(result).toBeUndefined();
  });
});
