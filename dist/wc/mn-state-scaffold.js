// src/ts/locale.ts
var defaults = {
  themes: {
    editorial: "Editorial",
    nero: "Nero",
    avorio: "Avorio",
    colorblind: "Colorblind",
    sugar: "Sugar"
  },
  filterPanel: {
    saveDefault: "SAVE AS DEFAULT",
    clear: "CLEAR"
  },
  a11y: {
    display: "Display",
    textSize: "Text Size",
    lineSpacing: "Line Spacing",
    dyslexiaFont: "Dyslexia Font",
    reducedMotion: "Reduced Motion",
    highContrast: "High Contrast",
    focusIndicators: "Focus Indicators",
    resetDefaults: "Reset to Defaults"
  },
  stateScaffold: {
    loading: "Loading...",
    noResults: "No results match your filters.",
    retry: "Retry",
    error: "Something went wrong. Please try again.",
    empty: "No data available yet.",
    partial: "Some data may be unavailable right now."
  }
};
var current = JSON.parse(JSON.stringify(defaults));
function getLocale() {
  return current;
}

// src/ts/state-scaffold.ts
var VALID_STATES = ["loading", "empty", "error", "partial", "no-results", "ready"];
var StateScaffold = class {
  constructor(container, options) {
    this.events = null;
    const validInitial = options?.state && VALID_STATES.includes(options.state);
    if (!validInitial && options?.state) {
      console.warn(`StateScaffold: invalid initial state "${options.state}". Falling back to "loading". Valid states: ${VALID_STATES.join(", ")}`);
    }
    const initial = validInitial ? options.state : "loading";
    this.container = container;
    this.options = { ...options, state: initial };
    this.state = initial;
    this.status = document.createElement("div");
    this.status.className = "mn-scaffold__status";
    this.content = document.createElement("div");
    this.content.className = "mn-scaffold__content";
    while (this.container.firstChild) {
      this.content.appendChild(this.container.firstChild);
    }
    this.container.classList.add("mn-scaffold");
    this.container.append(this.status, this.content);
    this.setState(initial, this.options.message);
  }
  setState(state, message) {
    if (!VALID_STATES.includes(state)) {
      console.warn(`StateScaffold: invalid state "${state}". Valid states: ${VALID_STATES.join(", ")}`);
      return;
    }
    this.state = state;
    this.options.state = state;
    if (typeof message === "string") {
      this.options.message = message;
    }
    this.events?.abort();
    this.events = new AbortController();
    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
    this.container.classList.add(`mn-scaffold--${state}`);
    this.container.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.status.innerHTML = "";
    this.content.classList.toggle("mn-scaffold__content--hidden", state !== "partial" && state !== "ready");
    if (state === "loading") this.renderLoading();
    if (state === "empty") this.renderEmpty();
    if (state === "error") this.renderError();
    if (state === "partial") this.renderPartial();
    if (state === "no-results") this.renderNoResults();
    if (state === "ready") this.renderReady();
  }
  getState() {
    return this.state;
  }
  getContentHost() {
    return this.content;
  }
  destroy() {
    this.events?.abort();
    this.events = null;
    this.status.remove();
    while (this.content.firstChild) {
      this.container.appendChild(this.content.firstChild);
    }
    this.content.remove();
    this.container.removeAttribute("aria-busy");
    this.container.classList.remove("mn-scaffold", "mn-scaffold__content--hidden");
    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
  }
  renderLoading() {
    const panel = this.buildPanel("loading");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    for (let i = 0; i < 3; i += 1) {
      const bar = document.createElement("div");
      bar.className = "mn-scaffold__skeleton-bar";
      panel.appendChild(bar);
    }
    this.status.appendChild(panel);
  }
  renderEmpty() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.empty,
      this.options.onAction,
      this.options.actionLabel,
      "Take action"
    );
    this.status.appendChild(panel);
  }
  renderError() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.error,
      this.options.onRetry,
      getLocale().stateScaffold.retry,
      "Retry"
    );
    this.status.appendChild(panel);
  }
  renderPartial() {
    const banner = document.createElement("div");
    banner.className = "mn-scaffold__banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    const text = document.createElement("p");
    text.className = "mn-scaffold__message";
    text.textContent = this.options.message || getLocale().stateScaffold.partial;
    banner.appendChild(text);
    this.status.appendChild(banner);
  }
  renderReady() {
    this.status.innerHTML = "";
  }
  renderNoResults() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.noResults,
      this.options.onAction,
      this.options.actionLabel,
      "Clear filters"
    );
    this.status.appendChild(panel);
  }
  buildPanel(modifier) {
    const panel = document.createElement("div");
    panel.className = `mn-scaffold__panel mn-scaffold__panel--${modifier}`;
    return panel;
  }
  buildMessageState(message, action, actionLabel, fallbackLabel) {
    const panel = this.buildPanel("message");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    const text = document.createElement("p");
    text.className = "mn-scaffold__message";
    text.textContent = message;
    panel.appendChild(text);
    if (action) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mn-scaffold__action";
      button.textContent = actionLabel || fallbackLabel || "Action";
      button.addEventListener("click", action, { signal: this.events?.signal });
      panel.appendChild(button);
    }
    return panel;
  }
};

// src/wc/mn-state-scaffold.js
var VALID_STATES2 = /* @__PURE__ */ new Set(["loading", "empty", "error", "partial", "no-results", "ready"]);
var MnStateScaffold = class extends HTMLElement {
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
    return VALID_STATES2.has(raw) ? raw : "loading";
  }
};
customElements.define("mn-state-scaffold", MnStateScaffold);
//# sourceMappingURL=mn-state-scaffold.js.map
