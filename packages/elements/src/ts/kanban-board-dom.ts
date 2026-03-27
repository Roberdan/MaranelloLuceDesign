/** Maranello Luce Design - Kanban board DOM rendering */
import type { KanbanColumn, KanbanCard } from './kanban-board';

/** Render the full kanban board into a container element. */
export function renderBoard(
  container: HTMLElement, columns: KanbanColumn[], cards: KanbanCard[],
): void {
  const board = document.createElement('div');
  board.className = 'mn-kanban';
  for (const col of columns) {
    const colEl = document.createElement('div');
    colEl.className = 'mn-kanban__column';
    colEl.setAttribute('data-column-id', col.id);
    const header = document.createElement('div');
    header.className = 'mn-kanban__column-header';
    const titleSpan = document.createElement('span');
    titleSpan.textContent = (col.title);
    const colCards = cards.filter(c => c.columnId === col.id);
    const countBadge = document.createElement('span');
    countBadge.className = 'mn-kanban__column-count';
    countBadge.textContent = String(colCards.length);
    header.appendChild(titleSpan);
    header.appendChild(countBadge);
    colEl.appendChild(header);
    const cc = document.createElement('div');
    cc.className = 'mn-kanban__cards';
    cc.setAttribute('role', 'listbox');
    cc.setAttribute('aria-label', col.title);
    for (const card of colCards) cc.appendChild(renderCard(card));
    colEl.appendChild(cc);
    board.appendChild(colEl);
  }
  container.appendChild(board);
}

/** Render a single kanban card element. All user text is escaped. */
export function renderCard(card: KanbanCard): HTMLElement {
  const el = document.createElement('div');
  el.className = 'mn-kanban__card';
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'option');
  el.setAttribute('aria-grabbed', 'false');
  el.setAttribute('data-card-id', card.id);
  if (card.priority) {
    const prio = document.createElement('span');
    prio.className = 'mn-kanban__card-priority mn-kanban__card-priority--' + card.priority;
    el.appendChild(prio);
  }
  const title = document.createElement('div');
  title.className = 'mn-kanban__card-title';
  title.textContent = (card.title);
  el.appendChild(title);
  if (card.subtitle) {
    const sub = document.createElement('div');
    sub.className = 'mn-kanban__card-subtitle';
    sub.textContent = (card.subtitle);
    el.appendChild(sub);
  }
  if (card.tags && card.tags.length > 0) {
    const wrap = document.createElement('div');
    wrap.className = 'mn-kanban__card-tags';
    for (const tag of card.tags) {
      const t = document.createElement('span');
      t.className = 'mn-kanban__card-tag';
      t.textContent = (tag);
      wrap.appendChild(t);
    }
    el.appendChild(wrap);
  }
  return el;
}

/** Update a card's DOM content by data-card-id. */
export function updateCardDom(
  container: HTMLElement, cardId: string, updates: Partial<KanbanCard>,
): void {
  const cardEl = container.querySelector('[data-card-id="' + cardId + '"]');
  if (!cardEl) { console.warn('kanban: card not found in DOM: ' + cardId); return; }
  if (updates.title !== undefined) {
    const titleEl = cardEl.querySelector('.mn-kanban__card-title');
    if (titleEl) titleEl.textContent = (updates.title);
  }
  if (updates.subtitle !== undefined) {
    let subEl = cardEl.querySelector('.mn-kanban__card-subtitle');
    if (updates.subtitle) {
      if (!subEl) {
        subEl = document.createElement('div');
        subEl.className = 'mn-kanban__card-subtitle';
        const titleEl = cardEl.querySelector('.mn-kanban__card-title');
        if (titleEl && titleEl.nextSibling) cardEl.insertBefore(subEl, titleEl.nextSibling);
        else cardEl.appendChild(subEl);
      }
      subEl.textContent = (updates.subtitle);
    } else if (subEl) { subEl.remove(); }
  }
  if (updates.priority !== undefined) {
    let prioEl = cardEl.querySelector('.mn-kanban__card-priority');
    if (updates.priority) {
      if (!prioEl) { prioEl = document.createElement('span'); cardEl.insertBefore(prioEl, cardEl.firstChild); }
      prioEl.className = 'mn-kanban__card-priority mn-kanban__card-priority--' + updates.priority;
    } else if (prioEl) { prioEl.remove(); }
  }
  if (updates.tags !== undefined) {
    let wrap = cardEl.querySelector('.mn-kanban__card-tags');
    if (updates.tags && updates.tags.length > 0) {
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'mn-kanban__card-tags'; cardEl.appendChild(wrap); }
      wrap.innerHTML = '';
      for (const tag of updates.tags) {
        const t = document.createElement('span');
        t.className = 'mn-kanban__card-tag';
        t.textContent = (tag);
        wrap.appendChild(t);
      }
    } else if (wrap) { wrap.remove(); }
  }
}

/** Remove a card element from the DOM and update its column count. */
export function removeCardDom(container: HTMLElement, cardId: string): void {
  const cardEl = container.querySelector('[data-card-id="' + cardId + '"]');
  if (!cardEl) { console.warn('kanban: card not found for removal: ' + cardId); return; }
  const colEl = cardEl.closest('.mn-kanban__column');
  cardEl.remove();
  if (colEl) {
    const colId = colEl.getAttribute('data-column-id');
    if (colId) updateColumnCount(container, colId, colEl.querySelectorAll('.mn-kanban__card').length);
  }
}

/** Move a card element to a target column at the given position. */
export function moveCardDom(
  container: HTMLElement, cardId: string, toColId: string, position?: number,
): void {
  const cardEl = container.querySelector('[data-card-id="' + cardId + '"]');
  if (!cardEl) { console.warn('kanban: card not found for move: ' + cardId); return; }
  const sourceCol = cardEl.closest('.mn-kanban__column');
  const targetCol = container.querySelector('[data-column-id="' + toColId + '"]');
  if (!targetCol) { console.warn('kanban: target column not found: ' + toColId); return; }
  const targetCards = targetCol.querySelector('.mn-kanban__cards');
  if (!targetCards) return;
  cardEl.remove();
  if (position !== undefined && position >= 0) {
    const children = targetCards.querySelectorAll('.mn-kanban__card');
    if (position < children.length) targetCards.insertBefore(cardEl, children[position]);
    else targetCards.appendChild(cardEl);
  } else { targetCards.appendChild(cardEl); }
  if (sourceCol) {
    const srcId = sourceCol.getAttribute('data-column-id');
    if (srcId) updateColumnCount(container, srcId, sourceCol.querySelectorAll('.mn-kanban__card').length);
  }
  updateColumnCount(container, toColId, targetCol.querySelectorAll('.mn-kanban__card').length);
}

/** Update the column count badge for a given column. */
export function updateColumnCount(container: HTMLElement, colId: string, count: number): void {
  const colEl = container.querySelector('[data-column-id="' + colId + '"]');
  if (!colEl) return;
  const badge = colEl.querySelector('.mn-kanban__column-count');
  if (badge) badge.textContent = String(count);
}
