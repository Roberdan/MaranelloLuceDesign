/* Maranello Luce Design v3.0.0 | MIT | github.com/Roberdan/MaranelloLuceDesign */
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

// src/ts/index.ts
var index_exports = {};
__export(index_exports, {
  COLOR: () => COLOR,
  CONTINENTS: () => CONTINENTS,
  DEFAULTS: () => DEFAULTS2,
  DPR: () => DPR3,
  DURATION: () => DURATION,
  EASE: () => EASE,
  EventBus: () => EventBus,
  FONT: () => FONT,
  FerrariGauge: () => FerrariGauge,
  GAUGE_SIZES: () => GAUGE_SIZES,
  ICON_SPARK: () => ICON_SPARK,
  Maranello: () => M,
  RADIUS: () => RADIUS,
  SCOPE_COLOR: () => SCOPE_COLOR,
  SERIES: () => SERIES,
  SHADOW: () => SHADOW,
  SPACE: () => SPACE,
  SPEEDO_FONT: () => SPEEDO_FONT,
  SPEEDO_SIZES: () => SPEEDO_SIZES,
  START: () => START2,
  SWEEP: () => SWEEP2,
  TAU: () => TAU,
  TEXT_SIZE: () => TEXT_SIZE,
  VERSION: () => VERSION,
  Z_INDEX: () => Z_INDEX,
  a11yPanel: () => a11yPanel,
  actionIcons: () => actionIcons,
  addListener: () => addListener,
  addValidator: () => addValidator,
  applySettings: () => applySettings,
  areaChart: () => areaChart,
  attachEvents: () => attachEvents,
  autoBind: () => autoBind,
  autoBindSliders: () => autoBindSliders,
  autoContrast: () => autoContrast,
  autoTextColor: () => autoTextColor,
  azIcons: () => azIcons,
  barChart: () => barChart,
  bind: () => bind,
  bindChart: () => bindChart,
  bindControl: () => bindControl,
  bubble: () => bubble,
  buildDOM: () => buildDOM,
  buildGaugePalette: () => buildGaugePalette,
  buildPanel: () => buildPanel,
  buildSeries: () => buildSeries,
  buildTicks: () => buildTicks2,
  buildUI: () => buildUI,
  chartHiDpi: () => chartHiDpi,
  chartInteract: () => chartInteract,
  clamp: () => clamp,
  clampVal: () => clampVal2,
  cleanupTimers: () => cleanupTimers,
  closeDetailPanel: () => closeDetailPanel,
  closeDrawer: () => closeDrawer,
  closeModal: () => closeModal,
  clusterMarkers: () => clusterMarkers,
  commandPalette: () => commandPalette,
  createDetailPanel: () => createDetailPanel,
  createEl: () => createEl2,
  createElement: () => createElement,
  createGauge: () => createGauge,
  createGaugesInContainer: () => createGaugesInContainer,
  cruiseLever: () => cruiseLever,
  cssVar: () => cssVar,
  cycleTheme: () => cycleTheme,
  dataIcons: () => dataIcons,
  dataTable: () => dataTable,
  datePicker: () => datePicker,
  debounce: () => debounce,
  defaultMessages: () => defaultMessages,
  detectTheme: () => detectTheme,
  donut: () => donut,
  drawMarker: () => drawMarker,
  drawSpeedometer: () => drawSpeedometer,
  easeOutCubic: () => easeOutCubic2,
  editors: () => editors,
  emit: () => emit,
  eventBus: () => eventBus,
  flipCounter: () => flipCounter,
  formatDate: () => formatDate,
  formatDateSimple: () => formatDateSimple,
  formatNumber: () => formatNumber,
  formatTime: () => formatTime,
  forms: () => forms,
  funnel: () => funnel,
  gantt: () => gantt,
  getAccent: () => getAccent,
  getCanvasSize: () => getCanvasSize,
  getFieldInput: () => getFieldInput,
  getIcon: () => getIcon,
  getInitials: () => getInitials,
  getMarkerColors: () => getMarkerColors,
  getTheme: () => getTheme,
  getVisibleProjected: () => getVisibleProjected,
  gridLayout: () => gridLayout,
  hBarChart: () => hBarChart,
  halfGauge: () => halfGauge,
  hexLum: () => hexLum2,
  hexToRgba: () => hexToRgba,
  hiDpiCanvas: () => hiDpiCanvas,
  hideTip: () => hideTip2,
  hitTest: () => hitTest2,
  iconCatalog: () => iconCatalog,
  icons: () => icons,
  initAutoResize: () => initAutoResize,
  initCharCounter: () => initCharCounter,
  initDrillDown: () => initDrillDown,
  initDropdown: () => initDropdown,
  initFileUpload: () => initFileUpload,
  initFormSteps: () => initFormSteps,
  initForms: () => initForms,
  initGauges: () => initGauges,
  initInlineEdit: () => initInlineEdit,
  initLiveValidation: () => initLiveValidation,
  initMessages: () => initMessages,
  initNavTracking: () => initNavTracking,
  initOrgTree: () => initOrgTree,
  initPasswordToggle: () => initPasswordToggle,
  initRotary: () => initRotary,
  initScrollReveal: () => initScrollReveal,
  initSearchClear: () => initSearchClear,
  initSlider: () => initSlider,
  initTabs: () => initTabs,
  initTagInput: () => initTagInput,
  initThemeToggle: () => initThemeToggle,
  lerp: () => lerp,
  liveGraph: () => liveGraph,
  loadSettings: () => loadSettings,
  loginScreen: () => loginScreen,
  manettino: () => manettino,
  mapView: () => mapView,
  mapboxView: () => mapboxView,
  markerRadius: () => markerRadius,
  navIcons: () => navIcons,
  networkMessages: () => networkMessages,
  neuralNodes: () => neuralNodes,
  normalizeBars: () => normalizeBars,
  normalizeHex: () => normalizeHex2,
  objectIcons: () => objectIcons,
  off: () => off,
  okrPanel: () => okrPanel,
  on: () => on,
  onDrillDown: () => onDrillDown,
  openDetailPanel: () => openDetailPanel,
  openDrawer: () => openDrawer,
  openModal: () => openModal,
  profileMenu: () => profileMenu,
  progressRing: () => progressRing,
  project: () => project,
  radar: () => radar,
  redrawAll: () => redrawAll,
  registerDatePicker: () => registerDatePicker,
  reinitAll: () => reinitAll,
  relativeLuminance: () => relativeLuminance,
  renderBody: () => renderBody,
  renderContent: () => renderContent,
  renderHBar: () => renderHBar,
  renderIcon: () => renderIcon,
  renderLegend: () => renderLegend,
  renderPersonResults: () => renderPersonResults,
  renderSkeleton: () => renderSkeleton,
  renderers: () => renderers,
  resolveContainer: () => resolveContainer3,
  saveSettings: () => saveSettings,
  setTheme: () => setTheme,
  showTip: () => showTip2,
  showToast: () => showToast,
  socialGraph: () => socialGraph,
  sparkline: () => sparkline,
  sparklineInteract: () => sparklineInteract,
  speedoPalette: () => speedoPalette2,
  speedometer: () => speedometer,
  statusIcons: () => statusIcons,
  steppedRotary: () => steppedRotary,
  systemStatus: () => systemStatus,
  throttle: () => throttle,
  toast: () => toast,
  toggleLever: () => toggleLever,
  toggleNotifications: () => toggleNotifications,
  updateGauge: () => updateGauge,
  updateStatusSelectColor: () => updateStatusSelectColor,
  validateField: () => validateField,
  validateForm: () => validateForm,
  validators: () => validators,
  valueToAngle: () => valueToAngle
});
module.exports = __toCommonJS(index_exports);

// src/ts/core/events.ts
var PREFIX = "mn:";
var EventBus = class {
  constructor(target = document) {
    this.listeners = /* @__PURE__ */ new Map();
    this.target = target;
  }
  on(name, handler) {
    const wrapped = (e) => {
      handler(e.detail);
    };
    const key = PREFIX + name;
    this.target.addEventListener(key, wrapped);
    const entries = this.listeners.get(key) ?? [];
    entries.push({ original: handler, wrapped });
    this.listeners.set(key, entries);
  }
  emit(name, detail) {
    this.target.dispatchEvent(
      new CustomEvent(PREFIX + name, { detail, bubbles: false })
    );
  }
  off(name, handler) {
    const key = PREFIX + name;
    const entries = this.listeners.get(key);
    if (!entries) return;
    const idx = entries.findIndex((e) => e.original === handler);
    if (idx === -1) return;
    this.target.removeEventListener(key, entries[idx].wrapped);
    entries.splice(idx, 1);
    if (entries.length === 0) this.listeners.delete(key);
  }
  removeAll() {
    for (const [key, entries] of this.listeners) {
      for (const entry of entries) {
        this.target.removeEventListener(key, entry.wrapped);
      }
    }
    this.listeners.clear();
  }
};
var eventBus = new EventBus();

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
  const el4 = document.createElement(tag);
  if (className) el4.className = className;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === "text") el4.textContent = val;
      else el4.setAttribute(key, val);
    }
  }
  return el4;
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
  const dpr2 = window.devicePixelRatio || 1;
  canvas.width = width * dpr2;
  canvas.height = height * dpr2;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.scale(dpr2, dpr2);
  return dpr2;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// src/ts/network-messages.ts
function resolveContainer(container) {
  if (typeof container === "string") {
    const found = document.querySelector(container);
    return found instanceof HTMLElement ? found : null;
  }
  return container instanceof HTMLElement ? container : null;
}
function alpha(color, opacity) {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
  const value = parseInt(full, 16);
  if (Number.isNaN(value)) return `rgba(255,199,44,${opacity})`;
  return `rgba(${value >> 16 & 255},${value >> 8 & 255},${value & 255},${opacity})`;
}
function networkMessages(container, opts = { nodes: [], connections: [] }) {
  const target = resolveContainer(container);
  if (!target) return null;
  const host = target;
  const options = {
    particleTrail: true,
    glowEffect: true,
    ...opts
  };
  let nodes = options.nodes.slice();
  const messages = [];
  const flashes = [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let raf = 0;
  let last = performance.now();
  host.innerHTML = "";
  host.style.position = "relative";
  host.style.overflow = "hidden";
  if (options.width) host.style.width = `${options.width}px`;
  if (options.height) host.style.height = `${options.height}px`;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  canvas.setAttribute("aria-label", "Network message flow");
  host.appendChild(canvas);
  const getMap = () => new Map(nodes.map((node) => [node.id, node]));
  const point = (node) => ({ x: node.x * canvas.clientWidth, y: node.y * canvas.clientHeight });
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const mo = new MutationObserver(() => draw(16));
  function resize() {
    const width = options.width ?? Math.max(320, host.clientWidth || 640);
    const height = options.height ?? Math.max(220, host.clientHeight || 320);
    hiDpiCanvas(canvas, width, height);
  }
  function drawParticle(color, x, y, radius, label) {
    ctx.save();
    if (options.glowEffect) {
      ctx.shadowColor = color;
      ctx.shadowBlur = radius * 3;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#05070c";
      ctx.font = `600 ${Math.max(9, radius * 2.1)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.slice(0, 3), x, y + 0.5);
    }
    ctx.restore();
  }
  function draw(dt) {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    const map = getMap();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(3,7,12,0.36)";
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.lineWidth = 1.15;
    ctx.setLineDash([6, 8]);
    for (const link of options.connections) {
      const from = map.get(link.from), to = map.get(link.to);
      if (!from || !to) continue;
      const a = point(from), b = point(to);
      const active = messages.some((msg) => msg.from === link.from && msg.to === link.to);
      ctx.strokeStyle = link.color ?? (active ? alpha("#FFC72C", 0.45) : "rgba(255,255,255,0.16)");
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.restore();
    for (let i = flashes.length - 1; i >= 0; i--) {
      const flash = flashes[i];
      flash.life -= dt * 26e-4;
      flash.radius += dt * 0.05;
      if (flash.life <= 0) {
        flashes.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = alpha(flash.color, flash.life * 0.75);
      ctx.lineWidth = 1.5 + flash.life * 2;
      if (options.glowEffect) {
        ctx.shadowColor = flash.color;
        ctx.shadowBlur = 10 * flash.life;
      }
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const from = map.get(msg.from), to = map.get(msg.to);
      if (!from || !to) {
        messages.splice(i, 1);
        continue;
      }
      msg.progress += dt / 1500 * msg.speed;
      const a = point(from), b = point(to);
      const x = lerp(a.x, b.x, msg.progress), y = lerp(a.y, b.y, msg.progress);
      if (options.particleTrail) {
        msg.trail.push({ x, y });
        if (msg.trail.length > 10) msg.trail.shift();
        msg.trail.forEach((p, index) => {
          drawParticle(msg.color ?? to.color ?? "#FFC72C", p.x, p.y, msg.size * (0.35 + index / 18), void 0);
          ctx.save();
          ctx.globalAlpha = (index + 1) / msg.trail.length * 0.18;
          ctx.fillStyle = msg.color ?? to.color ?? "#FFC72C";
          ctx.beginPath();
          ctx.arc(p.x, p.y, msg.size * (0.35 + index / 18), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
      if (msg.progress >= 1) {
        flashes.push({ x: b.x, y: b.y, radius: 4, life: 1, color: msg.color ?? to.color ?? "#FFC72C" });
        messages.splice(i, 1);
        continue;
      }
      drawParticle(msg.color ?? to.color ?? "#FFC72C", x, y, msg.size, msg.label);
    }
    for (const node of nodes) {
      const p = point(node), size = node.size ?? 10, color = node.color ?? "#4EA8DE";
      ctx.save();
      if (options.glowEffect) {
        ctx.shadowColor = color;
        ctx.shadowBlur = size * 1.4;
      }
      ctx.fillStyle = alpha(color, 0.2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#f5f1e6";
      ctx.font = "600 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, p.x, p.y + size + 18);
    }
  }
  function loop(now) {
    const dt = Math.min(48, now - last || 16);
    last = now;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }
  function send(msg) {
    const map = getMap();
    if (!map.get(msg.from) || !map.get(msg.to)) return;
    messages.push({
      ...msg,
      progress: 0,
      speed: Math.max(0.5, Math.min(3, msg.speed ?? 1)),
      size: msg.size ?? 4,
      trail: []
    });
  }
  resize();
  ro?.observe(host);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  raf = requestAnimationFrame(loop);
  return {
    send,
    burst: (msgs) => msgs.forEach(send),
    setNodes: (next) => {
      nodes = next.slice();
      const map = getMap();
      for (let i = messages.length - 1; i >= 0; i--) {
        if (!map.get(messages[i].from) || !map.get(messages[i].to)) messages.splice(i, 1);
      }
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      mo.disconnect();
      host.innerHTML = "";
    }
  };
}

// src/ts/neural-nodes.ts
var DEFAULT_COLORS = ["#FFC72C", "#4EA8DE", "#00A651"];
function resolveContainer2(container) {
  const found = typeof container === "string" ? document.querySelector(container) : container;
  return found instanceof HTMLElement ? found : null;
}
function alpha2(color, opacity) {
  const full = color.replace("#", "").replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3");
  const value = parseInt(full, 16);
  return Number.isNaN(value) ? `rgba(255,199,44,${opacity})` : `rgba(${value >> 16 & 255},${value >> 8 & 255},${value & 255},${opacity})`;
}
function neuralNodes(container, opts = {}) {
  const target = resolveContainer2(container);
  if (!target) return null;
  const host = target;
  const options = {
    nodeCount: 30,
    connectionDensity: 0.15,
    colors: DEFAULT_COLORS,
    pulseSpeed: 1,
    particleCount: 2,
    interactive: true,
    ...opts
  };
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let nodes = [];
  let connections = [];
  let particles = [];
  const waves = [];
  const activations = [];
  let activity = 0.55;
  let hovered = -1;
  let raf = 0;
  let frame = 0;
  let last = performance.now();
  host.innerHTML = "";
  host.style.position = "relative";
  host.style.overflow = "hidden";
  if (options.width) host.style.width = `${options.width}px`;
  if (options.height) host.style.height = `${options.height}px`;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  canvas.setAttribute("aria-label", "Neural nodes visualization");
  host.appendChild(canvas);
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const onMove = (event) => {
    const rect = canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    hovered = nodes.findIndex((node) => Math.hypot(node.x - x, node.y - y) < 18 + node.energy * 8);
  };
  const onLeave = () => {
    hovered = -1;
  };
  function resize() {
    hiDpiCanvas(canvas, options.width ?? Math.max(360, host.clientWidth || 720), options.height ?? Math.max(280, host.clientHeight || 360));
    if (!nodes.length) initNodes();
    rebuildConnections();
  }
  function initNodes() {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    nodes = Array.from({ length: options.nodeCount }, (_, index) => ({
      x: 24 + Math.random() * (width - 48),
      y: 24 + Math.random() * (height - 48),
      vx: (Math.random() - 0.5) * 0.025,
      vy: (Math.random() - 0.5) * 0.025,
      color: options.colors[index % options.colors.length],
      phase: Math.random() * Math.PI * 2,
      energy: Math.random() * 0.4
    }));
  }
  function rebuildConnections() {
    const threshold = Math.min(canvas.clientWidth, canvas.clientHeight) * (0.14 + options.connectionDensity * 0.28);
    connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < threshold) connections.push({ a: i, b: j });
      }
    }
    particles = connections.flatMap((_, index) => Array.from({ length: options.particleCount }, (_2, lane) => ({
      connection: index,
      lane,
      t: Math.random(),
      speed: 12e-5 + Math.random() * 18e-5
    })));
  }
  function triggerPulse(nodeIndex = Math.floor(Math.random() * nodes.length)) {
    if (!nodes[nodeIndex]) return;
    const graph = Array.from({ length: nodes.length }, () => []);
    connections.forEach((link) => {
      graph[link.a].push(link.b);
      graph[link.b].push(link.a);
    });
    const queue = [[nodeIndex, 0]];
    const seen = /* @__PURE__ */ new Set([nodeIndex]);
    const start = performance.now();
    while (queue.length) {
      const [index, hop] = queue.shift();
      activations.push({ at: start + hop * 100, index });
      graph[index].forEach((next) => {
        if (seen.has(next)) return;
        seen.add(next);
        queue.push([next, hop + 1]);
      });
    }
  }
  function update(dt, now) {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    while (activations[0] && activations[0].at <= now) {
      const current = activations.shift();
      const node = nodes[current.index];
      if (!node) continue;
      node.energy = 1.9;
      waves.push({ x: node.x, y: node.y, radius: 4, life: 1, color: node.color });
    }
    nodes.forEach((node) => {
      node.vx = (node.vx + (Math.random() - 0.5) * 25e-4 * dt) * 0.985;
      node.vy = (node.vy + (Math.random() - 0.5) * 25e-4 * dt) * 0.985;
      node.x += node.vx * dt;
      node.y += node.vy * dt;
      if (node.x < 16 || node.x > width - 16) node.vx *= -1;
      if (node.y < 16 || node.y > height - 16) node.vy *= -1;
      node.x = Math.max(16, Math.min(width - 16, node.x));
      node.y = Math.max(16, Math.min(height - 16, node.y));
      node.energy = Math.max(0, node.energy - dt * 16e-4);
    });
    if (++frame % 14 === 0) rebuildConnections();
    particles.forEach((particle) => {
      particle.t = (particle.t + dt * particle.speed * (0.45 + activity * 1.8) * options.pulseSpeed) % 1;
    });
    for (let i = waves.length - 1; i >= 0; i--) {
      waves[i].life -= dt * 13e-4 * options.pulseSpeed;
      waves[i].radius += dt * 0.11 * options.pulseSpeed;
      if (waves[i].life <= 0) waves.splice(i, 1);
    }
  }
  function draw(now) {
    const width = canvas.clientWidth || 1, height = canvas.clientHeight || 1;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(4,10,18,0.28)";
    ctx.fillRect(0, 0, width, height);
    connections.forEach((link) => {
      const a = nodes[link.a], b = nodes[link.b];
      const emphasized = hovered === link.a || hovered === link.b;
      const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      gradient.addColorStop(0, alpha2(a.color, emphasized ? 0.48 : 0.26 + a.energy * 0.18));
      gradient.addColorStop(0.55, alpha2(b.color, 0.18 + Math.max(a.energy, b.energy) * 0.16));
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = emphasized ? 2 : 1.1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    const visibleLanes = Math.max(1, Math.round(options.particleCount * (0.3 + activity * 0.7)));
    particles.forEach((particle) => {
      if (particle.lane >= visibleLanes) return;
      const link = connections[particle.connection];
      if (!link) return;
      const a = nodes[link.a], b = nodes[link.b];
      const x = a.x + (b.x - a.x) * particle.t, y = a.y + (b.y - a.y) * particle.t;
      ctx.save();
      ctx.fillStyle = alpha2(a.color, 0.65 + activity * 0.25);
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 6 + activity * 8;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + activity * 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    waves.forEach((wave) => {
      ctx.save();
      ctx.strokeStyle = alpha2(wave.color, wave.life * 0.65);
      ctx.lineWidth = 1.5 + wave.life * 2;
      ctx.shadowColor = wave.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
    nodes.forEach((node, index) => {
      const pulse = 2.4 + Math.sin(now * 2e-3 * options.pulseSpeed + node.phase) * 1.4 + node.energy * 3.2 + (hovered === index ? 2 : 0);
      ctx.save();
      ctx.fillStyle = alpha2(node.color, 0.2);
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12 + node.energy * 12;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  function loop(now) {
    const dt = Math.min(48, now - last || 16);
    last = now;
    update(dt, now);
    draw(now);
    raf = requestAnimationFrame(loop);
  }
  resize();
  ro?.observe(host);
  if (options.interactive) {
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
  }
  raf = requestAnimationFrame(loop);
  return {
    pulse: triggerPulse,
    setActivity: (level) => {
      activity = Math.max(0, Math.min(1, level));
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      host.innerHTML = "";
    }
  };
}

// src/ts/core/tokens.ts
var COLOR = {
  ROSSO_CORSA: "--rosso-corsa",
  GIALLO_FERRARI: "--giallo-ferrari",
  VERDE_BANDIERA: "--verde-bandiera",
  NERO_ASSOLUTO: "--nero-assoluto",
  NERO_SOFT: "--nero-soft",
  BIANCO_PURO: "--bianco-puro",
  BIANCO_CALDO: "--bianco-caldo",
  GRIGIO_CHIARO: "--grigio-chiaro",
  GRIGIO_MEDIO: "--grigio-medio",
  GRIGIO_SCURO: "--grigio-scuro",
  SIGNAL_DANGER: "--signal-danger",
  SIGNAL_WARNING: "--signal-warning",
  SIGNAL_SUCCESS: "--signal-success",
  SIGNAL_INFO: "--signal-info",
  CHART_DEFAULT: "--chart-default"
};
var FONT = {
  BODY: "--font-body",
  MONO: "--font-mono",
  DISPLAY: "--font-display"
};
var TEXT_SIZE = {
  NANO: "--text-nano",
  MICRO: "--text-micro",
  SMALL: "--text-small",
  BASE: "--text-base",
  LARGE: "--text-large",
  XL: "--text-xl",
  XXL: "--text-xxl"
};
var SPACE = {
  XXS: "--space-xxs",
  XS: "--space-xs",
  SM: "--space-sm",
  MD: "--space-md",
  LG: "--space-lg",
  XL: "--space-xl",
  XXL: "--space-xxl"
};
var DURATION = {
  FAST: "--duration-fast",
  SM: "--duration-sm",
  MD: "--duration-md",
  LG: "--duration-lg"
};
var EASE = {
  IN: "--ease-in",
  OUT: "--ease-out",
  IN_OUT: "--ease-in-out"
};
var RADIUS = {
  SM: "--radius-sm",
  MD: "--radius-md",
  LG: "--radius-lg",
  FULL: "--radius-full"
};
var SHADOW = {
  SM: "--shadow-sm",
  MD: "--shadow-md",
  LG: "--shadow-lg"
};
var SCOPE_COLOR = {
  LOCAL: "--scope-local",
  TEAM: "--scope-team",
  GLOBAL: "--scope-global"
};
var Z_INDEX = {
  DROPDOWN: "--z-dropdown",
  MODAL: "--z-modal",
  TOAST: "--z-toast",
  TOOLTIP: "--z-tooltip"
};

// src/ts/icons-nav.ts
var navIcons = {
  dashboard: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  home: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
  menu: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  chevronRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronLeft: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  arrowUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  arrowLeft: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  arrowRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  externalLink: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  sidebar: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
  panelRight: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  columns: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  maximize: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  minimize: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  expand: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  collapse: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
};

// src/ts/icons-status.ts
var statusIcons = {
  checkCircle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  alertTriangle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  alertCircle: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  info: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  atRisk: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>',
  completed: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>',
  blocked: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
  loader: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>',
  shield: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  shieldCheck: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>'
};

// src/ts/icons-actions.ts
var actionIcons = {
  refresh: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
  settings: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  close: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  edit: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  copy: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  trash: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  download: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  plus: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  filter: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  sort: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  search: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  sliders: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
  eye: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
};

// src/ts/icons-data.ts
var dataIcons = {
  gauge: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/><path d="M12 12l4-8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  trendUp: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  trendDown: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  barChart: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  toggleOn: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="4" fill="currentColor"/></svg>',
  toggleOff: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="4"/></svg>',
  kpi: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="2" r="1" fill="currentColor"/></svg>',
  impact: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
  pipeline: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><path d="M8 6h1l3 3"/><path d="M15 12h1l3 3"/></svg>',
  orgChart: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="14" x2="5" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="19" y1="14" x2="19" y2="18"/></svg>',
  treeView: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="18" x2="10" y2="18"/><rect x="10" y="3" width="10" height="6" rx="1"/><rect x="10" y="9" width="10" height="6" rx="1"/><rect x="10" y="15" width="10" height="6" rx="1"/></svg>'
};

// src/ts/icons-objects.ts
var objectIcons = {
  user: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  users: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  userGroup: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  briefcase: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
  admin: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  key: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  lock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  unlock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
  bell: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  bellDot: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="18" cy="4" r="3" fill="currentColor" stroke="none"/></svg>',
  mail: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>',
  message: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  calendar: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  link: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  tag: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  star: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  file: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
  folder: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  image: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  clock: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  globe: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  compass: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.15" stroke="currentColor"/></svg>',
  bolt: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  zap: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  command: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>',
  terminal: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  // Generic domain icons (renamed from ISE-specific)
  activity: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  qualityCheck: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  report: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>',
  capacity: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="15" r="1" fill="currentColor"/><rect x="12" y="12" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.3"/></svg>',
  agent: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 15c0 0 1.5 2 3 2s3-2 3-2"/></svg>',
  accelerator: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  deliverable: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  layers: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  experiment: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v7.4a2 2 0 01-.6 1.4L4 17.2a2 2 0 00-.6 1.4V20a1 1 0 001 1h15.2a1 1 0 001-1v-1.4a2 2 0 00-.6-1.4L14.6 11.8a2 2 0 01-.6-1.4V3"/><circle cx="10" cy="16" r="1" fill="currentColor"/><circle cx="14" cy="18" r="1" fill="currentColor"/></svg>',
  mic: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>'
};

// src/ts/icons.ts
var icons = {
  ...navIcons,
  ...statusIcons,
  ...actionIcons,
  ...dataIcons,
  ...objectIcons
};
function renderIcon(target, name, opts) {
  const el4 = typeof target === "string" ? document.querySelector(target) : target;
  if (!el4 || !icons[name]) return;
  const sizeClass = opts?.size ? ` mn-icon--${opts.size}` : "";
  const extraClass = opts?.class ? ` ${opts.class}` : "";
  const svg = icons[name]();
  const ariaAttr = opts?.ariaLabel ? `role="img" aria-label="${opts.ariaLabel}"` : 'aria-hidden="true"';
  const a11ySvg = svg.replace("<svg ", `<svg ${ariaAttr} `);
  el4.innerHTML = `<span class="mn-icon${sizeClass}${extraClass}">${a11ySvg}</span>`;
}
function iconCatalog() {
  return Object.keys(icons);
}

// src/ts/theme-toggle.ts
var ICONS = {
  editorial: "\u25D1",
  nero: "\u25CF",
  avorio: "\u25CB",
  colorblind: "\u25D0"
};
var LABELS = {
  editorial: "Editorial (mixed)",
  nero: "Full Nero",
  avorio: "Full Avorio",
  colorblind: "Colorblind-safe"
};
function initThemeToggle(toggleId, gaugeInstances = [], onAutoContrast) {
  const toggle = document.getElementById(toggleId);
  if (!toggle) {
    return {
      getMode: () => getTheme(),
      setMode: (m) => setTheme(m),
      destroy: () => {
      }
    };
  }
  let current = getTheme();
  toggle.textContent = ICONS[current];
  toggle.title = LABELS[current];
  function applyTheme() {
    toggle.textContent = ICONS[current];
    toggle.title = LABELS[current];
    requestAnimationFrame(() => {
      gaugeInstances.forEach((g) => g.redraw());
      if (onAutoContrast) onAutoContrast(".mn-treemap__cell");
    });
  }
  const onClick = () => {
    current = cycleTheme();
    applyTheme();
  };
  toggle.addEventListener("click", onClick);
  return {
    getMode: () => current,
    setMode: (mode) => {
      current = mode;
      setTheme(mode);
      applyTheme();
    },
    destroy: () => {
      toggle.removeEventListener("click", onClick);
    }
  };
}

// src/ts/toast.ts
function toast(options) {
  const opts = {
    title: "",
    message: "",
    type: "info",
    duration: 4e3,
    container: "mn-toast-container",
    ...options
  };
  let container = document.getElementById(opts.container);
  if (!container) {
    container = document.createElement("div");
    container.id = opts.container;
    container.className = "mn-toast-container";
    document.body.appendChild(container);
  }
  const toastEl = document.createElement("div");
  toastEl.className = `mn-toast mn-toast--${opts.type}`;
  toastEl.setAttribute("role", "alert");
  const msgWrap = document.createElement("div");
  msgWrap.className = "mn-toast__message";
  if (opts.title) {
    const titleEl = document.createElement("div");
    titleEl.className = "mn-toast__title";
    titleEl.textContent = opts.title;
    msgWrap.appendChild(titleEl);
  }
  const textEl = document.createElement("div");
  textEl.className = "mn-toast__text";
  textEl.textContent = opts.message;
  msgWrap.appendChild(textEl);
  toastEl.appendChild(msgWrap);
  const closeBtn = document.createElement("button");
  closeBtn.className = "mn-toast__close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "\u2715";
  toastEl.appendChild(closeBtn);
  function dismiss() {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(100%)";
    setTimeout(() => toastEl.remove(), 300);
  }
  closeBtn.addEventListener("click", dismiss);
  container.appendChild(toastEl);
  if (opts.duration > 0) {
    setTimeout(() => {
      if (toastEl.parentNode) dismiss();
    }, opts.duration);
  }
  return toastEl;
}

// src/ts/modal.ts
function openModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  const modal = backdrop.querySelector(".mn-modal");
  if (!modal) return;
  backdrop.classList.add("mn-modal-backdrop--open");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (first) first.focus();
  function trapFocus(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === "Escape") {
      closeModal(id);
    }
  }
  modal._mnTrapFocus = trapFocus;
  document.addEventListener("keydown", trapFocus);
}
function closeModal(id) {
  const backdrop = document.getElementById(id);
  if (!backdrop) return;
  const modal = backdrop.querySelector(".mn-modal");
  backdrop.classList.remove("mn-modal-backdrop--open");
  if (modal?._mnTrapFocus) {
    document.removeEventListener("keydown", modal._mnTrapFocus);
    delete modal._mnTrapFocus;
  }
}

// src/ts/command-palette.ts
function commandPalette(id) {
  const palette = document.getElementById(id);
  if (!palette) return { open: () => {
  }, close: () => {
  } };
  const input = palette.querySelector(".mn-command-palette__input");
  const items = palette.querySelectorAll(".mn-command-palette__item");
  function open() {
    palette.classList.add("mn-command-palette--open");
    if (input) {
      input.value = "";
      input.focus();
    }
    filterItems("");
  }
  function close() {
    palette.classList.remove("mn-command-palette--open");
  }
  function filterItems(query) {
    const q = query.toLowerCase();
    items.forEach((item) => {
      const text = item.querySelector(".mn-command-palette__item-text");
      const match = !q || (text?.textContent?.toLowerCase().includes(q) ?? false);
      item.style.display = match ? "" : "none";
    });
  }
  if (input) {
    input.addEventListener("input", () => filterItems(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      palette.classList.contains("mn-command-palette--open") ? close() : open();
    }
  });
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.querySelector(".mn-command-palette__item-text");
      eventBus.emit("command-select", { text: text?.textContent ?? "" });
      close();
    });
  });
  return { open, close };
}

// src/ts/login-dom.ts
var STATUS_COLORS = {
  healthy: cssVar("--signal-ok", "#00A651"),
  degraded: cssVar("--signal-warning", "#FFC72C"),
  unhealthy: cssVar("--signal-danger", "#DC0000")
};
var STATUS_LABELS = {
  healthy: "ONLINE",
  degraded: "SLOW",
  unhealthy: "OFFLINE"
};
function arc(cx, cy, r, sa, ea) {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  const large = ea - sa > Math.PI ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
function miniGaugeSVG(status, latencyMs, label) {
  const color = STATUS_COLORS[status] ?? cssVar("--stage-completed", "#6B7280");
  const pct2 = status === "healthy" ? 95 : status === "degraded" ? 55 : 10;
  const sz = 56, cx = sz / 2, cy = sz - 4, r = 22;
  const startAngle = Math.PI, needleAngle = startAngle + clamp(pct2, 0, 100) / 100 * Math.PI;
  let ticks = "";
  for (let i = 0; i <= 6; i++) {
    const a = startAngle + i / 6 * Math.PI;
    const tx1 = cx + Math.cos(a) * (r - 4), ty1 = cy + Math.sin(a) * (r - 4);
    const tx2 = cx + Math.cos(a) * r, ty2 = cy + Math.sin(a) * r;
    ticks += `<line x1="${tx1.toFixed(1)}" y1="${ty1.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
  }
  const nx = cx + Math.cos(needleAngle) * (r - 8);
  const ny = cy + Math.sin(needleAngle) * (r - 8);
  const latencyText = latencyMs != null ? `${latencyMs}ms` : "";
  return `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-label="${label}"><path d="${arc(cx, cy, r, startAngle, 2 * Math.PI)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/><path d="${arc(cx, cy, r, startAngle, needleAngle)}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" style="filter:drop-shadow(0 0 4px ${color}60)"/>` + ticks + `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="1" fill="#111"/>` + (latencyText ? `<text x="${cx}" y="${cy - r - 6}" text-anchor="middle" fill="${color}" font-family="var(--font-mono)" font-size="7" font-weight="600">${latencyText}</text>` : "") + "</svg>";
}
function compassSVG(size) {
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#666"/><stop offset="100%" stop-color="#1a1a1a"/></linearGradient><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFD85C"/><stop offset="50%" stop-color="#FFC72C"/><stop offset="100%" stop-color="#E8A838"/></linearGradient><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></linearGradient><filter id="lg2"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="32" cy="32" r="31" fill="url(#lb)" stroke="#555" stroke-width=".5"/><circle cx="32" cy="32" r="27" fill="#0d0d0d"/><g stroke="url(#lg)" stroke-width="1.5" stroke-linecap="round" filter="url(#lg2)"><line x1="32" y1="6" x2="32" y2="11"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(90,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(180,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(270,32,32)"/></g><g stroke="rgba(255,255,255,.4)" stroke-width="1" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="10" transform="rotate(45,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(135,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(225,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(315,32,32)"/></g><text x="32" y="16" text-anchor="middle" dominant-baseline="middle" fill="#FFC72C" font-family="'Barlow Condensed',sans-serif" font-weight="700" font-size="7" filter="url(#lg2)">N</text><polygon points="32,10 29,32 32,30 35,32" fill="url(#ln)" filter="url(#lg2)"/><polygon points="32,54 29,32 32,34 35,32" fill="#999"/><circle cx="32" cy="32" r="4" fill="url(#lg)" filter="url(#lg2)"/><circle cx="32" cy="32" r="2" fill="#1a1a1a"/></svg>`;
}
function createServiceCard(check) {
  const card = createElement("div", "mn-login__service");
  const gaugeWrap = createElement("div", "mn-login__service-gauge");
  gaugeWrap.innerHTML = miniGaugeSVG(check.status, check.latency_ms, check.name);
  const info = createElement("div", "mn-login__service-info");
  const name = createElement("div", "mn-login__service-name", { text: check.name.toUpperCase() });
  const statusEl = createElement("div", `mn-login__service-status mn-login__service-status--${check.status}`, {
    text: STATUS_LABELS[check.status] ?? check.status
  });
  info.appendChild(name);
  info.appendChild(statusEl);
  card.appendChild(gaugeWrap);
  card.appendChild(info);
  return card;
}

// src/ts/login.ts
function render(container, state, opts) {
  container.innerHTML = "";
  const root = createElement("div", "mn-login");
  root.appendChild(createElement("div", "mn-login__glow"));
  const card = createElement("div", "mn-login__card");
  const logoWrap = createElement("div", "mn-login__logo");
  logoWrap.innerHTML = compassSVG(80);
  card.appendChild(logoWrap);
  const title = createElement("h1", "mn-login__title", { text: opts.appTitle ?? "Maranello" });
  title.appendChild(createElement("span", "mn-login__title-accent", { text: opts.appTitleAccent ?? "Luce" }));
  card.appendChild(title);
  card.appendChild(createElement("p", "mn-login__subtitle", {
    text: state.subtitle ?? "Design System"
  }));
  const btn = createElement("button", "mn-login__btn");
  btn.type = "button";
  btn.appendChild(createElement("span", "", { text: opts.buttonLabel ?? "Sign in with SSO" }));
  if (state.onLogin) btn.addEventListener("click", state.onLogin);
  card.appendChild(btn);
  if (state.error) {
    card.appendChild(createElement("div", "mn-login__error", { text: state.error }));
    const errorEl = card.lastElementChild;
    errorEl.setAttribute("role", "alert");
  }
  const statusSection = createElement("div", "mn-login__status");
  statusSection.appendChild(createElement("div", "mn-login__status-title", { text: "SYSTEM STATUS" }));
  const gaugeRow = createElement("div", "mn-login__status-gauges");
  if (state.checks?.length) {
    state.checks.forEach((c) => gaugeRow.appendChild(createServiceCard(c)));
  } else {
    ["Database", "Cache", "API"].forEach((name) => {
      gaugeRow.appendChild(createServiceCard({ name, status: "healthy", latency_ms: null }));
    });
  }
  statusSection.appendChild(gaugeRow);
  let overall = "healthy";
  if (state.checks) {
    for (const c of state.checks) {
      if (c.status === "unhealthy") {
        overall = "unhealthy";
        break;
      }
      if (c.status === "degraded" && overall !== "unhealthy") overall = "degraded";
    }
  }
  statusSection.appendChild(createElement("div", `mn-login__overall mn-login__overall--${overall}`, {
    text: overall === "healthy" ? "All systems operational" : overall === "degraded" ? "Some services degraded" : "Service disruption detected"
  }));
  card.appendChild(statusSection);
  const footer = createElement("div", "mn-login__footer");
  footer.appendChild(createElement("span", "mn-login__version", { text: state.version ?? "" }));
  const envValue = state.env ?? "production";
  footer.appendChild(createElement("span", `mn-login__env mn-login__env--${envValue}`, {
    text: state.env ?? "Production"
  }));
  card.appendChild(footer);
  root.appendChild(card);
  container.appendChild(root);
}
function loginScreen(container, opts) {
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  const options = opts ?? {};
  const state = {
    subtitle: options.subtitle,
    version: options.version,
    env: options.env,
    error: options.error ?? null,
    checks: options.checks ?? null,
    onLogin: options.onLogin ?? null
  };
  render(host, state, options);
  let disposed = false;
  let pollTimer = null;
  function fetchHealth() {
    if (disposed) return;
    const url = options.healthUrl ?? "/api/health/deep";
    fetch(url, { credentials: "same-origin" }).then((r) => r.ok ? r.json() : Promise.resolve(null)).then((data) => {
      if (data?.checks) {
        state.checks = data.checks;
        render(host, state, options);
      }
    }).catch(() => {
    });
  }
  if (options.autoHealth !== false && typeof fetch !== "undefined") {
    fetchHealth();
    pollTimer = setInterval(fetchHealth, options.pollInterval ?? 3e4);
  }
  return {
    updateStatus(healthData) {
      if (disposed) return;
      if (healthData?.checks) state.checks = healthData.checks;
      if (healthData?.error) state.error = healthData.error;
      render(host, state, options);
    },
    setError(msg) {
      if (disposed) return;
      state.error = msg;
      render(host, state, options);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      if (pollTimer) clearInterval(pollTimer);
      host.innerHTML = "";
    }
  };
}

// src/ts/ai-chat-dom.ts
var ICON_SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/><path d="M18 14l1 3.5L22.5 18l-3.5 1L18 22.5l-1-3.5L13.5 18l3.5-1L18 14z" opacity=".6"/></svg>';
var FALLBACK_ICONS = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>',
  expandHorizontal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8 3 3 8 3"/><line x1="3" y1="3" x2="10" y2="10"/><polyline points="21 16 21 21 16 21"/><line x1="14" y1="14" x2="21" y2="21"/><polyline points="16 3 21 3 21 8"/><line x1="14" y1="10" x2="21" y2="3"/><polyline points="8 21 3 21 3 16"/><line x1="10" y1="14" x2="3" y2="21"/></svg>'
};
function getIcon(name) {
  if (icons[name]) return icons[name]();
  return FALLBACK_ICONS[name] ?? "";
}
function el(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
  }
  return e;
}
function formatTime(date) {
  const h = date.getHours(), m = date.getMinutes();
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`;
}
function renderContent(text) {
  const container = document.createDocumentFragment();
  const parts = text.split(/(```[\s\S]*?```)/g);
  for (const part of parts) {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w*\n/, "");
      const block = el("div", "mn-chat-msg__code");
      const pre = el("pre", "");
      pre.textContent = code;
      block.appendChild(pre);
      const copyBtn = el("button", "mn-chat-msg__copy", { "aria-label": "Copy code" });
      copyBtn.innerHTML = getIcon("copy");
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = getIcon("checkCircle");
          setTimeout(() => {
            copyBtn.innerHTML = getIcon("copy");
          }, 1500);
        });
      });
      block.appendChild(copyBtn);
      container.appendChild(block);
    } else if (part) {
      const span = el("span", "");
      span.innerHTML = part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/`([^`]+)`/g, '<code class="mn-chat-msg__code">$1</code>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
      container.appendChild(span);
    }
  }
  return container;
}
function buildUI(container, opts) {
  const state = {
    isOpen: false,
    isTyping: false,
    messages: [],
    panelHeight: 520,
    isListening: false,
    panelWidthMode: "normal",
    isAgentGridOpen: false,
    activeAgentId: opts.activeAgent ?? (opts.agents?.[0]?.id ?? null)
  };
  const fab = el("button", "mn-chat-fab", { "aria-label": "Open AI assistant", title: "AI Assistant" });
  if (opts.avatar) {
    const fabImg = document.createElement("img");
    fabImg.src = opts.avatar;
    fabImg.className = "mn-chat-fab__avatar";
    fabImg.alt = "AI";
    fab.appendChild(fabImg);
  } else {
    fab.innerHTML = ICON_SPARK;
  }
  const pulse = el("span", "mn-chat-fab__pulse");
  fab.appendChild(pulse);
  container.appendChild(fab);
  const panel = el("div", "mn-chat-panel", { role: "dialog", "aria-label": "AI assistant chat" });
  panel.appendChild(el("div", "mn-chat-panel__accent"));
  const resizeHandle = el("div", "mn-chat-panel__resize");
  panel.appendChild(resizeHandle);
  const header = el("div", "mn-chat-panel__header");
  const headerLeft = el("div", "mn-chat-panel__header-left");
  if (opts.avatar) {
    const ha = el("img", "mn-chat-panel__header-avatar");
    ha.src = opts.avatar;
    ha.alt = "";
    headerLeft.appendChild(ha);
  }
  const titleEl = el("span", "mn-chat-panel__title", { text: opts.avatar ? "" : opts.title ?? "" });
  const agentSelector = el("button", "mn-chat-agent-selector", { type: "button", "aria-label": "Select AI agent" });
  const agentSelectorLabel = el("span", "mn-chat-agent-selector__label");
  agentSelector.appendChild(agentSelectorLabel);
  agentSelector.appendChild(el("span", "mn-chat-agent-selector__chevron", { html: getIcon("chevronDown") }));
  const headerActions = el("div", "mn-chat-panel__header-actions");
  const closeBtn = el("button", "mn-chat-panel__close", { "aria-label": "Close chat" });
  closeBtn.innerHTML = getIcon("close");
  const widthBtn = el("button", "mn-chat-panel__resize", { "aria-label": "Toggle panel width" });
  widthBtn.innerHTML = getIcon("expandHorizontal");
  headerActions.appendChild(widthBtn);
  headerActions.appendChild(closeBtn);
  headerLeft.appendChild(titleEl);
  if (opts.agents?.length) headerLeft.appendChild(agentSelector);
  header.appendChild(headerLeft);
  header.appendChild(headerActions);
  panel.appendChild(header);
  const agentGrid = el("div", "mn-chat-agent-grid", { "aria-hidden": "true" });
  panel.appendChild(agentGrid);
  const messagesEl = el("div", "mn-chat-panel__messages");
  panel.appendChild(messagesEl);
  const typingEl = el("div", "mn-chat-typing");
  typingEl.style.display = "none";
  for (let d = 0; d < 3; d++) typingEl.appendChild(el("span", "mn-chat-typing__dot"));
  messagesEl.appendChild(typingEl);
  const quickBar = el("div", "mn-chat-panel__quick");
  panel.appendChild(quickBar);
  const inputArea = el("div", "mn-chat-panel__input-area");
  const inputEl = el("textarea", "mn-chat-panel__input", { placeholder: opts.placeholder ?? "", rows: "1" });
  const sendBtn = el("button", "mn-chat-panel__send", { "aria-label": "Send message" });
  sendBtn.innerHTML = getIcon("arrowUp");
  const voiceBtn = el("button", "mn-chat-voice", { "aria-label": "Toggle voice input" });
  voiceBtn.innerHTML = getIcon("mic");
  inputArea.appendChild(inputEl);
  inputArea.appendChild(voiceBtn);
  inputArea.appendChild(sendBtn);
  panel.appendChild(inputArea);
  container.appendChild(panel);
  return {
    state,
    fab,
    pulse,
    panel,
    resizeHandle,
    closeBtn,
    widthBtn,
    agentSelector,
    agentSelectorLabel,
    agentGrid,
    messagesEl,
    typingEl,
    quickBar,
    inputEl,
    sendBtn,
    voiceBtn
  };
}

// src/ts/ai-chat-messages.ts
function initMessages(state, els, opts) {
  const { messages } = state;
  const { messagesEl, typingEl, inputEl, sendBtn, voiceBtn, quickBar } = els;
  const { agentSelector, agentSelectorLabel, agentGrid } = els;
  function addMessage(role, content) {
    const msg = { role, content, time: /* @__PURE__ */ new Date() };
    messages.push(msg);
    renderMessage(msg);
    scrollToBottom();
    return msg;
  }
  function renderMessage(msg) {
    const wrap = el("div", `mn-chat-msg mn-chat-msg--${msg.role}`);
    if (msg.role === "ai") {
      const iconWrap = el("span", "mn-chat-msg__icon");
      iconWrap.innerHTML = ICON_SPARK;
      const body = el("div", "mn-chat-msg__body");
      body.appendChild(iconWrap);
      const contentEl = el("span", "mn-chat-msg__content");
      contentEl.appendChild(renderContent(msg.content));
      body.appendChild(contentEl);
      wrap.appendChild(body);
    } else {
      if (opts.avatar) {
        const body = el("div", "mn-chat-msg__body");
        const contentEl = el("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        body.appendChild(contentEl);
        body.appendChild(el("img", "mn-chat-msg__avatar", { src: opts.avatar ?? "", alt: "You" }));
        wrap.appendChild(body);
      } else {
        const contentEl = el("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        wrap.appendChild(contentEl);
      }
    }
    wrap.appendChild(el("div", "mn-chat-msg__time", { text: formatTime(msg.time) }));
    messagesEl.insertBefore(wrap, typingEl);
    return wrap;
  }
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }
  function setTyping(show) {
    state.isTyping = show;
    typingEl.style.display = show ? "flex" : "none";
    if (show) scrollToBottom();
  }
  function resetInputHeight() {
    inputEl.style.height = "auto";
    inputEl.rows = 1;
  }
  function autoResize() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + "px";
  }
  function updateSendVisibility() {
    sendBtn.classList.toggle("mn-chat-panel__send--visible", inputEl.value.trim().length > 0);
  }
  function handleResult(result) {
    if (!result) return;
    if (typeof result.then === "function") {
      result.then((r) => {
        setTyping(false);
        if (r) addMessage("ai", typeof r === "string" ? r : r.content ?? String(r));
      }).catch((e) => {
        setTyping(false);
        addMessage("ai", `Error: ${e.message ?? String(e)}`);
      });
    } else {
      setTyping(false);
      const r = result;
      addMessage("ai", typeof r === "string" ? r : r.content ?? String(r));
    }
  }
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage("user", text);
    inputEl.value = "";
    resetInputHeight();
    updateSendVisibility();
    if (opts.onSend) {
      setTyping(true);
      handleResult(opts.onSend(text));
    }
  }
  function handleQuickAction(action) {
    if (!opts.onQuickAction) return;
    let lastAi = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "ai") {
        lastAi = messages[i].content;
        break;
      }
    }
    addMessage("user", action);
    setTyping(true);
    handleResult(opts.onQuickAction(action, lastAi));
  }
  function getActiveAgent() {
    const agents = opts.agents ?? [];
    for (const agent of agents) {
      if (agent.id === state.activeAgentId) return agent;
    }
    return agents[0] ?? null;
  }
  function updateAgentSelectorLabel() {
    const active = getActiveAgent();
    agentSelectorLabel.textContent = active ? active.label : "Select Agent";
  }
  function renderAgentGrid() {
    const agents = opts.agents ?? [];
    if (!agents.length) return;
    agentGrid.innerHTML = "";
    for (const agent of agents) {
      const card = el("button", "mn-chat-agent-card", { type: "button" });
      if (agent.id === state.activeAgentId) card.classList.add("mn-chat-agent-card--active");
      const iconEl = el("span", "mn-chat-agent-card__icon");
      if (agent.icon && /<svg/i.test(agent.icon)) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(agent.icon, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (svg && !doc.querySelector("parsererror")) iconEl.appendChild(svg);
        else iconEl.textContent = "\u{1F916}";
      } else iconEl.textContent = agent.icon ?? "\u{1F916}";
      card.appendChild(iconEl);
      card.appendChild(el("span", "mn-chat-agent-card__label", { text: agent.label ?? agent.id }));
      card.addEventListener("click", () => {
        state.activeAgentId = agent.id;
        updateAgentSelectorLabel();
        renderAgentGrid();
        toggleAgentGrid(false);
        if (typeof opts.onAgentChange === "function") opts.onAgentChange(agent.id, agent);
      });
      agentGrid.appendChild(card);
    }
  }
  function toggleAgentGrid(forceState) {
    if (!(opts.agents ?? []).length) return;
    state.isAgentGridOpen = typeof forceState === "boolean" ? forceState : !state.isAgentGridOpen;
    agentGrid.classList.toggle("mn-chat-agent-grid--open", state.isAgentGridOpen);
    agentSelector.classList.toggle("mn-chat-agent-selector--open", state.isAgentGridOpen);
    agentGrid.setAttribute("aria-hidden", state.isAgentGridOpen ? "false" : "true");
  }
  function cyclePanelWidth() {
    const next = state.panelWidthMode === "normal" ? "wide" : state.panelWidthMode === "wide" ? "full" : "normal";
    state.panelWidthMode = next;
    els.panel.classList.toggle("mn-chat-panel--wide", next === "wide");
    els.panel.classList.toggle("mn-chat-panel--full", next === "full");
  }
  function toggleVoice() {
    state.isListening = !state.isListening;
    voiceBtn.classList.toggle("mn-chat-voice--active", state.isListening);
    if (typeof opts.onVoice === "function") opts.onVoice(state.isListening);
  }
  function clear() {
    state.messages.length = 0;
    messagesEl.querySelectorAll(".mn-chat-msg").forEach((n) => n.remove());
    setTyping(false);
  }
  for (const action of opts.quickActions ?? []) {
    const btn = el("button", "mn-chat-panel__quick-btn", { text: action });
    btn.addEventListener("click", () => handleQuickAction(action));
    quickBar.appendChild(btn);
  }
  if ((opts.agents ?? []).length) {
    updateAgentSelectorLabel();
    renderAgentGrid();
    agentSelector.addEventListener("click", () => toggleAgentGrid());
  }
  inputEl.addEventListener("input", () => {
    autoResize();
    updateSendVisibility();
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener("click", sendMessage);
  voiceBtn.addEventListener("click", toggleVoice);
  els.widthBtn.addEventListener("click", cyclePanelWidth);
  state.addMessage = addMessage;
  state.setTyping = setTyping;
  state.clear = clear;
  state.toggleAgentGrid = toggleAgentGrid;
  state.onDocumentClick = (e) => {
    if (!state.isAgentGridOpen) return;
    if (!(e.target instanceof Node) || !els.panel.contains(e.target)) return;
    if (agentSelector.contains(e.target) || agentGrid.contains(e.target)) return;
    toggleAgentGrid(false);
  };
}

// src/ts/system-status.ts
function statusClass(ok, ms) {
  if (!ok) return "danger";
  if (ms > 1e3) return "warning";
  return "active";
}
function overallStatus(results) {
  if (results.some((r) => !r.ok)) return { label: "Degraded Performance", cls: "danger" };
  if (results.some((r) => r.ms > 1e3)) return { label: "Partial Degradation", cls: "warning" };
  return { label: "All Systems Operational", cls: "active" };
}
function systemStatus(container, opts) {
  const options = {
    version: "",
    environment: "",
    services: [],
    pollInterval: 3e4,
    onClick: void 0,
    ...opts
  };
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  host.innerHTML = "";
  host.classList.add("mn-sys-status");
  const pill = createElement("button", "mn-sys-status__pill", {
    "aria-label": "System status",
    "aria-expanded": "false"
  });
  const dot = createElement("span", "mn-sys-status__dot mn-sys-status__dot--active");
  const verSpan = createElement("span", "mn-sys-status__version", { text: options.version });
  const envSpan = createElement("span", "mn-sys-status__env", { text: options.environment });
  pill.appendChild(dot);
  pill.appendChild(verSpan);
  if (options.environment) {
    pill.appendChild(document.createTextNode(" \xB7 "));
    pill.appendChild(envSpan);
  }
  host.appendChild(pill);
  const panel = createElement("div", "mn-sys-status__panel", { role: "status", "aria-live": "polite" });
  const headerRow = createElement("div", "mn-sys-status__header");
  const headerDot = createElement("span", "mn-sys-status__dot mn-sys-status__dot--active");
  const headerLabel = createElement("span", "mn-sys-status__header-label", { text: "Checking\u2026" });
  headerRow.appendChild(headerDot);
  headerRow.appendChild(headerLabel);
  panel.appendChild(headerRow);
  const serviceList = createElement("div", "mn-sys-status__services");
  panel.appendChild(serviceList);
  host.appendChild(panel);
  let isOpen = false;
  let results = [];
  let pollTimer = null;
  pill.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-sys-status__panel--open", isOpen);
    pill.setAttribute("aria-expanded", String(isOpen));
    if (isOpen && results.length === 0) void refresh();
  });
  function onDocClick2(e) {
    const target = e.target;
    if (target && isOpen && !host.contains(target)) {
      isOpen = false;
      panel.classList.remove("mn-sys-status__panel--open");
      pill.setAttribute("aria-expanded", "false");
    }
  }
  function onDocKey2(e) {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      panel.classList.remove("mn-sys-status__panel--open");
      pill.setAttribute("aria-expanded", "false");
    }
  }
  document.addEventListener("click", onDocClick2);
  document.addEventListener("keydown", onDocKey2);
  function renderResults() {
    serviceList.innerHTML = "";
    results.forEach((r, i) => {
      const row = createElement("div", "mn-sys-status__service");
      row.appendChild(createElement("span", `mn-sys-status__dot mn-sys-status__dot--${statusClass(r.ok, r.ms)}`));
      row.appendChild(createElement("span", "mn-sys-status__service-name", { text: r.name }));
      const sMs = createElement("span", "mn-sys-status__service-ms", { text: r.ok ? `${r.ms}ms` : "DOWN" });
      if (!r.ok) sMs.classList.add("mn-sys-status__service-ms--down");
      row.appendChild(sMs);
      if (options.onClick) {
        row.style.cursor = "pointer";
        row.addEventListener("click", () => options.onClick?.(options.services[i], r));
      }
      serviceList.appendChild(row);
    });
    const overall = overallStatus(results);
    headerDot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
    headerLabel.textContent = overall.label;
    dot.className = `mn-sys-status__dot mn-sys-status__dot--${overall.cls}`;
  }
  async function refresh() {
    headerLabel.textContent = "Checking\u2026";
    results = await Promise.all(
      options.services.map(async (svc) => {
        const start = performance.now();
        try {
          if (svc.check) {
            const res = await svc.check();
            return { name: svc.name, ok: res.ok !== false, ms: Math.round(res.ms ?? performance.now() - start) };
          }
          await new Promise((r) => setTimeout(r, 50 + Math.random() * 300));
          return { name: svc.name, ok: true, ms: Math.round(performance.now() - start) };
        } catch {
          return { name: svc.name, ok: false, ms: Math.round(performance.now() - start) };
        }
      })
    );
    renderResults();
  }
  if (options.pollInterval > 0) {
    pollTimer = setInterval(() => void refresh(), options.pollInterval);
  }
  void refresh();
  return {
    refresh,
    destroy() {
      if (pollTimer) clearInterval(pollTimer);
      document.removeEventListener("click", onDocClick2);
      document.removeEventListener("keydown", onDocKey2);
      host.innerHTML = "";
      host.classList.remove("mn-sys-status");
    }
  };
}

// src/ts/profile-menu-dom.ts
function getIcon3(name) {
  if (icons[name]) return icons[name]();
  return "";
}
function initials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}
function buildAvatarSpan(cls, name, url) {
  const el4 = document.createElement("span");
  el4.className = cls;
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = name || "User avatar";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%";
    img.onerror = () => {
      img.remove();
      el4.textContent = initials(name);
    };
    el4.appendChild(img);
  } else {
    el4.textContent = initials(name);
  }
  return el4;
}
function buildTriggerAvatar(name, url) {
  return buildAvatarSpan("mn-profile-trigger__avatar", name, url);
}
function buildLargeAvatar(name, url) {
  return buildAvatarSpan("mn-profile-dropdown__avatar-lg", name, url);
}
function buildDropdown(opts, closeFn) {
  const itemEls = [];
  const dd = document.createElement("div");
  dd.className = "mn-profile-dropdown";
  dd.setAttribute("role", "menu");
  dd.setAttribute("aria-label", "User menu");
  const header = document.createElement("div");
  header.className = "mn-profile-dropdown__header";
  header.appendChild(buildLargeAvatar(opts.name, opts.avatarUrl));
  const info = document.createElement("div");
  info.className = "mn-profile-dropdown__info";
  const nameEl = document.createElement("div");
  nameEl.className = "mn-profile-dropdown__name";
  nameEl.textContent = opts.name || "User";
  info.appendChild(nameEl);
  if (opts.email) {
    const emailEl = document.createElement("div");
    emailEl.className = "mn-profile-dropdown__email";
    emailEl.textContent = opts.email;
    info.appendChild(emailEl);
  }
  header.appendChild(info);
  dd.appendChild(header);
  for (const section of opts.sections) {
    if (section.divider) {
      dd.appendChild(document.createElement("div")).className = "mn-profile-dropdown__divider";
      continue;
    }
    const sectionEl = document.createElement("div");
    sectionEl.className = "mn-profile-dropdown__section";
    if (section.title) {
      const titleEl = document.createElement("div");
      titleEl.className = "mn-profile-dropdown__section-title";
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);
    }
    for (const item of section.items ?? []) {
      const row = document.createElement("div");
      row.className = "mn-profile-dropdown__item";
      if (item.variant === "danger") row.classList.add("mn-profile-dropdown__item--danger");
      row.setAttribute("role", "menuitem");
      row.setAttribute("tabindex", "-1");
      if (item.icon) {
        const ic = document.createElement("span");
        ic.className = "mn-profile-dropdown__item-icon";
        ic.innerHTML = getIcon3(item.icon);
        row.appendChild(ic);
      }
      row.appendChild(document.createTextNode(item.label ?? ""));
      if (item.badge != null && Number(item.badge) > 0) {
        const badge = document.createElement("span");
        badge.className = "mn-profile-dropdown__item-badge";
        badge.textContent = Number(item.badge) > 99 ? "99+" : String(item.badge);
        row.appendChild(badge);
      }
      row.addEventListener("click", () => {
        if (typeof item.action === "function") item.action();
        closeFn();
      });
      sectionEl.appendChild(row);
      itemEls.push(row);
    }
    dd.appendChild(sectionEl);
  }
  return { el: dd, itemEls };
}

// src/ts/profile-menu.ts
function profileMenu(trigger, options) {
  const opts = {
    name: "",
    email: "",
    avatarUrl: null,
    sections: [],
    ...options
  };
  let dropdown = null;
  let isOpen = false;
  let focusIdx = -1;
  let itemEls = [];
  const btn = document.createElement("button");
  btn.className = "mn-profile-trigger";
  btn.type = "button";
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");
  btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
  trigger.appendChild(btn);
  function positionDropdown() {
    if (!dropdown) return;
    const rect = btn.getBoundingClientRect();
    dropdown.style.position = "fixed";
    dropdown.style.top = `${rect.bottom + 4}px`;
    const menuWidth = dropdown.offsetWidth || 260;
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
    dropdown.style.left = `${left}px`;
    const ddRect = dropdown.getBoundingClientRect();
    if (ddRect.bottom > window.innerHeight - 8) {
      dropdown.style.top = `${rect.top - ddRect.height - 4}px`;
    }
  }
  function setFocus(idx) {
    if (!itemEls.length) return;
    focusIdx = (idx % itemEls.length + itemEls.length) % itemEls.length;
    itemEls.forEach((el4, i) => el4.classList.toggle("mn-profile-dropdown__item--focused", i === focusIdx));
    itemEls[focusIdx].focus();
  }
  function onKeyDown(e) {
    if (!isOpen) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        btn.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocus(focusIdx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocus(focusIdx - 1);
        break;
      case "Enter":
      case " ":
        if (focusIdx >= 0 && itemEls[focusIdx]) {
          e.preventDefault();
          itemEls[focusIdx].click();
        }
        break;
      case "Tab":
        close();
        break;
    }
  }
  function open() {
    if (isOpen) return;
    isOpen = true;
    focusIdx = -1;
    const result = buildDropdown(opts, close);
    dropdown = result.el;
    itemEls = result.itemEls;
    document.body.appendChild(dropdown);
    positionDropdown();
    btn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      dropdown?.classList.add("mn-profile-dropdown--open");
    });
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onOutsideClick, true);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("mousedown", onOutsideClick, true);
    if (dropdown) {
      dropdown.classList.remove("mn-profile-dropdown--open");
      const dd = dropdown;
      setTimeout(() => {
        dd.parentNode?.removeChild(dd);
      }, 180);
      dropdown = null;
    }
    itemEls = [];
  }
  function onOutsideClick(e) {
    const target = e.target;
    if (target && dropdown && !dropdown.contains(target) && !btn.contains(target)) close();
  }
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? close() : open();
  });
  function onResize() {
    if (isOpen) positionDropdown();
  }
  window.addEventListener("resize", onResize);
  const setUser = ((uOrName, email, avatarUrl) => {
    if (typeof uOrName === "string") {
      opts.name = uOrName;
      opts.email = email ?? "";
      opts.avatarUrl = avatarUrl ?? null;
    } else {
      Object.assign(opts, uOrName);
    }
    btn.innerHTML = "";
    btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
    if (isOpen) {
      close();
      open();
    }
  });
  return {
    open,
    close,
    setUser,
    destroy() {
      close();
      window.removeEventListener("resize", onResize);
      btn.parentNode?.removeChild(btn);
    }
  };
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
  if (!data || data.length < 2) return void 0;
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const pad2 = 2;
  const getX = (i) => pad2 + i / (data.length - 1) * (w - pad2 * 2);
  const getY = (v) => h - pad2 - (v - mn) / range * (h - pad2 * 2);
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
  const ctx = chartHiDpi(canvas, s, s);
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
  const ctx = chartHiDpi(canvas, w, h);
  const cx = w / 2;
  const cy = h - 10;
  const radius = Math.min(w / 2, h) - 16;
  const lineW = radius * o.thickness;
  const startA = Math.PI;
  const endA = Math.PI * 2;
  const pct2 = Math.max(0, Math.min(1, (o.value - o.min) / (o.max - o.min)));
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startA, endA);
  ctx.strokeStyle = o.trackColor;
  ctx.lineWidth = lineW;
  ctx.lineCap = "round";
  ctx.stroke();
  if (pct2 > 0) {
    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    o.colors.forEach((c) => {
      grad.addColorStop(c.stop, c.color);
    });
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startA, startA + pct2 * Math.PI);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.shadowColor = o.colors[Math.floor(pct2 * (o.colors.length - 1))].color;
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
  if (!data || data.length === 0) return void 0;
  const maxVal = o.maxY ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const pad2 = { top: 8, bottom: o.showLabels ? 22 : 8, left: 8, right: 8 };
  const chartW = w - pad2.left - pad2.right;
  const chartH = h - pad2.top - pad2.bottom;
  const barW = chartW / data.length * (1 - o.gap);
  const gapW = chartW / data.length * o.gap;
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let g = 0; g <= 4; g++) {
    const gy = pad2.top + g / 4 * chartH;
    ctx.beginPath();
    ctx.moveTo(pad2.left, gy);
    ctx.lineTo(w - pad2.right, gy);
    ctx.stroke();
  }
  data.forEach((d, i) => {
    const x = pad2.left + i * (barW + gapW) + gapW / 2;
    const barH = d.value / maxVal * chartH;
    const y = pad2.top + chartH - barH;
    const color = d.color || o.colors[i % o.colors.length];
    ctx.beginPath();
    ctx.moveTo(x, y + o.barRadius);
    ctx.arcTo(x, y, x + o.barRadius, y, o.barRadius);
    ctx.arcTo(x + barW, y, x + barW, y + o.barRadius, o.barRadius);
    ctx.lineTo(x + barW, pad2.top + chartH);
    ctx.lineTo(x, pad2.top + chartH);
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
  if (!data || data.length < 2) return void 0;
  const maxVal = o.maxY ?? Math.max(...data) * 1.1;
  const pad2 = { top: 4, right: 4, bottom: 2, left: 2 };
  const gx = (i) => pad2.left + i / (data.length - 1) * (w - pad2.left - pad2.right);
  const gy = (v) => h - pad2.bottom - v / maxVal * (h - pad2.top - pad2.bottom);
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= o.gridRows; r++) {
    const yy = pad2.top + r / o.gridRows * (h - pad2.top - pad2.bottom);
    ctx.beginPath();
    ctx.moveTo(pad2.left, yy);
    ctx.lineTo(w - pad2.right, yy);
    ctx.stroke();
  }
  if (o.showRedLine && o.redLineValue !== null) {
    ctx.strokeStyle = cssVar("--signal-danger", "#DC0000");
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    const rl = gy(o.redLineValue);
    ctx.moveTo(pad2.left, rl);
    ctx.lineTo(w - pad2.right, rl);
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
  if (!datasets || datasets.length === 0) return void 0;
  let allVals = [];
  datasets.forEach((ds) => {
    allVals = allVals.concat(ds.data);
  });
  const maxVal = o.maxY ?? Math.max(...allVals) * 1.15;
  const maxLen = Math.max(...datasets.map((ds) => ds.data.length));
  const pad2 = { top: 8, bottom: 8, left: 8, right: 8 };
  const gx = (i) => pad2.left + i / (maxLen - 1) * (w - pad2.left - pad2.right);
  const gy = (v) => h - pad2.bottom - v / maxVal * (h - pad2.top - pad2.bottom);
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= o.gridRows; r++) {
    const yy = pad2.top + r / o.gridRows * (h - pad2.top - pad2.bottom);
    ctx.beginPath();
    ctx.moveTo(pad2.left, yy);
    ctx.lineTo(w - pad2.right, yy);
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
    ctx.lineTo(gx(data.length - 1), h - pad2.bottom);
    ctx.lineTo(gx(0), h - pad2.bottom);
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
  const radius = (o.size - o.thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct2 = Math.max(0, Math.min(1, o.value / o.max));
  const offset = circumference * (1 - pct2);
  const half = o.size / 2;
  container.innerHTML = `<svg width="${o.size}" height="${o.size}" viewBox="0 0 ${o.size} ${o.size}"><circle class="mn-progress-ring__track" cx="${half}" cy="${half}" r="${radius}" stroke-width="${o.thickness}"/><circle class="mn-progress-ring__fill" cx="${half}" cy="${half}" r="${radius}" stroke-width="${o.thickness}" stroke="${o.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${o.animate ? circumference : offset}"/></svg>`;
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
  function buildDOM2(valueStr) {
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
      buildDOM2(valueStr);
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
  buildDOM2(formatValue(currentValue));
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
  if (!data || data.length === 0) return void 0;
  const pad2 = { top: 12, bottom: 12, left: 12, right: 12 };
  const maxX = Math.max(...data.map((d) => d.x)) * 1.1;
  const maxY = o.maxY ?? Math.max(...data.map((d) => d.y)) * 1.1;
  const maxZ = Math.max(...data.map((d) => d.z ?? 1));
  const gx = (v) => pad2.left + v / maxX * (w - pad2.left - pad2.right);
  const gy = (v) => h - pad2.bottom - v / maxY * (h - pad2.top - pad2.bottom);
  const gr = (v) => Math.max(4, v / maxZ * o.maxBubbleRadius);
  ctx.strokeStyle = o.gridColor;
  ctx.lineWidth = 0.5;
  for (let r = 0; r <= 4; r++) {
    const yy = pad2.top + r / 4 * (h - pad2.top - pad2.bottom);
    ctx.beginPath();
    ctx.moveTo(pad2.left, yy);
    ctx.lineTo(w - pad2.right, yy);
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
  const el4 = document.createElement(tag);
  if (cls) el4.className = cls;
  if (text != null) el4.textContent = text;
  return el4;
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
  if (!root) return null;
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
  function addListener2(el4, evt, handler) {
    el4.addEventListener(evt, handler);
    state.listeners.push({ el: el4, evt, handler });
  }
  function cleanupTimers2() {
    while (state.timers.length) {
      const t = state.timers.pop();
      if (t != null) window.clearTimeout(t);
    }
  }
  function showTip4(text, evt) {
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
  function render3() {
    if (state.disposed) return;
    cleanupTimers2();
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
    host.setAttribute("role", "img");
    host.setAttribute("aria-label", state.opts.title || "Horizontal bar chart");
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
      const pct2 = clampVal(bar.value / maxValue * 100, 0, 100);
      const txtColor = hexLum(bar.color) > 0.55 ? "#111111" : "#FFFFFF";
      fill.style.background = bar.color;
      fill.style.height = (state.opts.barHeight || 28) + "px";
      fill.style.width = state.opts.animate ? "0%" : pct2 + "%";
      valueEl.style.color = txtColor;
      valueEl.textContent = bar.value + (state.opts.unit || "");
      valueEl.style.display = state.opts.showValues ? "" : "none";
      fill.appendChild(valueEl);
      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      rowsLayer.appendChild(row);
      const tipText = bar.label + ": " + bar.value + (state.opts.unit || "");
      addListener2(row, "mouseenter", (evt) => showTip4(tipText, evt));
      addListener2(row, "mousemove", (evt) => showTip4(tipText, evt));
      addListener2(row, "mouseleave", () => tooltip.classList.remove("is-visible"));
      addListener2(row, "click", () => {
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
          fill.style.width = pct2 + "%";
        }, index * 50);
        state.timers.push(t);
      }
    });
  }
  render3();
  return {
    update(newBars) {
      if (state.disposed) return;
      state.opts.bars = Array.isArray(newBars) ? newBars.slice() : [];
      state.activeIndex = -1;
      render3();
    },
    destroy() {
      if (state.disposed) return;
      state.disposed = true;
      cleanupTimers2();
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
  const el4 = document.createElement("div");
  el4.className = "mn-chart-tooltip";
  el4.setAttribute("role", "tooltip");
  el4.setAttribute("aria-hidden", "true");
  document.body.appendChild(el4);
  activeTooltip = el4;
  return el4;
}
function positionTooltip(tip, x, y) {
  const pad2 = 12, rect = tip.getBoundingClientRect();
  let left = x + pad2, top = y - rect.height - pad2;
  if (left + rect.width > window.innerWidth - 10) left = x - rect.width - pad2;
  if (top < 10) top = y + pad2;
  tip.style.position = "fixed";
  tip.style.left = left + "px";
  tip.style.top = top + "px";
}
function buildTooltipHTML(meta, index, series) {
  const esc = escapeHtml;
  if (meta.type === "area" || meta.type === "line") {
    const datasets = meta.datasets;
    let html = '<div class="mn-chart-tooltip__label">' + esc(meta.labels && meta.labels[index] ? meta.labels[index] : "Point " + (index + 1)) + "</div>";
    datasets.forEach((ds, i) => {
      if (index < ds.data.length) {
        const color = ds.color || series[i % series.length];
        html += '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;"><span class="mn-chart-tooltip__dot" style="background:' + color + ';"></span><span style="color:var(--chart-label,#9e9e9e);font-size:0.65rem;">' + esc(ds.label || "Series " + (i + 1)) + '</span><span class="mn-chart-tooltip__value" style="margin-left:auto;color:' + color + ';">' + ds.data[index].toFixed(1) + "</span></div>";
      }
    });
    return html;
  }
  if (meta.type === "bar") {
    const d = meta.data[index];
    const color = d.color || series[index % series.length];
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
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  if (x < 0) return;
  ctx.save();
  ctx.scale(DPR, DPR);
  ctx.strokeStyle = "rgba(255,199,44,0.3)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);
  const h = canvas.height / DPR;
  const pad2 = meta.pad;
  ctx.beginPath();
  ctx.moveTo(x, pad2 ? pad2.top : 0);
  ctx.lineTo(x, h - (pad2 ? pad2.bottom : 0));
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
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + label + '</div><div class="mn-chart-tooltip__value" style="color:' + color + ';">' + data[idx] + "</div>";
    tip.classList.add("mn-chart-tooltip--visible");
    positionTooltip(tip, e.clientX, e.clientY);
  });
  canvas.addEventListener("mouseleave", () => {
    tip.classList.remove("mn-chart-tooltip--visible");
    const overlay = canvas._mnSparkOverlay;
    if (overlay) overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);
  });
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
  const fsCtr = Math.max(16, s.size * 0.15);
  if (c.centerValue) {
    s.ctx.font = `700 ${fsCtr}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerValue;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerValue, s.cx, s.cy - s.size * 0.02);
  }
  if (c.centerUnit) {
    s.ctx.font = `400 ${Math.max(7, s.size * 0.04)}px 'Inter',sans-serif`;
    s.ctx.fillStyle = s.palette.centerUnit;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerUnit, s.cx, s.cy + s.size * 0.06);
  }
  if (c.centerLabel) {
    s.ctx.font = `600 ${Math.max(6, s.size * 0.035)}px 'Barlow Condensed','Outfit',sans-serif`;
    s.ctx.fillStyle = s.palette.centerLabel;
    s.ctx.textAlign = "center";
    s.ctx.textBaseline = "middle";
    s.ctx.fillText(c.centerLabel, s.cx, s.cy - s.size * 0.14);
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
  const g = s.ctx.createConicGradient(s.rad(sa + 90), s.cx, s.cy);
  const stops = ab.colorStops || ["#DC0000", "#FFC72C", "#00A651"];
  stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1), col));
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
      subDialBg: ["#e8e4dc", "#ddd8ce"],
      subDialBorder: "#c0b9ad",
      odometerBg: "#f0ede6",
      odometerBorder: "#ccc",
      odometerText: "#1a1a1a"
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
  const { ctx, size } = state;
  const cx = size / 2, cy = size / 2, radius = size * 0.44;
  const P = state.palette;
  if (c.crosshair) {
    drawCrosshair2(
      ctx,
      c.crosshair,
      cx,
      cy,
      radius,
      size,
      progress,
      P,
      c
    );
  }
  if (c.multigraph) {
    drawMultigraph(
      ctx,
      c.multigraph,
      cx,
      cy,
      radius,
      size,
      progress,
      P
    );
  }
}
function drawCrosshair2(ctx, ch, cx, cy, radius, size, progress, P, cfg) {
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
  const dotCol = ch.dotColor || cssVar("--chart-default", "#FFC72C");
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
    const off2 = gridR * 0.5;
    ctx.font = `700 ${qfs}px 'Barlow Condensed', 'Outfit', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.tl, cx - off2, cy - off2);
    ctx.fillStyle = cssVar("--chart-default", "#FFC72C");
    ctx.fillText(qc.tr, cx + off2, cy - off2);
    ctx.fillStyle = P.dimmed;
    ctx.fillText(qc.bl, cx - off2, cy + off2);
    ctx.fillStyle = P.axisLabel;
    ctx.fillText(qc.br, cx + off2, cy + off2);
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
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = JSON.parse(canvas.dataset.gauge || "{}");
    this.dpr = window.devicePixelRatio || 1;
    this.init();
  }
  get palette() {
    const accent = getAccent();
    return buildGaugePalette(accent);
  }
  /** Initialize canvas size from data attribute or parent bounds. */
  init() {
    const sizeKey = this.canvas.dataset.size;
    let size;
    if (sizeKey && SIZES[sizeKey]) {
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
    this.animate();
  }
  /** Redraw at full progress. */
  redraw() {
    this.draw(1);
  }
  /** Animate from 0 to full with ease-in-out-cubic. */
  animate() {
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
};

// src/ts/speedometer.ts
var SIZES2 = { sm: 120, md: 220, lg: 320 };
var SWEEP = Math.PI * 1.5;
var START = Math.PI * 0.75;
var FONT2 = "'Barlow Condensed', 'Outfit', sans-serif";
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function v2a(v, max) {
  return START + Math.min(Math.max(v, 0), max) / max * SWEEP;
}
function speedoPalette() {
  const cl = document.body.classList;
  const isCB = cl.contains("mn-colorblind");
  const isNero = cl.contains("mn-nero");
  const D = {
    needle: null,
    arc: null,
    barStops: null,
    bg: ["#0d0d0d", "#1a1a1a", "#2c2c2c"],
    border: "#3a3a3a",
    minorTick: "#444",
    majStroke: "#aaa",
    majText: "#c8c8c8",
    capFill: "#2a2a2a",
    capStroke: "#555",
    value: "#fafafa",
    unit: "#888",
    subLabel: "#666",
    barBg: "#1a1a1a",
    barDim: "#666",
    barBright: "#aaa"
  };
  if (isCB) return { ...D, needle: "#4D9DE0", arc: "#7EC8E3", barStops: ["#E15759", "#EDC948", "#59A14F"] };
  if (isNero) return {
    ...D,
    bg: ["#050505", "#111", "#1a1a1a"],
    border: "#2a2a2a",
    minorTick: "#333",
    capFill: "#1a1a1a",
    capStroke: "#444",
    barBg: "#111"
  };
  return D;
}
function drawSpeedo(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, options) {
  const p = speedoPalette();
  const needleCol = p.needle || options.needleColor;
  const arcCol = p.arc || options.arcColor;
  const bg = p.bg;
  ctx.save();
  ctx.clearRect(0, 0, dim, dim);
  const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bgGrad.addColorStop(0, bg[0]);
  bgGrad.addColorStop(0.82, bg[1]);
  bgGrad.addColorStop(1, bg[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bgGrad;
  ctx.fill();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  const aEnd = options.arcEnd != null ? options.arcEnd : curVal;
  if (aEnd > options.arcStart) {
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      R * 1.03,
      v2a(options.arcStart, options.max),
      v2a(aEnd, options.max)
    );
    ctx.strokeStyle = arcCol;
    ctx.lineWidth = 4 * s;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineCap = "butt";
  }
  const ticks = options.ticks;
  const minorTicks = options.minorTicks;
  const max = options.max;
  const tOut = R * 0.95, majL = 12 * s, minL = 6 * s;
  const segs = ticks.length - 1, totalMinor = segs * (minorTicks + 1);
  ctx.strokeStyle = p.minorTick;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = i / totalMinor * max;
    if (ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = v2a(mv, max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }
  ctx.strokeStyle = p.majStroke;
  ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText;
  ctx.font = "bold " + Math.round(11 * s) + "px " + FONT2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let t = 0; t < ticks.length; t++) {
    const tv = ticks[t], ta = v2a(tv, max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(String(tv), cx + c1 * (tOut - majL - 10 * s), cy + s1 * (tOut - majL - 10 * s));
  }
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(curAngle);
  ctx.beginPath();
  ctx.moveTo(nLen, 0);
  ctx.lineTo(-nTail, -nW);
  ctx.lineTo(-nTail, nW);
  ctx.closePath();
  ctx.fillStyle = needleCol;
  ctx.shadowColor = needleCol;
  ctx.shadowBlur = 8 * s;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill;
  ctx.fill();
  ctx.strokeStyle = p.capStroke;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
  ctx.fillStyle = p.value;
  ctx.font = "bold " + Math.round(32 * s) + "px " + FONT2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit;
  ctx.font = Math.round(11 * s) + "px " + FONT2;
  ctx.fillText(options.unit, cx, cy + 37 * s);
  if (options.subLabel) {
    ctx.fillStyle = p.subLabel;
    ctx.font = Math.round(9 * s) + "px " + FONT2;
    ctx.fillText(options.subLabel, cx, cy + 50 * s);
  }
  const bar = options.bar;
  if (bar) {
    const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
    const bX = cx - bW / 2, bY = cy + R * 0.72;
    const stops = p.barStops || bar.colorStops || [cssVar("--signal-danger", "#DC0000"), cssVar("--signal-warning", "#FFC72C"), cssVar("--signal-ok", "#00A651")];
    ctx.beginPath();
    ctx.roundRect?.(bX, bY, bW, bH, bR);
    ctx.fillStyle = p.barBg;
    ctx.fill();
    const fW = bW * Math.max(0, Math.min(1, barVal));
    if (fW > 1) {
      const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
      stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
      ctx.save();
      ctx.beginPath();
      ctx.roundRect?.(bX, bY, fW, bH, bR);
      ctx.clip();
      ctx.fillStyle = gr;
      ctx.fillRect(bX, bY, bW, bH);
      ctx.restore();
    }
    ctx.font = Math.round(8 * s) + "px " + FONT2;
    ctx.textBaseline = "top";
    const lY = bY + bH + 3 * s;
    if (bar.labelLeft) {
      ctx.fillStyle = p.barDim;
      ctx.textAlign = "left";
      ctx.fillText(bar.labelLeft, bX, lY);
    }
    if (bar.labelRight) {
      ctx.fillStyle = p.barDim;
      ctx.textAlign = "right";
      ctx.fillText(bar.labelRight, bX + bW, lY);
    }
    if (bar.label) {
      ctx.fillStyle = p.barBright;
      ctx.textAlign = "center";
      ctx.fillText(bar.label, cx, lY);
    }
  }
  ctx.restore();
}
function speedometer(canvas, opts) {
  const options = {
    value: 0,
    max: 100,
    unit: "",
    size: "md",
    ticks: [0, 25, 50, 75, 100],
    minorTicks: 4,
    needleColor: cssVar("--signal-danger", "#DC0000"),
    arcColor: cssVar("--chart-default", "#FFC72C"),
    arcStart: 0,
    arcEnd: null,
    bar: null,
    subLabel: null,
    animate: true,
    ...opts
  };
  const dim = SIZES2[options.size] || SIZES2.md;
  const dpr2 = window.devicePixelRatio || 1;
  canvas.width = dim * dpr2;
  canvas.height = dim * dpr2;
  canvas.style.width = dim + "px";
  canvas.style.height = dim + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr2, dpr2);
  const s = dim / 220;
  const cx = dim / 2, cy = dim / 2, R = dim * 0.4;
  let curAngle = v2a(options.value, options.max);
  let curVal = options.value;
  let barVal = options.bar ? options.bar.value || 0 : 0;
  let animId = null;
  function draw() {
    drawSpeedo(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, options);
  }
  function animateTo(toAngle, toVal) {
    if (animId) cancelAnimationFrame(animId);
    const fromA = curAngle, fromV = curVal;
    const t0 = performance.now(), dur = 800;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const ep = easeOutCubic(p);
      curAngle = fromA + (toAngle - fromA) * ep;
      curVal = fromV + (toVal - fromV) * ep;
      draw();
      if (p < 1) animId = requestAnimationFrame(tick);
      else animId = null;
    };
    tick(performance.now());
  }
  if (options.animate) {
    curAngle = START;
    curVal = 0;
    animateTo(v2a(options.value, options.max), options.value);
  } else {
    draw();
  }
  return {
    setValue(v) {
      const ta = v2a(v, options.max);
      if (options.animate) animateTo(ta, v);
      else {
        curAngle = ta;
        curVal = v;
        draw();
      }
    },
    setBar(v) {
      barVal = Math.max(0, Math.min(1, v));
      if (!animId) draw();
    },
    destroy() {
      if (animId) cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, dim * dpr2, dim * dpr2);
    }
  };
}

// src/ts/gantt-defaults.ts
var DPR2 = window.devicePixelRatio || 1;
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
  const isLight = document.body.classList.contains("mn-avorio");
  return {
    bg: isLight ? "#faf8f2" : "#0a0a0a",
    text: isLight ? "#1a1a1a" : "#e0e0e0",
    muted: isLight ? "#666" : "#888",
    border: isLight ? "rgba(0,0,0,0.08)" : "rgba(200,200,200,0.08)",
    headerBg: isLight ? "rgba(245,242,235,0.98)" : "rgba(18,18,18,0.98)",
    sidebarBg: isLight ? "rgba(245,242,235,0.95)" : "rgba(14,14,14,0.97)",
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
    ctx.strokeStyle = cssVar("--today-line", "#4EA8DE");
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
      ctx.fillStyle = cssVar("--today-line", "#4EA8DE");
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
  if (task.account) h += '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">' + escapeHtml(String(task.account)) + "</div>";
  h += '<div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;">';
  h += '<span style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">Start: <b style="color:var(--grigio-alluminio,#c8c8c8);">' + fmtDateFull(sd) + "</b></span>";
  h += '<span style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">End: <b style="color:var(--grigio-alluminio,#c8c8c8);">' + fmtDateFull(ed) + "</b></span>";
  if (dur !== null) h += '<span style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">Duration: ' + dur + " days</span>";
  h += '</div><div style="display:flex;align-items:center;gap:4px;margin-top:3px;">';
  h += '<span class="mn-chart-tooltip__dot" style="background:' + col + ';"></span>';
  h += '<span style="color:' + col + ';font-size:0.65rem;">' + escapeHtml(String(task.state ?? "Unknown")) + "</span></div>";
  if (task.progress !== void 0 && !isChild) h += '<div style="color:var(--chart-default,#FFC72C);font-size:0.65rem;margin-top:2px;">' + Math.round(task.progress * 100) + "% complete</div>";
  if (isChild && task.owner) h += '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;margin-top:2px;">Owner: ' + escapeHtml(String(task.owner)) + "</div>";
  if (isChild && task.type) h += '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">Type: ' + escapeHtml(String(task.type)) + "</div>";
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
  const render3 = s.render;
  const o = s.o;
  canvas.addEventListener("mousemove", (e) => {
    const p = canvasXY(canvas, e);
    const hit = hitTest(s, p.x, p.y);
    const newHover = hit.ri !== void 0 ? hit.ri : -1;
    if (newHover !== s.hoverRow) {
      s.hoverRow = newHover;
      render3();
    }
    canvas.style.cursor = hit.zone === "bar" || hit.isChevron ? "pointer" : hit.zone === "timeline" ? "grab" : "default";
    if (hit.zone === "bar") showTip(s, hit, e.clientX, e.clientY);
    else hideTip(s);
  });
  canvas.addEventListener("mouseleave", () => {
    s.hoverRow = -1;
    hideTip(s);
    render3();
  });
  canvas.addEventListener("click", (e) => {
    const p = canvasXY(canvas, e);
    const hit = hitTest(s, p.x, p.y);
    if (hit.isChevron && hit.row) {
      toggleExpand(s, hit, buildRows2, render3);
      return;
    }
    if (hit.zone === "sidebar" && hit.row && hit.row.type === "parent" && hit.row.hasChildren) {
      toggleExpand(s, hit, buildRows2, render3);
      return;
    }
    if (hit.row) {
      s.selected = hit.row.task.id;
      render3();
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
    render3();
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
    render3();
  }, { passive: false });
  s.btnZI.addEventListener("click", () => {
    s.zoom = Math.max(o.minZoom, s.zoom - o.zoomStep * 2);
    render3();
  });
  s.btnZO.addEventListener("click", () => {
    s.zoom = Math.min(o.maxZoom, s.zoom + o.zoomStep * 2);
    render3();
  });
  s.btnFit.addEventListener("click", () => {
    if (typeof s._fitView === "function") s._fitView(s.wrap.getBoundingClientRect().width || 800);
    render3();
  });
  canvas.addEventListener("keydown", (e) => {
    const rows = s.rows;
    let idx;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      idx = rowIdx(rows, s.selected);
      if (idx < rows.length - 1) {
        s.selected = rows[idx + 1].task.id;
        render3();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      idx = rowIdx(rows, s.selected);
      if (idx > 0) {
        s.selected = rows[idx - 1].task.id;
        render3();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const r = rows.find((r2) => r2.task.id === s.selected);
      if (r && r.type === "parent" && r.hasChildren) {
        const exp = s.expanded;
        const sid = s.selected;
        if (exp[sid]) delete exp[sid];
        else exp[sid] = true;
        s.rows = buildRows2(s.tasks, exp);
        render3();
      }
    } else if (e.key === "Escape") {
      s.selected = null;
      render3();
    }
  });
  if (window.ResizeObserver) new ResizeObserver(() => render3()).observe(s.wrap);
  const themeObs = new MutationObserver(() => {
    s.pal = buildPalette();
    s.cPal = buildChildPalette();
    render3();
  });
  themeObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  s.themeObs = themeObs;
}
function toggleExpand(s, hit, buildRows2, render3) {
  const o = s.o;
  const row = hit.row;
  const id = String(row.task.id);
  const exp = s.expanded;
  if (exp[id]) delete exp[id];
  else exp[id] = true;
  s.rows = buildRows2(s.tasks, exp);
  render3();
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
    span.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:' + pal[st] + ';"></span>' + st;
    leg.appendChild(span);
  });
  const todayLeg = document.createElement("span");
  todayLeg.className = "mn-gantt-timeline__legend-item";
  todayLeg.innerHTML = '<span class="mn-gantt-timeline__legend-swatch" style="background:var(--today-line,#4EA8DE);"></span>TODAY';
  leg.appendChild(todayLeg);
  ctrlBar.appendChild(zoomGrp);
  ctrlBar.appendChild(leg);
  container.appendChild(ctrlBar);
  const wrap = document.createElement("div");
  wrap.className = "mn-gantt-timeline__canvas-wrap";
  container.appendChild(wrap);
  s.wrap = wrap;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Interactive Gantt timeline. Use arrow keys to navigate, Enter to expand rows.");
  canvas.setAttribute("tabindex", "0");
  wrap.appendChild(canvas);
  s.canvas = canvas;
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip mn-gantt-timeline__tip";
  tip.setAttribute("role", "tooltip");
  tip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tip);
  s.tip = tip;
  function render3() {
    const cr = wrap.getBoundingClientRect();
    const vw = Math.max(cr.width, 400), vh = Math.max(cr.height, 200);
    canvas.width = vw * DPR2;
    canvas.height = vh * DPR2;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(DPR2, DPR2);
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
  s.render = render3;
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
  render3();
  return {
    setZoom: (z) => {
      s.zoom = z;
      render3();
    },
    getZoom: () => s.zoom,
    expandAll: () => {
      tasks.forEach((t) => {
        if (t.children?.length) s.expanded[String(t.id)] = true;
      });
      s.rows = buildRows(tasks, s.expanded);
      render3();
    },
    collapseAll: () => {
      s.expanded = {};
      s.rows = buildRows(tasks, s.expanded);
      render3();
    },
    setTasks: (nt) => {
      s.tasks = nt;
      s.range = buildRange(nt);
      s.rows = buildRows(nt, s.expanded);
      render3();
    },
    select: (id) => {
      s.selected = id;
      render3();
    },
    scrollToToday: () => {
      const vw = wrap.getBoundingClientRect().width || 800;
      s.scrollX = s.dateToX(today) - (vw - o.labelWidth) / 2;
      render3();
    },
    render: render3,
    destroy: () => {
      document.removeEventListener("mousemove", s.onDocMove);
      document.removeEventListener("mouseup", s.onDocUp);
      if (s.themeObs) s.themeObs.disconnect();
      container.innerHTML = "";
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    }
  };
}

// src/ts/map-view-helpers.ts
var DPR3 = window.devicePixelRatio || 1;
var TAU = Math.PI * 2;
var SIZE_PX = { sm: 6, md: 10, lg: 14 };
var THEMES = {
  editorial: { land: "#333330", water: "#0d0d0d", border: "#444440", grid: "rgba(200,200,200,0.06)", text: "#c8c8c8", muted: "#616161" },
  nero: { land: "#2e2e2a", water: "#080808", border: "#444440", grid: "rgba(200,200,200,0.05)", text: "#c8c8c8", muted: "#555" },
  avorio: { land: "#e8d5b0", water: "#faf3e6", border: "#d7c39a", grid: "rgba(0,0,0,0.05)", text: "#1a1a1a", muted: "#888" },
  colorblind: { land: "#1a1a1a", water: "#0a0a0a", border: "#2a2a2a", grid: "rgba(200,200,200,0.04)", text: "#c8c8c8", muted: "#616161" }
};
function ll(lon, lat) {
  return [(lon + 180) / 360, (90 - lat) / 180];
}
var CONTINENTS = {
  northAmerica: [ll(-130, 55), ll(-125, 60), ll(-115, 62), ll(-100, 63), ll(-95, 68), ll(-88, 65), ll(-80, 62), ll(-65, 60), ll(-60, 50), ll(-65, 45), ll(-70, 42), ll(-75, 35), ll(-80, 30), ll(-85, 28), ll(-90, 28), ll(-97, 25), ll(-100, 20), ll(-105, 20), ll(-110, 23), ll(-115, 30), ll(-120, 34), ll(-125, 40), ll(-125, 48), ll(-130, 55)],
  southAmerica: [ll(-80, 10), ll(-75, 5), ll(-70, 8), ll(-60, 5), ll(-50, 0), ll(-45, -3), ll(-35, -5), ll(-35, -12), ll(-38, -18), ll(-42, -22), ll(-48, -26), ll(-50, -30), ll(-55, -34), ll(-58, -38), ll(-65, -42), ll(-68, -50), ll(-72, -48), ll(-75, -42), ll(-72, -35), ll(-70, -28), ll(-70, -18), ll(-75, -12), ll(-78, -2), ll(-80, 2), ll(-80, 10)],
  europe: [ll(-10, 36), ll(-8, 42), ll(-5, 44), ll(0, 44), ll(3, 48), ll(5, 52), ll(8, 55), ll(12, 56), ll(15, 58), ll(20, 60), ll(25, 62), ll(28, 65), ll(30, 62), ll(32, 58), ll(35, 55), ll(40, 52), ll(38, 48), ll(35, 45), ll(30, 42), ll(28, 38), ll(25, 36), ll(20, 36), ll(15, 38), ll(10, 38), ll(5, 40), ll(0, 40), ll(-5, 38), ll(-10, 36)],
  africa: [ll(-15, 15), ll(-17, 20), ll(-15, 28), ll(-5, 35), ll(5, 36), ll(10, 37), ll(15, 33), ll(25, 32), ll(30, 30), ll(32, 28), ll(35, 25), ll(40, 15), ll(42, 12), ll(50, 10), ll(48, 5), ll(42, 0), ll(38, -5), ll(35, -10), ll(32, -15), ll(35, -25), ll(30, -32), ll(25, -34), ll(20, -34), ll(18, -30), ll(15, -25), ll(12, -18), ll(12, -10), ll(10, -2), ll(8, 4), ll(5, 5), ll(0, 5), ll(-5, 5), ll(-10, 8), ll(-15, 10), ll(-15, 15)],
  asia: [ll(40, 52), ll(45, 55), ll(55, 55), ll(60, 58), ll(70, 62), ll(80, 65), ll(100, 68), ll(120, 65), ll(130, 60), ll(135, 55), ll(140, 50), ll(142, 45), ll(140, 40), ll(135, 35), ll(130, 32), ll(122, 28), ll(115, 25), ll(110, 20), ll(105, 15), ll(100, 12), ll(98, 8), ll(100, 5), ll(105, 0), ll(95, 5), ll(88, 22), ll(82, 18), ll(75, 15), ll(72, 20), ll(68, 24), ll(62, 25), ll(55, 25), ll(50, 28), ll(45, 32), ll(42, 38), ll(40, 42), ll(38, 48), ll(40, 52)],
  oceania: [ll(115, -12), ll(120, -15), ll(130, -12), ll(135, -15), ll(140, -18), ll(145, -20), ll(148, -22), ll(150, -25), ll(152, -28), ll(150, -32), ll(148, -35), ll(142, -38), ll(138, -35), ll(135, -32), ll(130, -30), ll(125, -28), ll(120, -25), ll(118, -22), ll(115, -18), ll(115, -12)]
};
function detectTheme() {
  const b = document.body.classList;
  const name = b.contains("mn-colorblind") ? "colorblind" : b.contains("mn-nero") ? "nero" : b.contains("mn-avorio") ? "avorio" : "editorial";
  const t = THEMES[name];
  return { ...t, coast: t.border, bg: t.water };
}
function getMarkerColors() {
  return {
    editorial: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    nero: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    avorio: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--arancio", "#D4622B"), danger: cssVar("--signal-danger", "#DC0000") },
    colorblind: { active: "#0072B2", warning: "#FFB000", danger: "#D55E00" }
  };
}
function project(lat, lon, w, h, pad2, vs) {
  const baseW = Math.max(1, w - pad2 * 2), baseH = Math.max(1, h - pad2 * 2);
  if (!vs) return { x: (lon + 180) / 360 * baseW + pad2, y: (90 - lat) / 180 * baseH + pad2 };
  const zoom = vs.zoom || 1;
  const worldW = baseW * zoom, worldH = baseH * zoom;
  const cx = w / 2 * zoom, cy = h / 2 * zoom;
  const wx = (lon + 180) / 360 * worldW, wy = (90 - lat) / 180 * worldH;
  return { x: wx - cx + w * 0.5 + (vs.panX || 0), y: wy - cy + h * 0.5 + (vs.panY || 0) };
}
function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
function getVisibleProjected(source, vw, vh, padding, viewState) {
  const out = [];
  for (let i = 0; i < source.length; i++) {
    const m = source[i];
    const p = project(m.lat, m.lon, vw, vh, padding, viewState);
    if (p.x >= -120 && p.x <= vw + 120 && p.y >= -120 && p.y <= vh + 120) {
      out.push({ ...m, _x: p.x, _y: p.y });
    }
  }
  return out;
}
function clusterMarkers(source, zoom, markerColors, clusterRadius, minClusterSize) {
  const cellSize = Math.max(16, clusterRadius / Math.max(0.5, zoom));
  const buckets = {};
  for (const m of source) {
    const key = Math.floor(m._x / cellSize) + ":" + Math.floor(m._y / cellSize);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(m);
  }
  let clustered = [];
  for (const key of Object.keys(buckets)) {
    const group = buckets[key];
    if (group.length >= minClusterSize) {
      let xAcc = 0, yAcc = 0;
      for (const g of group) {
        xAcc += g._x;
        yAcc += g._y;
      }
      clustered.push({
        id: "cluster-" + key,
        isCluster: true,
        clusterCount: group.length,
        count: group.length,
        lat: group[0].lat,
        lon: group[0].lon,
        label: group.length + " locations",
        detail: "Grouped nearby markers",
        color: "active",
        mixedColor: mixClusterColor(group, markerColors),
        _x: xAcc / group.length,
        _y: yAcc / group.length,
        _members: group,
        size: 10
      });
    } else {
      clustered = clustered.concat(group);
    }
  }
  return clustered;
}
function mixClusterColor(items, mc) {
  let rAcc = 0, gAcc = 0, bAcc = 0, total = 0;
  const counts = { active: 0, warning: 0, danger: 0 };
  for (const m of items) {
    const key = m.color || "active";
    counts[key] = (counts[key] || 0) + 1;
    total++;
    const col = mc[key] || mc.active;
    rAcc += parseInt(col.slice(1, 3), 16);
    gAcc += parseInt(col.slice(3, 5), 16);
    bAcc += parseInt(col.slice(5, 7), 16);
  }
  let dom = "active";
  if (counts.warning > counts[dom]) dom = "warning";
  if (counts.danger > counts[dom]) dom = "danger";
  const dh = mc[dom];
  const dr = parseInt(dh.slice(1, 3), 16), dg = parseInt(dh.slice(3, 5), 16), db = parseInt(dh.slice(5, 7), 16);
  const ar = total ? Math.round(rAcc / total) : dr, ag = total ? Math.round(gAcc / total) : dg, ab = total ? Math.round(bAcc / total) : db;
  return "rgb(" + Math.round(dr * 0.65 + ar * 0.35) + "," + Math.round(dg * 0.65 + ag * 0.35) + "," + Math.round(db * 0.65 + ab * 0.35) + ")";
}
function markerRadius(m) {
  const base = SIZE_PX[m.size || "md"] || SIZE_PX.md;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  if ("isCluster" in m && m.isCluster) return clamp(10 + Math.sqrt(Math.max(1, m.clusterCount || count)) * 2.4, 12, 30);
  if (count > 1) return clamp(base + Math.sqrt(count) * 1.6, 8, 26);
  return base;
}
function drawMarker(ctx, m, mc, pulse, highlighted, hovered) {
  const x = m._x, y = m._y, r = markerRadius(m);
  const isCluster = "isCluster" in m && m.isCluster;
  const col = isCluster ? m.mixedColor || mc.active : mc[m.color || "active"] || mc.active;
  const isHl = highlighted === m.id;
  const isHov = hovered === m.id;
  const count = Math.max(1, parseInt(String(m.count || 1), 10) || 1);
  const showCount = count > 1 || isCluster;
  const pScale = 1 + Math.sin(pulse + m.lat * 0.1) * 0.25;
  const outerR = r * pScale * (isHl ? 1.6 : 1.3);
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, TAU);
  ctx.fillStyle = hexToRgba(col, 0.15);
  ctx.fill();
  const coreR = showCount ? isHov ? r * 1.05 : r : isHov ? r * 1.2 : r * 0.5;
  ctx.beginPath();
  ctx.arc(x, y, coreR, 0, TAU);
  ctx.fillStyle = col;
  ctx.fill();
  if (showCount) {
    ctx.fillStyle = isCluster ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.arc(x, y, coreR * 0.72, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "600 " + Math.max(11, Math.round(coreR * 0.85)) + 'px "Barlow Condensed",sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(count), x, y + 0.5);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, coreR * 0.4, 0, TAU);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  }
}
function renderLegend(legendEl, mc) {
  if (!legendEl) return;
  legendEl.innerHTML = "";
  const cats = ["active", "warning", "danger"];
  const labels = ["Active", "Warning", "Danger"];
  for (let i = 0; i < cats.length; i++) {
    const item = document.createElement("div");
    item.className = "mn-map__legend-item";
    const dot = document.createElement("span");
    dot.className = "mn-map__legend-dot";
    dot.style.background = mc[cats[i]];
    item.appendChild(dot);
    item.appendChild(document.createTextNode(labels[i]));
    legendEl.appendChild(item);
  }
}
function hitTest2(clientX, clientY, canvas, markers) {
  const cr = canvas.getBoundingClientRect();
  const mx = clientX - cr.left, my = clientY - cr.top;
  for (let i = markers.length - 1; i >= 0; i--) {
    const m = markers[i], r = markerRadius(m);
    const dx = mx - m._x, dy = my - m._y;
    if (dx * dx + dy * dy <= (r + 4) * (r + 4)) return m;
  }
  return null;
}

// src/ts/map-view.ts
function mapView(container, opts) {
  if (!container) return null;
  const o = { markers: [], padding: 40, zoom: 1, ...opts };
  let markers = o.markers;
  const viewState = { zoom: o.zoom || 1, panX: 0, panY: 0 };
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.overflow = "hidden";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;";
  container.appendChild(canvas);
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip";
  tip.style.position = "absolute";
  tip.style.pointerEvents = "none";
  container.appendChild(tip);
  const legend = document.createElement("div");
  legend.className = "mn-map__legend";
  legend.style.cssText = "position:absolute;bottom:8px;left:8px;display:flex;gap:8px;font-size:0.65rem;";
  container.appendChild(legend);
  let renderedMarkers = [];
  let highlighted = null;
  let hovered = null;
  const pulse = 0;
  function render3() {
    const rect = container.getBoundingClientRect();
    const vw = rect.width, vh = rect.height;
    canvas.width = vw * DPR3;
    canvas.height = vh * DPR3;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(DPR3, DPR3);
    const th = detectTheme();
    const mc = getMarkerColors();
    const themeName = document.body.classList.contains("mn-colorblind") ? "colorblind" : document.body.classList.contains("mn-nero") ? "nero" : document.body.classList.contains("mn-avorio") ? "avorio" : "editorial";
    const colors = mc[themeName];
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, vw, vh);
    ctx.strokeStyle = th.coast;
    ctx.lineWidth = 0.8;
    ctx.fillStyle = th.land;
    Object.values(CONTINENTS).forEach((pts) => {
      if (!pts || !pts.length) return;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const proj = project(p[1], p[0], vw, vh, o.padding, viewState);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    const visible = getVisibleProjected(markers, vw, vh, o.padding, viewState);
    const clustered = clusterMarkers(visible, viewState.zoom, colors, 40, 3);
    renderedMarkers = [];
    clustered.forEach((m) => {
      drawMarker(ctx, m, colors, pulse, highlighted, hovered);
      renderedMarkers.push(m);
    });
    renderLegend(legend, colors);
  }
  canvas.addEventListener("mousemove", (e) => {
    const hit = hitTest2(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit) {
      canvas.style.cursor = "pointer";
      hovered = hit.id;
      showTip4(hit);
    } else {
      canvas.style.cursor = "default";
      hovered = null;
      tip.classList.remove("mn-chart-tooltip--visible");
    }
  });
  canvas.addEventListener("click", (e) => {
    const hit = hitTest2(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit && o.onClick) o.onClick(hit);
  });
  canvas.addEventListener("mouseleave", () => {
    hovered = null;
    tip.classList.remove("mn-chart-tooltip--visible");
  });
  function showTip4(m) {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(String(m.label || "Marker")) + "</div>" + (m.detail ? '<div style="color:var(--chart-label,#9e9e9e);font-size:0.6rem;">' + escapeHtml(String(m.detail)) + "</div>" : "");
    tip.classList.add("mn-chart-tooltip--visible");
    const tipW = tip.offsetWidth || 120;
    let left = m._x - tipW / 2;
    if (left < 4) left = 4;
    const rect = container.getBoundingClientRect();
    if (left + tipW > rect.width - 4) left = rect.width - tipW - 4;
    let top = m._y - (tip.offsetHeight || 40) - 12;
    if (top < 4) top = m._y + 12;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  if (window.ResizeObserver) new ResizeObserver(() => render3()).observe(container);
  new MutationObserver(() => render3()).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  render3();
  return {
    setMarkers: (m) => {
      markers = m;
      render3();
    },
    addMarker: (m) => {
      markers.push(m);
      render3();
    },
    removeMarker: (id) => {
      markers = markers.filter((m) => m.id !== id);
      render3();
    },
    highlight: (id) => {
      highlighted = id;
      render3();
    },
    setZoom: (z) => {
      viewState.zoom = z;
      render3();
    },
    panTo: (lat, lon) => {
      render3();
    },
    fitBounds: () => {
      viewState.zoom = 1;
      viewState.panX = 0;
      viewState.panY = 0;
      render3();
    },
    destroy: () => {
      container.innerHTML = "";
    }
  };
}

// src/ts/map-mapbox.ts
var DARK_STYLE = "mapbox://styles/mapbox/dark-v11";
var DEFAULT_STAGES = [
  { id: "prospect", label: "Prospect", color: "#4EA8DE" },
  { id: "exploration", label: "Exploration", color: "#FFC72C" },
  { id: "sprint", label: "Sprint", color: "#00A651" },
  { id: "wrap-up", label: "Wrap-up", color: "#D4622B" },
  { id: "completed", label: "Completed", color: "#8B5CF6" },
  { id: "on-hold", label: "On Hold", color: "#DC0000" }
];
function getMapboxGL() {
  if (typeof mapboxgl !== "undefined") return mapboxgl;
  if (typeof window !== "undefined" && window.mapboxgl) return window.mapboxgl;
  return null;
}
function mapboxView(container, opts) {
  const target = typeof container === "string" ? document.querySelector(container) : container;
  if (!target) return null;
  const host = target;
  const root = target;
  const mb = getMapboxGL();
  if (!mb) {
    host.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-dim,#666);font-size:0.8rem">mapbox-gl not loaded. Add &lt;script src="mapbox-gl.js"&gt; to use this component.</div>';
    return null;
  }
  const o = {
    accessToken: "",
    style: DARK_STYLE,
    center: [12, 42.5],
    zoom: 3,
    projection: "globe",
    markers: [],
    clusterRadius: 50,
    clusterMaxZoom: 14,
    showLegend: true,
    choropleth: null,
    ...opts,
    stages: opts?.stages ?? DEFAULT_STAGES
  };
  if (o.accessToken) mb.accessToken = o.accessToken;
  host.innerHTML = "";
  const mapDiv = document.createElement("div");
  mapDiv.style.cssText = "width:100%;height:100%;min-height:300px";
  host.appendChild(mapDiv);
  const map = new mb.Map({
    container: mapDiv,
    style: o.style,
    center: o.center,
    zoom: o.zoom,
    projection: o.projection,
    attributionControl: false
  });
  map.addControl(new mb.NavigationControl({ showCompass: true }), "top-right");
  map.addControl(new mb.AttributionControl({ compact: true }));
  const stageColors = {};
  o.stages.forEach((s) => {
    stageColors[s.id] = s.color;
  });
  function markerColor(m) {
    if (m.color) return m.color;
    if (m.stage && stageColors[m.stage]) return stageColors[m.stage];
    return "#FFC72C";
  }
  let markerInstances = [];
  function renderMarkers(markers) {
    markerInstances.forEach((m) => m.remove());
    markerInstances = [];
    markers.forEach((m) => {
      const el4 = document.createElement("div");
      el4.className = "mn-mapbox-marker";
      const color = markerColor(m);
      el4.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}80;cursor:pointer;transition:transform 0.15s`;
      if (m.count && m.count > 1) {
        el4.style.cssText += ";width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#000";
        el4.textContent = String(m.count);
      }
      el4.addEventListener("mouseenter", () => {
        el4.style.transform = "scale(1.4)";
      });
      el4.addEventListener("mouseleave", () => {
        el4.style.transform = "";
      });
      const popup = new mb.Popup({ offset: 20, closeButton: false, className: "mn-mapbox-popup" }).setHTML(`<div style="font-weight:600;margin-bottom:2px">${m.label}</div>${m.detail ? `<div style="font-size:0.75rem;opacity:0.7">${m.detail}</div>` : ""}`);
      const marker = new mb.Marker({ element: el4 }).setLngLat([m.lon, m.lat]).setPopup(popup).addTo(map);
      if (o.onClick) {
        el4.addEventListener("click", () => o.onClick(m));
      }
      markerInstances.push(marker);
    });
  }
  function renderLegend2() {
    if (!o.showLegend || !o.stages.length) return;
    const legend = document.createElement("div");
    legend.className = "mn-mapbox-legend";
    legend.style.cssText = "position:absolute;bottom:8px;left:8px;display:flex;gap:10px;padding:6px 10px;background:rgba(0,0,0,0.7);border-radius:6px;font-size:0.65rem;z-index:1";
    o.stages.forEach((s) => {
      legend.innerHTML += `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:${s.color};display:inline-block"></span><span style="color:var(--text-dim,#999)">${s.label}</span></span>`;
    });
    root.style.position = "relative";
    root.appendChild(legend);
  }
  map.on("load", () => {
    renderMarkers(o.markers);
    renderLegend2();
    if (o.choropleth) {
      const ch = o.choropleth;
      map.addSource("choropleth", { type: "vector", url: ch.sourceUrl });
      map.addLayer({
        id: "choropleth-fill",
        type: "fill",
        source: "choropleth",
        "source-layer": ch.sourceLayer,
        paint: {
          "fill-color": ["interpolate", ["linear"], ["get", ch.property], ...ch.stops.flat()],
          "fill-opacity": 0.5
        }
      }, "waterway-label");
    }
  });
  return {
    setMarkers: (markers) => {
      o.markers = markers;
      renderMarkers(markers);
    },
    flyTo: (lat, lon, zoom) => map.flyTo({ center: [lon, lat], zoom: zoom ?? map.getZoom(), duration: 1500 }),
    setStyle: (style) => map.setStyle(style),
    resize: () => map.resize(),
    destroy: () => {
      markerInstances.forEach((m) => m.remove());
      map.remove();
      root.innerHTML = "";
    },
    getMap: () => map
  };
}

// src/ts/social-graph.ts
var GROUP_COLORS = {
  default: "#FFC72C",
  Therapists: "#00A651",
  Researchers: "#4EA8DE",
  Volunteers: "#FFC72C",
  Families: "#8B5CF6",
  Staff: "#DC0000"
};
function socialGraph(container, opts = { nodes: [], edges: [] }) {
  const target = typeof container === "string" ? document.querySelector(container) : container;
  if (!(target instanceof HTMLElement)) return null;
  const hostEl = target;
  hostEl.innerHTML = "";
  hostEl.style.position = "relative";
  hostEl.style.overflow = "hidden";
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:none;";
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip";
  tip.style.cssText = "position:absolute;pointer-events:none;opacity:0;transition:opacity .12s ease;max-width:220px;";
  hostEl.append(canvas, tip);
  let width = 0, height = 0, raf = 0, frame = 0;
  let nodes = [], edges = [];
  let nodeMap = /* @__PURE__ */ new Map(), linked = /* @__PURE__ */ new Map();
  let running = opts.animate !== false, hoveredId = null, highlightedId = null;
  let dragging = null, dragMoved = false, resizeObs = null;
  const dpr2 = () => window.devicePixelRatio || 1;
  const activeId = () => hoveredId ?? highlightedId;
  const showLabels = opts.showLabels !== false;
  const showTip4 = (node, x, y) => {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(node.label) + "</div>" + (node.detail ? '<div style="font-size:.68rem;color:var(--chart-label,#9e9e9e)">' + escapeHtml(node.detail) + "</div>" : "");
    tip.style.opacity = "1";
    const tw = tip.offsetWidth || 140, th = tip.offsetHeight || 44;
    tip.style.left = Math.max(6, Math.min(width - tw - 6, x - tw / 2)) + "px";
    tip.style.top = Math.max(6, Math.min(height - th - 6, y - th - 14)) + "px";
  };
  const hideTip4 = () => {
    tip.style.opacity = "0";
  };
  const colorOf = (node) => opts.groups?.[node.group || ""] || GROUP_COLORS[node.group || ""] || GROUP_COLORS.default;
  const inside = (node) => {
    if (node.avatar) return node.avatar.slice(0, 2);
    const parts = node.label.split(/\s+/).filter(Boolean).slice(0, 2);
    return (parts.map((part) => part[0]).join("") || node.id.slice(0, 2)).toUpperCase();
  };
  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const hit = (x, y) => [...nodes].reverse().find((node) => Math.hypot(x - node.x, y - node.y) <= (node.size || 16) + 3) || null;
  function resize() {
    const rect = hostEl.getBoundingClientRect();
    width = Math.max(320, Math.round(opts.width ?? rect.width ?? 0));
    height = Math.max(240, Math.round(opts.height ?? rect.height ?? 0));
    const scale = dpr2();
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    draw();
  }
  function rebuild(nextNodes, nextEdges) {
    const prev = nodeMap;
    nodes = nextNodes.map((node, index) => {
      const old = prev.get(node.id);
      const angle = index / Math.max(nextNodes.length, 1) * Math.PI * 2;
      const radius = Math.min(width || 640, height || 420) * 0.28;
      return {
        ...node,
        x: node.x ?? old?.x ?? (width || 640) / 2 + Math.cos(angle) * radius * (0.55 + Math.random() * 0.45),
        y: node.y ?? old?.y ?? (height || 420) / 2 + Math.sin(angle) * radius * (0.55 + Math.random() * 0.45),
        vx: old?.vx ?? 0,
        vy: old?.vy ?? 0,
        fx: 0,
        fy: 0
      };
    });
    nodeMap = new Map(nodes.map((node) => [node.id, node]));
    edges = nextEdges.filter((edge) => nodeMap.has(edge.source) && nodeMap.has(edge.target));
    linked = new Map(nodes.map((node) => [node.id, /* @__PURE__ */ new Set()]));
    edges.forEach((edge) => {
      linked.get(edge.source)?.add(edge.target);
      linked.get(edge.target)?.add(edge.source);
    });
    frame = 0;
    running = opts.animate !== false && nodes.length > 1;
    loop();
    draw();
  }
  function step() {
    if (!running || nodes.length < 2) {
      running = false;
      return;
    }
    const area = Math.max(width * height, 1), k = Math.sqrt(area / Math.max(nodes.length, 1));
    nodes.forEach((node) => {
      node.fx = 0;
      node.fy = 0;
    });
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, dist = Math.max(12, Math.hypot(dx, dy));
        const force = k * k / dist, nx = dx / dist, ny = dy / dist;
        a.fx += nx * force;
        a.fy += ny * force;
        b.fx -= nx * force;
        b.fy -= ny * force;
      }
    }
    edges.forEach((edge) => {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y, dist = Math.max(12, Math.hypot(dx, dy));
      const force = dist * dist / k * 0.02 * (edge.weight || 1), nx = dx / dist, ny = dy / dist;
      a.fx += nx * force;
      a.fy += ny * force;
      b.fx -= nx * force;
      b.fy -= ny * force;
    });
    const cx = width / 2, cy = height / 2, temp = Math.max(0.35, 16 * (1 - frame / 200));
    nodes.forEach((node) => {
      if (dragging?.id === node.id) {
        node.vx = 0;
        node.vy = 0;
        return;
      }
      node.fx += (cx - node.x) * 0.02;
      node.fy += (cy - node.y) * 0.02;
      node.vx = (node.vx + node.fx * 8e-3) * 0.88;
      node.vy = (node.vy + node.fy * 8e-3) * 0.88;
      const mag = Math.max(1, Math.hypot(node.vx, node.vy)), move = Math.min(temp, mag);
      node.x += node.vx / mag * move;
      node.y += node.vy / mag * move;
      const pad2 = (node.size || 16) + 10;
      node.x = Math.min(width - pad2, Math.max(pad2, node.x));
      node.y = Math.min(height - pad2, Math.max(pad2, node.y));
    });
    frame += 1;
    if (frame >= 200) running = false;
  }
  function draw() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr2(), 0, 0, dpr2(), 0, 0);
    ctx.clearRect(0, 0, width, height);
    const focus = activeId(), neighbors = focus ? linked.get(focus) || /* @__PURE__ */ new Set() : null;
    edges.forEach((edge) => {
      const a = nodeMap.get(edge.source), b = nodeMap.get(edge.target);
      if (!a || !b) return;
      const emphasize = !focus || edge.source === focus || edge.target === focus;
      ctx.save();
      ctx.globalAlpha = focus ? emphasize ? 0.8 : 0.1 : 0.28;
      ctx.strokeStyle = edge.color || "#d5d9e0";
      ctx.lineWidth = Math.max(1, (edge.weight || 1) * (emphasize ? 1.5 : 1));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    });
    nodes.forEach((node) => {
      const radius = node.size || 16, isFocus = node.id === focus, isNear = neighbors?.has(node.id);
      ctx.save();
      ctx.globalAlpha = focus ? isFocus || isNear ? 1 : 0.18 : 1;
      ctx.fillStyle = colorOf(node);
      if (isFocus) {
        ctx.shadowColor = colorOf(node);
        ctx.shadowBlur = 16;
      }
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + (isFocus ? 2 : 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.lineWidth = isFocus ? 2.5 : 1;
      ctx.strokeStyle = "rgba(255,255,255,.72)";
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = `600 ${Math.max(10, radius * 0.8)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(inside(node), node.x, node.y + 0.5, radius * 1.5);
      if (showLabels) {
        ctx.fillStyle = "rgba(245,245,245,.92)";
        ctx.font = "500 12px Inter, sans-serif";
        ctx.textBaseline = "top";
        ctx.fillText(node.label, node.x, node.y + radius + 8);
      }
      ctx.restore();
    });
  }
  function tick() {
    raf = 0;
    step();
    draw();
    if (running) loop();
  }
  function loop() {
    if (!raf && running) raf = requestAnimationFrame(tick);
  }
  const onMove = (event) => {
    const p = point(event);
    if (dragging) {
      dragMoved = true;
      dragging.x = p.x;
      dragging.y = p.y;
      frame = Math.min(frame, 140);
      running = true;
      loop();
      draw();
      showTip4(dragging, p.x, p.y);
      return;
    }
    const node = hit(p.x, p.y);
    if (node?.id !== hoveredId) {
      hoveredId = node?.id || null;
      opts.onHover?.(node || null);
      draw();
    }
    if (node) {
      canvas.style.cursor = "pointer";
      showTip4(node, p.x, p.y);
    } else {
      canvas.style.cursor = "default";
      hideTip4();
    }
  };
  const onUp = () => {
    dragging = null;
    canvas.style.cursor = hoveredId ? "pointer" : "default";
  };
  canvas.addEventListener("mousedown", (event) => {
    const p = point(event), node = hit(p.x, p.y);
    if (!node) return;
    dragging = node;
    dragMoved = false;
    hoveredId = node.id;
    opts.onHover?.(node);
    showTip4(node, p.x, p.y);
    draw();
  });
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseleave", () => {
    if (!dragging) {
      hoveredId = null;
      opts.onHover?.(null);
      hideTip4();
      draw();
    }
  });
  canvas.addEventListener("click", (event) => {
    if (dragMoved) return;
    const p = point(event), node = hit(p.x, p.y);
    if (node && opts.onClick) opts.onClick(node);
  });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
  if (window.ResizeObserver && (!opts.width || !opts.height)) {
    resizeObs = new ResizeObserver(resize);
    resizeObs.observe(hostEl);
  }
  resize();
  rebuild(opts.nodes || [], opts.edges || []);
  return {
    addNode: (node) => rebuild([...nodes, node], edges),
    removeNode: (id) => rebuild(nodes.filter((node) => node.id !== id), edges.filter((edge) => edge.source !== id && edge.target !== id)),
    highlight: (id) => {
      highlightedId = id;
      draw();
    },
    setData: (nextNodes, nextEdges) => rebuild(nextNodes, nextEdges),
    destroy: () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObs?.disconnect();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      hostEl.innerHTML = "";
    }
  };
}

// src/ts/controls.ts
function openDetailPanel(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.add("mn-detail-panel--open");
  const backdrop = panel.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-detail-panel__backdrop")) {
    backdrop.classList.add("mn-detail-panel__backdrop--visible");
    backdrop.addEventListener(
      "click",
      () => closeDetailPanel(id),
      { once: true }
    );
  }
  const first = panel.querySelector("button, [href], input");
  if (first) first.focus();
}
function closeDetailPanel(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.remove("mn-detail-panel--open");
  const backdrop = panel.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-detail-panel__backdrop")) {
    backdrop.classList.remove("mn-detail-panel__backdrop--visible");
  }
}
function openDrawer(id) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.add("mn-drawer--open");
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-drawer__backdrop")) {
    backdrop.classList.add("mn-drawer__backdrop--visible");
    backdrop.addEventListener(
      "click",
      () => closeDrawer(id),
      { once: true }
    );
  }
}
function closeDrawer(id) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.remove("mn-drawer--open");
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-drawer__backdrop")) {
    backdrop.classList.remove("mn-drawer__backdrop--visible");
  }
}
function initOrgTree(container) {
  container.querySelectorAll(".mn-org-tree__toggle").forEach((toggle) => {
    if (toggle.classList.contains("mn-org-tree__toggle--leaf")) return;
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = toggle.closest(".mn-org-tree__item");
      if (!item) return;
      const children = item.querySelector(".mn-org-tree__children");
      if (!children) return;
      const isCollapsed = children.classList.contains("mn-org-tree__children--collapsed");
      children.classList.toggle("mn-org-tree__children--collapsed");
      toggle.classList.toggle("mn-org-tree__toggle--expanded", isCollapsed);
    });
  });
  container.querySelectorAll(".mn-org-tree__node").forEach((node) => {
    node.addEventListener("click", () => {
      container.querySelectorAll(".mn-org-tree__node--active").forEach((n) => {
        n.classList.remove("mn-org-tree__node--active");
      });
      node.classList.add("mn-org-tree__node--active");
      const label = node.querySelector(".mn-org-tree__label");
      eventBus.emit("org-tree-select", {
        label: label ? label.textContent ?? "" : "",
        node
      });
    });
  });
}
function toggleNotifications(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.toggle("mn-notification-center--open");
}
function initDrillDown(container) {
  container.querySelectorAll(".mn-drill-down").forEach((trigger) => {
    const content = trigger.nextElementSibling;
    if (!content || !content.classList.contains("mn-drill-down__content")) return;
    const contentEl = content;
    trigger.addEventListener("click", () => {
      const isOpen = contentEl.classList.contains("mn-drill-down__content--open");
      contentEl.classList.toggle("mn-drill-down__content--open");
      trigger.classList.toggle("mn-drill-down--expanded");
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

// src/ts/controls-ferrari.ts
function ensureStyles() {
  const STYLE_ID = "mn-ctrl-ferrari-css";
  if (document.getElementById(STYLE_ID)) return;
  const sheet = document.createElement("style");
  sheet.id = STYLE_ID;
  sheet.textContent = [
    ".mn-ctrl-label{font-family:var(--font-body,sans-serif);font-size:var(--text-micro,.65rem);color:var(--grigio-chiaro,#aaa);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--space-xs,4px);display:block;text-align:center}",
    ".mn-ctrl-lever{display:inline-flex;flex-direction:column;align-items:center;user-select:none}",
    ".mn-ctrl-lever__body{display:flex;align-items:stretch;gap:var(--space-sm,8px);height:120px;position:relative}",
    ".mn-ctrl-lever__track{width:14px;border-radius:7px;background:linear-gradient(180deg,var(--nero-soft,#1a1a1a),var(--nero-assoluto,#000));box-shadow:inset 0 1px 3px rgba(0,0,0,.6);position:relative;cursor:pointer}",
    ".mn-ctrl-lever__knob{position:absolute;left:50%;width:30px;height:18px;border-radius:4px;background:linear-gradient(180deg,var(--grigio-chiaro,#bbb),var(--grigio-scuro,#555));box-shadow:0 2px 4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);transform:translate(-50%,-50%);cursor:pointer;transition:top var(--duration-sm,.15s) var(--ease-out,ease-out)}",
    ".mn-ctrl-lever__positions{display:flex;flex-direction:column;justify-content:space-between;height:100%}",
    ".mn-ctrl-lever__pos{font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--grigio-medio,#777);text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:color var(--duration-sm,.15s)}",
    ".mn-ctrl-lever__pos--active{color:var(--giallo-ferrari,#FFC72C);font-weight:700}",
    ".mn-ctrl-toggle{display:inline-flex;flex-direction:column;align-items:center;user-select:none}",
    ".mn-ctrl-toggle__body{position:relative;width:52px;height:28px;border-radius:14px;background:linear-gradient(180deg,var(--nero-assoluto,#000),var(--nero-soft,#1a1a1a));box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.05);cursor:pointer}",
    ".mn-ctrl-toggle__lever{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--grigio-chiaro,#bbb),var(--grigio-scuro,#555));box-shadow:0 2px 4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.35);transition:left var(--duration-sm,.15s) var(--ease-out,ease-out)}",
    ".mn-ctrl-toggle--on .mn-ctrl-toggle__lever{left:27px}",
    ".mn-ctrl-toggle--on .mn-ctrl-toggle__body{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 0 8px rgba(255,199,44,.25)}",
    ".mn-ctrl-toggle__indicator{position:absolute;top:50%;right:8px;width:5px;height:5px;border-radius:50%;background:var(--grigio-scuro,#444);transform:translateY(-50%);transition:background var(--duration-sm,.15s),box-shadow var(--duration-sm,.15s)}",
    ".mn-ctrl-toggle--on .mn-ctrl-toggle__indicator{background:var(--giallo-ferrari,#FFC72C);box-shadow:0 0 4px var(--giallo-ferrari,#FFC72C)}"
  ].join("\n");
  document.head.appendChild(sheet);
}
function addLabel(root, text) {
  if (!text) return;
  const lbl = createElement("span", "mn-ctrl-label");
  lbl.textContent = text;
  root.appendChild(lbl);
}
function cruiseLever(container, opts) {
  ensureStyles();
  const positions = opts?.positions ?? ["OFF", "SET", "RES"];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const root = createElement("div", "mn-ctrl-lever");
  addLabel(root, opts?.label);
  const body = createElement("div", "mn-ctrl-lever__body");
  const posBox = createElement("div", "mn-ctrl-lever__positions");
  const posEls = positions.map((p, i) => {
    const pe = createElement("span", "mn-ctrl-lever__pos");
    pe.textContent = p;
    pe.dataset.index = String(i);
    posBox.appendChild(pe);
    return pe;
  });
  const track = createElement("div", "mn-ctrl-lever__track");
  const knob = createElement("div", "mn-ctrl-lever__knob");
  track.appendChild(knob);
  body.appendChild(posBox);
  body.appendChild(track);
  root.appendChild(body);
  container.appendChild(root);
  function setPos(idx) {
    current = clamp(idx, 0, total - 1);
    knob.style.top = (1 - current / (total - 1)) * 100 + "%";
    posEls.forEach(
      (pe, i) => pe.classList.toggle("mn-ctrl-lever__pos--active", i === current)
    );
    if (onChange) onChange(current, positions[current]);
  }
  setPos(current);
  posEls.forEach(
    (pe) => pe.addEventListener("click", () => setPos(Number(pe.dataset.index)))
  );
  track.addEventListener("click", (e) => {
    const rect = track.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setPos(Math.round((1 - y / rect.height) * (total - 1)));
  });
  return {
    getValue: () => current,
    setValue: setPos,
    destroy: () => root.remove()
  };
}
function toggleLever(container, opts) {
  ensureStyles();
  let on3 = opts?.initial ?? false;
  const onChange = opts?.onChange ?? null;
  const root = createElement("div", "mn-ctrl-toggle");
  if (on3) root.classList.add("mn-ctrl-toggle--on");
  addLabel(root, opts?.label);
  const body = createElement("div", "mn-ctrl-toggle__body");
  body.appendChild(createElement("div", "mn-ctrl-toggle__lever"));
  body.appendChild(createElement("div", "mn-ctrl-toggle__indicator"));
  root.appendChild(body);
  container.appendChild(root);
  root.setAttribute("tabindex", "0");
  root.setAttribute("role", "switch");
  root.setAttribute("aria-label", opts?.label ?? "Toggle");
  root.setAttribute("aria-checked", String(on3));
  function toggle() {
    on3 = !on3;
    root.classList.toggle("mn-ctrl-toggle--on", on3);
    root.setAttribute("aria-checked", String(on3));
    if (onChange) onChange(on3);
    eventBus.emit("toggle-change", { on: on3 });
  }
  body.addEventListener("click", toggle);
  root.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      toggle();
      e.preventDefault();
    }
  });
  return {
    getValue: () => on3,
    setValue: (v) => {
      if (!!v !== on3) toggle();
    },
    destroy: () => {
      container.removeChild(root);
    }
  };
}

// src/ts/controls-ferrari-dials.ts
var MANETTINO_STYLE_ID = "mn-ctrl-manettino-css";
var STEPPED_STYLE_ID = "mn-ctrl-stepped-css";
function ensureManettinoStyles() {
  if (document.getElementById(MANETTINO_STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = MANETTINO_STYLE_ID;
  s.textContent = [
    ".mn-ctrl-manettino{display:inline-flex;flex-direction:column;align-items:center;user-select:none}",
    ".mn-ctrl-manettino__dial{position:relative;width:160px;height:160px}",
    ".mn-ctrl-manettino__knob{position:absolute;top:50%;left:50%;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 40% 35%,var(--mn-ctrl-manettino-tint,var(--rosso-corsa,#DC0000)),var(--nero-soft,#1a1a1a));box-shadow:0 3px 8px rgba(0,0,0,.55),inset 0 1px 1px rgba(255,255,255,.2);transform:translate(-50%,-50%);cursor:grab;transition:box-shadow var(--duration-sm,.15s)}",
    ".mn-ctrl-manettino__knob:active{cursor:grabbing;box-shadow:0 1px 4px rgba(0,0,0,.7),inset 0 1px 1px rgba(255,255,255,.15)}",
    ".mn-ctrl-manettino__pointer{position:absolute;top:6px;left:50%;width:2px;height:18px;background:var(--bianco-puro,#fff);border-radius:1px;transform:translateX(-50%);pointer-events:none}",
    ".mn-ctrl-manettino__ring{position:absolute;top:50%;left:50%;width:80px;height:80px;border-radius:50%;border:2px solid var(--grigio-scuro,#444);transform:translate(-50%,-50%);pointer-events:none}",
    ".mn-ctrl-manettino__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--grigio-medio,#777);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);white-space:nowrap;transition:color var(--duration-sm,.15s)}",
    ".mn-ctrl-manettino__pos--active{color:var(--bianco-caldo,#f5f0e8);font-weight:700}"
  ].join("\n");
  document.head.appendChild(s);
}
function ensureSteppedStyles() {
  if (document.getElementById(STEPPED_STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STEPPED_STYLE_ID;
  s.textContent = [
    ".mn-ctrl-stepped{display:inline-flex;flex-direction:column;align-items:center;user-select:none}",
    ".mn-ctrl-stepped__dial{position:relative;width:100px;height:100px}",
    ".mn-ctrl-stepped__knob{position:absolute;top:50%;left:50%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 35%,var(--grigio-scuro,#555),var(--nero-soft,#1a1a1a));box-shadow:0 2px 6px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.15);transform:translate(-50%,-50%);cursor:grab;transition:box-shadow var(--duration-sm,.15s)}",
    ".mn-ctrl-stepped__knob:active{cursor:grabbing}",
    ".mn-ctrl-stepped__pointer{position:absolute;top:4px;left:50%;width:2px;height:12px;background:var(--bianco-puro,#fff);border-radius:1px;transform:translateX(-50%);pointer-events:none}",
    ".mn-ctrl-stepped__tick{position:absolute;width:2px;height:8px;border-radius:1px;background:var(--grigio-scuro,#444);pointer-events:none;transition:background var(--duration-sm,.15s)}",
    ".mn-ctrl-stepped__tick--active{background:var(--giallo-ferrari,#FFC72C)}",
    ".mn-ctrl-stepped__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--grigio-medio,#777);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);transition:color var(--duration-sm,.15s)}",
    ".mn-ctrl-stepped__pos--active{color:var(--giallo-ferrari,#FFC72C);font-weight:700}"
  ].join("\n");
  document.head.appendChild(s);
}
function addLabel2(root, text) {
  if (!text) return;
  const lbl = createElement("span", "mn-ctrl-label");
  lbl.textContent = text;
  root.appendChild(lbl);
}
function setupDragRotary(knobEl, dial, root, arcDeg, startDeg, total, setFn, currentFn) {
  let dragging = false;
  function dStart(e) {
    dragging = true;
    e.preventDefault();
  }
  function dMove(e) {
    if (!dragging) return;
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    let deg = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
    if (deg < startDeg) deg += 360;
    setFn(clamp(Math.round((deg - startDeg) / arcDeg * (total - 1)), 0, total - 1));
  }
  function dEnd() {
    dragging = false;
  }
  knobEl.addEventListener("mousedown", dStart);
  knobEl.addEventListener("touchstart", dStart, { passive: false });
  document.addEventListener("mousemove", dMove);
  document.addEventListener("touchmove", dMove, { passive: true });
  document.addEventListener("mouseup", dEnd);
  document.addEventListener("touchend", dEnd);
  root.addEventListener("keydown", (e) => {
    const cur = currentFn();
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setFn(cur - 1);
      e.preventDefault();
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setFn(cur + 1);
      e.preventDefault();
    }
  });
  return () => {
    document.removeEventListener("mousemove", dMove);
    document.removeEventListener("touchmove", dMove);
    document.removeEventListener("mouseup", dEnd);
    document.removeEventListener("touchend", dEnd);
  };
}
function manettino(container, opts) {
  ensureManettinoStyles();
  const positions = opts?.positions ?? ["WET", "COMFORT", "SPORT", "RACE", "ESC OFF"];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const ARC = 240, START3 = -120;
  const angleFor = (i) => START3 + (total > 1 ? i / (total - 1) * ARC : 0);
  const root = createElement("div", "mn-ctrl-manettino");
  if (opts?.tint) root.style.setProperty("--mn-ctrl-manettino-tint", opts.tint);
  addLabel2(root, opts?.label);
  const dial = createElement("div", "mn-ctrl-manettino__dial");
  dial.appendChild(createElement("div", "mn-ctrl-manettino__ring"));
  const knobEl = createElement("div", "mn-ctrl-manettino__knob");
  knobEl.appendChild(createElement("div", "mn-ctrl-manettino__pointer"));
  dial.appendChild(knobEl);
  const LABEL_R = 70;
  const posEls = positions.map((p, i) => {
    const rad = (angleFor(i) - 90) * Math.PI / 180;
    const pe = createElement("span", "mn-ctrl-manettino__pos");
    pe.textContent = p;
    pe.dataset.index = String(i);
    pe.style.left = 80 + Math.cos(rad) * LABEL_R + "px";
    pe.style.top = 80 + Math.sin(rad) * LABEL_R + "px";
    dial.appendChild(pe);
    return pe;
  });
  root.appendChild(dial);
  container.appendChild(root);
  root.setAttribute("tabindex", "0");
  root.setAttribute("role", "slider");
  root.setAttribute("aria-label", opts?.label ?? "Manettino");
  root.setAttribute("aria-valuemin", "0");
  root.setAttribute("aria-valuemax", String(total - 1));
  function refresh() {
    knobEl.style.transform = `translate(-50%,-50%) rotate(${angleFor(current)}deg)`;
    root.setAttribute("aria-valuenow", String(current));
    root.setAttribute("aria-valuetext", positions[current]);
    posEls.forEach((el4, i) => el4.classList.toggle("mn-ctrl-manettino__pos--active", i === current));
  }
  function set(idx) {
    const next = clamp(idx, 0, total - 1);
    if (next === current) return;
    current = next;
    refresh();
    if (onChange) onChange(current, positions[current]);
    eventBus.emit("manettino-change", { index: current, label: positions[current] });
  }
  refresh();
  dial.addEventListener("click", (e) => {
    const target = e.target;
    if (target?.dataset.index != null) set(Number(target.dataset.index));
  });
  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START3, total, set, () => current);
  return {
    getValue: () => current,
    setValue: (idx) => set(idx),
    destroy: () => {
      cleanup();
      container.removeChild(root);
    }
  };
}
function steppedRotary(container, opts) {
  ensureSteppedStyles();
  const positions = opts?.positions ?? ["0", "1", "2", "A"];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const ARC = 180, START3 = -90;
  const angleFor = (i) => START3 + (total > 1 ? i / (total - 1) * ARC : 0);
  const root = createElement("div", "mn-ctrl-stepped");
  addLabel2(root, opts?.label);
  const dial = createElement("div", "mn-ctrl-stepped__dial");
  const TICK_R = 30, LABEL_R = 44;
  const tickEls = [];
  positions.forEach((_, i) => {
    const rad = (angleFor(i) - 90) * Math.PI / 180;
    const tick = createElement("div", "mn-ctrl-stepped__tick");
    tick.style.left = 50 + Math.cos(rad) * TICK_R + "px";
    tick.style.top = 50 + Math.sin(rad) * TICK_R + "px";
    tick.style.transform = `translate(-50%,-50%) rotate(${angleFor(i)}deg)`;
    dial.appendChild(tick);
    tickEls.push(tick);
  });
  const knobEl = createElement("div", "mn-ctrl-stepped__knob");
  knobEl.appendChild(createElement("div", "mn-ctrl-stepped__pointer"));
  dial.appendChild(knobEl);
  const posEls = positions.map((p, i) => {
    const rad = (angleFor(i) - 90) * Math.PI / 180;
    const pe = createElement("span", "mn-ctrl-stepped__pos");
    pe.textContent = p;
    pe.dataset.index = String(i);
    pe.style.left = 50 + Math.cos(rad) * LABEL_R + "px";
    pe.style.top = 50 + Math.sin(rad) * LABEL_R + "px";
    dial.appendChild(pe);
    return pe;
  });
  root.appendChild(dial);
  container.appendChild(root);
  root.setAttribute("tabindex", "0");
  root.setAttribute("role", "slider");
  root.setAttribute("aria-label", opts?.label ?? "Stepped rotary");
  root.setAttribute("aria-valuemin", "0");
  root.setAttribute("aria-valuemax", String(total - 1));
  function refresh() {
    knobEl.style.transform = `translate(-50%,-50%) rotate(${angleFor(current)}deg)`;
    root.setAttribute("aria-valuenow", String(current));
    root.setAttribute("aria-valuetext", positions[current]);
    posEls.forEach((el4, i) => el4.classList.toggle("mn-ctrl-stepped__pos--active", i === current));
    tickEls.forEach((t, i) => t.classList.toggle("mn-ctrl-stepped__tick--active", i === current));
  }
  function set(idx) {
    const next = clamp(idx, 0, total - 1);
    if (next === current) return;
    current = next;
    refresh();
    if (onChange) onChange(current, positions[current]);
    eventBus.emit("stepped-change", { index: current, label: positions[current] });
  }
  refresh();
  dial.addEventListener("click", (e) => {
    const target = e.target;
    if (target?.dataset.index != null) set(Number(target.dataset.index));
  });
  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START3, total, set, () => current);
  return {
    getValue: () => current,
    setValue: (idx) => set(idx),
    destroy: () => {
      cleanup();
      container.removeChild(root);
    }
  };
}

// src/ts/data-binding.ts
function emit(name, detail) {
  eventBus.emit(name, detail);
}
function on(name, handler) {
  eventBus.on(name, handler);
}
function toElementArray(selector) {
  if (typeof selector === "string") return Array.from(document.querySelectorAll(selector));
  return [selector];
}
function setElementProperty(el4, property, value) {
  if (property === "textContent") {
    el4.textContent = value == null ? "" : String(value);
  } else if (property === "innerHTML") {
    el4.innerHTML = value == null ? "" : String(value);
  } else if (property.startsWith("style.")) {
    if (el4 instanceof HTMLElement) {
      el4.style[property.slice(6)] = value == null ? "" : String(value);
    }
  } else if (property.startsWith("data-")) {
    const attrValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
    el4.setAttribute(property, attrValue);
  } else {
    el4[property] = value;
  }
}
function bind(selector, options) {
  const elements = toElementArray(selector);
  const opts = {
    property: "textContent",
    interval: 0,
    map: (data) => data,
    ...options
  };
  function update() {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error("bind: missing URL"));
      return fetch(opts.url).then((r) => r.json());
    });
    fetchFn().then((data) => {
      for (const el4 of elements) {
        const value = opts.map(data, el4);
        setElementProperty(el4, opts.property, value);
        el4.classList.add("mn-anim-count");
        setTimeout(() => el4.classList.remove("mn-anim-count"), 300);
        if (opts.onUpdate) opts.onUpdate(el4, value);
      }
    }).catch((err) => {
      if (opts.onError) {
        for (const el4 of elements) opts.onError(el4, err);
      }
    });
  }
  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return void 0;
}
function autoBind() {
  document.querySelectorAll("[data-mn-bind]").forEach((el4) => {
    const config = {};
    const rawBind = el4.dataset.mnBind;
    if (!rawBind) return;
    rawBind.split(";").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length === 2) config[kv[0].trim()] = kv[1].trim();
    });
    if (config.url) {
      bind(el4, {
        url: config.url,
        property: config.prop ?? "textContent",
        interval: parseInt(config.refresh ?? "", 10) || 0
      });
    }
  });
}
function onDrillDown(selector, handler) {
  document.querySelectorAll(selector).forEach((el4) => {
    if (el4 instanceof HTMLElement) el4.style.cursor = "pointer";
    el4.setAttribute("role", "button");
    el4.setAttribute("tabindex", "0");
    el4.classList.add("mn-hover-lift");
    function trigger() {
      const context = {};
      Array.from(el4.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          context[attr.name.slice(5)] = attr.value;
        }
      });
      context.text = el4.textContent;
      handler(el4, context);
    }
    el4.addEventListener("click", trigger);
    el4.addEventListener("keydown", (e) => {
      const keyEvent = e;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        trigger();
      }
    });
  });
}

// src/ts/data-binding-ui.ts
function updateGauge(canvas, newConfig, gaugeMap) {
  const gauge = gaugeMap?.get(canvas);
  if (!gauge) return;
  Object.assign(gauge.config, newConfig);
  if (newConfig.complications && gauge.config.complications) {
    Object.assign(gauge.config.complications, newConfig.complications);
  } else if (newConfig.complications) {
    gauge.config.complications = { ...newConfig.complications };
  }
  gauge.animate();
}
function bindChart(canvas, chartType, options, chartRegistry) {
  const opts = {
    interval: 0,
    map: (d) => d,
    ...options
  };
  const maybeFn = chartRegistry?.[chartType];
  if (!maybeFn) {
    console.warn("bindChart: unknown chart type", chartType);
    return void 0;
  }
  const chartFn = maybeFn;
  function update() {
    const fetchFn = opts.fetch ?? (() => {
      if (!opts.url) return Promise.reject(new Error("missing URL"));
      return fetch(opts.url).then((r) => r.json());
    });
    fetchFn().then((raw) => {
      const data = opts.map(raw);
      chartFn(canvas, data, opts.chartOpts ?? {});
      eventBus.emit("chart-update", { canvas, type: chartType, data });
    }).catch((err) => {
      console.warn("bindChart error:", err);
    });
  }
  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return void 0;
}
function autoBindSliders(initSlider2) {
  document.querySelectorAll("[data-mn-slider]").forEach((el4) => {
    const config = {};
    const rawSlider = el4.dataset.mnSlider;
    if (!rawSlider) return;
    rawSlider.split(";").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length === 2) {
        const key = kv[0].trim();
        const rawValue = kv[1].trim();
        const numericValue = Number(rawValue);
        config[key] = isNaN(numericValue) ? rawValue : numericValue;
      }
    });
    if (initSlider2) initSlider2(el4, config);
  });
}
function bindControl(el4, options) {
  const opts = {
    mapRead: (d) => d.value,
    mapWrite: (v) => JSON.stringify({ value: v }),
    ...options
  };
  if (opts.url) {
    fetch(opts.url).then((r) => r.json()).then((data) => {
      const val = opts.mapRead(data);
      if (el4._mnSlider) el4._mnSlider.setValue(val);
    }).catch((err) => {
      console.warn("bindControl: failed to read initial value", err);
    });
  }
  eventBus.on("slider-change", (detail) => {
    const d = detail;
    if (d.element !== el4) return;
    if (opts.url) {
      fetch(opts.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: opts.mapWrite(d.value)
      }).catch((err) => {
        console.warn("bindControl: failed to write value", err);
      });
    }
  });
}

// src/ts/data-table-render.ts
var STATUS_MAP = {
  "active": { cls: "active", icon: "\u25CF" },
  "stage 3": { cls: "active", icon: "\u25CF" },
  "completed": { cls: "active", icon: "\u2713" },
  "at risk": { cls: "warning", icon: "\u25CF" },
  "warning": { cls: "warning", icon: "\u25B2" },
  "blocked": { cls: "danger", icon: "\u25CF" },
  "on hold": { cls: "danger", icon: "\u25A0" },
  "stage 1": { cls: "info", icon: "\u25CF" },
  "stage 2": { cls: "info", icon: "\u25CF" },
  "planned": { cls: "info", icon: "\u25CB" },
  "stage 4": { cls: "warning", icon: "\u25CF" }
};
function el2(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
  }
  return e;
}
function escHtml(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var cellRenderers = {
  text: (val) => '<span class="mn-dt__cell-text">' + escHtml(val) + "</span>",
  number: (val) => '<span class="mn-dt__cell-number">' + escHtml(val) + "</span>",
  status: (val) => {
    const key = String(val ?? "").toLowerCase();
    const st = STATUS_MAP[key] ?? { cls: "info", icon: "\u25CF" };
    return '<span class="mn-status mn-status--' + st.cls + '"><span class="mn-status__dot"></span> ' + escHtml(val) + "</span>";
  },
  progress: (val) => {
    const pct2 = typeof val === "number" ? val : parseFloat(String(val)) || 0;
    const cls = pct2 >= 80 ? "green" : pct2 >= 50 ? "yellow" : "red";
    return '<div class="mn-dt__cell-progress"><div class="mn-progress" style="width:64px"><div class="mn-progress__fill mn-progress__fill--' + cls + '" style="width:' + pct2 + '%"></div></div><span class="mn-dt__cell-pct">' + Math.round(pct2) + "%</span></div>";
  },
  date: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const d = new Date(String(val));
    return '<span class="mn-dt__cell-date">' + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getFullYear()).slice(2) + "</span>";
  },
  tag: (val) => !val ? "" : '<span class="mn-tag mn-tag--light mn-tag--xs">' + escHtml(val) + "</span>",
  person: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const initials2 = String(val).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    return '<div class="mn-dt__cell-person"><span class="mn-dt__avatar">' + initials2 + '</span><span class="mn-dt__cell-text">' + escHtml(val) + "</span></div>";
  },
  badge: (val) => {
    if (val == null) return '<span class="mn-dt__cell-text">\u2014</span>';
    const num = Number(val);
    const cls = num >= 7 ? "green" : num >= 4 ? "yellow" : "red";
    return '<span class="mn-dt__badge mn-dt__badge--' + cls + '">' + escHtml(val) + "</span>";
  },
  custom: (val, row, col) => {
    const c = col;
    if (c?.render) return String(c.render(val, row));
    return escHtml(val);
  }
};
function buildRow(row, rowIdx2, opts, state, tbody) {
  const tr = el2("tr", "mn-dt__row");
  tr.setAttribute("role", "row");
  tr.setAttribute("data-row-idx", String(rowIdx2));
  if (opts.selectable) {
    tr.classList.add("mn-dt__row--selectable");
    tr.setAttribute("tabindex", "0");
  }
  if (state.selected === rowIdx2) tr.classList.add("mn-dt__row--selected");
  if (opts.stripedRows && rowIdx2 % 2 === 1) tr.classList.add("mn-dt__row--striped");
  opts.columns.forEach((col, ci) => {
    const td = el2("td", "mn-dt__td");
    td.setAttribute("role", "gridcell");
    td.setAttribute("data-col", String(ci));
    if (col.align === "right") td.style.textAlign = "right";
    if (col.align === "center") td.style.textAlign = "center";
    const renderer = cellRenderers[col.type ?? "text"] ?? cellRenderers.text;
    td.innerHTML = renderer(row[col.key], row, col);
    tr.appendChild(td);
  });
  tr.addEventListener("click", () => {
    state.selected = rowIdx2;
    tbody.querySelectorAll(".mn-dt__row--selected").forEach((r) => r.classList.remove("mn-dt__row--selected"));
    tr.classList.add("mn-dt__row--selected");
    if (opts.onRowClick) opts.onRowClick(row, rowIdx2);
  });
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tr.click();
    }
  });
  if (opts.crosshair) {
    tr.addEventListener("mouseenter", () => {
      const prev = tbody.querySelector(".mn-dt__row--hovered");
      if (prev) prev.classList.remove("mn-dt__row--hovered");
      tr.classList.add("mn-dt__row--hovered");
    });
  }
  return tr;
}
function buildGroupHeader(groupName, count, isExpanded, colSpan, state, renderFn) {
  const tr = el2("tr", "mn-dt__group-row");
  tr.setAttribute("role", "row");
  const td = el2("td", "mn-dt__group-cell");
  td.setAttribute("colspan", String(colSpan));
  td.setAttribute("role", "gridcell");
  const chevron = el2("span", "mn-dt__group-chevron" + (isExpanded ? " mn-dt__group-chevron--open" : ""));
  chevron.innerHTML = "\u25B8";
  const statusDot = el2("span", "mn-dt__group-dot");
  const st = STATUS_MAP[groupName.toLowerCase()];
  if (st) statusDot.classList.add("mn-dt__group-dot--" + st.cls);
  const label = el2("span", "mn-dt__group-label", { text: groupName.toUpperCase() });
  const badge = el2("span", "mn-dt__group-count", { text: String(count) });
  [chevron, statusDot, label, badge].forEach((n) => {
    td.appendChild(document.createTextNode(" "));
    td.appendChild(n);
  });
  tr.appendChild(td);
  tr.style.cursor = "pointer";
  tr.setAttribute("tabindex", "0");
  tr.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  tr.addEventListener("click", () => {
    state.expandedGroups[groupName] = !state.expandedGroups[groupName];
    renderFn();
  });
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tr.click();
    }
  });
  return tr;
}
function buildPagination(totalRows, paginationEl, pageSize, state, renderFn) {
  if (!paginationEl || pageSize <= 0) return;
  paginationEl.innerHTML = "";
  const totalPages = Math.ceil(totalRows / pageSize);
  if (totalPages <= 1) return;
  const info = el2("span", "mn-dt__page-info", { text: `Page ${state.page + 1} of ${totalPages}  \xB7  ${totalRows} rows` });
  const prevBtn = el2("button", "mn-dt__page-btn", { text: "\u2190", "aria-label": "Previous page" });
  prevBtn.disabled = state.page === 0;
  prevBtn.addEventListener("click", () => {
    if (state.page > 0) {
      state.page--;
      renderFn();
    }
  });
  const nextBtn = el2("button", "mn-dt__page-btn", { text: "\u2192", "aria-label": "Next page" });
  nextBtn.disabled = state.page >= totalPages - 1;
  nextBtn.addEventListener("click", () => {
    if (state.page < totalPages - 1) {
      state.page++;
      renderFn();
    }
  });
  paginationEl.appendChild(prevBtn);
  paginationEl.appendChild(info);
  paginationEl.appendChild(nextBtn);
}
function buildEmptyRow(emptyMessage, colSpan) {
  const tr = el2("tr", "mn-dt__empty-row");
  const td = el2("td", "mn-dt__empty-cell", { text: emptyMessage });
  td.setAttribute("colspan", String(colSpan));
  tr.appendChild(td);
  return tr;
}
function positionColHighlight(ci, headerRow, scrollWrap, colHighlightEl) {
  const ths = headerRow.querySelectorAll(".mn-dt__th");
  if (ci < 0 || ci >= ths.length) {
    colHighlightEl.style.display = "none";
    return;
  }
  const th = ths[ci];
  const scrollRect = scrollWrap.getBoundingClientRect();
  const thRect = th.getBoundingClientRect();
  colHighlightEl.style.display = "block";
  colHighlightEl.style.left = thRect.left - scrollRect.left + scrollWrap.scrollLeft + "px";
  colHighlightEl.style.width = thRect.width + "px";
  colHighlightEl.style.top = "0";
  colHighlightEl.style.height = scrollWrap.scrollHeight + "px";
}

// src/ts/data-table-logic.ts
function compare(a, b, dir) {
  if (a == null && b == null) return 0;
  if (a == null) return dir;
  if (b == null) return -dir;
  if (typeof a === "number" && typeof b === "number") return (a - b) * dir;
  return String(a).localeCompare(String(b)) * dir;
}
function matchFilter(val, query) {
  if (!query) return true;
  return String(val ?? "").toLowerCase().indexOf(query.toLowerCase()) !== -1;
}
function handleSort(key, ci, state, headerRow, renderFn, onSort) {
  if (state.sortKey === key) {
    state.sortDir = state.sortDir === 1 ? -1 : 1;
  } else {
    state.sortKey = key;
    state.sortDir = 1;
  }
  headerRow.querySelectorAll(".mn-dt__th").forEach((th, i) => {
    if (i === ci) {
      th.setAttribute("aria-sort", state.sortDir === 1 ? "ascending" : "descending");
      th.classList.add("mn-dt__th--sorted");
      th.classList.toggle("mn-dt__th--desc", state.sortDir === -1);
    } else {
      th.setAttribute("aria-sort", "none");
      th.classList.remove("mn-dt__th--sorted", "mn-dt__th--desc");
    }
  });
  if (onSort) onSort(key, state.sortDir === 1 ? "asc" : "desc");
  renderFn();
}
function handleFilter(key, val, state, renderFn, onFilter) {
  if (val) state.filters[key] = val;
  else delete state.filters[key];
  state.page = 0;
  if (onFilter) onFilter({ ...state.filters });
  renderFn();
}
function getProcessedData(state) {
  let rows = state.data.slice();
  const filterKeys = Object.keys(state.filters);
  if (filterKeys.length > 0) {
    rows = rows.filter(
      (row) => filterKeys.every((k) => matchFilter(row[k], state.filters[k]))
    );
  }
  if (state.sortKey !== null) {
    const sk = state.sortKey;
    const sd = state.sortDir;
    rows.sort((a, b) => compare(a[sk], b[sk], sd));
  }
  return rows;
}
function getGroupedData(rows, groupBy, groupOrder) {
  if (!groupBy) return null;
  const groups = {};
  const order = [];
  for (const row of rows) {
    const gv = String(row[groupBy] ?? "Other");
    if (!groups[gv]) {
      groups[gv] = [];
      order.push(gv);
    }
    groups[gv].push(row);
  }
  if (groupOrder) {
    order.sort((a, b) => {
      let ia = groupOrder.indexOf(a);
      let ib = groupOrder.indexOf(b);
      if (ia === -1) ia = 999;
      if (ib === -1) ib = 999;
      return ia - ib;
    });
  }
  return { groups, order };
}
function render2(state, opts, tbody, paginationEl) {
  tbody.innerHTML = "";
  const rows = getProcessedData(state);
  const grouped = getGroupedData(rows, opts.groupBy, opts.groupOrder);
  const colSpan = opts.columns.length;
  const renderFn = () => render2(state, opts, tbody, paginationEl);
  if (rows.length === 0) {
    tbody.appendChild(buildEmptyRow(opts.emptyMessage ?? "No data found", colSpan));
    buildPagination(0, paginationEl, opts.pageSize ?? 0, state, renderFn);
    return;
  }
  if (grouped !== null) {
    let rowIdx2 = 0;
    for (const gname of grouped.order) {
      const grow = grouped.groups[gname];
      const isExpanded = state.expandedGroups[gname] !== false;
      tbody.appendChild(buildGroupHeader(gname, grow.length, isExpanded, colSpan, state, renderFn));
      if (isExpanded) {
        for (const row of grow) {
          tbody.appendChild(buildRow(row, rowIdx2++, opts, state, tbody));
        }
      } else {
        rowIdx2 += grow.length;
      }
    }
    buildPagination(rows.length, paginationEl, opts.pageSize ?? 0, state, renderFn);
  } else {
    const pageSize = opts.pageSize ?? 0;
    let start = 0;
    let end = rows.length;
    if (pageSize > 0) {
      start = state.page * pageSize;
      end = Math.min(start + pageSize, rows.length);
    }
    for (let i = start; i < end; i++) {
      tbody.appendChild(buildRow(rows[i], i, opts, state, tbody));
    }
    buildPagination(rows.length, paginationEl, pageSize, state, renderFn);
  }
  announce("Table updated: " + rows.length + " rows");
}
function announce(msg) {
  const announcer = document.getElementById("mn-announcer");
  if (announcer) announcer.textContent = msg;
}

// src/ts/data-table.ts
function dataTable(container, opts) {
  const resolved = {
    data: [],
    pageSize: 0,
    selectable: true,
    crosshair: true,
    stickyHeader: true,
    compact: false,
    emptyMessage: "No data found",
    showFilters: true,
    stripedRows: false,
    resizableColumns: false,
    ...opts
  };
  let containerEl;
  if (typeof container === "string") {
    const found = document.querySelector(container);
    if (!(found instanceof HTMLElement)) return null;
    containerEl = found;
  } else {
    containerEl = container;
  }
  const state = {
    data: (resolved.data ?? []).slice(),
    sortKey: null,
    sortDir: 1,
    filters: {},
    page: 0,
    expandedGroups: {},
    selected: null,
    colHighlight: -1
  };
  containerEl.innerHTML = "";
  containerEl.classList.add("mn-dt");
  if (resolved.compact) containerEl.classList.add("mn-dt--compact");
  if (resolved.crosshair) containerEl.classList.add("mn-dt--crosshair");
  const scrollWrap = el2("div", "mn-dt__scroll");
  const table = el2("table", "mn-dt__table");
  table.setAttribute("role", "grid");
  table.setAttribute("aria-label", resolved.ariaLabel ?? "Data table");
  const thead = el2("thead", "mn-dt__head");
  const headerRow = el2("tr", "mn-dt__header-row");
  headerRow.setAttribute("role", "row");
  const filterRow = resolved.showFilters ? el2("tr", "mn-dt__filter-row") : null;
  if (filterRow) filterRow.setAttribute("role", "row");
  const tbody = el2("tbody", "mn-dt__body");
  tbody.setAttribute("role", "rowgroup");
  function doRender() {
    render2(state, resolved, tbody, paginationEl);
  }
  resolved.columns.forEach((col, ci) => {
    const th = el2("th", "mn-dt__th");
    th.setAttribute("role", "columnheader");
    th.setAttribute("scope", "col");
    th.setAttribute("data-col", String(ci));
    if (col.width) th.style.width = typeof col.width === "number" ? col.width + "px" : String(col.width);
    if (col.minWidth) th.style.minWidth = typeof col.minWidth === "number" ? col.minWidth + "px" : String(col.minWidth);
    if (col.align === "right") th.style.textAlign = "right";
    if (col.align === "center") th.style.textAlign = "center";
    const label = el2("span", "mn-dt__th-label", { text: col.label ?? col.key });
    if (col.sortable) {
      th.classList.add("mn-dt__th--sortable");
      th.setAttribute("tabindex", "0");
      th.setAttribute("aria-sort", "none");
      th.appendChild(label);
      th.appendChild(el2("span", "mn-dt__sort-icon", { html: "\u21C5" }));
      th.addEventListener("click", () => handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort));
      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSort(col.key, ci, state, headerRow, doRender, resolved.onSort);
        }
      });
    } else {
      th.appendChild(label);
    }
    headerRow.appendChild(th);
    if (filterRow) {
      const ftd = el2("th", "mn-dt__filter-cell");
      ftd.setAttribute("data-col", String(ci));
      if (col.filterable) {
        const input = el2("input", "mn-dt__filter-input");
        input.type = "text";
        input.placeholder = "Filter\u2026";
        input.setAttribute("aria-label", "Filter " + (col.label ?? col.key));
        input.addEventListener("input", () => {
          handleFilter(col.key, input.value, state, doRender, resolved.onFilter);
        });
        ftd.appendChild(input);
      }
      filterRow.appendChild(ftd);
    }
  });
  thead.appendChild(headerRow);
  if (filterRow) thead.appendChild(filterRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  scrollWrap.appendChild(table);
  containerEl.appendChild(scrollWrap);
  let paginationEl = null;
  if ((resolved.pageSize ?? 0) > 0) {
    paginationEl = el2("div", "mn-dt__pagination");
    containerEl.appendChild(paginationEl);
  }
  const colHighlightEl = el2("div", "mn-dt__col-highlight");
  colHighlightEl.style.display = "none";
  scrollWrap.appendChild(colHighlightEl);
  if (resolved.crosshair) {
    tbody.addEventListener("mousemove", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const td = target.closest("td");
      if (!td) return;
      const ci = td.cellIndex;
      if (ci !== state.colHighlight) {
        state.colHighlight = ci;
        positionColHighlight(ci, headerRow, scrollWrap, colHighlightEl);
      }
    });
    tbody.addEventListener("mouseleave", () => {
      state.colHighlight = -1;
      colHighlightEl.style.display = "none";
      const prev = tbody.querySelector(".mn-dt__row--hovered");
      if (prev) prev.classList.remove("mn-dt__row--hovered");
    });
  }
  if (resolved.groupBy) {
    for (const row of state.data) {
      const v = row[resolved.groupBy];
      if (v) state.expandedGroups[String(v)] = true;
    }
  }
  doRender();
  return {
    setData: (data) => {
      state.data = data.slice();
      state.page = 0;
      doRender();
    },
    addRow: (row) => {
      state.data.push(row);
      doRender();
    },
    removeRow: (idx) => {
      state.data.splice(idx, 1);
      doRender();
    },
    setFilter: (key, val) => handleFilter(key, val, state, doRender, resolved.onFilter),
    clearFilters: () => {
      state.filters = {};
      containerEl.querySelectorAll(".mn-dt__filter-input").forEach((inp) => {
        inp.value = "";
      });
      doRender();
    },
    setGroup: (key) => {
      resolved.groupBy = key;
      doRender();
    },
    getSelected: () => state.selected != null ? [state.data[state.selected]] : [],
    getFilteredData: () => getProcessedData(state),
    refresh: () => doRender(),
    destroy: () => {
      containerEl.innerHTML = "";
      containerEl.classList.remove("mn-dt", "mn-dt--compact", "mn-dt--crosshair");
    }
  };
}

// src/ts/date-picker.ts
var MONTHS = [
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
var DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
var activePicker = null;
function closePicker() {
  if (activePicker) {
    activePicker.remove();
    activePicker = null;
  }
  document.removeEventListener("mousedown", onDocClick);
  document.removeEventListener("keydown", onDocKey);
}
function onDocClick(e) {
  if (activePicker && e.target instanceof Node && !activePicker.contains(e.target)) closePicker();
}
function onDocKey(e) {
  if (e.key === "Escape") closePicker();
}
function pad(n) {
  return n < 10 ? "0" + n : String(n);
}
function toDateStr(y, m, d) {
  return y + "-" + pad(m + 1) + "-" + pad(d);
}
function parseVal(s) {
  if (!s) return null;
  const p = String(s).split("-");
  return { y: Number(p[0]), m: Number(p[1]) - 1, d: Number(p[2]) || 1 };
}
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDayOfWeek(y, m) {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function datePicker(anchor, opts) {
  closePicker();
  const options = opts ?? {};
  let sel = parseVal(options.value);
  let viewY = sel ? sel.y : (/* @__PURE__ */ new Date()).getFullYear();
  let viewM = sel ? sel.m : (/* @__PURE__ */ new Date()).getMonth();
  const minD = parseVal(options.min);
  const maxD = parseVal(options.max);
  const todayY = (/* @__PURE__ */ new Date()).getFullYear();
  const todayM = (/* @__PURE__ */ new Date()).getMonth();
  const todayD = (/* @__PURE__ */ new Date()).getDate();
  const picker = document.createElement("div");
  picker.className = "mn-date-picker";
  activePicker = picker;
  function isDisabled(y, m, d) {
    const ds = toDateStr(y, m, d);
    if (minD && ds < toDateStr(minD.y, minD.m, minD.d)) return true;
    if (maxD && ds > toDateStr(maxD.y, maxD.m, maxD.d)) return true;
    return false;
  }
  function renderCalendar() {
    picker.innerHTML = "";
    const nav = document.createElement("div");
    nav.className = "mn-date-picker__nav";
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "mn-date-picker__nav-btn";
    prevBtn.innerHTML = "\u25C0";
    prevBtn.title = "Previous month";
    prevBtn.addEventListener("click", () => {
      viewM--;
      if (viewM < 0) {
        viewM = 11;
        viewY--;
      }
      renderCalendar();
    });
    const title = document.createElement("span");
    title.className = "mn-date-picker__month-title";
    title.textContent = MONTHS[viewM] + " " + viewY;
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "mn-date-picker__nav-btn";
    nextBtn.innerHTML = "\u25B6";
    nextBtn.title = "Next month";
    nextBtn.addEventListener("click", () => {
      viewM++;
      if (viewM > 11) {
        viewM = 0;
        viewY++;
      }
      renderCalendar();
    });
    nav.appendChild(prevBtn);
    nav.appendChild(title);
    nav.appendChild(nextBtn);
    picker.appendChild(nav);
    const dayHeaders = document.createElement("div");
    dayHeaders.className = "mn-date-picker__days-header";
    DAYS.forEach((d) => {
      const dh = document.createElement("span");
      dh.className = "mn-date-picker__day-name";
      dh.textContent = d;
      dayHeaders.appendChild(dh);
    });
    picker.appendChild(dayHeaders);
    const grid = document.createElement("div");
    grid.className = "mn-date-picker__grid";
    const startDay = firstDayOfWeek(viewY, viewM);
    const totalDays = daysInMonth(viewY, viewM);
    for (let e = 0; e < startDay; e++) {
      const empty = document.createElement("span");
      empty.className = "mn-date-picker__day mn-date-picker__day--empty";
      grid.appendChild(empty);
    }
    for (let d = 1; d <= totalDays; d++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "mn-date-picker__day";
      cell.textContent = String(d);
      const disabled = isDisabled(viewY, viewM, d);
      if (disabled) cell.classList.add("mn-date-picker__day--disabled");
      cell.disabled = disabled;
      if (d === todayD && viewM === todayM && viewY === todayY) {
        cell.classList.add("mn-date-picker__day--today");
      }
      if (sel && d === sel.d && viewM === sel.m && viewY === sel.y) {
        cell.classList.add("mn-date-picker__day--selected");
      }
      const day = d;
      cell.addEventListener("click", () => {
        sel = { y: viewY, m: viewM, d: day };
        if (options.onSelect) options.onSelect(toDateStr(viewY, viewM, day));
        closePicker();
      });
      grid.appendChild(cell);
    }
    picker.appendChild(grid);
    const todayBtn = document.createElement("button");
    todayBtn.type = "button";
    todayBtn.className = "mn-date-picker__today-btn";
    todayBtn.textContent = "Today";
    todayBtn.addEventListener("click", () => {
      viewY = todayY;
      viewM = todayM;
      sel = { y: todayY, m: todayM, d: todayD };
      if (options.onSelect) options.onSelect(toDateStr(todayY, todayM, todayD));
      closePicker();
    });
    picker.appendChild(todayBtn);
  }
  renderCalendar();
  anchor.style.position = "relative";
  anchor.appendChild(picker);
  setTimeout(() => {
    const first = picker.querySelector(".mn-date-picker__day:not(.mn-date-picker__day--empty)");
    if (first instanceof HTMLElement) first.focus();
  }, 50);
  setTimeout(() => {
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onDocKey);
  }, 0);
  return { close: closePicker };
}

// src/ts/forms-validate.ts
var validators = {
  required: (v) => v !== null && v !== void 0 && String(v).trim() !== "",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  phone: (v) => /^[+]?[\d\s\-().]{7,20}$/.test(String(v).trim()),
  url: (v) => {
    try {
      new URL(String(v));
      return true;
    } catch {
      return false;
    }
  },
  minLength: (v, len) => String(v).length >= Number(len),
  maxLength: (v, len) => String(v).length <= Number(len),
  min: (v, min) => Number(v) >= Number(min),
  max: (v, max) => Number(v) <= Number(max),
  pattern: (v, regex) => new RegExp(regex ?? "").test(String(v)),
  match: (v, otherId) => {
    const other = otherId ? document.getElementById(otherId) : null;
    return Boolean(other) && String(v) === String(other?.value);
  }
};
var defaultMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  url: "Please enter a valid URL",
  minLength: "Must be at least {0} characters",
  maxLength: "Must be no more than {0} characters",
  min: "Must be at least {0}",
  max: "Must be no more than {0}",
  pattern: "Invalid format",
  match: "Fields do not match"
};
function getFieldInput(field) {
  return field.querySelector(
    ".mn-form-input, .mn-form-select, .mn-form-textarea"
  );
}
function validateField(field) {
  const input = getFieldInput(field);
  if (!input) return true;
  const rules = input.getAttribute("data-validate");
  if (!rules) return true;
  const value = input.value;
  const ruleList = rules.split(",").map((r) => r.trim());
  let valid = true;
  let errorMsg = "";
  for (const rule of ruleList) {
    const parts = rule.split(":");
    const ruleName = parts[0];
    const ruleParam = parts[1];
    const validator = validators[ruleName];
    if (validator && !validator(value, ruleParam)) {
      valid = false;
      const customMsg = input.getAttribute("data-msg-" + ruleName);
      errorMsg = customMsg ?? defaultMessages[ruleName] ?? "Invalid";
      if (ruleParam) errorMsg = errorMsg.replace("{0}", ruleParam);
      break;
    }
  }
  field.classList.remove("mn-field--error", "mn-field--success");
  const errorEl = field.querySelector(".mn-field__error");
  if (!valid) {
    field.classList.add("mn-field--error");
    if (errorEl) errorEl.textContent = errorMsg;
  } else if (value.length > 0) {
    field.classList.add("mn-field--success");
  }
  if (errorEl && valid) errorEl.textContent = "";
  return valid;
}
function validateForm(formEl) {
  const fields = formEl.querySelectorAll(".mn-field");
  let allValid = true;
  const errors = [];
  fields.forEach((field) => {
    if (!validateField(field)) {
      allValid = false;
      errors.push(field);
    }
  });
  if (errors.length > 0) {
    errors[0].scrollIntoView({ behavior: "smooth", block: "center" });
    getFieldInput(errors[0])?.focus();
  }
  return allValid;
}
function initLiveValidation(formOrSelector) {
  const form = typeof formOrSelector === "string" ? document.querySelector(formOrSelector) : formOrSelector;
  if (!form) return;
  form.querySelectorAll("[data-validate]").forEach((inputEl) => {
    const input = inputEl;
    const field = input.closest(".mn-field");
    if (!field) return;
    input.addEventListener("blur", () => validateField(field));
    input.addEventListener("input", () => {
      if (field.classList.contains("mn-field--error")) validateField(field);
      const counter = field.querySelector(".mn-field__counter");
      if (counter) {
        const max = input.getAttribute("maxlength") ?? input.getAttribute("data-maxlength");
        if (max) counter.textContent = input.value.length + "/" + max;
      }
    });
  });
  form.addEventListener("submit", (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
function addValidator(name, fn, message) {
  validators[name] = fn;
  if (message) defaultMessages[name] = message;
}

// src/ts/forms-widgets.ts
function initAutoResize(el4) {
  if (!el4) return;
  function resize() {
    el4.style.height = "auto";
    el4.style.height = el4.scrollHeight + "px";
  }
  el4.addEventListener("input", resize);
  resize();
}
function initTagInput(container) {
  if (!container) return null;
  const root = container;
  const field = root.querySelector(".mn-tag-input__field");
  if (!field) return null;
  let tags = [];
  function addTag(text) {
    const t = text.trim();
    if (!t || tags.indexOf(t) !== -1) return;
    tags.push(t);
    const chip = document.createElement("span");
    chip.className = "mn-tag-input__chip";
    chip.appendChild(document.createTextNode(t));
    const removeBtn = document.createElement("button");
    removeBtn.className = "mn-tag-input__chip-remove";
    removeBtn.setAttribute("aria-label", "Remove " + t);
    removeBtn.textContent = "\xD7";
    removeBtn.addEventListener("click", () => {
      tags = tags.filter((x) => x !== t);
      chip.remove();
      eventBus.emit("tag-change", { tags: tags.slice(), container: root });
    });
    chip.appendChild(removeBtn);
    root.insertBefore(chip, field);
    eventBus.emit("tag-change", { tags: tags.slice(), container: root });
  }
  field.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field.value);
      field.value = "";
    } else if (e.key === "Backspace" && field.value === "" && tags.length > 0) {
      tags.pop();
      const chips = root.querySelectorAll(".mn-tag-input__chip");
      if (chips.length > 0) chips[chips.length - 1].remove();
      eventBus.emit("tag-change", { tags: tags.slice(), container: root });
    }
  });
  root.addEventListener("click", () => field.focus());
  return {
    getTags: () => tags.slice(),
    addTag,
    setTags(arr) {
      root.querySelectorAll(".mn-tag-input__chip").forEach((c) => c.remove());
      tags = [];
      arr.forEach(addTag);
    }
  };
}
function initPasswordToggle(wrap) {
  if (!wrap) return;
  const input = wrap.querySelector(".mn-form-input");
  const toggle = wrap.querySelector(".mn-password-toggle");
  if (!input || !toggle) return;
  toggle.addEventListener("click", () => {
    const isPwd = input.type === "password";
    input.type = isPwd ? "text" : "password";
    toggle.setAttribute("aria-label", isPwd ? "Hide password" : "Show password");
    toggle.innerHTML = isPwd ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/><path d="M10.59 10.59a3 3 0 1 0 4.24 4.24"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  });
}
function initFileUpload(container) {
  if (!container) return null;
  const root = container;
  const input = root.querySelector('input[type="file"]');
  if (!input) return null;
  let files = [];
  root.addEventListener("dragover", (e) => {
    e.preventDefault();
    root.classList.add("mn-file-upload--dragover");
  });
  root.addEventListener("dragleave", () => root.classList.remove("mn-file-upload--dragover"));
  root.addEventListener("drop", (e) => {
    const de = e;
    de.preventDefault();
    root.classList.remove("mn-file-upload--dragover");
    files = Array.from(de.dataTransfer?.files ?? []);
    eventBus.emit("file-upload", { files, container: root });
    updateLabel();
  });
  input.addEventListener("change", () => {
    files = Array.from(input.files ?? []);
    eventBus.emit("file-upload", { files, container: root });
    updateLabel();
  });
  function updateLabel() {
    const textEl = root.querySelector(".mn-file-upload__text");
    if (textEl && files.length > 0) {
      textEl.innerHTML = files.length === 1 ? "<strong>" + files[0].name + "</strong>" : "<strong>" + files.length + " files</strong> selected";
    }
  }
  return {
    getFiles: () => files,
    clear() {
      files = [];
      input.value = "";
      const t = root.querySelector(".mn-file-upload__text");
      if (t) t.innerHTML = "<strong>Click to upload</strong> or drag and drop";
    }
  };
}
function initFormSteps(container) {
  if (!container) return null;
  const steps = container.querySelectorAll(".mn-form-step");
  let current = 0;
  function setStep(index) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => {
      step.classList.remove("mn-form-step--active", "mn-form-step--complete");
      if (i < current) step.classList.add("mn-form-step--complete");
      if (i === current) step.classList.add("mn-form-step--active");
    });
    eventBus.emit("form-step-change", { step: current, total: steps.length });
  }
  setStep(0);
  return {
    next: () => setStep(current + 1),
    prev: () => setStep(current - 1),
    goTo: (i) => setStep(i),
    getCurrent: () => current
  };
}
function initInlineEdit(el4) {
  if (!el4) return;
  const root = el4;
  let originalText = (root.textContent ?? "").trim();
  let editing = false;
  root.addEventListener("click", () => {
    if (editing) return;
    editing = true;
    root.classList.add("mn-inline-edit--editing");
    const input = document.createElement("input");
    input.className = "mn-form-input mn-form-input--sm";
    input.value = originalText;
    if (root instanceof HTMLElement) input.style.width = Math.max(100, root.offsetWidth) + "px";
    const icon = root.querySelector(".mn-inline-edit__icon");
    root.textContent = "";
    root.appendChild(input);
    input.focus();
    input.select();
    function save() {
      const newValue = input.value.trim();
      editing = false;
      root.classList.remove("mn-inline-edit--editing");
      root.textContent = newValue || originalText;
      originalText = root.textContent ?? "";
      if (icon) root.appendChild(icon);
      eventBus.emit("inline-edit", { el: root, value: root.textContent });
    }
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") save();
      if (e.key === "Escape") {
        input.value = originalText;
        save();
      }
    });
  });
}
function initCharCounter(field) {
  const input = field.querySelector(
    ".mn-form-input, .mn-form-textarea"
  );
  const counter = field.querySelector(".mn-field__counter");
  if (!input || !counter) return;
  const max = input.getAttribute("maxlength") ?? input.getAttribute("data-maxlength") ?? "\u221E";
  function update() {
    counter.textContent = input.value.length + "/" + max;
  }
  input.addEventListener("input", update);
  update();
}
function initSearchClear(wrap) {
  if (!wrap) return;
  const input = wrap.querySelector(".mn-form-input");
  const clearBtn = wrap.querySelector(".mn-search-input__clear");
  if (!input || !clearBtn) return;
  function toggleClear() {
    clearBtn.style.display = input.value ? "flex" : "none";
  }
  input.addEventListener("input", toggleClear);
  clearBtn.addEventListener("click", () => {
    input.value = "";
    toggleClear();
    input.focus();
    eventBus.emit("search-clear", { input });
  });
  toggleClear();
}

// src/ts/forms.ts
function qsa(root, ...sels) {
  return root.querySelectorAll(sels.join(","));
}
function initForms(root = document) {
  qsa(root, "[data-mn-validate]", ".mn-form[data-live-validate]").forEach(
    (form) => initLiveValidation(form)
  );
  qsa(root, "[data-mn-autoresize]", ".mn-form-textarea--auto").forEach(
    (el4) => initAutoResize(el4)
  );
  qsa(root, "[data-mn-tags]", ".mn-tag-input").forEach(
    (el4) => initTagInput(el4)
  );
  qsa(root, "[data-mn-password-toggle]", ".mn-password-wrap").forEach(
    (el4) => initPasswordToggle(el4)
  );
  qsa(root, "[data-mn-file-upload]", ".mn-file-upload").forEach(
    (el4) => initFileUpload(el4)
  );
  qsa(root, "[data-mn-steps]", ".mn-form-steps").forEach(
    (el4) => initFormSteps(el4)
  );
  qsa(root, "[data-mn-inline-edit]", ".mn-inline-edit").forEach(
    (el4) => initInlineEdit(el4)
  );
  qsa(root, "[data-mn-char-counter]", ".mn-field__counter").forEach(
    (el4) => initCharCounter(el4)
  );
  qsa(root, "[data-mn-search-clear]", ".mn-search-input").forEach(
    (el4) => initSearchClear(el4)
  );
}
var forms = {
  init: initForms,
  initAll: initForms,
  validate: validateForm,
  validateField,
  initLiveValidation,
  addValidator,
  get validators() {
    return validators;
  },
  get defaultMessages() {
    return defaultMessages;
  },
  initAutoResize,
  initTagInput,
  initPasswordToggle,
  initFileUpload,
  initFormSteps,
  initInlineEdit,
  initCharCounter,
  initSearchClear
};

// src/ts/funnel-helpers.ts
function hexLum2(hex) {
  let h = (hex || "#888888").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function autoTextColor(bg) {
  return hexLum2(bg) > 0.35 ? "#111" : "#fff";
}
function resolveContainer3(c) {
  if (typeof c === "string") return document.querySelector(c);
  return c instanceof Element ? c : null;
}
function svgEl(tag, attrs) {
  const el4 = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) el4.setAttribute(k, String(attrs[k]));
  }
  return el4;
}
function svgText(attrs, text) {
  const el4 = svgEl("text", attrs);
  el4.textContent = text;
  return el4;
}
function trapPath(x1, w1, x2, w2, y1, y2) {
  const l1 = x1, r1 = x1 + w1, l2 = x2, r2 = x2 + w2, my = (y1 + y2) / 2;
  return "M" + l1 + "," + y1 + " C" + l1 + "," + my + " " + l2 + "," + my + " " + l2 + "," + y2 + " L" + r2 + "," + y2 + " C" + r2 + "," + my + " " + r1 + "," + my + " " + r1 + "," + y1 + " Z";
}
function cumulativeReach(counts) {
  const reach = new Array(counts.length);
  let sum = 0;
  for (let i = counts.length - 1; i >= 0; i--) {
    sum += counts[i];
    reach[i] = sum;
  }
  return reach;
}

// src/ts/funnel.ts
var BAR_H = 38;
var GAP = 24;
var RAD = 6;
var VB_W = 420;
var PAD = 16;
var MIN_BAR = 0.35;
var EXIT_R = 12;
var EXIT_GAP = 6;
var PIPE_L = 80;
var PIPE_R = 340;
var PIPE_W = PIPE_R - PIPE_L;
function funnel(container, options) {
  const target = resolveContainer3(container);
  if (!target) throw new Error("funnel: container not found.");
  const host = target;
  const opts = { animate: true, ...options };
  let destroyed = false;
  const root = document.createElement("div");
  root.className = "mn-funnel";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "Pipeline funnel");
  function render3(data) {
    if (destroyed) return;
    root.innerHTML = "";
    if (!data || !data.pipeline || !data.pipeline.length) {
      root.innerHTML = '<p class="mn-funnel__empty">No pipeline stages available.</p>';
      return;
    }
    const pipe = data.pipeline;
    const maxC = Math.max(...pipe.map((s) => s.count || 1));
    const total = data.total || pipe.reduce((a, s) => a + s.count, 0);
    const reach = cumulativeReach(pipe.map((s) => s.count));
    const rows = pipe.length;
    const svgH = PAD * 2 + rows * BAR_H + (rows - 1) * GAP;
    const svg = svgEl("svg", { viewBox: "0 0 " + VB_W + " " + svgH, preserveAspectRatio: "xMidYMid meet" });
    svg.style.width = "100%";
    svg.style.height = "auto";
    pipe.forEach((stage, i) => {
      const barW = Math.max(PIPE_W * MIN_BAR, stage.count / maxC * PIPE_W);
      const barX = PIPE_L + (PIPE_W - barW) / 2;
      const y = PAD + i * (BAR_H + GAP);
      if (i < rows - 1) {
        const ns = pipe[i + 1];
        const nW = Math.max(PIPE_W * MIN_BAR, ns.count / maxC * PIPE_W);
        const nX = PIPE_L + (PIPE_W - nW) / 2;
        svg.appendChild(svgEl("path", { d: trapPath(barX, barW, nX, nW, y + BAR_H, y + BAR_H + GAP), fill: stage.color, opacity: "0.12" }));
        const rate = reach[i] > 0 ? Math.round(reach[i + 1] / reach[i] * 100) : 0;
        svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + BAR_H + GAP / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": 9, "font-family": "'Barlow Condensed',sans-serif", fill: "var(--grigio-medio,#777)", "font-weight": "500" }, "\u2193 " + rate + "%"));
      }
      const bar = svgEl("rect", { x: barX, y, width: barW, height: BAR_H, rx: RAD, fill: stage.color });
      bar.classList.add("mn-funnel__bar");
      bar.setAttribute("data-stage", stage.label);
      if (opts.animate) {
        bar.style.opacity = "0";
        bar.style.transform = "translateX(-12px)";
      }
      svg.appendChild(bar);
      const tc = autoTextColor(stage.color);
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + 14, "text-anchor": "middle", "font-size": 11, "font-family": "'Inter',sans-serif", fill: tc, "font-weight": "600" }, stage.label));
      let cTxt = String(stage.count);
      if (total > 0) cTxt += " (" + Math.round(stage.count / total * 100) + "%)";
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + 29, "text-anchor": "middle", "font-size": 14, "font-family": "'Barlow Condensed',sans-serif", fill: tc, "font-weight": "700" }, cTxt));
      if (stage.holdCount && stage.holdCount > 0) renderExitPill(svg, barX, y, "left", stage.holdCount, data.onHold?.color || "#ea580c", "\u23F8");
      if (stage.withdrawnCount && stage.withdrawnCount > 0) renderExitPill(svg, barX + barW, y, "right", stage.withdrawnCount, data.withdrawn?.color || "#666", "\u2715");
      if (opts.onClick) {
        const hit = svgEl("rect", { x: barX, y, width: barW, height: BAR_H, fill: "transparent", cursor: "pointer" });
        hit.addEventListener("click", () => {
          if (opts.onClick) opts.onClick(stage);
        });
        svg.appendChild(hit);
      }
      if (opts.animate) {
        setTimeout(() => {
          bar.style.transition = "opacity 0.35s ease, transform 0.35s ease";
          bar.style.opacity = "1";
          bar.style.transform = "none";
        }, 60 * i + 30);
      }
    });
    const legendY = svgH - 4;
    if (data.onHold && data.onHold.count > 0) {
      svg.appendChild(svgEl("circle", { cx: PIPE_L, cy: legendY, r: 4, fill: data.onHold.color, opacity: "0.8" }));
      svg.appendChild(svgText({ x: PIPE_L + 8, y: legendY + 3, "font-size": 9, "font-family": "'Inter',sans-serif", fill: "var(--grigio-medio,#999)", "font-weight": "500" }, "\u23F8 On Hold: " + data.onHold.count));
    }
    if (data.withdrawn && data.withdrawn.count > 0) {
      svg.appendChild(svgEl("circle", { cx: PIPE_L + PIPE_W / 2 + 20, cy: legendY, r: 4, fill: data.withdrawn.color, opacity: "0.8" }));
      svg.appendChild(svgText({ x: PIPE_L + PIPE_W / 2 + 28, y: legendY + 3, "font-size": 9, "font-family": "'Inter',sans-serif", fill: "var(--grigio-medio,#999)", "font-weight": "500" }, "\u2715 Withdrawn: " + data.withdrawn.count));
    }
    root.appendChild(svg);
  }
  function renderExitPill(svg, anchorX, barY, side, count, color, icon) {
    const isLeft = side === "left";
    const cy = barY + BAR_H / 2;
    const pillX = isLeft ? anchorX - EXIT_GAP - EXIT_R * 2 - 20 : anchorX + EXIT_GAP;
    const lineEnd = isLeft ? pillX + EXIT_R * 2 + 20 : pillX;
    svg.appendChild(svgEl("line", { x1: anchorX, y1: cy, x2: lineEnd, y2: cy, stroke: color, "stroke-width": "1.5", "stroke-dasharray": "3 2", opacity: "0.5" }));
    const pw = EXIT_R * 2 + 20, ph = 20;
    svg.appendChild(svgEl("rect", { x: pillX, y: cy - ph / 2, width: pw, height: ph, rx: ph / 2, fill: color, opacity: "0.18" }));
    svg.appendChild(svgText({ x: pillX + pw / 2, y: cy + 3.5, "text-anchor": "middle", "font-size": 10, "font-family": "'Barlow Condensed',sans-serif", fill: color, "font-weight": "600" }, icon + " " + count));
  }
  host.innerHTML = "";
  host.appendChild(root);
  render3(opts.data);
  return {
    update: (d) => {
      render3(d);
    },
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      root.innerHTML = "";
      if (root.parentNode === host) host.removeChild(root);
    }
  };
}

// src/ts/okr-panel-utils.ts
var STATUS_COLORS2 = {
  "on-track": cssVar("--signal-ok", "#00A651"),
  "at-risk": cssVar("--signal-warning", "#FFC72C"),
  behind: cssVar("--signal-danger", "#DC0000")
};
var SCOPE_COLORS = {
  LOCAL: cssVar("--scope-local", "#4EA8DE"),
  TEAM: cssVar("--scope-team", "#7C3AED"),
  GLOBAL: cssVar("--scope-global", "#FFC72C")
};
function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pct(current, target) {
  const c = safeNumber(current), t = safeNumber(target);
  return t <= 0 ? 0 : clamp(c / t * 100, 0, 100);
}
function statusFromProgress(p) {
  const v = safeNumber(p);
  return v >= 75 ? "on-track" : v >= 40 ? "at-risk" : "behind";
}
function statusLabel(s) {
  return s === "on-track" ? "ON TRACK" : s === "at-risk" ? "AT RISK" : "BEHIND";
}
function formatKR(current, target, unit) {
  return String(current) + "/" + String(target) + (unit || "");
}
function el3(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.keys(attrs).forEach((key) => {
    if (key === "text") node.textContent = attrs[key];
    else if (key === "html") node.innerHTML = attrs[key];
    else node.setAttribute(key, attrs[key]);
  });
  return node;
}
function describeArc(cx, cy, r, sa, ea) {
  const x1 = cx + Math.cos(sa) * r, y1 = cy + Math.sin(sa) * r;
  const x2 = cx + Math.cos(ea) * r, y2 = cy + Math.sin(ea) * r;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${ea - sa > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
function ringTemplate(size, stroke, percent, color, centerText, trackClass, progressClass) {
  const radius = (size - stroke) / 2, cx = size / 2;
  const circ = 2 * Math.PI * radius;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const off2 = circ - bounded / 100 * circ;
  let svg = `<svg class="mn-okr__ring" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="${trackClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}"></circle><circle class="${progressClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}" stroke="${color}" data-circumference="${circ.toFixed(2)}" data-target-offset="${off2.toFixed(2)}" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${circ.toFixed(2)}"></circle>`;
  if (centerText != null) svg += `<text class="mn-okr__ring-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${centerText}</text>`;
  return svg + "</svg>";
}
function heroGaugeSVG(percent, color) {
  const w = 240, h = 140, cx = w / 2, cy = h - 10, r = 100;
  const startAngle = Math.PI;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const needleAngle = startAngle + bounded / 100 * Math.PI;
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const a = startAngle + i / 10 * Math.PI;
    const isMajor = i % 2 === 0, len = isMajor ? 14 : 8;
    const x1 = cx + Math.cos(a) * (r - len), y1 = cy + Math.sin(a) * (r - len);
    const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
    ticks.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}" stroke-width="${isMajor ? 2 : 1}"/>`);
    if (isMajor) {
      const lx = cx + Math.cos(a) * (r - 22), ly = cy + Math.sin(a) * (r - 22);
      ticks.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.45)" font-size="9" font-family="var(--font-mono)">${i * 10}</text>`);
    }
  }
  const trackPath = describeArc(cx, cy, r, startAngle, 2 * Math.PI);
  const progressEnd = startAngle + bounded / 100 * Math.PI;
  const progressPath = describeArc(cx, cy, r, startAngle, progressEnd);
  const nx = cx + Math.cos(needleAngle) * (r - 28), ny = cy + Math.sin(needleAngle) * (r - 28);
  return `<svg class="mn-okr__gauge" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><filter id="okr-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" stroke-linecap="round"/><path class="mn-okr__gauge-progress" d="${progressPath}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" filter="url(#okr-glow)" stroke-dasharray="${(Math.PI * r).toFixed(1)}" stroke-dashoffset="${(Math.PI * r).toFixed(1)}" data-target="0"/>` + ticks.join("") + `<line class="mn-okr__needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" filter="url(#okr-glow)" data-cx="${cx}" data-cy="${cy}" data-r="${r - 28}" data-target-angle="${needleAngle.toFixed(4)}"/><circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#111"/></svg>`;
}
function animateRings(container) {
  const rings = Array.from(container.querySelectorAll(".mn-okr__ring-progress"));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => {
      ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute("data-target-offset")));
    });
  });
}
function animateSummaryRings(container) {
  const rings = Array.from(container.querySelectorAll(".mn-okr__summary-ring"));
  if (!rings.length) return;
  requestAnimationFrame(() => {
    rings.forEach((ring) => {
      ring.style.strokeDashoffset = String(safeNumber(ring.getAttribute("data-target")));
    });
  });
}
function animateBars(container) {
  const bars = Array.from(container.querySelectorAll(".mn-okr__kr-bar"));
  if (!bars.length) return;
  requestAnimationFrame(() => {
    bars.forEach((bar) => {
      bar.style.width = clamp(safeNumber(bar.dataset.target), 0, 100) + "%";
    });
  });
}
function animateGauge(container) {
  const progress = container.querySelector(".mn-okr__gauge-progress");
  const needle = container.querySelector(".mn-okr__needle");
  if (!progress) return;
  requestAnimationFrame(() => {
    progress.style.strokeDashoffset = "0";
    progress.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.2, 1, 0.2, 1)";
    if (!needle) return;
    const ncx = parseFloat(needle.getAttribute("data-cx") || "0");
    const ncy = parseFloat(needle.getAttribute("data-cy") || "0");
    const nr = parseFloat(needle.getAttribute("data-r") || "0");
    const targetAngle = parseFloat(needle.getAttribute("data-target-angle") || String(Math.PI));
    const sa = Math.PI;
    needle.setAttribute("x2", (ncx + Math.cos(sa) * nr).toFixed(1));
    needle.setAttribute("y2", (ncy + Math.sin(sa) * nr).toFixed(1));
    let start = null;
    const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      const a = sa + (1 - Math.pow(1 - t, 3)) * (targetAngle - sa);
      needle.setAttribute("x2", (ncx + Math.cos(a) * nr).toFixed(1));
      needle.setAttribute("y2", (ncy + Math.sin(a) * nr).toFixed(1));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// src/ts/okr-panel-cards.ts
function normalizeObjective(item) {
  const obj = item || {};
  const progress = clamp(safeNumber(obj.progress), 0, 100);
  const status = obj.status || statusFromProgress(progress);
  const keyResults = Array.isArray(obj.keyResults) ? obj.keyResults : [];
  return {
    title: obj.title || "Untitled objective",
    scope: obj.scope || "LOCAL",
    progress,
    status,
    keyResults
  };
}
function calculateStats(objectives) {
  const counts = { "on-track": 0, "at-risk": 0, behind: 0 };
  let total = 0;
  objectives.forEach((o) => {
    counts[statusFromProgress(o.progress)] += 1;
    total += o.progress;
  });
  const average = objectives.length ? total / objectives.length : 0;
  return { counts, average: clamp(average, 0, 100) };
}
function createSummaryCard(status, count, description, total) {
  const color = STATUS_COLORS2[status] || "#00A651";
  const p = total > 0 ? count / total * 100 : 0;
  const card = el3("div", `mn-okr__summary-card mn-okr__summary-card--${status}`);
  const arcWrap = el3("div", "mn-okr__summary-arc");
  const sz = 64, sw = 5, r = (sz - sw) / 2, cx = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - p / 100 * circ;
  arcWrap.innerHTML = `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/><circle class="mn-okr__summary-ring" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}" data-target="${offset.toFixed(1)}" transform="rotate(-90,${cx},${cx})" style="filter:drop-shadow(0 0 6px ${color}40);transition:stroke-dashoffset 900ms cubic-bezier(0.2,1,0.2,1)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-family="var(--font-mono)" font-size="18" font-weight="700">${count}</text></svg>`;
  const info = el3("div", "mn-okr__summary-info");
  const head = el3("div", "mn-okr__summary-head");
  head.appendChild(el3("span", `mn-okr__status-dot mn-okr__status-dot--${status}`));
  head.appendChild(el3("span", "mn-okr__summary-label", { text: statusLabel(status) }));
  info.appendChild(head);
  info.appendChild(el3("div", "mn-okr__summary-threshold", { text: description }));
  card.appendChild(arcWrap);
  card.appendChild(info);
  return card;
}
function createHero(stats, period) {
  const status = statusFromProgress(stats.average);
  const color = STATUS_COLORS2[status];
  const section = el3("section", "mn-okr__hero");
  const gaugeBlock = el3("div", "mn-okr__gauge-wrap");
  gaugeBlock.innerHTML = heroGaugeSVG(stats.average, color);
  const gaugeValue = el3("div", "mn-okr__gauge-value", { text: Math.round(stats.average) + "%" });
  gaugeValue.style.color = color;
  gaugeBlock.appendChild(gaugeValue);
  const avgBlock = el3("div", "mn-okr__average");
  avgBlock.appendChild(el3("div", "mn-okr__average-label", { text: "Average completion" }));
  const avgVal = el3("div", "mn-okr__average-value", { text: Math.round(stats.average) + "%" });
  avgVal.style.color = color;
  avgBlock.appendChild(avgVal);
  const badge = el3("div", `mn-okr__status-badge mn-okr__status-badge--${status}`, { text: statusLabel(status) });
  badge.style.setProperty("--badge-color", color);
  avgBlock.appendChild(badge);
  avgBlock.appendChild(el3("span", "mn-okr__period-tag", { text: period || "Current period" }));
  section.appendChild(gaugeBlock);
  section.appendChild(avgBlock);
  return section;
}
function createKRRow(kr, objectiveStatus) {
  const current = safeNumber(kr.current), target = safeNumber(kr.target);
  const completion = pct(current, target);
  const status = statusFromProgress(completion);
  const row = el3("li", "mn-okr__kr");
  const top = el3("div", "mn-okr__kr-head");
  top.appendChild(el3("span", "mn-okr__kr-title", { text: kr.title || "Untitled KR" }));
  top.appendChild(el3("span", "mn-okr__kr-metric", { text: formatKR(current, target, kr.unit || "") }));
  const track = el3("div", "mn-okr__kr-track");
  const bar = el3("div", `mn-okr__kr-bar mn-okr__kr-bar--${status}`);
  bar.dataset.target = completion.toFixed(2);
  bar.style.width = "0%";
  track.appendChild(bar);
  row.appendChild(top);
  row.appendChild(track);
  if (objectiveStatus === "behind") row.classList.add("mn-okr__kr--urgent");
  return row;
}
function createObjectiveCard(objective, index) {
  const scopeColor = SCOPE_COLORS[objective.scope] || (getComputedStyle(document.documentElement).getPropertyValue("--scope-local").trim() || "#4EA8DE");
  const status = objective.status in STATUS_COLORS2 ? objective.status : statusFromProgress(objective.progress);
  const card = el3("article", `mn-okr__objective mn-okr__objective--${status}`, {
    role: "article",
    "aria-label": `${objective.title} status ${status.replace("-", " ")}`
  });
  card.style.setProperty("--mn-okr-scope", scopeColor);
  card.style.setProperty("--mn-okr-status", STATUS_COLORS2[status]);
  card.style.animationDelay = index * 45 + "ms";
  const header = el3("div", "mn-okr__objective-header");
  const left = el3("div", "mn-okr__objective-main");
  left.appendChild(el3("span", "mn-okr__scope-badge", { text: objective.scope }));
  left.appendChild(el3("h3", "mn-okr__objective-title", { text: objective.title }));
  const right = el3("div", "mn-okr__objective-ring-wrap");
  right.innerHTML = ringTemplate(
    56,
    6,
    objective.progress,
    STATUS_COLORS2[status],
    Math.round(objective.progress) + "%",
    "mn-okr__ring-track",
    "mn-okr__ring-progress"
  );
  header.appendChild(left);
  header.appendChild(right);
  const krList = el3("ul", "mn-okr__kr-list");
  objective.keyResults.forEach((kr) => krList.appendChild(createKRRow(kr, status)));
  card.appendChild(header);
  card.appendChild(krList);
  return card;
}

// src/ts/okr-panel.ts
function okrPanel(container, opts) {
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) return null;
  const el_host = host;
  const title = opts?.title ?? "OKR Dashboard";
  const period = opts?.period ?? "";
  let objectives = (opts?.objectives ?? []).map(normalizeObjective);
  function render3() {
    el_host.innerHTML = "";
    const root = el3("div", "mn-okr");
    const header = el3("div", "mn-okr__header");
    header.appendChild(el3("h2", "mn-okr__title", { text: title }));
    root.appendChild(header);
    const stats = calculateStats(objectives);
    root.appendChild(createHero(stats, period));
    const summaryRow = el3("div", "mn-okr__summary-row");
    const total = objectives.length;
    const descriptions = {
      "on-track": "\u2265 75% progress",
      "at-risk": "40-74% progress",
      behind: "< 40% progress"
    };
    ["on-track", "at-risk", "behind"].forEach((s) => {
      summaryRow.appendChild(createSummaryCard(s, stats.counts[s], descriptions[s], total));
    });
    root.appendChild(summaryRow);
    const grid = el3("div", "mn-okr__grid");
    objectives.forEach((obj, i) => grid.appendChild(createObjectiveCard(obj, i)));
    root.appendChild(grid);
    el_host.appendChild(root);
    requestAnimationFrame(() => {
      animateRings(root);
      animateSummaryRings(root);
      animateBars(root);
      animateGauge(root);
    });
  }
  render3();
  return {
    update(newObjectives) {
      objectives = newObjectives.map(normalizeObjective);
      render3();
    },
    destroy() {
      el_host.innerHTML = "";
    }
  };
}

// src/ts/observers.ts
function initGauges(opts) {
  const selector = opts?.selector ?? ".mn-gauge__canvas";
  const threshold = opts?.threshold ?? 0.2;
  const instances = [];
  document.querySelectorAll(selector).forEach((canvas) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge = new FerrariGauge(canvas);
            instances.push(gauge);
            obs.unobserve(canvas);
          }
        });
      },
      { threshold }
    );
    obs.observe(canvas);
  });
  return instances;
}
function initScrollReveal(opts) {
  const selector = opts?.selector ?? ".mn-reveal";
  const threshold = opts?.threshold ?? 0.1;
  const rootMargin = opts?.rootMargin ?? "0px 0px -50px 0px";
  const visibleClass = opts?.visibleClass ?? "mn-reveal--visible";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
        }
      });
    },
    { threshold, rootMargin }
  );
  document.querySelectorAll(selector).forEach((el4) => observer.observe(el4));
}
function initNavTracking(opts) {
  const sectionSelector = opts?.sectionSelector ?? "section[id]";
  const linkSelector = opts?.linkSelector ?? ".mn-nav__link";
  const offsetPx = opts?.offsetPx ?? 100;
  const activeClass = opts?.activeClass ?? "mn-nav__link--active";
  const sections = document.querySelectorAll(sectionSelector);
  const navLinks = document.querySelectorAll(linkSelector);
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offsetPx) {
        current = section.getAttribute("id") ?? "";
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        activeClass,
        link.getAttribute("href") === `#${current}`
      );
    });
  });
}
function linearize(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relativeLuminance(bgColor) {
  const matches = bgColor.match(/\d+/g);
  if (!matches || matches.length < 3) return null;
  const r = linearize(parseInt(matches[0], 10) / 255);
  const g = linearize(parseInt(matches[1], 10) / 255);
  const b = linearize(parseInt(matches[2], 10) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function autoContrast(selector, threshold = 0.35) {
  document.querySelectorAll(selector).forEach((el4) => {
    const bg = getComputedStyle(el4).backgroundColor;
    const lum = relativeLuminance(bg);
    if (lum === null) return;
    if (el4 instanceof HTMLElement) {
      el4.style.color = lum > threshold ? "#111" : "rgba(255,255,255,0.95)";
      el4.style.textShadow = lum > threshold ? "none" : "0 1px 3px rgba(0,0,0,0.5)";
    }
  });
}

// src/ts/gauge-engine-class.ts
var GAUGE_SIZES = {
  sm: 120,
  md: 220,
  lg: 320
};
function resolveCanvas(target) {
  if (typeof target === "string") {
    const el4 = document.querySelector(target);
    return el4 instanceof HTMLCanvasElement ? el4 : null;
  }
  return target instanceof HTMLCanvasElement ? target : null;
}
function createGauge(opts) {
  const canvas = resolveCanvas(opts.target);
  if (!canvas) return null;
  if (opts.config) {
    canvas.dataset.gauge = JSON.stringify(opts.config);
  }
  if (opts.size) {
    canvas.dataset.size = opts.size;
  }
  return new FerrariGauge(canvas);
}
function createGaugesInContainer(container = document.body, selector = ".mn-gauge__canvas") {
  const root = typeof container === "string" ? document.querySelector(container) : container;
  if (!root) return [];
  const entries = [];
  root.querySelectorAll(selector).forEach((canvas) => {
    const gauge = new FerrariGauge(canvas);
    entries.push({ gauge, canvas });
  });
  return entries;
}
function redrawAll(entries) {
  for (const entry of entries) {
    entry.gauge.redraw();
  }
}
function reinitAll(entries) {
  for (const entry of entries) {
    entry.gauge.init();
  }
}

// src/ts/speedometer-palette.ts
var SPEEDO_FONT = "'Barlow Condensed', 'Outfit', sans-serif";
var SPEEDO_SIZES = { sm: 120, md: 220, lg: 320 };
var SWEEP2 = Math.PI * 1.5;
var START2 = Math.PI * 0.75;
function easeOutCubic2(t) {
  return 1 - Math.pow(1 - t, 3);
}
function valueToAngle(v, max) {
  return START2 + Math.min(Math.max(v, 0), max) / max * SWEEP2;
}
function speedoPalette2() {
  const cl = document.body.classList;
  const isCB = cl.contains("mn-colorblind");
  const isNero = cl.contains("mn-nero");
  const D = {
    needle: null,
    arc: null,
    barStops: null,
    bg: ["#0d0d0d", "#1a1a1a", "#2c2c2c"],
    border: "#3a3a3a",
    minorTick: "#444",
    majStroke: "#aaa",
    majText: "#c8c8c8",
    capFill: "#2a2a2a",
    capStroke: "#555",
    value: "#fafafa",
    unit: "#888",
    subLabel: "#666",
    barBg: "#1a1a1a",
    barDim: "#666",
    barBright: "#aaa"
  };
  if (isCB) {
    return {
      ...D,
      needle: "#4D9DE0",
      arc: "#7EC8E3",
      barStops: ["#E15759", "#EDC948", "#59A14F"]
    };
  }
  if (isNero) {
    return {
      ...D,
      bg: ["#050505", "#111", "#1a1a1a"],
      border: "#2a2a2a",
      minorTick: "#333",
      capFill: "#1a1a1a",
      capStroke: "#444",
      barBg: "#111"
    };
  }
  return D;
}

// src/ts/speedometer-draw.ts
function drawSpeedometer(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, opts) {
  const p = speedoPalette2();
  const needleCol = p.needle || opts.needleColor;
  const arcCol = p.arc || opts.arcColor;
  ctx.save();
  ctx.clearRect(0, 0, dim, dim);
  drawBackground(ctx, cx, cy, R, s, p);
  drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts);
  drawTicks2(ctx, cx, cy, R, s, p, opts);
  drawMajorTicks(ctx, cx, cy, R, s, p, opts);
  drawNeedle2(ctx, cx, cy, R, s, curAngle, needleCol);
  drawCenterCap(ctx, cx, cy, s, p);
  drawValueText(ctx, cx, cy, s, curVal, p, opts);
  if (opts.bar) drawBarIndicator(ctx, cx, cy, R, s, barVal, p, opts.bar);
  ctx.restore();
}
function drawBackground(ctx, cx, cy, R, s, p) {
  const bg = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.15);
  bg.addColorStop(0, p.bg[0]);
  bg.addColorStop(0.82, p.bg[1]);
  bg.addColorStop(1, p.bg[2]);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}
function drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts) {
  const aEnd = opts.arcEnd != null ? opts.arcEnd : curVal;
  if (aEnd <= opts.arcStart) return;
  ctx.beginPath();
  ctx.arc(
    cx,
    cy,
    R * 1.03,
    valueToAngle(opts.arcStart, opts.max),
    valueToAngle(aEnd, opts.max)
  );
  ctx.strokeStyle = arcCol;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.lineCap = "butt";
}
function drawTicks2(ctx, cx, cy, R, s, p, opts) {
  const tOut = R * 0.95;
  const minL = 6 * s;
  const segs = opts.ticks.length - 1;
  const totalMinor = segs * (opts.minorTicks + 1);
  ctx.strokeStyle = p.minorTick;
  ctx.lineWidth = 1 * s;
  for (let i = 0; i <= totalMinor; i++) {
    const mv = i / totalMinor * opts.max;
    if (opts.ticks.indexOf(Math.round(mv)) !== -1) continue;
    const ma = valueToAngle(mv, opts.max);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ma) * tOut, cy + Math.sin(ma) * tOut);
    ctx.lineTo(cx + Math.cos(ma) * (tOut - minL), cy + Math.sin(ma) * (tOut - minL));
    ctx.stroke();
  }
}
function drawMajorTicks(ctx, cx, cy, R, s, p, opts) {
  const tOut = R * 0.95;
  const majL = 12 * s;
  ctx.strokeStyle = p.majStroke;
  ctx.lineWidth = 2.5 * s;
  ctx.fillStyle = p.majText;
  ctx.font = "bold " + Math.round(11 * s) + "px " + SPEEDO_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const tv of opts.ticks) {
    const ta = valueToAngle(tv, opts.max);
    const c1 = Math.cos(ta), s1 = Math.sin(ta);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * tOut, cy + s1 * tOut);
    ctx.lineTo(cx + c1 * (tOut - majL), cy + s1 * (tOut - majL));
    ctx.stroke();
    ctx.fillText(
      String(tv),
      cx + c1 * (tOut - majL - 10 * s),
      cy + s1 * (tOut - majL - 10 * s)
    );
  }
}
function drawNeedle2(ctx, cx, cy, R, s, curAngle, needleCol) {
  const nLen = R * 0.78, nTail = R * 0.18, nW = 4 * s;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(curAngle);
  ctx.beginPath();
  ctx.moveTo(nLen, 0);
  ctx.lineTo(-nTail, -nW);
  ctx.lineTo(-nTail, nW);
  ctx.closePath();
  ctx.fillStyle = needleCol;
  ctx.shadowColor = needleCol;
  ctx.shadowBlur = 8 * s;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}
function drawCenterCap(ctx, cx, cy, s, p) {
  ctx.beginPath();
  ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
  ctx.fillStyle = p.capFill;
  ctx.fill();
  ctx.strokeStyle = p.capStroke;
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();
}
function drawValueText(ctx, cx, cy, s, curVal, p, opts) {
  ctx.fillStyle = p.value;
  ctx.font = "bold " + Math.round(32 * s) + "px " + SPEEDO_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(curVal)), cx, cy + 20 * s);
  ctx.fillStyle = p.unit;
  ctx.font = Math.round(11 * s) + "px " + SPEEDO_FONT;
  ctx.fillText(opts.unit, cx, cy + 37 * s);
  if (opts.subLabel) {
    ctx.fillStyle = p.subLabel;
    ctx.font = Math.round(9 * s) + "px " + SPEEDO_FONT;
    ctx.fillText(opts.subLabel, cx, cy + 50 * s);
  }
}
function drawBarIndicator(ctx, cx, cy, R, s, barVal, p, bar) {
  const bW = R * 1.2, bH = 6 * s, bR = bH / 2;
  const bX = cx - bW / 2, bY = cy + R * 0.72;
  const stops = p.barStops || bar.colorStops || [
    cssVar("--signal-danger", "#DC0000"),
    cssVar("--signal-warning", "#FFC72C"),
    cssVar("--signal-ok", "#00A651")
  ];
  ctx.beginPath();
  ctx.roundRect?.(bX, bY, bW, bH, bR);
  ctx.fillStyle = p.barBg;
  ctx.fill();
  const fW = bW * Math.max(0, Math.min(1, barVal));
  if (fW > 1) {
    const gr = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c));
    ctx.save();
    ctx.beginPath();
    ctx.roundRect?.(bX, bY, fW, bH, bR);
    ctx.clip();
    ctx.fillStyle = gr;
    ctx.fillRect(bX, bY, bW, bH);
    ctx.restore();
  }
  ctx.font = Math.round(8 * s) + "px " + SPEEDO_FONT;
  ctx.textBaseline = "top";
  const lY = bY + bH + 3 * s;
  if (bar.labelLeft) {
    ctx.fillStyle = p.barDim;
    ctx.textAlign = "left";
    ctx.fillText(bar.labelLeft, bX, lY);
  }
  if (bar.labelRight) {
    ctx.fillStyle = p.barDim;
    ctx.textAlign = "right";
    ctx.fillText(bar.labelRight, bX + bW, lY);
  }
  if (bar.label) {
    ctx.fillStyle = p.barBright;
    ctx.textAlign = "center";
    ctx.fillText(bar.label, cx, lY);
  }
}

// src/ts/h-bar-chart-draw.ts
function hexLum3(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function createEl2(tag, cls, text) {
  const el4 = document.createElement(tag);
  if (cls) el4.className = cls;
  if (text != null) el4.textContent = text;
  return el4;
}
function clampVal2(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function normalizeHex2(color) {
  if (typeof color !== "string") return cssVar("--chart-bar", "#4EA8DE");
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return cssVar("--chart-bar", "#4EA8DE");
}
function buildTicks2(maxValue) {
  const ticks = [];
  const step = maxValue / 4;
  for (let i = 0; i <= 4; i++) ticks.push(Math.round(step * i * 100) / 100);
  return ticks;
}
function cleanupTimers(state) {
  while (state.timers.length) {
    const t = state.timers.pop();
    if (t != null) window.clearTimeout(t);
  }
}
function addListener(state, el4, evt, handler) {
  el4.addEventListener(evt, handler);
  state.listeners.push({ el: el4, evt, handler });
}
function showTip2(tooltip, frame, text, evt) {
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
function hideTip2(tooltip) {
  tooltip.classList.remove("is-visible");
}
function normalizeBars(bars, sortDescending) {
  const result = bars.map((bar, idx) => ({
    label: bar?.label != null ? String(bar.label) : "Item " + (idx + 1),
    value: Number(bar?.value ?? 0),
    color: normalizeHex2(bar?.color)
  }));
  if (sortDescending) result.sort((a, b) => b.value - a.value);
  return result;
}
function renderHBar(ctx) {
  const { state } = ctx;
  if (state.disposed) return;
  cleanupTimers(state);
  ctx.rowsLayer.innerHTML = "";
  ctx.gridLayer.innerHTML = "";
  ctx.axisLabels.innerHTML = "";
  let maxValue = Number(state.opts.maxValue) || 100;
  if (maxValue <= 0) maxValue = 100;
  const bars = normalizeBars(state.opts.bars || [], !!state.opts.sortDescending);
  const ticks = buildTicks2(maxValue);
  ctx.titleEl.style.display = state.opts.title ? "" : "none";
  ctx.titleEl.textContent = state.opts.title || "";
  ctx.root.setAttribute("role", "img");
  ctx.root.setAttribute("aria-label", state.opts.title || "Horizontal bar chart");
  ctx.frame.style.setProperty(
    "--mn-hbar-bar-height",
    (state.opts.barHeight || 28) + "px"
  );
  renderGrid2(ctx, ticks, maxValue);
  renderAxis(ctx, ticks, maxValue);
  renderRows2(ctx, bars, maxValue);
}
function renderGrid2(ctx, ticks, maxValue) {
  if (!ctx.state.opts.showGrid) return;
  ticks.forEach((tick) => {
    const line = createEl2("div", "mn-hbar__grid-line");
    line.style.left = tick / maxValue * 100 + "%";
    ctx.gridLayer.appendChild(line);
  });
}
function renderAxis(ctx, ticks, maxValue) {
  const unit = ctx.state.opts.unit || "";
  ticks.forEach((tick) => {
    const aLabel = createEl2("div", "mn-hbar__axis-label", tick + unit);
    aLabel.style.left = tick / maxValue * 100 + "%";
    ctx.axisLabels.appendChild(aLabel);
  });
}
function renderRows2(ctx, bars, maxValue) {
  const { state } = ctx;
  bars.forEach((bar, index) => {
    const row = createEl2("div", "mn-hbar__row");
    const label = createEl2("div", "mn-hbar__label", bar.label);
    const track = createEl2("div", "mn-hbar__track");
    const fill = createEl2("div", "mn-hbar__fill");
    const valueEl = createEl2("div", "mn-hbar__value");
    const pct2 = clampVal2(bar.value / maxValue * 100, 0, 100);
    const txtColor = hexLum3(bar.color) > 0.55 ? "#111111" : "#FFFFFF";
    fill.style.background = bar.color;
    fill.style.height = (state.opts.barHeight || 28) + "px";
    fill.style.width = state.opts.animate ? "0%" : pct2 + "%";
    valueEl.style.color = txtColor;
    valueEl.textContent = bar.value + (state.opts.unit || "");
    valueEl.style.display = state.opts.showValues ? "" : "none";
    fill.appendChild(valueEl);
    track.appendChild(fill);
    row.appendChild(label);
    row.appendChild(track);
    ctx.rowsLayer.appendChild(row);
    const tipText = bar.label + ": " + bar.value + (state.opts.unit || "");
    addListener(
      state,
      row,
      "mouseenter",
      (evt) => showTip2(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(
      state,
      row,
      "mousemove",
      (evt) => showTip2(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(state, row, "mouseleave", () => hideTip2(ctx.tooltip));
    addListener(state, row, "click", () => {
      const prev = ctx.rowsLayer.querySelector(".mn-hbar__row.is-active");
      if (prev) prev.classList.remove("is-active");
      row.classList.add("is-active");
      state.activeIndex = index;
      if (typeof state.opts.onClick === "function") {
        state.opts.onClick(bar, index);
      }
    });
    if (state.opts.animate) {
      const t = window.setTimeout(() => {
        fill.style.width = pct2 + "%";
      }, index * 50);
      state.timers.push(t);
    }
  });
}

// src/ts/data-binding-events.ts
function emit2(name, detail) {
  eventBus.emit(name, detail);
}
function on2(name, handler) {
  eventBus.on(name, handler);
}
function off(name, handler) {
  eventBus.off(name, handler);
}

// src/ts/icons-az.ts
var azIcons = {
  /** Generic project board icon (was: engagement). */
  project: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M3 9h6"/><path d="M3 14h6"/><circle cx="16" cy="12" r="3"/><path d="M16 9v0"/></svg>',
  /** Generic workspace/location icon (was: studio). */
  workspace: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/></svg>',
  /** Now/Next dual-panel icon. */
  nowNext: () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><circle cx="6" cy="10" r="2" fill="currentColor" opacity="0.4"/><path d="M17 10l2 2-2 2"/></svg>'
};

// src/ts/detail-panel-renderers.ts
var DASH = "\u2014";
function getInitials(name) {
  if (!name) return "?";
  return name.split(/[\s.]+/).map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join("");
}
function formatDateSimple(s) {
  if (!s) return "";
  const str = String(s);
  const parts = str.split("-");
  if (parts.length < 3) return str;
  const MONTHS2 = [
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
  return `${parseInt(parts[2], 10)} ${MONTHS2[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}
function updateStatusSelectColor(sel, colors) {
  if (!colors) return;
  const c = colors[sel.value];
  if (c) {
    sel.style.borderColor = c;
    sel.style.color = c;
  } else {
    sel.style.borderColor = "";
    sel.style.color = "";
  }
}
function renderPersonResults(container, items, input, onChange) {
  container.innerHTML = "";
  if (!items || !items.length) {
    container.classList.remove("mn-detail-panel__person-results--open");
    return;
  }
  items.forEach((item) => {
    const row = createElement("div", "mn-detail-panel__person-result");
    const itemName = typeof item === "string" ? item : item.name;
    const avatar = createElement("span", "mn-detail-panel__avatar mn-detail-panel__avatar--sm");
    avatar.textContent = getInitials(itemName);
    row.appendChild(avatar);
    const nameSpan = createElement("span");
    nameSpan.textContent = itemName;
    row.appendChild(nameSpan);
    if (typeof item !== "string" && item.email) {
      const email = createElement("span", "mn-detail-panel__person-email");
      email.textContent = item.email;
      row.appendChild(email);
    }
    row.addEventListener("mousedown", (e) => {
      e.preventDefault();
      input.value = itemName;
      onChange(itemName);
      container.classList.remove("mn-detail-panel__person-results--open");
    });
    container.appendChild(row);
  });
  container.classList.add("mn-detail-panel__person-results--open");
}
var renderers = {
  text(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  number(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  date(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? formatDateSimple(val) : DASH;
    return span;
  },
  badge(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const color = field.badgeColors?.[String(val)] ?? "";
    if (color) span.style.background = color;
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  status(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const colors = field.statusColors ?? {};
    const c = colors[String(val)];
    if (c) {
      span.style.background = c;
      span.style.color = "#fff";
    }
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  person(val) {
    const wrap = createElement("span", "mn-detail-panel__field-value mn-detail-panel__person");
    if (val) {
      const avatar = createElement("span", "mn-detail-panel__avatar");
      avatar.textContent = getInitials(String(val));
      wrap.appendChild(avatar);
      const name = createElement("span");
      name.textContent = String(val);
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
  },
  score(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--mono");
    span.textContent = val !== void 0 && val !== null ? String(val) : DASH;
    return span;
  },
  select(val) {
    const span = createElement("span", "mn-detail-panel__field-value");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  textarea(val) {
    const div = createElement("div", "mn-detail-panel__field-value mn-detail-panel__field-value--block");
    div.textContent = val ? String(val) : DASH;
    return div;
  },
  readonly(val) {
    const span = createElement("span", "mn-detail-panel__field-value mn-detail-panel__field-value--muted");
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  custom(val, field, data) {
    if (field.render) return field.render(val, data);
    return renderers.text(val, field, data);
  }
};

// src/ts/detail-panel-editors.ts
var datePickerFn = null;
function registerDatePicker(fn) {
  datePickerFn = fn;
}
var editors = {
  text(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    input.addEventListener("input", () => onChange(input.value));
    return input;
  },
  number(val, field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "number";
    input.value = val !== void 0 && val !== null ? String(val) : "";
    if (field.min !== void 0) input.min = String(field.min);
    if (field.max !== void 0) input.max = String(field.max);
    if (field.step) input.step = String(field.step);
    input.addEventListener("input", () => onChange(parseFloat(input.value) || 0));
    return input;
  },
  date(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__date-wrap");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "YYYY-MM-DD";
    wrap.appendChild(input);
    const calBtn = createElement("button", "mn-detail-panel__cal-btn");
    calBtn.type = "button";
    calBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    calBtn.title = "Open calendar";
    wrap.appendChild(calBtn);
    input.addEventListener("input", () => onChange(input.value));
    calBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (datePickerFn) {
        datePickerFn(wrap, {
          value: input.value,
          min: field.min != null ? String(field.min) : void 0,
          max: field.max != null ? String(field.max) : void 0,
          onSelect(dateStr) {
            input.value = dateStr;
            onChange(dateStr);
          }
        });
      }
    });
    return wrap;
  },
  select(val, field, onChange) {
    const sel = createElement("select", "mn-form-select mn-form-select--sm mn-detail-panel__edit-input");
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  },
  status(val, field, onChange) {
    const sel = createElement(
      "select",
      "mn-form-select mn-form-select--sm mn-detail-panel__edit-input mn-detail-panel__status-select"
    );
    for (const opt of field.options ?? []) {
      const o = createElement("option");
      const optVal = typeof opt === "string" ? opt : opt.value;
      const optLabel = typeof opt === "string" ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? "")) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => {
      updateStatusSelectColor(sel, field.statusColors);
      onChange(sel.value);
    });
    setTimeout(() => updateStatusSelectColor(sel, field.statusColors), 0);
    return sel;
  },
  person(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__person-edit");
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "Search people\u2026";
    wrap.appendChild(input);
    const results = createElement("div", "mn-detail-panel__person-results");
    wrap.appendChild(results);
    let debounceTimer = null;
    input.addEventListener("input", () => {
      onChange(input.value);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      const query = input.value.trim();
      if (query.length < 2 || !field.onSearch) {
        results.innerHTML = "";
        results.classList.remove("mn-detail-panel__person-results--open");
        return;
      }
      debounceTimer = setTimeout(() => {
        const searchFn = field.onSearch;
        if (!searchFn) return;
        const res = searchFn(query);
        if (res && typeof res.then === "function") {
          res.then((items) => {
            renderPersonResults(results, items, input, (v) => onChange(v));
          });
        } else if (Array.isArray(res)) {
          renderPersonResults(results, res, input, (v) => onChange(v));
        }
      }, 300);
    });
    input.addEventListener("blur", () => {
      setTimeout(() => results.classList.remove("mn-detail-panel__person-results--open"), 200);
    });
    return wrap;
  },
  score(val, field, onChange) {
    const wrap = createElement("div", "mn-detail-panel__score-stepper");
    const btnMinus = createElement("button", "mn-detail-panel__score-btn");
    btnMinus.type = "button";
    btnMinus.textContent = "\u2212";
    const display = createElement("span", "mn-detail-panel__score-value");
    let current = parseInt(String(val ?? ""), 10) || (field.min ?? 0);
    display.textContent = String(current);
    const btnPlus = createElement("button", "mn-detail-panel__score-btn");
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    function update(delta) {
      current = Math.max(field.min ?? 0, Math.min(field.max ?? 5, current + delta));
      display.textContent = String(current);
      onChange(current);
    }
    btnMinus.addEventListener("click", () => update(-1));
    btnPlus.addEventListener("click", () => update(1));
    wrap.appendChild(btnMinus);
    wrap.appendChild(display);
    wrap.appendChild(btnPlus);
    return wrap;
  },
  textarea(val, field, onChange) {
    const ta = createElement("textarea", "mn-form-textarea mn-form-textarea--sm mn-detail-panel__edit-textarea");
    ta.value = val != null ? String(val) : "";
    ta.rows = field.rows ?? 3;
    if (field.maxLength) ta.maxLength = field.maxLength;
    if (field.placeholder) ta.placeholder = field.placeholder;
    ta.addEventListener("input", () => onChange(ta.value));
    return ta;
  }
};

// src/ts/detail-panel-ui.ts
function showToast(panel, message, type = "info") {
  const existing = panel.querySelector(".mn-detail-panel__toast");
  if (existing) existing.remove();
  const toast2 = createElement("div", `mn-detail-panel__toast mn-detail-panel__toast--${type}`);
  toast2.textContent = message;
  const body = panel.querySelector(".mn-detail-panel__body") ?? panel;
  body.insertBefore(toast2, body.firstChild);
  setTimeout(() => toast2.classList.add("mn-detail-panel__toast--visible"), 16);
  setTimeout(() => {
    toast2.classList.remove("mn-detail-panel__toast--visible");
    setTimeout(() => toast2.remove(), 300);
  }, 4e3);
}
function renderSkeleton(body) {
  body.innerHTML = "";
  for (let s = 0; s < 3; s++) {
    const section = createElement("div", "mn-detail-panel__section");
    const title = createElement("div", "mn-detail-panel__skeleton mn-detail-panel__skeleton--title");
    section.appendChild(title);
    for (let f = 0; f < 4; f++) {
      const field = createElement("div", "mn-detail-panel__field");
      field.appendChild(createElement("span", "mn-detail-panel__skeleton mn-detail-panel__skeleton--label"));
      field.appendChild(createElement("span", "mn-detail-panel__skeleton mn-detail-panel__skeleton--value"));
      section.appendChild(field);
    }
    body.appendChild(section);
  }
}
function validateField2(value, field) {
  if (!field.validate) return null;
  const rules = field.validate;
  if (rules.required && (!value || typeof value === "string" && !value.trim())) {
    return `${field.label} is required`;
  }
  if (rules.min !== void 0 && Number(value) < rules.min) {
    return `${field.label} must be at least ${rules.min}`;
  }
  if (rules.max !== void 0 && Number(value) > rules.max) {
    return `${field.label} must be at most ${rules.max}`;
  }
  if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
    return `${field.label} must be ${rules.maxLength} characters or less`;
  }
  if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
    return rules.patternMessage ?? `${field.label} has an invalid format`;
  }
  if (rules.custom) return rules.custom(value);
  return null;
}
function buildDOM(container, opts, activeTab, onTabClick) {
  container.innerHTML = "";
  container.classList.add("mn-detail-panel");
  const backdrop = createElement("div", "mn-detail-panel__backdrop");
  container.parentNode.insertBefore(backdrop, container);
  const header = createElement("div", "mn-detail-panel__header");
  const titleEl = createElement("div", "mn-detail-panel__title");
  titleEl.textContent = opts.title ?? "";
  const headerActions = createElement("div", "mn-detail-panel__header-actions");
  const editBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__edit-btn");
  editBtn.textContent = "Edit";
  editBtn.style.display = opts.editable !== false ? "" : "none";
  const saveBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__save-btn");
  saveBtn.textContent = "Save";
  saveBtn.style.display = "none";
  const cancelBtn = createElement("button", "mn-detail-panel__action-btn mn-detail-panel__cancel-btn");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.display = "none";
  const closeBtn = createElement("button", "mn-detail-panel__close");
  closeBtn.innerHTML = "\u2715";
  closeBtn.title = "Close panel";
  headerActions.append(editBtn, saveBtn, cancelBtn, closeBtn);
  header.append(titleEl, headerActions);
  container.appendChild(header);
  let tabBar = null;
  if (opts.tabs && opts.tabs.length > 1) {
    tabBar = createElement("div", "mn-detail-panel__tabs");
    for (const tab of opts.tabs) {
      const btn = createElement("button", "mn-detail-panel__tab");
      btn.textContent = tab;
      btn.dataset.tab = tab;
      if (tab === activeTab) btn.classList.add("mn-detail-panel__tab--active");
      btn.addEventListener("click", () => onTabClick(tab));
      tabBar.appendChild(btn);
    }
    container.appendChild(tabBar);
  }
  const body = createElement("div", "mn-detail-panel__body");
  container.appendChild(body);
  const footer = createElement("div", "mn-detail-panel__footer");
  if (opts.footerActions) {
    for (const action of opts.footerActions) {
      const btn = createElement("button", `mn-btn mn-btn--sm${action.ghost ? " mn-btn--ghost" : ""}`);
      btn.textContent = action.label;
      if (action.onClick) btn.addEventListener("click", action.onClick);
      footer.appendChild(btn);
    }
  }
  container.appendChild(footer);
  return { backdrop, titleEl, editBtn, saveBtn, cancelBtn, closeBtn, tabBar, body, footer };
}
function renderBody(body, state, opts) {
  body.innerHTML = "";
  state.errors = {};
  if (state.activeTab && opts.subComponents?.[state.activeTab]) {
    opts.subComponents[state.activeTab](body, state.data, {
      isEditing: state.isEditing,
      changes: state.changes
    });
    return;
  }
  const sections = state.schema.filter(
    (s) => !s.tab || s.tab === state.activeTab || !state.activeTab
  );
  for (const section of sections) {
    const sectionEl = createElement("div", "mn-detail-panel__section");
    if (section.section) {
      const title = createElement("div", "mn-detail-panel__section-title");
      title.textContent = section.section;
      sectionEl.appendChild(title);
    }
    for (const field of section.fields ?? []) {
      const fieldEl = createElement("div", "mn-detail-panel__field");
      if (field.type === "textarea" || field.type === "custom") {
        fieldEl.classList.add("mn-detail-panel__field--block");
      }
      const label = createElement("span", "mn-detail-panel__field-label");
      label.textContent = field.label;
      fieldEl.appendChild(label);
      const val = Object.prototype.hasOwnProperty.call(state.changes, field.key) ? state.changes[field.key] : state.data[field.key];
      if (state.isEditing && field.type !== "readonly" && field.editable !== false) {
        const editor = editors[field.type ?? "text"] ?? editors.text;
        const editorEl = editor(val, field, (newVal) => {
          state.changes[field.key] = newVal;
          state.isDirty = true;
          const err = validateField2(newVal, field);
          const errEl = fieldEl.querySelector(".mn-detail-panel__field-error");
          if (err) {
            state.errors[field.key] = err;
            if (!errEl) {
              const newErr = createElement("div", "mn-detail-panel__field-error");
              newErr.textContent = err;
              fieldEl.appendChild(newErr);
            } else {
              errEl.textContent = err;
            }
            fieldEl.classList.add("mn-detail-panel__field--error");
          } else {
            delete state.errors[field.key];
            if (errEl) errEl.remove();
            fieldEl.classList.remove("mn-detail-panel__field--error");
          }
        });
        fieldEl.appendChild(editorEl);
      } else {
        const renderer = renderers[field.type ?? "text"] ?? renderers.text;
        fieldEl.appendChild(renderer(val, field, state.data));
      }
      sectionEl.appendChild(fieldEl);
    }
    body.appendChild(sectionEl);
  }
}

// src/ts/detail-panel.ts
function createDetailPanel(container, opts = {}) {
  const state = {
    activeTab: opts.tabs?.[0] ?? null,
    isEditing: false,
    isSaving: false,
    changes: {},
    errors: {},
    isDirty: false,
    isOpen: false,
    data: opts.data ?? {},
    schema: opts.schema ?? []
  };
  const dom = buildDOM(container, opts, state.activeTab, (tab) => {
    state.activeTab = tab;
    if (dom.tabBar) {
      dom.tabBar.querySelectorAll(".mn-detail-panel__tab").forEach((btn) => {
        btn.classList.toggle("mn-detail-panel__tab--active", btn.dataset.tab === tab);
      });
    }
    renderBody(dom.body, state, opts);
  });
  renderBody(dom.body, state, opts);
  dom.closeBtn.addEventListener("click", () => {
    doClose();
    opts.onClose?.();
  });
  dom.backdrop.addEventListener("click", () => {
    doClose();
    opts.onClose?.();
  });
  dom.editBtn.addEventListener("click", () => startEdit());
  dom.cancelBtn.addEventListener("click", () => cancelEdit());
  dom.saveBtn.addEventListener("click", () => save());
  function startEdit() {
    state.isEditing = true;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "none";
    dom.saveBtn.style.display = "";
    dom.cancelBtn.style.display = "";
    renderBody(dom.body, state, opts);
  }
  function cancelEdit() {
    state.isEditing = false;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "";
    dom.saveBtn.style.display = "none";
    dom.cancelBtn.style.display = "none";
    renderBody(dom.body, state, opts);
  }
  function save() {
    if (Object.keys(state.errors).length) return;
    const payload = {};
    for (const k in state.changes) payload[k] = state.changes[k];
    opts.onSave?.(payload, state.data);
    cancelEdit();
  }
  function doClose() {
    state.isOpen = false;
    container.classList.remove("mn-detail-panel--open");
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
      bd.classList.remove("mn-detail-panel__backdrop--visible");
    }
  }
  function doOpen() {
    state.isOpen = true;
    container.classList.add("mn-detail-panel--open");
    const bd = container.previousElementSibling;
    if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
      bd.classList.add("mn-detail-panel__backdrop--visible");
    }
  }
  return {
    open: doOpen,
    close: doClose,
    isOpen: () => state.isOpen,
    startEdit,
    cancelEdit,
    save,
    isEditing: () => state.isEditing,
    isDirty: () => state.isDirty,
    setData(newData) {
      state.data = newData;
      renderBody(dom.body, state, opts);
    },
    getData: () => ({ ...state.data }),
    setTitle(t) {
      dom.titleEl.textContent = t;
    },
    showLoading() {
      renderSkeleton(dom.body);
    },
    setTab(tab) {
      state.activeTab = tab;
      if (dom.tabBar) {
        dom.tabBar.querySelectorAll(".mn-detail-panel__tab").forEach((btn) => {
          btn.classList.toggle("mn-detail-panel__tab--active", btn.dataset.tab === tab);
        });
      }
      renderBody(dom.body, state, opts);
    },
    render() {
      renderBody(dom.body, state, opts);
    },
    showToast(msg, type) {
      showToast(container, msg, type);
    },
    destroy() {
      container.innerHTML = "";
    }
  };
}

// src/ts/a11y-panel-dom.ts
var STORAGE_KEY = "mn-a11y";
var DEFAULTS2 = {
  fontSize: "md",
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  lineSpacing: "normal"
};
var SIZES3 = {
  sm: { label: "S", scale: 0.875 },
  md: { label: "M", scale: 1 },
  lg: { label: "L", scale: 1.125 },
  xl: { label: "XL", scale: 1.25 }
};
var LINE_SPACINGS = {
  normal: { label: "1\xD7", value: "normal" },
  relaxed: { label: "1.5\xD7", value: "1.75" },
  loose: { label: "2\xD7", value: "2.0" }
};
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS2, ...JSON.parse(raw) };
  } catch {
  }
  return { ...DEFAULTS2 };
}
function saveSettings(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
  }
}
function applySettings(settings) {
  const root = document.documentElement;
  const sz = SIZES3[settings.fontSize] ?? SIZES3.md;
  root.style.fontSize = `${sz.scale * 16}px`;
  root.classList.toggle("mn-reduced-motion", settings.reducedMotion);
  root.classList.toggle("mn-high-contrast", settings.highContrast);
  root.classList.toggle("mn-no-focus-ring", !settings.focusVisible);
  const ls = LINE_SPACINGS[settings.lineSpacing] ?? LINE_SPACINGS.normal;
  if (ls.value === "normal") {
    root.style.removeProperty("--mn-line-height");
    document.body.style.removeProperty("line-height");
  } else {
    root.style.setProperty("--mn-line-height", ls.value);
    document.body.style.lineHeight = ls.value;
  }
}
function slidersIcon() {
  return icons.sliders ? icons.sliders() : "";
}
function makeToggle(settings, label, key) {
  const row = createElement("div", "mn-a11y-panel__row");
  row.appendChild(createElement("span", "mn-a11y-panel__row-label", { text: label }));
  const on3 = settings[key];
  const toggle = createElement("button", `mn-a11y-toggle${on3 ? " mn-a11y-toggle--on" : ""}`, {
    role: "switch",
    "aria-checked": String(on3),
    "aria-label": label
  });
  toggle.appendChild(createElement("span", "mn-a11y-toggle__thumb"));
  toggle.addEventListener("click", () => {
    settings[key] = !settings[key];
    const nowOn = settings[key];
    toggle.classList.toggle("mn-a11y-toggle--on", nowOn);
    toggle.setAttribute("aria-checked", String(nowOn));
    applySettings(settings);
    saveSettings(settings);
  });
  row.appendChild(toggle);
  return row;
}
function buildPanel(settings) {
  const fab = createElement("button", "mn-a11y-fab", {
    "aria-label": "Display settings",
    title: "Display settings"
  });
  fab.innerHTML = slidersIcon();
  const panel = createElement("div", "mn-a11y-panel", {
    role: "dialog",
    "aria-label": "Accessibility settings"
  });
  const title = createElement("div", "mn-a11y-panel__title");
  title.innerHTML = `${slidersIcon()} Display`;
  panel.appendChild(title);
  const fsGroup = createElement("div", "mn-a11y-panel__group");
  fsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: "Text Size" }));
  const fsRow = createElement("div", "mn-a11y-panel__size-btns");
  const sizeButtons = {};
  for (const key of Object.keys(SIZES3)) {
    const btn = createElement("button", "mn-a11y-panel__size-btn", {
      text: SIZES3[key].label,
      "aria-label": `Font size ${SIZES3[key].label}`
    });
    if (settings.fontSize === key) btn.classList.add("mn-a11y-panel__size-btn--active");
    btn.addEventListener("click", () => {
      settings.fontSize = key;
      for (const k of Object.keys(sizeButtons)) {
        sizeButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    sizeButtons[key] = btn;
    fsRow.appendChild(btn);
  }
  fsGroup.appendChild(fsRow);
  panel.appendChild(fsGroup);
  const lsGroup = createElement("div", "mn-a11y-panel__group");
  lsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: "Line Spacing" }));
  const lsRow = createElement("div", "mn-a11y-panel__size-btns");
  const lsButtons = {};
  for (const key of Object.keys(LINE_SPACINGS)) {
    const btn = createElement("button", "mn-a11y-panel__size-btn", {
      text: LINE_SPACINGS[key].label,
      "aria-label": `Line spacing ${LINE_SPACINGS[key].label}`
    });
    if (settings.lineSpacing === key) btn.classList.add("mn-a11y-panel__size-btn--active");
    btn.addEventListener("click", () => {
      settings.lineSpacing = key;
      for (const k of Object.keys(lsButtons)) {
        lsButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === key);
      }
      applySettings(settings);
      saveSettings(settings);
    });
    lsButtons[key] = btn;
    lsRow.appendChild(btn);
  }
  lsGroup.appendChild(lsRow);
  panel.appendChild(lsGroup);
  panel.appendChild(createElement("div", "mn-a11y-panel__divider"));
  panel.appendChild(makeToggle(settings, "Reduced Motion", "reducedMotion"));
  panel.appendChild(makeToggle(settings, "High Contrast", "highContrast"));
  panel.appendChild(makeToggle(settings, "Focus Indicators", "focusVisible"));
  panel.appendChild(createElement("div", "mn-a11y-panel__divider"));
  const resetBtn = createElement("button", "mn-a11y-panel__reset", { text: "Reset to Defaults" });
  panel.appendChild(resetBtn);
  return { fab, panel, sizeButtons, lsButtons, resetBtn };
}

// src/ts/a11y-panel.ts
function a11yPanel() {
  const settings = loadSettings();
  const refs = buildPanel(settings);
  const { fab, panel } = refs;
  refs.resetBtn.addEventListener("click", () => {
    settings.fontSize = DEFAULTS2.fontSize;
    settings.reducedMotion = DEFAULTS2.reducedMotion;
    settings.highContrast = DEFAULTS2.highContrast;
    settings.focusVisible = DEFAULTS2.focusVisible;
    settings.lineSpacing = DEFAULTS2.lineSpacing;
    saveSettings(settings);
    applySettings(settings);
    for (const k of Object.keys(refs.sizeButtons)) {
      refs.sizeButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === "md");
    }
    for (const k of Object.keys(refs.lsButtons)) {
      refs.lsButtons[k].classList.toggle("mn-a11y-panel__size-btn--active", k === "normal");
    }
    panel.querySelectorAll(".mn-a11y-toggle").forEach((t) => {
      const label = t.getAttribute("aria-label");
      const isDefault = label === "Focus Indicators";
      t.classList.toggle("mn-a11y-toggle--on", isDefault);
      t.setAttribute("aria-checked", String(isDefault));
    });
  });
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("mn-a11y-panel--open", isOpen);
    fab.setAttribute("aria-expanded", String(isOpen));
  });
  const onKeydown = (e) => {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      panel.classList.remove("mn-a11y-panel--open");
      fab.setAttribute("aria-expanded", "false");
      fab.focus();
    }
  };
  document.addEventListener("keydown", onKeydown);
  const onDocClick2 = (e) => {
    const target = e.target;
    if (target && isOpen && !panel.contains(target) && !fab.contains(target)) {
      isOpen = false;
      panel.classList.remove("mn-a11y-panel--open");
      fab.setAttribute("aria-expanded", "false");
    }
  };
  document.addEventListener("click", onDocClick2);
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  applySettings(settings);
  return {
    getSettings: () => ({ ...settings }),
    reset: () => refs.resetBtn.click(),
    destroy: () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("click", onDocClick2);
      fab.remove();
      panel.remove();
    }
  };
}

// src/ts/controls-dialogs.ts
function initDropdown(el4) {
  const trigger = el4.querySelector(".mn-dropdown__trigger");
  const menu = el4.querySelector(".mn-dropdown__menu");
  const items = el4.querySelectorAll(".mn-dropdown__item");
  if (!trigger) throw new Error("Dropdown: missing .mn-dropdown__trigger");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (menu) menu.setAttribute("role", "listbox");
  items.forEach((item) => item.setAttribute("role", "option"));
  function openMenu() {
    el4.classList.add("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "true");
    if (items[0]) items[0].focus();
  }
  function closeMenu() {
    el4.classList.remove("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el4.classList.contains("mn-dropdown--open")) closeMenu();
    else openMenu();
  });
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  });
  items.forEach((item, idx) => {
    item.setAttribute("tabindex", "-1");
    item.addEventListener("click", () => {
      items.forEach((i) => {
        i.classList.remove("mn-dropdown__item--active");
        i.setAttribute("aria-selected", "false");
      });
      item.classList.add("mn-dropdown__item--active");
      item.setAttribute("aria-selected", "true");
      if (trigger.childNodes[0]) {
        trigger.childNodes[0].textContent = `${item.textContent ?? ""} `;
      }
      closeMenu();
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items[idx + 1]) items[idx + 1].focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) items[idx - 1].focus();
        else trigger.focus();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
  document.addEventListener("click", () => {
    if (el4.classList.contains("mn-dropdown--open")) closeMenu();
  });
  return { open: openMenu, close: closeMenu };
}
function initTabs(el4) {
  const tabs = el4.querySelectorAll(".mn-tabs__tab");
  const panels = el4.querySelectorAll(".mn-tabs__panel");
  function activate(idx) {
    tabs.forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle("mn-tabs__tab--active", active);
      t.setAttribute("aria-selected", String(active));
      t.setAttribute("tabindex", active ? "0" : "-1");
    });
    panels.forEach((p, i) => {
      p.classList.toggle("mn-tabs__panel--active", i === idx);
    });
  }
  tabs.forEach((tab, i) => {
    tab.setAttribute("role", "tab");
    if (panels[i]) {
      const panelId = panels[i].id || `mn-tabpanel-${Math.random().toString(36).slice(2, 8)}`;
      panels[i].id = panelId;
      tab.setAttribute("aria-controls", panelId);
    }
    tab.addEventListener("click", () => activate(i));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (i + 1) % tabs.length;
        activate(next);
        tabs[next].focus();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (i - 1 + tabs.length) % tabs.length;
        activate(prev);
        tabs[prev].focus();
      }
    });
  });
  let activeIdx = 0;
  tabs.forEach((t, i) => {
    if (t.classList.contains("mn-tabs__tab--active")) activeIdx = i;
  });
  activate(activeIdx);
  return { activate };
}

// src/ts/controls-drag.ts
function initRotary(el4, options) {
  const opts = {
    steps: ["WET", "COMFORT", "SPORT", "RACE", "ESC OFF"],
    initial: 2,
    snap: true,
    ...options
  };
  const housing = el4.querySelector(".mn-rotary__housing");
  const pointer = el4.querySelector(".mn-rotary__pointer");
  const valueEl = el4.querySelector(".mn-rotary__value");
  if (!housing || !pointer) throw new Error("Rotary: missing .mn-rotary__housing or __pointer");
  let current = opts.initial;
  const totalSteps = opts.steps.length;
  const angleRange = 240, startAngle = -120;
  function setStep(idx) {
    idx = clamp(idx, 0, totalSteps - 1);
    current = idx;
    const angle = startAngle + idx / (totalSteps - 1) * angleRange;
    pointer.style.transform = `rotate(${angle}deg)`;
    if (valueEl) valueEl.textContent = opts.steps[idx];
    opts.onChange?.(opts.steps[idx], idx);
  }
  setStep(current);
  let dragging = false, centerX = 0, centerY = 0;
  function getCenter() {
    const rect = housing.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }
  function getClientPoint(e) {
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }
  function angleFromEvent(e) {
    const point = getClientPoint(e);
    return Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI) + 90;
  }
  function stepFromAngle(deg) {
    const norm = ((deg - startAngle) % 360 + 360) % 360;
    const idx = Math.round(norm / angleRange * (totalSteps - 1));
    return clamp(idx, 0, totalSteps - 1);
  }
  function onStart(e) {
    e.preventDefault();
    dragging = true;
    getCenter();
    housing.style.cursor = "grabbing";
  }
  function onMove(e) {
    if (!dragging) return;
    const deg = angleFromEvent(e);
    if (opts.snap) setStep(stepFromAngle(deg));
    else pointer.style.transform = `rotate(${deg - 90}deg)`;
  }
  function onEnd() {
    dragging = false;
    housing.style.cursor = "pointer";
  }
  housing.addEventListener("mousedown", onStart);
  housing.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  housing.addEventListener("click", () => {
    if (!dragging) setStep((current + 1) % totalSteps);
  });
  el4.setAttribute("tabindex", "0");
  el4.setAttribute("role", "slider");
  el4.setAttribute("aria-valuemin", "0");
  el4.setAttribute("aria-valuemax", String(totalSteps - 1));
  el4.setAttribute("aria-valuenow", String(current));
  el4.setAttribute("aria-valuetext", opts.steps[current]);
  el4.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setStep(current + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setStep(current - 1);
    }
    el4.setAttribute("aria-valuenow", String(current));
    el4.setAttribute("aria-valuetext", opts.steps[current]);
  });
  return {
    setStep,
    getValue: () => opts.steps[current],
    destroy: () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
    }
  };
}
function initSlider(el4, options) {
  const opts = {
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    onChange: void 0,
    label: null,
    unit: "",
    ...options
  };
  const track = el4.querySelector(".mn-slider__track") ?? el4;
  let fill = el4.querySelector(".mn-slider__fill");
  let thumb = el4.querySelector(".mn-slider__thumb");
  const valueEl = el4.querySelector(".mn-slider__value");
  if (!fill) {
    fill = document.createElement("div");
    fill.className = "mn-slider__fill";
    track.appendChild(fill);
  }
  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "mn-slider__thumb";
    track.appendChild(thumb);
  }
  const fillEl = fill, thumbEl = thumb;
  let current = opts.value, dragging = false;
  el4.setAttribute("tabindex", "0");
  el4.setAttribute("role", "slider");
  el4.setAttribute("aria-valuemin", String(opts.min));
  el4.setAttribute("aria-valuemax", String(opts.max));
  el4.setAttribute("aria-valuenow", String(current));
  if (opts.label) el4.setAttribute("aria-label", opts.label);
  function pctFromValue(v) {
    return (v - opts.min) / (opts.max - opts.min) * 100;
  }
  function valueFromPct(pct2) {
    const raw = opts.min + pct2 / 100 * (opts.max - opts.min);
    return Math.round(raw / opts.step) * opts.step;
  }
  function render3() {
    const pct2 = pctFromValue(current);
    fillEl.style.width = `${pct2}%`;
    thumbEl.style.left = `${pct2}%`;
    if (valueEl) valueEl.textContent = String(current);
    el4.setAttribute("aria-valuenow", String(current));
    if (opts.label) el4.setAttribute("aria-valuetext", `${current}${opts.unit}`);
  }
  function getPointerX(e) {
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return touch.clientX;
    }
    return e.clientX;
  }
  function setFromX(clientX) {
    const rect = track.getBoundingClientRect();
    const pct2 = clamp((clientX - rect.left) / rect.width * 100, 0, 100);
    const newVal = valueFromPct(pct2);
    if (newVal !== current) {
      current = newVal;
      render3();
      opts.onChange?.(current);
      eventBus.emit("slider-change", { element: el4, value: current });
    }
  }
  function onStart(e) {
    e.preventDefault();
    dragging = true;
    el4.classList.add("mn-slider--active");
    setFromX(getPointerX(e));
  }
  function onMove(e) {
    if (!dragging) return;
    setFromX(getPointerX(e));
  }
  function onEnd() {
    dragging = false;
    el4.classList.remove("mn-slider--active");
  }
  track.addEventListener("mousedown", onStart);
  track.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  el4.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      current = Math.min(opts.max, current + opts.step);
      render3();
      opts.onChange?.(current);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      current = Math.max(opts.min, current - opts.step);
      render3();
      opts.onChange?.(current);
    }
  });
  render3();
  return {
    getValue: () => current,
    setValue: (v) => {
      current = clamp(v, opts.min, opts.max);
      render3();
    }
  };
}

// src/ts/map-view-events.ts
function showTip3(m, els, padding, viewState) {
  els.tipLabel.textContent = m.label || "Marker";
  els.tipDetail.textContent = m.detail || "";
  els.tip.classList.add("mn-map__tooltip--visible");
  els.tip.setAttribute("aria-hidden", "false");
  const cr = els.wrap.getBoundingClientRect();
  const pos = typeof m._x === "number" && typeof m._y === "number" ? { x: m._x, y: m._y } : project(m.lat, m.lon, cr.width, cr.height, padding, viewState);
  const tipW = els.tip.offsetWidth || 120;
  const tipH = els.tip.offsetHeight || 40;
  let left = pos.x - tipW / 2;
  if (left < 4) left = 4;
  if (left + tipW > cr.width - 4) left = cr.width - tipW - 4;
  let top = pos.y - tipH - 12;
  if (top < 4) top = pos.y + 12;
  els.tip.style.left = left + "px";
  els.tip.style.top = top + "px";
}
function hideTip3(tip) {
  tip.classList.remove("mn-map__tooltip--visible");
  tip.setAttribute("aria-hidden", "true");
}
function attachEvents(canvas, tipEls, state, callbacks) {
  function handleWheel(e) {
    if (!state.enableZoom) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    callbacks.setZoomInternal(state.zoomLevel * factor);
  }
  function startDrag(clientX, clientY) {
    if (!state.enablePan) return;
    state.isDragging = true;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    state.hovered = null;
    hideTip3(tipEls.tip);
    canvas.style.cursor = "grabbing";
  }
  function moveDrag(clientX, clientY) {
    if (!state.isDragging) return;
    const dx = clientX - state.dragStartX;
    const dy = clientY - state.dragStartY;
    state.dragStartX = clientX;
    state.dragStartY = clientY;
    callbacks.panByPixels(dx, dy);
  }
  function endDrag() {
    state.isDragging = false;
    canvas.style.cursor = state.enablePan ? "grab" : "default";
  }
  canvas.addEventListener("mousemove", (e) => {
    if (state.isDragging) return;
    const m = hitTest2(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m) {
      state.hovered = m.id;
      canvas.style.cursor = "pointer";
      showTip3(m, tipEls, state.padding, state.viewState);
    } else {
      state.hovered = null;
      canvas.style.cursor = state.enablePan ? "grab" : "default";
      hideTip3(tipEls.tip);
    }
  });
  canvas.addEventListener("mouseleave", () => {
    state.hovered = null;
    if (!state.isDragging) {
      canvas.style.cursor = state.enablePan ? "grab" : "default";
    }
    hideTip3(tipEls.tip);
  });
  canvas.addEventListener("click", (e) => {
    if (state.isDragging) return;
    const m = hitTest2(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m && state.onClick) state.onClick(m);
  });
  let onWindowMouseMove = null;
  let onWindowMouseUp = null;
  if (state.enableZoom) {
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.style.touchAction = "none";
  }
  if (state.enablePan) {
    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
    });
    onWindowMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    onWindowMouseUp = () => {
      if (state.isDragging) endDrag();
    };
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2 && state.enableZoom) {
        const t1 = e.touches[0], t2 = e.touches[1];
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        state.touchPinchStartDist = Math.sqrt(dx * dx + dy * dy);
        state.touchPinchStartZoom = state.zoomLevel;
        return;
      }
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && state.enableZoom && state.touchPinchStartDist > 0) {
        e.preventDefault();
        const p1 = e.touches[0], p2 = e.touches[1];
        const dx = p2.clientX - p1.clientX;
        const dy = p2.clientY - p1.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          callbacks.setZoomInternal(state.touchPinchStartZoom * (dist / state.touchPinchStartDist));
        }
        return;
      }
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    canvas.addEventListener("touchend", () => {
      state.touchPinchStartDist = 0;
      if (state.isDragging) endDrag();
    }, { passive: true });
  }
  return {
    cleanup() {
      if (state.enableZoom) canvas.removeEventListener("wheel", handleWheel);
      if (onWindowMouseMove) window.removeEventListener("mousemove", onWindowMouseMove);
      if (onWindowMouseUp) window.removeEventListener("mouseup", onWindowMouseUp);
    }
  };
}

// src/ts/grid-layout.ts
var TEMPLATES = [
  "overview-4col",
  "sidebar-main",
  "triple-equal",
  "dashboard-kpi",
  "focus-detail",
  "masonry-auto"
];
var CLASS_PREFIX = "mn-grid-template--";
function gridLayout(container, template = "masonry-auto", options) {
  const target = typeof container === "string" ? document.querySelector(container) : container;
  if (!target) return null;
  const host = target;
  const opts = { gap: "", padding: "", animate: true, ...options };
  let current = template;
  host.classList.add("mn-grid-template");
  if (opts.gap) host.style.gap = opts.gap;
  if (opts.padding) host.style.padding = opts.padding;
  function applyTemplate(name) {
    TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    host.classList.add(CLASS_PREFIX + name);
    current = name;
    if (opts.animate) {
      const { children } = host;
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        child.style.opacity = "0";
        child.style.transform = "translateY(8px)";
        setTimeout(() => {
          child.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          child.style.opacity = "1";
          child.style.transform = "none";
        }, index * 50);
      }
    }
  }
  applyTemplate(current);
  return {
    setTemplate: applyTemplate,
    getTemplate: () => current,
    destroy: () => {
      host.classList.remove("mn-grid-template");
      TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    }
  };
}

// src/ts/maranello-exports.ts
function registerExtras(M2) {
  M2.SPEEDO_FONT = SPEEDO_FONT;
  M2.SPEEDO_SIZES = SPEEDO_SIZES;
  M2.SPEEDO_SWEEP = SWEEP2;
  M2.SPEEDO_START = START2;
  M2.easeOutCubic = easeOutCubic2;
  M2.valueToAngle = valueToAngle;
  M2.speedoPalette = speedoPalette2;
  M2.drawSpeedometer = drawSpeedometer;
  M2.hexLum = hexLum3;
  M2.createEl = createEl2;
  M2.clampVal = clampVal2;
  M2.normalizeHex = normalizeHex2;
  M2.buildTicks = buildTicks2;
  M2.cleanupTimers = cleanupTimers;
  M2.addHBarListener = addListener;
  M2.showHBarTip = showTip2;
  M2.hideHBarTip = hideTip2;
  M2.normalizeBars = normalizeBars;
  M2.renderHBar = renderHBar;
  M2.updateStatusSelectColor = updateStatusSelectColor;
  M2.renderPersonResults = renderPersonResults;
  M2.renderers = renderers;
  M2.getInitials = getInitials;
  M2.formatDateSimple = formatDateSimple;
  M2.showPanelToast = showToast;
  M2.renderSkeleton = renderSkeleton;
  M2.validateDetailField = validateField2;
  M2.buildDetailDOM = buildDOM;
  M2.renderPanelBody = renderBody;
  M2.A11Y_DEFAULTS = DEFAULTS2;
  M2.loadA11ySettings = loadSettings;
  M2.saveA11ySettings = saveSettings;
  M2.applyA11ySettings = applySettings;
  M2.buildA11yPanel = buildPanel;
  M2.MAP_DPR = DPR3;
  M2.MAP_TAU = TAU;
  M2.CONTINENTS = CONTINENTS;
  M2.detectMapTheme = detectTheme;
  M2.getMarkerColors = getMarkerColors;
  M2.projectLatLon = project;
  M2.hexToRgba = hexToRgba;
  M2.getVisibleProjected = getVisibleProjected;
  M2.clusterMarkers = clusterMarkers;
  M2.markerRadius = markerRadius;
  M2.drawMarker = drawMarker;
  M2.renderMapLegend = renderLegend;
  M2.hitTest = hitTest2;
  M2.showMapTip = showTip3;
  M2.hideMapTip = hideTip3;
  M2.attachMapEvents = attachEvents;
}

// src/ts/maranello.ts
function aiChat(container, opts) {
  const full = {
    onSend: opts?.onSend ?? null,
    onQuickAction: opts?.onQuickAction ?? null,
    quickActions: opts?.quickActions ?? [],
    placeholder: opts?.placeholder ?? "Type a message\u2026",
    title: opts?.title ?? "AI Assistant",
    welcomeMessage: opts?.welcomeMessage ?? null,
    avatar: opts?.avatar ?? null,
    agents: opts?.agents ?? [],
    activeAgent: opts?.activeAgent ?? null,
    onAgentChange: opts?.onAgentChange ?? (() => {
    }),
    onVoice: opts?.onVoice ?? (() => {
    })
  };
  const els = buildUI(container, full);
  initMessages(els.state, els, full);
  const { state, fab, panel, closeBtn } = els;
  function open() {
    panel.classList.add("mn-chat-panel--open");
    panel.style.display = "flex";
    state.isOpen = true;
  }
  function close() {
    panel.classList.remove("mn-chat-panel--open");
    panel.style.display = "none";
    state.isOpen = false;
  }
  function toggle() {
    state.isOpen ? close() : open();
  }
  fab.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  return {
    open,
    close,
    toggle,
    isOpen: () => state.isOpen,
    addMessage: (role, content) => state.addMessage(role, content),
    setTyping: (show) => state.setTyping(show),
    clear: () => state.clear(),
    showPulse: () => {
      els.pulse.classList.add("mn-chat-fab__pulse--active");
    },
    destroy: () => {
      container.innerHTML = "";
    }
  };
}
var M = window.Maranello = window.Maranello || {};
M.VERSION = VERSION;
M.emit = emit2;
M.on = on2;
M.off = off;
M.eventBus = eventBus;
M.getTheme = getTheme;
M.setTheme = setTheme;
M.cycleTheme = cycleTheme;
M.initThemeToggle = initThemeToggle;
M.getAccent = getAccent;
M.cssVar = cssVar;
M.clamp = clamp;
M.lerp = lerp;
M.hiDpiCanvas = hiDpiCanvas;
M.createElement = createElement;
M.escapeHtml = escapeHtml;
M.formatNumber = formatNumber;
M.formatDate = formatDate;
M.debounce = debounce;
M.throttle = throttle;
M.icons = icons;
M.renderIcon = renderIcon;
M.iconCatalog = iconCatalog;
M.navIcons = navIcons;
M.statusIcons = statusIcons;
M.actionIcons = actionIcons;
M.dataIcons = dataIcons;
M.objectIcons = objectIcons;
M.azIcons = azIcons;
M.toast = toast;
M.openModal = openModal;
M.closeModal = closeModal;
M.commandPalette = commandPalette;
M.loginScreen = loginScreen;
M.systemStatus = systemStatus;
M.profileMenu = profileMenu;
M.FerrariGauge = FerrariGauge;
M.buildGaugePalette = buildGaugePalette;
M.createGauge = createGauge;
M.createGaugesInContainer = createGaugesInContainer;
M.redrawAll = redrawAll;
M.reinitAll = reinitAll;
M.GAUGE_SIZES = GAUGE_SIZES;
M.speedometer = speedometer;
M.gantt = gantt;
M.dataTable = dataTable;
M.datePicker = datePicker;
M.mapView = mapView;
M.mapboxView = mapboxView;
M.funnel = funnel;
M.aiChat = aiChat;
M.flipCounter = flipCounter;
M.progressRing = progressRing;
M.networkMessages = networkMessages;
M.neuralNodes = neuralNodes;
M.hBarChart = hBarChart;
M.okrPanel = okrPanel;
M.gridLayout = gridLayout;
M.socialGraph = socialGraph;
M.chartInteract = chartInteract;
M.sparklineInteract = sparklineInteract;
M.openDetailPanel = openDetailPanel;
M.closeDetailPanel = closeDetailPanel;
M.detailPanel = openDetailPanel;
M.createDetailPanel = createDetailPanel;
M.registerDatePicker = registerDatePicker;
M.editors = editors;
M.openDrawer = openDrawer;
M.closeDrawer = closeDrawer;
M.initOrgTree = initOrgTree;
M.cruiseLever = cruiseLever;
M.toggleLever = toggleLever;
M.manettino = manettino;
M.steppedRotary = steppedRotary;
M.initRotary = manettino;
M.initDropdown = initDropdown;
M.initTabs = initTabs;
M.initDragRotary = initRotary;
M.initSlider = initSlider;
M.a11yPanel = a11yPanel;
M.bind = bind;
M.autoBind = autoBind;
M.onDrillDown = onDrillDown;
M.updateGauge = updateGauge;
M.bindChart = bindChart;
M.autoBindSliders = autoBindSliders;
M.bindControl = bindControl;
M.initGauges = initGauges;
M.initScrollReveal = initScrollReveal;
M.initNavTracking = initNavTracking;
M.relativeLuminance = relativeLuminance;
M.autoContrast = autoContrast;
M.charts = {
  sparkline,
  donut,
  barChart,
  areaChart,
  radar,
  halfGauge,
  bubble,
  liveGraph,
  hBarChart
};
registerExtras(M);

// src/ts/index.ts
var VERSION = "3.0.0";
//# sourceMappingURL=index.cjs.map
