/**
 * Maranello Luce Design - Speedometer gauge
 * Animated needle speedometer with optional bar indicator.
 */
import type { SpeedometerOptions, SpeedometerController } from './core/types';
import { cssVar } from './core/utils';

const SIZES: Record<string, number> = { sm: 120, md: 220, lg: 320 };
const SWEEP = Math.PI * 1.5;
const START = Math.PI * 0.75;
const FONT = "'Barlow Condensed', 'Outfit', sans-serif";

function easeOutCubic(t: number): number { return 1 - Math.pow(1 - t, 3); }

function v2a(v: number, max: number): number {
  return START + (Math.min(Math.max(v, 0), max) / max) * SWEEP;
}

function speedoPalette(): Record<string, unknown> {
  const cl = document.body.classList;
  const isCB = cl.contains('mn-colorblind');
  const isNero = cl.contains('mn-nero');
  const D: Record<string, unknown> = {
    needle: null, arc: null, barStops: null,
    bg: ['#0d0d0d', '#1a1a1a', '#2c2c2c'], border: '#3a3a3a',
    minorTick: '#444', majStroke: '#aaa', majText: '#c8c8c8',
    capFill: '#2a2a2a', capStroke: '#555',
    value: '#fafafa', unit: '#888', subLabel: '#666',
    barBg: '#1a1a1a', barDim: '#666', barBright: '#aaa',
  };
  if (isCB) return { ...D, needle: '#4D9DE0', arc: '#7EC8E3', barStops: ['#E15759', '#EDC948', '#59A14F'] };
  if (isNero) return { ...D, bg: ['#050505', '#111', '#1a1a1a'], border: '#2a2a2a',
    minorTick: '#333', capFill: '#1a1a1a', capStroke: '#444', barBg: '#111' };
  return D;
}

function drawSpeedo(
  ctx: CanvasRenderingContext2D, dim: number, s: number,
  cx: number, cy: number, R: number,
  curAngle: number, curVal: number, barVal: number,
  options: Record<string, unknown>,
): void {
  const p = speedoPalette();
  const needleCol = (p.needle as string) || (options.needleColor as string);
  const arcCol = (p.arc as string) || (options.arcColor as string);
  const bg = p.bg as string[];

  ctx.save();
  ctx.clearRect(0, 0, dim, dim);

  // Background
  const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bgGrad.addColorStop(0, bg[0]); bgGrad.addColorStop(0.82, bg[1]); bgGrad.addColorStop(1, bg[2]);
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bgGrad; ctx.fill();
  ctx.strokeStyle = p.border as string; ctx.lineWidth = 1.5 * s; ctx.stroke();

  // Arc
  const aEnd = options.arcEnd != null ? options.arcEnd as number : curVal;
  if ((aEnd as number) > (options.arcStart as number)) {
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.03,
      v2a(options.arcStart as number, options.max as number),
      v2a(aEnd as number, options.max as number));
    ctx.strokeStyle = arcCol; ctx.lineWidth = 4 * s;
    ctx.lineCap = 'round'; ctx.globalAlpha = 0.85; ctx.stroke();
    ctx.globalAlpha = 1; ctx.lineCap = 'butt';
  }

  // Ticks
  const ticks = options.ticks as number[];
  const minorTicks = options.minorTicks as number;
  const max = options.max as number;
  const tOut = R * 0.95, majL = 12 * s, minL = 6 * s;
  const segs = ticks.length - 1, totalMinor = segs * (minorTicks + 1);
  ctx.strokeStyle = p.minorTick as string; ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = (i / totalMinor) * max;
    if (ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = v2a(mv, max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }

  // Major ticks + labels
  ctx.strokeStyle = p.majStroke as string; ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText as string;
  ctx.font = 'bold ' + Math.round(11 * s) + 'px ' + FONT;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let t = 0; t < ticks.length; t++) {
    const tv = ticks[t], ta = v2a(tv, max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(String(tv), cx + c1 * (tOut - majL - 10 * s), cy + s1 * (tOut - majL - 10 * s));
  }

  // Needle
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(curAngle);
  ctx.beginPath(); ctx.moveTo(nLen, 0); ctx.lineTo(-nTail, -nW); ctx.lineTo(-nTail, nW); ctx.closePath();
  ctx.fillStyle = needleCol; ctx.shadowColor = needleCol; ctx.shadowBlur = 8 * s; ctx.fill();
  ctx.shadowBlur = 0; ctx.restore();

  // Center cap
  ctx.beginPath(); ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill as string; ctx.fill();
  ctx.strokeStyle = p.capStroke as string; ctx.lineWidth = 1.5 * s; ctx.stroke();

  // Value text
  ctx.fillStyle = p.value as string;
  ctx.font = 'bold ' + Math.round(32 * s) + 'px ' + FONT;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit as string; ctx.font = Math.round(11 * s) + 'px ' + FONT;
  ctx.fillText(options.unit as string, cx, cy + 37 * s);
  if (options.subLabel) {
    ctx.fillStyle = p.subLabel as string; ctx.font = Math.round(9 * s) + 'px ' + FONT;
    ctx.fillText(options.subLabel as string, cx, cy + 50 * s);
  }

  // Bar indicator
  const bar = options.bar as Record<string, unknown> | null;
  if (bar) {
    const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
    const bX = cx - bW / 2, bY = cy + R * 0.72;
    const stops = (p.barStops as string[]) || (bar.colorStops as string[]) ||
      [cssVar('--signal-danger', '#DC0000'), cssVar('--signal-warning', '#FFC72C'), cssVar('--signal-ok', '#00A651')];
    ctx.beginPath(); (ctx as unknown as { roundRect: Function }).roundRect?.(bX, bY, bW, bH, bR);
    ctx.fillStyle = p.barBg as string; ctx.fill();
    const fW = bW * Math.max(0, Math.min(1, barVal));
    if (fW > 1) {
      const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
      stops.forEach((c: string, i: number) => gr.addColorStop(i / (stops.length - 1), c));
      ctx.save(); ctx.beginPath();
      (ctx as unknown as { roundRect: Function }).roundRect?.(bX, bY, fW, bH, bR);
      ctx.clip(); ctx.fillStyle = gr; ctx.fillRect(bX, bY, bW, bH); ctx.restore();
    }
    ctx.font = Math.round(8 * s) + 'px ' + FONT; ctx.textBaseline = 'top';
    const lY = bY + bH + 3 * s;
    if (bar.labelLeft) { ctx.fillStyle = p.barDim as string; ctx.textAlign = 'left'; ctx.fillText(bar.labelLeft as string, bX, lY); }
    if (bar.labelRight) { ctx.fillStyle = p.barDim as string; ctx.textAlign = 'right'; ctx.fillText(bar.labelRight as string, bX + bW, lY); }
    if (bar.label) { ctx.fillStyle = p.barBright as string; ctx.textAlign = 'center'; ctx.fillText(bar.label as string, cx, lY); }
  }

  ctx.restore();
}

/** Create an animated speedometer gauge on a canvas element. */
export function speedometer(
  canvas: HTMLCanvasElement, opts?: SpeedometerOptions,
): SpeedometerController {
  const options: Record<string, unknown> = {
    value: 0, max: 100, unit: '', size: 'md',
    ticks: [0, 25, 50, 75, 100], minorTicks: 4,
    needleColor: cssVar('--signal-danger', '#DC0000'),
    arcColor: cssVar('--chart-default', '#FFC72C'),
    arcStart: 0, arcEnd: null, bar: null, subLabel: null, animate: true,
    ...opts,
  };

  const dim = SIZES[(options.size as string)] || SIZES.md;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = dim * dpr;
  canvas.height = dim * dpr;
  canvas.style.width = dim + 'px';
  canvas.style.height = dim + 'px';
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  const s = dim / 220;
  const cx = dim / 2, cy = dim / 2, R = dim * 0.4;

  // Accessibility: role, aria-label, fallback text, sr-only span
  const max = options.max as number;
  const unit = (options.unit as string) || '';

  function buildLabel(v: number): string {
    const suffix = unit ? `${Math.round(v)}${unit}` : String(Math.round(v));
    return `Speedometer: ${suffix} of ${max}`;
  }

  canvas.setAttribute('role', 'img');
  const initLabel = buildLabel(options.value as number);
  canvas.setAttribute('aria-label', initLabel);
  canvas.textContent = initLabel;

  const srSpan = document.createElement('span');
  srSpan.className = 'mn-sr-only';
  srSpan.textContent = initLabel;
  canvas.parentElement?.insertBefore(srSpan, canvas.nextSibling);

  function updateA11y(v: number): void {
    const l = buildLabel(v);
    canvas.setAttribute('aria-label', l);
    canvas.textContent = l;
    srSpan.textContent = l;
  }

  let curAngle = v2a(options.value as number, max);
  let curVal = options.value as number;
  let barVal = options.bar ? ((options.bar as Record<string, unknown>).value as number || 0) : 0;
  let animId: number | null = null;

  function draw(): void {
    drawSpeedo(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, options);
  }

  function animateTo(toAngle: number, toVal: number): void {
    if (animId) cancelAnimationFrame(animId);
    const fromA = curAngle, fromV = curVal;
    const t0 = performance.now(), dur = 800;
    const tick = (now: number): void => {
      const p = Math.min(1, (now - t0) / dur);
      const ep = easeOutCubic(p);
      curAngle = fromA + (toAngle - fromA) * ep;
      curVal = fromV + (toVal - fromV) * ep;
      draw();
      if (p < 1) animId = requestAnimationFrame(tick);
      else { animId = null; updateA11y(toVal); }
    };
    tick(performance.now());
  }

  if (options.animate) {
    curAngle = START; curVal = 0;
    animateTo(v2a(options.value as number, max), options.value as number);
  } else {
    draw();
  }

  return {
    setValue(v: number): void {
      const ta = v2a(v, max);
      if (options.animate) animateTo(ta, v);
      else { curAngle = ta; curVal = v; draw(); updateA11y(v); }
    },
    setBar(v: number): void { barVal = Math.max(0, Math.min(1, v)); if (!animId) draw(); },
    destroy(): void { if (animId) cancelAnimationFrame(animId); ctx.clearRect(0, 0, dim * dpr, dim * dpr); },
  };
}
