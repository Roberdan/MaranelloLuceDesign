/**
 * Maranello Luce Design - Gauge engine complications
 * Crosshair grid and multigraph mini-chart overlays.
 */
import type { GaugeDrawState } from './gauge-engine-draw';
import type { GaugeRenderPalette } from './gauge-engine-palette';
import { cssVar } from './core/utils';

/** Draw crosshair and multigraph complications on the gauge. */
export function drawComplications(
  state: GaugeDrawState, progress: number,
): void {
  const c = state.config as Record<string, unknown>;
  const comp = (c.complications || c) as Record<string, unknown>;
  const { ctx, size } = state;
  const cx = size / 2, cy = size / 2, radius = size * 0.44;
  const P = state.palette;

  if (comp.crosshair) {
    drawCrosshair(ctx, comp.crosshair as Record<string, unknown>,
      cx, cy, radius, size, progress, P, c);
  }

  if (comp.multigraph) {
    drawMultigraph(ctx, comp.multigraph as Record<string, unknown>,
      cx, cy, radius, size, progress, P);
  }
}

function drawCrosshair(
  ctx: CanvasRenderingContext2D, ch: Record<string, unknown>,
  cx: number, cy: number, radius: number, size: number,
  progress: number, P: GaugeRenderPalette,
  cfg: Record<string, unknown>,
): void {
  const gridR = radius * 0.78;

  // Grid lines
  ctx.strokeStyle = (ch.gridColor as string) || '#5a4a20';
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath(); ctx.moveTo(cx - gridR, cy); ctx.lineTo(cx + gridR, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - gridR); ctx.lineTo(cx, cy + gridR); ctx.stroke();
  ctx.globalAlpha = 0.25;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    ctx.beginPath(); ctx.moveTo(cx - gridR, cy - d); ctx.lineTo(cx + gridR, cy - d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - gridR, cy + d); ctx.lineTo(cx + gridR, cy + d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - d, cy - gridR); ctx.lineTo(cx - d, cy + gridR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + d, cy - gridR); ctx.lineTo(cx + d, cy + gridR); ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Scale labels
  const sfs = Math.max(5, size * 0.028);
  ctx.font = `400 ${sfs}px 'Inter', sans-serif`;
  ctx.fillStyle = P.muted;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    const lbl = (i * 0.25).toFixed(2);
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(lbl, cx - gridR - 3, cy - d);
    ctx.fillText(lbl, cx - gridR - 3, cy + d);
  }

  // Axis labels
  const lfs = Math.max(6, size * 0.035);
  ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
  ctx.fillStyle = P.axisLabel;
  ctx.textAlign = 'center';
  if (ch.labelTop) { ctx.textBaseline = 'bottom'; ctx.fillText(ch.labelTop as string, cx, cy - gridR - 4); }
  if (ch.labelBottom) { ctx.textBaseline = 'top'; ctx.fillText(ch.labelBottom as string, cx, cy + gridR + 4); }
  if (ch.labelLeft) { ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(ch.labelLeft as string, cx - gridR - 4, cy); }
  if (ch.labelRight) { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(ch.labelRight as string, cx + gridR + 4, cy); }
  if (ch.title) {
    const tfs = Math.max(6, size * 0.04);
    ctx.font = `600 ${tfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.axisTitle;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(ch.title as string, cx, cy - gridR - lfs - 6);
  }

  // Crosshair dot
  const dotCol = (ch.dotColor as string) || cssVar('--mn-accent');
  const dotX = cx + (ch.x as number) * gridR * progress;
  const dotY = cy + (ch.y as number) * gridR * progress;
  ctx.setLineDash([3, 3]); ctx.strokeStyle = dotCol; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.moveTo(cx - gridR, dotY); ctx.lineTo(cx + gridR, dotY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dotX, cy - gridR); ctx.lineTo(dotX, cy + gridR); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = 1.0;
  ctx.save(); ctx.shadowColor = dotCol; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fillStyle = dotCol; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();

  // Scatter dots
  if (ch.scatterDots) {
    (ch.scatterDots as Array<Record<string, unknown>>).forEach((sd) => {
      const sdx = cx + (sd.x as number) * gridR * progress;
      const sdy = cy + (sd.y as number) * gridR * progress;
      const sdR = (sd.r as number) || 3;
      ctx.save(); ctx.globalAlpha = 0.6 + 0.4 * progress;
      ctx.shadowColor = sd.color as string; ctx.shadowBlur = sdR * 2;
      ctx.beginPath(); ctx.arc(sdx, sdy, sdR, 0, Math.PI * 2);
      ctx.fillStyle = sd.color as string; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.arc(sdx, sdy, sdR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    });
  }

  // Quadrant counts
  if (cfg.quadrantCounts) {
    const qc = cfg.quadrantCounts as Record<string, string>;
    const qfs = Math.max(8, size * 0.05);
    const off = gridR * 0.5;
    ctx.font = `700 ${qfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = 0.25;
    ctx.fillStyle = P.axisLabel; ctx.fillText(qc.tl, cx - off, cy - off);
    ctx.fillStyle = cssVar('--mn-accent'); ctx.fillText(qc.tr, cx + off, cy - off);
    ctx.fillStyle = P.dimmed; ctx.fillText(qc.bl, cx - off, cy + off);
    ctx.fillStyle = P.axisLabel; ctx.fillText(qc.br, cx + off, cy + off);
    ctx.globalAlpha = 1.0;
  }
}

function drawMultigraph(
  ctx: CanvasRenderingContext2D, mg: Record<string, unknown>,
  cx: number, cy: number, radius: number, size: number,
  progress: number, P: GaugeRenderPalette,
): void {
  const data = mg.data as number[];
  const gLeft = cx - radius * 0.65, gRight = cx + radius * 0.65;
  const gTop = cy - radius * 0.15, gBottom = cy + radius * 0.55;
  const gWidth = gRight - gLeft, gHeight = gBottom - gTop;
  const dataMin = Math.min(...data) * 0.8, dataMax = Math.max(...data) * 1.1;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = gTop + (i / 4) * gHeight;
    ctx.beginPath(); ctx.moveTo(gLeft, y); ctx.lineTo(gRight, y); ctx.stroke();
  }

  // Area fill
  const visiblePoints = Math.max(1, Math.ceil(data.length * progress));
  ctx.beginPath(); ctx.moveTo(gLeft, gBottom);
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + (i / (data.length - 1)) * gWidth;
    const y = gBottom - ((data[i] - dataMin) / (dataMax - dataMin)) * gHeight;
    ctx.lineTo(x, y);
  }
  const lastX = gLeft + ((visiblePoints - 1) / (data.length - 1)) * gWidth;
  ctx.lineTo(lastX, gBottom); ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, gTop, 0, gBottom);
  areaGrad.addColorStop(0, (mg.color as string) + '30');
  areaGrad.addColorStop(1, (mg.color as string) + '05');
  ctx.fillStyle = areaGrad; ctx.fill();

  // Line stroke
  ctx.beginPath();
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + (i / (data.length - 1)) * gWidth;
    const y = gBottom - ((data[i] - dataMin) / (dataMax - dataMin)) * gHeight;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = mg.color as string; ctx.lineWidth = 1.8;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();

  // End dot
  if (visiblePoints > 0) {
    const endI = visiblePoints - 1;
    const ex = gLeft + (endI / (data.length - 1)) * gWidth;
    const ey = gBottom - ((data[endI] - dataMin) / (dataMax - dataMin)) * gHeight;
    ctx.save(); ctx.shadowColor = mg.color as string; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fillStyle = mg.color as string; ctx.fill(); ctx.restore();
  }

  if (mg.label) {
    const lfs = Math.max(6, size * 0.035);
    ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.sparkLabel;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(mg.label as string, cx, gTop - 4);
  }
}
