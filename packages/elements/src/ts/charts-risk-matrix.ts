/**
 * Maranello Luce Design - Risk Matrix (5x5 probability vs impact)
 * Canvas 2D heatmap with interactive item circles and hover tooltips.
 */
import { chartHiDpi, hexToRgba, applyChartA11y } from './charts-helpers';
import type { A11yDataRow } from './charts-helpers';
import { cssVar } from './core/utils';
import { escapeHtml } from './core/sanitize';

export interface RiskItem {
  id: string;
  label: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  color?: string;
}
export interface RiskMatrixOptions {
  items: RiskItem[];
  height?: number;
  gridSize?: number;
  animate?: boolean;
  onHover?: (item: RiskItem | null) => void;
  onClick?: (item: RiskItem) => void;
}
export interface RiskMatrixController {
  update: (items: RiskItem[]) => void;
  destroy: () => void;
}

const ML = 52, MT = 12, MR = 12, MB = 52;
const CIRCLE_R = 10, ANIM_MS = 400;
const OFFSETS: [number, number][] = [[0, 0], [-8, -8], [8, -8], [-8, 8]];

function severityColor(score: number): string {
  const ok = cssVar('--signal-ok', '#00A651');
  const warn = cssVar('--signal-warning', '#FFC72C');
  const danger = cssVar('--signal-danger', '#DC0000');
  if (score <= 4) return hexToRgba(ok, 0.2);
  if (score <= 9) return hexToRgba(warn, 0.2);
  if (score <= 16) return hexToRgba(danger, 0.2);
  return hexToRgba(danger, 0.35);
}

function riskLevel(s: number): string {
  if (s <= 4) return 'Low';
  if (s <= 9) return 'Medium';
  if (s <= 16) return 'High';
  return 'Critical';
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '\u2026' : s;
}

export function riskMatrix(
  canvas: HTMLCanvasElement, opts: RiskMatrixOptions,
): RiskMatrixController | undefined {
  let items = [...opts.items];
  let rafId = 0, hovered: RiskItem | null = null, animStart = 0;
  const shouldAnimate = opts.animate !== false;
  const w = canvas.getBoundingClientRect().width || 320;
  const h = opts.height ?? 320;
  const _ctx = chartHiDpi(canvas, w, h);
  if (!_ctx) return undefined;
  const ctx = _ctx;
  const gw = w - ML - MR, gh = h - MT - MB;
  const cellW = gw / 5, cellH = gh / 5;

  function cc(col: number, row: number): [number, number] {
    return [ML + (col - 0.5) * cellW, MT + gh - (row - 0.5) * cellH];
  }

  function drawGrid(border: string, textMuted: string, textColor: string): void {
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        const x = ML + (c - 1) * cellW, y = MT + gh - r * cellH;
        ctx.fillStyle = severityColor(r * c);
        ctx.fillRect(x, y, cellW, cellH);
        ctx.strokeStyle = border; ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellW, cellH);
      }
    }
    ctx.strokeStyle = border; ctx.lineWidth = 1;
    ctx.strokeRect(ML, MT, gw, gh);
    // Axis tick labels
    ctx.font = '10px system-ui,sans-serif';
    ctx.fillStyle = textMuted;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 1; i <= 5; i++) ctx.fillText(String(i), ML + (i - 0.5) * cellW, MT + gh + 4);
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 1; i <= 5; i++) ctx.fillText(String(i), ML - 6, MT + gh - (i - 0.5) * cellH);
    // Axis titles
    ctx.font = '11px system-ui,sans-serif'; ctx.fillStyle = textColor;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('Impact', ML + gw / 2, h - 16);
    ctx.save(); ctx.translate(14, MT + gh / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Probability', 0, 0); ctx.restore();
    // Corner labels
    ctx.font = '9px system-ui,sans-serif'; ctx.fillStyle = textMuted; ctx.globalAlpha = 0.6;
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText('Low', ML + 4, MT + gh - 4);
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText('Critical', ML + gw - 4, MT + 4);
    ctx.globalAlpha = 1;
  }

  function drawItems(scale: number, accent: string, textColor: string, border: string): void {
    const cellMap = new Map<string, RiskItem[]>();
    for (const item of items) {
      const key = `${item.impact},${item.probability}`;
      const arr = cellMap.get(key) ?? [];
      arr.push(item);
      cellMap.set(key, arr);
    }
    for (const [, group] of cellMap) {
      for (let idx = 0; idx < Math.min(group.length, 4); idx++) {
        const item = group[idx];
        const [cx, cy] = cc(item.impact, item.probability);
        const [ox, oy] = OFFSETS[idx];
        const px = cx + ox, py = cy + oy, r = CIRCLE_R * scale;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = item.color ?? accent; ctx.fill();
        if (hovered?.id === item.id) {
          ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.font = '9px system-ui,sans-serif'; ctx.fillStyle = textColor;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(truncate(item.label, 10), px, py + r + 2);
      }
    }
    if (hovered) drawTooltip(accent, textColor, border);
  }

  function drawTooltip(accent: string, textColor: string, border: string): void {
    if (!hovered) return;
    const [cx, cy] = cc(hovered.impact, hovered.probability);
    const score = hovered.probability * hovered.impact;
    const tip = `${escapeHtml(hovered.label)} (P${hovered.probability}\u00D7I${hovered.impact}=${score})`;
    ctx.font = '11px system-ui,sans-serif';
    const tw = ctx.measureText(tip).width + 12, th = 22;
    let tx = cx - tw / 2, ty = cy - CIRCLE_R - th - 6;
    if (tx < 2) tx = 2;
    if (tx + tw > w - 2) tx = w - tw - 2;
    if (ty < 2) ty = cy + CIRCLE_R + 6;
    ctx.fillStyle = cssVar('--mn-surface-raised');
    ctx.strokeStyle = border; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = textColor; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(tip, tx + 6, ty + th / 2);
  }

  function draw(scale: number): void {
    ctx.clearRect(0, 0, w, h);
    const border = cssVar('--mn-border');
    const textMuted = cssVar('--mn-text-muted');
    const textColor = cssVar('--mn-text');
    const accent = cssVar('--mn-accent');
    drawGrid(border, textMuted, textColor);
    drawItems(scale, accent, textColor, border);
  }

  function applyA11y(): void {
    const rows: A11yDataRow[] = items.map((it) => ({
      label: it.label,
      value: `P${it.probability} I${it.impact} — ${riskLevel(it.probability * it.impact)}`,
    }));
    applyChartA11y(canvas, `Risk matrix with ${items.length} items`, rows);
  }

  function animateIn(): void {
    animStart = performance.now();
    const tick = (now: number): void => {
      const t = Math.min((now - animStart) / ANIM_MS, 1);
      draw(1 - Math.pow(1 - t, 3));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function hitTest(mx: number, my: number): RiskItem | null {
    const counts = new Map<string, number>();
    for (const item of items) {
      const key = `${item.impact},${item.probability}`;
      const idx = counts.get(key) ?? 0;
      counts.set(key, idx + 1);
      const [cx, cy] = cc(item.impact, item.probability);
      const [ox, oy] = OFFSETS[Math.min(idx, 3)];
      const dx = mx - (cx + ox), dy = my - (cy + oy);
      if (dx * dx + dy * dy <= CIRCLE_R * CIRCLE_R) return item;
    }
    return null;
  }

  function onMove(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (hit?.id !== hovered?.id) { hovered = hit; opts.onHover?.(hit); draw(1); }
  }
  function onClick(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (hit) opts.onClick?.(hit);
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('click', onClick);
  applyA11y();
  if (shouldAnimate) animateIn(); else draw(1);

  return {
    update(newItems: RiskItem[]): void {
      items = [...newItems]; hovered = null; applyA11y();
      if (shouldAnimate) animateIn(); else draw(1);
    },
    destroy(): void {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains('mn-sr-only')) sr.remove();
    },
  };
}
