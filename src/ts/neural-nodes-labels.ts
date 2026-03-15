/**
 * Maranello Luce Design - Label rendering for data-driven neural nodes.
 */
import type { InternalNode } from './neural-nodes-types';

const MAX_LABEL_CHARS = 25;
const BADGE_PAD_H = 6;
const BADGE_PAD_V = 2;
const BADGE_RADIUS = 4;

function truncate(text: string): string {
  return text.length > MAX_LABEL_CHARS ? text.slice(0, MAX_LABEL_CHARS - 1) + '…' : text;
}

export function drawLabels(
  ctx: CanvasRenderingContext2D,
  nodes: InternalNode[],
  hovered: number,
  fontBase: string,
  alpha: (color: string, opacity: number) => string,
): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.label) continue;
    const visible = n.energy > 0.3 || i === hovered;
    if (!visible) continue;

    const fade = i === hovered ? 1 : Math.min(1, (n.energy - 0.3) * 2.5);
    const baseSize = n.size * 8;
    let yOff = baseSize + 6;

    // Main label
    ctx.font = `bold 10px ${fontBase}`;
    ctx.fillStyle = alpha('#ffffff', 0.92 * fade);
    ctx.fillText(truncate(n.label), n.x, n.y + yOff);
    yOff += 13;

    // Sublabel
    if (n.sublabel) {
      ctx.font = `9px ${fontBase}`;
      ctx.fillStyle = alpha('#c8c8c8', 0.7 * fade);
      ctx.fillText(truncate(n.sublabel), n.x, n.y + yOff);
      yOff += 12;
    }

    // Badge pill
    if (n.badge) {
      drawBadge(ctx, n.x, n.y + yOff, n.badge, n.color, fade, fontBase);
    }
  }
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string,
  color: string,
  fade: number,
  fontBase: string,
): void {
  ctx.font = `bold 8px ${fontBase}`;
  const m = ctx.measureText(text);
  const w = m.width + BADGE_PAD_H * 2;
  const h = 12 + BADGE_PAD_V * 2;
  const x = cx - w / 2, y = cy;

  ctx.save();
  ctx.globalAlpha = 0.75 * fade;
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, x, y, w, h, BADGE_RADIUS);
  ctx.fill();
  ctx.globalAlpha = fade;
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, y + h / 2);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
}
