"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const import_meta = { url: require("url").pathToFileURL(__filename).href };
async function resolveCharts() {
  if (window.Maranello?.charts) return window.Maranello.charts;
  try {
    const mod = await import("../esm/charts/index.js");
    return mod;
  } catch {
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
class MnChart extends HTMLElement {
  static get observedAttributes() {
    return ["type", "data", "options", "width", "height"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._initAttempts = 0;
    this._charts = null;
    const style = document.createElement("style");
    style.textContent = ":host{display:inline-block}canvas{display:block}.mn-chart__root{position:relative}";
    this._container = document.createElement("div");
    this._container.className = "mn-chart__root";
    this._canvas = document.createElement("canvas");
    this._container.append(this._canvas);
    this.shadowRoot.append(
      cssLink("../css/tokens.css"),
      cssLink("../css/charts.css"),
      cssLink("../css/charts-base.css"),
      style,
      this._container
    );
  }
  connectedCallback() {
    this.setAttribute("role", "img");
    if (!this.hasAttribute("aria-label")) {
      const type = this.getAttribute("type") || "chart";
      this.setAttribute("aria-label", `${type} visualization`);
    }
    this._init();
  }
  disconnectedCallback() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this._charts) {
      this._rebuild();
    } else if (name === "type" && !this._ctrl) {
      this.setAttribute("aria-label", `${newVal || "chart"} visualization`);
    }
  }
  /* ── Public API ─────────────────────────────────────────── */
  /**
   * Update chart data/options imperatively.
   * @param {unknown[]} [data]
   * @param {Record<string, unknown>} [opts]
   */
  update(data, opts) {
    if (this._ctrl?.update) {
      this._ctrl.update(data, opts);
    } else {
      if (data) this.setAttribute("data", JSON.stringify(data));
      if (opts) this.setAttribute("options", JSON.stringify(opts));
    }
  }
  /* ── Internals ──────────────────────────────────────────── */
  /**
   * @param {string} attr
   * @param {unknown} fallback
   */
  _parseJSON(attr, fallback) {
    try {
      return JSON.parse(this.getAttribute(attr) || "");
    } catch {
      return fallback;
    }
  }
  async _init() {
    this.setAttribute("aria-busy", "true");
    let charts = await resolveCharts();
    while (!charts && ++this._initAttempts < 60) {
      await new Promise((r) => requestAnimationFrame(r));
      charts = window.Maranello?.charts ?? null;
    }
    if (!charts) {
      console.warn("<mn-chart>: chart library not available (ESM or window.Maranello)");
      this.removeAttribute("aria-busy");
      return;
    }
    this._charts = charts;
    const type = this.getAttribute("type") || "sparkline";
    const factory = charts[type];
    if (typeof factory !== "function") {
      console.warn(`<mn-chart>: unknown chart type "${type}"`);
      this.removeAttribute("aria-busy");
      return;
    }
    const hasExplicitSize = this.hasAttribute("width") || this.hasAttribute("height");
    if (hasExplicitSize) {
      const w = parseInt(this.getAttribute("width") || "300", 10);
      const h = parseInt(this.getAttribute("height") || "200", 10);
      this._canvas.width = w;
      this._canvas.height = h;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
    } else {
      const rect = this.getBoundingClientRect();
      const w = rect.width || 300;
      const h = rect.height || 200;
      this._canvas.width = w;
      this._canvas.height = h;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
    }
    const data = this._parseJSON("data", []);
    const opts = this._parseJSON("options", {});
    const cw = this._canvas.width, ch = this._canvas.height;
    try {
      this._ctrl = factory(this._canvas, data, { ...opts, width: cw, height: ch });
      if (!hasExplicitSize && window.ResizeObserver) {
        this._attachResizeObserver(factory);
      }
      this.dispatchEvent(new CustomEvent("mn-chart-ready", { bubbles: true, composed: true }));
    } finally {
      this.removeAttribute("aria-busy");
    }
  }
  _attachResizeObserver(factory) {
    let tid = null;
    this._resizeObs = new ResizeObserver(() => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        const r = this.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        this._ctrl?.destroy?.();
        this._canvas.width = r.width;
        this._canvas.height = r.height;
        this._canvas.style.width = `${r.width}px`;
        this._canvas.style.height = `${r.height}px`;
        const data = this._parseJSON("data", []);
        const opts = this._parseJSON("options", {});
        this._ctrl = factory(this._canvas, data, { ...opts, width: r.width, height: r.height });
      }, 150);
    });
    this._resizeObs.observe(this);
  }
  _rebuild() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._canvas.getContext("2d")?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._initAttempts = 0;
    this._charts = null;
    this._init();
  }
}
customElements.define("mn-chart", MnChart);
//# sourceMappingURL=mn-chart.cjs.map
