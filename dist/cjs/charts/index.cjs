/* Maranello Luce Design v4.11.0 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */
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

// src/ts/charts/index.ts
var index_exports = {};
__export(index_exports, {
  SERIES: () => SERIES,
  areaChart: () => areaChart,
  barChart: () => barChart,
  bubble: () => bubble,
  buildSeries: () => buildSeries,
  chartHiDpi: () => chartHiDpi,
  chartInteract: () => chartInteract,
  donut: () => donut,
  flipCounter: () => flipCounter,
  getCanvasSize: () => getCanvasSize,
  hBarChart: () => hBarChart,
  halfGauge: () => halfGauge,
  liveGraph: () => liveGraph,
  progressRing: () => progressRing,
  radar: () => radar,
  sparkline: () => sparkline,
  sparklineInteract: () => sparklineInteract
});
module.exports = __toCommonJS(index_exports);

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
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

// src/ts/charts-helpers.ts
var dpr = window.devicePixelRatio || 1;
function buildSeries() {
  return [
    cssVar("--chart-default", "#FFC72C"),
    cssVar("--signal-danger", "#DC0000"),
    cssVar("--signal-ok", "#00A651"),
    cssVar("--arancio", "#D4622B"),
    cssVar("--chart-bar", "#4EA8DE"),
    cssVar("--grigio-alluminio", "#c8c8c8"),
    "#E8A838",
    "#8B5CF6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#6366F1"
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
    color: cssVar("--chart-default", "#FFC72C"),
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

// src/ts/charts-halfgauge.ts
function halfGauge(canvas, opts) {
  const o = {
    value: 0,
    min: 0,
    max: 100,
    colors: [
      { stop: 0, color: cssVar("--signal-danger", "#DC0000") },
      { stop: 0.5, color: cssVar("--signal-warning", "#FFC72C") },
      { stop: 1, color: cssVar("--signal-ok", "#00A651") }
    ],
    trackColor: "rgba(200,200,200,0.08)",
    thickness: 0.18,
    label: "",
    unit: "",
    ...opts
  };
  const size = getCanvasSize(canvas, 200, 120);
  const w = size.width;
  const h = Math.round(w * 0.6);
  const _ctx = chartHiDpi(canvas, w, h);
  if (!_ctx) return void 0;
  const ctx = _ctx;
  const cx = w / 2;
  const cy = h - 10;
  const radius = Math.min(w / 2, h) - 16;
  const lineW = radius * o.thickness;
  const startA = Math.PI;
  const endA = Math.PI * 2;
  const pct = Math.max(0, Math.min(1, (o.value - o.min) / (o.max - o.min)));
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startA, endA);
  ctx.strokeStyle = o.trackColor;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.stroke();
  if (pct > 0) {
    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    o.colors.forEach((c) => {
      grad.addColorStop(c.stop, c.color);
    });
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, startA + pct * Math.PI);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.shadowColor = o.colors[Math.floor(pct * (o.colors.length - 1))].color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = "#616161";
  const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-display") || "Outfit";
  ctx.font = "500 " + radius * 0.1 + "px " + fontFamily;
  ctx.textAlign = "center";
  ctx.fillText(String(o.min), cx - radius + lineW / 2, cy + radius * 0.18);
  ctx.fillText(String(o.max), cx + radius - lineW / 2, cy + radius * 0.18);
  const unitSuffix = o.unit ? " " + o.unit : "";
  const a11yLabel = `Gauge: ${o.value} of ${o.max}${unitSuffix}`;
  const fillPct = Math.round((o.value - o.min) / (o.max - o.min) * 100);
  const a11yData = [
    { label: "Value", value: `${o.value}${unitSuffix}` },
    { label: "Range", value: `${o.min} \u2013 ${o.max}` },
    { label: "Fill", value: `${fillPct}%` }
  ];
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

// src/ts/charts-live.ts
function liveGraph(canvas, data, opts) {
  const o = {
    color: cssVar("--chart-default", "#FFC72C"),
    lineWidth: 1.5,
    gridColor: "rgba(200,200,200,0.06)",
    gridRows: 4,
    axisColor: cssVar("--chart-axis", "#616161"),
    showRedLine: true,
    redLineValue: null,
    smooth: true,
    maxY: null,
    unitLabel: "",
    ...opts
  };
  const size = getCanvasSize(canvas, 200, 80);
  const w = size.width;
  const h = size.height;
  const ctx = chartHiDpi(canvas, w, h);
  if (!ctx) return void 0;
  if (!data || data.length < 2) return void 0;
  const maxVal = o.maxY ?? Math.max(...data) * 1.1;
  const pad = { top: 4, right: 4, bottom: 2, left: 2 };
  const gx = (i) => pad.left + i / (data.length - 1) * (w - pad.left - pad.right);
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
  if (o.showRedLine && o.redLineValue !== null) {
    ctx.strokeStyle = cssVar("--signal-danger", "#DC0000");
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    const rl = gy(o.redLineValue);
    ctx.moveTo(pad.left, rl);
    ctx.lineTo(w - pad.right, rl);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.beginPath();
  drawSmoothLine(ctx, data, gx, gy, o.smooth);
  ctx.strokeStyle = o.color;
  ctx.lineWidth = o.lineWidth ?? 1.5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.shadowBlur = 0;
  const liveLabel = `Live chart: ${o.unitLabel || "real-time data"}`;
  const last5 = data.slice(-5);
  const a11yData = last5.map((v, i) => ({ label: `T-${last5.length - 1 - i}`, value: v }));
  applyChartA11y(canvas, liveLabel, a11yData);
  if (canvas.parentElement) {
    let liveEl = canvas.parentElement.querySelector(".mn-sr-live");
    if (!liveEl) {
      liveEl = document.createElement("span");
      liveEl.className = "mn-sr-only mn-sr-live";
      liveEl.setAttribute("aria-live", "polite");
      liveEl.setAttribute("aria-atomic", "true");
      canvas.parentElement.appendChild(liveEl);
    }
    const now = Date.now();
    const lastTs = Number(liveEl.dataset.ts || "0");
    if (now - lastTs >= 5e3) {
      const latest = data[data.length - 1];
      const prev = data.length > 1 ? data[data.length - 2] : latest;
      const trend = latest > prev ? "rising" : latest < prev ? "falling" : "steady";
      liveEl.textContent = `${o.unitLabel || "Value"}: ${latest}, ${trend}`;
      liveEl.dataset.ts = String(now);
    }
  }
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

// src/ts/progress-ring.ts
function progressRing(container, opts) {
  const o = {
    value: 0,
    max: 100,
    size: 80,
    thickness: 6,
    color: cssVar("--chart-default", "#FFC72C"),
    trackColor: "rgba(200,200,200,0.08)",
    animate: true,
    ...opts
  };
  const safeColor2 = isValidColor(o.color) ? o.color : "var(--giallo-ferrari)";
  const radius = (o.size - o.thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, o.value / o.max));
  const offset = circumference * (1 - pct);
  const half = o.size / 2;
  container.innerHTML = `<svg width="${o.size}" height="${o.size}" viewBox="0 0 ${o.size} ${o.size}"><circle class="mn-progress-ring__track" cx="${half}" cy="${half}" r="${radius}" stroke-width="${o.thickness}"/><circle class="mn-progress-ring__fill" cx="${half}" cy="${half}" r="${radius}" stroke-width="${o.thickness}" stroke="${safeColor2}" stroke-dasharray="${circumference}" stroke-dashoffset="${o.animate ? circumference : offset}"/></svg>`;
  if (o.animate) {
    requestAnimationFrame(() => {
      const fill = container.querySelector(".mn-progress-ring__fill");
      if (fill) fill.style.strokeDashoffset = String(offset);
    });
  }
  return {
    setValue(newVal) {
      const newPct = Math.max(0, Math.min(1, newVal / o.max));
      const fill = container.querySelector(".mn-progress-ring__fill");
      if (fill) fill.style.strokeDashoffset = String(circumference * (1 - newPct));
    }
  };
}

// src/ts/flip-counter.ts
function flipCounter(containerEl, opts) {
  const o = {
    value: 0,
    digits: 4,
    decimals: 0,
    separator: "",
    prefix: "",
    suffix: "",
    animationDuration: 500,
    padZero: true,
    ...opts
  };
  let currentValue = o.value;
  function formatValue(val) {
    let str = o.decimals > 0 ? val.toFixed(o.decimals) : String(Math.round(val));
    if (o.padZero) {
      const parts = str.split(".");
      while (parts[0].length < o.digits) parts[0] = "0" + parts[0];
      str = parts.join(".");
    }
    return str;
  }
  function buildDOM(valueStr) {
    containerEl.innerHTML = "";
    containerEl.className = (containerEl.className.replace(/\bmn-flip-counter[^\s]*/g, "") + " mn-flip-counter").trim();
    if (o.prefix) {
      const pre = document.createElement("span");
      pre.className = "mn-flip-counter__sep";
      pre.textContent = o.prefix;
      containerEl.appendChild(pre);
    }
    for (let i = 0; i < valueStr.length; i++) {
      const ch = valueStr[i];
      if (ch === "." || ch === "," || ch === ":") {
        const sep = document.createElement("span");
        sep.className = "mn-flip-counter__sep";
        sep.textContent = ch;
        containerEl.appendChild(sep);
      } else {
        const digit = document.createElement("div");
        digit.className = "mn-flip-counter__digit";
        const inner = document.createElement("div");
        inner.className = "mn-flip-counter__digit-inner";
        for (let d = 0; d <= 9; d++) {
          const face = document.createElement("div");
          face.className = "mn-flip-counter__digit-face";
          face.textContent = String(d);
          inner.appendChild(face);
        }
        digit.appendChild(inner);
        containerEl.appendChild(digit);
        const numVal = parseInt(ch, 10) || 0;
        inner.style.transform = "translateY(-" + numVal * 52 + "px)";
        inner.dataset.current = String(numVal);
      }
    }
    if (o.suffix) {
      const suf = document.createElement("span");
      suf.className = "mn-flip-counter__sep";
      suf.textContent = o.suffix;
      containerEl.appendChild(suf);
    }
  }
  function animateTo(newValue) {
    const valueStr = formatValue(newValue);
    const inners = containerEl.querySelectorAll(
      ".mn-flip-counter__digit-inner"
    );
    const digitChars = valueStr.replace(/[^0-9]/g, "");
    if (inners.length !== digitChars.length) {
      buildDOM(valueStr);
      currentValue = newValue;
      return;
    }
    for (let i = 0; i < inners.length; i++) {
      const target = parseInt(digitChars[i], 10) || 0;
      const face = inners[i].querySelector(
        ".mn-flip-counter__digit-face"
      );
      const digitH = face?.offsetHeight || 52;
      inners[i].style.transform = "translateY(-" + target * digitH + "px)";
      inners[i].dataset.current = String(target);
    }
    currentValue = newValue;
  }
  buildDOM(formatValue(currentValue));
  return {
    setValue: animateTo,
    getValue: () => currentValue,
    increment: (by) => animateTo(currentValue + (by ?? 1)),
    decrement: (by) => animateTo(currentValue - (by ?? 1))
  };
}

// src/ts/charts-radar.ts
function radar(canvas, data, opts) {
  const o = {
    max: 100,
    levels: 4,
    gridColor: "rgba(200,200,200,0.1)",
    labelColor: cssVar("--chart-label", "#9e9e9e"),
    color: cssVar("--chart-default", "#FFC72C"),
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
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
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
  function addListener(el, evt, handler) {
    el.addEventListener(evt, handler);
    state.listeners.push({ el, evt, handler });
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
      const safeColor2 = isValidColor(bar.color) ? bar.color : cssVar("--mn-accent");
      fill.style.background = safeColor2;
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

// src/ts/chart-interact.ts
var DPR = window.devicePixelRatio || 1;
var activeTooltip = null;
function getTooltip() {
  if (activeTooltip) return activeTooltip;
  const el = document.createElement("div");
  el.className = "mn-chart-tooltip";
  el.setAttribute("role", "tooltip");
  el.setAttribute("aria-hidden", "true");
  document.body.appendChild(el);
  activeTooltip = el;
  return el;
}
function positionTooltip(tip, x, y) {
  const pad = 12, rect = tip.getBoundingClientRect();
  let left = x + pad, top = y - rect.height - pad;
  if (left + rect.width > window.innerWidth - 10) left = x - rect.width - pad;
  if (top < 10) top = y + pad;
  tip.style.position = "fixed";
  tip.style.left = left + "px";
  tip.style.top = top + "px";
}
function safeColor(c, fallback) {
  return isValidColor(c) ? c : fallback;
}
function buildTooltipHTML(meta, index, series) {
  const esc = escapeHtml;
  if (meta.type === "area" || meta.type === "line") {
    const datasets = meta.datasets;
    let html = '<div class="mn-chart-tooltip__label">' + esc(meta.labels && meta.labels[index] ? meta.labels[index] : "Point " + (index + 1)) + "</div>";
    datasets.forEach((ds, i) => {
      if (index < ds.data.length) {
        const color = safeColor(ds.color || series[i % series.length], "#999");
        html += '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;"><span class="mn-chart-tooltip__dot" style="background:' + color + ';"></span><span style="color:var(--chart-label,#9e9e9e);font-size:0.65rem;">' + esc(ds.label || "Series " + (i + 1)) + '</span><span class="mn-chart-tooltip__value" style="margin-left:auto;color:' + color + ';">' + ds.data[index].toFixed(1) + "</span></div>";
      }
    });
    return html;
  }
  if (meta.type === "bar") {
    const d = meta.data[index];
    const color = safeColor(d.color || series[index % series.length], "#999");
    return '<div class="mn-chart-tooltip__label">' + esc(d.label || "Bar " + (index + 1)) + '</div><div class="mn-chart-tooltip__value" style="color:' + color + ';">' + d.value + "</div>";
  }
  if (meta.type === "donut") {
    const seg = meta.segments[index];
    return '<div style="display:flex;align-items:center;gap:6px;"><span class="mn-chart-tooltip__dot" style="background:' + seg.color + ';"></span><span class="mn-chart-tooltip__value">' + seg.value + "</span></div>" + (seg.label ? '<div class="mn-chart-tooltip__label">' + esc(seg.label) + "</div>" : "") + '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">' + seg.pct + "%</div>";
  }
  if (meta.type === "bubble") {
    const b = meta.data[index];
    const size = b.z ?? b.r;
    return '<div class="mn-chart-tooltip__label">' + esc(b.label || "Point") + '</div><div style="font-size:0.65rem;color:var(--chart-label,#9e9e9e);">x: ' + b.x + " \xB7 y: " + b.y + (size ? " \xB7 size: " + size : "") + "</div>";
  }
  if (meta.type === "radar") {
    const r = meta.data[index];
    return '<div class="mn-chart-tooltip__label">' + esc(r.label) + '</div><div class="mn-chart-tooltip__value" style="color:var(--chart-default,#FFC72C);">' + r.value + '<span style="color:var(--chart-axis,#616161);font-size:0.6rem;">/' + meta.max + "</span></div>";
  }
  return "";
}
function drawCrosshair(canvas, x, meta, series) {
  let overlay = canvas._mnOverlay;
  if (!overlay) {
    overlay = document.createElement("canvas");
    overlay.style.position = "absolute";
    overlay.style.pointerEvents = "none";
    canvas.parentElement.style.position = "relative";
    canvas.parentElement.appendChild(overlay);
    canvas._mnOverlay = overlay;
  }
  const rect = canvas.getBoundingClientRect(), parentRect = canvas.parentElement.getBoundingClientRect();
  overlay.style.left = rect.left - parentRect.left + "px";
  overlay.style.top = rect.top - parentRect.top + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  const ctx = overlay.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  if (x < 0) return;
  ctx.save();
  ctx.scale(DPR, DPR);
  ctx.strokeStyle = "rgba(255,199,44,0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  const h = canvas.height / DPR;
  const pad = meta.pad;
  ctx.beginPath();
  ctx.moveTo(x, pad ? pad.top : 0);
  ctx.lineTo(x, h - (pad ? pad.bottom : 0));
  ctx.stroke();
  ctx.setLineDash([]);
  if ((meta.type === "area" || meta.type === "line") && meta.nearestIndex >= 0) {
    const datasets = meta.datasets;
    const gx = meta.gx, gy = meta.gy;
    datasets.forEach((ds, dsi) => {
      if (meta.nearestIndex < ds.data.length) {
        const px = gx(meta.nearestIndex), py = gy(ds.data[meta.nearestIndex]);
        const color = ds.color || series[dsi % series.length];
        const cr = parseInt(color.slice(1, 3), 16), cg = parseInt(color.slice(3, 5), 16), cb = parseInt(color.slice(5, 7), 16);
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + ",0.25)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }
  ctx.restore();
}
function findNearestIndex(mouseX, meta) {
  if (meta.type === "area" || meta.type === "line") {
    let best = 0, bestDist = Infinity;
    const gx = meta.gx;
    for (let i = 0; i < (meta.maxLen || 12); i++) {
      const dist = Math.abs(mouseX - gx(i));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }
  if (meta.type === "bar" && meta.barRects) {
    for (const r of meta.barRects) {
      if (mouseX >= r.x && mouseX <= r.x + r.w) return meta.barRects.indexOf(r);
    }
    return -1;
  }
  if ((meta.type === "bubble" || meta.type === "radar") && meta.points) {
    const points = meta.points;
    const mouseY = Number(meta.mouseY ?? 0);
    let best = -1, bestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
      const limit = (p.r ?? (meta.type === "bubble" ? 14 : 10)) + 6;
      if (dist <= limit && dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    });
    return best;
  }
  if (meta.type === "donut" && meta.center && meta.innerRadius && meta.outerRadius && meta.segments) {
    const { x, y } = meta.center;
    const mouseY = Number(meta.mouseY ?? 0), dist = Math.hypot(mouseX - x, mouseY - y);
    const norm = (a) => (a + Math.PI * 2) % (Math.PI * 2), angle = norm(Math.atan2(mouseY - y, mouseX - x));
    if (dist < meta.innerRadius || dist > meta.outerRadius) return -1;
    return meta.segments.findIndex(({ start, end }) => {
      const a = norm(start), b = norm(end);
      return a <= b ? angle >= a && angle <= b : angle >= a || angle <= b;
    });
  }
  return -1;
}
function chartInteract(canvas, meta, series) {
  if (!canvas || !meta) return;
  const s = series || [];
  const tip = getTooltip();
  let currentIndex = -1;
  canvas.style.cursor = "crosshair";
  canvas.setAttribute("tabindex", "0");
  canvas.setAttribute("role", "img");
  function getLogicalXY(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / DPR / rect.width), y: (e.clientY - rect.top) * (canvas.height / DPR / rect.height) };
  }
  function showAt(lx, ly, cx, cy) {
    meta.mouseY = ly;
    const idx = findNearestIndex(lx, meta);
    if (idx < 0) {
      hide();
      return;
    }
    meta.nearestIndex = idx;
    currentIndex = idx;
    const gx = meta.gx;
    drawCrosshair(canvas, meta.type === "bar" || meta.type === "donut" || meta.type === "bubble" || meta.type === "radar" ? -1 : gx ? gx(idx) : lx, meta, s);
    tip.innerHTML = buildTooltipHTML(meta, idx, s);
    tip.classList.add("mn-chart-tooltip--visible");
    tip.setAttribute("aria-hidden", "false");
    positionTooltip(tip, cx, cy);
  }
  function hide() {
    tip.classList.remove("mn-chart-tooltip--visible");
    tip.setAttribute("aria-hidden", "true");
    currentIndex = -1;
    meta.nearestIndex = -1;
    drawCrosshair(canvas, -1, meta, s);
  }
  canvas.addEventListener("mousemove", (e) => {
    const p = getLogicalXY(e);
    showAt(p.x, p.y, e.clientX, e.clientY);
  });
  canvas.addEventListener("mouseleave", hide);
  return { hide, update: (newMeta) => {
    Object.assign(meta, newMeta);
  } };
}
function sparklineInteract(canvas, data, opts) {
  if (!canvas || !data || data.length < 2) return;
  opts = opts || {};
  const tip = getTooltip();
  let chartPad = opts.pad || { top: 2, right: 2, bottom: 2, left: 2 };
  const mn = opts.maxY != null ? 0 : Math.min(...data);
  const mx = opts.maxY != null ? opts.maxY : Math.max(...data);
  const range = mx - mn || 1;
  canvas.style.cursor = "crosshair";
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const logicalW = canvas.width / DPR, logicalH = canvas.height / DPR;
    const mouseX = (e.clientX - rect.left) * (logicalW / rect.width);
    const plotW = logicalW - chartPad.left - chartPad.right;
    const plotH = logicalH - chartPad.top - chartPad.bottom;
    let idx = Math.round((mouseX - chartPad.left) / plotW * (data.length - 1));
    idx = Math.max(0, Math.min(data.length - 1, idx));
    const px = chartPad.left + idx / (data.length - 1) * plotW;
    const py = logicalH - chartPad.bottom - (data[idx] - mn) / range * plotH;
    let overlay = canvas._mnSparkOverlay;
    if (!overlay) {
      overlay = document.createElement("canvas");
      overlay.style.position = "absolute";
      overlay.style.pointerEvents = "none";
      canvas.parentElement.style.position = "relative";
      canvas.parentElement.appendChild(overlay);
      canvas._mnSparkOverlay = overlay;
    }
    const cRect = canvas.getBoundingClientRect(), pRect = canvas.parentElement.getBoundingClientRect();
    overlay.style.left = cRect.left - pRect.left + "px";
    overlay.style.top = cRect.top - pRect.top + "px";
    overlay.style.width = cRect.width + "px";
    overlay.style.height = cRect.height + "px";
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.save();
    ctx.scale(DPR, DPR);
    const color = opts.color || cssVar("--chart-default", "#FFC72C");
    const cr = parseInt(color.slice(1, 3), 16), cg = parseInt(color.slice(3, 5), 16), cb = parseInt(color.slice(5, 7), 16);
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${cr},${cg},${cb},0.25)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    const label = opts.labels ? opts.labels[idx] : "Point " + (idx + 1);
    const safeC = safeColor(color, "#FFC72C");
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(label) + '</div><div class="mn-chart-tooltip__value" style="color:' + safeC + ';">' + data[idx] + "</div>";
    tip.classList.add("mn-chart-tooltip--visible");
    positionTooltip(tip, e.clientX, e.clientY);
  });
  canvas.addEventListener("mouseleave", () => {
    tip.classList.remove("mn-chart-tooltip--visible");
    const overlay = canvas._mnSparkOverlay;
    if (overlay) overlay.getContext("2d")?.clearRect(0, 0, overlay.width, overlay.height);
  });
}
//# sourceMappingURL=index.cjs.map
