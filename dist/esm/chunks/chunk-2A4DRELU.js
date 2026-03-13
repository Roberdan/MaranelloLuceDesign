/* Maranello Luce Design v2.0.0 | MIT | github.com/Roberdan/MaranelloLuceDesign */

// src/ts/core/utils.ts
var BODY_CLASSES = {
  editorial: "",
  nero: "mn-nero",
  avorio: "mn-avorio",
  colorblind: "mn-colorblind"
};
var THEME_ORDER = ["editorial", "nero", "avorio", "colorblind"];
function cssVar(name, fallback = "") {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function getTheme() {
  const cl = document.body.classList;
  if (cl.contains("mn-nero")) return "nero";
  if (cl.contains("mn-avorio")) return "avorio";
  if (cl.contains("mn-colorblind")) return "colorblind";
  return "editorial";
}
function setTheme(mode) {
  for (const cls2 of Object.values(BODY_CLASSES)) {
    if (cls2) document.body.classList.remove(cls2);
  }
  const cls = BODY_CLASSES[mode];
  if (cls) document.body.classList.add(cls);
}
function cycleTheme() {
  const current = getTheme();
  const idx = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  setTheme(next);
  return next;
}
function getAccent(fallback = "#FFC72C") {
  return cssVar("--giallo-ferrari", fallback);
}
function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}
function throttle(fn, ms) {
  let last = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      last = now;
      fn(...args);
    } else if (timer === null) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}
function createElement(tag, className, attrs) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === "text") el.textContent = val;
      else el.setAttribute(key, val);
    }
  }
  return el;
}
function formatNumber(value, opts) {
  const decimals = opts?.decimals ?? 0;
  const locale = opts?.locale ?? "en-US";
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function formatDate(dateStr, opts) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const locale = opts?.locale ?? "en-US";
  const style = opts?.format === "short" ? "short" : "long";
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: style,
    year: "numeric"
  });
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function hiDpiCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.scale(dpr, dpr);
  return dpr;
}

export {
  cssVar,
  getTheme,
  setTheme,
  cycleTheme,
  getAccent,
  debounce,
  throttle,
  createElement,
  formatNumber,
  formatDate,
  clamp,
  lerp,
  hiDpiCanvas
};
//# sourceMappingURL=chunk-2A4DRELU.js.map
