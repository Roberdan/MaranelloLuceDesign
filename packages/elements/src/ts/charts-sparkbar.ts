/**
 * Maranello Luce Design - Spark bar chart (Canvas 2D)
 * Vertical bar chart with rounded tops, grid lines, and labels.
 */
import type { BarDataItem, BarChartOptions } from './core/types';
import { chartHiDpi, getCanvasSize, getSERIES, applyChartA11y } from './charts-helpers';

/** Render a vertical bar chart on a canvas element. */
export function barChart(
  canvas: HTMLCanvasElement,
  data: BarDataItem[],
  opts?: BarChartOptions,
): HTMLCanvasElement | undefined {
  const o = {
    colors: getSERIES(),
    barRadius: 3,
    gap: 0.3,
    showLabels: true,
    animate: true,
    maxY: null as number | null,
    gridColor: 'rgba(200,200,200,0.06)',
    labelColor: '#616161',
    ...opts,
  };

  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return undefined;

  if (!data || data.length === 0) return undefined;

  const maxVal = o.maxY ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const pad = { top: 8, bottom: o.showLabels ? 22 : 8, left: 8, right: 8 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = (chartW / data.length) * (1 - o.gap);
  const gapW = (chartW / data.length) * o.gap;

  // Grid lines
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let g = 0; g <= 4; g++) {
    const gy = pad.top + (g / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(w - pad.right, gy);
    ctx.stroke();
  }

  // Bars
  data.forEach((d, i) => {
    const x = pad.left + i * (barW + gapW) + gapW / 2;
    const barH = (d.value / maxVal) * chartH;
    const y = pad.top + chartH - barH;
    const color = d.color || o.colors[i % o.colors.length];

    ctx.beginPath();
    ctx.moveTo(x, y + o.barRadius);
    ctx.arcTo(x, y, x + o.barRadius, y, o.barRadius);
    ctx.arcTo(x + barW, y, x + barW, y + o.barRadius, o.barRadius);
    ctx.lineTo(x + barW, pad.top + chartH);
    ctx.lineTo(x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    if (o.showLabels && d.label) {
      ctx.fillStyle = o.labelColor;
      ctx.font = '500 ' + Math.min(10, barW * 0.6) + 'px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, h - 4);
    }
  });

  const highest = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
  const a11yLabel = `Bar chart: ${data.length} categories, highest ${highest.label || 'item'} at ${highest.value}`;
  const a11yData = data.map((d) => ({ label: d.label || 'item', value: d.value }));
  applyChartA11y(canvas, a11yLabel, a11yData);

  return canvas;
}
