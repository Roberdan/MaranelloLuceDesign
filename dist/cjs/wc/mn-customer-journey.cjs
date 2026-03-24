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
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnCustomerJourney extends HTMLElement {
  static get observedAttributes() {
    return ["phases", "selected", "layout"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const tokens = cssLink("../css/tokens.css");
    const layout = cssLink("../css/layouts-customer-journey.css");
    const style = document.createElement("style");
    style.textContent = ":host { display: block; }";
    this._container = document.createElement("div");
    this.shadowRoot.append(tokens, layout, style, this._container);
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    if (this._ctrl) {
      this._ctrl.destroy();
      this._ctrl = null;
    }
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  async _render() {
    if (this._ctrl) {
      this._ctrl.destroy();
      this._ctrl = null;
    }
    const phasesAttr = this.getAttribute("phases");
    if (!phasesAttr) return;
    try {
      const phases = JSON.parse(phasesAttr);
      const { customerJourney } = await import("../ts/customer-journey.js");
      const layoutMode = this.getAttribute("layout") || "horizontal";
      this._ctrl = customerJourney(this._container, phases, {
        orientation: layoutMode,
        showConnectors: true,
        onSelect: (eng) => this.dispatchEvent(
          new CustomEvent("select", { detail: eng, bubbles: true })
        )
      });
      const sel = this.getAttribute("selected");
      if (sel) this._ctrl.selectEngagement(sel);
    } catch (_e) {
    }
  }
}
customElements.define("mn-customer-journey", MnCustomerJourney);
//# sourceMappingURL=mn-customer-journey.cjs.map
