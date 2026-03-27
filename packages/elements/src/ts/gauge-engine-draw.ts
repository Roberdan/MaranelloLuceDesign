/**
 * Maranello Luce Design - Gauge engine draw routines
 * Renders ticks, needle, center text, sub-dials, odometer, arc bar, and LEDs.
 */
import type { GaugeRenderPalette } from './gauge-engine-palette';
import {
  drawNeedle, drawCenterText, drawSubDials,
  drawOdometer, drawStatusLed, drawTrend,
} from './gauge-engine-draw-details';

export interface GaugeDrawState {
  ctx: CanvasRenderingContext2D;
  cx: number;
  cy: number;
  radius: number;
  size: number;
  config: Record<string, unknown>;
  palette: GaugeRenderPalette;
  density: 'sm' | 'md' | 'lg';
  rad: (deg: number) => number;
}

/** Main draw function for the Ferrari gauge. Called per animation frame. */
export function drawGauge(state: GaugeDrawState, progress: number): void {
  const { ctx, cx, cy, radius, size, config: cfg, palette: P } = state;
  const c = (cfg.complications || {}) as Record<string, unknown>;
  ctx.clearRect(0, 0, size, size);

  // Outer shadow ring
  const shadowGrad = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.1);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  shadowGrad.addColorStop(0.25, 'rgba(0,0,0,0.15)');
  shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
  shadowGrad.addColorStop(0.75, 'rgba(0,0,0,0.2)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
  ctx.strokeStyle = shadowGrad; ctx.lineWidth = radius * 0.28; ctx.stroke();

  // Vignette
  const vigGrad = ctx.createRadialGradient(cx, cy * 0.95, radius * 0.1, cx, cy, radius * 0.95);
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(0.6, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(0.85, 'rgba(0,0,0,0.15)');
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.beginPath(); ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = vigGrad; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
  ctx.strokeStyle = P.highlightRing; ctx.lineWidth = 1; ctx.stroke();

  const sa = (cfg.startAngle ?? -135) as number;
  const ea = (cfg.endAngle ?? 135) as number;
  const ticks = (cfg.ticks ?? 0) as number;
  const subticks = (cfg.subticks ?? 1) as number;
  const value = (cfg.value ?? 0) as number;
  const max = (cfg.max ?? 100) as number;
  const color = (cfg.color ?? '#FFC72C') as string;
  const showNeedle = (cfg.showNeedle ?? true) as boolean;
  const numbers = (cfg.numbers ?? []) as number[];
  const totalSweep = ea - sa;

  drawInnerRing(state, c, progress, sa, totalSweep);
  drawTicks(state, ticks, subticks, sa, totalSweep);
  drawNumbers(state, numbers, sa, totalSweep, max);
  drawArcBar(state, c, progress, sa, totalSweep);

  if (showNeedle && ticks > 0) {
    drawNeedle(state, progress, sa, totalSweep, value, max, color);
  }

  drawCenterText(state, c);
  drawSubDials(state, c, progress);
  drawOdometer(state, c);
  drawStatusLed(state, c);
  drawTrend(state, c);
}

function drawInnerRing(
  s: GaugeDrawState, c: Record<string, unknown>,
  progress: number, sa: number, totalSweep: number,
): void {
  const ir = c.innerRing as Record<string, unknown> | undefined;
  if (!ir) return;
  const irR = s.radius * 0.48;
  s.ctx.beginPath(); s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha; s.ctx.lineWidth = 3;
  s.ctx.lineCap = 'round'; s.ctx.stroke();
  const val = ((ir.value as number) / (ir.max as number)) * totalSweep * progress;
  s.ctx.beginPath(); s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + val));
  s.ctx.strokeStyle = ir.color as string; s.ctx.lineWidth = 3;
  s.ctx.lineCap = 'round'; s.ctx.stroke();
  const fs = Math.max(7, s.size * 0.04);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.fillStyle = ir.color as string; s.ctx.textAlign = 'center';
  s.ctx.textBaseline = 'middle';
  s.ctx.fillText(ir.label as string, s.cx, s.cy + s.radius * 0.50);
}

function drawTicks(
  s: GaugeDrawState, ticks: number, subticks: number,
  sa: number, totalSweep: number,
): void {
  if (ticks <= 0) return;
  const total = ticks * subticks;
  const skipMinor = s.density === 'sm';
  for (let i = 0; i <= total; i++) {
    const angle = s.rad(sa + (i / total) * totalSweep);
    const isMajor = i % subticks === 0;
    const isHalf = subticks > 1 && i % Math.floor(subticks / 2) === 0 && !isMajor;
    if (skipMinor && !isMajor && !isHalf) continue;
    let innerR: number, outerR: number, lw: number, tc: string;
    if (isMajor) { innerR = 0.70; outerR = 0.92; lw = 2.2; tc = s.palette.tickMajor; }
    else if (isHalf) { innerR = 0.78; outerR = 0.92; lw = 1.0; tc = s.palette.tickHalf; }
    else { innerR = 0.84; outerR = 0.92; lw = 0.6; tc = s.palette.tickMinor; }
    s.ctx.beginPath();
    s.ctx.moveTo(s.cx + Math.cos(angle) * s.radius * innerR, s.cy + Math.sin(angle) * s.radius * innerR);
    s.ctx.lineTo(s.cx + Math.cos(angle) * s.radius * outerR, s.cy + Math.sin(angle) * s.radius * outerR);
    s.ctx.strokeStyle = tc; s.ctx.lineWidth = lw; s.ctx.lineCap = 'butt'; s.ctx.stroke();
  }
}

function drawNumbers(
  s: GaugeDrawState, numbers: number[],
  sa: number, totalSweep: number, max: number,
): void {
  if (!numbers.length) return;
  const fs = Math.max(8, s.size * 0.055);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.textAlign = 'center'; s.ctx.textBaseline = 'middle';
  const step = s.density === 'sm' && numbers.length > 5 ? 2 : 1;
  numbers.forEach((num, idx) => {
    if (step > 1 && idx % step !== 0 && idx !== numbers.length - 1) return;
    const angle = s.rad(sa + (num / max) * totalSweep);
    s.ctx.fillStyle = s.palette.numbers;
    s.ctx.fillText(num.toString(), s.cx + Math.cos(angle) * s.radius * 0.56,
      s.cy + Math.sin(angle) * s.radius * 0.56);
  });
}

function drawArcBar(
  s: GaugeDrawState, c: Record<string, unknown>,
  progress: number, sa: number, totalSweep: number,
): void {
  const ab = c.arcBar as Record<string, unknown> | undefined;
  if (!ab) return;
  const arcR = s.radius * 0.96;
  s.ctx.beginPath(); s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha; s.ctx.lineWidth = 5;
  s.ctx.lineCap = 'round'; s.ctx.stroke();
  const val = ((ab.value as number) / (ab.max as number)) * totalSweep * progress;
  const fillEnd = s.rad(sa + val);
  // Gradient must start where the arc starts; stops scaled to arc fraction so
  // last color aligns with arc end (270° arc = 0.75 of the 360° conic sweep).
  const arcFrac = totalSweep / 360;
  const g = s.ctx.createConicGradient(s.rad(sa), s.cx, s.cy);
  const stops = (ab.colorStops as string[] | undefined) || ['#DC0000', '#FFC72C', '#00A651'];
  stops.forEach((col, i) => g.addColorStop((i / (stops.length - 1)) * arcFrac, col));
  s.ctx.beginPath(); s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), fillEnd);
  s.ctx.strokeStyle = g; s.ctx.lineWidth = 5; s.ctx.lineCap = 'round'; s.ctx.stroke();
  const na = s.rad(sa + val);
  s.ctx.beginPath(); s.ctx.arc(s.cx + Math.cos(na) * arcR, s.cy + Math.sin(na) * arcR, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = s.palette.arcDot; s.ctx.fill();

  const fs = Math.max(7, s.size * 0.04);
  if (ab.labelCenter) { s.ctx.font = `600 ${fs}px 'Barlow Condensed',sans-serif`; s.ctx.fillStyle = '#00A651'; s.ctx.textAlign = 'center'; s.ctx.textBaseline = 'middle'; s.ctx.fillText(ab.labelCenter as string, s.cx, s.cy + s.radius * 0.78); }
  const sfs = Math.max(6, s.size * 0.03);
  if (ab.labelLeft) { s.ctx.font = `400 ${sfs}px 'Inter',sans-serif`; s.ctx.fillStyle = s.palette.muted; s.ctx.textAlign = 'left'; s.ctx.fillText(ab.labelLeft as string, s.cx - s.radius * 0.65, s.cy + s.radius * 0.92); }
  if (ab.labelRight) { s.ctx.textAlign = 'right'; s.ctx.fillText(ab.labelRight as string, s.cx + s.radius * 0.65, s.cy + s.radius * 0.92); }
}
