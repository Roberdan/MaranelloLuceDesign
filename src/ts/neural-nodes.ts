/**
 * Maranello Luce Design - Organic neural network animation.
 */
import { hiDpiCanvas } from './core/utils';

export interface NeuralNodesOptions {
  nodeCount?: number; connectionDensity?: number; width?: number; height?: number;
  colors?: string[]; pulseSpeed?: number; particleCount?: number; interactive?: boolean;
}
export interface NeuralNodesController {
  pulse: (nodeIndex?: number) => void; setActivity: (level: number) => void; destroy: () => void;
}

type NodeState = { x: number; y: number; vx: number; vy: number; color: string; phase: number; energy: number };
type Connection = { a: number; b: number };
type Particle = { connection: number; lane: number; t: number; speed: number };
type Wave = { x: number; y: number; radius: number; life: number; color: string };
type Activation = { at: number; index: number };
const DEFAULT_COLORS = ['#FFC72C', '#4EA8DE', '#00A651'];

function resolveContainer(container: HTMLElement | string | null): HTMLElement | null {
  const found = typeof container === 'string' ? document.querySelector(container) : container;
  return found instanceof HTMLElement ? found : null;
}
function alpha(color: string, opacity: number): string {
  const full = color.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  const value = parseInt(full, 16);
  return Number.isNaN(value) ? `rgba(255,199,44,${opacity})` : `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
}

export function neuralNodes(
  container: HTMLElement | string | null,
  opts: NeuralNodesOptions = {},
): NeuralNodesController | null {
  const target = resolveContainer(container);
  if (!target) {
    console.warn('[Maranello] neuralNodes: container not found');
    return null;
  }
  const host = target;
  const options: Required<Omit<NeuralNodesOptions, 'width' | 'height'>> & Pick<NeuralNodesOptions, 'width' | 'height'> = {
    nodeCount: 30, connectionDensity: 0.15, colors: DEFAULT_COLORS,
    pulseSpeed: 1, particleCount: 2, interactive: true, ...opts,
  };
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  let nodes: NodeState[] = [];
  let connections: Connection[] = [];
  let particles: Particle[] = [];
  const waves: Wave[] = [];
  const activations: Activation[] = [];
  let activity = 0.55;
  let hovered = -1;
  let raf = 0;
  let frame = 0;
  let last = performance.now();
  host.innerHTML = '';
  host.style.position = 'relative'; host.style.overflow = 'hidden';
  if (options.width) host.style.width = `${options.width}px`;
  if (options.height) host.style.height = `${options.height}px`;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('aria-label', 'Neural nodes visualization');
  host.appendChild(canvas);

  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const onMove = (event: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    hovered = nodes.findIndex((node) => Math.hypot(node.x - x, node.y - y) < 18 + node.energy * 8);
  };
  const onLeave = (): void => { hovered = -1; };

  function resize(): void {
    hiDpiCanvas(canvas, options.width ?? Math.max(360, host.clientWidth || 720), options.height ?? Math.max(280, host.clientHeight || 360));
    if (!nodes.length) initNodes();
    rebuildConnections();
  }

  function initNodes(): void {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    nodes = Array.from({ length: options.nodeCount }, (_, index) => ({
      x: 24 + Math.random() * (width - 48),
      y: 24 + Math.random() * (height - 48),
      vx: (Math.random() - 0.5) * 0.025,
      vy: (Math.random() - 0.5) * 0.025,
      color: options.colors[index % options.colors.length],
      phase: Math.random() * Math.PI * 2,
      energy: Math.random() * 0.4,
    }));
  }

  function rebuildConnections(): void {
    const threshold = Math.min(canvas.clientWidth, canvas.clientHeight) * (0.14 + options.connectionDensity * 0.28);
    connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < threshold) connections.push({ a: i, b: j });
      }
    }
    particles = connections.flatMap((_, index) => Array.from({ length: options.particleCount }, (_, lane) => ({
      connection: index,
      lane,
      t: Math.random(),
      speed: 0.00012 + Math.random() * 0.00018,
    })));
  }

  function triggerPulse(nodeIndex = Math.floor(Math.random() * nodes.length)): void {
    if (!nodes[nodeIndex]) return;
    const graph = Array.from({ length: nodes.length }, () => [] as number[]);
    connections.forEach((link) => {
      graph[link.a].push(link.b);
      graph[link.b].push(link.a);
    });
    const queue: Array<[number, number]> = [[nodeIndex, 0]];
    const seen = new Set<number>([nodeIndex]);
    const start = performance.now();
    while (queue.length) {
      const [index, hop] = queue.shift() as [number, number];
      activations.push({ at: start + hop * 100, index });
      graph[index].forEach((next) => {
        if (seen.has(next)) return;
        seen.add(next);
        queue.push([next, hop + 1]);
      });
    }
  }

  function update(dt: number, now: number): void {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    while (activations[0] && activations[0].at <= now) {
      const current = activations.shift() as Activation;
      const node = nodes[current.index];
      if (!node) continue;
      node.energy = 1.9;
      waves.push({ x: node.x, y: node.y, radius: 4, life: 1, color: node.color });
    }
    nodes.forEach((node) => {
      node.vx = (node.vx + (Math.random() - 0.5) * 0.0025 * dt) * 0.985;
      node.vy = (node.vy + (Math.random() - 0.5) * 0.0025 * dt) * 0.985;
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      if (node.x < 16 || node.x > width - 16) node.vx *= -1;
      if (node.y < 16 || node.y > height - 16) node.vy *= -1;
      node.x = Math.max(16, Math.min(width - 16, node.x));
      node.y = Math.max(16, Math.min(height - 16, node.y));
      node.energy = Math.max(0, node.energy - dt * 0.0016);
    });
    if (++frame % 14 === 0) rebuildConnections();
    particles.forEach((particle) => {
      particle.t = (particle.t + dt * particle.speed * (0.45 + activity * 1.8) * options.pulseSpeed) % 1;
    });
    for (let i = waves.length - 1; i >= 0; i--) {
      waves[i].life -= dt * 0.0013 * options.pulseSpeed;
      waves[i].radius += dt * 0.11 * options.pulseSpeed;
      if (waves[i].life <= 0) waves.splice(i, 1);
    }
  }

  function draw(now: number): void {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(4,10,18,0.28)';
    ctx.fillRect(0, 0, width, height);

    connections.forEach((link) => {
      const a = nodes[link.a], b = nodes[link.b];
      const emphasized = hovered === link.a || hovered === link.b;
      const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      gradient.addColorStop(0, alpha(a.color, emphasized ? 0.48 : 0.26 + a.energy * 0.18));
      gradient.addColorStop(0.55, alpha(b.color, 0.18 + Math.max(a.energy, b.energy) * 0.16));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = emphasized ? 2 : 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    const visibleLanes = Math.max(1, Math.round(options.particleCount * (0.3 + activity * 0.7)));
    particles.forEach((particle) => {
      if (particle.lane >= visibleLanes) return;
      const link = connections[particle.connection];
      if (!link) return;
      const a = nodes[link.a], b = nodes[link.b];
      const x = a.x + (b.x - a.x) * particle.t, y = a.y + (b.y - a.y) * particle.t;
      ctx.save();
      ctx.fillStyle = alpha(a.color, 0.65 + activity * 0.25);
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 6 + activity * 8;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + activity * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    waves.forEach((wave) => {
      ctx.save();
      ctx.strokeStyle = alpha(wave.color, wave.life * 0.65);
      ctx.lineWidth = 1.5 + wave.life * 2;
      ctx.shadowColor = wave.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    nodes.forEach((node, index) => {
      const pulse = 2.4 + Math.sin(now * 0.002 * options.pulseSpeed + node.phase) * 1.4 + node.energy * 3.2 + (hovered === index ? 2 : 0);
      ctx.save();
      ctx.fillStyle = alpha(node.color, 0.2);
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12 + node.energy * 12;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function loop(now: number): void {
    const dt = Math.min(48, now - last || 16);
    last = now;
    update(dt, now);
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  resize();
  ro?.observe(host);
  if (options.interactive) {
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
  }
  raf = requestAnimationFrame(loop);

  return {
    pulse: triggerPulse,
    setActivity: (level) => { activity = Math.max(0, Math.min(1, level)); },
    destroy: () => { cancelAnimationFrame(raf); ro?.disconnect(); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); host.innerHTML = ''; },
  };
}
