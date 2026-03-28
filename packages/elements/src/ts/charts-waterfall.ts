/**
 * Maranello Luce Design - Waterfall Chart (Canvas 2D)
 * Visualizes sequential incremental changes to an initial value.
 */
import { escapeHtml } from './core/sanitize';

export interface WaterfallSegment {
  label: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallChartOptions {
  segments: WaterfallSegment[];
  unit?: string;
  animate?: boolean;
  height?: number;
}

/** Resolve a CSS custom property to its computed value.
 *  Reads from document.body so body-scoped theme overrides resolve. */
function resolveCssVar(name: string, fallback: string): string {
  const el = document.body ?? document.documentElement;
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}

/** Ease-out cubic deceleration curve. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Parse hex to rgba string. */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Inject a multi-column sr-only table after the canvas. */
function injectSrTable(canvas: HTMLCanvasElement, caption: string, headers: string[], rows: string[][]): void {
  if (!canvas.parentElement) return;
  let srEl = canvas.nextElementSibling;
  if (!srEl || !srEl.classList.contains('mn-sr-only')) {
    srEl = document.createElement('span');
    srEl.className = 'mn-sr-only';
    canvas.parentElement.insertBefore(srEl, canvas.nextSibling);
  }
  const th = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('');
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  srEl.innerHTML = `<table><caption>${escapeHtml(caption)}</caption><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
}

/**
 * Render a waterfall chart on a canvas element.
 * Positive values rise, negative values fall, isTotal draws from zero.
 */
export function waterfallChart(canvas: HTMLCanvasElement, opts: WaterfallChartOptions): void {
  const dpr = window.devicePixelRatio || 1;
  const segments = opts.segments;
  if (!segments || segments.length === 0) return;

  const logicalW = canvas.offsetWidth || 600;
  const logicalH = opts.height ?? 200;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const colorUp = resolveCssVar('--signal-ok', '#00A651');
  const colorDown = resolveCssVar('--signal-danger', '#DC0000');
  const colorAccent = resolveCssVar('--mn-accent', '#FFC72C');
  const colorBorder = resolveCssVar('--mn-border', '#555555');
  const colorMuted = resolveCssVar('--mn-text-muted', '#999999');

  // Compute running totals
  const totals: number[] = [];
  let running = 0;
  for (const seg of segments) {
    if (seg.isTotal) {
      running = seg.value;
    } else {
      running += seg.value;
    }
    totals.push(running);
  }

  const allVals = [0, ...totals];
  segments.forEach((s, i) => {
    if (!s.isTotal && i > 0) allVals.push(totals[i] - s.value);
  });
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;

  const pad = { top: 24, bottom: 30, left: 52, right: 12 };
  const chartW = logicalW - pad.left - pad.right;
  const chartH = logicalH - pad.top - pad.bottom;
  const n = segments.length;
  const barGap = chartW * 0.15 / n;
  const barW = (chartW - barGap * (n + 1)) / n;

  const yScale = (v: number) => pad.top + chartH - ((v - minVal) / range) * chartH;
  const xBar = (i: number) => pad.left + barGap + i * (barW + barGap);

  const animate = opts.animate !== false;
  const duration = 600;
  let hoverIdx = -1;

  function drawBars(progress: number): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, logicalH);

    // Y-axis gridlines + scale labels
    const gridCount = 5;
    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 0.5;
    for (let g = 0; g <= gridCount; g++) {
      const v = minVal + (range / gridCount) * g;
      const yy = yScale(v);
      ctx.strokeStyle = hexToRgba(colorBorder, 0.2);
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(logicalW - pad.right, yy); ctx.stroke();
      const abs = Math.abs(v);
      const lbl = abs >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'M'
        : abs >= 1_000 ? (v / 1_000).toFixed(1) + 'k' : String(Math.round(v));
      ctx.fillStyle = colorMuted;
      ctx.fillText(lbl, pad.left - 4, yy);
    }
    ctx.setLineDash([]);

    // Zero baseline
    const zeroY = yScale(0);
    ctx.strokeStyle = colorBorder; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, zeroY); ctx.lineTo(logicalW - pad.right, zeroY); ctx.stroke();

    let prevTop = 0;
    for (let i = 0; i < n; i++) {
      const seg = segments[i];
      const base = seg.isTotal ? 0 : (i === 0 ? 0 : totals[i] - seg.value);
      const top = totals[i];

      const fullBarBottom = yScale(base);
      const fullBarTop = yScale(top);
      const barHeight = fullBarBottom - fullBarTop;
      const animH = barHeight * progress;

      const drawTop = fullBarBottom - animH;
      const x = xBar(i);

      // Bar color at 80% opacity
      let barColor: string;
      if (seg.isTotal) {
        barColor = colorAccent;
      } else if (seg.value >= 0) {
        barColor = colorUp;
      } else {
        barColor = colorDown;
      }

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = barColor;
      ctx.fillRect(x, drawTop, barW, animH);
      ctx.globalAlpha = 1;

      // Hover highlight glow
      if (i === hoverIdx) {
        ctx.save();
        ctx.shadowColor = barColor;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, drawTop, barW, animH);
        ctx.restore();
      }

      // Connector dashed line
      if (i > 0 && !seg.isTotal) {
        ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = colorBorder; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(xBar(i - 1) + barW, yScale(totals[i - 1])); ctx.lineTo(x, fullBarBottom); ctx.stroke(); ctx.restore();
      }

      // Value label on top
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = seg.value >= 0 || seg.isTotal ? 'bottom' : 'top';
      ctx.fillStyle = colorMuted;
      const valStr = (seg.value >= 0 && !seg.isTotal ? '+' : '') + seg.value + (opts.unit ?? '');
      const labelY = seg.value >= 0 || seg.isTotal ? drawTop - 3 : drawTop + animH + 12;
      ctx.fillText(valStr, x + barW / 2, labelY);
      // X-axis label
      ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = colorMuted; ctx.textBaseline = 'top';
      ctx.fillText(seg.label, x + barW / 2, logicalH - pad.bottom + 6);
      prevTop = top;
    }
  }

  if (!animate) {
    drawBars(1);
  } else {
    let start: number | null = null;
    function frame(ts: number): void {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      drawBars(easeOutCubic(p));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Accessibility
  const ariaLabel = `Waterfall chart: ${segments.map((s) => s.label + ' ' + s.value).join(', ')}`;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', ariaLabel);

  const rows = segments.map((s, i) => [
    s.label,
    String(s.value),
    String(totals[i]),
  ]);
  injectSrTable(canvas, ariaLabel, ['Segment', 'Value', 'Running Total'], rows);

  // Hover interaction — highlight bar under cursor
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (logicalW / rect.width);
    let found = -1;
    for (let i = 0; i < n; i++) {
      const bx = xBar(i);
      if (mx >= bx && mx <= bx + barW) { found = i; break; }
    }
    if (found !== hoverIdx) { hoverIdx = found; drawBars(1); }
  });
  canvas.addEventListener('mouseleave', () => {
    if (hoverIdx >= 0) { hoverIdx = -1; drawBars(1); }
  });
}
