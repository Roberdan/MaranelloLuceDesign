/**
 * Maranello Luce Design - Token Usage Meter
 * Headless component for displaying LLM token consumption with breakdown.
 */
import { escapeHtml } from './core/sanitize';

export interface TokenUsage {
  prompt: number;
  completion: number;
  cached?: number;
  budget?: number;
  costPerMToken?: number;
}

export interface TokenMeterOptions {
  label?: string;
  showCost?: boolean;
  showBreakdown?: boolean;
  animate?: boolean;
  onChange?: (usage: TokenUsage) => void;
}

export interface TokenMeterController {
  update: (usage: TokenUsage) => void;
  reset: () => void;
  destroy: () => void;
}

const NUM_FMT = new Intl.NumberFormat('en-US');
const COST_FMT = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD',
  minimumFractionDigits: 4, maximumFractionDigits: 4,
});

function pct(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

function buildBar(usage: TokenUsage): string {
  const total = usage.prompt + usage.completion;
  const max = usage.budget ?? total;
  const promptW = pct(usage.prompt, max);
  const compW = pct(usage.completion, max);
  const cachedW = usage.cached ? pct(usage.cached, max) : 0;
  const ariaLabel = `Token usage: ${NUM_FMT.format(total)} of ${NUM_FMT.format(max)}`;

  return [
    `<div class="mn-token-meter__bar" role="meter"`,
    ` aria-valuenow="${total}" aria-valuemin="0"`,
    ` aria-valuemax="${max}" aria-label="${escapeHtml(ariaLabel)}">`,
    `<div class="mn-token-meter__seg mn-token-meter__seg--prompt"`,
    ` style="width:${promptW.toFixed(2)}%">`,
    cachedW > 0
      ? `<div class="mn-token-meter__seg--cached" style="width:${pct(usage.cached!, usage.prompt).toFixed(2)}%"></div>`
      : '',
    `</div>`,
    `<div class="mn-token-meter__seg mn-token-meter__seg--completion"`,
    ` style="width:${compW.toFixed(2)}%"></div>`,
    `</div>`,
  ].join('');
}

function costStr(usage: TokenUsage): string {
  if (!usage.costPerMToken) return '';
  const total = usage.prompt + usage.completion;
  return COST_FMT.format((total / 1_000_000) * usage.costPerMToken);
}

function buildBreakdown(usage: TokenUsage): string {
  const total = usage.prompt + usage.completion;
  const rows = [
    { cls: 'prompt', label: 'Prompt', value: usage.prompt },
    { cls: 'completion', label: 'Completion', value: usage.completion },
  ];
  if (usage.cached !== undefined && usage.cached > 0) {
    rows.push({ cls: 'cached', label: 'Cached', value: usage.cached });
  }
  const html = rows.map((r) => [
    `<span class="mn-token-meter__swatch mn-token-meter__swatch--${r.cls}"></span>`,
    `<span class="mn-token-meter__label">${r.label}</span>`,
    `<span class="mn-token-meter__count">${NUM_FMT.format(r.value)}</span>`,
    `<span class="mn-token-meter__pct">${total > 0 ? pct(r.value, total).toFixed(1) : '0.0'}%</span>`,
  ].join('')).join('');
  return `<div class="mn-token-meter__breakdown">${html}</div>`;
}

function render(
  el: HTMLElement,
  usage: TokenUsage,
  opts: Required<Pick<TokenMeterOptions, 'label' | 'showCost' | 'showBreakdown' | 'animate'>>,
): void {
  const costHtml = opts.showCost && usage.costPerMToken
    ? `<span class="mn-token-meter__cost">${escapeHtml(costStr(usage))}</span>`
    : '';
  const safeLabel = escapeHtml(opts.label);

  el.innerHTML = [
    `<div class="mn-token-meter${opts.animate ? '' : ' mn-token-meter--no-anim'}">`,
    `<div class="mn-token-meter__header">`,
    `<span class="mn-token-meter__title">${safeLabel}</span>`,
    costHtml,
    `</div>`,
    buildBar(usage),
    opts.showBreakdown ? buildBreakdown(usage) : '',
    `</div>`,
  ].join('');
}

function updateDom(el: HTMLElement, usage: TokenUsage, showCost: boolean): void {
  const total = usage.prompt + usage.completion;
  const max = usage.budget ?? total;

  const bar = el.querySelector<HTMLElement>('.mn-token-meter__bar');
  if (bar) {
    bar.setAttribute('aria-valuenow', String(total));
    bar.setAttribute('aria-valuemax', String(max));
    const ariaLabel = `Token usage: ${NUM_FMT.format(total)} of ${NUM_FMT.format(max)}`;
    bar.setAttribute('aria-label', ariaLabel);
  }

  const promptSeg = el.querySelector<HTMLElement>('.mn-token-meter__seg--prompt');
  if (promptSeg) {
    promptSeg.style.width = `${pct(usage.prompt, max).toFixed(2)}%`;
    const cachedEl = promptSeg.querySelector<HTMLElement>('.mn-token-meter__seg--cached');
    if (cachedEl && usage.cached) {
      cachedEl.style.width = `${pct(usage.cached, usage.prompt).toFixed(2)}%`;
    }
  }

  const compSeg = el.querySelector<HTMLElement>('.mn-token-meter__seg--completion');
  if (compSeg) {
    compSeg.style.width = `${pct(usage.completion, max).toFixed(2)}%`;
  }

  if (showCost) {
    const costEl = el.querySelector<HTMLElement>('.mn-token-meter__cost');
    if (costEl) costEl.textContent = costStr(usage);
  }

  const breakdown = el.querySelector('.mn-token-meter__breakdown');
  if (breakdown) {
    const counts = breakdown.querySelectorAll('.mn-token-meter__count');
    const pcts = breakdown.querySelectorAll('.mn-token-meter__pct');
    const values = [usage.prompt, usage.completion];
    if (usage.cached !== undefined && usage.cached > 0) values.push(usage.cached);
    values.forEach((v, i) => {
      if (counts[i]) counts[i].textContent = NUM_FMT.format(v);
      if (pcts[i]) pcts[i].textContent = `${total > 0 ? pct(v, total).toFixed(1) : '0.0'}%`;
    });
  }
}

/** Create a token usage meter inside the given element. */
export function tokenMeter(
  el: HTMLElement,
  usage?: TokenUsage,
  opts?: TokenMeterOptions,
): TokenMeterController {
  const resolved = {
    label: opts?.label ?? 'Token Usage',
    showCost: opts?.showCost ?? (usage?.costPerMToken !== undefined),
    showBreakdown: opts?.showBreakdown ?? true,
    animate: opts?.animate ?? true,
  };
  let current: TokenUsage = usage ?? { prompt: 0, completion: 0 };
  render(el, current, resolved);

  return {
    update(next: TokenUsage): void {
      current = next;
      resolved.showCost = opts?.showCost ?? (next.costPerMToken !== undefined);
      updateDom(el, current, resolved.showCost);
      opts?.onChange?.(current);
    },
    reset(): void {
      current = { prompt: 0, completion: 0 };
      render(el, current, resolved);
    },
    destroy(): void {
      el.innerHTML = '';
    },
  };
}
