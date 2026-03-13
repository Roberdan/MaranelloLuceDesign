/**
 * Maranello Luce Design - Horizontal bar chart DOM drawing
 * Extracted from charts-hbar.ts for separation of concerns.
 */
import { cssVar } from './core/utils';

/** Compute relative luminance of a hex color (WCAG formula). */
export function hexLum(hex: string): number {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Create an HTML element with optional class and text. */
export function createEl(tag: string, cls?: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}

/** Clamp value between min and max. */
export function clampVal(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Normalize a color string to 6-digit hex, with CSS var fallback. */
export function normalizeHex(color: string | null | undefined): string {
  if (typeof color !== 'string') return cssVar('--chart-bar', '#4EA8DE');
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return cssVar('--chart-bar', '#4EA8DE');
}

/** Build evenly-spaced tick values from 0 to maxValue. */
export function buildTicks(maxValue: number): number[] {
  const ticks: number[] = [];
  const step = maxValue / 4;
  for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 100) / 100);
  return ticks;
}

export interface ListenerRecord {
  el: HTMLElement;
  evt: string;
  handler: EventListener;
}

export interface NormalizedBar {
  label: string;
  value: number;
  color: string;
}

export interface HBarRenderState {
  disposed: boolean;
  timers: number[];
  listeners: ListenerRecord[];
  activeIndex: number;
  opts: {
    title?: string;
    bars?: Array<{ label?: string; value?: number; color?: string }>;
    unit?: string;
    maxValue?: number;
    showValues?: boolean;
    showGrid?: boolean;
    sortDescending?: boolean;
    animate?: boolean;
    barHeight?: number;
    onClick?: (bar: NormalizedBar, index: number) => void;
  };
}

export interface HBarRenderContext {
  state: HBarRenderState;
  root: HTMLElement;
  frame: HTMLElement;
  titleEl: HTMLElement;
  gridLayer: HTMLElement;
  rowsLayer: HTMLElement;
  axisLabels: HTMLElement;
  tooltip: HTMLElement;
}

/** Clean up pending animation timers. */
export function cleanupTimers(state: HBarRenderState): void {
  while (state.timers.length) {
    const t = state.timers.pop();
    if (t != null) window.clearTimeout(t);
  }
}

/** Register an event listener and track it for cleanup. */
export function addListener(
  state: HBarRenderState, el: HTMLElement, evt: string, handler: EventListener,
): void {
  el.addEventListener(evt, handler);
  state.listeners.push({ el, evt, handler });
}

/** Show tooltip near the cursor. */
export function showTip(
  tooltip: HTMLElement, frame: HTMLElement, text: string, evt: MouseEvent,
): void {
  tooltip.textContent = text;
  tooltip.classList.add('is-visible');
  const rect = frame.getBoundingClientRect();
  let x = evt.clientX - rect.left + 12;
  let y = evt.clientY - rect.top - 30;
  if (x > rect.width - 140) x = rect.width - 140;
  if (y < 6) y = evt.clientY - rect.top + 14;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

/** Hide tooltip. */
export function hideTip(tooltip: HTMLElement): void {
  tooltip.classList.remove('is-visible');
}

/** Normalize raw bar data into a consistent shape. */
export function normalizeBars(
  bars: Array<{ label?: string; value?: number; color?: string }>,
  sortDescending: boolean,
): NormalizedBar[] {
  const result: NormalizedBar[] = bars.map((bar, idx) => ({
    label: bar?.label != null ? String(bar.label) : 'Item ' + (idx + 1),
    value: Number(bar?.value ?? 0),
    color: normalizeHex(bar?.color),
  }));
  if (sortDescending) result.sort((a, b) => b.value - a.value);
  return result;
}

/** Render the full horizontal bar chart into its DOM context. */
export function renderHBar(ctx: HBarRenderContext): void {
  const { state } = ctx;
  if (state.disposed) return;
  cleanupTimers(state);
  ctx.rowsLayer.innerHTML = '';
  ctx.gridLayer.innerHTML = '';
  ctx.axisLabels.innerHTML = '';

  let maxValue = Number(state.opts.maxValue) || 100;
  if (maxValue <= 0) maxValue = 100;

  const bars = normalizeBars(state.opts.bars || [], !!state.opts.sortDescending);
  const ticks = buildTicks(maxValue);

  ctx.titleEl.style.display = state.opts.title ? '' : 'none';
  ctx.titleEl.textContent = state.opts.title || '';
  ctx.root.setAttribute('role', 'img');
  ctx.root.setAttribute('aria-label', state.opts.title || 'Horizontal bar chart');
  ctx.frame.style.setProperty(
    '--mn-hbar-bar-height', (state.opts.barHeight || 28) + 'px',
  );

  renderGrid(ctx, ticks, maxValue);
  renderAxis(ctx, ticks, maxValue);
  renderRows(ctx, bars, maxValue);
}

function renderGrid(
  ctx: HBarRenderContext, ticks: number[], maxValue: number,
): void {
  if (!ctx.state.opts.showGrid) return;
  ticks.forEach((tick) => {
    const line = createEl('div', 'mn-hbar__grid-line');
    line.style.left = (tick / maxValue * 100) + '%';
    ctx.gridLayer.appendChild(line);
  });
}

function renderAxis(
  ctx: HBarRenderContext, ticks: number[], maxValue: number,
): void {
  const unit = ctx.state.opts.unit || '';
  ticks.forEach((tick) => {
    const aLabel = createEl('div', 'mn-hbar__axis-label', tick + unit);
    aLabel.style.left = (tick / maxValue * 100) + '%';
    ctx.axisLabels.appendChild(aLabel);
  });
}

function renderRows(
  ctx: HBarRenderContext, bars: NormalizedBar[], maxValue: number,
): void {
  const { state } = ctx;
  bars.forEach((bar, index) => {
    const row = createEl('div', 'mn-hbar__row');
    const label = createEl('div', 'mn-hbar__label', bar.label);
    const track = createEl('div', 'mn-hbar__track');
    const fill = createEl('div', 'mn-hbar__fill');
    const valueEl = createEl('div', 'mn-hbar__value');
    const pct = clampVal((bar.value / maxValue) * 100, 0, 100);
    const txtColor = hexLum(bar.color) > 0.55 ? '#111111' : '#FFFFFF';

    fill.style.background = bar.color;
    fill.style.height = (state.opts.barHeight || 28) + 'px';
    fill.style.width = state.opts.animate ? '0%' : pct + '%';
    valueEl.style.color = txtColor;
    valueEl.textContent = bar.value + (state.opts.unit || '');
    valueEl.style.display = state.opts.showValues ? '' : 'none';

    fill.appendChild(valueEl);
    track.appendChild(fill);
    row.appendChild(label);
    row.appendChild(track);
    ctx.rowsLayer.appendChild(row);

    const tipText = bar.label + ': ' + bar.value + (state.opts.unit || '');
    addListener(state, row, 'mouseenter',
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt as MouseEvent));
    addListener(state, row, 'mousemove',
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt as MouseEvent));
    addListener(state, row, 'mouseleave', () => hideTip(ctx.tooltip));
    addListener(state, row, 'click', () => {
      const prev = ctx.rowsLayer.querySelector('.mn-hbar__row.is-active');
      if (prev) prev.classList.remove('is-active');
      row.classList.add('is-active');
      state.activeIndex = index;
      if (typeof state.opts.onClick === 'function') {
        state.opts.onClick(bar, index);
      }
    });

    if (state.opts.animate) {
      const t = window.setTimeout(() => { fill.style.width = pct + '%'; }, index * 50);
      state.timers.push(t);
    }
  });
}
