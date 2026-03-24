"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnTab extends HTMLElement {
  static get observedAttributes() {
    return ["label"];
  }
  constructor() {
    super();
  }
}
customElements.define("mn-tab", MnTab);
class MnTabs extends HTMLElement {
  static get observedAttributes() {
    return ["active"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._activeIdx = 0;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/extended-tabs-breadcrumb.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block }
      .mn-tabs__bar { display: flex; gap: 0;
        border-bottom: 2px solid var(--mn-border); margin-bottom: 16px }
      .mn-tabs__tab { padding: 10px 20px; cursor: pointer;
        font-family: var(--font-body, sans-serif); font-size: .9rem;
        color: var(--mn-text-muted); border: none; background: none;
        border-bottom: 2px solid transparent; margin-bottom: -2px;
        transition: color var(--duration-sm, .15s), border-color var(--duration-sm, .15s) }
      .mn-tabs__tab:hover { color: var(--mn-text-tertiary) }
      .mn-tabs__tab--active { color: var(--mn-text);
        border-bottom-color: var(--mn-accent); font-weight: 600 }
      .mn-tabs__panel { display: none }
      .mn-tabs__panel--active { display: block }
    `;
    this._bar = document.createElement("div");
    this._bar.className = "mn-tabs__bar";
    this._bar.setAttribute("role", "tablist");
    this._panels = document.createElement("div");
    this.shadowRoot.append(tokens, link, style, this._bar, this._panels);
  }
  connectedCallback() {
    this._activeIdx = parseInt(this.getAttribute("active"), 10) || 0;
    this._observer = new MutationObserver(() => this._rebuild());
    this._observer.observe(this, { childList: true, subtree: true, attributes: true });
    this._rebuild();
  }
  disconnectedCallback() {
    this._observer?.disconnect();
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "active") {
      const idx = parseInt(newVal, 10) || 0;
      if (idx !== this._activeIdx) {
        this._activeIdx = idx;
        this._activate(idx);
      }
    }
  }
  /* ── Private ────────────────────────────────────────────── */
  _rebuild() {
    this._bar.innerHTML = "";
    this._panels.innerHTML = "";
    const tabs = Array.from(this.querySelectorAll("mn-tab"));
    tabs.forEach((tab, i) => {
      const btn = document.createElement("button");
      btn.className = "mn-tabs__tab";
      btn.setAttribute("role", "tab");
      btn.setAttribute("tabindex", i === this._activeIdx ? "0" : "-1");
      btn.setAttribute("aria-selected", String(i === this._activeIdx));
      btn.textContent = tab.getAttribute("label") || `Tab ${i + 1}`;
      btn.addEventListener("click", () => this._select(i));
      btn.addEventListener("keydown", (e) => this._onKey(e, i, tabs.length));
      if (i === this._activeIdx) btn.classList.add("mn-tabs__tab--active");
      this._bar.appendChild(btn);
      const panel = document.createElement("div");
      panel.className = "mn-tabs__panel";
      panel.setAttribute("role", "tabpanel");
      if (i === this._activeIdx) panel.classList.add("mn-tabs__panel--active");
      const slot = document.createElement("slot");
      slot.name = `tab-${i}`;
      tab.setAttribute("slot", `tab-${i}`);
      panel.appendChild(slot);
      this._panels.appendChild(panel);
    });
  }
  _select(idx) {
    if (idx === this._activeIdx) return;
    this._activeIdx = idx;
    this._activate(idx);
    const tabs = Array.from(this.querySelectorAll("mn-tab"));
    this.dispatchEvent(new CustomEvent("mn-tab-change", {
      detail: { index: idx, label: tabs[idx]?.getAttribute("label") || "" },
      bubbles: true,
      composed: true
    }));
  }
  _activate(idx) {
    const btns = this._bar.querySelectorAll(".mn-tabs__tab");
    const panels = this._panels.querySelectorAll(".mn-tabs__panel");
    btns.forEach((b, i) => {
      const active = i === idx;
      b.classList.toggle("mn-tabs__tab--active", active);
      b.setAttribute("aria-selected", String(active));
      b.setAttribute("tabindex", active ? "0" : "-1");
    });
    panels.forEach((p, i) => {
      p.classList.toggle("mn-tabs__panel--active", i === idx);
    });
  }
  _onKey(e, idx, total) {
    let next = idx;
    if (e.key === "ArrowRight") {
      next = (idx + 1) % total;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      next = (idx - 1 + total) % total;
      e.preventDefault();
    } else return;
    this._select(next);
    this._bar.querySelectorAll(".mn-tabs__tab")[next]?.focus();
  }
}
customElements.define("mn-tabs", MnTabs);
