/**
 * Maranello Luce Design - Gantt defaults, palettes, and layout utilities
 */
import type { GanttDefaults, GanttPalette, GanttRow, GanttTask } from './core/types';
import { cssVar } from './core/utils';

export function getDPR(): number {
  return typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
}
export const MS_DAY = 864e5;

export const DEFAULTS: GanttDefaults = {
  labelWidth: 240, rowHeight: 38, childRowHeight: 30, headerHeight: 56,
  barHeight: 20, childBarHeight: 14, barRadius: 3, basePxPerMonth: 100,
  minZoom: 0.25, maxZoom: 5, defaultZoom: 1, zoomStep: 0.15,
  showToday: true, showGrid: true, showProgress: true,
  today: null, palette: null, childPalette: null,
  onSelect: null, onExpand: null, onClick: null,
};

export function hexLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function textOnBg(hex: string): string {
  return hexLuminance(hex) > 0.35 ? '#111' : '#fff';
}

export function buildPalette(): Record<string, string> {
  return {
    'Stage 1': cssVar('--stage-1', '#FFC72C'),
    'Stage 2': cssVar('--stage-2', '#FFC72C'),
    'Stage 3': cssVar('--stage-3', '#4EA8DE'),
    'Stage 4': cssVar('--stage-4', '#0891B2'),
    'On Hold': cssVar('--stage-onhold', '#D4622B'),
    Withdrawn: cssVar('--stage-withdrawn', '#374151'),
    Completed: cssVar('--stage-completed', '#6B7280'),
  };
}

export function buildChildPalette(): Record<string, string> {
  return {
    Active: cssVar('--activity-active', '#00A651'),
    Planned: cssVar('--activity-planned', '#F59E0B'),
    Closed: cssVar('--activity-closed', '#6B7280'),
  };
}

export function buildSeverity(): Record<string, { fg: string; bg: string; icon: string }> {
  return {
    critical: { fg: cssVar('--severity-critical-fg', '#fca5a5'), bg: cssVar('--severity-critical-bg', '#7f1d1d'), icon: '\u25B2' },
    high: { fg: cssVar('--severity-high-fg', '#fed7aa'), bg: cssVar('--severity-high-bg', '#7c2d12'), icon: '\u25B2' },
    warning: { fg: cssVar('--severity-warning-fg', '#fde68a'), bg: cssVar('--severity-warning-bg', '#78350f'), icon: '\u25B2' },
    resourcing: { fg: cssVar('--severity-resourcing-fg', '#bfdbfe'), bg: cssVar('--severity-resourcing-bg', '#1e3a5f'), icon: '\u25CF' },
  };
}

export function themeColors(): Record<string, unknown> {
  const cl = document.body.classList;
  const isLight = cl.contains('mn-avorio') || cl.contains('mn-sugar');
  const isSugar = cl.contains('mn-sugar');
  const surface = cssVar('--mn-surface', isLight ? '#faf8f2' : '#0a0a0a');
  const text = cssVar('--mn-text', isLight ? '#1a1a1a' : '#e0e0e0');
  const muted = cssVar('--mn-text-muted', isLight ? '#666' : '#888');
  const border = cssVar('--mn-border', isLight ? 'rgba(0,0,0,0.08)' : 'rgba(200,200,200,0.08)');
  const headerBg = isSugar ? 'rgba(216,216,220,0.98)'
    : isLight ? 'rgba(245,242,235,0.98)' : 'rgba(18,18,18,0.98)';
  const sidebarBg = isSugar ? 'rgba(216,216,220,0.95)'
    : isLight ? 'rgba(245,242,235,0.95)' : 'rgba(14,14,14,0.97)';
  return {
    bg: surface, text, muted, border, headerBg, sidebarBg,
    rowHover: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.12)',
    rowSel: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.18)',
    childBg: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
    rowAlt: isLight ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.02)',
    isLight,
  };
}

// --- Date utilities ---
export const MONTH_FULL = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
export const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'];

export function parseDate(s: unknown): Date | null {
  if (!s) return null;
  if (s instanceof Date) return s;
  const d = new Date(s as string);
  return isNaN(d.getTime()) ? null : d;
}

export function monthStart(d: Date): Date { return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)); }
export function addMonths(d: Date, n: number): Date { return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)); }
export function daysBetween(a: Date, b: Date): number { return (b.getTime() - a.getTime()) / MS_DAY; }
export function fmtDateFull(d: Date | null): string { return d ? d.getUTCDate() + ' ' + MONTH_FULL[d.getUTCMonth()] + ' ' + d.getUTCFullYear() : '?'; }
export function fmtDateShort(d: Date | null): string { return d ? d.getUTCDate() + ' ' + MONTH_ABBR[d.getUTCMonth()] : ''; }

export function getScale(ppm: number): { scale: string; primaryType: string } {
  if (ppm >= 200) return { scale: 'week', primaryType: 'month' };
  if (ppm >= 60) return { scale: 'month', primaryType: 'year' };
  if (ppm >= 30) return { scale: 'monthAbbr', primaryType: 'year' };
  return { scale: 'quarter', primaryType: 'year' };
}

// --- Layout utilities ---
export function buildRows(tasks: unknown[], expanded: Record<string, boolean>): GanttRow[] {
  const rows: GanttRow[] = [];
  tasks.forEach((t: unknown) => {
    const task = t as GanttTask;
    const children = (task as Record<string, unknown>).children as unknown[] | undefined;
    rows.push({ type: 'parent', task, hasChildren: !!(children && children.length) });
    if (expanded[task.id as string] && children) {
      children.forEach((c: unknown) => { rows.push({ type: 'child', task: c as GanttTask, parent: task }); });
    }
  });
  return rows;
}

export function rowY(idx: number, rows: GanttRow[], o: Record<string, unknown>): number {
  let y = o.headerHeight as number;
  for (let i = 0; i < idx; i++) y += rows[i].type === 'child' ? (o.childRowHeight as number) : (o.rowHeight as number);
  return y;
}

export function contentH(rows: GanttRow[], o: Record<string, unknown>): number {
  let h = o.headerHeight as number;
  rows.forEach((r) => { h += r.type === 'child' ? (o.childRowHeight as number) : (o.rowHeight as number); });
  return h;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  if (w <= 0 || h <= 0) return;
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
}

export function truncText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  while (text.length > 1 && ctx.measureText(text + '\u2026').width > maxW) text = text.slice(0, -1);
  return text + '\u2026';
}

export function buildRange(tasks: unknown[]): { min: Date; max: Date; months: Array<{ date: Date; month: number; year: number }> } {
  let lo = Infinity, hi = -Infinity;
  tasks.forEach((t: unknown) => {
    const task = t as Record<string, unknown>;
    const s = parseDate(task.start), e = parseDate(task.end);
    if (s) lo = Math.min(lo, s.getTime());
    if (e) hi = Math.max(hi, e.getTime());
    const children = task.children as unknown[] | undefined;
    if (children) children.forEach((c: unknown) => {
      const ct = c as Record<string, unknown>;
      const cs = parseDate(ct.start), ce = parseDate(ct.end);
      if (cs) lo = Math.min(lo, cs.getTime());
      if (ce) hi = Math.max(hi, ce.getTime());
    });
  });
  const rangeMin = addMonths(monthStart(new Date(lo)), -1);
  const rangeMax = addMonths(monthStart(new Date(hi)), 2);
  const months: Array<{ date: Date; month: number; year: number }> = [];
  let cur = new Date(rangeMin);
  while (cur < rangeMax) {
    months.push({ date: new Date(cur), month: cur.getUTCMonth(), year: cur.getUTCFullYear() });
    cur = addMonths(cur, 1);
  }
  return { min: rangeMin, max: rangeMax, months };
}

export function buildYearSpans(months: Array<{ date: Date }>): Array<{ year: number; s: number; e: number }> {
  const spans: Array<{ year: number; s: number; e: number }> = [];
  if (!months.length) return spans;
  let curYear = months[0].date.getUTCFullYear(), start = 0;
  for (let i = 1; i < months.length; i++) {
    const yr = months[i].date.getUTCFullYear();
    if (yr !== curYear) { spans.push({ year: curYear, s: start, e: i }); start = i; curYear = yr; }
  }
  spans.push({ year: curYear, s: start, e: months.length });
  return spans;
}
