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
class MnDetailPanel extends HTMLElement {
  static get observedAttributes() {
    return ["title", "sections", "open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    this._subComponents = {};
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/layouts-detail-panel.css");
    const link3 = cssLink("../css/layouts-detail-controls-1.css");
    const link4 = cssLink("../css/layouts-detail-controls-2.css");
    this._container = document.createElement("div");
    this._container.className = "mn-wc-root";
    this.shadowRoot.append(link1, link2, link3, link4, this._container);
  }
  connectedCallback() {
    this.setAttribute("role", "complementary");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute(
        "aria-label",
        this.getAttribute("title") || "Detail panel"
      );
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
    this._handleAttr(name, newVal);
  }
  /* ── Public API ─────────────────────────────────────────── */
  open() {
    this._ctrl?.open?.();
    this.setAttribute("open", "");
  }
  close() {
    this._ctrl?.close?.();
    this.removeAttribute("open");
  }
  setData(sections) {
    this._ctrl?.setData?.(sections);
  }
  startEdit() {
    this._ctrl?.startEdit?.();
  }
  save() {
    return this._ctrl?.save?.();
  }
  setSubComponent(tabName, renderFn) {
    this._subComponents[tabName] = renderFn;
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
    if (!M?.detailPanel) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const sections = this._parseJSON("sections", {});
    this._ctrl = M.detailPanel(this._container, {
      title: this.getAttribute("title") || "",
      data: sections.data || sections,
      schema: sections.schema || void 0,
      tabs: sections.tabs || void 0,
      editable: true,
      subComponents: this._subComponents,
      onSave: (payload, original) => {
        this.dispatchEvent(new CustomEvent("mn-save", {
          detail: { payload, original },
          bubbles: true,
          composed: true
        }));
      },
      onClose: () => {
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("mn-close", {
          bubbles: true,
          composed: true
        }));
      }
    });
    if (this.hasAttribute("open")) {
      this._ctrl.open();
    }
  }
  _handleAttr(name, value) {
    if (!this._ctrl) return;
    switch (name) {
      case "title":
        this._ctrl.setTitle?.(value || "");
        break;
      case "sections": {
        const parsed = (() => {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        })();
        if (parsed) this._ctrl.setData?.(parsed.data || parsed);
        break;
      }
      case "open":
        if (value !== null) this._ctrl.open?.();
        else this._ctrl.close?.();
        break;
    }
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
customElements.define("mn-detail-panel", MnDetailPanel);
