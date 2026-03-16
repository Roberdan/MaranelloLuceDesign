/** Maranello Luce Design - Multi-series stacked/overlaid area cost timeline */
import { chartHiDpi, hexToRgba, applyChartA11y } from './charts-helpers';
import { cssVar } from './core/utils';
import { escapeHtml } from './core/sanitize';

export interface CostSeries { id: string; label: string; color?: string; values: number[] }

export interface CostTimelineOptions {
  labels: string[];
  series: CostSeries[];
  height?: number;
  stacked?: boolean;
  animate?: boolean;
  unit?: string;
  onHover?: (label: string, values: Record<string, number>) => void;
}

export interface CostTimelineController {
  update: (opts: Partial<CostTimelineOptions>) => void;
  destroy: () => void;
}

const PAD = { top: 20, right: 16, bottom: 36, left: 52 };
const GRID_LINES = 5;
const ANIM_MS = 600;
const COLOR_VARS: ReadonlyArray<readonly [string, string]> = [
  ['--mn-accent', '#FFC72C'], ['--signal-info', '#3B82F6'], ['--signal-ok', '#00A651'],
  ['--signal-warning', '#FFC72C'], ['--signal-danger', '#DC0000'], ['--mn-text-muted', '#888888'],
];

function resolveColor(series: CostSeries, idx: number): string {
  if (series.color) {
    return series.color.startsWith('--')
      ? cssVar(series.color, '#888') : series.color;
  }
  const [v, fb] = COLOR_VARS[idx % COLOR_VARS.length];
  return cssVar(v, fb);
}

function fmtY(val: number, unit: string): string {
  if (val >= 1_000_000) return `${unit}${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${unit}${(val / 1_000).toFixed(1)}k`;
  return `${unit}${Math.round(val)}`;
}

/** stacks[s][i] = cumulative sum of series 0..s at period i */
function buildStacks(series: CostSeries[]): number[][] {
  const n = series[0]?.values.length ?? 0, stacks: number[][] = [];
  for (let s = 0; s < series.length; s++) {
    stacks[s] = Array.from({ length: n }, (_, i) =>
      (series[s].values[i] ?? 0) + (s > 0 ? stacks[s - 1][i] : 0));
  }
  return stacks;
}

function easeOut(t: number): number { return 1 - (1 - t) ** 3; }

export function costTimeline(
  canvas: HTMLCanvasElement,
  opts: CostTimelineOptions,
): CostTimelineController {
  let cfg = { ...opts, height: opts.height ?? 200, stacked: opts.stacked ?? true,
    animate: opts.animate ?? true, unit: opts.unit ?? '$' };
  let rafId = 0;
  let hoverX = -1;

  function draw(clipFrac: number): void {
    const w = Math.max(canvas.getBoundingClientRect().width, 200);
    const h = cfg.height;
    const ctx = chartHiDpi(canvas, w, h);
    const n = cfg.labels.length;
    if (n < 2 || cfg.series.length === 0) return;

    const plotW = w - PAD.left - PAD.right;
    const plotH = h - PAD.top - PAD.bottom;
    const xStep = plotW / (n - 1);
    const gx = (i: number) => PAD.left + i * xStep;
    const stacks = cfg.stacked ? buildStacks(cfg.series) : [];
    const maxVal = cfg.stacked
      ? Math.max(...(stacks[stacks.length - 1] ?? [1])) * 1.1
      : Math.max(...cfg.series.flatMap((s) => s.values)) * 1.1 || 1;
    const gy = (v: number) => PAD.top + plotH - (v / maxVal) * plotH;

    // Clip for animation (left-to-right reveal)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PAD.left + plotW * clipFrac + PAD.right, h);
    ctx.clip();

    // Y-axis gridlines
    const borderColor = cssVar('--mn-border', '#333');
    ctx.strokeStyle = hexToRgba(borderColor.startsWith('#') ? borderColor : '#333333', 0.3);
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 0.5;
    const mutedColor = cssVar('--mn-text-muted', '#888');
    for (let g = 0; g <= GRID_LINES; g++) {
      const val = (maxVal / GRID_LINES) * g;
      const yy = gy(val);
      ctx.beginPath(); ctx.moveTo(PAD.left, yy); ctx.lineTo(w - PAD.right, yy); ctx.stroke();
      ctx.fillStyle = mutedColor; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(fmtY(val, cfg.unit), PAD.left - 6, yy + 3);
    }
    ctx.setLineDash([]);

    // Series areas (bottom to top for stacked)
    for (let s = cfg.series.length - 1; s >= 0; s--) {
      const color = resolveColor(cfg.series[s], s);
      const hex = color.startsWith('#') ? color : '#888888';
      const fillAlpha = cfg.stacked ? 0.25 : 0.15;
      const top = cfg.stacked ? stacks[s] : cfg.series[s].values;
      const bot = cfg.stacked && s > 0 ? stacks[s - 1] : null;

      // Fill
      ctx.beginPath();
      ctx.moveTo(gx(0), gy(top[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(gx(i), gy(top[i]));
      // Close downward
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(gx(i), gy(bot ? bot[i] : 0));
      ctx.closePath();
      ctx.fillStyle = hexToRgba(hex, fillAlpha);
      ctx.fill();

      // Stroke top edge
      ctx.beginPath();
      ctx.moveTo(gx(0), gy(top[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(gx(i), gy(top[i]));
      ctx.strokeStyle = hexToRgba(hex, 0.8);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // X-axis labels
    ctx.fillStyle = mutedColor; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
    const skipX = Math.ceil(n / (plotW / 48));
    for (let i = 0; i < n; i += skipX) {
      ctx.fillText(cfg.labels[i], gx(i), h - PAD.bottom + 14);
    }

    // Legend row below x-axis labels
    ctx.font = '9px sans-serif'; ctx.textAlign = 'left';
    const legY = h - 6;
    const legItems = cfg.series.map((s, i) => ({
      label: s.label, color: resolveColor(s, i),
      width: ctx.measureText(s.label).width + 16,
    }));
    const totalLegW = legItems.reduce((a, l) => a + l.width + 8, -8);
    let legX = PAD.left + (plotW - totalLegW) / 2;
    for (const item of legItems) {
      ctx.fillStyle = item.color;
      ctx.fillRect(legX, legY - 6, 8, 8);
      ctx.fillStyle = mutedColor;
      ctx.fillText(item.label, legX + 12, legY);
      legX += item.width + 8;
    }

    // Hover ruler + tooltip
    if (hoverX >= PAD.left && hoverX <= w - PAD.right) {
      const idx = Math.round((hoverX - PAD.left) / xStep);
      const ci = Math.max(0, Math.min(n - 1, idx));
      const rx = gx(ci);
      ctx.strokeStyle = hexToRgba(cssVar('--mn-text', '#fff').startsWith('#')
        ? cssVar('--mn-text', '#fff') : '#ffffff', 0.4);
      ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(rx, PAD.top); ctx.lineTo(rx, h - PAD.bottom); ctx.stroke();
      ctx.setLineDash([]);
      drawTooltip(ctx, cfg, ci, rx, w);
      if (cfg.onHover) {
        const vals: Record<string, number> = {};
        cfg.series.forEach((s) => { vals[s.id] = s.values[ci] ?? 0; });
        cfg.onHover(cfg.labels[ci], vals);
      }
    }
    ctx.restore();
  }

  function drawTooltip(
    ctx: CanvasRenderingContext2D, c: typeof cfg, idx: number, rx: number, w: number,
  ): void {
    const lines = [c.labels[idx], ...c.series.map((s) =>
      `${s.label}: ${c.unit}${(s.values[idx] ?? 0).toFixed(2)}`)];
    ctx.font = '10px sans-serif';
    const tw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 16;
    const th = lines.length * 14 + 10;
    const tx = rx + 12 + tw > w ? rx - tw - 8 : rx + 12;
    const ty = PAD.top + 4;
    const bg = cssVar('--mn-surface', '#1a1a1a');
    const border = cssVar('--mn-border', '#333');
    ctx.fillStyle = bg.startsWith('#') ? bg : '#1a1a1a';
    ctx.strokeStyle = border.startsWith('#') ? border : '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cssVar('--mn-text', '#eee');
    lines.forEach((l, i) => {
      ctx.font = i === 0 ? 'bold 10px sans-serif' : '10px sans-serif';
      ctx.fillText(l, tx + 8, ty + 14 + i * 14);
    });
  }

  function animate(): void {
    if (!cfg.animate) { draw(1); return; }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / ANIM_MS, 1);
      draw(easeOut(t));
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  }

  // Mouse interaction
  const onMove = (e: MouseEvent) => { hoverX = e.offsetX; draw(1); };
  const onLeave = () => { hoverX = -1; draw(1); };
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseleave', onLeave);

  // A11y: sr-only table with period rows and series columns
  function applySrOnly(): void {
    const hdrs = cfg.series.map((s) => escapeHtml(s.label));
    const rows = cfg.labels.map((lbl, i) => {
      const cells = cfg.series.map((s) => `<td>${cfg.unit}${(s.values[i] ?? 0).toFixed(2)}</td>`);
      return `<tr><th scope="row">${escapeHtml(lbl)}</th>${cells.join('')}</tr>`;
    }).join('');
    const tbl = `<table><caption>Cost timeline</caption><thead><tr><th>Period</th>`
      + hdrs.map((h) => `<th>${h}</th>`).join('') + `</tr></thead><tbody>${rows}</tbody></table>`;
    applyChartA11y(canvas, `Cost timeline: ${cfg.series.length} series over ${cfg.labels.length} periods`);
    const sr = canvas.nextElementSibling;
    if (sr?.classList.contains('mn-sr-only')) sr.innerHTML = tbl;
  }

  applySrOnly();
  animate();

  return {
    update(partial) {
      cfg = { ...cfg, ...partial, height: partial.height ?? cfg.height,
        stacked: partial.stacked ?? cfg.stacked, animate: partial.animate ?? cfg.animate,
        unit: partial.unit ?? cfg.unit };
      cancelAnimationFrame(rafId);
      applySrOnly();
      animate();
    },
    destroy() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains('mn-sr-only')) sr.remove();
    },
  };
}
