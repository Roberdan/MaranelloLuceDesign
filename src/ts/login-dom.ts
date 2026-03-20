/**
 * Maranello Luce Design - Login screen DOM helpers
 * Provides element creation, mini-gauge SVG, compass SVG, and service cards.
 */

import { cssVar, clamp, createElement } from './core/utils';
import { escapeHtml, isValidColor } from './core/sanitize';

export type LoginServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | string;

export interface LoginServiceCheck {
  name: string;
  status: LoginServiceStatus;
  latency_ms: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  healthy: cssVar('--signal-ok', '#00A651'),
  degraded: cssVar('--signal-warning', '#FFC72C'),
  unhealthy: cssVar('--signal-danger', '#DC0000'),
};

const STATUS_LABELS: Record<string, string> = {
  healthy: 'ONLINE',
  degraded: 'SLOW',
  unhealthy: 'OFFLINE',
};

function arc(cx: number, cy: number, r: number, sa: number, ea: number): string {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  const large = ea - sa > Math.PI ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function miniGaugeSVG(status: LoginServiceStatus, latencyMs: number | null, label: string): string {
  let color = STATUS_COLORS[status] ?? cssVar('--stage-completed', '#6B7280');
  if (!isValidColor(color)) color = 'var(--mn-border-strong)';
  const pct = status === 'healthy' ? 95 : status === 'degraded' ? 55 : 10;
  const sz = 56, cx = sz / 2, cy = sz - 4, r = 22;
  const startAngle = Math.PI, needleAngle = startAngle + (clamp(pct, 0, 100) / 100) * Math.PI;
  const light = document.body.classList.contains('mn-sugar') || document.body.classList.contains('mn-avorio');
  const tickStroke = light ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)';
  const trackStroke = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const dotFill = light ? '#ddd' : '#111';

  let ticks = '';
  for (let i = 0; i <= 6; i++) {
    const a = startAngle + (i / 6) * Math.PI;
    const tx1 = cx + Math.cos(a) * (r - 4), ty1 = cy + Math.sin(a) * (r - 4);
    const tx2 = cx + Math.cos(a) * r, ty2 = cy + Math.sin(a) * r;
    ticks += `<line x1="${tx1.toFixed(1)}" y1="${ty1.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="${tickStroke}" stroke-width="1"/>`;
  }

  const nx = cx + Math.cos(needleAngle) * (r - 8);
  const ny = cy + Math.sin(needleAngle) * (r - 8);
  const latencyText = latencyMs != null ? `${latencyMs}ms` : '';

  return `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-label="${escapeHtml(label)}">` +
    `<path d="${arc(cx, cy, r, startAngle, 2 * Math.PI)}" fill="none" stroke="${trackStroke}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="${arc(cx, cy, r, startAngle, needleAngle)}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" style="filter:drop-shadow(0 0 4px ${color}60)"/>` +
    ticks +
    `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="1" fill="${dotFill}"/>` +
    (latencyText ? `<text x="${cx}" y="${cy - r - 6}" text-anchor="middle" fill="${color}" font-family="var(--font-mono)" font-size="7" font-weight="600">${latencyText}</text>` : '') +
    '</svg>';
}

export function compassSVG(size: number): string {
  const light = document.body.classList.contains('mn-sugar') || document.body.classList.contains('mn-avorio');
  const bezelStart = light ? '#ddd' : '#666';
  const bezelEnd = light ? '#bbb' : '#1a1a1a';
  const face = light ? '#f0f0f4' : '#0d0d0d';
  const center = light ? '#e4e4ea' : '#1a1a1a';
  const minor = light ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.4)';
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">` +
    `<defs><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${bezelStart}"/><stop offset="100%" stop-color="${bezelEnd}"/></linearGradient>` +
    '<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFD85C"/><stop offset="50%" stop-color="#FFC72C"/><stop offset="100%" stop-color="#E8A838"/></linearGradient>' +
    '<linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></linearGradient>' +
    '<filter id="lg2"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    `<circle cx="32" cy="32" r="31" fill="url(#lb)" stroke="#555" stroke-width=".5"/>` +
    `<circle cx="32" cy="32" r="27" fill="${face}"/>` +
    '<g stroke="url(#lg)" stroke-width="1.5" stroke-linecap="round" filter="url(#lg2)">' +
    '<line x1="32" y1="6" x2="32" y2="11"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(90,32,32)"/>' +
    '<line x1="32" y1="6" x2="32" y2="11" transform="rotate(180,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(270,32,32)"/></g>' +
    `<g stroke="${minor}" stroke-width="1" stroke-linecap="round">` +
    '<line x1="32" y1="6" x2="32" y2="10" transform="rotate(45,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(135,32,32)"/>' +
    '<line x1="32" y1="6" x2="32" y2="10" transform="rotate(225,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(315,32,32)"/></g>' +
    '<text x="32" y="16" text-anchor="middle" dominant-baseline="middle" fill="#FFC72C" font-family="\'Barlow Condensed\',sans-serif" font-weight="700" font-size="7" filter="url(#lg2)">N</text>' +
    '<polygon points="32,10 29,32 32,30 35,32" fill="url(#ln)" filter="url(#lg2)"/>' +
    '<polygon points="32,54 29,32 32,34 35,32" fill="#999"/>' +
    `<circle cx="32" cy="32" r="4" fill="url(#lg)" filter="url(#lg2)"/><circle cx="32" cy="32" r="2" fill="${center}"/></svg>`;
}

export function createServiceCard(check: LoginServiceCheck): HTMLDivElement {
  const card = createElement('div', 'mn-login__service');
  const gaugeWrap = createElement('div', 'mn-login__service-gauge');
  gaugeWrap.innerHTML = miniGaugeSVG(check.status, check.latency_ms, check.name);
  const info = createElement('div', 'mn-login__service-info');
  const name = createElement('div', 'mn-login__service-name', { text: check.name.toUpperCase() });
  const statusEl = createElement('div', `mn-login__service-status mn-login__service-status--${check.status}`, {
    text: STATUS_LABELS[check.status] ?? check.status,
  });
  info.appendChild(name);
  info.appendChild(statusEl);
  card.appendChild(gaugeWrap);
  card.appendChild(info);
  return card as HTMLDivElement;
}

export { STATUS_COLORS, STATUS_LABELS };
