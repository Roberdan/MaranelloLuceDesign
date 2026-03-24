"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnModal extends HTMLElement {
  static get observedAttributes() {
    return ["open", "title"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._trapHandler = null;
    const link = cssLink("../css/extended-tooltip-modal.css");
    const tokens = cssLink("../css/tokens.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: contents }
      .mn-modal-backdrop { position: fixed; inset: 0; z-index: 9000;
        background: rgba(0,0,0,.6); display: flex; align-items: center;
        justify-content: center; opacity: 0; pointer-events: none;
        transition: opacity var(--duration-md, .25s) }
      .mn-modal-backdrop--open { opacity: 1; pointer-events: auto }
      .mn-modal { background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border); border-radius: 12px;
        min-width: 320px; max-width: 90vw; max-height: 85vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 24px 48px rgba(0,0,0,.5) }
      .mn-modal__header { display: flex; align-items: center;
        justify-content: space-between; padding: 16px 20px;
        border-bottom: 1px solid var(--mn-border) }
      .mn-modal__title { font-family: var(--font-heading, sans-serif);
        font-size: 1.1rem; font-weight: 600;
        color: var(--mn-text) }
      .mn-modal__close { background: none; border: none; cursor: pointer;
        color: var(--mn-text-tertiary); font-size: 1.2rem; padding: 4px 8px;
        border-radius: 6px; transition: background .15s }
      .mn-modal__close:hover { background: var(--mn-border) }
      .mn-modal__body { padding: 20px; overflow-y: auto; flex: 1;
        color: var(--mn-text-tertiary) }
    `;
    this._backdrop = document.createElement("div");
    this._backdrop.className = "mn-modal-backdrop";
    const modal = document.createElement("div");
    modal.className = "mn-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    this._header = document.createElement("div");
    this._header.className = "mn-modal__header";
    this._titleEl = document.createElement("span");
    this._titleEl.className = "mn-modal__title";
    const closeBtn = document.createElement("button");
    closeBtn.className = "mn-modal__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u2715";
    closeBtn.addEventListener("click", () => this.close());
    this._header.append(this._titleEl, closeBtn);
    const body = document.createElement("div");
    body.className = "mn-modal__body";
    body.appendChild(document.createElement("slot"));
    modal.append(this._header, body);
    this._backdrop.appendChild(modal);
    this._modal = modal;
    this._backdrop.addEventListener("click", (e) => {
      if (e.target === this._backdrop) this.close();
    });
    this.shadowRoot.append(tokens, link, style, this._backdrop);
  }
  connectedCallback() {
    if (this.hasAttribute("open")) this._show();
  }
  disconnectedCallback() {
    this._removeTrap();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "open") {
      newVal !== null ? this._show() : this._hide();
    } else if (name === "title") {
      this._titleEl.textContent = newVal || "";
    }
  }
  /* ── Public API ─────────────────────────────────────────── */
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("mn-close", {
      bubbles: true,
      composed: true
    }));
  }
  /* ── Private ────────────────────────────────────────────── */
  _show() {
    this._backdrop.classList.add("mn-modal-backdrop--open");
    this._titleEl.textContent = this.getAttribute("title") || "";
    this._installTrap();
    const first = this._modal.querySelector("button");
    if (first) first.focus();
  }
  _hide() {
    this._backdrop.classList.remove("mn-modal-backdrop--open");
    this._removeTrap();
  }
  _installTrap() {
    this._removeTrap();
    this._trapHandler = (e) => {
      if (e.key === "Escape") {
        this.close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = this._modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && this.shadowRoot.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && this.shadowRoot.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    this.shadowRoot.addEventListener("keydown", this._trapHandler);
  }
  _removeTrap() {
    if (this._trapHandler) {
      this.shadowRoot.removeEventListener("keydown", this._trapHandler);
      this._trapHandler = null;
    }
  }
}
customElements.define("mn-modal", MnModal);
//# sourceMappingURL=mn-modal.cjs.map
