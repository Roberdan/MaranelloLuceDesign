import { areaChart, barChart, bubble, donut, hBarChart, radar, sparkline } from './charts';
import { isValidColor } from './core/sanitize';
import { FerrariGauge } from './gauge-engine';
import { createGauge } from './gauge-engine-class';

export type DashboardWidgetType = 'kpi-strip' | 'stat-card' | 'chart' | 'gauge' | 'legend' | 'table-summary' | 'custom';
export interface WidgetController { render: (container: HTMLElement, data: unknown) => void; update: (data: unknown) => void; destroy: () => void; }
export interface WidgetConfig { type: DashboardWidgetType; options?: Record<string, unknown>; }

type ChartType = 'sparkline' | 'donut' | 'bar' | 'area' | 'radar' | 'bubble' | 'hbar';
type GaugeCtrl = { redraw?: () => void; destroy?: () => void; config?: Record<string, unknown> };
const charts = { sparkline, donut, bar: barChart, area: areaChart, radar, bubble };

function arr(v: unknown): Array<Record<string, unknown>> { return Array.isArray(v) ? v as Array<Record<string, unknown>> : []; }

/** Create an element with className and optional textContent. */
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Remove all child nodes from an element. */
function clear(node: HTMLElement): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function kpi(): WidgetController {
  let h: HTMLElement | null = null;
  const draw = (v: unknown): void => {
    if (!h) return;
    clear(h);
    for (const i of arr(v)) {
      const article = el('article', 'mn-dashboard-kpi');
      article.appendChild(el('p', 'mn-dashboard-kpi__label', String(i.label ?? '\u2014')));
      article.appendChild(el('p', 'mn-dashboard-kpi__value', String(i.value ?? '\u2014')));
      if (i.delta != null) {
        article.appendChild(el('span', 'mn-dashboard-kpi__delta', String(i.delta)));
      }
      h.appendChild(article);
    }
  };
  return { render(c, v) { h = c; h.classList.add('mn-dashboard-kpi-strip'); draw(v); }, update: draw, destroy() { if (h) clear(h); h = null; } };
}

function stat(o?: Record<string, unknown>): WidgetController {
  let h: HTMLElement | null = null;
  const icon = typeof o?.icon === 'string' ? o.icon : '';
  const draw = (v: unknown): void => {
    if (!h) return;
    clear(h);
    const d = v && typeof v === 'object' ? v as Record<string, unknown> : {};
    const article = el('article', 'mn-dashboard-stat');
    if (icon) {
      article.appendChild(el('span', 'mn-dashboard-stat__icon', icon));
    }
    article.appendChild(el('p', 'mn-dashboard-stat__value', String(d.value ?? d.metric ?? '\u2014')));
    article.appendChild(el('p', 'mn-dashboard-stat__label', String(d.label ?? o?.label ?? 'Metric')));
    h.appendChild(article);
  };
  return { render(c, v) { h = c; draw(v); }, update: draw, destroy() { if (h) clear(h); h = null; } };
}

function chart(o?: Record<string, unknown>): WidgetController {
  let h: HTMLElement | null = null; let c: HTMLCanvasElement | null = null;
  let hb: { update?: (x: unknown) => void; destroy?: () => void } | null = null;
  const t = (o?.chartType as ChartType) || 'sparkline';
  const draw = (v: unknown): void => {
    if (!h) return;
    if (t === 'hbar') { hb = hb || hBarChart(h, v as Record<string, unknown>) as { update?: (x: unknown) => void; destroy?: () => void } | null; hb?.update?.(v); return; }
    c = c || Object.assign(document.createElement('canvas'), { className: 'mn-dashboard-canvas' });
    if (!c.parentElement) h.appendChild(c);
    (charts[t as keyof typeof charts] || charts.sparkline)(c, v as never, o as never);
  };
  return { render(x, v) { h = x; draw(v); }, update: draw, destroy() { hb?.destroy?.(); if (h) clear(h); h = null; c = null; hb = null; } };
}

function gauge(o?: Record<string, unknown>): WidgetController {
  let h: HTMLElement | null = null; let c: HTMLCanvasElement | null = null; let g: GaugeCtrl | null = null;
  const cfg = (v: unknown): Record<string, unknown> => ({ ...o, ...(v && typeof v === 'object' ? v as Record<string, unknown> : { value: v }) });
  const draw = (v: unknown): void => {
    if (!h) return;
    c = c || Object.assign(document.createElement('canvas'), { className: 'mn-dashboard-canvas' });
    if (!c.parentElement) h.appendChild(c);
    const conf = cfg(v);
    if (!g) { g = createGauge({ target: c, config: conf }) as GaugeCtrl | null; if (!g) { c.dataset.gauge = JSON.stringify(conf); g = new FerrariGauge(c) as unknown as GaugeCtrl; } return; }
    g.config = { ...(g.config || {}), ...conf }; g.redraw?.();
  };
  return { render(x, v) { h = x; draw(v); }, update: draw, destroy() { g?.destroy?.(); if (h) clear(h); h = null; c = null; g = null; } };
}

const FALLBACK_COLOR = 'var(--mn-accent)';

function legend(): WidgetController {
  let h: HTMLElement | null = null;
  const draw = (v: unknown): void => {
    if (!h) return;
    clear(h);
    const ul = el('ul', 'mn-dashboard-legend');
    for (const i of arr(v)) {
      const li = el('li', 'mn-dashboard-legend__item');
      const swatch = el('span', 'mn-dashboard-legend__swatch');
      const rawColor = String(i.color ?? FALLBACK_COLOR);
      swatch.style.background = isValidColor(rawColor) ? rawColor : FALLBACK_COLOR;
      li.appendChild(swatch);
      li.appendChild(el('span', undefined, String(i.label ?? 'Item')));
      ul.appendChild(li);
    }
    h.appendChild(ul);
  };
  return { render(c, v) { h = c; draw(v); }, update: draw, destroy() { if (h) clear(h); h = null; } };
}

function table(): WidgetController {
  let h: HTMLElement | null = null;
  const draw = (v: unknown): void => {
    if (!h) return;
    clear(h);
    const d = v && typeof v === 'object' ? v as { headers?: unknown[]; rows?: unknown[][] } : {};
    const tbl = el('table', 'mn-dashboard-table-summary');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    if (Array.isArray(d.headers)) {
      for (const x of d.headers) {
        headRow.appendChild(el('th', undefined, String(x)));
      }
    }
    thead.appendChild(headRow);
    tbl.appendChild(thead);
    const tbody = document.createElement('tbody');
    if (Array.isArray(d.rows)) {
      for (const r of d.rows) {
        const tr = document.createElement('tr');
        for (const x of r) {
          tr.appendChild(el('td', undefined, String(x ?? '')));
        }
        tbody.appendChild(tr);
      }
    }
    tbl.appendChild(tbody);
    h.appendChild(tbl);
  };
  return { render(c, v) { h = c; draw(v); }, update: draw, destroy() { if (h) clear(h); h = null; } };
}

function custom(o?: Record<string, unknown>): WidgetController {
  let h: HTMLElement | null = null;
  const fn = typeof o?.render === 'function' ? o.render as (container: HTMLElement, data: unknown) => void : null;
  const draw = (v: unknown): void => { if (h && fn) fn(h, v); };
  return { render(c, v) { h = c; draw(v); }, update(v) { if (h) clear(h); draw(v); }, destroy() { if (h) clear(h); h = null; } };
}

export function createDashboardWidget(config: WidgetConfig): WidgetController {
  if (config.type === 'kpi-strip') return kpi();
  if (config.type === 'stat-card') return stat(config.options);
  if (config.type === 'chart') return chart(config.options);
  if (config.type === 'gauge') return gauge(config.options);
  if (config.type === 'legend') return legend();
  if (config.type === 'table-summary') return table();
  return custom(config.options);
}
