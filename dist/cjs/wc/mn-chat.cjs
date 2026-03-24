"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
let _engine = null;
async function resolveEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  console.warn("[mn-chat] No engine found");
  return null;
}
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnChat extends HTMLElement {
  static get observedAttributes() {
    return ["title", "welcome-message", "avatar", "quick-actions"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/layouts-chat-login.css");
    const link3 = cssLink("../css/extended-toast-dropdown.css");
    this._container = document.createElement("div");
    this._container.className = "mn-wc-root";
    this.shadowRoot.append(link1, link2, link3, this._container);
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
  open() {
    this._ctrl?.open?.();
  }
  close() {
    this._ctrl?.close?.();
  }
  addMessage(role, text) {
    this._ctrl?.addMessage?.(role, text);
  }
  setTyping(on) {
    this._ctrl?.setTyping?.(!!on);
  }
  /* ── Internals ──────────────────────────────────────────── */
  _parseJSON(attr, fallback) {
    try {
      return JSON.parse(this.getAttribute(attr) || "");
    } catch {
      return fallback;
    }
  }
  async _init() {
    const M = await resolveEngine();
    if (!M?.aiChat) return;
    this._ctrl = M.aiChat(this._container, {
      title: this.getAttribute("title") || "Chat",
      welcomeMessage: this.getAttribute("welcome-message") || void 0,
      avatar: this.getAttribute("avatar") || void 0,
      quickActions: this._parseJSON("quick-actions", []),
      onSend: (msg) => {
        this.dispatchEvent(new CustomEvent("mn-send", {
          detail: { message: msg },
          bubbles: true,
          composed: true
        }));
        return Promise.resolve();
      },
      onQuickAction: (action, ctx) => {
        this.dispatchEvent(new CustomEvent("mn-quick-action", {
          detail: { action, context: ctx },
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
customElements.define("mn-chat", MnChat);
