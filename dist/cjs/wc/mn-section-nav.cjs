"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const LABELS = {
  "hero": "Home",
  "tokens": "Tokens",
  "cards": "Cards",
  "dashboard": "Dashboard",
  "charts": "Charts",
  "network": "Network",
  "controls": "Controls",
  "forms": "Forms",
  "tables": "Tables",
  "gauges": "Gauges",
  "cockpit": "Cockpit",
  "telemetry": "Telemetry",
  "gantt": "Gantt",
  "icons": "Icons",
  "animations": "Animations",
  "heatmap": "Heatmap",
  "treemap": "Treemap",
  "layouts": "Layouts",
  "detail-panel": "Detail Panel",
  "interactive": "Chat",
  "okr": "OKR",
  "map": "Map",
  "social-graph": "Social Graph",
  "advanced": "Advanced",
  "mesh-network": "Mesh Network",
  "convergio": "Convergio",
  "web-components": "Web Comps",
  "launch": "Launch",
  "accessibility": "A11y",
  "api-reference": "API Ref",
  "data-binding": "Data Binding",
  "overlays": "Overlays",
  "org-tree": "Org Tree"
};
const CSS = `
:host { display: block; width: 100%; box-sizing: border-box; }

.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 52px;
  background: rgba(28,28,32,0.98);
  backdrop-filter: blur(8px);
  font-family: var(--font-display, 'Space Grotesk', sans-serif);
  font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
  font-weight: 500; gap: 1rem;
  border-top: 1px solid var(--mn-hover-bg);
  border-bottom: 1px solid var(--mn-hover-bg);
  box-shadow: 0 2px 12px rgba(0,0,0,0.55);
}

/* Accent stripe */
:host([data-pos="top"]) .nav {
  border-bottom: 2px solid rgba(255,199,44,0.5);
  border-top: 1px solid var(--mn-hover-bg);
}
:host([data-pos="bottom"]) .nav {
  border-top: 2px solid rgba(255,199,44,0.5);
  border-bottom: none;
}

.btn {
  display: flex; align-items: center; gap: 0.55rem;
  background: none; border: none; cursor: pointer;
  color: rgba(220,220,220,0.7);
  font-family: inherit; font-size: inherit;
  letter-spacing: inherit; text-transform: inherit; font-weight: inherit;
  padding: 0.5rem 0; transition: color 0.18s;
  min-width: 0; flex: 1;
}
.btn:hover:not([disabled]) { color: var(--mn-accent); }
.btn:focus-visible {
  outline: 2px solid var(--mn-accent);
  outline-offset: 3px; border-radius: 2px;
}
/* keep flex space but make invisible \u2014 so center stays centered */
.btn[disabled] { opacity: 0; pointer-events: none; }
.btn--prev { justify-content: flex-start; }
.btn--next { justify-content: flex-end; }

.arrow {
  flex-shrink: 0; font-size: 0.8rem;
  color: var(--mn-accent);
  transition: color 0.18s;
}
.btn:hover:not([disabled]) .arrow { color: inherit; }

.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }

.center {
  flex: 0 0 auto; text-align: center; white-space: nowrap;
  color: rgba(220,220,220,0.55); font-size: 0.68rem;
  padding: 0 0.5rem; line-height: 1; user-select: none;
}
.pos { color: var(--mn-accent); font-weight: 700; font-size: 0.85rem; }
.sep { opacity: 0.35; margin: 0 0.3em; }
.cur { color: rgba(220,220,220,0.8); }

/* \u2500\u2500 Avorio \u2500\u2500 */
:host([data-theme="avorio"]) .nav {
  background: rgba(250,243,230,0.98);
  border-color: rgba(0,0,0,0.07);
}
:host([data-theme="avorio"][data-pos="top"]) .nav { border-bottom-color: rgba(220,0,0,0.3); }
:host([data-theme="avorio"][data-pos="bottom"]) .nav { border-top-color: rgba(220,0,0,0.3); }
:host([data-theme="avorio"]) .btn { color: rgba(40,40,40,0.45); }
:host([data-theme="avorio"]) .btn:hover:not([disabled]) { color: #DC0000; }
:host([data-theme="avorio"]) .arrow { color: #DC0000; }
:host([data-theme="avorio"]) .center { color: rgba(40,40,40,0.35); }
:host([data-theme="avorio"]) .pos { color: #DC0000; }
:host([data-theme="avorio"]) .cur { color: rgba(40,40,40,0.55); }

/* \u2500\u2500 Colorblind \u2500\u2500 */
:host([data-theme="colorblind"][data-pos="top"]) .nav { border-bottom-color: rgba(0,114,178,0.4); }
:host([data-theme="colorblind"][data-pos="bottom"]) .nav { border-top-color: rgba(0,114,178,0.4); }
:host([data-theme="colorblind"]) .btn:hover:not([disabled]) { color: #0072B2; }
:host([data-theme="colorblind"]) .arrow { color: #0072B2; }
:host([data-theme="colorblind"]) .pos { color: #0072B2; }

/* \u2500\u2500 Mobile \u2500\u2500 */
@media (max-width: 600px) {
  .lbl { max-width: 90px; }
  .center { font-size: 0.58rem; padding: 0 0.25rem; }
  .nav { padding: 0 1rem; }
}
@media (max-width: 400px) {
  .center { display: none; }
}
`;
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function lbl(id) {
  return LABELS[id] ?? esc(id);
}
function syncTheme(el) {
  const cls = document.body.className;
  if (cls.includes("mn-avorio")) el.setAttribute("data-theme", "avorio");
  else if (cls.includes("mn-colorblind")) el.setAttribute("data-theme", "colorblind");
  else el.removeAttribute("data-theme");
}
class MnSectionNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this._onTheme = (e) => {
      const t = e.detail?.theme ?? "nero";
      if (t === "avorio" || t === "colorblind") this.setAttribute("data-theme", t);
      else this.removeAttribute("data-theme");
    };
    document.addEventListener("mn-theme-change", this._onTheme);
    syncTheme(this);
    this._render();
  }
  disconnectedCallback() {
    document.removeEventListener("mn-theme-change", this._onTheme);
  }
  attributeChangedCallback() {
    this._render();
  }
  _go(id) {
    window.location.hash = id;
  }
  _render() {
    const sections = (this.getAttribute("sections") ?? "").split(",").filter(Boolean);
    const current = this.getAttribute("current") ?? "";
    const idx = sections.indexOf(current);
    const prev = idx > 0 ? sections[idx - 1] : null;
    const next = idx < sections.length - 1 ? sections[idx + 1] : null;
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
<nav class="nav" role="navigation" aria-label="Section navigation">
  <button class="btn btn--prev" ${!prev ? 'disabled aria-hidden="true"' : `aria-label="Previous: ${lbl(prev)}"`}>
    <span class="arrow" aria-hidden="true">\u25C0</span>
    <span class="lbl">${prev ? lbl(prev) : ""}</span>
  </button>
  <div class="center" aria-live="polite" aria-atomic="true">
    <span class="pos">${idx + 1}</span>
    <span class="sep">/</span>
    <span>${sections.length}</span>
    <span class="sep">\xB7</span>
    <span class="cur">${lbl(current)}</span>
  </div>
  <button class="btn btn--next" ${!next ? 'disabled aria-hidden="true"' : `aria-label="Next: ${lbl(next)}"`}>
    <span class="lbl">${next ? lbl(next) : ""}</span>
    <span class="arrow" aria-hidden="true">\u25B6</span>
  </button>
</nav>`;
    if (prev) this.shadowRoot.querySelector(".btn--prev").addEventListener("click", () => this._go(prev));
    if (next) this.shadowRoot.querySelector(".btn--next").addEventListener("click", () => this._go(next));
  }
}
__publicField(MnSectionNav, "observedAttributes", ["sections", "current", "data-theme", "data-pos"]);
customElements.define("mn-section-nav", MnSectionNav);
