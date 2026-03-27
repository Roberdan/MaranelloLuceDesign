/** Maranello Luce Design - Kanban board drag-drop logic */

export interface DragCallbacks {
  onMove: (cardId: string, fromCol: string, toCol: string, position: number) => void;
}
export interface DragController { destroy(): void; }

function getClientPoint(e: MouseEvent | TouchEvent): { x: number; y: number } {
  if ('touches' in e) {
    const touch = e.touches[0] ?? e.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function findCard(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  return target.closest('.mn-kanban__card') as HTMLElement | null;
}

function findColumnAtPoint(container: HTMLElement, x: number, y: number): HTMLElement | null {
  const cols = container.querySelectorAll('.mn-kanban__cards');
  for (let i = 0; i < cols.length; i++) {
    const r = (cols[i] as HTMLElement).getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return cols[i] as HTMLElement;
  }
  return null;
}

function getDropPosition(zone: HTMLElement, y: number): number {
  const cards = zone.querySelectorAll('.mn-kanban__card:not(.mn-kanban__card--ghost)');
  for (let i = 0; i < cards.length; i++) {
    const r = (cards[i] as HTMLElement).getBoundingClientRect();
    if (y < r.top + r.height / 2) return i;
  }
  return cards.length;
}

/** Initialize drag-drop on a kanban board container. */
export function initDrag(container: HTMLElement, callbacks: DragCallbacks): DragController {
  let dragCard: HTMLElement | null = null;
  let ghost: HTMLElement | null = null;
  let sourceColId = '';
  let activeDropZone: HTMLElement | null = null;
  let grabbedCard: HTMLElement | null = null;

  function startDrag(card: HTMLElement): void {
    dragCard = card;
    const col = card.closest('.mn-kanban__column');
    sourceColId = col ? (col.getAttribute('data-column-id') || '') : '';
    card.classList.add('mn-kanban__card--dragging');
    if (!prefersReducedMotion()) {
      ghost = document.createElement('div');
      ghost.className = 'mn-kanban__card mn-kanban__card--ghost';
      ghost.style.height = card.offsetHeight + 'px';
      if (card.parentElement) card.parentElement.insertBefore(ghost, card);
    }
  }

  function moveDrag(x: number, y: number): void {
    if (!dragCard) return;
    const zone = findColumnAtPoint(container, x, y);
    if (zone !== activeDropZone) {
      if (activeDropZone) activeDropZone.classList.remove('mn-kanban__drop-zone');
      activeDropZone = zone;
      if (activeDropZone) activeDropZone.classList.add('mn-kanban__drop-zone');
    }
  }

  function endDrag(_x: number, y: number): void {
    if (!dragCard) return;
    const cardId = dragCard.getAttribute('data-card-id') || '';
    dragCard.classList.remove('mn-kanban__card--dragging');
    if (ghost && ghost.parentElement) ghost.parentElement.removeChild(ghost);
    ghost = null;
    if (activeDropZone) {
      activeDropZone.classList.remove('mn-kanban__drop-zone');
      const tCol = activeDropZone.closest('.mn-kanban__column');
      const toColId = tCol ? (tCol.getAttribute('data-column-id') || '') : '';
      const pos = getDropPosition(activeDropZone, y);
      activeDropZone = null;
      if (toColId && cardId) callbacks.onMove(cardId, sourceColId, toColId, pos);
    } else { activeDropZone = null; }
    dragCard = null;
    sourceColId = '';
  }

  function cancelDrag(): void {
    if (dragCard) dragCard.classList.remove('mn-kanban__card--dragging');
    if (ghost && ghost.parentElement) ghost.parentElement.removeChild(ghost);
    ghost = null;
    if (activeDropZone) activeDropZone.classList.remove('mn-kanban__drop-zone');
    activeDropZone = null; dragCard = null; sourceColId = '';
  }

  function onPointerDown(e: MouseEvent | TouchEvent): void {
    const card = findCard(e.target);
    if (!card) return;
    e.preventDefault();
    startDrag(card);
  }
  function onPointerMove(e: MouseEvent | TouchEvent): void {
    if (!dragCard) return;
    const pt = getClientPoint(e);
    moveDrag(pt.x, pt.y);
  }
  function onPointerUp(e: MouseEvent | TouchEvent): void {
    if (!dragCard) return;
    const pt = getClientPoint(e);
    endDrag(pt.x, pt.y);
  }

  /* --- Keyboard handler --- */
  function onKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const card = findCard(target);
    if (!card) return;

    const cardId = card.getAttribute('data-card-id') || '';
    if (!cardId) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (grabbedCard === card) {
        /* Release: deselect */
        card.setAttribute('aria-grabbed', 'false');
        grabbedCard = null;
      } else {
        /* Grab */
        if (grabbedCard) grabbedCard.setAttribute('aria-grabbed', 'false');
        card.setAttribute('aria-grabbed', 'true');
        grabbedCard = card;
      }
      return;
    }

    if (!grabbedCard || grabbedCard !== card) return;

    const col = card.closest('.mn-kanban__column');
    if (!col) return;
    const fromColId = col.getAttribute('data-column-id') || '';
    const allColumns = Array.from(container.querySelectorAll('.mn-kanban__column'));
    const colIdx = allColumns.indexOf(col);

    if (e.key === 'ArrowLeft' && colIdx > 0) {
      e.preventDefault();
      const prevCol = allColumns[colIdx - 1];
      const toColId = prevCol.getAttribute('data-column-id') || '';
      const cardsInTarget = prevCol.querySelectorAll('.mn-kanban__card').length;
      callbacks.onMove(cardId, fromColId, toColId, cardsInTarget);
      grabbedCard.setAttribute('aria-grabbed', 'false');
      grabbedCard = null;
    } else if (e.key === 'ArrowRight' && colIdx < allColumns.length - 1) {
      e.preventDefault();
      const nextCol = allColumns[colIdx + 1];
      const toColId = nextCol.getAttribute('data-column-id') || '';
      const cardsInTarget = nextCol.querySelectorAll('.mn-kanban__card').length;
      callbacks.onMove(cardId, fromColId, toColId, cardsInTarget);
      grabbedCard.setAttribute('aria-grabbed', 'false');
      grabbedCard = null;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cardsContainer = col.querySelector('.mn-kanban__cards');
      if (!cardsContainer) return;
      const siblings = Array.from(cardsContainer.querySelectorAll('.mn-kanban__card'));
      const idx = siblings.indexOf(card);
      if (idx > 0) {
        callbacks.onMove(cardId, fromColId, fromColId, idx - 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const cardsContainer = col.querySelector('.mn-kanban__cards');
      if (!cardsContainer) return;
      const siblings = Array.from(cardsContainer.querySelectorAll('.mn-kanban__card'));
      const idx = siblings.indexOf(card);
      if (idx < siblings.length - 1) {
        callbacks.onMove(cardId, fromColId, fromColId, idx + 1);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      grabbedCard.setAttribute('aria-grabbed', 'false');
      grabbedCard = null;
    }
  }

  container.addEventListener('mousedown', onPointerDown);
  container.addEventListener('touchstart', onPointerDown as EventListener, { passive: false });
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('touchmove', onPointerMove as EventListener, { passive: true });
  document.addEventListener('mouseup', onPointerUp);
  document.addEventListener('touchend', onPointerUp as EventListener);
  container.addEventListener('keydown', onKeyDown);

  return {
    destroy(): void {
      cancelDrag();
      if (grabbedCard) { grabbedCard.setAttribute('aria-grabbed', 'false'); grabbedCard = null; }
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown as EventListener);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('touchmove', onPointerMove as EventListener);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchend', onPointerUp as EventListener);
      container.removeEventListener('keydown', onKeyDown);
    },
  };
}
