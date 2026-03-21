/**
 * <mn-state-scaffold> — Web Component wrapper for StateScaffold (light DOM).
 *
 * @attr {string} state        - loading | empty | error | partial | no-results
 * @attr {string} message      - State message
 * @attr {string} action-label - Action/retry button label for actionable states
 * @fires mn-retry
 * @fires mn-action
 */
import { StateScaffold } from '../ts/state-scaffold.js';

const VALID_STATES = new Set(['loading', 'empty', 'error', 'partial', 'no-results', 'ready']);

class MnStateScaffold extends HTMLElement {
  static get observedAttributes() {
    return ['state', 'message', 'action-label'];
  }

  constructor() {
    super();
    this._ctrl = null;
  }

  connectedCallback() {
    this._mount();
  }

  disconnectedCallback() {
    this._ctrl?.destroy();
    this._ctrl = null;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this._ctrl) return;
    if (name === 'state' || name === 'message') {
      this._ctrl.setState(this._state(), this.getAttribute('message') || undefined);
      return;
    }
    if (name === 'action-label') {
      const state = this._ctrl.getState();
      this._ctrl.destroy();
      this._ctrl = null;
      this._mount(state);
    }
  }

  _mount(stateOverride) {
    const state = this._resolveState(stateOverride || this.getAttribute('state'));
    this._ctrl = new StateScaffold(this, {
      state,
      message: this.getAttribute('message') || undefined,
      actionLabel: this.getAttribute('action-label') || undefined,
      onRetry: () => {
        this.dispatchEvent(new CustomEvent('mn-retry', { bubbles: true, composed: true }));
      },
      onAction: () => {
        this.dispatchEvent(new CustomEvent('mn-action', { bubbles: true, composed: true }));
      },
    });
  }

  _state() {
    return this._resolveState(this.getAttribute('state'));
  }

  _resolveState(raw) {
    return VALID_STATES.has(raw) ? raw : 'loading';
  }
}

customElements.define('mn-state-scaffold', MnStateScaffold);
