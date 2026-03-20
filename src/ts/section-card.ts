/**
 * Maranello Luce Design - Section Card
 * Generic content card with title, optional action link, and body slot.
 */
import { escapeHtml } from './core/sanitize';

export interface SectionCardOpts {
  title: string;
  action?: { label: string; href?: string; onClick?: () => void };
  padding?: boolean;
  variant?: 'default' | 'flat';
  className?: string;
}

export interface SectionCardController {
  bodyEl: HTMLElement;
  setTitle: (t: string) => void;
  setAction: (a: SectionCardOpts['action']) => void;
}

let idCounter = 0;

/** Build or replace the action element inside the header. */
function renderAction(
  header: HTMLElement,
  action: SectionCardOpts['action'],
  ac: AbortController,
): void {
  header.querySelector('.mn-section-card__action')?.remove();
  if (!action) return;

  const el = document.createElement(action.href ? 'a' : 'button');
  el.className = 'mn-section-card__action';
  el.textContent = escapeHtml(action.label);

  if (action.href && el instanceof HTMLAnchorElement) {
    el.href = action.href;
  }
  if (action.onClick) {
    el.addEventListener('click', (e) => {
      if (!action.href) e.preventDefault();
      action.onClick!();
    }, { signal: ac.signal });
  }
  if (el instanceof HTMLButtonElement) {
    el.type = 'button';
  }
  header.appendChild(el);
}

/**
 * Create a section card inside a container element.
 * Renders a titled card with optional action link and a body slot.
 */
export function sectionCard(
  el: HTMLElement,
  opts: SectionCardOpts,
): SectionCardController {
  const ac = new AbortController();
  const variant = opts.variant ?? 'default';
  const titleId = `mn-sc-title-${++idCounter}`;

  /* Root section */
  const section = document.createElement('section');
  section.className = `mn-section-card mn-section-card--${variant}`;
  if (opts.padding === false) section.classList.add('mn-section-card--no-padding');
  if (opts.className) section.classList.add(opts.className);
  section.setAttribute('role', 'region');
  section.setAttribute('aria-labelledby', titleId);

  /* Header */
  const header = document.createElement('header');
  header.className = 'mn-section-card__header';

  const h3 = document.createElement('h3');
  h3.className = 'mn-section-card__title';
  h3.id = titleId;
  h3.textContent = escapeHtml(opts.title);
  header.appendChild(h3);

  renderAction(header, opts.action, ac);
  section.appendChild(header);

  /* Body slot */
  const body = document.createElement('div');
  body.className = 'mn-section-card__body';
  section.appendChild(body);

  el.appendChild(section);

  return {
    bodyEl: body,
    setTitle(t: string) {
      h3.textContent = escapeHtml(t);
    },
    setAction(a: SectionCardOpts['action']) {
      renderAction(header, a, ac);
    },
  };
}
