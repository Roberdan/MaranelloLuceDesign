/**
 * Unit tests for gauge engine, palette, and speedometer utilities.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Canvas mock factory ---
function makeCtx() {
  return {
    save: vi.fn(), restore: vi.fn(), scale: vi.fn(),
    clearRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(),
    fill: vi.fn(), stroke: vi.fn(), fillText: vi.fn(),
    moveTo: vi.fn(), lineTo: vi.fn(), translate: vi.fn(),
    rotate: vi.fn(), closePath: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    strokeStyle: '', fillStyle: '', lineWidth: 0,
    lineCap: '', lineJoin: '', globalAlpha: 1,
    textAlign: '', textBaseline: '', font: '', shadowColor: '', shadowBlur: 0,
    measureText: vi.fn(() => ({ width: 0 })),
  };
}

function makeCanvas(dataGauge = '{}', dataSize = ''): HTMLCanvasElement {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const ctx = makeCtx();
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  if (dataGauge !== '{}') canvas.dataset.gauge = dataGauge;
  if (dataSize) canvas.dataset.size = dataSize;
  return canvas;
}

// --- GAUGE_SIZES constant ---
describe('GAUGE_SIZES', () => {
  it('exports sm=120, md=220, lg=320', async () => {
    const { GAUGE_SIZES } = await import('../../src/ts/gauge-engine-class');
    expect(GAUGE_SIZES.sm).toBe(120);
    expect(GAUGE_SIZES.md).toBe(220);
    expect(GAUGE_SIZES.lg).toBe(320);
  });
});

// --- buildGaugePalette ---
describe('buildGaugePalette', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('returns default palette for editorial theme', async () => {
    const { buildGaugePalette } = await import('../../src/ts/gauge-engine-palette');
    const p = buildGaugePalette('#FFC72C');
    expect(typeof p.numbers).toBe('string');
    expect(typeof p.needleTip).toBe('string');
    expect(Array.isArray(p.capOuter)).toBe(true);
  });

  it('avorio theme alters subDialBg', async () => {
    document.body.classList.add('mn-avorio');
    const { buildGaugePalette } = await import('../../src/ts/gauge-engine-palette');
    const p = buildGaugePalette('#FFC72C');
    expect(p.subDialBg[0]).toBe('#e8e4dc');
  });

  it('colorblind theme uses accessible tick colors', async () => {
    document.body.classList.remove('mn-avorio');
    document.body.classList.add('mn-colorblind');
    const { buildGaugePalette } = await import('../../src/ts/gauge-engine-palette');
    const p = buildGaugePalette('#0072B2');
    expect(p.tickMajor).toBe('#FFB000');
    expect(p.quadrantHi).toBe('#0072B2');
  });

  it('nero theme darkens sub-dial background', async () => {
    document.body.classList.remove('mn-colorblind');
    document.body.classList.add('mn-nero');
    const { buildGaugePalette } = await import('../../src/ts/gauge-engine-palette');
    const p = buildGaugePalette('#FFC72C');
    expect(p.subDialBg[0]).toBe('#1a1a1a');
  });
});

// --- valueToAngle ---
describe('valueToAngle', () => {
  it('returns START angle at value=0', async () => {
    const { valueToAngle, START } = await import('../../src/ts/speedometer-palette');
    expect(valueToAngle(0, 100)).toBeCloseTo(START);
  });

  it('returns START+SWEEP at value=max', async () => {
    const { valueToAngle, START, SWEEP } = await import('../../src/ts/speedometer-palette');
    expect(valueToAngle(100, 100)).toBeCloseTo(START + SWEEP);
  });

  it('returns midpoint angle at value=max/2', async () => {
    const { valueToAngle, START, SWEEP } = await import('../../src/ts/speedometer-palette');
    expect(valueToAngle(50, 100)).toBeCloseTo(START + SWEEP / 2);
  });

  it('clamps negative values to START', async () => {
    const { valueToAngle, START } = await import('../../src/ts/speedometer-palette');
    expect(valueToAngle(-10, 100)).toBeCloseTo(START);
  });

  it('clamps over-max values to START+SWEEP', async () => {
    const { valueToAngle, START, SWEEP } = await import('../../src/ts/speedometer-palette');
    expect(valueToAngle(200, 100)).toBeCloseTo(START + SWEEP);
  });
});

// --- easeOutCubic ---
describe('easeOutCubic', () => {
  it('returns 0 at t=0', async () => {
    const { easeOutCubic } = await import('../../src/ts/speedometer-palette');
    expect(easeOutCubic(0)).toBe(0);
  });

  it('returns 1 at t=1', async () => {
    const { easeOutCubic } = await import('../../src/ts/speedometer-palette');
    expect(easeOutCubic(1)).toBe(1);
  });

  it('returns value > t for midpoints (eases out)', async () => {
    const { easeOutCubic } = await import('../../src/ts/speedometer-palette');
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

// --- createGauge factory ---
describe('createGauge', () => {
  it('returns null for unknown selector', async () => {
    const { createGauge } = await import('../../src/ts/gauge-engine-class');
    const result = createGauge({ target: '#nonexistent-canvas-xyz' });
    expect(result).toBeNull();
  });

  it('creates gauge from canvas element', async () => {
    const { createGauge } = await import('../../src/ts/gauge-engine-class');
    const canvas = makeCanvas();
    // mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', vi.fn());
    const gauge = createGauge({ target: canvas });
    expect(gauge).not.toBeNull();
    vi.unstubAllGlobals();
  });

  it('sets config on canvas dataset when provided', async () => {
    const { createGauge } = await import('../../src/ts/gauge-engine-class');
    const canvas = makeCanvas();
    vi.stubGlobal('requestAnimationFrame', vi.fn());
    createGauge({ target: canvas, config: { value: 42 } as any });
    expect(canvas.dataset.gauge).toBe(JSON.stringify({ value: 42 }));
    vi.unstubAllGlobals();
  });
});
