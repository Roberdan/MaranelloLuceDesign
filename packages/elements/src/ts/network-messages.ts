/**
 * Maranello Luce Design - Animated network message flow.
 */
import { hiDpiCanvas, lerp } from './core/utils';

export interface NetNode { id: string; label: string; x: number; y: number; color?: string; size?: number; }
export interface NetMessage { from: string; to: string; color?: string; speed?: number; size?: number; label?: string; }
export interface NetworkMessagesOptions {
  nodes: NetNode[]; connections: { from: string; to: string; color?: string }[];
  width?: number; height?: number; particleTrail?: boolean; glowEffect?: boolean;
  onNodeClick?: (node: NetNode) => void;
}
export interface NetworkMessagesController {
  send: (msg: NetMessage) => void; burst: (msgs: NetMessage[]) => void;
  setNodes: (nodes: NetNode[]) => void; destroy: () => void;
}

type ActiveMessage = NetMessage & { progress: number; speed: number; size: number; trail: { x: number; y: number }[] };
type Flash = { x: number; y: number; radius: number; life: number; color: string };

function resolveContainer(container: HTMLElement | string | null): HTMLElement | null {
  if (typeof container === 'string') {
    const found = document.querySelector(container);
    return found instanceof HTMLElement ? found : null;
  }
  return container instanceof HTMLElement ? container : null;
}

function alpha(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const full = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex;
  const value = parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(255,199,44,${opacity})`;
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
}

export function networkMessages(
  container: HTMLElement | string | null,
  opts: NetworkMessagesOptions = { nodes: [], connections: [] },
): NetworkMessagesController | null {
  const target = resolveContainer(container);
  if (!target) return null;
  const host = target;
  const options = { particleTrail: true, glowEffect: true, ...opts } as Required<Pick<NetworkMessagesOptions, 'particleTrail' | 'glowEffect'>> & NetworkMessagesOptions;
  let nodes = options.nodes.slice();
  const messages: ActiveMessage[] = [];
  const flashes: Flash[] = [];
  const canvas = document.createElement('canvas');
  const _ctx = canvas.getContext('2d');
  if (!_ctx) { console.warn('[Maranello] networkMessages: 2D context unavailable'); return null; }
  const ctx = _ctx;
  let raf = 0;
  let last = performance.now();
  host.innerHTML = '';
  host.style.position = 'relative'; host.style.overflow = 'hidden';
  if (options.width) host.style.width = `${options.width}px`;
  if (options.height) host.style.height = `${options.height}px`;
  canvas.style.cssText = 'display:block;width:100%;height:100%';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Network message flow');
  canvas.setAttribute('tabindex', '0');
  host.appendChild(canvas);

  const getMap = (): Map<string, NetNode> => new Map(nodes.map((node) => [node.id, node]));
  const point = (node: NetNode) => ({ x: node.x * canvas.clientWidth, y: node.y * canvas.clientHeight });
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const mo = new MutationObserver(() => draw(16));

  canvas.addEventListener('click', (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let hit: NetNode | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i], nx = n.x * w, ny = n.y * h;
      if (Math.hypot(mx - nx, my - ny) <= (n.size ?? 10) + 3) { hit = n; break; }
    }
    if (!hit) return;
    if (options.onNodeClick) options.onNodeClick(hit);
    canvas.dispatchEvent(new CustomEvent('mn-network-node-click', {
      detail: { node: hit }, bubbles: true,
    }));
  });

  function resize(): void {
    const width = options.width ?? Math.max(320, host.clientWidth || 640);
    const height = options.height ?? Math.max(220, host.clientHeight || 320);
    hiDpiCanvas(canvas, width, height);
  }

  function drawParticle(color: string, x: number, y: number, radius: number, label?: string): void {
    ctx.save();
    if (options.glowEffect) { ctx.shadowColor = color; ctx.shadowBlur = radius * 3; }
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    if (label) {
      ctx.shadowBlur = 0; ctx.fillStyle = '#05070c';
      ctx.font = `600 ${Math.max(9, radius * 2.1)}px Inter, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label.slice(0, 3), x, y + 0.5);
    }
    ctx.restore();
  }

  function draw(dt: number): void {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    const map = getMap();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(3,7,12,0.36)';
    ctx.fillRect(0, 0, width, height);

    ctx.setLineDash([]);
    for (const link of options.connections) {
      const from = map.get(link.from), to = map.get(link.to);
      if (!from || !to) continue;
      const a = point(from), b = point(to);
      const active = messages.some((msg) => msg.from === link.from && msg.to === link.to);
      const baseColor = link.color ?? 'rgba(78,168,222,0.35)';
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = mx - 0.5 * width, dy = my - 0.5 * height;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const dist = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
      const cpx = mx + (dx / len) * dist * 0.28, cpy = my + (dy / len) * dist * 0.28;
      ctx.save();
      ctx.lineWidth = active ? 2.0 : 1.5;
      if (active && options.glowEffect) { ctx.shadowColor = baseColor; ctx.shadowBlur = 8; }
      const op = active ? 0.7 : 0.38;
      const recolor = (c: string) => c.replace(/[\d.]+\)$/, `${op})`);
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, link.color ? recolor(link.color) : `rgba(78,168,222,${op})`);
      grad.addColorStop(1, link.color ? recolor(link.color) : `rgba(255,199,44,${op})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }

    for (let i = flashes.length - 1; i >= 0; i--) {
      const flash = flashes[i];
      flash.life -= dt * 0.0026; flash.radius += dt * 0.05;
      if (flash.life <= 0) { flashes.splice(i, 1); continue; }
      ctx.save();
      ctx.strokeStyle = alpha(flash.color, flash.life * 0.75);
      ctx.lineWidth = 1.5 + flash.life * 2;
      if (options.glowEffect) { ctx.shadowColor = flash.color; ctx.shadowBlur = 10 * flash.life; }
      ctx.beginPath(); ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const from = map.get(msg.from), to = map.get(msg.to);
      if (!from || !to) {
        messages.splice(i, 1);
        continue;
      }
      msg.progress += (dt / 1500) * msg.speed;
      const a = point(from), b = point(to);
      const x = lerp(a.x, b.x, msg.progress), y = lerp(a.y, b.y, msg.progress);
      if (options.particleTrail) {
        msg.trail.push({ x, y });
        if (msg.trail.length > 10) msg.trail.shift();
        msg.trail.forEach((p, index) => {
          drawParticle(msg.color ?? to.color ?? '#FFC72C', p.x, p.y, msg.size * (0.35 + index / 18), undefined);
          ctx.save();
          ctx.globalAlpha = (index + 1) / msg.trail.length * 0.18;
          ctx.fillStyle = msg.color ?? to.color ?? '#FFC72C';
          ctx.beginPath();
          ctx.arc(p.x, p.y, msg.size * (0.35 + index / 18), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
      if (msg.progress >= 1) {
        flashes.push({ x: b.x, y: b.y, radius: 4, life: 1, color: msg.color ?? to.color ?? '#FFC72C' });
        messages.splice(i, 1);
        continue;
      }
      drawParticle(msg.color ?? to.color ?? '#FFC72C', x, y, msg.size, msg.label);
    }

    for (const node of nodes) {
      const p = point(node), size = node.size ?? 10, color = node.color ?? '#4EA8DE';
      ctx.save();
      if (options.glowEffect) {
        ctx.shadowColor = color;
        ctx.shadowBlur = size * 1.4;
      }
      ctx.fillStyle = alpha(color, 0.2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#f5f1e6';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, p.x, p.y + size + 18);
    }
  }

  function loop(now: number): void {
    const dt = Math.min(48, now - last || 16);
    last = now;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }

  function send(msg: NetMessage): void {
    const map = getMap();
    if (!map.get(msg.from) || !map.get(msg.to)) return;
    messages.push({
      ...msg,
      progress: 0,
      speed: Math.max(0.5, Math.min(3, msg.speed ?? 1)),
      size: msg.size ?? 4,
      trail: [],
    });
  }

  resize();
  ro?.observe(host);
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  raf = requestAnimationFrame(loop);

  return {
    send,
    burst: (msgs) => msgs.forEach(send),
    setNodes: (next) => {
      nodes = next.slice();
      const map = getMap();
      for (let i = messages.length - 1; i >= 0; i--) {
        if (!map.get(messages[i].from) || !map.get(messages[i].to)) messages.splice(i, 1);
      }
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      mo.disconnect();
      host.innerHTML = '';
    },
  };
}
