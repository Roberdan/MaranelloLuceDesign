/**
 * Maranello Luce Design - Dashboard strip zone renderers
 * Each renderer creates DOM for a zone type and returns update/destroy handles.
 */
import { createElement } from './core/utils';
import { isValidColor } from './core/sanitize';
import { FerrariGauge } from './gauge-engine';
import { sparkline } from './charts-sparkline';
import type {
  StripGaugeZone,
  StripPipelineZone,
  StripTrendZone,
  StripBoardZone,
} from './core/types';

interface ZoneHandle {
  update: (zone: Record<string, unknown>) => void;
  destroy: () => void;
}

/** Safe color setter — only applies validated colors. */
function safeColor(el: HTMLElement, prop: 'color' | 'backgroundColor', value: string): void {
  if (isValidColor(value)) {
    el.style[prop] = value;
  }
}

/** Create a section title element. */
function sectionTitle(parent: HTMLElement, title?: string): void {
  if (!title) return;
  const el = createElement('div', 'mn-strip__section-title');
  el.textContent = title;
  parent.appendChild(el);
}

// ---------------------------------------------------------------------------
// Gauge Zone
// ---------------------------------------------------------------------------

export function renderGaugeZone(
  section: HTMLElement,
  zone: StripGaugeZone,
  _animate: boolean,
): ZoneHandle {
  section.classList.add('mn-strip__section--col');
  // Label at top
  sectionTitle(section, zone.label);

  const wrap = createElement('div', 'mn-strip-gauge-wrap');
  const canvas = document.createElement('canvas');
  canvas.className = 'mn-strip-gauge__canvas';
  canvas.dataset.gauge = JSON.stringify(zone.gaugeConfig);
  canvas.dataset.size = String(zone.size || 'sm');
  wrap.appendChild(canvas);
  section.appendChild(wrap);

  const gauge = new FerrariGauge(canvas);

  return {
    update() { /* future */ },
    destroy() {
      if (gauge) gauge.destroy();
      wrap.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Pipeline Zone
// ---------------------------------------------------------------------------

export function renderPipelineZone(
  section: HTMLElement,
  zone: StripPipelineZone,
  _animate: boolean,
): ZoneHandle {
  section.classList.add('mn-strip__section--col');
  sectionTitle(section, zone.title);

  const pipe = createElement('div', 'mn-strip-pipeline');
  const maxVal = zone.maxValue || Math.max(...zone.rows.map((r) => r.value), 1);

  for (const row of zone.rows) {
    const rowEl = createElement('div', 'mn-strip-row');

    const label = createElement('span', 'mn-strip-row__label');
    label.textContent = row.label;
    safeColor(label, 'color', row.color);
    rowEl.appendChild(label);

    const count = createElement('span', 'mn-strip-row__count');
    count.textContent = String(row.value);
    rowEl.appendChild(count);

    const track = createElement('div', 'mn-strip-row__track');
    const fill = createElement('div', 'mn-strip-row__fill');
    safeColor(fill, 'backgroundColor', row.color);
    const pct = Math.min((row.value / maxVal) * 100, 100);
    fill.style.width = pct + '%';
    track.appendChild(fill);
    rowEl.appendChild(track);

    if (row.secondary) {
      const dur = createElement('span', 'mn-strip-row__dur');
      dur.textContent = row.secondary;
      rowEl.appendChild(dur);
    }

    pipe.appendChild(rowEl);
  }

  if (zone.footer) {
    const footerEl = createElement('div', 'mn-strip-row mn-strip-row--e2e');
    const fLabel = createElement('span', 'mn-strip-row__label');
    fLabel.textContent = zone.footer.label;
    footerEl.appendChild(fLabel);
    const fVal = createElement('span', 'mn-strip-row__dur mn-strip-row__dur--e2e');
    fVal.textContent = zone.footer.value;
    footerEl.appendChild(fVal);
    pipe.appendChild(footerEl);
  }

  section.appendChild(pipe);

  return {
    update() { /* future */ },
    destroy() { pipe.remove(); },
  };
}

// ---------------------------------------------------------------------------
// Trend Zone
// ---------------------------------------------------------------------------

export function renderTrendZone(
  section: HTMLElement,
  zone: StripTrendZone,
  _animate: boolean,
): ZoneHandle {
  section.classList.add('mn-strip__section--col');
  sectionTitle(section, zone.title);

  const kpis = createElement('div', 'mn-strip-kpis');

  for (const item of zone.items) {
    const kpi = createElement('div', 'mn-strip-kpi');

    const label = createElement('span', 'mn-strip-kpi__label');
    label.textContent = item.label;
    kpi.appendChild(label);

    const value = createElement('span', 'mn-strip-kpi__value');
    value.textContent = String(item.value);
    safeColor(value, 'color', item.color);
    kpi.appendChild(value);

    const canvas = createElement('canvas', 'mn-strip-kpi__spark');
    kpi.appendChild(canvas);
    kpis.appendChild(kpi);

    sparkline(canvas, item.data, { color: item.color });
  }

  section.appendChild(kpis);

  return {
    update() { /* future */ },
    destroy() { kpis.remove(); },
  };
}

// ---------------------------------------------------------------------------
// Board Zone
// ---------------------------------------------------------------------------

export function renderBoardZone(
  section: HTMLElement,
  zone: StripBoardZone,
  _animate: boolean,
): ZoneHandle {
  section.classList.add('mn-strip__section--col');
  sectionTitle(section, zone.title);

  let boardGauge: FerrariGauge | null = null;
  const els: HTMLElement[] = [];

  const row = createElement('div', 'mn-strip-board-row');
  els.push(row);

  if (zone.stats) {
    const board = createElement('div', 'mn-strip-board');
    for (const stat of zone.stats) {
      const cell = createElement('div', 'mn-strip-board__cell');
      const lbl = createElement('span', 'mn-strip-board__label');
      lbl.textContent = stat.label;
      cell.appendChild(lbl);
      const val = createElement('span', 'mn-strip-board__val');
      val.textContent = String(stat.value);
      cell.appendChild(val);
      board.appendChild(cell);
    }
    row.appendChild(board);
  }

  if (zone.gauge) {
    const wrap = createElement('div', 'mn-strip-gauge-wrap');
    const canvas = document.createElement('canvas');
    canvas.className = 'mn-strip-gauge__canvas';
    canvas.dataset.gauge = JSON.stringify(zone.gauge);
    canvas.dataset.size = String(zone.gaugeSize || 'sm');
    wrap.appendChild(canvas);
    row.appendChild(wrap);
    boardGauge = new FerrariGauge(canvas);
  }

  section.appendChild(row);

  return {
    update() { /* future */ },
    destroy() {
      if (boardGauge) boardGauge.destroy();
      for (const el of els) el.remove();
    },
  };
}
