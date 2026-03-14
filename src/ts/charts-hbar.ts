/**
 * Maranello Luce Design - Horizontal bar chart (DOM-based)
 */
import type { HBarData, HBarChartOptions, HBarChartController } from './core/types';
import { cssVar } from './core/utils';
import { isValidColor } from './core/sanitize';

interface ListenerRecord {
  el: HTMLElement;
  evt: string;
  handler: EventListener;
}

interface NormalizedBar {
  label: string;
  value: number;
  color: string;
}

function hexLum(hex: string): number {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function createEl(tag: string, cls?: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}

function normalizeHex(color: string | null | undefined): string {
  if (typeof color !== 'string') return cssVar('--chart-bar', '#4EA8DE');
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return cssVar('--chart-bar', '#4EA8DE');
}

function buildTicks(maxValue: number): number[] {
  const ticks: number[] = [];
  const step = maxValue / 4;
  for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 100) / 100);
  return ticks;
}

function clampVal(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Create a horizontal bar chart inside a container element. */
export function hBarChart(
  container: string | Element | null | undefined,
  opts?: HBarChartOptions,
): HBarChartController | null {
  const root = typeof container === 'string'
    ? document.querySelector(container) : container;
  if (!root) {
    console.warn('[Maranello] hBarChart: container not found');
    return null;
  }

  const state = {
    opts: {
      title: '', bars: [] as HBarData[], unit: '', maxValue: 100,
      showValues: true, showGrid: true, sortDescending: true,
      animate: true, barHeight: 28, onClick: undefined as HBarChartOptions['onClick'],
      ...opts,
    },
    listeners: [] as ListenerRecord[],
    timers: [] as number[],
    activeIndex: -1,
    disposed: false,
  };

  const frame = createEl('div', 'mn-hbar');
  const titleEl = createEl('div', 'mn-hbar__title');
  const chartWrap = createEl('div', 'mn-hbar__chart');
  const gridLayer = createEl('div', 'mn-hbar__grid');
  const rowsLayer = createEl('div', 'mn-hbar__rows');
  const axis = createEl('div', 'mn-hbar__axis');
  const axisSpacer = createEl('div', 'mn-hbar__axis-spacer');
  const axisLabels = createEl('div', 'mn-hbar__axis-labels');
  const tooltip = createEl('div', 'mn-hbar__tooltip');

  chartWrap.appendChild(gridLayer);
  chartWrap.appendChild(rowsLayer);
  axis.appendChild(axisSpacer);
  axis.appendChild(axisLabels);
  frame.appendChild(titleEl);
  frame.appendChild(chartWrap);
  frame.appendChild(axis);
  frame.appendChild(tooltip);

  const host = root as HTMLElement;
  host.innerHTML = '';
  host.classList.add('mn-hbar-host');
  host.appendChild(frame);

  function addListener(el: HTMLElement, evt: string, handler: EventListener): void {
    el.addEventListener(evt, handler);
    state.listeners.push({ el, evt, handler });
  }

  function cleanupTimers(): void {
    while (state.timers.length) {
      const t = state.timers.pop();
      if (t != null) window.clearTimeout(t);
    }
  }

  function showTip(text: string, evt: MouseEvent): void {
    (tooltip as HTMLElement).textContent = text;
    tooltip.classList.add('is-visible');
    const rect = frame.getBoundingClientRect();
    let x = evt.clientX - rect.left + 12;
    let y = evt.clientY - rect.top - 30;
    if (x > rect.width - 140) x = rect.width - 140;
    if (y < 6) y = evt.clientY - rect.top + 14;
    (tooltip as HTMLElement).style.left = x + 'px';
    (tooltip as HTMLElement).style.top = y + 'px';
  }

  function render(): void {
    if (state.disposed) return;
    cleanupTimers();
    rowsLayer.innerHTML = '';
    gridLayer.innerHTML = '';
    axisLabels.innerHTML = '';

    let maxValue = Number(state.opts.maxValue) || 100;
    if (maxValue <= 0) maxValue = 100;

    let bars: NormalizedBar[] = (state.opts.bars || []).map((bar, idx) => ({
      label: bar?.label != null ? String(bar.label) : 'Item ' + (idx + 1),
      value: Number(bar?.value ?? 0),
      color: normalizeHex(bar?.color),
    }));

    if (state.opts.sortDescending) {
      bars.sort((a, b) => b.value - a.value);
    }

    const ticks = buildTicks(maxValue);
    titleEl.style.display = state.opts.title ? '' : 'none';
    titleEl.textContent = state.opts.title || '';
    const highest = bars.length > 0
      ? bars.reduce((a, b) => (b.value > a.value ? b : a), bars[0]) : null;
    const hbarLabel = highest
      ? `Bar chart: ${bars.length} categories, highest ${highest.label} at ${highest.value}`
      : (state.opts.title || 'Horizontal bar chart');
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', hbarLabel);
    const prevSr = host.querySelector('.mn-sr-only');
    if (prevSr) prevSr.remove();
    const srSpan = createEl('span', 'mn-sr-only', hbarLabel);
    frame.appendChild(srSpan);
    (frame as HTMLElement).style.setProperty(
      '--mn-hbar-bar-height', (state.opts.barHeight || 28) + 'px',
    );

    if (state.opts.showGrid) {
      ticks.forEach((tick) => {
        const line = createEl('div', 'mn-hbar__grid-line');
        (line as HTMLElement).style.left = (tick / maxValue * 100) + '%';
        gridLayer.appendChild(line);
      });
    }

    ticks.forEach((tick) => {
      const aLabel = createEl('div', 'mn-hbar__axis-label',
        tick + (state.opts.unit || ''));
      (aLabel as HTMLElement).style.left = (tick / maxValue * 100) + '%';
      axisLabels.appendChild(aLabel);
    });

    bars.forEach((bar, index) => {
      const row = createEl('div', 'mn-hbar__row');
      const label = createEl('div', 'mn-hbar__label', bar.label);
      const track = createEl('div', 'mn-hbar__track');
      const fill = createEl('div', 'mn-hbar__fill');
      const valueEl = createEl('div', 'mn-hbar__value');
      const pct = clampVal((bar.value / maxValue) * 100, 0, 100);
      const txtColor = hexLum(bar.color) > 0.55 ? '#111111' : '#FFFFFF';

      const safeColor = isValidColor(bar.color) ? bar.color : cssVar('--mn-accent');
      (fill as HTMLElement).style.background = safeColor;
      (fill as HTMLElement).style.height = (state.opts.barHeight || 28) + 'px';
      (fill as HTMLElement).style.width = state.opts.animate ? '0%' : pct + '%';
      (valueEl as HTMLElement).style.color = txtColor;
      valueEl.textContent = bar.value + (state.opts.unit || '');
      (valueEl as HTMLElement).style.display = state.opts.showValues ? '' : 'none';

      fill.appendChild(valueEl);
      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      rowsLayer.appendChild(row);

      const tipText = bar.label + ': ' + bar.value + (state.opts.unit || '');
      addListener(row, 'mouseenter', (evt) => showTip(tipText, evt as MouseEvent));
      addListener(row, 'mousemove', (evt) => showTip(tipText, evt as MouseEvent));
      addListener(row, 'mouseleave', () => tooltip.classList.remove('is-visible'));
      addListener(row, 'click', () => {
        const prev = rowsLayer.querySelector('.mn-hbar__row.is-active');
        if (prev) prev.classList.remove('is-active');
        row.classList.add('is-active');
        state.activeIndex = index;
        if (typeof state.opts.onClick === 'function') {
          state.opts.onClick(bar, index);
        }
      });

      if (state.opts.animate) {
        const t = window.setTimeout(() => {
          (fill as HTMLElement).style.width = pct + '%';
        }, index * 50);
        state.timers.push(t);
      }
    });
  }

  render();

  return {
    update(newBars: HBarData[]): void {
      if (state.disposed) return;
      state.opts.bars = Array.isArray(newBars) ? newBars.slice() : [];
      state.activeIndex = -1;
      render();
    },
    destroy(): void {
      if (state.disposed) return;
      state.disposed = true;
      cleanupTimers();
      state.listeners.forEach((l) => l.el.removeEventListener(l.evt, l.handler));
      state.listeners = [];
      host.innerHTML = '';
      host.classList.remove('mn-hbar-host');
    },
  };
}
