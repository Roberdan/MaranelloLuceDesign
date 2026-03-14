/**
 * Maranello Luce Design - Half gauge chart (Canvas 2D)
 */
import type { HalfGaugeOptions } from './core/types';
import { cssVar } from './core/utils';
import { chartHiDpi, getCanvasSize, applyChartA11y } from './charts-helpers';

/** Render a half-gauge (semicircular gauge) on a canvas element. */
export function halfGauge(
  canvas: HTMLCanvasElement,
  opts?: HalfGaugeOptions,
): HTMLCanvasElement {
  const o = {
    value: 0,
    min: 0,
    max: 100,
    colors: [
      { stop: 0, color: cssVar('--signal-danger', '#DC0000') },
      { stop: 0.5, color: cssVar('--signal-warning', '#FFC72C') },
      { stop: 1, color: cssVar('--signal-ok', '#00A651') },
    ],
    trackColor: 'rgba(200,200,200,0.08)',
    thickness: 0.18,
    label: '',
    unit: '',
    ...opts,
  };

  const size = getCanvasSize(canvas, 200, 120);
  const w = size.width;
  const h = Math.round(w * 0.6);
  const ctx = chartHiDpi(canvas, w, h);

  const cx = w / 2;
  const cy = h - 10;
  const radius = Math.min(w / 2, h) - 16;
  const lineW = radius * o.thickness;
  const startA = Math.PI;
  const endA = Math.PI * 2;
  const pct = Math.max(0, Math.min(1, (o.value - o.min) / (o.max - o.min)));

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startA, endA);
  ctx.strokeStyle = o.trackColor;
  ctx.lineWidth = lineW;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Active arc
  if (pct > 0) {
    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    o.colors.forEach((c) => { grad.addColorStop(c.stop, c.color); });
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, startA + pct * Math.PI);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.shadowColor = o.colors[Math.floor(pct * (o.colors.length - 1))].color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Min/max labels
  ctx.fillStyle = '#616161';
  const fontFamily = getComputedStyle(document.body)
    .getPropertyValue('--font-display') || 'Outfit';
  ctx.font = '500 ' + (radius * 0.1) + 'px ' + fontFamily;
  ctx.textAlign = 'center';
  ctx.fillText(String(o.min), cx - radius + lineW / 2, cy + radius * 0.18);
  ctx.fillText(String(o.max), cx + radius - lineW / 2, cy + radius * 0.18);

  const unitSuffix = o.unit ? ' ' + o.unit : '';
  applyChartA11y(canvas, `Gauge: ${o.value} of ${o.max}${unitSuffix}`);

  return canvas;
}
