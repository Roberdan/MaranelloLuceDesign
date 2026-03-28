import type { DataTableColumn } from './core/types';
import { sanitizeHtml, escapeHtml, isValidColor, sanitizeSvg } from './core/sanitize';
import { icons } from './icons';

interface DataTableStatusMeta { cls: string; icon: string }
interface MetricCell { value: number; trend: 'up' | 'down' | 'flat'; delta?: string }
interface PersonCell { name: string; avatar?: string; email?: string }
interface ProgressCell { value: number; max?: number; label?: string }
interface ActionCell { actions: Array<{ label: string; icon?: string; onClick: string }> }
interface LinkCell { text: string; href: string; external?: boolean }
interface IconCell { icon: string; color?: string; tooltip?: string }

const STATUS_MAP: Record<string, DataTableStatusMeta> = {
  'active': { cls: 'active', icon: '\u25CF' }, 'stage 3': { cls: 'active', icon: '\u25CF' },
  'completed': { cls: 'active', icon: '\u2713' }, 'at risk': { cls: 'warning', icon: '\u25CF' },
  'warning': { cls: 'warning', icon: '\u25B2' }, 'blocked': { cls: 'danger', icon: '\u25CF' },
  'on hold': { cls: 'danger', icon: '\u25A0' }, 'stage 1': { cls: 'info', icon: '\u25CF' },
  'stage 2': { cls: 'info', icon: '\u25CF' }, 'planned': { cls: 'info', icon: '\u25CB' },
  'stage 4': { cls: 'warning', icon: '\u25CF' },
};

function escHtml(s: unknown): string { return s == null ? '' : escapeHtml(String(s)); }
function toInitials(name: string): string { return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); }
function toNumber(value: unknown, fallback = 0): number {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : fallback;
}
function trendClass(trend: string): string { return trend === 'up' ? 'up' : trend === 'down' ? 'down' : 'flat'; }

function safeHref(href: string): string {
  const raw = href.trim();
  if (raw.startsWith('#') || raw.startsWith('/')) return escapeHtml(raw);
  const lower = raw.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:') || lower.startsWith('tel:')) return escapeHtml(raw);
  return '#';
}

function renderIconSvg(name: string): string {
  const iconFn = icons[name];
  if (!iconFn) return '<span class="mn-dt__cell-icon-fallback">' + escHtml(name) + '</span>';
  return sanitizeSvg(iconFn());
}

export const cellRenderers: Record<string, (val: unknown, row?: unknown, col?: unknown) => string> = {
  text: (val) => '<span class="mn-dt__cell-text">' + escHtml(val) + '</span>',
  number: (val) => '<span class="mn-dt__cell-number">' + escHtml(val) + '</span>',
  status: (val) => {
    const st: DataTableStatusMeta = STATUS_MAP[String(val ?? '').toLowerCase()] ?? { cls: 'info', icon: '\u25CF' };
    return '<span class="mn-status mn-status--' + st.cls + '"><span class="mn-status__dot"></span> ' + escHtml(val) + '</span>';
  },
  metric: (val) => {
    const m = (typeof val === 'object' && val !== null ? val : { value: toNumber(val), trend: 'flat' }) as MetricCell;
    const tcls = trendClass(String(m.trend));
    const arrow = tcls === 'up' ? '\u25B2' : tcls === 'down' ? '\u25BC' : '\u2014';
    const delta = m.delta ? '<span class="mn-dt__cell-metric-delta">' + escHtml(m.delta) + '</span>' : '';
    return '<div class="mn-dt__cell-metric"><span class="mn-dt__cell-number">' + escHtml(m.value) + '</span><span class="mn-dt__cell-trend mn-dt__cell-trend--' + tcls + '">' + arrow + '</span>' + delta + '</div>';
  },
  progress: (val) => {
    const p = (typeof val === 'object' && val !== null ? val : { value: toNumber(val), max: 100 }) as ProgressCell;
    const max = Math.max(1, toNumber(p.max, 100));
    const pct = Math.max(0, Math.min(100, (toNumber(p.value) / max) * 100));
    const label = p.label ?? Math.round(pct) + '%';
    return '<div class="mn-dt__cell-progress"><div class="mn-dt__progress"><div class="mn-dt__progress-fill" style="width:' + pct + '%"></div></div><span class="mn-dt__cell-pct">' + escHtml(label) + '</span></div>';
  },
  date: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const d = new Date(String(val));
    return '<span class="mn-dt__cell-date">' + String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getFullYear()).slice(2) + '</span>';
  },
  tag: (val) => !val ? '' : '<span class="mn-tag mn-tag--light mn-tag--xs">' + escHtml(val) + '</span>',
  person: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const p = (typeof val === 'object' && val !== null ? val : { name: String(val) }) as PersonCell;
    const avatar = p.avatar ? '<img class="mn-dt__avatar-img" src="' + escHtml(p.avatar) + '" alt="' + escHtml(p.name) + '">' : escHtml(toInitials(p.name));
    const email = p.email ? '<span class="mn-dt__cell-person-email">' + escHtml(p.email) + '</span>' : '';
    return '<div class="mn-dt__cell-person"><span class="mn-dt__avatar">' + avatar + '</span><span class="mn-dt__cell-person-meta"><span class="mn-dt__cell-text">' + escHtml(p.name) + '</span>' + email + '</span></div>';
  },
  badge: (val) => {
    if (val == null) return '<span class="mn-dt__cell-text">\u2014</span>';
    const num = Number(val);
    const cls = num >= 7 ? 'green' : num >= 4 ? 'yellow' : 'red';
    return '<span class="mn-dt__badge mn-dt__badge--' + cls + '">' + escHtml(val) + '</span>';
  },
  action: (val) => {
    const actions = ((val as ActionCell)?.actions ?? []) as ActionCell['actions'];
    if (actions.length === 0) return '<span class="mn-dt__cell-text">\u2014</span>';
    const buttons = actions.map((a) => '<button type="button" class="mn-dt__action-btn" data-action-id="' + escHtml(a.onClick) + '" aria-label="' + escHtml(a.label) + '">' + (a.icon ? '<span class="mn-dt__action-icon">' + escHtml(a.icon) + '</span>' : '') + '<span>' + escHtml(a.label) + '</span></button>').join('');
    return '<div class="mn-dt__cell-actions">' + buttons + '</div>';
  },
  link: (val) => {
    const l = (typeof val === 'object' && val !== null ? val : { text: String(val), href: '#' }) as LinkCell;
    const external = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const extIcon = l.external ? '<span class="mn-dt__cell-link-ext" aria-hidden="true">\u2197</span>' : '';
    return '<a class="mn-dt__cell-link" href="' + safeHref(String(l.href ?? '#')) + '"' + external + '>' + escHtml(l.text) + extIcon + '</a>';
  },
  icon: (val) => {
    const i = (typeof val === 'object' && val !== null ? val : { icon: String(val) }) as IconCell;
    const style = i.color && isValidColor(i.color) ? ' style="color:' + escHtml(i.color) + '"' : '';
    const title = i.tooltip ? ' title="' + escHtml(i.tooltip) + '"' : '';
    return '<span class="mn-dt__cell-icon"' + style + title + '>' + renderIconSvg(i.icon) + '</span>';
  },
  custom: (val, row, col) => {
    const c = col as DataTableColumn | undefined;
    if (!c?.render) return escHtml(val);
    const safe = sanitizeHtml(String(c.render(val, row as Record<string, unknown>)));
    return safe.replace(/style="[^"]*color:\s*([^;"]+)/g, (m, colorVal) => isValidColor(colorVal.trim()) ? m : m.replace(colorVal, 'inherit'));
  },
};
