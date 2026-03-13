/**
 * Maranello Luce Design - Speedometer canvas drawing
 * Extracted from speedometer.ts for separation of concerns.
 */
import { cssVar } from './core/utils';
import {
  SPEEDO_FONT, valueToAngle, speedoPalette,
  type SpeedoPalette, type SpeedoDrawOptions, type SpeedoBarDrawOptions,
} from './speedometer-palette';

export { SPEEDO_SIZES, SWEEP, START, easeOutCubic, valueToAngle } from './speedometer-palette';
export type { SpeedoPalette, SpeedoDrawOptions, SpeedoBarDrawOptions } from './speedometer-palette';

/** Full-frame speedometer canvas draw. */
export function drawSpeedometer(
  ctx: CanvasRenderingContext2D, dim: number, s: number,
  cx: number, cy: number, R: number,
  curAngle: number, curVal: number, barVal: number,
  opts: SpeedoDrawOptions,
): void {
  const p = speedoPalette();
  const needleCol = p.needle || opts.needleColor;
  const arcCol = p.arc || opts.arcColor;

  ctx.save();
  ctx.clearRect(0, 0, dim, dim);

  drawBackground(ctx, cx, cy, R, s, p);
  drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts);
  drawTicks(ctx, cx, cy, R, s, p, opts);
  drawMajorTicks(ctx, cx, cy, R, s, p, opts);
  drawNeedle(ctx, cx, cy, R, s, curAngle, needleCol);
  drawCenterCap(ctx, cx, cy, s, p);
  drawValueText(ctx, cx, cy, s, curVal, p, opts);
  if (opts.bar) drawBarIndicator(ctx, cx, cy, R, s, barVal, p, opts.bar);

  ctx.restore();
}

function drawBackground(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, p: SpeedoPalette,
): void {
  const bg = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bg.addColorStop(0, p.bg[0]);
  bg.addColorStop(0.82, p.bg[1]);
  bg.addColorStop(1, p.bg[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}

function drawArc(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, curVal: number,
  arcCol: string, opts: SpeedoDrawOptions,
): void {
  const aEnd = opts.arcEnd != null ? opts.arcEnd : curVal;
  if (aEnd <= opts.arcStart) return;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.03,
    valueToAngle(opts.arcStart, opts.max),
    valueToAngle(aEnd, opts.max));
  ctx.strokeStyle = arcCol;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineCap = 'butt';
}

function drawTicks(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, p: SpeedoPalette, opts: SpeedoDrawOptions,
): void {
  const tOut = R * 0.95;
  const minL = 6 * s;
  const segs = opts.ticks.length - 1;
  const totalMinor = segs * (opts.minorTicks + 1);
  ctx.strokeStyle = p.minorTick;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = (i / totalMinor) * opts.max;
    if (opts.ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = valueToAngle(mv, opts.max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }
}

function drawMajorTicks(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, p: SpeedoPalette, opts: SpeedoDrawOptions,
): void {
  const tOut = R * 0.95;
  const majL = 12 * s;
  ctx.strokeStyle = p.majStroke;
  ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText;
  ctx.font = 'bold ' + Math.round(11 * s) + 'px ' + SPEEDO_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const tv of opts.ticks) {
    const ta = valueToAngle(tv, opts.max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(String(tv),
      cx + c1 * (tOut - majL - 10 * s),
      cy + s1 * (tOut - majL - 10 * s));
  }
}

function drawNeedle(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, curAngle: number, needleCol: string,
): void {
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(curAngle);
  ctx.beginPath();
  ctx.moveTo(nLen, 0);
  ctx.lineTo(-nTail, -nW);
  ctx.lineTo(-nTail, nW);
  ctx.closePath();
  ctx.fillStyle = needleCol;
  ctx.shadowColor = needleCol;
  ctx.shadowBlur = 8 * s;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawCenterCap(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  s: number, p: SpeedoPalette,
): void {
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill;
  ctx.fill();
  ctx.strokeStyle = p.capStroke;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}

function drawValueText(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  s: number, curVal: number, p: SpeedoPalette, opts: SpeedoDrawOptions,
): void {
  ctx.fillStyle = p.value;
  ctx.font = 'bold ' + Math.round(32 * s) + 'px ' + SPEEDO_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit;
  ctx.font = Math.round(11 * s) + 'px ' + SPEEDO_FONT;
  ctx.fillText(opts.unit, cx, cy + 37 * s);
  if (opts.subLabel) {
    ctx.fillStyle = p.subLabel;
    ctx.font = Math.round(9 * s) + 'px ' + SPEEDO_FONT;
    ctx.fillText(opts.subLabel, cx, cy + 50 * s);
  }
}

function drawBarIndicator(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  R: number, s: number, barVal: number,
  p: SpeedoPalette, bar: SpeedoBarDrawOptions,
): void {
  const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
  const bX = cx - bW / 2, bY = cy + R * 0.72;
  const stops = p.barStops || bar.colorStops || [
    cssVar('--signal-danger', '#DC0000'),
    cssVar('--signal-warning', '#FFC72C'),
    cssVar('--signal-ok', '#00A651'),
  ];

  ctx.beginPath();
  (ctx as unknown as { roundRect: Function }).roundRect?.(bX, bY, bW, bH, bR);
  ctx.fillStyle = p.barBg;
  ctx.fill();

  const fW = bW * Math.max(0, Math.min(1, barVal));
  if (fW > 1) {
    const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    ctx.save();
    ctx.beginPath();
    (ctx as unknown as { roundRect: Function }).roundRect?.(bX, bY, fW, bH, bR);
    ctx.clip();
    ctx.fillStyle = gr;
    ctx.fillRect(bX, bY, bW, bH);
    ctx.restore();
  }

  ctx.font = Math.round(8 * s) + 'px ' + SPEEDO_FONT;
  ctx.textBaseline = 'top';
  const lY = bY + bH + 3 * s;
  if (bar.labelLeft) {
    ctx.fillStyle = p.barDim; ctx.textAlign = 'left';
    ctx.fillText(bar.labelLeft, bX, lY);
  }
  if (bar.labelRight) {
    ctx.fillStyle = p.barDim; ctx.textAlign = 'right';
    ctx.fillText(bar.labelRight, bX + bW, lY);
  }
  if (bar.label) {
    ctx.fillStyle = p.barBright; ctx.textAlign = 'center';
    ctx.fillText(bar.label, cx, lY);
  }
}
