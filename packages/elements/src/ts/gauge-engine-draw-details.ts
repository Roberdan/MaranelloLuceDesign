/**
 * Maranello Luce Design - Gauge engine draw detail routines
 * Needle, center text, sub-dials, odometer, status LED, trend arrow.
 */
import type { GaugeDrawState } from './gauge-engine-draw';

export function drawNeedle(
  s: GaugeDrawState, progress: number,
  sa: number, totalSweep: number, value: number, max: number, color: string,
): void {
  const { ctx, cx, cy, radius } = s;
  const curVal = value * progress;
  const needleAngle = s.rad(sa + (curVal / max) * totalSweep);
  const needleLen = radius * 0.82, nTail = radius * 0.18;
  const tipX = cx + Math.cos(needleAngle) * needleLen;
  const tipY = cy + Math.sin(needleAngle) * needleLen;
  const perpAngle = needleAngle + Math.PI / 2;
  const bw = Math.max(1.8, s.size * 0.012);
  const tailX = cx - Math.cos(needleAngle) * nTail;
  const tailY = cy - Math.sin(needleAngle) * nTail;
  const tw = bw * 1.5;

  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 22;
  ctx.beginPath(); ctx.moveTo(tipX, tipY);
  ctx.lineTo(cx + Math.cos(perpAngle) * bw, cy + Math.sin(perpAngle) * bw);
  ctx.lineTo(tailX + Math.cos(perpAngle) * tw, tailY + Math.sin(perpAngle) * tw);
  ctx.lineTo(tailX - Math.cos(perpAngle) * tw, tailY - Math.sin(perpAngle) * tw);
  ctx.lineTo(cx - Math.cos(perpAngle) * bw, cy - Math.sin(perpAngle) * bw);
  ctx.closePath();
  const ng = ctx.createLinearGradient(tailX, tailY, tipX, tipY);
  ng.addColorStop(0, s.palette.needleTail); ng.addColorStop(0.3, color);
  ng.addColorStop(0.85, color); ng.addColorStop(1, s.palette.needleTip);
  ctx.fillStyle = ng; ctx.fill(); ctx.restore();

  // Cap
  const capR = radius * 0.11;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(cx, cy, capR, 0, Math.PI * 2);
  const cg = ctx.createRadialGradient(cx - capR * 0.2, cy - capR * 0.3, 0, cx, cy, capR);
  s.palette.capOuter.forEach((c, i) => cg.addColorStop(i / 3, c));
  ctx.fillStyle = cg; ctx.fill(); ctx.restore();
  const capR2 = capR * 0.65;
  const cg2 = ctx.createRadialGradient(cx - capR2 * 0.15, cy - capR2 * 0.2, 0, cx, cy, capR2);
  s.palette.capInner.forEach((c, i) => cg2.addColorStop(i / 2, c));
  ctx.beginPath(); ctx.arc(cx, cy, capR2, 0, Math.PI * 2); ctx.fillStyle = cg2; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, capR * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = s.palette.capCenter; ctx.fill();
}

export function drawCenterText(s: GaugeDrawState, c: Record<string, unknown>): void {
  const fsCtr = Math.max(20, s.size * 0.22);
  if (c.centerValue) {
    s.ctx.font = `700 ${fsCtr}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue; s.ctx.textAlign = 'center';
    s.ctx.textBaseline = 'middle';
    s.ctx.fillText(c.centerValue as string, s.cx, s.cy);
  }
  if (c.centerUnit) {
    s.ctx.font = `500 ${Math.max(8, s.size * 0.055)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerUnit; s.ctx.textAlign = 'center';
    s.ctx.textBaseline = 'middle';
    s.ctx.fillText(c.centerUnit as string, s.cx, s.cy + fsCtr * 0.55);
  }
  if (c.centerLabel) {
    s.ctx.font = `600 ${Math.max(7, s.size * 0.045)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerLabel; s.ctx.textAlign = 'center';
    s.ctx.textBaseline = 'middle';
    s.ctx.fillText(c.centerLabel as string, s.cx, s.cy - fsCtr * 0.65);
  }
}

export function drawSubDials(
  s: GaugeDrawState, c: Record<string, unknown>, progress: number,
): void {
  const subs = c.subDials as Array<Record<string, unknown>> | undefined;
  if (!subs) return;
  subs.forEach((sd) => {
    const sx = s.cx + (sd.x as number) * s.size;
    const sy = s.cy + (sd.y as number) * s.size;
    const sr = s.size * 0.10;
    const bg = s.ctx.createRadialGradient(sx, sy - 1, sr * 0.2, sx, sy, sr);
    bg.addColorStop(0, s.palette.subDialBg[0]); bg.addColorStop(1, s.palette.subDialBg[1]);
    s.ctx.beginPath(); s.ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    s.ctx.fillStyle = bg; s.ctx.fill();
    s.ctx.strokeStyle = s.palette.subDialBorder; s.ctx.lineWidth = 1.5; s.ctx.stroke();
    const sSa = s.rad(-225), sEa = s.rad(45);
    s.ctx.beginPath(); s.ctx.arc(sx, sy, sr * 0.72, sSa, sEa);
    s.ctx.strokeStyle = s.palette.subDialTrack; s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = 'round'; s.ctx.stroke();
    const val = ((sd.value as number) / (sd.max as number)) * 270 * progress;
    s.ctx.beginPath(); s.ctx.arc(sx, sy, sr * 0.72, sSa, s.rad(-225 + val));
    s.ctx.strokeStyle = sd.color as string; s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = 'round'; s.ctx.stroke();
    const sfs = Math.max(8, sr * 0.55);
    s.ctx.font = `700 ${sfs}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = sd.color as string; s.ctx.textAlign = 'center';
    s.ctx.textBaseline = 'middle';
    s.ctx.fillText(Math.round((sd.value as number) * progress).toString(), sx, sy - sr * 0.05);
    if (s.density !== 'sm') {
      const lfs = Math.max(5, sr * 0.32);
      s.ctx.font = `500 ${lfs}px 'Barlow Condensed',sans-serif`;
      s.ctx.fillStyle = s.palette.axisLabel;
      s.ctx.fillText(sd.label as string, sx, sy + sr * 0.45);
    }
  });
}

export function drawOdometer(s: GaugeDrawState, c: Record<string, unknown>): void {
  const od = c.odometer as Record<string, unknown> | undefined;
  if (!od) return;
  const oy = s.cy + s.radius * 0.62;
  const dw = Math.max(10, s.size * 0.055);
  const dh = Math.max(14, s.size * 0.07);
  const digits = od.digits as Array<string | number>;
  const highlightLast = od.highlightLast as boolean | undefined;
  const totalW = digits.length * (dw + 1);
  let ox = s.cx - totalW / 2;
  digits.forEach((d, i) => {
    const isLast = i === digits.length - 1 && highlightLast;
    s.ctx.fillStyle = isLast ? '#DC0000' : s.palette.odometerBg;
    s.ctx.strokeStyle = isLast ? '#DC0000' : s.palette.odometerBorder;
    s.ctx.lineWidth = 0.8;
    s.ctx.beginPath(); s.ctx.roundRect(ox, oy - dh / 2, dw, dh, 2);
    s.ctx.fill(); s.ctx.stroke();
    s.ctx.font = `600 ${Math.max(7, dw * 0.6)}px 'Barlow Condensed',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue; s.ctx.textAlign = 'center';
    s.ctx.textBaseline = 'middle';
    s.ctx.fillText(String(d), ox + dw / 2, oy);
    ox += dw + 1;
  });
}

export function drawStatusLed(s: GaugeDrawState, c: Record<string, unknown>): void {
  const led = c.statusLed as Record<string, unknown> | undefined;
  if (!led) return;
  const lx = s.cx - s.radius * 0.25;
  const ly = s.cy + s.radius * 0.38;
  s.ctx.save(); s.ctx.shadowColor = led.color as string; s.ctx.shadowBlur = 6;
  s.ctx.beginPath(); s.ctx.arc(lx, ly, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = led.color as string; s.ctx.fill(); s.ctx.restore();
  s.ctx.font = `500 ${Math.max(5, s.size * 0.03)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = led.color as string; s.ctx.textAlign = 'left';
  s.ctx.textBaseline = 'middle';
  s.ctx.fillText(led.label as string, lx + 7, ly);
}

export function drawTrend(s: GaugeDrawState, c: Record<string, unknown>): void {
  const t = c.trend as Record<string, unknown> | undefined;
  if (!t) return;
  const tx = s.cx + s.radius * 0.25;
  const ty = s.cy + s.radius * 0.38;
  s.ctx.font = `600 ${Math.max(6, s.size * 0.035)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = t.color as string; s.ctx.textAlign = 'right';
  s.ctx.textBaseline = 'middle';
  const arrow = t.direction === 'up' ? '\u25B2' : '\u25BC';
  s.ctx.fillText(arrow + ' ' + (t.delta as string), tx, ty);
}
