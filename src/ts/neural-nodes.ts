/**
 * Maranello Luce Design - Organic neural network animation.
 * Supports both legacy random mode (nodeCount) and data-driven mode (nodes[]).
 */
import { hiDpiCanvas } from './core/utils';
import { applyForces } from './neural-nodes-force';
import { drawFrame, toAlpha } from './neural-nodes-draw';
import type {
  NeuralNodesOptions, NeuralNodesController, NeuralNodeData,
  NeuralConnection, InternalNode, InternalConnection, Particle, Wave, Activation,
} from './neural-nodes-types';

export type { NeuralNodesOptions, NeuralNodesController, NeuralNodeData, NeuralConnection };

const DEFAULT_COLORS = ['#FFC72C', '#4EA8DE', '#00A651'];
const GROUP_COLORS: Record<string, string> = { claude: '#FFC72C', copilot: '#4EA8DE' };

function resolveContainer(c: HTMLElement | string | null): HTMLElement | null {
  const found = typeof c === 'string' ? document.querySelector(c) : c;
  return found instanceof HTMLElement ? found : null;
}

export function neuralNodes(
  container: HTMLElement | string | null, opts: NeuralNodesOptions = {},
): NeuralNodesController | null {
  const target = resolveContainer(container);
  if (!target) { console.warn('[Maranello] neuralNodes: container not found'); return null; }
  const host = target;

  const dataMode = Array.isArray(opts.nodes) && opts.nodes.length > 0;
  const o = {
    nodeCount: 30, connectionDensity: 0.15, colors: DEFAULT_COLORS,
    pulseSpeed: 1, particleCount: 2, interactive: true,
    labels: dataMode, forceLayout: dataMode, labelFont: 'monospace', ...opts,
  };

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  let nodes: InternalNode[] = [], connections: InternalConnection[] = [], particles: Particle[] = [];
  const waves: Wave[] = [], activations: Activation[] = [];
  let activity = 0.55, hovered = -1, raf = 0, frame = 0, last = performance.now();
  host.innerHTML = '';
  host.style.position = 'relative'; host.style.overflow = 'hidden';
  if (o.width) host.style.width = `${o.width}px`;
  if (o.height) host.style.height = `${o.height}px`;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Neural nodes visualization');
  canvas.setAttribute('tabindex', '0');
  host.appendChild(canvas);

  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const onMove = (e: MouseEvent): void => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    hovered = nodes.findIndex((n) => Math.hypot(n.x - x, n.y - y) < 18 + n.energy * 8);
  };
  const onLeave = (): void => { hovered = -1; };

  function resize(): void {
    hiDpiCanvas(canvas, o.width ?? Math.max(360, host.clientWidth || 720), o.height ?? Math.max(280, host.clientHeight || 360));
    if (!nodes.length) initNodes();
    if (!dataMode) rebuildAutoConnections();
  }

  function toInternal(nd: NeuralNodeData, w: number, h: number): InternalNode {
    const color = nd.color ?? (nd.group && GROUP_COLORS[nd.group]) ?? o.colors[0];
    return {
      id: nd.id, x: 24 + Math.random() * (w - 48), y: 24 + Math.random() * (h - 48),
      vx: 0, vy: 0, color, phase: Math.random() * Math.PI * 2,
      energy: nd.energy ?? Math.random() * 0.4, size: nd.size ?? 1,
      label: nd.label, sublabel: nd.sublabel, badge: nd.badge, group: nd.group,
    };
  }

  function initNodes(): void {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    if (dataMode) {
      nodes = o.nodes!.map((nd) => toInternal(nd, w, h));
      buildExplicitConnections();
    } else {
      nodes = Array.from({ length: o.nodeCount }, (_, i) => ({
        id: String(i), x: 24 + Math.random() * (w - 48), y: 24 + Math.random() * (h - 48),
        vx: (Math.random() - 0.5) * 0.025, vy: (Math.random() - 0.5) * 0.025,
        color: o.colors[i % o.colors.length], phase: Math.random() * Math.PI * 2,
        energy: Math.random() * 0.4, size: 1,
      }));
    }
    updateAriaLabel();
  }

  function buildExplicitConnections(): void {
    if (!o.connections) { connections = []; spawnParticles(); return; }
    const idMap = new Map(nodes.map((n, i) => [n.id, i]));
    connections = [];
    for (const c of o.connections) {
      const a = idMap.get(c.from), b = idMap.get(c.to);
      if (a !== undefined && b !== undefined) connections.push({ a, b, strength: c.strength ?? 0.5 });
    }
    spawnParticles();
  }

  function rebuildAutoConnections(): void {
    const threshold = Math.min(canvas.clientWidth, canvas.clientHeight) * (0.14 + o.connectionDensity * 0.28);
    connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < threshold)
          connections.push({ a: i, b: j, strength: 0.5 });
      }
    }
    spawnParticles();
  }

  function spawnParticles(): void {
    particles = connections.flatMap((_, idx) => Array.from({ length: o.particleCount }, (_, lane) => ({
      connection: idx, lane, t: Math.random(), speed: 0.00012 + Math.random() * 0.00018,
    })));
    updateAriaLabel();
  }

  function updateAriaLabel(): void {
    canvas.setAttribute('aria-label', `Neural nodes: ${nodes.length} nodes, ${connections.length} connections`);
  }

  function resolveTarget(target?: number | string): number {
    if (typeof target === 'string') {
      const idx = nodes.findIndex((n) => n.id === target);
      return idx >= 0 ? idx : Math.floor(Math.random() * nodes.length);
    }
    return target ?? Math.floor(Math.random() * nodes.length);
  }

  function triggerPulse(target?: number | string): void {
    const nodeIndex = resolveTarget(target);
    if (!nodes[nodeIndex]) return;
    const graph = Array.from({ length: nodes.length }, () => [] as number[]);
    connections.forEach((l) => { graph[l.a].push(l.b); graph[l.b].push(l.a); });
    const queue: Array<[number, number]> = [[nodeIndex, 0]];
    const seen = new Set<number>([nodeIndex]);
    const start = performance.now();
    while (queue.length) {
      const [idx, hop] = queue.shift()!;
      activations.push({ at: start + hop * 100, index: idx });
      graph[idx].forEach((next) => { if (!seen.has(next)) { seen.add(next); queue.push([next, hop + 1]); } });
    }
  }

  function update(dt: number, now: number): void {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    while (activations[0] && activations[0].at <= now) {
      const cur = activations.shift()!;
      const n = nodes[cur.index];
      if (!n) continue;
      n.energy = 1.9;
      waves.push({ x: n.x, y: n.y, radius: 4, life: 1, color: n.color });
    }
    if (o.forceLayout && dataMode) {
      applyForces(nodes, connections, w, h);
    } else {
      nodes.forEach((n) => {
        n.vx = (n.vx + (Math.random() - 0.5) * 0.0025 * dt) * 0.985;
        n.vy = (n.vy + (Math.random() - 0.5) * 0.0025 * dt) * 0.985;
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < 16 || n.x > w - 16) n.vx *= -1;
        if (n.y < 16 || n.y > h - 16) n.vy *= -1;
        n.x = Math.max(16, Math.min(w - 16, n.x));
        n.y = Math.max(16, Math.min(h - 16, n.y));
      });
      if (++frame % 14 === 0) rebuildAutoConnections();
    }
    nodes.forEach((n) => { n.energy = Math.max(0, n.energy - dt * 0.0016); });
    particles.forEach((p) => { p.t = (p.t + dt * p.speed * (0.45 + activity * 1.8) * o.pulseSpeed) % 1; });
    for (let i = waves.length - 1; i >= 0; i--) {
      waves[i].life -= dt * 0.0013 * o.pulseSpeed;
      waves[i].radius += dt * 0.11 * o.pulseSpeed;
      if (waves[i].life <= 0) waves.splice(i, 1);
    }
  }

  function loop(now: number): void {
    const dt = Math.min(48, now - last || 16); last = now;
    update(dt, now);
    drawFrame(ctx, now, { nodes, connections, particles, waves, hovered, activity, pulseSpeed: o.pulseSpeed, particleCount: o.particleCount, labels: o.labels, labelFont: o.labelFont });
    raf = requestAnimationFrame(loop);
  }

  function setAllNodes(data: NeuralNodeData[]): void {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    nodes = data.map((nd) => toInternal(nd, w, h));
    buildExplicitConnections();
  }

  resize(); ro?.observe(host);
  if (o.interactive) { canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave); }
  raf = requestAnimationFrame(loop);

  return {
    pulse: triggerPulse,
    setActivity: (level) => { activity = Math.max(0, Math.min(1, level)); },
    destroy: () => { cancelAnimationFrame(raf); ro?.disconnect(); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); host.innerHTML = ''; },
    setNodes: setAllNodes,
    setConnections: (data) => { o.connections = data; buildExplicitConnections(); },
    addNode: (nd) => { const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1; nodes.push(toInternal(nd, w, h)); buildExplicitConnections(); },
    removeNode: (id) => { nodes = nodes.filter((n) => n.id !== id); buildExplicitConnections(); },
    updateNode: (id, patch) => {
      const n = nodes.find((nd) => nd.id === id); if (!n) return;
      if (patch.label !== undefined) n.label = patch.label;
      if (patch.sublabel !== undefined) n.sublabel = patch.sublabel;
      if (patch.color !== undefined) n.color = patch.color;
      if (patch.size !== undefined) n.size = patch.size;
      if (patch.badge !== undefined) n.badge = patch.badge;
      if (patch.group !== undefined) n.group = patch.group;
      if (patch.energy !== undefined) n.energy = patch.energy;
    },
    highlightNode: (id) => { hovered = id === null ? -1 : nodes.findIndex((n) => n.id === id); },
  };
}
