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
class MnGantt extends HTMLElement {
  static get observedAttributes() {
    return ["tasks", "zoom", "label-width"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/charts-gantt-timeline.css");
    const link3 = cssLink("../css/charts-treemap-radar-gantt.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; width: 100%; }
      .mn-gantt__root { width: 100%; overflow: hidden; }
    `;
    this._container = document.createElement("div");
    this._container.className = "mn-gantt__root";
    this.shadowRoot.append(link1, link2, link3, style, this._container);
  }
  connectedCallback() {
    this.setAttribute("role", "figure");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Gantt timeline");
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
    switch (name) {
      case "tasks": {
        const parsed = this._parseJSON("tasks", null);
        if (Array.isArray(parsed)) this._ctrl.setTasks(parsed);
        break;
      }
      case "zoom":
        this._ctrl.setZoom(Number(newVal));
        break;
      case "label-width":
        this._rebuild();
        break;
    }
  }
  /* ── Public API ─────────────────────────────────────────── */
  setTasks(arr) {
    this._ctrl?.setTasks?.(arr);
  }
  setZoom(n) {
    this._ctrl?.setZoom?.(Number(n));
  }
  scrollToToday() {
    this._ctrl?.scrollToToday?.();
  }
  expandAll() {
    this._ctrl?.expandAll?.();
  }
  collapseAll() {
    this._ctrl?.collapseAll?.();
  }
  fit() {
    this._ctrl?.fit?.();
  }
  /* ── Internals ──────────────────────────────────────────── */
  _parseJSON(attr, fallback) {
    try {
      return JSON.parse(this.getAttribute(attr) || "");
    } catch {
      return fallback;
    }
  }
  _init() {
    const M = getEngine();
    if (!M?.gantt) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const tasks = this._parseJSON("tasks", []);
    const zoom = Number(this.getAttribute("zoom") || 0) || void 0;
    const labelWidth = Number(this.getAttribute("label-width") || 0) || void 0;
    const opts = {};
    if (zoom) opts.zoom = zoom;
    if (labelWidth) opts.labelWidth = labelWidth;
    opts.onSelect = (task, type) => {
      this.dispatchEvent(new CustomEvent("mn-gantt-select", {
        detail: { task, type, id: task?.id },
        bubbles: true,
        composed: true
      }));
    };
    opts.onClick = (task, type) => {
      this.dispatchEvent(new CustomEvent("mn-gantt-click", {
        detail: { task, type, id: task?.id },
        bubbles: true,
        composed: true
      }));
    };
    this._ctrl = M.gantt(this._container, tasks, opts);
    this.dispatchEvent(new CustomEvent("mn-gantt-ready", {
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
customElements.define("mn-gantt", MnGantt);
//# sourceMappingURL=mn-gantt.cjs.map
