// src/wc/mn-a11y-fallback.js
var STORAGE = "mn-a11y";
var DEFAULTS = { fontSize: "md", reducedMotion: false, highContrast: false, focusVisible: true, dyslexiaFont: false };
var SIZES = { sm: 0.875, md: 1, lg: 1.125, xl: 1.25 };
var _dyslexicLoaded = false;
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
  if (s.dyslexiaFont && !_dyslexicLoaded) {
    _dyslexicLoaded = true;
    const lnk = document.createElement("link");
    lnk.rel = "stylesheet";
    lnk.href = "../fonts/opendyslexic.css";
    document.head.appendChild(lnk);
  }
  document.body.classList.toggle("mn-a11y-dyslexia-font", s.dyslexiaFont);
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
  t.dataset.a11yKey = key;
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
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><rect x="2" y="4" width="18" height="2" rx="1"/><rect x="2" y="10" width="18" height="2" rx="1"/><rect x="2" y="16" width="18" height="2" rx="1"/><circle cx="7" cy="5" r="3"/><circle cx="15" cy="11" r="3"/><circle cx="9" cy="17" r="3"/></svg>';
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
  panel.appendChild(buildToggle("Dyslexia Font", "dyslexiaFont", s, apply));
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
    panel.querySelectorAll("[data-a11y-key]").forEach((t) => {
      const isOn = !!DEFAULTS[t.dataset.a11yKey];
      t.classList.toggle("mn-a11y-toggle--on", isOn);
      t.setAttribute("aria-checked", String(isOn));
    });
  });
  panel.appendChild(resetBtn);
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-a11y-panel--open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      const first = panel.querySelector("button, [tabindex]");
      if (first) first.focus();
    }
  });
  const onKeydown = (e) => {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      panel.classList.remove("mn-a11y-panel--open");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
      return;
    }
    if (e.key === "Tab" && isOpen) {
      const focusable = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = shadowRoot.activeElement || document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener("keydown", onKeydown);
  shadowRoot.append(fab, panel);
  apply();
  return {
    getSettings: () => ({ ...s }),
    reset: () => resetBtn.click(),
    destroy: () => {
      document.removeEventListener("keydown", onKeydown);
      fab.remove();
      panel.remove();
    }
  };
}

// src/wc/mn-a11y.js
var _engine = null;
function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}
var _base = new URL(".", import.meta.url).href;
function cssLink(path) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(path, _base).href;
  return link;
}
var MnA11y = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ctrl = null;
    this._mo = null;
    const tokens = cssLink("../css/tokens.css");
    const link = cssLink("../css/accessibility.css");
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; position: fixed; bottom: 24px; right: 24px;
        z-index: 8500; width: 52px; height: 52px; overflow: visible }
      .mn-a11y-fab { width: 52px; height: 52px; border-radius: 50%;
        background: var(--mn-error);
        border: 2px solid rgba(255,255,255,.18);
        color: #fff; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 16px rgba(220,0,0,.45), 0 2px 8px rgba(0,0,0,.4);
        transition: background .2s, transform .2s, box-shadow .2s; font-size: 1.35rem }
      .mn-a11y-fab:hover { background: #b00000;
        box-shadow: 0 6px 20px rgba(220,0,0,.55), 0 3px 10px rgba(0,0,0,.4);
        transform: scale(1.07) }
      .mn-a11y-fab:focus-visible { outline: 3px solid var(--mn-accent);
        outline-offset: 3px }
      .mn-a11y-panel { position: fixed; bottom: 88px; right: 24px; z-index: 8500;
        width: 280px; background: var(--mn-surface-raised);
        border: 1px solid var(--mn-border); border-radius: 12px;
        padding: 16px; box-shadow: 0 12px 32px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(8px); pointer-events: none;
        transition: opacity .2s, transform .2s;
        font-family: var(--font-body, sans-serif);
        color: var(--mn-text-tertiary) }
      .mn-a11y-panel--open { opacity: 1; transform: translateY(0);
        pointer-events: auto }
      .mn-a11y-panel__title { font-weight: 600; font-size: .95rem;
        color: var(--mn-text); margin-bottom: 14px;
        display: flex; align-items: center; gap: 6px }
      .mn-a11y-panel__group { margin-bottom: 12px }
      .mn-a11y-panel__label { font-size: .75rem; text-transform: uppercase;
        letter-spacing: .06em; color: var(--mn-text-muted); margin-bottom: 6px }
      .mn-a11y-panel__size-btns { display: flex; gap: 4px }
      .mn-a11y-panel__size-btn { padding: 6px 12px; border-radius: 6px;
        border: 1px solid var(--mn-border); background: transparent;
        color: var(--mn-text-tertiary); cursor: pointer; font-size: .8rem;
        transition: all .15s }
      .mn-a11y-panel__size-btn--active { background: var(--mn-error);
        border-color: var(--mn-error); color: var(--mn-text) }
      .mn-a11y-panel__row { display: flex; align-items: center;
        justify-content: space-between; padding: 6px 0 }
      .mn-a11y-panel__row-label { font-size: .85rem }
      .mn-a11y-toggle { width: 40px; height: 22px; border-radius: 11px;
        background: var(--mn-border); border: none; cursor: pointer;
        position: relative; transition: background .15s; padding: 0 }
      .mn-a11y-toggle--on { background: var(--mn-error) }
      .mn-a11y-toggle__thumb { width: 18px; height: 18px; border-radius: 50%;
        background: var(--mn-text); position: absolute; top: 2px;
        left: 2px; transition: left .15s }
      .mn-a11y-toggle--on .mn-a11y-toggle__thumb { left: 20px }
      .mn-a11y-panel__divider { height: 1px; background: var(--mn-border);
        margin: 10px 0 }
      .mn-a11y-panel__reset { width: 100%; padding: 8px; border-radius: 6px;
        border: 1px solid var(--mn-border); background: transparent;
        color: var(--mn-text-tertiary); cursor: pointer; font-size: .8rem;
        margin-top: 8px; transition: background .15s }
      .mn-a11y-panel__reset:hover { background: var(--mn-border) }
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
//# sourceMappingURL=mn-a11y.js.map
