"use strict";
let _engine = null;
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
class MnMapbox extends HTMLElement {
  static get observedAttributes() {
    return ["access-token", "center", "zoom", "markers", "stages", "projection"];
  }
  constructor() {
    super();
    this._ctrl = null;
    this._container = document.createElement("div");
    this._container.style.cssText = "width:100%;height:100%;min-height:300px";
    this.appendChild(this._container);
  }
  connectedCallback() {
    this.style.display = "block";
    this._init();
  }
  disconnectedCallback() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === "markers" && this._ctrl) {
      try {
        this._ctrl.setMarkers(JSON.parse(newVal || "[]"));
      } catch {
      }
    } else if (this._ctrl) {
      this._rebuild();
    }
  }
  flyTo(lat, lon, zoom) {
    this._ctrl?.flyTo?.(lat, lon, zoom);
  }
  setMarkers(markers) {
    this._ctrl?.setMarkers?.(markers);
  }
  getMap() {
    return this._ctrl?.getMap?.();
  }
  _parseJSON(attr, fallback) {
    try {
      return JSON.parse(this.getAttribute(attr) || "");
    } catch {
      return fallback;
    }
  }
  _init() {
    const M = getEngine();
    if (!M?.mapboxView) {
      requestAnimationFrame(() => {
        if (getEngine()?.mapboxView) this._init();
      });
      return;
    }
    const center = (this.getAttribute("center") || "12.0,42.5").split(",").map(Number);
    this._ctrl = M.mapboxView(this._container, {
      accessToken: this.getAttribute("access-token") || "",
      center: [center[0], center[1]],
      zoom: Number(this.getAttribute("zoom")) || 3,
      projection: this.getAttribute("projection") || "globe",
      markers: this._parseJSON("markers", []),
      stages: this._parseJSON("stages", void 0),
      onClick: (marker) => {
        this.dispatchEvent(new CustomEvent("mn-marker-click", {
          detail: { marker },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
  _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._container.innerHTML = "";
    this._init();
  }
}
customElements.define("mn-mapbox", MnMapbox);
