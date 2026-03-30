/**
 * Maranello Luce Design - Gantt chart factory
 * Creates an interactive, canvas-based Gantt timeline.
 */
import type { GanttTask, GanttController, GanttRow } from './core/types';
import { escapeHtml, isValidColor } from './core/sanitize';
import {
  DEFAULTS, getDPR, buildPalette, buildChildPalette, buildRange, buildRows,
  parseDate, daysBetween, contentH, themeColors,
} from './gantt-defaults';
import { renderGrid, renderRows, renderToday, renderHeader, renderSidebar, renderScrollbars } from './gantt-render';
import { attachGanttEvents } from './gantt-events';

/** Create an interactive Gantt chart inside a container element. */
export function gantt(
  container: HTMLElement | null, tasks: GanttTask[], userOpts?: Record<string, unknown>,
): GanttController | null {
  if (!container || !tasks || !tasks.length) return null;

  const o: Record<string, unknown> = { ...DEFAULTS, ...userOpts };
  const pal = (o.palette as Record<string, string>) || buildPalette();
  const cPal = (o.childPalette as Record<string, string>) || buildChildPalette();
  const today = o.today ? parseDate(o.today) as Date : new Date();
  const expanded: Record<string, boolean> = {};
  const range = buildRange(tasks as unknown[]);
  let rows = buildRows(tasks as unknown[], expanded);

  const s: Record<string, unknown> = {
    o, pal, cPal, today, expanded, selected: null,
    hoverRow: -1, scrollX: 0, scrollY: 0, zoom: 1,
    dragging: false, dragSX: 0, dragSY: 0, dragOX: 0, dragOY: 0,
    range, rows, tasks,
    canvas: null, wrap: null, tip: null, container,
    btnZI: null, btnZO: null, btnFit: null,
    ppm: () => (o.basePxPerMonth as number) / (s.zoom as number),
    timelineW: () => (range.months.length * (s.ppm as () => number)()),
    dateToX: (d: Date) => daysBetween(range.min, d) / daysBetween(range.min, range.max) * (s.timelineW as () => number)(),
    render: null, onDocMove: null, onDocUp: null, themeObs: null, resizeObs: null,
    _buildRows: (t: unknown[], exp: Record<string, boolean>) => buildRows(t, exp),
  };

  // DOM setup
  container.innerHTML = '';
  container.classList.add('mn-gantt-timeline');
  const ctrlBar = document.createElement('div');
  ctrlBar.className = 'mn-gantt-timeline__controls';
  const zoomGrp = document.createElement('div');
  zoomGrp.className = 'mn-gantt-timeline__zoom';
  const mkBtn = (label: string, title: string, cls?: string) => {
    const b = document.createElement('button');
    b.className = 'mn-gantt-timeline__zoom-btn' + (cls ? ' ' + cls : '');
    b.textContent = label; b.title = title; return b;
  };
  s.btnZI = mkBtn('\u2212', 'Zoom in (more detail)');
  s.btnZO = mkBtn('+', 'Zoom out (overview)');
  s.btnFit = mkBtn('Fit', 'Fit timeline to view', 'mn-gantt-timeline__zoom-btn--fit');
  zoomGrp.appendChild(s.btnZI as Node);
  zoomGrp.appendChild(s.btnZO as Node);
  zoomGrp.appendChild(s.btnFit as Node);

  const leg = document.createElement('div');
  leg.className = 'mn-gantt-timeline__legend';
  Object.keys(pal).forEach((st) => {
    const span = document.createElement('span');
    span.className = 'mn-gantt-timeline__legend-item';
    const safeCol = isValidColor(pal[st]) ? pal[st] : 'var(--mn-border-strong)';
    span.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:' + safeCol + ';"></span>' + escapeHtml(st);
    leg.appendChild(span);
  });
  const todayLeg = document.createElement('span');
  todayLeg.className = 'mn-gantt-timeline__legend-item';
  todayLeg.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:var(--mn-info);"></span>TODAY';
  leg.appendChild(todayLeg);
  ctrlBar.appendChild(zoomGrp); ctrlBar.appendChild(leg);
  container.appendChild(ctrlBar);

  const wrap = document.createElement('div');
  wrap.className = 'mn-gantt-timeline__canvas-wrap';
  container.appendChild(wrap); s.wrap = wrap;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'grid');
  canvas.setAttribute('aria-label', 'Interactive Gantt timeline. Use arrow keys to navigate, Enter to expand rows.');
  canvas.setAttribute('aria-roledescription', 'gantt chart');
  canvas.setAttribute('tabindex', '0');
  wrap.appendChild(canvas); s.canvas = canvas;
  const tip = document.createElement('div');
  tip.className = 'mn-chart-tooltip mn-gantt-timeline__tip';
  tip.setAttribute('role', 'tooltip'); tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip); s.tip = tip;

  // Render orchestrator
  function render(): void {
    const cr = wrap.getBoundingClientRect();
    const vw = Math.max(cr.width, 400), vh = Math.max(cr.height, 200);
    const dpr = getDPR();
    canvas.width = vw * dpr; canvas.height = vh * dpr;
    canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const lw = o.labelWidth as number, hh = o.headerHeight as number;
    const tw = (s.timelineW as () => number)();
    const ch = contentH(s.rows as GanttRow[], o);
    s.scrollX = Math.max(0, Math.min(s.scrollX as number, Math.max(0, tw - (vw - lw))));
    s.scrollY = Math.max(0, Math.min(s.scrollY as number, Math.max(0, ch - vh)));
    const t = themeColors();
    ctx.fillStyle = t.bg as string; ctx.fillRect(0, 0, vw, vh);
    const snap: Record<string, unknown> = {
      o, pal: s.pal, cPal: s.cPal, today, expanded: s.expanded, selected: s.selected,
      hoverRow: s.hoverRow, scrollX: s.scrollX, scrollY: s.scrollY,
      range: s.range, rows: s.rows, lw, hh, vw, vh, tw, ch, t, ppm: (s.ppm as () => number)(),
      dateToX: s.dateToX,
    };
    ctx.save(); ctx.beginPath(); ctx.rect(lw, hh, vw - lw, vh - hh); ctx.clip();
    renderGrid(ctx, snap); renderRows(ctx, snap); renderToday(ctx, snap);
    ctx.restore();
    renderHeader(ctx, snap); renderSidebar(ctx, snap); renderScrollbars(ctx, snap);
  }
  s.render = render;

  function fitView(vw: number): void {
    const thirtyAgo = new Date(today.getTime() - 30 * 864e5);
    const sixAhead = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    const fitStart = thirtyAgo < range.min ? range.min : thirtyAgo;
    const fitEnd = sixAhead > range.max ? range.max : sixAhead;
    const daysVis = daysBetween(fitStart, fitEnd);
    const totalDays = daysBetween(range.min, range.max);
    if (daysVis > 0 && totalDays > 0) {
      const totalPx = range.months.length * (o.basePxPerMonth as number);
      s.zoom = (daysVis / totalDays) * totalPx / (vw - (o.labelWidth as number));
      s.zoom = Math.max(o.minZoom as number, Math.min(o.maxZoom as number, s.zoom as number));
      s.scrollX = Math.max(0, (s.dateToX as (d: Date) => number)(fitStart));
    }
  }
  s._fitView = fitView;

  attachGanttEvents(s);
  const initVw = wrap.getBoundingClientRect().width || 800;
  if (initVw > 0 && range.months.length > 0) fitView(initVw);
  render();

  return {
    setZoom: (z) => { s.zoom = z; render(); },
    getZoom: () => s.zoom as number,
    expandAll: () => { tasks.forEach((t) => { if (t.children?.length) (s.expanded as Record<string, boolean>)[String(t.id)] = true; }); s.rows = buildRows(tasks as unknown[], s.expanded as Record<string, boolean>); render(); },
    collapseAll: () => { s.expanded = {}; s.rows = buildRows(tasks as unknown[], s.expanded as Record<string, boolean>); render(); },
    setTasks: (nt) => { s.tasks = nt; s.range = buildRange(nt as unknown[]); s.rows = buildRows(nt as unknown[], s.expanded as Record<string, boolean>); render(); },
    select: (id) => { s.selected = id; render(); },
    scrollToToday: () => { const vw = wrap.getBoundingClientRect().width || 800; s.scrollX = (s.dateToX as (d: Date) => number)(today) - (vw - (o.labelWidth as number)) / 2; render(); },
    render,
    destroy: () => { document.removeEventListener('mousemove', s.onDocMove as EventListener); document.removeEventListener('mouseup', s.onDocUp as EventListener); if (s.themeObs) (s.themeObs as MutationObserver).disconnect(); if (s.resizeObs) (s.resizeObs as ResizeObserver).disconnect(); container.innerHTML = ''; if (tip.parentNode) tip.parentNode.removeChild(tip); },
  };
}
