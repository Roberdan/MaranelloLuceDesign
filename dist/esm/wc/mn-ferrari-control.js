let _engine = null;
async function resolveEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  console.warn("[mn-ferrari-control] No engine found");
  return null;
}
const _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnFerrariControl extends HTMLElement {
  static get observedAttributes() {
    return ["type", "options"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const tokens = cssLink("../css/tokens.css");
    const link1 = cssLink("../css/controls-rotary-slider.css");
    const link2 = cssLink("../css/controls-buttons-switches.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: inline-block }
      .mn-fc { display: inline-flex; flex-direction: column; align-items: center }
      .mn-fc--empty { padding: 20px; color: var(--mn-text-muted);
        font-family: var(--font-body, sans-serif); font-size: .85rem }
    `;
    this._container = document.createElement("div");
    this._container.className = "mn-fc";
    this.shadowRoot.append(tokens, link1, link2, style, this._container);
  }
  async connectedCallback() {
    await this._tryInit();
  }
  disconnectedCallback() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._rebuild();
  }
  /* ── Public API ─────────────────────────────────────────── */
  getValue() {
    return this._ctrl?.getValue?.();
  }
  setValue(v) {
    this._ctrl?.setValue?.(v);
  }
  /* ── Private ────────────────────────────────────────────── */
  async _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._container.innerHTML = "";
    if (this.isConnected) await this._tryInit();
  }
  async _tryInit() {
    const M = await resolveEngine();
    const type = this.getAttribute("type") || "rotary";
    if (!M && type !== "slider") {
      this._container.innerHTML = "";
      this._container.className = "mn-fc mn-fc--empty";
      this._container.textContent = `Maranello ${type} not available`;
      return;
    }
    const factory = this._getFactory(M, type);
    if (!factory) {
      this._container.innerHTML = "";
      this._container.className = "mn-fc mn-fc--empty";
      this._container.textContent = `Maranello ${type} not available`;
      return;
    }
    let opts;
    try {
      opts = JSON.parse(this.getAttribute("options") || "{}");
    } catch {
      opts = {};
    }
    const changeHandler = (valueOrIndex, label) => {
      this.dispatchEvent(new CustomEvent("mn-change", {
        detail: { value: valueOrIndex, label: label ?? void 0 },
        bubbles: true,
        composed: true
      }));
    };
    this._container.innerHTML = "";
    this._container.className = "mn-fc";
    if (type === "toggle-lever") {
      this._ctrl = M.toggleLever(this._container, {
        ...opts,
        onChange: (on) => changeHandler(on)
      });
    } else if (type === "cruise-lever") {
      this._ctrl = M.cruiseLever(this._container, {
        ...opts,
        onChange: (idx, lbl) => changeHandler(idx, lbl)
      });
    } else if (type === "manettino") {
      this._ctrl = M.manettino(this._container, {
        ...opts,
        onChange: (idx, lbl) => changeHandler(idx, lbl)
      });
    } else if (type === "stepped-rotary") {
      this._ctrl = M.steppedRotary(this._container, {
        ...opts,
        onChange: (idx, lbl) => changeHandler(idx, lbl)
      });
    } else if (type === "rotary") {
      this._initRotary(M, opts, changeHandler);
    } else if (type === "slider") {
      this._initSlider(opts, changeHandler);
    }
  }
  _initRotary(M, opts, onChange) {
    if (!M?.initRotary) {
      this._container.textContent = "Rotary not available";
      return;
    }
    const positions = opts.positions || ["WET", "COMFORT", "SPORT", "RACE", "ESC OFF"];
    const initial = opts.initial ?? 2;
    const wrapper = document.createElement("div");
    wrapper.className = "mn-rotary";
    if (opts.label) {
      const lbl = document.createElement("span");
      lbl.className = "mn-ctrl-label";
      lbl.textContent = opts.label;
      wrapper.appendChild(lbl);
    }
    const housing = document.createElement("div");
    housing.className = "mn-rotary__housing";
    const pointer = document.createElement("div");
    pointer.className = "mn-rotary__pointer";
    housing.appendChild(pointer);
    wrapper.appendChild(housing);
    const valueEl = document.createElement("div");
    valueEl.className = "mn-rotary__value";
    wrapper.appendChild(valueEl);
    this._container.appendChild(wrapper);
    const instance = M.initRotary(wrapper, {
      steps: positions,
      initial,
      snap: true,
      onChange: (label, idx) => onChange(idx, label)
    });
    this._ctrl = {
      getValue: () => instance?.getValue?.() ?? initial,
      setValue: (v) => instance?.setStep?.(v),
      destroy: () => {
        wrapper.remove();
        instance?.destroy?.();
      }
    };
  }
  _initSlider(opts, onChange) {
    const min = opts.min ?? 0;
    const max = opts.max ?? 100;
    const step = opts.step ?? 1;
    const initial = opts.initial ?? min;
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:8px";
    if (opts.label) {
      const lbl = document.createElement("span");
      lbl.className = "mn-ctrl-label";
      lbl.textContent = opts.label;
      wrapper.appendChild(lbl);
    }
    const input = document.createElement("input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(initial);
    input.style.cssText = "width:140px;accent-color:var(--mn-accent)";
    input.addEventListener("input", () => onChange(Number(input.value)));
    const valEl = document.createElement("span");
    valEl.style.cssText = "font-family:var(--font-body,sans-serif);font-size:var(--text-micro,.65rem);color:var(--mn-text-tertiary)";
    valEl.textContent = String(initial);
    input.addEventListener("input", () => {
      valEl.textContent = input.value;
    });
    wrapper.append(input, valEl);
    this._container.appendChild(wrapper);
    this._ctrl = {
      getValue: () => Number(input.value),
      setValue: (v) => {
        input.value = String(v);
        valEl.textContent = String(v);
      },
      destroy: () => wrapper.remove()
    };
  }
  _getFactory(M, type) {
    if (!M) return type === "slider" ? true : null;
    const map = {
      "rotary": M.initRotary,
      "cruise-lever": M.cruiseLever,
      "manettino": M.manettino,
      "toggle-lever": M.toggleLever,
      "stepped-rotary": M.steppedRotary,
      "slider": true
    };
    return map[type] || null;
  }
}
customElements.define("mn-ferrari-control", MnFerrariControl);
//# sourceMappingURL=mn-ferrari-control.js.map
