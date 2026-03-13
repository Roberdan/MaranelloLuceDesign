/**
 * @vitest-environment happy-dom
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

function makeCtx() {
  const gradient = { addColorStop: vi.fn() };
  return {
    save: vi.fn(), restore: vi.fn(), scale: vi.fn(), clearRect: vi.fn(), fillRect: vi.fn(),
    beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), moveTo: vi.fn(),
    lineTo: vi.fn(), fillText: vi.fn(), setLineDash: vi.fn(), createLinearGradient: vi.fn(() => gradient),
    shadowColor: '', shadowBlur: 0, fillStyle: '', strokeStyle: '', lineWidth: 0,
    textAlign: 'center', textBaseline: 'middle', font: '', globalAlpha: 1,
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => makeCtx() as unknown as CanvasRenderingContext2D);
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('MutationObserver', class { constructor(_: unknown) {} observe() {} disconnect() {} });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('network visualizations', () => {
  it('creates and destroys networkMessages controllers', async () => {
    const { networkMessages } = await import('../../src/ts/network-messages');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const ctrl = networkMessages(host, {
      width: 320,
      height: 220,
      nodes: [
        { id: 'a', label: 'A', x: 0.2, y: 0.5 },
        { id: 'b', label: 'B', x: 0.8, y: 0.5 },
      ],
      connections: [{ from: 'a', to: 'b' }],
    });
    expect(ctrl).not.toBeNull();
    ctrl?.send({ from: 'a', to: 'b', label: 'Q' });
    ctrl?.burst([{ from: 'a', to: 'b' }, { from: 'a', to: 'b', color: '#4EA8DE' }]);
    ctrl?.setNodes([
      { id: 'a', label: 'A', x: 0.25, y: 0.5 },
      { id: 'b', label: 'B', x: 0.75, y: 0.5 },
    ]);
    ctrl?.destroy();
    expect(host.innerHTML).toBe('');
  });

  it('creates and controls neuralNodes controllers', async () => {
    const { neuralNodes } = await import('../../src/ts/neural-nodes');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const ctrl = neuralNodes(host, { width: 320, height: 220, nodeCount: 8, particleCount: 2 });
    expect(ctrl).not.toBeNull();
    expect(() => ctrl?.setActivity(0.8)).not.toThrow();
    expect(() => ctrl?.pulse(2)).not.toThrow();
    ctrl?.destroy();
    expect(host.innerHTML).toBe('');
  });

  it('returns null when container is missing', async () => {
    const { networkMessages } = await import('../../src/ts/network-messages');
    const { neuralNodes } = await import('../../src/ts/neural-nodes');
    expect(networkMessages(null, { nodes: [], connections: [] })).toBeNull();
    expect(neuralNodes(null)).toBeNull();
  });
});
