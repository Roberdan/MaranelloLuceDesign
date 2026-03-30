/**
 * Maranello Luce Design - OKR Panel: Types & Utilities
 * Shared helpers for OKR hero gauge, ring templates, animations.
 * @version 2.0.0
 */
import { cssVar, clamp, createElement } from './core/utils';
import { escapeHtml, isValidColor } from './core/sanitize';

export type OkrStatus = 'on-track' | 'at-risk' | 'behind';
export type OkrScope = 'LOCAL' | 'TEAM' | 'GLOBAL' | string;

export interface KeyResultInput {
  title?: string; current?: number | string;
  target?: number | string; unit?: string;
}
export interface ObjectiveInput {
  title?: string; scope?: OkrScope; progress?: number | string;
  status?: OkrStatus; keyResults?: KeyResultInput[];
}
export interface Objective {
  title: string; scope: OkrScope; progress: number;
  status: OkrStatus; keyResults: KeyResultInput[];
}
export interface OkrPanelOptions {
  title?: string; period?: string; objectives?: ObjectiveInput[];
}
export interface OkrStats { counts: Record<OkrStatus, number>; average: number; }
export interface OkrPanelController {
  update: (objectives: ObjectiveInput[]) => void; destroy: () => void;
}

export function getStatusColors(): Record<OkrStatus, string> {
  return {
    'on-track': cssVar('--signal-ok', '#00A651'),
    'at-risk': cssVar('--signal-warning', '#FFC72C'),
    behind: cssVar('--signal-danger', '#DC0000'),
  };
}
export function getScopeColors(): Record<string, string> {
  return {
    LOCAL: cssVar('--scope-local', '#4EA8DE'),
    TEAM: cssVar('--scope-team', '#7C3AED'),
    GLOBAL: cssVar('--scope-global', '#FFC72C'),
  };
}

export function safeNumber(v: unknown): number {
  const n = Number(v); return Number.isFinite(n) ? n : 0;
}
export function pct(current: unknown, target: unknown): number {
  const c = safeNumber(current), t = safeNumber(target);
  return t <= 0 ? 0 : clamp((c / t) * 100, 0, 100);
}
export function statusFromProgress(p: unknown): OkrStatus {
  const v = safeNumber(p);
  return v >= 75 ? 'on-track' : v >= 40 ? 'at-risk' : 'behind';
}
export function statusLabel(s: OkrStatus): string {
  return s === 'on-track' ? 'ON TRACK' : s === 'at-risk' ? 'AT RISK' : 'BEHIND';
}
export function formatKR(current: unknown, target: unknown, unit?: string): string {
  return String(current) + '/' + String(target) + (unit || '');
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, className?: string, attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.keys(attrs).forEach((key) => {
    if (key === 'text') node.textContent = attrs[key];
    else if (key === 'html') node.innerHTML = escapeHtml(String(attrs[key]));
    else node.setAttribute(key, attrs[key]);
  });
  return node;
}

export function describeArc(cx: number, cy: number, r: number, sa: number, ea: number): string {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${ea - sa > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export function ringTemplate(
  size: number, stroke: number, percent: number, color: string,
  centerText: string | null, trackClass: string, progressClass: string,
): string {
  const safeColor = isValidColor(color) ? color : '#999';
  const radius = (size - stroke) / 2, cx = size / 2;
  const circ = 2 * Math.PI * radius;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const off = circ - (bounded / 100) * circ;
  let svg = `<svg class="mn-okr__ring" viewBox="0 0 ${size} ${size}" aria-hidden="true">` +
    `<circle class="${trackClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}"></circle>` +
    `<circle class="${progressClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}" stroke="${safeColor}" ` +
    `data-circumference="${circ.toFixed(2)}" data-target-offset="${off.toFixed(2)}" ` +
    `stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${circ.toFixed(2)}"></circle>`;
  if (centerText != null) svg += `<text class="mn-okr__ring-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${escapeHtml(String(centerText))}</text>`;
  return svg + '</svg>';
}

export function heroGaugeSVG(percent: number, color: string): string {
  const safeColor = isValidColor(color) ? color : '#999';
  const w = 240, h = 140, cx = w / 2, cy = h - 10, r = 100;
  const startAngle = Math.PI;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const needleAngle = startAngle + (bounded / 100) * Math.PI;
  const ticks: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = startAngle + (i / 10) * Math.PI;
    const isMajor = i % 2 === 0, len = isMajor ? 14 : 8;
    const x1 = cx + Math.cos(a) * (r - len), y1 = cy + Math.sin(a) * (r - len);
    const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
    ticks.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" ` +
      `stroke="${isMajor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}" stroke-width="${isMajor ? 2 : 1}"/>`);
    if (isMajor) {
      const lx = cx + Math.cos(a) * (r - 22), ly = cy + Math.sin(a) * (r - 22);
      ticks.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" ` +
        `fill="rgba(255,255,255,0.45)" font-size="9" font-family="var(--font-mono)">${i * 10}</text>`);
    }
  }
  const trackPath = describeArc(cx, cy, r, startAngle, 2 * Math.PI);
  const progressEnd = startAngle + (bounded / 100) * Math.PI;
  const progressPath = describeArc(cx, cy, r, startAngle, progressEnd);
  const nx = cx + Math.cos(needleAngle) * (r - 28), ny = cy + Math.sin(needleAngle) * (r - 28);
  return `<svg class="mn-okr__gauge" viewBox="0 0 ${w} ${h}" aria-hidden="true">` +
    `<defs><filter id="okr-glow"><feGaussianBlur stdDeviation="4" result="blur"/>` +
    `<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    `<path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" stroke-linecap="round"/>` +
    `<path class="mn-okr__gauge-progress" d="${progressPath}" fill="none" stroke="${safeColor}" ` +
    `stroke-width="8" stroke-linecap="round" filter="url(#okr-glow)" ` +
    `stroke-dasharray="${(Math.PI * r).toFixed(1)}" stroke-dashoffset="${(Math.PI * r).toFixed(1)}" data-target="0"/>` +
    ticks.join('') +
    `<line class="mn-okr__needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" ` +
    `stroke="${safeColor}" stroke-width="2.5" stroke-linecap="round" filter="url(#okr-glow)" ` +
    `data-cx="${cx}" data-cy="${cy}" data-r="${r - 28}" data-target-angle="${needleAngle.toFixed(4)}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="5" fill="${safeColor}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#111"/></svg>`;
}

export function animateRings(container: HTMLElement): void {
  const rings = Array.from(container.querySelectorAll<SVGCircleElement>('.mn-okr__ring-progress'));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => { ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute('data-target-offset'))); });
  });
}
export function animateSummaryRings(container: HTMLElement): void {
  const rings = Array.from(container.querySelectorAll<SVGCircleElement>('.mn-okr__summary-ring'));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => { ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute('data-target'))); });
  });
}
export function animateBars(container: HTMLElement): void {
  const bars = Array.from(container.querySelectorAll<HTMLElement>('.mn-okr__kr-bar'));
  if (!bars.length) return;
  requestAnimationFrame(() => {
    bars.forEach((bar) => { bar.style.width = clamp(safeNumber(bar.dataset.target), 0, 100) + '%'; });
  });
}
export function animateGauge(container: HTMLElement): void {
  const progress = container.querySelector<SVGPathElement>('.mn-okr__gauge-progress');
  const needle = container.querySelector<SVGLineElement>('.mn-okr__needle');
  if (!progress) return;
  requestAnimationFrame(() => {
    progress.style.strokeDashoffset = '0';
    progress.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.2, 1, 0.2, 1)';
    if (!needle) return;
    const ncx = parseFloat(needle.getAttribute('data-cx') || '0');
    const ncy = parseFloat(needle.getAttribute('data-cy') || '0');
    const nr = parseFloat(needle.getAttribute('data-r') || '0');
    const targetAngle = parseFloat(needle.getAttribute('data-target-angle') || String(Math.PI));
    const sa = Math.PI;
    needle.setAttribute('x2', (ncx + Math.cos(sa) * nr).toFixed(1));
    needle.setAttribute('y2', (ncy + Math.sin(sa) * nr).toFixed(1));
    let start: number | null = null;
    const dur = 1200;
    const step = (ts: number): void => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      const a = sa + (1 - Math.pow(1 - t, 3)) * (targetAngle - sa);
      needle.setAttribute('x2', (ncx + Math.cos(a) * nr).toFixed(1));
      needle.setAttribute('y2', (ncy + Math.sin(a) * nr).toFixed(1));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
