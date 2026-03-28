/**
 * Maranello Luce Design - Customer Journey
 * Interactive swimlane visualization of client engagement history.
 * Headless: DOM-first, framework-agnostic, AbortController lifecycle.
 */
import { escapeHtml } from './core/sanitize';
import { renderJourneyPhases, drawConnectors } from './customer-journey-render';

export type EngagementStatus = 'completed' | 'active' | 'pending' | 'blocked';
export type EngagementType = 'opportunity' | 'contract' | 'ticket' | 'meeting' | 'task';

export interface JourneyEngagement {
  id: string;
  title: string;
  avatar?: string;
  status: EngagementStatus;
  type: EngagementType;
  date?: string;
  assignee?: string;
  onClick?: () => void;
}

export interface JourneyPhase {
  id: string;
  label: string;
  engagements: JourneyEngagement[];
}

export interface CustomerJourneyOptions {
  orientation?: 'horizontal' | 'vertical';
  onSelect?: (engagement: JourneyEngagement) => void;
  showConnectors?: boolean;
  compactMode?: boolean;
}

export interface CustomerJourneyController {
  update: (phases: JourneyPhase[]) => void;
  selectEngagement: (id: string) => void;
  getSelected: () => string | null;
  destroy: () => void;
}

const TYPE_ICONS: Record<EngagementType, string> = {
  opportunity: '\u2605',  // star
  contract: '\u2709',     // envelope
  ticket: '\u2691',       // flag
  meeting: '\u260E',      // telephone
  task: '\u2713',         // check
};

/** Extract initials from a name (max 2 chars). */
export function journeyInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/** Navigate cards with keyboard inside the journey container. */
function setupKeyboard(
  el: HTMLElement,
  phases: JourneyPhase[],
  opts: CustomerJourneyOptions,
  ac: AbortController,
  selectFn: (id: string) => void,
): void {
  el.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('mn-journey__card')) return;

    const phaseEl = target.closest('.mn-journey__phase') as HTMLElement | null;
    if (!phaseEl) return;

    const allPhases = [...el.querySelectorAll<HTMLElement>('.mn-journey__phase')];
    const phaseIdx = allPhases.indexOf(phaseEl);
    const cards = [...phaseEl.querySelectorAll<HTMLElement>('.mn-journey__card')];
    const cardIdx = cards.indexOf(target);

    let next: HTMLElement | null = null;

    if (e.key === 'ArrowRight' && phaseIdx < allPhases.length - 1) {
      const nextCards = allPhases[phaseIdx + 1].querySelectorAll<HTMLElement>('.mn-journey__card');
      next = nextCards[0] ?? null;
    } else if (e.key === 'ArrowLeft' && phaseIdx > 0) {
      const prevCards = allPhases[phaseIdx - 1].querySelectorAll<HTMLElement>('.mn-journey__card');
      next = prevCards[0] ?? null;
    } else if (e.key === 'ArrowDown' && cardIdx < cards.length - 1) {
      next = cards[cardIdx + 1];
    } else if (e.key === 'ArrowUp' && cardIdx > 0) {
      next = cards[cardIdx - 1];
    } else if (e.key === 'Enter') {
      const id = target.dataset.id ?? '';
      selectFn(id);
      const eng = phases.flatMap(p => p.engagements).find(en => en.id === id);
      if (eng?.onClick) eng.onClick();
      if (eng && opts.onSelect) opts.onSelect(eng);
      return;
    }

    if (next) {
      e.preventDefault();
      next.focus();
    }
  }, { signal: ac.signal });
}

/** Show tooltip on card hover. */
function setupTooltip(el: HTMLElement, ac: AbortController): void {
  let tip: HTMLElement | null = null;

  el.addEventListener('pointerenter', (e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest?.('.mn-journey__card') as HTMLElement | null;
    if (!card) return;
    const date = card.dataset.date ?? '';
    const assignee = card.dataset.assignee ?? '';
    if (!date && !assignee) return;

    tip = document.createElement('div');
    tip.className = 'mn-journey__tooltip';
    const parts: string[] = [];
    if (assignee) parts.push(escapeHtml(assignee));
    if (date) parts.push(escapeHtml(date));
    tip.innerHTML = parts.join('<br>');
    card.appendChild(tip);
  }, { capture: true, signal: ac.signal });

  el.addEventListener('pointerleave', (e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest?.('.mn-journey__card') as HTMLElement | null;
    if (card && tip && card.contains(tip)) {
      tip.remove();
      tip = null;
    }
  }, { capture: true, signal: ac.signal });
}

/**
 * Create an interactive Customer Journey swimlane visualization.
 * Renders phase columns with engagement cards, SVG connectors, and keyboard nav.
 */
export function customerJourney(
  el: HTMLElement,
  phases: JourneyPhase[],
  opts?: CustomerJourneyOptions,
): CustomerJourneyController {
  const options: Required<CustomerJourneyOptions> = {
    orientation: 'horizontal',
    onSelect: () => {},
    showConnectors: true,
    compactMode: false,
    ...opts,
  };
  const ac = new AbortController();
  let selectedId: string | null = null;
  let currentPhases = [...phases];

  el.setAttribute('role', 'list');
  el.setAttribute('aria-label', 'Customer journey');
  el.classList.add('mn-journey');
  if (options.orientation === 'vertical') el.classList.add('mn-journey--vertical');
  if (options.compactMode) el.classList.add('mn-journey--compact');

  function render(): void {
    el.innerHTML = '';
    renderJourneyPhases(el, currentPhases, options, ac, TYPE_ICONS);
    if (options.showConnectors && currentPhases.length > 1) {
      drawConnectors(el, currentPhases);
    }
    if (selectedId) markSelected(selectedId);
  }

  function markSelected(id: string): void {
    el.querySelectorAll('.mn-journey__card--selected')
      .forEach(c => c.classList.remove('mn-journey__card--selected'));
    const card = el.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`);
    if (card) {
      card.classList.add('mn-journey__card--selected');
      card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  function selectEngagement(id: string): void {
    selectedId = id;
    markSelected(id);
  }

  /* Click handler for card selection */
  el.addEventListener('click', (e: MouseEvent) => {
    const card = (e.target as HTMLElement).closest?.('.mn-journey__card') as HTMLElement | null;
    if (!card) return;
    const id = card.dataset.id ?? '';
    selectEngagement(id);
    const eng = currentPhases.flatMap(p => p.engagements).find(en => en.id === id);
    if (eng?.onClick) eng.onClick();
    if (eng && opts?.onSelect) opts.onSelect(eng);
  }, { signal: ac.signal });

  setupKeyboard(el, currentPhases, options, ac, selectEngagement);
  setupTooltip(el, ac);
  render();

  return {
    update(newPhases: JourneyPhase[]) {
      currentPhases = [...newPhases];
      render();
    },
    selectEngagement,
    getSelected: () => selectedId,
    destroy() {
      ac.abort();
      el.innerHTML = '';
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      el.classList.remove('mn-journey', 'mn-journey--vertical', 'mn-journey--compact');
    },
  };
}
