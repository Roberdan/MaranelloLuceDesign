const _base = new URL(".", import.meta.url).href;
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
//# sourceMappingURL=mn-customer-journey.js.map
