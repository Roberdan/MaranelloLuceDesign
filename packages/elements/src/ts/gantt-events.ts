/**
 * Maranello Luce Design - Gantt event handlers
 * Mouse, keyboard, wheel, resize, and theme-change events for the gantt chart.
 */
import type { GanttRow } from './core/types';
import { cssVar, escapeHtml } from './core/utils';
import {
  parseDate, daysBetween, fmtDateFull,
  buildPalette, buildChildPalette, buildSeverity,
  rowY,
} from './gantt-defaults';

type GanttState = Record<string, unknown>;

function canvasXY(canvas: HTMLCanvasElement, e: MouseEvent): { x: number; y: number } {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function hitTest(s: GanttState, mx: number, my: number): Record<string, unknown> {
  const o = s.o as Record<string, unknown>;
  const lw = o.labelWidth as number, hh = o.headerHeight as number;
  const rows = s.rows as GanttRow[];
  if (my < hh) return { zone: 'header' };
  for (let i = 0; i < rows.length; i++) {
    const ry = rowY(i, rows, o) - (s.scrollY as number);
    const rh = rows[i].type === 'child' ? (o.childRowHeight as number) : (o.rowHeight as number);
    if (my < ry || my >= ry + rh) continue;
    if (mx < lw) {
      const isChev = rows[i].type === 'parent' && rows[i].hasChildren && mx < 20;
      return { zone: 'sidebar', ri: i, row: rows[i], isChevron: isChev };
    }
    const task = rows[i].task as Record<string, unknown>;
    const sd = parseDate(task.start), ed = parseDate(task.end);
    if (sd && ed) {
      const dateToX = s.dateToX as (d: Date) => number;
      const bx = lw + dateToX(sd) - (s.scrollX as number);
      const bw = dateToX(ed) - dateToX(sd);
      if (mx >= bx && mx <= bx + bw) return { zone: 'bar', ri: i, row: rows[i] };
    }
    return { zone: 'timeline', ri: i, row: rows[i] };
  }
  return { zone: 'empty' };
}

function rowIdx(rows: GanttRow[], id: unknown): number {
  for (let i = 0; i < rows.length; i++) { if ((rows[i].task as Record<string, unknown>).id === id) return i; }
  return -1;
}

function showTip(s: GanttState, hit: Record<string, unknown>, clientX: number, clientY: number): void {
  if (!hit.row) return;
  const row = hit.row as GanttRow;
  const task = row.task as Record<string, unknown>;
  const isChild = row.type === 'child';
  const pal = s.pal as Record<string, string>, cPal = s.cPal as Record<string, string>;
  const col = isChild ? (cPal[task.state as string] || cssVar('--stage-completed', '#6B7280')) : (pal[task.state as string] || cssVar('--stage-completed', '#6B7280'));
  const sd = parseDate(task.start), ed = parseDate(task.end);
  const dur = (sd && ed) ? Math.round(daysBetween(sd, ed)) : null;
  let h = '<div class="mn-chart-tooltip__label">' + escapeHtml(String(task.title ?? '')) + '</div>';
  if (task.account) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">' + escapeHtml(String(task.account)) + '</div>';
  h += '<div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;">';
  h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">Start: <b style="color:var(--mn-border-strong);">' + fmtDateFull(sd) + '</b></span>';
  h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">End: <b style="color:var(--mn-border-strong);">' + fmtDateFull(ed) + '</b></span>';
  if (dur !== null) h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">Duration: ' + dur + ' days</span>';
  h += '</div><div style="display:flex;align-items:center;gap:4px;margin-top:3px;">';
  h += '<span class="mn-chart-tooltip__dot" style="background:' + col + ';"></span>';
  h += '<span style="color:' + col + ';font-size:0.65rem;">' + escapeHtml(String(task.state ?? 'Unknown')) + '</span></div>';
  if (task.progress !== undefined && !isChild) h += '<div style="color:var(--mn-accent);font-size:0.65rem;margin-top:2px;">' + Math.round((task.progress as number) * 100) + '% complete</div>';
  if (isChild && task.owner) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;margin-top:2px;">Owner: ' + escapeHtml(String(task.owner)) + '</div>';
  if (isChild && task.type) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">Type: ' + escapeHtml(String(task.type)) + '</div>';
  const tip = s.tip as HTMLDivElement;
  tip.innerHTML = h; tip.classList.add('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'true');
  let left = clientX + 12, top = clientY - tip.offsetHeight - 12;
  if (left + 200 > window.innerWidth) left = clientX - 200 - 12;
  if (top < 10) top = clientY + 12;
  tip.style.position = 'fixed'; tip.style.left = left + 'px'; tip.style.top = top + 'px';
}

function hideTip(s: GanttState): void {
  const tip = s.tip as HTMLDivElement;
  tip.classList.remove('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'true');
}

/** Attach all interactive event handlers to the gantt state object. */
export function attachGanttEvents(s: GanttState): void {
  const canvas = s.canvas as HTMLCanvasElement;
  const buildRows = s._buildRows as (tasks: unknown[], expanded: Record<string, boolean>) => GanttRow[];
  const render = s.render as () => void;
  const o = s.o as Record<string, unknown>;

  canvas.addEventListener('mousemove', (e) => {
    const p = canvasXY(canvas, e); const hit = hitTest(s, p.x, p.y);
    const newHover = hit.ri !== undefined ? hit.ri as number : -1;
    if (newHover !== (s.hoverRow as number)) { s.hoverRow = newHover; render(); }
    canvas.style.cursor = (hit.zone === 'bar' || hit.isChevron) ? 'pointer' : hit.zone === 'timeline' ? 'grab' : 'default';
    if (hit.zone === 'bar') showTip(s, hit, e.clientX, e.clientY); else hideTip(s);
  });
  canvas.addEventListener('mouseleave', () => { s.hoverRow = -1; hideTip(s); render(); });
  canvas.addEventListener('click', (e) => {
    const p = canvasXY(canvas, e); const hit = hitTest(s, p.x, p.y);
    if (hit.isChevron && hit.row) { toggleExpand(s, hit, buildRows, render); return; }
    if (hit.zone === 'sidebar' && hit.row && (hit.row as GanttRow).type === 'parent' && (hit.row as GanttRow).hasChildren) { toggleExpand(s, hit, buildRows, render); return; }
    if (hit.row) { s.selected = ((hit.row as GanttRow).task as Record<string, unknown>).id; render(); if (hit.zone === 'bar' && o.onClick) (o.onClick as Function)((hit.row as GanttRow).task, (hit.row as GanttRow).type); if (o.onSelect) (o.onSelect as Function)((hit.row as GanttRow).task, (hit.row as GanttRow).type); }
  });
  canvas.addEventListener('mousedown', (e) => {
    const p = canvasXY(canvas, e); const hit = hitTest(s, p.x, p.y);
    if (hit.zone === 'timeline' || hit.zone === 'header' || hit.zone === 'empty') { s.dragging = true; s.dragSX = e.clientX; s.dragSY = e.clientY; s.dragOX = s.scrollX; s.dragOY = s.scrollY; canvas.style.cursor = 'grabbing'; }
  });
  const onDocMove = (e: MouseEvent) => { if (!(s.dragging as boolean)) return; s.scrollX = (s.dragOX as number) - (e.clientX - (s.dragSX as number)); s.scrollY = (s.dragOY as number) - (e.clientY - (s.dragSY as number)); render(); };
  const onDocUp = () => { s.dragging = false; };
  document.addEventListener('mousemove', onDocMove); document.addEventListener('mouseup', onDocUp);
  s.onDocMove = onDocMove; s.onDocUp = onDocUp;
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? (o.zoomStep as number) : -(o.zoomStep as number);
      const old = s.zoom as number;
      s.zoom = Math.max(o.minZoom as number, Math.min(o.maxZoom as number, (s.zoom as number) + delta));
      const p = canvasXY(canvas, e); const tlx = p.x - (o.labelWidth as number) + (s.scrollX as number);
      const months = ((s.range as Record<string, unknown>).months as unknown[]);
      const ratio = tlx / (months.length * ((o.basePxPerMonth as number) / old));
      s.scrollX = ratio * months.length * (s.ppm as () => number)() - (p.x - (o.labelWidth as number));
    } else { s.scrollX = (s.scrollX as number) + (e.shiftKey ? e.deltaY : e.deltaX); s.scrollY = (s.scrollY as number) + (e.shiftKey ? 0 : e.deltaY); }
    render();
  }, { passive: false });
  (s.btnZI as HTMLButtonElement).addEventListener('click', () => { s.zoom = Math.max(o.minZoom as number, (s.zoom as number) - (o.zoomStep as number) * 2); render(); });
  (s.btnZO as HTMLButtonElement).addEventListener('click', () => { s.zoom = Math.min(o.maxZoom as number, (s.zoom as number) + (o.zoomStep as number) * 2); render(); });
  (s.btnFit as HTMLButtonElement).addEventListener('click', () => { if (typeof s._fitView === 'function') (s._fitView as (w: number) => void)((s.wrap as HTMLDivElement).getBoundingClientRect().width || 800); render(); });
  const SCROLL_STEP = 40;
  canvas.addEventListener('keydown', (e) => {
    const rows = s.rows as GanttRow[]; let idx: number;
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = rowIdx(rows, s.selected); if (idx < rows.length - 1) { s.selected = (rows[idx + 1].task as Record<string, unknown>).id; render(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = rowIdx(rows, s.selected); if (idx > 0) { s.selected = (rows[idx - 1].task as Record<string, unknown>).id; render(); } }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); s.scrollX = Math.max(0, (s.scrollX as number) - SCROLL_STEP); render(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); s.scrollX = (s.scrollX as number) + SCROLL_STEP; render(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const r = rows.find((r) => (r.task as Record<string, unknown>).id === s.selected); if (r && r.type === 'parent' && r.hasChildren) { const exp = s.expanded as Record<string, boolean>; const sid = s.selected as string; if (exp[sid]) delete exp[sid]; else exp[sid] = true; s.rows = buildRows(s.tasks as unknown[], exp); render(); } }
    else if (e.key === 'Escape') { s.selected = null; render(); }
  });
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => render());
    ro.observe(s.wrap as HTMLElement);
    s.resizeObs = ro;
  }
  const themeObs = new MutationObserver(() => { s.pal = buildPalette(); s.cPal = buildChildPalette(); render(); });
  themeObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  s.themeObs = themeObs;
}

function toggleExpand(s: GanttState, hit: Record<string, unknown>, buildRows: (tasks: unknown[], exp: Record<string, boolean>) => GanttRow[], render: () => void): void {
  const o = s.o as Record<string, unknown>;
  const row = hit.row as GanttRow;
  const id = String((row.task as Record<string, unknown>).id);
  const exp = s.expanded as Record<string, boolean>;
  if (exp[id]) delete exp[id]; else exp[id] = true;
  s.rows = buildRows(s.tasks as unknown[], exp); render();
  if (o.onExpand) (o.onExpand as Function)((row.task as Record<string, unknown>), !!exp[id]);
}
