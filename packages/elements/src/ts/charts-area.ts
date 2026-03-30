/**
 * Maranello Luce Design - Area chart (Canvas 2D)
 */
import type { AreaDataset, AreaChartOptions } from './core/types';
import { chartHiDpi, getCanvasSize, getSERIES, drawSmoothLine, applyChartA11y } from './charts-helpers';

/** Render a multi-dataset area chart on a canvas element. */
export function areaChart(
  canvas: HTMLCanvasElement,
  datasets: AreaDataset[],
  opts?: AreaChartOptions,
): HTMLCanvasElement | undefined {
  const o = {
    colors: getSERIES(),
    fillOpacity: 0.12,
    lineWidth: 1.5,
    gridColor: 'rgba(200,200,200,0.06)',
    gridRows: 4,
    smooth: true,
    showDots: false,
    maxY: null as number | null,
    ...opts,
  };

  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return undefined;

  if (!datasets || datasets.length === 0) return undefined;

  let allVals: number[] = [];
  datasets.forEach((ds) => { allVals = allVals.concat(ds.data); });
  const maxVal = o.maxY ?? Math.max(...allVals) * 1.15;
  const maxLen = Math.max(...datasets.map((ds) => ds.data.length));
  const pad = { top: 8, bottom: 8, left: 8, right: 8 };

  const gx = (i: number) => pad.left + (i / (maxLen - 1)) * (w - pad.left - pad.right);
  const gy = (v: number) => h - pad.bottom - (v / maxVal) * (h - pad.top - pad.bottom);

  // Grid
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= o.gridRows; r++) {
    const yy = pad.top + (r / o.gridRows) * (h - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(w - pad.right, yy);
    ctx.stroke();
  }

  // Each dataset
  datasets.forEach((ds, dsi) => {
    const color = ds.color || o.colors[dsi % o.colors.length];
    const data = ds.data;
    if (!data || data.length < 2) return;

    ctx.beginPath();
    drawSmoothLine(ctx, data, gx, gy, o.smooth);
    ctx.strokeStyle = color;
    ctx.lineWidth = o.lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Fill
    ctx.lineTo(gx(data.length - 1), h - pad.bottom);
    ctx.lineTo(gx(0), h - pad.bottom);
    ctx.closePath();
    const hexR = parseInt(color.slice(1, 3), 16);
    const hexG = parseInt(color.slice(3, 5), 16);
    const hexB = parseInt(color.slice(5, 7), 16);
    const aGrad = ctx.createLinearGradient(0, 0, 0, h);
    aGrad.addColorStop(0, `rgba(${hexR},${hexG},${hexB},${o.fillOpacity})`);
    aGrad.addColorStop(1, `rgba(${hexR},${hexG},${hexB},0)`);
    ctx.fillStyle = aGrad;
    ctx.fill();
  });

  const maxPts = Math.max(...datasets.map((ds) => ds.data.length));
  const a11yLabel = `Area chart: ${datasets.length} series, ${maxPts} points`;
  const a11yData = datasets.map((ds, i) => ({
    label: `Series ${i + 1}`,
    value: `${ds.data.length} points, last ${ds.data[ds.data.length - 1] ?? 0}`,
  }));
  applyChartA11y(canvas, a11yLabel, a11yData);

  return canvas;
}
