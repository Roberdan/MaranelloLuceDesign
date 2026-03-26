// src/ts/locale.ts
var defaults = {
  themes: {
    editorial: "Editorial",
    nero: "Nero",
    avorio: "Avorio",
    colorblind: "Colorblind",
    sugar: "Sugar"
  },
  filterPanel: {
    saveDefault: "SAVE AS DEFAULT",
    clear: "CLEAR"
  },
  a11y: {
    display: "Display",
    textSize: "Text Size",
    lineSpacing: "Line Spacing",
    dyslexiaFont: "Dyslexia Font",
    reducedMotion: "Reduced Motion",
    highContrast: "High Contrast",
    focusIndicators: "Focus Indicators",
    resetDefaults: "Reset to Defaults"
  },
  stateScaffold: {
    loading: "Loading...",
    noResults: "No results match your filters.",
    retry: "Retry",
    error: "Something went wrong. Please try again.",
    empty: "No data available yet.",
    partial: "Some data may be unavailable right now."
  }
};
var current = JSON.parse(JSON.stringify(defaults));
function getLocale() {
  return current;
}

// src/ts/state-scaffold.ts
var VALID_STATES = ["loading", "empty", "error", "partial", "no-results", "ready"];
var StateScaffold = class {
  constructor(container, options) {
    this.events = null;
    const validInitial = options?.state && VALID_STATES.includes(options.state);
    if (!validInitial && options?.state) {
      console.warn(`StateScaffold: invalid initial state "${options.state}". Falling back to "loading". Valid states: ${VALID_STATES.join(", ")}`);
    }
    const initial = validInitial ? options.state : "loading";
    this.container = container;
    this.options = { ...options, state: initial };
    this.state = initial;
    this.status = document.createElement("div");
    this.status.className = "mn-scaffold__status";
    this.content = document.createElement("div");
    this.content.className = "mn-scaffold__content";
    while (this.container.firstChild) {
      this.content.appendChild(this.container.firstChild);
    }
    this.container.classList.add("mn-scaffold");
    this.container.append(this.status, this.content);
    this.setState(initial, this.options.message);
  }
  setState(state, message) {
    if (!VALID_STATES.includes(state)) {
      console.warn(`StateScaffold: invalid state "${state}". Valid states: ${VALID_STATES.join(", ")}`);
      return;
    }
    this.state = state;
    this.options.state = state;
    if (typeof message === "string") {
      this.options.message = message;
    }
    this.events?.abort();
    this.events = new AbortController();
    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
    this.container.classList.add(`mn-scaffold--${state}`);
    this.container.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    this.status.innerHTML = "";
    this.content.classList.toggle("mn-scaffold__content--hidden", state !== "partial" && state !== "ready");
    if (state === "loading") this.renderLoading();
    if (state === "empty") this.renderEmpty();
    if (state === "error") this.renderError();
    if (state === "partial") this.renderPartial();
    if (state === "no-results") this.renderNoResults();
    if (state === "ready") this.renderReady();
  }
  getState() {
    return this.state;
  }
  getContentHost() {
    return this.content;
  }
  destroy() {
    this.events?.abort();
    this.events = null;
    this.status.remove();
    while (this.content.firstChild) {
      this.container.appendChild(this.content.firstChild);
    }
    this.content.remove();
    this.container.removeAttribute("aria-busy");
    this.container.classList.remove("mn-scaffold", "mn-scaffold__content--hidden");
    for (const name of VALID_STATES) {
      this.container.classList.remove(`mn-scaffold--${name}`);
    }
  }
  renderLoading() {
    const panel = this.buildPanel("loading");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    for (let i = 0; i < 3; i += 1) {
      const bar = document.createElement("div");
      bar.className = "mn-scaffold__skeleton-bar";
      panel.appendChild(bar);
    }
    this.status.appendChild(panel);
  }
  renderEmpty() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.empty,
      this.options.onAction,
      this.options.actionLabel,
      "Take action"
    );
    this.status.appendChild(panel);
  }
  renderError() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.error,
      this.options.onRetry,
      getLocale().stateScaffold.retry,
      "Retry"
    );
    this.status.appendChild(panel);
  }
  renderPartial() {
    const banner = document.createElement("div");
    banner.className = "mn-scaffold__banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    const text = document.createElement("p");
    text.className = "mn-scaffold__message";
    text.textContent = this.options.message || getLocale().stateScaffold.partial;
    banner.appendChild(text);
    this.status.appendChild(banner);
  }
  renderReady() {
    this.status.innerHTML = "";
  }
  renderNoResults() {
    const panel = this.buildMessageState(
      this.options.message || getLocale().stateScaffold.noResults,
      this.options.onAction,
      this.options.actionLabel,
      "Clear filters"
    );
    this.status.appendChild(panel);
  }
  buildPanel(modifier) {
    const panel = document.createElement("div");
    panel.className = `mn-scaffold__panel mn-scaffold__panel--${modifier}`;
    return panel;
  }
  buildMessageState(message, action, actionLabel, fallbackLabel) {
    const panel = this.buildPanel("message");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    const text = document.createElement("p");
    text.className = "mn-scaffold__message";
    text.textContent = message;
    panel.appendChild(text);
    if (action) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mn-scaffold__action";
      button.textContent = actionLabel || fallbackLabel || "Action";
      button.addEventListener("click", action, { signal: this.events?.signal });
      panel.appendChild(button);
    }
    return panel;
  }
};

// src/ts/core/sanitize.ts
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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

// src/ts/core/utils.ts
function cssVar(name, fallback = "") {
  const el2 = document.body ?? document.documentElement;
  return getComputedStyle(el2).getPropertyValue(name).trim() || fallback;
}
function getAccent(fallback = "#FFC72C") {
  return cssVar("--mn-accent", fallback);
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

// src/ts/charts-helpers.ts
var dpr = window.devicePixelRatio || 1;
function buildSeries() {
  return [
    cssVar("--mn-accent", "var(--mn-accent)"),
    cssVar("--signal-danger", "var(--signal-danger)"),
    cssVar("--signal-ok", "var(--signal-ok)"),
    cssVar("--mn-warning", "var(--mn-warning)"),
    cssVar("--mn-info", "var(--mn-info)"),
    cssVar("--mn-border-strong", "var(--mn-border-strong)"),
    cssVar("--mn-error", "var(--mn-error)"),
    cssVar("--mn-success", "var(--mn-success)"),
    cssVar("--signal-warning", "var(--signal-warning)"),
    cssVar("--signal-info", "var(--signal-info)"),
    cssVar("--mn-text-tertiary", "var(--mn-text-tertiary)"),
    cssVar("--mn-accent-hover", "var(--mn-accent-hover)")
  ];
}
var SERIES = buildSeries();
function chartHiDpi(canvas, w, h) {
  const cw = Math.max(w, 20);
  const ch = Math.max(h, 20);
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = cw + "px";
  canvas.style.height = ch + "px";
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("[Maranello] chartHiDpi: 2D context unavailable");
    return null;
  }
  ctx.scale(dpr, dpr);
  return ctx;
}
function getCanvasSize(canvas, defaultW = 200, defaultH = 100) {
  const dw = parseInt(canvas.getAttribute("data-width") ?? "", 10);
  const dh = parseInt(canvas.getAttribute("data-height") ?? "", 10);
  if (dw > 0 && dh > 0) return { width: dw, height: dh };
  const aw = parseInt(canvas.getAttribute("width") ?? "", 10);
  const ah = parseInt(canvas.getAttribute("height") ?? "", 10);
  if (aw > 0 && ah > 0) return { width: aw, height: ah };
  if (canvas.parentElement) {
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width > 10 && rect.height > 10) {
      return { width: rect.width, height: rect.height };
    }
  }
  return { width: defaultW, height: defaultH };
}
function hexFillGradient(ctx, hex, h, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgba(${r},${g},${b},${opacity})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  return grad;
}
function applyChartA11y(canvas, label, data) {
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", label);
  canvas.textContent = label;
  if (!canvas.parentElement) return;
  let srEl = canvas.nextElementSibling;
  if (!srEl || !srEl.classList.contains("mn-sr-only")) {
    srEl = document.createElement("span");
    srEl.className = "mn-sr-only";
    canvas.parentElement.insertBefore(srEl, canvas.nextSibling);
  }
  if (data && data.length > 0) {
    const rows = data.map(
      (r) => `<tr><td>${escapeHtml(String(r.label))}</td><td>${escapeHtml(String(r.value))}</td></tr>`
    ).join("");
    srEl.innerHTML = `<table><caption>${escapeHtml(label)}</caption><tbody>${rows}</tbody></table>`;
  } else {
    srEl.textContent = label;
  }
}
function drawSmoothLine(ctx, data, getX, getY, smooth) {
  ctx.moveTo(getX(0), getY(data[0]));
  if (smooth && data.length > 2) {
    for (let i = 1; i < data.length; i++) {
      const cpx = (getX(i - 1) + getX(i)) / 2;
      ctx.bezierCurveTo(cpx, getY(data[i - 1]), cpx, getY(data[i]), getX(i), getY(data[i]));
    }
  } else {
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(getX(i), getY(data[i]));
    }
  }
}

// src/ts/charts-sparkline.ts
function sparkline(canvas, data, opts) {
  const o = {
    color: cssVar("--mn-accent"),
    fillOpacity: 0.15,
    lineWidth: 1.5,
    smooth: true,
    showDot: true,
    ...opts
  };
  const size = getCanvasSize(canvas, 80, 28);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return void 0;
  if (!data || data.length < 2) return void 0;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const pad = 2;
  const getX = (i) => pad + i / (data.length - 1) * (w - pad * 2);
  const getY = (v) => h - pad - (v - mn) / range * (h - pad * 2);
  ctx.beginPath();
  drawSmoothLine(ctx, data, getX, getY, o.smooth ?? true);
  ctx.strokeStyle = o.color;
  ctx.lineWidth = o.lineWidth ?? 1.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineTo(getX(data.length - 1), h);
  ctx.lineTo(getX(0), h);
  ctx.closePath();
  if (o.color.startsWith("#")) {
    ctx.fillStyle = hexFillGradient(ctx, o.color, h, o.fillOpacity ?? 0.15);
  } else {
    ctx.fillStyle = `rgba(255,199,44,${o.fillOpacity})`;
  }
  ctx.fill();
  if (o.showDot) {
    const lastX = getX(data.length - 1);
    const lastY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = o.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const last = data[data.length - 1];
  const a11yLabel = `Sparkline: values from ${mn} to ${mx}, latest ${last}`;
  const a11yData = data.map((v, i) => ({ label: `Point ${i + 1}`, value: v }));
  applyChartA11y(canvas, a11yLabel, a11yData);
  return canvas;
}

// src/ts/charts-donut.ts
function donut(canvas, segments, opts) {
  const o = {
    thickness: 0.25,
    gap: 0.02,
    startAngle: -Math.PI / 2,
    animate: true,
    bgRing: "rgba(200,200,200,0.06)",
    ...opts
  };
  const size = getCanvasSize(canvas, 140, 140);
  const s = Math.min(size.width, size.height);
  const _ctx = chartHiDpi(canvas, s, s);
  if (!_ctx) return void 0;
  const ctx = _ctx;
  const cx = s / 2;
  const cy = s / 2;
  const outer = s / 2 - 4;
  const inner = outer * (1 - o.thickness);
  let total = 0;
  segments.forEach((seg) => {
    total += seg.value;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, (outer + inner) / 2, 0, Math.PI * 2);
  ctx.strokeStyle = o.bgRing;
  ctx.lineWidth = outer - inner;
  ctx.stroke();
  let angle = o.startAngle;
  segments.forEach((seg, idx) => {
    const sweep = seg.value / total * (Math.PI * 2 - o.gap * segments.length);
    ctx.beginPath();
    ctx.arc(cx, cy, (outer + inner) / 2, angle, angle + sweep);
    ctx.strokeStyle = seg.color || SERIES[idx % SERIES.length];
    ctx.lineWidth = outer - inner;
    ctx.lineCap = "round";
    ctx.stroke();
    angle += sweep + o.gap;
  });
  const segDesc = segments.map((s2, i) => {
    const pct = total > 0 ? Math.round(s2.value / total * 100) : 0;
    return `segment ${i + 1} ${pct}%`;
  }).join(", ");
  const a11yLabel = `Donut chart: ${segDesc}`;
  const a11yData = segments.map((s2, i) => {
    const segPct = total > 0 ? Math.round(s2.value / total * 100) : 0;
    return { label: `Segment ${i + 1}`, value: `${segPct}%` };
  });
  applyChartA11y(canvas, a11yLabel, a11yData);
  return canvas;
}

// src/ts/charts-sparkbar.ts
function barChart(canvas, data, opts) {
  const o = {
    colors: SERIES,
    barRadius: 3,
    gap: 0.3,
    showLabels: true,
    animate: true,
    maxY: null,
    gridColor: "rgba(200,200,200,0.06)",
    labelColor: "#616161",
    ...opts
  };
  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return void 0;
  if (!data || data.length === 0) return void 0;
  const maxVal = o.maxY ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const pad = { top: 8, bottom: o.showLabels ? 22 : 8, left: 8, right: 8 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = chartW / data.length * (1 - o.gap);
  const gapW = chartW / data.length * o.gap;
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let g = 0; g <= 4; g++) {
    const gy = pad.top + g / 4 * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(w - pad.right, gy);
    ctx.stroke();
  }
  data.forEach((d, i) => {
    const x = pad.left + i * (barW + gapW) + gapW / 2;
    const barH = d.value / maxVal * chartH;
    const y = pad.top + chartH - barH;
    const color = d.color || o.colors[i % o.colors.length];
    ctx.beginPath();
    ctx.moveTo(x, y + o.barRadius);
    ctx.arcTo(x, y, x + o.barRadius, y, o.barRadius);
    ctx.arcTo(x + barW, y, x + barW, y + o.barRadius, o.barRadius);
    ctx.lineTo(x + barW, pad.top + chartH);
    ctx.lineTo(x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (o.showLabels && d.label) {
      ctx.fillStyle = o.labelColor;
      ctx.font = "500 " + Math.min(10, barW * 0.6) + "px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, x + barW / 2, h - 4);
    }
  });
  const highest = data.reduce((a, b) => b.value > a.value ? b : a, data[0]);
  const a11yLabel = `Bar chart: ${data.length} categories, highest ${highest.label || "item"} at ${highest.value}`;
  const a11yData = data.map((d) => ({ label: d.label || "item", value: d.value }));
  applyChartA11y(canvas, a11yLabel, a11yData);
  return canvas;
}

// src/ts/charts-area.ts
function areaChart(canvas, datasets, opts) {
  const o = {
    colors: SERIES,
    fillOpacity: 0.12,
    lineWidth: 1.5,
    gridColor: "rgba(200,200,200,0.06)",
    gridRows: 4,
    smooth: true,
    showDots: false,
    maxY: null,
    ...opts
  };
  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return void 0;
  if (!datasets || datasets.length === 0) return void 0;
  let allVals = [];
  datasets.forEach((ds) => {
    allVals = allVals.concat(ds.data);
  });
  const maxVal = o.maxY ?? Math.max(...allVals) * 1.15;
  const maxLen = Math.max(...datasets.map((ds) => ds.data.length));
  const pad = { top: 8, bottom: 8, left: 8, right: 8 };
  const gx = (i) => pad.left + i / (maxLen - 1) * (w - pad.left - pad.right);
  const gy = (v) => h - pad.bottom - v / maxVal * (h - pad.top - pad.bottom);
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= o.gridRows; r++) {
    const yy = pad.top + r / o.gridRows * (h - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(w - pad.right, yy);
    ctx.stroke();
  }
  datasets.forEach((ds, dsi) => {
    const color = ds.color || o.colors[dsi % o.colors.length];
    const data = ds.data;
    if (!data || data.length < 2) return;
    ctx.beginPath();
    drawSmoothLine(ctx, data, gx, gy, o.smooth);
    ctx.strokeStyle = color;
    ctx.lineWidth = o.lineWidth;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.lineTo(gx(data.length - 1), h - pad.bottom);
    ctx.lineTo(gx(0), h - pad.bottom);
    ctx.closePath();
    const hexR = parseInt(color.slice(1, 3), 16);
    const hexG = parseInt(color.slice(3, 5), 16);
    const hexB = parseInt(color.slice(5, 7), 16);
    const aGrad = ctx.createLinearGradient(0, 0, 0, h);
    aGrad.addColorStop(0, `rgba(${hexR},${hexG},${hexB},${o.fillOpacity})`);
    aGrad.addColorStop(1, `rgba(${hexR},${hexG},${hexB},0)`);
    ctx.fillStyle = aGrad;
    ctx.fill();
  });
  const maxPts = Math.max(...datasets.map((ds) => ds.data.length));
  const a11yLabel = `Area chart: ${datasets.length} series, ${maxPts} points`;
  const a11yData = datasets.map((ds, i) => ({
    label: `Series ${i + 1}`,
    value: `${ds.data.length} points, last ${ds.data[ds.data.length - 1] ?? 0}`
  }));
  applyChartA11y(canvas, a11yLabel, a11yData);
  return canvas;
}

// src/ts/charts-radar.ts
function radar(canvas, data, opts) {
  const o = {
    max: 100,
    levels: 4,
    gridColor: "rgba(200,200,200,0.1)",
    labelColor: cssVar("--mn-text-tertiary"),
    color: cssVar("--mn-accent"),
    fillOpacity: 0.15,
    lineWidth: 1.5,
    dotRadius: 3,
    ...opts
  };
  const sz = getCanvasSize(canvas, 200, 200);
  const s = Math.min(sz.width, sz.height);
  const ctx = chartHiDpi(canvas, s, s);
  if (!ctx) return void 0;
  const cx = s / 2;
  const cy = s / 2;
  const radius = s / 2 - 30;
  const n = data.length;
  const angleStep = Math.PI * 2 / n;
  function getPoint(i, value) {
    const a = -Math.PI / 2 + i * angleStep;
    const r = value / o.max * radius;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  }
  for (let lvl = 1; lvl <= o.levels; lvl++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = getPoint(i, lvl / o.levels * o.max);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = o.gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  for (let a = 0; a < n; a++) {
    const ep = getPoint(a, o.max);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ep.x, ep.y);
    ctx.strokeStyle = o.gridColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    const lp = getPoint(a, o.max * 1.15);
    ctx.fillStyle = o.labelColor;
    ctx.font = "500 9px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data[a].label || "", lp.x, lp.y);
  }
  ctx.beginPath();
  data.forEach((d, i) => {
    const p = getPoint(i, d.value);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.strokeStyle = o.color;
  ctx.lineWidth = o.lineWidth;
  ctx.stroke();
  const hexR = parseInt(o.color.slice(1, 3), 16);
  const hexG = parseInt(o.color.slice(3, 5), 16);
  const hexB = parseInt(o.color.slice(5, 7), 16);
  ctx.fillStyle = `rgba(${hexR},${hexG},${hexB},${o.fillOpacity})`;
  ctx.fill();
  data.forEach((d, i) => {
    const p = getPoint(i, d.value);
    ctx.beginPath();
    ctx.arc(p.x, p.y, o.dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = o.color;
    ctx.fill();
  });
  const a11yData = data.map((d) => ({ label: d.label, value: d.value }));
  applyChartA11y(canvas, `Radar chart: ${n} dimensions`, a11yData);
  return canvas;
}

// src/ts/charts-bubble.ts
function bubble(canvas, data, opts) {
  const o = {
    colors: SERIES,
    maxBubbleRadius: 30,
    gridColor: "rgba(200,200,200,0.06)",
    axisColor: "#616161",
    opacity: 0.6,
    maxY: null,
    ...opts
  };
  const size = getCanvasSize(canvas, 300, 200);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return void 0;
  if (!data || data.length === 0) return void 0;
  const pad = { top: 12, bottom: 12, left: 12, right: 12 };
  const maxX = Math.max(...data.map((d) => d.x)) * 1.1;
  const maxY = o.maxY ?? Math.max(...data.map((d) => d.y)) * 1.1;
  const maxZ = Math.max(...data.map((d) => d.z ?? 1));
  const gx = (v) => pad.left + v / maxX * (w - pad.left - pad.right);
  const gy = (v) => h - pad.bottom - v / maxY * (h - pad.top - pad.bottom);
  const gr = (v) => Math.max(4, v / maxZ * o.maxBubbleRadius);
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= 4; r++) {
    const yy = pad.top + r / 4 * (h - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, yy);
    ctx.lineTo(w - pad.right, yy);
    ctx.stroke();
  }
  data.forEach((d, i) => {
    const bx = gx(d.x);
    const by = gy(d.y);
    const br = gr(d.z ?? 1);
    const color = d.color || o.colors[i % o.colors.length];
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = o.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (d.label) {
      ctx.fillStyle = "#c8c8c8";
      ctx.font = "500 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.label, bx, by + br + 12);
    }
  });
  const a11yData = data.map((d) => ({
    label: d.label || `(${d.x}, ${d.y})`,
    value: `z ${d.z ?? 1}`
  }));
  applyChartA11y(canvas, `Bubble chart: ${data.length} data points`, a11yData);
  return canvas;
}

// src/ts/charts-hbar.ts
function hexLum(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function createEl(tag, cls, text) {
  const el2 = document.createElement(tag);
  if (cls) el2.className = cls;
  if (text != null) el2.textContent = text;
  return el2;
}
function normalizeHex(color) {
  if (typeof color !== "string") return cssVar("--chart-bar", "#4EA8DE");
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return cssVar("--chart-bar", "#4EA8DE");
}
function buildTicks(maxValue) {
  const ticks = [];
  const step = maxValue / 4;
  for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 100) / 100);
  return ticks;
}
function clampVal(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function hBarChart(container, opts) {
  const root = typeof container === "string" ? document.querySelector(container) : container;
  if (!root) {
    console.warn("[Maranello] hBarChart: container not found");
    return null;
  }
  const state = {
    opts: {
      title: "",
      bars: [],
      unit: "",
      maxValue: 100,
      showValues: true,
      showGrid: true,
      sortDescending: true,
      animate: true,
      barHeight: 28,
      onClick: void 0,
      ...opts
    },
    listeners: [],
    timers: [],
    activeIndex: -1,
    disposed: false
  };
  const frame = createEl("div", "mn-hbar");
  const titleEl = createEl("div", "mn-hbar__title");
  const chartWrap = createEl("div", "mn-hbar__chart");
  const gridLayer = createEl("div", "mn-hbar__grid");
  const rowsLayer = createEl("div", "mn-hbar__rows");
  const axis = createEl("div", "mn-hbar__axis");
  const axisSpacer = createEl("div", "mn-hbar__axis-spacer");
  const axisLabels = createEl("div", "mn-hbar__axis-labels");
  const tooltip = createEl("div", "mn-hbar__tooltip");
  chartWrap.appendChild(gridLayer);
  chartWrap.appendChild(rowsLayer);
  axis.appendChild(axisSpacer);
  axis.appendChild(axisLabels);
  frame.appendChild(titleEl);
  frame.appendChild(chartWrap);
  frame.appendChild(axis);
  frame.appendChild(tooltip);
  const host = root;
  host.innerHTML = "";
  host.classList.add("mn-hbar-host");
  host.appendChild(frame);
  function addListener(el2, evt, handler) {
    el2.addEventListener(evt, handler);
    state.listeners.push({ el: el2, evt, handler });
  }
  function cleanupTimers() {
    while (state.timers.length) {
      const t = state.timers.pop();
      if (t != null) window.clearTimeout(t);
    }
  }
  function showTip(text, evt) {
    tooltip.textContent = text;
    tooltip.classList.add("is-visible");
    const rect = frame.getBoundingClientRect();
    let x = evt.clientX - rect.left + 12;
    let y = evt.clientY - rect.top - 30;
    if (x > rect.width - 140) x = rect.width - 140;
    if (y < 6) y = evt.clientY - rect.top + 14;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
  }
  function render() {
    if (state.disposed) return;
    cleanupTimers();
    rowsLayer.innerHTML = "";
    gridLayer.innerHTML = "";
    axisLabels.innerHTML = "";
    let maxValue = Number(state.opts.maxValue) || 100;
    if (maxValue <= 0) maxValue = 100;
    let bars = (state.opts.bars || []).map((bar, idx) => ({
      label: bar?.label != null ? String(bar.label) : "Item " + (idx + 1),
      value: Number(bar?.value ?? 0),
      color: normalizeHex(bar?.color)
    }));
    if (state.opts.sortDescending) {
      bars.sort((a, b) => b.value - a.value);
    }
    const ticks = buildTicks(maxValue);
    titleEl.style.display = state.opts.title ? "" : "none";
    titleEl.textContent = state.opts.title || "";
    const highest = bars.length > 0 ? bars.reduce((a, b) => b.value > a.value ? b : a, bars[0]) : null;
    const hbarLabel = highest ? `Bar chart: ${bars.length} categories, highest ${highest.label} at ${highest.value}` : state.opts.title || "Horizontal bar chart";
    host.setAttribute("role", "img");
    host.setAttribute("aria-label", hbarLabel);
    const prevSr = host.querySelector(".mn-sr-only");
    if (prevSr) prevSr.remove();
    const srSpan = createEl("span", "mn-sr-only", hbarLabel);
    frame.appendChild(srSpan);
    frame.style.setProperty(
      "--mn-hbar-bar-height",
      (state.opts.barHeight || 28) + "px"
    );
    if (state.opts.showGrid) {
      ticks.forEach((tick) => {
        const line = createEl("div", "mn-hbar__grid-line");
        line.style.left = tick / maxValue * 100 + "%";
        gridLayer.appendChild(line);
      });
    }
    ticks.forEach((tick) => {
      const aLabel = createEl(
        "div",
        "mn-hbar__axis-label",
        tick + (state.opts.unit || "")
      );
      aLabel.style.left = tick / maxValue * 100 + "%";
      axisLabels.appendChild(aLabel);
    });
    bars.forEach((bar, index) => {
      const row = createEl("div", "mn-hbar__row");
      const label = createEl("div", "mn-hbar__label", bar.label);
      const track = createEl("div", "mn-hbar__track");
      const fill = createEl("div", "mn-hbar__fill");
      const valueEl = createEl("div", "mn-hbar__value");
      const pct = clampVal(bar.value / maxValue * 100, 0, 100);
      const txtColor = hexLum(bar.color) > 0.55 ? "#111111" : "#FFFFFF";
      const safeColor = isValidColor(bar.color) ? bar.color : cssVar("--mn-accent");
      fill.style.background = safeColor;
      fill.style.height = (state.opts.barHeight || 28) + "px";
      fill.style.width = state.opts.animate ? "0%" : pct + "%";
      valueEl.style.color = txtColor;
      valueEl.textContent = bar.value + (state.opts.unit || "");
      valueEl.style.display = state.opts.showValues ? "" : "none";
      fill.appendChild(valueEl);
      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      rowsLayer.appendChild(row);
      const tipText = bar.label + ": " + bar.value + (state.opts.unit || "");
      addListener(row, "mouseenter", (evt) => showTip(tipText, evt));
      addListener(row, "mousemove", (evt) => showTip(tipText, evt));
      addListener(row, "mouseleave", () => tooltip.classList.remove("is-visible"));
      addListener(row, "click", () => {
        const prev = rowsLayer.querySelector(".mn-hbar__row.is-active");
        if (prev) prev.classList.remove("is-active");
        row.classList.add("is-active");
        state.activeIndex = index;
        if (typeof state.opts.onClick === "function") {
          state.opts.onClick(bar, index);
        }
      });
      if (state.opts.animate) {
        const t = window.setTimeout(() => {
          fill.style.width = pct + "%";
        }, index * 50);
        state.timers.push(t);
      }
    });
  }
  render();
  return {
    update(newBars) {
      if (state.disposed) return;
      state.opts.bars = Array.isArray(newBars) ? newBars.slice() : [];
      state.activeIndex = -1;
      render();
    },
    destroy() {
      if (state.disposed) return;
      state.disposed = true;
      cleanupTimers();
      state.listeners.forEach((l) => l.el.removeEventListener(l.evt, l.handler));
      state.listeners = [];
      host.innerHTML = "";
      host.classList.remove("mn-hbar-host");
    }
  };
}

// src/ts/gauge-engine-draw-details.ts
function drawNeedle(s, progress, sa, totalSweep, value, max, color) {
  const { ctx, cx, cy, radius } = s;
  const curVal = value * progress;
  const needleAngle = s.rad(sa + curVal / max * totalSweep);
  const needleLen = radius * 0.82, nTail = radius * 0.18;
  const tipX = cx + Math.cos(needleAngle) * needleLen;
  const tipY = cy + Math.sin(needleAngle) * needleLen;
  const perpAngle = needleAngle + Math.PI / 2;
  const bw = Math.max(1.8, s.size * 0.012);
  const tailX = cx - Math.cos(needleAngle) * nTail;
  const tailY = cy - Math.sin(needleAngle) * nTail;
  const tw = bw * 1.5;
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(cx + Math.cos(perpAngle) * bw, cy + Math.sin(perpAngle) * bw);
  ctx.lineTo(tailX + Math.cos(perpAngle) * tw, tailY + Math.sin(perpAngle) * tw);
  ctx.lineTo(tailX - Math.cos(perpAngle) * tw, tailY - Math.sin(perpAngle) * tw);
  ctx.lineTo(cx - Math.cos(perpAngle) * bw, cy - Math.sin(perpAngle) * bw);
  ctx.closePath();
  const ng = ctx.createLinearGradient(tailX, tailY, tipX, tipY);
  ng.addColorStop(0, s.palette.needleTail);
  ng.addColorStop(0.3, color);
  ng.addColorStop(0.85, color);
  ng.addColorStop(1, s.palette.needleTip);
  ctx.fillStyle = ng;
  ctx.fill();
  ctx.restore();
  const capR = radius * 0.11;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, capR, 0, Math.PI * 2);
  const cg = ctx.createRadialGradient(cx - capR * 0.2, cy - capR * 0.3, 0, cx, cy, capR);
  s.palette.capOuter.forEach((c, i) => cg.addColorStop(i / 3, c));
  ctx.fillStyle = cg;
  ctx.fill();
  ctx.restore();
  const capR2 = capR * 0.65;
  const cg2 = ctx.createRadialGradient(cx - capR2 * 0.15, cy - capR2 * 0.2, 0, cx, cy, capR2);
  s.palette.capInner.forEach((c, i) => cg2.addColorStop(i / 2, c));
  ctx.beginPath();
  ctx.arc(cx, cy, capR2, 0, Math.PI * 2);
  ctx.fillStyle = cg2;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, capR * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = s.palette.capCenter;
  ctx.fill();
}
function drawCenterText(s, c) {
  const fsCtr = Math.max(20, s.size * 0.22);
  if (c.centerValue) {
    s.ctx.font = `700 ${fsCtr}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerValue, s.cx, s.cy);
  }
  if (c.centerUnit) {
    s.ctx.font = `500 ${Math.max(8, s.size * 0.055)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerUnit;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerUnit, s.cx, s.cy + fsCtr * 0.55);
  }
  if (c.centerLabel) {
    s.ctx.font = `600 ${Math.max(7, s.size * 0.045)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerLabel;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerLabel, s.cx, s.cy - fsCtr * 0.65);
  }
}
function drawSubDials(s, c, progress) {
  const subs = c.subDials;
  if (!subs) return;
  subs.forEach((sd) => {
    const sx = s.cx + sd.x * s.size;
    const sy = s.cy + sd.y * s.size;
    const sr = s.size * 0.1;
    const bg = s.ctx.createRadialGradient(sx, sy - 1, sr * 0.2, sx, sy, sr);
    bg.addColorStop(0, s.palette.subDialBg[0]);
    bg.addColorStop(1, s.palette.subDialBg[1]);
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    s.ctx.fillStyle = bg;
    s.ctx.fill();
    s.ctx.strokeStyle = s.palette.subDialBorder;
    s.ctx.lineWidth = 1.5;
    s.ctx.stroke();
    const sSa = s.rad(-225), sEa = s.rad(45);
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr * 0.72, sSa, sEa);
    s.ctx.strokeStyle = s.palette.subDialTrack;
    s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = "round";
    s.ctx.stroke();
    const val = sd.value / sd.max * 270 * progress;
    s.ctx.beginPath();
    s.ctx.arc(sx, sy, sr * 0.72, sSa, s.rad(-225 + val));
    s.ctx.strokeStyle = sd.color;
    s.ctx.lineWidth = 2.5;
    s.ctx.lineCap = "round";
    s.ctx.stroke();
    const sfs = Math.max(8, sr * 0.55);
    s.ctx.font = `700 ${sfs}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = sd.color;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(Math.round(sd.value * progress).toString(), sx, sy - sr * 0.05);
    if (s.density !== "sm") {
      const lfs = Math.max(5, sr * 0.32);
      s.ctx.font = `500 ${lfs}px 'Barlow Condensed',sans-serif`;
      s.ctx.fillStyle = s.palette.axisLabel;
      s.ctx.fillText(sd.label, sx, sy + sr * 0.45);
    }
  });
}
function drawOdometer(s, c) {
  const od = c.odometer;
  if (!od) return;
  const oy = s.cy + s.radius * 0.62;
  const dw = Math.max(10, s.size * 0.055);
  const dh = Math.max(14, s.size * 0.07);
  const digits = od.digits;
  const highlightLast = od.highlightLast;
  const totalW = digits.length * (dw + 1);
  let ox = s.cx - totalW / 2;
  digits.forEach((d, i) => {
    const isLast = i === digits.length - 1 && highlightLast;
    s.ctx.fillStyle = isLast ? "#DC0000" : s.palette.odometerBg;
    s.ctx.strokeStyle = isLast ? "#DC0000" : s.palette.odometerBorder;
    s.ctx.lineWidth = 0.8;
    s.ctx.beginPath();
    s.ctx.roundRect(ox, oy - dh / 2, dw, dh, 2);
    s.ctx.fill();
    s.ctx.stroke();
    s.ctx.font = `600 ${Math.max(7, dw * 0.6)}px 'Barlow Condensed',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(String(d), ox + dw / 2, oy);
    ox += dw + 1;
  });
}
function drawStatusLed(s, c) {
  const led = c.statusLed;
  if (!led) return;
  const lx = s.cx - s.radius * 0.25;
  const ly = s.cy + s.radius * 0.38;
  s.ctx.save();
  s.ctx.shadowColor = led.color;
  s.ctx.shadowBlur = 6;
  s.ctx.beginPath();
  s.ctx.arc(lx, ly, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = led.color;
  s.ctx.fill();
  s.ctx.restore();
  s.ctx.font = `500 ${Math.max(5, s.size * 0.03)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = led.color;
  s.ctx.textAlign = "left";
  s.ctx.textBaseline = "middle";
  s.ctx.fillText(led.label, lx + 7, ly);
}
function drawTrend(s, c) {
  const t = c.trend;
  if (!t) return;
  const tx = s.cx + s.radius * 0.25;
  const ty = s.cy + s.radius * 0.38;
  s.ctx.font = `600 ${Math.max(6, s.size * 0.035)}px 'Barlow Condensed',sans-serif`;
  s.ctx.fillStyle = t.color;
  s.ctx.textAlign = "right";
  s.ctx.textBaseline = "middle";
  const arrow = t.direction === "up" ? "\u25B2" : "\u25BC";
  s.ctx.fillText(arrow + " " + t.delta, tx, ty);
}

// src/ts/gauge-engine-draw.ts
function drawGauge(state, progress) {
  const { ctx, cx, cy, radius, size, config: cfg, palette: P } = state;
  const c = cfg.complications || {};
  ctx.clearRect(0, 0, size, size);
  const shadowGrad = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.1);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
  shadowGrad.addColorStop(0.25, "rgba(0,0,0,0.15)");
  shadowGrad.addColorStop(0.5, "rgba(0,0,0,0.4)");
  shadowGrad.addColorStop(0.75, "rgba(0,0,0,0.2)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.94, 0, Math.PI * 2);
  ctx.strokeStyle = shadowGrad;
  ctx.lineWidth = radius * 0.28;
  ctx.stroke();
  const vigGrad = ctx.createRadialGradient(cx, cy * 0.95, radius * 0.1, cx, cy, radius * 0.95);
  vigGrad.addColorStop(0, "rgba(0,0,0,0)");
  vigGrad.addColorStop(0.6, "rgba(0,0,0,0)");
  vigGrad.addColorStop(0.85, "rgba(0,0,0,0.15)");
  vigGrad.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = vigGrad;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
  ctx.strokeStyle = P.highlightRing;
  ctx.lineWidth = 1;
  ctx.stroke();
  const sa = cfg.startAngle ?? -135;
  const ea = cfg.endAngle ?? 135;
  const ticks = cfg.ticks ?? 0;
  const subticks = cfg.subticks ?? 1;
  const value = cfg.value ?? 0;
  const max = cfg.max ?? 100;
  const color = cfg.color ?? "#FFC72C";
  const showNeedle = cfg.showNeedle ?? true;
  const numbers = cfg.numbers ?? [];
  const totalSweep = ea - sa;
  drawInnerRing(state, c, progress, sa, totalSweep);
  drawTicks(state, ticks, subticks, sa, totalSweep);
  drawNumbers(state, numbers, sa, totalSweep, max);
  drawArcBar(state, c, progress, sa, totalSweep);
  if (showNeedle && ticks > 0) {
    drawNeedle(state, progress, sa, totalSweep, value, max, color);
  }
  drawCenterText(state, c);
  drawSubDials(state, c, progress);
  drawOdometer(state, c);
  drawStatusLed(state, c);
  drawTrend(state, c);
}
function drawInnerRing(s, c, progress, sa, totalSweep) {
  const ir = c.innerRing;
  if (!ir) return;
  const irR = s.radius * 0.48;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha;
  s.ctx.lineWidth = 3;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const val = ir.value / ir.max * totalSweep * progress;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, irR, s.rad(sa), s.rad(sa + val));
  s.ctx.strokeStyle = ir.color;
  s.ctx.lineWidth = 3;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const fs = Math.max(7, s.size * 0.04);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.fillStyle = ir.color;
  s.ctx.textAlign = "center";
  s.ctx.textBaseline = "middle";
  s.ctx.fillText(ir.label, s.cx, s.cy + s.radius * 0.5);
}
function drawTicks(s, ticks, subticks, sa, totalSweep) {
  if (ticks <= 0) return;
  const total = ticks * subticks;
  const skipMinor = s.density === "sm";
  for (let i = 0; i <= total; i++) {
    const angle = s.rad(sa + i / total * totalSweep);
    const isMajor = i % subticks === 0;
    const isHalf = subticks > 1 && i % Math.floor(subticks / 2) === 0 && !isMajor;
    if (skipMinor && !isMajor && !isHalf) continue;
    let innerR, outerR, lw, tc;
    if (isMajor) {
      innerR = 0.7;
      outerR = 0.92;
      lw = 2.2;
      tc = s.palette.tickMajor;
    } else if (isHalf) {
      innerR = 0.78;
      outerR = 0.92;
      lw = 1;
      tc = s.palette.tickHalf;
    } else {
      innerR = 0.84;
      outerR = 0.92;
      lw = 0.6;
      tc = s.palette.tickMinor;
    }
    s.ctx.beginPath();
    s.ctx.moveTo(s.cx + Math.cos(angle) * s.radius * innerR, s.cy + Math.sin(angle) * s.radius * innerR);
    s.ctx.lineTo(s.cx + Math.cos(angle) * s.radius * outerR, s.cy + Math.sin(angle) * s.radius * outerR);
    s.ctx.strokeStyle = tc;
    s.ctx.lineWidth = lw;
    s.ctx.lineCap = "butt";
    s.ctx.stroke();
  }
}
function drawNumbers(s, numbers, sa, totalSweep, max) {
  if (!numbers.length) return;
  const fs = Math.max(8, s.size * 0.055);
  s.ctx.font = `500 ${fs}px 'Barlow Condensed','Outfit',sans-serif`;
  s.ctx.textAlign = "center";
  s.ctx.textBaseline = "middle";
  const step = s.density === "sm" && numbers.length > 5 ? 2 : 1;
  numbers.forEach((num, idx) => {
    if (step > 1 && idx % step !== 0 && idx !== numbers.length - 1) return;
    const angle = s.rad(sa + num / max * totalSweep);
    s.ctx.fillStyle = s.palette.numbers;
    s.ctx.fillText(
      num.toString(),
      s.cx + Math.cos(angle) * s.radius * 0.56,
      s.cy + Math.sin(angle) * s.radius * 0.56
    );
  });
}
function drawArcBar(s, c, progress, sa, totalSweep) {
  const ab = c.arcBar;
  if (!ab) return;
  const arcR = s.radius * 0.96;
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), s.rad(sa + totalSweep));
  s.ctx.strokeStyle = s.palette.trackAlpha;
  s.ctx.lineWidth = 5;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const val = ab.value / ab.max * totalSweep * progress;
  const fillEnd = s.rad(sa + val);
  const arcFrac = totalSweep / 360;
  const g = s.ctx.createConicGradient(s.rad(sa), s.cx, s.cy);
  const stops = ab.colorStops || ["#DC0000", "#FFC72C", "#00A651"];
  stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1) * arcFrac, col));
  s.ctx.beginPath();
  s.ctx.arc(s.cx, s.cy, arcR, s.rad(sa), fillEnd);
  s.ctx.strokeStyle = g;
  s.ctx.lineWidth = 5;
  s.ctx.lineCap = "round";
  s.ctx.stroke();
  const na = s.rad(sa + val);
  s.ctx.beginPath();
  s.ctx.arc(s.cx + Math.cos(na) * arcR, s.cy + Math.sin(na) * arcR, 3, 0, Math.PI * 2);
  s.ctx.fillStyle = s.palette.arcDot;
  s.ctx.fill();
  const fs = Math.max(7, s.size * 0.04);
  if (ab.labelCenter) {
    s.ctx.font = `600 ${fs}px 'Barlow Condensed',sans-serif`;
    s.ctx.fillStyle = "#00A651";
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(ab.labelCenter, s.cx, s.cy + s.radius * 0.78);
  }
  const sfs = Math.max(6, s.size * 0.03);
  if (ab.labelLeft) {
    s.ctx.font = `400 ${sfs}px 'Inter',sans-serif`;
    s.ctx.fillStyle = s.palette.muted;
    s.ctx.textAlign = "left";
    s.ctx.fillText(ab.labelLeft, s.cx - s.radius * 0.65, s.cy + s.radius * 0.92);
  }
  if (ab.labelRight) {
    s.ctx.textAlign = "right";
    s.ctx.fillText(ab.labelRight, s.cx + s.radius * 0.65, s.cy + s.radius * 0.92);
  }
}

// src/ts/gauge-engine-palette.ts
function buildGaugePalette(accent) {
  const D = {
    numbers: "#c8c8c8",
    centerValue: "#fafafa",
    centerUnit: "#9e9e9e",
    centerLabel: "#666",
    muted: "#666",
    dimmed: "#555",
    subDialLabel: "#888",
    tickMajor: "#D4A826",
    tickHalf: "#9A7B1C",
    tickMinor: "#5a4a14",
    highlightRing: "rgba(255,255,255,0.04)",
    trackAlpha: "rgba(255,255,255,0.06)",
    arcDot: "#fff",
    needleTail: "#555",
    needleTip: "#fff",
    capOuter: ["#888", "#555", "#333", "#1a1a1a"],
    capInner: ["#aaa", "#666", "#2a2a2a"],
    capCenter: "#444",
    subDialBg: ["#222", "#111"],
    subDialBorder: "#3a3a3a",
    subDialTrack: "rgba(255,255,255,0.08)",
    odometerBg: "#1a1a1a",
    odometerBorder: "#333",
    odometerText: "#fafafa",
    ledLabel: null,
    axisLabel: "#888",
    axisTitle: "#9e9e9e",
    gridScale: "#666",
    sparkMonth: "#555",
    sparkLabel: "#666",
    quadrant: "#888",
    quadrantDim: "#555",
    quadrantHi: accent
  };
  const cl = document.body.classList;
  if (cl.contains("mn-avorio")) {
    return {
      ...D,
      /* Text / numbers — dark on light surface */
      numbers: "#3a3530",
      centerValue: "#1a1a1a",
      centerUnit: "#666660",
      centerLabel: "#4a4540",
      muted: "#666660",
      dimmed: "#7a7570",
      subDialLabel: "#5a5550",
      axisLabel: "#4a4540",
      axisTitle: "#5a5550",
      gridScale: "#8a8580",
      sparkMonth: "#8a8580",
      sparkLabel: "#7a7570",
      quadrant: "#a0a09a",
      quadrantDim: "#b0aba4",
      /* Ticks — darker gold for contrast on ivory */
      tickMajor: "#a07818",
      tickHalf: "#806010",
      tickMinor: "#604808",
      /* Bezel chrome — warm silver instead of dark chrome */
      capOuter: ["#d0cfc9", "#b8b4ae", "#a09e98", "#888582"],
      capInner: ["#d8d4ce", "#c0bcb6", "#a8a49e"],
      capCenter: "#b0aba4",
      /* Needle */
      needleTail: "#a8a49e",
      needleTip: "#1a1a1a",
      /* Highlight / track */
      highlightRing: "rgba(0,0,0,0.04)",
      trackAlpha: "rgba(0,0,0,0.06)",
      /* Sub-dials and odometer */
      subDialBg: ["#e8e4dc", "#ddd8ce"],
      subDialBorder: "#c0b9ad",
      subDialTrack: "rgba(0,0,0,0.08)",
      odometerBg: "#f0ede6",
      odometerBorder: "#ccc",
      odometerText: "#1a1a1a"
    };
  }
  if (cl.contains("mn-sugar")) {
    return {
      ...D,
      numbers: "#333",
      centerValue: "#111",
      centerUnit: "#666",
      centerLabel: "#444",
      muted: "#666",
      dimmed: "#777",
      subDialLabel: "#555",
      axisLabel: "#444",
      axisTitle: "#555",
      gridScale: "#888",
      sparkMonth: "#888",
      sparkLabel: "#777",
      quadrant: "#999",
      quadrantDim: "#aaa",
      tickMajor: "#888",
      tickHalf: "#aaa",
      tickMinor: "#ccc",
      capOuter: ["#D0D0D5", "#C0C0C5", "#B0B0B5", "#A0A0A5"],
      capInner: ["#D8D8DC", "#C8C8CC", "#B0B0B5"],
      capCenter: "#C0C0C5",
      needleTail: "#999",
      needleTip: "#111",
      highlightRing: "rgba(0,0,0,0.06)",
      trackAlpha: "rgba(0,0,0,0.08)",
      subDialBg: ["#d0d0d5", "#c0c0c5"],
      subDialBorder: "#b0b0b5",
      subDialTrack: "rgba(0,0,0,0.10)",
      odometerBg: "#e4e4e8",
      odometerBorder: "#d0d0d5",
      odometerText: "#111"
    };
  }
  if (cl.contains("mn-colorblind")) {
    return {
      ...D,
      tickMajor: "#FFB000",
      tickHalf: "#B87E00",
      tickMinor: "#7A5400",
      quadrantHi: "#0072B2"
    };
  }
  if (cl.contains("mn-nero")) {
    return {
      ...D,
      numbers: "#e0e0e0",
      subDialBg: ["#1a1a1a", "#0a0a0a"],
      subDialBorder: "#2a2a2a",
      odometerBg: "#0a0a0a",
      odometerBorder: "#222"
    };
  }
  return D;
}

// src/ts/gauge-engine-complications.ts
function drawComplications(state, progress) {
  const c = state.config;
  const comp = c.complications || c;
  const { ctx, size } = state;
  const cx = size / 2, cy = size / 2, radius = size * 0.44;
  const P = state.palette;
  if (comp.crosshair) {
    drawCrosshair(
      ctx,
      comp.crosshair,
      cx,
      cy,
      radius,
      size,
      progress,
      P,
      c
    );
  }
  if (comp.multigraph) {
    drawMultigraph(
      ctx,
      comp.multigraph,
      cx,
      cy,
      radius,
      size,
      progress,
      P
    );
  }
}
function drawCrosshair(ctx, ch, cx, cy, radius, size, progress, P, cfg) {
  const gridR = radius * 0.78;
  ctx.strokeStyle = ch.gridColor || "#5a4a20";
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(cx - gridR, cy);
  ctx.lineTo(cx + gridR, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - gridR);
  ctx.lineTo(cx, cy + gridR);
  ctx.stroke();
  ctx.globalAlpha = 0.25;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    ctx.beginPath();
    ctx.moveTo(cx - gridR, cy - d);
    ctx.lineTo(cx + gridR, cy - d);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - gridR, cy + d);
    ctx.lineTo(cx + gridR, cy + d);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - d, cy - gridR);
    ctx.lineTo(cx - d, cy + gridR);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + d, cy - gridR);
    ctx.lineTo(cx + d, cy + gridR);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const sfs = Math.max(5, size * 0.028);
  ctx.font = `400 ${sfs}px 'Inter', sans-serif`;
  ctx.fillStyle = P.muted;
  for (let i = 1; i <= 4; i++) {
    const d = gridR * i / 4;
    const lbl = (i * 0.25).toFixed(2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(lbl, cx - gridR - 3, cy - d);
    ctx.fillText(lbl, cx - gridR - 3, cy + d);
  }
  const lfs = Math.max(6, size * 0.035);
  ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
  ctx.fillStyle = P.axisLabel;
  ctx.textAlign = "center";
  if (ch.labelTop) {
    ctx.textBaseline = "bottom";
    ctx.fillText(ch.labelTop, cx, cy - gridR - 4);
  }
  if (ch.labelBottom) {
    ctx.textBaseline = "top";
    ctx.fillText(ch.labelBottom, cx, cy + gridR + 4);
  }
  if (ch.labelLeft) {
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(ch.labelLeft, cx - gridR - 4, cy);
  }
  if (ch.labelRight) {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(ch.labelRight, cx + gridR + 4, cy);
  }
  if (ch.title) {
    const tfs = Math.max(6, size * 0.04);
    ctx.font = `600 ${tfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.axisTitle;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(ch.title, cx, cy - gridR - lfs - 6);
  }
  const dotCol = ch.dotColor || cssVar("--mn-accent");
  const dotX = cx + ch.x * gridR * progress;
  const dotY = cy + ch.y * gridR * progress;
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = dotCol;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - gridR, dotY);
  ctx.lineTo(cx + gridR, dotY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dotX, cy - gridR);
  ctx.lineTo(dotX, cy + gridR);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.shadowColor = dotCol;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fillStyle = dotCol;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  if (ch.scatterDots) {
    ch.scatterDots.forEach((sd) => {
      const sdx = cx + sd.x * gridR * progress;
      const sdy = cy + sd.y * gridR * progress;
      const sdR = sd.r || 3;
      ctx.save();
      ctx.globalAlpha = 0.6 + 0.4 * progress;
      ctx.shadowColor = sd.color;
      ctx.shadowBlur = sdR * 2;
      ctx.beginPath();
      ctx.arc(sdx, sdy, sdR, 0, Math.PI * 2);
      ctx.fillStyle = sd.color;
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(sdx, sdy, sdR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();
    });
  }
  if (cfg.quadrantCounts) {
    const qc = cfg.quadrantCounts;
    const qfs = Math.max(8, size * 0.05);
    const off = gridR * 0.5;
    ctx.font = `700 ${qfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.tl, cx - off, cy - off);
    ctx.fillStyle = cssVar("--mn-accent");
    ctx.fillText(qc.tr, cx + off, cy - off);
    ctx.fillStyle = P.dimmed;
    ctx.fillText(qc.bl, cx - off, cy + off);
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.br, cx + off, cy + off);
    ctx.globalAlpha = 1;
  }
}
function drawMultigraph(ctx, mg, cx, cy, radius, size, progress, P) {
  const data = mg.data;
  const gLeft = cx - radius * 0.65, gRight = cx + radius * 0.65;
  const gTop = cy - radius * 0.15, gBottom = cy + radius * 0.55;
  const gWidth = gRight - gLeft, gHeight = gBottom - gTop;
  const dataMin = Math.min(...data) * 0.8, dataMax = Math.max(...data) * 1.1;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = gTop + i / 4 * gHeight;
    ctx.beginPath();
    ctx.moveTo(gLeft, y);
    ctx.lineTo(gRight, y);
    ctx.stroke();
  }
  const visiblePoints = Math.max(1, Math.ceil(data.length * progress));
  ctx.beginPath();
  ctx.moveTo(gLeft, gBottom);
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + i / (data.length - 1) * gWidth;
    const y = gBottom - (data[i] - dataMin) / (dataMax - dataMin) * gHeight;
    ctx.lineTo(x, y);
  }
  const lastX = gLeft + (visiblePoints - 1) / (data.length - 1) * gWidth;
  ctx.lineTo(lastX, gBottom);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, gTop, 0, gBottom);
  areaGrad.addColorStop(0, mg.color + "30");
  areaGrad.addColorStop(1, mg.color + "05");
  ctx.fillStyle = areaGrad;
  ctx.fill();
  ctx.beginPath();
  for (let i = 0; i < visiblePoints; i++) {
    const x = gLeft + i / (data.length - 1) * gWidth;
    const y = gBottom - (data[i] - dataMin) / (dataMax - dataMin) * gHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = mg.color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  if (visiblePoints > 0) {
    const endI = visiblePoints - 1;
    const ex = gLeft + endI / (data.length - 1) * gWidth;
    const ey = gBottom - (data[endI] - dataMin) / (dataMax - dataMin) * gHeight;
    ctx.save();
    ctx.shadowColor = mg.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fillStyle = mg.color;
    ctx.fill();
    ctx.restore();
  }
  if (mg.label) {
    const lfs = Math.max(6, size * 0.035);
    ctx.font = `600 ${lfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.fillStyle = P.sparkLabel;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(mg.label, cx, gTop - 4);
  }
}

// src/ts/gauge-engine.ts
var SIZES = { sm: 120, md: 220, lg: 320 };
var FerrariGauge = class {
  constructor(canvas) {
    this.srSpan = null;
    this._resizeObserver = null;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = JSON.parse(canvas.dataset.gauge || "{}");
    this.applyColorMode();
    this.dpr = window.devicePixelRatio || 1;
    this.init();
    if (canvas.dataset.size === "fluid") this._attachFluidObserver();
  }
  get palette() {
    const accent = getAccent();
    return buildGaugePalette(accent);
  }
  /** Initialize canvas size from data attribute or parent bounds. */
  init() {
    const sizeKey = this.canvas.dataset.size;
    let size;
    if (sizeKey && sizeKey !== "fluid" && SIZES[sizeKey]) {
      size = SIZES[sizeKey];
    } else {
      const rect = (this.canvas.parentElement || this.canvas).getBoundingClientRect();
      size = Math.min(rect.width, rect.height);
    }
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.canvas.style.width = size + "px";
    this.canvas.style.height = size + "px";
    this.ctx.scale(this.dpr, this.dpr);
    this.size = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = size * 0.4;
    this.density = size <= 140 ? "sm" : size <= 260 ? "md" : "lg";
    this.initA11y();
    this.animate();
  }
  /** Set up ARIA attributes and screen-reader helpers on the canvas. */
  initA11y() {
    this.canvas.setAttribute("role", "img");
    const label = this.buildA11yLabel();
    this.canvas.setAttribute("aria-label", label);
    this.canvas.textContent = label;
    if (!this.srSpan) {
      this.srSpan = document.createElement("span");
      this.srSpan.className = "mn-sr-only";
      this.canvas.parentElement?.insertBefore(this.srSpan, this.canvas.nextSibling);
    }
    this.srSpan.textContent = label;
  }
  /** Build an accessible label from gauge config values. */
  buildA11yLabel() {
    const c = this.config;
    const value = c.value ?? 0;
    const unit = c.unit || "";
    const label = c.label || "";
    const suffix = unit ? `${value}${unit}` : String(value);
    return label ? `Gauge: ${suffix}, ${label}` : `Gauge: ${suffix}`;
  }
  /** Sync aria-label and sr-only span with current config. */
  updateA11y() {
    const label = this.buildA11yLabel();
    this.canvas.setAttribute("aria-label", label);
    this.canvas.textContent = label;
    if (this.srSpan) this.srSpan.textContent = label;
  }
  /** Redraw at full progress. */
  redraw() {
    this.updateA11y();
    this.draw(1);
  }
  /** Animate from 0 to full with ease-in-out-cubic. */
  animate() {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || document.documentElement.classList.contains("mn-reduced-motion") || document.body.classList.contains("mn-a11y-reduced-motion");
    if (prefersReducedMotion) {
      this.draw(1);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      this.draw(ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  /** Convert degrees to radians. */
  rad(deg) {
    return deg * Math.PI / 180;
  }
  /** Draw the gauge at a given animation progress (0..1). */
  draw(progress) {
    const state = {
      ctx: this.ctx,
      cx: this.cx,
      cy: this.cy,
      radius: this.radius,
      size: this.size,
      config: this.config,
      palette: this.palette,
      density: this.density,
      rad: this.rad
    };
    drawGauge(state, progress);
    drawComplications(state, progress);
  }
  /** Attach ResizeObserver for size='fluid' mode. */
  _attachFluidObserver() {
    if (typeof window === "undefined" || !window.ResizeObserver) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const handler = debounce(() => {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.init();
    }, 150);
    this._resizeObserver = new ResizeObserver(handler);
    this._resizeObserver.observe(parent);
  }
  /** Clean up ResizeObserver and screen reader helpers. */
  destroy() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    if (this.srSpan) {
      this.srSpan.remove();
      this.srSpan = null;
    }
  }
  /**
   * Apply colorMode to arcBar colorStops if not explicitly set.
   * 'higher-better': green at high values (red→yellow→green)
   * 'lower-better': green at low values (green→yellow→red)
   */
  applyColorMode() {
    const mode = this.config.colorMode;
    if (!mode) return;
    const c = this.config.complications || {};
    const ab = c.arcBar || {};
    if (!ab.colorStops) {
      ab.colorStops = mode === "lower-better" ? ["#00A651", "#FFC72C", "#DC0000"] : ["#DC0000", "#FFC72C", "#00A651"];
    }
    if (!ab.value) ab.value = this.config.value;
    if (!ab.max) ab.max = this.config.max;
    c.arcBar = ab;
    this.config.complications = c;
  }
};

// src/ts/gauge-engine-class.ts
function resolveCanvas(target) {
  if (typeof target === "string") {
    const el2 = document.querySelector(target);
    return el2 instanceof HTMLCanvasElement ? el2 : null;
  }
  return target instanceof HTMLCanvasElement ? target : null;
}
function createGauge(opts) {
  const canvas = resolveCanvas(opts.target);
  if (!canvas) return null;
  if (opts.config) {
    canvas.dataset.gauge = JSON.stringify(opts.config);
  }
  if (opts.size !== void 0) {
    canvas.dataset.size = String(opts.size);
  }
  return new FerrariGauge(canvas);
}

// src/ts/dashboard-widgets.ts
var charts = { sparkline, donut, bar: barChart, area: areaChart, radar, bubble };
function arr(v) {
  return Array.isArray(v) ? v : [];
}
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== void 0) e.textContent = text;
  return e;
}
function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
function kpi() {
  let h = null;
  const draw = (v) => {
    if (!h) return;
    clear(h);
    for (const i of arr(v)) {
      const article = el("article", "mn-dashboard-kpi");
      article.appendChild(el("p", "mn-dashboard-kpi__label", String(i.label ?? "\u2014")));
      article.appendChild(el("p", "mn-dashboard-kpi__value", String(i.value ?? "\u2014")));
      if (i.delta != null) {
        article.appendChild(el("span", "mn-dashboard-kpi__delta", String(i.delta)));
      }
      h.appendChild(article);
    }
  };
  return { render(c, v) {
    h = c;
    h.classList.add("mn-dashboard-kpi-strip");
    draw(v);
  }, update: draw, destroy() {
    if (h) clear(h);
    h = null;
  } };
}
function stat(o) {
  let h = null;
  const icon = typeof o?.icon === "string" ? o.icon : "";
  const draw = (v) => {
    if (!h) return;
    clear(h);
    const d = v && typeof v === "object" ? v : {};
    const article = el("article", "mn-dashboard-stat");
    if (icon) {
      article.appendChild(el("span", "mn-dashboard-stat__icon", icon));
    }
    article.appendChild(el("p", "mn-dashboard-stat__value", String(d.value ?? d.metric ?? "\u2014")));
    article.appendChild(el("p", "mn-dashboard-stat__label", String(d.label ?? o?.label ?? "Metric")));
    h.appendChild(article);
  };
  return { render(c, v) {
    h = c;
    draw(v);
  }, update: draw, destroy() {
    if (h) clear(h);
    h = null;
  } };
}
function chart(o) {
  let h = null;
  let c = null;
  let hb = null;
  const t = o?.chartType || "sparkline";
  const draw = (v) => {
    if (!h) return;
    if (t === "hbar") {
      hb = hb || hBarChart(h, v);
      hb?.update?.(v);
      return;
    }
    c = c || Object.assign(document.createElement("canvas"), { className: "mn-dashboard-canvas" });
    if (!c.parentElement) h.appendChild(c);
    (charts[t] || charts.sparkline)(c, v, o);
  };
  return { render(x, v) {
    h = x;
    draw(v);
  }, update: draw, destroy() {
    hb?.destroy?.();
    if (h) clear(h);
    h = null;
    c = null;
    hb = null;
  } };
}
function gauge(o) {
  let h = null;
  let c = null;
  let g = null;
  const cfg = (v) => ({ ...o, ...v && typeof v === "object" ? v : { value: v } });
  const draw = (v) => {
    if (!h) return;
    c = c || Object.assign(document.createElement("canvas"), { className: "mn-dashboard-canvas" });
    if (!c.parentElement) h.appendChild(c);
    const conf = cfg(v);
    if (!g) {
      g = createGauge({ target: c, config: conf });
      if (!g) {
        c.dataset.gauge = JSON.stringify(conf);
        g = new FerrariGauge(c);
      }
      return;
    }
    g.config = { ...g.config || {}, ...conf };
    g.redraw?.();
  };
  return { render(x, v) {
    h = x;
    draw(v);
  }, update: draw, destroy() {
    g?.destroy?.();
    if (h) clear(h);
    h = null;
    c = null;
    g = null;
  } };
}
var FALLBACK_COLOR = "var(--mn-accent)";
function legend() {
  let h = null;
  const draw = (v) => {
    if (!h) return;
    clear(h);
    const ul = el("ul", "mn-dashboard-legend");
    for (const i of arr(v)) {
      const li = el("li", "mn-dashboard-legend__item");
      const swatch = el("span", "mn-dashboard-legend__swatch");
      const rawColor = String(i.color ?? FALLBACK_COLOR);
      swatch.style.background = isValidColor(rawColor) ? rawColor : FALLBACK_COLOR;
      li.appendChild(swatch);
      li.appendChild(el("span", void 0, String(i.label ?? "Item")));
      ul.appendChild(li);
    }
    h.appendChild(ul);
  };
  return { render(c, v) {
    h = c;
    draw(v);
  }, update: draw, destroy() {
    if (h) clear(h);
    h = null;
  } };
}
function table() {
  let h = null;
  const draw = (v) => {
    if (!h) return;
    clear(h);
    const d = v && typeof v === "object" ? v : {};
    const tbl = el("table", "mn-dashboard-table-summary");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    if (Array.isArray(d.headers)) {
      for (const x of d.headers) {
        headRow.appendChild(el("th", void 0, String(x)));
      }
    }
    thead.appendChild(headRow);
    tbl.appendChild(thead);
    const tbody = document.createElement("tbody");
    if (Array.isArray(d.rows)) {
      for (const r of d.rows) {
        const tr = document.createElement("tr");
        for (const x of r) {
          tr.appendChild(el("td", void 0, String(x ?? "")));
        }
        tbody.appendChild(tr);
      }
    }
    tbl.appendChild(tbody);
    h.appendChild(tbl);
  };
  return { render(c, v) {
    h = c;
    draw(v);
  }, update: draw, destroy() {
    if (h) clear(h);
    h = null;
  } };
}
function custom(o) {
  let h = null;
  const fn = typeof o?.render === "function" ? o.render : null;
  const draw = (v) => {
    if (h && fn) fn(h, v);
  };
  return { render(c, v) {
    h = c;
    draw(v);
  }, update(v) {
    if (h) clear(h);
    draw(v);
  }, destroy() {
    if (h) clear(h);
    h = null;
  } };
}
function createDashboardWidget(config) {
  if (config.type === "kpi-strip") return kpi();
  if (config.type === "stat-card") return stat(config.options);
  if (config.type === "chart") return chart(config.options);
  if (config.type === "gauge") return gauge(config.options);
  if (config.type === "legend") return legend();
  if (config.type === "table-summary") return table();
  return custom(config.options);
}

// src/ts/dashboard-renderer.ts
function clampSpan(value) {
  if (!value || Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(12, Math.round(value)));
}
var DashboardRenderer = class {
  constructor(container, options) {
    this.widgets = [];
    this.container = container;
    this.schema = options.schema;
    this.data = { ...options.data || {} };
    this.renderAll();
  }
  setData(key, value) {
    this.data[key] = value;
    this.widgets.filter((widget) => widget.key === key).forEach((widget) => {
      this.renderWidget(widget);
    });
  }
  setSchema(newSchema) {
    this.destroyWidgets();
    this.schema = newSchema;
    this.renderAll();
  }
  getWidget(dataKey) {
    return this.widgets.find((widget) => widget.key === dataKey)?.controller;
  }
  destroy() {
    this.destroyWidgets();
    this.container.classList.remove("mn-dashboard-renderer");
    this.container.innerHTML = "";
  }
  renderAll() {
    this.container.classList.add("mn-dashboard-renderer");
    this.container.innerHTML = "";
    this.widgets = [];
    this.schema.rows.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "mn-dashboard-row";
      this.container.appendChild(rowEl);
      row.columns.forEach((column) => {
        const wrapper = document.createElement("section");
        wrapper.className = "mn-dashboard-cell";
        wrapper.dataset.dashboardKey = column.dataKey;
        wrapper.style.gridColumn = `span ${clampSpan(column.span)}`;
        const body = document.createElement("div");
        body.className = "mn-dashboard-body";
        wrapper.appendChild(body);
        rowEl.appendChild(wrapper);
        let record;
        const scaffold = new StateScaffold(body, {
          state: "loading",
          onRetry: () => this.renderWidget(record)
        });
        const widgetHost = document.createElement("div");
        widgetHost.className = "mn-dashboard-widget-host";
        scaffold.getContentHost().appendChild(widgetHost);
        const controller = createDashboardWidget(column);
        record = {
          key: column.dataKey,
          wrapper,
          body,
          widgetHost,
          scaffold,
          controller,
          rendered: false
        };
        this.widgets.push(record);
        this.renderWidget(record);
      });
    });
  }
  renderWidget(record) {
    const value = this.data[record.key];
    if (value instanceof Error) {
      record.scaffold.setState("error", value.message || "Widget failed to load.");
      return;
    }
    if (value === null || value === void 0) {
      record.scaffold.setState("loading");
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      record.scaffold.setState("empty");
      return;
    }
    record.scaffold.setState("ready");
    if (!record.rendered) {
      record.controller.render(record.widgetHost, value);
      record.rendered = true;
      return;
    }
    record.controller.update(value);
  }
  destroyWidgets() {
    this.widgets.forEach((widget) => {
      widget.controller.destroy();
      widget.scaffold.destroy();
      widget.wrapper.remove();
    });
    this.widgets = [];
  }
};

// src/wc/mn-dashboard.js
var MnDashboard = class extends HTMLElement {
  constructor() {
    super();
    this._schema = { rows: [] };
    this._data = {};
    this._renderer = null;
    this._onClick = this._onClick.bind(this);
  }
  connectedCallback() {
    this.classList.add("mn-dashboard-host");
    this.addEventListener("click", this._onClick);
    this._ensureRenderer();
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this._renderer?.destroy?.();
    this._renderer = null;
  }
  get schema() {
    return this._schema;
  }
  set schema(value) {
    this._schema = value && typeof value === "object" ? value : { rows: [] };
    if (!this._renderer) {
      this._ensureRenderer();
      return;
    }
    this._renderer.setSchema(this._schema);
    this._applyAllData();
  }
  get data() {
    return this._data;
  }
  set data(value) {
    const next = value && typeof value === "object" ? value : {};
    this._data = next;
    if (!this._renderer) {
      this._ensureRenderer();
      return;
    }
    this._applyAllData();
  }
  _ensureRenderer() {
    if (this._renderer) return;
    this._renderer = new DashboardRenderer(this, {
      schema: this._schema,
      data: this._data
    });
  }
  _applyAllData() {
    if (!this._renderer) return;
    Object.entries(this._data).forEach(([key, value]) => {
      this._renderer.setData(key, value);
    });
  }
  _onClick(event) {
    const target = event.target instanceof Element ? event.target.closest("[data-dashboard-key]") : null;
    if (!target) return;
    const key = target.getAttribute("data-dashboard-key");
    this.dispatchEvent(new CustomEvent("mn-widget-click", {
      detail: {
        dataKey: key,
        data: key ? this._data[key] : void 0
      },
      bubbles: true,
      composed: true
    }));
  }
};
customElements.define("mn-dashboard", MnDashboard);
//# sourceMappingURL=mn-dashboard.js.map
