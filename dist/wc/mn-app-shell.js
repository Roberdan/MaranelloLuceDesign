import { AppShellController } from "../ts/app-shell.js";
import { PanelOrchestrator } from "../ts/panel-orchestrator.js";
import { ViewRegistry } from "../ts/view-registry.js";
import { NavigationModel } from "../ts/navigation-model.js";
const SLOT_NAMES = ["nav", "toolbar", "filter-bar", "main", "secondary", "detail", "bottom", "overlay"];
const VALID_LAYOUTS = /* @__PURE__ */ new Set(["full", "split", "stacked", "docked-bottom", "dual-panel", "side-detail"]);
class MnAppShell extends HTMLElement {
  static get observedAttributes() {
    return ["layout"];
  }
  constructor() {
    super();
    this._controller = null;
    this._orchestrator = null;
    this._ownsOrchestrator = false;
  }
  connectedCallback() {
    if (this._controller) return;
    this._controller = new AppShellController(this, {
      layout: this._resolveLayout(this.getAttribute("layout"))
    });
    this._mountSlots();
    if (!this._orchestrator) {
      this._orchestrator = new PanelOrchestrator(
        ViewRegistry.getInstance(),
        new NavigationModel(),
        this._controller
      );
      this._ownsOrchestrator = true;
    }
  }
  disconnectedCallback() {
    if (this._ownsOrchestrator) this._orchestrator?.destroy();
    this._orchestrator = null;
    this._ownsOrchestrator = false;
    this._controller?.destroy();
    this._controller = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "layout" && oldVal !== newVal && this._controller) {
      this._controller.setLayout(this._resolveLayout(newVal));
    }
  }
  set orchestrator(value) {
    this._orchestrator = value;
    this._ownsOrchestrator = false;
  }
  get orchestrator() {
    return this._orchestrator;
  }
  _resolveLayout(raw) {
    return VALID_LAYOUTS.has(raw) ? raw : "full";
  }
  _mountSlots() {
    if (!this._controller) return;
    SLOT_NAMES.forEach((name) => {
      const container = this._controller.getSlot(name);
      if (!container || container.querySelector(`:scope > slot[name="${name}"]`)) return;
      const slot = document.createElement("slot");
      slot.name = name;
      container.append(slot);
    });
  }
}
if (!customElements.get("mn-app-shell")) {
  customElements.define("mn-app-shell", MnAppShell);
}
//# sourceMappingURL=mn-app-shell.js.map
