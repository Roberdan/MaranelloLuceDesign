let _engine = null;
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
const _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnFunnel extends HTMLElement {
  static get observedAttributes() {
    return ["stages", "show-conversion", "animate"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const style = document.createElement("style");
    style.textContent = ":host{display:block;width:100%}.mn-funnel__root{width:100%}";
    this._container = document.createElement("div");
    this._container.className = "mn-funnel__root";
    this._container.setAttribute("role", "img");
    this.shadowRoot.append(
      cssLink("../css/tokens.css"),
      cssLink("../css/layouts-funnel.css"),
      cssLink("../css/charts-heatmap-funnel-flip.css"),
      style,
      this._container
    );
  }
  connectedCallback() {
    this.setAttribute("role", "figure");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Pipeline funnel");
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
    if (name === "stages") {
      const parsed = this._parseJSON("stages", null);
      if (Array.isArray(parsed)) this._ctrl.update(parsed);
    } else {
      this._rebuild();
    }
  }
  /* ── Public API ───────────────────────────────────────────── */
  update(stages) {
    this._ctrl?.update?.(stages);
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
    if (!M?.funnel) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const stages = this._parseJSON("stages", []);
    const showConversion = this.hasAttribute("show-conversion");
    const animate = this.hasAttribute("animate");
    this._ctrl = M.funnel(this._container, {
      stages,
      showConversion,
      showPercentages: showConversion,
      animate,
      onClick: (stage, index) => {
        this.dispatchEvent(new CustomEvent("mn-funnel-click", {
          detail: { stage, index },
          bubbles: true,
          composed: true
        }));
      }
    });
    this.dispatchEvent(new CustomEvent("mn-funnel-ready", {
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
customElements.define("mn-funnel", MnFunnel);
//# sourceMappingURL=mn-funnel.js.map
