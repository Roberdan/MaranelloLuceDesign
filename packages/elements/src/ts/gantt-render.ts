/**
 * Maranello Luce Design - Gantt canvas rendering (grid, rows, header, sidebar)
 */
import type { GanttRow } from './core/types';
import { cssVar } from './core/utils';
import {
  getScale, parseDate, daysBetween, fmtDateShort, fmtDateFull,
  MONTH_FULL, MONTH_ABBR, buildYearSpans, buildSeverity,
  roundRect, truncText, textOnBg, rowY,
} from './gantt-defaults';

type Snap = Record<string, unknown>;

/** Render grid lines adapted to current scale. */
export function renderGrid(ctx: CanvasRenderingContext2D, s: Snap): void {
  const sc = getScale(s.ppm as number);
  if (!(s.o as Snap).showGrid) return;
  const months = (s.range as Snap).months as Array<{ month: number }>;
  const lw = s.lw as number, hh = s.hh as number, vw = s.vw as number, vh = s.vh as number;
  const ppm = s.ppm as number, scrollX = s.scrollX as number;
  const t = s.t as Snap;
  ctx.lineWidth = 0.5;

  if (sc.scale === 'quarter') {
    months.forEach((m, i) => {
      if (m.month % 3 !== 0) return;
      const x = lw + i * ppm - scrollX;
      if (x >= lw - 1 && x <= vw) { ctx.strokeStyle = t.border as string; ctx.beginPath(); ctx.moveTo(x, hh); ctx.lineTo(x, vh); ctx.stroke(); }
    });
  } else if (sc.scale === 'week') {
    months.forEach((m, i) => {
      const mx = lw + i * ppm - scrollX;
      if (mx >= lw - 1 && mx <= vw) { ctx.strokeStyle = (t.text as string) + '18'; ctx.beginPath(); ctx.moveTo(mx, hh); ctx.lineTo(mx, vh); ctx.stroke(); }
      const weekPx = ppm / 4.33;
      for (let w = 1; w < 4; w++) { const wx = mx + w * weekPx; if (wx >= lw && wx <= vw) { ctx.strokeStyle = t.border as string; ctx.beginPath(); ctx.moveTo(wx, hh); ctx.lineTo(wx, vh); ctx.stroke(); } }
    });
  } else {
    months.forEach((m, i) => {
      const x = lw + i * ppm - scrollX;
      if (x < lw - 1 || x > vw) return;
      const isYB = m.month === 0;
      ctx.strokeStyle = isYB ? (t.text as string) + '20' : (t.border as string);
      ctx.lineWidth = isYB ? 1 : 0.5;
      ctx.beginPath(); ctx.moveTo(x, hh); ctx.lineTo(x, vh); ctx.stroke();
      ctx.lineWidth = 0.5;
    });
  }
}

/** Render row backgrounds, bars, labels. */
export function renderRows(ctx: CanvasRenderingContext2D, s: Snap): void {
  const rows = s.rows as GanttRow[];
  const o = s.o as Snap, t = s.t as Snap;
  const lw = s.lw as number, vw = s.vw as number, hh = s.hh as number, vh = s.vh as number;
  const scrollX = s.scrollX as number, scrollY = s.scrollY as number;
  const pal = s.pal as Record<string, string>, cPal = s.cPal as Record<string, string>;
  const dateToX = s.dateToX as (d: Date) => number;

  rows.forEach((row, ri) => {
    const ry = rowY(ri, rows, o as unknown as Record<string, unknown>) - scrollY;
    const rh = row.type === 'child' ? (o.childRowHeight as number) : (o.rowHeight as number);
    if (ry + rh < hh || ry > vh) return;
    if (row.type === 'child') { ctx.fillStyle = t.childBg as string; ctx.fillRect(lw, ry, vw - lw, rh); }
    else if (ri % 2 === 1) { ctx.fillStyle = t.rowAlt as string; ctx.fillRect(lw, ry, vw - lw, rh); }
    if (ri === (s.hoverRow as number)) { ctx.fillStyle = t.rowHover as string; ctx.fillRect(lw, ry, vw - lw, rh); }
    if ((s.selected as string) === (row.task.id as string)) { ctx.fillStyle = t.rowSel as string; ctx.fillRect(lw, ry, vw - lw, rh); }
    ctx.strokeStyle = t.border as string; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(lw, ry + rh); ctx.lineTo(vw, ry + rh); ctx.stroke();
    const task = row.task as Record<string, unknown>;
    const sd = parseDate(task.start), ed = parseDate(task.end);
    if (!sd || !ed) return;
    const bx = lw + dateToX(sd) - scrollX;
    const bw = dateToX(ed) - dateToX(sd);
    const bh = row.type === 'child' ? (o.childBarHeight as number) : (o.barHeight as number);
    const by = ry + (rh - bh) / 2;
    const color = row.type === 'child'
      ? (cPal[(task.state as string)] || cssVar('--stage-completed', '#6B7280'))
      : (pal[(task.state as string)] || cssVar('--stage-completed', '#6B7280'));
    if (bx + bw <= lw || bx >= vw) return;
    const cx1 = Math.max(bx, lw), cx2 = Math.min(bx + bw, vw), cw = cx2 - cx1;
    ctx.fillStyle = color; roundRect(ctx, cx1, by, cw, bh, o.barRadius as number); ctx.fill();
    if ((o.showProgress as boolean) && (task.progress as number) > 0 && row.type === 'parent') {
      const pw = Math.min(bx + bw * Math.min(task.progress as number, 1), vw) - cx1;
      if (pw > 0) { ctx.fillStyle = 'rgba(255,255,255,0.18)'; roundRect(ctx, cx1, by, Math.max(pw, 0), bh, o.barRadius as number); ctx.fill(); }
    }
    if (cw > 50) {
      const btc = textOnBg(color);
      ctx.fillStyle = btc; ctx.font = '700 ' + (row.type === 'child' ? 9 : 11) + 'px "Barlow Condensed", "Inter", sans-serif';
      ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      ctx.save(); ctx.shadowColor = btc === '#111' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
      if (cw > 200 && row.type === 'parent') {
        const ds = fmtDateShort(sd) + ' \u2013 ' + fmtDateShort(ed);
        const tw = ctx.measureText(task.title as string).width;
        ctx.fillText(truncText(ctx, task.title as string, cw - 12), cx1 + 6, by + bh / 2);
        ctx.font = '400 9px "Barlow Condensed","Inter",sans-serif'; ctx.fillStyle = btc === '#111' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'right'; if (tw + ctx.measureText(ds).width + 24 < cw) ctx.fillText(ds, cx2 - 6, by + bh / 2);
        ctx.textAlign = 'left';
      } else { ctx.fillText(truncText(ctx, task.title as string, cw - 12), cx1 + 6, by + bh / 2); }
      if (cw > 120 && row.type === 'parent') {
        ctx.fillStyle = btc === '#111' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)';
        ctx.fillRect(cx1, by, 1.5, bh); ctx.fillRect(cx2 - 1.5, by, 1.5, bh);
      }
      ctx.restore();
    }
  });
}

/** Render TODAY vertical marker. */
export function renderToday(ctx: CanvasRenderingContext2D, s: Snap): void {
  if (!(s.o as Snap).showToday) return;
  const tx = (s.lw as number) + (s.dateToX as (d: Date) => number)(s.today as Date) - (s.scrollX as number);
  if (tx >= (s.lw as number) && tx <= (s.vw as number)) {
    ctx.strokeStyle = cssVar('--mn-info'); ctx.lineWidth = 1.5; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(tx, s.hh as number); ctx.lineTo(tx, s.vh as number); ctx.stroke();
  }
}

/** Render two-tier adaptive header. */
export function renderHeader(ctx: CanvasRenderingContext2D, s: Snap): void {
  const sc = getScale(s.ppm as number);
  const hh = s.hh as number, lw = s.lw as number, vw = s.vw as number;
  const ppm = s.ppm as number, scrollX = s.scrollX as number, t = s.t as Snap;
  const tierH = hh / 2;
  const months = (s.range as Snap).months as Array<{ date: Date; month: number; year: number }>;
  ctx.fillStyle = t.headerBg as string; ctx.fillRect(0, 0, vw, hh);
  ctx.strokeStyle = t.border as string; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(lw, tierH); ctx.lineTo(vw, tierH); ctx.stroke();
  ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, hh); ctx.lineTo(vw, hh); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(lw, 0, vw - lw, hh); ctx.clip();
  if (sc.primaryType === 'year') {
    buildYearSpans(months).forEach((span) => {
      const x1 = lw + span.s * ppm - scrollX, x2 = lw + span.e * ppm - scrollX;
      const sx = Math.max(x1, lw), ex = Math.min(x2, vw);
      if (ex <= sx) return;
      if (x1 > lw) { ctx.strokeStyle = (t.text as string) + '25'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, tierH); ctx.stroke(); }
      ctx.fillStyle = t.text as string; ctx.font = '700 13px "Barlow Condensed","Inter",sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      if (ctx.measureText(String(span.year)).width < (ex - sx - 8)) ctx.fillText(String(span.year), (sx + ex) / 2, tierH / 2);
      ctx.textAlign = 'left';
    });
  } else {
    months.forEach((m, i) => {
      const x1 = lw + i * ppm - scrollX, x2 = lw + (i + 1) * ppm - scrollX;
      const sx = Math.max(x1, lw), ex = Math.min(x2, vw);
      if (ex <= sx) return;
      if (x1 > lw) { ctx.strokeStyle = (t.text as string) + '20'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1, tierH); ctx.stroke(); }
      ctx.fillStyle = t.text as string; ctx.font = '600 11px "Barlow Condensed","Inter",sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText(truncText(ctx, MONTH_FULL[m.month] + ' ' + m.year, ex - sx - 8), (sx + ex) / 2, tierH / 2);
      ctx.textAlign = 'left';
    });
  }
  renderTier2(ctx, sc.scale, months, lw, vw, ppm, scrollX, tierH, hh, t);
  if ((s.o as Snap).showToday) {
    const tbx = lw + (s.dateToX as (d: Date) => number)(s.today as Date) - scrollX;
    if (tbx >= lw - 24 && tbx <= vw + 24) {
      ctx.fillStyle = cssVar('--mn-info'); roundRect(ctx, tbx - 24, tierH + (tierH - 18) / 2, 48, 18, 3); ctx.fill();
      ctx.fillStyle = '#111'; ctx.font = 'bold 9px "Barlow Condensed",sans-serif'; ctx.textAlign = 'center'; ctx.fillText('TODAY', tbx, tierH + tierH / 2);
      ctx.textAlign = 'left';
    }
  }
  ctx.restore();
}

function renderTier2(
  ctx: CanvasRenderingContext2D, scale: string,
  months: Array<{ month: number }>,
  lw: number, vw: number, ppm: number, scrollX: number,
  tierH: number, hh: number, t: Snap,
): void {
  months.forEach((m, i) => {
    const x = lw + i * ppm - scrollX;
    const sx = Math.max(x, lw), ex = Math.min(x + ppm, vw);
    if (ex <= sx) return;
    if (scale === 'quarter' && m.month % 3 !== 0) return;
    if (x > lw) { ctx.strokeStyle = t.border as string; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(x, tierH); ctx.lineTo(x, hh); ctx.stroke(); }
    ctx.fillStyle = t.muted as string; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    if (scale === 'quarter') { ctx.font = '500 10px "Barlow Condensed","Inter",sans-serif'; ctx.fillText('Q' + (Math.floor(m.month / 3) + 1), (sx + ex) / 2, tierH + tierH / 2); }
    else if (scale === 'monthAbbr') { ctx.font = '500 10px "Barlow Condensed","Inter",sans-serif'; if (ctx.measureText(MONTH_ABBR[m.month]).width < (ex - sx - 4)) ctx.fillText(MONTH_ABBR[m.month], (sx + ex) / 2, tierH + tierH / 2); }
    else if (scale === 'month') { ctx.font = '500 11px "Barlow Condensed","Inter",sans-serif'; ctx.fillText(truncText(ctx, MONTH_FULL[m.month], ex - sx - 6), (sx + ex) / 2, tierH + tierH / 2); }
    else if (scale === 'week') {
      const weekPx = ppm / 4.33;
      for (let w = 0; w < 4; w++) { const wx = x + w * weekPx; const wsx = Math.max(wx, lw), wex = Math.min(wx + weekPx, vw); if (wex <= wsx) continue; if (w > 0 && wx > lw) { ctx.strokeStyle = t.border as string; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(wx, tierH); ctx.lineTo(wx, hh); ctx.stroke(); } ctx.font = '400 9px "Barlow Condensed","Inter",sans-serif'; ctx.fillText('W' + (w + 1), (wsx + wex) / 2, tierH + tierH / 2); }
    }
    ctx.textAlign = 'left';
  });
}

/** Render sidebar labels, chevrons, badges. */
export function renderSidebar(ctx: CanvasRenderingContext2D, s: Snap): void {
  const rows = s.rows as GanttRow[], o = s.o as Snap, t = s.t as Snap;
  const lw = s.lw as number, hh = s.hh as number, vh = s.vh as number;
  const scrollY = s.scrollY as number;
  const pal = s.pal as Record<string, string>;
  const SEVERITY = buildSeverity();
  ctx.fillStyle = t.sidebarBg as string; ctx.fillRect(0, hh, lw, vh - hh);
  ctx.strokeStyle = t.border as string; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(lw, 0); ctx.lineTo(lw, vh); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(0, hh, lw, vh - hh); ctx.clip();
  rows.forEach((row, ri) => {
    const ry = rowY(ri, rows, o as unknown as Record<string, unknown>) - scrollY;
    const rh = row.type === 'child' ? (o.childRowHeight as number) : (o.rowHeight as number);
    if (ry + rh < hh || ry > vh) return;
    if (ri === (s.hoverRow as number)) { ctx.fillStyle = t.rowHover as string; ctx.fillRect(0, ry, lw, rh); }
    if ((s.selected as string) === ((row.task as Record<string, unknown>).id as string)) { ctx.fillStyle = t.rowSel as string; ctx.fillRect(0, ry, lw, rh); }
    ctx.strokeStyle = t.border as string; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, ry + rh); ctx.lineTo(lw, ry + rh); ctx.stroke();
    const task = row.task as Record<string, unknown>;
    if (row.type === 'parent') {
      let tx0 = 22;
      if (row.hasChildren) { ctx.fillStyle = t.muted as string; ctx.font = '10px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText((s.expanded as Record<string, boolean>)[String(task.id)] ? '\u25BC' : '\u25B6', 6, ry + rh / 2); }
      else { ctx.fillStyle = t.border as string; ctx.beginPath(); ctx.arc(12, ry + rh / 2, 2, 0, Math.PI * 2); ctx.fill(); }
      const stateColor = pal[(task.state as string)] || cssVar('--stage-completed', '#6B7280');
      ctx.fillStyle = stateColor; ctx.fillRect(tx0, ry + 6, 3, rh - 12); tx0 += 8;
      let bx = lw - 8;
      const badges = task.badges as Record<string, unknown> | undefined;
      if (badges?.missing6q) { bx -= 24; ctx.fillStyle = cssVar('--signal-danger', '#DC0000'); roundRect(ctx, bx, ry + (rh - 14) / 2, 22, 14, 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = 'bold 8px "Barlow Condensed",sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText('6Q', bx + 4, ry + rh / 2); bx -= 4; }
      if (badges?.severity) { const sev = SEVERITY[badges.severity as string]; if (sev) { bx -= 14; ctx.fillStyle = sev.fg; ctx.font = '10px sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText(sev.icon, bx + 2, ry + rh / 2); bx -= 4; } }
      ctx.fillStyle = t.text as string; ctx.font = '600 11px "Barlow Condensed","Inter",sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      ctx.fillText(truncText(ctx, ((task.account as string) || (task.title as string)), bx - tx0 - 4), tx0, ry + rh / 2);
    } else {
      ctx.fillStyle = t.muted as string; ctx.font = '10px "Inter",sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      let clbl = task.title as string; if (task.type) clbl = (task.type as string) + ' \u2013 ' + clbl;
      ctx.fillText(truncText(ctx, clbl, lw - 44), 36, ry + rh / 2);
    }
  });
  ctx.restore();
  ctx.fillStyle = t.headerBg as string; ctx.fillRect(0, 0, lw, hh);
}

/** Render scroll indicators. */
export function renderScrollbars(ctx: CanvasRenderingContext2D, s: Snap): void {
  const lw = s.lw as number, vw = s.vw as number, vh = s.vh as number, hh = s.hh as number;
  const tw = s.tw as number, ch = s.ch as number;
  const scrollX = s.scrollX as number, scrollY = s.scrollY as number;
  const msx = Math.max(0, tw - (vw - lw)), msy = Math.max(0, ch - vh);
  if (msx > 0) { const sbW = Math.max(30, (vw - lw) * ((vw - lw) / tw)); const sbX = lw + (scrollX / msx) * (vw - lw - sbW); ctx.fillStyle = 'rgba(200,200,200,0.2)'; roundRect(ctx, sbX, vh - 5, sbW, 4, 2); ctx.fill(); }
  if (msy > 0) { const sbH = Math.max(30, (vh - hh) * ((vh - hh) / ch)); const sbYp = hh + (scrollY / msy) * (vh - hh - sbH); ctx.fillStyle = 'rgba(200,200,200,0.2)'; roundRect(ctx, vw - 5, sbYp, 4, sbH, 2); ctx.fill(); }
}
