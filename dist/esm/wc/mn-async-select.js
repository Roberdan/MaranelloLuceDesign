const _base = new URL(".", import.meta.url).href;
async function resolveAsyncSelect() {
  if (globalThis.Maranello?.AsyncSelect) return globalThis.Maranello.AsyncSelect;
  try {
    const mod = await import(new URL("../ts/async-select.js", _base).href);
    if (mod?.AsyncSelect) return mod.AsyncSelect;
  } catch {
  }
  return null;
}
const DEFAULT_PROVIDER = { search: async () => [] };
class MnAsyncSelect extends HTMLElement {
  static get observedAttributes() {
    return ["placeholder", "min-chars", "debounce"];
  }
  constructor() {
    super();
    this._provider = DEFAULT_PROVIDER;
    this._ctrl = null;
  }
  connectedCallback() {
    void this._mount();
  }
  disconnectedCallback() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this.isConnected) return;
    if (name === "placeholder" || name === "min-chars" || name === "debounce") {
      void this._mount();
    }
  }
  get provider() {
    return this._provider;
  }
  set provider(value) {
    this._provider = value && typeof value.search === "function" ? value : DEFAULT_PROVIDER;
    if (this._ctrl) this._ctrl.setProvider(this._provider);
    else if (this.isConnected) void this._mount();
  }
  async _mount() {
    const AsyncSelect = await resolveAsyncSelect();
    if (!AsyncSelect) return;
    this._ctrl?.destroy?.();
    this._ctrl = new AsyncSelect(this, {
      provider: this._provider,
      placeholder: this.getAttribute("placeholder") || "Search...",
      minChars: Number(this.getAttribute("min-chars") || 1),
      debounceMs: Number(this.getAttribute("debounce") || 300),
      onSelect: (item) => {
        this.dispatchEvent(new CustomEvent("mn-select", {
          detail: { item },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
}
customElements.define("mn-async-select", MnAsyncSelect);
//# sourceMappingURL=mn-async-select.js.map
