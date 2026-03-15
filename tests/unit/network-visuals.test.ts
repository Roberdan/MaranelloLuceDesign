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

  it('creates data-driven neuralNodes with custom nodes and connections', async () => {
    const { neuralNodes } = await import('../../src/ts/neural-nodes');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const ctrl = neuralNodes(host, {
      width: 400, height: 300,
      nodes: [
        { id: 's1', label: 'Claude', sublabel: 'opus', color: '#FFC72C', size: 1.5, group: 'claude', badge: 'm3max' },
        { id: 's2', label: 'Copilot', group: 'copilot', size: 1.2 },
        { id: 'p1', label: 'Plan #623', size: 2, group: 'plans' },
      ],
      connections: [
        { from: 's1', to: 'p1', strength: 0.8 },
        { from: 's2', to: 'p1', strength: 0.5 },
      ],
      forceLayout: true,
      labels: true,
      interactive: true,
    });
    expect(ctrl).not.toBeNull();
    expect(() => ctrl?.pulse('s1')).not.toThrow();
    expect(() => ctrl?.pulse(0)).not.toThrow();
    ctrl?.destroy();
    expect(host.innerHTML).toBe('');
  });

  it('supports dynamic node operations (add, remove, update, highlight)', async () => {
    const { neuralNodes } = await import('../../src/ts/neural-nodes');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const ctrl = neuralNodes(host, {
      width: 320, height: 220,
      nodes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
      connections: [{ from: 'a', to: 'b' }],
    });
    expect(ctrl).not.toBeNull();
    expect(() => ctrl?.addNode({ id: 'c', label: 'C', group: 'test' })).not.toThrow();
    expect(() => ctrl?.updateNode('c', { color: '#00A651', badge: 'new' })).not.toThrow();
    expect(() => ctrl?.highlightNode('a')).not.toThrow();
    expect(() => ctrl?.highlightNode(null)).not.toThrow();
    expect(() => ctrl?.removeNode('b')).not.toThrow();
    expect(() => ctrl?.setNodes([{ id: 'x', label: 'X' }])).not.toThrow();
    expect(() => ctrl?.setConnections([{ from: 'x', to: 'a' }])).not.toThrow();
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
