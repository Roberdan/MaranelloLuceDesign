import { StateScaffold } from "../ts/state-scaffold.js";
const VALID_STATES = /* @__PURE__ */ new Set(["loading", "empty", "error", "partial", "no-results", "ready"]);
class MnStateScaffold extends HTMLElement {
  static get observedAttributes() {
    return ["state", "message", "action-label"];
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
    if (name === "state" || name === "message") {
      this._ctrl.setState(this._state(), this.getAttribute("message") || void 0);
      return;
    }
    if (name === "action-label") {
      const state = this._ctrl.getState();
      this._ctrl.destroy();
      this._ctrl = null;
      this._mount(state);
    }
  }
  _mount(stateOverride) {
    const state = this._resolveState(stateOverride || this.getAttribute("state"));
    this._ctrl = new StateScaffold(this, {
      state,
      message: this.getAttribute("message") || void 0,
      actionLabel: this.getAttribute("action-label") || void 0,
      onRetry: () => {
        this.dispatchEvent(new CustomEvent("mn-retry", { bubbles: true, composed: true }));
      },
      onAction: () => {
        this.dispatchEvent(new CustomEvent("mn-action", { bubbles: true, composed: true }));
      }
    });
  }
  _state() {
    return this._resolveState(this.getAttribute("state"));
  }
  _resolveState(raw) {
    return VALID_STATES.has(raw) ? raw : "loading";
  }
}
customElements.define("mn-state-scaffold", MnStateScaffold);
//# sourceMappingURL=mn-state-scaffold.js.map
