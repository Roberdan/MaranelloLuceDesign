"use strict";
var import_dashboard_renderer = require("../index.cjs");
class MnDashboard extends HTMLElement {
  constructor() {
    super();
    this._schema = { rows: [] };
    this._data = {};
    this._renderer = null;
    this._onClick = this._onClick.bind(this);
  }
  connectedCallback() {
    this.classList.add("mn-dashboard-host");
    this.addEventListener("click", this._onClick);
    this._ensureRenderer();
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this._renderer?.destroy?.();
    this._renderer = null;
  }
  get schema() {
    return this._schema;
  }
  set schema(value) {
    this._schema = value && typeof value === "object" ? value : { rows: [] };
    if (!this._renderer) {
      this._ensureRenderer();
      return;
    }
    this._renderer.setSchema(this._schema);
    this._applyAllData();
  }
  get data() {
    return this._data;
  }
  set data(value) {
    const next = value && typeof value === "object" ? value : {};
    this._data = next;
    if (!this._renderer) {
      this._ensureRenderer();
      return;
    }
    this._applyAllData();
  }
  _ensureRenderer() {
    if (this._renderer) return;
    this._renderer = new import_dashboard_renderer.DashboardRenderer(this, {
      schema: this._schema,
      data: this._data
    });
  }
  _applyAllData() {
    if (!this._renderer) return;
    Object.entries(this._data).forEach(([key, value]) => {
      this._renderer.setData(key, value);
    });
  }
  _onClick(event) {
    const target = event.target instanceof Element ? event.target.closest("[data-dashboard-key]") : null;
    if (!target) return;
    const key = target.getAttribute("data-dashboard-key");
    this.dispatchEvent(new CustomEvent("mn-widget-click", {
      detail: {
        dataKey: key,
        data: key ? this._data[key] : void 0
      },
      bubbles: true,
      composed: true
    }));
  }
}
customElements.define("mn-dashboard", MnDashboard);
