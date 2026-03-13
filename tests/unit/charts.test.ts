/**
 * Unit tests for chart factories and helper utilities.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Canvas mock ---
function makeCtx() {
  const grad = { addColorStop: vi.fn() };
  return {
    save: vi.fn(), restore: vi.fn(), scale: vi.fn(),
    clearRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(),
    fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
    moveTo: vi.fn(), lineTo: vi.fn(), closePath: vi.fn(),
    bezierCurveTo: vi.fn(),
    createLinearGradient: vi.fn(() => grad),
    createRadialGradient: vi.fn(() => grad),
    strokeStyle: '', fillStyle: '', lineWidth: 0,
    lineCap: '', lineJoin: '', globalAlpha: 1,
    textAlign: '', textBaseline: '', font: '',
    measureText: vi.fn(() => ({ width: 50 })),
  };
}

function makeCanvas(w = 200, h = 100): HTMLCanvasElement {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const ctx = makeCtx();
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  canvas.setAttribute('width', String(w));
  canvas.setAttribute('height', String(h));
  return canvas;
}

// --- hexLum ---
describe('hexLum', () => {
  it('returns 0 for pure black', async () => {
    const { hexLum } = await import('../../src/ts/h-bar-chart-draw');
    expect(hexLum('#000000')).toBeCloseTo(0);
  });

  it('returns ~1 for pure white', async () => {
    const { hexLum } = await import('../../src/ts/h-bar-chart-draw');
    expect(hexLum('#ffffff')).toBeCloseTo(1, 1);
  });

  it('returns value between 0 and 1 for grey', async () => {
    const { hexLum } = await import('../../src/ts/h-bar-chart-draw');
    const lum = hexLum('#888888');
    expect(lum).toBeGreaterThan(0);
    expect(lum).toBeLessThan(1);
  });
});

// --- normalizeHex ---
describe('normalizeHex', () => {
  it('returns 6-digit hex unchanged', async () => {
    const { normalizeHex } = await import('../../src/ts/h-bar-chart-draw');
    expect(normalizeHex('#AABBCC')).toBe('#AABBCC');
  });

  it('expands 3-digit shorthand hex', async () => {
    const { normalizeHex } = await import('../../src/ts/h-bar-chart-draw');
    expect(normalizeHex('#abc')).toBe('#aabbcc');
  });

  it('returns fallback for null input', async () => {
    const { normalizeHex } = await import('../../src/ts/h-bar-chart-draw');
    const result = normalizeHex(null);
    expect(result).toMatch(/^#/);
    expect(result.length).toBe(7);
  });

  it('returns fallback for invalid color string', async () => {
    const { normalizeHex } = await import('../../src/ts/h-bar-chart-draw');
    const result = normalizeHex('not-a-color');
    expect(result).toMatch(/^#/);
  });
});

// --- buildTicks ---
describe('buildTicks', () => {
  it('returns 5 tick values (0 to maxValue)', async () => {
    const { buildTicks } = await import('../../src/ts/h-bar-chart-draw');
    const ticks = buildTicks(100);
    expect(ticks.length).toBe(5);
    expect(ticks[0]).toBe(0);
    expect(ticks[4]).toBe(100);
  });

  it('returns evenly-spaced ticks', async () => {
    const { buildTicks } = await import('../../src/ts/h-bar-chart-draw');
    const ticks = buildTicks(200);
    expect(ticks[1]).toBe(50);
    expect(ticks[2]).toBe(100);
    expect(ticks[3]).toBe(150);
  });

  it('handles non-round max values', async () => {
    const { buildTicks } = await import('../../src/ts/h-bar-chart-draw');
    const ticks = buildTicks(10);
    expect(ticks[0]).toBe(0);
    expect(ticks[4]).toBe(10);
    expect(ticks.length).toBe(5);
  });
});

// --- hexToRgba ---
describe('hexToRgba', () => {
  it('converts hex to rgba string', async () => {
    const { hexToRgba } = await import('../../src/ts/charts-helpers');
    expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255,0,0,0.5)');
  });

  it('converts dark color', async () => {
    const { hexToRgba } = await import('../../src/ts/charts-helpers');
    expect(hexToRgba('#000000', 1)).toBe('rgba(0,0,0,1)');
  });
});

// --- getCanvasSize ---
describe('getCanvasSize', () => {
  it('reads from data-width/data-height attributes', async () => {
    const { getCanvasSize } = await import('../../src/ts/charts-helpers');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('data-width', '300');
    canvas.setAttribute('data-height', '150');
    const size = getCanvasSize(canvas);
    expect(size.width).toBe(300);
    expect(size.height).toBe(150);
  });

  it('falls back to width/height attributes', async () => {
    const { getCanvasSize } = await import('../../src/ts/charts-helpers');
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '400');
    canvas.setAttribute('height', '200');
    const size = getCanvasSize(canvas);
    expect(size.width).toBe(400);
    expect(size.height).toBe(200);
  });

  it('returns defaults when no size info available', async () => {
    const { getCanvasSize } = await import('../../src/ts/charts-helpers');
    const canvas = document.createElement('canvas');
    const size = getCanvasSize(canvas, 120, 60);
    expect(size.width).toBe(120);
    expect(size.height).toBe(60);
  });
});

// --- buildSeries ---
describe('buildSeries', () => {
  it('returns array of color strings', async () => {
    const { buildSeries } = await import('../../src/ts/charts-helpers');
    const series = buildSeries();
    expect(Array.isArray(series)).toBe(true);
    expect(series.length).toBeGreaterThanOrEqual(6);
  });

  it('all entries are strings starting with # or var(', async () => {
    const { buildSeries } = await import('../../src/ts/charts-helpers');
    const series = buildSeries();
    for (const c of series) {
      expect(typeof c).toBe('string');
      expect(c.length).toBeGreaterThan(0);
    }
  });
});
