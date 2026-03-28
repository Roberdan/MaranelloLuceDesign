/**
 * Maranello Luce Design - Chart interaction (tooltips, crosshair, hover)
 * Provides chartInteract (multi-type) and sparklineInteract (overlay canvas).
 */
import { cssVar, escapeHtml } from './core/utils';
import { isValidColor } from './core/sanitize';

const DPR = window.devicePixelRatio || 1;
let activeTooltip: HTMLDivElement | null = null;

function getTooltip(): HTMLDivElement {
  if (activeTooltip) return activeTooltip;
  const el = document.createElement('div');
  el.className = 'mn-chart-tooltip';
  el.setAttribute('role', 'tooltip');
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  activeTooltip = el;
  return el;
}

function positionTooltip(tip: HTMLDivElement, x: number, y: number): void {
  const pad = 12, rect = tip.getBoundingClientRect();
  let left = x + pad, top = y - rect.height - pad;
  if (left + rect.width > window.innerWidth - 10) left = x - rect.width - pad;
  if (top < 10) top = y + pad;
  tip.style.position = 'fixed'; tip.style.left = left + 'px'; tip.style.top = top + 'px';
}

function safeColor(c: string, fallback: string): string {
  return isValidColor(c) ? c : fallback;
}

interface ChartMeta {
  type: string;
  [key: string]: unknown;
}

function buildTooltipHTML(meta: ChartMeta, index: number, series: string[]): string {
  const esc = escapeHtml;
  if (meta.type === 'area' || meta.type === 'line') {
    const datasets = meta.datasets as Array<{ data: number[]; color?: string; label?: string }>;
    let html = '<div class="mn-chart-tooltip__label">' + esc(meta.labels && (meta.labels as string[])[index] ? (meta.labels as string[])[index] : 'Point ' + (index + 1)) + '</div>';
    datasets.forEach((ds, i) => {
      if (index < ds.data.length) {
        const color = safeColor(ds.color || series[i % series.length], '#999');
        html += '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;"><span class="mn-chart-tooltip__dot" style="background:' + color + ';"></span><span style="color:var(--mn-text-tertiary);font-size:0.65rem;">' + esc(ds.label || 'Series ' + (i + 1)) + '</span><span class="mn-chart-tooltip__value" style="margin-left:auto;color:' + color + ';">' + ds.data[index].toFixed(1) + '</span></div>';
      }
    });
    return html;
  }
  if (meta.type === 'bar') { const d = (meta.data as Array<{ label?: string; value: number; color?: string }>)[index]; const color = safeColor(d.color || series[index % series.length], '#999'); return '<div class="mn-chart-tooltip__label">' + esc(d.label || 'Bar ' + (index + 1)) + '</div><div class="mn-chart-tooltip__value" style="color:' + color + ';">' + d.value + '</div>'; }
  if (meta.type === 'donut') { const seg = (meta.segments as Array<{ color: string; value: number; label?: string; pct: number }>)[index]; return '<div style="display:flex;align-items:center;gap:6px;"><span class="mn-chart-tooltip__dot" style="background:' + seg.color + ';"></span><span class="mn-chart-tooltip__value">' + seg.value + '</span></div>' + (seg.label ? '<div class="mn-chart-tooltip__label">' + esc(seg.label) + '</div>' : '') + '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">' + seg.pct + '%</div>'; }
  if (meta.type === 'bubble') { const b = (meta.data as Array<{ label?: string; x: number; y: number; z?: number; r?: number }>)[index]; const size = b.z ?? b.r; return '<div class="mn-chart-tooltip__label">' + esc(b.label || 'Point') + '</div><div style="font-size:0.65rem;color:var(--mn-text-tertiary);">x: ' + b.x + ' \u00B7 y: ' + b.y + (size ? ' \u00B7 size: ' + size : '') + '</div>'; }
  if (meta.type === 'radar') { const r = (meta.data as Array<{ label: string; value: number }>)[index]; return '<div class="mn-chart-tooltip__label">' + esc(r.label) + '</div><div class="mn-chart-tooltip__value" style="color:var(--mn-accent);">' + r.value + '<span style="color:var(--mn-text-muted);font-size:0.6rem;">/' + meta.max + '</span></div>'; }
  return '';
}

function drawCrosshair(canvas: HTMLCanvasElement, x: number, meta: ChartMeta, series: string[]): void {
  let overlay = (canvas as unknown as { _mnOverlay?: HTMLCanvasElement })._mnOverlay;
  if (!overlay) {
    overlay = document.createElement('canvas');
    overlay.style.position = 'absolute'; overlay.style.pointerEvents = 'none';
    canvas.parentElement!.style.position = 'relative';
    canvas.parentElement!.appendChild(overlay);
    (canvas as unknown as { _mnOverlay: HTMLCanvasElement })._mnOverlay = overlay;
  }
  const rect = canvas.getBoundingClientRect(), parentRect = canvas.parentElement!.getBoundingClientRect();
  overlay.style.left = (rect.left - parentRect.left) + 'px'; overlay.style.top = (rect.top - parentRect.top) + 'px';
  overlay.style.width = rect.width + 'px'; overlay.style.height = rect.height + 'px';
  overlay.width = canvas.width; overlay.height = canvas.height;
  const ctx = overlay.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  if (x < 0) return;
  ctx.save(); ctx.scale(DPR, DPR);
  ctx.strokeStyle = 'rgba(255,199,44,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
  const h = canvas.height / DPR;
  const pad = meta.pad as { top: number; bottom: number } | undefined;
  ctx.beginPath(); ctx.moveTo(x, pad ? pad.top : 0); ctx.lineTo(x, h - (pad ? pad.bottom : 0)); ctx.stroke();
  ctx.setLineDash([]);
  if ((meta.type === 'area' || meta.type === 'line') && (meta.nearestIndex as number) >= 0) {
    const datasets = meta.datasets as Array<{ data: number[]; color?: string }>;
    const gx = meta.gx as (i: number) => number, gy = meta.gy as (v: number) => number;
    datasets.forEach((ds, dsi) => {
      if ((meta.nearestIndex as number) < ds.data.length) {
        const px = gx(meta.nearestIndex as number), py = gy(ds.data[meta.nearestIndex as number]);
        const color = ds.color || series[dsi % series.length];
        const cr = parseInt(color.slice(1, 3), 16), cg = parseInt(color.slice(3, 5), 16), cb = parseInt(color.slice(5, 7), 16);
        ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',0.25)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    });
  }
  ctx.restore();
}

function findNearestIndex(mouseX: number, meta: ChartMeta): number {
  if (meta.type === 'area' || meta.type === 'line') {
    let best = 0, bestDist = Infinity;
    const gx = meta.gx as (i: number) => number;
    for (let i = 0; i < ((meta.maxLen as number) || 12); i++) { const dist = Math.abs(mouseX - gx(i)); if (dist < bestDist) { bestDist = dist; best = i; } }
    return best;
  }
  if (meta.type === 'bar' && meta.barRects) {
    for (const r of (meta.barRects as Array<{ x: number; w: number }>)) { if (mouseX >= r.x && mouseX <= r.x + r.w) return (meta.barRects as unknown[]).indexOf(r); }
    return -1;
  }
  if ((meta.type === 'bubble' || meta.type === 'radar') && meta.points) {
    const points = meta.points as Array<{ x: number; y: number; r?: number }>;
    const mouseY = Number(meta.mouseY ?? 0);
    let best = -1, bestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
      const limit = (p.r ?? (meta.type === 'bubble' ? 14 : 10)) + 6;
      if (dist <= limit && dist < bestDist) { best = i; bestDist = dist; }
    });
    return best;
  }
  if (meta.type === 'donut' && meta.center && meta.innerRadius && meta.outerRadius && meta.segments) {
    const { x, y } = meta.center as { x: number; y: number };
    const mouseY = Number(meta.mouseY ?? 0), dist = Math.hypot(mouseX - x, mouseY - y);
    const norm = (a: number) => (a + Math.PI * 2) % (Math.PI * 2), angle = norm(Math.atan2(mouseY - y, mouseX - x));
    if (dist < (meta.innerRadius as number) || dist > (meta.outerRadius as number)) return -1;
    return (meta.segments as Array<{ start: number; end: number }>).findIndex(({ start, end }) => {
      const a = norm(start), b = norm(end);
      return a <= b ? angle >= a && angle <= b : angle >= a || angle <= b;
    });
  }
  return -1;
}

/** Attach full chart interaction (crosshair, tooltip, keyboard). */
export function chartInteract(
  canvas: HTMLCanvasElement, meta: ChartMeta, series?: string[],
): { hide: () => void; update: (newMeta: Partial<ChartMeta>) => void } | void {
  if (!canvas || !meta) return;
  const s = series || [];
  const tip = getTooltip();
  let currentIndex = -1;
  canvas.style.cursor = 'crosshair';
  canvas.setAttribute('tabindex', '0'); canvas.setAttribute('role', 'img');

  function getLogicalXY(e: MouseEvent | Touch): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / DPR / rect.width), y: (e.clientY - rect.top) * (canvas.height / DPR / rect.height) };
  }
  function showAt(lx: number, ly: number, cx: number, cy: number): void {
    meta.mouseY = ly;
    const idx = findNearestIndex(lx, meta);
    if (idx < 0) { hide(); return; }
    meta.nearestIndex = idx; currentIndex = idx;
    const gx = meta.gx as ((i: number) => number) | undefined;
    drawCrosshair(canvas, meta.type === 'bar' || meta.type === 'donut' || meta.type === 'bubble' || meta.type === 'radar' ? -1 : gx ? gx(idx) : lx, meta, s);
    tip.innerHTML = buildTooltipHTML(meta, idx, s);
    tip.classList.add('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'false');
    positionTooltip(tip, cx, cy);
  }
  function hide(): void {
    tip.classList.remove('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'true');
    currentIndex = -1; meta.nearestIndex = -1; drawCrosshair(canvas, -1, meta, s);
  }
  canvas.addEventListener('mousemove', (e) => { const p = getLogicalXY(e); showAt(p.x, p.y, e.clientX, e.clientY); });
  canvas.addEventListener('mouseleave', hide);
  return { hide, update: (newMeta) => { Object.assign(meta, newMeta); } };
}

/** Attach sparkline hover interaction with overlay canvas. */
export function sparklineInteract(
  canvas: HTMLCanvasElement, data: number[], opts?: Record<string, unknown>,
): void {
  if (!canvas || !data || data.length < 2) return;
  opts = opts || {};
  const tip = getTooltip();
  let chartPad = (opts.pad as { top: number; right: number; bottom: number; left: number }) || { top: 2, right: 2, bottom: 2, left: 2 };
  const mn = (opts.maxY != null) ? 0 : Math.min(...data);
  const mx = (opts.maxY != null) ? (opts.maxY as number) : Math.max(...data);
  const range = mx - mn || 1;
  canvas.style.cursor = 'crosshair';

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const logicalW = canvas.width / DPR, logicalH = canvas.height / DPR;
    const mouseX = (e.clientX - rect.left) * (logicalW / rect.width);
    const plotW = logicalW - chartPad.left - chartPad.right;
    const plotH = logicalH - chartPad.top - chartPad.bottom;
    let idx = Math.round((mouseX - chartPad.left) / plotW * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    const px = chartPad.left + (idx / (data.length - 1)) * plotW;
    const py = logicalH - chartPad.bottom - ((data[idx] - mn) / range) * plotH;

    let overlay = (canvas as unknown as { _mnSparkOverlay?: HTMLCanvasElement })._mnSparkOverlay;
    if (!overlay) {
      overlay = document.createElement('canvas');
      overlay.style.position = 'absolute'; overlay.style.pointerEvents = 'none';
      canvas.parentElement!.style.position = 'relative';
      canvas.parentElement!.appendChild(overlay);
      (canvas as unknown as { _mnSparkOverlay: HTMLCanvasElement })._mnSparkOverlay = overlay;
    }
    const cRect = canvas.getBoundingClientRect(), pRect = canvas.parentElement!.getBoundingClientRect();
    overlay.style.left = (cRect.left - pRect.left) + 'px'; overlay.style.top = (cRect.top - pRect.top) + 'px';
    overlay.style.width = cRect.width + 'px'; overlay.style.height = cRect.height + 'px';
    overlay.width = canvas.width; overlay.height = canvas.height;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height); ctx.save(); ctx.scale(DPR, DPR);
    const color = (opts!.color as string) || cssVar('--mn-accent');
    const cr = parseInt(color.slice(1, 3), 16), cg = parseInt(color.slice(3, 5), 16), cb = parseInt(color.slice(5, 7), 16);
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fillStyle = `rgba(${cr},${cg},${cb},0.25)`; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    const label = (opts!.labels as string[]) ? (opts!.labels as string[])[idx] : 'Point ' + (idx + 1);
    const safeC = safeColor(color, '#FFC72C');
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(label) + '</div><div class="mn-chart-tooltip__value" style="color:' + safeC + ';">' + data[idx] + '</div>';
    tip.classList.add('mn-chart-tooltip--visible'); positionTooltip(tip, e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseleave', () => {
    tip.classList.remove('mn-chart-tooltip--visible');
    const overlay = (canvas as unknown as { _mnSparkOverlay?: HTMLCanvasElement })._mnSparkOverlay;
    if (overlay) overlay.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height);
  });
}
