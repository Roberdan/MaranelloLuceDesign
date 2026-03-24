"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mn_a11y_fallback_exports = {};
__export(mn_a11y_fallback_exports, {
  buildA11yFallback: () => buildA11yFallback
});
module.exports = __toCommonJS(mn_a11y_fallback_exports);
const STORAGE = "mn-a11y";
const DEFAULTS = { fontSize: "md", reducedMotion: false, highContrast: false, focusVisible: true, dyslexiaFont: false };
const SIZES = { sm: 0.875, md: 1, lg: 1.125, xl: 1.25 };
let _dyslexicLoaded = false;
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
