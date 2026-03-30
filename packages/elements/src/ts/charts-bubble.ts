/**
 * Maranello Luce Design - Bubble chart (Canvas 2D)
 */
import type { BubbleDataItem, BubbleOptions } from './core/types';
import { chartHiDpi, getCanvasSize, getSERIES, applyChartA11y } from './charts-helpers';

/** Render a bubble chart on a canvas element. */
export function bubble(
  canvas: HTMLCanvasElement,
  data: BubbleDataItem[],
  opts?: BubbleOptions,
): HTMLCanvasElement | undefined {
  const o = {
    colors: getSERIES(),
    maxBubbleRadius: 30,
    gridColor: 'rgba(200,200,200,0.06)',
    axisColor: '#616161',
    opacity: 0.6,
    maxY: null as number | null,
    ...opts,
  };

  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return undefined;

  if (!data || data.length === 0) return undefined;

  const pad = { top: 12, bottom: 12, left: 12, right: 12 };
  const maxX = Math.max(...data.map((d) => d.x)) * 1.1;
  const maxY = o.maxY ?? Math.max(...data.map((d) => d.y)) * 1.1;
  const maxZ = Math.max(...data.map((d) => d.z ?? 1));

  const gx = (v: number) => pad.left + (v / maxX) * (w - pad.left - pad.right);
  const gy = (v: number) => h - pad.bottom - (v / maxY) * (h - pad.top - pad.bottom);
  const gr = (v: number) => Math.max(4, (v / maxZ) * o.maxBubbleRadius);

  // Grid
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= 4; r++) {
    const yy = pad.top + (r / 4) * (h - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(w - pad.right, yy);
    ctx.stroke();
  }

  // Bubbles
  data.forEach((d, i) => {
    const bx = gx(d.x);
    const by = gy(d.y);
    const br = gr(d.z ?? 1);
    const color = d.color || o.colors[i % o.colors.length];

    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = o.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (d.label) {
      ctx.fillStyle = '#c8c8c8';
      ctx.font = '500 8px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, bx, by + br + 12);
    }
  });

  const a11yData = data.map((d) => ({
    label: d.label || `(${d.x}, ${d.y})`,
    value: `z ${d.z ?? 1}`,
  }));
  applyChartA11y(canvas, `Bubble chart: ${data.length} data points`, a11yData);

  return canvas;
}
