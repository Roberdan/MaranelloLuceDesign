"use strict";
var import_mn_a11y_fallback = require("./mn-a11y-fallback.cjs");
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
class MnA11y extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/accessibility.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; position: fixed; bottom: 24px; right: 24px;
        z-index: 8500; width: 52px; height: 52px; overflow: visible }
      .mn-a11y-fab { width: 52px; height: 52px; border-radius: 50%;
        background: var(--mn-error);
        border: 2px solid rgba(255,255,255,.18);
        color: #fff; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 16px rgba(220,0,0,.45), 0 2px 8px rgba(0,0,0,.4);
        transition: background .2s, transform .2s, box-shadow .2s; font-size: 1.35rem }
      .mn-a11y-fab:hover { background: #b00000;
        box-shadow: 0 6px 20px rgba(220,0,0,.55), 0 3px 10px rgba(0,0,0,.4);
        transform: scale(1.07) }
      .mn-a11y-fab:focus-visible { outline: 3px solid var(--mn-accent);
        outline-offset: 3px }
      .mn-a11y-panel { position: fixed; bottom: 88px; right: 24px; z-index: 8500;
        width: 280px; background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border); border-radius: 12px;
        padding: 16px; box-shadow: 0 12px 32px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(8px); pointer-events: none;
        transition: opacity .2s, transform .2s;
        font-family: var(--font-body, sans-serif);
        color: var(--mn-text-tertiary) }
      .mn-a11y-panel--open { opacity: 1; transform: translateY(0);
        pointer-events: auto }
      .mn-a11y-panel__title { font-weight: 600; font-size: .95rem;
        color: var(--mn-text); margin-bottom: 14px;
        display: flex; align-items: center; gap: 6px }
      .mn-a11y-panel__group { margin-bottom: 12px }
      .mn-a11y-panel__label { font-size: .75rem; text-transform: uppercase;
        letter-spacing: .06em; color: var(--mn-text-muted); margin-bottom: 6px }
      .mn-a11y-panel__size-btns { display: flex; gap: 4px }
      .mn-a11y-panel__size-btn { padding: 6px 12px; border-radius: 6px;
        border: 1px solid var(--mn-border); background: transparent;
        color: var(--mn-text-tertiary); cursor: pointer; font-size: .8rem;
        transition: all .15s }
      .mn-a11y-panel__size-btn--active { background: var(--mn-error);
        border-color: var(--mn-error); color: var(--mn-text) }
      .mn-a11y-panel__row { display: flex; align-items: center;
        justify-content: space-between; padding: 6px 0 }
      .mn-a11y-panel__row-label { font-size: .85rem }
      .mn-a11y-toggle { width: 40px; height: 22px; border-radius: 11px;
        background: var(--mn-border); border: none; cursor: pointer;
        position: relative; transition: background .15s; padding: 0 }
      .mn-a11y-toggle--on { background: var(--mn-error) }
      .mn-a11y-toggle__thumb { width: 18px; height: 18px; border-radius: 50%;
        background: var(--mn-text); position: absolute; top: 2px;
        left: 2px; transition: left .15s }
      .mn-a11y-toggle--on .mn-a11y-toggle__thumb { left: 20px }
      .mn-a11y-panel__divider { height: 1px; background: var(--mn-border);
        margin: 10px 0 }
      .mn-a11y-panel__reset { width: 100%; padding: 8px; border-radius: 6px;
        border: 1px solid var(--mn-border); background: transparent;
        color: var(--mn-text-tertiary); cursor: pointer; font-size: .8rem;
        margin-top: 8px; transition: background .15s }
      .mn-a11y-panel__reset:hover { background: var(--mn-border) }
    `;
    this.shadowRoot.append(tokens, link, style);
  }
  connectedCallback() {
    this._tryInit();
  }
  disconnectedCallback() {
    this._teardownObserver();
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  /* ── Public API ─────────────────────────────────────────── */
  getSettings() {
    return this._ctrl?.getSettings?.() ?? {};
  }
  reset() {
    this._ctrl?.reset?.();
  }
  /* ── Private ────────────────────────────────────────────── */
  _tryInit() {
    const M = getEngine();
    if (M?.a11yPanel && M._a11yDom) {
      this._ctrl = M.a11yPanel();
      return;
    }
    this._waitForEngine(() => {
      const M2 = getEngine();
      if (M2?.a11yPanel && M2._a11yDom) {
        this._ctrl = M2.a11yPanel();
      } else {
        this._useFallback();
      }
    });
    requestAnimationFrame(() => {
      if (!this._ctrl) this._useFallback();
    });
  }
  _useFallback() {
    if (this._ctrl) return;
    this._teardownObserver();
    this._ctrl = (0, import_mn_a11y_fallback.buildA11yFallback)(this.shadowRoot);
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
customElements.define("mn-a11y", MnA11y);
