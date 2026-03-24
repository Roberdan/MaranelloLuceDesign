"use strict";
var import_facet_workbench = require("../index.cjs");
class MnFacetWorkbench extends HTMLElement {
  static get observedAttributes() {
    return [];
  }
  constructor() {
    super();
    this._facets = [];
    this._presets = [];
    this._ctrl = null;
  }
  connectedCallback() {
    this._mount();
  }
  disconnectedCallback() {
    this._ctrl?.destroy();
    this._ctrl = null;
  }
  get facets() {
    return this._facets;
  }
  set facets(value) {
    this._facets = Array.isArray(value) ? value : [];
    if (this.isConnected) this._mount();
  }
  get presets() {
    return this._presets;
  }
  set presets(value) {
    this._presets = Array.isArray(value) ? value : [];
    if (this.isConnected) this._mount();
  }
  _mount() {
    this._ctrl?.destroy();
    this._ctrl = new import_facet_workbench.FacetWorkbench(this, {
      facets: this._facets,
      presets: this._presets,
      onFilterChange: (filters) => {
        this.dispatchEvent(new CustomEvent("mn-filter-change", {
          detail: { filters },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
}
customElements.define("mn-facet-workbench", MnFacetWorkbench);
