/**
 * Maranello Luce Design - RAG Source Citation Cards
 * Renders a list of source citation cards for retrieval-augmented generation.
 */

import { escapeHtml } from './core/sanitize';

export interface SourceCard {
  id: string;
  title: string;
  excerpt?: string;
  source?: string;
  score?: number;
  date?: string;
  badge?: string;
  action?: { label: string; onClick: () => void };
}

export interface SourceCardsOptions {
  onSelect?: (card: SourceCard) => void;
  maxVisible?: number;
  layout?: 'list' | 'grid';
}

export interface SourceCardsController {
  update: (cards: SourceCard[]) => void;
  destroy: () => void;
}

/** Score tier thresholds for visual styling. */
function scoreClass(score: number): string {
  if (score >= 0.8) return 'mn-source-card__score--high';
  if (score >= 0.5) return 'mn-source-card__score--mid';
  return 'mn-source-card__score--low';
}

/** Format a 0-1 score as a percentage string. */
function formatScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}

/** Create a single source card article element. */
function buildCard(
  card: SourceCard,
  onSelect?: (card: SourceCard) => void,
): HTMLElement {
  const article = document.createElement('article');
  article.className = 'mn-source-card';
  article.tabIndex = 0;
  article.dataset.id = card.id;

  const ariaParts = [escapeHtml(card.title)];
  if (card.score !== undefined) {
    ariaParts.push(`relevance ${formatScore(card.score)}`);
  }
  article.setAttribute('aria-label', ariaParts.join(' - '));

  /* Header with badge + score */
  if (card.badge || card.score !== undefined) {
    const header = document.createElement('header');
    header.className = 'mn-source-card__header';

    if (card.badge) {
      const badge = document.createElement('span');
      badge.className = 'mn-source-card__badge mn-badge';
      badge.textContent = card.badge;
      header.appendChild(badge);
    }

    if (card.score !== undefined) {
      const score = document.createElement('span');
      const pct = formatScore(card.score);
      score.className = `mn-source-card__score ${scoreClass(card.score)}`;
      score.textContent = pct;
      score.setAttribute('aria-label', `Relevance: ${pct}`);
      header.appendChild(score);
    }

    article.appendChild(header);
  }

  /* Title */
  const title = document.createElement('h4');
  title.className = 'mn-source-card__title';
  title.textContent = card.title;
  article.appendChild(title);

  /* Excerpt */
  if (card.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.className = 'mn-source-card__excerpt';
    excerpt.textContent = card.excerpt;
    article.appendChild(excerpt);
  }

  /* Footer with source + date */
  if (card.source || card.date) {
    const footer = document.createElement('footer');
    footer.className = 'mn-source-card__footer';

    if (card.source) {
      const src = document.createElement('span');
      src.className = 'mn-source-card__source';
      src.textContent = card.source;
      footer.appendChild(src);
    }

    if (card.date) {
      const date = document.createElement('span');
      date.className = 'mn-source-card__date';
      date.textContent = card.date;
      footer.appendChild(date);
    }

    article.appendChild(footer);
  }

  /* Action button */
  if (card.action) {
    const btn = document.createElement('button');
    btn.className = 'mn-btn mn-btn--ghost mn-source-card__action';
    btn.textContent = card.action.label;
    btn.setAttribute(
      'aria-label',
      `${card.action.label} for ${escapeHtml(card.title)}`,
    );
    const handler = card.action.onClick;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handler();
    });
    article.appendChild(btn);
  }

  /* Click / keyboard selection */
  if (onSelect) {
    article.addEventListener('click', () => onSelect(card));
    article.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(card);
      }
    });
  }

  return article;
}

/** Create the "Show N more" toggle button. */
function buildShowMore(
  count: number,
  onClick: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'mn-source-cards__show-more';
  btn.textContent = `Show ${count} more`;
  btn.setAttribute('aria-label', `Show ${count} more source citations`);
  btn.addEventListener('click', onClick);
  return btn;
}

/**
 * Render source citation cards into a container.
 * All user-provided strings are set via textContent (XSS-safe).
 */
export function renderSourceCards(
  container: HTMLElement,
  cards: SourceCard[],
  opts?: SourceCardsOptions,
): SourceCardsController {
  const layout = opts?.layout ?? 'list';
  const maxVisible = opts?.maxVisible;
  const onSelect = opts?.onSelect;

  function render(data: SourceCard[]): void {
    container.innerHTML = '';
    container.className = `mn-source-cards mn-source-cards--${layout}`;
    container.setAttribute('role', 'list');
    container.setAttribute('aria-label', 'Source citations');

    const limit = maxVisible && maxVisible < data.length
      ? maxVisible
      : data.length;

    for (let i = 0; i < limit; i++) {
      const el = buildCard(data[i], onSelect);
      el.setAttribute('role', 'listitem');
      container.appendChild(el);
    }

    if (maxVisible && maxVisible < data.length) {
      const remaining = data.length - maxVisible;
      const showMoreBtn = buildShowMore(remaining, () => {
        showMoreBtn.remove();
        for (let i = limit; i < data.length; i++) {
          const el = buildCard(data[i], onSelect);
          el.setAttribute('role', 'listitem');
          container.appendChild(el);
        }
      });
      container.appendChild(showMoreBtn);
    }
  }

  render(cards);

  return {
    update(newCards: SourceCard[]): void {
      render(newCards);
    },
    destroy(): void {
      container.innerHTML = '';
      container.className = '';
      container.removeAttribute('role');
      container.removeAttribute('aria-label');
    },
  };
}
