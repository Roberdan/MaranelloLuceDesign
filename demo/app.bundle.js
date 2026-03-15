"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __glob = (map) => (path) => {
    var fn = map[path];
    if (fn) return fn();
    throw new Error("Module not found in bundle: " + path);
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/wc/mn-a11y-fallback.js
  var mn_a11y_fallback_exports = {};
  __export(mn_a11y_fallback_exports, {
    buildA11yFallback: () => buildA11yFallback
  });
  function loadSettings() {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE)) };
    } catch {
      return { ...DEFAULTS };
    }
  }
  function applySettings(s) {
    const root2 = document.documentElement;
    root2.style.fontSize = (SIZES[s.fontSize] || 1) * 16 + "px";
    root2.classList.toggle("mn-reduced-motion", s.reducedMotion);
    root2.classList.toggle("mn-high-contrast", s.highContrast);
    root2.classList.toggle("mn-no-focus-ring", !s.focusVisible);
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
  var import_meta, _engine, _base, MnA11y;
  var init_mn_a11y = __esm({
    "src/wc/mn-a11y.js"() {
      "use strict";
      init_mn_a11y_fallback();
      import_meta = {};
      _engine = null;
      _base = new URL(".", import_meta.url).href;
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
          const M3 = getEngine();
          if (M3?.a11yPanel && M3._a11yDom) {
            this._ctrl = M3.a11yPanel();
            return;
          }
          this._waitForEngine(() => {
            const M22 = getEngine();
            if (M22?.a11yPanel && M22._a11yDom) {
              this._ctrl = M22.a11yPanel();
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
  var import_meta2, _base2, MnChart;
  var init_mn_chart = __esm({
    "src/wc/mn-chart.js"() {
      "use strict";
      import_meta2 = {};
      _base2 = new URL(".", import_meta2.url).href;
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
  var import_meta3, _engine2, _base3, MnChat;
  var init_mn_chat = __esm({
    "src/wc/mn-chat.js"() {
      "use strict";
      import_meta3 = {};
      _engine2 = null;
      _base3 = new URL(".", import_meta3.url).href;
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
          const M3 = await resolveEngine();
          if (!M3?.aiChat) return;
          this._ctrl = M3.aiChat(this._container, {
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
  var import_meta4, _base4, MnCommandPalette;
  var init_mn_command_palette = __esm({
    "src/wc/mn-command-palette.js"() {
      "use strict";
      import_meta4 = {};
      _base4 = new URL(".", import_meta4.url).href;
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
  var import_meta5, _engine3, _base5, MnDataTable;
  var init_mn_data_table = __esm({
    "src/wc/mn-data-table.js"() {
      "use strict";
      import_meta5 = {};
      _engine3 = null;
      _base5 = new URL(".", import_meta5.url).href;
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
          const M3 = getEngine2();
          if (!M3?.dataTable) {
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
          this._ctrl = M3.dataTable(this._container, {
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
  var import_meta6, _engine4, _base6, MnDatePicker;
  var init_mn_date_picker = __esm({
    "src/wc/mn-date-picker.js"() {
      "use strict";
      import_meta6 = {};
      _engine4 = null;
      _base6 = new URL(".", import_meta6.url).href;
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
          const M3 = getEngine3();
          if (!M3?.datePicker) {
            this._waitForEngine(() => this._tryInit());
            return;
          }
          this._teardownObserver();
          let disabledSet = /* @__PURE__ */ new Set();
          try {
            disabledSet = new Set(JSON.parse(this.getAttribute("disabled-dates")));
          } catch {
          }
          this._ctrl = M3.datePicker(this._anchor, {
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
  var import_meta7, _engine5, _base7, MnDetailPanel;
  var init_mn_detail_panel = __esm({
    "src/wc/mn-detail-panel.js"() {
      "use strict";
      import_meta7 = {};
      _engine5 = null;
      _base7 = new URL(".", import_meta7.url).href;
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
          const M3 = getEngine4();
          if (!M3?.detailPanel) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const sections = this._parseJSON("sections", {});
          this._ctrl = M3.detailPanel(this._container, {
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
  var import_meta8, _engine6, _base8, MnFerrariControl;
  var init_mn_ferrari_control = __esm({
    "src/wc/mn-ferrari-control.js"() {
      "use strict";
      import_meta8 = {};
      _engine6 = null;
      _base8 = new URL(".", import_meta8.url).href;
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
          const M3 = await resolveEngine2();
          const type = this.getAttribute("type") || "rotary";
          if (!M3 && type !== "slider") {
            this._container.innerHTML = "";
            this._container.className = "mn-fc mn-fc--empty";
            this._container.textContent = `Maranello ${type} not available`;
            return;
          }
          const factory = this._getFactory(M3, type);
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
            this._ctrl = M3.toggleLever(this._container, {
              ...opts,
              onChange: (on) => changeHandler(on)
            });
          } else if (type === "cruise-lever") {
            this._ctrl = M3.cruiseLever(this._container, {
              ...opts,
              onChange: (idx, lbl) => changeHandler(idx, lbl)
            });
          } else if (type === "manettino") {
            this._ctrl = M3.manettino(this._container, {
              ...opts,
              onChange: (idx, lbl) => changeHandler(idx, lbl)
            });
          } else if (type === "stepped-rotary") {
            this._ctrl = M3.steppedRotary(this._container, {
              ...opts,
              onChange: (idx, lbl) => changeHandler(idx, lbl)
            });
          } else if (type === "rotary") {
            this._initRotary(M3, opts, changeHandler);
          } else if (type === "slider") {
            this._initSlider(opts, changeHandler);
          }
        }
        _initRotary(M3, opts, onChange) {
          if (!M3?.initRotary) {
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
          const instance = M3.initRotary(wrapper, {
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
        _getFactory(M3, type) {
          if (!M3) return type === "slider" ? true : null;
          const map = {
            "rotary": M3.initRotary,
            "cruise-lever": M3.cruiseLever,
            "manettino": M3.manettino,
            "toggle-lever": M3.toggleLever,
            "stepped-rotary": M3.steppedRotary,
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
  var import_meta9, _engine7, _base9, MnFunnel;
  var init_mn_funnel = __esm({
    "src/wc/mn-funnel.js"() {
      "use strict";
      import_meta9 = {};
      _engine7 = null;
      _base9 = new URL(".", import_meta9.url).href;
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
          const M3 = getEngine5();
          if (!M3?.funnel) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const stages = this._parseJSON("stages", []);
          const showConversion = this.hasAttribute("show-conversion");
          const animate = this.hasAttribute("animate");
          this._ctrl = M3.funnel(this._container, {
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
  var import_meta10, _engine8, _base10, MnGantt;
  var init_mn_gantt = __esm({
    "src/wc/mn-gantt.js"() {
      "use strict";
      import_meta10 = {};
      _engine8 = null;
      _base10 = new URL(".", import_meta10.url).href;
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
          const M3 = getEngine6();
          if (!M3?.gantt) {
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
          this._ctrl = M3.gantt(this._container, tasks, opts);
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
  var import_meta11, _base11, SIZE_MAP, MnGauge;
  var init_mn_gauge = __esm({
    "src/wc/mn-gauge.js"() {
      "use strict";
      import_meta11 = {};
      _base11 = new URL(".", import_meta11.url).href;
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
  var import_meta12, _engine9, _base12, MnHbar;
  var init_mn_hbar = __esm({
    "src/wc/mn-hbar.js"() {
      "use strict";
      import_meta12 = {};
      _engine9 = null;
      _base12 = new URL(".", import_meta12.url).href;
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
          const M3 = getEngine7();
          if (!M3?.hBarChart) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const bars = this._parseJSON("data", []);
          const opts = this._parseJSON("options", {});
          this._ctrl = M3.hBarChart(this._container, {
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
  var import_meta13, _engine10, _base13, MnLogin;
  var init_mn_login = __esm({
    "src/wc/mn-login.js"() {
      "use strict";
      import_meta13 = {};
      _engine10 = null;
      _base13 = new URL(".", import_meta13.url).href;
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
          const M3 = await resolveEngine4();
          if (!M3?.loginScreen) return;
          const healthUrl = this.getAttribute("health-url") || void 0;
          this._ctrl = M3.loginScreen(this._container, {
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
  var import_meta14, _engine11, _base14, MnMap;
  var init_mn_map = __esm({
    "src/wc/mn-map.js"() {
      "use strict";
      import_meta14 = {};
      _engine11 = null;
      _base14 = new URL(".", import_meta14.url).href;
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
          const M3 = getEngine8();
          if (!M3?.mapView) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const markers = this._parseJSON("markers", []);
          const center = this._parseJSON("center", void 0);
          const zoom = parseFloat(this.getAttribute("zoom") || "0") || void 0;
          this._ctrl = M3.mapView(this._container, {
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
          const M3 = getEngine9();
          if (!M3?.mapboxView) {
            requestAnimationFrame(() => {
              if (getEngine9()?.mapboxView) this._init();
            });
            return;
          }
          const center = (this.getAttribute("center") || "12.0,42.5").split(",").map(Number);
          this._ctrl = M3.mapboxView(this._container, {
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
  var import_meta15, _base15, MnModal;
  var init_mn_modal = __esm({
    "src/wc/mn-modal.js"() {
      "use strict";
      import_meta15 = {};
      _base15 = new URL(".", import_meta15.url).href;
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
  var import_meta16, _engine13, _base16, MnOkr;
  var init_mn_okr = __esm({
    "src/wc/mn-okr.js"() {
      "use strict";
      import_meta16 = {};
      _engine13 = null;
      _base16 = new URL(".", import_meta16.url).href;
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
          const M3 = getEngine10();
          if (!M3?.okrPanel) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const objectives = this._parseJSON("objectives", []);
          const opts = this._parseJSON("options", {});
          this._ctrl = M3.okrPanel(this._container, { objectives, ...opts });
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
  var import_meta17, _engine14, _base17, MnProfile;
  var init_mn_profile = __esm({
    "src/wc/mn-profile.js"() {
      "use strict";
      import_meta17 = {};
      _engine14 = null;
      _base17 = new URL(".", import_meta17.url).href;
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
          const M3 = await resolveEngine5();
          if (!M3?.profileMenu) return;
          const sections = this._parseJSON("sections", []);
          this._ctrl = M3.profileMenu(this._trigger, {
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
  var import_meta18, _engine15, _base18, MnSpeedometer;
  var init_mn_speedometer = __esm({
    "src/wc/mn-speedometer.js"() {
      "use strict";
      import_meta18 = {};
      _engine15 = null;
      _base18 = new URL(".", import_meta18.url).href;
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
          const M3 = getEngine11();
          if (!M3?.speedometer) {
            this._waitForEngine(() => this._init());
            return;
          }
          this._teardownObserver();
          const px = this._sizeValue();
          this._canvas.width = px;
          this._canvas.height = px;
          this._canvas.style.width = px + "px";
          this._canvas.style.height = px + "px";
          this._ctrl = M3.speedometer(this._canvas, this._buildOpts());
          const sizeKey = this.getAttribute("size");
          if ((sizeKey === "fluid" || !sizeKey) && window.ResizeObserver) {
            this._attachResizeObserver(M3);
          }
          this.dispatchEvent(new CustomEvent("mn-speedometer-ready", {
            bubbles: true,
            composed: true
          }));
        }
        _attachResizeObserver(M3) {
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
              this._ctrl = M3.speedometer(this._canvas, { ...this._buildOpts(), size: "fluid" });
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
  var import_meta19, _base19, MnSystemStatus;
  var init_mn_system_status = __esm({
    "src/wc/mn-system-status.js"() {
      "use strict";
      import_meta19 = {};
      _base19 = new URL(".", import_meta19.url).href;
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
          const root2 = document.createElement("div");
          root2.className = "mn-ss";
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
          root2.append(this._pill, this._panel);
          this.shadowRoot.append(tokens, link, style, root2);
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
  var import_meta20, _base20, MnTab, MnTabs;
  var init_mn_tabs = __esm({
    "src/wc/mn-tabs.js"() {
      "use strict";
      import_meta20 = {};
      _base20 = new URL(".", import_meta20.url).href;
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
  var import_meta21, _base21, resolve, MnThemeToggle;
  var init_mn_theme_toggle = __esm({
    "src/wc/mn-theme-toggle.js"() {
      "use strict";
      import_meta21 = {};
      _base21 = new URL(".", import_meta21.url).href;
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
  var import_meta22, _base22, MnToast;
  var init_mn_toast = __esm({
    "src/wc/mn-toast.js"() {
      "use strict";
      import_meta22 = {};
      _base22 = new URL(".", import_meta22.url).href;
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

  // demo/sections/hero.js
  function createHeroSection() {
    const section = document.createElement("section");
    section.id = "hero";
    section.className = "mn-section-dark";
    section.style.cssText = "min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden";
    section.innerHTML = `
    <div style="position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(255,199,44,0.06) 0%,transparent 70%);pointer-events:none"></div>

    <div class="mn-container" style="text-align:center;position:relative;z-index:1">
      <div style="margin-bottom:var(--space-xl)">
        <span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;padding:4px 16px;border:1px solid var(--mn-accent);border-radius:999px;color:var(--mn-accent);letter-spacing:0.12em;font-weight:600;margin-bottom:var(--space-lg)">INTERACTIVE DEMO \xB7 <span style="color:var(--rosso-corsa,#DC0000)">BETA</span></span>
      </div>

      <p class="mn-section-number" style="letter-spacing:0.2em;margin-bottom:var(--space-md)">MARANELLO LUCE DESIGN SYSTEM \xB7 FOR AI AGENTS</p>

      <h1 class="mn-title-hero" style="font-size:clamp(3rem,8vw,6rem);margin-bottom:var(--space-sm);line-height:0.95">
        <span style="color:var(--mn-accent)">Maranello</span> <span style="color:var(--bianco-caldo,#f5f5f5)">Luce</span> <span style="color:var(--grigio-alluminio)">Design</span>
      </h1>

      <div class="mn-divider-gold--accent mn-divider-gold" style="margin:var(--space-lg) auto"></div>

      <h2 class="mn-title-sub" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xl);font-weight:400;letter-spacing:0.1em">
        DESIGN SYSTEM FOR AGENTIC AI DASHBOARDS
      </h2>

      <p class="mn-body" style="max-width:640px;margin:0 auto var(--space-lg);color:var(--grigio-medio);line-height:1.7">
        Inspired by the <a href="https://www.ferrari.com/it-IT/auto/ferrari-luce" target="_blank" style="color:var(--mn-accent);text-decoration:none;border-bottom:1px solid rgba(255,199,44,0.4)">Ferrari Luce</a> interior design language \u2014
        warm leather tones, precision instruments, and cockpit-grade controls.
        90+ components, 4 themes, Canvas 2D engines for <strong style="color:var(--grigio-chiaro)">agentic AI operations</strong>.
      </p>
      <p class="mn-micro" style="max-width:640px;margin:0 auto var(--space-lg);color:var(--grigio-medio);text-align:center">
        Part of <a href="https://github.com/Roberdan/MyConvergio" target="_blank" style="color:var(--mn-accent);text-decoration:none">Convergio</a> \xB7 Aligned with the <a href="https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md" target="_blank" style="color:var(--mn-accent);text-decoration:none">Agentic Manifesto</a>
      </p>

      <div style="display:flex;gap:var(--space-md);justify-content:center;align-items:center;margin-bottom:var(--space-xl)">
        <a href="https://github.com/Roberdan/MaranelloLuceDesign" target="_blank" style="text-decoration:none">
          <img src="https://img.shields.io/github/stars/Roberdan/MaranelloLuceDesign?style=social" alt="GitHub Stars">
        </a>
        <a href="https://github.com/Roberdan/MaranelloLuceDesign" target="_blank" style="color:var(--mn-accent);text-decoration:none;font-family:var(--font-display);font-size:var(--text-micro);letter-spacing:0.08em;text-transform:uppercase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:4px"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          VIEW ON GITHUB
        </a>
      </div>

      <div class="mn-card-dark" style="max-width:640px;margin:0 auto var(--space-2xl);padding:var(--space-lg) var(--space-xl);border-left:3px solid var(--mn-accent);text-align:left">
        <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm);letter-spacing:0.1em">FROM THE AGENTIC MANIFESTO</p>
        <p class="mn-body" style="color:var(--grigio-chiaro);font-style:italic;line-height:1.8;margin-bottom:var(--space-sm)">
          &ldquo;Intent is human, momentum is agent. Impact must reach every mind and body.
          We design from the edge first: disability, language, connectivity.&rdquo;
        </p>
        <p class="mn-micro" style="color:var(--grigio-medio)">
          &mdash; Roberto D&rsquo;Angelo \xB7 Claude 3 \xB7 OpenAI o3 &middot; Milano, June 2025
          &middot; <a href="https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md" target="_blank" style="color:var(--mn-accent);text-decoration:none">Read full manifesto</a>
        </p>
      </div>

      <div style="display:flex;gap:var(--space-2xl);justify-content:center;flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div style="text-align:center">
          <canvas id="hero-speedo-1" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--mn-accent);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">INCLUSION</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">WCAG 2.2 AA</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-2" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--verde-racing);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">PERFORMANCE</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">Zero Dependencies</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-3" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--azzurro-chiaro,#4EA8DE);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">PRECISION</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">90+ Components</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-4" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--rosso-corsa,#DC0000);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">ELEGANCE</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">Ferrari Luce DNA</div>
        </div>
      </div>

      <div class="mn-stat-row">
        <div class="mn-stat">
          <div class="mn-stat__value" style="color:var(--mn-accent)">284.7</div>
          <div class="mn-stat__unit">$k</div>
          <div class="mn-stat__label">Total Token Spend</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value">312</div>
          <div class="mn-stat__unit">agents</div>
          <div class="mn-stat__label">Active Agents</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value" style="color:var(--verde-racing)">14,560</div>
          <div class="mn-stat__unit">tasks</div>
          <div class="mn-stat__label">Tasks Completed</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value">18,340</div>
          <div class="mn-stat__unit">hrs</div>
          <div class="mn-stat__label">Compute Hours</div>
        </div>
      </div>

      <div style="margin-top:var(--space-2xl);display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap">
        <button class="mn-btn mn-btn--accent" onclick="document.getElementById('dashboard').scrollIntoView({behavior:'smooth'})">Explore Dashboard \u2193</button>
        <button class="mn-btn mn-btn--ghost-light" onclick="document.getElementById('charts').scrollIntoView({behavior:'smooth'})">View Charts</button>
      </div>

      <p class="mn-micro" style="margin-top:var(--space-3xl);color:var(--grigio-scuro)">
        Scroll to explore 25+ component sections \xB7 (c) Roberdan 2026 \xB7 MIT License
      </p>
    </div>
  `;
    setTimeout(() => {
      const M3 = window.Maranello;
      if (M3?.speedometer) {
        M3.speedometer(section.querySelector("#hero-speedo-1"), {
          value: 100,
          max: 100,
          unit: "%",
          size: "sm",
          ticks: [0, 25, 50, 75, 100],
          needleColor: "#FFC72C",
          arcColor: "#FFC72C",
          subLabel: "AA",
          animate: true
        });
        M3.speedometer(section.querySelector("#hero-speedo-2"), {
          value: 95,
          max: 100,
          unit: "%",
          size: "sm",
          ticks: [0, 25, 50, 75, 100],
          needleColor: "#00A651",
          arcColor: "#00A651",
          subLabel: "0 deps",
          animate: true
        });
        M3.speedometer(section.querySelector("#hero-speedo-3"), {
          value: 90,
          max: 100,
          unit: "",
          size: "sm",
          ticks: [0, 25, 50, 75, 100],
          needleColor: "#4EA8DE",
          arcColor: "#4EA8DE",
          subLabel: "90+",
          animate: true
        });
        M3.speedometer(section.querySelector("#hero-speedo-4"), {
          value: 100,
          max: 100,
          unit: "%",
          size: "sm",
          ticks: [0, 25, 50, 75, 100],
          needleColor: "#DC0000",
          arcColor: "#DC0000",
          subLabel: "Luce",
          animate: true
        });
      }
    }, 300);
    return section;
  }

  // demo/sections/tokens.js
  function swatch(name, varName) {
    return `<div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs)">
    <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:var(${varName});border:1px solid var(--grigio-scuro)"></div>
    <div>
      <div class="mn-micro" style="font-weight:600">${name}</div>
      <div class="mn-micro" style="color:var(--grigio-medio)">${varName}</div>
    </div>
  </div>`;
  }
  function typeSample(cls, text) {
    return `<div style="margin-bottom:var(--space-md)">
    <span class="mn-micro" style="color:var(--grigio-medio)">.${cls}</span>
    <div class="${cls}" style="text-align:left;max-width:none;margin:0">${text}</div>
  </div>`;
  }
  function createTokensSection() {
    const section = document.createElement("section");
    section.id = "tokens";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">01 \u2014 Design Tokens</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-2xl)">Colors & Typography</h2>

      <!-- Nero Scale -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Nero Scale (Dark)</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch("Assoluto", "--nero-assoluto")}
          ${swatch("Profondo", "--nero-profondo")}
          ${swatch("Carbon", "--nero-carbon")}
          ${swatch("Soft", "--nero-soft")}
        </div>
        <div>
          ${swatch("Nero 1", "--nero-1")}
          ${swatch("Nero 2", "--nero-2")}
          ${swatch("Nero 3", "--nero-3")}
        </div>
        <div>
          <h4 class="mn-label" style="margin-bottom:var(--space-sm);color:var(--mn-accent)">Grigio Scale</h4>
          ${swatch("Grigio Scuro", "--grigio-scuro")}
          ${swatch("Grigio Medio", "--grigio-medio")}
          ${swatch("Grigio Chiaro", "--grigio-chiaro")}
          ${swatch("Grigio 4", "--grigio-4")}
        </div>
        <div>
          <h4 class="mn-label" style="margin-bottom:var(--space-sm);color:var(--mn-accent)">Avorio Scale</h4>
          ${swatch("Bianco Caldo", "--bianco-caldo")}
          ${swatch("Avorio", "--avorio")}
          ${swatch("Avorio Scuro", "--avorio-scuro")}
        </div>
      </div>

      <!-- Accent Colors -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Accent Colors</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch("Giallo Ferrari", "--giallo-ferrari")}
          ${swatch("MN Accent", "--mn-accent")}
        </div>
        <div>
          ${swatch("Rosso Corsa", "--rosso-corsa")}
          ${swatch("Arancio Warm", "--arancio-warm")}
        </div>
        <div>
          ${swatch("Verde Racing", "--verde-racing")}
          ${swatch("Verde", "--verde")}
        </div>
        <div>
          ${swatch("Blu Info", "--blu-info")}
        </div>
      </div>

      <!-- Signal / Semantic Colors -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Signal & Semantic</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch("Active", "--status-active")}
          ${swatch("Signal Success", "--signal-success")}
        </div>
        <div>
          ${swatch("Warning", "--status-warning")}
          ${swatch("Signal Warning", "--signal-warning")}
        </div>
        <div>
          ${swatch("Danger", "--status-danger")}
          ${swatch("Signal Danger", "--signal-danger")}
        </div>
        <div>
          ${swatch("Info", "--status-info")}
          ${swatch("Signal Info", "--signal-info")}
        </div>
      </div>

      <!-- Surface / Border Tokens -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Surfaces & Borders</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch("Superficie 1", "--superficie-1")}
          ${swatch("Superficie 2", "--superficie-2")}
          ${swatch("Superficie 3", "--superficie-3")}
        </div>
        <div>
          ${swatch("Bordo", "--bordo")}
          ${swatch("Bordo Light", "--bordo-light")}
        </div>
        <div>
          ${swatch("Chart Default", "--chart-default")}
          ${swatch("Chart Alt", "--chart-alt")}
        </div>
      </div>

      <!-- Typography Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Typography Scale</h3>
      <div style="max-width:700px;margin:0 auto;margin-bottom:var(--space-2xl)">
        ${typeSample("mn-watermark", "Watermark")}
        ${typeSample("mn-title-hero", "Hero Title")}
        ${typeSample("mn-title-section", "Section Title")}
        ${typeSample("mn-title-sub", "Sub Title")}
        ${typeSample("mn-body", "Body text for paragraphs and content")}
        ${typeSample("mn-label", "Label Text")}
        ${typeSample("mn-caption", "Caption text for supporting context")}
        ${typeSample("mn-micro", "Micro \u2014 smallest text size")}
      </div>

      <!-- Spacing Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Spacing Scale</h3>
      <div style="display:flex;gap:var(--space-md);flex-wrap:wrap;justify-content:center;margin-bottom:var(--space-2xl)">
        ${["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"].map(
      (s) => `<div style="text-align:center">
            <div style="width:var(--space-${s});height:var(--space-${s});background:var(--mn-accent);border-radius:var(--radius-sm);margin:0 auto var(--space-xs)"></div>
            <span class="mn-micro">${s}</span>
          </div>`
    ).join("")}
      </div>

      <!-- Radius Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Border Radius</h3>
      <div style="display:flex;gap:var(--space-lg);flex-wrap:wrap;justify-content:center">
        ${["sm", "md", "lg", "xl", "full"].map(
      (r) => `<div style="text-align:center">
            <div style="width:48px;height:48px;background:var(--mn-accent);border-radius:var(--radius-${r});margin:0 auto var(--space-xs)"></div>
            <span class="mn-micro">${r}</span>
          </div>`
    ).join("")}
      </div>
    </div>
  `;
    return section;
  }

  // demo/sections/cards.js
  var KPI_CARDS = [
    { value: "312", unit: "agents", label: "Active runtimes", delta: "\u2191 12%", hint: "vs. last routing window" },
    { value: "96", unit: "%", label: "Accuracy score", delta: "\u2191 2.4%", hint: "eval gate trend" },
    { value: "14.6k", unit: "tasks", label: "Completed tasks", delta: "\u2191 18%", hint: "24h orchestration volume" },
    { value: "84", unit: "%", label: "Budget efficiency", delta: "\u2191 5%", hint: "token spend vs. target" }
  ];
  var CONTENT_CARDS = [
    { title: "us-east-1 routing mesh", body: "Low-latency orchestration lane combining prompt caching, fallback rules, and canary model routing for interactive workloads.", tags: ["us-east-1", "Routing", "Low latency"] },
    { title: "eu-west-1 evaluation lane", body: "Quality-gated batch evaluations with replay support, structured scoring, and rollback checkpoints for critical inference releases.", tags: ["eu-west-1", "Evaluation", "Quality gate"] },
    { title: "ap-southeast-1 research cluster", body: "Long-context model experiments, embeddings refresh, and synthetic dataset generation for asynchronous agent workflows.", tags: ["ap-southeast-1", "Research", "Async runs"] }
  ];
  var ACTION_CARDS = [
    { icon: "\u2197", title: "Escalate failed runs", body: "Route pipelines with degraded accuracy or rising retry depth to the validator queue within the next control loop.", cta: "Open failure queue" },
    { icon: "\u2726", title: "Launch eval sweep", body: "Trigger a fresh benchmark pack across Claude, GPT, and Gemini routing policies before the next production deploy.", cta: "Run benchmark pack" }
  ];
  var PROFILES = [
    { name: "Agent Opus", role: "Strategic planner \xB7 Claude Opus", initials: "AO", status: "Routing primary", tone: "var(--mn-accent)" },
    { name: "Agent Sonnet", role: "Execution engine \xB7 Claude Sonnet", initials: "AS", status: "Serving batch runs", tone: "var(--verde-racing)" },
    { name: "Agent Haiku", role: "Rapid monitor \xB7 Claude Haiku", initials: "AH", status: "Watching canaries", tone: "var(--status-info)" }
  ];
  var SIGNALS = [
    { eyebrow: "us-east-1", title: "Gateway lane", leds: [["API gateway", "active"], ["Model router", "active"], ["Cache tier", "info"]] },
    { eyebrow: "eu-west-1", title: "Evaluation deck", leds: [["Replay jobs", "active"], ["Judge models", "warning"], ["Audit log", "active"]] },
    { eyebrow: "ap-southeast-1", title: "Inference lane", leds: [["Batch queue", "active"], ["GPU pool", "info"], ["Failover mesh", "danger"]] }
  ];
  var PODS = [{ label: "OP", tone: "green" }, { label: "SO", tone: "gold" }, { label: "HA", tone: "red" }, { label: "GP", tone: "green" }, { label: "GM", tone: "gold" }];
  function createCardsSection() {
    const section = document.createElement("section");
    section.id = "cards";
    section.className = "mn-section-light";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">02 \u2014 Components</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Cards & Signal Surfaces</h2>
      <p class="mn-body" style="margin-bottom:var(--space-xl)">A richer, extended card gallery for Maranello Luce deployment regions: KPI tiles, operational media, model profiles, and dashboard micro-panels built to feel cinematic but still highly readable.</p>
      <div class="mn-tag-group" style="justify-content:center;margin-bottom:var(--space-2xl)"><span class="mn-tag mn-tag--active">Maranello Luce</span><span class="mn-tag">Deployment Regions</span><span class="mn-tag">Model Profiles</span><span class="mn-tag">Quality Gates</span><span class="mn-tag mn-tag--xs">dashboard</span></div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">KPI stat cards</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">${KPI_CARDS.map(statCard).join("")}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Content cards</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${CONTENT_CARDS.map(contentCard).join("")}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Media & actions</h3>
      <div class="mn-grid-2" style="margin-bottom:var(--space-2xl)">${videoCard()}<div style="display:grid;gap:var(--space-lg)">${ACTION_CARDS.map(actionCard).join("")}</div></div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Model profiles</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${PROFILES.map(profileCard).join("")}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Signal panels</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${SIGNALS.map(signalCard).join("")}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Pod group strip</h3>
      <div class="mn-grid-2">
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-start;flex-wrap:wrap;margin-bottom:var(--space-lg)"><div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Model pod strip</div><p class="mn-card__text">Small pods summarise the multi-model routing stack active in the us-east-1 region today.</p></div><span class="mn-tag mn-tag--light mn-tag--xs">5 active pods</span></div>
          <div class="mn-pod-group" style="justify-content:center;padding:var(--space-lg) 0 var(--space-xl)">${PODS.map(pod).join("")}</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-xl);display:flex;flex-direction:column;justify-content:space-between">
          <div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Pipeline handoff card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">Afternoon routing / Pipeline Alpha & Beta</h4><p class="mn-card__text" style="margin-bottom:var(--space-lg)">18 eval sweeps, 4 canary promotions, and 2 rollback checks need synchronized model routing, cache warming, and validator coverage.</p></div>
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-end;flex-wrap:wrap"><div><div class="mn-micro" style="color:var(--grigio-chiaro)">Readiness</div><div style="font-family:var(--font-display);font-size:var(--text-h2);color:var(--mn-accent);line-height:1">91%</div></div><button class="mn-btn mn-btn--accent">Dispatch runbook</button></div>
        </div>
      </div>
    </div>
  `;
    return section;
  }
  function statCard(item) {
    return `<div class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm);margin-bottom:var(--space-md)"><span class="mn-tag mn-tag--light mn-tag--xs">${item.hint}</span><span class="mn-micro" style="color:${item.delta.includes("\u2193") ? "var(--rosso-corsa)" : "var(--verde-racing)"}">${item.delta}</span></div><div class="mn-stat"><div class="mn-stat__value">${item.value}</div><div class="mn-stat__unit">${item.unit}</div><div class="mn-stat__label">${item.label}</div></div></div>`;
  }
  function contentCard(item) {
    return `<article class="mn-card-dark"><div class="mn-card__content"><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Pipeline card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">${item.title}</h4><p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p><footer class="mn-tag-group">${item.tags.map((tag) => `<span class="mn-tag mn-tag--light mn-tag--xs">${tag}</span>`).join("")}</footer></div></article>`;
  }
  function videoCard() {
    return `<article class="mn-card-dark" style="padding:var(--space-lg)"><div class="mn-video-card" style="background:linear-gradient(135deg, rgba(255,199,44,0.22), rgba(220,0,0,0.18)),radial-gradient(circle at 24% 20%, rgba(255,255,255,0.16), transparent 34%),linear-gradient(160deg, #1f1f1f, #0a0a0a 72%);margin-bottom:var(--space-lg)"><span class="mn-tag mn-tag--light mn-tag--xs" style="position:absolute;top:var(--space-md);right:var(--space-md)">04:32</span><span class="mn-video-card__play"></span><span class="mn-video-card__label">Watch inference walkthrough</span></div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">mn-video-card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">us-east-1 routing mesh / failover protocol</h4><p class="mn-card__text">Gradient media placeholder for platform tours, model routing explainers, or release runbooks.</p></article>`;
  }
  function actionCard(item) {
    return `<article class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-md);margin-bottom:var(--space-md)"><div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Action card</div><h4 class="mn-card__title" style="font-size:var(--text-h4);margin-bottom:var(--space-xs)">${item.title}</h4></div><span style="width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,0.06);font-size:1.1rem">${item.icon}</span></div><p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p><button class="mn-btn mn-btn--accent">${item.cta}</button></article>`;
  }
  function profileCard(item) {
    return `<article class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)"><div style="width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:${item.tone};color:#111;font-family:var(--font-display);font-weight:700">${item.initials}</div><div><h4 class="mn-card__title" style="font-size:var(--text-h5);margin-bottom:2px">${item.name}</h4><p class="mn-card__text">${item.role}</p></div></div><div class="mn-status mn-status--active"><span class="mn-status__dot"></span>${item.status}</div></article>`;
  }
  function signalCard(item) {
    return `<div class="mn-signal-panel"><div class="mn-signal-panel__eyebrow">${item.eyebrow}</div><div class="mn-signal-panel__title" style="margin-bottom:var(--space-md)">${item.title}</div><div style="display:grid;gap:var(--space-sm)">${item.leds.map(([label, status]) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-md)"><span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span><span class="mn-status mn-status--${status} mn-status--sm"><span class="mn-status__dot"></span>${status}</span></div>`).join("")}</div></div>`;
  }
  function pod(item) {
    return `<div class="mn-pod"><div class="mn-pod__face"><span class="mn-pod__indicator mn-pod__indicator--${item.tone}"></span></div><div class="mn-pod__label">${item.label}</div></div>`;
  }

  // demo/sections/dashboard.js
  var KPI_CARDS2 = [
    { label: "Active Agents", value: "847", yoy: 12.4, qoq: 3.2 },
    { label: "Token Spend", value: "$124.8K", yoy: -2.1, qoq: -8.2 },
    { label: "Automation Rate", value: "87.3%", yoy: 5.1, qoq: 2.8 },
    { label: "Pipeline SLA", value: "99.7%", yoy: 0.3, qoq: { value: 0.1, trend: "flat" } }
  ];
  var SPARKS = [
    { id: "runs", label: "Pipeline Runs Trend", unit: "runs", color: "#FFC72C", data: [48, 52, 57, 61, 66, 68, 72, 75, 79, 84] },
    { id: "tokens", label: "Token Spend Trend", unit: "k USD", color: "#00A651", data: [88, 91, 95, 98, 102, 106, 109, 113, 118, 124] }
  ];
  function createDashboardSection() {
    const section = document.createElement("section");
    section.id = "dashboard";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">04 \u2014 Dashboard</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Dashboard Strip</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">KPI stat cards, live telemetry, and a sortable pipeline operations view built with Maranello Luce demo data.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;div class="mn-card-dark mn-stat"&gt;
  &lt;div class="mn-stat__label"&gt;Active Agents&lt;/div&gt;
  &lt;div class="mn-stat__value"&gt;847&lt;/div&gt;
  &lt;div class="mn-stat__delta"&gt;\u2191 12.4% Y/Y&lt;/div&gt;
  &lt;div class="mn-stat__delta"&gt;\u2191 3.2% Q/Q&lt;/div&gt;
&lt;/div&gt;</code></pre>
      </details>
      <div class="mn-grid-4" style="margin-bottom:var(--space-xl)">${KPI_CARDS2.map(kpiCard).join("")}</div>
      ${livePanel()}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:var(--space-md);margin:var(--space-2xl) 0 var(--space-xl)"><div><h3 class="mn-title-sub">Maranello Luce Pipeline Desk</h3><p class="mn-micro" style="color:var(--grigio-medio)">Operations overview \xB7 March 2026</p></div><div style="display:flex;gap:var(--space-sm)"><button class="mn-btn mn-btn--ghost-light mn-btn--sm">Export</button><button class="mn-btn mn-btn--accent mn-btn--sm">+ Pipeline</button></div></div>
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-bottom:var(--space-xl)"><span class="mn-tag mn-tag--light mn-tag--active">All (47)</span><span class="mn-tag mn-tag--light">Running (29)</span><span class="mn-tag mn-tag--light">Queued (9)</span><span class="mn-tag mn-tag--light">Canary (6)</span><span class="mn-tag mn-tag--light">Blocked (3)</span></div>
      <div class="mn-card-dark" style="padding:0;overflow:hidden;margin-bottom:var(--space-xl)"><div class="mn-table-wrap"><table class="mn-table"><thead><tr><th>ID</th><th>Pipeline</th><th>Stage</th><th>Owner</th><th>Status</th><th>Accuracy</th><th>Agents</th></tr></thead><tbody>${tableRow("#66464", "Pipeline Alpha", "Route \u2192 Infer", "Agent Opus", "active", "Running", 97, "mn-progress__fill--green", 14)}${tableRow("#68210", "Pipeline Beta", "Eval \u2192 Retry", "Agent Sonnet", "warning", "At Risk", 81, "mn-progress__fill--yellow", 22)}${tableRow("#71055", "Pipeline Gamma", "Deploy canary", "Agent Haiku", "active", "Running", 93, "mn-progress__fill--green", 9)}${tableRow("#72340", "Pipeline Delta", "Guardrail audit", "Validator Mesh", "danger", "Blocked", 54, "mn-progress__fill--red", 6)}${tableRow("#73890", "Pipeline Epsilon", "Prompt ingest", "Research Queue", "info", "Queued", 76, "mn-progress__fill--blue", 11)}</tbody></table></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-md);flex-wrap:wrap"><span class="mn-micro" style="color:var(--grigio-medio)">Showing 5 of 47 pipeline runs</span><div style="display:flex;gap:var(--space-xs)"><button class="mn-dot mn-dot--active" aria-label="Page 1"></button><button class="mn-dot" aria-label="Page 2"></button><button class="mn-dot" aria-label="Page 3"></button><button class="mn-dot" aria-label="Page 4"></button></div></div>
    </div>
  `;
    requestAnimationFrame(() => initDashboard(section));
    return section;
  }
  function livePanel() {
    return `<div class="mn-card-dark" style="padding:var(--space-lg);display:flex;gap:var(--space-xl);align-items:center;justify-content:space-between;flex-wrap:wrap"><div style="display:grid;gap:var(--space-sm);min-width:220px"><span style="display:inline-flex;align-items:center;justify-content:center;width:max-content;padding:6px 12px;border:1px solid var(--mn-accent);border-radius:999px;color:var(--mn-accent);font:600 var(--text-micro)/1 var(--font-display);letter-spacing:.08em;text-transform:uppercase">Mode: Active</span><div style="font-family:var(--font-display);font-size:clamp(2rem,4vw,3.5rem);font-weight:700;line-height:1;color:var(--bianco-caldo)">47 <span style="font-size:var(--text-caption);color:var(--grigio-chiaro)">pipelines</span></div><div style="display:flex;gap:var(--space-md);flex-wrap:wrap;color:var(--grigio-chiaro)"><span class="mn-label" style="color:var(--mn-accent)">Routing: Healthy</span><span class="mn-micro">$124k spend</span></div></div><div style="display:flex;gap:var(--space-lg);flex:1 1 320px;flex-wrap:wrap">${SPARKS.map((spark) => {
      const min = Math.min(...spark.data);
      const max = Math.max(...spark.data);
      return `<div style="flex:1 1 180px;min-width:180px"><div class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-xs)">${spark.label}</div><canvas id="dashboard-spark-${spark.id}" style="width:100%;height:52px;display:block"></canvas><div style="display:flex;justify-content:space-between;margin-top:var(--space-xs)"><span class="mn-micro" style="color:var(--grigio-medio)">Min ${min} ${spark.unit}</span><span class="mn-micro" style="color:var(--grigio-medio)">Max ${max} ${spark.unit}</span></div><div style="display:flex;justify-content:space-between"><span class="mn-micro" style="color:var(--grigio-medio)">24h ago</span><span class="mn-micro" style="color:var(--grigio-medio)">now</span></div></div>`;
    }).join("")}</div><div style="display:grid;gap:var(--space-xs);text-align:right;min-width:140px"><div style="font-family:var(--font-display);font-size:clamp(1.25rem,3vw,2rem);letter-spacing:.08em">10:10 MON 25</div><div class="mn-label" style="color:var(--verde-racing)">96% Accuracy Score</div><div class="mn-micro" style="color:var(--mn-accent)">3 blocked lanes</div></div></div>`;
  }
  function initDashboard(section) {
    const M3 = window.Maranello;
    const charts = M3?.charts;
    if (!charts?.sparkline) return;
    SPARKS.forEach((spark) => {
      const canvas = section.querySelector(`#dashboard-spark-${spark.id}`);
      if (!(canvas instanceof HTMLCanvasElement)) return;
      const width = canvas.clientWidth || 220;
      const height = 52;
      const min = Math.min(...spark.data);
      const max = Math.max(...spark.data);
      const labels = spark.data.map((_, i) => i === 0 ? "24h ago" : i === spark.data.length - 1 ? "now" : `${spark.data.length - 1 - i}h ago`);
      charts.sparkline(canvas, spark.data, { color: spark.color, width, height, lineWidth: 2, fillOpacity: 0.18 });
      if (M3.sparklineInteract) {
        M3.sparklineInteract(canvas, spark.data, { color: spark.color, labels });
      }
      if (M3.chartInteract) {
        const pad = { top: 2, right: 2, bottom: 2, left: 2 };
        const range = max - min || 1;
        M3.chartInteract(canvas, {
          type: "area",
          datasets: [{ label: spark.label, data: spark.data, color: spark.color }],
          labels,
          pad,
          maxLen: spark.data.length,
          gx: (idx) => pad.left + idx / (spark.data.length - 1) * (width - pad.left - pad.right),
          gy: (value) => height - pad.bottom - (value - min) / range * (height - pad.top - pad.bottom)
        }, [spark.color]);
      }
    });
  }
  function kpiCard(kpi) {
    const yoy = trendLabel(kpi.yoy, "Y/Y");
    const qoq = trendLabel(kpi.qoq, "Q/Q");
    return `<div class="mn-card-dark mn-stat" style="padding:var(--space-lg)"><div class="mn-stat__label" style="color:var(--grigio-medio);margin-bottom:var(--space-xs)">${kpi.label}</div><div class="mn-stat__value" style="font-size:2rem;font-weight:700;font-family:var(--font-display);color:var(--bianco-caldo,#f5f5f5);margin-bottom:var(--space-sm)">${kpi.value}</div><div style="display:flex;gap:var(--space-lg);flex-wrap:wrap"><span class="mn-stat__delta" style="color:${yoy.color}">${yoy.text} <span style="color:var(--grigio-medio)">${yoy.period}</span></span><span class="mn-stat__delta" style="color:${qoq.color}">${qoq.text} <span style="color:var(--grigio-medio)">${qoq.period}</span></span></div></div>`;
  }
  function trendLabel(value, period) {
    const normalized = typeof value === "number" ? { value, trend: void 0 } : value;
    const rounded = Math.abs(normalized.value).toFixed(1);
    if (normalized.trend === "flat") return { text: `\u2192 ${rounded}%`, color: "var(--grigio-medio)", period };
    if (normalized.value > 0) return { text: `\u2191 ${rounded}%`, color: "var(--verde-racing)", period };
    if (normalized.value < 0) return { text: `\u2193 ${rounded}%`, color: "var(--rosso-corsa)", period };
    return { text: `\u2192 ${rounded}%`, color: "var(--grigio-medio)", period };
  }
  function tableRow(id, name, stage, owner, statusKey, statusLabel, accuracy, fillClass, agents) {
    return `<tr><td class="mn-table__cell-id">${id}</td><td class="mn-table__cell-primary"><strong>${name}</strong></td><td><span class="mn-tag mn-tag--light mn-tag--xs">${stage}</span></td><td class="mn-table__cell-secondary">${owner}</td><td><span class="mn-status mn-status--${statusKey}"><span class="mn-status__dot"></span> ${statusLabel}</span></td><td><div style="display:flex;align-items:center;gap:var(--space-xs)"><div class="mn-progress" style="width:60px"><div class="mn-progress__fill ${fillClass}" style="width:${accuracy}%"></div></div><span class="mn-micro" style="color:var(--grigio-medio)">${accuracy}%</span></div></td><td class="mn-table__cell-value">${agents}</td></tr>`;
  }

  // demo/sections/charts.js
  function createChartsSection() {
    const section = document.createElement("section");
    section.id = "charts";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">03 \u2014 Data Visualization</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Charts &amp; Data</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">12 chart types \u2014 pure Canvas 2D, zero dependencies. Maranello Luce agent telemetry.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>Maranello.charts.sparkline(canvas, [10, 20, 30, 40], { color: '#FFC72C' });
Maranello.charts.donut(canvas, [{ label: 'A', value: 30 }, { label: 'B', value: 70 }]);</code></pre>
      </details>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Sparklines</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${sparkWrap("spark-1", "Monthly token spend", "Default")}
        ${sparkWrap("spark-2", "Inference runs", "Small")}
        ${sparkWrap("spark-3", "Agent handoffs", "Large (red)")}
        ${sparkWrap("spark-4", "Tasks completed", "XL (green)")}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Donut Charts</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end">
        ${donutWrap("donut-sm", 80, 80, "87%", "Budget Mix")}
        ${donutWrap("donut-md", 140, 140, "96", "Accuracy")}
      </div>
      ${legendRow(`${swatch2("#FFC72C", "Inference")}${swatch2("#4EA8DE", "Training")}${swatch2("#00A651", "Embeddings")}${swatch2("#616161", "Storage")}${swatch2("#FFC72C", "Completed")}${swatch2("#2a2a2a", "Remaining")}`, "margin-bottom:var(--space-2xl)")}
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Token Spend by Region \u2014 Bar Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel("y")}">$ (thousands)</div>
            <canvas id="bar-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Regions</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Inference Runs \u2014 Area Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel("y")}">Runs</div>
            <canvas id="area-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Monthly trend</div>
          ${legendRow(`${swatch2("#FFC72C", "Token Spend")}${swatch2("#00A651", "Runs")}${swatch2("#DC0000", "Retries")}`)}
        </div>
      </div>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg)">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Pipeline Effectiveness \u2014 Radar</div>
          <canvas id="radar-demo" width="220" height="220"></canvas>
          <div id="radar-score" class="mn-micro" style="color:var(--avorio);text-align:center;margin-top:var(--space-sm)">Overall score \u2014</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Region Accuracy / Load \u2014 Bubble</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel("y")}">Accuracy score (%)</div>
            <canvas id="bubble-demo" width="440" height="220" style="width:100%;height:220px"></canvas>
          </div>
          <div style="${axisLabel()}">Load score (%)</div>
        </div>
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Half Gauges (Semicircular)</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-2xl)">
        ${halfWrap("hg-sm", 100, 60, "68%", "route saturation")}
        ${halfWrap("hg-md", 180, 108, "96", "accuracy")}
        ${halfWrap("hg-lg", 260, 156, "4.2k/s", "tokens")}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Progress Rings</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${ringWrap("ring-1", 60, "72%", "Budget")}
        ${ringWrap("ring-2", 80, "45%", "Capacity")}
        ${ringWrap("ring-3", 100, "96%", "Accuracy")}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Flip Counters</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-lg)">
        <div style="text-align:center"><div id="flip-1"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Tasks Completed</span></div>
        <div style="text-align:center"><div id="flip-2"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Inference Runs</span></div>
        <div style="text-align:center"><div id="flip-3"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Accuracy Score</span></div>
      </div>
      <div style="display:flex;gap:var(--space-md)">
        <button class="mn-btn mn-btn--accent" id="flip-inc">Increment</button>
        <button class="mn-btn mn-btn--ghost" id="flip-rand">Random</button>
      </div>
    </div>
  `;
    setTimeout(() => initCharts(section), 120);
    return section;
  }
  function sparkWrap(id, label, size) {
    return `<div style="text-align:center"><canvas id="${id}" width="100" height="32"></canvas><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${size}<br>${label}</div></div>`;
  }
  function donutWrap(id, w, h, val, label) {
    return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${val} \u2014 ${label}</div></div>`;
  }
  function halfWrap(id, w, h, val, unit) {
    return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--mn-accent)">${val} <span style="color:var(--grigio-chiaro)">${unit}</span></div></div>`;
  }
  function ringWrap(id, sz, pct, label) {
    return `<div style="text-align:center"><div id="${id}" style="width:${sz}px;height:${sz}px;display:inline-block"></div><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${pct} ${label}</div></div>`;
  }
  function swatch2(color, label) {
    return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;color:var(--avorio);padding:2px 0"><span style="width:10px;height:10px;background:${color};border-radius:999px;box-shadow:0 0 0 1px rgba(255,255,255,0.12)"></span>${label}</span>`;
  }
  function legendRow(content, extra = "") {
    return `<div style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center;margin-top:var(--space-sm);padding-top:var(--space-xs);border-top:1px solid rgba(255,255,255,0.08);${extra}">${content}</div>`;
  }
  function axisLabel(kind = "x") {
    return kind === "y" ? "min-width:18px;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:rotate(180deg);color:var(--grigio-chiaro);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase" : "margin-top:var(--space-sm);text-align:center;color:var(--grigio-chiaro);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase";
  }
  function initCharts(section) {
    const C = window.Maranello?.charts;
    if (!C) {
      console.warn("[charts] Maranello.charts not ready");
      return;
    }
    const g = (id) => section.querySelector(`#${id}`);
    const sparkData = [48, 52, 50, 60, 58, 63, 69, 72, 75, 78, 82, 88];
    const barData = [{ label: "us-east-1", value: 420, color: "#FFC72C" }, { label: "eu-west-1", value: 310, color: "#FFC72C" }, { label: "ap-southeast-1", value: 280, color: "#FFC72C" }, { label: "us-west-2", value: 195, color: "#FFC72C" }, { label: "sa-east-1", value: 165, color: "#FFC72C" }];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const areaData = [{ label: "Token Spend", color: "#FFC72C", data: [120, 145, 132, 178, 195, 210, 188, 225, 247, 260, 238, 275] }, { label: "Runs", color: "#00A651", data: [820, 860, 910, 980, 1020, 1080, 1045, 1120, 1160, 1210, 1185, 1240] }, { label: "Retries", color: "#DC0000", data: [34, 28, 32, 26, 24, 22, 20, 18, 16, 15, 17, 14] }];
    const donutSmall = [{ label: "Inference", value: 45, color: "#FFC72C" }, { label: "Training", value: 20, color: "#4EA8DE" }, { label: "Embeddings", value: 20, color: "#00A651" }, { label: "Storage", value: 15, color: "#616161" }];
    const donutLarge = [{ label: "Completed", value: 96, color: "#FFC72C" }, { label: "Remaining", value: 4, color: "#2a2a2a" }];
    const radarData = [{ label: "Accuracy", value: 96 }, { label: "Latency", value: 82 }, { label: "Routing", value: 91 }, { label: "Recovery", value: 88 }, { label: "Safety", value: 94 }, { label: "Throughput", value: 86 }];
    const bubbleData = [{ x: 30, y: 96, z: 18, color: "#FFC72C", label: "us-east-1" }, { x: 55, y: 92, z: 14, color: "#00A651", label: "eu-west-1" }, { x: 75, y: 89, z: 22, color: "#4EA8DE", label: "ap-southeast-1" }, { x: 45, y: 84, z: 10, color: "#DC0000", label: "retry queue" }, { x: 85, y: 87, z: 16, color: "#D4622B", label: "canary lane" }];
    C.sparkline(g("spark-1"), sparkData, { color: "#FFC72C", width: 100, height: 32 });
    C.sparkline(g("spark-2"), [320, 360, 410, 480, 530, 610], { color: "#4EA8DE", width: 100, height: 32 });
    C.sparkline(g("spark-3"), [80, 92, 88, 104, 110, 118, 126, 134], { color: "#DC0000", width: 100, height: 32 });
    C.sparkline(g("spark-4"), [4200, 5100, 6200, 7400, 8900, 10400, 11800, 14560], { color: "#00A651", width: 100, height: 32 });
    C.donut(g("donut-sm"), donutSmall, { width: 80, height: 80 });
    C.donut(g("donut-md"), donutLarge, { width: 140, height: 140 });
    C.barChart(g("bar-chart-demo"), barData, { width: 460, height: 200, color: "#FFC72C" });
    C.areaChart(g("area-chart-demo"), areaData, { width: 460, height: 200 });
    C.radar(g("radar-demo"), radarData, { width: 220, height: 220, color: "#FFC72C" });
    C.bubble(g("bubble-demo"), bubbleData, { width: 440, height: 220 });
    C.halfGauge(g("hg-sm"), { value: 68, max: 100, width: 100, height: 60 });
    C.halfGauge(g("hg-md"), { value: 96, max: 100, width: 180, height: 108 });
    C.halfGauge(g("hg-lg"), { value: 84, max: 100, width: 260, height: 156 });
    const M3 = window.Maranello;
    g("radar-score").innerHTML = `<span style="color:var(--mn-accent)">${Math.round(radarData.reduce((sum, { value }) => sum + value, 0) / radarData.length)}/100</span> accuracy score`;
    if (M3.progressRing) {
      M3.progressRing(g("ring-1"), { value: 72, max: 100, size: 60 });
      M3.progressRing(g("ring-2"), { value: 45, max: 100, size: 80 });
      M3.progressRing(g("ring-3"), { value: 96, max: 100, size: 100, color: "#00A651" });
    }
    const f1 = M3.flipCounter?.(section.querySelector("#flip-1"), { value: 14560 });
    const f2 = M3.flipCounter?.(section.querySelector("#flip-2"), { value: 98240 });
    const f3 = M3.flipCounter?.(section.querySelector("#flip-3"), { value: 96 });
    section.querySelector("#flip-inc")?.addEventListener("click", () => [f1, f2, f3].forEach((f) => f?.increment?.()));
    section.querySelector("#flip-rand")?.addEventListener("click", () => {
      f1?.setValue?.(Math.floor(Math.random() * 22e3));
      f2?.setValue?.(Math.floor(Math.random() * 14e4));
      f3?.setValue?.(Math.floor(Math.random() * 100));
    });
    if (M3.chartInteract) {
      const barPad = { top: 8, bottom: 22, left: 8, right: 8 }, barMax = Math.max(...barData.map(({ value }) => value)) * 1.15;
      const barChartW = 460 - barPad.left - barPad.right, barChartH = 200 - barPad.top - barPad.bottom, slotW = barChartW / barData.length, barW = slotW * 0.7;
      const areaPad = { top: 8, bottom: 8, left: 8, right: 8 }, areaMax = Math.max(...areaData.flatMap(({ data }) => data)) * 1.15;
      const bubblePad = { top: 12, bottom: 12, left: 12, right: 12 }, bubbleMaxX = Math.max(...bubbleData.map(({ x }) => x)) * 1.1, bubbleMaxY = Math.max(...bubbleData.map(({ y }) => y)) * 1.1, bubbleMaxZ = Math.max(...bubbleData.map(({ z }) => z));
      const bubbleGx = (v) => bubblePad.left + v / bubbleMaxX * (440 - bubblePad.left - bubblePad.right);
      const bubbleGy = (v) => 220 - bubblePad.bottom - v / bubbleMaxY * (220 - bubblePad.top - bubblePad.bottom);
      const bubbleGr = (v) => Math.max(4, v / bubbleMaxZ * 30);
      const donutMeta = (segments, size) => {
        const startAngle = -Math.PI / 2, gap = 0.02, outerRadius = size / 2 - 4, innerRadius = outerRadius * 0.75, total = segments.reduce((sum, { value }) => sum + value, 0);
        let angle = startAngle;
        return { type: "donut", center: { x: size / 2, y: size / 2 }, innerRadius, outerRadius, segments: segments.map((seg) => {
          const sweep = seg.value / total * (Math.PI * 2 - gap * segments.length), next = angle + sweep, item = { ...seg, pct: Math.round(seg.value / total * 100), start: angle, end: next };
          angle = next + gap;
          return item;
        }) };
      };
      const radarMax = 100, radarCx = 110, radarCy = 110, radarRadius = 80, radarStep = Math.PI * 2 / radarData.length;
      const bind2 = (id, meta, colors) => {
        const el = g(id);
        if (el) M3.chartInteract(el, meta, colors);
      };
      bind2("donut-sm", donutMeta(donutSmall, 80), donutSmall.map(({ color }) => color));
      bind2("donut-md", donutMeta(donutLarge, 140), donutLarge.map(({ color }) => color));
      bind2("bar-chart-demo", { type: "bar", data: barData, labels: barData.map(({ label }) => label), pad: barPad, gx: (i) => barPad.left + i * slotW + slotW / 2, gy: (v) => 200 - barPad.bottom - v / barMax * barChartH, barRects: barData.map((_, i) => ({ x: barPad.left + i * slotW + slotW * 0.15, w: barW })) }, barData.map(({ color }) => color));
      bind2("area-chart-demo", { type: "area", datasets: areaData, labels: months, pad: areaPad, maxLen: months.length, gx: (i) => areaPad.left + i / (months.length - 1) * (460 - areaPad.left - areaPad.right), gy: (v) => 200 - areaPad.bottom - v / areaMax * (200 - areaPad.top - areaPad.bottom) }, areaData.map(({ color }) => color));
      bind2("radar-demo", { type: "radar", data: radarData, max: radarMax, points: radarData.map(({ value }, i) => ({ x: radarCx + Math.cos(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, y: radarCy + Math.sin(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, r: 10 })) }, ["#FFC72C"]);
      bind2("bubble-demo", { type: "bubble", data: bubbleData, points: bubbleData.map(({ x, y, z }) => ({ x: bubbleGx(x), y: bubbleGy(y), r: bubbleGr(z) })) }, bubbleData.map(({ color }) => color));
    }
    if (M3.sparklineInteract) [["spark-1", sparkData], ["spark-2", [320, 360, 410, 480, 530, 610]], ["spark-3", [80, 92, 88, 104, 110, 118, 126, 134]], ["spark-4", [4200, 5100, 6200, 7400, 8900, 10400, 11800, 14560]]].forEach(([id, data]) => {
      const el = g(id);
      if (el) M3.sparklineInteract(el, data, { color: "#FFC72C" });
    });
    addKeyboardAccess(section);
  }
  var CHART_A11Y = [
    ["spark-1", "Sparkline: monthly token spend"],
    ["spark-2", "Sparkline: inference runs"],
    ["spark-3", "Sparkline: agent handoffs"],
    ["spark-4", "Sparkline: tasks completed"],
    ["donut-sm", "Donut chart: budget mix by category"],
    ["donut-md", "Donut chart: accuracy completed vs remaining"],
    ["bar-chart-demo", "Bar chart: token spend by region"],
    ["area-chart-demo", "Area chart: inference runs over 12 months"],
    ["radar-demo", "Radar chart: pipeline effectiveness across 6 axes"],
    ["bubble-demo", "Bubble chart: region accuracy vs load"],
    ["hg-sm", "Half gauge: route saturation 68%"],
    ["hg-md", "Half gauge: accuracy 96%"],
    ["hg-lg", "Half gauge: tokens 84%"],
    ["trend-1", "Sparkline trend: token spend 15 months"],
    ["trend-2", "Sparkline trend: inference runs 15 months"]
  ];
  function addKeyboardAccess(section) {
    CHART_A11Y.forEach(([id, label]) => {
      const el = section.querySelector(`#${id}`);
      if (!el) return;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", label);
      el.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        el.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
      });
    });
  }

  // demo/sections/network.js
  var M = () => window.Maranello || {};
  var esc = (value) => typeof M().escapeHtml === "function" ? M().escapeHtml(String(value)) : String(value);
  var NODE_NAMES = ["API Gateway", "Model Router", "Token Ledger", "Eval Engine", "Vector DB", "Inference Queue", "Cache", "Control Plane"];
  var MSG_COLORS = { success: "#00A651", data: "#FFC72C", alert: "#DC0000", query: "#4EA8DE" };
  var NODE_COLORS = ["#FFC72C", "#4EA8DE", "#00A651", "#FFC72C", "#4EA8DE", "#00A651", "#FFC72C", "#4EA8DE"];
  function buildNodes() {
    return NODE_NAMES.map((label, index) => {
      const angle = Math.PI * 2 * index / NODE_NAMES.length - Math.PI / 2;
      return { id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, x: 0.5 + Math.cos(angle) * 0.34, y: 0.5 + Math.sin(angle) * 0.34, color: NODE_COLORS[index], size: 10 };
    });
  }
  function buildConnections(nodes) {
    return nodes.flatMap((node, index) => {
      const ring = { from: node.id, to: nodes[(index + 1) % nodes.length].id, color: "rgba(255,255,255,0.12)" };
      const skip = { from: node.id, to: nodes[(index + 2) % nodes.length].id, color: "rgba(78,168,222,0.18)" };
      return index < nodes.length / 2 ? [ring, skip] : [ring];
    });
  }
  function legendItem(color, label) {
    return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;color:var(--avorio)"><span style="width:10px;height:10px;border-radius:999px;background:${color}"></span>${esc(label)}</span>`;
  }
  function placeholder(target, title) {
    target.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:var(--space-xl)"><p class="mn-label" style="color:var(--grigio-medio);text-align:center"><strong>${esc(title)}</strong><br><span class="mn-micro">Visualization unavailable</span></p></div>`;
  }
  function randomPick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }
  function randomMessage(nodes, connections) {
    const link = randomPick(connections);
    const kind = randomPick(Object.keys(MSG_COLORS));
    return { from: link.from, to: link.to, color: MSG_COLORS[kind], speed: 0.7 + Math.random() * 1.8, size: 4 + Math.random() * 2, label: kind === "alert" ? "!" : kind[0].toUpperCase() };
  }
  function createNetworkSection() {
    const nodes = buildNodes();
    const connections = buildConnections(nodes);
    const section = document.createElement("section");
    section.id = "network";
    section.className = "mn-section-dark";
    section.innerHTML = `<div class="mn-container"><p class="mn-section-number">03B \u2014 Networked Intelligence</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Network Messages &amp; Augmented Brain</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Two living signal visualizations: a runtime service mesh with flowing packets and an organic neural field with cascading energy.</p><div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"><div style="display:flex;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-md)"><div><h3 class="mn-title-sub" style="margin-bottom:var(--space-xs)">Mesh Network Messages</h3><p class="mn-micro" style="color:var(--grigio-medio)">8 services, animated connections, auto-traffic every 2 seconds.</p></div><button class="mn-btn mn-btn--accent" id="network-burst">Send Burst</button></div><div style="display:flex;flex-wrap:wrap;gap:var(--space-md);margin-bottom:var(--space-md)">${legendItem(MSG_COLORS.success, "Success")}${legendItem(MSG_COLORS.data, "Data")}${legendItem(MSG_COLORS.alert, "Alert")}${legendItem(MSG_COLORS.query, "Query")}</div><div id="network-messages-demo" style="width:100%;height:340px;border-radius:12px;overflow:hidden;background:radial-gradient(circle at top, rgba(255,199,44,0.08), rgba(5,8,14,0.92))"></div></div><div class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-md)"><div><h3 class="mn-title-sub" style="margin-bottom:var(--space-xs)">Augmented Brain</h3><p class="mn-micro" style="color:var(--grigio-medio)">40 drifting nodes, luminous synapses, and pulse cascades.</p></div><div style="display:flex;gap:var(--space-md);flex-wrap:wrap;align-items:center"><button class="mn-btn mn-btn--accent" id="brain-pulse">Trigger Pulse</button><label class="mn-micro" for="brain-activity" style="display:flex;gap:var(--space-sm);align-items:center;color:var(--grigio-chiaro)">Activity Level <input id="brain-activity" type="range" min="0" max="100" value="55"></label></div></div><div id="neural-nodes-demo" style="width:100%;height:400px;border-radius:12px;overflow:hidden;background:radial-gradient(circle at center, rgba(78,168,222,0.12), rgba(3,6,12,0.96))"></div></div></div>`;
    requestAnimationFrame(() => initNetwork(section, nodes, connections));
    return section;
  }
  function initNetwork(section, nodes, connections) {
    const networkEl = section.querySelector("#network-messages-demo");
    const neuralEl = section.querySelector("#neural-nodes-demo");
    const api = M();
    if (!api.networkMessages || !api.neuralNodes) {
      if (networkEl) placeholder(networkEl, "Network Messages");
      if (neuralEl) placeholder(neuralEl, "Neural Nodes");
      return;
    }
    const network = api.networkMessages(networkEl, { nodes, connections, particleTrail: true, glowEffect: true });
    const brain = api.neuralNodes(neuralEl, { nodeCount: 40, particleCount: 2, pulseSpeed: 1.1, interactive: true });
    if (!network || !brain) return;
    clearInterval(section._mnNetworkTimer);
    section._mnNetworkTimer = window.setInterval(() => network.send(randomMessage(nodes, connections)), 2e3);
    section.querySelector("#network-burst")?.addEventListener("click", () => {
      network.burst(Array.from({ length: 5 }, () => randomMessage(nodes, connections)));
    });
    section.querySelector("#brain-pulse")?.addEventListener("click", () => brain.pulse());
    section.querySelector("#brain-activity")?.addEventListener("input", (event) => {
      const level = Number(event.target.value || 0) / 100;
      brain.setActivity(level);
    });
    brain.setActivity(0.55);
    network.send(randomMessage(nodes, connections));
    window.setTimeout(() => brain.pulse(0), 500);
  }

  // demo/sections/controls.js
  var TEMP_BADGES = [
    ["20\xB0", "#DC0000", ""],
    ["18\xB0", "#4EA8DE", ""],
    ["24\xB0", "#FFC72C", ""],
    ["\u2013", "var(--grigio-scuro)", ""],
    ["22\xB0", "#DC0000", " mn-temp-badge--lg"],
    ["16\xB0", "#4EA8DE", ""]
  ];
  function createControlsSection() {
    const section = document.createElement("section");
    section.id = "controls";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <style>
      #controls .mn-temp-badge{--temp-size:44px;display:inline-flex;align-items:center;justify-content:center;width:var(--temp-size);height:var(--temp-size);border-radius:50%;border:2px solid var(--temp-color);background:rgba(0,0,0,.55);color:var(--bianco-caldo);font-family:var(--font-display);font-size:.9rem;font-weight:700;line-height:1;text-align:center;box-shadow:0 0 0 1px rgba(255,255,255,.06) inset}
      #controls .mn-temp-badge--lg{--temp-size:56px;border-width:3px;font-size:1.1rem}
    </style>
    <div class="mn-container">
      <p class="mn-section-number">05 / INTERIOR \xB7 CONTROLS</p>
      <div class="mn-watermark">COMANDI</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Ferrari Controls</h2>
      <p class="mn-body mn-mb-2xl">Every switch, knob and button feels milled from solid aluminum. Haptic precision in every interaction.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>Maranello.manettino(el, { positions: ['Wet', 'Sport', 'Race'] });
Maranello.initSlider(el);</code></pre>
      </details>
      <div class="mn-demo-section-label mn-mt-2xl">Machined Aluminum Buttons</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-lg" style="align-items:center">
        <button class="mn-machined-btn"><span class="mn-machined-btn__indicator"></span>Engine Start</button>
        <button class="mn-machined-btn mn-machined-btn--amber"><span class="mn-machined-btn__indicator"></span>Launch Control</button>
        <button class="mn-machined-btn mn-machined-btn--off"><span class="mn-machined-btn__indicator"></span>Standby</button>
        <button class="mn-machined-btn mn-machined-btn--pressed"><span class="mn-machined-btn__indicator"></span>Pressed</button>
        <button class="mn-machined-btn" disabled><span class="mn-machined-btn__indicator"></span>Disabled</button>
      </div>
      <div class="mn-demo-section-label">Toggle Switches</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        ${toggle("Auto-refresh", true)}${toggle("Night Mode", false)}${toggle("Alerts", true)}
      </div>
      <div class="mn-demo-section-label">LED Indicators</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        ${led("green", "System Online")}${led("amber", "Processing")}${led("red mn-anim-blink", "Critical Alert")}${led("off", "Offline")}
      </div>
      <div class="mn-demo-section-label">Temperature Badges</div>
      <div class="mn-mb-2xl" style="display:flex;gap:var(--space-lg);flex-wrap:wrap">${TEMP_BADGES.map(([label, color, mod]) => `<span class="mn-temp-badge${mod}" style="--temp-color:${color}">${label}</span>`).join("")}</div>
      <div class="mn-demo-section-label">Slider Controls</div>
      <div class="mn-flex-col mn-gap-lg mn-mb-2xl" style="max-width:420px">${slider("ctrl-slider-1", "Routing Intensity", 72)}${slider("ctrl-slider-2", "Agent Capacity", 45)}</div>
      <div class="mn-demo-section-label">Rotary Selectors</div>
      <div class="mn-flex-center mn-gap-2xl mn-flex-wrap mn-mb-2xl"><div id="ctrl-rotary-1"></div><div id="ctrl-rotary-2"></div></div>
      <div class="mn-divider-gold mn-my-2xl"></div>
      <h3 class="mn-title-sub mn-mb-sm">Advanced Cockpit Controls</h3>
      <p class="mn-caption mn-text-dim mn-mb-lg">Manettino, cruise lever, 3D toggle, stepped rotary \u2014 machined from solid aluminum.</p>
      <div class="mn-flex-wrap mn-gap-2xl mn-mb-2xl" style="align-items:flex-end">
        ${controlSlot("Manettino", "ctrl-manettino")}${controlSlot("Cruise Lever", "ctrl-cruise")}${controlSlot("Toggle Lever (On)", "ctrl-lever-on")}${controlSlot("Toggle Lever (Off)", "ctrl-lever-off")}${controlSlot("Stepped Rotary", "ctrl-stepped")}
      </div>
      <div class="mn-demo-section-label">Button Cluster (Steering Style)</div>
      <div class="mn-mb-2xl"><div class="mn-btn-cluster" style="--cluster-cols:4">${clusterButton("dashboard", true)}${clusterButton("chart")}${clusterButton("users")}${clusterButton("settings")}</div></div>
      <div class="mn-demo-section-label">Segmented Control</div>
      <div class="mn-mb-2xl"><div class="mn-segmented" role="tablist" aria-label="View mode"><button class="mn-segmented__item" role="tab">Day</button><button class="mn-segmented__item mn-segmented__item--active" role="tab" aria-selected="true">Week</button><button class="mn-segmented__item" role="tab">Month</button><button class="mn-segmented__item" role="tab">Quarter</button></div></div>
      <div class="mn-demo-section-label">Drag Rotary</div>
      <div class="mn-flex-center mn-gap-2xl mn-mb-2xl">
        <div id="ctrl-drag-rotary" class="mn-rotary" style="width:140px">
          <div class="mn-rotary__housing" style="width:120px;height:120px;border-radius:50%;background:var(--nero-2);border:2px solid var(--grigio-scuro);position:relative;margin:0 auto">
            <div class="mn-rotary__dial" style="position:absolute;inset:0;border-radius:50%"></div>
            <div class="mn-rotary__pointer" style="position:absolute;top:10%;left:50%;width:2px;height:40%;background:var(--mn-accent);transform-origin:bottom center"></div>
            <div class="mn-rotary__notches"></div>
          </div>
          <div class="mn-rotary__value mn-micro" style="text-align:center;margin-top:var(--space-xs);color:var(--mn-accent);font-weight:600"></div>
          <span class="mn-rotary__label mn-micro" style="display:block;text-align:center;margin-top:2px;color:var(--grigio-chiaro)">Drive Mode</span>
        </div>
      </div>
    </div>`;
    requestAnimationFrame(() => initControls(section));
    return section;
  }
  function initControls(section) {
    const M3 = window.Maranello;
    if (!M3) return;
    if (M3.initSlider) [["#ctrl-slider-1", 72, "Routing Intensity", "#slider-1-val"], ["#ctrl-slider-2", 45, "Agent Capacity", "#slider-2-val"]].forEach(([id, value, label, out]) => {
      M3.initSlider(section.querySelector(id), { value, min: 0, max: 100, label, onChange: (v) => {
        const el = section.querySelector(out);
        if (el) el.textContent = String(v);
      } });
    });
    if (M3.initRotary) [{ id: "#ctrl-rotary-1", positions: ["Draft", "Route", "Infer", "Validate", "Archive"], label: "Pipeline Stage", initial: 2 }, { id: "#ctrl-rotary-2", positions: ["Daily", "Weekly", "Monthly", "Quarterly"], label: "Report Frequency", initial: 1 }].forEach((cfg) => M3.initRotary(section.querySelector(cfg.id), cfg));
    if (M3.manettino) M3.manettino(section.querySelector("#ctrl-manettino"), { positions: ["Draft", "Route", "Infer", "Validate", "Archive"], label: "Pipeline Stage", initial: 2 });
    if (M3.cruiseLever) M3.cruiseLever(section.querySelector("#ctrl-cruise"), { positions: ["Off", "Low", "Medium", "High", "Urgent"], label: "Priority", initial: 1 });
    if (M3.toggleLever) [["#ctrl-lever-on", "Auto-Assign", true], ["#ctrl-lever-off", "Notifications", false]].forEach(([id, label, state]) => M3.toggleLever(section.querySelector(id), { label, state }));
    if (M3.steppedRotary) M3.steppedRotary(section.querySelector("#ctrl-stepped"), { positions: ["S", "M", "L", "XL"], label: "Effort", initial: 1 });
    if (M3.initDragRotary) M3.initDragRotary(section.querySelector("#ctrl-drag-rotary"), { steps: ["Off", "Eco", "Normal", "Sport", "Race"], initial: 2 });
    if (M3.icons) [["dashboard", M3.icons.dashboard], ["chart", M3.icons.barChart], ["users", M3.icons.user], ["settings", M3.icons.settings ?? M3.icons.filter]].forEach(([id, fn]) => {
      const el = section.querySelector(`#ic-cluster-${id}`);
      if (el && fn) el.innerHTML = fn();
    });
    activate(section, ".mn-btn-cluster__item", "mn-btn-cluster__item--active");
    activate(section, ".mn-segmented__item", "mn-segmented__item--active", (btn) => btn.setAttribute("aria-selected", "true"), (btn) => btn.removeAttribute("aria-selected"));
  }
  function activate(section, selector, activeClass, onSet = () => {
  }, onUnset = () => {
  }) {
    section.querySelectorAll(selector).forEach((btn) => btn.addEventListener("click", () => {
      section.querySelectorAll(selector).forEach((item) => {
        item.classList.remove(activeClass);
        onUnset(item);
      });
      btn.classList.add(activeClass);
      onSet(btn);
    }));
  }
  function toggle(label, checked) {
    return `<label class="mn-toggle${checked ? " mn-toggle--on" : ""}"><input type="checkbox"${checked ? " checked" : ""}><span class="mn-toggle__track"><span class="mn-toggle__thumb"></span></span><span class="mn-toggle__label">${label}</span></label>`;
  }
  function led(tone, text) {
    return `<span class="mn-led mn-led--${tone}"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">${text}</span></span>`;
  }
  function slider(id, label, value) {
    return `<div><span class="mn-micro" style="color:var(--grigio-chiaro);display:block;margin-bottom:var(--space-xs)">${label}</span><div id="${id}" class="mn-slider" style="height:8px;border-radius:4px;background:var(--grigio-scuro);cursor:pointer;position:relative"><div class="mn-slider__track" style="position:absolute;inset:0;border-radius:4px"></div></div><div class="mn-micro" style="color:var(--grigio-medio);margin-top:var(--space-xs)"><span id="${id.replace("ctrl-", "")}-val">${value}</span>%</div></div>`;
  }
  function controlSlot(label, id) {
    return `<div><div class="mn-demo-section-label mn-mb-sm">${label}</div><div id="${id}"></div></div>`;
  }
  function clusterButton(id, active = false) {
    return `<button class="mn-btn-cluster__item${active ? " mn-btn-cluster__item--active" : ""}" aria-label="${id}"><span class="mn-icon mn-icon--sm" id="ic-cluster-${id}"></span></button>`;
  }

  // demo/sections/forms.js
  var SEARCH_SUGGESTIONS = [
    "Pipeline Alpha \u2014 production route",
    "Agent Sonnet failover policy",
    "Embedding refresh / eu-west-1",
    "Token budget alert \u2014 March 2026"
  ];
  var INITIAL_TAGS = ["Pipeline Alpha", "us-east-1", "Claude Sonnet"];
  var MAGNIFIER_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  function createFormsSection() {
    const section = document.createElement("section");
    section.id = "forms";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">05 \u2014 Data Entry</p>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Forms &amp; Inputs</h2>
      <p class="mn-body mn-mb-2xl">Wizard, tags, search, date pickers, and agent configuration forms.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;form class="mn-form"&gt;
  &lt;div class="mn-field"&gt;&lt;label&gt;Email&lt;/label&gt;&lt;input class="mn-input" type="email" required&gt;&lt;/div&gt;
&lt;/form&gt;
Maranello.initForms();</code></pre>
      </details>
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Agent Configuration Wizard</h4>
        <div id="wizard-steps" style="display:flex;gap:var(--space-lg);margin-bottom:var(--space-xl)">
          ${[1, 2, 3].map((n) => `<div class="mn-wizard-step" data-step="${n}" style="display:flex;align-items:center;gap:var(--space-xs);opacity:${n === 1 ? 1 : 0.4}"><span style="width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;background:${n === 1 ? "var(--mn-accent)" : "var(--grigio-scuro)"};color:${n === 1 ? "var(--nero)" : "var(--grigio-chiaro)"}">${n}</span><span class="mn-micro">${["Agent Profile", "Routing Policy", "Confirmation"][n - 1]}</span></div>`).join("")}
        </div>
        <div id="wizard-panel-1" class="mn-wizard-panel"><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Agent Name</label><input class="mn-input" type="text" placeholder="router-agent-prod" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Notification Email</label><input class="mn-input" type="email" placeholder="ops@maranelloluce.ai" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Environment</label><input class="mn-input" type="text" placeholder="production-us-east-1" style="width:100%"></div></div></div>
        <div id="wizard-panel-2" class="mn-wizard-panel" style="display:none"><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Primary Model</label><select class="mn-select" style="width:100%"><option>Select a model\u2026</option><option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option><option>Agent Haiku</option></select></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Capabilities</label><div style="display:flex;gap:var(--space-md);flex-wrap:wrap">${["Batch", "Streaming", "Fallback"].map((l) => `<label class="mn-checkbox"><input type="checkbox"> <span class="mn-micro">${l}</span></label>`).join("")}</div></div></div></div>
        <div id="wizard-panel-3" class="mn-wizard-panel" style="display:none"><p class="mn-body" style="margin-bottom:var(--space-md)">Review your configuration and submit the runtime policy.</p><p class="mn-micro" style="color:var(--grigio-chiaro)">By submitting you agree to Maranello Luce platform terms.</p></div>
        <div style="display:flex;gap:var(--space-md);padding-top:var(--space-lg)"><button id="wizard-back" class="mn-btn mn-btn--ghost" disabled>Back</button><button id="wizard-next" class="mn-btn mn-btn--accent">Next</button></div>
      </div>
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Validation States</h4>
        <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Live validation using Maranello.validateField \u2014 try submitting with empty or malformed values.</p>
        <form id="validation-demo-form" onsubmit="return false" novalidate style="display:flex;flex-direction:column;gap:var(--space-md)">
          <div>
            <label class="mn-label" for="vd-name" style="display:block;margin-bottom:var(--space-xs)">Agent Name <span style="color:var(--rosso-corsa)">*</span></label>
            <input id="vd-name" class="mn-input" type="text" placeholder="router-agent-prod" required aria-required="true" style="width:100%">
            <span id="vd-name-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div>
            <label class="mn-label" for="vd-email" style="display:block;margin-bottom:var(--space-xs)">Operator Email <span style="color:var(--rosso-corsa)">*</span></label>
            <input id="vd-email" class="mn-input" type="email" placeholder="ops@maranelloluce.ai" required aria-required="true" style="width:100%">
            <span id="vd-email-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div>
            <label class="mn-label" for="vd-model" style="display:block;margin-bottom:var(--space-xs)">Primary Model <span style="color:var(--rosso-corsa)">*</span></label>
            <select id="vd-model" class="mn-select" required aria-required="true" style="width:100%">
              <option value="">Select a model\u2026</option>
              <option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option>
            </select>
            <span id="vd-model-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div style="display:flex;gap:var(--space-md);padding-top:var(--space-sm)">
            <button id="vd-submit" class="mn-btn mn-btn--accent" type="submit">Validate &amp; Submit</button>
            <button class="mn-btn mn-btn--ghost" type="reset">Reset</button>
          </div>
          <div id="vd-success" style="display:none;padding:var(--space-sm) var(--space-md);border-radius:6px;background:rgba(0,166,81,0.15);border:1px solid var(--verde-racing);color:var(--verde-racing)" role="status">Form valid \u2014 agent registered successfully.</div>
        </form>
      </div>
      <div class="mn-grid-2 mn-mb-2xl" style="gap:var(--space-xl)">
        <div style="display:flex;flex-direction:column;gap:var(--space-xl)">
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Tag Input</h4><div id="tag-input-wrap" class="mn-tag-input" style="display:flex;flex-wrap:wrap;gap:var(--space-xs);padding:var(--space-sm);border:1px solid var(--grigio-scuro);border-radius:6px;min-height:40px;align-items:center">${INITIAL_TAGS.map((t) => tagChip(t)).join("")}<input id="tag-field" class="mn-tag-input__field" type="text" placeholder="Add tag\u2026" style="border:none;background:transparent;color:inherit;outline:none;flex:1;min-width:80px;font-size:var(--font-sm)"></div></div>
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Search Bar</h4><div class="mn-search-bar" style="position:relative"><div style="position:relative;display:flex;align-items:center"><span style="position:absolute;left:10px;display:flex;color:var(--grigio-chiaro)">${MAGNIFIER_SVG}</span><input id="search-field" class="mn-input" type="search" placeholder="Search pipelines, agents\u2026" style="width:100%;padding-left:34px"></div><ul id="search-suggestions" class="mn-search-bar__list" style="display:none;position:absolute;top:100%;left:0;right:0;margin:var(--space-xs) 0 0;padding:var(--space-xs);list-style:none;background:var(--nero-soft,#141414);border:1px solid var(--mn-accent,#FFC72C);border-radius:6px;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.5)">${SEARCH_SUGGESTIONS.map((s) => `<li class="mn-search-bar__item" style="padding:var(--space-sm) var(--space-md);border-radius:4px;cursor:pointer;color:var(--bianco-caldo,#f5f5f5);font-size:0.85rem;transition:background 0.15s">${s}</li>`).join("")}</ul></div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-xl)">
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Date Range</h4><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs);color:var(--grigio-alluminio,#c0c0c0)">Start Date</label><input id="dp-start" class="mn-input" type="text" placeholder="YYYY-MM-DD" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs);color:var(--grigio-alluminio,#c0c0c0)">End Date</label><input id="dp-end" class="mn-input" type="text" placeholder="YYYY-MM-DD" style="width:100%"></div></div></div>
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Quick Agent Setup</h4><form onsubmit="return false" style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Agent Name</label><input class="mn-input" type="text" placeholder="validator-canary" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Notification Email</label><input class="mn-input" type="email" placeholder="signals@maranelloluce.ai" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Primary Model</label><select class="mn-select" style="width:100%"><option>Select\u2026</option><option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option></select></div><div style="display:flex;gap:var(--space-md);padding-top:var(--space-sm)"><button class="mn-btn mn-btn--accent" type="submit">Register</button><button class="mn-btn mn-btn--ghost" type="reset">Clear</button></div></form></div>
        </div>
      </div>
    </div>
  `;
    requestAnimationFrame(() => initForms(section));
    return section;
  }
  function tagChip(text) {
    return `<span class="mn-tag-input__chip" style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:4px;background:var(--mn-accent);color:var(--nero);font-size:var(--font-xs);font-weight:600">${text}<button type="button" class="mn-tag-input__remove" style="background:none;border:none;cursor:pointer;color:inherit;font-size:14px;line-height:1;padding:0 0 0 2px">&times;</button></span>`;
  }
  function initForms(section) {
    const M3 = window.Maranello;
    let step = 1;
    const back = section.querySelector("#wizard-back");
    const next = section.querySelector("#wizard-next");
    const setStep = (n) => {
      step = n;
      for (let i = 1; i <= 3; i++) {
        const panel = section.querySelector(`#wizard-panel-${i}`);
        const indicator = section.querySelector(`.mn-wizard-step[data-step="${i}"]`);
        if (panel) panel.style.display = i === step ? "" : "none";
        if (indicator) {
          indicator.style.opacity = i <= step ? 1 : 0.4;
          const dot = indicator.querySelector("span");
          if (dot) {
            dot.style.background = i <= step ? "var(--mn-accent)" : "var(--grigio-scuro)";
            dot.style.color = i <= step ? "var(--nero)" : "var(--grigio-chiaro)";
          }
        }
      }
      back.disabled = step === 1;
      next.textContent = step === 3 ? "Submit" : "Next";
    };
    next.addEventListener("click", () => {
      if (step < 3) setStep(step + 1);
    });
    back.addEventListener("click", () => {
      if (step > 1) setStep(step - 1);
    });
    const tagWrap = section.querySelector("#tag-input-wrap");
    const tagField = section.querySelector("#tag-field");
    tagWrap.addEventListener("click", (e) => {
      if (e.target.classList.contains("mn-tag-input__remove")) e.target.parentElement.remove();
      else tagField.focus();
    });
    tagField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && tagField.value.trim()) {
        e.preventDefault();
        tagField.insertAdjacentHTML("beforebegin", tagChip(tagField.value.trim()));
        tagField.value = "";
      }
    });
    const searchField = section.querySelector("#search-field");
    const suggestions = section.querySelector("#search-suggestions");
    searchField.addEventListener("focus", () => {
      suggestions.style.display = "";
    });
    searchField.addEventListener("blur", () => {
      setTimeout(() => {
        suggestions.style.display = "none";
      }, 150);
    });
    suggestions.querySelectorAll(".mn-search-bar__item").forEach((li) => {
      li.addEventListener("mousedown", () => {
        searchField.value = li.textContent;
        suggestions.style.display = "none";
      });
      li.addEventListener("mouseenter", () => {
        li.style.background = "var(--grigio-scuro)";
      });
      li.addEventListener("mouseleave", () => {
        li.style.background = "";
      });
    });
    if (M3 && M3.datePicker) ["dp-start", "dp-end"].forEach((id) => {
      const input = section.querySelector(`#${id}`);
      if (input) M3.registerDatePicker(input, { value: "", onChange: (d) => {
        input.value = d;
      } });
    });
    initValidationDemo(M3, section);
  }
  function setFieldError(input, errSpan, message) {
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.style.borderColor = "var(--rosso-corsa)";
      errSpan.textContent = message;
      errSpan.style.display = "block";
    } else {
      input.removeAttribute("aria-invalid");
      input.style.borderColor = "";
      errSpan.style.display = "none";
    }
  }
  function initValidationDemo(M3, section) {
    const form = section.querySelector("#validation-demo-form");
    if (!form) return;
    const nameInput = form.querySelector("#vd-name");
    const emailInput = form.querySelector("#vd-email");
    const modelSelect = form.querySelector("#vd-model");
    const nameErr = form.querySelector("#vd-name-err");
    const emailErr = form.querySelector("#vd-email-err");
    const modelErr = form.querySelector("#vd-model-err");
    const success = form.querySelector("#vd-success");
    nameInput.addEventListener("blur", () => {
      const msg = nameInput.value.trim() === "" ? "Agent name is required." : "";
      setFieldError(nameInput, nameErr, msg);
    });
    emailInput.addEventListener("blur", () => {
      const val = emailInput.value.trim();
      const msg = val === "" ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email address." : "";
      setFieldError(emailInput, emailErr, msg);
    });
    modelSelect.addEventListener("change", () => {
      const msg = modelSelect.value === "" ? "Select a primary model." : "";
      setFieldError(modelSelect, modelErr, msg);
    });
    form.addEventListener("reset", () => {
      [nameInput, emailInput, modelSelect].forEach((el) => {
        el.removeAttribute("aria-invalid");
        el.style.borderColor = "";
      });
      [nameErr, emailErr, modelErr].forEach((el) => {
        el.style.display = "none";
      });
      if (success) success.style.display = "none";
    });
    form.querySelector("#vd-submit").addEventListener("click", () => {
      const nameMsg = nameInput.value.trim() === "" ? "Agent name is required." : "";
      const val = emailInput.value.trim();
      const emailMsg = val === "" ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email address." : "";
      const modelMsg = modelSelect.value === "" ? "Select a primary model." : "";
      setFieldError(nameInput, nameErr, nameMsg);
      setFieldError(emailInput, emailErr, emailMsg);
      setFieldError(modelSelect, modelErr, modelMsg);
      const valid = !nameMsg && !emailMsg && !modelMsg;
      if (success) success.style.display = valid ? "block" : "none";
      if (valid && M3?.validateField) {
        try {
          M3.validateField(nameInput);
          M3.validateField(emailInput);
        } catch (_) {
        }
      }
    });
  }

  // demo/sections/tables.js
  var PAGE_SIZE = 9;
  var GROUP_ORDER = ["Running", "Queued", "Planned"];
  var COLUMNS = [
    { key: "program", label: "Pipeline" },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status" },
    { key: "quality", label: "Accuracy" },
    { key: "impact", label: "Impact" },
    { key: "region", label: "Region" }
  ];
  var PROGRAMS = [
    { group: "Running", program: "Pipeline Alpha", owner: "Agent Opus", role: "Orchestrator", status: "Active", quality: 97, impact: "High", region: "us-east-1" },
    { group: "Running", program: "Pipeline Beta", owner: "Agent Sonnet", role: "Executor", status: "At Risk", quality: 82, impact: "Critical", region: "eu-west-1" },
    { group: "Running", program: "Pipeline Gamma", owner: "Agent Haiku", role: "Monitor", status: "Active", quality: 91, impact: "Med", region: "ap-southeast-1" },
    { group: "Running", program: "Pipeline Delta", owner: "Validator Mesh", role: "Validator", status: "Blocked", quality: 58, impact: "Critical", region: "us-west-2" },
    { group: "Queued", program: "Pipeline Epsilon", owner: "Gemini Research", role: "Research Agent", status: "Planning", quality: 76, impact: "Med", region: "sa-east-1" },
    { group: "Queued", program: "Pipeline Zeta", owner: "GPT Router", role: "Runtime Lead", status: "At Risk", quality: 74, impact: "High", region: "eu-central-1" },
    { group: "Planned", program: "Pipeline Eta", owner: "Prompt Forge", role: "Prompt Lead", status: "Planning", quality: 69, impact: "Med", region: "ap-northeast-1" },
    { group: "Planned", program: "Pipeline Theta", owner: "Cache Sentinel", role: "Platform Agent", status: "Planning", quality: 83, impact: "High", region: "us-east-2" },
    { group: "Planned", program: "Pipeline Iota", owner: "Eval Ops", role: "Quality Agent", status: "Planning", quality: 72, impact: "Med", region: "eu-west-2" },
    { group: "Running", program: "Pipeline Kappa", owner: "Claude Router", role: "Orchestrator", status: "Active", quality: 95, impact: "High", region: "us-east-1" },
    { group: "Running", program: "Pipeline Lambda", owner: "Budget Guard", role: "Control Agent", status: "At Risk", quality: 71, impact: "Critical", region: "ap-southeast-2" },
    { group: "Queued", program: "Pipeline Mu", owner: "Replay Lab", role: "Evaluator", status: "Planning", quality: 77, impact: "High", region: "eu-west-1" },
    { group: "Planned", program: "Pipeline Nu", owner: "Storage Mesh", role: "Infra Agent", status: "Planning", quality: 68, impact: "Med", region: "ca-central-1" },
    { group: "Planned", program: "Pipeline Xi", owner: "Ops Relay", role: "Monitor", status: "Planning", quality: 81, impact: "High", region: "me-central-1" },
    { group: "Running", program: "Pipeline Omicron", owner: "Fallback Grid", role: "Executor", status: "Blocked", quality: 54, impact: "Critical", region: "us-west-1" },
    { group: "Queued", program: "Pipeline Pi", owner: "Judge Suite", role: "Validator", status: "At Risk", quality: 79, impact: "High", region: "eu-north-1" },
    { group: "Planned", program: "Pipeline Rho", owner: "Cache Bloom", role: "Platform Agent", status: "Planning", quality: 73, impact: "Med", region: "ap-south-1" },
    { group: "Running", program: "Pipeline Sigma", owner: "Token Ledger", role: "Budget Agent", status: "Active", quality: 94, impact: "High", region: "us-east-1" }
  ];
  function createTablesSection() {
    const section = document.createElement("section");
    section.id = "tables";
    section.className = "mn-section-light";
    section.innerHTML = `
    <style>
      #tables .mn-rich-table__headbtn{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:0;background:none;border:0;color:inherit;font:600 var(--text-caption)/1.2 var(--font-display);text-transform:uppercase;letter-spacing:.06em;cursor:pointer}
      #tables .mn-rich-table__filter{width:100%;padding:8px 10px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.03);color:var(--bianco-caldo);font-size:var(--text-micro)}
      #tables .mn-rich-table__group td{padding:12px;background:rgba(255,199,44,.08);font:700 var(--text-caption)/1 var(--font-display);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      #tables .mn-rich-table__row:hover{background:rgba(255,199,44,.08)}
      #tables .mn-rich-table__owner{display:flex;align-items:center;gap:10px}#tables .mn-rich-table__avatar{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:rgba(255,199,44,.16);color:var(--mn-accent);font:700 var(--text-micro)/1 var(--font-display)}
      #tables .mn-rich-table__quality{display:flex;align-items:center;gap:10px}#tables .mn-rich-table__quality .mn-progress{width:72px}
      #tables .mn-rich-table__badge{display:inline-flex;align-items:center;justify-content:center;padding:4px 10px;border-radius:999px;font-size:var(--text-micro);font-weight:700;text-transform:uppercase}#tables .mn-rich-table__badge--critical{background:rgba(220,0,0,.16);color:#DC0000}#tables .mn-rich-table__badge--high{background:rgba(255,199,44,.18);color:#FFC72C}#tables .mn-rich-table__badge--med{background:rgba(78,168,222,.16);color:#4EA8DE}
      #tables .mn-rich-table__footer{display:flex;justify-content:space-between;align-items:center;gap:var(--space-md);flex-wrap:wrap;margin-top:var(--space-lg)}
    </style>
    <div class="mn-container">
      <p class="mn-section-number">06 \u2014 Data Display</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Interactive Deployment Table</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Column filters, grouped deployment rows, status LEDs, accuracy bars, and ownership detail for Maranello Luce agent deployments.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;mn-data-table
  columns='[{"key":"program","label":"Pipeline"}]'
  data='[{"program":"Pipeline Alpha"}]'
  page-size="10"&gt;&lt;/mn-data-table&gt;</code></pre>
      </details>
      <div class="mn-card-dark" style="padding:var(--space-xl)"><div class="mn-tag-group" style="margin-bottom:var(--space-md)"><span class="mn-tag mn-tag--light mn-tag--xs">Filter every column</span><span class="mn-tag mn-tag--light mn-tag--xs">Sort with header arrows</span><span class="mn-tag mn-tag--light mn-tag--xs">Collapse each group</span></div><div id="deployment-table-host"></div></div>
    </div>`;
    requestAnimationFrame(() => initTable(section));
    return section;
  }
  function initTable(section) {
    const host = section.querySelector("#deployment-table-host");
    const state = { page: 1, sortKey: "program", sortDir: 1, filters: Object.fromEntries(COLUMNS.map((col) => [col.key, ""])), collapsed: {} };
    const render2 = () => {
      const filtered = orderRows(PROGRAMS.filter((row) => COLUMNS.every((col) => String(row[col.key]).toLowerCase().includes(state.filters[col.key]))), state);
      const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      state.page = Math.min(state.page, pages);
      const pageRows = filtered.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
      host.innerHTML = `<div class="mn-table-wrap"><table class="mn-table"><thead><tr>${COLUMNS.map((col) => `<th><button type="button" class="mn-rich-table__headbtn" data-sort="${col.key}">${col.label}<span>${arrow(col.key, state)}</span></button></th>`).join("")}</tr><tr>${COLUMNS.map((col) => `<th><input class="mn-rich-table__filter" data-filter="${col.key}" value="${esc2(state.filters[col.key])}" placeholder="Filter"></th>`).join("")}</tr></thead><tbody>${groupedRows(pageRows, state)}</tbody></table></div><div class="mn-rich-table__footer"><span class="mn-micro" style="color:var(--grigio-chiaro)">Showing ${pageRows.length} of ${filtered.length} deployments</span><div class="mn-dots">${Array.from({ length: pages }, (_, index) => `<button class="mn-dot ${index + 1 === state.page ? "mn-dot--active" : ""}" data-page="${index + 1}" aria-label="Page ${index + 1}"></button>`).join("")}</div></div>`;
      bind(host, state, render2);
    };
    render2();
  }
  function bind(host, state, render2) {
    host.querySelectorAll("[data-sort]").forEach((btn) => btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-sort");
      state.sortDir = state.sortKey === key ? state.sortDir * -1 : 1;
      state.sortKey = key;
      render2();
    }));
    host.querySelectorAll("[data-filter]").forEach((input) => input.addEventListener("input", () => {
      state.filters[input.getAttribute("data-filter")] = input.value.trim().toLowerCase();
      state.page = 1;
      render2();
    }));
    host.querySelectorAll("[data-group]").forEach((row) => row.addEventListener("click", () => {
      const group = row.getAttribute("data-group");
      state.collapsed[group] = !state.collapsed[group];
      render2();
    }));
    host.querySelectorAll("[data-page]").forEach((btn) => btn.addEventListener("click", () => {
      state.page = Number(btn.getAttribute("data-page"));
      render2();
    }));
  }
  function groupedRows(rows, state) {
    return GROUP_ORDER.map((group) => {
      const items = rows.filter((row) => row.group === group);
      if (!items.length) return "";
      const open = !state.collapsed[group];
      return `<tr class="mn-rich-table__group" data-group="${group}"><td colspan="${COLUMNS.length}">${open ? "\u25BC" : "\u25B6"} ${group.toUpperCase()} ${items.length}</td></tr>${open ? items.map((row) => `<tr class="mn-rich-table__row"><td><strong>${row.program}</strong><div class="mn-micro" style="color:var(--grigio-medio)">${row.group}</div></td><td>${ownerCell(row)}</td><td><span class="mn-status mn-status--${statusTone(row.status)}"><span class="mn-status__dot"></span> ${row.status}</span></td><td>${qualityCell(row.quality)}</td><td><span class="mn-rich-table__badge mn-rich-table__badge--${row.impact.toLowerCase()}">${row.impact}</span></td><td>${row.region}</td></tr>`).join("") : ""}`;
    }).join("");
  }
  function orderRows(rows, state) {
    return GROUP_ORDER.flatMap((group) => rows.filter((row) => row.group === group).sort((a, b) => compare(a[state.sortKey], b[state.sortKey], state.sortDir)));
  }
  function compare(a, b, dir) {
    return (typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b))) * dir;
  }
  function arrow(key, state) {
    return state.sortKey !== key ? "\u25B2\u25BC" : state.sortDir > 0 ? "\u25B2" : "\u25BC";
  }
  function ownerCell(row) {
    return `<div class="mn-rich-table__owner"><span class="mn-rich-table__avatar">${row.owner.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><strong>${row.owner}</strong><div class="mn-micro" style="color:var(--grigio-medio)">${row.role}</div></div></div>`;
  }
  function qualityCell(value) {
    return `<div class="mn-rich-table__quality"><div class="mn-progress"><div class="mn-progress__fill ${value >= 85 ? "mn-progress__fill--green" : value >= 65 ? "mn-progress__fill--yellow" : "mn-progress__fill--red"}" style="width:${value}%"></div></div><span class="mn-micro">${value}%</span></div>`;
  }
  function statusTone(status) {
    return status === "Active" ? "active" : status === "At Risk" ? "warning" : status === "Blocked" ? "danger" : "info";
  }
  function esc2(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // demo/sections/gauges.js
  function createGaugesSection() {
    const section = document.createElement("section");
    section.id = "gauges";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">08 \u2014 Instrumentation</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Instrument Binnacle</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Every gauge tells a complete story. Ferrari-style complications show layered data \u2014 needle, sub-dials, arc bars, odometer, crosshair and trend indicators.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;canvas data-gauge='{"value":75,"max":100,"color":"#FFC72C","ticks":5}'&gt;&lt;/canvas&gt;
Maranello.initGauges();</code></pre>
      </details>
      <div class="mn-binnacle"><div class="mn-binnacle__header"><span class="mn-binnacle__title">Maranello Luce / Instrument Binnacle</span><span class="mn-binnacle__badge">\u25C8 Aligned</span></div><div class="mn-binnacle__instruments"><div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${utilGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Agent Utilization</span></div><div class="mn-gauge"><div class="mn-gauge__instrument" style="width:300px;height:300px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${heroGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Accuracy Score</span></div><div class="mn-gauge"><div class="mn-gauge__instrument" style="width:220px;height:220px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${portfolioGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Pipeline Map</span></div></div></div>
      <div style="display:flex;justify-content:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-2xl)"><div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial mn-gauge__dial--warning"><canvas class="mn-gauge__canvas" data-gauge='${riskGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Retry Depth</span></div><div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${dataQualityGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Token Health</span></div><div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${kpiGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Gate Coverage</span></div><div class="mn-gauge"><div class="mn-gauge__instrument" style="width:220px;height:220px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${trendGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Budget Trend</span></div></div>
    </div>
  `;
    setTimeout(() => {
      if (window.Maranello?.initGauges) window.Maranello.initGauges({ selector: "#gauges .mn-gauge__canvas", threshold: 0.1 });
      else console.warn("[gauges] Maranello.initGauges not ready");
    }, 300);
    return section;
  }
  function utilGauge() {
    return JSON.stringify({ value: 87, max: 100, color: "#00A651", ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 20, 40, 60, 80, 100], complications: { innerRing: { value: 312, max: 400, color: "#FFC72C", label: "Agents" }, odometer: { digits: ["3", "1", "2"], highlightLast: true, label: "agents" }, statusLed: { color: "#00A651", label: "HEALTHY" } } });
  }
  function heroGauge() {
    return JSON.stringify({ value: 96, max: 100, color: "#FFC72C", ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], complications: { arcBar: { value: 14560, max: 2e4, colorStops: ["#DC0000", "#FFC72C", "#00A651"], labelLeft: "0", labelRight: "20k", labelCenter: "14.6k tasks" }, subDials: [{ x: -0.28, y: 0.18, value: 91, max: 100, color: "#448AFF", label: "Routing" }, { x: 0.28, y: 0.18, value: 96, max: 100, color: "#DC0000", label: "Quality" }], trend: { direction: "up", delta: "+6", color: "#00A651" }, centerLabel: "PLATFORM", centerValue: "96", centerUnit: "/ 100" } });
  }
  function portfolioGauge() {
    return JSON.stringify({ value: 0, max: 100, color: "#448AFF", ticks: 0, subticks: 0, startAngle: 0, endAngle: 0, showNeedle: false, complications: { crosshair: { x: 0.35, y: -0.25, dotColor: "#FFC72C", gridColor: "#5a4a20", labelTop: "RUNNING", labelBottom: "PAUSED", labelLeft: "LOW", labelRight: "HIGH", title: "LATENCY", scatterDots: [{ x: 0.55, y: -0.4, color: "#00E676", r: 7 }, { x: 0.7, y: -0.55, color: "#00E676", r: 6 }, { x: 0.3, y: -0.1, color: "#FFD54F", r: 6 }, { x: 0.15, y: -0.5, color: "#64B5F6", r: 5 }, { x: -0.2, y: -0.3, color: "#64B5F6", r: 5 }, { x: 0.6, y: -0.2, color: "#00E676", r: 6 }, { x: 0.4, y: -0.65, color: "#00E676", r: 7 }] }, quadrantCounts: { tl: 3, tr: 18, bl: 2, br: 5 }, statusLed: { color: "#00A651", label: "28 RUNS" } } });
  }
  function riskGauge() {
    return JSON.stringify({ value: 15, max: 100, color: "#DC0000", ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: "RETRY", centerValue: "15", centerUnit: "%", statusLed: { color: "#DC0000", label: "ALERT" }, trend: { direction: "up", delta: "+3", color: "#DC0000" } } });
  }
  function dataQualityGauge() {
    return JSON.stringify({ value: 91, max: 100, color: "#00A651", ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: "TOKEN", centerValue: "91", centerUnit: "%", innerRing: { value: 88, max: 100, color: "#448AFF", label: "PREV" }, statusLed: { color: "#00A651", label: "PASS" } } });
  }
  function kpiGauge() {
    return JSON.stringify({ value: 72, max: 100, color: "#FFC72C", ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: "GATES", centerValue: "72", centerUnit: "%", arcBar: { value: 18, max: 24, colorStops: ["#DC0000", "#FFC72C", "#00A651"], labelCenter: "18/24" }, statusLed: { color: "#FFC72C", label: "WARN" } } });
  }
  function trendGauge() {
    return JSON.stringify({ value: 0, max: 100, color: "#FFC72C", ticks: 0, subticks: 0, startAngle: 0, endAngle: 0, showNeedle: false, complications: { multigraph: { mode: "sparkline", data: [42, 48, 55, 52, 61, 58, 65, 63, 70, 68, 72, 75], color: "#FFC72C", label: "SPEND", months: ["A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F", "M"] }, centerLabel: "FY26", centerValue: "75", centerUnit: "score", trend: { direction: "up", delta: "+33", color: "#00A651" } } });
  }

  // demo/sections/cockpit.js
  function createCockpitSection() {
    const section = document.createElement("section");
    section.id = "cockpit";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">09 \u2014 Cockpit</p>
      <h2 class="mn-title-section mn-mb-sm">Cockpit Instruments</h2>
      <p class="mn-body mn-mb-2xl">Maranello Luce platform cockpit with live-style telemetry dials and AI service health visibility.</p>
      <div class="mn-divider-gold mn-mb-lg"></div>
      <h3 class="mn-title-sub mn-mb-sm">Performance Dials</h3>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:flex-end;justify-content:space-between">
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:220px;flex:1"><p class="mn-label mn-mb-sm">Routing Throughput</p><canvas id="cockpit-speed-therapy" width="220" height="220"></canvas></div>
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:320px;flex:1"><p class="mn-label mn-mb-sm">Accuracy Score</p><canvas id="cockpit-speed-impact" width="320" height="320"></canvas></div>
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:140px;flex:1"><p class="mn-label mn-mb-sm">Agent Load</p><canvas id="cockpit-speed-volunteer" width="120" height="120"></canvas></div>
      </div>
      <h3 class="mn-title-sub mn-mb-sm">System Status</h3>
      <p class="mn-micro mn-mb-lg">Endpoints are fictional and expected to appear degraded/offline in demo mode.</p>
      <div id="cockpit-system-status"></div>
    </div>
  `;
    requestAnimationFrame(() => initCockpit(section));
    return section;
  }
  function initCockpit(section) {
    const M3 = window.Maranello;
    if (!M3) return;
    const throughputCanvas = section.querySelector("#cockpit-speed-therapy");
    const accuracyCanvas = section.querySelector("#cockpit-speed-impact");
    const loadCanvas = section.querySelector("#cockpit-speed-volunteer");
    const statusContainer = section.querySelector("#cockpit-system-status");
    if (M3.speedometer) {
      if (throughputCanvas instanceof HTMLCanvasElement) M3.speedometer(throughputCanvas, { value: 78, max: 100, unit: "%", size: "md", ticks: [0, 25, 50, 75, 100], needleColor: "#DC0000", arcColor: "#FFC72C", bar: { value: 65, max: 100 }, subLabel: "Target: 80%", animate: true });
      if (accuracyCanvas instanceof HTMLCanvasElement) M3.speedometer(accuracyCanvas, { value: 96, max: 100, unit: "pts", size: "lg", ticks: [0, 20, 40, 60, 80, 100], needleColor: "#DC0000", arcColor: "#00A651", subLabel: "Above Target", animate: true });
      if (loadCanvas instanceof HTMLCanvasElement) M3.speedometer(loadCanvas, { value: 61, max: 100, unit: "%", size: "sm", ticks: [0, 25, 50, 75, 100], needleColor: "#DC0000", arcColor: "#4EA8DE", subLabel: "Healthy", animate: true });
    }
    if (M3.systemStatus && statusContainer instanceof HTMLElement) {
      M3.systemStatus(statusContainer, {
        version: "v3.0.0",
        environment: "Production",
        pollInterval: 1e4,
        services: [
          { name: "Gateway", url: "https://api.maranelloluce.ai/gateway" },
          { name: "Model Router", url: "https://route.maranelloluce.ai" },
          { name: "Vector DB", url: "https://vectors.maranelloluce.ai" },
          { name: "Cache", url: "https://cache.maranelloluce.ai" }
        ],
        onClick: (service) => console.log("[cockpit] service clicked:", service?.name || service)
      });
    }
  }

  // demo/sections/telemetry.js
  var GAUGES = [
    { label: "API Latency", value: 182, max: 400, unit: "ms", color: "#FFC72C", sub: "Gateway p95" },
    { label: "Throughput", value: 2840, max: 4e3, unit: "req/s", color: "#00A651", sub: "Pipeline runs" },
    { label: "GPU Usage", value: 68, max: 100, unit: "%", color: "#4EA8DE", sub: "Worker pool" },
    { label: "Error Rate", value: 1.4, max: 5, unit: "%", color: "#DC0000", sub: "Model router" }
  ];
  var SERVICES = [
    { name: "Gateway", detail: "212 ms p95 latency", tone: "green" },
    { name: "Model Router", detail: "2797 routed req/sec", tone: "green" },
    { name: "Vector Store", detail: "57% cache pressure", tone: "amber" },
    { name: "Inference Queue", detail: "258 token windows", tone: "green" },
    { name: "Eval Service", detail: "1.5% failed evals", tone: "green" },
    { name: "Budget Sentinel", detail: "Night digest idle", tone: "off" }
  ];
  function svgGauge(g) {
    const pct = Math.min(1, g.value / g.max);
    const r = 52, circ = 2 * Math.PI * r, arc = circ * 0.75;
    const dash = arc * pct;
    const display = g.unit === "%" && g.value < 10 ? g.value.toFixed(1) : Math.round(g.value).toLocaleString("en-US");
    return `<div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;flex:1 1 160px;min-width:160px">
    <p class="mn-label" style="margin-bottom:var(--space-sm)">${g.label}</p>
    <svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto">
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--grigio-scuro,#333)" stroke-width="8"
        stroke-dasharray="${arc} ${circ}" stroke-dashoffset="0" stroke-linecap="round"
        transform="rotate(135 60 60)"/>
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="${g.color}" stroke-width="8"
        stroke-dasharray="${dash} ${circ}" stroke-dashoffset="0" stroke-linecap="round"
        transform="rotate(135 60 60)" style="transition:stroke-dasharray 1s ease">
        <animate attributeName="stroke-dasharray" from="0 ${circ}" to="${dash} ${circ}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94"/>
      </circle>
      <text x="60" y="56" text-anchor="middle" fill="${g.color}" font-family="var(--font-display,Outfit,sans-serif)" font-size="22" font-weight="700">${display}</text>
      <text x="60" y="72" text-anchor="middle" fill="var(--grigio-medio,#666)" font-family="var(--font-body,Inter,sans-serif)" font-size="10">${g.unit}</text>
    </svg>
    <p class="mn-micro" style="color:var(--grigio-medio);margin-top:var(--space-xs)">${g.sub}</p>
  </div>`;
  }
  function serviceRow(s) {
    const color = s.tone === "green" ? "#00A651" : s.tone === "amber" ? "#FFC72C" : s.tone === "red" ? "#DC0000" : "var(--grigio-scuro)";
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid rgba(255,255,255,0.06)">
    <div style="display:flex;align-items:center;gap:var(--space-sm)">
      <span style="width:10px;height:10px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color}60;flex-shrink:0"></span>
      <div>
        <span class="mn-label">${s.name}</span>
        <div class="mn-micro" style="color:var(--grigio-medio)">${s.detail}</div>
      </div>
    </div>
    <span class="mn-micro" style="color:var(--grigio-chiaro);text-transform:uppercase;letter-spacing:0.08em">${s.tone === "off" ? "IDLE" : s.tone.toUpperCase()}</span>
  </div>`;
  }
  function createTelemetrySection() {
    const section = document.createElement("section");
    section.id = "telemetry";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">09B \u2014 Live Telemetry</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Telemetry Deck</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Unified monitoring for agent orchestration, token routing, and inference pipelines.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);margin-bottom:var(--space-2xl)">
        ${GAUGES.map(svgGauge).join("")}
      </div>
      <div class="mn-signal-panel" style="padding:var(--space-xl)">
        <p class="mn-micro" style="color:var(--mn-accent);letter-spacing:0.1em;margin-bottom:var(--space-xs)">SIGNAL PANEL</p>
        <h3 class="mn-label" style="margin-bottom:var(--space-md)">Service Readiness</h3>
        ${SERVICES.map(serviceRow).join("")}
      </div>
    </div>
  `;
    return section;
  }

  // demo/sections/gantt.js
  var MINI_TIMELINE = [
    { name: "Pipeline Alpha", start: 1, end: 8, status: "active", dates: "08 Jan \u2014 28 Mar" },
    { name: "Pipeline Beta", start: 4, end: 10, status: "planned", dates: "02 Feb \u2014 10 May" },
    { name: "Pipeline Gamma", start: 2, end: 5, status: "at-risk", dates: "20 Jan \u2014 18 Feb" },
    { name: "Pipeline Delta", start: 6, end: 11, status: "completed", dates: "14 Mar \u2014 31 May" },
    { name: "Pipeline Epsilon", start: 9, end: 13, status: "planned", dates: "01 May \u2014 22 Jun" }
  ];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  function createGanttSection() {
    const section = document.createElement("section");
    section.id = "gantt";
    section.className = "mn-section-light";
    section.innerHTML = `
    <style>
      #gantt .mn-mini-gantt{display:grid;gap:var(--space-sm)}
      #gantt .mn-mini-gantt__head{display:grid;grid-template-columns:180px repeat(6,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm);color:var(--grigio-medio);font-size:var(--text-micro);text-transform:uppercase;letter-spacing:.08em}
      #gantt .mn-mini-gantt__row{display:grid;grid-template-columns:180px 1fr;gap:var(--space-md);align-items:center}
      #gantt .mn-mini-gantt__track{position:relative;height:28px;border-radius:999px;background:linear-gradient(90deg,rgba(0,0,0,.04),rgba(0,0,0,.08));overflow:hidden}
      #gantt .mn-mini-gantt__track::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(16.66% - 1px),rgba(255,255,255,.15) calc(16.66% - 1px) 16.66%)}
      #gantt .mn-mini-gantt__bar{position:absolute;top:4px;bottom:4px;border-radius:999px}
      #gantt .mn-mini-gantt__bar--active{background:#00A651}#gantt .mn-mini-gantt__bar--planned{background:#FFC72C}#gantt .mn-mini-gantt__bar--at-risk{background:#DC0000}#gantt .mn-mini-gantt__bar--completed{background:#4EA8DE}
    </style>
    <div class="mn-container"><p class="mn-section-number">09 \u2014 Project Management</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Gantt Timeline</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Interactive pipeline timelines plus a compact inline planner for weekly release checks.</p><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">2026 Runtime Pipeline Schedule</h3><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)"><mn-gantt tasks='${runtimeTasks()}'></mn-gantt></div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Mini Gantt Timeline</h3><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)">${miniGantt()}</div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Model Rollout Timeline</h3><div class="mn-card-dark" style="padding:var(--space-lg)"><mn-gantt tasks='${modelTasks()}'></mn-gantt></div><div class="mn-grid-3" style="margin-top:var(--space-2xl)">${timelineStat("Active Pipelines", "8", "across 5 regions")}${timelineStat("Dependencies", "6", "cross-lane links")}${timelineStat("Avg Duration", "4.2", "weeks per phase")}</div></div>`;
    return section;
  }
  function miniGantt() {
    return `<div class="mn-mini-gantt"><div class="mn-mini-gantt__head"><span>Pipeline</span>${MONTHS.map((month) => `<span>${month}</span>`).join("")}</div>${MINI_TIMELINE.map((item) => {
      const left = (item.start - 1) / 12 * 100;
      const width = (item.end - item.start + 1) / 12 * 100;
      return `<div class="mn-mini-gantt__row"><div><strong>${item.name}</strong><div class="mn-micro" style="color:var(--grigio-medio)">${item.dates}</div></div><div class="mn-mini-gantt__track"><span class="mn-mini-gantt__bar mn-mini-gantt__bar--${item.status}" style="left:${left}%;width:${width}%" title="${item.dates}"></span></div></div>`;
    }).join("")}</div>`;
  }
  function esc3(str) {
    return str.replace(/'/g, "&#39;");
  }
  function runtimeTasks() {
    return esc3(JSON.stringify([{ id: "t1", title: "Prompt Intake", start: "2026-01-15", end: "2026-02-28", progress: 100, color: "#FFC72C" }, { id: "t2", title: "Model Routing", start: "2026-03-01", end: "2026-05-15", progress: 75, color: "#4EA8DE", dependencies: ["t1"] }, { id: "t3", title: "Inference Window", start: "2026-03-15", end: "2026-06-30", progress: 60, color: "#00A651", dependencies: ["t1"] }, { id: "t4", title: "Eval & Replay", start: "2026-04-01", end: "2026-07-31", progress: 40, color: "#D4622B", dependencies: ["t2"] }, { id: "t5", title: "Guardrail Audit", start: "2026-05-01", end: "2026-07-15", progress: 25, color: "#8B5CF6", dependencies: ["t2", "t3"] }, { id: "t6", title: "Canary Rollout", start: "2026-06-01", end: "2026-08-31", progress: 10, color: "#4EA8DE", dependencies: ["t2"] }, { id: "t7", title: "Release Review", start: "2026-08-01", end: "2026-08-31", progress: 0, color: "#DC0000", dependencies: ["t4", "t5", "t6"] }, { id: "t8", title: "Production Scale", start: "2026-09-01", end: "2026-11-30", progress: 0, color: "#FFC72C", dependencies: ["t7"] }]));
  }
  function modelTasks() {
    return esc3(JSON.stringify([{ id: "r1", title: "Benchmark Review", start: "2026-02-01", end: "2026-03-31", progress: 90, color: "#FFC72C" }, { id: "r2", title: "Routing Policy Design", start: "2026-03-15", end: "2026-04-30", progress: 70, color: "#4EA8DE", dependencies: ["r1"] }, { id: "r3", title: "Safety Approval", start: "2026-04-15", end: "2026-05-31", progress: 50, color: "#DC0000", dependencies: ["r2"] }, { id: "r4", title: "Canary Deployment", start: "2026-06-01", end: "2026-09-30", progress: 15, color: "#00A651", dependencies: ["r3"] }, { id: "r5", title: "Global Rollout", start: "2026-10-01", end: "2026-11-30", progress: 0, color: "#8B5CF6", dependencies: ["r4"] }]));
  }
  function timelineStat(label, value, sub) {
    return `<div class="mn-card-dark" style="padding:var(--space-xl);text-align:center"><div class="mn-label" style="color:var(--grigio-chiaro);margin-bottom:var(--space-sm)">${label}</div><div style="font-family:var(--font-display);font-size:var(--text-h1);font-weight:700;color:var(--mn-accent)">${value}</div><div class="mn-micro" style="margin-top:var(--space-xs)">${sub}</div></div>`;
  }

  // demo/sections/icons.js
  var ICON_GROUPS = {
    navigation: ["dashboard", "home", "menu", "chevronRight", "chevronDown", "chevronLeft", "chevronUp", "arrowUp", "arrowDown", "arrowLeft", "arrowRight", "externalLink", "sidebar"],
    status: ["checkCircle", "alertTriangle", "alertCircle", "info", "atRisk", "completed", "blocked", "loader", "shield", "shieldCheck", "refresh", "settings"],
    actions: ["close", "edit", "copy", "trash", "download", "upload", "plus", "minus", "filter"],
    data: ["gauge", "trendUp", "trendDown", "barChart", "toggleOn", "toggleOff", "kpi", "impact", "pipeline", "orgChart", "treeView"],
    objects: ["user", "users", "userGroup", "briefcase", "admin", "key", "lock", "unlock", "bell", "bellDot"],
    domain: ["project", "workspace", "nowNext"]
  };
  var GROUP_META = [["navigation", "Navigation"], ["status", "Status"], ["actions", "Actions"], ["data", "Data"], ["objects", "Objects"], ["domain", "Domain"]];
  function createIconsSection() {
    const section = document.createElement("section");
    section.id = "icons";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">11 \u2014 Iconography</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Icon Catalog</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Maranello Luce icon language for agent operations interfaces.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>Maranello.renderIcon(el, 'dashboard', { size: 'lg' });
// categories: navigation, status, actions, data, objects, domain</code></pre>
      </details>
      ${GROUP_META.map(([key, label]) => `<div style="margin-bottom:var(--space-2xl)"><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">${label}</h3><div id="icon-group-${key}" class="mn-card-dark" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:var(--space-xs);padding:var(--space-md)"></div></div>`).join("")}
      <div style="margin-bottom:var(--space-2xl)"><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Size Variants</h3><div class="mn-card-dark" style="padding:var(--space-md)"><div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);align-items:flex-end">${["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => `<div style="text-align:center;min-width:58px"><span class="mn-icon mn-icon--${size}" id="icon-size-${size}"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">${size}</div></div>`).join("")}</div></div></div>
      <div><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Semantic Colors</h3><div class="mn-card-dark" style="padding:var(--space-md)"><div style="display:flex;flex-wrap:wrap;gap:var(--space-lg)"><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-success" style="color:var(--verde-racing)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">success</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-warning" style="color:var(--giallo-ferrari)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">warning</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-danger" style="color:var(--rosso-corsa)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">danger</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-info" style="color:#4EA8DE"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">info</div></div><div style="text-align:center;min-width:64px"><span class="mn-icon mn-icon--lg" id="icon-color-muted" style="color:var(--grigio-medio)"></span><div class="mn-micro" style="margin-top:4px;color:var(--grigio-medio)">muted</div></div></div></div></div>
    </div>
  `;
    requestAnimationFrame(() => initIcons(section));
    return section;
  }
  function iconGrid(groupName, iconNames, section) {
    const M3 = window.Maranello;
    if (!M3?.icons) return;
    const container = section.querySelector(`#icon-group-${groupName}`);
    if (!container) return;
    const catalog = typeof M3.iconCatalog === "function" ? new Set(M3.iconCatalog()) : null;
    iconNames.forEach((name) => {
      if (catalog && !catalog.has(name)) return;
      const fn = M3.icons[name];
      if (!fn) return;
      const cell = document.createElement("div");
      cell.style.cssText = "text-align:center;padding:var(--space-sm)";
      cell.innerHTML = `<span class="mn-icon mn-icon--md" style="color:var(--grigio-chiaro)">${fn()}</span><div class="mn-micro" style="color:var(--grigio-medio);margin-top:4px">${name}</div>`;
      container.appendChild(cell);
    });
  }
  function initIcons(section) {
    const M3 = window.Maranello;
    if (!M3?.icons) return;
    GROUP_META.forEach(([key]) => iconGrid(key, ICON_GROUPS[key], section));
    if (typeof M3.renderIcon === "function") {
      ["xs", "sm", "md", "lg", "xl", "2xl"].forEach((size) => {
        const el = section.querySelector(`#icon-size-${size}`);
        if (el) M3.renderIcon(el, "dashboard", { size, ariaLabel: `dashboard ${size}` });
      });
      ["icon-color-success", "icon-color-warning", "icon-color-danger", "icon-color-info", "icon-color-muted"].forEach((id) => {
        const el = section.querySelector(`#${id}`);
        if (el) M3.renderIcon(el, "dashboard", { size: "lg", ariaLabel: id.replace("icon-color-", "") });
      });
    }
  }

  // demo/sections/animations.js
  function createAnimationsSection() {
    const section = document.createElement("section");
    section.id = "animations";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">07 / MOVIMENTO \xB7 ANIMAZIONI</p>
      <div class="mn-watermark">MOVIMENTO</div>
      <h2 class="mn-title-section mn-mb-sm">Animations</h2>
      <p class="mn-body mn-mb-2xl">Subtle motion guides the eye. Every animation respects <code>prefers-reduced-motion</code>.</p>

      <div class="mn-demo-section-label mn-mt-2xl">Entrance Animations</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl" style="align-items:stretch" id="anim-entrance-row">
        <div class="mn-panel" data-anim="mn-anim-fadeIn" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeIn</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-fadeInUp" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeInUp</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-fadeInLeft" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeInLeft</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-scaleIn" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">scaleIn</span>
        </div>
      </div>
      <div class="mn-mb-lg">
        <button class="mn-btn mn-btn--ghost mn-btn--sm" id="anim-replay-entrance">\u21BA Replay Entrance</button>
      </div>

      <div class="mn-demo-section-label">Attention Animations</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        <div class="mn-panel mn-anim-pulse" style="padding:var(--space-md)">
          <span class="mn-micro mn-text-muted">pulse</span>
        </div>
        <span class="mn-status mn-status--danger">
          <span class="mn-status__dot mn-anim-pulseDot"></span>
          Live Alert
        </span>
        <span class="mn-led mn-led--red mn-anim-blink">
          <span class="mn-led__housing"><span class="mn-led__bulb"></span></span>
          <span class="mn-led__text">Blink</span>
        </span>
        <span class="mn-led mn-led--amber">
          <span class="mn-led__housing"><span class="mn-led__bulb"></span></span>
          <span class="mn-led__text">Processing</span>
        </span>
      </div>

      <div class="mn-demo-section-label">Skeleton Loading</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:flex-start">
        <div class="mn-flex-col mn-gap-sm" style="min-width:240px">
          <div class="mn-shimmer mn-shimmer--bar" style="width:80%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:60%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:90%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:50%"></div>
        </div>
        <div class="mn-flex-col mn-gap-sm" style="min-width:240px">
          <div class="mn-flex-center mn-gap-sm">
            <div class="mn-shimmer mn-shimmer--circle"></div>
            <div class="mn-flex-col mn-gap-xs" style="flex:1">
              <div class="mn-shimmer mn-shimmer--bar" style="width:70%"></div>
              <div class="mn-shimmer mn-shimmer--bar" style="width:50%"></div>
            </div>
          </div>
          <div class="mn-flex-center mn-gap-sm">
            <div class="mn-shimmer mn-shimmer--circle"></div>
            <div class="mn-flex-col mn-gap-xs" style="flex:1">
              <div class="mn-shimmer mn-shimmer--bar" style="width:85%"></div>
              <div class="mn-shimmer mn-shimmer--bar" style="width:40%"></div>
            </div>
          </div>
        </div>
        <div class="mn-panel" style="padding:var(--space-md);min-width:180px">
          <div class="mn-shimmer mn-shimmer--bar" style="width:60%;margin-bottom:var(--space-sm)"></div>
          <div class="mn-shimmer mn-shimmer--rect" style="height:80px;margin-bottom:var(--space-sm)"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:80%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:50%;margin-top:var(--space-xs)"></div>
        </div>
      </div>

      <div class="mn-demo-section-label">Hover Effects</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <div class="mn-panel mn-hover-lift" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">hover-lift</span>
        </div>
        <div class="mn-panel mn-hover-glow" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">hover-glow</span>
        </div>
        <div class="mn-panel" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">default panel</span>
        </div>
      </div>

      <div class="mn-demo-section-label">Composable Dashboard Grid</div>
      <!-- Dashboard header toolbar -->
      <div style="display:flex;align-items:center;gap:var(--space-md);padding:12px 16px;background:linear-gradient(180deg,rgba(255,199,44,0.06),transparent);border:1px solid var(--grigio-scuro,#333);border-radius:var(--radius-md) var(--radius-md) 0 0;margin-bottom:0">
        <div style="display:flex;gap:var(--space-sm);align-items:center">
          <button class="mn-btn-cluster__item mn-btn-cluster__item--active" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="Grid view" aria-label="Grid view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="5" height="5"/><rect x="9.5" y="1.5" width="5" height="5"/><rect x="1.5" y="9.5" width="5" height="5"/><rect x="9.5" y="9.5" width="5" height="5"/></svg>
          </button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="List view" aria-label="List view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="3"/><line x1="3" y1="8" x2="13" y2="8"/><line x1="3" y1="13" x2="13" y2="13"/></svg>
          </button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="Compact view" aria-label="Compact view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2" width="13" height="3"/><rect x="1.5" y="7" width="13" height="3"/><rect x="1.5" y="12" width="13" height="2.5"/></svg>
          </button>
          <button class="mn-btn mn-btn--ghost mn-btn--sm" style="padding:6px 10px">Filters</button>
        </div>
        <div style="flex:1;display:flex;justify-content:center">
          <div style="display:flex;align-items:center;gap:var(--space-sm);max-width:400px;width:100%;background:var(--superficie-1);border:1px solid var(--grigio-scuro);border-radius:var(--radius-md);padding:var(--space-xs) var(--space-md)">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--grigio-medio)" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><line x1="10.4" y1="10.4" x2="14" y2="14"/></svg>
            <input type="text" placeholder="Filter by name, program..." style="flex:1;background:none;border:none;color:var(--grigio-chiaro);font-family:var(--font-body);outline:none">
          </div>
        </div>
        <div style="display:flex;gap:var(--space-sm);align-items:center">
          <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-size:0.65rem;color:var(--grigio-medio)">\u2318K</kbd>
          <button class="mn-machined-btn" style="padding:4px 8px;display:flex;align-items:center;justify-content:center" title="Sort" aria-label="Sort">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 3h8"/><path d="M6 8h6"/><path d="M8 13h4"/><path d="M4 3v10"/></svg>
          </button>
          <button class="mn-machined-btn" style="padding:4px 8px;display:flex;align-items:center;justify-content:center" title="Settings" aria-label="Settings">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.1 3.1l1 1M11.9 11.9l1 1M12.9 3.1l-1 1M4.1 11.9l-1 1"/></svg>
          </button>
        </div>
      </div>
      <div class="mn-dashboard mn-mb-2xl" style="border:1px solid var(--grigio-scuro,#333);border-top:0;border-radius:0 0 var(--radius-md) var(--radius-md);padding-top:var(--space-md)">
        <div class="mn-cell-3">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--bar mn-mb-sm" style="width:60%;margin:0 auto var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">3 col \xB7 KPI</span>
          </div>
        </div>
        <div class="mn-cell-6">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--rect" style="height:60px;margin-bottom:var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">6 col \xB7 Chart</span>
          </div>
        </div>
        <div class="mn-cell-3">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--circle" style="margin:0 auto var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">3 col \xB7 Gauge</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-8">
          <div class="mn-panel" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">8 col \xB7 Wide panel</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
      </div>
    </div>
  `;
    requestAnimationFrame(() => initAnimations(section));
    return section;
  }
  function initAnimations(section) {
    const replayBtn = section.querySelector("#anim-replay-entrance");
    const entranceRow = section.querySelector("#anim-entrance-row");
    if (!replayBtn || !entranceRow) return;
    function playEntrance() {
      const panels = entranceRow.querySelectorAll(".mn-panel[data-anim]");
      panels.forEach((panel, i) => {
        const cls = panel.dataset.anim;
        panel.classList.remove(cls);
        panel.style.opacity = "0";
        void panel.offsetWidth;
        setTimeout(() => {
          panel.style.opacity = "";
          panel.classList.add(cls);
        }, i * 120);
      });
    }
    setTimeout(playEntrance, 200);
    replayBtn.addEventListener("click", playEntrance);
    if (window.Maranello?.initScrollReveal) {
      window.Maranello.initScrollReveal();
    }
  }

  // demo/sections/heatmap.js
  var MONTHS2 = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  var AGENTS = [
    { name: "Claude Opus", role: "Strategic planner", load: [0.8, 1, 1.2, 1, 0.6, 0.4] },
    { name: "Claude Sonnet", role: "Execution engine", load: [0.5, 0.7, 0.8, 0.9, 1, 1.1] },
    { name: "Gemini Research", role: "Research agent", load: [0.3, 0.4, 0.6, 0.8, 0.9, 0.7] },
    { name: "GPT Router", role: "Routing agent", load: [1, 0.9, 0.8, 0.7, 0.5, 0] },
    { name: "Agent Haiku", role: "Monitor", load: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    { name: "Vector Cache", role: "Platform service", load: [0.6, 0.6, 0.7, 0.7, 0.8, 0.8] },
    { name: "Eval Judge", role: "Validator", load: [0.9, 1, 1.1, 1.2, 0.8, 0.5] },
    { name: "Budget Guard", role: "Control agent", load: [0.4, 0.3, 0.5, 0.4, 0.6, 0.7] }
  ];
  var IMPACT = {
    summary: [{ text: "2 IDLE", border: "var(--mn-accent)" }, { text: "1 SATURATED", border: "var(--rosso-corsa)" }, { text: "3 QUEUES", border: "var(--mn-accent)" }],
    talents: [
      { name: "Agent Opus", role: "Planner \xB7 P3", allocation: 0.7, delta: 0.4 },
      { name: "Agent Sonnet", role: "Executor \xB7 E2", allocation: 0.88, delta: 0.18 },
      { name: "Agent Haiku", role: "Monitor \xB7 M4", allocation: 1.12, delta: 0.26 },
      { name: "GPT Router", role: "Router \xB7 R1", allocation: 0.82, delta: 0.32 },
      { name: "Gemini Lab", role: "Research \xB7 G2", allocation: 1.06, delta: 0.16 }
    ],
    alert: "Agent Haiku \xB7 0.50 GPU hr needed \u2014 consider adding a failover lane"
  };
  function createHeatmapSection() {
    const section = document.createElement("section");
    section.id = "heatmap";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <style>
      #heatmap .mn-impact-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-md);margin-bottom:var(--space-lg)}
      #heatmap .mn-impact-summary__card{padding:var(--space-lg);border:1px solid var(--grigio-scuro);border-radius:18px;background:rgba(255,255,255,.02);font:700 var(--text-caption)/1.1 var(--font-display);letter-spacing:.08em;text-transform:uppercase}
      #heatmap .mn-impact-list{display:grid;gap:var(--space-sm)}
      #heatmap .mn-impact-row{display:grid;grid-template-columns:minmax(180px,1.4fr) minmax(160px,1fr) auto;gap:var(--space-md);align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)}
      #heatmap .mn-impact-track{height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}#heatmap .mn-impact-track span{display:block;height:100%;border-radius:999px}
      #heatmap .mn-impact-alert{margin-top:var(--space-lg);padding:var(--space-md) var(--space-lg);border-left:3px solid var(--mn-accent);border-radius:16px;background:rgba(255,199,44,.08)}
    </style>
    <div class="mn-container"><p class="mn-section-number">12 \u2014 Resource Heatmap</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Resource Heatmaps</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Agent utilization grid and compute impact simulation built with Maranello Luce operations data.</p><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Agent Utilization Grid</h3><div style="margin-bottom:var(--space-2xl);position:relative;overflow-x:auto">${buildCapacityGrid()}</div><div class="mn-divider-gold" style="margin-bottom:var(--space-2xl)"></div><h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Impact Heatmap with Compute Load</h3>${buildImpactSimulation()}</div>`;
    requestAnimationFrame(() => initHeatmap(section));
    return section;
  }
  function buildCapacityGrid() {
    const head = MONTHS2.map((month) => `<div class="mn-cap-grid__month">${month} 2026</div>`).join("");
    const rows = AGENTS.map((agent) => `<div class="mn-cap-grid__label"><span class="mn-cap-grid__label-role">${agent.name}</span><span class="mn-micro" style="color:var(--grigio-medio)">${agent.role}</span></div>${agent.load.map((value, index) => `<div class="mn-cap-grid__cell mn-cap-grid__cell--${loadLevel(value)}" data-mn-tip="${agent.name} \u2014 ${MONTHS2[index]} \xB7 ${value.toFixed(1)} GPU hr">${value > 0 ? value.toFixed(1) : ""}</div>`).join("")}`).join("");
    return `<div class="mn-cap-heatmap"><div class="mn-cap-heatmap__header"><div class="mn-cap-heatmap__title">Agent Utilization Grid \u2014 Apr\u2013Sep 2026</div><div class="mn-cap-heatmap__legend"><span class="mn-micro" style="color:var(--grigio-chiaro)">GPU hrs:</span><span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--empty"></span> 0 <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--low"></span> &lt;0.5 <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--mid"></span> 0.5\u20130.8 <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--high"></span> 0.8\u20131.0 <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--over"></span> &gt;1.0</div></div><div class="mn-cap-grid" style="grid-template-columns:180px repeat(${MONTHS2.length},1fr)"><div class="mn-cap-grid__corner">Agent</div>${head}${rows}</div><div class="mn-cap-tooltip" id="mn-cap-tip"></div></div>`;
  }
  function buildImpactSimulation() {
    const cards = IMPACT.summary.map((card2) => `<div class="mn-impact-summary__card" style="border-color:${card2.border};color:${card2.border === "var(--rosso-corsa)" ? "var(--bianco-caldo)" : "var(--mn-accent)"}">${card2.text}</div>`).join("");
    const rows = IMPACT.talents.map((talent) => {
      const tone = talent.allocation > 1 ? "var(--rosso-corsa)" : "var(--verde-racing)";
      const delta = `${talent.delta >= 0 ? "+" : ""}${talent.delta.toFixed(2)}`;
      return `<div class="mn-impact-row"><div><strong>${talent.name}</strong><div class="mn-micro" style="color:var(--grigio-medio)">${talent.role}</div></div><div class="mn-impact-track"><span style="width:${Math.min(talent.allocation / 1.2 * 100, 100)}%;background:${tone}"></span></div><div style="font-variant-numeric:tabular-nums;text-align:right">${talent.allocation.toFixed(2)} <span style="color:${tone}">${delta}</span></div></div>`;
    }).join("");
    return `<div class="mn-card-dark" style="padding:var(--space-xl)"><div class="mn-impact-summary">${cards}</div><div class="mn-impact-list">${rows}</div><div class="mn-impact-alert"><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Capacity gaps alert</div><div class="mn-body" style="margin:0">${IMPACT.alert}</div></div></div>`;
  }
  function loadLevel(value) {
    return value === 0 ? "empty" : value < 0.5 ? "low" : value <= 0.8 ? "mid" : value <= 1 ? "high" : "over";
  }
  function initHeatmap(section) {
    const tip = section.querySelector("#mn-cap-tip");
    if (!tip) return;
    let selectedCell = null;
    section.querySelectorAll("[data-mn-tip]").forEach((cell) => {
      cell.style.cursor = "pointer";
      cell.style.transition = "outline .15s, transform .1s";
      cell.addEventListener("mouseenter", (event) => {
        tip.textContent = event.currentTarget.dataset.mnTip;
        tip.classList.add("mn-cap-tooltip--visible");
        const rect = event.currentTarget.getBoundingClientRect();
        const host = section.getBoundingClientRect();
        tip.style.left = `${rect.left - host.left + rect.width / 2}px`;
        tip.style.top = `${rect.top - host.top - 32}px`;
      });
      cell.addEventListener("mouseleave", () => tip.classList.remove("mn-cap-tooltip--visible"));
      cell.addEventListener("click", () => {
        if (selectedCell) Object.assign(selectedCell.style, { outline: "", outlineOffset: "", transform: "", zIndex: "" });
        selectedCell = cell;
        Object.assign(cell.style, { outline: "2px solid var(--mn-accent, #FFC72C)", outlineOffset: "-2px", transform: "scale(1.03)", zIndex: "1" });
      });
    });
  }

  // demo/sections/treemap.js
  var TOTAL_BUDGET = 84e4;
  var ALLOCATION = [
    { key: "training", label: "Training", value: 40, color: "linear-gradient(135deg, #FFC72C, #D4622B)", detail: "Model adaptation, eval packs, and synthetic datasets" },
    { key: "inference", label: "Inference", value: 30, color: "linear-gradient(135deg, #4EA8DE, #1D6FA5)", detail: "Production runs, routing, and streaming workloads" },
    { key: "embeddings", label: "Embeddings", value: 15, color: "linear-gradient(135deg, #00A651, #007A3D)", detail: "Vector refresh, retrieval, and cache warming" },
    { key: "fine-tuning", label: "Fine-tuning", value: 10, color: "linear-gradient(135deg, #6B7280, #3F3F46)", detail: "Specialized adapters and reward tuning" },
    { key: "storage", label: "Storage", value: 5, color: "linear-gradient(135deg, #DC0000, #8B0000)", detail: "Artifact retention and long-run trace storage" }
  ];
  function dollarAmount(percent) {
    const amount = TOTAL_BUDGET * (percent / 100) / 1e3;
    return `$${amount.toFixed(Number.isInteger(amount) ? 0 : 1)}k`;
  }
  function tile(item, extraStyle = "") {
    return `<div class="mn-treemap__cell" role="button" tabindex="0" data-label="${item.label}" data-value="${item.value}" data-amount="${dollarAmount(item.value)}" data-detail="${item.detail}" style="background:${item.color};display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;white-space:normal;min-height:100%;${extraStyle}"><span>${item.label}</span><span class="mn-treemap__cell-value">${item.value}%</span><span class="mn-micro" style="color:rgba(255,255,255,0.85)">${dollarAmount(item.value)}</span></div>`;
  }
  function legend(item) {
    return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:8px;color:var(--grigio-chiaro)"><span style="width:10px;height:10px;border-radius:999px;background:${item.color}"></span>${item.label}</span>`;
  }
  function showTooltip(tip, host, event, cell) {
    if (!(tip instanceof HTMLElement) || !(host instanceof HTMLElement) || !(cell instanceof HTMLElement)) return;
    const rect = host.getBoundingClientRect();
    tip.innerHTML = `<div class="mn-chart-tooltip__label">Maranello Luce allocation</div><div class="mn-chart-tooltip__value">${cell.dataset.label} \u2014 ${cell.dataset.value}% \xB7 ${cell.dataset.amount}</div>`;
    tip.style.left = `${event.clientX - rect.left + 14}px`;
    tip.style.top = `${event.clientY - rect.top + 14}px`;
    tip.classList.add("mn-chart-tooltip--visible");
    tip.setAttribute("aria-hidden", "false");
  }
  function hideTooltip(tip) {
    if (!(tip instanceof HTMLElement)) return;
    tip.classList.remove("mn-chart-tooltip--visible");
    tip.setAttribute("aria-hidden", "true");
  }
  function selectCell(cells, nextCell) {
    cells.forEach((cell) => {
      cell.style.outline = "";
      cell.style.outlineOffset = "";
      cell.style.boxShadow = "";
      cell.style.transform = "";
      cell.setAttribute("aria-pressed", "false");
    });
    if (!nextCell) return;
    nextCell.style.outline = "2px solid rgba(255,255,255,0.9)";
    nextCell.style.outlineOffset = "-2px";
    nextCell.style.boxShadow = "inset 0 0 0 1px rgba(255,199,44,0.65), 0 10px 24px rgba(0,0,0,0.25)";
    nextCell.style.transform = "scale(1.015)";
    nextCell.setAttribute("aria-pressed", "true");
  }
  function createTreemapSection() {
    const [training, inference, embeddings, fineTuning, storage] = ALLOCATION;
    const section = document.createElement("section");
    section.id = "treemap";
    section.className = "mn-section-dark";
    section.innerHTML = `<div class="mn-container"><p class="mn-section-number">12B \u2014 Budget Treemap</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Maranello Luce Compute Allocation</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">A manual treemap for the 2026 illustrative compute allocation, sized by workload weight and tuned for fast visual scanning.</p><div class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap;align-items:flex-start;margin-bottom:var(--space-lg)"><div><h3 class="mn-title-sub" style="margin-bottom:var(--space-xs)">Total modeled compute spend: $840k</h3><p class="mn-micro" style="color:var(--grigio-medio)">Hover for allocation details. Click a tile to lock the focus area.</p></div><div style="display:flex;flex-wrap:wrap;gap:var(--space-md)">${ALLOCATION.map(legend).join("")}</div></div><div id="treemap-host" style="position:relative"><div class="mn-treemap" style="grid-template-columns:40fr 60fr;min-height:360px;background:rgba(255,255,255,0.04);padding:2px">${tile(training)}<div style="display:grid;grid-template-rows:30fr 30fr;gap:2px">${tile(inference)}<div style="display:grid;grid-template-columns:15fr 10fr 5fr;gap:2px">${tile(embeddings)}${tile(fineTuning)}${tile(storage)}</div></div></div><div id="treemap-tooltip" class="mn-chart-tooltip" aria-hidden="true"></div></div></div></div>`;
    requestAnimationFrame(() => initTreemap(section));
    return section;
  }
  function initTreemap(section) {
    const host = section.querySelector("#treemap-host");
    const tip = section.querySelector("#treemap-tooltip");
    const cells = Array.from(section.querySelectorAll(".mn-treemap__cell"));
    if (!(host instanceof HTMLElement) || !(tip instanceof HTMLElement) || !cells.length) return;
    let selected = null;
    cells.forEach((cell) => {
      const activate2 = () => {
        selected = cell;
        selectCell(cells, cell);
      };
      cell.addEventListener("mouseenter", (event) => showTooltip(tip, host, event, cell));
      cell.addEventListener("mousemove", (event) => showTooltip(tip, host, event, cell));
      cell.addEventListener("mouseleave", () => hideTooltip(tip));
      cell.addEventListener("focus", () => {
        const rect = cell.getBoundingClientRect();
        showTooltip(tip, host, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }, cell);
      });
      cell.addEventListener("blur", () => hideTooltip(tip));
      cell.addEventListener("click", activate2);
      cell.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activate2();
      });
    });
    selected = cells[0];
    selectCell(cells, selected);
  }

  // demo/sections/layouts.js
  function createLayoutsSection() {
    const section = document.createElement("section");
    section.id = "layouts";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container"><p class="mn-section-number">15 \u2014 Navigation & Layouts</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Navigation &amp; Layouts</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Sidebar navigation, notification center, horizontal bar chart ranking, and deployment funnel pipeline.</p><details class="mn-code-snippet"><summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary><pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;aside class="mn-sidebar"&gt;&lt;nav class="mn-sidebar__nav"&gt;&lt;a class="mn-sidebar__item"&gt;Dashboard&lt;/a&gt;&lt;/nav&gt;&lt;/aside&gt;
&lt;div class="mn-drawer mn-drawer--open"&gt;
  &lt;div class="mn-drawer__backdrop mn-drawer__backdrop--visible"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre></details><div class="mn-grid-2" style="margin-bottom:var(--space-2xl);align-items:start"><div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Sidebar Navigation</p><div class="mn-sidebar" style="position:relative;height:340px;border-radius:8px"><div class="mn-sidebar__header"><span class="mn-sidebar__brand">Maranello<span style="color:var(--giallo-ferrari)">Luce</span></span></div><nav class="mn-sidebar__nav"><div class="mn-sidebar__group"><div class="mn-sidebar__group-label">Operations</div><a class="mn-sidebar__item mn-sidebar__item--active"><span class="mn-sidebar__item-label">Dashboard</span></a><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Telemetry</span></a><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Pipelines</span></a></div><div class="mn-sidebar__group"><div class="mn-sidebar__group-label">Runtime</div><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Agents</span></a><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Quality</span></a><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Budgets</span></a></div><div class="mn-sidebar__group"><div class="mn-sidebar__group-label">System</div><a class="mn-sidebar__item"><span class="mn-sidebar__item-label">Admin</span></a></div></nav><div class="mn-sidebar__footer"><span class="mn-micro" style="color:var(--grigio-medio)">v9.3.0</span></div></div></div><div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Notification Center</p><div class="mn-card-dark" style="padding:0;overflow:hidden;border-radius:8px"><div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--grigio-scuro);display:flex;justify-content:space-between"><span class="mn-label">Notifications</span><span class="mn-micro" style="color:var(--mn-accent)">3 unread</span></div>${notifItem("Budget alert: us-east-1 reached 72% of monthly token plan", "2 min ago", true, "#DC0000")}${notifItem("Canary report generated for Pipeline Gamma", "15 min ago", true, "#FFC72C")}${notifItem("Sync completed \u2014 47 pipeline states refreshed", "1 hour ago", false, "#00A651")}</div></div></div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Pipeline Ranking</p><div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)" id="layouts-hbar">${hbarRows()}</div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Deployment Pipeline</p><div class="mn-card-dark" style="padding:var(--space-xl)" id="layouts-funnel">${funnelRows()}</div><p class="mn-label" style="color:var(--mn-accent);margin-top:var(--space-2xl);margin-bottom:var(--space-md)">Organization Tree</p><div class="mn-card-dark" style="padding:var(--space-xl)" id="layouts-org-tree"></div></div>`;
    section.addEventListener("mn-ready", () => tryRenderCharts(section));
    setTimeout(() => tryRenderCharts(section), 200);
    setTimeout(() => {
      section.querySelectorAll(".mn-notif-close").forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          btn.style.color = "var(--mn-accent)";
          btn.style.background = "rgba(255,199,44,0.1)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.color = "";
          btn.style.background = "";
        });
        btn.addEventListener("click", () => {
          const item = btn.closest(".mn-notif-item");
          if (item) {
            item.style.opacity = "0";
            item.style.maxHeight = "0";
            item.style.padding = "0";
            setTimeout(() => item.remove(), 300);
          }
        });
      });
    }, 100);
    return section;
  }
  function notifItem(title, time, unread, accentColor) {
    const bg = unread ? "background:rgba(255,199,44,0.04)" : "";
    return `<div class="mn-notif-item" style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--grigio-scuro);display:flex;gap:var(--space-md);align-items:flex-start;${bg};transition:opacity 0.3s,max-height 0.3s;overflow:hidden"><div style="width:8px;height:8px;border-radius:50%;background:${accentColor};margin-top:5px;flex-shrink:0"></div><div style="flex:1"><div class="mn-body" style="font-size:0.85rem">${title}</div><div class="mn-micro" style="color:var(--grigio-medio);margin-top:2px">${time}</div></div><button class="mn-notif-close" style="background:none;border:none;color:var(--grigio-medio);cursor:pointer;padding:4px;border-radius:4px;transition:color 0.15s,background 0.15s;display:flex;align-items:center" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`;
  }
  var TEAMS = [{ name: "Pipeline Alpha", pct: 94, color: "#00A651" }, { name: "Pipeline Beta", pct: 87, color: "#00A651" }, { name: "Pipeline Gamma", pct: 81, color: "#4EA8DE" }, { name: "Pipeline Delta", pct: 74, color: "#FFC72C" }, { name: "Pipeline Epsilon", pct: 68, color: "#FFC72C" }, { name: "Pipeline Zeta", pct: 52, color: "#DC0000" }, { name: "Pipeline Eta", pct: 41, color: "#DC0000" }];
  function hbarRows() {
    const rows = TEAMS.map((t) => `<div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm)"><span class="mn-micro" style="width:110px;color:var(--grigio-chiaro);flex-shrink:0">${t.name}</span><div style="flex:1;height:14px;background:var(--grigio-scuro);border-radius:4px;overflow:hidden;position:relative"><span style="position:absolute;left:25%;top:0;bottom:0;border-left:1px dashed rgba(230,230,230,0.35);z-index:1"></span><span style="position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed rgba(230,230,230,0.35);z-index:1"></span><span style="position:absolute;left:75%;top:0;bottom:0;border-left:1px dashed rgba(230,230,230,0.35);z-index:1"></span><div style="height:100%;width:${t.pct}%;background:${t.color};border-radius:4px;transition:width 0.6s ease;position:relative;z-index:2"></div></div><span class="mn-micro" style="width:36px;text-align:right;color:${t.color}">${t.pct}%</span></div>`).join("");
    return `${rows}<div style="display:flex;justify-content:space-between;margin-top:var(--space-sm);margin-left:110px;padding-left:var(--space-md)"><span class="mn-micro" style="color:var(--grigio-chiaro)">0%</span><span class="mn-micro" style="color:var(--grigio-chiaro)">25%</span><span class="mn-micro" style="color:var(--grigio-chiaro)">50%</span><span class="mn-micro" style="color:var(--grigio-chiaro)">75%</span><span class="mn-micro" style="color:var(--grigio-chiaro)">100%</span></div>`;
  }
  var FUNNEL_STAGES = [{ label: "Draft", count: 47, color: "#4EA8DE", pct: 100, holdCount: 3, withdrawnCount: 2 }, { label: "Validated", count: 32, color: "#FFC72C", pct: 68, holdCount: 2, withdrawnCount: 1 }, { label: "Running", count: 21, color: "#00A651", pct: 45, holdCount: 1, withdrawnCount: 0 }, { label: "Evaluating", count: 12, color: "#D4622B", pct: 26, holdCount: 0, withdrawnCount: 1 }, { label: "Shipped", count: 6, color: "#8B5CF6", pct: 13, holdCount: 0, withdrawnCount: 0 }];
  function funnelRows() {
    const stageLayout = { Draft: { width: 100, height: 60 }, Validated: { width: 80, height: 50 }, Running: { width: 60, height: 42 }, Evaluating: { width: 45, height: 34 }, Shipped: { width: 30, height: 28 } };
    return FUNNEL_STAGES.map((s) => {
      const layout = stageLayout[s.label] || { width: 30, height: 28 };
      return `<div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)"><span class="mn-micro" style="width:90px;flex-shrink:0;color:var(--grigio-chiaro)">${s.label}</span><div style="flex:1;display:flex;justify-content:center"><div style="height:${layout.height}px;width:${layout.width}%;background:${s.color};opacity:0.85;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all 0.6s ease"><span class="mn-micro" style="color:#fff;font-weight:600">${s.count}</span></div></div><span class="mn-micro" style="width:28px;text-align:right;color:var(--grigio-medio)">${s.pct}%</span></div>`;
    }).join("");
  }
  function tryRenderCharts(section) {
    const M3 = window.Maranello;
    if (!M3) return;
    const hbarEl = section.querySelector("#layouts-hbar");
    if (M3.hBarChart && hbarEl && !hbarEl.dataset.rendered) {
      hbarEl.dataset.rendered = "1";
      try {
        hbarEl.innerHTML = "";
        M3.hBarChart(hbarEl, { bars: TEAMS.map((t) => ({ label: t.name, value: t.pct, color: t.color })), title: "Pipeline Ranking", unit: "%", showGrid: true, showValues: true });
      } catch (_) {
      }
    }
    const funnelEl = section.querySelector("#layouts-funnel");
    if (M3.funnel && funnelEl && !funnelEl.dataset.rendered) {
      funnelEl.dataset.rendered = "1";
      try {
        funnelEl.innerHTML = "";
        M3.funnel(funnelEl, { animate: true, showLabels: true, showCounts: true, onClick: (stage) => {
          if (M3.toast) M3.toast({ type: "info", title: stage.label, message: `${stage.count} deployments in ${stage.label}` });
        }, data: { pipeline: FUNNEL_STAGES.map((s) => ({ label: s.label, count: s.count, color: s.color, holdCount: s.holdCount, withdrawnCount: s.withdrawnCount })), onHold: { label: "On Hold", count: 6, color: "#D4622B" }, withdrawn: { label: "Withdrawn", count: 4, color: "#DC0000" }, total: 47 } });
      } catch (_) {
      }
    }
    const treeEl = section.querySelector("#layouts-org-tree");
    if (treeEl && !treeEl.dataset.rendered) {
      treeEl.dataset.rendered = "1";
      treeEl.innerHTML = '<div class="mn-org-tree"><ul class="mn-org-tree__list">' + buildOrgTree({ name: "Maranello Luce Platform", role: "Control Plane", children: [{ name: "Agent Opus", role: "Strategic Lead", children: [{ name: "Pipeline Alpha", role: "Orchestrator" }, { name: "Pipeline Beta", role: "Orchestrator" }, { name: "Pipeline Gamma", role: "Orchestrator" }] }, { name: "Agent Sonnet", role: "Execution Lead", children: [{ name: "Inference Queue", role: "Runtime" }, { name: "Eval Service", role: "Validator" }] }, { name: "Agent Haiku", role: "Monitoring Lead", children: [{ name: "Budget Sentinel", role: "Monitor" }, { name: "Cache Relay", role: "Platform" }] }] }) + "</ul></div>";
      if (M3.initOrgTree) M3.initOrgTree(treeEl);
    }
  }
  function buildOrgTree(node) {
    const hasKids = node.children && node.children.length;
    const toggleIcon = hasKids ? "\u25B8" : "";
    const toggleCls = hasKids ? "mn-org-tree__toggle mn-org-tree__toggle--expanded" : "mn-org-tree__toggle mn-org-tree__toggle--leaf";
    let html = `<li class="mn-org-tree__item"><div class="mn-org-tree__node"><span class="${toggleCls}">${toggleIcon}</span><span class="mn-org-tree__label">${node.name}</span><span class="mn-org-tree__meta">${node.role}</span></div>`;
    if (hasKids) {
      html += '<div class="mn-org-tree__children"><ul class="mn-org-tree__list">';
      node.children.forEach((c) => {
        html += buildOrgTree(c);
      });
      html += "</ul></div>";
    }
    html += "</li>";
    return html;
  }

  // demo/sections/detail-panel.js
  var M2 = () => window.Maranello || {};
  var STATUS_COLORS = { Active: "var(--mn-verde)", Paused: "var(--mn-giallo)", Completed: "var(--mn-accent)" };
  var DEPLOYMENTS = [
    { id: "pipe-east", name: "Pipeline Alpha", status: "Active", region: "us-east-1", lead: "Agent Opus", start: "2026-01-15", runs: 47e3, completion: "78%" },
    { id: "pipe-west", name: "Pipeline Beta", status: "Paused", region: "eu-west-1", lead: "Agent Sonnet", start: "2026-02-01", runs: 32e3, completion: "42%" },
    { id: "pipe-apac", name: "Pipeline Gamma", status: "Active", region: "ap-southeast-1", lead: "Agent Haiku", start: "2026-03-10", runs: 28e3, completion: "65%" }
  ];
  var ACTIVITIES = [
    { id: "ACT-001", activity: "Prompt intake", type: "Routing", progress: "100%", owner: "Agent Opus" },
    { id: "ACT-002", activity: "Model selection", type: "Routing", progress: "78%", owner: "GPT Router" },
    { id: "ACT-003", activity: "Inference window", type: "Runtime", progress: "45%", owner: "Agent Sonnet" },
    { id: "ACT-004", activity: "Eval replay pack", type: "Validation", progress: "60%", owner: "Eval Judge" },
    { id: "ACT-005", activity: "Release review", type: "Approval", progress: "0%", owner: "Agent Haiku" }
  ];
  function createDetailPanelSection() {
    const section = document.createElement("section");
    section.id = "detail-panel";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">16 \u2014 Detail &amp; Drill-Down</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Detail Panel System</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Interactive slide-over panels with drill-down navigation, inline field editors, and JS-driven deployment tables.</p>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Interactive Detail Panel</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Click a deployment card to drill down into its detail panel.</p>
      <div id="dp-card-grid" class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${DEPLOYMENTS.map(deploymentCard).join("")}</div>
      <div id="dp-panel-host"></div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Inline Editors</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Field-level editors rendered via <code>Maranello.editors</code> factories.</p>
      <div id="dp-editors-host" class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"></div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Data Table (JS-driven)</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Sortable pipeline activities with row-click interaction.</p>
      <div id="dp-table-host" style="margin-bottom:var(--space-2xl)"></div>
    </div>
  `;
    requestAnimationFrame(() => initDetailPanel(section));
    return section;
  }
  function deploymentCard(p) {
    const dot = STATUS_COLORS[p.status] || "var(--mn-grigio-2)";
    return `<div class="mn-card-dark mn-hover-lift" style="padding:var(--space-xl);cursor:pointer" data-drilldown="${p.id}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)"><h4 class="mn-label" style="color:var(--mn-accent)">${p.name}</h4><span class="mn-badge" style="background:${dot};color:var(--mn-nero);font-size:0.7rem;padding:2px 8px;border-radius:4px">${p.status}</span></div><p class="mn-micro" style="margin-bottom:var(--space-sm)">${p.region} \xB7 ${p.runs.toLocaleString("en-US")} runs</p><p class="mn-micro" style="color:var(--mn-grigio-2)">Lead: ${p.lead}</p></div>`;
  }
  function initDetailPanel(section) {
    initDrillDown(section);
    initEditors(section);
    initDataTable(section);
  }
  function initDrillDown(section) {
    const host = section.querySelector("#dp-panel-host");
    const api = M2();
    if (!host || typeof api.onDrillDown !== "function" || typeof api.createDetailPanel !== "function") return;
    let activePanel = null;
    api.onDrillDown("#dp-card-grid [data-drilldown]", (_el, ctx) => {
      const dep = DEPLOYMENTS.find((item) => item.id === ctx.drilldown);
      if (!dep) return;
      if (activePanel) activePanel.destroy();
      host.innerHTML = "";
      activePanel = api.createDetailPanel(host, { title: dep.name, tabs: ["Overview", "Runtime", "Quality"], schema: buildSchema(), data: buildData(dep), editable: true, onClose() {
        activePanel.close();
      }, onSave(changes) {
        console.log("[detail-panel] saved:", changes);
        activePanel.showToast("Changes saved", "success");
      } });
      activePanel.open();
    });
  }
  function buildSchema() {
    return [
      { tab: "Overview", section: "Pipeline Info", fields: [{ key: "name", label: "Pipeline Name", type: "text" }, { key: "status", label: "Status", type: "status", options: ["Active", "Paused", "Completed"], statusColors: STATUS_COLORS }, { key: "region", label: "Region", type: "text" }, { key: "start", label: "Start Date", type: "date" }, { key: "lead", label: "Pipeline Lead", type: "text" }, { key: "runs", label: "Total Runs", type: "number" }] },
      { tab: "Overview", section: "Progress", fields: [{ key: "completion", label: "Completion Rate", type: "text", editable: false }] },
      { tab: "Runtime", section: "Deployment Runtime", fields: [{ key: "model", label: "Primary Model", type: "text" }, { key: "rpm", label: "Runs per Minute", type: "number" }, { key: "latency", label: "Avg Latency", type: "text" }, { key: "totalCompleted", label: "Completed Tasks", type: "number", editable: false }] },
      { tab: "Quality", section: "Outcome Metrics", fields: [{ key: "accuracy", label: "Accuracy Score", type: "text", editable: false }, { key: "satisfaction", label: "User Satisfaction", type: "text", editable: false }, { key: "score", label: "Readiness Score", type: "score", min: 0, max: 10, step: 0.1 }] }
    ];
  }
  function buildData(dep) {
    return { name: dep.name, status: dep.status, region: dep.region, start: dep.start, lead: dep.lead, runs: dep.runs, completion: dep.completion, model: "Claude Sonnet", rpm: 320, latency: "172 ms", totalCompleted: 14560, accuracy: "96%", satisfaction: "94%", score: 9.6 };
  }
  function initEditors(section) {
    const host = section.querySelector("#dp-editors-host");
    if (!host) return;
    const eds = M2().editors;
    if (!eds) return;
    const fields = [{ key: "name", label: "Pipeline Name", type: "text", val: "Pipeline Alpha" }, { key: "status", label: "Status", type: "select", val: "Active", options: ["Active", "Paused", "Completed"] }, { key: "start", label: "Start Date", type: "date", val: "2026-01-15" }, { key: "lead", label: "Lead", type: "text", val: "Agent Opus" }];
    const log = document.createElement("p");
    log.className = "mn-micro";
    log.style.cssText = "color:var(--mn-giallo);margin-top:var(--space-md);min-height:1.5em";
    fields.forEach((f) => {
      const row = document.createElement("div");
      row.className = "mn-detail-panel__field";
      row.style.marginBottom = "var(--space-md)";
      const label = document.createElement("span");
      label.className = "mn-detail-panel__field-label";
      label.textContent = f.label;
      if (f.type === "select") {
        const dd = document.createElement("div");
        dd.className = "mn-dropdown";
        dd.innerHTML = `<button class="mn-dropdown__trigger" style="width:100%;text-align:left;padding:8px 12px;background:var(--nero-carbon,#111);border:1.5px solid var(--grigio-scuro,#333);border-radius:4px;color:var(--grigio-alluminio,#ccc);font-size:0.85rem;cursor:pointer">${f.val} \u25BE</button><div class="mn-dropdown__menu" style="min-width:100%">${f.options.map((o) => `<button class="mn-dropdown__item${o === f.val ? " mn-dropdown__item--active" : ""}">${o}</button>`).join("")}</div>`;
        row.append(label, dd);
        host.appendChild(row);
        const M22 = window.Maranello;
        if (M22?.initDropdown) requestAnimationFrame(() => M22.initDropdown(dd));
        dd.addEventListener("click", (e) => {
          const item = e.target.closest(".mn-dropdown__item");
          if (item) log.textContent = `\u270E ${f.label}: "${item.textContent}"`;
        });
      } else {
        const editorFn = eds[f.type] || eds.text;
        const input = editorFn(f.val, f, (val) => {
          log.textContent = `\u270E ${f.label}: "${val}"`;
        });
        row.append(label, input);
        host.appendChild(row);
      }
    });
    host.appendChild(log);
  }
  function initDataTable(section) {
    const host = section.querySelector("#dp-table-host");
    const api = M2();
    if (!host || typeof api.dataTable !== "function") return;
    api.dataTable(host, { columns: [{ key: "id", label: "ID", width: "80px", sortable: true }, { key: "activity", label: "Activity", sortable: true }, { key: "type", label: "Type", width: "140px", sortable: true }, { key: "progress", label: "Progress", width: "100px", sortable: true }, { key: "owner", label: "Owner", width: "120px", sortable: true }], data: ACTIVITIES, onRowClick(row) {
      console.log("[data-table] row clicked:", row);
    } });
  }

  // demo/sections/interactive.js
  function createInteractiveSection() {
    const section = document.createElement("section");
    section.id = "interactive";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container"><p class="mn-section-number">14 \u2014 Interactive Widgets</p><h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Interactive Widgets</h2><p class="mn-body mn-mb-2xl">Full-featured UI patterns: conversational AI, authentication flows, and operator profile management.</p><div class="mn-grid-3"><div><div class="mn-demo-section-label mn-mb-sm">AI Chat Widget</div><div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden"><div id="demo-ai-chat" style="height:350px"></div></div></div><div><div class="mn-demo-section-label mn-mb-sm">Login Screen</div><div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden"><div id="demo-login-screen" style="min-height:350px;display:flex;align-items:center;justify-content:center"></div></div></div><div><div class="mn-demo-section-label mn-mb-sm">Profile Menu</div><div class="mn-card-dark" style="border-radius:var(--radius-lg);overflow:hidden"><div id="demo-profile-menu" style="min-height:350px;display:flex;align-items:center;justify-content:center"></div></div></div></div></div>`;
    requestAnimationFrame(() => initInteractive(section));
    return section;
  }
  function placeholder2(container, label) {
    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:var(--space-xl)"><p class="mn-label" style="color:var(--grigio-medio);text-align:center"><strong>${label}</strong><br><span class="mn-micro">Component requires JS engine</span></p></div>`;
  }
  function initInteractive(section) {
    const M3 = window.Maranello;
    if (!M3) {
      ["demo-ai-chat", "demo-login-screen", "demo-profile-menu"].forEach((id) => {
        const el = section.querySelector("#" + id);
        if (el) placeholder2(el, "Maranello not loaded");
      });
      return;
    }
    initChat(M3, section);
    initLogin(M3, section);
    initProfile(M3, section);
  }
  function initChat(M3, section) {
    const container = section.querySelector("#demo-ai-chat");
    if (!container) return;
    if (!M3.aiChat) return placeholder2(container, "AI Chat");
    try {
      const ctrl = M3.aiChat(container, { title: "Maranello Luce Copilot", placeholder: "Ask about pipelines, tokens, or routing\u2026", welcomeMessage: "Hi! I can help you inspect pipeline runs, token budgets, and model routing policies.", avatar: "https://github.com/Roberdan.png", quickActions: ["Show pipelines", "Token spend", "Routing health"], onSend(text) {
        return 'This is a demo response. In production, this would connect to your AI backend. You asked: "' + text + '"';
      } });
      setTimeout(() => {
        const panel = container.querySelector(".mn-chat-panel");
        const fab = container.querySelector(".mn-chat-fab");
        if (panel) {
          panel.style.position = "absolute";
          panel.style.bottom = "0";
          panel.style.left = "0";
          panel.style.right = "0";
          panel.style.top = "0";
          panel.style.width = "100%";
          panel.style.height = "100%";
          panel.style.borderRadius = "var(--radius-lg)";
        }
        if (fab) {
          fab.style.position = "absolute";
          fab.style.bottom = "12px";
          fab.style.left = "12px";
        }
        container.style.position = "relative";
        if (ctrl?.open) {
          ctrl.open();
          if (ctrl.addMessage) {
            ctrl.addMessage("user", "Which region is handling the most traffic right now?");
            ctrl.addMessage("ai", "us-east-1 is currently handling **41%** of routed traffic. eu-west-1 is at 29%, and ap-southeast-1 is at 18% with healthy latency.");
          }
        }
      }, 300);
    } catch (e) {
      console.warn("[mn-chat] error:", e);
      placeholder2(container, "AI Chat");
    }
  }
  function initLogin(M3, section) {
    const container = section.querySelector("#demo-login-screen");
    if (!container) return;
    if (!M3.loginScreen) return placeholder2(container, "Login Screen");
    try {
      M3.loginScreen(container, { appTitle: "Maranello", appTitleAccent: "Luce", subtitle: "Agentic AI Operations Portal", version: "v3.2.0", env: "demo", buttonLabel: "Sign in with SSO", checks: [{ name: "API Gateway", status: "healthy" }, { name: "Model Router", status: "healthy" }, { name: "Vector Store", status: "degraded" }], onLogin() {
        console.log("[mn-login] clicked");
      } });
    } catch (e) {
      console.warn("[mn-login] error:", e);
      placeholder2(container, "Login Screen");
    }
  }
  function initProfile(M3, section) {
    const container = section.querySelector("#demo-profile-menu");
    if (!container) return;
    if (!M3.profileMenu) return placeholder2(container, "Profile Menu");
    try {
      const trigger = document.createElement("div");
      trigger.style.cssText = "display:flex;align-items:center;justify-content:center;height:100%;padding:var(--space-xl)";
      container.innerHTML = "";
      container.appendChild(trigger);
      M3.profileMenu(trigger, { name: "Roberto D'Angelo", email: "roberdan@maranelloluce.ai", avatarUrl: "https://github.com/Roberdan.png", sections: [{ items: [{ label: "View Profile", action: () => console.log("[mn-profile] View Profile") }, { label: "Settings", action: () => console.log("[mn-profile] Settings") }] }, { items: [{ label: "Switch Theme", action: () => {
        window.Maranello?.cycleTheme?.();
      } }, { label: "Sign Out", action: () => console.log("[mn-profile] Sign Out") }] }] });
    } catch (e) {
      console.warn("[mn-profile] error:", e);
      placeholder2(container, "Profile Menu");
    }
  }

  // demo/sections/okr-panel.js
  function createOkrSection() {
    const section = document.createElement("section");
    section.id = "okr";
    section.className = "mn-section-light";
    section.innerHTML = `<div class="mn-container"><p class="mn-section-number">11 \u2014 Strategy</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">OKR Dashboard</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Objective and Key Result tracking for agentic operations, routing quality, and model efficiency.</p><div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"><div id="okr-panel-root"></div></div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Regional Progress</h3><div class="mn-grid-2">${regionCard("North America", [{ kr: "Launch 3 new inference lanes", pct: 67 }, { kr: "Keep p95 under 180 ms", pct: 82 }, { kr: "Reach 200k routed tasks", pct: 45 }])}${regionCard("Europe", [{ kr: "Ship evaluation mesh", pct: 90 }, { kr: "Add 5 failover policies", pct: 60 }, { kr: "Publish 2 model scorecards", pct: 50 }])}</div></div>`;
    requestAnimationFrame(() => initOkr(section));
    return section;
  }
  function initOkr(section) {
    const M3 = window.Maranello;
    if (!M3?.okrPanel) return;
    const root2 = section.querySelector("#okr-panel-root");
    if (!root2) return;
    M3.okrPanel(root2, { title: "Q1 2026 Objectives", period: "Jan \u2014 Mar 2026", objectives: [
      { title: "Expand Runtime Capacity in North America", progress: 62, status: "at-risk", keyResults: [{ title: "Open lanes in us-east-1 and us-west-2", current: 1.5, target: 2 }, { title: "Route 500k tasks through production pipelines", current: 34e4, target: 5e5 }, { title: "Achieve 96% user satisfaction score", current: 92, target: 96, unit: "%" }, { title: "Reduce p95 latency to under 180 ms", current: 194, target: 180 }] },
      { title: "Strengthen Model Evaluation", progress: 55, status: "at-risk", keyResults: [{ title: "Publish 4 benchmark scorecards", current: 2, target: 4 }, { title: "Secure 3 judge-model pairings", current: 2, target: 3 }, { title: "Launch reasoning model canary", current: 0.3, target: 1 }] },
      { title: "Grow Agent Reliability", progress: 78, status: "on-track", keyResults: [{ title: "Deploy 100 new validator checks", current: 85, target: 100 }, { title: "Achieve 80% auto-remediation rate", current: 58, target: 80, unit: "%" }] }
    ] });
  }
  function regionCard(region, keyResults) {
    const krs = keyResults.map((kr) => `<div style="margin-bottom:var(--space-md)"><div style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)"><span class="mn-micro">${kr.kr}</span><span class="mn-micro" style="color:var(--mn-accent)">${kr.pct}%</span></div><div style="height:4px;border-radius:2px;background:var(--grigio-scuro)"><div style="height:100%;width:${kr.pct}%;border-radius:2px;background:var(--mn-accent);transition:width 1s ease"></div></div></div>`).join("");
    return `<div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">${region}</h4>${krs}</div>`;
  }

  // demo/sections/map.js
  function createMapSection() {
    const section = document.createElement("section");
    section.id = "map";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container"><p class="mn-section-number">17 \u2014 Geography</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Map Visualization</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Canvas-based interactive world map with clustered markers, zoom/pan, and theme-aware styling. Shows Maranello Luce deployment regions across the globe.</p><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)"><h4 class="mn-label" style="margin-bottom:var(--space-md)">Regional Footprint</h4><div id="map-canvas-container" style="width:100%;height:400px;border-radius:6px;overflow:hidden;background:var(--nero-profondo)"><p class="mn-micro" style="color:var(--grigio-medio);padding:var(--space-lg)">Loading map\u2026</p></div><div style="display:flex;gap:var(--space-xl);margin-top:var(--space-md)">${legendDot("#00A651", "Active")}${legendDot("#FFC72C", "Warning")}${legendDot("#DC0000", "Danger")}${legendDot("#8B5CF6", "Planned")}</div></div><div class="mn-grid-2"><div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">Regions by Zone</h4>${regionRow("us-east-1", 3, "active")}${regionRow("eu-west-1", 2, "active")}${regionRow("ap-southeast-1", 1, "active")}${regionRow("us-west-2", 1, "warning")}${regionRow("sa-east-1", 1, "planned")}</div><div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">Network Statistics</h4>${statRow("Total Regions", "8")}${statRow("Active Regions", "6")}${statRow("Planned Expansions", "1")}${statRow("Continents Covered", "4")}${statRow("Availability Zones", "12")}${statRow("Avg Runtime", "24.8h")}</div></div></div>`;
    requestAnimationFrame(() => mountMap(section));
    return section;
  }
  var MAP_MARKERS = [
    { id: "m1", lat: 38.9, lon: -77.04, label: "us-east-1", detail: "Active \xB7 120 live agents", color: "#00E676", size: 8, status: "active" },
    { id: "m2", lat: 40.71, lon: -74, label: "us-east-2", detail: "Active \xB7 85 live agents", color: "#00E676", size: 8, status: "active" },
    { id: "m3", lat: 37.77, lon: -122.42, label: "us-west-2", detail: "Warning \xB7 cache warmup pending", color: "#FFD54F", size: 8, status: "warning" },
    { id: "r1", lat: 53.35, lon: -6.26, label: "eu-west-1", detail: "Active \xB7 110 live agents", color: "#00E676", size: 8, status: "active" },
    { id: "r2", lat: 50.11, lon: 8.68, label: "eu-central-1", detail: "Active \xB7 72 live agents", color: "#00E676", size: 8, status: "active" },
    { id: "t1", lat: 1.35, lon: 103.82, label: "ap-southeast-1", detail: "Active \xB7 64 live agents", color: "#00E676", size: 8, status: "active" },
    { id: "f1", lat: -33.87, lon: 151.21, label: "ap-southeast-2", detail: "Warning \xB7 token budget 92%", color: "#FFD54F", size: 8, status: "warning" },
    { id: "b1", lat: -23.55, lon: -46.63, label: "sa-east-1", detail: "Planned \xB7 opening Q3 2026", color: "#B388FF", size: 8, status: "planned" }
  ];
  function mountMap(section) {
    const container = section.querySelector("#map-canvas-container");
    if (!container) return;
    const M3 = window.Maranello;
    if (M3 && typeof M3.mapView === "function") {
      try {
        container.innerHTML = "";
        M3.mapView(container, { markers: MAP_MARKERS, zoom: 1, padding: 30, onClick: (m) => console.log("[map] clicked:", m.label) });
        setTimeout(() => {
          const ctrl = M3.mapView.__lastCtrl;
          if (ctrl?.setZoom) ctrl.setZoom(1);
        }, 500);
        return;
      } catch (err) {
        console.warn("[map] Maranello.mapView error:", err);
      }
    }
    container.innerHTML = `<div style="padding:var(--space-xl)"><p class="mn-micro" style="color:var(--grigio-medio);margin-bottom:var(--space-md)">Map canvas unavailable \u2014 marker list:</p>${MAP_MARKERS.map((m) => `<div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-xs) 0"><span style="width:8px;height:8px;border-radius:50%;background:${statusColor(m.status)};display:inline-block;flex-shrink:0"></span><span class="mn-body" style="font-size:0.85rem">${m.label}</span><span class="mn-micro" style="color:var(--grigio-medio)">${m.lat.toFixed(2)}, ${m.lon.toFixed(2)}</span></div>`).join("")}</div>`;
  }
  function statusColor(s) {
    return s === "active" ? "#00A651" : s === "warning" ? "#FFC72C" : s === "planned" ? "#8B5CF6" : "#DC0000";
  }
  function legendDot(color, label) {
    return `<div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block"></span><span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span></div>`;
  }
  function regionRow(region, count, status) {
    const color = status === "planned" ? "var(--grigio-medio)" : status === "warning" ? "var(--mn-accent)" : "var(--verde-racing)";
    const badge = status === "planned" ? "Planned" : status === "warning" ? "Warning" : "Active";
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)"><span class="mn-body">${region}</span><div style="display:flex;align-items:center;gap:var(--space-sm)"><span class="mn-micro" style="color:${color}">${badge}</span><span class="mn-label" style="color:var(--mn-accent)">${count}</span></div></div>`;
  }
  function statRow(label, value) {
    return `<div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)"><span class="mn-micro">${label}</span><span class="mn-label" style="color:var(--mn-accent)">${value}</span></div>`;
  }

  // demo/sections/social-graph.js
  function createSocialGraphSection() {
    const section = document.createElement("section");
    section.id = "social-graph";
    section.className = "mn-section-dark";
    section.innerHTML = `<div class="mn-container"><p class="mn-section-number">16 \u2014 Agent Graph</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Maranello Luce Hub-and-Spoke Network</h2><p class="mn-body" style="margin-bottom:var(--space-xl)">28 fictional agents across orchestrator, executor, validator, researcher, and monitor teams.</p><div class="mn-card-dark" style="padding:var(--space-xl);width:100%;margin-bottom:var(--space-md)"><div id="social-graph-canvas" style="width:100%;height:500px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:radial-gradient(circle at center, rgba(255,255,255,.05), rgba(0,0,0,.2));"></div></div><div id="social-graph-meta" class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-md)">Hover a node to inspect an agent. Drag to reposition.</div><div id="social-graph-legend" style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center"></div></div>`;
    requestAnimationFrame(() => initSocialGraph(section));
    return section;
  }
  function initSocialGraph(section) {
    if (!section.isConnected) return requestAnimationFrame(() => initSocialGraph(section));
    const { nodes, edges, groups: groups2 } = buildSocialNetworkData();
    const graphEl = section.querySelector("#social-graph-canvas");
    const legend2 = section.querySelector("#social-graph-legend");
    const meta = section.querySelector("#social-graph-meta");
    const defaultMeta = "Hover a node to inspect an agent. Drag to reposition.";
    Object.entries(groups2).forEach(([team, color]) => {
      const item = document.createElement("span");
      item.className = "mn-micro";
      item.style.cssText = "display:inline-flex;align-items:center;gap:8px;color:var(--avorio)";
      item.innerHTML = `<span style="width:10px;height:10px;border-radius:999px;background:${color};box-shadow:0 0 0 1px rgba(255,255,255,.12)"></span>${team}`;
      legend2?.appendChild(item);
    });
    const onHover = (node) => {
      if (!meta) return;
      meta.textContent = node ? `${node.label} \u2014 ${node.group} \xB7 ${node.connections} connections` : defaultMeta;
    };
    if (window.Maranello?.socialGraph) {
      window.Maranello.socialGraph(graphEl, {
        nodes,
        edges,
        groups: groups2,
        height: 500,
        onHover,
        onClick: (node) => window.Maranello.toast?.({ type: "info", title: node.label, message: `${node.group} \xB7 ${node.connections} connections` })
      });
      return;
    }
    drawFallbackGraph(graphEl, { nodes, edges, groups: groups2, onHover });
  }
  function buildSocialNetworkData() {
    const teamDefs = [
      { team: "Orchestrators", color: "#00A651", names: ["Atlas Orchestrator Lead", "Helix Orchestrator Lead", "Nexus Orchestrator Lead", "Vector Orchestrator", "Beacon Orchestrator"], leadCount: 3, angle: 0, radius: 24 },
      { team: "Executors", color: "#4EA8DE", names: ["Signal Executor Lead", "Pulse Executor", "Forge Executor", "Circuit Executor", "Delta Executor", "Runner Executor", "Matrix Executor", "Echo Executor"], leadCount: 1, angle: -0.35, radius: 140 },
      { team: "Validators", color: "#FFC72C", names: ["Prism Validator Lead", "Sentinel Validator", "Audit Validator", "Proof Validator", "Guard Validator"], leadCount: 1, angle: 1, radius: 156 },
      { team: "Researchers", color: "#8B5CF6", names: ["Nova Researcher Lead", "Query Researcher", "Scout Researcher", "Horizon Researcher", "Mapper Researcher", "Lens Researcher"], leadCount: 1, angle: 2.2, radius: 168 },
      { team: "Monitors", color: "#DC0000", names: ["Relay Monitor Lead", "Watch Monitor", "Canary Monitor", "Shield Monitor"], leadCount: 1, angle: 3, radius: 220 }
    ];
    let seed = 17;
    const rand = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296;
    const edgeMap = /* @__PURE__ */ new Map();
    const teamMembers = /* @__PURE__ */ new Map();
    const nodes = [];
    const groups2 = Object.fromEntries(teamDefs.map((t) => [t.team, t.color]));
    const cx = 450;
    const cy = 250;
    const addEdge = (a, b, weight) => {
      if (!a || !b || a.id === b.id) return;
      const key = [a.id, b.id].sort().join("::");
      const prev = edgeMap.get(key);
      if (!prev || weight > prev.weight) edgeMap.set(key, { source: a.id, target: b.id, weight: toStroke(weight) });
    };
    teamDefs.forEach((def) => {
      const members = def.names.map((label, i) => {
        const lead = i < def.leadCount;
        const spread = lead ? 26 : 52;
        const jitter = (rand() - 0.5) * spread;
        const angle = def.angle + (lead ? (i - (def.leadCount - 1) / 2) * 0.75 : (i - def.leadCount + 1) * 0.48);
        const x = cx + Math.cos(angle) * (def.radius + jitter);
        const y = cy + Math.sin(angle) * (def.radius + jitter * 0.9);
        return { id: `${def.team.toLowerCase()}-${i + 1}`, label, group: def.team, avatar: initials(label), role: lead ? `${def.team.slice(0, -1)} Lead` : def.team.slice(0, -1), lead, x, y };
      });
      teamMembers.set(def.team, members);
      nodes.push(...members);
    });
    teamMembers.forEach((members) => {
      const leads2 = members.filter((n) => n.lead);
      members.filter((n) => !n.lead).forEach((member, i) => addEdge(member, leads2[i % leads2.length], 2));
    });
    const leads = nodes.filter((n) => n.lead);
    for (let i = 0; i < leads.length; i += 1) for (let j = i + 1; j < leads.length; j += 1) addEdge(leads[i], leads[j], 1.5);
    teamMembers.forEach((members) => {
      const attempts = Math.max(2, Math.floor(members.length * 1.2));
      for (let i = 0; i < attempts; i += 1) addEdge(members[Math.floor(rand() * members.length)], members[Math.floor(rand() * members.length)], 1);
    });
    const workers = nodes.filter((n) => !n.lead);
    for (let i = 0; i < Math.floor(workers.length * 0.55); i += 1) {
      const a = workers[Math.floor(rand() * workers.length)];
      const pool = workers.filter((n) => n.group !== a.group);
      addEdge(a, pool[Math.floor(rand() * pool.length)], 0.5);
    }
    const edges = [...edgeMap.values()];
    const degree = new Map(nodes.map((n) => [n.id, 0]));
    edges.forEach((e) => {
      degree.set(e.source, (degree.get(e.source) || 0) + 1);
      degree.set(e.target, (degree.get(e.target) || 0) + 1);
    });
    const values = [...degree.values()];
    const min = Math.min(...values), max = Math.max(...values);
    nodes.forEach((n) => {
      const d = degree.get(n.id) || 0;
      n.connections = d;
      n.size = Math.round(10 + (d - min) / Math.max(1, max - min) * 20);
      n.detail = `${n.role} \xB7 ${n.group} \xB7 ${d} connections`;
    });
    return { nodes, edges, groups: groups2 };
  }
  function drawFallbackGraph(host, opts) {
    if (!(host instanceof HTMLElement)) return;
    host.innerHTML = "";
    host.style.position = "relative";
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:none;cursor:default;";
    host.appendChild(canvas);
    const dpr = window.devicePixelRatio || 1;
    const nodes = opts.nodes.map((n) => ({ ...n, vx: 0, vy: 0 }));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    let drag = null;
    const resize = () => {
      const r = host.getBoundingClientRect();
      canvas.width = Math.round(Math.max(320, r.width) * dpr);
      canvas.height = Math.round(Math.max(260, r.height) * dpr);
    };
    const point = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const hit = (x, y) => [...nodes].reverse().find((n) => Math.hypot(x - n.x, y - n.y) <= n.size + 3) || null;
    const step = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      nodes.forEach((n) => {
        n.fx = (w / 2 - n.x) * 4e-3;
        n.fy = (h / 2 - n.y) * 4e-3;
      });
      for (let i = 0; i < nodes.length; i += 1) for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.max(10, Math.hypot(dx, dy));
        const rep = 3800 / (dist * dist), nx = dx / dist, ny = dy / dist;
        a.fx += nx * rep;
        a.fy += ny * rep;
        b.fx -= nx * rep;
        b.fy -= ny * rep;
        const overlap = a.size + b.size + 10 - dist;
        if (overlap > 0) {
          a.fx += nx * overlap * 0.12;
          a.fy += ny * overlap * 0.12;
          b.fx -= nx * overlap * 0.12;
          b.fy -= ny * overlap * 0.12;
        }
      }
      opts.edges.forEach((e) => {
        const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
        if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y, dist = Math.max(12, Math.hypot(dx, dy));
        const spring = (dist - 70) * 26e-4 * (e.weight / 1.5), nx = dx / dist, ny = dy / dist;
        a.fx += nx * spring;
        a.fy += ny * spring;
        b.fx -= nx * spring;
        b.fy -= ny * spring;
      });
      nodes.forEach((n) => {
        if (drag?.id === n.id) return;
        n.vx = (n.vx + n.fx) * 0.9;
        n.vy = (n.vy + n.fy) * 0.9;
        n.x = clamp(n.x + n.vx, n.size + 8, w - n.size - 8);
        n.y = clamp(n.y + n.vy, n.size + 8, h - n.size - 8);
      });
    };
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      let edgeIdx = 0;
      opts.edges.forEach((e) => {
        const a = nodeMap.get(e.source), b = nodeMap.get(e.target);
        if (!a || !b) return;
        edgeIdx += 1;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / dist, ny = dx / dist;
        const sign = edgeIdx % 2 === 0 ? 1 : -1;
        const bend = sign * (dist * 0.35 + 20);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const cp1x = a.x + dx * 0.25 + nx * bend * 0.8;
        const cp1y = a.y + dy * 0.25 + ny * bend * 0.8;
        const cp2x = a.x + dx * 0.75 + nx * bend * 0.8;
        const cp2y = a.y + dy * 0.75 + ny * bend * 0.8;
        const colA = opts.groups[a.group] || "#FFC72C";
        const colB = opts.groups[b.group] || "#FFC72C";
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, colA);
        grad.addColorStop(1, colB);
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = grad;
        ctx.lineWidth = e.weight + 4;
        ctx.filter = "blur(3px)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = grad;
        ctx.lineWidth = e.weight;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
        ctx.stroke();
      });
      nodes.forEach((n) => {
        const col = opts.groups[n.group] || "#FFC72C";
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = col;
        ctx.filter = "blur(8px)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#0a0a0a";
        ctx.font = `700 ${Math.max(9, n.size * 0.75)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.avatar, n.x, n.y + 0.5);
      });
    };
    const animate = () => {
      step();
      draw();
      requestAnimationFrame(animate);
    };
    canvas.addEventListener("mousedown", (e) => {
      const p = point(e);
      drag = hit(p.x, p.y);
    });
    canvas.addEventListener("mousemove", (e) => {
      const p = point(e);
      if (drag) {
        drag.x = p.x;
        drag.y = p.y;
        opts.onHover?.(drag);
        canvas.style.cursor = "grabbing";
        return;
      }
      const node = hit(p.x, p.y);
      opts.onHover?.(node || null);
      canvas.style.cursor = node ? "pointer" : "default";
    });
    window.addEventListener("mouseup", () => {
      drag = null;
    });
    canvas.addEventListener("mouseleave", () => opts.onHover?.(null));
    resize();
    new ResizeObserver(resize).observe(host);
    animate();
  }
  function toStroke(weight) {
    return clamp(0.5 + (weight - 0.5) / 1.5 * 2.5, 0.5, 3);
  }
  function initials(label) {
    return label.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  }
  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  // demo/sections/advanced.js
  function createAdvancedSection() {
    const section = document.createElement("section");
    section.id = "advanced";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container"><p class="mn-section-number">06 / INTERFACE \xB7 PATTERNS</p><div class="mn-watermark">INTERFACCIA</div><h2 class="mn-title-section mn-mb-sm">Extended Components</h2><p class="mn-body mn-mb-2xl">Tooltip, modal, toast, dropdown, tabs, breadcrumb, avatar, spinner \u2014 every pattern an AI operations dashboard needs.</p><div class="mn-demo-section-label mn-mt-2xl">Breadcrumb</div><nav class="mn-breadcrumb mn-mb-2xl" aria-label="Breadcrumb"><a href="#" class="mn-breadcrumb__item">Operations</a><span class="mn-breadcrumb__sep">\u25B8</span><a href="#" class="mn-breadcrumb__item">us-east-1</a><span class="mn-breadcrumb__sep">\u25B8</span><span class="mn-breadcrumb__item mn-breadcrumb__item--active">Pipeline Alpha</span></nav><div class="mn-demo-section-label">Tooltips</div><div class="mn-flex-wrap mn-gap-xl mn-mb-2xl"><span class="mn-tooltip-wrap"><button class="mn-machined-btn">Hover me</button><span class="mn-tooltip" role="tooltip">Accuracy score: 96%</span></span><span class="mn-tooltip-wrap"><span class="mn-status mn-status--warning"><span class="mn-status__dot"></span> At Risk</span><span class="mn-tooltip mn-tooltip--bottom" role="tooltip">3 checks failing since Mar 8</span></span><span class="mn-tooltip-wrap"><span class="mn-tag mn-tag--active">Inference</span><span class="mn-tooltip" role="tooltip">234k routed tokens processed in the current window</span></span></div><div class="mn-demo-section-label">Avatars</div><div class="mn-flex-wrap mn-gap-lg mn-mb-lg" style="align-items:center"><div class="mn-avatar mn-avatar--xs">MR</div><div class="mn-avatar mn-avatar--sm">JS</div><div class="mn-avatar">AK<span class="mn-avatar__status mn-avatar__status--online"></span></div><div class="mn-avatar mn-avatar--lg">YT<span class="mn-avatar__status mn-avatar__status--busy"></span></div><div class="mn-avatar mn-avatar--xl">LP<span class="mn-avatar__status mn-avatar__status--away"></span></div></div><div class="mn-flex-wrap mn-gap-lg mn-mb-2xl" style="align-items:center"><span class="mn-micro mn-text-muted">Group:</span><div class="mn-avatar-group"><div class="mn-avatar mn-avatar--sm">MR</div><div class="mn-avatar mn-avatar--sm">JS</div><div class="mn-avatar mn-avatar--sm">AK</div><div class="mn-avatar mn-avatar--sm">+4</div></div></div><div class="mn-demo-section-label">Badges & Tags</div><div class="mn-flex-wrap mn-gap-md mn-mb-2xl" style="align-items:center"><span class="mn-tag mn-tag--active">Active</span><span class="mn-tag">Inference</span><span class="mn-tag mn-tag--sm">Evaluation</span><span class="mn-tag mn-tag--xs">Q1 2026</span><span class="mn-status mn-status--success"><span class="mn-status__dot"></span>Online</span><span class="mn-status mn-status--danger"><span class="mn-status__dot mn-anim-pulseDot"></span>Live Alert</span><span class="mn-status mn-status--warning"><span class="mn-status__dot"></span>At Risk</span></div><div class="mn-demo-section-label">Dropdown</div><div class="mn-mb-xl"><div class="mn-dropdown" id="adv-dropdown"><button class="mn-dropdown__trigger">us-east-1</button><div class="mn-dropdown__menu"><button class="mn-dropdown__item mn-dropdown__item--active">us-east-1</button><button class="mn-dropdown__item">eu-west-1</button><button class="mn-dropdown__item">ap-southeast-1</button><div class="mn-dropdown__divider"></div><button class="mn-dropdown__item">All regions</button></div></div></div><div class="mn-demo-section-label">Multi-Select Dropdown</div><div class="mn-mb-xl"><div class="mn-dropdown" id="adv-multi-dropdown"><button class="mn-dropdown__trigger" style="border-color:var(--mn-accent);color:var(--mn-accent)">Select Models</button><div class="mn-dropdown__menu" style="border-color:rgba(255,199,44,.45);min-width:240px"><label class="mn-dropdown__item" data-label="Claude Sonnet"><input type="checkbox" tabindex="-1" style="accent-color:var(--mn-accent)"> <span>Claude Sonnet</span></label><label class="mn-dropdown__item" data-label="GPT-5.1"><input type="checkbox" tabindex="-1" style="accent-color:var(--mn-accent)"> <span>GPT-5.1</span></label><label class="mn-dropdown__item" data-label="Gemini 2.5"><input type="checkbox" tabindex="-1" style="accent-color:var(--mn-accent)" checked> <span>Gemini 2.5</span></label><label class="mn-dropdown__item" data-label="Agent Haiku"><input type="checkbox" tabindex="-1" style="accent-color:var(--mn-accent)"> <span>Agent Haiku</span></label></div></div></div><div class="mn-demo-section-label">Exclusive-Select Dropdown</div><div class="mn-mb-2xl"><div class="mn-dropdown" id="adv-exclusive-dropdown"><button class="mn-dropdown__trigger" style="border-color:var(--mn-accent);color:var(--mn-accent)">Priority Focus</button><div class="mn-dropdown__menu" style="border-color:rgba(255,199,44,.45);min-width:220px"><label class="mn-dropdown__item mn-dropdown__item--active" data-label="Latency"><input type="radio" name="adv-exclusive" tabindex="-1" style="accent-color:var(--mn-accent)" checked> <span>Latency</span></label><label class="mn-dropdown__item" data-label="Quality"><input type="radio" name="adv-exclusive" tabindex="-1" style="accent-color:var(--mn-accent)"> <span>Quality</span></label><label class="mn-dropdown__item" data-label="Budget"><input type="radio" name="adv-exclusive" tabindex="-1" style="accent-color:var(--mn-accent)"> <span>Budget</span></label></div></div></div><div class="mn-demo-section-label">Tabs</div><div class="mn-tabs mn-mb-2xl" id="adv-tabs" style="max-width:600px"><div class="mn-tabs__list" role="tablist"><button class="mn-tabs__tab mn-tabs__tab--active" role="tab">Overview</button><button class="mn-tabs__tab" role="tab">Activities</button><button class="mn-tabs__tab" role="tab">Resources</button><button class="mn-tabs__tab" role="tab">Quality</button></div><div class="mn-tabs__panel mn-tabs__panel--active" role="tabpanel"><p class="mn-micro mn-text-muted">47 live pipelines \xB7 87% utilization \xB7 96/100 accuracy score</p></div><div class="mn-tabs__panel" role="tabpanel"><p class="mn-micro mn-text-muted">128 runtime activities across routing, inference, evaluation, and guardrail lanes</p></div><div class="mn-tabs__panel" role="tabpanel"><p class="mn-micro mn-text-muted">46.4 GPU hrs allocated \xB7 12 model lanes across 3 regions</p></div><div class="mn-tabs__panel" role="tabpanel"><p class="mn-micro mn-text-muted">9 quality checks: 6 passing, 2 warnings, 1 critical</p></div></div><div class="mn-demo-section-label">Spinners</div><div class="mn-flex-wrap mn-gap-2xl mn-mb-2xl" style="align-items:center"><div class="mn-text-center"><div class="mn-spinner mn-spinner--sm"><div class="mn-spinner__ring"></div></div><div class="mn-spinner__label">Small</div></div><div class="mn-text-center"><div class="mn-spinner"><div class="mn-spinner__ring"></div></div><div class="mn-spinner__label">Default</div></div><div class="mn-text-center"><div class="mn-spinner mn-spinner--lg"><div class="mn-spinner__ring"></div></div><div class="mn-spinner__label">Large</div></div><div class="mn-text-center"><div class="mn-spinner mn-spinner--gauge"><div class="mn-spinner__ring"></div></div><div class="mn-spinner__label">Gauge</div></div></div><div class="mn-demo-section-label">Modal</div><div class="mn-mb-2xl"><button class="mn-machined-btn" id="adv-modal-open"><span class="mn-machined-btn__indicator"></span>Open Modal</button></div><div class="mn-modal-backdrop" id="adv-modal"><div class="mn-modal"><div class="mn-modal__header"><span class="mn-modal__title">Pipeline Detail</span><button class="mn-modal__close" id="adv-modal-close" aria-label="Close">\u2715</button></div><div class="mn-modal__body"><p><strong>Pipeline Alpha</strong> \u2014 production inference lane in us-east-1.</p><p style="margin-top:var(--space-md)">Accuracy: 96% \xB7 Agents: 14 \xB7 Status: Running</p><p style="margin-top:var(--space-md)">Click outside or press Escape to close.</p></div><div class="mn-modal__footer"><button class="mn-btn mn-btn--ghost mn-btn--sm" id="adv-modal-cancel">Cancel</button><button class="mn-btn mn-btn--accent mn-btn--sm" id="adv-modal-confirm">View Full Detail</button></div></div></div><div class="mn-demo-section-label">Toast Notifications</div><div class="mn-flex-wrap mn-gap-md mn-mb-2xl"><button class="mn-machined-btn" id="adv-toast-success">Success Toast</button><button class="mn-machined-btn mn-machined-btn--amber" id="adv-toast-warning">Warning Toast</button><button class="mn-machined-btn" id="adv-toast-danger">Error Toast</button><button class="mn-machined-btn mn-machined-btn--off" id="adv-toast-info">Info Toast</button></div><div class="mn-demo-section-label">Command Palette (\u2318K)</div><div class="mn-mb-2xl"><button class="mn-machined-btn" id="adv-cmd-palette"><span class="mn-machined-btn__indicator"></span>Open Palette</button><span class="mn-micro mn-text-muted" style="margin-left:var(--space-md)">or press \u2318K / Ctrl+K</span></div><div id="demo-cmd-palette" style="position:fixed;inset:0;z-index:9000;display:none;align-items:flex-start;justify-content:center;padding-top:20vh;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)"><div class="mn-command-palette" style="position:relative;top:auto;left:auto;transform:none;width:480px;max-width:90vw;overflow:hidden"><input class="mn-command-palette__input" placeholder="Search commands\u2026" style="width:100%;padding:14px 16px;background:transparent;border:none;border-bottom:1px solid var(--grigio-scuro,#333);color:var(--grigio-alluminio,#ccc);font-size:.95rem;outline:none"><div class="mn-command-palette__results" style="max-height:240px;overflow-y:auto;padding:8px"><div class="mn-command-palette__item" data-action="theme-nero"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg></span> Switch to Nero theme</span></div><div class="mn-command-palette__item" data-action="theme-avorio"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mn-accent)" stroke-width="1.5" stroke-linecap="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg></span> Switch to Avorio theme</span></div><div class="mn-command-palette__item" data-action="go-charts"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20v-3"/></svg></span> Go to Charts</span></div><div class="mn-command-palette__item" data-action="go-gauges"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.2a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9h.2a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.2a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z"/></svg></span> Go to Gauges</span></div><div class="mn-command-palette__item" data-action="go-controls"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 4 4 4 2-4 4-4"/></svg></span> Go to Controls</span></div><div class="mn-command-palette__item" data-action="go-forms"><span class="mn-command-palette__item-text"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg></span> Go to Forms</span></div></div></div></div><div class="mn-demo-section-label">Drawer Panel</div><div class="mn-mb-2xl"><button class="mn-machined-btn" id="adv-drawer-open"><span class="mn-machined-btn__indicator"></span>Open Drawer</button></div><div class="mn-drawer__backdrop" id="adv-drawer-backdrop" style="z-index:8000"></div><div class="mn-drawer" id="adv-drawer" style="left:auto;right:0;bottom:0;width:360px;max-width:90vw;height:100%;z-index:8001;background:var(--nero-soft,#1a1a1a);border-left:1px solid var(--grigio-scuro,#333);box-shadow:-10px 0 30px rgba(0,0,0,.4);transform:translateX(100%);transition:transform .3s ease;overflow-y:auto;padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl)"><span class="mn-label" style="color:var(--mn-accent)">Detail Drawer</span><button class="mn-machined-btn mn-machined-btn--off" id="adv-drawer-close" style="padding:4px 8px;font-size:.7rem">\u2715</button></div><p class="mn-body" style="margin-bottom:var(--space-lg)">Drawer panel for side content. Click \xD7 or outside to close.</p><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-md)"><div class="mn-label" style="margin-bottom:var(--space-sm)">Quick Stats</div><div class="mn-micro" style="color:var(--grigio-medio)">Active pipelines: 47</div><div class="mn-micro" style="color:var(--grigio-medio)">Routed tasks: 340k</div><div class="mn-micro" style="color:var(--grigio-medio)">Accuracy score: 96%</div></div></div></div>`;
    requestAnimationFrame(() => initAdvanced(section));
    return section;
  }
  function initAdvanced(section) {
    if (!section.isConnected) return requestAnimationFrame(() => initAdvanced(section));
    const M3 = window.Maranello;
    const hoist = (selector) => {
      const el = section.querySelector(selector);
      if (el && el.parentElement !== document.body) document.body.appendChild(el);
      return el;
    };
    M3?.initDropdown?.(section.querySelector("#adv-dropdown"));
    M3?.initTabs?.(section.querySelector("#adv-tabs"));
    const modal = section.querySelector("#adv-modal");
    const openModal = () => M3?.openModal ? M3.openModal("adv-modal") : modal?.classList.add("mn-modal-backdrop--open");
    const closeModal = () => M3?.closeModal ? M3.closeModal("adv-modal") : modal?.classList.remove("mn-modal-backdrop--open");
    ["#adv-modal-open", "#adv-modal-close", "#adv-modal-cancel", "#adv-modal-confirm"].forEach((id, i) => section.querySelector(id)?.addEventListener("click", i ? closeModal : openModal));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    [["adv-toast-success", { type: "success", title: "Deploy completed", message: "Pipeline Alpha promoted to production." }], ["adv-toast-warning", { type: "warning", title: "Low capacity", message: "us-east-1 is at 92% routing capacity." }], ["adv-toast-danger", { type: "danger", title: "Service alert", message: "Vector Store is experiencing delays." }], ["adv-toast-info", { type: "info", title: "New agent", message: "A new monitor agent registered in eu-west-1." }]].forEach(([id, opts]) => section.querySelector(`#${id}`)?.addEventListener("click", () => M3?.toast?.(opts)));
    const paletteHost = hoist("#demo-cmd-palette");
    const palette = paletteHost?.querySelector(".mn-command-palette");
    const paletteInput = paletteHost?.querySelector(".mn-command-palette__input");
    const paletteItems = [...paletteHost?.querySelectorAll(".mn-command-palette__item") || []];
    const filterPalette = (query = "") => paletteItems.forEach((item) => {
      const text = item.querySelector(".mn-command-palette__item-text")?.textContent?.toLowerCase() || "";
      item.style.display = !query || text.includes(query.toLowerCase()) ? "flex" : "none";
    });
    const openPalette = () => {
      if (!paletteHost || !palette) return;
      paletteHost.style.display = "flex";
      palette.classList.add("mn-command-palette--open");
      filterPalette("");
      if (paletteInput) {
        paletteInput.value = "";
        paletteInput.focus();
      }
    };
    const closePalette = () => {
      palette?.classList.remove("mn-command-palette--open");
      if (paletteHost) paletteHost.style.display = "none";
    };
    paletteInput?.addEventListener("input", () => filterPalette(paletteInput.value));
    paletteInput?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePalette();
    });
    paletteHost?.addEventListener("click", (e) => {
      if (e.target === paletteHost) closePalette();
    });
    paletteItems.forEach((item) => item.addEventListener("click", () => {
      const action = item.dataset.action || "";
      if (action === "theme-nero") M3?.setTheme?.("nero");
      else if (action === "theme-avorio") M3?.setTheme?.("avorio");
      else if (action.startsWith("go-")) document.querySelector(`#${action.slice(3)}`)?.scrollIntoView({ behavior: "smooth" });
      closePalette();
    }));
    section.querySelector("#adv-cmd-palette")?.addEventListener("click", openPalette);
    document.addEventListener("keydown", (e) => {
      const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !typing) {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape" && paletteHost?.style.display === "flex") closePalette();
    });
    const drawerBackdrop = hoist("#adv-drawer-backdrop");
    const drawerEl = hoist("#adv-drawer");
    const openDrawerPanel = () => {
      if (drawerEl) drawerEl.style.transform = "translateX(0)";
      drawerBackdrop?.classList.add("mn-drawer__backdrop--visible");
    };
    const closeDrawerPanel = () => {
      if (drawerEl) drawerEl.style.transform = "translateX(100%)";
      drawerBackdrop?.classList.remove("mn-drawer__backdrop--visible");
    };
    section.querySelector("#adv-drawer-open")?.addEventListener("click", openDrawerPanel);
    drawerEl?.querySelector("#adv-drawer-close")?.addEventListener("click", closeDrawerPanel);
    drawerBackdrop?.addEventListener("click", closeDrawerPanel);
    const initChoiceDropdown = (id, mode) => {
      const root2 = section.querySelector(id);
      if (!root2) return;
      const trigger = root2.querySelector(".mn-dropdown__trigger");
      const items = [...root2.querySelectorAll(".mn-dropdown__item")];
      const sync = () => {
        const selected = items.filter((item) => item.querySelector("input")?.checked).map((item) => item.dataset.label);
        if (trigger) trigger.textContent = mode === "multi" ? selected.length ? `${selected.length} model${selected.length > 1 ? "s" : ""} selected` : "Select Models" : selected[0] || "Priority Focus";
        items.forEach((item) => item.classList.toggle("mn-dropdown__item--active", !!item.querySelector("input")?.checked));
      };
      const close = () => root2.classList.remove("mn-dropdown--open");
      trigger?.addEventListener("click", (e) => {
        e.stopPropagation();
        root2.classList.toggle("mn-dropdown--open");
      });
      items.forEach((item) => item.addEventListener("click", (e) => {
        e.preventDefault();
        const input = item.querySelector("input");
        if (!input) return;
        if (mode === "exclusive") items.forEach((entry) => {
          const control = entry.querySelector("input");
          if (control) control.checked = entry === item;
        });
        else input.checked = !input.checked;
        sync();
        if (mode === "exclusive") close();
      }));
      document.addEventListener("click", (e) => {
        if (!root2.contains(e.target)) close();
      });
      sync();
    };
    initChoiceDropdown("#adv-multi-dropdown", "multi");
    initChoiceDropdown("#adv-exclusive-dropdown", "exclusive");
  }

  // demo/sections/mesh-network.js
  function meshNetworkSection() {
    return `
    <section class="demo-section" id="mesh-network">
      <h2 class="demo-section__title"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mn-accent)"><path d="M12 2l6 10-6 10-6-10z"/></svg></span> Mesh Network</h2>
      <p class="demo-section__desc">Convergio-style mesh node visualization for distributed AI agent orchestration.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;article class="mn-mesh-node"&gt;
  &lt;div class="mn-mesh-node__header"&gt;&lt;h4 class="mn-mesh-node__name"&gt;M1-MARIO&lt;/h4&gt;&lt;/div&gt;
  &lt;p class="mn-mesh-node__role"&gt;\u25CF Worker \xB7 Local&lt;/p&gt;
&lt;/article&gt;</code></pre>
      </details>

      <div class="mn-mesh-network">
        <div class="mn-mesh-network__toolbar mn-mesh-network__top">
          <span class="mn-mesh-network__title"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mn-accent)"><path d="M12 2l6 10-6 10-6-10z"/></svg></span> MESH NETWORK</span>
          <div class="mn-mesh-network__legend">
            <span class="mn-mesh-status mn-mesh-status--on"></span> On
            <span class="mn-mesh-status mn-mesh-status--off"></span> Off
            <span class="mn-mesh-status mn-mesh-status--sync"></span> Sync
            <span class="mn-mesh-status mn-mesh-status--drift"></span> Drift
          </div>
          <div class="mn-mesh-network__actions">
            <button class="mn-mesh-network__action">+ ADD PEER</button>
            <button class="mn-mesh-network__action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></span> DISCOVER</button>
            <button class="mn-mesh-network__action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg></span> FULL SYNC</button>
            <button class="mn-mesh-network__action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg></span> PUSH</button>
            <span class="mn-mesh-node__stats">4/4 online</span>
          </div>
        </div>

        <div class="mn-mesh-network__grid">
          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--signal-ok);">
            <div style="display:flex;gap:4px;margin-bottom:var(--space-sm)"><span style="width:8px;height:8px;border-radius:50%;background:#DC0000"></span><span style="width:8px;height:8px;border-radius:50%;background:#FFC72C"></span><span style="width:8px;height:8px;border-radius:50%;background:#00A651"></span></div>
            <div class="mn-mesh-node__header">
              <span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 19.5c-.9 1.3-1.9 2.5-3.4 2.5-1.5 0-2-.9-3.7-.9-1.8 0-2.3.9-3.7.9-1.5 0-2.6-1.3-3.5-2.6C2.7 16.8 1.6 13 3.2 10.3c.8-1.4 2.3-2.3 3.9-2.3 1.5 0 2.4 1 3.6 1s2.3-1 3.9-1c1.3 0 2.6.7 3.5 2-3.1 1.7-2.6 6.1.6 7.5zM15.4 2c.1 1.5-.4 3-1.4 4.1-.9 1-2.3 1.8-3.6 1.7-.2-1.4.5-2.9 1.4-3.9C12.7 2.8 14.2 2.1 15.4 2z"/></svg></span>
              <h4 class="mn-mesh-node__name">M1-MARIO</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">\u25CF Worker \xB7 Local</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
            </div>
            <p class="mn-mesh-node__stats">CPU</p>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 12%"></span></span>
              <span class="mn-mesh-bar__label">12%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 48%"></span></span>
              <span class="mn-mesh-bar__label">48%</span>
            </div>
            <p class="mn-mesh-node__stats">3 active tasks \xB7 drift 0.2%</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 4 4 4 2-4 4-4"/></svg></span></button>
            </div>
          </article>

          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--giallo);">
            <div style="display:flex;gap:4px;margin-bottom:var(--space-sm)"><span style="width:8px;height:8px;border-radius:50%;background:#DC0000"></span><span style="width:8px;height:8px;border-radius:50%;background:#FFC72C"></span><span style="width:8px;height:8px;border-radius:50%;background:#00A651"></span></div>
            <div class="mn-mesh-node__header">
              <span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 19.5c-.9 1.3-1.9 2.5-3.4 2.5-1.5 0-2-.9-3.7-.9-1.8 0-2.3.9-3.7.9-1.5 0-2.6-1.3-3.5-2.6C2.7 16.8 1.6 13 3.2 10.3c.8-1.4 2.3-2.3 3.9-2.3 1.5 0 2.4 1 3.6 1s2.3-1 3.9-1c1.3 0 2.6.7 3.5 2-3.1 1.7-2.6 6.1.6 7.5zM15.4 2c.1 1.5-.4 3-1.4 4.1-.9 1-2.3 1.8-3.6 1.7-.2-1.4.5-2.9 1.4-3.9C12.7 2.8 14.2 2.1 15.4 2z"/></svg></span>
              <h4 class="mn-mesh-node__name">M3-MAX</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">\u25CF Coordinator \xB7 Local</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
              <span class="mn-mesh-badge mn-mesh-badge--ollama">Ollama</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 31%"></span></span>
              <span class="mn-mesh-bar__label">31%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 74%"></span></span>
              <span class="mn-mesh-bar__label">74%</span>
            </div>
            <p class="mn-mesh-node__stats">5 active tasks \xB7 2 delegated \xB7 sync 98%</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg></span></button>
            </div>
          </article>

          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--azzurro-chiaro, #4EA8DE);">
            <div style="display:flex;gap:4px;margin-bottom:var(--space-sm)"><span style="width:8px;height:8px;border-radius:50%;background:#DC0000"></span><span style="width:8px;height:8px;border-radius:50%;background:#FFC72C"></span><span style="width:8px;height:8px;border-radius:50%;background:#00A651"></span></div>
            <div class="mn-mesh-node__header">
              <span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2C10.8 2 9.6 3.4 9.1 5.2c-.6-.2-1.3-.1-1.7.4C6.8 6.3 7 7.3 7.4 8c-.7.8-1.1 1.9-1.1 3.1 0 1.8.6 3.3 1.5 4.2l-.6 3c-.2.8-.5 1.7-.1 2.5.4.7 1.2 1.2 2 1.2h6.6c.8 0 1.6-.5 2-1.2.4-.8.1-1.7-.1-2.5l-.6-3c.9-.9 1.5-2.4 1.5-4.2 0-1.2-.4-2.3-1.1-3.1.4-.7.6-1.7 0-2.4-.4-.5-1.1-.6-1.7-.4C15.2 3.4 14 2 12.5 2zM10 10.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-4 3.5c0 0 .7 1 1.5 1s1.5-1 1.5-1"/></svg></span>
              <h4 class="mn-mesh-node__name">OMARCHY</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">\u25CF Worker \xB7 Remote</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 1%"></span></span>
              <span class="mn-mesh-bar__label">1%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 63%"></span></span>
              <span class="mn-mesh-bar__label">63%</span>
            </div>
            <p class="mn-mesh-node__stats">0 active tasks \xB7 cold standby \xB7 latency 21ms</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.5A4 4 0 1 1 18 18Z"/></svg></span></button>
            </div>
          </article>

          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--verde-racing);">
            <div style="display:flex;gap:4px;margin-bottom:var(--space-sm)"><span style="width:8px;height:8px;border-radius:50%;background:#DC0000"></span><span style="width:8px;height:8px;border-radius:50%;background:#FFC72C"></span><span style="width:8px;height:8px;border-radius:50%;background:#00A651"></span></div>
            <div class="mn-mesh-node__header">
              <span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12V6.5l8-1.1V12H3zm0 .5h8v6.6l-8-1.1V12.5zm9 0h9V21l-9-1.2V12.5zM12 12V5.3L21 4v8H12z"/></svg></span>
              <h4 class="mn-mesh-node__name">SURFACE-PRO</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">\u25CF Worker \xB7 Remote</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 22%"></span></span>
              <span class="mn-mesh-bar__label">22%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 55%"></span></span>
              <span class="mn-mesh-bar__label">55%</span>
            </div>
            <p class="mn-mesh-node__stats">1 active task \xB7 sync 99%</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg></span></button>
              <button class="mn-mesh-action"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 4 4 4 2-4 4-4"/></svg></span></button>
            </div>
          </article>
        </div>

        <div class="mn-mesh-network__footer mn-mesh-network__bottom">
          <span class="mn-mesh-network__title"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mn-accent)"><path d="M12 2l6 10-6 10-6-10z"/></svg></span> AUGMENTED BRAIN</span>
          <span class="mn-mesh-node__stats">4/4 online \xB7 8 sessions \xB7 2 plans \xB7 12 tasks \xB7 36 synapses</span>
        </div>
      </div>
    </section>
  `;
  }
  function createMeshNetworkSection() {
    const template = document.createElement("template");
    template.innerHTML = meshNetworkSection().trim();
    const section = template.content.firstElementChild;
    section.classList.add("mn-section-dark");
    section.innerHTML = `<div class="mn-container">${section.innerHTML}</div>`;
    return section;
  }

  // demo/sections/convergio.js
  function convergioSection() {
    return `
    <section class="demo-section" id="convergio">
      <h2 class="demo-section__title"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mn-accent)"><path d="M12 2l6 10-6 10-6-10z"/></svg></span> Convergio Dashboard</h2>
      <p class="demo-section__desc">Agentic AI orchestration components \u2014 toolbars, mission cards, night agents, and the Idea Jar.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">\u27E8/\u27E9 Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;article class="mn-mission-card"&gt;&lt;p class="mn-mission-card__title"&gt;Mission&lt;/p&gt;&lt;/article&gt;
&lt;article class="mn-night-agent"&gt;
  &lt;div class="mn-night-agent__header"&gt;&lt;p class="mn-mission-card__title"&gt;Night Agent&lt;/p&gt;&lt;/div&gt;
&lt;/article&gt;</code></pre>
      </details>

      <div class="mn-convergio-toolbar">
        <div class="mn-convergio-toolbar__nav">
          <button class="mn-convergio-pill mn-convergio-pill--active"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20v-3"/></svg></span> OVERVIEW</button>
          <button class="mn-convergio-pill"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.2a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9h.2a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.2a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z"/></svg></span> ADMIN</button>
          <button class="mn-convergio-pill"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg></span> PLANNER</button>
          <button class="mn-convergio-pill"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 7a3 3 0 0 1 6 0"/><path d="M8 7a3 3 0 0 0-3 3 3 3 0 0 0 1 5 3 3 0 0 0 4 4h4a3 3 0 0 0 4-4 3 3 0 0 0 1-5 3 3 0 0 0-3-3"/><path d="M12 7v12"/></svg></span> BRAIN</button>
          <button class="mn-convergio-pill"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12c.7.6 1.2 1.3 1.5 2h5c.3-.7.8-1.4 1.5-2A7 7 0 0 0 12 2z"/></svg></span> IDEA JAR</button>
        </div>
        <div class="mn-convergio-toolbar__brand">MARANELLO LUCE</div>
        <div class="mn-convergio-toolbar__status">
          <span class="mn-convergio-toolbar__dot"></span>
          <span class="mn-convergio-toolbar__dot mn-convergio-toolbar__dot--warning"></span>
          <span class="mn-optimize-badge">OPTIMIZE <span class="mn-optimize-badge__count">57</span></span>
          <span>14 Mar 2026 \xB7 10:17</span>
        </div>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mn-accent)"><path d="M12 2l6 10-6 10-6-10z"/></svg></span> ACTIVE MISSIONS</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-md);">
        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">F-128</p>
              <p class="mn-mission-card__title">Enterprise Intake Autopilot</p>
            </div>
            <span class="mn-mission-status mn-mission-status--progress">In Progress</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 72"></span>
            <div class="mn-mission-progress-bar">
              <span>72% complete \xB7 18/25 tasks \xB7 SLA 4h 12m</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:72%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Agents: Planner, Validator, Reviewer \xB7 Budget burn: $1,840/day</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--delegate">Delegate</button>
            <button class="mn-mission-btn">Inspect</button>
            <button class="mn-mission-btn mn-mission-btn--cancel">Pause</button>
          </div>
        </article>

        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">OPS-73</p>
              <p class="mn-mission-card__title">Global Support Deflection Copilot</p>
            </div>
            <span class="mn-mission-status mn-mission-status--done">Healthy</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 96"></span>
            <div class="mn-mission-progress-bar">
              <span>96% complete \xB7 48/50 intents covered \xB7 CSAT 4.8/5</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:96%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Volume: 12.4k chats/day \xB7 Automation rate: 81% \xB7 Escalations: 2.1%</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--start">Runbook</button>
            <button class="mn-mission-btn">Metrics</button>
            <button class="mn-mission-btn mn-mission-btn--reset">Recalibrate</button>
          </div>
        </article>

        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">RISK-22</p>
              <p class="mn-mission-card__title">Contract Drift Sentinel</p>
            </div>
            <span class="mn-mission-status mn-mission-status--failed">At Risk</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 41"></span>
            <div class="mn-mission-progress-bar">
              <span>41% complete \xB7 7 unresolved policy checks \xB7 3 blocked dependencies</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:41%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Critical: GDPR retention mapping pending legal sign-off</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--delegate">Escalate</button>
            <button class="mn-mission-btn">Open Board</button>
            <button class="mn-mission-btn mn-mission-btn--cancel">Abort Run</button>
          </div>
        </article>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg></span> NIGHTLY JOBS</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-md);">
        <article class="mn-night-agent">
          <div class="mn-night-agent__header">
            <p class="mn-mission-card__title">Data Lake Agent</p>
            <span class="mn-night-agent__toggle" data-on="true">ON</span>
          </div>
          <p class="mn-night-agent__schedule">
            <span>Scope: CRM + ERP mirrors into analytics lake</span>
            <span>Schedule: 02:00 CET \xB7 weekdays</span>
            <span>Last run: 37m \xB7 1.8M rows synced \xB7 0 drift alerts</span>
          </p>
          <div class="mn-night-agent__actions">
            <button class="mn-night-agent__action">Run Now</button>
            <button class="mn-night-agent__action">View Log</button>
            <button class="mn-night-agent__action">Edit Window</button>
          </div>
        </article>

        <article class="mn-night-agent">
          <div class="mn-night-agent__header">
            <p class="mn-mission-card__title">Process Optimizer</p>
            <span class="mn-night-agent__toggle" data-on="true">ON</span>
          </div>
          <p class="mn-night-agent__schedule">
            <span>Scope: Rebuild process maps + suggest automation opportunities</span>
            <span>Schedule: 03:30 CET \xB7 daily</span>
            <span>Last run: 112 workflows scored \xB7 14 high-impact ideas generated</span>
          </p>
          <div class="mn-night-agent__actions">
            <button class="mn-night-agent__action">Preview Queue</button>
            <button class="mn-night-agent__action">Approve Batch</button>
            <button class="mn-night-agent__action">Settings</button>
          </div>
        </article>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12c.7.6 1.2 1.3 1.5 2h5c.3-.7.8-1.4 1.5-2A7 7 0 0 0 12 2z"/></svg></span> Idea Jar</h3>
      <div class="mn-idea-jar">
        <div class="mn-idea-jar__lid"></div>
        <div class="mn-idea-jar__vessel">
          <span class="mn-idea-jar__idea"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mn-accent)" stroke-width="1.5" stroke-linecap="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg></span></span>
          <span class="mn-idea-jar__idea"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mn-accent)" stroke-width="1.5" stroke-linecap="round"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/></svg></span></span>
          <span class="mn-idea-jar__idea"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mn-accent)" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><path d="M12 5v14"/><path d="M5 12h14"/></svg></span></span>
          <span class="mn-idea-jar__idea"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg></span></span>
          <span class="mn-idea-jar__idea"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mn-accent)" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5"/></svg></span></span>
        </div>
        <div class="mn-idea-jar__count">23</div>
        <div class="mn-idea-jar__label">Ideas Captured</div>
        <button class="mn-idea-jar__add-btn">+ Add Idea</button>
      </div>
    </section>
  `;
  }
  function createConvergioSection() {
    const template = document.createElement("template");
    template.innerHTML = convergioSection().trim();
    const section = template.content.firstElementChild;
    section.classList.add("mn-section-dark");
    section.innerHTML = `<div class="mn-container">${section.innerHTML}</div>`;
    return section;
  }

  // import("../../src/wc/**/*.js") in demo/sections/web-components.js
  var globImport_src_wc_js = __glob({
    "../../src/wc/mn-a11y-fallback.js": () => Promise.resolve().then(() => (init_mn_a11y_fallback(), mn_a11y_fallback_exports)),
    "../../src/wc/mn-a11y.js": () => Promise.resolve().then(() => (init_mn_a11y(), mn_a11y_exports)),
    "../../src/wc/mn-chart.js": () => Promise.resolve().then(() => (init_mn_chart(), mn_chart_exports)),
    "../../src/wc/mn-chat.js": () => Promise.resolve().then(() => (init_mn_chat(), mn_chat_exports)),
    "../../src/wc/mn-command-palette.js": () => Promise.resolve().then(() => (init_mn_command_palette(), mn_command_palette_exports)),
    "../../src/wc/mn-data-table.js": () => Promise.resolve().then(() => (init_mn_data_table(), mn_data_table_exports)),
    "../../src/wc/mn-date-picker.js": () => Promise.resolve().then(() => (init_mn_date_picker(), mn_date_picker_exports)),
    "../../src/wc/mn-detail-panel.js": () => Promise.resolve().then(() => (init_mn_detail_panel(), mn_detail_panel_exports)),
    "../../src/wc/mn-ferrari-control.js": () => Promise.resolve().then(() => (init_mn_ferrari_control(), mn_ferrari_control_exports)),
    "../../src/wc/mn-funnel.js": () => Promise.resolve().then(() => (init_mn_funnel(), mn_funnel_exports)),
    "../../src/wc/mn-gantt.js": () => Promise.resolve().then(() => (init_mn_gantt(), mn_gantt_exports)),
    "../../src/wc/mn-gauge.js": () => Promise.resolve().then(() => (init_mn_gauge(), mn_gauge_exports)),
    "../../src/wc/mn-hbar.js": () => Promise.resolve().then(() => (init_mn_hbar(), mn_hbar_exports)),
    "../../src/wc/mn-login.js": () => Promise.resolve().then(() => (init_mn_login(), mn_login_exports)),
    "../../src/wc/mn-map.js": () => Promise.resolve().then(() => (init_mn_map(), mn_map_exports)),
    "../../src/wc/mn-mapbox.js": () => Promise.resolve().then(() => (init_mn_mapbox(), mn_mapbox_exports)),
    "../../src/wc/mn-modal.js": () => Promise.resolve().then(() => (init_mn_modal(), mn_modal_exports)),
    "../../src/wc/mn-okr.js": () => Promise.resolve().then(() => (init_mn_okr(), mn_okr_exports)),
    "../../src/wc/mn-profile.js": () => Promise.resolve().then(() => (init_mn_profile(), mn_profile_exports)),
    "../../src/wc/mn-speedometer.js": () => Promise.resolve().then(() => (init_mn_speedometer(), mn_speedometer_exports)),
    "../../src/wc/mn-system-status.js": () => Promise.resolve().then(() => (init_mn_system_status(), mn_system_status_exports)),
    "../../src/wc/mn-tabs.js": () => Promise.resolve().then(() => (init_mn_tabs(), mn_tabs_exports)),
    "../../src/wc/mn-theme-toggle.js": () => Promise.resolve().then(() => (init_mn_theme_toggle(), mn_theme_toggle_exports)),
    "../../src/wc/mn-toast.js": () => Promise.resolve().then(() => (init_mn_toast(), mn_toast_exports))
  });

  // demo/sections/web-components.js
  var WC_MODULES = ["mn-a11y", "mn-chart", "mn-chat", "mn-command-palette", "mn-data-table", "mn-date-picker", "mn-detail-panel", "mn-ferrari-control", "mn-funnel", "mn-gantt", "mn-gauge", "mn-hbar", "mn-login", "mn-map", "mn-mapbox", "mn-modal", "mn-okr", "mn-profile", "mn-speedometer", "mn-system-status", "mn-tabs", "mn-theme-toggle", "mn-toast"];
  var SMALL_TABLE_COLUMNS = esc4(JSON.stringify([{ key: "program", label: "Pipeline" }, { key: "status", label: "Status", type: "status" }]));
  var SMALL_TABLE_ROWS = esc4(JSON.stringify([{ program: "Pipeline Alpha", status: "Active" }, { program: "Pipeline Beta", status: "Planned" }]));
  var GANTT_TASKS = esc4(JSON.stringify([{ id: "g1", title: "Route", start: "2026-04-01", end: "2026-04-06", progress: 1, color: "#FFC72C" }, { id: "g2", title: "Infer", start: "2026-04-07", end: "2026-04-20", progress: 0.72, color: "#4EA8DE", dependencies: ["g1"] }]));
  var OKR_OBJECTIVES = esc4(JSON.stringify([{ title: "Reduce latency", progress: 78, status: "on-track", keyResults: [{ title: "Keep p95 under 180 ms", current: 172, target: 180 }] }]));
  var OKR_OPTIONS = esc4(JSON.stringify({ title: "Spring OKR", period: "Q2 2026" }));
  var MAP_MARKERS2 = esc4(JSON.stringify([{ id: "m1", lat: 38.9, lon: -77.04, label: "us-east-1", detail: "Primary routing mesh", color: "#FFC72C", size: 8 }, { id: "m2", lat: 53.35, lon: -6.26, label: "eu-west-1", detail: "Evaluation cluster", color: "#00A651", size: 8 }]));
  var PROFILE_SECTIONS = esc4(JSON.stringify([{ items: [{ label: "Runtime overview" }, { label: "Settings" }] }, { items: [{ label: "Switch theme" }, { label: "Sign out" }] }]));
  var DETAIL_SECTIONS = esc4(JSON.stringify({ data: { region: "us-east-1", pipeline: "Pipeline Alpha", readiness: "Ready" } }));
  var COMMAND_ITEMS = esc4(JSON.stringify([{ text: "Open routing board", icon: "\u25A0" }, { text: "Jump to eu-west-1", icon: "\u2318" }, { text: "Launch eval pack", icon: "\u25C6" }]));
  var HBAR_DATA = esc4(JSON.stringify([{ label: "Opus", value: 82 }, { label: "Sonnet", value: 68 }]));
  var FUNNEL_STAGES2 = esc4(JSON.stringify([{ label: "Draft", value: 120 }, { label: "Validated", value: 84 }, { label: "Running", value: 56 }]));
  var GROUPS = [
    { title: "Charts", items: [
      { tag: "mn-chart", desc: "Canvas chart host for sparkline snapshots and dashboard trends.", size: "wide", preview: `<mn-chart type="sparkline" width="220" height="64" data='[72,78,76,88,94,91,99]'></mn-chart>` },
      { tag: "mn-gauge", desc: "Ferrari-inspired dial for readiness, utilization, or routing confidence.", preview: `<mn-gauge value="78" max="100" unit="%" label="Readiness" size="sm"></mn-gauge>` },
      { tag: "mn-speedometer", desc: "Needle instrument for pace, throughput, or agent load.", preview: `<mn-speedometer value="84" max="120" unit="" label="Flow" size="sm"></mn-speedometer>` },
      { tag: "mn-hbar", desc: "Horizontal bar comparisons for model performance and team load.", size: "wide", preview: `<mn-hbar data='${HBAR_DATA}' options='{"unit":"%"}'></mn-hbar>` },
      { tag: "mn-funnel", desc: "Draft-to-runtime funnel with conversion-aware stages.", size: "wide", preview: `<mn-funnel stages='${FUNNEL_STAGES2}' show-conversion></mn-funnel>` },
      { tag: "mn-gantt", desc: "Interactive timeline for regional launches and pipeline phases.", size: "wide", preview: `<mn-gantt tasks='${GANTT_TASKS}' zoom="18" label-width="100"></mn-gantt>` },
      { tag: "mn-okr", desc: "Objective cards with key-result progress and portfolio framing.", size: "tall", preview: `<mn-okr objectives='${OKR_OBJECTIVES}' options='${OKR_OPTIONS}'></mn-okr>` },
      { tag: "mn-map", desc: "Canvas map for region locations and routing clusters.", size: "wide", preview: `<mn-map markers='${MAP_MARKERS2}' center='[0,25]' zoom="1"></mn-map>` },
      { tag: "mn-mapbox", desc: "Mapbox GL surface for token-enabled geographic storytelling.", size: "wide", preview: `<div class="mn-tag mn-tag--light mn-tag--xs" style="position:absolute;top:10px;right:10px">token-ready</div><mn-mapbox center="0,25" zoom="1" markers='[]' style="display:block;height:96px;border-radius:12px;background:linear-gradient(135deg,#1f1f1f,#101010)"></mn-mapbox>` }
    ] },
    { title: "Controls", items: [
      { tag: "mn-ferrari-control", desc: "Cockpit-grade control wrapper for slider, rotary, and lever inputs.", preview: `<mn-ferrari-control type="slider" options='{"label":"Budget","min":0,"max":100,"value":72}'></mn-ferrari-control>` },
      { tag: "mn-theme-toggle", desc: "Cycles the four demo themes with a compact branded switch.", preview: `<mn-theme-toggle mode="nero"></mn-theme-toggle>` },
      { tag: "mn-date-picker", desc: "Date selector with min/max rules and deployment windows.", preview: `<mn-date-picker value="2026-04-14" min="2026-04-01" max="2026-05-31"></mn-date-picker>` },
      { tag: "mn-command-palette", desc: "Keyboard-first action launcher for quick navigation and commands.", preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-palette">Open palette</button><mn-command-palette id="wc-palette" items='${COMMAND_ITEMS}' placeholder="Type a command"></mn-command-palette>` },
      { tag: "mn-a11y", desc: "Floating accessibility hub for contrast, motion, and focus settings.", preview: `<div class="mn-micro" style="color:var(--grigio-chiaro);text-align:center">Floating FAB preview</div><mn-a11y></mn-a11y>` }
    ] },
    { title: "Data", items: [
      { tag: "mn-data-table", desc: "Sortable data table for compact pipeline snapshots.", size: "wide", preview: `<mn-data-table columns='${SMALL_TABLE_COLUMNS}' data='${SMALL_TABLE_ROWS}' page-size="2" compact></mn-data-table>` },
      { tag: "mn-system-status", desc: "Operational pill and panel for runtime services and integrations.", preview: `<mn-system-status services='[{"name":"Gateway"},{"name":"Model Router"}]' poll-interval="0" version="v3.2" environment="demo"></mn-system-status>` },
      { tag: "mn-profile", desc: "Avatar-triggered user menu for operators and model owners.", preview: `<mn-profile name="Agent Opus" email="agent.opus@maranelloluce.ai" sections='${PROFILE_SECTIONS}'><div style="width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--mn-accent);color:#111;font-weight:700">AO</div></mn-profile>` },
      { tag: "mn-login", desc: "SSO-ready sign-in shell with optional health signals.", size: "tall", preview: `<mn-login title="Maranello Luce Ops" subtitle="Agent Portal"></mn-login>` }
    ] },
    { title: "Layout", items: [
      { tag: "mn-tabs", desc: "Tabbed interface container for dashboard subsections.", preview: `<mn-tabs active="0"><mn-tab label="Overview"><p class="mn-micro">us-east-1 / 18 live runs</p></mn-tab><mn-tab label="Risk"><p class="mn-micro">2 validators need follow-up</p></mn-tab></mn-tabs>` },
      { tag: "mn-tab", desc: "Child panel element used to label and slot tab content.", preview: `<mn-tabs active="0"><mn-tab label="Runtime"><p class="mn-micro">A single lane powering the parent tabs shell.</p></mn-tab></mn-tabs>` },
      { tag: "mn-detail-panel", desc: "Slide-over inspection panel for pipeline metadata.", preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-detail">Open detail</button><mn-detail-panel id="wc-detail" title="Pipeline detail" sections='${DETAIL_SECTIONS}'></mn-detail-panel>` },
      { tag: "mn-modal", desc: "Modal dialog for confirmations, alerts, and quick approvals.", preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-modal">Open modal</button><mn-modal id="wc-modal" title="Release review">The us-east-1 deployment lane is ready for final sign-off.</mn-modal>` }
    ] },
    { title: "Interactive", items: [
      { tag: "mn-toast", desc: "Auto-dismissing toast notifications for operator feedback.", preview: `<button class="mn-btn mn-btn--ghost" data-toast>Spawn toast</button><div class="mn-wc-toast-stack"></div>` },
      { tag: "mn-chat", desc: "Conversational assistant surface for pipeline support and routing triage.", size: "tall", preview: `<div class="mn-card-dark" style="width:100%;padding:var(--space-lg);max-height:200px;overflow:hidden"><div style="display:flex;flex-direction:column;gap:var(--space-sm)"><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Maranello Luce Copilot</div><div style="padding:var(--space-sm) var(--space-md);background:rgba(78,168,222,0.15);border-radius:12px 12px 12px 4px;max-width:85%"><span class="mn-micro" style="color:var(--grigio-chiaro)">How many canary slots are available?</span></div><div style="padding:var(--space-sm) var(--space-md);background:rgba(255,199,44,0.1);border-radius:12px 12px 4px 12px;max-width:85%;align-self:flex-end"><span class="mn-micro" style="color:var(--grigio-chiaro)">eu-west-1 has 6 canary slots free.</span></div></div></div>` }
    ] }
  ];
  function createWebComponentsSection() {
    const section = document.createElement("section");
    section.id = "web-components";
    section.className = "mn-section-light";
    section.innerHTML = `
    <style>
      #web-components .mn-wc-group{margin-bottom:var(--space-2xl)}
      #web-components .mn-wc-preview{position:relative;display:grid;place-items:center;min-height:120px;padding:var(--space-md);border:1px solid var(--grigio-scuro);border-radius:var(--radius-lg);background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));overflow:hidden}
      #web-components .mn-wc-preview--wide{min-height:150px;align-items:stretch}
      #web-components .mn-wc-preview--tall{min-height:180px;align-items:stretch}
      #web-components .mn-wc-preview :is(mn-chart,mn-data-table,mn-funnel,mn-gantt,mn-hbar,mn-login,mn-map,mn-mapbox,mn-okr){display:block;width:100%}
      #web-components .mn-wc-toast-stack{display:grid;gap:var(--space-sm);justify-items:center;margin-top:var(--space-sm)}
      #web-components .mn-wc-meta{display:grid;gap:6px}
    </style>
    <div class="mn-container"><p class="mn-section-number">14 \u2014 Web Components</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">24 Web Components / Catalog View</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">A complete Maranello Luce-flavored catalog of the <code>mn-*</code> layer: charts, controls, data surfaces, layout shells, and interactive widgets.</p>${GROUPS.map(groupBlock).join("")}</div>`;
    requestAnimationFrame(() => initCatalog(section));
    return section;
  }
  function groupBlock(group) {
    return `<div class="mn-wc-group"><div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-end;flex-wrap:wrap;margin-bottom:var(--space-lg)"><h3 class="mn-title-sub" style="margin:0">${group.title}</h3><span class="mn-tag mn-tag--xs">${group.items.length} components</span></div><div class="mn-grid-3">${group.items.map(card).join("")}</div></div>`;
  }
  function card(item) {
    return `<article class="mn-card-dark" style="padding:var(--space-lg)"><div class="mn-wc-preview mn-wc-preview--${item.size || "base"}">${item.preview}</div><div class="mn-wc-meta" style="margin-top:var(--space-md)"><code class="mn-micro" style="color:var(--mn-accent)">&lt;${item.tag}&gt;</code><p class="mn-card__text">${item.desc}</p></div></article>`;
  }
  async function initCatalog(section) {
    await Promise.all(WC_MODULES.map((name) => globImport_src_wc_js(`../../src/wc/${name}.js`).catch(() => null)));
    section.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-open");
      if (!targetId) return;
      const target = section.querySelector(`#${targetId}`);
      if (!target) return;
      if (typeof target.open === "function") {
        target.open();
        return;
      }
      if (typeof target.show === "function") {
        target.show();
        return;
      }
      if (typeof target.toggle === "function") {
        target.toggle(true);
        return;
      }
      target.setAttribute("open", "");
    }));
    section.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => {
      const stack = button.parentElement?.querySelector(".mn-wc-toast-stack");
      if (!stack) return;
      const toast = document.createElement("mn-toast");
      toast.setAttribute("title", "Runbook synced");
      toast.setAttribute("message", "Pipeline Alpha state refreshed across the runtime board.");
      toast.setAttribute("type", "success");
      toast.setAttribute("duration", "2600");
      stack.appendChild(toast);
    }));
  }
  function esc4(value) {
    return String(value).replace(/'/g, "&#39;");
  }

  // demo/sections/launch.js
  function createLaunchSection() {
    const section = document.createElement("section");
    section.id = "launch";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <section style="min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--arancio-caldo,#FF8A3D),var(--rosso-corsa));padding:var(--space-3xl) 0">
      <div style="position:absolute;inset:auto 0 12%;text-align:center;font-family:var(--font-display);font-size:clamp(5rem,18vw,14rem);font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.08);pointer-events:none">LAUNCH</div>
      <div class="mn-container" style="position:relative;z-index:1;text-align:center;color:var(--bianco-caldo)">
        <div class="mn-label" style="color:rgba(255,255,255,.72);margin-bottom:var(--space-sm)">OPEN SOURCE DASHBOARD KIT</div>
        <h2 class="mn-title-section" style="margin-bottom:var(--space-md);color:var(--bianco-caldo)">READY TO EXPLORE?</h2>
        <p class="mn-body" style="max-width:640px;margin:0 auto var(--space-2xl);color:rgba(255,255,255,.88)">Maranello Luce Design is open source. Build beautiful dashboards today.</p>
        <div style="display:flex;justify-content:center;gap:var(--space-md);flex-wrap:wrap">
          <a href="#api-reference" class="mn-btn" style="background:var(--bianco-caldo);color:var(--nero-assoluto);border-color:var(--bianco-caldo)">GET STARTED</a>
          <a href="https://github.com/Roberdan/MaranelloLuceDesign" class="mn-btn" style="background:transparent;color:var(--bianco-caldo);border:1px solid rgba(255,255,255,.72)">VIEW ON GITHUB</a>
        </div>
      </div>
    </section>`;
    return section;
  }

  // demo/sections/accessibility.js
  var STORAGE_KEY = "mn-a11y-settings";
  var STYLE_ID = "mn-a11y-demo-style";
  var FONT_ID = "mn-a11y-demo-font";
  var FAB_ID = "mn-a11y-demo-fab";
  var FLOAT_ID = "mn-a11y-demo-floating";
  var VOICES = ["Balanced Voice", "Calm Guide", "Clarity Boost", "Low Stimulation"];
  var PROFILES2 = [
    { id: "dyslexia", label: "Dyslexia", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"/></svg>', tone: "#448AFF", flags: ["dyslexiaFont", "largeText", "highSpacing"] },
    { id: "adhd", label: "ADHD", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', tone: "#8B5CF6", flags: ["reducedMotion", "focusIndicators", "mutedColors"] },
    { id: "visual", label: "Visual", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', tone: "#FFB300", flags: ["highContrast", "largeText", "focusIndicators"] },
    { id: "motor", label: "Motor", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 012 2v7.1a2 2 0 01-.6 1.4L15 23"/><path d="M6 15a2 2 0 00-2 2v0a2 2 0 002 2h12"/></svg>', tone: "#00A651", flags: ["largerClickTargets", "reducedMotion"] },
    { id: "autism", label: "Autism", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', tone: "#14B8A6", flags: ["reducedMotion", "mutedColors", "consistentLayout"] },
    { id: "hearing", label: "Hearing", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 15l6-6 4 4 8-8"/><line x1="2" y1="2" x2="22" y2="22" stroke-width="2"/></svg>', tone: "#F43F5E", flags: ["visualAlerts", "captionsPreference"] },
    { id: "motor-plus", label: "Motor+", icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>', tone: "#16A34A", flags: ["largerClickTargets", "reducedMotion", "keyboardOnly"] }
  ];
  var TOGGLES = [["largeText", "Large Text"], ["highContrast", "High Contrast"], ["reducedMotion", "Reduced Motion"], ["dyslexiaFont", "Dyslexia Font"], ["focusIndicators", "Focus Indicators"]];
  var BODY_CLASSES = { largeText: "mn-a11y-large-text", highContrast: "mn-a11y-high-contrast", reducedMotion: "mn-a11y-reduced-motion", dyslexiaFont: "mn-a11y-dyslexia-font", focusIndicators: "mn-a11y-focus", highSpacing: "mn-a11y-high-spacing", largerClickTargets: "mn-a11y-click-targets", mutedColors: "mn-a11y-muted-colors", consistentLayout: "mn-a11y-consistent-layout", visualAlerts: "mn-a11y-visual-alerts", captionsPreference: "mn-a11y-captions", keyboardOnly: "mn-a11y-keyboard-only" };
  function createAccessibilitySection() {
    ensureStyles();
    const state = loadState();
    const section = document.createElement("section");
    section.id = "accessibility";
    section.className = "mn-section-light";
    section.setAttribute("aria-label", "Accessibility Settings");
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">15 \u2014 Accessibility</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Accessibility</h2>
      <p class="mn-body" style="margin-bottom:var(--space-lg)">Accessibility controls with quick profiles, focused toggles, a themed voice selector, and a persistent gold FAB.</p>
      <p class="mn-micro" style="margin-bottom:var(--space-xl);color:var(--grigio-medio)">The live panel is shown inline below for preview, while the floating action button opens the same interface as a slide-up overlay from the bottom-right.</p>
      <div class="mn-a11y-demo-stage">${panelMarkup("inline")}</div>
    </div>`;
    requestAnimationFrame(() => mountSection(section, state));
    return section;
  }
  function mountSection(section, state) {
    const floating = mountFloatingPanel();
    const fab = mountFab();
    const panels = [section.querySelector('[data-a11y-panel="inline"]'), floating].filter(Boolean);
    panels.forEach((panel) => {
      initVoiceDropdown(panel);
      panel.addEventListener("click", (event) => handlePanelClick(event, state, { fab, floating }));
    });
    fab.addEventListener("click", () => toggleFloating(floating, fab, !floating.classList.contains("mn-a11y-demo-panel--open")));
    document.addEventListener("click", (event) => {
      if (!floating.classList.contains("mn-a11y-demo-panel--open")) return;
      if (floating.contains(event.target) || fab.contains(event.target)) return;
      toggleFloating(floating, fab, false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleFloating(floating, fab, false);
    });
    const syncPosition = () => positionFloating(fab, floating);
    syncPosition();
    window.addEventListener("resize", syncPosition, { passive: true });
    render(state, panels, fab);
  }
  function handlePanelClick(event, state, ctx) {
    const profile = event.target.closest("[data-profile]");
    const toggle2 = event.target.closest("[data-toggle]");
    const option = event.target.closest("[data-voice-option]");
    if (profile) state.profiles = state.profiles.includes(profile.dataset.profile) ? state.profiles.filter((id) => id !== profile.dataset.profile) : [...state.profiles, profile.dataset.profile];
    if (toggle2) {
      const next = !derive(state)[toggle2.dataset.toggle];
      state.manual[toggle2.dataset.toggle] = next;
    }
    if (option) state.voice = option.dataset.voice;
    if (event.target.closest("[data-reset]")) resetState(state);
    if (event.target.closest("[data-close]") && !event.target.disabled) toggleFloating(ctx.floating, ctx.fab, false);
    render(state, document.querySelectorAll("[data-a11y-panel]"), ctx.fab);
  }
  function render(state, panels, fab) {
    const effective = derive(state);
    saveState(state);
    applyBodySettings(effective);
    panels.forEach((panel) => {
      panel.querySelectorAll("[data-profile]").forEach((button) => button.classList.toggle("mn-a11y-demo-profile--active", state.profiles.includes(button.dataset.profile)));
      panel.querySelectorAll("[data-toggle]").forEach((button) => {
        const on = effective[button.dataset.toggle];
        button.classList.toggle("mn-a11y-demo-switch--on", on);
        button.setAttribute("aria-checked", String(on));
      });
      const trigger = panel.querySelector("[data-voice-label]");
      if (trigger) trigger.textContent = `${state.voice} `;
      panel.querySelectorAll("[data-voice-option]").forEach((button) => {
        const active = button.dataset.voice === state.voice;
        button.classList.toggle("mn-dropdown__item--active", active);
        button.setAttribute("aria-selected", String(active));
      });
      const summary = panel.querySelector("[data-summary]");
      if (summary) summary.textContent = summaryText(state, effective);
    });
    fab.classList.toggle("mn-a11y-demo-fab--active", document.getElementById(FLOAT_ID)?.classList.contains("mn-a11y-demo-panel--open"));
  }
  function panelMarkup(mode) {
    const inline = mode === "inline";
    return `<div class="mn-card-dark mn-a11y-demo-panel${inline ? " mn-a11y-demo-panel--inline" : ""}"${inline ? "" : ` id="${FLOAT_ID}" aria-modal="true"`} data-a11y-panel="${mode}" role="dialog" aria-label="Accessibility settings">
    <div class="mn-a11y-demo-header"><div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:4px">Accessibility Settings</p><p class="mn-micro">Profiles, quick settings, and a themed voice selector.</p></div><button class="mn-a11y-demo-close" type="button" data-close ${inline ? 'disabled aria-disabled="true" title="Inline preview stays visible"' : 'aria-label="Close accessibility settings"'}>${inline ? "\u2014" : "\xD7"}</button></div>
    <div class="mn-a11y-demo-label">Quick Profiles</div><div class="mn-a11y-demo-grid">${PROFILES2.map((item) => `<button class="mn-a11y-demo-profile" type="button" data-profile="${item.id}" style="--tone:${item.tone}"><span class="mn-a11y-demo-profile__icon">${item.icon}</span><span>${item.label}</span></button>`).join("")}</div>
    <div class="mn-a11y-demo-label">Quick Settings</div><div class="mn-a11y-demo-list">${TOGGLES.map(([id, label]) => `<div class="mn-a11y-demo-row"><span>${label}</span><button class="mn-a11y-demo-switch" type="button" data-toggle="${id}" role="switch" aria-checked="false" aria-label="${label}"><span></span></button></div>`).join("")}</div>
    <div class="mn-a11y-demo-label">Voice Selector</div>${voiceMarkup()}
    <div class="mn-a11y-demo-footer"><button class="mn-btn mn-btn--ghost mn-a11y-demo-reset" type="button" data-reset>Reset to Defaults</button><p class="mn-micro" data-summary></p></div>
  </div>`;
  }
  function voiceMarkup() {
    return `<div class="mn-dropdown mn-a11y-demo-voice" data-voice-dropdown><button class="mn-dropdown__trigger" type="button"><span data-voice-label>${VOICES[0]} </span></button><div class="mn-dropdown__menu">${VOICES.map((voice) => `<button class="mn-dropdown__item" type="button" data-voice-option data-voice="${voice}">${voice}</button>`).join("")}</div></div>`;
  }
  function mountFab() {
    document.getElementById(FAB_ID)?.remove();
    const fab = document.createElement("button");
    fab.id = FAB_ID;
    fab.className = "mn-a11y-demo-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Open accessibility settings");
    fab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h9M15 7l2.5-2.5M15 7l2.5 2.5M11 17H4M9 17l-2.5-2.5M9 17l-2.5 2.5M20 12H9M15 12l-2.5-2.5M15 12l-2.5 2.5"/></svg>`;
    document.body.appendChild(fab);
    return fab;
  }
  function mountFloatingPanel() {
    document.getElementById(FLOAT_ID)?.remove();
    const shell = document.createElement("div");
    shell.innerHTML = panelMarkup("floating");
    document.body.appendChild(shell.firstElementChild);
    return document.getElementById(FLOAT_ID);
  }
  function toggleFloating(panel, fab, open) {
    panel.classList.toggle("mn-a11y-demo-panel--open", open);
    fab.setAttribute("aria-expanded", String(open));
  }
  function positionFloating(fab, panel) {
    const chat = document.querySelector(".mn-chat-fab");
    const bottom = chat ? Math.max(92, Math.round(window.innerHeight - chat.getBoundingClientRect().top + 16)) : 24;
    fab.style.bottom = `${bottom}px`;
    panel.style.bottom = `${bottom + 64}px`;
  }
  function derive(state) {
    const profileFlags = Object.fromEntries(Object.keys(BODY_CLASSES).map((key) => [key, false]));
    state.profiles.forEach((id) => PROFILES2.find((profile) => profile.id === id)?.flags.forEach((flag) => {
      profileFlags[flag] = true;
    }));
    const merged = { ...profileFlags };
    Object.keys(state.manual).forEach((key) => {
      if (state.manual[key] !== null) merged[key] = state.manual[key];
    });
    return merged;
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch {
    }
    return normalizeState(seedFromMaranello());
  }
  function seedFromMaranello() {
    const seed = window.Maranello?.loadA11ySettings?.() || (() => {
      if (!window.Maranello?.a11yPanel) return null;
      try {
        const ctrl = window.Maranello.a11yPanel();
        const current = ctrl?.getSettings?.();
        ctrl?.destroy?.();
        return current;
      } catch {
        return null;
      }
    })();
    return { profiles: [], voice: VOICES[0], manual: { largeText: seed ? ["lg", "xl"].includes(seed.fontSize) : null, highContrast: seed?.highContrast ?? null, reducedMotion: seed?.reducedMotion ?? null, dyslexiaFont: null, focusIndicators: seed?.focusVisible ?? null } };
  }
  function normalizeState(value = {}) {
    return { profiles: Array.isArray(value.profiles) ? value.profiles : [], voice: VOICES.includes(value.voice) ? value.voice : VOICES[0], manual: { largeText: value.manual?.largeText ?? null, highContrast: value.manual?.highContrast ?? null, reducedMotion: value.manual?.reducedMotion ?? null, dyslexiaFont: value.manual?.dyslexiaFont ?? null, focusIndicators: value.manual?.focusIndicators ?? null } };
  }
  function resetState(state) {
    state.profiles = [];
    state.voice = VOICES[0];
    Object.keys(state.manual).forEach((key) => {
      state.manual[key] = null;
    });
  }
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }
  function applyBodySettings(effective) {
    Object.entries(BODY_CLASSES).forEach(([key, klass]) => document.body.classList.toggle(klass, Boolean(effective[key])));
    if (effective.dyslexiaFont && !document.getElementById(FONT_ID)) {
      const style = document.createElement("style");
      style.id = FONT_ID;
      style.textContent = "@font-face{font-family:'OpenDyslexic';font-style:normal;font-weight:400;font-display:swap;src:url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff2') format('woff2'),url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff') format('woff');}";
      document.head.appendChild(style);
    }
  }
  function summaryText(state, effective) {
    const labels = PROFILES2.filter((profile) => state.profiles.includes(profile.id)).map((profile) => profile.label);
    const flags = TOGGLES.filter(([key]) => effective[key]).map(([, label]) => label);
    const extra = [["highSpacing", "Higher spacing"], ["largerClickTargets", "Large click targets"], ["mutedColors", "Muted colors"], ["consistentLayout", "Consistent layout"], ["visualAlerts", "Visual alerts"], ["captionsPreference", "Captions preferred"], ["keyboardOnly", "Keyboard-only mode"]].filter(([key]) => effective[key]).map(([, label]) => label);
    const active = [...labels, ...flags, ...extra];
    return active.length ? `Active: ${active.join(" \xB7 ")} \xB7 Voice: ${state.voice}` : `Defaults active \xB7 Voice: ${state.voice}`;
  }
  function initVoiceDropdown(panel) {
    const dropdown = panel.querySelector("[data-voice-dropdown]");
    if (!dropdown) return;
    if (window.Maranello?.initDropdown) {
      window.Maranello.initDropdown(dropdown);
      return;
    }
    const trigger = dropdown.querySelector(".mn-dropdown__trigger");
    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdown.classList.toggle("mn-dropdown--open");
    });
    document.addEventListener("click", () => dropdown.classList.remove("mn-dropdown--open"));
  }
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
    .mn-a11y-demo-stage{max-width:720px}.mn-a11y-demo-panel{padding:var(--space-xl);border:1px solid var(--grigio-scuro);border-radius:var(--radius-xl);background:linear-gradient(180deg,#20201d,#121212);box-shadow:0 24px 48px rgba(0,0,0,.36);display:grid;gap:var(--space-md)}.mn-a11y-demo-panel--inline{position:relative}.mn-a11y-demo-panel:not(.mn-a11y-demo-panel--inline){position:fixed;right:24px;width:min(380px,calc(100vw - 32px));z-index:1050;opacity:0;transform:translateY(24px) scale(.98);pointer-events:none;transition:opacity .22s ease,transform .22s ease}.mn-a11y-demo-panel--open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.mn-a11y-demo-header,.mn-a11y-demo-row,.mn-a11y-demo-footer{display:flex;align-items:center;justify-content:space-between;gap:var(--space-md)}.mn-a11y-demo-header{align-items:flex-start}.mn-a11y-demo-label{font:600 var(--text-micro)/1 var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--giallo-ferrari)}.mn-a11y-demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-sm)}.mn-a11y-demo-profile{display:grid;justify-items:start;gap:6px;padding:14px;border:1px solid color-mix(in srgb,var(--tone) 54%,#fff 12%);border-radius:var(--radius-lg);background:linear-gradient(180deg,color-mix(in srgb,var(--tone) 30%,#111),color-mix(in srgb,var(--tone) 14%,#111));color:var(--bianco-caldo);font:600 var(--text-small)/1.2 var(--font-body);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);cursor:pointer}.mn-a11y-demo-profile--active{transform:translateY(-1px);box-shadow:0 0 0 2px color-mix(in srgb,var(--tone) 70%,#fff 18%),0 18px 28px rgba(0,0,0,.24)}.mn-a11y-demo-profile__icon{font-size:1.2rem}.mn-a11y-demo-list{display:grid;gap:var(--space-sm)}.mn-a11y-demo-row{padding:12px 14px;border:1px solid var(--grigio-scuro);border-radius:var(--radius-md);background:rgba(255,255,255,.03)}.mn-a11y-demo-switch,.mn-a11y-demo-close,.mn-a11y-demo-fab{border:none;cursor:pointer}.mn-a11y-demo-switch{width:48px;height:28px;border-radius:999px;background:rgba(255,255,255,.14);padding:3px;transition:background .2s ease}.mn-a11y-demo-switch span{display:block;width:22px;height:22px;border-radius:999px;background:#fff;transition:transform .2s ease}.mn-a11y-demo-switch--on{background:var(--giallo-ferrari)}.mn-a11y-demo-switch--on span{transform:translateX(20px);background:#111}.mn-a11y-demo-close{width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.06);color:var(--bianco-caldo);font-size:1.25rem}.mn-a11y-demo-close:disabled{opacity:.5;cursor:not-allowed}.mn-a11y-demo-footer{align-items:flex-end}.mn-a11y-demo-footer p{max-width:320px;text-align:right}.mn-a11y-demo-voice,.mn-a11y-demo-voice .mn-dropdown__trigger,.mn-a11y-demo-voice .mn-dropdown__menu{width:100%}.mn-a11y-demo-voice .mn-dropdown__menu{max-height:220px;overflow:auto}.mn-a11y-demo-fab{position:fixed;right:24px;width:48px;height:48px;border-radius:999px;background:var(--giallo-ferrari);color:#111;box-shadow:0 18px 30px rgba(0,0,0,.32);display:grid;place-items:center;z-index:1040}.mn-a11y-demo-fab svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mn-a11y-demo-fab--active{box-shadow:0 0 0 3px rgba(255,199,44,.35),0 18px 30px rgba(0,0,0,.32)}body.mn-a11y-large-text{font-size:1.2em}body.mn-a11y-high-spacing{line-height:1.85;letter-spacing:.01em}body.mn-a11y-high-contrast .mn-card-dark,body.mn-a11y-high-contrast .mn-dropdown__trigger,body.mn-a11y-high-contrast .mn-dropdown__menu,body.mn-a11y-high-contrast .mn-a11y-demo-row{border-color:var(--bianco-puro)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}body.mn-a11y-reduced-motion *,body.mn-a11y-reduced-motion *::before,body.mn-a11y-reduced-motion *::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}body.mn-a11y-dyslexia-font{font-family:'OpenDyslexic','Inter',sans-serif}body.mn-a11y-focus :is(a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])):focus-visible{outline:3px solid var(--giallo-ferrari)!important;outline-offset:3px}body.mn-a11y-click-targets :is(button,a,.mn-dropdown__item,.mn-dropdown__trigger){min-height:44px;min-width:44px}body.mn-a11y-muted-colors #demo-root{filter:saturate(.82) contrast(.98)}body.mn-a11y-consistent-layout .mn-card-dark,body.mn-a11y-consistent-layout .mn-a11y-demo-panel{backdrop-filter:none}body.mn-a11y-visual-alerts .mn-a11y-demo-panel::after{content:'Visual alerts on';position:absolute;top:16px;right:56px;padding:4px 10px;border-radius:999px;background:rgba(244,63,94,.16);color:#FDA4AF;font:600 10px/1 var(--font-display);letter-spacing:.06em;text-transform:uppercase}body.mn-a11y-captions .mn-a11y-demo-panel .mn-a11y-demo-label::after{content:' captions';color:var(--grigio-chiaro)}body.mn-a11y-keyboard-only{cursor:default}@media (max-width:720px){.mn-a11y-demo-footer{align-items:stretch;flex-direction:column}.mn-a11y-demo-footer p{max-width:none;text-align:left}}
  `;
    document.head.appendChild(style);
  }

  // demo/sections/api-reference.js
  var groups = [
    ["Charts", "Maranello.charts.*", [
      "sparkline",
      "donut",
      "barChart",
      "areaChart",
      "radar",
      "halfGauge",
      "bubble",
      "liveGraph",
      "hBarChart"
    ]],
    ["Gauges", "Maranello.*", [
      "FerrariGauge",
      "speedometer",
      "initGauges",
      "createGauge",
      "updateGauge",
      "buildGaugePalette",
      "GAUGE_SIZES",
      "createGaugesInContainer"
    ]],
    ["Controls", "Maranello.*", [
      "initSlider",
      "initRotary",
      "initDragRotary",
      "manettino",
      "cruiseLever",
      "toggleLever",
      "steppedRotary"
    ]],
    ["Data Viz", "Maranello.*", [
      "funnel",
      "gantt",
      "dataTable",
      "initOrgTree",
      "okrPanel",
      "mapView",
      "socialGraph",
      "progressRing",
      "flipCounter",
      "networkMessages",
      "neuralNodes"
    ]],
    ["Panels", "Maranello.*", [
      "detailPanel",
      "createDetailPanel",
      "openDetailPanel",
      "closeDetailPanel",
      "openDrawer",
      "closeDrawer",
      "openModal",
      "closeModal",
      "toast",
      "commandPalette",
      "a11yPanel"
    ]],
    ["Interactive", "Maranello.*", [
      "aiChat",
      "loginScreen",
      "profileMenu",
      "datePicker",
      "registerDatePicker",
      "editors"
    ]],
    ["Icons", "Maranello.*", [
      "icons",
      "renderIcon",
      "iconCatalog",
      "navIcons",
      "statusIcons",
      "actionIcons",
      "dataIcons",
      "objectIcons",
      "azIcons"
    ]],
    ["Data Binding", "Maranello.*", [
      "bind",
      "autoBind",
      "bindChart",
      "bindControl",
      "autoBindSliders",
      "onDrillDown",
      "chartInteract",
      "sparklineInteract"
    ]],
    ["Theme", "Maranello.*", [
      "setTheme",
      "getTheme",
      "cycleTheme",
      "initThemeToggle",
      "initScrollReveal",
      "initNavTracking",
      "relativeLuminance",
      "autoContrast"
    ]],
    ["Utilities", "Maranello.*", [
      "VERSION",
      "clamp",
      "debounce",
      "throttle",
      "lerp",
      "cssVar",
      "createElement",
      "hiDpiCanvas",
      "formatDate",
      "formatNumber",
      "emit",
      "on",
      "off",
      "eventBus",
      "redrawAll",
      "reinitAll"
    ]]
  ];
  function apiGroup(title, ns, apis) {
    return `
    <div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-md)">
      <h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">
        ${title}
        <span class="mn-micro" style="color:var(--grigio-medio);margin-left:var(--space-sm)">${ns}</span>
      </h4>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs)">
        ${apis.map((a) => `<code class="mn-tag mn-tag--xs">${a}</code>`).join("")}
      </div>
    </div>`;
  }
  function statsBar() {
    return `
    <div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);justify-content:center;margin-bottom:var(--space-xl)">
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">91</strong> exports
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">10</strong> chart types
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">23</strong> Web Components
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">4</strong> themes
      </span>
    </div>`;
  }
  function initApiRef(section) {
    const btn = section.querySelector('[data-action="try-api"]');
    const out = section.querySelector('[data-output="api-count"]');
    if (!btn || !out) return;
    btn.addEventListener("click", () => {
      const M3 = window.Maranello;
      if (!M3) {
        out.textContent = "window.Maranello not loaded";
        out.style.color = "var(--rosso-corsa)";
        return;
      }
      const keys = Object.keys(M3).sort();
      console.log(keys);
      out.textContent = `${keys.length} keys found \u2014 logged to console`;
      out.style.color = "var(--mn-accent)";
    });
  }
  function createApiReferenceSection() {
    const section = document.createElement("section");
    section.id = "api-reference";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <h2 class="mn-title-section">
        <span class="mn-label" style="color:var(--mn-accent)">21</span>
        API Reference
      </h2>
      <p class="mn-subtitle" style="text-align:center;margin-bottom:var(--space-xl)">
        Complete catalog of <code>window.Maranello</code> exports
      </p>

      ${statsBar()}

      <div class="mn-grid-2">
        ${groups.map(([t, ns, apis]) => apiGroup(t, ns, apis)).join("")}
      </div>

      <div style="text-align:center;margin-top:var(--space-xl)">
        <button class="mn-btn mn-btn--accent" data-action="try-api">
          Try It \u2014 Log All Exports
        </button>
        <p class="mn-micro" data-output="api-count"
           style="margin-top:var(--space-sm);color:var(--grigio-medio)">
          Click to inspect window.Maranello in console
        </p>
      </div>
    </div>
  `;
    requestAnimationFrame(() => initApiRef(section));
    return section;
  }

  // demo/sections/data-binding.js
  function createDataBindingSection() {
    const section = document.createElement("section");
    section.id = "data-binding";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">28 \u2014 Data Binding</p>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Data Binding</h2>
      <p class="mn-body mn-mb-2xl">Reactive pub/sub bus: emit/on/off, bind(), and autoBind wiring slider inputs to live gauges.</p>

      <div class="mn-grid-2 mn-mb-2xl" style="gap:var(--space-xl)">

        <!-- Slider \u2192 Gauge binding demo -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Slider \u2192 Gauge Binding</h4>
          <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Drag a slider \u2014 the gauge updates via <code>Maranello.emit</code> and <code>Maranello.updateGauge</code>.</p>
          <div style="display:flex;flex-direction:column;gap:var(--space-lg)">
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Agent Utilization</span>
                <span id="db-util-val" style="color:var(--mn-accent);font-weight:700">72%</span>
              </label>
              <input id="db-util-slider" class="mn-slider" type="range" min="0" max="100" value="72"
                data-bind-event="db:utilization" style="width:100%">
            </div>
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Token Health</span>
                <span id="db-token-val" style="color:var(--mn-accent);font-weight:700">88%</span>
              </label>
              <input id="db-token-slider" class="mn-slider" type="range" min="0" max="100" value="88"
                data-bind-event="db:token-health" style="width:100%">
            </div>
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Gate Coverage</span>
                <span id="db-gate-val" style="color:var(--mn-accent);font-weight:700">65%</span>
              </label>
              <input id="db-gate-slider" class="mn-slider" type="range" min="0" max="100" value="65"
                data-bind-event="db:gate-coverage" style="width:100%">
            </div>
          </div>
        </div>

        <!-- Live event log -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Event Bus Log</h4>
          <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Events emitted via <code>Maranello.emit</code> appear here in real time.</p>
          <div id="db-event-log" style="font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6;height:180px;overflow-y:auto;background:rgba(0,0,0,0.4);border:1px solid var(--grigio-scuro);border-radius:6px;padding:var(--space-sm)">
            <span style="color:var(--grigio-medio)">Move a slider to see events\u2026</span>
          </div>
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md)">
            <button id="db-clear-log" class="mn-btn mn-btn--ghost" style="font-size:12px;padding:4px 12px">Clear log</button>
            <button id="db-emit-test" class="mn-btn mn-btn--accent" style="font-size:12px;padding:4px 12px">Emit test event</button>
          </div>
        </div>
      </div>

      <!-- emit/on/off code reference -->
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">API Quick Reference</h4>
        <div class="mn-grid-3" style="gap:var(--space-lg)">
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">emit / on / off</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">Maranello.emit('my:event', {v:42});
const h = Maranello.on('my:event', d=>{});
Maranello.off('my:event', h);</pre>
          </div>
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">bind() \u2014 manual wiring</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">Maranello.bind(sliderEl, {
  event: 'util:update',
  transform: v => Number(v)
});</pre>
          </div>
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">autoBind \u2014 declarative</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">&lt;input data-bind-event="util:update"
       data-bind-transform="number"&gt;
Maranello.autoBind(container);</pre>
          </div>
        </div>
      </div>

      <!-- Live gauge display -->
      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Live Gauges (bound to sliders above)</h4>
        <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;justify-content:center;align-items:flex-end">
          <div style="text-align:center">
            <mn-gauge id="db-gauge-util" value="72" max="100" unit="%" label="Utilization" size="sm"></mn-gauge>
          </div>
          <div style="text-align:center">
            <mn-gauge id="db-gauge-token" value="88" max="100" unit="%" label="Token Health" size="sm"></mn-gauge>
          </div>
          <div style="text-align:center">
            <mn-gauge id="db-gauge-gate" value="65" max="100" unit="%" label="Gate Coverage" size="sm"></mn-gauge>
          </div>
        </div>
      </div>
    </div>
  `;
    requestAnimationFrame(() => initDataBinding(section));
    return section;
  }
  function appendLog(log, text) {
    const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", { hour12: false });
    const line = document.createElement("div");
    line.style.cssText = "color:var(--giallo-ferrari)";
    line.textContent = `[${ts}] ${text}`;
    const placeholder3 = log.querySelector("span");
    if (placeholder3) placeholder3.remove();
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    while (log.children.length > 50) log.removeChild(log.firstChild);
  }
  function initDataBinding(section) {
    const M3 = window.Maranello;
    const log = section.querySelector("#db-event-log");
    if (!log) return;
    const sliders = [
      ["#db-util-slider", "#db-util-val", "#db-gauge-util", "db:utilization"],
      ["#db-token-slider", "#db-token-val", "#db-gauge-token", "db:token-health"],
      ["#db-gate-slider", "#db-gate-val", "#db-gauge-gate", "db:gate-coverage"]
    ];
    sliders.forEach(([sliderId, labelId, gaugeId, eventName]) => {
      const slider2 = section.querySelector(sliderId);
      const valueLabel = section.querySelector(labelId);
      const gauge = section.querySelector(gaugeId);
      if (!slider2) return;
      slider2.addEventListener("input", () => {
        const value = Number(slider2.value);
        if (valueLabel) valueLabel.textContent = `${value}%`;
        if (gauge) gauge.setAttribute("value", String(value));
        if (M3?.emit) {
          try {
            M3.emit(eventName, { value, source: "slider" });
          } catch (_) {
          }
        }
        appendLog(log, `${eventName} \u2192 ${value}`);
      });
      if (M3?.autoBind) {
        try {
          M3.autoBind(section.querySelector(sliderId.replace("#", "").split("-").slice(0, 2).join("-")));
        } catch (_) {
        }
      }
    });
    if (M3?.on) {
      sliders.forEach(([, , , eventName]) => {
        try {
          M3.on(eventName, (data) => {
            if (data?.source !== "slider") appendLog(log, `[on] ${eventName} \u2190 ${JSON.stringify(data)}`);
          });
        } catch (_) {
        }
      });
    }
    const testBtn = section.querySelector("#db-emit-test");
    if (testBtn) {
      testBtn.addEventListener("click", () => {
        const payload = { value: Math.round(Math.random() * 100), source: "test" };
        appendLog(log, `emit db:test-event \u2192 ${JSON.stringify(payload)}`);
        if (M3?.emit) {
          try {
            M3.emit("db:test-event", payload);
          } catch (_) {
          }
        }
      });
    }
    const clearBtn = section.querySelector("#db-clear-log");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        log.innerHTML = '<span style="color:var(--grigio-medio)">Log cleared.</span>';
      });
    }
  }

  // demo/sections/overlays.js
  function createOverlaysSection() {
    const section = document.createElement("section");
    section.id = "overlays";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">27 \u2014 Overlays &amp; Notifications</p>
      <div class="mn-watermark">OVERLAY</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Modals, Toasts &amp; Drawers</h2>
      <p class="mn-body mn-mb-2xl">Contextual overlays: confirmation dialogs, non-blocking notifications, and slide-out panels.</p>

      <div class="mn-demo-section-label mn-mt-xl">Modal Dialogs</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--accent" id="ovl-modal-info">Info Modal</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-modal-confirm">Confirm Modal</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-modal-danger">Danger Modal</button>
      </div>

      <div class="mn-demo-section-label">Toast Notifications</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-info">Info Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-success">Success Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-warning">Warning Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-error">Error Toast</button>
      </div>

      <div class="mn-demo-section-label">Command Palette</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-cmd-palette">Open Command Palette <span class="mn-micro" style="opacity:.6;margin-left:var(--space-xs)">\u2318K</span></button>
      </div>

      <div class="mn-demo-section-label">Slide-out Drawer</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-drawer-open">Open Drawer</button>
      </div>

      <!-- Drawer DOM anchor -->
      <div id="ovl-drawer-host"></div>
    </div>`;
    requestAnimationFrame(() => initOverlays(section));
    return section;
  }
  function initOverlays(section) {
    const M3 = window.Maranello;
    if (!M3) {
      console.warn("[overlays] Maranello not loaded");
      return;
    }
    section.querySelector("#ovl-modal-info")?.addEventListener("click", () => {
      if (!M3.openModal) return;
      M3.openModal({ title: "Pipeline Report", content: "<p>Agent throughput is <strong>96%</strong> above baseline. All routing lanes nominal.</p>", confirmLabel: "Acknowledge", onConfirm: () => M3.closeModal?.() });
    });
    section.querySelector("#ovl-modal-confirm")?.addEventListener("click", () => {
      if (!M3.openModal) return;
      M3.openModal({ title: "Rebalance Routes?", content: "<p>This will redistribute 3 active lanes across us-east-1 and eu-west-1. Ongoing tasks will not be interrupted.</p>", confirmLabel: "Rebalance", cancelLabel: "Cancel", onConfirm: () => {
        M3.closeModal?.();
        M3.toast?.({ title: "Rebalance scheduled", type: "success", duration: 3e3 });
      }, onCancel: () => M3.closeModal?.() });
    });
    section.querySelector("#ovl-modal-danger")?.addEventListener("click", () => {
      if (!M3.openModal) return;
      M3.openModal({ title: "Terminate Agent?", content: '<p style="color:var(--rosso-corsa)">This action cannot be undone. Agent <strong>opus-07</strong> will be stopped immediately.</p>', confirmLabel: "Terminate", cancelLabel: "Cancel", danger: true, onConfirm: () => {
        M3.closeModal?.();
        M3.toast?.({ title: "Agent terminated", type: "error", duration: 4e3 });
      }, onCancel: () => M3.closeModal?.() });
    });
    section.querySelector("#ovl-toast-info")?.addEventListener("click", () => M3.toast?.({ title: "Pipeline scheduled", message: "Route optimization will run at 02:00 UTC.", type: "info", duration: 4e3 }));
    section.querySelector("#ovl-toast-success")?.addEventListener("click", () => M3.toast?.({ title: "Model deployed", message: "gpt-4-turbo is live on us-east-1.", type: "success", duration: 4e3 }));
    section.querySelector("#ovl-toast-warning")?.addEventListener("click", () => M3.toast?.({ title: "High latency detected", message: "ap-southeast-1 p99 > 2s. Consider scaling.", type: "warning", duration: 4e3 }));
    section.querySelector("#ovl-toast-error")?.addEventListener("click", () => M3.toast?.({ title: "Inference failure", message: "Agent haiku-03 exceeded retry limit.", type: "error", duration: 5e3 }));
    section.querySelector("#ovl-cmd-palette")?.addEventListener("click", () => {
      if (!M3.commandPalette) return;
      M3.commandPalette({
        placeholder: "Search pipelines, agents, routes\u2026",
        items: [
          { label: "Show active pipelines", action: () => M3.toast?.({ title: "Active pipelines: 12", type: "info", duration: 3e3 }) },
          { label: "Open token dashboard", action: () => M3.toast?.({ title: "Token dashboard opened", type: "success", duration: 3e3 }) },
          { label: "Trigger route rebalance", action: () => M3.toast?.({ title: "Rebalance queued", type: "warning", duration: 3e3 }) },
          { label: "View agent logs", action: () => M3.toast?.({ title: "Logs viewer opened", type: "info", duration: 3e3 }) }
        ]
      });
    });
    section.querySelector("#ovl-drawer-open")?.addEventListener("click", () => {
      if (!M3.openDrawer) return;
      M3.openDrawer("ovl-drawer-host");
      setTimeout(() => {
        const btn = document.getElementById("ovl-drawer-close-btn");
        btn?.addEventListener("click", () => M3.closeDrawer?.("ovl-drawer-host"));
      }, 100);
    });
  }

  // demo/sections/org-tree.js
  function createOrgTreeSection() {
    const section = document.createElement("section");
    section.id = "org-tree";
    section.className = "mn-section-dark";
    section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">28 \u2014 Org Tree</p>
      <div class="mn-watermark">ORG</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Organisation Tree</h2>
      <p class="mn-body mn-mb-xl">Hierarchical structure viewer with expand/collapse and full keyboard navigation.</p>
      <p class="mn-micro mn-mb-2xl" style="color:var(--grigio-medio)">
        Keyboard: <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Tab</kbd> to focus nodes &nbsp;
        <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Enter / Space</kbd> to expand/collapse &nbsp;
        <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Arrow keys</kbd> to navigate siblings
      </p>
      <div class="mn-flex-wrap mn-gap-md mn-mb-xl">
        <button class="mn-btn mn-btn--accent" id="org-expand-all">Expand All</button>
        <button class="mn-btn mn-btn--ghost" id="org-collapse-all">Collapse All</button>
      </div>
      <div id="org-tree-root" class="mn-org-tree" role="tree" aria-label="Agent organisation tree"
           style="max-width:860px;overflow-x:auto"></div>
    </div>`;
    requestAnimationFrame(() => initOrgTree(section));
    return section;
  }
  var ORG_DATA = {
    id: "node-ceo",
    label: "Mirror Operations",
    role: "Platform Root",
    children: [
      {
        id: "node-inference",
        label: "Inference Cluster",
        role: "Model Execution",
        children: [
          { id: "node-opus", label: "Agent Opus 4.6", role: "Complex reasoning", children: [] },
          { id: "node-sonnet", label: "Agent Sonnet 4.6", role: "Coordinator", children: [] },
          { id: "node-haiku", label: "Agent Haiku 4.5", role: "Utility & speed", children: [] }
        ]
      },
      {
        id: "node-routing",
        label: "Routing Layer",
        role: "Traffic Management",
        children: [
          { id: "node-eu", label: "eu-west-1", role: "EU gateway", children: [] },
          { id: "node-us", label: "us-east-1", role: "US primary", children: [] },
          { id: "node-ap", label: "ap-southeast-1", role: "APAC gateway", children: [] }
        ]
      },
      {
        id: "node-ops",
        label: "Ops & Monitoring",
        role: "Observability",
        children: [
          { id: "node-telemetry", label: "Telemetry Service", role: "Metrics & tracing", children: [] },
          { id: "node-alerts", label: "Alert Manager", role: "PagerDuty integration", children: [] }
        ]
      }
    ]
  };
  function initOrgTree(section) {
    const M3 = window.Maranello;
    const container = section.querySelector("#org-tree-root");
    if (!container) return;
    if (M3?.initOrgTree) {
      try {
        renderFallback(container);
        const ctrl = M3.initOrgTree(container);
        section.querySelector("#org-expand-all")?.addEventListener("click", () => ctrl?.expandAll?.());
        section.querySelector("#org-collapse-all")?.addEventListener("click", () => ctrl?.collapseAll?.());
      } catch (e) {
        console.warn("[org-tree] initOrgTree error:", e);
        renderFallback(container);
        wireButtons(section, null);
      }
    } else {
      renderFallback(container);
      wireButtons(section, null);
    }
  }
  function renderFallback(container) {
    container.innerHTML = buildNodeHtml(ORG_DATA, 0);
    container.querySelectorAll(".org-node__toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nodeEl = btn.closest(".org-node");
        const children = nodeEl?.querySelector(".org-node__children");
        if (!children) return;
        const expanded = children.style.display !== "none";
        children.style.display = expanded ? "none" : "";
        btn.setAttribute("aria-expanded", String(!expanded));
        btn.textContent = expanded ? "+" : "\u2212";
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }
  function buildNodeHtml(node, depth) {
    const indent = depth * 24;
    const hasChildren = node.children && node.children.length > 0;
    const childrenHtml = hasChildren ? node.children.map((c) => buildNodeHtml(c, depth + 1)).join("") : "";
    return `
    <div class="org-node" id="${node.id}" style="margin-left:${indent}px">
      <div class="org-node__row mn-card-dark" style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) var(--space-md);margin-bottom:var(--space-xs);cursor:${hasChildren ? "pointer" : "default"}">
        ${hasChildren ? `<button class="org-node__toggle mn-btn mn-btn--ghost" style="width:24px;height:24px;padding:0;font-size:1rem;line-height:1;flex-shrink:0" aria-expanded="true" aria-controls="${node.id}-children">\u2212</button>` : '<span style="width:24px;flex-shrink:0"></span>'}
        <span class="mn-label" style="flex:1">${node.label}</span>
        <span class="mn-micro" style="color:var(--grigio-medio)">${node.role}</span>
      </div>
      ${hasChildren ? `<div class="org-node__children" id="${node.id}-children">${childrenHtml}</div>` : ""}
    </div>`;
  }
  function wireButtons(section, ctrl) {
    const container = section.querySelector("#org-tree-root");
    section.querySelector("#org-expand-all")?.addEventListener("click", () => {
      if (ctrl?.expandAll) {
        ctrl.expandAll();
        return;
      }
      container?.querySelectorAll(".org-node__children").forEach((el) => {
        el.style.display = "";
      });
      container?.querySelectorAll(".org-node__toggle").forEach((btn) => {
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = "\u2212";
      });
    });
    section.querySelector("#org-collapse-all")?.addEventListener("click", () => {
      if (ctrl?.collapseAll) {
        ctrl.collapseAll();
        return;
      }
      container?.querySelectorAll(".org-node__children").forEach((el) => {
        el.style.display = "none";
      });
      container?.querySelectorAll(".org-node__toggle").forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "+";
      });
    });
  }

  // demo/app.js
  var root = document.getElementById("demo-root");
  if (!root) throw new Error("Missing #demo-root");
  var factories = [
    ["hero", createHeroSection],
    ["tokens", createTokensSection],
    ["cards", createCardsSection],
    ["dashboard", createDashboardSection],
    ["charts", createChartsSection],
    ["network", createNetworkSection],
    ["controls", createControlsSection],
    ["forms", createFormsSection],
    ["tables", createTablesSection],
    ["gauges", createGaugesSection],
    ["cockpit", createCockpitSection],
    ["telemetry", createTelemetrySection],
    ["gantt", createGanttSection],
    ["icons", createIconsSection],
    ["animations", createAnimationsSection],
    ["heatmap", createHeatmapSection],
    ["treemap", createTreemapSection],
    ["layouts", createLayoutsSection],
    ["detail-panel", createDetailPanelSection],
    ["interactive", createInteractiveSection],
    ["okr", createOkrSection],
    ["map", createMapSection],
    ["social-graph", createSocialGraphSection],
    ["advanced", createAdvancedSection],
    ["mesh-network", createMeshNetworkSection],
    ["convergio", createConvergioSection],
    ["web-components", createWebComponentsSection],
    ["launch", createLaunchSection],
    ["accessibility", createAccessibilitySection],
    ["api-reference", createApiReferenceSection],
    ["data-binding", createDataBindingSection],
    ["overlays", createOverlaysSection],
    ["org-tree", createOrgTreeSection],
    ["footer", createFooter]
  ];
  var fragment = document.createDocumentFragment();
  for (const [name, factory] of factories) {
    try {
      fragment.appendChild(factory());
    } catch (err) {
      console.error(`[demo] Section "${name}" failed:`, err);
      const fallback = document.createElement("section");
      fallback.id = name;
      fallback.innerHTML = `<div class="mn-container" style="padding:var(--space-xl)"><p style="color:var(--rosso-corsa)">\u26A0 Section "${name}" failed to render</p></div>`;
      fragment.appendChild(fallback);
    }
  }
  root.appendChild(fragment);
  document.querySelectorAll(".demo-nav__links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
  function updateThemeLabel() {
    const label = document.getElementById("demo-theme-label");
    if (!label) return;
    const theme = window.Maranello?.getTheme?.() ?? "nero";
    const names = { nero: "Nero", avorio: "Avorio", colorblind: "Colorblind", editorial: "Editorial" };
    label.textContent = `Current: ${names[theme] ?? theme}`;
  }
  document.addEventListener("mn-theme-change", (event) => {
    const nav = document.querySelector(".demo-nav");
    if (!nav) return;
    if (event.detail?.theme === "avorio") {
      nav.style.background = "rgba(250,243,230,0.95)";
      nav.style.borderBottomColor = "var(--avorio-scuro)";
    } else {
      nav.style.background = "rgba(10,10,10,0.92)";
      nav.style.borderBottomColor = "var(--grigio-scuro)";
    }
    updateThemeLabel();
  });
  requestAnimationFrame(updateThemeLabel);
  function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "mn-section-dark";
    footer.style.cssText = "padding:var(--space-2xl) var(--space-xl);text-align:center";
    footer.innerHTML = `
    <div class="mn-container">
      <div class="mn-divider-gold--accent mn-divider-gold" style="margin-bottom:var(--space-xl)"></div>
      <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Maranello Luce Design System</p>
      <p class="mn-micro" style="color:var(--grigio-medio)">Demo built with fictional Maranello Luce operations data. All data is illustrative and does not represent a real platform.</p>
      <p class="mn-micro" style="color:var(--grigio-scuro);margin-top:var(--space-sm)">v3.1.0 \u2014 4 themes \xB7 91 APIs \xB7 23 Web Components</p>
    </div>`;
    return footer;
  }
})();
