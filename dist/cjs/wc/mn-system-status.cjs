"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnSystemStatus extends HTMLElement {
  static get observedAttributes() {
    return ["services", "poll-interval", "version", "environment"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._services = [];
    this._results = [];
    this._pollTimer = null;
    this._isOpen = false;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/components-tables-status.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: inline-block; position: relative }
      .mn-ss { position: relative; font-family: var(--font-body, sans-serif) }
      .mn-ss__pill { display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 14px; border-radius: 20px; cursor: pointer;
        background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border);
        color: var(--mn-text-tertiary); font-size: .8rem;
        transition: border-color .15s }
      .mn-ss__pill:hover { border-color: var(--mn-text-muted) }
      .mn-ss__dot { width: 8px; height: 8px; border-radius: 50%;
        flex-shrink: 0; transition: background .3s }
      .mn-ss__dot--active  { background: var(--signal-ok) }
      .mn-ss__dot--warning { background: var(--mn-accent) }
      .mn-ss__dot--danger  { background: var(--mn-error) }
      .mn-ss__panel { position: absolute; top: 100%; right: 0;
        margin-top: 8px; width: 300px; background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border); border-radius: 10px;
        padding: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(-4px); pointer-events: none;
        transition: opacity .2s, transform .2s; z-index: 9000 }
      .mn-ss__panel--open { opacity: 1; transform: translateY(0); pointer-events: auto }
      .mn-ss__header { display: flex; align-items: center; gap: 8px;
        margin-bottom: 10px; font-weight: 600; font-size: .85rem;
        color: var(--mn-text) }
      .mn-ss__row { display: flex; align-items: center; gap: 8px;
        padding: 6px 4px; border-radius: 6px; cursor: default;
        transition: background .1s; font-size: .85rem }
      .mn-ss__row:hover { background: var(--mn-border) }
      .mn-ss__row-name { flex: 1 }
      .mn-ss__row-ms { font-size: .75rem; color: var(--mn-text-muted); font-family: monospace }
      .mn-ss__row-ms--down { color: var(--mn-error); font-weight: 600 }
    `;
    const root = document.createElement("div");
    root.className = "mn-ss";
    this._pill = document.createElement("button");
    this._pill.className = "mn-ss__pill";
    this._pill.setAttribute("aria-haspopup", "true");
    this._pill.setAttribute("aria-expanded", "false");
    this._pill.setAttribute("aria-label", "System status");
    this._dot = document.createElement("span");
    this._dot.className = "mn-ss__dot mn-ss__dot--active";
    this._dot.setAttribute("aria-hidden", "true");
    this._verEl = document.createElement("span");
    this._envEl = document.createElement("span");
    this._pill.append(this._dot, this._verEl, this._envEl);
    this._pill.addEventListener("click", () => this._togglePanel());
    this._panel = document.createElement("div");
    this._panel.className = "mn-ss__panel";
    this._panel.setAttribute("role", "status");
    this._panel.setAttribute("aria-live", "polite");
    this._headerDot = document.createElement("span");
    this._headerDot.className = "mn-ss__dot mn-ss__dot--active";
    this._headerDot.setAttribute("aria-hidden", "true");
    this._headerLabel = document.createElement("span");
    this._headerLabel.textContent = "Checking\u2026";
    const hdr = document.createElement("div");
    hdr.className = "mn-ss__header";
    hdr.append(this._headerDot, this._headerLabel);
    this._serviceList = document.createElement("div");
    this._panel.append(hdr, this._serviceList);
    root.append(this._pill, this._panel);
    this.shadowRoot.append(tokens, link, style, root);
    this._onDocClick = (e) => {
      if (this._isOpen && !this.shadowRoot.contains(e.target) && !this.contains(e.target)) {
        this._closePanel();
      }
    };
    this._onDocKey = (e) => {
      if (e.key === "Escape" && this._isOpen) this._closePanel();
    };
  }
  connectedCallback() {
    this._readAttrs();
    document.addEventListener("click", this._onDocClick);
    document.addEventListener("keydown", this._onDocKey);
    this._startPolling();
    this.refresh();
  }
  disconnectedCallback() {
    this._stopPolling();
    document.removeEventListener("click", this._onDocClick);
    document.removeEventListener("keydown", this._onDocKey);
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    this._readAttrs();
    if (name === "poll-interval") {
      this._stopPolling();
      this._startPolling();
    }
    if (name === "services") this.refresh();
  }
  /* ── Public API ─────────────────────────────────────────── */
  async refresh() {
    this._headerLabel.textContent = "Checking\u2026";
    this._results = await Promise.all(this._services.map(async (svc) => {
      const start = performance.now();
      try {
        if (svc.url) {
          await fetch(svc.url, { mode: "no-cors", cache: "no-store" });
          return { name: svc.name, ok: true, ms: Math.round(performance.now() - start) };
        }
        await new Promise((r) => setTimeout(r, 50 + Math.random() * 200));
        return { name: svc.name, ok: true, ms: Math.round(performance.now() - start) };
      } catch {
        return { name: svc.name, ok: false, ms: Math.round(performance.now() - start) };
      }
    }));
    this._renderResults();
  }
  /* ── Private ────────────────────────────────────────────── */
  _readAttrs() {
    try {
      this._services = JSON.parse(this.getAttribute("services") || "[]");
    } catch {
      this._services = [];
    }
    this._verEl.textContent = this.getAttribute("version") || "";
    const env = this.getAttribute("environment") || "";
    this._envEl.textContent = env ? ` \xB7 ${env}` : "";
  }
  _renderResults() {
    this._serviceList.innerHTML = "";
    const hasDown = this._results.some((r) => !r.ok);
    const hasSlow = this._results.some((r) => r.ok && r.ms > 1e3);
    const cls = hasDown ? "danger" : hasSlow ? "warning" : "active";
    const label = hasDown ? "Degraded Performance" : hasSlow ? "Partial Degradation" : "All Systems Operational";
    this._dot.className = `mn-ss__dot mn-ss__dot--${cls}`;
    this._headerDot.className = `mn-ss__dot mn-ss__dot--${cls}`;
    this._headerLabel.textContent = label;
    this._results.forEach((r, i) => {
      const row = document.createElement("div");
      row.className = "mn-ss__row";
      if (this._services[i]) row.style.cursor = "pointer";
      const d = document.createElement("span");
      d.className = `mn-ss__dot mn-ss__dot--${!r.ok ? "danger" : r.ms > 1e3 ? "warning" : "active"}`;
      d.setAttribute("aria-hidden", "true");
      const n = document.createElement("span");
      n.className = "mn-ss__row-name";
      n.textContent = r.name;
      const m = document.createElement("span");
      m.className = "mn-ss__row-ms" + (!r.ok ? " mn-ss__row-ms--down" : "");
      m.textContent = r.ok ? `${r.ms}ms` : "DOWN";
      row.append(d, n, m);
      row.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("mn-service-click", {
          detail: { service: this._services[i], result: r },
          bubbles: true,
          composed: true
        }));
      });
      this._serviceList.appendChild(row);
    });
  }
  _togglePanel() {
    this._isOpen ? this._closePanel() : this._openPanel();
  }
  _openPanel() {
    this._isOpen = true;
    this._panel.classList.add("mn-ss__panel--open");
    this._pill.setAttribute("aria-expanded", "true");
    if (!this._results.length) this.refresh();
  }
  _closePanel() {
    this._isOpen = false;
    this._panel.classList.remove("mn-ss__panel--open");
    this._pill.setAttribute("aria-expanded", "false");
  }
  _startPolling() {
    const ms = parseInt(this.getAttribute("poll-interval"), 10);
    const interval = isNaN(ms) ? 3e4 : ms;
    if (interval > 0) this._pollTimer = setInterval(() => this.refresh(), interval);
  }
  _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }
}
customElements.define("mn-system-status", MnSystemStatus);
