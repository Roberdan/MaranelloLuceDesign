/**
 * Maranello Luce Design - Neural nodes canvas drawing routines.
 */
import type { InternalNode, InternalConnection, Particle, Wave } from './neural-nodes-types';
import { drawLabels } from './neural-nodes-labels';

export function toAlpha(color: string, opacity: number): string {
  const full = color.replace('#', '').replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  const v = parseInt(full, 16);
  return Number.isNaN(v) ? `rgba(255,199,44,${opacity})` : `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${opacity})`;
}

export interface DrawState {
  nodes: InternalNode[];
  connections: InternalConnection[];
  particles: Particle[];
  waves: Wave[];
  hovered: number;
  activity: number;
  pulseSpeed: number;
  particleCount: number;
  labels: boolean;
  labelFont: string;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D, now: number, s: DrawState,
): void {
  const w = ctx.canvas.clientWidth || 1, h = ctx.canvas.clientHeight || 1;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(4,10,18,0.28)'; ctx.fillRect(0, 0, w, h);

  // Connections
  for (const l of s.connections) {
    const a = s.nodes[l.a], b = s.nodes[l.b];
    if (!a || !b) continue;
    const em = s.hovered === l.a || s.hovered === l.b;
    const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    const baseA = l.strength * 0.5;
    g.addColorStop(0, toAlpha(a.color, em ? 0.48 : baseA + a.energy * 0.18));
    g.addColorStop(0.55, toAlpha(b.color, 0.18 + Math.max(a.energy, b.energy) * 0.16));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.strokeStyle = g; ctx.lineWidth = em ? 2 : 0.6 + l.strength * 1.2;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  // Particles
  const visLanes = Math.max(1, Math.round(s.particleCount * (0.3 + s.activity * 0.7)));
  for (const p of s.particles) {
    if (p.lane >= visLanes) continue;
    const l = s.connections[p.connection]; if (!l) continue;
    const a = s.nodes[l.a], b = s.nodes[l.b];
    if (!a || !b) continue;
    const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
    ctx.save();
    ctx.fillStyle = toAlpha(a.color, 0.65 + s.activity * 0.25);
    ctx.shadowColor = a.color; ctx.shadowBlur = 6 + s.activity * 8;
    ctx.beginPath(); ctx.arc(x, y, 1.6 + s.activity * 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Waves
  for (const wv of s.waves) {
    ctx.save();
    ctx.strokeStyle = toAlpha(wv.color, wv.life * 0.65);
    ctx.lineWidth = 1.5 + wv.life * 2; ctx.shadowColor = wv.color; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(wv.x, wv.y, wv.radius, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // Nodes
  for (let i = 0; i < s.nodes.length; i++) {
    const n = s.nodes[i];
    const sz = n.size * 8;
    const pulse = (sz * 0.3) + Math.sin(now * 0.002 * s.pulseSpeed + n.phase) * 1.4
      + n.energy * 3.2 + (s.hovered === i ? 2 : 0);
    ctx.save();
    ctx.fillStyle = toAlpha(n.color, 0.2);
    ctx.shadowColor = n.color; ctx.shadowBlur = 12 + n.energy * 12;
    ctx.beginPath(); ctx.arc(n.x, n.y, pulse + 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = n.color;
    ctx.beginPath(); ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  if (s.labels) drawLabels(ctx, s.nodes, s.hovered, s.labelFont, toAlpha);
}
