/**
 * Maranello Luce Design - OKR Panel: Cards & Rendering
 * Data normalization, summary cards, objective cards, key result rows.
 * @version 2.0.0
 */
import { clamp } from './core/utils';
import { isValidColor } from './core/sanitize';
import {
  type OkrStatus, type OkrScope, type KeyResultInput, type ObjectiveInput,
  type Objective, type OkrStats,
  STATUS_COLORS, SCOPE_COLORS,
  safeNumber, pct, statusFromProgress, statusLabel, formatKR,
  el, ringTemplate, heroGaugeSVG,
} from './okr-panel-utils';

export function normalizeObjective(item: ObjectiveInput | undefined): Objective {
  const obj = item || {} as ObjectiveInput;
  const progress = clamp(safeNumber(obj.progress), 0, 100);
  const status: OkrStatus = obj.status || statusFromProgress(progress);
  const keyResults = Array.isArray(obj.keyResults) ? obj.keyResults : [];
  return {
    title: obj.title || 'Untitled objective',
    scope: obj.scope || 'LOCAL',
    progress, status, keyResults,
  };
}

export function calculateStats(objectives: Objective[]): OkrStats {
  const counts = { 'on-track': 0, 'at-risk': 0, behind: 0 } as Record<OkrStatus, number>;
  let total = 0;
  objectives.forEach((o) => {
    counts[statusFromProgress(o.progress)] += 1;
    total += o.progress;
  });
  const average = objectives.length ? total / objectives.length : 0;
  return { counts, average: clamp(average, 0, 100) };
}

export function createSummaryCard(
  status: OkrStatus, count: number, description: string, total: number,
): HTMLDivElement {
  const rawColor = STATUS_COLORS[status] || '#00A651';
  const color = isValidColor(rawColor) ? rawColor : '#00A651';
  const p = total > 0 ? (count / total) * 100 : 0;
  const card = el('div', `mn-okr__summary-card mn-okr__summary-card--${status}`) as HTMLDivElement;
  const arcWrap = el('div', 'mn-okr__summary-arc') as HTMLDivElement;
  const sz = 64, sw = 5, r = (sz - sw) / 2, cx = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (p / 100) * circ;
  arcWrap.innerHTML =
    `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}">` +
    `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>` +
    `<circle class="mn-okr__summary-ring" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" ` +
    `stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}" ` +
    `data-target="${offset.toFixed(1)}" transform="rotate(-90,${cx},${cx})" ` +
    `style="filter:drop-shadow(0 0 6px ${color}40);transition:stroke-dashoffset 900ms cubic-bezier(0.2,1,0.2,1)"/>` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="${color}" ` +
    `font-family="var(--font-mono)" font-size="18" font-weight="700">${count}</text></svg>`;
  const info = el('div', 'mn-okr__summary-info') as HTMLDivElement;
  const head = el('div', 'mn-okr__summary-head') as HTMLDivElement;
  head.appendChild(el('span', `mn-okr__status-dot mn-okr__status-dot--${status}`));
  head.appendChild(el('span', 'mn-okr__summary-label', { text: statusLabel(status) }));
  info.appendChild(head);
  info.appendChild(el('div', 'mn-okr__summary-threshold', { text: description }));
  card.appendChild(arcWrap);
  card.appendChild(info);
  return card;
}

export function createHero(stats: OkrStats, period: string): HTMLElement {
  const status = statusFromProgress(stats.average);
  const rawHeroColor = STATUS_COLORS[status];
  const color = isValidColor(rawHeroColor) ? rawHeroColor : '#00A651';
  const section = el('section', 'mn-okr__hero');
  const gaugeBlock = el('div', 'mn-okr__gauge-wrap') as HTMLDivElement;
  gaugeBlock.innerHTML = heroGaugeSVG(stats.average, color);
  const gaugeValue = el('div', 'mn-okr__gauge-value', { text: Math.round(stats.average) + '%' });
  (gaugeValue as HTMLElement).style.color = color;
  gaugeBlock.appendChild(gaugeValue);
  const avgBlock = el('div', 'mn-okr__average') as HTMLDivElement;
  avgBlock.appendChild(el('div', 'mn-okr__average-label', { text: 'Average completion' }));
  const avgVal = el('div', 'mn-okr__average-value', { text: Math.round(stats.average) + '%' });
  (avgVal as HTMLElement).style.color = color;
  avgBlock.appendChild(avgVal);
  const badge = el('div', `mn-okr__status-badge mn-okr__status-badge--${status}`, { text: statusLabel(status) });
  (badge as HTMLElement).style.setProperty('--badge-color', color);
  avgBlock.appendChild(badge);
  avgBlock.appendChild(el('span', 'mn-okr__period-tag', { text: period || 'Current period' }));
  section.appendChild(gaugeBlock);
  section.appendChild(avgBlock);
  return section;
}

export function createKRRow(kr: KeyResultInput, objectiveStatus: OkrStatus): HTMLLIElement {
  const current = safeNumber(kr.current), target = safeNumber(kr.target);
  const completion = pct(current, target);
  const status = statusFromProgress(completion);
  const row = el('li', 'mn-okr__kr') as HTMLLIElement;
  const top = el('div', 'mn-okr__kr-head') as HTMLDivElement;
  top.appendChild(el('span', 'mn-okr__kr-title', { text: kr.title || 'Untitled KR' }));
  top.appendChild(el('span', 'mn-okr__kr-metric', { text: formatKR(current, target, kr.unit || '') }));
  const track = el('div', 'mn-okr__kr-track') as HTMLDivElement;
  const bar = el('div', `mn-okr__kr-bar mn-okr__kr-bar--${status}`) as HTMLDivElement;
  bar.dataset.target = completion.toFixed(2);
  bar.style.width = '0%';
  track.appendChild(bar);
  row.appendChild(top);
  row.appendChild(track);
  if (objectiveStatus === 'behind') row.classList.add('mn-okr__kr--urgent');
  return row;
}

export function createObjectiveCard(objective: Objective, index: number): HTMLElement {
  const scopeColor = SCOPE_COLORS[objective.scope] ||
    (getComputedStyle(document.documentElement).getPropertyValue('--scope-local').trim() || '#4EA8DE');
  const status: OkrStatus =
    objective.status in STATUS_COLORS ? objective.status : statusFromProgress(objective.progress);
  const card = el('article', `mn-okr__objective mn-okr__objective--${status}`, {
    role: 'article', 'aria-label': `${objective.title} status ${status.replace('-', ' ')}`,
  });
  (card as HTMLElement).style.setProperty('--mn-okr-scope', scopeColor);
  (card as HTMLElement).style.setProperty('--mn-okr-status', STATUS_COLORS[status]);
  (card as HTMLElement).style.animationDelay = index * 45 + 'ms';
  const header = el('div', 'mn-okr__objective-header') as HTMLDivElement;
  const left = el('div', 'mn-okr__objective-main') as HTMLDivElement;
  left.appendChild(el('span', 'mn-okr__scope-badge', { text: objective.scope }));
  left.appendChild(el('h3', 'mn-okr__objective-title', { text: objective.title }));
  const right = el('div', 'mn-okr__objective-ring-wrap') as HTMLDivElement;
  right.innerHTML = ringTemplate(
    56, 6, objective.progress, STATUS_COLORS[status],
    Math.round(objective.progress) + '%', 'mn-okr__ring-track', 'mn-okr__ring-progress',
  );
  header.appendChild(left);
  header.appendChild(right);
  const krList = el('ul', 'mn-okr__kr-list') as HTMLUListElement;
  objective.keyResults.forEach((kr) => krList.appendChild(createKRRow(kr, status)));
  card.appendChild(header);
  card.appendChild(krList);
  return card;
}
