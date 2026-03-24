"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
let _engine = null;
async function resolveEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  console.warn("[mn-login] No engine found");
  return null;
}
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnLogin extends HTMLElement {
  static get observedAttributes() {
    return ["health-url", "title", "subtitle"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/layouts-chat-login.css");
    const link3 = cssLink("../css/gauge.css");
    this._container = document.createElement("div");
    this._container.className = "mn-wc-root";
    this._container.setAttribute("role", "main");
    this._container.setAttribute("aria-label", "Sign in");
    const hostStyle = document.createElement("style");
    hostStyle.textContent = ":host{display:block;width:100%;max-width:100%;box-sizing:border-box}";
    this.shadowRoot.append(hostStyle, link1, link2, link3, this._container);
  }
  async connectedCallback() {
    await this._init();
  }
  disconnectedCallback() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this._ctrl) this._rebuild();
  }
  /* ── Public API ─────────────────────────────────────────── */
  updateStatus(data) {
    this._ctrl?.updateStatus?.(data);
  }
  setError(msg) {
    this._ctrl?.setError?.(msg);
  }
  /* ── Internals ──────────────────────────────────────────── */
  async _init() {
    const M = await resolveEngine();
    if (!M?.loginScreen) return;
    const healthUrl = this.getAttribute("health-url") || void 0;
    this._ctrl = M.loginScreen(this._container, {
      buttonLabel: "Sign in with SSO",
      subtitle: this.getAttribute("subtitle") || void 0,
      version: void 0,
      healthUrl,
      autoHealth: !!healthUrl,
      showStatus: false,
      onLogin: () => {
        this.dispatchEvent(new CustomEvent("mn-login", {
          bubbles: true,
          composed: true
        }));
      }
    });
  }
  async _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._container.innerHTML = "";
    await this._init();
  }
}
customElements.define("mn-login", MnLogin);
