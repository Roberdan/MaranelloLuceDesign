/**
 * Maranello Luce Design - Kanban board headless controller
 * Factory function that wires state management, DOM rendering, and drag-drop.
 */
import {
  renderBoard,
  renderCard,
  updateCardDom,
  removeCardDom,
  moveCardDom,
  updateColumnCount,
} from './kanban-board-dom';
import { initDrag } from './kanban-board-drag';
import type { DragController } from './kanban-board-drag';

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface KanbanOptions {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onMove?: (cardId: string, fromCol: string, toCol: string, position: number) => void;
  onCardClick?: (card: KanbanCard) => void;
}

export interface KanbanController {
  /** Add a new card to the board. */
  addCard(card: KanbanCard): void;
  /** Remove a card by id. */
  removeCard(cardId: string): void;
  /** Move a card to a different column at an optional position. */
  moveCard(cardId: string, toCol: string, position?: number): void;
  /** Update card fields by id. */
  updateCard(cardId: string, updates: Partial<KanbanCard>): void;
  /** Get a frozen deep copy of current state. */
  getState(): { columns: KanbanColumn[]; cards: KanbanCard[] };
  /** Tear down the board, remove listeners, clear DOM. */
  destroy(): void;
}

/** Deep-copy an array of plain objects (Safari-safe, no structuredClone). */
function deepCopy<T>(arr: T[]): T[] {
  return JSON.parse(JSON.stringify(arr)) as T[];
}

/**
 * Create a kanban board instance.
 * @param container - An HTMLElement or a string element id.
 * @param opts - Board configuration with columns, cards, and callbacks.
 * @returns A controller for managing the board programmatically.
 */
export function kanbanBoard(
  container: HTMLElement | string,
  opts: KanbanOptions,
): KanbanController {
  const el = typeof container === 'string'
    ? document.getElementById(container)
    : container;

  if (!el) {
    throw new Error('kanban: container not found: ' + String(container));
  }

  /* Internal state — deep copy to decouple from caller */
  const columns: KanbanColumn[] = deepCopy(opts.columns);
  let cards: KanbanCard[] = deepCopy(opts.cards);

  /* Fail-loud on empty data */
  if (columns.length === 0) {
    console.warn('kanban: columns array is empty — board will be blank');
  }
  if (cards.length === 0) {
    console.warn('kanban: cards array is empty — board has no cards');
  }

  /** Reorder internal cards array to match DOM position after a move. */
  function reorderCard(cardId: string, toCol: string, position: number): void {
    const idx = cards.findIndex(c => c.id === cardId);
    if (idx === -1) return;
    const [moved] = cards.splice(idx, 1);
    /* Find insertion index among cards in the target column */
    const colCards = cards.filter(c => c.columnId === toCol);
    const insertAfter = position >= 0 && position < colCards.length
      ? colCards[position] : null;
    if (insertAfter) {
      const targetIdx = cards.indexOf(insertAfter);
      cards.splice(targetIdx, 0, moved);
    } else {
      cards.push(moved);
    }
  }

  /* Render initial DOM */
  renderBoard(el, columns, cards);

  /* Wire drag-drop */
  let drag: DragController | null = initDrag(el, {
    onMove(cardId, fromCol, toCol, position) {
      /* Update internal state */
      const card = cards.find(c => c.id === cardId);
      if (card) {
        card.columnId = toCol;
        reorderCard(cardId, toCol, position);
      }
      /* Update DOM */
      moveCardDom(el, cardId, toCol, position);
      /* Notify consumer */
      if (opts.onMove) opts.onMove(cardId, fromCol, toCol, position);
    },
  });

  /* Event delegation for card clicks */
  function onContainerClick(e: Event): void {
    if (!opts.onCardClick) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const cardEl = target.closest('.mn-kanban__card') as HTMLElement | null;
    if (!cardEl) return;
    const cardId = cardEl.getAttribute('data-card-id');
    if (!cardId) return;
    const card = cards.find(c => c.id === cardId);
    if (card) {
      /* Return a copy so consumers cannot mutate internal state */
      opts.onCardClick(JSON.parse(JSON.stringify(card)) as KanbanCard);
    }
  }
  el.addEventListener('click', onContainerClick);

  return {
    addCard(card: KanbanCard): void {
      const copy = JSON.parse(JSON.stringify(card)) as KanbanCard;
      cards.push(copy);
      /* Render into DOM */
      const colEl = el.querySelector(
        '[data-column-id="' + copy.columnId + '"] .mn-kanban__cards',
      );
      if (colEl) {
        colEl.appendChild(renderCard(copy));
        const count = colEl.querySelectorAll('.mn-kanban__card').length;
        updateColumnCount(el, copy.columnId, count);
      } else {
        console.warn('kanban: column not found for card: ' + copy.columnId);
      }
    },

    removeCard(cardId: string): void {
      const idx = cards.findIndex(c => c.id === cardId);
      if (idx === -1) {
        console.warn('kanban: card not found: ' + cardId);
        return;
      }
      cards.splice(idx, 1);
      removeCardDom(el, cardId);
    },

    moveCard(cardId: string, toCol: string, position?: number): void {
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        console.warn('kanban: card not found for move: ' + cardId);
        return;
      }
      const fromCol = card.columnId;
      card.columnId = toCol;
      reorderCard(cardId, toCol, position ?? -1);
      moveCardDom(el, cardId, toCol, position);
      if (opts.onMove) opts.onMove(cardId, fromCol, toCol, position ?? -1);
    },

    updateCard(cardId: string, updates: Partial<KanbanCard>): void {
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        console.warn('kanban: card not found for update: ' + cardId);
        return;
      }
      /* If columnId changed, delegate to moveCard for DOM + state consistency */
      if (updates.columnId !== undefined && updates.columnId !== card.columnId) {
        const toCol = updates.columnId;
        /* Apply non-columnId updates first */
        if (updates.title !== undefined) card.title = updates.title;
        if (updates.subtitle !== undefined) card.subtitle = updates.subtitle;
        if (updates.tags !== undefined) card.tags = updates.tags ? [...updates.tags] : undefined;
        if (updates.priority !== undefined) card.priority = updates.priority;
        updateCardDom(el, cardId, updates);
        const fromCol = card.columnId;
        card.columnId = toCol;
        reorderCard(cardId, toCol, -1);
        moveCardDom(el, cardId, toCol);
        if (opts.onMove) opts.onMove(cardId, fromCol, toCol, -1);
        return;
      }
      /* Apply updates to internal state */
      if (updates.title !== undefined) card.title = updates.title;
      if (updates.subtitle !== undefined) card.subtitle = updates.subtitle;
      if (updates.tags !== undefined) card.tags = updates.tags ? [...updates.tags] : undefined;
      if (updates.priority !== undefined) card.priority = updates.priority;
      /* Update DOM */
      updateCardDom(el, cardId, updates);
    },

    getState(): { columns: KanbanColumn[]; cards: KanbanCard[] } {
      return Object.freeze({
        columns: deepCopy(columns),
        cards: deepCopy(cards),
      });
    },

    destroy(): void {
      if (drag) {
        drag.destroy();
        drag = null;
      }
      el.removeEventListener('click', onContainerClick);
      el.innerHTML = '';
    },
  };
}
