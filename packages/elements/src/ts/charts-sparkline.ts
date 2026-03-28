/**
 * Maranello Luce Design - Sparkline chart (Canvas 2D)
 */
import type { SparklineOptions } from './core/types';
import { cssVar } from './core/utils';
import { chartHiDpi, getCanvasSize, hexFillGradient, drawSmoothLine, applyChartA11y } from './charts-helpers';

/** Render a sparkline chart on a canvas element. */
export function sparkline(
  canvas: HTMLCanvasElement,
  data: number[],
  opts?: SparklineOptions,
): HTMLCanvasElement | undefined {
  const o = {
    color: cssVar('--mn-accent'),
    fillOpacity: 0.15,
    lineWidth: 1.5,
    smooth: true,
    showDot: true,
    ...opts,
  };

  const size = getCanvasSize(canvas, 80, 28);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return undefined;

  if (!data || data.length < 2) return undefined;

  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const pad = 2;

  const getX = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const getY = (v: number) => h - pad - ((v - mn) / range) * (h - pad * 2);

  ctx.beginPath();
  drawSmoothLine(ctx, data, getX, getY, o.smooth ?? true);

  ctx.strokeStyle = o.color!;
  ctx.lineWidth = o.lineWidth ?? 1.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Fill area under line
  ctx.lineTo(getX(data.length - 1), h);
  ctx.lineTo(getX(0), h);
  ctx.closePath();

  if (o.color!.startsWith('#')) {
    ctx.fillStyle = hexFillGradient(ctx, o.color!, h, o.fillOpacity ?? 0.15);
  } else {
    ctx.fillStyle = `rgba(255,199,44,${o.fillOpacity})`;
  }
  ctx.fill();

  if (o.showDot) {
    const lastX = getX(data.length - 1);
    const lastY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = o.color!;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const last = data[data.length - 1];
  const a11yLabel = `Sparkline: values from ${mn} to ${mx}, latest ${last}`;
  const a11yData = data.map((v, i) => ({ label: `Point ${i + 1}`, value: v }));
  applyChartA11y(canvas, a11yLabel, a11yData);

  return canvas;
}
