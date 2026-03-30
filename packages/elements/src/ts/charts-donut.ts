/**
 * Maranello Luce Design - Donut chart (Canvas 2D)
 */
import type { DonutSegment, DonutOptions } from './core/types';
import { chartHiDpi, getCanvasSize, getSERIES, applyChartA11y } from './charts-helpers';

/** Render a donut chart on a canvas element. */
export function donut(
  canvas: HTMLCanvasElement,
  segments: DonutSegment[],
  opts?: DonutOptions,
): HTMLCanvasElement | undefined {
  const o = {
    thickness: 0.25,
    gap: 0.02,
    startAngle: -Math.PI / 2,
    animate: true,
    bgRing: 'rgba(200,200,200,0.06)',
    ...opts,
  };

  const size = getCanvasSize(canvas, 140, 140);
  const s = Math.min(size.width, size.height);
  const _ctx = chartHiDpi(canvas, s, s);
  if (!_ctx) return undefined;
  const ctx = _ctx;
  const cx = s / 2;
  const cy = s / 2;
  const outer = s / 2 - 4;
  const inner = outer * (1 - o.thickness);
  let total = 0;
  segments.forEach((seg) => { total += seg.value; });

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, (outer + inner) / 2, 0, Math.PI * 2);
  ctx.strokeStyle = o.bgRing;
  ctx.lineWidth = outer - inner;
  ctx.stroke();

  // Segment arcs
  let angle = o.startAngle;
  segments.forEach((seg, idx) => {
    const sweep = (seg.value / total) * (Math.PI * 2 - o.gap * segments.length);
    ctx.beginPath();
    ctx.arc(cx, cy, (outer + inner) / 2, angle, angle + sweep);
    const series = getSERIES();
    ctx.strokeStyle = seg.color || series[idx % series.length];
    ctx.lineWidth = outer - inner;
    ctx.lineCap = 'round';
    ctx.stroke();
    angle += sweep + o.gap;
  });

  const segDesc = segments.map((s, i) => {
    const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
    return `segment ${i + 1} ${pct}%`;
  }).join(', ');
  const a11yLabel = `Donut chart: ${segDesc}`;
  const a11yData = segments.map((s, i) => {
    const segPct = total > 0 ? Math.round((s.value / total) * 100) : 0;
    return { label: `Segment ${i + 1}`, value: `${segPct}%` };
  });
  applyChartA11y(canvas, a11yLabel, a11yData);

  return canvas;
}
