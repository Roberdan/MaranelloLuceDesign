/* Maranello Luce Design v5.14.1 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */
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

// src/ts/gantt/index.ts
var index_exports = {};
__export(index_exports, {
  gantt: () => gantt
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
  const el = document.body ?? document.documentElement;
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

// src/ts/gantt-defaults.ts
var DPR = window.devicePixelRatio || 1;
var MS_DAY = 864e5;
var DEFAULTS = {
  labelWidth: 240,
  rowHeight: 38,
  childRowHeight: 30,
  headerHeight: 56,
  barHeight: 20,
  childBarHeight: 14,
  barRadius: 3,
  basePxPerMonth: 100,
  minZoom: 0.25,
  maxZoom: 5,
  defaultZoom: 1,
  zoomStep: 0.15,
  showToday: true,
  showGrid: true,
  showProgress: true,
  today: null,
  palette: null,
  childPalette: null,
  onSelect: null,
  onExpand: null,
  onClick: null
};
function hexLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function textOnBg(hex) {
  return hexLuminance(hex) > 0.35 ? "#111" : "#fff";
}
function buildPalette() {
  return {
    "Stage 1": cssVar("--stage-1", "#FFC72C"),
    "Stage 2": cssVar("--stage-2", "#FFC72C"),
    "Stage 3": cssVar("--stage-3", "#4EA8DE"),
    "Stage 4": cssVar("--stage-4", "#0891B2"),
    "On Hold": cssVar("--stage-onhold", "#D4622B"),
    Withdrawn: cssVar("--stage-withdrawn", "#374151"),
    Completed: cssVar("--stage-completed", "#6B7280")
  };
}
function buildChildPalette() {
  return {
    Active: cssVar("--activity-active", "#00A651"),
    Planned: cssVar("--activity-planned", "#F59E0B"),
    Closed: cssVar("--activity-closed", "#6B7280")
  };
}
function buildSeverity() {
  return {
    critical: { fg: cssVar("--severity-critical-fg", "#fca5a5"), bg: cssVar("--severity-critical-bg", "#7f1d1d"), icon: "\u25B2" },
    high: { fg: cssVar("--severity-high-fg", "#fed7aa"), bg: cssVar("--severity-high-bg", "#7c2d12"), icon: "\u25B2" },
    warning: { fg: cssVar("--severity-warning-fg", "#fde68a"), bg: cssVar("--severity-warning-bg", "#78350f"), icon: "\u25B2" },
    resourcing: { fg: cssVar("--severity-resourcing-fg", "#bfdbfe"), bg: cssVar("--severity-resourcing-bg", "#1e3a5f"), icon: "\u25CF" }
  };
}
function themeColors() {
  const cl = document.body.classList;
  const isLight = cl.contains("mn-avorio") || cl.contains("mn-sugar");
  const isSugar = cl.contains("mn-sugar");
  const surface = cssVar("--mn-surface", isLight ? "#faf8f2" : "#0a0a0a");
  const text = cssVar("--mn-text", isLight ? "#1a1a1a" : "#e0e0e0");
  const muted = cssVar("--mn-text-muted", isLight ? "#666" : "#888");
  const border = cssVar("--mn-border", isLight ? "rgba(0,0,0,0.08)" : "rgba(200,200,200,0.08)");
  const headerBg = isSugar ? "rgba(216,216,220,0.98)" : isLight ? "rgba(245,242,235,0.98)" : "rgba(18,18,18,0.98)";
  const sidebarBg = isSugar ? "rgba(216,216,220,0.95)" : isLight ? "rgba(245,242,235,0.95)" : "rgba(14,14,14,0.97)";
  return {
    bg: surface,
    text,
    muted,
    border,
    headerBg,
    sidebarBg,
    rowHover: isLight ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.12)",
    rowSel: isLight ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.18)",
    childBg: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
    rowAlt: isLight ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)",
    isLight
  };
}
var MONTH_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function parseDate(s) {
  if (!s) return null;
  if (s instanceof Date) return s;
  const p = s.split("-");
  return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] || 1));
}
function monthStart(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}
function addMonths(d, n) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}
function daysBetween(a, b) {
  return (b.getTime() - a.getTime()) / MS_DAY;
}
function fmtDateFull(d) {
  return d ? d.getUTCDate() + " " + MONTH_FULL[d.getUTCMonth()] + " " + d.getUTCFullYear() : "?";
}
function fmtDateShort(d) {
  return d ? d.getUTCDate() + " " + MONTH_ABBR[d.getUTCMonth()] : "";
}
function getScale(ppm) {
  if (ppm >= 200) return { scale: "week", primaryType: "month" };
  if (ppm >= 60) return { scale: "month", primaryType: "year" };
  if (ppm >= 30) return { scale: "monthAbbr", primaryType: "year" };
  return { scale: "quarter", primaryType: "year" };
}
function buildRows(tasks, expanded) {
  const rows = [];
  tasks.forEach((t) => {
    const task = t;
    const children = task.children;
    rows.push({ type: "parent", task, hasChildren: !!(children && children.length) });
    if (expanded[task.id] && children) {
      children.forEach((c) => {
        rows.push({ type: "child", task: c, parent: task });
      });
    }
  });
  return rows;
}
function rowY(idx, rows, o) {
  let y = o.headerHeight;
  for (let i = 0; i < idx; i++) y += rows[i].type === "child" ? o.childRowHeight : o.rowHeight;
  return y;
}
function contentH(rows, o) {
  let h = o.headerHeight;
  rows.forEach((r) => {
    h += r.type === "child" ? o.childRowHeight : o.rowHeight;
  });
  return h;
}
function roundRect(ctx, x, y, w, h, r) {
  if (w <= 0 || h <= 0) return;
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
function truncText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  while (text.length > 1 && ctx.measureText(text + "\u2026").width > maxW) text = text.slice(0, -1);
  return text + "\u2026";
}
function buildRange(tasks) {
  let lo = Infinity, hi = -Infinity;
  tasks.forEach((t) => {
    const task = t;
    const s = parseDate(task.start), e = parseDate(task.end);
    if (s) lo = Math.min(lo, s.getTime());
    if (e) hi = Math.max(hi, e.getTime());
    const children = task.children;
    if (children) children.forEach((c) => {
      const ct = c;
      const cs = parseDate(ct.start), ce = parseDate(ct.end);
      if (cs) lo = Math.min(lo, cs.getTime());
      if (ce) hi = Math.max(hi, ce.getTime());
    });
  });
  const rangeMin = addMonths(monthStart(new Date(lo)), -1);
  const rangeMax = addMonths(monthStart(new Date(hi)), 2);
  const months = [];
  let cur = new Date(rangeMin);
  while (cur < rangeMax) {
    months.push({ date: new Date(cur), month: cur.getUTCMonth(), year: cur.getUTCFullYear() });
    cur = addMonths(cur, 1);
  }
  return { min: rangeMin, max: rangeMax, months };
}
function buildYearSpans(months) {
  const spans = [];
  if (!months.length) return spans;
  let curYear = months[0].date.getUTCFullYear(), start = 0;
  for (let i = 1; i < months.length; i++) {
    const yr = months[i].date.getUTCFullYear();
    if (yr !== curYear) {
      spans.push({ year: curYear, s: start, e: i });
      start = i;
      curYear = yr;
    }
  }
  spans.push({ year: curYear, s: start, e: months.length });
  return spans;
}

// src/ts/gantt-render.ts
function renderGrid(ctx, s) {
  const sc = getScale(s.ppm);
  if (!s.o.showGrid) return;
  const months = s.range.months;
  const lw = s.lw, hh = s.hh, vw = s.vw, vh = s.vh;
  const ppm = s.ppm, scrollX = s.scrollX;
  const t = s.t;
  ctx.lineWidth = 0.5;
  if (sc.scale === "quarter") {
    months.forEach((m, i) => {
      if (m.month % 3 !== 0) return;
      const x = lw + i * ppm - scrollX;
      if (x >= lw - 1 && x <= vw) {
        ctx.strokeStyle = t.border;
        ctx.beginPath();
        ctx.moveTo(x, hh);
        ctx.lineTo(x, vh);
        ctx.stroke();
      }
    });
  } else if (sc.scale === "week") {
    months.forEach((m, i) => {
      const mx = lw + i * ppm - scrollX;
      if (mx >= lw - 1 && mx <= vw) {
        ctx.strokeStyle = t.text + "18";
        ctx.beginPath();
        ctx.moveTo(mx, hh);
        ctx.lineTo(mx, vh);
        ctx.stroke();
      }
      const weekPx = ppm / 4.33;
      for (let w = 1; w < 4; w++) {
        const wx = mx + w * weekPx;
        if (wx >= lw && wx <= vw) {
          ctx.strokeStyle = t.border;
          ctx.beginPath();
          ctx.moveTo(wx, hh);
          ctx.lineTo(wx, vh);
          ctx.stroke();
        }
      }
    });
  } else {
    months.forEach((m, i) => {
      const x = lw + i * ppm - scrollX;
      if (x < lw - 1 || x > vw) return;
      const isYB = m.month === 0;
      ctx.strokeStyle = isYB ? t.text + "20" : t.border;
      ctx.lineWidth = isYB ? 1 : 0.5;
      ctx.beginPath();
      ctx.moveTo(x, hh);
      ctx.lineTo(x, vh);
      ctx.stroke();
      ctx.lineWidth = 0.5;
    });
  }
}
function renderRows(ctx, s) {
  const rows = s.rows;
  const o = s.o, t = s.t;
  const lw = s.lw, vw = s.vw, hh = s.hh, vh = s.vh;
  const scrollX = s.scrollX, scrollY = s.scrollY;
  const pal = s.pal, cPal = s.cPal;
  const dateToX = s.dateToX;
  rows.forEach((row, ri) => {
    const ry = rowY(ri, rows, o) - scrollY;
    const rh = row.type === "child" ? o.childRowHeight : o.rowHeight;
    if (ry + rh < hh || ry > vh) return;
    if (row.type === "child") {
      ctx.fillStyle = t.childBg;
      ctx.fillRect(lw, ry, vw - lw, rh);
    } else if (ri % 2 === 1) {
      ctx.fillStyle = t.rowAlt;
      ctx.fillRect(lw, ry, vw - lw, rh);
    }
    if (ri === s.hoverRow) {
      ctx.fillStyle = t.rowHover;
      ctx.fillRect(lw, ry, vw - lw, rh);
    }
    if (s.selected === row.task.id) {
      ctx.fillStyle = t.rowSel;
      ctx.fillRect(lw, ry, vw - lw, rh);
    }
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(lw, ry + rh);
    ctx.lineTo(vw, ry + rh);
    ctx.stroke();
    const task = row.task;
    const sd = parseDate(task.start), ed = parseDate(task.end);
    if (!sd || !ed) return;
    const bx = lw + dateToX(sd) - scrollX;
    const bw = dateToX(ed) - dateToX(sd);
    const bh = row.type === "child" ? o.childBarHeight : o.barHeight;
    const by = ry + (rh - bh) / 2;
    const color = row.type === "child" ? cPal[task.state] || cssVar("--stage-completed", "#6B7280") : pal[task.state] || cssVar("--stage-completed", "#6B7280");
    if (bx + bw <= lw || bx >= vw) return;
    const cx1 = Math.max(bx, lw), cx2 = Math.min(bx + bw, vw), cw = cx2 - cx1;
    ctx.fillStyle = color;
    roundRect(ctx, cx1, by, cw, bh, o.barRadius);
    ctx.fill();
    if (o.showProgress && task.progress > 0 && row.type === "parent") {
      const pw = Math.min(bx + bw * Math.min(task.progress, 1), vw) - cx1;
      if (pw > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(ctx, cx1, by, Math.max(pw, 0), bh, o.barRadius);
        ctx.fill();
      }
    }
    if (cw > 50) {
      const btc = textOnBg(color);
      ctx.fillStyle = btc;
      ctx.font = "700 " + (row.type === "child" ? 9 : 11) + 'px "Barlow Condensed", "Inter", sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.save();
      ctx.shadowColor = btc === "#111" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      if (cw > 200 && row.type === "parent") {
        const ds = fmtDateShort(sd) + " \u2013 " + fmtDateShort(ed);
        const tw = ctx.measureText(task.title).width;
        ctx.fillText(truncText(ctx, task.title, cw - 12), cx1 + 6, by + bh / 2);
        ctx.font = '400 9px "Barlow Condensed","Inter",sans-serif';
        ctx.fillStyle = btc === "#111" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)";
        ctx.textAlign = "right";
        if (tw + ctx.measureText(ds).width + 24 < cw) ctx.fillText(ds, cx2 - 6, by + bh / 2);
        ctx.textAlign = "left";
      } else {
        ctx.fillText(truncText(ctx, task.title, cw - 12), cx1 + 6, by + bh / 2);
      }
      if (cw > 120 && row.type === "parent") {
        ctx.fillStyle = btc === "#111" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)";
        ctx.fillRect(cx1, by, 1.5, bh);
        ctx.fillRect(cx2 - 1.5, by, 1.5, bh);
      }
      ctx.restore();
    }
  });
}
function renderToday(ctx, s) {
  if (!s.o.showToday) return;
  const tx = s.lw + s.dateToX(s.today) - s.scrollX;
  if (tx >= s.lw && tx <= s.vw) {
    ctx.strokeStyle = cssVar("--mn-info");
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(tx, s.hh);
    ctx.lineTo(tx, s.vh);
    ctx.stroke();
  }
}
function renderHeader(ctx, s) {
  const sc = getScale(s.ppm);
  const hh = s.hh, lw = s.lw, vw = s.vw;
  const ppm = s.ppm, scrollX = s.scrollX, t = s.t;
  const tierH = hh / 2;
  const months = s.range.months;
  ctx.fillStyle = t.headerBg;
  ctx.fillRect(0, 0, vw, hh);
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(lw, tierH);
  ctx.lineTo(vw, tierH);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, hh);
  ctx.lineTo(vw, hh);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(lw, 0, vw - lw, hh);
  ctx.clip();
  if (sc.primaryType === "year") {
    buildYearSpans(months).forEach((span) => {
      const x1 = lw + span.s * ppm - scrollX, x2 = lw + span.e * ppm - scrollX;
      const sx = Math.max(x1, lw), ex = Math.min(x2, vw);
      if (ex <= sx) return;
      if (x1 > lw) {
        ctx.strokeStyle = t.text + "25";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, tierH);
        ctx.stroke();
      }
      ctx.fillStyle = t.text;
      ctx.font = '700 13px "Barlow Condensed","Inter",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      if (ctx.measureText(String(span.year)).width < ex - sx - 8) ctx.fillText(String(span.year), (sx + ex) / 2, tierH / 2);
      ctx.textAlign = "left";
    });
  } else {
    months.forEach((m, i) => {
      const x1 = lw + i * ppm - scrollX, x2 = lw + (i + 1) * ppm - scrollX;
      const sx = Math.max(x1, lw), ex = Math.min(x2, vw);
      if (ex <= sx) return;
      if (x1 > lw) {
        ctx.strokeStyle = t.text + "20";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, tierH);
        ctx.stroke();
      }
      ctx.fillStyle = t.text;
      ctx.font = '600 11px "Barlow Condensed","Inter",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(truncText(ctx, MONTH_FULL[m.month] + " " + m.year, ex - sx - 8), (sx + ex) / 2, tierH / 2);
      ctx.textAlign = "left";
    });
  }
  renderTier2(ctx, sc.scale, months, lw, vw, ppm, scrollX, tierH, hh, t);
  if (s.o.showToday) {
    const tbx = lw + s.dateToX(s.today) - scrollX;
    if (tbx >= lw - 24 && tbx <= vw + 24) {
      ctx.fillStyle = cssVar("--mn-info");
      roundRect(ctx, tbx - 24, tierH + (tierH - 18) / 2, 48, 18, 3);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.font = 'bold 9px "Barlow Condensed",sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("TODAY", tbx, tierH + tierH / 2);
      ctx.textAlign = "left";
    }
  }
  ctx.restore();
}
function renderTier2(ctx, scale, months, lw, vw, ppm, scrollX, tierH, hh, t) {
  months.forEach((m, i) => {
    const x = lw + i * ppm - scrollX;
    const sx = Math.max(x, lw), ex = Math.min(x + ppm, vw);
    if (ex <= sx) return;
    if (scale === "quarter" && m.month % 3 !== 0) return;
    if (x > lw) {
      ctx.strokeStyle = t.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, tierH);
      ctx.lineTo(x, hh);
      ctx.stroke();
    }
    ctx.fillStyle = t.muted;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    if (scale === "quarter") {
      ctx.font = '500 10px "Barlow Condensed","Inter",sans-serif';
      ctx.fillText("Q" + (Math.floor(m.month / 3) + 1), (sx + ex) / 2, tierH + tierH / 2);
    } else if (scale === "monthAbbr") {
      ctx.font = '500 10px "Barlow Condensed","Inter",sans-serif';
      if (ctx.measureText(MONTH_ABBR[m.month]).width < ex - sx - 4) ctx.fillText(MONTH_ABBR[m.month], (sx + ex) / 2, tierH + tierH / 2);
    } else if (scale === "month") {
      ctx.font = '500 11px "Barlow Condensed","Inter",sans-serif';
      ctx.fillText(truncText(ctx, MONTH_FULL[m.month], ex - sx - 6), (sx + ex) / 2, tierH + tierH / 2);
    } else if (scale === "week") {
      const weekPx = ppm / 4.33;
      for (let w = 0; w < 4; w++) {
        const wx = x + w * weekPx;
        const wsx = Math.max(wx, lw), wex = Math.min(wx + weekPx, vw);
        if (wex <= wsx) continue;
        if (w > 0 && wx > lw) {
          ctx.strokeStyle = t.border;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(wx, tierH);
          ctx.lineTo(wx, hh);
          ctx.stroke();
        }
        ctx.font = '400 9px "Barlow Condensed","Inter",sans-serif';
        ctx.fillText("W" + (w + 1), (wsx + wex) / 2, tierH + tierH / 2);
      }
    }
    ctx.textAlign = "left";
  });
}
function renderSidebar(ctx, s) {
  const rows = s.rows, o = s.o, t = s.t;
  const lw = s.lw, hh = s.hh, vh = s.vh;
  const scrollY = s.scrollY;
  const pal = s.pal;
  const SEVERITY = buildSeverity();
  ctx.fillStyle = t.sidebarBg;
  ctx.fillRect(0, hh, lw, vh - hh);
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lw, 0);
  ctx.lineTo(lw, vh);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, hh, lw, vh - hh);
  ctx.clip();
  rows.forEach((row, ri) => {
    const ry = rowY(ri, rows, o) - scrollY;
    const rh = row.type === "child" ? o.childRowHeight : o.rowHeight;
    if (ry + rh < hh || ry > vh) return;
    if (ri === s.hoverRow) {
      ctx.fillStyle = t.rowHover;
      ctx.fillRect(0, ry, lw, rh);
    }
    if (s.selected === row.task.id) {
      ctx.fillStyle = t.rowSel;
      ctx.fillRect(0, ry, lw, rh);
    }
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, ry + rh);
    ctx.lineTo(lw, ry + rh);
    ctx.stroke();
    const task = row.task;
    if (row.type === "parent") {
      let tx0 = 22;
      if (row.hasChildren) {
        ctx.fillStyle = t.muted;
        ctx.font = "10px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(s.expanded[String(task.id)] ? "\u25BC" : "\u25B6", 6, ry + rh / 2);
      } else {
        ctx.fillStyle = t.border;
        ctx.beginPath();
        ctx.arc(12, ry + rh / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      const stateColor = pal[task.state] || cssVar("--stage-completed", "#6B7280");
      ctx.fillStyle = stateColor;
      ctx.fillRect(tx0, ry + 6, 3, rh - 12);
      tx0 += 8;
      let bx = lw - 8;
      const badges = task.badges;
      if (badges?.missing6q) {
        bx -= 24;
        ctx.fillStyle = cssVar("--signal-danger", "#DC0000");
        roundRect(ctx, bx, ry + (rh - 14) / 2, 22, 14, 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 8px "Barlow Condensed",sans-serif';
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText("6Q", bx + 4, ry + rh / 2);
        bx -= 4;
      }
      if (badges?.severity) {
        const sev = SEVERITY[badges.severity];
        if (sev) {
          bx -= 14;
          ctx.fillStyle = sev.fg;
          ctx.font = "10px sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillText(sev.icon, bx + 2, ry + rh / 2);
          bx -= 4;
        }
      }
      ctx.fillStyle = t.text;
      ctx.font = '600 11px "Barlow Condensed","Inter",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(truncText(ctx, task.account || task.title, bx - tx0 - 4), tx0, ry + rh / 2);
    } else {
      ctx.fillStyle = t.muted;
      ctx.font = '10px "Inter",sans-serif';
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      let clbl = task.title;
      if (task.type) clbl = task.type + " \u2013 " + clbl;
      ctx.fillText(truncText(ctx, clbl, lw - 44), 36, ry + rh / 2);
    }
  });
  ctx.restore();
  ctx.fillStyle = t.headerBg;
  ctx.fillRect(0, 0, lw, hh);
}
function renderScrollbars(ctx, s) {
  const lw = s.lw, vw = s.vw, vh = s.vh, hh = s.hh;
  const tw = s.tw, ch = s.ch;
  const scrollX = s.scrollX, scrollY = s.scrollY;
  const msx = Math.max(0, tw - (vw - lw)), msy = Math.max(0, ch - vh);
  if (msx > 0) {
    const sbW = Math.max(30, (vw - lw) * ((vw - lw) / tw));
    const sbX = lw + scrollX / msx * (vw - lw - sbW);
    ctx.fillStyle = "rgba(200,200,200,0.2)";
    roundRect(ctx, sbX, vh - 5, sbW, 4, 2);
    ctx.fill();
  }
  if (msy > 0) {
    const sbH = Math.max(30, (vh - hh) * ((vh - hh) / ch));
    const sbYp = hh + scrollY / msy * (vh - hh - sbH);
    ctx.fillStyle = "rgba(200,200,200,0.2)";
    roundRect(ctx, vw - 5, sbYp, 4, sbH, 2);
    ctx.fill();
  }
}

// src/ts/gantt-events.ts
function canvasXY(canvas, e) {
  const r = canvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function hitTest(s, mx, my) {
  const o = s.o;
  const lw = o.labelWidth, hh = o.headerHeight;
  const rows = s.rows;
  if (my < hh) return { zone: "header" };
  for (let i = 0; i < rows.length; i++) {
    const ry = rowY(i, rows, o) - s.scrollY;
    const rh = rows[i].type === "child" ? o.childRowHeight : o.rowHeight;
    if (my < ry || my >= ry + rh) continue;
    if (mx < lw) {
      const isChev = rows[i].type === "parent" && rows[i].hasChildren && mx < 20;
      return { zone: "sidebar", ri: i, row: rows[i], isChevron: isChev };
    }
    const task = rows[i].task;
    const sd = parseDate(task.start), ed = parseDate(task.end);
    if (sd && ed) {
      const dateToX = s.dateToX;
      const bx = lw + dateToX(sd) - s.scrollX;
      const bw = dateToX(ed) - dateToX(sd);
      if (mx >= bx && mx <= bx + bw) return { zone: "bar", ri: i, row: rows[i] };
    }
    return { zone: "timeline", ri: i, row: rows[i] };
  }
  return { zone: "empty" };
}
function rowIdx(rows, id) {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].task.id === id) return i;
  }
  return -1;
}
function showTip(s, hit, clientX, clientY) {
  if (!hit.row) return;
  const row = hit.row;
  const task = row.task;
  const isChild = row.type === "child";
  const pal = s.pal, cPal = s.cPal;
  const col = isChild ? cPal[task.state] || cssVar("--stage-completed", "#6B7280") : pal[task.state] || cssVar("--stage-completed", "#6B7280");
  const sd = parseDate(task.start), ed = parseDate(task.end);
  const dur = sd && ed ? Math.round(daysBetween(sd, ed)) : null;
  let h = '<div class="mn-chart-tooltip__label">' + escapeHtml(String(task.title ?? "")) + "</div>";
  if (task.account) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">' + escapeHtml(String(task.account)) + "</div>";
  h += '<div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;">';
  h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">Start: <b style="color:var(--mn-border-strong);">' + fmtDateFull(sd) + "</b></span>";
  h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">End: <b style="color:var(--mn-border-strong);">' + fmtDateFull(ed) + "</b></span>";
  if (dur !== null) h += '<span style="color:var(--mn-text-tertiary);font-size:0.6rem;">Duration: ' + dur + " days</span>";
  h += '</div><div style="display:flex;align-items:center;gap:4px;margin-top:3px;">';
  h += '<span class="mn-chart-tooltip__dot" style="background:' + col + ';"></span>';
  h += '<span style="color:' + col + ';font-size:0.65rem;">' + escapeHtml(String(task.state ?? "Unknown")) + "</span></div>";
  if (task.progress !== void 0 && !isChild) h += '<div style="color:var(--mn-accent);font-size:0.65rem;margin-top:2px;">' + Math.round(task.progress * 100) + "% complete</div>";
  if (isChild && task.owner) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;margin-top:2px;">Owner: ' + escapeHtml(String(task.owner)) + "</div>";
  if (isChild && task.type) h += '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">Type: ' + escapeHtml(String(task.type)) + "</div>";
  const tip = s.tip;
  tip.innerHTML = h;
  tip.classList.add("mn-chart-tooltip--visible");
  tip.setAttribute("aria-hidden", "true");
  let left = clientX + 12, top = clientY - tip.offsetHeight - 12;
  if (left + 200 > window.innerWidth) left = clientX - 200 - 12;
  if (top < 10) top = clientY + 12;
  tip.style.position = "fixed";
  tip.style.left = left + "px";
  tip.style.top = top + "px";
}
function hideTip(s) {
  const tip = s.tip;
  tip.classList.remove("mn-chart-tooltip--visible");
  tip.setAttribute("aria-hidden", "true");
}
function attachGanttEvents(s) {
  const canvas = s.canvas;
  const buildRows2 = s._buildRows;
  const render = s.render;
  const o = s.o;
  canvas.addEventListener("mousemove", (e) => {
    const p = canvasXY(canvas, e);
    const hit = hitTest(s, p.x, p.y);
    const newHover = hit.ri !== void 0 ? hit.ri : -1;
    if (newHover !== s.hoverRow) {
      s.hoverRow = newHover;
      render();
    }
    canvas.style.cursor = hit.zone === "bar" || hit.isChevron ? "pointer" : hit.zone === "timeline" ? "grab" : "default";
    if (hit.zone === "bar") showTip(s, hit, e.clientX, e.clientY);
    else hideTip(s);
  });
  canvas.addEventListener("mouseleave", () => {
    s.hoverRow = -1;
    hideTip(s);
    render();
  });
  canvas.addEventListener("click", (e) => {
    const p = canvasXY(canvas, e);
    const hit = hitTest(s, p.x, p.y);
    if (hit.isChevron && hit.row) {
      toggleExpand(s, hit, buildRows2, render);
      return;
    }
    if (hit.zone === "sidebar" && hit.row && hit.row.type === "parent" && hit.row.hasChildren) {
      toggleExpand(s, hit, buildRows2, render);
      return;
    }
    if (hit.row) {
      s.selected = hit.row.task.id;
      render();
      if (hit.zone === "bar" && o.onClick) o.onClick(hit.row.task, hit.row.type);
      if (o.onSelect) o.onSelect(hit.row.task, hit.row.type);
    }
  });
  canvas.addEventListener("mousedown", (e) => {
    const p = canvasXY(canvas, e);
    const hit = hitTest(s, p.x, p.y);
    if (hit.zone === "timeline" || hit.zone === "header" || hit.zone === "empty") {
      s.dragging = true;
      s.dragSX = e.clientX;
      s.dragSY = e.clientY;
      s.dragOX = s.scrollX;
      s.dragOY = s.scrollY;
      canvas.style.cursor = "grabbing";
    }
  });
  const onDocMove = (e) => {
    if (!s.dragging) return;
    s.scrollX = s.dragOX - (e.clientX - s.dragSX);
    s.scrollY = s.dragOY - (e.clientY - s.dragSY);
    render();
  };
  const onDocUp = () => {
    s.dragging = false;
  };
  document.addEventListener("mousemove", onDocMove);
  document.addEventListener("mouseup", onDocUp);
  s.onDocMove = onDocMove;
  s.onDocUp = onDocUp;
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? o.zoomStep : -o.zoomStep;
      const old = s.zoom;
      s.zoom = Math.max(o.minZoom, Math.min(o.maxZoom, s.zoom + delta));
      const p = canvasXY(canvas, e);
      const tlx = p.x - o.labelWidth + s.scrollX;
      const months = s.range.months;
      const ratio = tlx / (months.length * (o.basePxPerMonth / old));
      s.scrollX = ratio * months.length * s.ppm() - (p.x - o.labelWidth);
    } else {
      s.scrollX = s.scrollX + (e.shiftKey ? e.deltaY : e.deltaX);
      s.scrollY = s.scrollY + (e.shiftKey ? 0 : e.deltaY);
    }
    render();
  }, { passive: false });
  s.btnZI.addEventListener("click", () => {
    s.zoom = Math.max(o.minZoom, s.zoom - o.zoomStep * 2);
    render();
  });
  s.btnZO.addEventListener("click", () => {
    s.zoom = Math.min(o.maxZoom, s.zoom + o.zoomStep * 2);
    render();
  });
  s.btnFit.addEventListener("click", () => {
    if (typeof s._fitView === "function") s._fitView(s.wrap.getBoundingClientRect().width || 800);
    render();
  });
  const SCROLL_STEP = 40;
  canvas.addEventListener("keydown", (e) => {
    const rows = s.rows;
    let idx;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      idx = rowIdx(rows, s.selected);
      if (idx < rows.length - 1) {
        s.selected = rows[idx + 1].task.id;
        render();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      idx = rowIdx(rows, s.selected);
      if (idx > 0) {
        s.selected = rows[idx - 1].task.id;
        render();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      s.scrollX = Math.max(0, s.scrollX - SCROLL_STEP);
      render();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      s.scrollX = s.scrollX + SCROLL_STEP;
      render();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const r = rows.find((r2) => r2.task.id === s.selected);
      if (r && r.type === "parent" && r.hasChildren) {
        const exp = s.expanded;
        const sid = s.selected;
        if (exp[sid]) delete exp[sid];
        else exp[sid] = true;
        s.rows = buildRows2(s.tasks, exp);
        render();
      }
    } else if (e.key === "Escape") {
      s.selected = null;
      render();
    }
  });
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => render());
    ro.observe(s.wrap);
    s.resizeObs = ro;
  }
  const themeObs = new MutationObserver(() => {
    s.pal = buildPalette();
    s.cPal = buildChildPalette();
    render();
  });
  themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  s.themeObs = themeObs;
}
function toggleExpand(s, hit, buildRows2, render) {
  const o = s.o;
  const row = hit.row;
  const id = String(row.task.id);
  const exp = s.expanded;
  if (exp[id]) delete exp[id];
  else exp[id] = true;
  s.rows = buildRows2(s.tasks, exp);
  render();
  if (o.onExpand) o.onExpand(row.task, !!exp[id]);
}

// src/ts/gantt.ts
function gantt(container, tasks, userOpts) {
  if (!container || !tasks || !tasks.length) return null;
  const o = { ...DEFAULTS, ...userOpts };
  const pal = o.palette || buildPalette();
  const cPal = o.childPalette || buildChildPalette();
  const today = o.today ? parseDate(o.today) : /* @__PURE__ */ new Date();
  const expanded = {};
  const range = buildRange(tasks);
  let rows = buildRows(tasks, expanded);
  const s = {
    o,
    pal,
    cPal,
    today,
    expanded,
    selected: null,
    hoverRow: -1,
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
    dragging: false,
    dragSX: 0,
    dragSY: 0,
    dragOX: 0,
    dragOY: 0,
    range,
    rows,
    tasks,
    canvas: null,
    wrap: null,
    tip: null,
    container,
    btnZI: null,
    btnZO: null,
    btnFit: null,
    ppm: () => o.basePxPerMonth / s.zoom,
    timelineW: () => range.months.length * s.ppm(),
    dateToX: (d) => daysBetween(range.min, d) / daysBetween(range.min, range.max) * s.timelineW(),
    render: null,
    onDocMove: null,
    onDocUp: null,
    themeObs: null,
    resizeObs: null,
    _buildRows: (t, exp) => buildRows(t, exp)
  };
  container.innerHTML = "";
  container.classList.add("mn-gantt-timeline");
  const ctrlBar = document.createElement("div");
  ctrlBar.className = "mn-gantt-timeline__controls";
  const zoomGrp = document.createElement("div");
  zoomGrp.className = "mn-gantt-timeline__zoom";
  const mkBtn = (label, title, cls) => {
    const b = document.createElement("button");
    b.className = "mn-gantt-timeline__zoom-btn" + (cls ? " " + cls : "");
    b.textContent = label;
    b.title = title;
    return b;
  };
  s.btnZI = mkBtn("\u2212", "Zoom in (more detail)");
  s.btnZO = mkBtn("+", "Zoom out (overview)");
  s.btnFit = mkBtn("Fit", "Fit timeline to view", "mn-gantt-timeline__zoom-btn--fit");
  zoomGrp.appendChild(s.btnZI);
  zoomGrp.appendChild(s.btnZO);
  zoomGrp.appendChild(s.btnFit);
  const leg = document.createElement("div");
  leg.className = "mn-gantt-timeline__legend";
  Object.keys(pal).forEach((st) => {
    const span = document.createElement("span");
    span.className = "mn-gantt-timeline__legend-item";
    const safeCol = isValidColor(pal[st]) ? pal[st] : "var(--mn-border-strong)";
    span.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:' + safeCol + ';"></span>' + escapeHtml(st);
    leg.appendChild(span);
  });
  const todayLeg = document.createElement("span");
  todayLeg.className = "mn-gantt-timeline__legend-item";
  todayLeg.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:var(--mn-info);"></span>TODAY';
  leg.appendChild(todayLeg);
  ctrlBar.appendChild(zoomGrp);
  ctrlBar.appendChild(leg);
  container.appendChild(ctrlBar);
  const wrap = document.createElement("div");
  wrap.className = "mn-gantt-timeline__canvas-wrap";
  container.appendChild(wrap);
  s.wrap = wrap;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "grid");
  canvas.setAttribute("aria-label", "Interactive Gantt timeline. Use arrow keys to navigate, Enter to expand rows.");
  canvas.setAttribute("aria-roledescription", "gantt chart");
  canvas.setAttribute("tabindex", "0");
  wrap.appendChild(canvas);
  s.canvas = canvas;
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip mn-gantt-timeline__tip";
  tip.setAttribute("role", "tooltip");
  tip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tip);
  s.tip = tip;
  function render() {
    const cr = wrap.getBoundingClientRect();
    const vw = Math.max(cr.width, 400), vh = Math.max(cr.height, 200);
    canvas.width = vw * DPR;
    canvas.height = vh * DPR;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(DPR, DPR);
    const lw = o.labelWidth, hh = o.headerHeight;
    const tw = s.timelineW();
    const ch = contentH(s.rows, o);
    s.scrollX = Math.max(0, Math.min(s.scrollX, Math.max(0, tw - (vw - lw))));
    s.scrollY = Math.max(0, Math.min(s.scrollY, Math.max(0, ch - vh)));
    const t = themeColors();
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, vw, vh);
    const snap = {
      o,
      pal: s.pal,
      cPal: s.cPal,
      today,
      expanded: s.expanded,
      selected: s.selected,
      hoverRow: s.hoverRow,
      scrollX: s.scrollX,
      scrollY: s.scrollY,
      range: s.range,
      rows: s.rows,
      lw,
      hh,
      vw,
      vh,
      tw,
      ch,
      t,
      ppm: s.ppm(),
      dateToX: s.dateToX
    };
    ctx.save();
    ctx.beginPath();
    ctx.rect(lw, hh, vw - lw, vh - hh);
    ctx.clip();
    renderGrid(ctx, snap);
    renderRows(ctx, snap);
    renderToday(ctx, snap);
    ctx.restore();
    renderHeader(ctx, snap);
    renderSidebar(ctx, snap);
    renderScrollbars(ctx, snap);
  }
  s.render = render;
  function fitView(vw) {
    const thirtyAgo = new Date(today.getTime() - 30 * 864e5);
    const sixAhead = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    const fitStart = thirtyAgo < range.min ? range.min : thirtyAgo;
    const fitEnd = sixAhead > range.max ? range.max : sixAhead;
    const daysVis = daysBetween(fitStart, fitEnd);
    const totalDays = daysBetween(range.min, range.max);
    if (daysVis > 0 && totalDays > 0) {
      const totalPx = range.months.length * o.basePxPerMonth;
      s.zoom = daysVis / totalDays * totalPx / (vw - o.labelWidth);
      s.zoom = Math.max(o.minZoom, Math.min(o.maxZoom, s.zoom));
      s.scrollX = Math.max(0, s.dateToX(fitStart));
    }
  }
  s._fitView = fitView;
  attachGanttEvents(s);
  const initVw = wrap.getBoundingClientRect().width || 800;
  if (initVw > 0 && range.months.length > 0) fitView(initVw);
  render();
  return {
    setZoom: (z) => {
      s.zoom = z;
      render();
    },
    getZoom: () => s.zoom,
    expandAll: () => {
      tasks.forEach((t) => {
        if (t.children?.length) s.expanded[String(t.id)] = true;
      });
      s.rows = buildRows(tasks, s.expanded);
      render();
    },
    collapseAll: () => {
      s.expanded = {};
      s.rows = buildRows(tasks, s.expanded);
      render();
    },
    setTasks: (nt) => {
      s.tasks = nt;
      s.range = buildRange(nt);
      s.rows = buildRows(nt, s.expanded);
      render();
    },
    select: (id) => {
      s.selected = id;
      render();
    },
    scrollToToday: () => {
      const vw = wrap.getBoundingClientRect().width || 800;
      s.scrollX = s.dateToX(today) - (vw - o.labelWidth) / 2;
      render();
    },
    render,
    destroy: () => {
      document.removeEventListener("mousemove", s.onDocMove);
      document.removeEventListener("mouseup", s.onDocUp);
      if (s.themeObs) s.themeObs.disconnect();
      if (s.resizeObs) s.resizeObs.disconnect();
      container.innerHTML = "";
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    }
  };
}
//# sourceMappingURL=index.cjs.map
