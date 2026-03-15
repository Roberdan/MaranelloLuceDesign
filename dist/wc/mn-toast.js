const _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnToast extends HTMLElement {
  static get observedAttributes() {
    return ["title", "message", "type", "duration"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timer = null;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/extended-toast-dropdown.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; pointer-events: auto }
      .mn-toast { display: flex; align-items: flex-start; gap: 12px;
        padding: 12px 16px; border-radius: 8px; min-width: 280px;
        max-width: 420px; box-shadow: 0 8px 24px rgba(0,0,0,.4);
        background: var(--nero-soft, #1a1a1a);
        border-left: 4px solid var(--grigio-medio, #777);
        color: var(--grigio-chiaro, #ccc);
        transition: opacity .3s, transform .3s;
        font-family: var(--font-body, sans-serif) }
      .mn-toast--success { border-left-color: var(--verde-racing, #00C853) }
      .mn-toast--warning { border-left-color: var(--giallo-ferrari, #FFC72C) }
      .mn-toast--danger  { border-left-color: var(--rosso-corsa, #DC0000) }
      .mn-toast--info    { border-left-color: var(--azzurro-pista, #0091EA) }
      .mn-toast__icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 2px }
      .mn-toast__message { flex: 1; min-width: 0 }
      .mn-toast__title { font-weight: 600; font-size: .9rem;
        color: var(--bianco-caldo, #f5f0e8); margin-bottom: 2px }
      .mn-toast__text { font-size: .85rem; line-height: 1.4 }
      .mn-toast__close { background: none; border: none; cursor: pointer;
        color: var(--grigio-chiaro, #aaa); font-size: 1rem; padding: 2px 6px;
        border-radius: 4px; flex-shrink: 0 }
      .mn-toast__close:hover { background: var(--grigio-scuro, #333) }
      .mn-toast--removing { opacity: 0; transform: translateX(100%) }
    `;
    this._toast = document.createElement("div");
    this._toast.setAttribute("role", "alert");
    this._iconEl = document.createElement("span");
    this._iconEl.className = "mn-toast__icon";
    const msg = document.createElement("div");
    msg.className = "mn-toast__message";
    this._titleEl = document.createElement("div");
    this._titleEl.className = "mn-toast__title";
    this._textEl = document.createElement("div");
    this._textEl.className = "mn-toast__text";
    msg.append(this._titleEl, this._textEl);
    const closeBtn = document.createElement("button");
    closeBtn.className = "mn-toast__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u2715";
    closeBtn.addEventListener("click", () => this._dismiss());
    this._toast.append(this._iconEl, msg, closeBtn);
    this.shadowRoot.append(tokens, link, style, this._toast);
  }
  connectedCallback() {
    this._render();
    this._scheduleRemoval();
  }
  disconnectedCallback() {
    if (this._timer) clearTimeout(this._timer);
  }
  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }
  /* ── Private ────────────────────────────────────────────── */
  _render() {
    const type = this.getAttribute("type") || "info";
    this._toast.className = `mn-toast mn-toast--${type}`;
    const isUrgent = type === "danger" || type === "warning";
    this._toast.setAttribute("role", isUrgent ? "alert" : "status");
    this._toast.setAttribute("aria-live", isUrgent ? "assertive" : "polite");
    this._titleEl.textContent = this.getAttribute("title") || "";
    this._titleEl.style.display = this.getAttribute("title") ? "" : "none";
    this._textEl.textContent = this.getAttribute("message") || "";
    const icons = { success: "\u2713", warning: "\u26A0", danger: "\u2716", info: "\u2139" };
    this._iconEl.textContent = icons[type] || icons.info;
  }
  _scheduleRemoval() {
    if (this._timer) clearTimeout(this._timer);
    const dur = parseInt(this.getAttribute("duration"), 10);
    const ms = isNaN(dur) ? 4e3 : dur;
    if (ms > 0) {
      this._timer = setTimeout(() => this._dismiss(), ms);
    }
  }
  _dismiss() {
    this._toast.classList.add("mn-toast--removing");
    setTimeout(() => this.remove(), 300);
  }
}
customElements.define("mn-toast", MnToast);
//# sourceMappingURL=mn-toast.js.map
