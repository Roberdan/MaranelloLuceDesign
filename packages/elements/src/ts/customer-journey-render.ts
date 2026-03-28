/**
 * Maranello Luce Design - Customer Journey Render
 * DOM building helpers for phase columns, cards, and SVG connectors.
 */
import { escapeHtml } from './core/sanitize';
import { journeyInitials } from './customer-journey';
import type {
  JourneyPhase, JourneyEngagement, CustomerJourneyOptions,
  EngagementType, EngagementStatus,
} from './customer-journey';

const STATUS_LABELS: Record<EngagementStatus, string> = {
  completed: 'Completed',
  active: 'Active',
  pending: 'Pending',
  blocked: 'Blocked',
};

/** Build a single engagement card element. */
function buildCard(
  eng: JourneyEngagement,
  typeIcons: Record<EngagementType, string>,
  ac: AbortController,
): HTMLElement {
  const card = document.createElement('div');
  card.className = `mn-journey__card mn-journey__card--${eng.status}`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.dataset.id = eng.id;
  if (eng.date) card.dataset.date = eng.date;
  if (eng.assignee) card.dataset.assignee = eng.assignee;

  /* Avatar */
  const avatar = document.createElement('div');
  avatar.className = 'mn-journey__avatar';
  if (eng.avatar) {
    const img = document.createElement('img');
    img.src = eng.avatar;
    img.alt = eng.assignee ? escapeHtml(eng.assignee) : '';
    img.className = 'mn-journey__avatar-img';
    avatar.appendChild(img);
  } else {
    avatar.textContent = eng.assignee ? journeyInitials(eng.assignee) : '?';
  }
  card.appendChild(avatar);

  /* Body */
  const body = document.createElement('div');
  body.className = 'mn-journey__card-body';

  const title = document.createElement('span');
  title.className = 'mn-journey__title';
  title.textContent = escapeHtml(eng.title);
  body.appendChild(title);

  /* Status badge */
  const badge = document.createElement('span');
  badge.className = `mn-journey__badge mn-journey__badge--${eng.status}`;
  badge.textContent = STATUS_LABELS[eng.status];
  badge.setAttribute('aria-label', STATUS_LABELS[eng.status]);
  body.appendChild(badge);

  /* Type icon */
  const typeEl = document.createElement('span');
  typeEl.className = `mn-journey__type mn-journey__type--${eng.type}`;
  typeEl.textContent = typeIcons[eng.type] ?? '';
  typeEl.setAttribute('aria-label', eng.type);
  body.appendChild(typeEl);

  card.appendChild(body);
  return card;
}

/** Build a phase column with its heading and cards. */
function buildPhase(
  phase: JourneyPhase,
  typeIcons: Record<EngagementType, string>,
  ac: AbortController,
): HTMLElement {
  const col = document.createElement('div');
  col.className = 'mn-journey__phase';
  col.setAttribute('role', 'group');
  col.setAttribute('aria-label', phase.label);

  const heading = document.createElement('div');
  heading.className = 'mn-journey__phase-label';
  heading.textContent = escapeHtml(phase.label);
  col.appendChild(heading);

  for (const eng of phase.engagements) {
    col.appendChild(buildCard(eng, typeIcons, ac));
  }
  return col;
}

/** Render all phase columns into the container. */
export function renderJourneyPhases(
  el: HTMLElement,
  phases: JourneyPhase[],
  opts: CustomerJourneyOptions,
  ac: AbortController,
  typeIcons: Record<EngagementType, string>,
): void {
  for (const phase of phases) {
    el.appendChild(buildPhase(phase, typeIcons, ac));
  }
}

/** Draw SVG connector lines between adjacent phases. */
export function drawConnectors(el: HTMLElement, _phases: JourneyPhase[]): void {
  const phaseEls = el.querySelectorAll<HTMLElement>('.mn-journey__phase');
  if (phaseEls.length < 2) return;

  const elRect = el.getBoundingClientRect();
  const w = el.scrollWidth;
  const h = el.scrollHeight;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('mn-journey__connectors');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  /* Arrow marker */
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'mn-journey-arrow');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '6');
  marker.setAttribute('refX', '8');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');
  const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowPath.setAttribute('d', 'M0,0 L8,3 L0,6 Z');
  arrowPath.style.fill = 'var(--mn-info)';
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);

  /* Lines from last card of phase N to first card of phase N+1 */
  for (let i = 0; i < phaseEls.length - 1; i++) {
    const srcCards = phaseEls[i].querySelectorAll<HTMLElement>('.mn-journey__card');
    const dstCards = phaseEls[i + 1].querySelectorAll<HTMLElement>('.mn-journey__card');
    if (!srcCards.length || !dstCards.length) continue;

    const src = srcCards[srcCards.length - 1].getBoundingClientRect();
    const dst = dstCards[0].getBoundingClientRect();

    const x1 = src.right - elRect.left + el.scrollLeft;
    const y1 = src.top + src.height / 2 - elRect.top + el.scrollTop;
    const x2 = dst.left - elRect.left + el.scrollLeft;
    const y2 = dst.top + dst.height / 2 - elRect.top + el.scrollTop;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.classList.add('mn-journey__connector-line');
    line.setAttribute('x1', String(x1));
    line.setAttribute('y1', String(y1));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.style.stroke = 'var(--mn-info)';
    line.setAttribute('stroke-dasharray', '6 4');
    line.setAttribute('stroke-width', '2.5');
    line.setAttribute('marker-end', 'url(#mn-journey-arrow)');
    svg.appendChild(line);
  }

  el.appendChild(svg);
}
