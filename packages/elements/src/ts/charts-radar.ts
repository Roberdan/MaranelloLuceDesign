/**
 * Maranello Luce Design - Radar/spider chart (Canvas 2D)
 */
import type { RadarDataItem, RadarOptions } from './core/types';
import { cssVar } from './core/utils';
import { chartHiDpi, getCanvasSize, applyChartA11y } from './charts-helpers';

/** Render a radar (spider) chart on a canvas element. */
export function radar(
  canvas: HTMLCanvasElement,
  data: RadarDataItem[],
  opts?: RadarOptions,
): HTMLCanvasElement | undefined {
  const o = {
    max: 100,
    levels: 4,
    gridColor: 'rgba(200,200,200,0.1)',
    labelColor: cssVar('--mn-text-tertiary'),
    color: cssVar('--mn-accent'),
    fillOpacity: 0.15,
    lineWidth: 1.5,
    dotRadius: 3,
    ...opts,
  };

  const sz = getCanvasSize(canvas, 200, 200);
  const s = Math.min(sz.width, sz.height);
  const ctx = chartHiDpi(canvas, s, s);
  if (!ctx) return undefined;
  const cx = s / 2;
  const cy = s / 2;
  const radius = s / 2 - 30;
  const n = data.length;
  const angleStep = (Math.PI * 2) / n;

  function getPoint(i: number, value: number): { x: number; y: number } {
    const a = -Math.PI / 2 + i * angleStep;
    const r = (value / o.max) * radius;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  }

  // Grid levels
  for (let lvl = 1; lvl <= o.levels; lvl++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, (lvl / o.levels) * o.max);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = o.gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Axes and labels
  for (let a = 0; a < n; a++) {
    const ep = getPoint(a, o.max);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ep.x, ep.y);
    ctx.strokeStyle = o.gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const lp = getPoint(a, o.max * 1.15);
    ctx.fillStyle = o.labelColor;
    ctx.font = '500 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data[a].label || '', lp.x, lp.y);
  }

  // Data polygon
  ctx.beginPath();
  data.forEach((d, i) => {
    const p = getPoint(i, d.value);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.strokeStyle = o.color;
  ctx.lineWidth = o.lineWidth;
  ctx.stroke();

  // Fill
  const hexR = parseInt(o.color.slice(1, 3), 16);
  const hexG = parseInt(o.color.slice(3, 5), 16);
  const hexB = parseInt(o.color.slice(5, 7), 16);
  ctx.fillStyle = `rgba(${hexR},${hexG},${hexB},${o.fillOpacity})`;
  ctx.fill();

  // Dots
  data.forEach((d, i) => {
    const p = getPoint(i, d.value);
    ctx.beginPath();
    ctx.arc(p.x, p.y, o.dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = o.color;
    ctx.fill();
  });

  const a11yData = data.map((d) => ({ label: d.label, value: d.value }));
  applyChartA11y(canvas, `Radar chart: ${n} dimensions`, a11yData);

  return canvas;
}
