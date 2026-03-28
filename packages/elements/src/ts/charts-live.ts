/**
 * Maranello Luce Design - Live/real-time graph (Canvas 2D)
 */
import type { LiveGraphOptions } from './core/types';
import { cssVar } from './core/utils';
import { chartHiDpi, getCanvasSize, drawSmoothLine, applyChartA11y } from './charts-helpers';

/** Render a live/real-time line graph with glow effect. */
export function liveGraph(
  canvas: HTMLCanvasElement,
  data: number[],
  opts?: LiveGraphOptions,
): HTMLCanvasElement | undefined {
  const o = {
    color: cssVar('--mn-accent'),
    lineWidth: 1.5,
    gridColor: 'rgba(200,200,200,0.06)',
    gridRows: 4,
    axisColor: cssVar('--mn-text-muted'),
    showRedLine: true,
    redLineValue: null as number | null,
    smooth: true,
    maxY: null as number | null,
    unitLabel: '',
    ...opts,
  };

  const size = getCanvasSize(canvas, 200, 80);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return undefined;

  if (!data || data.length < 2) return undefined;

  const maxVal = o.maxY ?? Math.max(...data) * 1.1;
  const pad = { top: 4, right: 4, bottom: 2, left: 2 };

  const gx = (i: number) => pad.left + (i / (data.length - 1)) * (w - pad.left - pad.right);
  const gy = (v: number) => h - pad.bottom - (v / maxVal) * (h - pad.top - pad.bottom);

  // Grid lines
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= o.gridRows; r++) {
    const yy = pad.top + (r / o.gridRows) * (h - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(w - pad.right, yy);
    ctx.stroke();
  }

  // Red limit line
  if (o.showRedLine && o.redLineValue !== null) {
    ctx.strokeStyle = cssVar('--signal-danger', '#DC0000');
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    const rl = gy(o.redLineValue);
    ctx.moveTo(pad.left, rl);
    ctx.lineTo(w - pad.right, rl);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Data trace
  ctx.beginPath();
  drawSmoothLine(ctx, data, gx, gy, o.smooth);
  ctx.strokeStyle = o.color!;
  ctx.lineWidth = o.lineWidth ?? 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Glow effect
  ctx.shadowColor = o.color!;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const liveLabel = `Live chart: ${o.unitLabel || 'real-time data'}`;
  const last5 = data.slice(-5);
  const a11yData = last5.map((v, i) => ({ label: `T-${last5.length - 1 - i}`, value: v }));
  applyChartA11y(canvas, liveLabel, a11yData);

  // Throttled aria-live announcement (max 1 per 5s)
  if (canvas.parentElement) {
    let liveEl = canvas.parentElement.querySelector<HTMLElement>('.mn-sr-live');
    if (!liveEl) {
      liveEl = document.createElement('span');
      liveEl.className = 'mn-sr-only mn-sr-live';
      liveEl.setAttribute('aria-live', 'polite');
      liveEl.setAttribute('aria-atomic', 'true');
      canvas.parentElement.appendChild(liveEl);
    }
    const now = Date.now();
    const lastTs = Number(liveEl.dataset.ts || '0');
    if (now - lastTs >= 5000) {
      const latest = data[data.length - 1];
      const prev = data.length > 1 ? data[data.length - 2] : latest;
      const trend = latest > prev ? 'rising' : latest < prev ? 'falling' : 'steady';
      liveEl.textContent = `${o.unitLabel || 'Value'}: ${latest}, ${trend}`;
      liveEl.dataset.ts = String(now);
    }
  }

  return canvas;
}
