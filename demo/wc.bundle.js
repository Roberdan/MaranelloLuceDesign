var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// src/wc/mn-a11y-fallback.js
function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE)) };
  } catch {
    return { ...DEFAULTS };
  }
}
function applySettings(s) {
  const root = document.documentElement;
  root.style.fontSize = (SIZES[s.fontSize] || 1) * 16 + "px";
  root.classList.toggle("mn-reduced-motion", s.reducedMotion);
  root.classList.toggle("mn-high-contrast", s.highContrast);
  root.classList.toggle("mn-no-focus-ring", !s.focusVisible);
  try {
    localStorage.setItem(STORAGE, JSON.stringify(s));
  } catch {
  }
}
function mkDiv(cls) {
  const d = document.createElement("div");
  d.className = cls;
  return d;
}
function buildToggle(label, key, s, onApply) {
  const r = mkDiv("mn-a11y-panel__row");
  const l = document.createElement("span");
  l.className = "mn-a11y-panel__row-label";
  l.textContent = label;
  const t = document.createElement("button");
  t.className = "mn-a11y-toggle" + (s[key] ? " mn-a11y-toggle--on" : "");
  t.setAttribute("role", "switch");
  t.setAttribute("aria-checked", String(!!s[key]));
  const thumb = document.createElement("span");
  thumb.className = "mn-a11y-toggle__thumb";
  t.appendChild(thumb);
  t.addEventListener("click", () => {
    s[key] = !s[key];
    t.classList.toggle("mn-a11y-toggle--on", s[key]);
    t.setAttribute("aria-checked", String(s[key]));
    onApply();
  });
  r.append(l, t);
  return r;
}
function buildA11yFallback(shadowRoot) {
  const s = loadSettings();
  const apply = () => applySettings(s);
  const fab = document.createElement("button");
  fab.className = "mn-a11y-fab";
  fab.innerHTML = "\u2699";
  fab.setAttribute("aria-label", "Display settings");
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "mn-a11y-panel");
  const panel = document.createElement("div");
  panel.id = "mn-a11y-panel";
  panel.className = "mn-a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Accessibility settings");
  panel.setAttribute("aria-modal", "true");
  const title = mkDiv("mn-a11y-panel__title");
  title.textContent = "\u2699 Display";
  panel.appendChild(title);
  const fsGroup = mkDiv("mn-a11y-panel__group");
  const fsLabel = mkDiv("mn-a11y-panel__label");
  fsLabel.textContent = "Text Size";
  const fsBtns = mkDiv("mn-a11y-panel__size-btns");
  ["sm", "md", "lg", "xl"].forEach((k) => {
    const b = document.createElement("button");
    b.className = "mn-a11y-panel__size-btn" + (s.fontSize === k ? " mn-a11y-panel__size-btn--active" : "");
    b.textContent = k.toUpperCase();
    b.addEventListener("click", () => {
      s.fontSize = k;
      fsBtns.querySelectorAll(".mn-a11y-panel__size-btn").forEach((x) => x.classList.toggle("mn-a11y-panel__size-btn--active", x === b));
      apply();
    });
    fsBtns.appendChild(b);
  });
  fsGroup.append(fsLabel, fsBtns);
  panel.appendChild(fsGroup);
  const divider = () => {
    const d = mkDiv("mn-a11y-panel__divider");
    return d;
  };
  panel.appendChild(divider());
  panel.appendChild(buildToggle("Reduced Motion", "reducedMotion", s, apply));
  panel.appendChild(buildToggle("High Contrast", "highContrast", s, apply));
  panel.appendChild(buildToggle("Focus Indicators", "focusVisible", s, apply));
  panel.appendChild(divider());
  const resetBtn = document.createElement("button");
  resetBtn.className = "mn-a11y-panel__reset";
  resetBtn.textContent = "Reset to Defaults";
  resetBtn.addEventListener("click", () => {
    Object.assign(s, DEFAULTS);
    apply();
    panel.querySelectorAll(".mn-a11y-panel__size-btn").forEach((b) => b.classList.toggle("mn-a11y-panel__size-btn--active", b.textContent === "MD"));
  });
  panel.appendChild(resetBtn);
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-a11y-panel--open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
  });
  shadowRoot.append(fab, panel);
  apply();
  return {
    getSettings: () => ({ ...s }),
    reset: () => resetBtn.click(),
    destroy: () => {
      fab.remove();
      panel.remove();
    }
  };
}
var STORAGE, DEFAULTS, SIZES;
var init_mn_a11y_fallback = __esm({
  "src/wc/mn-a11y-fallback.js"() {
    "use strict";
    STORAGE = "mn-a11y";
    DEFAULTS = { fontSize: "md", reducedMotion: false, highContrast: false, focusVisible: true };
    SIZES = { sm: 0.875, md: 1, lg: 1.125, xl: 1.25 };
  }
});

// src/wc/mn-a11y.js
var mn_a11y_exports = {};
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
var _engine, _base, MnA11y;
var init_mn_a11y = __esm({
  "src/wc/mn-a11y.js"() {
    "use strict";
    init_mn_a11y_fallback();
    _engine = null;
    _base = new URL(".", import.meta.url).href;
    MnA11y = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const tokens = cssLink("../css/tokens.css");
        const link = cssLink("../css/accessibility.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: contents }
      .mn-a11y-fab { position: fixed; bottom: 20px; right: 20px; z-index: 8500;
        width: 44px; height: 44px; border-radius: 50%; border: none;
        background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444);
        color: var(--grigio-chiaro, #ccc); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,.4);
        transition: background .15s, transform .15s; font-size: 1.1rem }
      .mn-a11y-fab:hover { background: var(--grigio-scuro, #333);
        transform: scale(1.05) }
      .mn-a11y-panel { position: fixed; bottom: 74px; right: 20px; z-index: 8500;
        width: 280px; background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444); border-radius: 12px;
        padding: 16px; box-shadow: 0 12px 32px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(8px); pointer-events: none;
        transition: opacity .2s, transform .2s;
        font-family: var(--font-body, sans-serif);
        color: var(--grigio-chiaro, #ccc) }
      .mn-a11y-panel--open { opacity: 1; transform: translateY(0);
        pointer-events: auto }
      .mn-a11y-panel__title { font-weight: 600; font-size: .95rem;
        color: var(--bianco-caldo, #f5f0e8); margin-bottom: 14px;
        display: flex; align-items: center; gap: 6px }
      .mn-a11y-panel__group { margin-bottom: 12px }
      .mn-a11y-panel__label { font-size: .75rem; text-transform: uppercase;
        letter-spacing: .06em; color: var(--grigio-medio, #777); margin-bottom: 6px }
      .mn-a11y-panel__size-btns { display: flex; gap: 4px }
      .mn-a11y-panel__size-btn { padding: 6px 12px; border-radius: 6px;
        border: 1px solid var(--grigio-scuro, #444); background: transparent;
        color: var(--grigio-chiaro, #ccc); cursor: pointer; font-size: .8rem;
        transition: all .15s }
      .mn-a11y-panel__size-btn--active { background: var(--rosso-corsa, #DC0000);
        border-color: var(--rosso-corsa, #DC0000); color: var(--bianco-puro, #fff) }
      .mn-a11y-panel__row { display: flex; align-items: center;
        justify-content: space-between; padding: 6px 0 }
      .mn-a11y-panel__row-label { font-size: .85rem }
      .mn-a11y-toggle { width: 40px; height: 22px; border-radius: 11px;
        background: var(--grigio-scuro, #444); border: none; cursor: pointer;
        position: relative; transition: background .15s; padding: 0 }
      .mn-a11y-toggle--on { background: var(--rosso-corsa, #DC0000) }
      .mn-a11y-toggle__thumb { width: 18px; height: 18px; border-radius: 50%;
        background: var(--bianco-puro, #fff); position: absolute; top: 2px;
        left: 2px; transition: left .15s }
      .mn-a11y-toggle--on .mn-a11y-toggle__thumb { left: 20px }
      .mn-a11y-panel__divider { height: 1px; background: var(--grigio-scuro, #333);
        margin: 10px 0 }
      .mn-a11y-panel__reset { width: 100%; padding: 8px; border-radius: 6px;
        border: 1px solid var(--grigio-scuro, #444); background: transparent;
        color: var(--grigio-chiaro, #ccc); cursor: pointer; font-size: .8rem;
        margin-top: 8px; transition: background .15s }
      .mn-a11y-panel__reset:hover { background: var(--grigio-scuro, #333) }
    `;
        this.shadowRoot.append(tokens, link, style);
      }
      connectedCallback() {
        this._tryInit();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      /* ── Public API ─────────────────────────────────────────── */
      getSettings() {
        return this._ctrl?.getSettings?.() ?? {};
      }
      reset() {
        this._ctrl?.reset?.();
      }
      /* ── Private ────────────────────────────────────────────── */
      _tryInit() {
        const M = getEngine();
        if (M?.a11yPanel && M._a11yDom) {
          this._ctrl = M.a11yPanel();
          return;
        }
        this._waitForEngine(() => {
          const M2 = getEngine();
          if (M2?.a11yPanel && M2._a11yDom) {
            this._ctrl = M2.a11yPanel();
          } else {
            this._useFallback();
          }
        });
        requestAnimationFrame(() => {
          if (!this._ctrl) this._useFallback();
        });
      }
      _useFallback() {
        if (this._ctrl) return;
        this._teardownObserver();
        this._ctrl = buildA11yFallback(this.shadowRoot);
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
    };
    customElements.define("mn-a11y", MnA11y);
  }
});

// src/wc/mn-chart.js
var mn_chart_exports = {};
async function resolveCharts() {
  if (window.Maranello?.charts) return window.Maranello.charts;
  try {
    const mod = await import("../esm/charts/index.js");
    return mod;
  } catch {
  }
  return null;
}
function cssLink2(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base2).href;
  return link;
}
var _base2, MnChart;
var init_mn_chart = __esm({
  "src/wc/mn-chart.js"() {
    "use strict";
    _base2 = new URL(".", import.meta.url).href;
    MnChart = class extends HTMLElement {
      static get observedAttributes() {
        return ["type", "data", "options", "width", "height"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._initAttempts = 0;
        this._charts = null;
        const style = document.createElement("style");
        style.textContent = ":host{display:inline-block}canvas{display:block}.mn-chart__root{position:relative}";
        this._container = document.createElement("div");
        this._container.className = "mn-chart__root";
        this._canvas = document.createElement("canvas");
        this._container.append(this._canvas);
        this.shadowRoot.append(
          cssLink2("../css/tokens.css"),
          cssLink2("../css/charts.css"),
          cssLink2("../css/charts-base.css"),
          style,
          this._container
        );
      }
      connectedCallback() {
        this.setAttribute("role", "img");
        if (!this.hasAttribute("aria-label")) {
          const type = this.getAttribute("type") || "chart";
          this.setAttribute("aria-label", `${type} visualization`);
        }
        this._init();
      }
      disconnectedCallback() {
        this._resizeObs?.disconnect();
        this._resizeObs = null;
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (this._charts) {
          this._rebuild();
        } else if (name === "type" && !this._ctrl) {
          this.setAttribute("aria-label", `${newVal || "chart"} visualization`);
        }
      }
      /* ── Public API ─────────────────────────────────────────── */
      /**
       * Update chart data/options imperatively.
       * @param {unknown[]} [data]
       * @param {Record<string, unknown>} [opts]
       */
      update(data, opts) {
        if (this._ctrl?.update) {
          this._ctrl.update(data, opts);
        } else {
          if (data) this.setAttribute("data", JSON.stringify(data));
          if (opts) this.setAttribute("options", JSON.stringify(opts));
        }
      }
      /* ── Internals ──────────────────────────────────────────── */
      /**
       * @param {string} attr
       * @param {unknown} fallback
       */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      async _init() {
        let charts = await resolveCharts();
        while (!charts && ++this._initAttempts < 60) {
          await new Promise((r) => requestAnimationFrame(r));
          charts = window.Maranello?.charts ?? null;
        }
        if (!charts) {
          console.warn("<mn-chart>: chart library not available (ESM or window.Maranello)");
          return;
        }
        this._charts = charts;
        const type = this.getAttribute("type") || "sparkline";
        const factory = charts[type];
        if (typeof factory !== "function") {
          console.warn(`<mn-chart>: unknown chart type "${type}"`);
          return;
        }
        const hasExplicitSize = this.hasAttribute("width") || this.hasAttribute("height");
        if (hasExplicitSize) {
          const w = parseInt(this.getAttribute("width") || "300", 10);
          const h = parseInt(this.getAttribute("height") || "200", 10);
          this._canvas.width = w;
          this._canvas.height = h;
          this._canvas.style.width = `${w}px`;
          this._canvas.style.height = `${h}px`;
        } else {
          const rect = this.getBoundingClientRect();
          const w = rect.width || 300;
          const h = rect.height || 200;
          this._canvas.width = w;
          this._canvas.height = h;
          this._canvas.style.width = `${w}px`;
          this._canvas.style.height = `${h}px`;
        }
        const data = this._parseJSON("data", []);
        const opts = this._parseJSON("options", {});
        const cw = this._canvas.width, ch = this._canvas.height;
        this._ctrl = factory(this._canvas, data, { ...opts, width: cw, height: ch });
        if (!hasExplicitSize && window.ResizeObserver) {
          this._attachResizeObserver(factory);
        }
        this.dispatchEvent(new CustomEvent("mn-chart-ready", { bubbles: true, composed: true }));
      }
      _attachResizeObserver(factory) {
        let tid = null;
        this._resizeObs = new ResizeObserver(() => {
          clearTimeout(tid);
          tid = setTimeout(() => {
            const r = this.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) return;
            this._ctrl?.destroy?.();
            this._canvas.width = r.width;
            this._canvas.height = r.height;
            this._canvas.style.width = `${r.width}px`;
            this._canvas.style.height = `${r.height}px`;
            const data = this._parseJSON("data", []);
            const opts = this._parseJSON("options", {});
            this._ctrl = factory(this._canvas, data, { ...opts, width: r.width, height: r.height });
          }, 150);
        });
        this._resizeObs.observe(this);
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._canvas.getContext("2d")?.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._initAttempts = 0;
        this._charts = null;
        this._init();
      }
    };
    customElements.define("mn-chart", MnChart);
  }
});

// src/wc/mn-chat.js
var mn_chat_exports = {};
async function resolveEngine() {
  if (_engine2) return _engine2;
  if (globalThis.Maranello) {
    _engine2 = globalThis.Maranello;
    return _engine2;
  }
  console.warn("[mn-chat] No engine found");
  return null;
}
function cssLink3(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base3).href;
  return link;
}
var _engine2, _base3, MnChat;
var init_mn_chat = __esm({
  "src/wc/mn-chat.js"() {
    "use strict";
    _engine2 = null;
    _base3 = new URL(".", import.meta.url).href;
    MnChat = class extends HTMLElement {
      static get observedAttributes() {
        return ["title", "welcome-message", "avatar", "quick-actions"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        const link1 = cssLink3("../css/tokens.css");
        const link2 = cssLink3("../css/layouts-chat-login.css");
        const link3 = cssLink3("../css/extended-toast-dropdown.css");
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
    };
    customElements.define("mn-chat", MnChat);
  }
});

// src/wc/mn-command-palette.js
var mn_command_palette_exports = {};
function cssLink4(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base4).href;
  return link;
}
var _base4, MnCommandPalette;
var init_mn_command_palette = __esm({
  "src/wc/mn-command-palette.js"() {
    "use strict";
    _base4 = new URL(".", import.meta.url).href;
    MnCommandPalette = class extends HTMLElement {
      static get observedAttributes() {
        return ["items", "placeholder"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._isOpen = false;
        this._items = [];
        this._focusIdx = -1;
        const tokens = cssLink4("../css/tokens.css");
        const link = cssLink4("../css/layouts-command-palette.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: contents }
      .mn-command-palette { position: fixed; inset: 0; z-index: 9500;
        display: flex; align-items: flex-start; justify-content: center;
        padding-top: 20vh; background: rgba(0,0,0,.5);
        opacity: 0; pointer-events: none; transition: opacity .2s }
      .mn-command-palette--open { opacity: 1; pointer-events: auto }
      .mn-cp__box { background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444); border-radius: 12px;
        width: 520px; max-width: 90vw; max-height: 60vh; overflow: hidden;
        box-shadow: 0 24px 48px rgba(0,0,0,.6); display: flex;
        flex-direction: column }
      .mn-cp__input { width: 100%; padding: 14px 16px; border: none;
        background: transparent; color: var(--bianco-caldo, #f5f0e8);
        font-family: var(--font-body, sans-serif); font-size: 1rem;
        border-bottom: 1px solid var(--grigio-scuro, #333); outline: none }
      .mn-cp__input::placeholder { color: var(--grigio-medio, #777) }
      .mn-cp__list { overflow-y: auto; padding: 8px 0; flex: 1 }
      .mn-cp__item { display: flex; align-items: center; gap: 10px;
        padding: 10px 16px; cursor: pointer; color: var(--grigio-chiaro, #ccc);
        font-family: var(--font-body, sans-serif); font-size: .9rem;
        transition: background .1s }
      .mn-cp__item:hover, .mn-cp__item--focused {
        background: var(--grigio-scuro, #333) }
      .mn-cp__item-icon { flex-shrink: 0; width: 18px; text-align: center }
      .mn-cp__item-text { flex: 1 }
      .mn-cp__item-shortcut { font-size: .75rem;
        color: var(--grigio-medio, #777); font-family: monospace }
      .mn-cp__empty { padding: 20px 16px; text-align: center;
        color: var(--grigio-medio, #777); font-size: .9rem }
      .mn-cp__group { padding: 6px 16px 4px; font-size: .7rem;
        text-transform: uppercase; letter-spacing: .08em;
        color: var(--grigio-medio, #666) }
    `;
        this._backdrop = document.createElement("div");
        this._backdrop.className = "mn-command-palette";
        const box = document.createElement("div");
        box.className = "mn-cp__box";
        this._input = document.createElement("input");
        this._input.className = "mn-cp__input";
        this._input.type = "text";
        this._input.setAttribute("autocomplete", "off");
        this._list = document.createElement("div");
        this._list.className = "mn-cp__list";
        box.append(this._input, this._list);
        this._backdrop.appendChild(box);
        this._input.addEventListener("input", () => this._filter());
        this._input.addEventListener("keydown", (e) => this._onKey(e));
        this._backdrop.addEventListener("click", (e) => {
          if (e.target === this._backdrop) this.close();
        });
        this._globalKey = (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            this._isOpen ? this.close() : this.open();
          }
        };
        this.shadowRoot.append(tokens, link, style, this._backdrop);
      }
      connectedCallback() {
        this._input.placeholder = this.getAttribute("placeholder") || "Type a command\u2026";
        this._parseItems();
        document.addEventListener("keydown", this._globalKey);
      }
      disconnectedCallback() {
        document.removeEventListener("keydown", this._globalKey);
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (name === "items") this._parseItems();
        if (name === "placeholder") this._input.placeholder = newVal || "Type a command\u2026";
      }
      /* ── Public API ─────────────────────────────────────────── */
      open() {
        this._isOpen = true;
        this._backdrop.classList.add("mn-command-palette--open");
        this._input.value = "";
        this._filter();
        this._input.focus();
      }
      close() {
        this._isOpen = false;
        this._backdrop.classList.remove("mn-command-palette--open");
        this._focusIdx = -1;
      }
      /* ── Private ────────────────────────────────────────────── */
      _parseItems() {
        try {
          this._items = JSON.parse(this.getAttribute("items") || "[]");
        } catch {
          this._items = [];
        }
        this._filter();
      }
      _filter() {
        const q = (this._input.value || "").toLowerCase();
        const filtered = q ? this._items.filter((it) => (it.text || "").toLowerCase().includes(q)) : this._items;
        this._renderList(filtered);
      }
      _renderList(items) {
        this._list.innerHTML = "";
        this._focusIdx = -1;
        if (!items.length) {
          const empty = document.createElement("div");
          empty.className = "mn-cp__empty";
          empty.textContent = "No commands found";
          this._list.appendChild(empty);
          return;
        }
        let lastGroup = null;
        items.forEach((item, i) => {
          if (item.group && item.group !== lastGroup) {
            lastGroup = item.group;
            const g = document.createElement("div");
            g.className = "mn-cp__group";
            g.textContent = item.group;
            this._list.appendChild(g);
          }
          const row = document.createElement("div");
          row.className = "mn-cp__item";
          row.dataset.index = String(i);
          if (item.icon) {
            const ic = document.createElement("span");
            ic.className = "mn-cp__item-icon";
            ic.textContent = item.icon;
            row.appendChild(ic);
          }
          const txt = document.createElement("span");
          txt.className = "mn-cp__item-text";
          txt.textContent = item.text || "";
          row.appendChild(txt);
          if (item.shortcut) {
            const sc = document.createElement("span");
            sc.className = "mn-cp__item-shortcut";
            sc.textContent = item.shortcut;
            row.appendChild(sc);
          }
          row.addEventListener("click", () => this._selectItem(item));
          this._list.appendChild(row);
        });
      }
      _selectItem(item) {
        this.dispatchEvent(new CustomEvent("mn-select", {
          detail: { item },
          bubbles: true,
          composed: true
        }));
        this.close();
      }
      _onKey(e) {
        const rows = this._list.querySelectorAll(".mn-cp__item");
        if (e.key === "Escape") {
          this.close();
          e.preventDefault();
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this._focusIdx = Math.min(this._focusIdx + 1, rows.length - 1);
          this._highlightRow(rows);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this._focusIdx = Math.max(this._focusIdx - 1, 0);
          this._highlightRow(rows);
        } else if (e.key === "Enter" && this._focusIdx >= 0 && rows[this._focusIdx]) {
          rows[this._focusIdx].click();
        }
      }
      _highlightRow(rows) {
        rows.forEach((r, i) => r.classList.toggle("mn-cp__item--focused", i === this._focusIdx));
        rows[this._focusIdx]?.scrollIntoView({ block: "nearest" });
      }
    };
    customElements.define("mn-command-palette", MnCommandPalette);
  }
});

// src/wc/mn-data-table.js
var mn_data_table_exports = {};
function getEngine2() {
  if (_engine3) return _engine3;
  if (globalThis.Maranello) {
    _engine3 = globalThis.Maranello;
    return _engine3;
  }
  return null;
}
function cssLink5(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base5).href;
  return link;
}
var _engine3, _base5, MnDataTable;
var init_mn_data_table = __esm({
  "src/wc/mn-data-table.js"() {
    "use strict";
    _engine3 = null;
    _base5 = new URL(".", import.meta.url).href;
    MnDataTable = class extends HTMLElement {
      static get observedAttributes() {
        return ["columns", "data", "page-size", "group-by", "selectable", "compact"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const link1 = cssLink5("../css/tokens.css");
        const link2 = cssLink5("../css/layouts-data-table-1.css");
        const link3 = cssLink5("../css/layouts-data-table-2.css");
        const link4 = cssLink5("../css/components-tables-status.css");
        this._container = document.createElement("div");
        this._container.className = "mn-wc-root";
        this._container.setAttribute("role", "grid");
        this.shadowRoot.append(link1, link2, link3, link4, this._container);
      }
      connectedCallback() {
        this.setAttribute("role", "table");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "Data table");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        this._update(name, newVal);
      }
      /* ── Public API ─────────────────────────────────────────── */
      setData(arr) {
        this._ctrl?.setData?.(arr);
      }
      setFilter(key, val) {
        this._ctrl?.setFilter?.(key, val);
      }
      clearFilters() {
        this._ctrl?.clearFilters?.();
      }
      refresh() {
        this._ctrl?.refresh?.();
      }
      getSelected() {
        return this._ctrl?.getSelected?.() ?? [];
      }
      /* ── Internals ──────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine2();
        if (!M?.dataTable) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const columns = this._parseJSON("columns", []);
        const data = this._parseJSON("data", []);
        const pageSize = parseInt(this.getAttribute("page-size") || "0", 10);
        const groupBy = this.getAttribute("group-by") || void 0;
        const selectable = this.hasAttribute("selectable");
        const compact = this.hasAttribute("compact");
        this._ctrl = M.dataTable(this._container, {
          columns,
          data,
          pageSize: pageSize || void 0,
          groupBy,
          selectable,
          compact,
          onRowClick: (row, idx) => {
            this.dispatchEvent(new CustomEvent("mn-row-click", {
              detail: { row, index: idx },
              bubbles: true,
              composed: true
            }));
          },
          onSort: (key, dir) => {
            this.dispatchEvent(new CustomEvent("mn-sort", {
              detail: { key, direction: dir },
              bubbles: true,
              composed: true
            }));
          },
          onFilter: (key, val) => {
            this.dispatchEvent(new CustomEvent("mn-filter", {
              detail: { key, value: val },
              bubbles: true,
              composed: true
            }));
          }
        });
      }
      _update(name, value) {
        if (!this._ctrl) return;
        switch (name) {
          case "data": {
            const parsed = (() => {
              try {
                return JSON.parse(value);
              } catch {
                return null;
              }
            })();
            if (Array.isArray(parsed)) this._ctrl.setData(parsed);
            break;
          }
          case "group-by":
            this._ctrl.setGroup?.(value || void 0);
            break;
          case "columns":
          case "page-size":
          case "selectable":
          case "compact":
            this._rebuild();
            break;
        }
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine2()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine2()) {
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
    };
    customElements.define("mn-data-table", MnDataTable);
  }
});

// src/wc/mn-date-picker.js
var mn_date_picker_exports = {};
function getEngine3() {
  if (_engine4) return _engine4;
  if (globalThis.Maranello) {
    _engine4 = globalThis.Maranello;
    return _engine4;
  }
  return null;
}
function cssLink6(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base6).href;
  return link;
}
var _engine4, _base6, MnDatePicker;
var init_mn_date_picker = __esm({
  "src/wc/mn-date-picker.js"() {
    "use strict";
    _engine4 = null;
    _base6 = new URL(".", import.meta.url).href;
    MnDatePicker = class extends HTMLElement {
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
        background:var(--nero-soft,#1a1a1a);
        border:1px solid var(--grigio-scuro,#444);
        color:var(--grigio-chiaro,#ccc);
        font-family:var(--font-body,sans-serif);font-size:.9rem;
        transition:border-color var(--duration-sm,.15s)}
      .mn-wc-trigger:hover{border-color:var(--grigio-medio,#777)}
      .mn-wc-trigger:focus{outline:2px solid var(--rosso-corsa,#DC0000);outline-offset:2px}
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
          cssLink6("../css/tokens.css"),
          cssLink6("../css/forms-file-date-range.css"),
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
        const M = getEngine3();
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
          if (getEngine3()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine3()) {
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
    };
    customElements.define("mn-date-picker", MnDatePicker);
  }
});

// src/wc/mn-detail-panel.js
var mn_detail_panel_exports = {};
function getEngine4() {
  if (_engine5) return _engine5;
  if (globalThis.Maranello) {
    _engine5 = globalThis.Maranello;
    return _engine5;
  }
  return null;
}
function cssLink7(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base7).href;
  return link;
}
var _engine5, _base7, MnDetailPanel;
var init_mn_detail_panel = __esm({
  "src/wc/mn-detail-panel.js"() {
    "use strict";
    _engine5 = null;
    _base7 = new URL(".", import.meta.url).href;
    MnDetailPanel = class extends HTMLElement {
      static get observedAttributes() {
        return ["title", "sections", "open"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        this._subComponents = {};
        const link1 = cssLink7("../css/tokens.css");
        const link2 = cssLink7("../css/layouts-detail-panel.css");
        const link3 = cssLink7("../css/layouts-detail-controls-1.css");
        const link4 = cssLink7("../css/layouts-detail-controls-2.css");
        this._container = document.createElement("div");
        this._container.className = "mn-wc-root";
        this.shadowRoot.append(link1, link2, link3, link4, this._container);
      }
      connectedCallback() {
        this.setAttribute("role", "complementary");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute(
            "aria-label",
            this.getAttribute("title") || "Detail panel"
          );
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
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
        this.setAttribute("open", "");
      }
      close() {
        this._ctrl?.close?.();
        this.removeAttribute("open");
      }
      setData(sections) {
        this._ctrl?.setData?.(sections);
      }
      startEdit() {
        this._ctrl?.startEdit?.();
      }
      save() {
        return this._ctrl?.save?.();
      }
      setSubComponent(tabName, renderFn) {
        this._subComponents[tabName] = renderFn;
      }
      /* ── Internals ──────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine4();
        if (!M?.detailPanel) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const sections = this._parseJSON("sections", {});
        this._ctrl = M.detailPanel(this._container, {
          title: this.getAttribute("title") || "",
          data: sections.data || sections,
          schema: sections.schema || void 0,
          tabs: sections.tabs || void 0,
          editable: true,
          subComponents: this._subComponents,
          onSave: (payload, original) => {
            this.dispatchEvent(new CustomEvent("mn-save", {
              detail: { payload, original },
              bubbles: true,
              composed: true
            }));
          },
          onClose: () => {
            this.removeAttribute("open");
            this.dispatchEvent(new CustomEvent("mn-close", {
              bubbles: true,
              composed: true
            }));
          }
        });
        if (this.hasAttribute("open")) {
          this._ctrl.open();
        }
      }
      _handleAttr(name, value) {
        if (!this._ctrl) return;
        switch (name) {
          case "title":
            this._ctrl.setTitle?.(value || "");
            break;
          case "sections": {
            const parsed = (() => {
              try {
                return JSON.parse(value);
              } catch {
                return null;
              }
            })();
            if (parsed) this._ctrl.setData?.(parsed.data || parsed);
            break;
          }
          case "open":
            if (value !== null) this._ctrl.open?.();
            else this._ctrl.close?.();
            break;
        }
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine4()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine4()) {
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
    };
    customElements.define("mn-detail-panel", MnDetailPanel);
  }
});

// src/wc/mn-ferrari-control.js
var mn_ferrari_control_exports = {};
async function resolveEngine2() {
  if (_engine6) return _engine6;
  if (globalThis.Maranello) {
    _engine6 = globalThis.Maranello;
    return _engine6;
  }
  console.warn("[mn-ferrari-control] No engine found");
  return null;
}
function cssLink8(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base8).href;
  return link;
}
var _engine6, _base8, MnFerrariControl;
var init_mn_ferrari_control = __esm({
  "src/wc/mn-ferrari-control.js"() {
    "use strict";
    _engine6 = null;
    _base8 = new URL(".", import.meta.url).href;
    MnFerrariControl = class extends HTMLElement {
      static get observedAttributes() {
        return ["type", "options"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        const tokens = cssLink8("../css/tokens.css");
        const link1 = cssLink8("../css/controls-rotary-slider.css");
        const link2 = cssLink8("../css/controls-buttons-switches.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: inline-block }
      .mn-fc { display: inline-flex; flex-direction: column; align-items: center }
      .mn-fc--empty { padding: 20px; color: var(--grigio-medio, #777);
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
        const M = await resolveEngine2();
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
        input.style.cssText = "width:140px;accent-color:var(--rosso-corsa,#DC0000)";
        input.addEventListener("input", () => onChange(Number(input.value)));
        const valEl = document.createElement("span");
        valEl.style.cssText = "font-family:var(--font-body,sans-serif);font-size:var(--text-micro,.65rem);color:var(--grigio-chiaro,#aaa)";
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
    };
    customElements.define("mn-ferrari-control", MnFerrariControl);
  }
});

// src/wc/mn-funnel.js
var mn_funnel_exports = {};
function getEngine5() {
  if (_engine7) return _engine7;
  if (globalThis.Maranello) {
    _engine7 = globalThis.Maranello;
    return _engine7;
  }
  return null;
}
function cssLink9(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base9).href;
  return link;
}
var _engine7, _base9, MnFunnel;
var init_mn_funnel = __esm({
  "src/wc/mn-funnel.js"() {
    "use strict";
    _engine7 = null;
    _base9 = new URL(".", import.meta.url).href;
    MnFunnel = class extends HTMLElement {
      static get observedAttributes() {
        return ["stages", "show-conversion", "animate"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const style = document.createElement("style");
        style.textContent = ":host{display:block;width:100%}.mn-funnel__root{width:100%}";
        this._container = document.createElement("div");
        this._container.className = "mn-funnel__root";
        this._container.setAttribute("role", "img");
        this.shadowRoot.append(
          cssLink9("../css/tokens.css"),
          cssLink9("../css/layouts-funnel.css"),
          cssLink9("../css/charts-heatmap-funnel-flip.css"),
          style,
          this._container
        );
      }
      connectedCallback() {
        this.setAttribute("role", "figure");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "Pipeline funnel");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        if (name === "stages") {
          const parsed = this._parseJSON("stages", null);
          if (Array.isArray(parsed)) this._ctrl.update(parsed);
        } else {
          this._rebuild();
        }
      }
      /* ── Public API ───────────────────────────────────────────── */
      update(stages) {
        this._ctrl?.update?.(stages);
      }
      /* ── Internals ────────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine5();
        if (!M?.funnel) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const stages = this._parseJSON("stages", []);
        const showConversion = this.hasAttribute("show-conversion");
        const animate = this.hasAttribute("animate");
        this._ctrl = M.funnel(this._container, {
          stages,
          showConversion,
          showPercentages: showConversion,
          animate,
          onClick: (stage, index) => {
            this.dispatchEvent(new CustomEvent("mn-funnel-click", {
              detail: { stage, index },
              bubbles: true,
              composed: true
            }));
          }
        });
        this.dispatchEvent(new CustomEvent("mn-funnel-ready", {
          bubbles: true,
          composed: true
        }));
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine5()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine5()) {
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
    };
    customElements.define("mn-funnel", MnFunnel);
  }
});

// src/wc/mn-gantt.js
var mn_gantt_exports = {};
function getEngine6() {
  if (_engine8) return _engine8;
  if (globalThis.Maranello) {
    _engine8 = globalThis.Maranello;
    return _engine8;
  }
  return null;
}
function cssLink10(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base10).href;
  return link;
}
var _engine8, _base10, MnGantt;
var init_mn_gantt = __esm({
  "src/wc/mn-gantt.js"() {
    "use strict";
    _engine8 = null;
    _base10 = new URL(".", import.meta.url).href;
    MnGantt = class extends HTMLElement {
      static get observedAttributes() {
        return ["tasks", "zoom", "label-width"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const link1 = cssLink10("../css/tokens.css");
        const link2 = cssLink10("../css/charts-gantt-timeline.css");
        const link3 = cssLink10("../css/charts-treemap-radar-gantt.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: block; width: 100%; }
      .mn-gantt__root { width: 100%; overflow: hidden; }
    `;
        this._container = document.createElement("div");
        this._container.className = "mn-gantt__root";
        this.shadowRoot.append(link1, link2, link3, style, this._container);
      }
      connectedCallback() {
        this.setAttribute("role", "figure");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "Gantt timeline");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        switch (name) {
          case "tasks": {
            const parsed = this._parseJSON("tasks", null);
            if (Array.isArray(parsed)) this._ctrl.setTasks(parsed);
            break;
          }
          case "zoom":
            this._ctrl.setZoom(Number(newVal));
            break;
          case "label-width":
            this._rebuild();
            break;
        }
      }
      /* ── Public API ─────────────────────────────────────────── */
      setTasks(arr) {
        this._ctrl?.setTasks?.(arr);
      }
      setZoom(n) {
        this._ctrl?.setZoom?.(Number(n));
      }
      scrollToToday() {
        this._ctrl?.scrollToToday?.();
      }
      expandAll() {
        this._ctrl?.expandAll?.();
      }
      collapseAll() {
        this._ctrl?.collapseAll?.();
      }
      fit() {
        this._ctrl?.fit?.();
      }
      /* ── Internals ──────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine6();
        if (!M?.gantt) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const tasks = this._parseJSON("tasks", []);
        const zoom = Number(this.getAttribute("zoom") || 0) || void 0;
        const labelWidth = Number(this.getAttribute("label-width") || 0) || void 0;
        const opts = {};
        if (zoom) opts.zoom = zoom;
        if (labelWidth) opts.labelWidth = labelWidth;
        opts.onSelect = (task, type) => {
          this.dispatchEvent(new CustomEvent("mn-gantt-select", {
            detail: { task, type, id: task?.id },
            bubbles: true,
            composed: true
          }));
        };
        opts.onClick = (task, type) => {
          this.dispatchEvent(new CustomEvent("mn-gantt-click", {
            detail: { task, type, id: task?.id },
            bubbles: true,
            composed: true
          }));
        };
        this._ctrl = M.gantt(this._container, tasks, opts);
        this.dispatchEvent(new CustomEvent("mn-gantt-ready", {
          bubbles: true,
          composed: true
        }));
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine6()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine6()) {
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
    };
    customElements.define("mn-gantt", MnGantt);
  }
});

// src/wc/mn-gauge.js
var mn_gauge_exports = {};
async function resolveEngine3() {
  if (window.Maranello?.FerrariGauge) return window.Maranello.FerrariGauge;
  try {
    const mod = await import(new URL("../ts/gauge-engine.js", _base11).href);
    if (mod?.FerrariGauge) return mod.FerrariGauge;
  } catch {
  }
  return null;
}
function cssLink11(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base11).href;
  return link;
}
var _base11, SIZE_MAP, MnGauge;
var init_mn_gauge = __esm({
  "src/wc/mn-gauge.js"() {
    "use strict";
    _base11 = new URL(".", import.meta.url).href;
    SIZE_MAP = { sm: 120, md: 220, lg: 320 };
    MnGauge = class extends HTMLElement {
      static get observedAttributes() {
        return ["value", "max", "unit", "label", "size", "config"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._gauge = null;
        this._ready = false;
        const style = document.createElement("style");
        style.textContent = `
      :host { display: inline-block; position: relative; }
      .mn-gauge__wrap { position: relative; }
      canvas { display: block; }
      .mn-gauge__glass {
        position: absolute; inset: 0;
        border-radius: 50%;
        background: radial-gradient(
          ellipse 70% 50% at 50% 35%,
          rgba(255,255,255,0.12) 0%,
          transparent 100%
        );
        pointer-events: none;
      }
    `;
        this._wrap = document.createElement("div");
        this._wrap.className = "mn-gauge__wrap";
        this._canvas = document.createElement("canvas");
        this._canvas.className = "mn-gauge__canvas";
        this._glass = document.createElement("div");
        this._glass.className = "mn-gauge__glass";
        this._wrap.append(this._canvas, this._glass);
        this.shadowRoot.append(
          cssLink11("../css/tokens.css"),
          cssLink11("../css/gauge.css"),
          style,
          this._wrap
        );
      }
      connectedCallback() {
        this.setAttribute("role", "meter");
        this.setAttribute("aria-valuemin", "0");
        this.setAttribute("aria-valuemax", this.getAttribute("max") || "100");
        this.setAttribute("aria-valuenow", this.getAttribute("value") || "0");
        if (this.getAttribute("label")) {
          this.setAttribute("aria-label", this.getAttribute("label"));
        }
        this._init();
      }
      disconnectedCallback() {
        this._resizeObs?.disconnect();
        this._resizeObs = null;
        this._gauge?.destroy?.();
        this._gauge = null;
        this._ready = false;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (name === "value") this.setAttribute("aria-valuenow", newVal || "0");
        if (name === "max") this.setAttribute("aria-valuemax", newVal || "100");
        if (name === "label") this.setAttribute("aria-label", newVal || "");
        if (!this._gauge) return;
        this._applyConfig();
        this._gauge.redraw();
      }
      /* ── Public API ─────────────────────────────────────────── */
      animateTo(value) {
        if (!this._gauge) return;
        this._gauge.config.value = Number(value);
        this._gauge.animate();
      }
      redraw() {
        this._gauge?.redraw?.();
      }
      /* ── Internals ──────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _sizeValue() {
        const key = this.getAttribute("size") || "md";
        if (key === "fluid") {
          const rect = this.getBoundingClientRect();
          return Math.min(rect.width, rect.height) || SIZE_MAP.md;
        }
        return SIZE_MAP[key] ?? SIZE_MAP.md;
      }
      _applyConfig() {
        if (!this._gauge) return;
        const cfg = this._gauge.config;
        const custom = this._parseJSON("config", null);
        if (custom && typeof custom === "object") Object.assign(cfg, custom);
        if (this.hasAttribute("value")) cfg.value = Number(this.getAttribute("value"));
        if (this.hasAttribute("max")) cfg.max = Number(this.getAttribute("max"));
        if (this.hasAttribute("unit")) cfg.unit = this.getAttribute("unit");
        if (this.hasAttribute("label")) cfg.label = this.getAttribute("label");
      }
      async _init() {
        const FerrariGauge = await resolveEngine3();
        if (!FerrariGauge) {
          console.warn("[mn-gauge] FerrariGauge engine not available (ESM or window.Maranello)");
          return;
        }
        const px = this._sizeValue();
        this._canvas.width = px;
        this._canvas.height = px;
        this._canvas.style.width = px + "px";
        this._canvas.style.height = px + "px";
        this._glass.style.width = px + "px";
        this._glass.style.height = px + "px";
        this._gauge = new FerrariGauge(this._canvas);
        const cfg = this._gauge.config;
        cfg.max = Number(this.getAttribute("max") || 100);
        cfg.value = 0;
        cfg.unit = this.getAttribute("unit") || "";
        cfg.label = this.getAttribute("label") || "";
        const custom = this._parseJSON("config", null);
        if (custom && typeof custom === "object") Object.assign(cfg, custom);
        this._ready = true;
        const targetValue = Number(this.getAttribute("value") || 0);
        if (targetValue) {
          cfg.value = targetValue;
          this._gauge.animate();
        } else {
          this._gauge.redraw();
        }
        this.dispatchEvent(new CustomEvent("mn-gauge-ready", {
          bubbles: true,
          composed: true
        }));
        const sizeKey = this.getAttribute("size");
        if ((sizeKey === "fluid" || !sizeKey) && window.ResizeObserver) {
          this._attachResizeObserver();
        }
      }
      _attachResizeObserver() {
        let tid = null;
        this._resizeObs = new ResizeObserver(() => {
          clearTimeout(tid);
          tid = setTimeout(() => {
            if (!this._gauge) return;
            const rect = this.getBoundingClientRect();
            const px = Math.min(rect.width, rect.height);
            if (px <= 0 || px === this._gauge.size) return;
            this._canvas.width = px;
            this._canvas.height = px;
            this._canvas.style.width = px + "px";
            this._canvas.style.height = px + "px";
            this._glass.style.width = px + "px";
            this._glass.style.height = px + "px";
            this._gauge.init();
          }, 150);
        });
        this._resizeObs.observe(this);
      }
    };
    customElements.define("mn-gauge", MnGauge);
  }
});

// src/wc/mn-hbar.js
var mn_hbar_exports = {};
function getEngine7() {
  if (_engine9) return _engine9;
  if (globalThis.Maranello) {
    _engine9 = globalThis.Maranello;
    return _engine9;
  }
  return null;
}
function cssLink12(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base12).href;
  return link;
}
var _engine9, _base12, MnHbar;
var init_mn_hbar = __esm({
  "src/wc/mn-hbar.js"() {
    "use strict";
    _engine9 = null;
    _base12 = new URL(".", import.meta.url).href;
    MnHbar = class extends HTMLElement {
      static get observedAttributes() {
        return ["data", "options"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const style = document.createElement("style");
        style.textContent = ":host{display:block;width:100%}.mn-hbar__root{width:100%}";
        this._container = document.createElement("div");
        this._container.className = "mn-hbar__root";
        this._container.setAttribute("role", "img");
        this.shadowRoot.append(
          cssLink12("../css/tokens.css"),
          cssLink12("../css/layouts-horizontal-bar-1.css"),
          cssLink12("../css/layouts-horizontal-bar-2.css"),
          cssLink12("../css/layouts-horizontal-bar-3.css"),
          style,
          this._container
        );
      }
      connectedCallback() {
        this.setAttribute("role", "figure");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "Horizontal bar chart");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        if (name === "data") {
          const parsed = this._parseJSON("data", null);
          if (Array.isArray(parsed)) this._ctrl.update(parsed);
        } else if (name === "options") {
          this._rebuild();
        }
      }
      /* ── Public API ───────────────────────────────────────────── */
      update(data) {
        this._ctrl?.update?.(data);
      }
      /* ── Internals ────────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine7();
        if (!M?.hBarChart) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const bars = this._parseJSON("data", []);
        const opts = this._parseJSON("options", {});
        this._ctrl = M.hBarChart(this._container, {
          bars,
          ...opts,
          onClick: (bar, index) => {
            this.dispatchEvent(new CustomEvent("mn-hbar-click", {
              detail: { bar, index },
              bubbles: true,
              composed: true
            }));
          }
        });
        this.dispatchEvent(new CustomEvent("mn-hbar-ready", {
          bubbles: true,
          composed: true
        }));
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine7()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine7()) {
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
    };
    customElements.define("mn-hbar", MnHbar);
  }
});

// src/wc/mn-login.js
var mn_login_exports = {};
async function resolveEngine4() {
  if (_engine10) return _engine10;
  if (globalThis.Maranello) {
    _engine10 = globalThis.Maranello;
    return _engine10;
  }
  console.warn("[mn-login] No engine found");
  return null;
}
function cssLink13(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base13).href;
  return link;
}
var _engine10, _base13, MnLogin;
var init_mn_login = __esm({
  "src/wc/mn-login.js"() {
    "use strict";
    _engine10 = null;
    _base13 = new URL(".", import.meta.url).href;
    MnLogin = class extends HTMLElement {
      static get observedAttributes() {
        return ["health-url", "title", "subtitle"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        const link1 = cssLink13("../css/tokens.css");
        const link2 = cssLink13("../css/layouts-chat-login.css");
        const link3 = cssLink13("../css/gauge.css");
        this._container = document.createElement("div");
        this._container.className = "mn-wc-root";
        this._container.setAttribute("role", "main");
        this._container.setAttribute("aria-label", "Sign in");
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
      updateStatus(data) {
        this._ctrl?.updateStatus?.(data);
      }
      setError(msg) {
        this._ctrl?.setError?.(msg);
      }
      /* ── Internals ──────────────────────────────────────────── */
      async _init() {
        const M = await resolveEngine4();
        if (!M?.loginScreen) return;
        const healthUrl = this.getAttribute("health-url") || void 0;
        this._ctrl = M.loginScreen(this._container, {
          buttonLabel: "Sign in with SSO",
          subtitle: this.getAttribute("subtitle") || void 0,
          version: void 0,
          healthUrl,
          autoHealth: !!healthUrl,
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
    };
    customElements.define("mn-login", MnLogin);
  }
});

// src/wc/mn-map.js
var mn_map_exports = {};
function getEngine8() {
  if (_engine11) return _engine11;
  if (globalThis.Maranello) {
    _engine11 = globalThis.Maranello;
    return _engine11;
  }
  return null;
}
function cssLink14(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base14).href;
  return link;
}
var _engine11, _base14, MnMap;
var init_mn_map = __esm({
  "src/wc/mn-map.js"() {
    "use strict";
    _engine11 = null;
    _base14 = new URL(".", import.meta.url).href;
    MnMap = class extends HTMLElement {
      static get observedAttributes() {
        return ["markers", "zoom", "center", "theme"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const link1 = cssLink14("../css/tokens.css");
        const link2 = cssLink14("../css/layouts.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: block; position: relative; min-height: 300px; }
      .mn-wc-root { width: 100%; height: 100%; min-height: inherit; }
    `;
        this._container = document.createElement("div");
        this._container.className = "mn-wc-root";
        this._container.setAttribute("aria-hidden", "true");
        this.shadowRoot.append(link1, link2, style, this._container);
      }
      connectedCallback() {
        this.setAttribute("role", "img");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "Interactive map");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        this._handleAttr(name, newVal);
      }
      /* ── Public API ─────────────────────────────────────────── */
      setMarkers(arr) {
        this._ctrl?.setMarkers?.(arr);
      }
      addMarker(m) {
        this._ctrl?.addMarker?.(m);
      }
      panTo(lat, lng) {
        this._ctrl?.panTo?.(lng, lat);
      }
      fitBounds() {
        this._ctrl?.fitBounds?.();
      }
      /* ── Internals ──────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine8();
        if (!M?.mapView) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const markers = this._parseJSON("markers", []);
        const center = this._parseJSON("center", void 0);
        const zoom = parseFloat(this.getAttribute("zoom") || "0") || void 0;
        this._ctrl = M.mapView(this._container, {
          markers,
          initialCenter: center,
          initialZoom: zoom,
          enableZoom: true,
          enablePan: true,
          showLegend: true,
          onClick: (marker) => {
            this.dispatchEvent(new CustomEvent("mn-marker-click", {
              detail: { marker },
              bubbles: true,
              composed: true
            }));
          }
        });
      }
      _handleAttr(name, value) {
        if (!this._ctrl) return;
        switch (name) {
          case "markers": {
            const parsed = (() => {
              try {
                return JSON.parse(value);
              } catch {
                return null;
              }
            })();
            if (Array.isArray(parsed)) this._ctrl.setMarkers(parsed);
            break;
          }
          case "zoom": {
            const z = parseFloat(value);
            if (!isNaN(z)) this._ctrl.setZoom?.(z);
            break;
          }
          case "center": {
            const c = (() => {
              try {
                return JSON.parse(value);
              } catch {
                return null;
              }
            })();
            if (Array.isArray(c) && c.length >= 2) this._ctrl.panTo(c[0], c[1]);
            break;
          }
          case "theme":
            this._rebuild();
            break;
        }
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine8()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine8()) {
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
    };
    customElements.define("mn-map", MnMap);
  }
});

// src/wc/mn-mapbox.js
var mn_mapbox_exports = {};
function getEngine9() {
  if (_engine12) return _engine12;
  if (globalThis.Maranello) {
    _engine12 = globalThis.Maranello;
    return _engine12;
  }
  return null;
}
var _engine12, MnMapbox;
var init_mn_mapbox = __esm({
  "src/wc/mn-mapbox.js"() {
    "use strict";
    _engine12 = null;
    MnMapbox = class extends HTMLElement {
      static get observedAttributes() {
        return ["access-token", "center", "zoom", "markers", "stages", "projection"];
      }
      constructor() {
        super();
        this._ctrl = null;
        this._container = document.createElement("div");
        this._container.style.cssText = "width:100%;height:100%;min-height:300px";
        this.appendChild(this._container);
      }
      connectedCallback() {
        this.style.display = "block";
        this._init();
      }
      disconnectedCallback() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (name === "markers" && this._ctrl) {
          try {
            this._ctrl.setMarkers(JSON.parse(newVal || "[]"));
          } catch {
          }
        } else if (this._ctrl) {
          this._rebuild();
        }
      }
      flyTo(lat, lon, zoom) {
        this._ctrl?.flyTo?.(lat, lon, zoom);
      }
      setMarkers(markers) {
        this._ctrl?.setMarkers?.(markers);
      }
      getMap() {
        return this._ctrl?.getMap?.();
      }
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine9();
        if (!M?.mapboxView) {
          requestAnimationFrame(() => {
            if (getEngine9()?.mapboxView) this._init();
          });
          return;
        }
        const center = (this.getAttribute("center") || "12.0,42.5").split(",").map(Number);
        this._ctrl = M.mapboxView(this._container, {
          accessToken: this.getAttribute("access-token") || "",
          center: [center[0], center[1]],
          zoom: Number(this.getAttribute("zoom")) || 3,
          projection: this.getAttribute("projection") || "globe",
          markers: this._parseJSON("markers", []),
          stages: this._parseJSON("stages", void 0),
          onClick: (marker) => {
            this.dispatchEvent(new CustomEvent("mn-marker-click", {
              detail: { marker },
              bubbles: true,
              composed: true
            }));
          }
        });
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
    };
    customElements.define("mn-mapbox", MnMapbox);
  }
});

// src/wc/mn-modal.js
var mn_modal_exports = {};
function cssLink15(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base15).href;
  return link;
}
var _base15, MnModal;
var init_mn_modal = __esm({
  "src/wc/mn-modal.js"() {
    "use strict";
    _base15 = new URL(".", import.meta.url).href;
    MnModal = class extends HTMLElement {
      static get observedAttributes() {
        return ["open", "title"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._trapHandler = null;
        const link = cssLink15("../css/extended-tooltip-modal.css");
        const tokens = cssLink15("../css/tokens.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: contents }
      .mn-modal-backdrop { position: fixed; inset: 0; z-index: 9000;
        background: rgba(0,0,0,.6); display: flex; align-items: center;
        justify-content: center; opacity: 0; pointer-events: none;
        transition: opacity var(--duration-md, .25s) }
      .mn-modal-backdrop--open { opacity: 1; pointer-events: auto }
      .mn-modal { background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444); border-radius: 12px;
        min-width: 320px; max-width: 90vw; max-height: 85vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 24px 48px rgba(0,0,0,.5) }
      .mn-modal__header { display: flex; align-items: center;
        justify-content: space-between; padding: 16px 20px;
        border-bottom: 1px solid var(--grigio-scuro, #333) }
      .mn-modal__title { font-family: var(--font-heading, sans-serif);
        font-size: 1.1rem; font-weight: 600;
        color: var(--bianco-caldo, #f5f0e8) }
      .mn-modal__close { background: none; border: none; cursor: pointer;
        color: var(--grigio-chiaro, #aaa); font-size: 1.2rem; padding: 4px 8px;
        border-radius: 6px; transition: background .15s }
      .mn-modal__close:hover { background: var(--grigio-scuro, #333) }
      .mn-modal__body { padding: 20px; overflow-y: auto; flex: 1;
        color: var(--grigio-chiaro, #ccc) }
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
    };
    customElements.define("mn-modal", MnModal);
  }
});

// src/wc/mn-okr.js
var mn_okr_exports = {};
function getEngine10() {
  if (_engine13) return _engine13;
  if (globalThis.Maranello) {
    _engine13 = globalThis.Maranello;
    return _engine13;
  }
  return null;
}
function cssLink16(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base16).href;
  return link;
}
var _engine13, _base16, MnOkr;
var init_mn_okr = __esm({
  "src/wc/mn-okr.js"() {
    "use strict";
    _engine13 = null;
    _base16 = new URL(".", import.meta.url).href;
    MnOkr = class extends HTMLElement {
      static get observedAttributes() {
        return ["objectives", "options"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const style = document.createElement("style");
        style.textContent = ":host{display:block;width:100%}.mn-okr__root{width:100%}";
        this._container = document.createElement("div");
        this._container.className = "mn-okr__root";
        this._container.setAttribute("role", "img");
        this.shadowRoot.append(
          cssLink16("../css/tokens.css"),
          cssLink16("../css/charts.css"),
          cssLink16("../css/charts-base.css"),
          style,
          this._container
        );
      }
      connectedCallback() {
        this.setAttribute("role", "region");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", "OKR dashboard");
        }
        this._init();
      }
      disconnectedCallback() {
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal || !this._ctrl) return;
        if (name === "objectives") {
          const parsed = this._parseJSON("objectives", null);
          if (Array.isArray(parsed)) this._ctrl.update(parsed);
        } else {
          this._rebuild();
        }
      }
      /* ── Public API ───────────────────────────────────────────── */
      update(objectives) {
        this._ctrl?.update?.(objectives);
      }
      /* ── Internals ────────────────────────────────────────────── */
      _parseJSON(attr, fallback) {
        try {
          return JSON.parse(this.getAttribute(attr) || "");
        } catch {
          return fallback;
        }
      }
      _init() {
        const M = getEngine10();
        if (!M?.okrPanel) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const objectives = this._parseJSON("objectives", []);
        const opts = this._parseJSON("options", {});
        this._ctrl = M.okrPanel(this._container, { objectives, ...opts });
        this.dispatchEvent(new CustomEvent("mn-okr-ready", {
          bubbles: true,
          composed: true
        }));
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._container.innerHTML = "";
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine10()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine10()) {
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
    };
    customElements.define("mn-okr", MnOkr);
  }
});

// src/wc/mn-profile.js
var mn_profile_exports = {};
async function resolveEngine5() {
  if (_engine14) return _engine14;
  if (globalThis.Maranello) {
    _engine14 = globalThis.Maranello;
    return _engine14;
  }
  console.warn("[mn-profile] No engine found");
  return null;
}
function cssLink17(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base17).href;
  return link;
}
var _engine14, _base17, MnProfile;
var init_mn_profile = __esm({
  "src/wc/mn-profile.js"() {
    "use strict";
    _engine14 = null;
    _base17 = new URL(".", import.meta.url).href;
    MnProfile = class extends HTMLElement {
      static get observedAttributes() {
        return ["name", "email", "avatar-url", "sections"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        const link1 = cssLink17("../css/tokens.css");
        const link2 = cssLink17("../css/extended-avatar-spinner.css");
        const link3 = cssLink17("../css/extended-toast-dropdown.css");
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
        const M = await resolveEngine5();
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
    };
    customElements.define("mn-profile", MnProfile);
  }
});

// src/wc/mn-speedometer.js
var mn_speedometer_exports = {};
function getEngine11() {
  if (_engine15) return _engine15;
  if (globalThis.Maranello) {
    _engine15 = globalThis.Maranello;
    return _engine15;
  }
  return null;
}
function cssLink18(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base18).href;
  return link;
}
var _engine15, _base18, MnSpeedometer;
var init_mn_speedometer = __esm({
  "src/wc/mn-speedometer.js"() {
    "use strict";
    _engine15 = null;
    _base18 = new URL(".", import.meta.url).href;
    MnSpeedometer = class extends HTMLElement {
      static get observedAttributes() {
        return ["value", "max", "size", "label", "unit"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._ctrl = null;
        this._mo = null;
        const style = document.createElement("style");
        style.textContent = ":host{display:inline-block}canvas{display:block}";
        this._canvas = document.createElement("canvas");
        this._canvas.className = "mn-speedometer__canvas";
        this._canvas.setAttribute("role", "img");
        this.shadowRoot.append(
          cssLink18("../css/tokens.css"),
          cssLink18("../css/gauge.css"),
          style,
          this._canvas
        );
      }
      connectedCallback() {
        this.setAttribute("role", "meter");
        this.setAttribute("aria-valuemin", "0");
        this.setAttribute("aria-valuemax", this.getAttribute("max") || "320");
        this.setAttribute("aria-valuenow", this.getAttribute("value") || "0");
        if (!this.hasAttribute("aria-label")) {
          this.setAttribute("aria-label", this.getAttribute("label") || "Speedometer");
        }
        this._init();
      }
      disconnectedCallback() {
        this._resizeObs?.disconnect();
        this._resizeObs = null;
        this._teardownObserver();
        this._ctrl?.destroy?.();
        this._ctrl = null;
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (name === "value") this.setAttribute("aria-valuenow", newVal || "0");
        if (name === "max") this.setAttribute("aria-valuemax", newVal || "320");
        if (name === "label") this.setAttribute("aria-label", newVal || "Speedometer");
        if (!this._ctrl) return;
        if (name === "value") {
          this._ctrl.setValue(Number(newVal));
        } else {
          this._rebuild();
        }
      }
      /* ── Public API ───────────────────────────────────────────── */
      setValue(n) {
        this._ctrl?.setValue?.(Number(n));
      }
      setBar(n) {
        this._ctrl?.setBar?.(Number(n));
      }
      /* ── Internals ────────────────────────────────────────────── */
      _sizeValue() {
        const map = { sm: 120, md: 220, lg: 320 };
        const key = this.getAttribute("size") || "md";
        if (key === "fluid") {
          const rect = this.getBoundingClientRect();
          return Math.min(rect.width, rect.height) || 220;
        }
        return map[key] || 220;
      }
      _buildOpts() {
        return {
          value: Number(this.getAttribute("value") || 0),
          max: Number(this.getAttribute("max") || 320),
          unit: this.getAttribute("unit") || "km/h",
          size: this.getAttribute("size") || "md",
          subLabel: this.getAttribute("label") || void 0,
          animate: true
        };
      }
      _init() {
        const M = getEngine11();
        if (!M?.speedometer) {
          this._waitForEngine(() => this._init());
          return;
        }
        this._teardownObserver();
        const px = this._sizeValue();
        this._canvas.width = px;
        this._canvas.height = px;
        this._canvas.style.width = px + "px";
        this._canvas.style.height = px + "px";
        this._ctrl = M.speedometer(this._canvas, this._buildOpts());
        const sizeKey = this.getAttribute("size");
        if ((sizeKey === "fluid" || !sizeKey) && window.ResizeObserver) {
          this._attachResizeObserver(M);
        }
        this.dispatchEvent(new CustomEvent("mn-speedometer-ready", {
          bubbles: true,
          composed: true
        }));
      }
      _attachResizeObserver(M) {
        let tid = null;
        this._resizeObs = new ResizeObserver(() => {
          clearTimeout(tid);
          tid = setTimeout(() => {
            const rect = this.getBoundingClientRect();
            const px = Math.min(rect.width, rect.height);
            if (px <= 0) return;
            this._ctrl?.destroy?.();
            this._canvas.width = px;
            this._canvas.height = px;
            this._canvas.style.width = px + "px";
            this._canvas.style.height = px + "px";
            this._ctrl = M.speedometer(this._canvas, { ...this._buildOpts(), size: "fluid" });
          }, 150);
        });
        this._resizeObs.observe(this);
      }
      _rebuild() {
        this._ctrl?.destroy?.();
        this._ctrl = null;
        this._init();
      }
      _waitForEngine(cb) {
        requestAnimationFrame(() => {
          if (getEngine11()) {
            cb();
            return;
          }
          if (this._mo) return;
          this._mo = new MutationObserver(() => {
            if (getEngine11()) {
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
    };
    customElements.define("mn-speedometer", MnSpeedometer);
  }
});

// src/wc/mn-system-status.js
var mn_system_status_exports = {};
function cssLink19(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base19).href;
  return link;
}
var _base19, MnSystemStatus;
var init_mn_system_status = __esm({
  "src/wc/mn-system-status.js"() {
    "use strict";
    _base19 = new URL(".", import.meta.url).href;
    MnSystemStatus = class extends HTMLElement {
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
        const tokens = cssLink19("../css/tokens.css");
        const link = cssLink19("../css/components-tables-status.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: inline-block; position: relative }
      .mn-ss { position: relative; font-family: var(--font-body, sans-serif) }
      .mn-ss__pill { display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 14px; border-radius: 20px; cursor: pointer;
        background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444);
        color: var(--grigio-chiaro, #ccc); font-size: .8rem;
        transition: border-color .15s }
      .mn-ss__pill:hover { border-color: var(--grigio-medio, #777) }
      .mn-ss__dot { width: 8px; height: 8px; border-radius: 50%;
        flex-shrink: 0; transition: background .3s }
      .mn-ss__dot--active  { background: var(--verde-racing, #00C853) }
      .mn-ss__dot--warning { background: var(--giallo-ferrari, #FFC72C) }
      .mn-ss__dot--danger  { background: var(--rosso-corsa, #DC0000) }
      .mn-ss__panel { position: absolute; top: 100%; right: 0;
        margin-top: 8px; width: 300px; background: var(--nero-soft, #1a1a1a);
        border: 1px solid var(--grigio-scuro, #444); border-radius: 10px;
        padding: 12px; box-shadow: 0 12px 32px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(-4px); pointer-events: none;
        transition: opacity .2s, transform .2s; z-index: 9000 }
      .mn-ss__panel--open { opacity: 1; transform: translateY(0); pointer-events: auto }
      .mn-ss__header { display: flex; align-items: center; gap: 8px;
        margin-bottom: 10px; font-weight: 600; font-size: .85rem;
        color: var(--bianco-caldo, #f5f0e8) }
      .mn-ss__row { display: flex; align-items: center; gap: 8px;
        padding: 6px 4px; border-radius: 6px; cursor: default;
        transition: background .1s; font-size: .85rem }
      .mn-ss__row:hover { background: var(--grigio-scuro, #222) }
      .mn-ss__row-name { flex: 1 }
      .mn-ss__row-ms { font-size: .75rem; color: var(--grigio-medio, #777); font-family: monospace }
      .mn-ss__row-ms--down { color: var(--rosso-corsa, #DC0000); font-weight: 600 }
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
    };
    customElements.define("mn-system-status", MnSystemStatus);
  }
});

// src/wc/mn-tabs.js
var mn_tabs_exports = {};
function cssLink20(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base20).href;
  return link;
}
var _base20, MnTab, MnTabs;
var init_mn_tabs = __esm({
  "src/wc/mn-tabs.js"() {
    "use strict";
    _base20 = new URL(".", import.meta.url).href;
    MnTab = class extends HTMLElement {
      static get observedAttributes() {
        return ["label"];
      }
      constructor() {
        super();
      }
    };
    customElements.define("mn-tab", MnTab);
    MnTabs = class extends HTMLElement {
      static get observedAttributes() {
        return ["active"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._activeIdx = 0;
        const tokens = cssLink20("../css/tokens.css");
        const link = cssLink20("../css/extended-tabs-breadcrumb.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: block }
      .mn-tabs__bar { display: flex; gap: 0;
        border-bottom: 2px solid var(--grigio-scuro, #333); margin-bottom: 16px }
      .mn-tabs__tab { padding: 10px 20px; cursor: pointer;
        font-family: var(--font-body, sans-serif); font-size: .9rem;
        color: var(--grigio-medio, #777); border: none; background: none;
        border-bottom: 2px solid transparent; margin-bottom: -2px;
        transition: color var(--duration-sm, .15s), border-color var(--duration-sm, .15s) }
      .mn-tabs__tab:hover { color: var(--grigio-chiaro, #ccc) }
      .mn-tabs__tab--active { color: var(--bianco-caldo, #f5f0e8);
        border-bottom-color: var(--rosso-corsa, #DC0000); font-weight: 600 }
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
    };
    customElements.define("mn-tabs", MnTabs);
  }
});

// src/wc/mn-theme-toggle.js
var mn_theme_toggle_exports = {};
function cssLink21(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base21).href;
  return link;
}
var _base21, resolve, MnThemeToggle;
var init_mn_theme_toggle = __esm({
  "src/wc/mn-theme-toggle.js"() {
    "use strict";
    _base21 = new URL(".", import.meta.url).href;
    resolve = (path, fallback = null) => {
      try {
        return globalThis.Maranello?.[path] ?? fallback;
      } catch {
        return fallback;
      }
    };
    MnThemeToggle = class extends HTMLElement {
      static get observedAttributes() {
        return ["mode"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._modes = ["editorial", "nero", "avorio", "colorblind"];
        this._icons = ["\u25D1", "\u25CF", "\u25CB", "\u25D0"];
        this._labels = ["Editorial (mixed)", "Full Nero", "Full Avorio", "Colorblind-safe"];
        this._idx = 1;
        const tokens = cssLink21("../css/tokens.css");
        const style = document.createElement("style");
        style.textContent = `
      :host { display: inline-block }
      .mn-theme-btn { width: 40px; height: 40px; border-radius: 50%;
        border: 1px solid var(--grigio-scuro, #444);
        background: var(--nero-soft, #1a1a1a); cursor: pointer;
        font-size: 1.3rem; color: var(--grigio-chiaro, #ccc);
        display: flex; align-items: center; justify-content: center;
        transition: background .15s, transform .15s, border-color .15s;
        box-shadow: 0 2px 8px rgba(0,0,0,.3) }
      .mn-theme-btn:hover { background: var(--grigio-scuro, #333);
        transform: scale(1.08) }
      .mn-theme-btn:focus-visible { outline: 2px solid var(--rosso-corsa, #DC0000);
        outline-offset: 2px }
    `;
        this._btn = document.createElement("button");
        this._btn.className = "mn-theme-btn";
        this._btn.setAttribute("aria-label", "Toggle theme");
        this._btn.addEventListener("click", () => this._cycle());
        this.shadowRoot.append(tokens, style, this._btn);
      }
      connectedCallback() {
        const mode = this.getAttribute("mode");
        if (mode) {
          const idx = this._modes.indexOf(mode);
          if (idx >= 0) this._idx = idx;
        }
        this._applyTheme(false);
      }
      attributeChangedCallback(name, oldVal, newVal) {
        if (name === "mode" && oldVal !== newVal) {
          const idx = this._modes.indexOf(newVal);
          if (idx >= 0 && idx !== this._idx) {
            this._idx = idx;
            this._applyTheme(false);
          }
        }
      }
      /* ── Private ────────────────────────────────────────────── */
      _cycle() {
        document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind");
        this._idx = (this._idx + 1) % this._modes.length;
        this._applyTheme(true);
      }
      _applyTheme(emit) {
        const mode = this._modes[this._idx];
        document.body.classList.remove("mn-nero", "mn-avorio", "mn-colorblind");
        if (mode !== "editorial") {
          document.body.classList.add(`mn-${mode}`);
        }
        this._btn.textContent = this._icons[this._idx];
        this._btn.title = this._labels[this._idx];
        if (emit) {
          this.dispatchEvent(new CustomEvent("mn-theme-change", {
            detail: { theme: mode },
            bubbles: true,
            composed: true
          }));
        }
        requestAnimationFrame(() => {
          const autoContrast = resolve("autoContrast");
          if (typeof autoContrast === "function") {
            autoContrast(".mn-treemap__cell");
          }
        });
      }
    };
    customElements.define("mn-theme-toggle", MnThemeToggle);
  }
});

// src/wc/mn-toast.js
var mn_toast_exports = {};
function cssLink22(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base22).href;
  return link;
}
var _base22, MnToast;
var init_mn_toast = __esm({
  "src/wc/mn-toast.js"() {
    "use strict";
    _base22 = new URL(".", import.meta.url).href;
    MnToast = class extends HTMLElement {
      static get observedAttributes() {
        return ["title", "message", "type", "duration"];
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._timer = null;
        const tokens = cssLink22("../css/tokens.css");
        const link = cssLink22("../css/extended-toast-dropdown.css");
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
    };
    customElements.define("mn-toast", MnToast);
  }
});

// src/wc/index.ts
var _loaded = false;
async function registerAll() {
  if (_loaded) return;
  _loaded = true;
  await Promise.all([
    Promise.resolve().then(() => (init_mn_a11y(), mn_a11y_exports)),
    Promise.resolve().then(() => (init_mn_chart(), mn_chart_exports)),
    Promise.resolve().then(() => (init_mn_chat(), mn_chat_exports)),
    Promise.resolve().then(() => (init_mn_command_palette(), mn_command_palette_exports)),
    Promise.resolve().then(() => (init_mn_data_table(), mn_data_table_exports)),
    Promise.resolve().then(() => (init_mn_date_picker(), mn_date_picker_exports)),
    Promise.resolve().then(() => (init_mn_detail_panel(), mn_detail_panel_exports)),
    Promise.resolve().then(() => (init_mn_ferrari_control(), mn_ferrari_control_exports)),
    Promise.resolve().then(() => (init_mn_funnel(), mn_funnel_exports)),
    Promise.resolve().then(() => (init_mn_gantt(), mn_gantt_exports)),
    Promise.resolve().then(() => (init_mn_gauge(), mn_gauge_exports)),
    Promise.resolve().then(() => (init_mn_hbar(), mn_hbar_exports)),
    Promise.resolve().then(() => (init_mn_login(), mn_login_exports)),
    Promise.resolve().then(() => (init_mn_map(), mn_map_exports)),
    Promise.resolve().then(() => (init_mn_mapbox(), mn_mapbox_exports)),
    Promise.resolve().then(() => (init_mn_modal(), mn_modal_exports)),
    Promise.resolve().then(() => (init_mn_okr(), mn_okr_exports)),
    Promise.resolve().then(() => (init_mn_profile(), mn_profile_exports)),
    Promise.resolve().then(() => (init_mn_speedometer(), mn_speedometer_exports)),
    Promise.resolve().then(() => (init_mn_system_status(), mn_system_status_exports)),
    Promise.resolve().then(() => (init_mn_tabs(), mn_tabs_exports)),
    Promise.resolve().then(() => (init_mn_theme_toggle(), mn_theme_toggle_exports)),
    Promise.resolve().then(() => (init_mn_toast(), mn_toast_exports))
  ]);
}

// demo/_wc-entry.js
registerAll();
