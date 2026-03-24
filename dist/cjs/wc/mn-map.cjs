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
class MnMap extends HTMLElement {
  static get observedAttributes() {
    return ["markers", "zoom", "center", "theme"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/layouts.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; position: relative; min-height: 300px; }
      .mn-wc-root { width: 100%; height: 100%; min-height: inherit; }
    `;
    this._container = document.createElement("div");
    this._container.className = "mn-wc-root";
    this._container.setAttribute("aria-hidden", "true");
    this.shadowRoot.append(link1, link2, style, this._container);
  }
  connectedCallback() {
    this.setAttribute("role", "img");
    if (!this.hasAttribute("aria-label")) {
      this.setAttribute("aria-label", "Interactive map");
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
  setMarkers(arr) {
    this._ctrl?.setMarkers?.(arr);
  }
  addMarker(m) {
    this._ctrl?.addMarker?.(m);
  }
  panTo(lat, lng) {
    this._ctrl?.panTo?.(lng, lat);
  }
  fitBounds() {
    this._ctrl?.fitBounds?.();
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
    if (!M?.mapView) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();
    const markers = this._parseJSON("markers", []);
    const center = this._parseJSON("center", void 0);
    const zoom = parseFloat(this.getAttribute("zoom") || "0") || void 0;
    this._ctrl = M.mapView(this._container, {
      markers,
      initialCenter: center,
      initialZoom: zoom,
      enableZoom: true,
      enablePan: true,
      showLegend: true,
      onClick: (marker) => {
        this.dispatchEvent(new CustomEvent("mn-marker-click", {
          detail: { marker },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
  _handleAttr(name, value) {
    if (!this._ctrl) return;
    switch (name) {
      case "markers": {
        const parsed = (() => {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        })();
        if (Array.isArray(parsed)) this._ctrl.setMarkers(parsed);
        break;
      }
      case "zoom": {
        const z = parseFloat(value);
        if (!isNaN(z)) this._ctrl.setZoom?.(z);
        break;
      }
      case "center": {
        const c = (() => {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        })();
        if (Array.isArray(c) && c.length >= 2) this._ctrl.panTo(c[0], c[1]);
        break;
      }
      case "theme":
        this._rebuild();
        break;
    }
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
customElements.define("mn-map", MnMap);
//# sourceMappingURL=mn-map.cjs.map
