import { EntityWorkbench } from "../ts/entity-workbench.js";
class MnEntityWorkbench extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this._schema = { tabs: [] };
    this._data = {};
    this._editable = true;
    this._actions = [];
    this._ctrl = null;
  }
  connectedCallback() {
    this._renderState();
    if (this.hasAttribute("open")) this._mount();
  }
  disconnectedCallback() {
    this._ctrl?.destroy();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name !== "open" || oldVal === newVal) return;
    if (newVal !== null) this._mount();
    else this._unmount();
    this._renderState();
  }
  get schema() {
    return this._schema;
  }
  set schema(value) {
    this._schema = value?.tabs ? value : { tabs: [] };
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value && typeof value === "object" ? value : {};
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get editable() {
    return this._editable;
  }
  set editable(value) {
    this._editable = Boolean(value);
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  get actions() {
    return this._actions;
  }
  set actions(value) {
    this._actions = Array.isArray(value) ? value : [];
    if (this.isConnected && this.hasAttribute("open")) this._mount();
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
  }
  _mount() {
    this._ctrl?.destroy();
    this._ctrl = new EntityWorkbench(this, {
      schema: this._schema,
      data: this._data,
      editable: this._editable,
      actions: this._actions,
      onSave: (data) => {
        this.dispatchEvent(new CustomEvent("mn-save", { detail: { data }, bubbles: true, composed: true }));
      },
      onClose: () => {
        this.removeAttribute("open");
        this.dispatchEvent(new CustomEvent("mn-close", { bubbles: true, composed: true }));
      },
      onAction: (actionId, data) => {
        this.dispatchEvent(new CustomEvent("mn-action", { detail: { actionId, data }, bubbles: true, composed: true }));
      }
    });
  }
  _unmount() {
    this._ctrl?.destroy();
    this._ctrl = null;
    this.innerHTML = "";
  }
  _renderState() {
    this.classList.toggle("mn-entity-workbench-host", true);
    this.classList.toggle("mn-entity-workbench-host--open", this.hasAttribute("open"));
  }
}
customElements.define("mn-entity-workbench", MnEntityWorkbench);
//# sourceMappingURL=mn-entity-workbench.js.map
