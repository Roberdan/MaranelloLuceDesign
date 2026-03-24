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
class MnOkr extends HTMLElement {
  static get observedAttributes() {
    return ["objectives", "options"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const style = document.createElement("style");
    style.textContent = ":host{display:block;width:100%}.mn-okr__root{width:100%}";
    this._container = document.createElement("div");
    this._container.className = "mn-okr__root";
    this._container.setAttribute("role", "img");
    this.shadowRoot.append(
      cssLink("../css/tokens.css"),
      cssLink("../css/charts.css"),
      cssLink("../css/charts-base.css"),
      style,
      this._container
    );
  }
  connectedCallback() {
    this.setAttribute("role", "region");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "OKR dashboard");
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
    if (name === "objectives") {
      const parsed = this._parseJSON("objectives", null);
      if (Array.isArray(parsed)) this._ctrl.update(parsed);
    } else {
      this._rebuild();
    }
  }
  /* ── Public API ───────────────────────────────────────────── */
  update(objectives) {
    this._ctrl?.update?.(objectives);
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
    if (!M?.okrPanel) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const objectives = this._parseJSON("objectives", []);
    const opts = this._parseJSON("options", {});
    this._ctrl = M.okrPanel(this._container, { objectives, ...opts });
    this.dispatchEvent(new CustomEvent("mn-okr-ready", {
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
customElements.define("mn-okr", MnOkr);
//# sourceMappingURL=mn-okr.cjs.map
