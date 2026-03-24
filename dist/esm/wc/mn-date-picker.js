let _engine = null;
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
const _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnDatePicker extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "disabled-dates"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const style = document.createElement("style");
    style.textContent = `
      :host{display:inline-block;position:relative}
      .mn-wc-trigger{display:flex;align-items:center;gap:8px;
        padding:8px 12px;border-radius:8px;cursor:pointer;
        background:var(--mn-surface-raised);
        border:1px solid var(--mn-border);
        color:var(--mn-text-tertiary);
        font-family:var(--font-body,sans-serif);font-size:.9rem;
        transition:border-color var(--duration-sm,.15s)}
      .mn-wc-trigger:hover{border-color:var(--mn-text-muted)}
      .mn-wc-trigger:focus{outline:2px solid var(--mn-accent);outline-offset:2px}
      .mn-wc-icon{font-size:1rem}
    `;
    this._trigger = document.createElement("button");
    this._trigger.className = "mn-wc-trigger";
    this._trigger.setAttribute("aria-label", "Pick a date");
    this._trigger.setAttribute("aria-haspopup", "dialog");
    const icon = document.createElement("span");
    icon.className = "mn-wc-icon";
    icon.textContent = "\u{1F4C5}";
    icon.setAttribute("aria-hidden", "true");
    this._label = document.createElement("span");
    this._label.textContent = "Select date";
    this._trigger.append(icon, this._label);
    this._trigger.addEventListener("click", () => this._toggle());
    this._anchor = document.createElement("div");
    this._anchor.style.position = "relative";
    this.shadowRoot.append(
      cssLink("../css/tokens.css"),
      cssLink("../css/forms-file-date-range.css"),
      style,
      this._trigger,
      this._anchor
    );
  }
  connectedCallback() {
    this._updateLabel();
  }
  disconnectedCallback() {
    this._teardownObserver();
    this.close();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === "value") this._updateLabel();
  }
  /* ── Public API ───────────────────────────────────────────── */
  getValue() {
    return this.getAttribute("value") || "";
  }
  close() {
    this._ctrl?.close?.();
    this._ctrl = null;
  }
  /* ── Private ──────────────────────────────────────────────── */
  _toggle() {
    if (this._ctrl) {
      this.close();
      return;
    }
    this._tryInit();
  }
  _tryInit() {
    const M = getEngine();
    if (!M?.datePicker) {
      this._waitForEngine(() => this._tryInit());
      return;
    }
    this._teardownObserver();
    let disabledSet = /* @__PURE__ */ new Set();
    try {
      disabledSet = new Set(JSON.parse(this.getAttribute("disabled-dates")));
    } catch {
    }
    this._ctrl = M.datePicker(this._anchor, {
      value: this.getAttribute("value") || void 0,
      min: this.getAttribute("min") || void 0,
      max: this.getAttribute("max") || void 0,
      onSelect: (dateStr) => {
        if (disabledSet.has(dateStr)) return;
        this.setAttribute("value", dateStr);
        this._updateLabel();
        this.dispatchEvent(new CustomEvent("mn-change", {
          detail: { date: dateStr },
          bubbles: true,
          composed: true
        }));
      }
    });
  }
  _updateLabel() {
    this._label.textContent = this.getAttribute("value") || "Select date";
  }
  _waitForEngine(cb) {
    requestAnimationFrame(() => {
      if (getEngine()) {
        cb();
        return;
      }
      if (this._mo) return;
      this._mo = new MutationObserver(() => {
        if (getEngine()) {
          this._teardownObserver();
          cb();
        }
      });
      this._mo.observe(document.head, { childList: true });
    });
  }
  _teardownObserver() {
    this._mo?.disconnect();
    this._mo = null;
  }
}
customElements.define("mn-date-picker", MnDatePicker);
//# sourceMappingURL=mn-date-picker.js.map
