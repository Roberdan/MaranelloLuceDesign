/* Maranello Luce Design v4.11.0 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */

// src/ts/core/sanitize.ts
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function sanitizeHtml(str) {
  return escapeHtml(str);
}
var HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
var RGB_RE = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
var HSL_RE = /^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(?:0|1|0?\.\d+))?\s*\)$/;
var CSS_VAR_RE = /^var\(--[\w-]+(?:\s*,\s*[^)]+)?\)$/;
var CSS_KEYWORDS = /* @__PURE__ */ new Set([
  "transparent",
  "currentColor",
  "currentcolor",
  "inherit",
  "initial",
  "unset",
  "revert"
]);
var NAMED_COLORS = /* @__PURE__ */ new Set([
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
]);
function isValidColor(val) {
  const trimmed = val.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower.includes("javascript:")) return false;
  if (lower.includes("expression(")) return false;
  if (lower.includes(";")) return false;
  if (lower.includes("url(")) return false;
  if (HEX_RE.test(trimmed)) return true;
  if (RGB_RE.test(trimmed)) return true;
  if (HSL_RE.test(trimmed)) return true;
  if (CSS_VAR_RE.test(trimmed)) return true;
  if (CSS_KEYWORDS.has(lower)) return true;
  if (NAMED_COLORS.has(lower)) return true;
  return false;
}
function sanitizeAttr(key, val) {
  if (key === "html") return escapeHtml(val);
  return val;
}
var SAFE_SVG_TAGS = /* @__PURE__ */ new Set([
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
  "text",
  "defs",
  "clippath"
]);
var DANGEROUS_SVG_TAGS = /* @__PURE__ */ new Set([
  "script",
  "foreignobject"
]);
function sanitizeSvg(svgString) {
  if (!svgString || typeof svgString !== "string") return "";
  const doc = new DOMParser().parseFromString(svgString, "text/html");
  const svg = doc.querySelector("svg");
  if (!svg) return "";
  cleanSvgNode(svg);
  return svg.outerHTML;
}
function cleanSvgNode(el) {
  for (const attr of Array.from(el.attributes)) {
    if (attr.name.toLowerCase().startsWith("on")) {
      el.removeAttribute(attr.name);
    }
  }
  const children = Array.from(el.children);
  for (const child of children) {
    const tag = child.tagName.toLowerCase();
    if (DANGEROUS_SVG_TAGS.has(tag)) {
      child.remove();
      continue;
    }
    if (tag === "use") {
      const href = child.getAttribute("href") ?? child.getAttribute("xlink:href") ?? "";
      if (href && !href.startsWith("#")) {
        child.remove();
        continue;
      }
    }
    if (tag.startsWith("animate")) {
      const attrName = child.getAttribute("attributeName") ?? "";
      if (attrName.toLowerCase().startsWith("on") || attrName === "href") {
        child.remove();
        continue;
      }
    }
    if (!SAFE_SVG_TAGS.has(tag) && tag !== "use" && !tag.startsWith("animate")) {
      child.remove();
      continue;
    }
    cleanSvgNode(child);
  }
}
var ALLOWED_BIND_PROPERTIES = /* @__PURE__ */ new Set([
  "textContent",
  "className",
  "value",
  "checked",
  "disabled",
  "hidden",
  "src",
  "href",
  "alt",
  "title",
  "placeholder",
  "aria-label",
  "aria-hidden",
  "aria-expanded",
  "aria-selected",
  "aria-describedby",
  "aria-invalid",
  "innerHTML"
]);

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
function palette(el = document.documentElement) {
  const read = (name) => getComputedStyle(el).getPropertyValue(name).trim();
  return {
    // Semantic (theme-aware) — use these for UI surfaces
    surface: read("--mn-surface"),
    surfaceRaised: read("--mn-surface-raised"),
    surfaceSunken: read("--mn-surface-sunken"),
    text: read("--mn-text"),
    textMuted: read("--mn-text-muted"),
    border: read("--mn-border"),
    accent: read("--mn-accent"),
    // Brand primitives — fixed across themes
    giallo: read("--giallo-ferrari"),
    rosso: read("--rosso-corsa"),
    verde: read("--verde-racing"),
    azzurro: read("--status-info"),
    biancoCaldo: read("--bianco-caldo"),
    grigioChiaro: read("--grigio-chiaro"),
    grigioMedio: read("--grigio-medio"),
    neroAssoluto: read("--nero-assoluto"),
    // Status — use in charts, badges, gauges
    signalOk: read("--signal-ok"),
    signalWarning: read("--signal-warning"),
    signalDanger: read("--signal-danger"),
    signalInfo: read("--signal-info")
  };
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
  escapeHtml,
  sanitizeHtml,
  isValidColor,
  sanitizeAttr,
  sanitizeSvg,
  ALLOWED_BIND_PROPERTIES,
  cssVar,
  getTheme,
  setTheme,
  cycleTheme,
  getAccent,
  palette,
  debounce,
  throttle,
  createElement,
  formatNumber,
  formatDate,
  clamp,
  lerp,
  hiDpiCanvas
};
//# sourceMappingURL=chunk-BEIMDCAZ.js.map
