/**
 * Maranello Luce Design - Confidence Interval Chart (Canvas 2D)
 * Renders a central line with shaded confidence band.
 */
import { escapeHtml } from './core/sanitize';

export interface ConfidenceChartOptions {
  labels: string[];
  values: number[];
  lower: number[];
  upper: number[];
  unit?: string;
  color?: string;
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

/** Resolve a color — handles var(--x) syntax and plain hex/named colors. */
function resolveColor(color: string): string {
  if (color.startsWith('var(')) {
    const varName = color.slice(4, color.indexOf(')')).split(',')[0].trim();
    return resolveCssVar(varName, '#FFC72C');
  }
  if (color.startsWith('--')) {
    return resolveCssVar(color, '#FFC72C');
  }
  return color;
}

/** Parse hex to rgba string. */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Inject a multi-column sr-only table after the canvas. */
function injectSrTable(
  canvas: HTMLCanvasElement,
  caption: string,
  headers: string[],
  rows: string[][],
): void {
  if (!canvas.parentElement) return;
  let srEl = canvas.nextElementSibling;
  if (!srEl || !srEl.classList.contains('mn-sr-only')) {
    srEl = document.createElement('span');
    srEl.className = 'mn-sr-only';
    canvas.parentElement.insertBefore(srEl, canvas.nextSibling);
  }
  const th = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('');
  const body = rows
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('');
  srEl.innerHTML =
    `<table><caption>${escapeHtml(caption)}</caption>` +
    `<thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
}

/**
 * Render a confidence interval chart on a canvas element.
 * Shows a central value line with a shaded band between lower and upper bounds.
 */
export function confidenceChart(
  canvas: HTMLCanvasElement,
  opts: ConfidenceChartOptions,
): void {
  const dpr = window.devicePixelRatio || 1;
  const n = opts.labels.length;
  if (n === 0 || opts.values.length < n) return;

  const logicalW = canvas.offsetWidth || 600;
  const logicalH = opts.height ?? 200;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const rawColor = opts.color ?? 'var(--mn-accent)';
  const lineColor = resolveColor(rawColor);
  const borderColor = resolveCssVar('--mn-border', '#555555');
  const mutedColor = resolveCssVar('--mn-text-muted', '#999999');

  // Y range with 10% padding
  const dataMin = Math.min(...opts.lower);
  const dataMax = Math.max(...opts.upper);
  const rangePad = (dataMax - dataMin) * 0.1 || 1;
  const yMin = dataMin - rangePad;
  const yMax = dataMax + rangePad;

  const pad = { top: 16, bottom: 40, left: 48, right: 12 };
  const chartW = logicalW - pad.left - pad.right;
  const chartH = logicalH - pad.top - pad.bottom;

  const xAt = (i: number) => pad.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const yAt = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  const animate = opts.animate !== false;
  const duration = 500;

  function drawFrame(revealCount: number): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, logicalH);

    // Y gridlines (4 lines)
    const gridRows = 4;
    ctx.strokeStyle = hexToRgba(borderColor.startsWith('#') ? borderColor : '#888888', 0.5);
    ctx.lineWidth = 0.5;
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = mutedColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let r = 0; r <= gridRows; r++) {
      const val = yMin + (r / gridRows) * (yMax - yMin);
      const y = yAt(val);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(logicalW - pad.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(1), pad.left - 6, y);
    }

    const visible = Math.min(Math.ceil(revealCount), n);
    if (visible < 1) return;

    // Confidence band (filled polygon)
    ctx.beginPath();
    for (let i = 0; i < visible; i++) ctx.lineTo(xAt(i), yAt(opts.upper[i]));
    for (let i = visible - 1; i >= 0; i--) ctx.lineTo(xAt(i), yAt(opts.lower[i]));
    ctx.closePath();
    ctx.fillStyle = hexToRgba(lineColor.startsWith('#') ? lineColor : '#FFC72C', 0.15);
    ctx.fill();

    // Central line
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = xAt(i);
      const y = yAt(opts.values[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots at each revealed point
    for (let i = 0; i < visible; i++) {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(opts.values[i]), 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
    }

    // X labels
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = mutedColor;
    ctx.textBaseline = 'top';
    const rotateLabels = n > 6;
    for (let i = 0; i < visible; i++) {
      const x = xAt(i);
      const y = logicalH - pad.bottom + 8;
      if (rotateLabels) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 6);
        ctx.textAlign = 'right';
        ctx.fillText(opts.labels[i], 0, 0);
        ctx.restore();
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(opts.labels[i], x, y);
      }
    }
  }

  if (!animate) {
    drawFrame(n);
  } else {
    let start: number | null = null;
    function frame(ts: number): void {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const revealCount = 1 + p * (n - 1);
      drawFrame(revealCount);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Accessibility
  const trend = opts.values[n - 1] >= opts.values[0] ? 'upward' : 'downward';
  const ariaLabel = `Confidence chart: ${n} points, range ${dataMin} to ${dataMax}, ${trend} trend`;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', ariaLabel);

  const unit = opts.unit ?? '';
  const rows = opts.labels.map((lbl, i) => [
    lbl,
    `${opts.values[i]}${unit}`,
    `${opts.lower[i]}${unit}`,
    `${opts.upper[i]}${unit}`,
  ]);
  injectSrTable(canvas, ariaLabel, ['Label', 'Value', 'Lower', 'Upper'], rows);
}
