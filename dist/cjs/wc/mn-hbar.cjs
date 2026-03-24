"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
let _engine = null;
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnHbar extends HTMLElement {
  static get observedAttributes() {
    return ["data", "options"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const style = document.createElement("style");
    style.textContent = ":host{display:block;width:100%}.mn-hbar__root{width:100%}";
    this._container = document.createElement("div");
    this._container.className = "mn-hbar__root";
    this._container.setAttribute("role", "img");
    this.shadowRoot.append(
      cssLink("../css/tokens.css"),
      cssLink("../css/layouts-horizontal-bar-1.css"),
      cssLink("../css/layouts-horizontal-bar-2.css"),
      cssLink("../css/layouts-horizontal-bar-3.css"),
      style,
      this._container
    );
  }
  connectedCallback() {
    this.setAttribute("role", "figure");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Horizontal bar chart");
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
    if (name === "data") {
      const parsed = this._parseJSON("data", null);
      if (Array.isArray(parsed)) this._ctrl.update(parsed);
    } else if (name === "options") {
      this._rebuild();
    }
  }
  /* ── Public API ───────────────────────────────────────────── */
  update(data) {
    this._ctrl?.update?.(data);
  }
  /* ── Internals ────────────────────────────────────────────── */
  _parseJSON(attr, fallback) {
    try {
      return JSON.parse(this.getAttribute(attr) || "");
    } catch {
      return fallback;
    }
  }
  _init() {
    const M = getEngine();
    if (!M?.hBarChart) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const bars = this._parseJSON("data", []);
    const opts = this._parseJSON("options", {});
    this._ctrl = M.hBarChart(this._container, {
      bars,
      ...opts,
      onClick: (bar, index) => {
        this.dispatchEvent(new CustomEvent("mn-hbar-click", {
          detail: { bar, index },
          bubbles: true,
          composed: true
        }));
      }
    });
    this.dispatchEvent(new CustomEvent("mn-hbar-ready", {
      bubbles: true,
      composed: true
    }));
  }
  _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._container.innerHTML = "";
    this._init();
  }
  _waitForEngine(cb) {
    requestAnimationFrame(() => {
      if (getEngine()) {
        cb();
        return;
      }
      if (this._mo) return;
      this._mo = new MutationObserver(() => {
        if (getEngine()) {
          this._teardownObserver();
          cb();
        }
      });
      this._mo.observe(document.head, { childList: true });
    });
  }
  _teardownObserver() {
    this._mo?.disconnect();
    this._mo = null;
  }
}
customElements.define("mn-hbar", MnHbar);
//# sourceMappingURL=mn-hbar.cjs.map
