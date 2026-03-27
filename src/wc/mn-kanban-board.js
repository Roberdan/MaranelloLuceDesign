/**
 * <mn-kanban-board> — Web Component wrapper for Maranello.kanbanBoard
 * Drag-and-drop column-based task board with card management.
 * Dual-mode: ESM dynamic import OR window.Maranello fallback for CDN users.
 *
 * @attr {string} columns - JSON array of column definitions
 * @attr {string} cards   - JSON array of card objects
 * @fires mn-kanban-card-moved  - {detail: {cardId, fromCol, toCol, position}}
 * @fires mn-kanban-card-click  - {detail: {card}}
 * @version 1.0.0
 */

// Dual-mode: ESM import or CDN fallback
let _engine = null;

function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}

const _base = new URL('.', import.meta.url).href;

/** @param {string} path */
function cssLink(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, _base).href;
  return link;
}

class MnKanbanBoard extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'cards'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._ctrl = null;
    this._mo = null;

    const link1 = cssLink('../css/tokens.css');
    const link2 = cssLink('../css/components-kanban.css');

    this._container = document.createElement('div');
    this._container.className = 'mn-wc-root';
    this._container.setAttribute('role', 'region');
    this.shadowRoot.append(link1, link2, this._container);
  }

  connectedCallback() {
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Kanban board');
    }
    this._init();
  }

  disconnectedCallback() {
    this._teardownObserver();
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this._ctrl) return;
    this._rebuild();
  }

  /* -- Public API -------------------------------------------------- */

  addCard(card) {
    this._ctrl?.addCard?.(card);
  }

  removeCard(cardId) {
    this._ctrl?.removeCard?.(cardId);
  }

  moveCard(cardId, toCol, position) {
    this._ctrl?.moveCard?.(cardId, toCol, position);
  }

  getState() {
    return this._ctrl?.getState?.() ?? { columns: [], cards: [] };
  }

  /* -- Internals --------------------------------------------------- */

  _parseJSON(attr, fallback) {
    try { return JSON.parse(this.getAttribute(attr) || ''); }
    catch { return fallback; }
  }

  _init() {
    const M = getEngine();
    if (!M?.kanbanBoard) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();

    const columns = this._parseJSON('columns', []);
    const cards = this._parseJSON('cards', []);

    this._ctrl = M.kanbanBoard(this._container, {
      columns,
      cards,
      onMove: (cardId, fromCol, toCol, position) => {
        this.dispatchEvent(new CustomEvent('mn-kanban-card-moved', {
          detail: { cardId, fromCol, toCol, position },
          bubbles: true,
          composed: true,
        }));
      },
      onCardClick: (card) => {
        this.dispatchEvent(new CustomEvent('mn-kanban-card-click', {
          detail: { card },
          bubbles: true,
          composed: true,
        }));
      },
    });
  }

  _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._container.innerHTML = '';
    this._init();
  }

  _waitForEngine(cb) {
    requestAnimationFrame(() => {
      if (getEngine()) { cb(); return; }
      if (this._mo) return;
      this._mo = new MutationObserver(() => {
        if (getEngine()) { this._teardownObserver(); cb(); }
      });
      this._mo.observe(document.head, { childList: true });
    });
  }

  _teardownObserver() {
    this._mo?.disconnect();
    this._mo = null;
  }
}

customElements.define('mn-kanban-board', MnKanbanBoard);
