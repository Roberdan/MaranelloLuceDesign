"use strict";
const import_meta = { url: require("url").pathToFileURL(__filename).href };
let _engine = null;
async function resolveEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  console.warn("[mn-profile] No engine found");
  return null;
}
const _base = new URL(".", import_meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
class MnProfile extends HTMLElement {
  static get observedAttributes() {
    return ["name", "email", "avatar-url", "sections"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    const link1 = cssLink("../css/tokens.css");
    const link2 = cssLink("../css/extended-avatar-spinner.css");
    const link3 = cssLink("../css/extended-toast-dropdown.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: inline-block; position: relative; cursor: pointer; }
      .mn-wc-trigger { display: inline-flex; align-items: center; }
    `;
    this._trigger = document.createElement("div");
    this._trigger.className = "mn-wc-trigger";
    this._trigger.setAttribute("role", "button");
    this._trigger.setAttribute("tabindex", "0");
    this._trigger.setAttribute("aria-haspopup", "true");
    this._trigger.setAttribute("aria-expanded", "false");
    this._trigger.setAttribute("aria-label", "User profile menu");
    const slot = document.createElement("slot");
    this._trigger.appendChild(slot);
    this._dropdown = document.createElement("div");
    this._dropdown.className = "mn-wc-dropdown";
    this.shadowRoot.append(link1, link2, link3, style, this._trigger, this._dropdown);
  }
  async connectedCallback() {
    await this._init();
  }
  disconnectedCallback() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || !this._ctrl) return;
    this._handleAttr(name, newVal);
  }
  /* ── Public API ─────────────────────────────────────────── */
  open() {
    this._ctrl?.open?.();
    this._trigger.setAttribute("aria-expanded", "true");
  }
  close() {
    this._ctrl?.close?.();
    this._trigger.setAttribute("aria-expanded", "false");
  }
  setUser(name, email, url) {
    if (typeof name === "object" && name !== null) {
      this._ctrl?.setUser?.(name);
    } else {
      this._ctrl?.setUser?.(name, email, url);
    }
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
    if (!M?.profileMenu) return;
    const sections = this._parseJSON("sections", []);
    this._ctrl = M.profileMenu(this._trigger, {
      name: this.getAttribute("name") || "",
      email: this.getAttribute("email") || "",
      avatarUrl: this.getAttribute("avatar-url") || void 0,
      sections
    });
  }
  _handleAttr(name) {
    if (!this._ctrl) return;
    switch (name) {
      case "name":
      case "email":
      case "avatar-url":
        this._ctrl.setUser?.({
          name: this.getAttribute("name") || "",
          email: this.getAttribute("email") || "",
          avatarUrl: this.getAttribute("avatar-url") || void 0
        });
        break;
      case "sections":
        this._rebuild();
        break;
    }
  }
  async _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._dropdown.innerHTML = "";
    await this._init();
  }
}
customElements.define("mn-profile", MnProfile);
//# sourceMappingURL=mn-profile.cjs.map
