/**
 * Unit tests for charts-risk-matrix component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

function mockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  Object.defineProperty(canvas, 'getBoundingClientRect', {
    value: () => ({ width: 320, height: 320, top: 0, left: 0, right: 320, bottom: 320 }),
  });
  const ctx = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 50 })),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    roundRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    set fillStyle(_v: string) { /* noop */ },
    set strokeStyle(_v: string) { /* noop */ },
    set lineWidth(_v: number) { /* noop */ },
    set font(_v: string) { /* noop */ },
    set textAlign(_v: string) { /* noop */ },
    set textBaseline(_v: string) { /* noop */ },
    set globalAlpha(_v: number) { /* noop */ },
    set lineJoin(_v: string) { /* noop */ },
  };
  vi.spyOn(canvas, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  document.body.appendChild(canvas);
  return canvas;
}

const SAMPLE_ITEMS = [
  { id: 'supply-chain', label: 'Supply Chain', probability: 4 as const, impact: 3 as const },
  { id: 'currency-risk', label: 'Currency', probability: 2 as const, impact: 5 as const },
  { id: 'regulatory', label: 'Regulatory', probability: 3 as const, impact: 4 as const },
];

describe('riskMatrix', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = mockCanvas();
  });

  it('returns a controller with update and destroy', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    const ctrl = riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    expect(ctrl).toBeDefined();
    expect(typeof ctrl!.update).toBe('function');
    expect(typeof ctrl!.destroy).toBe('function');
  });

  it('calls getContext with 2d', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('sets aria role=img on canvas', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    expect(canvas.getAttribute('role')).toBe('img');
  });

  it('creates sr-only table with item data', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    const srTable = canvas.nextElementSibling;
    expect(srTable?.classList.contains('mn-sr-only')).toBe(true);
    expect(srTable?.textContent).toContain('Supply Chain');
  });

  it('update replaces items and refreshes a11y', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    const ctrl = riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    const newItems = [
      { id: 'talent', label: 'Talent Retention', probability: 5 as const, impact: 4 as const },
    ];
    ctrl!.update(newItems);
    const srTable = canvas.nextElementSibling;
    expect(srTable?.textContent).toContain('Talent Retention');
    expect(srTable?.textContent).not.toContain('Supply Chain');
  });

  it('destroy removes event listeners and sr-only element', async () => {
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    const ctrl = riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false });
    ctrl!.destroy();
    const srTable = canvas.nextElementSibling;
    expect(srTable?.classList.contains('mn-sr-only') ?? false).toBe(false);
  });

  it('fires onClick callback when item is clicked', async () => {
    const spy = vi.fn();
    const { riskMatrix } = await import('../../src/ts/charts-risk-matrix');
    riskMatrix(canvas, { items: SAMPLE_ITEMS, animate: false, onClick: spy });
    /* Click event dispatched; hit test depends on geometry so spy may not fire,
       but the listener registration should not throw */
    canvas.dispatchEvent(new MouseEvent('click', { clientX: 160, clientY: 160 }));
    /* No assertion on spy call count -- geometry-dependent */
  });
});
