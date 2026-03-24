/* Maranello Luce Design v5.14.1 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */
import {
  SERIES,
  applyChartA11y,
  areaChart,
  barChart,
  bubble,
  buildSeries,
  chartHiDpi,
  chartInteract,
  donut,
  flipCounter,
  getCanvasSize,
  hBarChart,
  halfGauge,
  hexToRgba,
  liveGraph,
  progressRing,
  radar,
  sparkline,
  sparklineInteract
} from "./chunks/chunk-2YYGEBDT.js";
import {
  FerrariGauge,
  SPEEDO_FONT,
  SPEEDO_SIZES,
  START,
  SWEEP,
  buildGaugePalette,
  easeOutCubic,
  speedoPalette,
  speedometer,
  valueToAngle
} from "./chunks/chunk-BG54C4N5.js";
import {
  gantt
} from "./chunks/chunk-TEGQIHOA.js";
import {
  closeDetailPanel,
  closeDrawer,
  cruiseLever,
  initDrillDown,
  initOrgTree,
  manettino,
  openDetailPanel,
  openDrawer,
  steppedRotary,
  toggleLever,
  toggleNotifications
} from "./chunks/chunk-BEA7OTKQ.js";
import {
  ALLOWED_BIND_PROPERTIES,
  clamp,
  createElement,
  cssVar,
  cycleTheme,
  debounce,
  escapeHtml,
  formatDate,
  formatNumber,
  getAccent,
  getTheme,
  hiDpiCanvas,
  isValidColor,
  lerp,
  palette,
  sanitizeAttr,
  sanitizeHtml,
  sanitizeSvg,
  setTheme,
  throttle
} from "./chunks/chunk-2WF4PFPA.js";
import {
  addValidator,
  defaultMessages,
  forms,
  getFieldInput,
  initAutoResize,
  initCharCounter,
  initFileUpload,
  initFormSteps,
  initForms,
  initInlineEdit,
  initLiveValidation,
  initPasswordToggle,
  initSearchClear,
  initTagInput,
  validateField,
  validateForm,
  validators
} from "./chunks/chunk-GR2ROJME.js";
import {
  EventBus,
  eventBus
} from "./chunks/chunk-KZRV2KZS.js";

// src/ts/navigation-model.ts
var NavigationModel = class {
  constructor() {
    this.stack = [];
    this.bus = new EventBus(new EventTarget());
    this.callbacks = /* @__PURE__ */ new Map();
  }
  push(viewId, params) {
    const entry = { viewId, params, timestamp: Date.now() };
    this.stack.push(entry);
    this.notify(entry, "push");
    return entry;
  }
  /** Remove top entry and return the NEW current (not the removed one). */
  pop() {
    if (this.stack.length === 0) return void 0;
    this.stack.pop();
    const entry = this.current();
    if (entry) this.notify(entry, "pop");
    return entry;
  }
  replace(viewId, params) {
    const entry = { viewId, params, timestamp: Date.now() };
    if (this.stack.length === 0) {
      this.stack.push(entry);
    } else {
      this.stack[this.stack.length - 1] = entry;
    }
    this.notify(entry, "replace");
    return entry;
  }
  current() {
    const entry = this.stack[this.stack.length - 1];
    return entry ? { ...entry, params: entry.params ? { ...entry.params } : void 0 } : void 0;
  }
  canGoBack() {
    return this.stack.length > 1;
  }
  history() {
    return this.stack.map((e) => ({ ...e, params: e.params ? { ...e.params } : void 0 }));
  }
  remove(viewId) {
    let removed = false;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].viewId === viewId) {
        this.stack.splice(i, 1);
        removed = true;
      }
    }
    if (removed) {
      const current2 = this.current();
      if (current2) {
        this.notify(current2, "remove");
      } else {
        this.notify({ viewId, timestamp: Date.now() }, "remove");
      }
    }
  }
  clear() {
    if (this.stack.length === 0) return;
    const last = this.stack[this.stack.length - 1];
    this.stack.length = 0;
    this.notify(last, "clear");
  }
  onNavigate(cb) {
    const handler = (detail) => {
      cb(detail.entry, detail.action);
    };
    this.callbacks.set(cb, handler);
    this.bus.on("navigate", handler);
    return () => {
      const registered = this.callbacks.get(cb);
      if (!registered) return;
      this.bus.off("navigate", registered);
      this.callbacks.delete(cb);
    };
  }
  destroy() {
    this.stack.length = 0;
    this.callbacks.clear();
    this.bus.removeAll();
  }
  notify(entry, action) {
    const detail = { entry, action };
    this.bus.emit("navigate", detail);
    eventBus.emit("navigate", detail);
  }
};

// src/ts/view-registry.ts
var ViewRegistry = class _ViewRegistry {
  constructor() {
    this.configs = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_ViewRegistry.instance) {
      _ViewRegistry.instance = new _ViewRegistry();
    }
    return _ViewRegistry.instance;
  }
  static reset() {
    if (_ViewRegistry.instance) {
      _ViewRegistry.instance.clear();
    }
    _ViewRegistry.instance = void 0;
  }
  register(config) {
    if (this.configs.has(config.id)) {
      throw new Error(`View "${config.id}" is already registered`);
    }
    this.configs.set(config.id, config);
    eventBus.emit("view-registered", { viewId: config.id, config });
  }
  get(id) {
    const cfg = this.configs.get(id);
    return cfg ? { ...cfg } : void 0;
  }
  list() {
    return Object.freeze([...this.configs.values()].map((c) => ({ ...c })));
  }
  unregister(id) {
    if (!this.configs.has(id)) {
      return false;
    }
    this.configs.delete(id);
    eventBus.emit("view-unregistered", { viewId: id });
    return true;
  }
  has(id) {
    return this.configs.has(id);
  }
  clear() {
    for (const id of [...this.configs.keys()]) {
      this.unregister(id);
    }
  }
};

// src/ts/app-shell.ts
var SLOT_NAMES = [
  "nav",
  "toolbar",
  "filter-bar",
  "main",
  "secondary",
  "detail",
  "bottom",
  "overlay"
];
var LAYOUTS = ["full", "split", "stacked", "docked-bottom", "dual-panel", "side-detail"];
var PLACEMENT_TO_SLOT = /* @__PURE__ */ new Map([
  ["page", "main"],
  ["side-panel", "detail"],
  ["bottom-dock", "bottom"],
  ["overlay", "overlay"],
  ["workspace", "secondary"]
  // 'modal' intentionally omitted — modals use the modal system, not a slot
]);
var AppShellController = class {
  constructor(container, config = {}) {
    this.slots = /* @__PURE__ */ new Map();
    this.layout = "full";
    this.container = container;
    this.container.classList.add("mn-app-shell");
    if (config.bottomDockHeight) {
      this.container.style.setProperty("--mn-app-shell-bottom-height", config.bottomDockHeight);
    }
    for (const name of SLOT_NAMES) {
      const existing = this.container.querySelector(`:scope > .mn-app-shell__${name}`);
      const slot = existing ?? document.createElement("div");
      slot.classList.add(`mn-app-shell__${name}`);
      slot.dataset.slot = name;
      if (!existing) this.container.append(slot);
      this.slots.set(name, slot);
    }
    this.setLayout(config.layout ?? "full");
    this.container.classList.toggle("mn-app-shell--sidebar-collapsed", !!config.sidebarCollapsed);
    this.setBottomDock(false);
  }
  setLayout(mode) {
    for (const name of LAYOUTS) this.container.classList.remove(`mn-app-shell--${name}`);
    this.layout = mode;
    this.container.classList.add(`mn-app-shell--${mode}`);
  }
  getLayout() {
    return this.layout;
  }
  toggleSidebar() {
    this.container.classList.toggle("mn-app-shell--sidebar-collapsed");
  }
  isSidebarCollapsed() {
    return this.container.classList.contains("mn-app-shell--sidebar-collapsed");
  }
  setBottomDock(open) {
    this.container.classList.toggle("mn-app-shell--bottom-open", open);
  }
  getSlot(name) {
    return this.slots.get(name) ?? null;
  }
  /** Resolves a Placement to the corresponding shell slot element. Returns null for modal or unknown placements. */
  getSlotForPlacement(placement) {
    const slotName = PLACEMENT_TO_SLOT.get(placement);
    if (!slotName) return null;
    return this.slots.get(slotName) ?? null;
  }
  destroy() {
    this.container.classList.remove("mn-app-shell", "mn-app-shell--sidebar-collapsed", "mn-app-shell--bottom-open");
    for (const mode of LAYOUTS) this.container.classList.remove(`mn-app-shell--${mode}`);
    for (const slot of this.slots.values()) slot.remove();
    this.slots.clear();
  }
};

// src/ts/modal.ts
function openModal(id) {
  const backdrop2 = document.getElementById(id);
  if (!backdrop2) return;
  const modal = backdrop2.querySelector(".mn-modal");
  if (!modal) return;
  backdrop2.classList.add("mn-modal-backdrop--open");
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
  const backdrop2 = document.getElementById(id);
  if (!backdrop2) return;
  const modal = backdrop2.querySelector(".mn-modal");
  backdrop2.classList.remove("mn-modal-backdrop--open");
  if (modal?._mnTrapFocus) {
    document.removeEventListener("keydown", modal._mnTrapFocus);
    delete modal._mnTrapFocus;
  }
}

// src/ts/panel-orchestrator.ts
var PanelOrchestrator = class {
  constructor(registry, navigation, shell) {
    this.registry = registry;
    this.navigation = navigation;
    this.shell = shell;
    this.openViews = /* @__PURE__ */ new Map();
  }
  open(viewId, target, data) {
    const existing = this.openViews.get(viewId);
    if (existing) {
      if (target && target !== existing.placement) this.move(viewId, target);
      if (data !== void 0) {
        const config2 = this.registry.get(viewId);
        if (config2) {
          this.unmount(existing.mountResult);
          existing.mountResult = this.mountView(config2, existing.handle.container, data);
        }
      }
      this.navigation.push(viewId, { placement: this.openViews.get(viewId)?.placement });
      return this.openViews.get(viewId).handle;
    }
    const config = this.registry.get(viewId);
    if (!config) throw new Error(`View "${viewId}" is not registered`);
    const placement = target ?? config.defaultPlacement;
    const container = this.createViewContainer(viewId);
    const mountResult = this.mountView(config, container, data);
    const modalId = placement === "modal" ? this.createModalHost(viewId, container) : void 0;
    if (placement !== "modal") this.ensureSlot(placement).appendChild(container);
    const handle = {
      viewId,
      placement,
      container,
      close: () => this.close(viewId),
      moveTo: (next) => this.move(viewId, next)
    };
    this.openViews.set(viewId, { placement, handle, mountResult, modalId });
    this.navigation.push(viewId, { placement });
    eventBus.emit("panel-opened", { viewId, placement });
    return handle;
  }
  close(viewId) {
    const entry = this.openViews.get(viewId);
    if (!entry) return;
    if (entry.modalId) closeModal(entry.modalId);
    this.unmount(entry.mountResult);
    if (entry.handle.container.parentElement) entry.handle.container.parentElement.removeChild(entry.handle.container);
    if (entry.modalId) document.getElementById(entry.modalId)?.remove();
    this.openViews.delete(viewId);
    this.navigation.remove(viewId);
    eventBus.emit("panel-closed", { viewId });
  }
  move(viewId, newTarget) {
    const entry = this.openViews.get(viewId);
    if (!entry) throw new Error(`View "${viewId}" is not open`);
    if (entry.placement === newTarget) return;
    const from = entry.placement;
    if (entry.modalId) {
      closeModal(entry.modalId);
      document.getElementById(entry.modalId)?.remove();
      entry.modalId = void 0;
    } else if (entry.handle.container.parentElement) {
      entry.handle.container.parentElement.removeChild(entry.handle.container);
    }
    if (newTarget === "modal") {
      entry.modalId = this.createModalHost(viewId, entry.handle.container);
    } else {
      this.ensureSlot(newTarget).appendChild(entry.handle.container);
    }
    entry.placement = newTarget;
    entry.handle.placement = newTarget;
    this.navigation.replace(viewId, { placement: newTarget });
    eventBus.emit("panel-moved", { viewId, from, to: newTarget });
  }
  stack(viewId) {
    const entry = this.openViews.get(viewId);
    if (!entry) {
      this.open(viewId);
      return;
    }
    const parent = entry.handle.container.parentElement;
    if (parent) parent.appendChild(entry.handle.container);
    this.navigation.push(viewId, { placement: entry.placement, stacked: true });
  }
  swap(viewId1, viewId2) {
    const first = this.openViews.get(viewId1);
    const second = this.openViews.get(viewId2);
    if (!first || !second) throw new Error("Both views must be open to swap");
    if (first.placement === second.placement) {
      const parent = first.handle.container.parentElement;
      if (parent && parent === second.handle.container.parentElement) {
        const anchor = first.handle.container.nextSibling;
        parent.insertBefore(first.handle.container, second.handle.container);
        parent.insertBefore(second.handle.container, anchor);
      }
      return;
    }
    const firstPlacement = first.placement;
    this.move(viewId1, second.placement);
    this.move(viewId2, firstPlacement);
  }
  getOpen() {
    return new Map([...this.openViews.entries()].map(([id, item]) => [id, { placement: item.placement, handle: item.handle }]));
  }
  isOpen(viewId) {
    return this.openViews.has(viewId);
  }
  closeAll() {
    for (const viewId of [...this.openViews.keys()]) this.close(viewId);
  }
  destroy() {
    this.closeAll();
    this.openViews.clear();
  }
  createViewContainer(viewId) {
    const el5 = document.createElement("div");
    el5.className = "mn-panel-view";
    el5.dataset.viewId = viewId;
    return el5;
  }
  mountView(config, container, data) {
    if (config.factory) return config.factory(container, data);
    if (config.tag) {
      container.appendChild(document.createElement(config.tag));
      return void 0;
    }
    throw new Error(`View "${config.id}" has no factory or tag`);
  }
  createModalHost(viewId, container) {
    const id = `mn-panel-modal-${viewId}`;
    const backdrop2 = document.createElement("div");
    backdrop2.id = id;
    backdrop2.className = "mn-modal-backdrop";
    const modal = document.createElement("div");
    modal.className = "mn-modal";
    modal.appendChild(container);
    backdrop2.appendChild(modal);
    document.body.appendChild(backdrop2);
    openModal(id);
    return id;
  }
  ensureSlot(placement) {
    if (this.shell) {
      const shellSlot = this.shell.getSlotForPlacement(placement);
      if (shellSlot) return shellSlot;
    }
    return this.ensureFallbackSlot(placement);
  }
  ensureFallbackSlot(placement) {
    const id = `mn-slot-${placement}`;
    let slot = document.getElementById(id);
    if (!slot) {
      slot = document.createElement("div");
      slot.id = id;
      slot.className = `mn-slot mn-slot--${placement}`;
      document.querySelector("body").appendChild(slot);
    }
    return slot;
  }
  unmount(mountResult) {
    if (typeof mountResult === "function") {
      mountResult();
      return;
    }
    if (mountResult && typeof mountResult === "object" && "destroy" in mountResult) {
      const maybeDestroy = mountResult.destroy;
      if (typeof maybeDestroy === "function") maybeDestroy.call(mountResult);
    }
  }
};

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
function setLocale(locale) {
  current = {
    themes: { ...defaults.themes, ...locale.themes },
    filterPanel: { ...defaults.filterPanel, ...locale.filterPanel },
    a11y: { ...defaults.a11y, ...locale.a11y },
    stateScaffold: { ...defaults.stateScaffold, ...locale.stateScaffold }
  };
}
function getLocale() {
  return current;
}
function resetLocale() {
  current = JSON.parse(JSON.stringify(defaults));
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

// src/ts/gauge-engine-class.ts
var GAUGE_SIZES = {
  sm: 120,
  md: 220,
  lg: 320,
  fluid: 0
};
function resolveCanvas(target) {
  if (typeof target === "string") {
    const el5 = document.querySelector(target);
    return el5 instanceof HTMLCanvasElement ? el5 : null;
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
function createGaugesInContainer(container = document.body, selector = ".mn-gauge__canvas") {
  const root = typeof container === "string" ? document.querySelector(container) : container;
  if (!root) return [];
  const entries = [];
  root.querySelectorAll(selector).forEach((canvas) => {
    const gauge2 = new FerrariGauge(canvas);
    entries.push({ gauge: gauge2, canvas });
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

// src/ts/facet-workbench-render.ts
function buildWorkbenchShell(container) {
  container.innerHTML = "";
  const root = document.createElement("div");
  root.className = "mn-facet-workbench";
  const list = document.createElement("div");
  list.className = "mn-facet-list";
  const chips = document.createElement("div");
  chips.className = "mn-filter-chips mn-facet-chips";
  root.append(list, chips);
  container.appendChild(root);
  return { root, list, chips };
}
function createFacetSection(facet) {
  const section = document.createElement("section");
  section.className = "mn-facet";
  section.dataset.facetId = facet.id;
  const header2 = document.createElement("button");
  header2.type = "button";
  header2.className = "mn-facet__header";
  header2.setAttribute("aria-expanded", "true");
  const title = document.createElement("span");
  title.className = "mn-facet__title";
  title.textContent = facet.label;
  const count = document.createElement("span");
  count.className = "mn-facet__count";
  const chevron = document.createElement("span");
  chevron.className = "mn-facet__chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "\u25BE";
  header2.append(title, count, chevron);
  const body = document.createElement("div");
  body.className = "mn-facet__body";
  body.dataset.type = facet.type;
  section.append(header2, body);
  return { section, header: header2, body, count };
}
function setFacetCollapsed(refs, collapsed) {
  refs.section.classList.toggle("mn-facet--collapsed", collapsed);
  refs.header.setAttribute("aria-expanded", collapsed ? "false" : "true");
  refs.body.hidden = collapsed;
}
function renderLoading(body) {
  body.innerHTML = '<div class="mn-facet__loading">Loading\u2026</div>';
}
function renderOptionRows(body, facet, options, selected) {
  if (facet.type !== "select" && facet.type !== "multi-select" && facet.type !== "search") return;
  body.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "mn-facet__options";
  const isSingle = facet.type === "select";
  const visible = facet.type === "search" ? options : options;
  visible.forEach((option) => {
    const row = document.createElement("label");
    row.className = "mn-facet__option";
    const input = document.createElement("input");
    input.className = "mn-facet__option-input";
    input.type = isSingle ? "radio" : "checkbox";
    input.name = `mn-facet-${facet.id}`;
    input.value = option.id;
    input.checked = selected.includes(option.id);
    const text = document.createElement("span");
    text.className = "mn-facet__option-label";
    text.textContent = option.count == null ? option.label : `${option.label} (${option.count})`;
    row.append(input, text);
    wrap.appendChild(row);
  });
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "mn-facet__empty";
    empty.textContent = "No options";
    body.appendChild(empty);
    return;
  }
  body.appendChild(wrap);
}
function renderSearchControls(body, query = "") {
  const search = document.createElement("input");
  search.type = "search";
  search.value = query;
  search.placeholder = "Search options";
  search.className = "mn-facet__search-input";
  body.prepend(search);
  return search;
}
function renderDateRange(body, selected) {
  body.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "mn-facet__date-range";
  const from = document.createElement("input");
  from.type = "date";
  from.className = "mn-facet__date mn-facet__date--from";
  from.value = selected[0] || "";
  const to = document.createElement("input");
  to.type = "date";
  to.className = "mn-facet__date mn-facet__date--to";
  to.value = selected[1] || "";
  wrap.append(from, to);
  body.appendChild(wrap);
  return { from, to };
}
function renderBoolean(body, active) {
  body.innerHTML = "";
  const label = document.createElement("label");
  label.className = "mn-facet__boolean";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "mn-facet__boolean-input";
  input.checked = active;
  const text = document.createElement("span");
  text.className = "mn-facet__boolean-label";
  text.textContent = "Enabled";
  label.append(input, text);
  body.appendChild(label);
  return input;
}
function renderActiveChips(chipsContainer, facets, filters, onRemove) {
  chipsContainer.innerHTML = "";
  const names = new Map(facets.map((facet) => [facet.id, facet.label]));
  filters.forEach((values, facetId) => {
    values.forEach((value) => {
      const chip = document.createElement("span");
      chip.className = "mn-filter-chip mn-facet-chip";
      const label = document.createElement("span");
      label.className = "mn-filter-chip__label mn-facet-chip__label";
      label.textContent = `${names.get(facetId) || facetId}: ${value}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mn-filter-chip__remove mn-facet-chip__remove";
      remove.textContent = "\xD7";
      remove.addEventListener("click", () => onRemove(facetId, value));
      chip.append(label, remove);
      chipsContainer.appendChild(chip);
    });
  });
}
function setFacetDisabled(section, disabled) {
  section.classList.toggle("mn-facet--disabled", disabled);
  section.querySelectorAll("input, button, select, textarea").forEach((el5) => {
    if (!el5.classList.contains("mn-facet__header")) el5.disabled = disabled;
  });
}

// src/ts/facet-workbench-keyboard.ts
function isOptionElement(el5) {
  return el5.classList.contains("mn-facet__option-input") || el5.classList.contains("mn-facet__option-button");
}
function focusOption(current2, direction) {
  const body = current2.closest(".mn-facet__body");
  if (!body) return;
  const options = Array.from(body.querySelectorAll(".mn-facet__option-input, .mn-facet__option-button"));
  if (!options.length) return;
  const idx = options.indexOf(current2);
  const next = idx < 0 ? options[0] : options[(idx + direction + options.length) % options.length];
  next.focus();
}
function closeFacetFromNode(node) {
  const section = node.closest(".mn-facet");
  if (!section) return;
  section.classList.add("mn-facet--collapsed");
  const header2 = section.querySelector(".mn-facet__header");
  const body = section.querySelector(".mn-facet__body");
  if (header2 && body) {
    header2.setAttribute("aria-expanded", "false");
    body.hidden = true;
    header2.focus();
  }
}
function bindFacetWorkbenchKeyboard(root) {
  const onKeyDown = (event) => {
    const target = event.target;
    if (!target) return;
    if (target.classList.contains("mn-facet__header") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      target.click();
      return;
    }
    if (!isOptionElement(target)) {
      if (event.key === "Escape") closeFacetFromNode(target);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(target, 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(target, -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) {
        target.checked = target.type === "radio" ? true : !target.checked;
        target.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        target.click();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeFacetFromNode(target);
    }
  };
  root.addEventListener("keydown", onKeyDown);
  return {
    destroy() {
      root.removeEventListener("keydown", onKeyDown);
    }
  };
}

// src/ts/facet-workbench.ts
var FacetWorkbench = class {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.facets = /* @__PURE__ */ new Map();
    this.loadedOptions = /* @__PURE__ */ new Map();
    this.filters = /* @__PURE__ */ new Map();
    this.searchTimers = /* @__PURE__ */ new Map();
    this.presets = (options.presets || []).map((preset) => ({ name: preset.name, filters: cloneFilters(preset.filters) }));
    const shell = buildWorkbenchShell(container);
    this.list = shell.list;
    this.chips = shell.chips;
    this.keyboard = bindFacetWorkbenchKeyboard(shell.root);
    this.renderSkeleton();
    void this.loadFacetData();
  }
  getActiveFilters() {
    return cloneFilters(this.filters);
  }
  clearAll() {
    this.filters.clear();
    this.syncUiFromFilters();
    this.commitFilters();
  }
  clearFacet(id) {
    this.filters.delete(id);
    this.syncUiFromFilters();
    this.commitFilters();
  }
  savePreset(name) {
    const preset = { name, filters: this.getActiveFilters() };
    const idx = this.presets.findIndex((item) => item.name === name);
    if (idx >= 0) this.presets[idx] = preset;
    else this.presets.push(preset);
    return { name, filters: cloneFilters(preset.filters) };
  }
  loadPreset(name) {
    const preset = this.presets.find((item) => item.name === name);
    if (!preset) return;
    this.filters.clear();
    preset.filters.forEach((values, key) => this.filters.set(key, [...values]));
    this.syncUiFromFilters();
    this.commitFilters();
  }
  listPresets() {
    return this.presets.map((item) => ({ name: item.name, filters: cloneFilters(item.filters) }));
  }
  destroy() {
    this.searchTimers.forEach((timer) => window.clearTimeout(timer));
    this.keyboard.destroy();
    this.container.innerHTML = "";
  }
  renderSkeleton() {
    this.options.facets.forEach((facet) => {
      const refs = createFacetSection(facet);
      this.facets.set(facet.id, refs);
      refs.header.addEventListener("click", () => {
        setFacetCollapsed(refs, !refs.section.classList.contains("mn-facet--collapsed"));
      });
      renderLoading(refs.body);
      this.list.appendChild(refs.section);
    });
    this.refreshChips();
  }
  async loadFacetData() {
    await Promise.all(this.options.facets.map(async (facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs) return;
      const needsData = facet.type === "select" || facet.type === "multi-select" || facet.type === "search";
      this.loadedOptions.set(facet.id, needsData ? await facet.dataProvider() : []);
      this.renderFacetBody(facet, refs);
    }));
    this.applyExclusions();
    this.refreshChips();
  }
  renderFacetBody(facet, refs) {
    const selected = this.filters.get(facet.id) || [];
    if (facet.type === "date-range") {
      const { from, to } = renderDateRange(refs.body, selected);
      const onChange = () => this.setFacetValues(facet.id, [from.value, to.value].filter(Boolean));
      from.addEventListener("change", onChange);
      to.addEventListener("change", onChange);
      return;
    }
    if (facet.type === "boolean") {
      const control = renderBoolean(refs.body, selected.includes("true"));
      control.addEventListener("change", () => this.setFacetValues(facet.id, control.checked ? ["true"] : []));
      return;
    }
    const options = this.loadedOptions.get(facet.id) || [];
    renderOptionRows(refs.body, facet, options, selected);
    if (facet.type === "search") {
      const search = renderSearchControls(refs.body);
      search.addEventListener("input", () => {
        const prior = this.searchTimers.get(facet.id);
        if (prior) window.clearTimeout(prior);
        const timer = window.setTimeout(() => {
          const q = search.value.trim().toLowerCase();
          renderOptionRows(refs.body, facet, options.filter((opt) => opt.label.toLowerCase().includes(q)), this.filters.get(facet.id) || []);
          refs.body.prepend(search);
          this.attachOptionChange(facet);
        }, 180);
        this.searchTimers.set(facet.id, timer);
      });
    }
    this.attachOptionChange(facet);
  }
  attachOptionChange(facet) {
    const refs = this.facets.get(facet.id);
    if (!refs) return;
    refs.body.querySelectorAll(".mn-facet__option-input").forEach((input) => {
      input.addEventListener("change", () => {
        const checked = Array.from(refs.body.querySelectorAll(".mn-facet__option-input:checked")).map((n) => n.value);
        this.setFacetValues(facet.id, facet.type === "select" ? checked.slice(0, 1) : checked);
      });
    });
  }
  removeChipValue(facetId, value) {
    this.setFacetValues(facetId, (this.filters.get(facetId) || []).filter((item) => item !== value));
  }
  setFacetValues(id, values) {
    if (values.length) this.filters.set(id, [...values]);
    else this.filters.delete(id);
    this.syncUiFromFilters();
    this.commitFilters();
  }
  syncUiFromFilters() {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) this.renderFacetBody(facet, refs);
    });
    this.applyExclusions();
    this.refreshChips();
  }
  applyExclusions() {
    const disabled = /* @__PURE__ */ new Set();
    this.options.facets.forEach((facet) => {
      if (this.filters.get(facet.id)?.length) facet.exclusionRules?.excludes.forEach((id) => disabled.add(id));
    });
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) setFacetDisabled(refs.section, disabled.has(facet.id));
    });
  }
  refreshChips() {
    renderActiveChips(this.chips, this.options.facets, this.filters, (facetId, value) => this.removeChipValue(facetId, value));
  }
  commitFilters() {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs || !facet.countProvider) return;
      void facet.countProvider(this.getActiveFilters()).then((count) => {
        refs.count.textContent = Number.isFinite(count) ? `${count}` : "";
      }).catch(() => {
        refs.count.textContent = "";
      });
    });
    this.options.onFilterChange?.(this.getActiveFilters());
  }
};
function cloneFilters(source) {
  const out = /* @__PURE__ */ new Map();
  source.forEach((values, key) => out.set(key, [...values]));
  return out;
}

// src/ts/entity-workbench-backstack.ts
var BackStack = class {
  constructor() {
    this.entries = [];
  }
  push(entry) {
    this.entries.push(entry);
  }
  pop() {
    return this.entries.pop();
  }
  canGoBack() {
    return this.entries.length > 0;
  }
  depth() {
    return this.entries.length;
  }
  path() {
    return this.entries;
  }
};

// src/ts/async-select.ts
var AsyncSelect = class {
  constructor(container, options) {
    this.container = container;
    this.listboxId = `mn-async-select-listbox-${Math.random().toString(36).slice(2, 8)}`;
    this.items = [];
    this.activeIndex = -1;
    this.openState = false;
    this.requestId = 0;
    this.provider = options.provider;
    this.onSelect = options.onSelect;
    this.debounceMs = options.debounceMs ?? 300;
    this.minChars = options.minChars ?? 1;
    this.container.innerHTML = "";
    this.container.classList.add("mn-async-select");
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "mn-async-select__input";
    this.input.placeholder = options.placeholder ?? "Search...";
    this.input.setAttribute("role", "combobox");
    this.input.setAttribute("aria-autocomplete", "list");
    this.input.setAttribute("aria-expanded", "false");
    this.input.setAttribute("aria-controls", this.listboxId);
    this.dropdown = document.createElement("div");
    this.dropdown.className = "mn-async-select__dropdown";
    this.dropdown.id = this.listboxId;
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.hidden = true;
    this.container.append(this.input, this.dropdown);
    this.onInput = () => this.scheduleSearch();
    this.onKeyDown = (e) => this.handleKeyDown(e);
    this.onDocClick = (e) => {
      if (!this.container.contains(e.target)) this.close();
    };
    this.input.addEventListener("input", this.onInput);
    this.input.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("click", this.onDocClick);
  }
  open() {
    if (this.openState) return;
    this.openState = true;
    this.dropdown.hidden = false;
    this.input.setAttribute("aria-expanded", "true");
  }
  close() {
    this.openState = false;
    this.dropdown.hidden = true;
    this.activeIndex = -1;
    this.input.setAttribute("aria-expanded", "false");
    this.input.removeAttribute("aria-activedescendant");
  }
  clear() {
    this.selected = void 0;
    this.items = [];
    this.input.value = "";
    this.dropdown.innerHTML = "";
    this.close();
  }
  getValue() {
    return this.selected;
  }
  setProvider(provider) {
    this.provider = provider;
    this.clear();
  }
  destroy() {
    if (this.timer) window.clearTimeout(this.timer);
    document.removeEventListener("click", this.onDocClick);
    this.input.removeEventListener("input", this.onInput);
    this.input.removeEventListener("keydown", this.onKeyDown);
    this.container.innerHTML = "";
    this.container.classList.remove("mn-async-select");
  }
  scheduleSearch() {
    if (this.timer) window.clearTimeout(this.timer);
    const query = this.input.value.trim();
    if (query.length < this.minChars) {
      this.requestId++;
      this.items = [];
      this.dropdown.innerHTML = "";
      this.close();
      return;
    }
    this.timer = window.setTimeout(() => {
      void this.fetchResults(query);
    }, this.debounceMs);
  }
  async fetchResults(query) {
    const req = ++this.requestId;
    this.showLoading();
    try {
      const results = await this.provider.search(query);
      if (req !== this.requestId) return;
      this.items = results;
      this.renderItems();
    } catch {
      if (req === this.requestId) this.close();
    }
  }
  showLoading() {
    this.open();
    this.dropdown.innerHTML = '<div class="mn-async-select__loading"><span class="mn-async-select__spinner"></span>Loading...</div>';
  }
  renderItems() {
    this.dropdown.innerHTML = "";
    this.activeIndex = -1;
    this.input.removeAttribute("aria-activedescendant");
    if (!this.items.length) return this.close();
    this.open();
    this.items.forEach((item, index) => {
      const opt = document.createElement("div");
      const id = this.provider.getId?.(item) ?? String(index);
      opt.id = `${this.listboxId}-opt-${escapeHtml(id)}`;
      opt.className = "mn-async-select__item";
      opt.setAttribute("role", "option");
      opt.setAttribute("aria-selected", "false");
      opt.innerHTML = escapeHtml(this.provider.renderItem?.(item) ?? String(item));
      opt.addEventListener("mouseenter", () => this.setActive(index));
      opt.addEventListener("mousedown", (e) => e.preventDefault());
      opt.addEventListener("click", () => this.selectIndex(index));
      this.dropdown.appendChild(opt);
    });
  }
  setActive(index) {
    if (!this.items.length) return;
    const len = this.items.length;
    this.activeIndex = (index % len + len) % len;
    const options = this.dropdown.querySelectorAll(".mn-async-select__item");
    options.forEach((el5, i) => {
      const active2 = i === this.activeIndex;
      el5.classList.toggle("mn-async-select__item--active", active2);
      el5.setAttribute("aria-selected", active2 ? "true" : "false");
    });
    const active = options[this.activeIndex];
    if (!active) return;
    this.input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  }
  selectIndex(index) {
    const item = this.items[index];
    if (!item) return;
    this.selected = item;
    this.input.value = this.provider.getLabel?.(item) ?? String(item);
    this.onSelect?.(item);
    this.close();
  }
  handleKeyDown(e) {
    if (e.key === "Escape" || e.key === "Tab") return this.close();
    if (!this.items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      return this.setActive(this.activeIndex + 1);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      return this.setActive(this.activeIndex <= 0 ? this.items.length - 1 : this.activeIndex - 1);
    }
    if (e.key === "Enter" && this.activeIndex >= 0) {
      e.preventDefault();
      this.selectIndex(this.activeIndex);
    }
  }
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
  const MONTHS3 = [
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
  return `${parseInt(parts[2], 10)} ${MONTHS3[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
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
    if (color && isValidColor(color)) span.style.background = color;
    span.textContent = val ? String(val) : DASH;
    return span;
  },
  status(val, field) {
    const span = createElement("span", "mn-tag mn-tag--sm");
    const colors = field.statusColors ?? {};
    const c = colors[String(val)];
    if (c && isValidColor(c)) {
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
  country(val) {
    const wrap = createElement("span", "mn-detail-panel__field-value mn-detail-panel__country");
    if (val) {
      const str = String(val);
      const code = createElement("span", "mn-country__code");
      code.textContent = str.substring(0, 2).toUpperCase();
      wrap.appendChild(code);
      const name = createElement("span");
      name.textContent = str;
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
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
  country(val, _field, onChange) {
    const input = createElement("input", "mn-form-input mn-form-input--sm mn-detail-panel__edit-input");
    input.type = "text";
    input.value = val ? String(val) : "";
    input.placeholder = "Country name";
    input.addEventListener("input", () => onChange(input.value));
    return input;
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
      const hasSearch = field.onSearch || field.searchFn;
      if (query.length < 2 || !hasSearch) {
        results.innerHTML = "";
        results.classList.remove("mn-detail-panel__person-results--open");
        return;
      }
      debounceTimer = setTimeout(() => {
        const res = field.searchFn ? field.searchFn(query) : field.onSearch(query);
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
    let current2 = parseInt(String(val ?? ""), 10) || (field.min ?? 0);
    display.textContent = String(current2);
    const btnPlus = createElement("button", "mn-detail-panel__score-btn");
    btnPlus.type = "button";
    btnPlus.textContent = "+";
    function update(delta) {
      current2 = Math.max(field.min ?? 0, Math.min(field.max ?? 5, current2 + delta));
      display.textContent = String(current2);
      onChange(current2);
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

// src/ts/entity-workbench-render.ts
function renderWorkbench(ctx) {
  ctx.container.innerHTML = "";
  ctx.container.className = "mn-entity-workbench";
  ctx.container.append(
    renderBreadcrumb(ctx.breadcrumb),
    renderTabs(ctx),
    renderBody(ctx),
    renderActions(ctx)
  );
}
function switchTab(container, tabId, ctx) {
  const tabButtons = container.querySelectorAll(".mn-entity-workbench__tab");
  tabButtons.forEach((btn) => {
    btn.classList.toggle("mn-entity-workbench__tab--active", btn.dataset.tabId === tabId);
  });
  const panels = container.querySelectorAll(".mn-entity-workbench__tab-panel");
  panels.forEach((panel) => {
    panel.style.display = panel.dataset.tab === tabId ? "" : "none";
  });
  if (!ctx.renderedTabs.has(tabId)) {
    const panel = container.querySelector(`.mn-entity-workbench__tab-panel[data-tab="${tabId}"]`);
    const tab = ctx.schema.tabs.find((t) => t.id === tabId);
    if (panel && tab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tabId);
    }
  }
}
function updateSaveState(container, isDirty) {
  const saveBtn = container.querySelector('[data-action="save"]');
  if (saveBtn) saveBtn.disabled = !isDirty;
}
function renderBreadcrumb(content) {
  const nav = document.createElement("nav");
  nav.className = "mn-entity-workbench__breadcrumb";
  nav.textContent = content;
  return nav;
}
function renderTabs(ctx) {
  const tabs = document.createElement("div");
  tabs.className = "mn-entity-workbench__tabs";
  ctx.schema.tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mn-entity-workbench__tab${tab.id === ctx.activeTab ? " mn-entity-workbench__tab--active" : ""}`;
    btn.dataset.tabId = tab.id;
    btn.textContent = tab.label;
    btn.addEventListener("click", () => ctx.onTab(tab.id));
    tabs.appendChild(btn);
  });
  return tabs;
}
function renderBody(ctx) {
  const body = document.createElement("div");
  body.className = "mn-entity-workbench__body";
  ctx.schema.tabs.forEach((tab) => {
    const panel = document.createElement("div");
    panel.className = "mn-entity-workbench__tab-panel";
    panel.dataset.tab = tab.id;
    panel.style.display = tab.id === ctx.activeTab ? "" : "none";
    if (tab.id === ctx.activeTab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tab.id);
    }
    body.appendChild(panel);
  });
  return body;
}
function renderTabContent(panel, tab, ctx) {
  tab.sections.forEach((section) => {
    const sec = document.createElement("section");
    sec.className = "mn-entity-workbench__section";
    if (section.title) {
      const title = document.createElement("h3");
      title.className = "mn-entity-workbench__section-title";
      title.textContent = section.title;
      sec.appendChild(title);
    }
    section.fields.forEach((field) => sec.appendChild(renderField(ctx, field)));
    panel.appendChild(sec);
  });
}
function renderField(ctx, field) {
  if (field.type === "group") return renderGroup(ctx, field);
  const row = document.createElement("div");
  row.className = "mn-field mn-entity-workbench__field";
  row.innerHTML = `<label class="mn-field__label">${field.label}${field.required ? " *" : ""}</label><div class="mn-entity-workbench__control"></div><div class="mn-field__error"></div>`;
  ctx.fieldEls.set(field.key, row);
  const control = row.querySelector(".mn-entity-workbench__control");
  const readOnly = !ctx.editable || field.readOnly || field.type === "computed";
  const value = field.type === "computed" ? field.compute?.(ctx.data) : getValue(ctx.data, field.key);
  if (field.type === "async-select" && !readOnly && field.provider) {
    const picker = new AsyncSelect(control, {
      provider: field.provider,
      onSelect: (item) => {
        const stored = field.provider?.getId ? field.provider.getId(item) : item;
        ctx.onField(field, stored);
      }
    });
    const input = control.querySelector(".mn-async-select__input");
    if (input && value != null) input.value = String(value);
    ctx.asyncControls.push(picker);
    return row;
  }
  if (!readOnly && editors[field.type]) {
    control.appendChild(editors[field.type](value, toDetail(field), (next) => ctx.onField(field, next)));
    return row;
  }
  control.appendChild((renderers[field.type] ?? renderers.readonly)(value, toDetail(field), ctx.data));
  return row;
}
function renderGroup(ctx, field) {
  const wrap = document.createElement("fieldset");
  wrap.className = "mn-entity-workbench__group";
  wrap.innerHTML = `<legend class="mn-entity-workbench__group-title">${field.label}</legend>`;
  (field.fields ?? []).forEach((sub) => wrap.appendChild(renderField(ctx, sub)));
  return wrap;
}
function renderActions(ctx) {
  const bar = document.createElement("div");
  bar.className = "mn-entity-workbench__actions";
  bar.append(makeAction("save", "Save", ctx.isDirty ? "" : "disabled", () => ctx.onSave()));
  bar.append(makeAction("cancel", "Cancel", "", () => ctx.onCancel()));
  ctx.actions.forEach((action) => {
    bar.append(makeAction(action.id, action.label, action.variant ?? "ghost", () => ctx.onAction(action.id)));
  });
  return bar;
}
function makeAction(id, label, variant, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `mn-btn mn-btn--sm mn-btn--${variant} mn-entity-workbench__action`;
  btn.dataset.action = id;
  btn.textContent = label;
  btn.disabled = variant === "disabled";
  btn.addEventListener("click", onClick);
  return btn;
}
function toDetail(field) {
  return {
    key: field.key,
    label: field.label,
    type: field.type,
    options: field.options?.options
  };
}
function getValue(data, key) {
  return key.split(".").reduce((acc, part) => acc?.[part], data);
}

// src/ts/entity-workbench.ts
var EntityWorkbench = class {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.stack = new BackStack();
    this.asyncControls = [];
    this.fieldEls = /* @__PURE__ */ new Map();
    this.renderedTabs = /* @__PURE__ */ new Set();
    this.activeTab = "";
    this.currentSchema = options.schema;
    this.baseData = clone(options.data);
    this.currentData = clone(options.data);
    this.activeTab = options.schema.tabs[0]?.id ?? "";
    this.rootLabel = getLabel(this.currentData, 1);
    this.render();
  }
  isDirty() {
    return Object.keys(this.getModifiedData()).length > 0;
  }
  canGoBack() {
    return this.stack.canGoBack();
  }
  getCurrentDepth() {
    return this.stack.depth() + 1;
  }
  getModifiedData() {
    const out = {};
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === "group" || field.type === "computed") return;
      const curr = getValue2(this.currentData, field.key);
      const base = getValue2(this.baseData, field.key);
      if (!same(curr, base)) setValue(out, field.key, curr);
    });
    return out;
  }
  validate() {
    this.ensureAllTabsRendered();
    const errors = /* @__PURE__ */ new Map();
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === "group" || field.type === "computed") return;
      const host = this.fieldEls.get(field.key);
      if (!host) return;
      const input = host.querySelector(
        ".mn-form-input, .mn-form-select, .mn-form-textarea"
      );
      if (input) {
        const rules = [field.required ? "required" : "", patternRule(field)].filter(Boolean).join(",");
        if (rules) input.setAttribute("data-validate", rules);
      }
      if (!validateField(host)) errors.set(field.key, host.querySelector(".mn-field__error")?.textContent || "Invalid value");
      const custom2 = field.options?.custom;
      const message = custom2?.(getValue2(this.currentData, field.key), this.currentData);
      if (message) {
        errors.set(field.key, message);
        const err = host.querySelector(".mn-field__error");
        if (err) err.textContent = message;
      }
    });
    return { valid: errors.size === 0, errors };
  }
  pushEntity(schema, data) {
    this.stack.push({
      schema: this.currentSchema,
      data: clone(this.currentData),
      base: clone(this.baseData),
      label: getLabel(this.currentData, this.getCurrentDepth())
    });
    this.currentSchema = schema;
    this.baseData = clone(data);
    this.currentData = clone(data);
    this.activeTab = schema.tabs[0]?.id ?? "";
    this.render();
  }
  popEntity() {
    const prev = this.stack.pop();
    if (!prev) return false;
    this.currentSchema = prev.schema;
    this.currentData = prev.data;
    this.baseData = prev.base;
    this.activeTab = this.currentSchema.tabs[0]?.id ?? "";
    this.render();
    return true;
  }
  destroy() {
    this.asyncControls.splice(0).forEach((ctrl) => ctrl.destroy());
    this.fieldEls.clear();
    this.renderedTabs.clear();
    this.container.innerHTML = "";
  }
  buildRenderContext() {
    return {
      container: this.container,
      schema: this.currentSchema,
      activeTab: this.activeTab,
      data: this.currentData,
      editable: this.options.editable !== false,
      actions: this.options.actions ?? [],
      breadcrumb: this.buildBreadcrumb(),
      isDirty: this.isDirty(),
      fieldEls: this.fieldEls,
      asyncControls: this.asyncControls,
      renderedTabs: this.renderedTabs,
      onTab: (tabId) => this.handleTabSwitch(tabId),
      onField: (field, value) => this.onFieldChange(field, value),
      onSave: () => void this.handleSave(),
      onCancel: () => this.handleCancel(),
      onAction: (id) => this.options.onAction?.(id, this.currentData)
    };
  }
  buildBreadcrumb() {
    return [
      this.rootLabel,
      ...this.stack.path().map((v) => v.label),
      getLabel(this.currentData, this.getCurrentDepth())
    ].join(" / ");
  }
  /** Switch tab via CSS display toggle — no DOM rebuild. */
  handleTabSwitch(tabId) {
    this.activeTab = tabId;
    switchTab(this.container, tabId, this.buildRenderContext());
  }
  /** Force-render any tabs not yet lazily rendered (needed for validate). */
  ensureAllTabsRendered() {
    const ctx = this.buildRenderContext();
    for (const tab of this.currentSchema.tabs) {
      if (!this.renderedTabs.has(tab.id)) {
        switchTab(this.container, tab.id, ctx);
      }
    }
    switchTab(this.container, this.activeTab, ctx);
  }
  render() {
    this.destroy();
    renderWorkbench(this.buildRenderContext());
  }
  onFieldChange(field, value) {
    setValue(this.currentData, field.key, value);
    updateSaveState(this.container, this.isDirty());
    if (field.key === "name" || field.key === "title") {
      const breadcrumbEl = this.container.querySelector(".mn-entity-workbench__breadcrumb");
      if (breadcrumbEl) breadcrumbEl.textContent = this.buildBreadcrumb();
    }
  }
  async handleSave() {
    if (!this.validate().valid) return;
    await this.options.onSave?.(this.getModifiedData());
    this.baseData = clone(this.currentData);
    this.render();
  }
  handleCancel() {
    if (this.isDirty() && typeof window !== "undefined" && !window.confirm("Discard unsaved changes?")) return;
    this.currentData = clone(this.baseData);
    this.render();
    this.options.onClose?.();
  }
};
function collectFields(tabs) {
  return tabs.flatMap((tab) => tab.sections.flatMap((section) => section.fields.flatMap((field) => field.type === "group" ? field.fields ?? [] : [field])));
}
function patternRule(field) {
  const pattern = field.options?.pattern;
  return typeof pattern === "string" && pattern.length ? `pattern:${pattern}` : "";
}
function getValue2(data, key) {
  return key.split(".").reduce((acc, part) => acc?.[part], data);
}
function setValue(data, key, value) {
  const parts = key.split(".");
  const last = parts.pop();
  if (!last) return;
  let cursor = data;
  parts.forEach((part) => {
    cursor[part] = cursor[part] ?? {};
    cursor = cursor[part];
  });
  cursor[last] = value;
}
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function getLabel(data, depth) {
  const value = data.name ?? data.title ?? data.id;
  return value != null ? String(value) : `Entity ${depth}`;
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
  const options = { particleTrail: true, glowEffect: true, ...opts };
  let nodes = options.nodes.slice();
  const messages = [];
  const flashes = [];
  const canvas = document.createElement("canvas");
  const _ctx = canvas.getContext("2d");
  if (!_ctx) {
    console.warn("[Maranello] networkMessages: 2D context unavailable");
    return null;
  }
  const ctx = _ctx;
  let raf = 0;
  let last = performance.now();
  host.innerHTML = "";
  host.style.position = "relative";
  host.style.overflow = "hidden";
  if (options.width) host.style.width = `${options.width}px`;
  if (options.height) host.style.height = `${options.height}px`;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Network message flow");
  canvas.setAttribute("tabindex", "0");
  host.appendChild(canvas);
  const getMap = () => new Map(nodes.map((node) => [node.id, node]));
  const point = (node) => ({ x: node.x * canvas.clientWidth, y: node.y * canvas.clientHeight });
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const mo = new MutationObserver(() => draw(16));
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let hit = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i], nx = n.x * w, ny = n.y * h;
      if (Math.hypot(mx - nx, my - ny) <= (n.size ?? 10) + 3) {
        hit = n;
        break;
      }
    }
    if (!hit) return;
    if (options.onNodeClick) options.onNodeClick(hit);
    canvas.dispatchEvent(new CustomEvent("mn-network-node-click", {
      detail: { node: hit },
      bubbles: true
    }));
  });
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
    ctx.setLineDash([]);
    for (const link of options.connections) {
      const from = map.get(link.from), to = map.get(link.to);
      if (!from || !to) continue;
      const a = point(from), b = point(to);
      const active = messages.some((msg) => msg.from === link.from && msg.to === link.to);
      const baseColor = link.color ?? "rgba(78,168,222,0.35)";
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dx = mx - 0.5 * width, dy = my - 0.5 * height;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const dist = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
      const cpx = mx + dx / len * dist * 0.28, cpy = my + dy / len * dist * 0.28;
      ctx.save();
      ctx.lineWidth = active ? 2 : 1.5;
      if (active && options.glowEffect) {
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 8;
      }
      const op = active ? 0.7 : 0.38;
      const recolor = (c) => c.replace(/[\d.]+\)$/, `${op})`);
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, link.color ? recolor(link.color) : `rgba(78,168,222,${op})`);
      grad.addColorStop(1, link.color ? recolor(link.color) : `rgba(255,199,44,${op})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }
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

// src/ts/neural-nodes-force.ts
var REPULSION = 4e3;
var ATTRACTION = 8e-3;
var GROUP_GRAVITY = 3e-3;
var DAMPING = 0.88;
var MAX_SPEED = 2.5;
function applyForces(nodes, connections, width, height) {
  const cx = width / 2, cy = height / 2;
  const groupCenters = computeGroupCenters(nodes);
  for (let i = 0; i < nodes.length; i++) {
    let fx = 0, fy = 0;
    const ni = nodes[i];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const nj = nodes[j];
      const dx = ni.x - nj.x, dy = ni.y - nj.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const force = REPULSION / (dist * dist);
      fx += dx / dist * force;
      fy += dy / dist * force;
    }
    fx += (cx - ni.x) * 2e-4;
    fy += (cy - ni.y) * 2e-4;
    if (ni.group && groupCenters.has(ni.group)) {
      const gc = groupCenters.get(ni.group);
      fx += (gc.x - ni.x) * GROUP_GRAVITY;
      fy += (gc.y - ni.y) * GROUP_GRAVITY;
    }
    ni.vx = (ni.vx + fx) * DAMPING;
    ni.vy = (ni.vy + fy) * DAMPING;
  }
  for (const conn of connections) {
    const a = nodes[conn.a], b = nodes[conn.b];
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const force = (dist - 80) * ATTRACTION * (conn.strength ?? 0.5);
    const nx = dx / Math.max(1, dist), ny = dy / Math.max(1, dist);
    a.vx += nx * force;
    a.vy += ny * force;
    b.vx -= nx * force;
    b.vy -= ny * force;
  }
  const pad2 = 28;
  for (const n of nodes) {
    n.vx = clampSpeed(n.vx);
    n.vy = clampSpeed(n.vy);
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < pad2) {
      n.x = pad2;
      n.vx *= -0.5;
    }
    if (n.x > width - pad2) {
      n.x = width - pad2;
      n.vx *= -0.5;
    }
    if (n.y < pad2) {
      n.y = pad2;
      n.vy *= -0.5;
    }
    if (n.y > height - pad2) {
      n.y = height - pad2;
      n.vy *= -0.5;
    }
  }
}
function clampSpeed(v) {
  return Math.max(-MAX_SPEED, Math.min(MAX_SPEED, v));
}
function computeGroupCenters(nodes) {
  const sums = /* @__PURE__ */ new Map();
  for (const n of nodes) {
    if (!n.group) continue;
    const entry = sums.get(n.group) ?? { sx: 0, sy: 0, count: 0 };
    entry.sx += n.x;
    entry.sy += n.y;
    entry.count++;
    sums.set(n.group, entry);
  }
  const centers = /* @__PURE__ */ new Map();
  for (const [group, { sx, sy, count }] of sums) {
    centers.set(group, { x: sx / count, y: sy / count });
  }
  return centers;
}

// src/ts/neural-nodes-labels.ts
var MAX_LABEL_CHARS = 25;
var BADGE_PAD_H = 6;
var BADGE_PAD_V = 2;
var BADGE_RADIUS = 4;
function truncate(text) {
  return text.length > MAX_LABEL_CHARS ? text.slice(0, MAX_LABEL_CHARS - 1) + "\u2026" : text;
}
function drawLabels(ctx, nodes, hovered, fontBase, alpha2) {
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n.label) continue;
    const visible = n.energy > 0.3 || i === hovered;
    if (!visible) continue;
    const fade = i === hovered ? 1 : Math.min(1, (n.energy - 0.3) * 2.5);
    const baseSize = n.size * 8;
    let yOff = baseSize + 6;
    ctx.font = `bold 10px ${fontBase}`;
    ctx.fillStyle = alpha2("#ffffff", 0.92 * fade);
    ctx.fillText(truncate(n.label), n.x, n.y + yOff);
    yOff += 13;
    if (n.sublabel) {
      ctx.font = `9px ${fontBase}`;
      ctx.fillStyle = alpha2("#c8c8c8", 0.7 * fade);
      ctx.fillText(truncate(n.sublabel), n.x, n.y + yOff);
      yOff += 12;
    }
    if (n.badge) {
      drawBadge(ctx, n.x, n.y + yOff, n.badge, n.color, fade, fontBase);
    }
  }
}
function drawBadge(ctx, cx, cy, text, color, fade, fontBase) {
  ctx.font = `bold 8px ${fontBase}`;
  const m = ctx.measureText(text);
  const w = m.width + BADGE_PAD_H * 2;
  const h = 12 + BADGE_PAD_V * 2;
  const x = cx - w / 2, y = cy;
  ctx.save();
  ctx.globalAlpha = 0.75 * fade;
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, x, y, w, h, BADGE_RADIUS);
  ctx.fill();
  ctx.globalAlpha = fade;
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, y + h / 2);
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
}

// src/ts/neural-nodes-draw.ts
function toAlpha(color, opacity) {
  const full = color.replace("#", "").replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3");
  const v = parseInt(full, 16);
  return Number.isNaN(v) ? `rgba(255,199,44,${opacity})` : `rgba(${v >> 16 & 255},${v >> 8 & 255},${v & 255},${opacity})`;
}
function drawFrame(ctx, now, s) {
  const w = ctx.canvas.clientWidth || 1, h = ctx.canvas.clientHeight || 1;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(4,10,18,0.28)";
  ctx.fillRect(0, 0, w, h);
  for (const l of s.connections) {
    const a = s.nodes[l.a], b = s.nodes[l.b];
    if (!a || !b) continue;
    const em = s.hovered === l.a || s.hovered === l.b;
    const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    const baseA = l.strength * 0.5;
    g.addColorStop(0, toAlpha(a.color, em ? 0.48 : baseA + a.energy * 0.18));
    g.addColorStop(0.55, toAlpha(b.color, 0.18 + Math.max(a.energy, b.energy) * 0.16));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = em ? 2 : 0.6 + l.strength * 1.2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  const visLanes = Math.max(1, Math.round(s.particleCount * (0.3 + s.activity * 0.7)));
  for (const p of s.particles) {
    if (p.lane >= visLanes) continue;
    const l = s.connections[p.connection];
    if (!l) continue;
    const a = s.nodes[l.a], b = s.nodes[l.b];
    if (!a || !b) continue;
    const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
    ctx.save();
    ctx.fillStyle = toAlpha(a.color, 0.65 + s.activity * 0.25);
    ctx.shadowColor = a.color;
    ctx.shadowBlur = 6 + s.activity * 8;
    ctx.beginPath();
    ctx.arc(x, y, 1.6 + s.activity * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (const wv of s.waves) {
    ctx.save();
    ctx.strokeStyle = toAlpha(wv.color, wv.life * 0.65);
    ctx.lineWidth = 1.5 + wv.life * 2;
    ctx.shadowColor = wv.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(wv.x, wv.y, wv.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  for (let i = 0; i < s.nodes.length; i++) {
    const n = s.nodes[i];
    const sz = n.size * 8;
    const pulse = sz * 0.3 + Math.sin(now * 2e-3 * s.pulseSpeed + n.phase) * 1.4 + n.energy * 3.2 + (s.hovered === i ? 2 : 0);
    ctx.save();
    ctx.fillStyle = toAlpha(n.color, 0.2);
    ctx.shadowColor = n.color;
    ctx.shadowBlur = 12 + n.energy * 12;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulse + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(n.x, n.y, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (s.labels) drawLabels(ctx, s.nodes, s.hovered, s.labelFont, toAlpha);
}

// src/ts/neural-nodes.ts
var DEFAULT_COLORS = ["#FFC72C", "#4EA8DE", "#00A651"];
var GROUP_COLORS = { claude: "#FFC72C", copilot: "#4EA8DE" };
function resolveContainer2(c) {
  const found = typeof c === "string" ? document.querySelector(c) : c;
  return found instanceof HTMLElement ? found : null;
}
function neuralNodes(container, opts = {}) {
  const target = resolveContainer2(container);
  if (!target) {
    console.warn("[Maranello] neuralNodes: container not found");
    return null;
  }
  const host = target;
  const dataMode = Array.isArray(opts.nodes) && opts.nodes.length > 0;
  const o = {
    nodeCount: 30,
    connectionDensity: 0.15,
    colors: DEFAULT_COLORS,
    pulseSpeed: 1,
    particleCount: 2,
    interactive: true,
    labels: dataMode,
    forceLayout: dataMode,
    labelFont: "monospace",
    ...opts
  };
  const canvas = document.createElement("canvas");
  const _ctx = canvas.getContext("2d");
  if (!_ctx) {
    console.warn("[Maranello] neuralNodes: 2D context unavailable");
    return null;
  }
  const ctx = _ctx;
  let nodes = [], connections = [], particles = [];
  const waves = [], activations = [];
  let activity = 0.55, hovered = -1, raf = 0, frame = 0, last = performance.now();
  host.innerHTML = "";
  host.style.position = "relative";
  host.style.overflow = "hidden";
  if (o.width) host.style.width = `${o.width}px`;
  if (o.height) host.style.height = `${o.height}px`;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Neural nodes visualization");
  canvas.setAttribute("tabindex", "0");
  host.appendChild(canvas);
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    hovered = nodes.findIndex((n) => Math.hypot(n.x - x, n.y - y) < 18 + n.energy * 8);
  };
  const onLeave = () => {
    hovered = -1;
  };
  function resize() {
    hiDpiCanvas(canvas, o.width ?? Math.max(360, host.clientWidth || 720), o.height ?? Math.max(280, host.clientHeight || 360));
    if (!nodes.length) initNodes();
    if (!dataMode) rebuildAutoConnections();
  }
  function toInternal(nd, w, h) {
    const color = nd.color ?? (nd.group && GROUP_COLORS[nd.group]) ?? o.colors[0];
    return {
      id: nd.id,
      x: 24 + Math.random() * (w - 48),
      y: 24 + Math.random() * (h - 48),
      vx: 0,
      vy: 0,
      color,
      phase: Math.random() * Math.PI * 2,
      energy: nd.energy ?? Math.random() * 0.4,
      size: nd.size ?? 1,
      label: nd.label,
      sublabel: nd.sublabel,
      badge: nd.badge,
      group: nd.group
    };
  }
  function initNodes() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    if (dataMode) {
      nodes = o.nodes.map((nd) => toInternal(nd, w, h));
      buildExplicitConnections();
    } else {
      nodes = Array.from({ length: o.nodeCount }, (_, i) => ({
        id: String(i),
        x: 24 + Math.random() * (w - 48),
        y: 24 + Math.random() * (h - 48),
        vx: (Math.random() - 0.5) * 0.025,
        vy: (Math.random() - 0.5) * 0.025,
        color: o.colors[i % o.colors.length],
        phase: Math.random() * Math.PI * 2,
        energy: Math.random() * 0.4,
        size: 1
      }));
    }
    updateAriaLabel();
  }
  function buildExplicitConnections() {
    if (!o.connections) {
      connections = [];
      spawnParticles();
      return;
    }
    const idMap = new Map(nodes.map((n, i) => [n.id, i]));
    connections = [];
    for (const c of o.connections) {
      const a = idMap.get(c.from), b = idMap.get(c.to);
      if (a !== void 0 && b !== void 0) connections.push({ a, b, strength: c.strength ?? 0.5 });
    }
    spawnParticles();
  }
  function rebuildAutoConnections() {
    const threshold = Math.min(canvas.clientWidth, canvas.clientHeight) * (0.14 + o.connectionDensity * 0.28);
    connections = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < threshold)
          connections.push({ a: i, b: j, strength: 0.5 });
      }
    }
    spawnParticles();
  }
  function spawnParticles() {
    particles = connections.flatMap((_, idx) => Array.from({ length: o.particleCount }, (_2, lane) => ({
      connection: idx,
      lane,
      t: Math.random(),
      speed: 12e-5 + Math.random() * 18e-5
    })));
    updateAriaLabel();
  }
  function updateAriaLabel() {
    canvas.setAttribute("aria-label", `Neural nodes: ${nodes.length} nodes, ${connections.length} connections`);
  }
  function resolveTarget(target2) {
    if (typeof target2 === "string") {
      const idx = nodes.findIndex((n) => n.id === target2);
      return idx >= 0 ? idx : Math.floor(Math.random() * nodes.length);
    }
    return target2 ?? Math.floor(Math.random() * nodes.length);
  }
  function triggerPulse(target2) {
    const nodeIndex = resolveTarget(target2);
    if (!nodes[nodeIndex]) return;
    const graph = Array.from({ length: nodes.length }, () => []);
    connections.forEach((l) => {
      graph[l.a].push(l.b);
      graph[l.b].push(l.a);
    });
    const queue = [[nodeIndex, 0]];
    const seen = /* @__PURE__ */ new Set([nodeIndex]);
    const start = performance.now();
    while (queue.length) {
      const [idx, hop] = queue.shift();
      activations.push({ at: start + hop * 100, index: idx });
      graph[idx].forEach((next) => {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push([next, hop + 1]);
        }
      });
    }
  }
  function update(dt, now) {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    while (activations[0] && activations[0].at <= now) {
      const cur = activations.shift();
      const n = nodes[cur.index];
      if (!n) continue;
      n.energy = 1.9;
      waves.push({ x: n.x, y: n.y, radius: 4, life: 1, color: n.color });
    }
    if (o.forceLayout && dataMode) {
      applyForces(nodes, connections, w, h);
    } else {
      nodes.forEach((n) => {
        n.vx = (n.vx + (Math.random() - 0.5) * 25e-4 * dt) * 0.985;
        n.vy = (n.vy + (Math.random() - 0.5) * 25e-4 * dt) * 0.985;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 16 || n.x > w - 16) n.vx *= -1;
        if (n.y < 16 || n.y > h - 16) n.vy *= -1;
        n.x = Math.max(16, Math.min(w - 16, n.x));
        n.y = Math.max(16, Math.min(h - 16, n.y));
      });
      if (++frame % 14 === 0) rebuildAutoConnections();
    }
    nodes.forEach((n) => {
      n.energy = Math.max(0, n.energy - dt * 16e-4);
    });
    particles.forEach((p) => {
      p.t = (p.t + dt * p.speed * (0.45 + activity * 1.8) * o.pulseSpeed) % 1;
    });
    for (let i = waves.length - 1; i >= 0; i--) {
      waves[i].life -= dt * 13e-4 * o.pulseSpeed;
      waves[i].radius += dt * 0.11 * o.pulseSpeed;
      if (waves[i].life <= 0) waves.splice(i, 1);
    }
  }
  function loop(now) {
    const dt = Math.min(48, now - last || 16);
    last = now;
    update(dt, now);
    drawFrame(ctx, now, { nodes, connections, particles, waves, hovered, activity, pulseSpeed: o.pulseSpeed, particleCount: o.particleCount, labels: o.labels, labelFont: o.labelFont });
    raf = requestAnimationFrame(loop);
  }
  function setAllNodes(data) {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    nodes = data.map((nd) => toInternal(nd, w, h));
    buildExplicitConnections();
  }
  resize();
  ro?.observe(host);
  if (o.interactive) {
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
    },
    setNodes: setAllNodes,
    setConnections: (data) => {
      o.connections = data;
      buildExplicitConnections();
    },
    addNode: (nd) => {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      nodes.push(toInternal(nd, w, h));
      buildExplicitConnections();
    },
    removeNode: (id) => {
      nodes = nodes.filter((n) => n.id !== id);
      buildExplicitConnections();
    },
    updateNode: (id, patch) => {
      const n = nodes.find((nd) => nd.id === id);
      if (!n) return;
      if (patch.label !== void 0) n.label = patch.label;
      if (patch.sublabel !== void 0) n.sublabel = patch.sublabel;
      if (patch.color !== void 0) n.color = patch.color;
      if (patch.size !== void 0) n.size = patch.size;
      if (patch.badge !== void 0) n.badge = patch.badge;
      if (patch.group !== void 0) n.group = patch.group;
      if (patch.energy !== void 0) n.energy = patch.energy;
    },
    highlightNode: (id) => {
      hovered = id === null ? -1 : nodes.findIndex((n) => n.id === id);
    }
  };
}

// src/ts/core/tokens.ts
var COLOR = {
  /** @deprecated Use `SEMANTIC_COLOR.ERROR`. */
  ROSSO_CORSA: "--mn-error",
  /** @deprecated Use `SEMANTIC_COLOR.ACCENT`. */
  GIALLO_FERRARI: "--mn-accent",
  VERDE_BANDIERA: "--verde-bandiera",
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  NERO_ASSOLUTO: "--mn-text-inverse",
  /** @deprecated Use `SEMANTIC_COLOR.SURFACE_RAISED`. */
  NERO_SOFT: "--mn-surface-raised",
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  BIANCO_PURO: "--mn-text",
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  BIANCO_CALDO: "--mn-text",
  /** @deprecated Use `SEMANTIC_COLOR.TEXT_TERTIARY`. */
  GRIGIO_CHIARO: "--mn-text-tertiary",
  /** @deprecated Use `SEMANTIC_COLOR.TEXT_MUTED`. */
  GRIGIO_MEDIO: "--mn-text-muted",
  /** @deprecated Use `SEMANTIC_COLOR.BORDER`. */
  GRIGIO_SCURO: "--mn-border",
  SIGNAL_DANGER: "--signal-danger",
  SIGNAL_WARNING: "--signal-warning",
  SIGNAL_SUCCESS: "--signal-success",
  SIGNAL_INFO: "--signal-info",
  /** @deprecated Use `SEMANTIC_COLOR.ACCENT`. */
  CHART_DEFAULT: "--mn-accent"
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

// src/ts/icon-svg.ts
var D = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
function svg(inner, strokeWidth = 1.5) {
  return `<svg ${D} stroke-width="${strokeWidth}">${inner}</svg>`;
}

// src/ts/icons-nav.ts
var navIcons = {
  dashboard: () => svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="11" width="7" height="10" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'),
  home: () => svg('<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>'),
  menu: () => svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
  chevronRight: () => svg('<polyline points="9 18 15 12 9 6"/>'),
  chevronDown: () => svg('<polyline points="6 9 12 15 18 9"/>'),
  chevronLeft: () => svg('<polyline points="15 18 9 12 15 6"/>'),
  chevronUp: () => svg('<polyline points="18 15 12 9 6 15"/>'),
  arrowUp: () => svg('<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'),
  arrowDown: () => svg('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>'),
  arrowLeft: () => svg('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
  arrowRight: () => svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
  externalLink: () => svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  sidebar: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>'),
  panelRight: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>'),
  columns: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>'),
  maximize: () => svg('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'),
  minimize: () => svg('<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>'),
  expand: () => svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>'),
  collapse: () => svg('<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>'),
  funnel: () => svg('<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>'),
  gantt: () => svg('<rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="12" height="4" rx="1"/><rect x="3" y="17" width="15" height="4" rx="1"/>'),
  table: () => svg('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>'),
  heatmap: () => svg('<rect x="2" y="2" width="6" height="6" rx="0.5"/><rect x="9" y="2" width="6" height="6" rx="0.5"/><rect x="16" y="2" width="6" height="6" rx="0.5"/><rect x="2" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/><rect x="16" y="9" width="6" height="6" rx="0.5"/><rect x="2" y="16" width="6" height="6" rx="0.5"/><rect x="9" y="16" width="6" height="6" rx="0.5"/><rect x="16" y="16" width="6" height="6" rx="0.5"/>'),
  grid: () => svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>')
};

// src/ts/icons-status.ts
var statusIcons = {
  checkCircle: () => svg('<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  alertTriangle: () => svg('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  alertCircle: () => svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
  info: () => svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'),
  atRisk: () => svg('<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1" fill="currentColor"/>'),
  completed: () => svg('<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/>'),
  blocked: () => svg('<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'),
  loader: () => svg('<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>'),
  shield: () => svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  shieldCheck: () => svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>')
};

// src/ts/icons-actions.ts
var actionIcons = {
  refresh: () => svg('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>'),
  settings: () => svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>'),
  close: () => svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  edit: () => svg('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'),
  copy: () => svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  trash: () => svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
  download: () => svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>'),
  upload: () => svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
  plus: () => svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'),
  minus: () => svg('<line x1="5" y1="12" x2="19" y2="12"/>'),
  filter: () => svg('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'),
  sort: () => svg('<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>'),
  search: () => svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  sliders: () => svg('<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>'),
  eye: () => svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  eyeOff: () => svg('<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>')
};

// src/ts/icons-data.ts
var dataIcons = {
  gauge: () => svg('<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12"/><path d="M12 12l4-8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
  trendUp: () => svg('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
  trendDown: () => svg('<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>'),
  barChart: () => svg('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  toggleOn: () => svg('<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="4" fill="currentColor"/>'),
  toggleOff: () => svg('<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="4"/>'),
  kpi: () => svg('<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="2" r="1" fill="currentColor"/>'),
  impact: () => svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'),
  pipeline: () => svg('<rect x="2" y="3" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="15" width="6" height="6" rx="1"/><path d="M8 6h1l3 3"/><path d="M15 12h1l3 3"/>'),
  orgChart: () => svg('<rect x="8" y="2" width="8" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="14" x2="5" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="19" y1="14" x2="19" y2="18"/>'),
  treeView: () => svg('<line x1="6" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="18" x2="10" y2="18"/><rect x="10" y="3" width="10" height="6" rx="1"/><rect x="10" y="9" width="10" height="6" rx="1"/><rect x="10" y="15" width="10" height="6" rx="1"/>')
};

// src/ts/icons-objects.ts
var objectIcons = {
  user: () => svg('<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  users: () => svg('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>'),
  userGroup: () => svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  briefcase: () => svg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>'),
  admin: () => svg('<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  key: () => svg('<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>'),
  lock: () => svg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  unlock: () => svg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>'),
  bell: () => svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  bellDot: () => svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="18" cy="4" r="3" fill="currentColor" stroke="none"/>'),
  mail: () => svg('<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/>'),
  message: () => svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  calendar: () => svg('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
  link: () => svg('<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>'),
  tag: () => svg('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>'),
  star: () => svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  file: () => svg('<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>'),
  folder: () => svg('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'),
  image: () => svg('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
  clock: () => svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  globe: () => svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  compass: () => svg('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.15" stroke="currentColor"/>'),
  bolt: () => svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  zap: () => svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  command: () => svg('<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>'),
  terminal: () => svg('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
  // Generic domain icons (renamed from ISE-specific)
  activity: () => svg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
  qualityCheck: () => svg('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'),
  report: () => svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>'),
  capacity: () => svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 3v18"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="15" r="1" fill="currentColor"/><rect x="12" y="12" width="6" height="3" rx="0.5" fill="currentColor" opacity="0.3"/>'),
  agent: () => svg('<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 15c0 0 1.5 2 3 2s3-2 3-2"/>'),
  accelerator: () => svg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  deliverable: () => svg('<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'),
  layers: () => svg('<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'),
  experiment: () => svg('<path d="M9 3h6"/><path d="M10 3v7.4a2 2 0 01-.6 1.4L4 17.2a2 2 0 00-.6 1.4V20a1 1 0 001 1h15.2a1 1 0 001-1v-1.4a2 2 0 00-.6-1.4L14.6 11.8a2 2 0 01-.6-1.4V3"/><circle cx="10" cy="16" r="1" fill="currentColor"/><circle cx="14" cy="18" r="1" fill="currentColor"/>'),
  mic: () => svg('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0014 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>')
};

// src/ts/icons-platform.ts
var platformIcons = {
  apple: () => svg('<path d="M14.2 6.2c.9-1.1 1.3-2.2 1.2-3.2-1.2.1-2.4.8-3.2 1.8-.7.9-1.2 2.1-1.1 3.2 1.2.1 2.3-.6 3.1-1.8z"/><path d="M12.2 8.5c-1.6 0-2.3.8-3.5.8S6.7 8.5 5.5 8.6C3.4 8.8 1.7 10.6 1.7 13c0 1.8.7 3.8 1.8 5.3 1 1.4 2.1 3 3.6 2.9 1.4-.1 1.9-.9 3.6-.9s2.1.9 3.6.9c1.6 0 2.5-1.5 3.5-2.9.8-1.1 1.2-2.2 1.4-2.8-2.7-1-3.1-4.9-.5-6.4-.7-1-1.9-1.6-3.1-1.6-1.5-.1-2.6.9-3.4.9z"/>'),
  windows: () => svg('<path d="M3 4.5l8-1v8H3zM13 3.2l8-1.2V11h-8zM3 13h8v8l-8-1zM13 13h8v10l-8-1.2z"/>'),
  linux: () => svg('<ellipse cx="12" cy="8" rx="4.5" ry="5.5"/><ellipse cx="12" cy="8.5" rx="2" ry="2.5" fill="currentColor" stroke="none" opacity="0.3"/><circle cx="10.2" cy="7.2" r="0.5" fill="currentColor" stroke="none"/><circle cx="13.8" cy="7.2" r="0.5" fill="currentColor" stroke="none"/><path d="M10.5 9.5q1.5 1 3 0"/><path d="M9 13.5c-2 1-3.5 2.5-3.5 5a1 1 0 001 1h11a1 1 0 001-1c0-2.5-1.5-4-3.5-5"/><ellipse cx="12" cy="15.5" rx="2.5" ry="2" fill="currentColor" stroke="none" opacity="0.15"/><path d="M9.5 13c0 1 .8 2.5 2.5 2.5s2.5-1.5 2.5-2.5"/><path d="M10 19.5l-1 2"/><path d="M14 19.5l1 2"/>', 1.3),
  android: () => svg('<path d="M8 10.5a4 4 0 0 1 8 0V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/><path d="M9.2 7.2L7.8 5.6M14.8 7.2l1.4-1.6M6 12v4M18 12v4"/><circle cx="10.3" cy="11.7" r=".4" fill="currentColor" stroke="none"/><circle cx="13.7" cy="11.7" r=".4" fill="currentColor" stroke="none"/>'),
  cpu: () => svg('<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4" rx=".6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  memory: () => svg('<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 8v8M11 8v8M15 8v8M19 8v8M5 19v2M9 19v2M13 19v2M17 19v2"/>'),
  disk: () => svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M18 17h.01"/>'),
  network: () => svg('<circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h8M17.6 7.4l-3.2 3.2M17.6 16.6l-3.2-3.2"/>'),
  wifi: () => svg('<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>'),
  bluetooth: () => svg('<path d="M8 6l8 6-8 6V6zM8 12l8-6M8 12l8 6"/>'),
  usb: () => svg('<path d="M12 3v12M12 3l-2 2M12 3l2 2M12 15l-3 3M12 15l3 3"/><circle cx="9" cy="19" r="1"/><rect x="14.5" y="17.5" width="3" height="3" rx=".5"/><path d="M12 10h5"/>'),
  server: () => svg('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01M11 7h7M11 17h7"/>'),
  database: () => svg('<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13"/><path d="M5 10c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5M5 14.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>'),
  cloud: () => svg('<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5a3.5 3.5 0 1 1 .8 6.9H7z"/>'),
  cloudSync: () => svg('<path d="M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5a3.5 3.5 0 1 1 .8 6.9H7z"/><path d="M9.5 14a2.8 2.8 0 0 1 4.6-1.5M14.5 15.8A2.8 2.8 0 0 1 10 17"/><path d="M14.1 10.9l.2 1.8-1.8.2M9.9 18.1l-.2-1.8 1.8-.2"/>'),
  terminal: () => svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12.5 15H17"/>'),
  code: () => svg('<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>'),
  git: () => svg('<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M12 8v8"/>'),
  gitPull: () => svg('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><path d="M8 5h6a4 4 0 0 1 4 4v4M6 7v10M10 13l-4 4-4-4" transform="translate(4 0)"/>'),
  gitMerge: () => svg('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 5h2a6 6 0 0 1 6 6M8 19h2a6 6 0 0 0 6-6"/>'),
  gitCommit: () => svg('<path d="M3 12h6M15 12h6"/><circle cx="12" cy="12" r="3"/>'),
  deploy: () => svg('<path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><path d="M12 9v6"/>'),
  pipeline: () => svg('<rect x="3" y="5" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="15" width="4" height="4" rx="1"/><path d="M7 7h3M14 12h3"/>'),
  docker: () => svg('<rect x="5" y="10" width="3" height="3"/><rect x="8" y="10" width="3" height="3"/><rect x="11" y="10" width="3" height="3"/><rect x="8" y="7" width="3" height="3"/><path d="M4 14h12c1.9 0 3.2-.9 4-2.5.3-.5.5-1 .7-1.6-1-.2-1.7-.8-2.2-1.6-.9.5-1.4 1.2-1.6 2.1H4z"/>'),
  brain: () => svg('<path d="M9 5a3 3 0 0 0-5 2v1a2.5 2.5 0 0 0 1.5 4.5V14a3 3 0 0 0 3 3h1.2M15 5a3 3 0 0 1 5 2v1a2.5 2.5 0 0 1-1.5 4.5V14a3 3 0 0 1-3 3h-1.2"/><path d="M9.7 8.5a2.3 2.3 0 0 1 4.6 0v7a2.3 2.3 0 0 1-4.6 0z"/>'),
  robot: () => svg('<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M2 12h3M19 12h3"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/><path d="M9 15h6"/>'),
  sparkle: () => svg('<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9zM5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9z"/>'),
  wand: () => svg('<path d="M4 20L20 4M14 4h2M18 2v2M18 6v2M20 4h2M6 14h2M10 12v2M10 16v2M12 14h2"/>'),
  lightbulb: () => svg('<path d="M9 18h6M10 22h4M8.5 14.5a6 6 0 1 1 7 0c-.8.7-1.2 1.6-1.4 2.5h-4.2c-.2-.9-.6-1.8-1.4-2.5z"/>'),
  ideaJar: () => svg('<path d="M8 4h8M9 4v2h6V4M7 9h10l-1 10a2 2 0 0 1-2 1H10a2 2 0 0 1-2-1z"/><path d="M10 12l1 .7L12 12l1 .7L14 12M11 15h2"/><path d="M12 8.5v-1M9.5 9.2l-.7-.7M14.5 9.2l.7-.7"/>'),
  nightAgent: () => svg('<path d="M14 3a7 7 0 1 0 7 7 6 6 0 0 1-7-7z"/><circle cx="10" cy="15.5" r="2.2"/><path d="M10 11.8v1.2M10 18v1.2M6.9 15.5h1.2M11.9 15.5h1.2M7.8 13.3l.8.8M11.4 16.9l.8.8M7.8 17.7l.8-.8M11.4 14.1l.8-.8"/>'),
  moonClock: () => svg('<path d="M14 3a7 7 0 1 0 7 7 6 6 0 0 1-7-7z"/><circle cx="9" cy="16" r="4"/><path d="M9 14v2.5l1.8 1"/>'),
  autopilot: () => svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 10V4M10.3 13l-5.6 2.4M13.7 13l5.6 2.4"/>'),
  delegate: () => svg('<path d="M3 11.5L21 3l-8.5 18-2.5-7z"/><path d="M10 14l11-11"/>'),
  start: () => svg('<polygon points="8,6 18,12 8,18"/>'),
  pause: () => svg('<rect x="7" y="6" width="3" height="12"/><rect x="14" y="6" width="3" height="12"/>'),
  stop: () => svg('<rect x="7" y="7" width="10" height="10" rx="1"/>'),
  reset: () => svg('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/>'),
  cancel: () => svg('<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'),
  runNow: () => svg('<polygon points="5,4 12,8.5 5,13"/><circle cx="15.5" cy="15.5" r="5.5"/><path d="M15.5 13v2.8l1.8 1"/>'),
  fixOn: () => svg('<path d="M14.5 5.5a4 4 0 0 0-5.8 4.9L3 16.1V21h4.9l5.8-5.7a4 4 0 0 0 4.9-5.8l-2.6 2.6-2.4-.5-.5-2.4z"/><path d="M13.5 18.5l2 2 5-5"/>'),
  mesh: () => svg('<circle cx="6" cy="17" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M7.7 15.9l2.6-5.8M13.7 9.9l2.6 5.8M8 17h8"/>'),
  coordinator: () => svg('<circle cx="12" cy="13" r="4"/><path d="M12 4l1.3 2.7 3 .4-2.2 2.1.5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.2-2.1 3-.4z"/><path d="M6 20h12"/>'),
  worker: () => svg('<circle cx="8" cy="9" r="3"/><path d="M8 6v-2M8 14v-2M5 9H3M13 9h-2M5.9 6.9L4.5 5.5M10.1 11.1l1.4 1.4M5.9 11.1l-1.4 1.4M10.1 6.9l1.4-1.4"/><path d="M12 20h9M12 16h6"/>'),
  sync: () => svg('<path d="M20 7h-5V2M4 17h5v5"/><path d="M6.5 8.5A7 7 0 0 1 18 7M17.5 15.5A7 7 0 0 1 6 17"/>'),
  discover: () => svg('<circle cx="10" cy="10" r="5"/><path d="M13.5 13.5L20 20"/><circle cx="8" cy="10" r=".6" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r=".6" fill="currentColor" stroke="none"/><circle cx="11.5" cy="12.5" r=".6" fill="currentColor" stroke="none"/><path d="M8.6 9.8l2.8-1.5M8.6 10.2l2.3 2"/>'),
  push: () => svg('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M4 14v6h16v-6"/>'),
  addPeer: () => svg('<circle cx="8" cy="14" r="3"/><circle cx="16" cy="14" r="3"/><path d="M11 14h2M16 5v6M13 8h6"/>'),
  moon: () => svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
  sun: () => svg('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'),
  contrast: () => svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" stroke="none"/>')
};

// src/ts/icons.ts
var baseIcons = {
  ...navIcons,
  ...statusIcons,
  ...actionIcons,
  ...dataIcons,
  ...objectIcons,
  ...platformIcons
};
var iconAliases = {
  fastForward: baseIcons.accelerator,
  shuffle: baseIcons.sync,
  target: baseIcons.compass,
  share: baseIcons.network,
  trendingUp: baseIcons.trendUp,
  pieChart: baseIcons.dashboard
};
var icons = { ...baseIcons, ...iconAliases };
function renderIcon(target, name, opts) {
  const el5 = typeof target === "string" ? document.querySelector(target) : target;
  if (!el5 || !icons[name]) return;
  const sizeClass = opts?.size ? ` mn-icon--${opts.size}` : "";
  const extraClass = opts?.class ? ` ${opts.class}` : "";
  const svg2 = icons[name]();
  const safeLabel = opts?.ariaLabel ? escapeHtml(opts.ariaLabel).replace(/"/g, "&quot;") : "";
  const ariaAttr = safeLabel ? `role="img" aria-label="${safeLabel}"` : 'aria-hidden="true"';
  const a11ySvg = svg2.replace("<svg ", `<svg ${ariaAttr} `);
  el5.innerHTML = `<span class="mn-icon${sizeClass}${extraClass}">${a11ySvg}</span>`;
}
function iconCatalog() {
  return Object.keys(icons);
}

// src/ts/theme-toggle.ts
var THEME_ICONS = {
  editorial: platformIcons.contrast,
  nero: platformIcons.moon,
  avorio: platformIcons.sun,
  colorblind: actionIcons.eye,
  sugar: platformIcons.sparkle
};
var LABELS = {
  editorial: "Editorial (mixed)",
  nero: "Full Nero",
  avorio: "Full Avorio",
  colorblind: "Colorblind-safe",
  sugar: "Sugar"
};
function themeIcon(mode) {
  const factory = THEME_ICONS[mode];
  if (!factory) return "";
  return `<span class="mn-icon mn-icon--sm" aria-hidden="true">${factory()}</span>`;
}
function initThemeToggle(toggleId, gaugeInstances = [], onAutoContrast) {
  const toggle = typeof toggleId === "string" ? document.getElementById(toggleId) : toggleId;
  if (!toggle) {
    return {
      getMode: () => getTheme(),
      setMode: (m) => setTheme(m),
      destroy: () => {
      }
    };
  }
  let current2 = getTheme();
  toggle.innerHTML = themeIcon(current2);
  toggle.title = LABELS[current2];
  toggle.setAttribute("aria-label", LABELS[current2]);
  function applyTheme() {
    toggle.innerHTML = themeIcon(current2);
    toggle.title = LABELS[current2];
    toggle.setAttribute("aria-label", LABELS[current2]);
    requestAnimationFrame(() => {
      gaugeInstances.forEach((g) => g.redraw());
      if (onAutoContrast) onAutoContrast(".mn-treemap__cell");
    });
  }
  const onClick = () => {
    current2 = cycleTheme();
    applyTheme();
  };
  toggle.addEventListener("click", onClick);
  return {
    getMode: () => current2,
    setMode: (mode) => {
      current2 = mode;
      setTheme(mode);
      applyTheme();
    },
    destroy: () => {
      toggle.removeEventListener("click", onClick);
    }
  };
}

// src/ts/theme-rotary.ts
var THEME_POSITIONS = [
  { mode: "editorial", label: "ED", angle: -45 },
  { mode: "nero", label: "NR", angle: 45 },
  { mode: "avorio", label: "AV", angle: 135 },
  { mode: "colorblind", label: "CB", angle: 225 }
];
var STYLE_ID = "mn-theme-rotary-css";
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
.mn-theme-rotary{display:inline-flex;flex-direction:column;align-items:center;user-select:none;gap:8px}
.mn-theme-rotary__dial{position:relative;border-radius:50%}
.mn-theme-rotary__ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--mn-border);pointer-events:none}
.mn-theme-rotary__pointer{position:absolute;top:8px;left:50%;width:2px;border-radius:1px;background:var(--mn-accent);transform:translateX(-50%) rotate(0deg);transform-origin:50% calc(var(--rotary-center) - 8px);pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1)}
.mn-theme-rotary__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:.55rem;color:var(--mn-text-muted);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);white-space:nowrap;transition:color .15s}
.mn-theme-rotary__pos--active{color:var(--mn-text);font-weight:700}
.mn-theme-rotary__center{position:absolute;top:50%;left:50%;border-radius:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center}
`;
  document.head.appendChild(s);
}
function angleForTheme(mode) {
  return THEME_POSITIONS.find((p) => p.mode === mode)?.angle ?? -45;
}
function themeRotary(opts) {
  ensureStyles();
  const { container, size = 140 } = opts;
  const center = size / 2;
  const labelRadius = size / 2 + 18;
  const pointerLen = size * 0.18;
  const centerSize = size * 0.32;
  const root = createElement("div", "mn-theme-rotary");
  const dial = createElement("div", "mn-theme-rotary__dial");
  dial.style.width = dial.style.height = size + "px";
  root.appendChild(dial);
  const ring = createElement("div", "mn-theme-rotary__ring");
  dial.appendChild(ring);
  const pointer = createElement("div", "mn-theme-rotary__pointer");
  pointer.style.height = pointerLen + "px";
  pointer.style.setProperty("--rotary-center", center + "px");
  dial.appendChild(pointer);
  const labels = /* @__PURE__ */ new Map();
  for (const pos of THEME_POSITIONS) {
    const rad = (pos.angle - 90) * (Math.PI / 180);
    const lx = center + Math.cos(rad) * labelRadius;
    const ly = center + Math.sin(rad) * labelRadius;
    const el5 = createElement("div", "mn-theme-rotary__pos");
    el5.textContent = pos.label;
    el5.style.left = lx + "px";
    el5.style.top = ly + "px";
    el5.dataset.theme = pos.mode;
    el5.addEventListener("click", () => applyTheme(pos.mode));
    dial.appendChild(el5);
    labels.set(pos.mode, el5);
  }
  const centerBtn = createElement("div", "mn-theme-rotary__center");
  centerBtn.style.width = centerBtn.style.height = centerSize + "px";
  centerBtn.style.background = "radial-gradient(circle at 40% 35%, var(--mn-border), var(--mn-surface-raised))";
  centerBtn.style.boxShadow = "0 3px 8px rgba(0,0,0,.55), inset 0 1px 1px rgba(255,255,255,.15)";
  centerBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="var(--mn-accent)" opacity="0.7"/></svg>';
  dial.appendChild(centerBtn);
  container.appendChild(root);
  const rotaryId = "mn-rotary-" + Math.random().toString(36).slice(2, 7);
  root.setAttribute("role", "radiogroup");
  root.setAttribute("aria-label", "Theme selector");
  root.setAttribute("tabindex", "0");
  for (const [mode, el5] of labels) {
    el5.id = `${rotaryId}-${mode}`;
    el5.setAttribute("role", "radio");
    el5.setAttribute("aria-checked", String(mode === getTheme()));
  }
  root.setAttribute("aria-activedescendant", `${rotaryId}-${getTheme()}`);
  root.addEventListener("keydown", (e) => {
    const current2 = getTheme();
    const idx = THEME_POSITIONS.findIndex((p) => p.mode === current2);
    let next = idx;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        next = (idx + 1) % THEME_POSITIONS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        next = (idx - 1 + THEME_POSITIONS.length) % THEME_POSITIONS.length;
        break;
      case "Home":
        e.preventDefault();
        next = 0;
        break;
      case "End":
        e.preventDefault();
        next = THEME_POSITIONS.length - 1;
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        return;
      default:
        return;
    }
    applyTheme(THEME_POSITIONS[next].mode);
  });
  function applyTheme(mode) {
    setTheme(mode);
    updateVisual();
    eventBus.emit("theme:change", { theme: mode });
    opts.onChange?.(mode);
  }
  function updateVisual() {
    const current2 = getTheme();
    const angle = angleForTheme(current2);
    pointer.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    root.setAttribute("aria-activedescendant", `${rotaryId}-${current2}`);
    for (const [mode, el5] of labels) {
      const active = mode === current2;
      el5.classList.toggle("mn-theme-rotary__pos--active", active);
      el5.setAttribute("aria-checked", String(active));
    }
  }
  updateVisual();
  return {
    getTheme,
    setTheme: applyTheme,
    destroy: () => {
      root.remove();
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
  const isUrgent = opts.type === "error" || opts.type === "warning";
  toastEl.setAttribute("role", isUrgent ? "alert" : "status");
  toastEl.setAttribute("aria-live", isUrgent ? "assertive" : "polite");
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

// src/ts/command-palette.ts
function getVisibleItems(palette2) {
  const all = palette2.querySelectorAll(".mn-command-palette__item");
  return Array.from(all).filter((el5) => el5.style.display !== "none");
}
function clearActive(palette2) {
  palette2.querySelectorAll(".mn-command-palette__item").forEach((el5) => {
    el5.classList.remove("mn-command-palette__item--active");
    el5.setAttribute("aria-selected", "false");
  });
}
function activateItem(input, items, index) {
  items.forEach((el5, i) => {
    const active = i === index;
    el5.classList.toggle("mn-command-palette__item--active", active);
    el5.setAttribute("aria-selected", String(active));
  });
  const target = items[index];
  if (target) {
    input.setAttribute("aria-activedescendant", target.id || "");
    target.scrollIntoView({ block: "nearest" });
  }
}
function commandPalette(id) {
  const palette2 = document.getElementById(id);
  if (!palette2) return { open: () => {
  }, close: () => {
  } };
  const input = palette2.querySelector(".mn-command-palette__input");
  const listEl = palette2.querySelector(".mn-command-palette__list");
  const items = palette2.querySelectorAll(".mn-command-palette__item");
  let activeIndex = -1;
  if (listEl) {
    listEl.setAttribute("role", "listbox");
    const listId = id + "-list";
    listEl.id = listId;
    if (input) input.setAttribute("aria-owns", listId);
  }
  if (input) {
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-activedescendant", "");
  }
  items.forEach((item, i) => {
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", "false");
    if (!item.id) item.id = id + "-item-" + i;
  });
  function open() {
    palette2.classList.add("mn-command-palette--open");
    if (input) {
      input.value = "";
      input.setAttribute("aria-expanded", "true");
      input.focus();
    }
    activeIndex = -1;
    clearActive(palette2);
    filterItems("");
  }
  function close() {
    palette2.classList.remove("mn-command-palette--open");
    if (input) {
      input.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-activedescendant", "");
    }
    activeIndex = -1;
  }
  function selectItem(item) {
    const text = item.querySelector(".mn-command-palette__item-text");
    eventBus.emit("command-select", { text: text?.textContent ?? "" });
    close();
  }
  function filterItems(query) {
    const q = query.toLowerCase();
    items.forEach((item) => {
      const text = item.querySelector(".mn-command-palette__item-text");
      const match = !q || (text?.textContent?.toLowerCase().includes(q) ?? false);
      item.style.display = match ? "" : "none";
    });
    activeIndex = -1;
    clearActive(palette2);
  }
  if (input) {
    input.addEventListener("input", () => filterItems(input.value));
    input.addEventListener("keydown", (e) => {
      const visible = getVisibleItems(palette2);
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          activeIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0;
          activateItem(input, visible, activeIndex);
          break;
        case "ArrowUp":
          e.preventDefault();
          activeIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1;
          activateItem(input, visible, activeIndex);
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < visible.length) {
            selectItem(visible[activeIndex]);
          }
          break;
        case "Escape":
          close();
          break;
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      palette2.classList.contains("mn-command-palette--open") ? close() : open();
    }
  });
  items.forEach((item) => {
    item.addEventListener("click", () => selectItem(item));
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
  let color = STATUS_COLORS[status] ?? cssVar("--stage-completed", "#6B7280");
  if (!isValidColor(color)) color = "var(--mn-border-strong)";
  const pct3 = status === "healthy" ? 95 : status === "degraded" ? 55 : 10;
  const sz = 56, cx = sz / 2, cy = sz - 4, r = 22;
  const startAngle = Math.PI, needleAngle = startAngle + clamp(pct3, 0, 100) / 100 * Math.PI;
  const light = document.body.classList.contains("mn-sugar") || document.body.classList.contains("mn-avorio");
  const tickStroke = light ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";
  const trackStroke = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";
  const dotFill = light ? "#ddd" : "#111";
  let ticks = "";
  for (let i = 0; i <= 6; i++) {
    const a = startAngle + i / 6 * Math.PI;
    const tx1 = cx + Math.cos(a) * (r - 4), ty1 = cy + Math.sin(a) * (r - 4);
    const tx2 = cx + Math.cos(a) * r, ty2 = cy + Math.sin(a) * r;
    ticks += `<line x1="${tx1.toFixed(1)}" y1="${ty1.toFixed(1)}" x2="${tx2.toFixed(1)}" y2="${ty2.toFixed(1)}" stroke="${tickStroke}" stroke-width="1"/>`;
  }
  const nx = cx + Math.cos(needleAngle) * (r - 8);
  const ny = cy + Math.sin(needleAngle) * (r - 8);
  const latencyText = latencyMs != null ? `${latencyMs}ms` : "";
  return `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-label="${escapeHtml(label)}"><path d="${arc(cx, cy, r, startAngle, 2 * Math.PI)}" fill="none" stroke="${trackStroke}" stroke-width="4" stroke-linecap="round"/><path d="${arc(cx, cy, r, startAngle, needleAngle)}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" style="filter:drop-shadow(0 0 4px ${color}60)"/>` + ticks + `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="1" fill="${dotFill}"/>` + (latencyText ? `<text x="${cx}" y="${cy - r - 6}" text-anchor="middle" fill="${color}" font-family="var(--font-mono)" font-size="7" font-weight="600">${latencyText}</text>` : "") + "</svg>";
}
function compassSVG(size) {
  const light = document.body.classList.contains("mn-sugar") || document.body.classList.contains("mn-avorio");
  const bezelStart = light ? "#ddd" : "#666";
  const bezelEnd = light ? "#bbb" : "#1a1a1a";
  const face = light ? "#f0f0f4" : "#0d0d0d";
  const center = light ? "#e4e4ea" : "#1a1a1a";
  const minor = light ? "rgba(0,0,0,.25)" : "rgba(255,255,255,.4)";
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${bezelStart}"/><stop offset="100%" stop-color="${bezelEnd}"/></linearGradient><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFD85C"/><stop offset="50%" stop-color="#FFC72C"/><stop offset="100%" stop-color="#E8A838"/></linearGradient><linearGradient id="ln" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF4444"/><stop offset="100%" stop-color="#CC0000"/></linearGradient><filter id="lg2"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="32" cy="32" r="31" fill="url(#lb)" stroke="#555" stroke-width=".5"/><circle cx="32" cy="32" r="27" fill="${face}"/><g stroke="url(#lg)" stroke-width="1.5" stroke-linecap="round" filter="url(#lg2)"><line x1="32" y1="6" x2="32" y2="11"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(90,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(180,32,32)"/><line x1="32" y1="6" x2="32" y2="11" transform="rotate(270,32,32)"/></g><g stroke="${minor}" stroke-width="1" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="10" transform="rotate(45,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(135,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(225,32,32)"/><line x1="32" y1="6" x2="32" y2="10" transform="rotate(315,32,32)"/></g><text x="32" y="16" text-anchor="middle" dominant-baseline="middle" fill="#FFC72C" font-family="'Barlow Condensed',sans-serif" font-weight="700" font-size="7" filter="url(#lg2)">N</text><polygon points="32,10 29,32 32,30 35,32" fill="url(#ln)" filter="url(#lg2)"/><polygon points="32,54 29,32 32,34 35,32" fill="#999"/><circle cx="32" cy="32" r="4" fill="url(#lg)" filter="url(#lg2)"/><circle cx="32" cy="32" r="2" fill="${center}"/></svg>`;
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
  if (opts.showStatus !== false) {
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
  }
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
    }).catch((err) => {
      console.warn("[Maranello] loginScreen: health fetch failed:", err);
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
function el2(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = String(v).trimStart().startsWith("<svg") ? String(v) : escapeHtml(String(v));
      else e.setAttribute(k, sanitizeAttr(k, v));
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
      const block = el2("div", "mn-chat-msg__code");
      const pre = el2("pre", "");
      pre.textContent = code;
      block.appendChild(pre);
      const copyBtn = el2("button", "mn-chat-msg__copy", { "aria-label": "Copy code" });
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
      const span = el2("span", "");
      span.innerHTML = escapeHtml(part).replace(/`([^`]+)`/g, '<code class="mn-chat-msg__code">$1</code>').replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
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
  const fab = el2("button", "mn-chat-fab", { "aria-label": "Open AI assistant", title: "AI Assistant" });
  if (opts.avatar) {
    const fabImg = document.createElement("img");
    fabImg.src = opts.avatar;
    fabImg.className = "mn-chat-fab__avatar";
    fabImg.alt = "AI";
    fab.appendChild(fabImg);
  } else {
    fab.innerHTML = ICON_SPARK;
  }
  const pulse = el2("span", "mn-chat-fab__pulse");
  fab.appendChild(pulse);
  container.appendChild(fab);
  const panel = el2("div", "mn-chat-panel", { role: "dialog", "aria-label": "AI assistant chat" });
  panel.appendChild(el2("div", "mn-chat-panel__accent"));
  const resizeHandle = el2("div", "mn-chat-panel__resize");
  panel.appendChild(resizeHandle);
  const header2 = el2("div", "mn-chat-panel__header");
  const headerLeft = el2("div", "mn-chat-panel__header-left");
  if (opts.avatar) {
    const ha = el2("img", "mn-chat-panel__header-avatar");
    ha.src = opts.avatar;
    ha.alt = "";
    headerLeft.appendChild(ha);
  }
  const titleEl = el2("span", "mn-chat-panel__title", { text: opts.avatar ? "" : opts.title ?? "" });
  const agentSelector = el2("button", "mn-chat-agent-selector", { type: "button", "aria-label": "Select AI agent" });
  const agentSelectorLabel = el2("span", "mn-chat-agent-selector__label");
  agentSelector.appendChild(agentSelectorLabel);
  agentSelector.appendChild(el2("span", "mn-chat-agent-selector__chevron", { html: getIcon("chevronDown") }));
  const headerActions = el2("div", "mn-chat-panel__header-actions");
  const closeBtn = el2("button", "mn-chat-panel__close", { "aria-label": "Close chat" });
  closeBtn.innerHTML = getIcon("close");
  const widthBtn = el2("button", "mn-chat-panel__resize", { "aria-label": "Toggle panel width" });
  widthBtn.innerHTML = getIcon("expandHorizontal");
  headerActions.appendChild(widthBtn);
  headerActions.appendChild(closeBtn);
  headerLeft.appendChild(titleEl);
  if (opts.agents?.length) headerLeft.appendChild(agentSelector);
  header2.appendChild(headerLeft);
  header2.appendChild(headerActions);
  panel.appendChild(header2);
  const agentGrid = el2("div", "mn-chat-agent-grid", { "aria-hidden": "true" });
  panel.appendChild(agentGrid);
  const messagesEl = el2("div", "mn-chat-panel__messages");
  panel.appendChild(messagesEl);
  const typingEl = el2("div", "mn-chat-typing");
  typingEl.style.display = "none";
  for (let d = 0; d < 3; d++) typingEl.appendChild(el2("span", "mn-chat-typing__dot"));
  messagesEl.appendChild(typingEl);
  const quickBar = el2("div", "mn-chat-panel__quick");
  panel.appendChild(quickBar);
  const inputArea = el2("div", "mn-chat-panel__input-area");
  const inputEl = el2("textarea", "mn-chat-panel__input", { placeholder: opts.placeholder ?? "", rows: "1" });
  const sendBtn = el2("button", "mn-chat-panel__send", { "aria-label": "Send message" });
  sendBtn.innerHTML = getIcon("arrowUp");
  const voiceBtn = el2("button", "mn-chat-voice", { "aria-label": "Toggle voice input" });
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
    const wrap = el2("div", `mn-chat-msg mn-chat-msg--${msg.role}`);
    if (msg.role === "ai") {
      const iconWrap = el2("span", "mn-chat-msg__icon");
      iconWrap.innerHTML = ICON_SPARK;
      const body = el2("div", "mn-chat-msg__body");
      body.appendChild(iconWrap);
      const contentEl = el2("span", "mn-chat-msg__content");
      contentEl.appendChild(renderContent(msg.content));
      body.appendChild(contentEl);
      wrap.appendChild(body);
    } else {
      if (opts.avatar) {
        const body = el2("div", "mn-chat-msg__body");
        const contentEl = el2("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        body.appendChild(contentEl);
        body.appendChild(el2("img", "mn-chat-msg__avatar", { src: opts.avatar ?? "", alt: "You" }));
        wrap.appendChild(body);
      } else {
        const contentEl = el2("span", "mn-chat-msg__content");
        contentEl.appendChild(renderContent(msg.content));
        wrap.appendChild(contentEl);
      }
    }
    wrap.appendChild(el2("div", "mn-chat-msg__time", { text: formatTime(msg.time) }));
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
  function autoResize2() {
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
    try {
      if (opts.onSend) {
        setTyping(true);
        handleResult(opts.onSend(text));
      }
    } catch (err) {
      setTyping(false);
      addMessage("ai", `Error: ${err.message ?? String(err)}`);
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
      const card = el2("button", "mn-chat-agent-card", { type: "button" });
      if (agent.id === state.activeAgentId) card.classList.add("mn-chat-agent-card--active");
      const iconEl = el2("span", "mn-chat-agent-card__icon");
      if (agent.icon && /<svg/i.test(agent.icon)) {
        const safeSvg = sanitizeSvg(agent.icon);
        if (safeSvg) iconEl.innerHTML = safeSvg;
        else iconEl.textContent = "\u{1F916}";
      } else iconEl.textContent = agent.icon ?? "\u{1F916}";
      card.appendChild(iconEl);
      card.appendChild(el2("span", "mn-chat-agent-card__label", { text: agent.label ?? agent.id }));
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
  function clear2() {
    state.messages.length = 0;
    messagesEl.querySelectorAll(".mn-chat-msg").forEach((n) => n.remove());
    setTyping(false);
  }
  for (const action of opts.quickActions ?? []) {
    const btn = el2("button", "mn-chat-panel__quick-btn", { text: action });
    btn.addEventListener("click", () => handleQuickAction(action));
    quickBar.appendChild(btn);
  }
  if ((opts.agents ?? []).length) {
    updateAgentSelectorLabel();
    renderAgentGrid();
    agentSelector.addEventListener("click", () => toggleAgentGrid());
  }
  inputEl.addEventListener("input", () => {
    autoResize2();
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
  state.clear = clear2;
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

// src/ts/theme-picker.ts
var THEMES = [
  { id: "editorial", label: "Editorial", surface: "#111111", card: "#1a1a1a", accent: "#FFC72C", error: "#DC0000", info: "#448AFF" },
  { id: "nero", label: "Nero", surface: "#050505", card: "#111111", accent: "#FFC72C", error: "#DC0000", info: "#448AFF" },
  { id: "avorio", label: "Avorio", surface: "#FAF3E6", card: "#FFFFFF", accent: "#DC0000", error: "#DC0000", info: "#448AFF" },
  { id: "colorblind", label: "Colorblind", surface: "#111111", card: "#1a1a1a", accent: "#0072B2", error: "#C94000", info: "#0072B2" },
  { id: "sugar", label: "Sugar", surface: "#E4E4E8", card: "#FFFFFF", accent: "#000000", error: "#DC0000", info: "#448AFF" }
];
function buildCard(theme, isActive) {
  const card = document.createElement("div");
  card.className = "mn-theme-picker__card" + (isActive ? " mn-theme-picker__card--active" : "");
  card.setAttribute("role", "radio");
  card.setAttribute("aria-checked", String(isActive));
  card.setAttribute("tabindex", "0");
  card.setAttribute("data-theme", theme.id);
  const themeLocale = getLocale().themes;
  const locLabel = themeLocale[theme.id] || theme.label;
  card.setAttribute("aria-label", `${escapeHtml(locLabel)} theme`);
  const header2 = document.createElement("div");
  header2.className = "mn-theme-picker__header";
  const radio = document.createElement("span");
  radio.className = "mn-theme-picker__radio";
  radio.setAttribute("aria-hidden", "true");
  header2.appendChild(radio);
  const name = document.createElement("span");
  name.className = "mn-theme-picker__name";
  name.textContent = locLabel;
  header2.appendChild(name);
  card.appendChild(header2);
  const preview = document.createElement("div");
  preview.className = "mn-theme-picker__preview";
  preview.style.backgroundColor = theme.surface;
  const previewCard = document.createElement("div");
  previewCard.className = "mn-theme-picker__preview-card";
  previewCard.style.backgroundColor = theme.card;
  const formLabel = document.createElement("div");
  formLabel.className = "mn-theme-picker__preview-label";
  const isLight = theme.id === "avorio" || theme.id === "sugar";
  formLabel.style.backgroundColor = isLight ? "#999" : "#555";
  const formInput = document.createElement("div");
  formInput.className = "mn-theme-picker__preview-input";
  formInput.style.borderColor = isLight ? "#ccc" : "#444";
  const dots = document.createElement("div");
  dots.className = "mn-theme-picker__dots";
  for (const color of [theme.accent, theme.error, theme.info]) {
    const dot = document.createElement("span");
    dot.className = "mn-theme-picker__dot";
    dot.style.backgroundColor = color;
    dots.appendChild(dot);
  }
  previewCard.appendChild(formLabel);
  previewCard.appendChild(formInput);
  previewCard.appendChild(dots);
  preview.appendChild(previewCard);
  card.appendChild(preview);
  return card;
}
function themePicker(container, options) {
  const current2 = options?.current ?? getTheme();
  let selected = THEMES.some((t) => t.id === current2) ? current2 : "editorial";
  const grid = document.createElement("div");
  grid.className = "mn-theme-picker" + (options?.compact ? " mn-theme-picker--compact" : "");
  grid.setAttribute("role", "radiogroup");
  grid.setAttribute("aria-label", "Theme selection");
  function render5() {
    grid.innerHTML = "";
    for (const theme of THEMES) {
      const card = buildCard(theme, theme.id === selected);
      card.addEventListener("click", () => select(theme.id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(theme.id);
        }
      });
      grid.appendChild(card);
    }
  }
  function select(id) {
    selected = id;
    setTheme(id);
    render5();
    options?.onChange?.(id);
  }
  render5();
  container.appendChild(grid);
  return {
    destroy() {
      grid.remove();
    },
    getTheme() {
      return selected;
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
  const el5 = document.createElement("span");
  el5.className = cls;
  if (url) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = name || "User avatar";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%";
    img.onerror = () => {
      img.remove();
      el5.textContent = initials(name);
    };
    el5.appendChild(img);
  } else {
    el5.textContent = initials(name);
  }
  return el5;
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
  const header2 = document.createElement("div");
  header2.className = "mn-profile-dropdown__header";
  header2.appendChild(buildLargeAvatar(opts.name, opts.avatarUrl));
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
  header2.appendChild(info);
  dd.appendChild(header2);
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
    if (section.type === "theme-switcher") {
      const pickerHost = document.createElement("div");
      sectionEl.appendChild(pickerHost);
      dd.appendChild(sectionEl);
      themePicker(pickerHost, { compact: true });
      continue;
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
    maxWidth: 320,
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
    dropdown.style.maxWidth = `${opts.maxWidth}px`;
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
    itemEls.forEach((el5, i) => el5.classList.toggle("mn-profile-dropdown__item--focused", i === focusIdx));
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
  const onResize = throttle(() => {
    if (isOpen) positionDropdown();
  }, 300);
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

// src/ts/header.ts
function isProfile(item) {
  return typeof item === "object" && "type" in item && item.type === "profile";
}
function isSeparator(item) {
  return item === "separator";
}
function createButton(btn) {
  const el5 = document.createElement("button");
  el5.type = "button";
  el5.className = "mn-header__btn";
  el5.dataset.headerId = btn.id;
  const a11y = btn.title || btn.label || "";
  if (a11y) {
    el5.title = a11y;
    el5.setAttribute("aria-label", a11y);
  }
  if (btn.active) el5.classList.add("mn-header__btn--active");
  if (btn.icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = "mn-header__btn-icon";
    iconSpan.innerHTML = btn.icon;
    el5.appendChild(iconSpan);
  }
  if (btn.label) {
    const labelSpan = document.createElement("span");
    labelSpan.textContent = btn.label;
    el5.appendChild(labelSpan);
  }
  if (btn.onClick) el5.addEventListener("click", btn.onClick);
  el5.addEventListener("click", () => {
    el5.dispatchEvent(new CustomEvent("header-button-click", {
      detail: { id: btn.id, label: btn.label || btn.title || "" },
      bubbles: true
    }));
  });
  return el5;
}
function createSep() {
  const el5 = document.createElement("span");
  el5.className = "mn-header__sep";
  el5.setAttribute("role", "separator");
  return el5;
}
function header(container, options) {
  const opts = options ?? {};
  const nav = document.createElement("nav");
  nav.className = "mn-header";
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", "Main navigation");
  const leftZone = document.createElement("div");
  leftZone.className = "mn-header__zone mn-header__zone--left";
  const centerZone = document.createElement("div");
  centerZone.className = "mn-header__zone mn-header__zone--center";
  const rightZone = document.createElement("div");
  rightZone.className = "mn-header__zone mn-header__zone--right";
  if (opts.brand) {
    const tag = opts.brand.href ? "a" : "span";
    const brand = document.createElement(tag);
    brand.className = "mn-header__brand";
    if (opts.brand.href && brand instanceof HTMLAnchorElement) {
      brand.href = opts.brand.href;
    }
    if (opts.brand.logo) {
      const logoSpan = document.createElement("span");
      logoSpan.className = "mn-header__brand-logo";
      logoSpan.innerHTML = opts.brand.logo;
      brand.appendChild(logoSpan);
    }
    const labelSpan = document.createElement("span");
    labelSpan.textContent = opts.brand.label;
    brand.appendChild(labelSpan);
    leftZone.appendChild(brand);
  }
  if (opts.left) {
    for (const item of opts.left) {
      leftZone.appendChild(item === "separator" ? createSep() : createButton(item));
    }
  }
  if (opts.center) {
    const searchWrap = document.createElement("div");
    searchWrap.className = "mn-header__search";
    const input = document.createElement("input");
    input.type = "search";
    input.className = "mn-header__search-input";
    input.placeholder = opts.center.placeholder ?? "Search...";
    if (opts.center.onSearch) {
      const cb = opts.center.onSearch;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") cb(input.value);
      });
    }
    searchWrap.appendChild(input);
    if (opts.center.shortcut) {
      const kbd = document.createElement("kbd");
      kbd.className = "mn-header__shortcut";
      kbd.textContent = opts.center.shortcut;
      searchWrap.appendChild(kbd);
    }
    if (opts.center.filterButton) {
      const fb = document.createElement("button");
      fb.type = "button";
      fb.className = "mn-header__filter-btn mn-header__btn";
      fb.textContent = opts.center.filterButton.label;
      fb.addEventListener("click", opts.center.filterButton.onClick);
      searchWrap.appendChild(fb);
    }
    centerZone.appendChild(searchWrap);
  }
  const cleanups = [];
  if (opts.right) {
    for (const item of opts.right) {
      if (isSeparator(item)) {
        rightZone.appendChild(createSep());
      } else if (isProfile(item)) {
        const wrap = document.createElement("div");
        wrap.className = "mn-header__profile";
        const ctrl = profileMenu(wrap, {
          name: item.name,
          avatarUrl: item.avatarUrl,
          sections: item.sections
        });
        cleanups.push(() => ctrl.destroy());
        rightZone.appendChild(wrap);
      } else {
        rightZone.appendChild(createButton(item));
      }
    }
  }
  nav.appendChild(leftZone);
  nav.appendChild(centerZone);
  nav.appendChild(rightZone);
  container.appendChild(nav);
  return {
    setActive(buttonId) {
      nav.querySelectorAll(".mn-header__btn[data-header-id]").forEach((el5) => {
        el5.classList.toggle("mn-header__btn--active", el5.getAttribute("data-header-id") === buttonId);
      });
    },
    destroy() {
      cleanups.forEach((fn) => fn());
      nav.remove();
    }
  };
}

// src/ts/header-shell-events.ts
function emitShellEvent(host, type, detail) {
  host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
}

// src/ts/header-shell-filters.ts
function createFilterState(groups) {
  const state = {};
  if (!groups) return state;
  groups.forEach((group) => {
    if (group.options.length > 0) state[group.id] = [group.options[0].id];
  });
  return state;
}
function setFilterValues(filters, group, nextValues) {
  const defaultId = group.options[0]?.id;
  const allowed = [];
  group.options.forEach((option) => {
    if (nextValues.indexOf(option.id) !== -1) allowed.push(option.id);
  });
  if (group.multi && defaultId && allowed.length > 1) {
    const defaultIndex = allowed.indexOf(defaultId);
    if (defaultIndex !== -1) allowed.splice(defaultIndex, 1);
  }
  if (!allowed.length && defaultId) allowed.push(defaultId);
  filters[group.id] = !allowed.length ? [] : group.multi ? allowed : [allowed[0]];
  return filters[group.id].slice();
}
function syncFilterButtons(root, filters) {
  root.querySelectorAll("[data-filter-group-id]").forEach((group) => {
    const groupId = group.dataset.filterGroupId;
    const selected = groupId ? filters[groupId] || [] : [];
    group.querySelectorAll(".mn-header-shell__filter-option").forEach((button) => {
      const isSelected = !!button.dataset.filterOptionId && selected.indexOf(button.dataset.filterOptionId) !== -1;
      if (isSelected) button.classList.add("is-selected");
      else button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", String(isSelected));
    });
  });
}

// src/ts/header-shell-config.ts
function normalizeSections(sections) {
  return Array.isArray(sections) ? sections.slice() : [];
}

// src/ts/header-shell.ts
function getInitialActiveActionId(sections) {
  for (const section of sections) {
    const active = section.type === "actions" && (section.presentation || (section.role === "pre" ? "segmented" : "cluster")) === "segmented" ? section.items.find((action) => action.active) : void 0;
    if (active) return active.id;
  }
  return "";
}
function applySvg(host, svg2, className) {
  if (!svg2) return;
  const safe = sanitizeSvg(svg2);
  if (!safe) return;
  const icon = document.createElement("span");
  icon.className = className;
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = safe;
  host.appendChild(icon);
}
function buildAction(action, role, isSelectable, isActive, onClick) {
  const el5 = document.createElement("button");
  el5.type = "button";
  el5.className = "mn-header-shell__action";
  el5.dataset.headerShellActionId = action.id;
  if (isSelectable) el5.dataset.headerShellSelectable = "true";
  const title = action.title || action.label || action.id;
  el5.setAttribute("aria-label", title);
  if (action.title) el5.title = action.title;
  applySvg(el5, action.icon, "mn-header-shell__icon");
  if (action.label) {
    const label = document.createElement("span");
    label.textContent = action.label;
    el5.appendChild(label);
  }
  if (isActive) el5.classList.add("mn-header-shell__action--active");
  if (action.pressed) el5.setAttribute("aria-pressed", "true");
  if (action.disabled) el5.disabled = true;
  el5.addEventListener("click", () => onClick(action.id, role, isSelectable));
  return el5;
}
function buildFilters(host, groups, state, onFilter) {
  if (!groups || !groups.length) return null;
  const panel = document.createElement("div");
  panel.className = "mn-header-shell__filters";
  groups.forEach((group) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "mn-header-shell__filter-group";
    fieldset.setAttribute("data-filter-group-id", group.id);
    const legend2 = document.createElement("legend");
    legend2.textContent = group.label;
    fieldset.appendChild(legend2);
    group.options.forEach((option) => {
      const btn = document.createElement("button");
      const selected = !!(state.filters[group.id] && state.filters[group.id].indexOf(option.id) !== -1);
      btn.type = "button";
      btn.className = "mn-header-shell__filter-option";
      btn.dataset.filterOptionId = option.id;
      btn.textContent = option.label;
      if (selected) btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", String(selected));
      btn.addEventListener("click", () => {
        const defaultId = group.options[0]?.id;
        const current2 = state.filters[group.id] || (defaultId ? [defaultId] : []);
        let next;
        if (!group.multi) {
          next = [option.id];
        } else if (option.id === defaultId) {
          next = defaultId ? [defaultId] : [];
        } else {
          const normalized = defaultId && current2[0] === defaultId ? [] : current2.slice();
          const index = normalized.indexOf(option.id);
          if (index === -1) normalized.push(option.id);
          else normalized.splice(index, 1);
          next = normalized.length ? normalized : defaultId ? [defaultId] : [];
        }
        onFilter(group.id, next);
      });
      fieldset.appendChild(btn);
    });
    panel.appendChild(fieldset);
  });
  host.appendChild(panel);
  return panel;
}
function applySelection(buttons, activeId) {
  buttons.forEach((button) => button.dataset.headerShellActionId === activeId ? button.classList.add("mn-header-shell__action--active") : button.classList.remove("mn-header-shell__action--active"));
}
function headerShell(container, options) {
  const sections = normalizeSections(options.sections || []);
  const nav = document.createElement("nav");
  nav.className = "mn-header-shell";
  nav.setAttribute("role", "navigation");
  nav.setAttribute("aria-label", options.ariaLabel || "Header shell navigation");
  const cleanups = [];
  const filterGroups = sections.find((section) => section.type === "search" && section.filters);
  const state = { query: "", filters: createFilterState(filterGroups?.filters), activeActionId: getInitialActiveActionId(sections), themeMode: getTheme() };
  const onAction = (id, role, isSelectable) => {
    if (isSelectable) {
      state.activeActionId = id;
      applySelection(nav.querySelectorAll('button[data-header-shell-selectable="true"]'), id);
    }
    const detail = { id, role };
    options.callbacks?.onAction?.(detail);
    emitShellEvent(nav, "header-shell-action", detail);
  };
  const onFilter = (groupId, values) => {
    if (!filterGroups || !filterGroups.filters) return;
    const group = filterGroups.filters.find((item) => item.id === groupId);
    if (!group) return;
    const next = setFilterValues(state.filters, group, values);
    const activeButton = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    syncFilterButtons(nav, state.filters);
    if (activeButton?.isConnected) activeButton.focus();
    const detail = { groupId, values: next };
    options.callbacks?.onFilter?.(detail);
    emitShellEvent(nav, "header-shell-filter", detail);
  };
  sections.forEach((section) => {
    if (section.type === "divider") {
      const divider = document.createElement("span");
      divider.className = "mn-header-shell__divider";
      divider.setAttribute("aria-hidden", "true");
      nav.appendChild(divider);
      return;
    }
    if (section.type === "spacer") {
      const spacer = document.createElement("span");
      spacer.className = "mn-header-shell__spacer";
      nav.appendChild(spacer);
      return;
    }
    if (section.type === "brand") {
      const brand = document.createElement(section.href ? "a" : "span");
      brand.className = "mn-header-shell__brand";
      brand.setAttribute("data-shell-role", "brand");
      if (section.href && brand instanceof HTMLAnchorElement) brand.href = section.href;
      if (section.logoSrc) {
        const image = document.createElement("img");
        image.className = "mn-header-shell__brand-logo";
        image.src = section.logoSrc;
        image.alt = section.logoAlt || "";
        brand.appendChild(image);
      }
      applySvg(brand, section.logo, "mn-header-shell__brand-logo");
      if (section.label) {
        const label = document.createElement("span");
        label.textContent = section.label;
        brand.appendChild(label);
      }
      nav.appendChild(brand);
      return;
    }
    if (section.type === "actions") {
      const group = document.createElement("div");
      group.className = "mn-header-shell__actions";
      group.setAttribute("data-shell-role", section.role === "pre" ? "pre-actions" : "post-actions");
      const presentation = section.presentation || (section.role === "pre" ? "segmented" : "cluster");
      group.setAttribute("data-presentation", presentation);
      group.classList.add(`mn-header-shell__actions--${presentation}`);
      const isSelectable = presentation === "segmented";
      section.items.forEach((action) => group.appendChild(buildAction(action, section.role, isSelectable, isSelectable ? action.id === state.activeActionId : !!action.active, onAction)));
      nav.appendChild(group);
      return;
    }
    if (section.type === "search") {
      const search = document.createElement("div");
      search.className = "mn-header-shell__search";
      search.setAttribute("data-shell-role", "search");
      const input = document.createElement("input");
      input.className = "mn-header-shell__search-input";
      input.type = "search";
      input.placeholder = section.placeholder || "Search";
      const emitSearch = () => {
        state.query = input.value;
        const detail = { query: input.value };
        options.callbacks?.onSearch?.(detail);
        emitShellEvent(nav, "header-shell-search", detail);
      };
      input.addEventListener("input", emitSearch);
      input.addEventListener("search", emitSearch);
      search.appendChild(input);
      buildFilters(search, section.filters, state, onFilter);
      if (section.shortcut) {
        const kbd = document.createElement("kbd");
        kbd.className = "mn-header-shell__shortcut";
        kbd.textContent = section.shortcut;
        search.appendChild(kbd);
      }
      nav.appendChild(search);
      return;
    }
    if (section.type === "theme") {
      const wrap = document.createElement("div");
      wrap.className = "mn-header-shell__theme";
      wrap.setAttribute("data-shell-role", "theme");
      const modes = section.modes && section.modes.length ? section.modes : void 0;
      const mode = modes && modes.indexOf(state.themeMode) === -1 ? modes[0] : state.themeMode;
      const toggle = document.createElement("mn-theme-toggle");
      state.themeMode = mode;
      if (modes) {
        const value = modes.join(",");
        wrap.setAttribute("data-theme-modes", value);
        toggle.setAttribute("modes", value);
      }
      toggle.setAttribute("mode", mode);
      toggle.addEventListener("mn-theme-change", (event) => {
        const detail = event.detail;
        const mode2 = detail && detail.theme ? detail.theme : state.themeMode;
        state.themeMode = mode2;
        options.callbacks?.onTheme?.({ mode: mode2 });
        emitShellEvent(nav, "header-shell-theme", { mode: mode2 });
      });
      wrap.appendChild(toggle);
      nav.appendChild(wrap);
      return;
    }
    if (section.type === "profile") {
      const wrap = document.createElement("div");
      wrap.className = "mn-header-shell__profile";
      wrap.setAttribute("data-shell-role", "profile");
      const ctrl = profileMenu(wrap, { name: section.name, avatarUrl: section.avatarUrl, sections: section.sections });
      cleanups.push(() => ctrl.destroy());
      nav.appendChild(wrap);
    }
  });
  container.appendChild(nav);
  return {
    getState() {
      const filters = {};
      Object.keys(state.filters).forEach((key) => {
        filters[key] = state.filters[key].slice();
      });
      return { query: state.query, filters, activeActionId: state.activeActionId, themeMode: state.themeMode };
    },
    setQuery(query) {
      state.query = query;
      const input = nav.querySelector(".mn-header-shell__search-input");
      if (input) input.value = query;
    },
    setFilter(groupId, values) {
      onFilter(groupId, values);
    },
    destroy() {
      cleanups.forEach((fn) => fn());
      nav.remove();
    }
  };
}

// src/ts/filter-panel-dom.ts
function buildItem(item, selected) {
  const row = createElement("div", "mn-filter-panel__item", {
    role: "option",
    tabindex: "-1"
  });
  if (selected) {
    row.setAttribute("aria-selected", "true");
    row.classList.add("mn-filter-panel__item--selected");
  } else {
    row.setAttribute("aria-selected", "false");
  }
  if (item.color) {
    const dot = createElement("span", "mn-filter-panel__dot");
    if (isValidColor(item.color)) {
      dot.style.backgroundColor = item.color;
    }
    row.appendChild(dot);
  }
  const label = createElement("span", "mn-filter-panel__label");
  label.textContent = item.label;
  row.appendChild(label);
  if (item.count !== void 0) {
    const count = createElement("span", "mn-filter-panel__count");
    count.textContent = String(item.count);
    row.appendChild(count);
  }
  const check = createElement("span", "mn-filter-panel__check");
  check.setAttribute("aria-hidden", "true");
  row.appendChild(check);
  return row;
}
function buildColumn(col) {
  const wrapper = createElement("div", "mn-filter-panel__column");
  const title = createElement("div", "mn-filter-panel__column-title");
  title.textContent = col.title;
  wrapper.appendChild(title);
  const list = createElement("div", "mn-filter-panel__list", {
    role: "listbox",
    "aria-label": col.title
  });
  if (col.type === "multi-select") {
    list.setAttribute("aria-multiselectable", "true");
  }
  const itemEls = [];
  for (const item of col.items) {
    const row = buildItem(item, item.selected === true);
    itemEls.push(row);
    list.appendChild(row);
  }
  wrapper.appendChild(list);
  return { el: wrapper, itemEls };
}
function buildFilterPanel(columns, onSave, onClear) {
  const el5 = createElement("div", "mn-filter-panel", {
    role: "dialog",
    "aria-label": "Filter panel"
  });
  const colsWrap = createElement("div", "mn-filter-panel__columns");
  const columnEls = [];
  const itemEls = [];
  for (const col of columns) {
    const result = buildColumn(col);
    columnEls.push(result.el);
    itemEls.push(result.itemEls);
    colsWrap.appendChild(result.el);
  }
  el5.appendChild(colsWrap);
  const footer = createElement("div", "mn-filter-panel__footer");
  const saveBtn = createElement("button", "mn-filter-panel__save-btn", {
    type: "button"
  });
  saveBtn.textContent = "SAVE AS DEFAULT";
  saveBtn.addEventListener("click", onSave);
  footer.appendChild(saveBtn);
  const clearBtn = createElement("button", "mn-filter-panel__clear-btn", {
    type: "button"
  });
  clearBtn.textContent = "CLEAR";
  clearBtn.addEventListener("click", onClear);
  footer.appendChild(clearBtn);
  el5.appendChild(footer);
  return { el: el5, columnEls, itemEls };
}

// src/ts/filter-panel.ts
function collectFilters(columns) {
  const result = {};
  for (const col of columns) {
    const selected = col.items.filter((i) => i.selected === true);
    if (col.type === "single-select") {
      result[col.id] = selected.length > 0 ? selected[0].value : "";
    } else {
      result[col.id] = selected.map((i) => i.value);
    }
  }
  return result;
}
function positionPanel(panel, anchor) {
  const rect = anchor.getBoundingClientRect();
  panel.style.position = "fixed";
  panel.style.top = rect.bottom + 4 + "px";
  panel.style.left = rect.left + "px";
  requestAnimationFrame(() => {
    const pRect = panel.getBoundingClientRect();
    if (pRect.right > window.innerWidth - 8) {
      panel.style.left = Math.max(8, window.innerWidth - pRect.width - 8) + "px";
    }
    if (pRect.bottom > window.innerHeight - 8) {
      panel.style.top = rect.top - pRect.height - 4 + "px";
    }
  });
}
function handleSingleSelect(col, itemIdx, itemEls) {
  for (let i = 0; i < col.items.length; i++) {
    const wasSelected = col.items[i].selected === true;
    const nowSelected = i === itemIdx;
    col.items[i].selected = nowSelected;
    if (wasSelected && !nowSelected) {
      itemEls[i].classList.remove("mn-filter-panel__item--selected");
      itemEls[i].setAttribute("aria-selected", "false");
    } else if (nowSelected) {
      itemEls[i].classList.add("mn-filter-panel__item--selected");
      itemEls[i].setAttribute("aria-selected", "true");
    }
  }
}
function handleMultiSelect(col, itemIdx, itemEls) {
  const item = col.items[itemIdx];
  const next = !(item.selected === true);
  item.selected = next;
  const el5 = itemEls[itemIdx];
  if (next) {
    el5.classList.add("mn-filter-panel__item--selected");
    el5.setAttribute("aria-selected", "true");
  } else {
    el5.classList.remove("mn-filter-panel__item--selected");
    el5.setAttribute("aria-selected", "false");
  }
}
function filterPanel(anchor, options) {
  const columns = options.columns;
  let panelEl = null;
  let allItemEls = [];
  let open = false;
  let focusColIdx = 0;
  let focusRowIdx = -1;
  function onSave() {
    if (options.onSaveDefault) options.onSaveDefault(collectFilters(columns));
  }
  function onClear() {
    for (const col of columns) {
      for (const item of col.items) item.selected = false;
    }
    for (let c = 0; c < allItemEls.length; c++) {
      for (let r = 0; r < allItemEls[c].length; r++) {
        allItemEls[c][r].classList.remove("mn-filter-panel__item--selected");
        allItemEls[c][r].setAttribute("aria-selected", "false");
      }
    }
    if (options.onClear) options.onClear();
    if (options.onFilterChange) options.onFilterChange(collectFilters(columns));
  }
  function setFocus(colIdx, rowIdx) {
    if (!allItemEls.length) return;
    focusColIdx = Math.max(0, Math.min(colIdx, allItemEls.length - 1));
    const colItems = allItemEls[focusColIdx];
    if (!colItems.length) return;
    focusRowIdx = (rowIdx % colItems.length + colItems.length) % colItems.length;
    colItems[focusRowIdx].focus();
  }
  function onKeyDown(e) {
    if (!open) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        doClose();
        anchor.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocus(focusColIdx, focusRowIdx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocus(focusColIdx, focusRowIdx - 1);
        break;
      case "Tab":
        if (e.shiftKey) {
          if (focusColIdx > 0) {
            e.preventDefault();
            setFocus(focusColIdx - 1, 0);
          }
        } else {
          if (focusColIdx < allItemEls.length - 1) {
            e.preventDefault();
            setFocus(focusColIdx + 1, 0);
          }
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusRowIdx >= 0 && allItemEls[focusColIdx]) {
          allItemEls[focusColIdx][focusRowIdx].click();
        }
        break;
    }
  }
  function onOutsideClick(e) {
    const target = e.target;
    if (target && panelEl && !panelEl.contains(target) && !anchor.contains(target)) {
      doClose();
    }
  }
  function doOpen() {
    if (open) return;
    open = true;
    focusColIdx = 0;
    focusRowIdx = -1;
    const dom = buildFilterPanel(columns, onSave, onClear);
    panelEl = dom.el;
    allItemEls = dom.itemEls;
    for (let c = 0; c < columns.length; c++) {
      for (let r = 0; r < allItemEls[c].length; r++) {
        const colIdx = c;
        const rowIdx = r;
        allItemEls[c][r].addEventListener("click", () => {
          if (columns[colIdx].type === "single-select") {
            handleSingleSelect(columns[colIdx], rowIdx, allItemEls[colIdx]);
          } else {
            handleMultiSelect(columns[colIdx], rowIdx, allItemEls[colIdx]);
          }
          if (options.onFilterChange) options.onFilterChange(collectFilters(columns));
        });
      }
    }
    document.body.appendChild(panelEl);
    positionPanel(panelEl, anchor);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onOutsideClick, true);
  }
  function doClose() {
    if (!open) return;
    open = false;
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("mousedown", onOutsideClick, true);
    if (panelEl && panelEl.parentNode) {
      panelEl.parentNode.removeChild(panelEl);
    }
    panelEl = null;
    allItemEls = [];
  }
  return {
    open: doOpen,
    close: doClose,
    isOpen: () => open,
    getFilters: () => collectFilters(columns),
    destroy() {
      doClose();
    }
  };
}

// src/ts/auto-resize.ts
function autoResize(canvas, factory, data, opts) {
  if (typeof window === "undefined" || !window.ResizeObserver) return () => {
  };
  const parent = canvas.parentElement;
  if (!parent) return () => {
  };
  let ctrl = null;
  const resize = debounce(() => {
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    if (ctrl && typeof ctrl.destroy === "function") {
      ctrl.destroy();
    }
    ctrl = factory(canvas, data, { ...opts, width: rect.width, height: rect.height });
  }, 150);
  const observer = new ResizeObserver(resize);
  observer.observe(parent);
  resize();
  return () => {
    observer.disconnect();
    if (ctrl && typeof ctrl.destroy === "function") {
      ctrl.destroy();
    }
  };
}
function autoResizeAll(selector = "canvas[data-auto-resize]", chartLib) {
  const canvases = document.querySelectorAll(selector);
  const cleanups = [];
  const lib = chartLib || (typeof window !== "undefined" ? window.Maranello : null);
  if (!lib) return () => {
  };
  canvases.forEach((canvas) => {
    const type = canvas.dataset.chartType;
    if (!type) return;
    const factory = lib[type];
    if (typeof factory !== "function") return;
    let data, opts;
    try {
      data = JSON.parse(canvas.dataset.chartData || "[]");
      opts = JSON.parse(canvas.dataset.chartOptions || "{}");
    } catch {
      data = [];
      opts = {};
    }
    cleanups.push(autoResize(canvas, factory, data, opts));
  });
  return () => cleanups.forEach((fn) => fn());
}

// src/ts/map-view-helpers.ts
var DPR = window.devicePixelRatio || 1;
var TAU = Math.PI * 2;
var SIZE_PX = { sm: 6, md: 10, lg: 14 };
var THEMES2 = {
  editorial: { land: "#333330", water: "#0d0d0d", border: "#444440", grid: "rgba(200,200,200,0.06)", text: "#c8c8c8", muted: "#616161" },
  nero: { land: "#2e2e2a", water: "#080808", border: "#444440", grid: "rgba(200,200,200,0.05)", text: "#c8c8c8", muted: "#555" },
  avorio: { land: "#e8d5b0", water: "#faf3e6", border: "#d7c39a", grid: "rgba(0,0,0,0.05)", text: "#1a1a1a", muted: "#888" },
  sugar: { land: "#FFFFFF", water: "#E4E4E8", border: "#D0D0D5", grid: "rgba(0,0,0,0.04)", text: "#111111", muted: "#767676" },
  colorblind: { land: "#1a1a1a", water: "#0a0a0a", border: "#2a2a2a", grid: "rgba(200,200,200,0.04)", text: "#c8c8c8", muted: "#616161" }
};
function ll(lon, lat) {
  return [lon, lat];
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
  const name = b.contains("mn-colorblind") ? "colorblind" : b.contains("mn-sugar") ? "sugar" : b.contains("mn-nero") ? "nero" : b.contains("mn-avorio") ? "avorio" : "editorial";
  const t = THEMES2[name];
  return { ...t, coast: t.border, bg: t.water };
}
function getMarkerColors() {
  return {
    editorial: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    nero: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#FFC72C"), danger: cssVar("--signal-danger", "#DC0000") },
    avorio: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--arancio", "#D4622B"), danger: cssVar("--signal-danger", "#DC0000") },
    sugar: { active: cssVar("--signal-ok", "#00A651"), warning: cssVar("--signal-warning", "#F59E0B"), danger: cssVar("--signal-danger", "#DC0000") },
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
function hexToRgba2(hex, a) {
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
  ctx.fillStyle = hexToRgba2(col, 0.15);
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
  if (!legendEl) {
    console.warn("[Maranello] renderLegend: legend container element is null");
    return;
  }
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
function hitTest(clientX, clientY, canvas, markers) {
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
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Interactive map view");
  canvas.setAttribute("tabindex", "0");
  container.appendChild(canvas);
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip";
  tip.style.position = "absolute";
  tip.style.pointerEvents = "none";
  container.appendChild(tip);
  const legend2 = document.createElement("div");
  legend2.className = "mn-map__legend";
  legend2.style.cssText = "position:absolute;bottom:8px;left:8px;display:flex;gap:8px;font-size:0.65rem;";
  container.appendChild(legend2);
  let renderedMarkers = [];
  let highlighted = null;
  let hovered = null;
  const pulse = 0;
  function render5() {
    const rect = container.getBoundingClientRect();
    const vw = rect.width, vh = rect.height;
    canvas.width = vw * DPR;
    canvas.height = vh * DPR;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(DPR, DPR);
    const th = detectTheme();
    const mc = getMarkerColors();
    const themeName = document.body.classList.contains("mn-colorblind") ? "colorblind" : document.body.classList.contains("mn-sugar") ? "sugar" : document.body.classList.contains("mn-nero") ? "nero" : document.body.classList.contains("mn-avorio") ? "avorio" : "editorial";
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
    renderLegend(legend2, colors);
  }
  canvas.addEventListener("mousemove", (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit) {
      canvas.style.cursor = "pointer";
      hovered = hit.id;
      showTip3(hit);
    } else {
      canvas.style.cursor = "default";
      hovered = null;
      tip.classList.remove("mn-chart-tooltip--visible");
    }
  });
  canvas.addEventListener("click", (e) => {
    const hit = hitTest(e.clientX, e.clientY, canvas, renderedMarkers);
    if (hit && o.onClick) o.onClick(hit);
  });
  canvas.addEventListener("mouseleave", () => {
    hovered = null;
    tip.classList.remove("mn-chart-tooltip--visible");
  });
  function showTip3(m) {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(String(m.label || "Marker")) + "</div>" + (m.detail ? '<div style="color:var(--mn-text-tertiary);font-size:0.6rem;">' + escapeHtml(String(m.detail)) + "</div>" : "");
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
  let resizeObs = null;
  if (window.ResizeObserver) {
    resizeObs = new ResizeObserver(() => render5());
    resizeObs.observe(container);
  }
  const mutationObs = new MutationObserver(() => render5());
  mutationObs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  render5();
  return {
    setMarkers: (m) => {
      markers = m;
      render5();
    },
    addMarker: (m) => {
      markers.push(m);
      render5();
    },
    removeMarker: (id) => {
      markers = markers.filter((m) => m.id !== id);
      render5();
    },
    highlight: (id) => {
      highlighted = id;
      render5();
    },
    setZoom: (z) => {
      viewState.zoom = z;
      render5();
    },
    panTo: (_lat, _lon) => {
      render5();
    },
    fitBounds: () => {
      viewState.zoom = 1;
      viewState.panX = 0;
      viewState.panY = 0;
      render5();
    },
    destroy: () => {
      resizeObs?.disconnect();
      mutationObs.disconnect();
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
  if (typeof mapboxgl !== "undefined" && mapboxgl) return mapboxgl;
  if (typeof window !== "undefined") {
    const win = window;
    if (win.mapboxgl) return win.mapboxgl;
  }
  return null;
}
function safeColor(c, fallback) {
  return c && isValidColor(c) ? c : fallback;
}
function mapboxView(container, opts) {
  const target = typeof container === "string" ? document.querySelector(container) : container;
  if (!target) return null;
  const host = target;
  const root = target;
  const mbRaw = getMapboxGL();
  if (!mbRaw) {
    host.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-dim,#666);font-size:0.8rem">mapbox-gl not loaded. Add &lt;script src="mapbox-gl.js"&gt; to use this component.</div>';
    return null;
  }
  const mb = mbRaw;
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
    if (m.color) return safeColor(m.color, "#FFC72C");
    if (m.stage && stageColors[m.stage]) return safeColor(stageColors[m.stage], "#FFC72C");
    return "#FFC72C";
  }
  let markerInstances = [];
  function renderMarkers(markers) {
    markerInstances.forEach((m) => m.remove());
    markerInstances = [];
    markers.forEach((m) => {
      const el5 = document.createElement("div");
      el5.className = "mn-mapbox-marker";
      const color = markerColor(m);
      el5.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}80;cursor:pointer;transition:transform 0.15s`;
      if (m.count && m.count > 1) {
        el5.style.cssText += ";width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#000";
        el5.textContent = String(m.count);
      }
      el5.addEventListener("mouseenter", () => {
        el5.style.transform = "scale(1.4)";
      });
      el5.addEventListener("mouseleave", () => {
        el5.style.transform = "";
      });
      const popup = new mb.Popup({ offset: 20, closeButton: false, className: "mn-mapbox-popup" }).setHTML(`<div style="font-weight:600;margin-bottom:2px">${escapeHtml(m.label)}</div>${m.detail ? `<div style="font-size:0.75rem;opacity:0.7">${escapeHtml(m.detail)}</div>` : ""}`);
      const marker = new mb.Marker({ element: el5 }).setLngLat([m.lon, m.lat]).setPopup(popup).addTo(map);
      if (o.onClick) {
        el5.addEventListener("click", () => o.onClick(m));
      }
      markerInstances.push(marker);
    });
  }
  function renderLegend2() {
    if (!o.showLegend || !o.stages.length) return;
    const legend2 = document.createElement("div");
    legend2.className = "mn-mapbox-legend";
    legend2.style.cssText = "position:absolute;bottom:8px;left:8px;display:flex;gap:10px;padding:6px 10px;background:rgba(0,0,0,0.7);border-radius:6px;font-size:0.65rem;z-index:1";
    o.stages.forEach((s) => {
      const c = safeColor(s.color, "#999");
      legend2.innerHTML += `<span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span><span style="color:var(--text-dim,#999)">${escapeHtml(s.label)}</span></span>`;
    });
    root.style.position = "relative";
    root.appendChild(legend2);
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
var GROUP_COLORS2 = {
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
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Social graph");
  canvas.setAttribute("tabindex", "0");
  const tip = document.createElement("div");
  tip.className = "mn-chart-tooltip";
  tip.style.cssText = "position:absolute;pointer-events:none;opacity:0;transition:opacity .12s ease;max-width:220px;";
  hostEl.append(canvas, tip);
  let width = 0, height = 0, raf = 0, frame = 0;
  let nodes = [], edges = [], nodeMap = /* @__PURE__ */ new Map(), linked = /* @__PURE__ */ new Map();
  let running = opts.animate !== false, hoveredId = null, highlightedId = null;
  let dragging = null, dragMoved = false, resizeObs = null;
  const dpr = () => window.devicePixelRatio || 1;
  const activeId = () => hoveredId ?? highlightedId;
  const showLabels = opts.showLabels !== false;
  const showTip3 = (node, x, y) => {
    tip.innerHTML = '<div class="mn-chart-tooltip__label">' + escapeHtml(node.label) + "</div>" + (node.detail ? '<div style="font-size:.68rem;color:var(--mn-text-tertiary)">' + escapeHtml(node.detail) + "</div>" : "");
    tip.style.opacity = "1";
    const tw = tip.offsetWidth || 140, th = tip.offsetHeight || 44;
    tip.style.left = Math.max(6, Math.min(width - tw - 6, x - tw / 2)) + "px";
    tip.style.top = Math.max(6, Math.min(height - th - 6, y - th - 14)) + "px";
  };
  const hideTip3 = () => {
    tip.style.opacity = "0";
  };
  const colorOf = (node) => opts.groups?.[node.group || ""] || GROUP_COLORS2[node.group || ""] || GROUP_COLORS2.default;
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
    const scale = dpr();
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
    canvas.setAttribute("aria-label", `Social graph: ${nodes.length} nodes, ${edges.length} connections`);
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
    ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
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
        ctx.fillStyle = cssVar("--mn-text", "rgba(245,245,245,.92)");
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
      showTip3(dragging, p.x, p.y);
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
      showTip3(node, p.x, p.y);
    } else {
      canvas.style.cursor = "default";
      hideTip3();
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
    showTip3(node, p.x, p.y);
    draw();
  });
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseleave", () => {
    if (!dragging) {
      hoveredId = null;
      opts.onHover?.(null);
      hideTip3();
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

// src/ts/sidebar-toggle.ts
var backdrop = null;
function ensureBackdrop() {
  if (backdrop) return backdrop;
  backdrop = document.createElement("div");
  backdrop.className = "mn-sidebar__backdrop";
  document.body.appendChild(backdrop);
  return backdrop;
}
function closeSidebar(sidebar) {
  sidebar.classList.remove("mn-sidebar--mobile-open");
  const bd = ensureBackdrop();
  bd.classList.remove("mn-sidebar__backdrop--visible");
}
function openSidebar(sidebar) {
  sidebar.classList.add("mn-sidebar--mobile-open");
  const bd = ensureBackdrop();
  bd.classList.add("mn-sidebar__backdrop--visible");
}
function initSidebarToggle(sidebarEl, triggerEl) {
  const bd = ensureBackdrop();
  const onTrigger = () => {
    if (sidebarEl.classList.contains("mn-sidebar--mobile-open")) {
      closeSidebar(sidebarEl);
    } else {
      openSidebar(sidebarEl);
    }
  };
  const onBackdrop = () => closeSidebar(sidebarEl);
  const onEsc = (e) => {
    if (e.key === "Escape" && sidebarEl.classList.contains("mn-sidebar--mobile-open")) {
      closeSidebar(sidebarEl);
    }
  };
  const mql = window.matchMedia("(min-width: 641px)");
  const onDesktop = (e) => {
    if ("matches" in e && e.matches) closeSidebar(sidebarEl);
  };
  triggerEl.addEventListener("click", onTrigger);
  bd.addEventListener("click", onBackdrop);
  document.addEventListener("keydown", onEsc);
  mql.addEventListener("change", onDesktop);
  return () => {
    triggerEl.removeEventListener("click", onTrigger);
    bd.removeEventListener("click", onBackdrop);
    document.removeEventListener("keydown", onEsc);
    mql.removeEventListener("change", onDesktop);
  };
}
function initSidebarToggleAuto() {
  const sidebar = document.querySelector(".mn-sidebar");
  const trigger = document.querySelector("[data-sidebar-toggle], .mn-sidebar-toggle");
  if (!sidebar || !trigger) return null;
  return initSidebarToggle(sidebar, trigger);
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
var UNSAFE_STYLE_RE = /url\s*\(\s*javascript:/i;
var EXPRESSION_RE = /expression\s*\(/i;
function setElementProperty(el5, property, value) {
  if (!ALLOWED_BIND_PROPERTIES.has(property) && !property.startsWith("style.") && !property.startsWith("data-")) {
    console.warn('[Maranello] bind: property "%s" not in whitelist', property);
  }
  if (property === "textContent") {
    el5.textContent = value == null ? "" : String(value);
  } else if (property === "innerHTML") {
    el5.innerHTML = value == null ? "" : escapeHtml(String(value));
  } else if (property.startsWith("style.")) {
    if (el5 instanceof HTMLElement) {
      const strVal = value == null ? "" : String(value);
      if (UNSAFE_STYLE_RE.test(strVal) || EXPRESSION_RE.test(strVal)) {
        console.warn('[Maranello] bind: blocked unsafe style value for "%s"', property);
        return;
      }
      el5.style[property.slice(6)] = strVal;
    }
  } else if (property.startsWith("data-")) {
    const attrValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
    el5.setAttribute(property, attrValue);
  } else {
    el5[property] = value;
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
      for (const el5 of elements) {
        const value = opts.map(data, el5);
        setElementProperty(el5, opts.property, value);
        el5.classList.add("mn-anim-count");
        setTimeout(() => el5.classList.remove("mn-anim-count"), 300);
        if (opts.onUpdate) opts.onUpdate(el5, value);
      }
    }).catch((err) => {
      if (opts.onError) {
        for (const el5 of elements) opts.onError(el5, err);
      }
    });
  }
  update();
  if (opts.interval > 0) return window.setInterval(update, opts.interval);
  return void 0;
}
function autoBind() {
  document.querySelectorAll("[data-mn-bind]").forEach((el5) => {
    const config = {};
    const rawBind = el5.dataset.mnBind;
    if (!rawBind) return;
    rawBind.split(";").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length === 2) {
        const key = kv[0].trim();
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          console.warn('[Maranello] autoBind: rejected unsafe key "%s"', key);
          return;
        }
        config[key] = kv[1].trim();
      }
    });
    if (config.url) {
      bind(el5, {
        url: config.url,
        property: config.prop ?? "textContent",
        interval: parseInt(config.refresh ?? "", 10) || 0
      });
    }
  });
}
function onDrillDown(selector, handler) {
  document.querySelectorAll(selector).forEach((el5) => {
    if (el5 instanceof HTMLElement) el5.style.cursor = "pointer";
    el5.setAttribute("role", "button");
    el5.setAttribute("tabindex", "0");
    el5.classList.add("mn-hover-lift");
    function trigger() {
      const context = {};
      Array.from(el5.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          context[attr.name.slice(5)] = attr.value;
        }
      });
      context.text = el5.textContent;
      handler(el5, context);
    }
    el5.addEventListener("click", trigger);
    el5.addEventListener("keydown", (e) => {
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
  const gauge2 = gaugeMap?.get(canvas);
  if (!gauge2) return;
  Object.assign(gauge2.config, newConfig);
  if (newConfig.complications && gauge2.config.complications) {
    Object.assign(gauge2.config.complications, newConfig.complications);
  } else if (newConfig.complications) {
    gauge2.config.complications = { ...newConfig.complications };
  }
  gauge2.animate();
  const label = String(gauge2.config.label ?? "Gauge");
  const val = gauge2.config.value ?? newConfig.value ?? "";
  const unit = gauge2.config.unit ?? "";
  canvas.setAttribute("aria-label", label + ": " + val + (unit ? " " + unit : ""));
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
      canvas.setAttribute("aria-label", chartType + " chart, updated");
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
  document.querySelectorAll("[data-mn-slider]").forEach((el5) => {
    const config = {};
    const rawSlider = el5.dataset.mnSlider;
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
    if (initSlider2) initSlider2(el5, config);
  });
}
function bindControl(el5, options) {
  const opts = {
    mapRead: (d) => d.value,
    mapWrite: (v) => JSON.stringify({ value: v }),
    ...options
  };
  if (opts.url) {
    fetch(opts.url).then((r) => r.json()).then((data) => {
      const val = opts.mapRead(data);
      if (el5._mnSlider) el5._mnSlider.setValue(val);
    }).catch((err) => {
      console.warn("bindControl: failed to read initial value", err);
    });
  }
  eventBus.on("slider-change", (detail) => {
    const d = detail;
    if (d.element !== el5) return;
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

// src/ts/data-table-cells.ts
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
function escHtml(s) {
  return s == null ? "" : escapeHtml(String(s));
}
function toInitials(name) {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function toNumber(value, fallback = 0) {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : fallback;
}
function trendClass(trend) {
  return trend === "up" ? "up" : trend === "down" ? "down" : "flat";
}
function safeHref(href) {
  const raw = href.trim();
  if (raw.startsWith("#") || raw.startsWith("/")) return escapeHtml(raw);
  const lower = raw.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("mailto:") || lower.startsWith("tel:")) return escapeHtml(raw);
  return "#";
}
function renderIconSvg(name) {
  const iconFn = icons[name];
  if (!iconFn) return '<span class="mn-dt__cell-icon-fallback">' + escHtml(name) + "</span>";
  return sanitizeSvg(iconFn());
}
var cellRenderers = {
  text: (val) => '<span class="mn-dt__cell-text">' + escHtml(val) + "</span>",
  number: (val) => '<span class="mn-dt__cell-number">' + escHtml(val) + "</span>",
  status: (val) => {
    const st = STATUS_MAP[String(val ?? "").toLowerCase()] ?? { cls: "info", icon: "\u25CF" };
    return '<span class="mn-status mn-status--' + st.cls + '"><span class="mn-status__dot"></span> ' + escHtml(val) + "</span>";
  },
  metric: (val) => {
    const m = typeof val === "object" && val !== null ? val : { value: toNumber(val), trend: "flat" };
    const tcls = trendClass(String(m.trend));
    const arrow = tcls === "up" ? "\u25B2" : tcls === "down" ? "\u25BC" : "\u2014";
    const delta = m.delta ? '<span class="mn-dt__cell-metric-delta">' + escHtml(m.delta) + "</span>" : "";
    return '<div class="mn-dt__cell-metric"><span class="mn-dt__cell-number">' + escHtml(m.value) + '</span><span class="mn-dt__cell-trend mn-dt__cell-trend--' + tcls + '">' + arrow + "</span>" + delta + "</div>";
  },
  progress: (val) => {
    const p = typeof val === "object" && val !== null ? val : { value: toNumber(val), max: 100 };
    const max = Math.max(1, toNumber(p.max, 100));
    const pct3 = Math.max(0, Math.min(100, toNumber(p.value) / max * 100));
    const label = p.label ?? Math.round(pct3) + "%";
    return '<div class="mn-dt__cell-progress"><div class="mn-dt__progress"><div class="mn-dt__progress-fill" style="width:' + pct3 + '%"></div></div><span class="mn-dt__cell-pct">' + escHtml(label) + "</span></div>";
  },
  date: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const d = new Date(String(val));
    return '<span class="mn-dt__cell-date">' + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getFullYear()).slice(2) + "</span>";
  },
  tag: (val) => !val ? "" : '<span class="mn-tag mn-tag--light mn-tag--xs">' + escHtml(val) + "</span>",
  person: (val) => {
    if (!val) return '<span class="mn-dt__cell-text">\u2014</span>';
    const p = typeof val === "object" && val !== null ? val : { name: String(val) };
    const avatar = p.avatar ? '<img class="mn-dt__avatar-img" src="' + escHtml(p.avatar) + '" alt="' + escHtml(p.name) + '">' : escHtml(toInitials(p.name));
    const email = p.email ? '<span class="mn-dt__cell-person-email">' + escHtml(p.email) + "</span>" : "";
    return '<div class="mn-dt__cell-person"><span class="mn-dt__avatar">' + avatar + '</span><span class="mn-dt__cell-person-meta"><span class="mn-dt__cell-text">' + escHtml(p.name) + "</span>" + email + "</span></div>";
  },
  badge: (val) => {
    if (val == null) return '<span class="mn-dt__cell-text">\u2014</span>';
    const num = Number(val);
    const cls = num >= 7 ? "green" : num >= 4 ? "yellow" : "red";
    return '<span class="mn-dt__badge mn-dt__badge--' + cls + '">' + escHtml(val) + "</span>";
  },
  action: (val) => {
    const actions = val?.actions ?? [];
    if (actions.length === 0) return '<span class="mn-dt__cell-text">\u2014</span>';
    const buttons = actions.map((a) => '<button type="button" class="mn-dt__action-btn" data-action-id="' + escHtml(a.onClick) + '" aria-label="' + escHtml(a.label) + '">' + (a.icon ? '<span class="mn-dt__action-icon">' + escHtml(a.icon) + "</span>" : "") + "<span>" + escHtml(a.label) + "</span></button>").join("");
    return '<div class="mn-dt__cell-actions">' + buttons + "</div>";
  },
  link: (val) => {
    const l = typeof val === "object" && val !== null ? val : { text: String(val), href: "#" };
    const external = l.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const extIcon = l.external ? '<span class="mn-dt__cell-link-ext" aria-hidden="true">\u2197</span>' : "";
    return '<a class="mn-dt__cell-link" href="' + safeHref(String(l.href ?? "#")) + '"' + external + ">" + escHtml(l.text) + extIcon + "</a>";
  },
  icon: (val) => {
    const i = typeof val === "object" && val !== null ? val : { icon: String(val) };
    const style = i.color && isValidColor(i.color) ? ' style="color:' + escHtml(i.color) + '"' : "";
    const title = i.tooltip ? ' title="' + escHtml(i.tooltip) + '"' : "";
    return '<span class="mn-dt__cell-icon"' + style + title + ">" + renderIconSvg(i.icon) + "</span>";
  },
  custom: (val, row, col) => {
    const c = col;
    if (!c?.render) return escHtml(val);
    const safe = sanitizeHtml(String(c.render(val, row)));
    return safe.replace(/style="[^"]*color:\s*([^;"]+)/g, (m, colorVal) => isValidColor(colorVal.trim()) ? m : m.replace(colorVal, "inherit"));
  }
};

// src/ts/data-table-render.ts
var STATUS_MAP2 = {
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
function el3(tag, cls, attrs) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") e.textContent = v;
    else if (k === "html") e.innerHTML = escapeHtml(String(v));
    else e.setAttribute(k, v);
  }
  return e;
}
function escHtml2(s) {
  return s == null ? "" : escapeHtml(String(s));
}
function buildRow(row, rowIdx, opts, state, tbody) {
  const tr = el3("tr", "mn-dt__row");
  tr.setAttribute("role", "row");
  tr.setAttribute("data-row-idx", String(rowIdx));
  if (opts.selectable) tr.classList.add("mn-dt__row--selectable");
  if (opts.onDrillDown) tr.classList.add("mn-dt__row--drilldown");
  if (opts.selectable || opts.onDrillDown) tr.setAttribute("tabindex", "0");
  if (state.selected === rowIdx) tr.classList.add("mn-dt__row--selected");
  if (opts.stripedRows && rowIdx % 2 === 1) tr.classList.add("mn-dt__row--striped");
  opts.columns.forEach((col, ci) => {
    const td = el3("td", "mn-dt__td");
    td.setAttribute("role", "gridcell");
    td.setAttribute("data-col", String(ci));
    if (col.align === "right") td.style.textAlign = "right";
    if (col.align === "center") td.style.textAlign = "center";
    const renderer = cellRenderers[col.type ?? "text"] ?? cellRenderers.text;
    td.innerHTML = renderer(row[col.key], row, col);
    if (col.type === "action") td.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const btn = t.closest(".mn-dt__action-btn");
      if (!btn) return;
      e.stopPropagation();
      const detail = { actionId: btn.dataset.actionId ?? "", row };
      eventBus.emit("table-action", detail);
      tr.dispatchEvent(new CustomEvent("mn:table-action", { detail, bubbles: true }));
    });
    if (opts.onCellClick) {
      td.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = row[col.key];
        opts.onCellClick(row, col, value);
        tr.dispatchEvent(new CustomEvent("mn:table-cell-click", {
          detail: { row, column: col, value },
          bubbles: true
        }));
      });
    }
    tr.appendChild(td);
  });
  tr.addEventListener("click", () => {
    state.selected = rowIdx;
    tbody.querySelectorAll(".mn-dt__row--selected").forEach((r) => r.classList.remove("mn-dt__row--selected"));
    tr.classList.add("mn-dt__row--selected");
    if (opts.onRowClick) opts.onRowClick(row, rowIdx);
  });
  const triggerDrill = (event) => {
    if (!opts.onDrillDown) return;
    opts.onDrillDown(row, event);
    eventBus.emit("table-drilldown", { row, event });
    tr.dispatchEvent(new CustomEvent("mn:table-drilldown", { detail: { row, event }, bubbles: true }));
  };
  tr.addEventListener("dblclick", triggerDrill);
  tr.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    tr.click();
    triggerDrill(e);
  });
  if (opts.crosshair) tr.addEventListener("mouseenter", () => {
    const prev = tbody.querySelector(".mn-dt__row--hovered");
    if (prev) prev.classList.remove("mn-dt__row--hovered");
    tr.classList.add("mn-dt__row--hovered");
  });
  return tr;
}
function buildGroupHeader(groupName, count, isExpanded, colSpan, state, renderFn) {
  const tr = el3("tr", "mn-dt__group-row");
  tr.setAttribute("role", "rowgroup");
  tr.setAttribute("tabindex", "0");
  tr.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  const td = el3("td", "mn-dt__group-cell");
  td.setAttribute("colspan", String(colSpan));
  const statusCls = STATUS_MAP2[groupName.toLowerCase()]?.cls;
  td.innerHTML = '<span class="mn-dt__group-chevron' + (isExpanded ? " mn-dt__group-chevron--open" : "") + '">\u25B8</span><span class="mn-dt__group-dot' + (statusCls ? " mn-dt__group-dot--" + statusCls : "") + '"></span><span class="mn-dt__group-label">' + escHtml2(groupName.toUpperCase()) + '</span><span class="mn-dt__group-count">' + count + "</span>";
  tr.appendChild(td);
  const toggle = () => {
    const nextCollapsed = isExpanded;
    state.groupCollapsed[groupName] = nextCollapsed;
    state.expandedGroups[groupName] = !nextCollapsed;
    renderFn();
  };
  tr.addEventListener("click", toggle);
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
  return tr;
}
function buildPagination(totalRows, paginationEl, pageSize, state, renderFn) {
  if (!paginationEl || pageSize <= 0) return;
  paginationEl.innerHTML = "";
  const totalPages = Math.ceil(totalRows / pageSize);
  if (totalPages <= 1) return;
  const prevBtn = el3("button", "mn-dt__page-btn", { text: "\u2190", "aria-label": "Previous page" });
  prevBtn.disabled = state.page === 0;
  prevBtn.addEventListener("click", () => {
    if (state.page > 0) {
      state.page--;
      renderFn();
    }
  });
  paginationEl.appendChild(prevBtn);
  const windowSize = 5;
  let winStart = Math.max(0, state.page - Math.floor(windowSize / 2));
  const winEnd = Math.min(totalPages, winStart + windowSize);
  if (winEnd - winStart < windowSize) winStart = Math.max(0, winEnd - windowSize);
  for (let p = winStart; p < winEnd; p++) {
    const pageBtn = el3("button", "mn-dt__page-btn" + (p === state.page ? " mn-dt__page-btn--active" : ""), {
      text: String(p + 1),
      "aria-label": "Page " + (p + 1)
    });
    if (p === state.page) {
      pageBtn.setAttribute("aria-current", "page");
      pageBtn.disabled = true;
    }
    pageBtn.addEventListener("click", () => {
      state.page = p;
      renderFn();
    });
    paginationEl.appendChild(pageBtn);
  }
  const nextBtn = el3("button", "mn-dt__page-btn", { text: "\u2192", "aria-label": "Next page" });
  nextBtn.disabled = state.page >= totalPages - 1;
  nextBtn.addEventListener("click", () => {
    if (state.page < totalPages - 1) {
      state.page++;
      renderFn();
    }
  });
  paginationEl.appendChild(nextBtn);
}
function buildEmptyRow(emptyMessage, colSpan) {
  const tr = el3("tr", "mn-dt__empty-row");
  const td = el3("td", "mn-dt__empty-cell", { text: emptyMessage });
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
  const thRect = ths[ci].getBoundingClientRect();
  const scrollRect = scrollWrap.getBoundingClientRect();
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
  return String(val ?? "").toLowerCase().includes(query.toLowerCase());
}
function handleSort(key, ci, state, headerRow, renderFn, onSort) {
  if (state.sortKey === key) state.sortDir = state.sortDir === 1 ? -1 : 1;
  else {
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
  if (filterKeys.length > 0) rows = rows.filter((row) => filterKeys.every((k) => matchFilter(row[k], state.filters[k])));
  if (state.sortKey !== null) rows.sort((a, b) => compare(a[state.sortKey], b[state.sortKey], state.sortDir));
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
  if (groupOrder) order.sort((a, b) => {
    let ia = groupOrder.indexOf(a);
    let ib = groupOrder.indexOf(b);
    if (ia === -1) ia = 999;
    if (ib === -1) ib = 999;
    return ia - ib;
  });
  return { groups, order };
}
function render2(state, opts, tbody, paginationEl, liveRegion) {
  if (state.data == null) console.warn("[Maranello] dataTable: data is null or undefined");
  tbody.innerHTML = "";
  const rows = getProcessedData(state);
  const grouped = getGroupedData(rows, opts.groupBy, opts.groupOrder);
  const colSpan = opts.columns.length;
  const renderFn = () => render2(state, opts, tbody, paginationEl, liveRegion);
  if (rows.length === 0) {
    tbody.appendChild(buildEmptyRow(opts.emptyMessage ?? "No data found", colSpan));
    buildPagination(0, paginationEl, opts.pageSize ?? 0, state, renderFn);
    announce("Showing 0 of " + state.data.length + " rows", liveRegion);
    return;
  }
  if (grouped) {
    let rowIdx = 0;
    for (const gname of grouped.order) {
      const grow = grouped.groups[gname];
      const isCollapsed = state.groupCollapsed[gname] === true || state.expandedGroups[gname] === false;
      const isExpanded = !isCollapsed;
      const header2 = buildGroupHeader(gname, grow.length, isExpanded, colSpan, state, renderFn);
      header2.setAttribute("data-group", gname);
      tbody.appendChild(header2);
      if (isExpanded) for (const row of grow) tbody.appendChild(buildRow(row, rowIdx++, opts, state, tbody));
      else rowIdx += grow.length;
    }
    buildPagination(rows.length, paginationEl, opts.pageSize ?? 0, state, renderFn);
  } else {
    const pageSize = opts.pageSize ?? 0;
    const start = pageSize > 0 ? state.page * pageSize : 0;
    const end = pageSize > 0 ? Math.min(start + pageSize, rows.length) : rows.length;
    for (let i = start; i < end; i++) tbody.appendChild(buildRow(rows[i], i, opts, state, tbody));
    buildPagination(rows.length, paginationEl, pageSize, state, renderFn);
  }
  const totalData = state.data.length;
  const hasFilters = Object.keys(state.filters).length > 0;
  const sortDir = state.sortDir === 1 ? "ascending" : "descending";
  const pgSize = opts.pageSize ?? 0;
  const totalPages = pgSize > 0 ? Math.ceil(rows.length / pgSize) : 1;
  let msg = state.sortKey && hasFilters ? "Sorted by " + state.sortKey + " " + sortDir + ". Showing " + rows.length + " of " + totalData + " rows" : state.sortKey ? "Sorted by " + state.sortKey + " " + sortDir : hasFilters ? "Showing " + rows.length + " of " + totalData + " rows" : rows.length + " rows";
  if (pgSize > 0) msg += ". Page " + (state.page + 1) + " of " + totalPages;
  announce(msg, liveRegion);
}
function announce(msg, liveRegion) {
  if (liveRegion) liveRegion.textContent = msg;
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
    groupCollapsed: {},
    selected: null,
    colHighlight: -1
  };
  containerEl.innerHTML = "";
  containerEl.classList.add("mn-dt");
  if (resolved.compact) containerEl.classList.add("mn-dt--compact");
  if (resolved.crosshair) containerEl.classList.add("mn-dt--crosshair");
  if (resolved.onDrillDown) containerEl.classList.add("mn-dt--drilldown");
  const scrollWrap = el3("div", "mn-dt__scroll");
  const table2 = el3("table", "mn-dt__table");
  table2.setAttribute("role", "grid");
  table2.setAttribute("aria-label", resolved.ariaLabel ?? "Data table");
  const thead = el3("thead", "mn-dt__head");
  const headerRow = el3("tr", "mn-dt__header-row");
  headerRow.setAttribute("role", "row");
  const filterRow = resolved.showFilters ? el3("tr", "mn-dt__filter-row") : null;
  if (filterRow) filterRow.setAttribute("role", "row");
  const tbody = el3("tbody", "mn-dt__body");
  tbody.setAttribute("role", "rowgroup");
  const liveRegion = el3("div", "mn-sr-only");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("role", "status");
  function doRender() {
    render2(state, resolved, tbody, paginationEl, liveRegion);
  }
  resolved.columns.forEach((col, ci) => {
    const th = el3("th", "mn-dt__th");
    th.setAttribute("role", "columnheader");
    th.setAttribute("scope", "col");
    th.setAttribute("data-col", String(ci));
    if (col.width) th.style.width = typeof col.width === "number" ? col.width + "px" : String(col.width);
    if (col.minWidth) th.style.minWidth = typeof col.minWidth === "number" ? col.minWidth + "px" : String(col.minWidth);
    if (col.align === "right") th.style.textAlign = "right";
    if (col.align === "center") th.style.textAlign = "center";
    const label = el3("span", "mn-dt__th-label", { text: col.label ?? col.key });
    if (col.sortable) {
      th.classList.add("mn-dt__th--sortable");
      th.setAttribute("tabindex", "0");
      th.setAttribute("aria-sort", "none");
      th.appendChild(label);
      th.appendChild(el3("span", "mn-dt__sort-icon", { html: "\u21C5" }));
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
      const ftd = el3("th", "mn-dt__filter-cell");
      ftd.setAttribute("data-col", String(ci));
      if (col.filterable) {
        const input = el3("input", "mn-dt__filter-input");
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
  table2.appendChild(thead);
  table2.appendChild(tbody);
  scrollWrap.appendChild(table2);
  containerEl.appendChild(scrollWrap);
  containerEl.appendChild(liveRegion);
  let paginationEl = null;
  if ((resolved.pageSize ?? 0) > 0) {
    paginationEl = el3("div", "mn-dt__pagination");
    containerEl.appendChild(paginationEl);
  }
  const colHighlightEl = el3("div", "mn-dt__col-highlight");
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
      if (v != null) {
        state.expandedGroups[String(v)] = true;
        state.groupCollapsed[String(v)] = false;
      }
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
      containerEl.classList.remove("mn-dt", "mn-dt--compact", "mn-dt--crosshair", "mn-dt--drilldown");
    }
  };
}

// src/ts/date-picker-keys.ts
function attachDatePickerKeys(picker, ctx) {
  picker.addEventListener("keydown", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (!target.classList.contains("mn-date-picker__day")) return;
    const day = ctx.getFocusedDay();
    if (!day) return;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        navigateDay(ctx, day, -1);
        break;
      case "ArrowRight":
        navigateDay(ctx, day, 1);
        break;
      case "ArrowUp":
        navigateDay(ctx, day, -7);
        break;
      case "ArrowDown":
        navigateDay(ctx, day, 7);
        break;
      case "Home":
        ctx.setFocusedDay(1);
        ctx.focusDayCell(1);
        break;
      case "End": {
        const last = ctx.daysInMonth(ctx.getViewYear(), ctx.getViewMonth());
        ctx.setFocusedDay(last);
        ctx.focusDayCell(last);
        break;
      }
      case "PageUp":
        changeMonth(ctx, -1);
        break;
      case "PageDown":
        changeMonth(ctx, 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!ctx.isDisabled(ctx.getViewYear(), ctx.getViewMonth(), day)) {
          ctx.selectDay(day);
        }
        return;
      case "Escape":
        ctx.closePicker();
        return;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  });
}
function navigateDay(ctx, current2, delta) {
  let y = ctx.getViewYear();
  let m = ctx.getViewMonth();
  let target = current2 + delta;
  if (target < 1) {
    m--;
    if (m < 0) {
      m = 11;
      y--;
    }
    ctx.setView(y, m);
    target = ctx.daysInMonth(y, m) + target;
    ctx.renderCalendar();
    ctx.setFocusedDay(target);
    ctx.focusDayCell(target);
    return;
  }
  const max = ctx.daysInMonth(y, m);
  if (target > max) {
    target = target - max;
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
    ctx.setView(y, m);
    ctx.renderCalendar();
    ctx.setFocusedDay(target);
    ctx.focusDayCell(target);
    return;
  }
  ctx.setFocusedDay(target);
  ctx.focusDayCell(target);
}
function changeMonth(ctx, dir) {
  let y = ctx.getViewYear();
  let m = ctx.getViewMonth() + dir;
  if (m < 0) {
    m = 11;
    y--;
  }
  if (m > 11) {
    m = 0;
    y++;
  }
  ctx.setView(y, m);
  const maxDay = ctx.daysInMonth(y, m);
  const day = Math.min(ctx.getFocusedDay(), maxDay);
  ctx.renderCalendar();
  ctx.setFocusedDay(day);
  ctx.focusDayCell(day);
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
function focusDayCellInPicker(picker, day) {
  const cells = picker.querySelectorAll(
    ".mn-date-picker__day:not(.mn-date-picker__day--empty)"
  );
  const target = cells[day - 1];
  if (target) {
    cells.forEach((c) => c.setAttribute("tabindex", "-1"));
    target.setAttribute("tabindex", "0");
    target.focus();
  }
}
function datePicker(anchor, opts) {
  closePicker();
  const options = opts ?? {};
  let sel = parseVal(options.value);
  let viewY = sel ? sel.y : (/* @__PURE__ */ new Date()).getFullYear();
  let viewM = sel ? sel.m : (/* @__PURE__ */ new Date()).getMonth();
  let focusedDay = sel ? sel.d : 1;
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
  function selectDay(day) {
    sel = { y: viewY, m: viewM, d: day };
    if (options.onSelect) options.onSelect(toDateStr(viewY, viewM, day));
    closePicker();
  }
  function renderCalendar() {
    picker.innerHTML = "";
    const nav = document.createElement("div");
    nav.className = "mn-date-picker__nav";
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "mn-date-picker__nav-btn";
    prevBtn.innerHTML = "\u25C0";
    prevBtn.setAttribute("aria-label", "Previous month");
    prevBtn.addEventListener("click", () => {
      viewM--;
      if (viewM < 0) {
        viewM = 11;
        viewY--;
      }
      focusedDay = Math.min(focusedDay, daysInMonth(viewY, viewM));
      renderCalendar();
    });
    const title = document.createElement("span");
    title.className = "mn-date-picker__month-title";
    title.id = "mn-dp-title";
    title.textContent = MONTHS[viewM] + " " + viewY;
    title.setAttribute("aria-live", "polite");
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "mn-date-picker__nav-btn";
    nextBtn.innerHTML = "\u25B6";
    nextBtn.setAttribute("aria-label", "Next month");
    nextBtn.addEventListener("click", () => {
      viewM++;
      if (viewM > 11) {
        viewM = 0;
        viewY++;
      }
      focusedDay = Math.min(focusedDay, daysInMonth(viewY, viewM));
      renderCalendar();
    });
    nav.append(prevBtn, title, nextBtn);
    picker.appendChild(nav);
    const dayHeaders = document.createElement("div");
    dayHeaders.className = "mn-date-picker__days-header";
    dayHeaders.setAttribute("role", "row");
    DAYS.forEach((d) => {
      const dh = document.createElement("span");
      dh.className = "mn-date-picker__day-name";
      dh.setAttribute("role", "columnheader");
      dh.textContent = d;
      dayHeaders.appendChild(dh);
    });
    picker.appendChild(dayHeaders);
    const grid = document.createElement("div");
    grid.className = "mn-date-picker__grid";
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-labelledby", "mn-dp-title");
    const startDay = firstDayOfWeek(viewY, viewM);
    const totalDays = daysInMonth(viewY, viewM);
    let row = document.createElement("div");
    row.setAttribute("role", "row");
    for (let e = 0; e < startDay; e++) {
      const empty = document.createElement("span");
      empty.className = "mn-date-picker__day mn-date-picker__day--empty";
      empty.setAttribute("role", "gridcell");
      row.appendChild(empty);
    }
    for (let d = 1; d <= totalDays; d++) {
      const cellIdx = (startDay + d - 1) % 7;
      if (cellIdx === 0 && d > 1) {
        grid.appendChild(row);
        row = document.createElement("div");
        row.setAttribute("role", "row");
      }
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "mn-date-picker__day";
      cell.setAttribute("role", "gridcell");
      cell.textContent = String(d);
      cell.setAttribute("tabindex", d === focusedDay ? "0" : "-1");
      const dateLabel = d + " " + MONTHS[viewM] + " " + viewY;
      cell.setAttribute("aria-label", dateLabel);
      const disabled = isDisabled(viewY, viewM, d);
      if (disabled) cell.classList.add("mn-date-picker__day--disabled");
      cell.disabled = disabled;
      const isSelected = sel && d === sel.d && viewM === sel.m && viewY === sel.y;
      if (d === todayD && viewM === todayM && viewY === todayY) {
        cell.classList.add("mn-date-picker__day--today");
      }
      if (isSelected) {
        cell.classList.add("mn-date-picker__day--selected");
        cell.setAttribute("aria-selected", "true");
      }
      const day = d;
      cell.addEventListener("click", () => selectDay(day));
      row.appendChild(cell);
    }
    grid.appendChild(row);
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
  attachDatePickerKeys(picker, {
    getViewYear: () => viewY,
    getViewMonth: () => viewM,
    setView: (y, m) => {
      viewY = y;
      viewM = m;
    },
    daysInMonth,
    isDisabled,
    selectDay,
    closePicker,
    renderCalendar,
    getFocusedDay: () => focusedDay,
    setFocusedDay: (d) => {
      focusedDay = d;
    },
    focusDayCell: (d) => focusDayCellInPicker(picker, d)
  });
  renderCalendar();
  anchor.style.position = "relative";
  anchor.appendChild(picker);
  setTimeout(() => focusDayCellInPicker(picker, focusedDay), 50);
  setTimeout(() => {
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onDocKey);
  }, 0);
  return { close: closePicker };
}

// src/ts/forms-tags-field.ts
function initTagsField(el5, opts) {
  const tags = [];
  const onChange = opts?.onChange;
  const maxTags = opts?.maxTags ?? Infinity;
  const placeholder = opts?.placeholder ?? "Add tag...";
  const suggestions = opts?.suggestions ?? [];
  el5.innerHTML = "";
  el5.classList.add("mn-tags-field");
  const chipsContainer = document.createElement("div");
  chipsContainer.className = "mn-tags-field__chips";
  el5.appendChild(chipsContainer);
  const input = document.createElement("input");
  input.className = "mn-tags-field__input";
  input.type = "text";
  input.placeholder = placeholder;
  input.setAttribute("aria-label", placeholder);
  el5.appendChild(input);
  const dropdown = document.createElement("div");
  dropdown.className = "mn-tags-field__suggestions";
  dropdown.style.display = "none";
  el5.appendChild(dropdown);
  el5.addEventListener("click", (e) => {
    if (e.target !== dropdown) input.focus();
  });
  function notify() {
    if (onChange) onChange(tags.slice());
  }
  function hideSuggestions() {
    dropdown.style.display = "none";
    dropdown.innerHTML = "";
  }
  function showSuggestions(query) {
    if (!suggestions.length) return;
    const q = query.toLowerCase();
    const matches = suggestions.filter(
      (s) => s.toLowerCase().includes(q) && !tags.includes(s)
    );
    if (!matches.length) {
      hideSuggestions();
      return;
    }
    dropdown.innerHTML = "";
    matches.slice(0, 8).forEach((s) => {
      const item = document.createElement("div");
      item.className = "mn-tags-field__suggestion-item";
      item.textContent = escapeHtml(s);
      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        addTag(s);
        input.value = "";
        hideSuggestions();
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = "";
  }
  function createChip(value) {
    const chip = document.createElement("span");
    chip.className = "mn-chip";
    chip.appendChild(document.createTextNode(value));
    const removeBtn = document.createElement("button");
    removeBtn.className = "mn-chip__remove";
    removeBtn.type = "button";
    removeBtn.setAttribute("aria-label", "Remove " + escapeHtml(value));
    removeBtn.textContent = "\xD7";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTag(value);
    });
    chip.appendChild(removeBtn);
    return chip;
  }
  function addTag(value) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.indexOf(trimmed) !== -1) return;
    if (tags.length >= maxTags) return;
    tags.push(trimmed);
    chipsContainer.appendChild(createChip(trimmed));
    updatePlaceholder();
    notify();
  }
  function removeTag(value) {
    const idx = tags.indexOf(value);
    if (idx === -1) return;
    tags.splice(idx, 1);
    const chips = chipsContainer.querySelectorAll(".mn-chip");
    chips.forEach((chip) => {
      if (chip.firstChild?.textContent === value) chip.remove();
    });
    updatePlaceholder();
    notify();
  }
  function setValue2(newTags) {
    tags.length = 0;
    chipsContainer.innerHTML = "";
    newTags.forEach((t) => addTag(t));
  }
  function updatePlaceholder() {
    input.placeholder = tags.length > 0 ? "" : placeholder;
  }
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input.value.replace(/,/g, ""));
      input.value = "";
      hideSuggestions();
    } else if (e.key === "Backspace" && input.value === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === "Escape") {
      hideSuggestions();
    }
  });
  input.addEventListener("input", () => {
    const q = input.value.trim();
    if (q.length > 0) showSuggestions(q);
    else hideSuggestions();
  });
  input.addEventListener("blur", () => {
    setTimeout(hideSuggestions, 150);
  });
  if (opts?.value) opts.value.forEach((t) => addTag(t));
  function destroy() {
    el5.innerHTML = "";
    el5.classList.remove("mn-tags-field");
    tags.length = 0;
  }
  return { addTag, removeTag, getTags: () => tags.slice(), setValue: setValue2, destroy };
}

// src/ts/forms-person-field.ts
function deriveInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function initPersonField(el5, opts) {
  const { searchFn, onSelect, placeholder = "Search people..." } = opts;
  el5.classList.add("mn-person-field");
  let selectedId = "";
  const asyncSelect = new AsyncSelect(el5, {
    provider: {
      search: (query) => searchFn(query),
      renderItem: (person) => {
        const initials3 = person.initials ?? deriveInitials(person.name);
        const suffix = person.email ? ` \u2022 ${person.email}` : "";
        return `${initials3} ${person.name}${suffix}`;
      },
      getLabel: (person) => person.name,
      getId: (person) => person.id
    },
    placeholder,
    debounceMs: 300,
    minChars: 1,
    onSelect: (person) => {
      selectedId = person.id;
      onSelect?.({ id: person.id, name: person.name });
    }
  });
  const input = el5.querySelector(".mn-async-select__input");
  if (input) {
    input.classList.add("mn-input", "mn-person-field__input");
    if (opts.value) input.value = opts.value;
  }
  function destroy() {
    asyncSelect.destroy();
    el5.classList.remove("mn-person-field");
  }
  return {
    getValue: () => input?.value ?? "",
    setValue: (name) => {
      if (input) input.value = name;
      selectedId = "";
    },
    destroy
  };
}

// src/ts/funnel-helpers.ts
function hexLum(hex) {
  let h = (hex || "#888888").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function autoTextColor(bg) {
  return hexLum(bg) > 0.35 ? "#111" : "#fff";
}
function resolveContainer3(c) {
  if (typeof c === "string") return document.querySelector(c);
  return c instanceof Element ? c : null;
}
function svgEl(tag, attrs) {
  const el5 = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (attrs) {
    for (const k of Object.keys(attrs)) el5.setAttribute(k, String(attrs[k]));
  }
  return el5;
}
function svgText(attrs, text) {
  const el5 = svgEl("text", attrs);
  el5.textContent = text;
  return el5;
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
  function render5(data) {
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
    const containerH = host.clientHeight || 0;
    const dynH = containerH > 100 ? containerH : 0;
    const barH = dynH > 0 ? Math.max(28, Math.floor((dynH - PAD * 2 - (rows - 1) * 24) / rows)) : BAR_H;
    const gap = dynH > 0 ? 24 : GAP;
    const svgH = PAD * 2 + rows * barH + (rows - 1) * gap;
    const svg2 = svgEl("svg", { viewBox: "0 0 " + VB_W + " " + svgH, preserveAspectRatio: "xMidYMid meet" });
    svg2.style.width = "100%";
    svg2.style.height = dynH > 0 ? "100%" : "auto";
    pipe.forEach((stageRaw, i) => {
      const stage = isValidColor(stageRaw.color) ? stageRaw : { ...stageRaw, color: "var(--mn-border-strong)" };
      const barW = Math.max(PIPE_W * MIN_BAR, stage.count / maxC * PIPE_W);
      const barX = PIPE_L + (PIPE_W - barW) / 2;
      const y = PAD + i * (barH + gap);
      if (i < rows - 1) {
        const ns = pipe[i + 1];
        const nW = Math.max(PIPE_W * MIN_BAR, ns.count / maxC * PIPE_W);
        const nX = PIPE_L + (PIPE_W - nW) / 2;
        svg2.appendChild(svgEl("path", { d: trapPath(barX, barW, nX, nW, y + barH, y + barH + gap), fill: stage.color, opacity: "0.12" }));
        const rate = reach[i] > 0 ? Math.round(reach[i + 1] / reach[i] * 100) : 0;
        svg2.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + barH + gap / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": 9, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: "var(--mn-text-muted)", "font-weight": "500" }, "\u2193 " + rate + "%"));
      }
      const bar = svgEl("rect", { x: barX, y, width: barW, height: barH, rx: RAD, fill: stage.color });
      bar.classList.add("mn-funnel__bar");
      bar.setAttribute("data-stage", stage.label);
      if (opts.animate) {
        bar.style.opacity = "0";
        bar.style.transform = "translateX(-12px)";
      }
      svg2.appendChild(bar);
      const tc = autoTextColor(stage.color);
      svg2.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + Math.round(barH * 0.37), "text-anchor": "middle", "font-size": 11, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: tc, "font-weight": "600" }, stage.label));
      let cTxt = String(stage.count);
      if (total > 0) cTxt += " (" + Math.round(stage.count / total * 100) + "%)";
      svg2.appendChild(svgText({ x: PIPE_L + PIPE_W / 2, y: y + Math.round(barH * 0.76), "text-anchor": "middle", "font-size": 14, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: tc, "font-weight": "700" }, cTxt));
      const holdClr = isValidColor(data.onHold?.color || "") ? data.onHold.color : "#ea580c";
      const wdClr = isValidColor(data.withdrawn?.color || "") ? data.withdrawn.color : "#666";
      if (stage.holdCount && stage.holdCount > 0) renderExitPill(svg2, barX, y, "left", stage.holdCount, holdClr, "\u23F8");
      if (stage.withdrawnCount && stage.withdrawnCount > 0) renderExitPill(svg2, barX + barW, y, "right", stage.withdrawnCount, wdClr, "\u2715");
      const hit = svgEl("rect", { x: barX, y, width: barW, height: barH, fill: "transparent", cursor: "pointer", "pointer-events": "all" });
      hit.addEventListener("mouseenter", () => {
        bar.style.filter = "brightness(1.3)";
        bar.style.transition = "filter 0.15s";
      });
      hit.addEventListener("mouseleave", () => {
        bar.style.filter = "";
      });
      hit.addEventListener("click", () => {
        svg2.querySelectorAll(".mn-funnel__sel").forEach((el5) => el5.remove());
        const sel = svgEl("rect", { x: barX - 2, y: y - 2, width: barW + 4, height: barH + 4, fill: "none", stroke: "#FFC72C", "stroke-width": "2", rx: "6", class: "mn-funnel__sel" });
        svg2.appendChild(sel);
        if (opts.onClick) opts.onClick(stage);
      });
      svg2.appendChild(hit);
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
      const ohLegClr = isValidColor(data.onHold.color) ? data.onHold.color : "#ea580c";
      svg2.appendChild(svgEl("circle", { cx: PIPE_L, cy: legendY, r: 4, fill: ohLegClr, opacity: "0.8" }));
      svg2.appendChild(svgText({ x: PIPE_L + 8, y: legendY + 3, "font-size": 9, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: "var(--mn-text-muted)", "font-weight": "500" }, "\u23F8 On Hold: " + data.onHold.count));
    }
    if (data.withdrawn && data.withdrawn.count > 0) {
      const wdLegClr = isValidColor(data.withdrawn.color) ? data.withdrawn.color : "#666";
      svg2.appendChild(svgEl("circle", { cx: PIPE_L + PIPE_W / 2 + 20, cy: legendY, r: 4, fill: wdLegClr, opacity: "0.8" }));
      svg2.appendChild(svgText({ x: PIPE_L + PIPE_W / 2 + 28, y: legendY + 3, "font-size": 9, style: "font-family:var(--font-body,'Inter',sans-serif)", fill: "var(--mn-text-muted)", "font-weight": "500" }, "\u2715 Withdrawn: " + data.withdrawn.count));
    }
    root.appendChild(svg2);
  }
  function renderExitPill(svg2, anchorX, barY, side, count, color, icon) {
    const isLeft = side === "left";
    const cy = barY + BAR_H / 2;
    const pillX = isLeft ? anchorX - EXIT_GAP - EXIT_R * 2 - 20 : anchorX + EXIT_GAP;
    const lineEnd = isLeft ? pillX + EXIT_R * 2 + 20 : pillX;
    svg2.appendChild(svgEl("line", { x1: anchorX, y1: cy, x2: lineEnd, y2: cy, stroke: color, "stroke-width": "1.5", "stroke-dasharray": "3 2", opacity: "0.5" }));
    const pw = EXIT_R * 2 + 20, ph = 20;
    svg2.appendChild(svgEl("rect", { x: pillX, y: cy - ph / 2, width: pw, height: ph, rx: ph / 2, fill: color, opacity: "0.18" }));
    svg2.appendChild(svgText({ x: pillX + pw / 2, y: cy + 3.5, "text-anchor": "middle", "font-size": 10, style: "font-family:var(--font-display,'Barlow Condensed',sans-serif)", fill: color, "font-weight": "600" }, icon + " " + count));
  }
  host.innerHTML = "";
  host.appendChild(root);
  render5(opts.data);
  return {
    update: (d) => {
      render5(d);
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
function pct(current2, target) {
  const c = safeNumber(current2), t = safeNumber(target);
  return t <= 0 ? 0 : clamp(c / t * 100, 0, 100);
}
function statusFromProgress(p) {
  const v = safeNumber(p);
  return v >= 75 ? "on-track" : v >= 40 ? "at-risk" : "behind";
}
function statusLabel(s) {
  return s === "on-track" ? "ON TRACK" : s === "at-risk" ? "AT RISK" : "BEHIND";
}
function formatKR(current2, target, unit) {
  return String(current2) + "/" + String(target) + (unit || "");
}
function el4(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) Object.keys(attrs).forEach((key) => {
    if (key === "text") node.textContent = attrs[key];
    else if (key === "html") node.innerHTML = escapeHtml(String(attrs[key]));
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
  const safeColor3 = isValidColor(color) ? color : "#999";
  const radius = (size - stroke) / 2, cx = size / 2;
  const circ = 2 * Math.PI * radius;
  const bounded = clamp(safeNumber(percent), 0, 100);
  const off2 = circ - bounded / 100 * circ;
  let svg2 = `<svg class="mn-okr__ring" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="${trackClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}"></circle><circle class="${progressClass}" cx="${cx}" cy="${cx}" r="${radius}" stroke-width="${stroke}" stroke="${safeColor3}" data-circumference="${circ.toFixed(2)}" data-target-offset="${off2.toFixed(2)}" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${circ.toFixed(2)}"></circle>`;
  if (centerText != null) svg2 += `<text class="mn-okr__ring-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${escapeHtml(String(centerText))}</text>`;
  return svg2 + "</svg>";
}
function heroGaugeSVG(percent, color) {
  const safeColor3 = isValidColor(color) ? color : "#999";
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
  return `<svg class="mn-okr__gauge" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><filter id="okr-glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8" stroke-linecap="round"/><path class="mn-okr__gauge-progress" d="${progressPath}" fill="none" stroke="${safeColor3}" stroke-width="8" stroke-linecap="round" filter="url(#okr-glow)" stroke-dasharray="${(Math.PI * r).toFixed(1)}" stroke-dashoffset="${(Math.PI * r).toFixed(1)}" data-target="0"/>` + ticks.join("") + `<line class="mn-okr__needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${safeColor3}" stroke-width="2.5" stroke-linecap="round" filter="url(#okr-glow)" data-cx="${cx}" data-cy="${cy}" data-r="${r - 28}" data-target-angle="${needleAngle.toFixed(4)}"/><circle cx="${cx}" cy="${cy}" r="5" fill="${safeColor3}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#111"/></svg>`;
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
  const rawColor = STATUS_COLORS2[status] || "#00A651";
  const color = isValidColor(rawColor) ? rawColor : "#00A651";
  const p = total > 0 ? count / total * 100 : 0;
  const card = el4("div", `mn-okr__summary-card mn-okr__summary-card--${status}`);
  const arcWrap = el4("div", "mn-okr__summary-arc");
  const sz = 64, sw = 5, r = (sz - sw) / 2, cx = sz / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - p / 100 * circ;
  arcWrap.innerHTML = `<svg viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/><circle class="mn-okr__summary-ring" cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}" data-target="${offset.toFixed(1)}" transform="rotate(-90,${cx},${cx})" style="filter:drop-shadow(0 0 6px ${color}40);transition:stroke-dashoffset 900ms cubic-bezier(0.2,1,0.2,1)"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="${color}" font-family="var(--font-mono)" font-size="18" font-weight="700">${count}</text></svg>`;
  const info = el4("div", "mn-okr__summary-info");
  const head = el4("div", "mn-okr__summary-head");
  head.appendChild(el4("span", `mn-okr__status-dot mn-okr__status-dot--${status}`));
  head.appendChild(el4("span", "mn-okr__summary-label", { text: statusLabel(status) }));
  info.appendChild(head);
  info.appendChild(el4("div", "mn-okr__summary-threshold", { text: description }));
  card.appendChild(arcWrap);
  card.appendChild(info);
  return card;
}
function createHero(stats, period) {
  const status = statusFromProgress(stats.average);
  const rawHeroColor = STATUS_COLORS2[status];
  const color = isValidColor(rawHeroColor) ? rawHeroColor : "#00A651";
  const section = el4("section", "mn-okr__hero");
  const gaugeBlock = el4("div", "mn-okr__gauge-wrap");
  gaugeBlock.innerHTML = heroGaugeSVG(stats.average, color);
  const gaugeValue = el4("div", "mn-okr__gauge-value", { text: Math.round(stats.average) + "%" });
  gaugeValue.style.color = color;
  gaugeBlock.appendChild(gaugeValue);
  const avgBlock = el4("div", "mn-okr__average");
  avgBlock.appendChild(el4("div", "mn-okr__average-label", { text: "Average completion" }));
  const avgVal = el4("div", "mn-okr__average-value", { text: Math.round(stats.average) + "%" });
  avgVal.style.color = color;
  avgBlock.appendChild(avgVal);
  const badge = el4("div", `mn-okr__status-badge mn-okr__status-badge--${status}`, { text: statusLabel(status) });
  badge.style.setProperty("--badge-color", color);
  avgBlock.appendChild(badge);
  avgBlock.appendChild(el4("span", "mn-okr__period-tag", { text: period || "Current period" }));
  section.appendChild(gaugeBlock);
  section.appendChild(avgBlock);
  return section;
}
function createKRRow(kr, objectiveStatus) {
  const current2 = safeNumber(kr.current), target = safeNumber(kr.target);
  const completion = pct(current2, target);
  const status = statusFromProgress(completion);
  const row = el4("li", "mn-okr__kr");
  const top = el4("div", "mn-okr__kr-head");
  top.appendChild(el4("span", "mn-okr__kr-title", { text: kr.title || "Untitled KR" }));
  top.appendChild(el4("span", "mn-okr__kr-metric", { text: formatKR(current2, target, kr.unit || "") }));
  const track = el4("div", "mn-okr__kr-track");
  const bar = el4("div", `mn-okr__kr-bar mn-okr__kr-bar--${status}`);
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
  const card = el4("article", `mn-okr__objective mn-okr__objective--${status}`, {
    role: "article",
    "aria-label": `${objective.title} status ${status.replace("-", " ")}`
  });
  card.style.setProperty("--mn-okr-scope", scopeColor);
  card.style.setProperty("--mn-okr-status", STATUS_COLORS2[status]);
  card.style.animationDelay = index * 45 + "ms";
  const header2 = el4("div", "mn-okr__objective-header");
  const left = el4("div", "mn-okr__objective-main");
  left.appendChild(el4("span", "mn-okr__scope-badge", { text: objective.scope }));
  left.appendChild(el4("h3", "mn-okr__objective-title", { text: objective.title }));
  const right = el4("div", "mn-okr__objective-ring-wrap");
  right.innerHTML = ringTemplate(
    56,
    6,
    objective.progress,
    STATUS_COLORS2[status],
    Math.round(objective.progress) + "%",
    "mn-okr__ring-track",
    "mn-okr__ring-progress"
  );
  header2.appendChild(left);
  header2.appendChild(right);
  const krList = el4("ul", "mn-okr__kr-list");
  objective.keyResults.forEach((kr) => krList.appendChild(createKRRow(kr, status)));
  card.appendChild(header2);
  card.appendChild(krList);
  return card;
}

// src/ts/okr-panel.ts
function okrPanel(container, opts) {
  const host = typeof container === "string" ? document.querySelector(container) : container;
  if (!host) {
    console.warn("[Maranello] okrPanel: container not found:", container);
    return null;
  }
  const el_host = host;
  const title = opts?.title ?? "OKR Dashboard";
  const period = opts?.period ?? "";
  let objectives = (opts?.objectives ?? []).map(normalizeObjective);
  function render5() {
    el_host.innerHTML = "";
    const root = el4("div", "mn-okr");
    const header2 = el4("div", "mn-okr__header");
    header2.appendChild(el4("h2", "mn-okr__title", { text: title }));
    root.appendChild(header2);
    const stats = calculateStats(objectives);
    root.appendChild(createHero(stats, period));
    const summaryRow = el4("div", "mn-okr__summary-row");
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
    const grid = el4("div", "mn-okr__grid");
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
  render5();
  return {
    update(newObjectives) {
      objectives = newObjectives.map(normalizeObjective);
      render5();
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
  const canvases = document.querySelectorAll(selector);
  if (!canvases.length) {
    console.warn("[Maranello] initGauges: no gauge canvases found for selector:", selector);
  }
  canvases.forEach((canvas) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge2 = new FerrariGauge(canvas);
            instances.push(gauge2);
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
  const revealEls = document.querySelectorAll(selector);
  if (!revealEls.length) {
    console.warn("[Maranello] initScrollReveal: no elements found for selector:", selector);
  }
  revealEls.forEach((el5) => observer.observe(el5));
}
function initNavTracking(opts) {
  const sectionSelector = opts?.sectionSelector ?? "section[id]";
  const linkSelector = opts?.linkSelector ?? ".mn-nav__link";
  const offsetPx = opts?.offsetPx ?? 100;
  const activeClass = opts?.activeClass ?? "mn-nav__link--active";
  const sections = document.querySelectorAll(sectionSelector);
  const navLinks = document.querySelectorAll(linkSelector);
  if (!sections.length) {
    console.warn("[Maranello] initNavTracking: no sections found for selector:", sectionSelector);
  }
  if (!navLinks.length) {
    console.warn("[Maranello] initNavTracking: no nav links found for selector:", linkSelector);
  }
  const handleScroll = throttle(() => {
    let current2 = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offsetPx) {
        current2 = section.getAttribute("id") ?? "";
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        activeClass,
        link.getAttribute("href") === `#${current2}`
      );
    });
  }, 100);
  window.addEventListener("scroll", handleScroll);
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
  document.querySelectorAll(selector).forEach((el5) => {
    const bg = getComputedStyle(el5).backgroundColor;
    const lum = relativeLuminance(bg);
    if (lum === null) return;
    if (el5 instanceof HTMLElement) {
      el5.style.color = lum > threshold ? "#111" : "rgba(255,255,255,0.95)";
      el5.style.textShadow = lum > threshold ? "none" : "0 1px 3px rgba(0,0,0,0.5)";
    }
  });
}

// src/ts/speedometer-draw.ts
function drawSpeedometer(ctx, dim, s, cx, cy, R, curAngle, curVal, barVal, opts) {
  const p = speedoPalette();
  const needleCol = p.needle || opts.needleColor;
  const arcCol = p.arc || opts.arcColor;
  ctx.save();
  ctx.clearRect(0, 0, dim, dim);
  drawBackground(ctx, cx, cy, R, s, p);
  drawArc(ctx, cx, cy, R, s, curVal, arcCol, opts);
  drawTicks(ctx, cx, cy, R, s, p, opts);
  drawMajorTicks(ctx, cx, cy, R, s, p, opts);
  drawNeedle(ctx, cx, cy, R, s, curAngle, needleCol);
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
function drawTicks(ctx, cx, cy, R, s, p, opts) {
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
function drawNeedle(ctx, cx, cy, R, s, curAngle, needleCol) {
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
function hexLum2(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function createEl(tag, cls, text) {
  const el5 = document.createElement(tag);
  if (cls) el5.className = cls;
  if (text != null) el5.textContent = text;
  return el5;
}
function clampVal(v, min, max) {
  return Math.max(min, Math.min(max, v));
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
function cleanupTimers(state) {
  while (state.timers.length) {
    const t = state.timers.pop();
    if (t != null) window.clearTimeout(t);
  }
}
function addListener(state, el5, evt, handler) {
  el5.addEventListener(evt, handler);
  state.listeners.push({ el: el5, evt, handler });
}
function showTip(tooltip, frame, text, evt) {
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
function hideTip(tooltip) {
  tooltip.classList.remove("is-visible");
}
function normalizeBars(bars, sortDescending) {
  const result = bars.map((bar, idx) => ({
    label: bar?.label != null ? String(bar.label) : "Item " + (idx + 1),
    value: Number(bar?.value ?? 0),
    color: normalizeHex(bar?.color)
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
  const ticks = buildTicks(maxValue);
  ctx.titleEl.style.display = state.opts.title ? "" : "none";
  ctx.titleEl.textContent = state.opts.title || "";
  ctx.root.setAttribute("role", "img");
  ctx.root.setAttribute("aria-label", state.opts.title || "Horizontal bar chart");
  ctx.frame.style.setProperty(
    "--mn-hbar-bar-height",
    (state.opts.barHeight || 28) + "px"
  );
  renderGrid(ctx, ticks, maxValue);
  renderAxis(ctx, ticks, maxValue);
  renderRows(ctx, bars, maxValue);
}
function renderGrid(ctx, ticks, maxValue) {
  if (!ctx.state.opts.showGrid) return;
  ticks.forEach((tick) => {
    const line = createEl("div", "mn-hbar__grid-line");
    line.style.left = tick / maxValue * 100 + "%";
    ctx.gridLayer.appendChild(line);
  });
}
function renderAxis(ctx, ticks, maxValue) {
  const unit = ctx.state.opts.unit || "";
  ticks.forEach((tick) => {
    const aLabel = createEl("div", "mn-hbar__axis-label", tick + unit);
    aLabel.style.left = tick / maxValue * 100 + "%";
    ctx.axisLabels.appendChild(aLabel);
  });
}
function renderRows(ctx, bars, maxValue) {
  const { state } = ctx;
  bars.forEach((bar, index) => {
    const row = createEl("div", "mn-hbar__row");
    const label = createEl("div", "mn-hbar__label", bar.label);
    const track = createEl("div", "mn-hbar__track");
    const fill = createEl("div", "mn-hbar__fill");
    const valueEl = createEl("div", "mn-hbar__value");
    const pct3 = clampVal(bar.value / maxValue * 100, 0, 100);
    const txtColor = hexLum2(bar.color) > 0.55 ? "#111111" : "#FFFFFF";
    const safeColor3 = isValidColor(bar.color) ? bar.color : cssVar("--mn-accent");
    fill.style.background = safeColor3;
    fill.style.height = (state.opts.barHeight || 28) + "px";
    fill.style.width = state.opts.animate ? "0%" : pct3 + "%";
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
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(
      state,
      row,
      "mousemove",
      (evt) => showTip(ctx.tooltip, ctx.frame, tipText, evt)
    );
    addListener(state, row, "mouseleave", () => hideTip(ctx.tooltip));
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
        fill.style.width = pct3 + "%";
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
  project: () => svg(
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M3 9h6"/><path d="M3 14h6"/><circle cx="16" cy="12" r="3"/><path d="M16 9v0"/>'
  ),
  /** Generic workspace/location icon (was: studio). */
  workspace: () => svg(
    '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/>'
  ),
  /** Now/Next dual-panel icon. */
  nowNext: () => svg(
    '<rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><circle cx="6" cy="10" r="2" fill="currentColor" opacity="0.4"/><path d="M17 10l2 2-2 2"/>'
  )
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
  const isInline = opts.mode === "inline";
  container.classList.add("mn-detail-panel");
  if (isInline) container.classList.add("mn-detail-panel--inline");
  const backdrop2 = createElement("div", "mn-detail-panel__backdrop");
  if (isInline) backdrop2.style.display = "none";
  else container.parentNode.insertBefore(backdrop2, container);
  const header2 = createElement("div", "mn-detail-panel__header");
  if (opts.parentLink) {
    const back = createElement("button", "mn-detail__back");
    back.type = "button";
    back.textContent = "\u2190 " + opts.parentLink.label;
    back.addEventListener("click", () => opts.parentLink.onClick());
    header2.appendChild(back);
  }
  const titleRow = createElement("div", "mn-detail-panel__title-row");
  const titleEl = createElement("div", "mn-detail-panel__title");
  titleEl.textContent = opts.title ?? "";
  titleRow.appendChild(titleEl);
  if (opts.externalLinks?.length) {
    for (const link of opts.externalLinks) {
      const a = document.createElement("a");
      a.className = "mn-detail__ext-link";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.title = link.label;
      a.setAttribute("aria-label", link.label);
      a.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
      titleRow.appendChild(a);
    }
  }
  header2.appendChild(titleRow);
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
  header2.appendChild(headerActions);
  container.appendChild(header2);
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
  return { backdrop: backdrop2, titleEl, editBtn, saveBtn, cancelBtn, closeBtn, tabBar, body, footer };
}
function renderBody2(body, state, opts) {
  body.innerHTML = "";
  state.errors = {};
  if (state.activeTab && opts.tabRenderers?.[state.activeTab]) {
    opts.tabRenderers[state.activeTab](body, opts.data);
    return;
  }
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
function getFocusable(el5) {
  const sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  return Array.from(el5.querySelectorAll(sel));
}
function createDetailPanel(container, opts = {}) {
  const isInline = opts.mode === "inline";
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
  let triggerElement = null;
  const dom = buildDOM(container, opts, state.activeTab, (tab) => {
    state.activeTab = tab;
    if (dom.tabBar) {
      dom.tabBar.querySelectorAll(".mn-detail-panel__tab").forEach((btn) => {
        btn.classList.toggle("mn-detail-panel__tab--active", btn.dataset.tab === tab);
      });
    }
    renderBody2(dom.body, state, opts);
  });
  if (isInline) {
    container.setAttribute("role", "complementary");
    if (opts.title) container.setAttribute("aria-label", opts.title);
  } else {
    container.setAttribute("role", "dialog");
    container.setAttribute("aria-modal", "true");
    if (opts.title) container.setAttribute("aria-label", opts.title);
  }
  dom.closeBtn.setAttribute("aria-label", "Close panel");
  renderBody2(dom.body, state, opts);
  dom.closeBtn.addEventListener("click", () => {
    doClose();
    opts.onClose?.();
  });
  if (!isInline) {
    dom.backdrop.addEventListener("click", () => {
      doClose();
      opts.onClose?.();
    });
  }
  dom.editBtn.addEventListener("click", () => startEdit());
  dom.cancelBtn.addEventListener("click", () => cancelEdit());
  dom.saveBtn.addEventListener("click", () => save());
  function onKeyDown(e) {
    if (!state.isOpen) return;
    if (e.key === "Escape") {
      doClose();
      opts.onClose?.();
      return;
    }
    if (isInline) return;
    if (e.key === "Tab") {
      const focusable = getFocusable(container);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
  }
  function startEdit() {
    state.isEditing = true;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "none";
    dom.saveBtn.style.display = "";
    dom.cancelBtn.style.display = "";
    renderBody2(dom.body, state, opts);
  }
  function cancelEdit() {
    state.isEditing = false;
    state.changes = {};
    state.errors = {};
    dom.editBtn.style.display = "";
    dom.saveBtn.style.display = "none";
    dom.cancelBtn.style.display = "none";
    renderBody2(dom.body, state, opts);
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
    document.removeEventListener("keydown", onKeyDown);
    if (!isInline) {
      const bd = container.previousElementSibling;
      if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
        bd.classList.remove("mn-detail-panel__backdrop--visible");
      }
    }
    if (!isInline && triggerElement) {
      triggerElement.focus();
      triggerElement = null;
    }
  }
  function doOpen() {
    if (!isInline) {
      triggerElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    state.isOpen = true;
    container.classList.add("mn-detail-panel--open");
    document.addEventListener("keydown", onKeyDown);
    if (!isInline) {
      const bd = container.previousElementSibling;
      if (bd && bd.classList.contains("mn-detail-panel__backdrop")) {
        bd.classList.add("mn-detail-panel__backdrop--visible");
      }
      setTimeout(() => {
        const focusable = getFocusable(container);
        if (focusable.length) focusable[0].focus();
      }, 50);
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
      renderBody2(dom.body, state, opts);
    },
    getData: () => ({ ...state.data }),
    setTitle(t) {
      dom.titleEl.textContent = t;
      container.setAttribute("aria-label", t);
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
      renderBody2(dom.body, state, opts);
    },
    render() {
      renderBody2(dom.body, state, opts);
    },
    showToast(msg, type) {
      showToast(container, msg, type);
    },
    destroy() {
      document.removeEventListener("keydown", onKeyDown);
      container.innerHTML = "";
    }
  };
}

// src/ts/a11y-panel-dom.ts
var STORAGE_KEY = "mn-a11y";
var DEFAULTS = {
  fontSize: "md",
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  lineSpacing: "normal",
  dyslexiaFont: false
};
var SIZES = {
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
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
  }
  return { ...DEFAULTS };
}
function saveSettings(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
  }
}
var _dyslexicFontLoaded = false;
function loadDyslexicFont() {
  if (_dyslexicFontLoaded || document.fonts.check("12px OpenDyslexic")) {
    _dyslexicFontLoaded = true;
    return;
  }
  _dyslexicFontLoaded = true;
  const style = document.createElement("style");
  style.textContent = [
    "@font-face{font-family:'OpenDyslexic';font-weight:400;font-display:swap;",
    "src:url('dist/fonts/opendyslexic-regular.woff2') format('woff2'),",
    "url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.woff2') format('woff2')}",
    "@font-face{font-family:'OpenDyslexic';font-weight:700;font-display:swap;",
    "src:url('dist/fonts/opendyslexic-bold.woff2') format('woff2'),",
    "url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Bold.woff2') format('woff2')}"
  ].join("");
  document.head.appendChild(style);
}
function applySettings(settings) {
  const root = document.documentElement;
  const body = document.body;
  const sz = SIZES[settings.fontSize] ?? SIZES.md;
  root.style.fontSize = `${sz.scale * 16}px`;
  root.classList.remove("mn-reduced-motion", "mn-high-contrast");
  body.classList.toggle("mn-a11y-reduced-motion", settings.reducedMotion);
  body.classList.toggle("mn-a11y-high-contrast", settings.highContrast);
  root.classList.toggle("mn-no-focus-ring", !settings.focusVisible);
  if (settings.dyslexiaFont) loadDyslexicFont();
  body.classList.toggle("mn-a11y-dyslexia-font", settings.dyslexiaFont);
  const ls = LINE_SPACINGS[settings.lineSpacing] ?? LINE_SPACINGS.normal;
  if (ls.value === "normal") {
    root.style.removeProperty("--mn-line-height");
    body.style.removeProperty("line-height");
  } else {
    root.style.setProperty("--mn-line-height", ls.value);
    body.style.lineHeight = ls.value;
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
  const loc = getLocale().a11y;
  const fab = createElement("button", "mn-a11y-fab", {
    "aria-label": `${loc.display} settings`,
    title: `${loc.display} settings`
  });
  fab.innerHTML = slidersIcon();
  const panel = createElement("div", "mn-a11y-panel", {
    role: "dialog",
    "aria-label": "Accessibility settings"
  });
  const title = createElement("div", "mn-a11y-panel__title");
  title.innerHTML = `${slidersIcon()} ${loc.display}`;
  panel.appendChild(title);
  const fsGroup = createElement("div", "mn-a11y-panel__group");
  fsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: loc.textSize }));
  const fsRow = createElement("div", "mn-a11y-panel__size-btns");
  const sizeButtons = {};
  for (const key of Object.keys(SIZES)) {
    const btn = createElement("button", "mn-a11y-panel__size-btn", {
      text: SIZES[key].label,
      "aria-label": `Font size ${SIZES[key].label}`
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
  lsGroup.appendChild(createElement("div", "mn-a11y-panel__label", { text: loc.lineSpacing }));
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
  panel.appendChild(makeToggle(settings, loc.dyslexiaFont, "dyslexiaFont"));
  panel.appendChild(makeToggle(settings, loc.reducedMotion, "reducedMotion"));
  panel.appendChild(makeToggle(settings, loc.highContrast, "highContrast"));
  panel.appendChild(makeToggle(settings, loc.focusIndicators, "focusVisible"));
  panel.appendChild(createElement("div", "mn-a11y-panel__divider"));
  const resetBtn = createElement("button", "mn-a11y-panel__reset", { text: loc.resetDefaults });
  panel.appendChild(resetBtn);
  return { fab, panel, sizeButtons, lsButtons, resetBtn };
}

// src/ts/a11y-panel.ts
function a11yPanel() {
  const settings = loadSettings();
  const refs = buildPanel(settings);
  const { fab, panel } = refs;
  refs.resetBtn.addEventListener("click", () => {
    settings.fontSize = DEFAULTS.fontSize;
    settings.reducedMotion = DEFAULTS.reducedMotion;
    settings.highContrast = DEFAULTS.highContrast;
    settings.focusVisible = DEFAULTS.focusVisible;
    settings.lineSpacing = DEFAULTS.lineSpacing;
    settings.dyslexiaFont = DEFAULTS.dyslexiaFont;
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
function initDropdown(el5) {
  const trigger = el5.querySelector(".mn-dropdown__trigger");
  const menu = el5.querySelector(".mn-dropdown__menu");
  const items = el5.querySelectorAll(".mn-dropdown__item");
  if (!trigger) throw new Error("Dropdown: missing .mn-dropdown__trigger");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (menu) menu.setAttribute("role", "listbox");
  items.forEach((item) => {
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", "false");
  });
  function openMenu() {
    el5.classList.add("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "true");
    if (items[0]) items[0].focus();
  }
  function closeMenu() {
    el5.classList.remove("mn-dropdown--open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el5.classList.contains("mn-dropdown--open")) closeMenu();
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
    if (el5.classList.contains("mn-dropdown--open")) closeMenu();
  });
  return { open: openMenu, close: closeMenu };
}
function initTabs(el5) {
  const tabs = el5.querySelectorAll(".mn-tabs__tab");
  const panels = el5.querySelectorAll(".mn-tabs__panel");
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
      if (e.key === "Home") {
        e.preventDefault();
        activate(0);
        tabs[0].focus();
      }
      if (e.key === "End") {
        e.preventDefault();
        activate(tabs.length - 1);
        tabs[tabs.length - 1].focus();
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
function initRotary(el5, options) {
  const opts = {
    steps: ["WET", "COMFORT", "SPORT", "RACE", "ESC OFF"],
    initial: 2,
    snap: true,
    ...options
  };
  const housing = el5.querySelector(".mn-rotary__housing");
  const pointer = el5.querySelector(".mn-rotary__pointer");
  const valueEl = el5.querySelector(".mn-rotary__value");
  if (!housing || !pointer) throw new Error("Rotary: missing .mn-rotary__housing or __pointer");
  let current2 = opts.initial;
  const totalSteps = opts.steps.length;
  const angleRange = 240, startAngle = -120;
  function setStep(idx) {
    idx = clamp(idx, 0, totalSteps - 1);
    current2 = idx;
    const angle = startAngle + idx / (totalSteps - 1) * angleRange;
    pointer.style.transform = `rotate(${angle}deg)`;
    if (valueEl) valueEl.textContent = opts.steps[idx];
    opts.onChange?.(opts.steps[idx], idx);
  }
  setStep(current2);
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
    if (!dragging) setStep((current2 + 1) % totalSteps);
  });
  el5.setAttribute("tabindex", "0");
  el5.setAttribute("role", "slider");
  el5.setAttribute("aria-valuemin", "0");
  el5.setAttribute("aria-valuemax", String(totalSteps - 1));
  el5.setAttribute("aria-valuenow", String(current2));
  el5.setAttribute("aria-valuetext", opts.steps[current2]);
  el5.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setStep(current2 + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setStep(current2 - 1);
    }
    el5.setAttribute("aria-valuenow", String(current2));
    el5.setAttribute("aria-valuetext", opts.steps[current2]);
  });
  return {
    setStep,
    getValue: () => opts.steps[current2],
    destroy: () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
    }
  };
}
function initSlider(el5, options) {
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
  const track = el5.querySelector(".mn-slider__track") ?? el5;
  let fill = el5.querySelector(".mn-slider__fill");
  let thumb = el5.querySelector(".mn-slider__thumb");
  const valueEl = el5.querySelector(".mn-slider__value");
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
  let current2 = opts.value, dragging = false;
  el5.setAttribute("tabindex", "0");
  el5.setAttribute("role", "slider");
  el5.setAttribute("aria-valuemin", String(opts.min));
  el5.setAttribute("aria-valuemax", String(opts.max));
  el5.setAttribute("aria-valuenow", String(current2));
  if (opts.label) el5.setAttribute("aria-label", opts.label);
  function pctFromValue(v) {
    return (v - opts.min) / (opts.max - opts.min) * 100;
  }
  function valueFromPct(pct3) {
    const raw = opts.min + pct3 / 100 * (opts.max - opts.min);
    return Math.round(raw / opts.step) * opts.step;
  }
  function render5() {
    const pct3 = pctFromValue(current2);
    fillEl.style.width = `${pct3}%`;
    thumbEl.style.left = `${pct3}%`;
    if (valueEl) valueEl.textContent = String(current2);
    el5.setAttribute("aria-valuenow", String(current2));
    if (opts.label) el5.setAttribute("aria-valuetext", `${current2}${opts.unit}`);
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
    const pct3 = clamp((clientX - rect.left) / rect.width * 100, 0, 100);
    const newVal = valueFromPct(pct3);
    if (newVal !== current2) {
      current2 = newVal;
      render5();
      opts.onChange?.(current2);
      eventBus.emit("slider-change", { element: el5, value: current2 });
    }
  }
  function onStart(e) {
    e.preventDefault();
    dragging = true;
    el5.classList.add("mn-slider--active");
    setFromX(getPointerX(e));
  }
  function onMove(e) {
    if (!dragging) return;
    setFromX(getPointerX(e));
  }
  function onEnd() {
    dragging = false;
    el5.classList.remove("mn-slider--active");
  }
  track.addEventListener("mousedown", onStart);
  track.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
  el5.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      current2 = Math.min(opts.max, current2 + opts.step);
      render5();
      opts.onChange?.(current2);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      current2 = Math.max(opts.min, current2 - opts.step);
      render5();
      opts.onChange?.(current2);
    }
  });
  render5();
  return {
    getValue: () => current2,
    setValue: (v) => {
      current2 = clamp(v, opts.min, opts.max);
      render5();
    }
  };
}

// src/ts/map-view-events.ts
function showTip2(m, els, padding, viewState) {
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
function hideTip2(tip) {
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
    hideTip2(tipEls.tip);
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
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
    if (m) {
      state.hovered = m.id;
      canvas.style.cursor = "pointer";
      showTip2(m, tipEls, state.padding, state.viewState);
    } else {
      state.hovered = null;
      canvas.style.cursor = state.enablePan ? "grab" : "default";
      hideTip2(tipEls.tip);
    }
  });
  canvas.addEventListener("mouseleave", () => {
    state.hovered = null;
    if (!state.isDragging) {
      canvas.style.cursor = state.enablePan ? "grab" : "default";
    }
    hideTip2(tipEls.tip);
  });
  canvas.addEventListener("click", (e) => {
    if (state.isDragging) return;
    const m = hitTest(e.clientX, e.clientY, canvas, state.renderedMarkers);
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
  if (!target) {
    console.warn("[Maranello] gridLayout: container not found");
    return null;
  }
  const host = target;
  const opts = { gap: "", padding: "", animate: true, ...options };
  let current2 = template;
  host.classList.add("mn-grid-template");
  if (opts.gap) host.style.gap = opts.gap;
  if (opts.padding) host.style.padding = opts.padding;
  function applyTemplate(name) {
    TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    host.classList.add(CLASS_PREFIX + name);
    current2 = name;
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
  applyTemplate(current2);
  return {
    setTemplate: applyTemplate,
    getTemplate: () => current2,
    destroy: () => {
      host.classList.remove("mn-grid-template");
      TEMPLATES.forEach((item) => host.classList.remove(CLASS_PREFIX + item));
    }
  };
}

// src/ts/layout-slot.ts
var SlotState = class {
  constructor(domId, initial, panelId) {
    this.domId = domId;
    this.viewDriven = false;
    this.manualRender = null;
    this.locked = false;
    this.visible = initial;
    this.saved = initial;
    this.panelId = panelId;
  }
  /** Write hidden to DOM. */
  sync() {
    const el5 = document.getElementById(this.domId);
    if (el5 && el5.hidden !== !this.visible) el5.hidden = !this.visible;
  }
  /** Save state before fullpage. */
  save() {
    this.saved = this.visible;
  }
  /** Restore state after fullpage. */
  restore() {
    this.visible = this.saved;
  }
  /** Apply view config: undefined = don't touch (close if view-driven), false = close, object = open + render. */
  applyConfig(cfg) {
    if (cfg === void 0) {
      if (this.viewDriven) {
        this.visible = false;
        this.viewDriven = false;
      }
      return;
    }
    if (cfg === false) {
      this.visible = false;
      this.viewDriven = false;
      this.panelId = void 0;
      this.locked = true;
      return;
    }
    this.visible = true;
    this.viewDriven = true;
    this.locked = false;
    if (cfg.id) this.panelId = cfg.id;
    if (cfg.render) this.render(cfg.render);
  }
  /** Toggle visibility (manual). Returns false if blocked. */
  toggle(config) {
    if (this.locked) return false;
    this.visible = !this.visible;
    this.viewDriven = false;
    if (config && config.id) this.panelId = config.id;
    if (config && config.render) this.manualRender = config.render;
    this.sync();
    if (this.visible) {
      const fn = config && config.render || this.manualRender;
      if (fn) this.render(fn);
    }
    return true;
  }
  /** Open slot (manual). Returns false if blocked. */
  open(config) {
    if (this.locked) return false;
    this.visible = true;
    this.viewDriven = false;
    if (config && config.render) this.manualRender = config.render;
    this.sync();
    const fn = config && config.render || this.manualRender;
    if (fn) this.render(fn);
    return true;
  }
  /** Close slot. */
  close() {
    this.visible = false;
    this.viewDriven = false;
    this.sync();
  }
  /** Call render on DOM element. */
  render(fn) {
    const el5 = document.getElementById(this.domId);
    if (el5) fn(el5);
  }
};

// src/ts/layout.ts
function initVisible(domId, init, key, fallback) {
  if (init && typeof init[key] === "boolean") return init[key];
  const el5 = document.getElementById(domId);
  return el5 ? !el5.hidden : fallback;
}
function createLayout(gridEl, options) {
  const maybeGrid = gridEl ?? document.getElementById("mn-grid");
  if (!maybeGrid) throw new Error("createLayout: grid element not found");
  const grid = maybeGrid;
  const onChange = options && options.onStateChange;
  const init = options && options.initialState;
  const views = /* @__PURE__ */ new Map();
  const btnCleanups = [];
  const strip = new SlotState("mn-slot-strip", initVisible("mn-slot-strip", init, "strip", true), init && init.stripPanelId);
  const left = new SlotState("mn-slot-left", initVisible("mn-slot-left", init, "left", false), init && init.leftPanelId);
  const right = new SlotState("mn-slot-right", initVisible("mn-slot-right", init, "right", false), init && init.rightPanelId);
  const state = {
    view: init && init.view ? init.view : "",
    fullpage: false,
    strip: strip.visible,
    left: left.visible,
    right: right.visible
  };
  if (init) {
    strip.sync();
    left.sync();
    right.sync();
  }
  function syncState() {
    state.strip = strip.visible;
    state.left = left.visible;
    state.right = right.visible;
  }
  function persistState() {
    const s = { view: state.view, strip: state.strip, left: state.left, right: state.right };
    if (left.panelId) s.leftPanelId = left.panelId;
    if (right.panelId) s.rightPanelId = right.panelId;
    if (strip.panelId) s.stripPanelId = strip.panelId;
    return s;
  }
  function fireEvent() {
    grid.dispatchEvent(new CustomEvent("layout-changed", { detail: { ...state }, bubbles: true }));
    if (onChange) onChange(persistState());
  }
  function syncCenter() {
    const center = document.getElementById("mn-slot-center");
    if (center && state.view) {
      const children = center.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.dataset && "view" in child.dataset) {
          child.hidden = child.dataset.view !== state.view;
        }
      }
    }
  }
  const ctrl = {
    register(viewId, config) {
      views.set(viewId, config);
    },
    showView(viewId) {
      const config = views.get(viewId);
      if (!config) throw new Error(`createLayout.showView: unknown view "${viewId}"`);
      if (state.fullpage && !config.fullpage) {
        strip.restore();
        left.restore();
        right.restore();
        strip.sync();
      }
      if (!state.fullpage && config.fullpage) {
        strip.save();
        left.save();
        right.save();
      }
      state.view = viewId;
      if (config.fullpage) {
        state.fullpage = true;
        strip.visible = false;
        left.visible = false;
        right.visible = false;
        left.sync();
        right.sync();
        const el5 = document.getElementById("mn-slot-strip");
        if (el5) el5.hidden = true;
        grid.classList.add("mn-layout--fullpage");
      } else {
        state.fullpage = false;
        grid.classList.remove("mn-layout--fullpage");
        left.applyConfig(config.left);
        right.applyConfig(config.right);
        left.sync();
        right.sync();
      }
      syncState();
      syncCenter();
      fireEvent();
      if (config.center) {
        const center = document.getElementById("mn-slot-center");
        if (center) config.center(center);
      }
    },
    toggleStrip(config) {
      if (state.fullpage) return;
      strip.toggle(config);
      syncState();
      fireEvent();
    },
    toggleLeft(config) {
      if (state.fullpage || left.locked) return;
      left.toggle(config);
      syncState();
      fireEvent();
    },
    toggleRight(config) {
      if (state.fullpage || right.locked) return;
      right.toggle(config);
      syncState();
      fireEvent();
    },
    openRight(config) {
      if (state.fullpage || right.locked) return;
      right.open(config);
      syncState();
      fireEvent();
    },
    closeRight() {
      right.close();
      syncState();
      fireEvent();
    },
    wireButtons() {
      for (const [viewId, config] of views) {
        if (!config.buttonId) continue;
        const btn = document.getElementById(config.buttonId);
        if (!btn) continue;
        const handler = () => {
          ctrl.showView(viewId);
        };
        btn.addEventListener("click", handler);
        btnCleanups.push(() => btn.removeEventListener("click", handler));
      }
    },
    get state() {
      return Object.freeze({ ...state });
    },
    destroy() {
      for (const fn of btnCleanups) fn();
      btnCleanups.length = 0;
      views.clear();
    }
  };
  return ctrl;
}

// src/ts/search-drawer.ts
var drawerCounter = 0;
function openSearchDrawer(opts) {
  const {
    title,
    onSearch,
    onResultClick,
    placeholder = "Search...",
    sections = []
  } = opts;
  drawerCounter++;
  const drawerId = `mn-search-drawer-${drawerCounter}`;
  const backdrop2 = document.createElement("div");
  backdrop2.className = "mn-drawer__backdrop";
  document.body.appendChild(backdrop2);
  const drawer = document.createElement("div");
  drawer.id = drawerId;
  drawer.className = "mn-drawer mn-drawer--right";
  document.body.appendChild(drawer);
  const content = document.createElement("div");
  content.className = "mn-search-drawer";
  const heading = document.createElement("h2");
  heading.textContent = title;
  content.appendChild(heading);
  const searchWrap = document.createElement("div");
  searchWrap.className = "mn-search-drawer__search";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.className = "mn-input";
  searchInput.placeholder = placeholder;
  searchInput.setAttribute("aria-label", placeholder);
  searchWrap.appendChild(searchInput);
  content.appendChild(searchWrap);
  const loadingEl = document.createElement("div");
  loadingEl.className = "mn-search-drawer__loading";
  loadingEl.textContent = "Searching...";
  loadingEl.style.display = "none";
  content.appendChild(loadingEl);
  const resultsEl = document.createElement("div");
  resultsEl.className = "mn-search-drawer__results";
  resultsEl.setAttribute("role", "listbox");
  content.appendChild(resultsEl);
  const emptyEl = document.createElement("div");
  emptyEl.className = "mn-search-drawer__empty";
  emptyEl.textContent = "No results";
  emptyEl.style.display = "none";
  content.appendChild(emptyEl);
  for (const section of sections) {
    const sectionEl = document.createElement("div");
    sectionEl.className = "mn-search-drawer__section";
    const label = document.createElement("div");
    label.className = "mn-search-drawer__section-label";
    label.textContent = section.label;
    sectionEl.appendChild(label);
    const body = document.createElement("div");
    section.renderer(body);
    sectionEl.appendChild(body);
    content.appendChild(sectionEl);
  }
  drawer.appendChild(content);
  openDrawer(drawerId);
  function renderResults(results) {
    resultsEl.innerHTML = "";
    emptyEl.style.display = results.length === 0 ? "" : "none";
    for (const result of results) {
      const item = document.createElement("div");
      item.className = "mn-search-drawer__item";
      item.setAttribute("role", "option");
      const titleSpan = document.createElement("div");
      titleSpan.className = "mn-search-drawer__item-title";
      titleSpan.textContent = result.title;
      item.appendChild(titleSpan);
      if (result.subtitle) {
        const sub = document.createElement("div");
        sub.className = "mn-search-drawer__item-sub";
        sub.textContent = result.subtitle;
        item.appendChild(sub);
      }
      if (result.badge) {
        const badge = document.createElement("span");
        badge.className = "mn-badge";
        badge.textContent = result.badge;
        if (result.badgeColor && isValidColor(result.badgeColor)) badge.style.backgroundColor = result.badgeColor;
        item.appendChild(badge);
      }
      item.addEventListener("click", () => onResultClick(result));
      resultsEl.appendChild(item);
    }
  }
  const doSearch = debounce(async () => {
    const query = searchInput.value.trim();
    if (!query) {
      resultsEl.innerHTML = "";
      emptyEl.style.display = "none";
      loadingEl.style.display = "none";
      return;
    }
    loadingEl.style.display = "";
    try {
      const results = await onSearch(query);
      loadingEl.style.display = "none";
      renderResults(results);
    } catch {
      loadingEl.style.display = "none";
      resultsEl.innerHTML = "";
      emptyEl.style.display = "";
    }
  }, 300);
  searchInput.addEventListener("input", () => {
    doSearch();
  });
  function cleanup() {
    closeDrawer(drawerId);
    setTimeout(() => {
      backdrop2.remove();
      drawer.remove();
    }, 300);
  }
  return {
    close: cleanup,
    setResults: renderResults,
    setLoading: (loading) => {
      loadingEl.style.display = loading ? "" : "none";
    }
  };
}

// src/ts/activity-feed.ts
function buildItemNode(item, animate) {
  const type = item.type ?? "default";
  const row = document.createElement("div");
  row.className = `mn-feed__item mn-feed__item--${type}`;
  row.dataset.id = item.id;
  const indicator = document.createElement("div");
  indicator.className = "mn-feed__indicator";
  row.appendChild(indicator);
  if (item.icon) {
    const iconEl = document.createElement("div");
    iconEl.className = "mn-feed__icon";
    iconEl.innerHTML = item.icon;
    row.appendChild(iconEl);
  }
  const content = document.createElement("div");
  content.className = "mn-feed__content";
  const titleEl = document.createElement("div");
  titleEl.className = "mn-feed__title";
  titleEl.textContent = escapeHtml(item.title);
  content.appendChild(titleEl);
  if (item.body) {
    const bodyEl = document.createElement("div");
    bodyEl.className = "mn-feed__body";
    bodyEl.textContent = escapeHtml(item.body);
    content.appendChild(bodyEl);
  }
  if (item.meta) {
    const metaEl = document.createElement("div");
    metaEl.className = "mn-feed__meta";
    metaEl.textContent = escapeHtml(item.meta);
    content.appendChild(metaEl);
  }
  row.appendChild(content);
  if (animate) {
    row.classList.add("mn-feed__item--entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        row.classList.remove("mn-feed__item--entering");
      });
    });
  }
  return row;
}
function enforceMax(el5, items, maxItems) {
  if (maxItems === void 0 || maxItems <= 0) return;
  while (items.length > maxItems) {
    items.pop();
    const last = el5.lastElementChild;
    if (last) last.remove();
  }
}
function enforceMaxPrepend(el5, items, maxItems) {
  if (maxItems === void 0 || maxItems <= 0) return;
  while (items.length > maxItems) {
    items.pop();
    const last = el5.lastElementChild;
    if (last) last.remove();
  }
}
function activityFeed(el5, items, opts) {
  const animate = opts?.animate !== false;
  const maxItems = opts?.maxItems;
  const internal = [];
  el5.classList.add("mn-feed");
  el5.setAttribute("role", "feed");
  el5.setAttribute("aria-label", "Activity feed");
  el5.innerHTML = "";
  if (items) {
    for (const item of items) {
      internal.push(item);
      el5.appendChild(buildItemNode(item, false));
    }
    enforceMax(el5, internal, maxItems);
  }
  const controller = {
    /** Append item to the bottom of the feed. */
    add(item) {
      internal.push(item);
      el5.appendChild(buildItemNode(item, animate));
      enforceMax(el5, internal, maxItems);
    },
    /** Insert item at the top of the feed. */
    prepend(item) {
      internal.unshift(item);
      const node = buildItemNode(item, animate);
      if (el5.firstChild) {
        el5.insertBefore(node, el5.firstChild);
      } else {
        el5.appendChild(node);
      }
      enforceMaxPrepend(el5, internal, maxItems);
    },
    /** Remove all items from the feed. */
    clear() {
      internal.length = 0;
      el5.innerHTML = "";
    },
    /** Tear down the feed and restore the container. */
    destroy() {
      internal.length = 0;
      el5.classList.remove("mn-feed");
      el5.innerHTML = "";
    }
  };
  return controller;
}

// src/ts/date-range-picker.ts
var MONTHS2 = [
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
var DAYS2 = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
var SHORT_M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function todayISO() {
  const d = /* @__PURE__ */ new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}
function formatDisplay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${SHORT_M[m - 1]} ${y}`;
}
function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function mondayIdx(date) {
  return (date.getDay() + 6) % 7;
}
function dateRangePicker(el5, opts) {
  const o = opts ?? {};
  let range = { from: o.value?.from ?? null, to: o.value?.to ?? null };
  let viewYear, viewMonth;
  let popup = null;
  let picking = false;
  const now = /* @__PURE__ */ new Date();
  if (range.from) {
    const d = parseISO(range.from);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
  } else {
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "mn-drp__trigger mn-input";
  el5.appendChild(trigger);
  updateLabel();
  function updateLabel() {
    if (range.from && range.to) {
      trigger.textContent = `${formatDisplay(range.from)} \u2013 ${formatDisplay(range.to)}`;
    } else if (range.from) {
      trigger.textContent = `${formatDisplay(range.from)} \u2013 \u2026`;
    } else {
      trigger.textContent = o.placeholder ?? "Select date range\u2026";
    }
  }
  function isDisabled(iso) {
    return !!o.min && iso < o.min || !!o.max && iso > o.max;
  }
  function buildCalendar() {
    if (!popup) return;
    const grid = popup.querySelector(".mn-drp__grid");
    const lbl = popup.querySelector(".mn-drp__month-label");
    lbl.textContent = `${MONTHS2[viewMonth]} ${viewYear}`;
    grid.innerHTML = "";
    for (const dn of DAYS2) {
      const h = document.createElement("div");
      h.className = "mn-drp__day-name";
      h.textContent = dn;
      grid.appendChild(h);
    }
    const offset = mondayIdx(new Date(viewYear, viewMonth, 1));
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    const today = todayISO();
    for (let i = 0; i < offset; i++) {
      const e = document.createElement("div");
      e.className = "mn-drp__day mn-drp__day--empty";
      grid.appendChild(e);
    }
    for (let d = 1; d <= total; d++) {
      const iso = toISO(viewYear, viewMonth, d);
      const cell = document.createElement("div");
      cell.className = "mn-drp__day";
      cell.textContent = String(d);
      cell.dataset.date = iso;
      if (iso === today) cell.classList.add("mn-drp__day--today");
      if (isDisabled(iso)) cell.classList.add("mn-drp__day--disabled");
      if (range.from && (iso === range.from || iso === range.to)) {
        cell.classList.add("mn-drp__day--selected");
      }
      if (range.from && range.to && iso > range.from && iso < range.to) {
        cell.classList.add("mn-drp__day--in-range");
      }
      grid.appendChild(cell);
    }
  }
  function positionPopup() {
    if (!popup) return;
    const r = el5.getBoundingClientRect();
    popup.style.top = `${r.bottom + 4}px`;
    popup.style.left = `${r.left}px`;
  }
  function onGridClick(e) {
    const t = e.target;
    if (!t.dataset.date || t.classList.contains("mn-drp__day--disabled")) return;
    const iso = t.dataset.date;
    if (!picking || !range.from) {
      range = { from: iso, to: null };
      picking = true;
      buildCalendar();
      updateLabel();
      return;
    }
    if (iso < range.from) {
      range = { from: iso, to: null };
      buildCalendar();
      updateLabel();
      return;
    }
    range.to = iso;
    picking = false;
    updateLabel();
    closePopup();
    o.onChange?.(range);
  }
  function onKeydown(e) {
    if (e.key === "Escape") closePopup();
  }
  function onClickOutside(e) {
    if (!popup) return;
    const t = e.target;
    if (popup.contains(t) || el5.contains(t)) return;
    closePopup();
  }
  function openPopup() {
    if (popup) return;
    popup = document.createElement("div");
    popup.className = "mn-drp__popup";
    popup.innerHTML = '<div class="mn-drp__header"><button type="button" class="mn-drp__nav mn-drp__nav--prev">\u2039</button><span class="mn-drp__month-label"></span><button type="button" class="mn-drp__nav mn-drp__nav--next">\u203A</button></div><div class="mn-drp__grid"></div>';
    document.body.appendChild(popup);
    positionPopup();
    buildCalendar();
    popup.querySelector(".mn-drp__nav--prev").addEventListener("click", () => {
      if (--viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      buildCalendar();
    });
    popup.querySelector(".mn-drp__nav--next").addEventListener("click", () => {
      if (++viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      buildCalendar();
    });
    popup.querySelector(".mn-drp__grid").addEventListener("click", onGridClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("scroll", positionPopup, true);
    window.addEventListener("resize", positionPopup);
  }
  function closePopup() {
    if (!popup) return;
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("mousedown", onClickOutside);
    window.removeEventListener("scroll", positionPopup, true);
    window.removeEventListener("resize", positionPopup);
    popup.remove();
    popup = null;
  }
  trigger.addEventListener("click", () => {
    popup ? closePopup() : openPopup();
  });
  return {
    getValue: () => ({ ...range }),
    setValue(r) {
      range = { from: r.from, to: r.to };
      picking = false;
      if (range.from) {
        const d = parseISO(range.from);
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
      }
      updateLabel();
      if (popup) buildCalendar();
    },
    open: openPopup,
    close: closePopup,
    destroy() {
      closePopup();
      trigger.remove();
    }
  };
}

// src/ts/charts-bullet.ts
function resolve(varName) {
  const el5 = document.body ?? document.documentElement;
  return getComputedStyle(el5).getPropertyValue(varName).trim() || "#888";
}
function parseColor(color) {
  if (color.startsWith("var(")) {
    const name = color.slice(4, color.indexOf(")")).split(",")[0].trim();
    return resolve(name);
  }
  return color;
}
function hexToRgb(hex) {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function colorAt(hex, alpha2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(128,128,128,${alpha2})`;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha2})`;
}
function easeOut(t) {
  return 1 - (1 - t) ** 3;
}
function bulletChart(canvas, opts) {
  const dpr = window.devicePixelRatio || 1;
  const trackH = opts.height ?? 32;
  const labelH = opts.label ? 18 : 0;
  const totalH = trackH + labelH + 4;
  const logicalW = canvas.parentElement ? canvas.parentElement.getBoundingClientRect().width - 4 : canvas.offsetWidth || 400;
  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(totalH * dpr);
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${totalH}px`;
  canvas.setAttribute("role", "img");
  const pct3 = opts.max > 0 ? Math.round(opts.value / opts.max * 100) : 0;
  canvas.setAttribute(
    "aria-label",
    `${opts.label ?? "Bullet chart"}: value ${opts.value}${opts.unit ?? ""}, target ${opts.target}${opts.unit ?? ""} (${pct3}% of max)`
  );
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const rightPad = 52;
  const trackW = logicalW - rightPad;
  const trackY = labelH + 2;
  const borderHex = parseColor("var(--mn-border)");
  const accentHex = parseColor("var(--mn-accent)");
  const textHex = parseColor("var(--mn-text)");
  const mutedHex = parseColor("var(--mn-text-muted)");
  const bands = opts.ranges ?? [
    { max: opts.max * 0.4, color: colorAt(borderHex, 0.45) },
    { max: opts.max * 0.7, color: colorAt(borderHex, 0.28) },
    { max: opts.max, color: colorAt(borderHex, 0.14) }
  ];
  function draw(currentValue) {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, totalH);
    if (opts.label) {
      ctx.font = `11px system-ui,sans-serif`;
      ctx.fillStyle = mutedHex;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillText(opts.label, 0, 0);
    }
    const sortedBands = [...bands].sort((a, b) => b.max - a.max);
    for (const band of sortedBands) {
      const bw = Math.min(band.max / opts.max * trackW, trackW);
      const color = typeof band.color === "string" && band.color.startsWith("rgba") ? band.color : colorAt(parseColor(band.color ?? "var(--mn-border)"), 0.3);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, trackY, bw, trackH, 3);
      ctx.fill();
    }
    const valBarH = Math.round(trackH * 0.44);
    const valBarY = trackY + Math.round((trackH - valBarH) / 2);
    const valW = Math.max(2, Math.min(currentValue / opts.max * trackW, trackW));
    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.roundRect(0, valBarY, valW, valBarH, 2);
    ctx.fill();
    const targetX = Math.round(opts.target / opts.max * trackW);
    ctx.fillStyle = textHex;
    ctx.fillRect(targetX - 1, trackY, 3, trackH);
    const displayVal = Number.isInteger(opts.value) ? Math.round(currentValue) : currentValue.toFixed(1);
    const label = `${displayVal}${opts.unit ?? ""}`;
    ctx.font = `bold 11px system-ui,sans-serif`;
    ctx.fillStyle = textHex;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(label, trackW + 6, trackY + trackH / 2);
    const targetLabel = `${opts.target}${opts.unit ?? ""}`;
    ctx.font = `9px system-ui,sans-serif`;
    ctx.fillStyle = mutedHex;
    ctx.textAlign = "center";
    ctx.fillText(targetLabel, targetX, trackY + trackH + 2);
  }
  if (opts.animate === false) {
    draw(opts.value);
    return;
  }
  let start = null;
  function frame(ts) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / 600, 1);
    draw(easeOut(p) * opts.value);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// src/ts/notification-center.ts
function buildItem2(n, onRemove, onAction) {
  const el5 = document.createElement("div");
  const typeCls = `mn-notif-item--${n.type ?? "default"}`;
  const unreadCls = n.read ? "" : " mn-notif-item--unread";
  el5.className = `mn-notif-item ${typeCls}${unreadCls}`;
  el5.dataset.notifId = n.id;
  const dot = `<span class="mn-notif-item__dot mn-notif-item__dot--${n.type ?? "default"}"></span>`;
  const title = `<span class="mn-notif-item__title">${escapeHtml(n.title)}</span>`;
  const body = n.body ? `<span class="mn-notif-item__body">${escapeHtml(n.body)}</span>` : "";
  const meta = n.timestamp ? `<span class="mn-notif-item__meta">${escapeHtml(n.timestamp)}</span>` : "";
  const action = n.action ? `<button class="mn-notif-item__action">${escapeHtml(n.action.label)}</button>` : "";
  const remove = '<button class="mn-notif-item__remove" aria-label="Remove">&times;</button>';
  el5.innerHTML = `${dot}<div class="mn-notif-item__content">${title}${body}${meta}${action}</div>${remove}`;
  el5.querySelector(".mn-notif-item__remove")?.addEventListener("click", (e) => {
    e.stopPropagation();
    onRemove(n.id);
  });
  if (n.action) {
    el5.querySelector(".mn-notif-item__action")?.addEventListener("click", (e) => {
      e.stopPropagation();
      n.action?.onClick();
    });
  }
  el5.addEventListener("click", () => {
    n.read = true;
    el5.classList.remove("mn-notif-item--unread");
    onAction?.(n);
  });
  return el5;
}
function notificationCenter(triggerEl, opts) {
  const maxVisible = opts?.maxVisible ?? 50;
  const position = opts?.position ?? "right";
  const notifications = [];
  const panel = document.createElement("div");
  const posCls = position === "left" ? " mn-notif-panel--left" : "";
  panel.className = `mn-notif-panel${posCls}`;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Notifications");
  const header2 = document.createElement("div");
  header2.className = "mn-notif-panel__header";
  header2.innerHTML = '<span class="mn-notif-panel__title">Notifications <span class="mn-notif-panel__badge">0</span></span><button class="mn-notif-panel__mark-all">Mark all read</button>';
  const list = document.createElement("div");
  list.className = "mn-notif-panel__list";
  const empty = document.createElement("div");
  empty.className = "mn-notif-panel__empty";
  empty.textContent = "No notifications";
  const backdrop2 = document.createElement("div");
  backdrop2.className = "mn-notif-backdrop";
  panel.appendChild(header2);
  panel.appendChild(list);
  panel.appendChild(empty);
  document.body.appendChild(panel);
  document.body.appendChild(backdrop2);
  const badge = header2.querySelector(".mn-notif-panel__badge");
  const markAllBtn = header2.querySelector(".mn-notif-panel__mark-all");
  function getUnreadCount() {
    return notifications.filter((n) => !n.read).length;
  }
  function updateBadge() {
    const count = getUnreadCount();
    badge.textContent = String(count);
    badge.style.display = count > 0 ? "" : "none";
    triggerEl.dataset.unreadCount = String(count);
    triggerEl.classList.toggle("mn-notif-trigger--has-unread", count > 0);
  }
  function updateEmpty() {
    empty.style.display = notifications.length === 0 ? "" : "none";
  }
  function removeItem(id) {
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx === -1) return;
    notifications.splice(idx, 1);
    list.querySelector(`[data-notif-id="${id}"]`)?.remove();
    updateBadge();
    updateEmpty();
  }
  function renderAll() {
    list.innerHTML = "";
    for (const n of notifications) {
      list.appendChild(buildItem2(n, removeItem, opts?.onAction));
    }
    updateBadge();
    updateEmpty();
  }
  let isOpen = false;
  function openPanel() {
    isOpen = true;
    panel.classList.add("mn-notif-panel--open");
    backdrop2.style.display = "block";
  }
  function closePanel() {
    isOpen = false;
    panel.classList.remove("mn-notif-panel--open");
    backdrop2.style.display = "none";
  }
  function togglePanel() {
    isOpen ? closePanel() : openPanel();
  }
  const onTriggerClick = () => togglePanel();
  triggerEl.addEventListener("click", onTriggerClick);
  const onKeydown = (e) => {
    if (e.key === "Escape" && isOpen) closePanel();
  };
  document.addEventListener("keydown", onKeydown);
  const onBackdropClick = () => closePanel();
  backdrop2.addEventListener("click", onBackdropClick);
  markAllBtn.addEventListener("click", () => {
    for (const n of notifications) n.read = true;
    list.querySelectorAll(".mn-notif-item--unread").forEach(
      (el5) => el5.classList.remove("mn-notif-item--unread")
    );
    updateBadge();
  });
  renderAll();
  return {
    add(n) {
      notifications.unshift(n);
      if (notifications.length > maxVisible) {
        const removed = notifications.pop();
        if (removed) {
          list.querySelector(`[data-notif-id="${removed.id}"]`)?.remove();
        }
      }
      const el5 = buildItem2(n, removeItem, opts?.onAction);
      list.prepend(el5);
      updateBadge();
      updateEmpty();
    },
    markRead(id) {
      const n = notifications.find((x) => x.id === id);
      if (!n) return;
      n.read = true;
      list.querySelector(`[data-notif-id="${id}"]`)?.classList.remove("mn-notif-item--unread");
      updateBadge();
    },
    markAllRead() {
      for (const n of notifications) n.read = true;
      list.querySelectorAll(".mn-notif-item--unread").forEach(
        (el5) => el5.classList.remove("mn-notif-item--unread")
      );
      updateBadge();
    },
    remove: removeItem,
    clear() {
      notifications.length = 0;
      list.innerHTML = "";
      updateBadge();
      updateEmpty();
    },
    getUnreadCount,
    open: openPanel,
    close: closePanel,
    toggle: togglePanel,
    destroy() {
      triggerEl.removeEventListener("click", onTriggerClick);
      document.removeEventListener("keydown", onKeydown);
      backdrop2.removeEventListener("click", onBackdropClick);
      panel.remove();
      backdrop2.remove();
      triggerEl.classList.remove("mn-notif-trigger--has-unread");
      delete triggerEl.dataset.unreadCount;
    }
  };
}

// src/ts/charts-waterfall.ts
function resolveCssVar(name, fallback) {
  const el5 = document.body ?? document.documentElement;
  const v = getComputedStyle(el5).getPropertyValue(name).trim();
  return v || fallback;
}
function easeOutCubic2(t) {
  return 1 - Math.pow(1 - t, 3);
}
function hexToRgba3(hex, alpha2) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha2})`;
}
function injectSrTable(canvas, caption, headers, rows) {
  if (!canvas.parentElement) return;
  let srEl = canvas.nextElementSibling;
  if (!srEl || !srEl.classList.contains("mn-sr-only")) {
    srEl = document.createElement("span");
    srEl.className = "mn-sr-only";
    canvas.parentElement.insertBefore(srEl, canvas.nextSibling);
  }
  const th = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join("");
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("");
  srEl.innerHTML = `<table><caption>${escapeHtml(caption)}</caption><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
}
function waterfallChart(canvas, opts) {
  const dpr = window.devicePixelRatio || 1;
  const segments = opts.segments;
  if (!segments || segments.length === 0) return;
  const logicalW = canvas.offsetWidth || 600;
  const logicalH = opts.height ?? 200;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const colorUp = resolveCssVar("--signal-ok", "#00A651");
  const colorDown = resolveCssVar("--signal-danger", "#DC0000");
  const colorAccent = resolveCssVar("--mn-accent", "#FFC72C");
  const colorBorder = resolveCssVar("--mn-border", "#555555");
  const colorMuted = resolveCssVar("--mn-text-muted", "#999999");
  const totals = [];
  let running = 0;
  for (const seg of segments) {
    if (seg.isTotal) {
      running = seg.value;
    } else {
      running += seg.value;
    }
    totals.push(running);
  }
  const allVals = [0, ...totals];
  segments.forEach((s, i) => {
    if (!s.isTotal && i > 0) allVals.push(totals[i] - s.value);
  });
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;
  const pad2 = { top: 24, bottom: 30, left: 52, right: 12 };
  const chartW = logicalW - pad2.left - pad2.right;
  const chartH = logicalH - pad2.top - pad2.bottom;
  const n = segments.length;
  const barGap = chartW * 0.15 / n;
  const barW = (chartW - barGap * (n + 1)) / n;
  const yScale = (v) => pad2.top + chartH - (v - minVal) / range * chartH;
  const xBar = (i) => pad2.left + barGap + i * (barW + barGap);
  const animate = opts.animate !== false;
  const duration = 600;
  let hoverIdx = -1;
  function drawBars(progress) {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, logicalH);
    const gridCount = 5;
    ctx.font = "9px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 0.5;
    for (let g = 0; g <= gridCount; g++) {
      const v = minVal + range / gridCount * g;
      const yy = yScale(v);
      ctx.strokeStyle = hexToRgba3(colorBorder, 0.2);
      ctx.beginPath();
      ctx.moveTo(pad2.left, yy);
      ctx.lineTo(logicalW - pad2.right, yy);
      ctx.stroke();
      const abs = Math.abs(v);
      const lbl = abs >= 1e6 ? (v / 1e6).toFixed(1) + "M" : abs >= 1e3 ? (v / 1e3).toFixed(1) + "k" : String(Math.round(v));
      ctx.fillStyle = colorMuted;
      ctx.fillText(lbl, pad2.left - 4, yy);
    }
    ctx.setLineDash([]);
    const zeroY = yScale(0);
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad2.left, zeroY);
    ctx.lineTo(logicalW - pad2.right, zeroY);
    ctx.stroke();
    let prevTop = 0;
    for (let i = 0; i < n; i++) {
      const seg = segments[i];
      const base = seg.isTotal ? 0 : i === 0 ? 0 : totals[i] - seg.value;
      const top = totals[i];
      const fullBarBottom = yScale(base);
      const fullBarTop = yScale(top);
      const barHeight = fullBarBottom - fullBarTop;
      const animH = barHeight * progress;
      const drawTop = fullBarBottom - animH;
      const x = xBar(i);
      let barColor;
      if (seg.isTotal) {
        barColor = colorAccent;
      } else if (seg.value >= 0) {
        barColor = colorUp;
      } else {
        barColor = colorDown;
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = barColor;
      ctx.fillRect(x, drawTop, barW, animH);
      ctx.globalAlpha = 1;
      if (i === hoverIdx) {
        ctx.save();
        ctx.shadowColor = barColor;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, drawTop, barW, animH);
        ctx.restore();
      }
      if (i > 0 && !seg.isTotal) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = colorBorder;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(xBar(i - 1) + barW, yScale(totals[i - 1]));
        ctx.lineTo(x, fullBarBottom);
        ctx.stroke();
        ctx.restore();
      }
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = seg.value >= 0 || seg.isTotal ? "bottom" : "top";
      ctx.fillStyle = colorMuted;
      const valStr = (seg.value >= 0 && !seg.isTotal ? "+" : "") + seg.value + (opts.unit ?? "");
      const labelY = seg.value >= 0 || seg.isTotal ? drawTop - 3 : drawTop + animH + 12;
      ctx.fillText(valStr, x + barW / 2, labelY);
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillStyle = colorMuted;
      ctx.textBaseline = "top";
      ctx.fillText(seg.label, x + barW / 2, logicalH - pad2.bottom + 6);
      prevTop = top;
    }
  }
  if (!animate) {
    drawBars(1);
  } else {
    let frame2 = function(ts) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      drawBars(easeOutCubic2(p));
      if (p < 1) requestAnimationFrame(frame2);
    };
    var frame = frame2;
    let start = null;
    requestAnimationFrame(frame2);
  }
  const ariaLabel = `Waterfall chart: ${segments.map((s) => s.label + " " + s.value).join(", ")}`;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", ariaLabel);
  const rows = segments.map((s, i) => [
    s.label,
    String(s.value),
    String(totals[i])
  ]);
  injectSrTable(canvas, ariaLabel, ["Segment", "Value", "Running Total"], rows);
  canvas.style.cursor = "crosshair";
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (logicalW / rect.width);
    let found = -1;
    for (let i = 0; i < n; i++) {
      const bx = xBar(i);
      if (mx >= bx && mx <= bx + barW) {
        found = i;
        break;
      }
    }
    if (found !== hoverIdx) {
      hoverIdx = found;
      drawBars(1);
    }
  });
  canvas.addEventListener("mouseleave", () => {
    if (hoverIdx >= 0) {
      hoverIdx = -1;
      drawBars(1);
    }
  });
}

// src/ts/charts-confidence.ts
function resolveCssVar2(name, fallback) {
  const el5 = document.body ?? document.documentElement;
  const v = getComputedStyle(el5).getPropertyValue(name).trim();
  return v || fallback;
}
function resolveColor(color) {
  if (color.startsWith("var(")) {
    const varName = color.slice(4, color.indexOf(")")).split(",")[0].trim();
    return resolveCssVar2(varName, "#FFC72C");
  }
  if (color.startsWith("--")) {
    return resolveCssVar2(color, "#FFC72C");
  }
  return color;
}
function hexToRgba4(hex, alpha2) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha2})`;
}
function injectSrTable2(canvas, caption, headers, rows) {
  if (!canvas.parentElement) return;
  let srEl = canvas.nextElementSibling;
  if (!srEl || !srEl.classList.contains("mn-sr-only")) {
    srEl = document.createElement("span");
    srEl.className = "mn-sr-only";
    canvas.parentElement.insertBefore(srEl, canvas.nextSibling);
  }
  const th = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join("");
  const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("");
  srEl.innerHTML = `<table><caption>${escapeHtml(caption)}</caption><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`;
}
function confidenceChart(canvas, opts) {
  const dpr = window.devicePixelRatio || 1;
  const n = opts.labels.length;
  if (n === 0 || opts.values.length < n) return;
  const logicalW = canvas.offsetWidth || 600;
  const logicalH = opts.height ?? 200;
  canvas.width = logicalW * dpr;
  canvas.height = logicalH * dpr;
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${logicalH}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const rawColor = opts.color ?? "var(--mn-accent)";
  const lineColor = resolveColor(rawColor);
  const borderColor = resolveCssVar2("--mn-border", "#555555");
  const mutedColor = resolveCssVar2("--mn-text-muted", "#999999");
  const dataMin = Math.min(...opts.lower);
  const dataMax = Math.max(...opts.upper);
  const rangePad = (dataMax - dataMin) * 0.1 || 1;
  const yMin = dataMin - rangePad;
  const yMax = dataMax + rangePad;
  const pad2 = { top: 16, bottom: 40, left: 48, right: 12 };
  const chartW = logicalW - pad2.left - pad2.right;
  const chartH = logicalH - pad2.top - pad2.bottom;
  const xAt = (i) => pad2.left + (n > 1 ? i / (n - 1) * chartW : chartW / 2);
  const yAt = (v) => pad2.top + chartH - (v - yMin) / (yMax - yMin) * chartH;
  const animate = opts.animate !== false;
  const duration = 500;
  function drawFrame2(revealCount) {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, logicalH);
    const gridRows = 4;
    ctx.strokeStyle = hexToRgba4(borderColor.startsWith("#") ? borderColor : "#888888", 0.5);
    ctx.lineWidth = 0.5;
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let r = 0; r <= gridRows; r++) {
      const val = yMin + r / gridRows * (yMax - yMin);
      const y = yAt(val);
      ctx.beginPath();
      ctx.moveTo(pad2.left, y);
      ctx.lineTo(logicalW - pad2.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(1), pad2.left - 6, y);
    }
    const visible = Math.min(Math.ceil(revealCount), n);
    if (visible < 1) return;
    ctx.beginPath();
    for (let i = 0; i < visible; i++) ctx.lineTo(xAt(i), yAt(opts.upper[i]));
    for (let i = visible - 1; i >= 0; i--) ctx.lineTo(xAt(i), yAt(opts.lower[i]));
    ctx.closePath();
    ctx.fillStyle = hexToRgba4(lineColor.startsWith("#") ? lineColor : "#FFC72C", 0.15);
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < visible; i++) {
      const x = xAt(i);
      const y = yAt(opts.values[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();
    for (let i = 0; i < visible; i++) {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(opts.values[i]), 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
    }
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = mutedColor;
    ctx.textBaseline = "top";
    const rotateLabels = n > 6;
    for (let i = 0; i < visible; i++) {
      const x = xAt(i);
      const y = logicalH - pad2.bottom + 8;
      if (rotateLabels) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 6);
        ctx.textAlign = "right";
        ctx.fillText(opts.labels[i], 0, 0);
        ctx.restore();
      } else {
        ctx.textAlign = "center";
        ctx.fillText(opts.labels[i], x, y);
      }
    }
  }
  if (!animate) {
    drawFrame2(n);
  } else {
    let frame2 = function(ts) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const revealCount = 1 + p * (n - 1);
      drawFrame2(revealCount);
      if (p < 1) requestAnimationFrame(frame2);
    };
    var frame = frame2;
    let start = null;
    requestAnimationFrame(frame2);
  }
  const trend = opts.values[n - 1] >= opts.values[0] ? "upward" : "downward";
  const ariaLabel = `Confidence chart: ${n} points, range ${dataMin} to ${dataMax}, ${trend} trend`;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", ariaLabel);
  const unit = opts.unit ?? "";
  const rows = opts.labels.map((lbl, i) => [
    lbl,
    `${opts.values[i]}${unit}`,
    `${opts.lower[i]}${unit}`,
    `${opts.upper[i]}${unit}`
  ]);
  injectSrTable2(canvas, ariaLabel, ["Label", "Value", "Lower", "Upper"], rows);
}

// src/ts/decision-matrix.ts
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function clamp2(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function weightedTotal(alt, criteria) {
  let num = 0;
  let den = 0;
  for (const c of criteria) {
    const s = alt.scores[c.id] ?? 0;
    num += s * c.weight;
    den += c.weight;
  }
  return den > 0 ? num / den * 10 : 0;
}
function scoreBg(score) {
  if (score >= 7) {
    return "background:color-mix(in srgb, var(--signal-ok) 15%, transparent)";
  }
  if (score >= 4) {
    return "background:color-mix(in srgb, var(--signal-warning) 15%, transparent)";
  }
  return "background:color-mix(in srgb, var(--signal-danger) 15%, transparent)";
}
function rankAlternatives(alts, criteria) {
  const totals = alts.map((a) => ({
    id: a.id,
    total: weightedTotal(a, criteria)
  }));
  totals.sort((a, b) => b.total - a.total);
  const ranks = /* @__PURE__ */ new Map();
  totals.forEach((t, i) => ranks.set(t.id, i + 1));
  return ranks;
}
function decisionMatrix(el5, opts) {
  let alternatives = deepClone(opts.alternatives);
  const { criteria, editable = false, onChange } = opts;
  let activeInput = null;
  function commitEdit() {
    if (!activeInput) return;
    const altId = activeInput.dataset.alt ?? "";
    const critId = activeInput.dataset.crit ?? "";
    const val = clamp2(parseInt(activeInput.value, 10) || 1, 1, 10);
    const alt = alternatives.find((a) => a.id === altId);
    if (alt) {
      alt.scores[critId] = val;
      onChange?.(deepClone(alternatives));
    }
    activeInput = null;
    render5();
  }
  function openEdit(td, altId, critId) {
    if (activeInput) commitEdit();
    const current2 = alternatives.find((a) => a.id === altId)?.scores[critId] ?? 5;
    td.textContent = "";
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "10";
    input.value = String(current2);
    input.className = "mn-decision-matrix__edit-input";
    input.dataset.alt = altId;
    input.dataset.crit = critId;
    input.setAttribute("aria-label", `Edit score for ${critId}: 1-10`);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commitEdit();
      if (e.key === "Escape") {
        activeInput = null;
        render5();
      }
    });
    input.addEventListener("blur", () => commitEdit());
    td.appendChild(input);
    activeInput = input;
    input.focus();
    input.select();
  }
  function handleKeydown(e) {
    const target = e.target;
    if (!target.matches("td[data-alt]")) return;
    if (e.key === "Enter" && editable) {
      const altId = target.dataset.alt ?? "";
      const critId = target.dataset.crit ?? "";
      openEdit(target, altId, critId);
    }
  }
  function handleClick(e) {
    if (!editable) return;
    const target = e.target.closest("td[data-alt]");
    if (!target) return;
    const altId = target.dataset.alt ?? "";
    const critId = target.dataset.crit ?? "";
    if (altId && critId) openEdit(target, altId, critId);
  }
  function render5() {
    const ranks = rankAlternatives(alternatives, criteria);
    const winnerId = [...ranks.entries()].find(([, r]) => r === 1)?.[0] ?? "";
    const headCells = criteria.map(
      (c) => `<th scope="col">${escapeHtml(c.label)}<br><span class="mn-decision-matrix__weight">(w:${c.weight})</span></th>`
    ).join("");
    const rows = alternatives.map((alt) => {
      const isWinner = alt.id === winnerId;
      const cls = isWinner ? ' class="mn-decision-matrix__row--winner"' : "";
      const total = weightedTotal(alt, criteria).toFixed(1);
      const rank = ranks.get(alt.id) ?? 0;
      const scoreCells = criteria.map((c) => {
        const s = alt.scores[c.id] ?? 0;
        const label = `${escapeHtml(c.label)}: ${s}/10`;
        const tab = editable ? ' tabindex="0"' : "";
        return `<td data-alt="${escapeHtml(alt.id)}" data-crit="${escapeHtml(c.id)}" aria-label="${label}" style="${scoreBg(s)}"${tab}><span class="mn-decision-matrix__score">${s}</span></td>`;
      }).join("");
      return `<tr${cls}><td>${escapeHtml(alt.label)}</td>${scoreCells}<td><span class="mn-decision-matrix__total">${total}</span> <span class="mn-decision-matrix__rank">#${rank}</span></td></tr>`;
    }).join("");
    el5.innerHTML = `<div class="mn-decision-matrix__wrap"><table class="mn-decision-matrix" role="grid" aria-label="Decision matrix"><thead><tr><th scope="col">Alternative</th>${headCells}<th scope="col">Score</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    el5.querySelector("table")?.addEventListener("keydown", handleKeydown);
    el5.querySelector("table")?.addEventListener("click", handleClick);
  }
  render5();
  return {
    update(alts) {
      alternatives = deepClone(alts);
      render5();
    },
    getScores() {
      return deepClone(alternatives);
    },
    destroy() {
      el5.innerHTML = "";
    }
  };
}

// src/ts/source-card.ts
function scoreClass(score) {
  if (score >= 0.8) return "mn-source-card__score--high";
  if (score >= 0.5) return "mn-source-card__score--mid";
  return "mn-source-card__score--low";
}
function formatScore(score) {
  return `${(score * 100).toFixed(0)}%`;
}
function buildCard2(card, onSelect) {
  const article = document.createElement("article");
  article.className = "mn-source-card";
  article.tabIndex = 0;
  article.dataset.id = card.id;
  const ariaParts = [escapeHtml(card.title)];
  if (card.score !== void 0) {
    ariaParts.push(`relevance ${formatScore(card.score)}`);
  }
  article.setAttribute("aria-label", ariaParts.join(" - "));
  if (card.badge || card.score !== void 0) {
    const header2 = document.createElement("header");
    header2.className = "mn-source-card__header";
    if (card.badge) {
      const badge = document.createElement("span");
      badge.className = "mn-source-card__badge mn-badge";
      badge.textContent = card.badge;
      header2.appendChild(badge);
    }
    if (card.score !== void 0) {
      const score = document.createElement("span");
      const pct3 = formatScore(card.score);
      score.className = `mn-source-card__score ${scoreClass(card.score)}`;
      score.textContent = pct3;
      score.setAttribute("aria-label", `Relevance: ${pct3}`);
      header2.appendChild(score);
    }
    article.appendChild(header2);
  }
  const title = document.createElement("h4");
  title.className = "mn-source-card__title";
  title.textContent = card.title;
  article.appendChild(title);
  if (card.excerpt) {
    const excerpt = document.createElement("p");
    excerpt.className = "mn-source-card__excerpt";
    excerpt.textContent = card.excerpt;
    article.appendChild(excerpt);
  }
  if (card.source || card.date) {
    const footer = document.createElement("footer");
    footer.className = "mn-source-card__footer";
    if (card.source) {
      const src = document.createElement("span");
      src.className = "mn-source-card__source";
      src.textContent = card.source;
      footer.appendChild(src);
    }
    if (card.date) {
      const date = document.createElement("span");
      date.className = "mn-source-card__date";
      date.textContent = card.date;
      footer.appendChild(date);
    }
    article.appendChild(footer);
  }
  if (card.action) {
    const btn = document.createElement("button");
    btn.className = "mn-btn mn-btn--ghost mn-source-card__action";
    btn.textContent = card.action.label;
    btn.setAttribute(
      "aria-label",
      `${card.action.label} for ${escapeHtml(card.title)}`
    );
    const handler = card.action.onClick;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handler();
    });
    article.appendChild(btn);
  }
  if (onSelect) {
    article.addEventListener("click", () => onSelect(card));
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(card);
      }
    });
  }
  return article;
}
function buildShowMore(count, onClick) {
  const btn = document.createElement("button");
  btn.className = "mn-source-cards__show-more";
  btn.textContent = `Show ${count} more`;
  btn.setAttribute("aria-label", `Show ${count} more source citations`);
  btn.addEventListener("click", onClick);
  return btn;
}
function renderSourceCards(container, cards, opts) {
  const layout = opts?.layout ?? "list";
  const maxVisible = opts?.maxVisible;
  const onSelect = opts?.onSelect;
  function render5(data) {
    container.innerHTML = "";
    container.className = `mn-source-cards mn-source-cards--${layout}`;
    container.setAttribute("role", "list");
    container.setAttribute("aria-label", "Source citations");
    const limit = maxVisible && maxVisible < data.length ? maxVisible : data.length;
    for (let i = 0; i < limit; i++) {
      const el5 = buildCard2(data[i], onSelect);
      el5.setAttribute("role", "listitem");
      container.appendChild(el5);
    }
    if (maxVisible && maxVisible < data.length) {
      const remaining = data.length - maxVisible;
      const showMoreBtn = buildShowMore(remaining, () => {
        showMoreBtn.remove();
        for (let i = limit; i < data.length; i++) {
          const el5 = buildCard2(data[i], onSelect);
          el5.setAttribute("role", "listitem");
          container.appendChild(el5);
        }
      });
      container.appendChild(showMoreBtn);
    }
  }
  render5(cards);
  return {
    update(newCards) {
      render5(newCards);
    },
    destroy() {
      container.innerHTML = "";
      container.className = "";
      container.removeAttribute("role");
      container.removeAttribute("aria-label");
    }
  };
}

// src/ts/charts-bcg-matrix.ts
var MARGIN = { top: 16, right: 16, bottom: 40, left: 48 };
var FONT2 = "10px Inter, sans-serif";
var QUADS = ["Stars", "Cash Cows", "? Marks", "Dogs"];
function resolveColor2(raw, fb) {
  if (!raw) return fb;
  const m = raw.match(/^var\(--([\w-]+)/);
  return m ? cssVar(`--${m[1]}`, fb) : raw;
}
function quadOf(it, sT, gT) {
  const hs = it.marketShare >= sT, hg = it.growthRate >= gT;
  if (hs && hg) return "Stars";
  if (hs) return "Cash Cows";
  if (hg) return "? Marks";
  return "Dogs";
}
function quadHex(q) {
  const isSugar = document.body.classList.contains("mn-sugar");
  const m = {
    "Stars": ["--signal-ok", "#00A651"],
    "Cash Cows": isSugar ? ["--signal-warning", "#F59E0B"] : ["--mn-accent", "#FFC72C"],
    "? Marks": ["--signal-warning", "#FFC72C"],
    "Dogs": isSugar ? ["--mn-text-muted", "#767676"] : ["--mn-border-subtle", "#4d4d4d"]
  };
  const [v, fb] = m[q];
  return cssVar(v, fb);
}
function qColor(q, a) {
  const h = quadHex(q);
  return h.startsWith("#") && h.length >= 7 ? hexToRgba(h, a) : h;
}
function trunc(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
}
function bcgMatrix(canvas, opts) {
  const sT = opts.shareThreshold ?? 0.5;
  const gT = opts.growthThreshold ?? 10;
  const doAnim = opts.animate !== false;
  let items = [...opts.items];
  let hovId = null;
  let prog = doAnim ? 0 : 1;
  let raf = 0;
  let dead = false;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(rect.width, 200);
  const h = opts.height ?? 320;
  const _ctx = chartHiDpi(canvas, w, h);
  if (!_ctx) return void 0;
  const ctx = _ctx;
  const pL = MARGIN.left, pT = MARGIN.top;
  const pW = w - MARGIN.left - MARGIN.right;
  const pH = h - MARGIN.top - MARGIN.bottom;
  const gRange = () => {
    const rs = items.map((i) => i.growthRate);
    return { mn: Math.min(0, ...rs) - 5, mx: Math.max(20, ...rs) + 5 };
  };
  const toX = (s) => pL + (1 - s) * pW;
  const toY = (g) => {
    const { mn, mx } = gRange();
    return pT + (1 - (g - mn) / (mx - mn)) * pH;
  };
  const bR = (sz) => 8 + sz * 3;
  function draw(sc) {
    ctx.clearRect(0, 0, w, h);
    const tm = cssVar("--mn-text-muted");
    const bd = cssVar("--mn-border");
    const sf = cssVar("--mn-surface");
    const tx = cssVar("--mn-text");
    const midX = toX(sT), midY = toY(gT);
    const qr = [
      [pL, pT, midX - pL, midY - pT, "Stars"],
      [pL, midY, midX - pL, pT + pH - midY, "Cash Cows"],
      [midX, pT, pL + pW - midX, midY - pT, "? Marks"],
      [midX, midY, pL + pW - midX, pT + pH - midY, "Dogs"]
    ];
    for (const [x, y, qw, qh, q] of qr) {
      ctx.fillStyle = qColor(q, 0.1);
      ctx.fillRect(x, y, qw, qh);
    }
    ctx.font = FONT2;
    ctx.fillStyle = tm;
    ctx.textAlign = "left";
    ctx.fillText("Stars", pL + 6, pT + 14);
    ctx.fillText("Cash Cows", pL + 6, pT + pH - 6);
    ctx.textAlign = "right";
    ctx.fillText("? Marks", pL + pW - 6, pT + 14);
    ctx.fillText("Dogs", pL + pW - 6, pT + pH - 6);
    ctx.strokeStyle = bd;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, pT);
    ctx.lineTo(midX, pT + pH);
    ctx.moveTo(pL, midY);
    ctx.lineTo(pL + pW, midY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = tm;
    ctx.font = FONT2;
    ctx.textAlign = "center";
    ctx.fillText("\u2190 Relative Market Share \u2192", pL + pW / 2, h - 8);
    ctx.save();
    ctx.translate(12, pT + pH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Market Growth Rate %", 0, 0);
    ctx.restore();
    for (const it of items) {
      const bx = toX(it.marketShare), by = toY(it.growthRate);
      const r = bR(it.size ?? 5) * sc;
      const q = quadOf(it, sT, gT);
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = resolveColor2(it.color, qColor(q, 0.7));
      ctx.fill();
      ctx.strokeStyle = resolveColor2(it.color, qColor(q, 1));
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = tx;
      ctx.font = FONT2;
      ctx.textAlign = "center";
      ctx.fillText(trunc(it.label, 12), bx, by + r + 12);
      if (it.id === hovId) {
        ctx.beginPath();
        ctx.arc(bx, by, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = cssVar("--mn-accent");
        ctx.lineWidth = 2;
        ctx.stroke();
        const l1 = it.label;
        const l2 = `Share: ${(it.marketShare * 100).toFixed(0)}% | Growth: ${it.growthRate.toFixed(1)}%`;
        ctx.font = FONT2;
        const tw = Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width) + 12;
        const tbx = Math.min(Math.max(bx - tw / 2, pL), pL + pW - tw);
        const tby = Math.max(by - r - 36, pT);
        ctx.fillStyle = sf;
        ctx.fillRect(tbx, tby, tw, 30);
        ctx.strokeStyle = bd;
        ctx.lineWidth = 1;
        ctx.strokeRect(tbx, tby, tw, 30);
        ctx.fillStyle = tx;
        ctx.textAlign = "left";
        ctx.fillText(l1, tbx + 6, tby + 12);
        ctx.fillText(l2, tbx + 6, tby + 24);
      }
    }
  }
  function hitTest2(ex, ey) {
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const dx = ex - toX(it.marketShare), dy = ey - toY(it.growthRate);
      if (Math.hypot(dx, dy) <= bR(it.size ?? 5)) return it;
    }
    return null;
  }
  const coords = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMove = (e) => {
    const hit = hitTest2(coords(e).x, coords(e).y);
    const nid = hit?.id ?? null;
    if (nid !== hovId) {
      hovId = nid;
      draw(prog);
      opts.onHover?.(hit);
    }
  };
  const onDown = (e) => {
    const hit = hitTest2(coords(e).x, coords(e).y);
    if (hit) opts.onClick?.(hit);
  };
  const onLeave = () => {
    if (hovId) {
      hovId = null;
      draw(prog);
      opts.onHover?.(null);
    }
  };
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mouseleave", onLeave);
  function applyA11y() {
    const grp = { "Stars": [], "Cash Cows": [], "? Marks": [], "Dogs": [] };
    for (const it of items) grp[quadOf(it, sT, gT)].push(it.label);
    const desc = QUADS.filter((q) => grp[q].length > 0).map((q) => `${q}: ${grp[q].join(", ")}`).join(". ");
    const label = `BCG matrix with ${items.length} items. ${desc}`;
    const rows = items.map((it) => ({
      label: escapeHtml(it.label),
      value: `Share ${(it.marketShare * 100).toFixed(0)}%, Growth ${it.growthRate.toFixed(1)}%, ${quadOf(it, sT, gT)}`
    }));
    applyChartA11y(canvas, label, rows);
  }
  if (doAnim) {
    const t0 = performance.now();
    const tick = (now) => {
      if (dead) return;
      prog = Math.min((now - t0) / 400, 1);
      draw(1 - Math.pow(1 - prog, 3));
      if (prog < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  } else {
    draw(1);
  }
  applyA11y();
  return {
    update(newItems) {
      items = [...newItems];
      prog = 1;
      draw(1);
      applyA11y();
    },
    destroy() {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseleave", onLeave);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains("mn-sr-only")) sr.remove();
    }
  };
}

// src/ts/nine-box-matrix.ts
function getTier(x, y) {
  const s = x + y;
  if (s >= 6) return "invest";
  if (s >= 5) return x === 3 && y === 2 || x === 2 && y === 3 ? "invest" : "selective";
  if (s === 4) return "selective";
  if (s === 3) return x === 1 && y === 2 || x === 2 && y === 1 ? "divest" : "selective";
  return "divest";
}
function clampCoord(v) {
  return Math.max(1, Math.min(3, v));
}
function makeDiv(cls, text) {
  const d = document.createElement("div");
  d.className = cls;
  if (text) d.textContent = text;
  return d;
}
function makeSpan(cls, text) {
  const s = document.createElement("span");
  s.className = cls;
  s.textContent = text;
  return s;
}
function nineBoxMatrix(el5, opts) {
  const xLabel = opts.xLabel ?? "Business Strength";
  const yLabel = opts.yLabel ?? "Industry Attractiveness";
  const xAxis = opts.xAxisLabels ?? ["Low", "Medium", "High"];
  const yAxis = opts.yAxisLabels ?? ["Low", "Medium", "High"];
  let items = [...opts.items];
  let selectedId = null;
  const ac = new AbortController();
  function render5() {
    el5.innerHTML = "";
    const root = makeDiv("mn-nine-box");
    const yLabelEl = makeDiv("mn-nine-box__y-label", yLabel);
    yLabelEl.setAttribute("aria-hidden", "true");
    root.appendChild(yLabelEl);
    const body = makeDiv("mn-nine-box__body");
    const yTicks = makeDiv("mn-nine-box__y-ticks");
    yTicks.setAttribute("aria-hidden", "true");
    for (let r = 2; r >= 0; r--) yTicks.appendChild(makeSpan("", yAxis[r]));
    const gridRow = makeDiv("mn-nine-box__grid-row");
    gridRow.appendChild(yTicks);
    const grid = makeDiv("mn-nine-box__grid");
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", `${yLabel} vs ${xLabel} matrix`);
    for (let y = 3; y >= 1; y--) {
      for (let x = 1; x <= 3; x++) {
        const cx = x, cy = y;
        const cell = makeDiv("mn-nine-box__cell");
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("data-tier", getTier(cx, cy));
        cell.setAttribute("data-x", String(cx));
        cell.setAttribute("data-y", String(cy));
        cell.tabIndex = 0;
        cell.setAttribute(
          "aria-label",
          `${yLabel}: ${yAxis[cy - 1]}, ${xLabel}: ${xAxis[cx - 1]}`
        );
        for (const item of items.filter((i) => i.x === cx && i.y === cy)) {
          cell.appendChild(buildItem3(item));
        }
        grid.appendChild(cell);
      }
    }
    gridRow.appendChild(grid);
    body.appendChild(gridRow);
    const xLabelsRow = makeDiv("mn-nine-box__x-labels");
    xLabelsRow.setAttribute("aria-hidden", "true");
    for (const lbl of xAxis) xLabelsRow.appendChild(makeSpan("", lbl));
    body.appendChild(xLabelsRow);
    const xLabelEl = makeDiv("mn-nine-box__x-label", xLabel);
    xLabelEl.setAttribute("aria-hidden", "true");
    body.appendChild(xLabelEl);
    root.appendChild(body);
    el5.appendChild(root);
    bindEvents();
  }
  function buildItem3(item) {
    const div = makeDiv("mn-nine-box__item");
    if (selectedId === item.id) div.classList.add("mn-nine-box__item--selected");
    div.setAttribute("role", "button");
    div.tabIndex = 0;
    div.setAttribute("data-id", item.id);
    div.setAttribute("aria-label", escapeHtml(item.label));
    if (item.color) div.style.borderColor = item.color;
    div.appendChild(makeSpan("mn-nine-box__item-label", item.label));
    if (item.subtitle) div.appendChild(makeSpan("mn-nine-box__item-sub", item.subtitle));
    return div;
  }
  function selectItem(id) {
    selectedId = id;
    for (const itemEl of el5.querySelectorAll(".mn-nine-box__item")) {
      itemEl.classList.toggle(
        "mn-nine-box__item--selected",
        itemEl.getAttribute("data-id") === id
      );
    }
    for (const cellEl of el5.querySelectorAll(".mn-nine-box__cell")) {
      cellEl.classList.toggle("mn-nine-box__cell--drop-target", id !== null);
    }
    if (id) {
      const item = items.find((i) => i.id === id);
      if (item) opts.onSelect?.(item);
    }
  }
  function doMove(id, x, y) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.x = x;
    item.y = y;
    opts.onMove?.(item, x, y);
    selectedId = null;
    render5();
  }
  function handleClick(e) {
    const target = e.target;
    const itemEl = target.closest(".mn-nine-box__item");
    if (itemEl) {
      const id = itemEl.getAttribute("data-id");
      if (id) selectItem(selectedId === id ? null : id);
      return;
    }
    const cellEl = target.closest(".mn-nine-box__cell");
    if (cellEl && selectedId) {
      doMove(
        selectedId,
        Number(cellEl.getAttribute("data-x")),
        Number(cellEl.getAttribute("data-y"))
      );
    }
  }
  function handleKey(e) {
    const ke = e;
    const target = ke.target;
    if (target.classList.contains("mn-nine-box__item")) {
      if (ke.key === "Enter" || ke.key === " ") {
        ke.preventDefault();
        const id = target.getAttribute("data-id");
        if (id) selectItem(selectedId === id ? null : id);
        return;
      }
      if (selectedId && target.getAttribute("data-id") === selectedId) {
        const item = items.find((i) => i.id === selectedId);
        if (!item) return;
        let nx = item.x, ny = item.y;
        if (ke.key === "ArrowRight") nx = clampCoord(nx + 1);
        else if (ke.key === "ArrowLeft") nx = clampCoord(nx - 1);
        else if (ke.key === "ArrowUp") ny = clampCoord(ny + 1);
        else if (ke.key === "ArrowDown") ny = clampCoord(ny - 1);
        else return;
        ke.preventDefault();
        if (nx !== item.x || ny !== item.y) doMove(selectedId, nx, ny);
      }
      return;
    }
    if (target.classList.contains("mn-nine-box__cell") && selectedId) {
      if (ke.key === "Enter" || ke.key === " ") {
        ke.preventDefault();
        doMove(
          selectedId,
          Number(target.getAttribute("data-x")),
          Number(target.getAttribute("data-y"))
        );
      }
    }
  }
  function bindEvents() {
    el5.addEventListener("click", handleClick, { signal: ac.signal });
    el5.addEventListener("keydown", handleKey, { signal: ac.signal });
  }
  render5();
  return {
    update(newItems) {
      items = [...newItems];
      selectedId = null;
      render5();
    },
    moveItem(id, x, y) {
      doMove(id, x, y);
    },
    getItems() {
      return items.map((i) => ({ ...i }));
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
    }
  };
}

// src/ts/swot-matrix.ts
var QUADRANTS = ["strengths", "weaknesses", "opportunities", "threats"];
var ICONS = {
  strengths: "S",
  weaknesses: "W",
  opportunities: "O",
  threats: "T"
};
var DEFAULTS2 = {
  strengths: "Strengths",
  weaknesses: "Weaknesses",
  opportunities: "Opportunities",
  threats: "Threats"
};
function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function buildQuadrant(q, label, uid2, editable) {
  const div = document.createElement("div");
  div.className = `mn-swot__quadrant mn-swot__quadrant--${q}`;
  div.setAttribute("role", "group");
  const hdrId = `swot-${uid2}-${q}-hdr`;
  div.setAttribute("aria-labelledby", hdrId);
  div.dataset.quadrant = q;
  const hdr = document.createElement("div");
  hdr.className = "mn-swot__header";
  hdr.id = hdrId;
  const icon = document.createElement("span");
  icon.className = "mn-swot__icon";
  icon.textContent = ICONS[q];
  const title = document.createElement("span");
  title.className = "mn-swot__title";
  title.textContent = label;
  hdr.append(icon, title);
  const list = document.createElement("ul");
  list.className = "mn-swot__list";
  list.setAttribute("role", "list");
  list.setAttribute("aria-label", `${label} items`);
  div.append(hdr, list);
  if (editable) {
    const addBtn = document.createElement("button");
    addBtn.className = "mn-swot__add";
    addBtn.type = "button";
    addBtn.setAttribute("aria-label", `Add ${label.toLowerCase()}`);
    addBtn.textContent = "+ Add";
    const wrap = document.createElement("div");
    wrap.className = "mn-swot__input-wrap";
    wrap.hidden = true;
    const input = document.createElement("input");
    input.className = "mn-input mn-swot__input";
    input.type = "text";
    input.placeholder = "Enter item\u2026";
    input.setAttribute("aria-label", `New ${label.toLowerCase()}`);
    const confirm = document.createElement("button");
    confirm.className = "mn-swot__confirm";
    confirm.type = "button";
    confirm.setAttribute("aria-label", "Confirm");
    confirm.textContent = "\u21B5";
    wrap.append(input, confirm);
    div.append(addBtn, wrap);
  }
  return div;
}
function buildItemEl(item, editable) {
  const li = document.createElement("li");
  li.className = "mn-swot__item";
  li.setAttribute("role", "listitem");
  li.dataset.id = item.id;
  const span = document.createElement("span");
  span.className = "mn-swot__text";
  span.textContent = item.text;
  li.append(span);
  if (editable) {
    const btn = document.createElement("button");
    btn.className = "mn-swot__remove";
    btn.type = "button";
    btn.setAttribute("aria-label", `Remove: ${escapeHtml(item.text)}`);
    btn.textContent = "\xD7";
    li.append(btn);
  }
  return li;
}
function swotMatrix(el5, opts) {
  const editable = opts?.editable !== false;
  const labels = { ...DEFAULTS2, ...opts?.quadrantLabels };
  let items = [...opts?.items ?? []];
  const uid2 = genId().slice(0, 8);
  el5.classList.add("mn-swot");
  el5.setAttribute("role", "region");
  el5.setAttribute("aria-label", "SWOT Analysis");
  const quadrantEls = /* @__PURE__ */ new Map();
  for (const q of QUADRANTS) {
    const qEl = buildQuadrant(q, labels[q], uid2, editable);
    quadrantEls.set(q, qEl);
    el5.append(qEl);
  }
  function notify() {
    opts?.onChange?.([...items]);
  }
  function renderItems() {
    for (const q of QUADRANTS) {
      const list = quadrantEls.get(q).querySelector(".mn-swot__list");
      list.innerHTML = "";
      for (const item of items.filter((i) => i.quadrant === q)) {
        list.append(buildItemEl(item, editable));
      }
    }
  }
  function addItem(quadrant, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item = { id: genId(), text: trimmed, quadrant };
    items.push(item);
    const list = quadrantEls.get(quadrant).querySelector(".mn-swot__list");
    list.append(buildItemEl(item, editable));
    notify();
  }
  function removeItem(id) {
    const li = el5.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (li) {
      li.classList.add("mn-swot__item--removing");
      setTimeout(() => li.remove(), 200);
    }
    items = items.filter((i) => i.id !== id);
    notify();
  }
  function hideInput(qEl) {
    const wrap = qEl.querySelector(".mn-swot__input-wrap");
    const addBtn = qEl.querySelector(".mn-swot__add");
    if (wrap) wrap.hidden = true;
    if (addBtn) addBtn.hidden = false;
  }
  function handleClick(e) {
    const target = e.target;
    if (target.closest(".mn-swot__remove")) {
      const li = target.closest(".mn-swot__item");
      if (li?.dataset.id) removeItem(li.dataset.id);
      return;
    }
    if (target.closest(".mn-swot__add")) {
      const qEl = target.closest(".mn-swot__quadrant");
      const wrap = qEl.querySelector(".mn-swot__input-wrap");
      const addBtn = qEl.querySelector(".mn-swot__add");
      wrap.hidden = false;
      addBtn.hidden = true;
      const input = wrap.querySelector("input");
      input.value = "";
      input.focus();
      return;
    }
    if (target.closest(".mn-swot__confirm")) {
      const qEl = target.closest(".mn-swot__quadrant");
      const q = qEl.dataset.quadrant;
      const input = qEl.querySelector(".mn-swot__input");
      addItem(q, input.value);
      hideInput(qEl);
    }
  }
  function handleKeydown(e) {
    const target = e.target;
    if (!target.classList.contains("mn-swot__input")) return;
    const qEl = target.closest(".mn-swot__quadrant");
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(qEl.dataset.quadrant, target.value);
      hideInput(qEl);
    } else if (e.key === "Escape") {
      hideInput(qEl);
      qEl.querySelector(".mn-swot__add")?.focus();
    }
  }
  el5.addEventListener("click", handleClick);
  el5.addEventListener("keydown", handleKeydown);
  renderItems();
  return {
    getItems: () => [...items],
    addItem,
    removeItem,
    update(newItems) {
      items = [...newItems];
      renderItems();
      notify();
    },
    destroy() {
      el5.removeEventListener("click", handleClick);
      el5.removeEventListener("keydown", handleKeydown);
      el5.innerHTML = "";
      el5.classList.remove("mn-swot");
      el5.removeAttribute("role");
      el5.removeAttribute("aria-label");
    }
  };
}

// src/ts/approval-chain.ts
var STATUS_ICONS = {
  approved: "\u2713",
  rejected: "\u2717",
  skipped: "\u2192",
  current: "\u25CF",
  pending: "\u25CB"
};
var STATUS_LABELS2 = {
  approved: "Approved",
  rejected: "Rejected",
  skipped: "Skipped",
  current: "Current reviewer",
  pending: "Pending"
};
function getInitials2(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function buildNode(step, editable, ac, onAction) {
  const node = document.createElement("div");
  node.className = `mn-approval__node mn-approval__node--${step.status}`;
  node.dataset.id = step.id;
  if (step.comment) node.title = step.comment;
  const avatar = document.createElement("div");
  avatar.className = `mn-approval__avatar mn-approval__avatar--${step.status}`;
  avatar.textContent = getInitials2(step.name);
  const badge = document.createElement("span");
  badge.className = `mn-approval__badge mn-approval__badge--${step.status}`;
  badge.textContent = STATUS_ICONS[step.status];
  badge.setAttribute("aria-label", STATUS_LABELS2[step.status]);
  avatar.appendChild(badge);
  node.appendChild(avatar);
  const nameEl = document.createElement("span");
  nameEl.className = "mn-approval__name";
  nameEl.textContent = escapeHtml(step.name);
  node.appendChild(nameEl);
  if (step.role) {
    const roleEl = document.createElement("span");
    roleEl.className = "mn-approval__role";
    roleEl.textContent = escapeHtml(step.role);
    node.appendChild(roleEl);
  }
  if (step.timestamp) {
    const ts = document.createElement("span");
    ts.className = "mn-approval__timestamp";
    ts.textContent = escapeHtml(step.timestamp);
    node.appendChild(ts);
  }
  if (editable && step.status === "current" && onAction) {
    const actions = document.createElement("div");
    actions.className = "mn-approval__actions";
    const btns = [
      { label: "Approve", action: "approve", cls: "mn-approval__btn--approve" },
      { label: "Reject", action: "reject", cls: "mn-approval__btn--reject" },
      { label: "Skip", action: "skip", cls: "mn-approval__btn--skip" }
    ];
    for (const b of btns) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `mn-approval__btn ${b.cls}`;
      btn.textContent = b.label;
      btn.addEventListener("click", () => onAction(step, b.action), { signal: ac.signal });
      actions.appendChild(btn);
    }
    node.appendChild(actions);
  }
  return node;
}
function buildConnector(prevStatus) {
  const conn = document.createElement("div");
  conn.className = "mn-approval__connector";
  const isDone = prevStatus === "approved" || prevStatus === "rejected" || prevStatus === "skipped";
  if (isDone) {
    conn.classList.add("mn-approval__connector--done");
  } else {
    conn.classList.add("mn-approval__connector--pending");
  }
  return conn;
}
function render3(el5, steps, opts, ac) {
  el5.innerHTML = "";
  for (let i = 0; i < steps.length; i++) {
    if (i > 0) {
      el5.appendChild(buildConnector(steps[i - 1].status));
    }
    el5.appendChild(buildNode(steps[i], opts.editable ?? false, ac, opts.onAction));
  }
}
function patchNode(el5, id, status, timestamp) {
  const node = el5.querySelector(`[data-id="${CSS.escape(id)}"]`);
  if (!node) return;
  node.className = node.className.replace(/mn-approval__node--\w+/, `mn-approval__node--${status}`);
  const avatar = node.querySelector(".mn-approval__avatar");
  if (avatar) {
    avatar.className = avatar.className.replace(/mn-approval__avatar--\w+/, `mn-approval__avatar--${status}`);
  }
  const badge = node.querySelector(".mn-approval__badge");
  if (badge) {
    badge.className = badge.className.replace(/mn-approval__badge--\w+/, `mn-approval__badge--${status}`);
    badge.textContent = STATUS_ICONS[status];
    badge.setAttribute("aria-label", STATUS_LABELS2[status]);
  }
  if (timestamp) {
    let ts = node.querySelector(".mn-approval__timestamp");
    if (!ts) {
      ts = document.createElement("span");
      ts.className = "mn-approval__timestamp";
      node.appendChild(ts);
    }
    ts.textContent = escapeHtml(timestamp);
  }
  if (status !== "current") {
    node.querySelector(".mn-approval__actions")?.remove();
  }
}
function approvalChain(el5, steps, opts) {
  const options = {
    editable: false,
    orientation: "horizontal",
    ...opts
  };
  const ac = new AbortController();
  el5.setAttribute("role", "list");
  el5.setAttribute("aria-label", "Approval chain");
  el5.classList.add("mn-approval");
  if (options.orientation === "vertical") {
    el5.classList.add("mn-approval--vertical");
  }
  let currentSteps = [...steps];
  render3(el5, currentSteps, options, ac);
  return {
    update(newSteps) {
      currentSteps = [...newSteps];
      render3(el5, currentSteps, options, ac);
    },
    setStatus(id, status, timestamp) {
      const idx = currentSteps.findIndex((s) => s.id === id);
      if (idx < 0) return;
      currentSteps[idx] = { ...currentSteps[idx], status, timestamp: timestamp ?? currentSteps[idx].timestamp };
      patchNode(el5, id, status, timestamp);
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
      el5.removeAttribute("role");
      el5.removeAttribute("aria-label");
      el5.classList.remove("mn-approval", "mn-approval--vertical");
    }
  };
}

// src/ts/agent-trace.ts
var KIND_LABELS = {
  tool: "T",
  reasoning: "R",
  result: "Res",
  handoff: "H"
};
var MAX_DISPLAY_LEN = 500;
function truncate2(text) {
  if (!text) return "";
  return text.length > MAX_DISPLAY_LEN ? text.slice(0, MAX_DISPLAY_LEN) + "..." : text;
}
function buildStepHtml(step, expanded) {
  const kindLabel = escapeHtml(KIND_LABELS[step.kind]);
  const label = escapeHtml(step.label);
  const duration = step.durationMs != null ? `${step.durationMs}ms` : "";
  const timestamp = step.timestamp ? escapeHtml(step.timestamp) : "";
  const inputText = escapeHtml(truncate2(step.input));
  const outputText = escapeHtml(truncate2(step.output));
  const hasBody = step.input || step.output;
  const ariaExp = hasBody ? ` aria-expanded="${expanded}"` : "";
  const pulseClass = step.status === "running" ? " mn-agent-trace__pulse" : "";
  let body = "";
  if (hasBody && expanded) {
    body = '<div class="mn-agent-trace__body">';
    if (step.input) {
      body += `<div class="mn-agent-trace__section"><span class="mn-agent-trace__section-label">Input</span><pre class="mn-agent-trace__pre">${inputText}</pre></div>`;
    }
    if (step.output) {
      body += `<div class="mn-agent-trace__section"><span class="mn-agent-trace__section-label">Output</span><pre class="mn-agent-trace__pre">${outputText}</pre></div>`;
    }
    body += "</div>";
  }
  return `<div class="mn-agent-trace__header" role="button" tabindex="0"${ariaExp}><span class="mn-agent-trace__kind mn-agent-trace__kind--${step.kind}">${kindLabel}</span><span class="mn-agent-trace__label">${label}</span>` + (timestamp ? `<span class="mn-agent-trace__timestamp">${timestamp}</span>` : "") + (duration ? `<span class="mn-agent-trace__duration">${duration}</span>` : "") + `<span class="mn-agent-trace__dot mn-agent-trace__dot--${step.status}${pulseClass}"></span></div>${body}`;
}
function createStepEl(step) {
  const div = document.createElement("div");
  div.className = `mn-agent-trace__step mn-agent-trace__step--${step.status}`;
  div.setAttribute("role", "listitem");
  div.dataset.id = step.id;
  div.innerHTML = buildStepHtml(step, false);
  return div;
}
function agentTrace(el5, steps, opts) {
  const ac = new AbortController();
  const signal = ac.signal;
  const stepsArr = [];
  const expandedSet = /* @__PURE__ */ new Set();
  el5.classList.add("mn-agent-trace");
  el5.setAttribute("role", "list");
  function toggleStep(stepId) {
    if (expandedSet.has(stepId)) {
      expandedSet.delete(stepId);
    } else {
      expandedSet.add(stepId);
    }
    const stepEl = el5.querySelector(`[data-id="${stepId}"]`);
    const step = stepsArr.find((s) => s.id === stepId);
    if (!stepEl || !step) return;
    const isOpen = expandedSet.has(stepId);
    stepEl.classList.toggle("mn-agent-trace__step--open", isOpen);
    stepEl.innerHTML = buildStepHtml(step, isOpen);
    if (opts?.onSelect && isOpen) opts.onSelect(step);
  }
  el5.addEventListener("click", (e) => {
    const header2 = e.target.closest(".mn-agent-trace__header");
    if (!header2) return;
    const stepEl = header2.closest("[data-id]");
    if (stepEl?.dataset.id) toggleStep(stepEl.dataset.id);
  }, { signal });
  el5.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const header2 = e.target.closest(".mn-agent-trace__header");
    if (!header2) return;
    e.preventDefault();
    const stepEl = header2.closest("[data-id]");
    if (stepEl?.dataset.id) toggleStep(stepEl.dataset.id);
  }, { signal });
  function autoScroll() {
    el5.scrollTop = el5.scrollHeight;
  }
  function add(step) {
    stepsArr.push(step);
    const node = createStepEl(step);
    el5.appendChild(node);
    autoScroll();
  }
  function update(id, partial) {
    const idx = stepsArr.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const step = { ...stepsArr[idx], ...partial };
    stepsArr[idx] = step;
    const node = el5.querySelector(`[data-id="${id}"]`);
    if (!node) return;
    node.className = `mn-agent-trace__step mn-agent-trace__step--${step.status}`;
    if (expandedSet.has(id)) node.classList.add("mn-agent-trace__step--open");
    node.innerHTML = buildStepHtml(step, expandedSet.has(id));
  }
  function clear2() {
    stepsArr.length = 0;
    expandedSet.clear();
    el5.innerHTML = "";
  }
  function destroy() {
    ac.abort();
    clear2();
    el5.classList.remove("mn-agent-trace");
    el5.removeAttribute("role");
  }
  if (steps) {
    for (const s of steps) add(s);
  }
  return { add, update, clear: clear2, destroy };
}

// src/ts/token-meter.ts
var NUM_FMT = new Intl.NumberFormat("en-US");
var COST_FMT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4
});
function pct2(value, total) {
  return total > 0 ? value / total * 100 : 0;
}
function buildBar(usage) {
  const total = usage.prompt + usage.completion;
  const max = usage.budget ?? total;
  const promptW = pct2(usage.prompt, max);
  const compW = pct2(usage.completion, max);
  const cachedW = usage.cached ? pct2(usage.cached, max) : 0;
  const ariaLabel = `Token usage: ${NUM_FMT.format(total)} of ${NUM_FMT.format(max)}`;
  return [
    `<div class="mn-token-meter__bar" role="meter"`,
    ` aria-valuenow="${total}" aria-valuemin="0"`,
    ` aria-valuemax="${max}" aria-label="${escapeHtml(ariaLabel)}">`,
    `<div class="mn-token-meter__seg mn-token-meter__seg--prompt"`,
    ` style="width:${promptW.toFixed(2)}%">`,
    cachedW > 0 ? `<div class="mn-token-meter__seg--cached" style="width:${pct2(usage.cached, usage.prompt).toFixed(2)}%"></div>` : "",
    `</div>`,
    `<div class="mn-token-meter__seg mn-token-meter__seg--completion"`,
    ` style="width:${compW.toFixed(2)}%"></div>`,
    `</div>`
  ].join("");
}
function costStr(usage) {
  if (!usage.costPerMToken) return "";
  const total = usage.prompt + usage.completion;
  return COST_FMT.format(total / 1e6 * usage.costPerMToken);
}
function buildBreakdown(usage) {
  const total = usage.prompt + usage.completion;
  const rows = [
    { cls: "prompt", label: "Prompt", value: usage.prompt },
    { cls: "completion", label: "Completion", value: usage.completion }
  ];
  if (usage.cached !== void 0 && usage.cached > 0) {
    rows.push({ cls: "cached", label: "Cached", value: usage.cached });
  }
  const html = rows.map((r) => [
    `<span class="mn-token-meter__swatch mn-token-meter__swatch--${r.cls}"></span>`,
    `<span class="mn-token-meter__label">${r.label}</span>`,
    `<span class="mn-token-meter__count">${NUM_FMT.format(r.value)}</span>`,
    `<span class="mn-token-meter__pct">${total > 0 ? pct2(r.value, total).toFixed(1) : "0.0"}%</span>`
  ].join("")).join("");
  return `<div class="mn-token-meter__breakdown">${html}</div>`;
}
function render4(el5, usage, opts) {
  const costHtml = opts.showCost && usage.costPerMToken ? `<span class="mn-token-meter__cost">${escapeHtml(costStr(usage))}</span>` : "";
  const safeLabel = escapeHtml(opts.label);
  el5.innerHTML = [
    `<div class="mn-token-meter${opts.animate ? "" : " mn-token-meter--no-anim"}">`,
    `<div class="mn-token-meter__header">`,
    `<span class="mn-token-meter__title">${safeLabel}</span>`,
    costHtml,
    `</div>`,
    buildBar(usage),
    opts.showBreakdown ? buildBreakdown(usage) : "",
    `</div>`
  ].join("");
}
function updateDom(el5, usage, showCost) {
  const total = usage.prompt + usage.completion;
  const max = usage.budget ?? total;
  const bar = el5.querySelector(".mn-token-meter__bar");
  if (bar) {
    bar.setAttribute("aria-valuenow", String(total));
    bar.setAttribute("aria-valuemax", String(max));
    const ariaLabel = `Token usage: ${NUM_FMT.format(total)} of ${NUM_FMT.format(max)}`;
    bar.setAttribute("aria-label", ariaLabel);
  }
  const promptSeg = el5.querySelector(".mn-token-meter__seg--prompt");
  if (promptSeg) {
    promptSeg.style.width = `${pct2(usage.prompt, max).toFixed(2)}%`;
    const cachedEl = promptSeg.querySelector(".mn-token-meter__seg--cached");
    if (cachedEl && usage.cached) {
      cachedEl.style.width = `${pct2(usage.cached, usage.prompt).toFixed(2)}%`;
    }
  }
  const compSeg = el5.querySelector(".mn-token-meter__seg--completion");
  if (compSeg) {
    compSeg.style.width = `${pct2(usage.completion, max).toFixed(2)}%`;
  }
  if (showCost) {
    const costEl = el5.querySelector(".mn-token-meter__cost");
    if (costEl) costEl.textContent = costStr(usage);
  }
  const breakdown = el5.querySelector(".mn-token-meter__breakdown");
  if (breakdown) {
    const counts = breakdown.querySelectorAll(".mn-token-meter__count");
    const pcts = breakdown.querySelectorAll(".mn-token-meter__pct");
    const values = [usage.prompt, usage.completion];
    if (usage.cached !== void 0 && usage.cached > 0) values.push(usage.cached);
    values.forEach((v, i) => {
      if (counts[i]) counts[i].textContent = NUM_FMT.format(v);
      if (pcts[i]) pcts[i].textContent = `${total > 0 ? pct2(v, total).toFixed(1) : "0.0"}%`;
    });
  }
}
function tokenMeter(el5, usage, opts) {
  const resolved = {
    label: opts?.label ?? "Token Usage",
    showCost: opts?.showCost ?? usage?.costPerMToken !== void 0,
    showBreakdown: opts?.showBreakdown ?? true,
    animate: opts?.animate ?? true
  };
  let current2 = usage ?? { prompt: 0, completion: 0 };
  render4(el5, current2, resolved);
  return {
    update(next) {
      current2 = next;
      resolved.showCost = opts?.showCost ?? next.costPerMToken !== void 0;
      updateDom(el5, current2, resolved.showCost);
      opts?.onChange?.(current2);
    },
    reset() {
      current2 = { prompt: 0, completion: 0 };
      render4(el5, current2, resolved);
    },
    destroy() {
      el5.innerHTML = "";
    }
  };
}

// src/ts/streaming-text.ts
var SEGMENT_RE = /(\*\*(.+?)\*\*|`([^`]+)`|\[(\d+)\])/g;
function renderBuffer(raw, processMarkdown) {
  if (!processMarkdown) return escapeHtml(raw);
  let result = "";
  let lastIndex = 0;
  SEGMENT_RE.lastIndex = 0;
  let match = SEGMENT_RE.exec(raw);
  while (match !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(raw.slice(lastIndex, match.index));
    }
    if (match[2] !== void 0) {
      result += `<strong class="mn-stream__bold">${escapeHtml(match[2])}</strong>`;
    } else if (match[3] !== void 0) {
      result += `<code class="mn-stream__code">${escapeHtml(match[3])}</code>`;
    } else if (match[4] !== void 0) {
      const idx = match[4];
      result += `<button class="mn-stream__cite" data-idx="${escapeHtml(idx)}" type="button">[${escapeHtml(idx)}]</button>`;
    }
    lastIndex = match.index + match[0].length;
    match = SEGMENT_RE.exec(raw);
  }
  if (lastIndex < raw.length) {
    result += escapeHtml(raw.slice(lastIndex));
  }
  return result;
}
var CURSOR_HTML = '<span class="mn-stream__cursor" aria-hidden="true">|</span>';
function streamingText(el5, opts) {
  const options = {
    onCitationClick: opts?.onCitationClick ?? (() => {
    }),
    onDone: opts?.onDone ?? (() => {
    }),
    typingCursor: opts?.typingCursor ?? true,
    processMarkdown: opts?.processMarkdown ?? true
  };
  let buffer = "";
  let finished = false;
  const ac = new AbortController();
  el5.setAttribute("role", "log");
  el5.setAttribute("aria-live", "polite");
  el5.setAttribute("aria-atomic", "false");
  el5.setAttribute("aria-label", "Streaming response");
  el5.classList.add("mn-stream");
  const liveRegion = document.createElement("span");
  liveRegion.className = "mn-sr-only";
  liveRegion.setAttribute("aria-live", "polite");
  el5.appendChild(liveRegion);
  el5.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (target.classList.contains("mn-stream__cite")) {
        const idx = parseInt(target.dataset.idx ?? "0", 10);
        options.onCitationClick(idx);
      }
    },
    { signal: ac.signal }
  );
  function render5(showCursor) {
    const html = renderBuffer(buffer, options.processMarkdown);
    const cursor = showCursor && options.typingCursor ? CURSOR_HTML : "";
    el5.innerHTML = `<span class="mn-stream__content">${html}${cursor}</span>`;
    el5.appendChild(liveRegion);
  }
  function append(chunk) {
    if (finished) return;
    buffer += chunk;
    render5(true);
    liveRegion.textContent = chunk;
  }
  function done() {
    if (finished) return;
    finished = true;
    el5.classList.add("mn-stream--done");
    render5(false);
    liveRegion.textContent = "";
    options.onDone();
  }
  function reset() {
    buffer = "";
    finished = false;
    el5.classList.remove("mn-stream--done");
    render5(true);
    liveRegion.textContent = "";
  }
  function setText(text) {
    buffer = text;
    finished = true;
    el5.classList.add("mn-stream--done");
    render5(false);
    liveRegion.textContent = "";
  }
  function destroy() {
    ac.abort();
    el5.innerHTML = "";
    el5.removeAttribute("role");
    el5.removeAttribute("aria-live");
    el5.removeAttribute("aria-atomic");
    el5.removeAttribute("aria-label");
    el5.classList.remove("mn-stream", "mn-stream--done");
    buffer = "";
    finished = true;
  }
  render5(true);
  return { append, done, reset, setText, destroy };
}

// src/ts/charts-risk-matrix.ts
var ML = 52;
var MT = 12;
var MR = 12;
var MB = 52;
var CIRCLE_R = 10;
var ANIM_MS = 400;
var OFFSETS = [[0, 0], [-8, -8], [8, -8], [-8, 8]];
function severityColor(score) {
  const ok = cssVar("--signal-ok", "#00A651");
  const warn = cssVar("--signal-warning", "#FFC72C");
  const danger = cssVar("--signal-danger", "#DC0000");
  if (score <= 4) return hexToRgba(ok, 0.2);
  if (score <= 9) return hexToRgba(warn, 0.2);
  if (score <= 16) return hexToRgba(danger, 0.2);
  return hexToRgba(danger, 0.35);
}
function riskLevel(s) {
  if (s <= 4) return "Low";
  if (s <= 9) return "Medium";
  if (s <= 16) return "High";
  return "Critical";
}
function truncate3(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
}
function riskMatrix(canvas, opts) {
  let items = [...opts.items];
  let rafId = 0, hovered = null, animStart = 0;
  const shouldAnimate = opts.animate !== false;
  const w = canvas.getBoundingClientRect().width || 320;
  const h = opts.height ?? 320;
  const _ctx = chartHiDpi(canvas, w, h);
  if (!_ctx) return void 0;
  const ctx = _ctx;
  const gw = w - ML - MR, gh = h - MT - MB;
  const cellW = gw / 5, cellH = gh / 5;
  function cc(col, row) {
    return [ML + (col - 0.5) * cellW, MT + gh - (row - 0.5) * cellH];
  }
  function drawGrid(border, textMuted, textColor) {
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        const x = ML + (c - 1) * cellW, y = MT + gh - r * cellH;
        ctx.fillStyle = severityColor(r * c);
        ctx.fillRect(x, y, cellW, cellH);
        ctx.strokeStyle = border;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellW, cellH);
      }
    }
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(ML, MT, gw, gh);
    ctx.font = "10px system-ui,sans-serif";
    ctx.fillStyle = textMuted;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 1; i <= 5; i++) ctx.fillText(String(i), ML + (i - 0.5) * cellW, MT + gh + 4);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 1; i <= 5; i++) ctx.fillText(String(i), ML - 6, MT + gh - (i - 0.5) * cellH);
    ctx.font = "11px system-ui,sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Impact", ML + gw / 2, h - 16);
    ctx.save();
    ctx.translate(14, MT + gh / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Probability", 0, 0);
    ctx.restore();
    ctx.font = "9px system-ui,sans-serif";
    ctx.fillStyle = textMuted;
    ctx.globalAlpha = 0.6;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Low", ML + 4, MT + gh - 4);
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("Critical", ML + gw - 4, MT + 4);
    ctx.globalAlpha = 1;
  }
  function drawItems(scale, accent, textColor, border) {
    const cellMap = /* @__PURE__ */ new Map();
    for (const item of items) {
      const key = `${item.impact},${item.probability}`;
      const arr2 = cellMap.get(key) ?? [];
      arr2.push(item);
      cellMap.set(key, arr2);
    }
    for (const [, group] of cellMap) {
      for (let idx = 0; idx < Math.min(group.length, 4); idx++) {
        const item = group[idx];
        const [cx, cy] = cc(item.impact, item.probability);
        const [ox, oy] = OFFSETS[idx];
        const px = cx + ox, py = cy + oy, r = CIRCLE_R * scale;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = item.color ?? accent;
        ctx.fill();
        if (hovered?.id === item.id) {
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.font = "9px system-ui,sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(truncate3(item.label, 10), px, py + r + 2);
      }
    }
    if (hovered) drawTooltip(accent, textColor, border);
  }
  function drawTooltip(accent, textColor, border) {
    if (!hovered) return;
    const [cx, cy] = cc(hovered.impact, hovered.probability);
    const score = hovered.probability * hovered.impact;
    const tip = `${escapeHtml(hovered.label)} (P${hovered.probability}\xD7I${hovered.impact}=${score})`;
    ctx.font = "11px system-ui,sans-serif";
    const tw = ctx.measureText(tip).width + 12, th = 22;
    let tx = cx - tw / 2, ty = cy - CIRCLE_R - th - 6;
    if (tx < 2) tx = 2;
    if (tx + tw > w - 2) tx = w - tw - 2;
    if (ty < 2) ty = cy + CIRCLE_R + 6;
    ctx.fillStyle = cssVar("--mn-surface-raised");
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tip, tx + 6, ty + th / 2);
  }
  function draw(scale) {
    ctx.clearRect(0, 0, w, h);
    const border = cssVar("--mn-border");
    const textMuted = cssVar("--mn-text-muted");
    const textColor = cssVar("--mn-text");
    const accent = cssVar("--mn-accent");
    drawGrid(border, textMuted, textColor);
    drawItems(scale, accent, textColor, border);
  }
  function applyA11y() {
    const rows = items.map((it) => ({
      label: it.label,
      value: `P${it.probability} I${it.impact} \u2014 ${riskLevel(it.probability * it.impact)}`
    }));
    applyChartA11y(canvas, `Risk matrix with ${items.length} items`, rows);
  }
  function animateIn() {
    animStart = performance.now();
    const tick = (now) => {
      const t = Math.min((now - animStart) / ANIM_MS, 1);
      draw(1 - Math.pow(1 - t, 3));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }
  function hitTest2(mx, my) {
    const counts = /* @__PURE__ */ new Map();
    for (const item of items) {
      const key = `${item.impact},${item.probability}`;
      const idx = counts.get(key) ?? 0;
      counts.set(key, idx + 1);
      const [cx, cy] = cc(item.impact, item.probability);
      const [ox, oy] = OFFSETS[Math.min(idx, 3)];
      const dx = mx - (cx + ox), dy = my - (cy + oy);
      if (dx * dx + dy * dy <= CIRCLE_R * CIRCLE_R) return item;
    }
    return null;
  }
  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest2(e.clientX - rect.left, e.clientY - rect.top);
    if (hit?.id !== hovered?.id) {
      hovered = hit;
      opts.onHover?.(hit);
      draw(1);
    }
  }
  function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    const hit = hitTest2(e.clientX - rect.left, e.clientY - rect.top);
    if (hit) opts.onClick?.(hit);
  }
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("click", onClick);
  applyA11y();
  if (shouldAnimate) animateIn();
  else draw(1);
  return {
    update(newItems) {
      items = [...newItems];
      hovered = null;
      applyA11y();
      if (shouldAnimate) animateIn();
      else draw(1);
    },
    destroy() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains("mn-sr-only")) sr.remove();
    }
  };
}

// src/ts/kpi-scorecard.ts
var STATUS_LABELS3 = {
  green: "On track",
  yellow: "At risk",
  red: "Off track",
  neutral: "\u2014"
};
var STATUS_VARS = {
  green: "--signal-ok",
  yellow: "--signal-warning",
  red: "--signal-danger",
  neutral: "--mn-text-muted"
};
function resolveStatus(row) {
  if (row.status) return row.status;
  if (row.actual >= row.target) return "green";
  if (row.actual >= row.target * 0.8) return "yellow";
  return "red";
}
function fmtValue(val, fmt, currency) {
  if (fmt === "percent") return `${val}%`;
  if (fmt === "currency") {
    return `${currency}${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(val)}`;
  }
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(val);
}
function fmtDelta(delta, fmt, currency) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${fmtValue(delta, fmt, currency)}`;
}
function drawSparkline(canvas, data, color) {
  const w = 60;
  const h = 24;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const mn = Math.min(...data);
  const mx = Math.max(...data);
  const range = mx - mn || 1;
  const pad2 = 2;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad2 + i / (data.length - 1) * (w - pad2 * 2);
    const y = h - pad2 - (v - mn) / range * (h - pad2 * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.stroke();
}
function resolveColor3(varName, fallback) {
  return cssVar(varName, fallback);
}
var HEADERS = ["Metric", "Target", "Actual", "Delta", "Trend", "Status"];
function buildHead() {
  const ths = HEADERS.map(
    (h) => `<th class="mn-kpi__th" scope="col" role="columnheader">${h}</th>`
  ).join("");
  return `<thead><tr>${ths}</tr></thead>`;
}
function buildRow2(row, currency) {
  const s = resolveStatus(row);
  const delta = row.actual - row.target;
  const deltaCls = delta >= 0 ? "mn-kpi__delta--pos" : "mn-kpi__delta--neg";
  const dotCls = `mn-kpi__status-dot mn-kpi__status-dot--${s}`;
  const label = escapeHtml(row.label);
  const unit = row.unit ? ` <span class="mn-kpi__unit">${escapeHtml(row.unit)}</span>` : "";
  const fmt = row.format ?? "number";
  return [
    `<tr class="mn-kpi__row" role="row" tabindex="0" data-id="${escapeHtml(row.id)}">`,
    `<td class="mn-kpi__td mn-kpi__label">${label}${unit}</td>`,
    `<td class="mn-kpi__td mn-kpi__value">${fmtValue(row.target, fmt, currency)}</td>`,
    `<td class="mn-kpi__td mn-kpi__value">${fmtValue(row.actual, fmt, currency)}</td>`,
    `<td class="mn-kpi__td ${deltaCls}">${fmtDelta(delta, fmt, currency)}</td>`,
    `<td class="mn-kpi__td mn-kpi__trend"></td>`,
    `<td class="mn-kpi__td"><span class="${dotCls}"></span> ${escapeHtml(STATUS_LABELS3[s])}</td>`,
    "</tr>"
  ].join("");
}
function kpiScorecard(el5, rows, opts) {
  const currency = opts?.currency ?? "$";
  const onSelect = opts?.onSelect;
  const ac = new AbortController();
  function render5(data) {
    const bodyHtml = data.map((r) => buildRow2(r, currency)).join("");
    el5.innerHTML = [
      '<div class="mn-kpi">',
      `<table class="mn-kpi__table" role="table" aria-label="KPI Scorecard">`,
      buildHead(),
      `<tbody>${bodyHtml}</tbody>`,
      "</table></div>"
    ].join("");
    const trendCells = el5.querySelectorAll(".mn-kpi__trend");
    data.forEach((row, i) => {
      if (!row.trend || row.trend.length < 2) return;
      const cell = trendCells[i];
      if (!cell) return;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      const s = resolveStatus(row);
      const color = resolveColor3(STATUS_VARS[s], "#FFC72C");
      drawSparkline(canvas, row.trend, color);
      cell.appendChild(canvas);
    });
    if (onSelect) {
      el5.querySelectorAll(".mn-kpi__row").forEach((tr, i) => {
        const row = data[i];
        tr.addEventListener("click", () => onSelect(row), { signal: ac.signal });
        tr.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(row);
          }
        }, { signal: ac.signal });
      });
    }
  }
  render5(rows);
  return {
    update(newRows) {
      render5(newRows);
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
    }
  };
}

// src/ts/cohort-grid.ts
function parseHex(hex) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16)
    ];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}
function resolveColor4(color, cssVarName, fallback) {
  if (color && color.startsWith("#")) return color;
  if (color && color.startsWith("--")) return cssVar(color, fallback);
  return cssVar(cssVarName, fallback);
}
function lerpColor(low, high, t) {
  const ct = clamp(t, 0, 1);
  const r = Math.round(lerp(low[0], high[0], ct));
  const g = Math.round(lerp(low[1], high[1], ct));
  const b = Math.round(lerp(low[2], high[2], ct));
  return `rgb(${r},${g},${b})`;
}
function contrastText(r, g, b) {
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? "var(--mn-text-inverse)" : "var(--mn-text)";
}
function formatCellValue(retention, initialSize, showAbsolute) {
  if (showAbsolute) return formatNumber(Math.round(initialSize * retention));
  return `${(retention * 100).toFixed(0)}%`;
}
function periodLabel(labels, idx) {
  if (labels && labels[idx]) return labels[idx];
  return `Period ${idx}`;
}
function maxPeriods(rows) {
  let max = 0;
  for (const row of rows) {
    if (row.retention.length > max) max = row.retention.length;
  }
  return max;
}
function buildTable(el5, rows, opts, ac) {
  const showAbs = opts.showAbsolute ?? false;
  const highHex = resolveColor4(opts.colorHigh, "--signal-ok", "#00A651");
  const lowHex = resolveColor4(opts.colorLow, "--signal-danger", "#DC0000");
  const rgbHigh = parseHex(highHex);
  const rgbLow = parseHex(lowHex);
  const periods = maxPeriods(rows);
  const wrapper = document.createElement("div");
  wrapper.className = "mn-cohort";
  const table2 = document.createElement("table");
  table2.className = "mn-cohort__table";
  table2.setAttribute("role", "table");
  table2.setAttribute("aria-label", "Cohort retention grid");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const thCohort = document.createElement("th");
  thCohort.className = "mn-cohort__th mn-cohort__cell-label";
  thCohort.setAttribute("scope", "col");
  thCohort.setAttribute("role", "columnheader");
  thCohort.textContent = "Cohort";
  headerRow.appendChild(thCohort);
  for (let i = 0; i < periods; i++) {
    const th = document.createElement("th");
    th.className = "mn-cohort__th";
    th.setAttribute("scope", "col");
    th.setAttribute("role", "columnheader");
    th.textContent = periodLabel(opts.periodLabels, i);
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table2.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.className = "mn-cohort__row";
    const labelCell = document.createElement("td");
    labelCell.className = "mn-cohort__cell-label";
    labelCell.innerHTML = `${escapeHtml(row.label)} <span class="mn-cohort__size">(n=${escapeHtml(formatNumber(row.initialSize))})</span>`;
    tr.appendChild(labelCell);
    for (let i = 0; i < periods; i++) {
      const td = document.createElement("td");
      const retention = row.retention[i];
      if (retention === void 0 || retention === null) {
        td.className = "mn-cohort__cell mn-cohort__cell--empty";
        td.textContent = "\u2014";
        td.setAttribute(
          "aria-label",
          `${escapeHtml(row.label)} ${periodLabel(opts.periodLabels, i)}: no data`
        );
      } else {
        const value = formatCellValue(retention, row.initialSize, showAbs);
        const bg = lerpColor(rgbLow, rgbHigh, retention);
        const ct = clamp(retention, 0, 1);
        const r = Math.round(lerp(rgbLow[0], rgbHigh[0], ct));
        const g = Math.round(lerp(rgbLow[1], rgbHigh[1], ct));
        const b = Math.round(lerp(rgbLow[2], rgbHigh[2], ct));
        td.className = i === 0 ? "mn-cohort__cell mn-cohort__cell--base" : "mn-cohort__cell";
        td.textContent = value;
        td.style.backgroundColor = bg;
        td.style.color = contrastText(r, g, b);
        td.setAttribute(
          "aria-label",
          `${escapeHtml(row.label)} ${periodLabel(opts.periodLabels, i)}: ${value}`
        );
        if (opts.onHover) {
          const capturedRow = row;
          const capturedIdx = i;
          td.addEventListener("mouseover", () => {
            opts.onHover(capturedRow, capturedIdx, retention);
          }, { signal: ac.signal });
        }
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table2.appendChild(tbody);
  wrapper.appendChild(table2);
  el5.appendChild(wrapper);
}
function cohortGrid(el5, rows, opts) {
  let ac = new AbortController();
  const resolved = opts ?? {};
  buildTable(el5, rows, resolved, ac);
  return {
    update(newRows, newOpts) {
      ac.abort();
      ac = new AbortController();
      el5.innerHTML = "";
      const merged = { ...resolved, ...newOpts };
      buildTable(el5, newRows, merged, ac);
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
    }
  };
}

// src/ts/audit-log.ts
var SEVERITIES = ["info", "warning", "error", "critical", "success"];
var SEV_LABELS = {
  all: "All",
  info: "Info",
  warning: "Warning",
  error: "Error",
  critical: "Critical",
  success: "Success"
};
function buildEntry(entry, ac, onSelect) {
  const li = document.createElement("li");
  li.className = "mn-audit__entry";
  li.dataset.severity = entry.severity;
  li.dataset.id = entry.id;
  li.setAttribute("role", "listitem");
  li.setAttribute("tabindex", "0");
  li.setAttribute("aria-expanded", "false");
  const dot = document.createElement("span");
  dot.className = "mn-audit__timeline-dot";
  dot.setAttribute("aria-hidden", "true");
  const body = document.createElement("div");
  body.className = "mn-audit__body";
  const meta = document.createElement("div");
  meta.className = "mn-audit__meta";
  const ts = document.createElement("time");
  ts.className = "mn-audit__timestamp";
  ts.textContent = entry.timestamp;
  const actorSpan = document.createElement("span");
  actorSpan.className = "mn-audit__actor";
  actorSpan.innerHTML = escapeHtml(entry.actor) + (entry.actorRole ? ` <span class="mn-audit__actor-badge">${escapeHtml(entry.actorRole)}</span>` : "");
  meta.append(ts, actorSpan);
  const actionDiv = document.createElement("div");
  actionDiv.className = "mn-audit__action";
  actionDiv.innerHTML = `<strong>${escapeHtml(entry.action)}</strong>` + (entry.resource ? ` <span class="mn-audit__resource">${escapeHtml(entry.resource)}</span>` : "");
  body.append(meta, actionDiv);
  const expand = document.createElement("div");
  expand.className = "mn-audit__expand";
  expand.setAttribute("aria-hidden", "true");
  if (entry.metadata || entry.ipAddress) {
    const chips = document.createElement("div");
    chips.className = "mn-audit__chips";
    const mkChip = (key, val) => {
      const c = document.createElement("span");
      c.className = "mn-audit__chip";
      c.innerHTML = `<span class="mn-audit__chip-key">${escapeHtml(key)}</span> ${escapeHtml(val)}`;
      chips.appendChild(c);
    };
    if (entry.ipAddress) mkChip("IP", entry.ipAddress);
    if (entry.metadata) for (const [k, v] of Object.entries(entry.metadata)) mkChip(k, v);
    expand.appendChild(chips);
  }
  body.appendChild(expand);
  li.append(dot, body);
  const toggle = () => {
    const open = li.getAttribute("aria-expanded") === "true";
    li.setAttribute("aria-expanded", String(!open));
    expand.setAttribute("aria-hidden", String(open));
    if (!open) onSelect?.(entry);
  };
  li.addEventListener("click", toggle, { signal: ac.signal });
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
    if (e.key === "Escape" && li.getAttribute("aria-expanded") === "true") {
      li.setAttribute("aria-expanded", "false");
      expand.setAttribute("aria-hidden", "true");
    }
  }, { signal: ac.signal });
  return li;
}
function updateCounts(header2, list) {
  const items = list.querySelectorAll(".mn-audit__entry");
  const counts = { all: items.length };
  for (const sev of SEVERITIES) counts[sev] = 0;
  items.forEach((li) => {
    const s = li.dataset.severity ?? "";
    counts[s] = (counts[s] ?? 0) + 1;
  });
  header2.querySelectorAll(".mn-audit__tab").forEach((tab) => {
    const badge = tab.querySelector(".mn-audit__tab-count");
    if (badge) badge.textContent = String(counts[tab.dataset.filter ?? "all"] ?? 0);
  });
}
function prune(list, max) {
  while (list.children.length > max) list.removeChild(list.lastChild);
}
function auditLog(el5, entries = [], opts = {}) {
  const max = opts.maxEntries ?? 100;
  const filterable = opts.filterable ?? true;
  const ac = new AbortController();
  let activeFilter = "all";
  el5.classList.add("mn-audit");
  el5.setAttribute("role", "log");
  el5.setAttribute("aria-label", "Audit log");
  el5.innerHTML = "";
  const header2 = document.createElement("div");
  header2.className = "mn-audit__header";
  const tabBar = document.createElement("div");
  tabBar.className = "mn-audit__tabs";
  tabBar.setAttribute("role", "tablist");
  if (filterable) {
    for (const key of ["all", ...SEVERITIES]) {
      const btn = document.createElement("button");
      btn.className = "mn-audit__tab";
      btn.dataset.filter = key;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", key === "all" ? "true" : "false");
      btn.innerHTML = `${SEV_LABELS[key]} <span class="mn-audit__tab-count">0</span>`;
      tabBar.appendChild(btn);
    }
  }
  header2.appendChild(tabBar);
  el5.appendChild(header2);
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "mn-sr-only";
  el5.appendChild(liveRegion);
  const list = document.createElement("ul");
  list.className = "mn-audit__list";
  list.setAttribute("role", "list");
  el5.appendChild(list);
  for (const entry of entries) {
    list.appendChild(buildEntry(entry, ac, opts.onSelect));
  }
  prune(list, max);
  updateCounts(header2, list);
  const applyFilter = (sev) => {
    activeFilter = sev;
    tabBar.querySelectorAll(".mn-audit__tab").forEach((tab) => {
      tab.setAttribute("aria-selected", tab.dataset.filter === sev ? "true" : "false");
    });
    list.querySelectorAll(".mn-audit__entry").forEach((li) => {
      li.style.display = sev === "all" || li.dataset.severity === sev ? "" : "none";
    });
  };
  tabBar.addEventListener("click", (e) => {
    const tab = e.target.closest(".mn-audit__tab");
    if (tab?.dataset.filter) applyFilter(tab.dataset.filter);
  }, { signal: ac.signal });
  const addEntry = (entry, position) => {
    const node = buildEntry(entry, ac, opts.onSelect);
    if (opts.live && position === "prepend") node.classList.add("mn-audit__entry--slide-in");
    if (position === "prepend") {
      list.insertBefore(node, list.firstChild);
      liveRegion.textContent = `${entry.actor}: ${entry.action}`;
    } else {
      list.appendChild(node);
    }
    if (activeFilter !== "all" && entry.severity !== activeFilter) node.style.display = "none";
    prune(list, max);
    updateCounts(header2, list);
  };
  return {
    prepend: (entry) => addEntry(entry, "prepend"),
    append: (entry) => addEntry(entry, "append"),
    setFilter: applyFilter,
    clear: () => {
      list.innerHTML = "";
      updateCounts(header2, list);
    },
    destroy: () => {
      ac.abort();
      el5.innerHTML = "";
      el5.classList.remove("mn-audit");
    }
  };
}

// src/ts/agent-cost-breakdown.ts
var COMPACT_FMT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});
var CURRENCY_FMT = (currency) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency,
  minimumFractionDigits: 2
});
var COLS = [
  { key: "agentName", label: "Agent", cls: "" },
  { key: "model", label: "Model", cls: "" },
  { key: "totalTokens", label: "Tokens", cls: "num" },
  { key: "cachedPct", label: "Cached%", cls: "num" },
  { key: "cost", label: "Cost", cls: "num" },
  { key: "costDelta", label: "\u0394", cls: "num" },
  { key: "calls", label: "Calls", cls: "num" },
  { key: "avgLatencyMs", label: "Avg Latency", cls: "num hide-mobile" },
  { key: "budget", label: "Budget", cls: "" },
  { key: "tags", label: "Tags", cls: "hide-mobile" }
];
function cachedPct(row) {
  if (!row.cachedTokens || !row.totalTokens) return 0;
  return row.cachedTokens / row.totalTokens * 100;
}
function sortVal(row, key) {
  if (key === "cachedPct") return cachedPct(row);
  const v = row[key];
  return v ?? 0;
}
function sortRows(rows, st) {
  return [...rows].sort((a, b) => {
    const va = sortVal(a, st.key);
    const vb = sortVal(b, st.key);
    const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
    return st.dir === "asc" ? cmp : -cmp;
  });
}
function modelAttr(model) {
  const m = model.toLowerCase();
  if (m.includes("sonnet")) return "sonnet";
  if (m.includes("haiku")) return "haiku";
  if (m.includes("opus")) return "opus";
  return "other";
}
function cachedClass(pct3) {
  if (pct3 > 30) return "mn-cost-breakdown__cached--high";
  if (pct3 >= 10) return "mn-cost-breakdown__cached--mid";
  return "mn-cost-breakdown__cached--low";
}
function budgetHtml(row) {
  if (row.budget == null) return '<td class="mn-cost-breakdown__cell">&mdash;</td>';
  const pct3 = Math.min(row.cost / row.budget * 100, 100);
  const alert = pct3 > 80 ? " mn-cost-breakdown__budget--alert" : "";
  return `<td class="mn-cost-breakdown__cell">
    <span class="mn-cost-breakdown__budget-label">${COMPACT_FMT.format(row.budget)}</span>
    <span class="mn-cost-breakdown__budget-bar">
      <span class="mn-cost-breakdown__budget-fill${alert}" style="width:${pct3.toFixed(1)}%"></span>
    </span></td>`;
}
function deltaHtml(delta) {
  if (delta == null) return '<td class="mn-cost-breakdown__cell num">&mdash;</td>';
  const cls = delta > 0 ? "mn-cost-breakdown__delta--up" : "mn-cost-breakdown__delta--down";
  const arrow = delta > 0 ? "\u25B2" : "\u25BC";
  return `<td class="mn-cost-breakdown__cell num ${cls}">${arrow} ${Math.abs(delta).toFixed(1)}%</td>`;
}
function tagsHtml(tags) {
  if (!tags?.length) return '<td class="mn-cost-breakdown__cell hide-mobile">&mdash;</td>';
  const pills = tags.slice(0, 2).map(
    (t) => `<span class="mn-cost-breakdown__tag">${escapeHtml(t)}</span>`
  ).join("");
  return `<td class="mn-cost-breakdown__cell hide-mobile">${pills}</td>`;
}
function rowHtml(row, fmt) {
  const cp = cachedPct(row);
  const lat = row.avgLatencyMs != null ? `${row.avgLatencyMs.toLocaleString()}ms` : "&mdash;";
  return `<tr data-id="${escapeHtml(row.id)}">
    <td class="mn-cost-breakdown__cell"><strong>${escapeHtml(row.agentName)}</strong></td>
    <td class="mn-cost-breakdown__cell">
      <span class="mn-cost-breakdown__model" data-model="${modelAttr(row.model)}">${escapeHtml(row.model)}</span></td>
    <td class="mn-cost-breakdown__cell num">${COMPACT_FMT.format(row.totalTokens)}</td>
    <td class="mn-cost-breakdown__cell num">
      <span class="${cachedClass(cp)}">${cp.toFixed(0)}%</span></td>
    <td class="mn-cost-breakdown__cell num"><strong>${fmt.format(row.cost)}</strong></td>
    ${deltaHtml(row.costDelta)}
    <td class="mn-cost-breakdown__cell num">${row.calls.toLocaleString()}</td>
    <td class="mn-cost-breakdown__cell num hide-mobile">${lat}</td>
    ${budgetHtml(row)}
    ${tagsHtml(row.tags)}</tr>`;
}
function footerHtml(rows, fmt) {
  const totTokens = rows.reduce((s, r) => s + r.totalTokens, 0);
  const totCost = rows.reduce((s, r) => s + r.cost, 0);
  const totCalls = rows.reduce((s, r) => s + r.calls, 0);
  return `<tr class="mn-cost-breakdown__footer-row">
    <td class="mn-cost-breakdown__cell" colspan="2"><strong>Total</strong></td>
    <td class="mn-cost-breakdown__cell num"><strong>${COMPACT_FMT.format(totTokens)}</strong></td>
    <td class="mn-cost-breakdown__cell">&nbsp;</td>
    <td class="mn-cost-breakdown__cell num"><strong>${fmt.format(totCost)}</strong></td>
    <td class="mn-cost-breakdown__cell">&nbsp;</td>
    <td class="mn-cost-breakdown__cell num"><strong>${totCalls.toLocaleString()}</strong></td>
    <td class="mn-cost-breakdown__cell hide-mobile" colspan="3">&nbsp;</td></tr>`;
}
function agentCostBreakdown(el5, rows, opts) {
  const currency = opts?.currency ?? "USD";
  const period = opts?.period ?? "This period";
  const sortable = opts?.sortable !== false;
  const fmt = CURRENCY_FMT(currency);
  const ac = new AbortController();
  const sort = { key: "cost", dir: "desc" };
  function renderAll(data) {
    const sorted = sortRows(data, sort);
    const totalCost = data.reduce((s, r) => s + r.cost, 0);
    if (opts?.onBudgetAlert) {
      for (const r of data) {
        if (r.budget != null && r.cost > r.budget * 0.8) opts.onBudgetAlert(r);
      }
    }
    const thCells = COLS.map((c) => {
      const aria = sortable && sort.key === c.key ? ` aria-sort="${sort.dir === "asc" ? "ascending" : "descending"}"` : "";
      const sortCls = sortable ? " sortable" : "";
      return `<th class="mn-cost-breakdown__th ${c.cls}${sortCls}" data-sort="${c.key}"${aria}>${c.label}</th>`;
    }).join("");
    el5.innerHTML = `<div class="mn-cost-breakdown">
      <div class="mn-cost-breakdown__header">
        <div class="mn-cost-breakdown__title-group">
          <h3 class="mn-cost-breakdown__title">Agent Cost Breakdown</h3>
          <span class="mn-cost-breakdown__period">${escapeHtml(period)}</span>
        </div>
        <span class="mn-cost-breakdown__total">${fmt.format(totalCost)}</span>
      </div>
      <div class="mn-cost-breakdown__table-wrap">
        <table class="mn-cost-breakdown__table" role="table">
          <thead><tr>${thCells}</tr></thead>
          <tbody>${sorted.map((r) => rowHtml(r, fmt)).join("")}</tbody>
          <tfoot>${footerHtml(data, fmt)}</tfoot>
        </table>
      </div></div>`;
  }
  let current2 = rows.slice();
  renderAll(current2);
  if (sortable) {
    el5.addEventListener("click", (e) => {
      const th = e.target.closest(".mn-cost-breakdown__th");
      if (!th?.dataset.sort) return;
      const key = th.dataset.sort;
      sort.dir = sort.key === key && sort.dir === "asc" ? "desc" : "asc";
      sort.key = key;
      renderAll(current2);
    }, { signal: ac.signal });
  }
  if (opts?.onSelect) {
    el5.addEventListener("click", (e) => {
      const tr = e.target.closest("tbody tr[data-id]");
      if (!tr) return;
      const id = tr.dataset.id;
      const row = current2.find((r) => r.id === id);
      if (row) opts.onSelect(row);
    }, { signal: ac.signal });
  }
  return {
    update(newRows) {
      current2 = newRows.slice();
      renderAll(current2);
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
    }
  };
}

// src/ts/charts-cost-timeline.ts
var PAD2 = { top: 20, right: 16, bottom: 36, left: 52 };
var GRID_LINES = 5;
var ANIM_MS2 = 600;
var COLOR_VARS = [
  ["--mn-accent", "#FFC72C"],
  ["--signal-info", "#3B82F6"],
  ["--signal-ok", "#00A651"],
  ["--signal-warning", "#FFC72C"],
  ["--signal-danger", "#DC0000"],
  ["--mn-text-muted", "#888888"]
];
function resolveColor5(series, idx) {
  if (series.color) return series.color.startsWith("--") ? cssVar(series.color, "#888") : series.color;
  const [v, fb] = COLOR_VARS[idx % COLOR_VARS.length];
  return cssVar(v, fb);
}
function fmtY(val, unit) {
  if (val >= 1e6) return `${unit}${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${unit}${(val / 1e3).toFixed(1)}k`;
  return `${unit}${Math.round(val)}`;
}
function buildStacks(series) {
  const n = series[0]?.values.length ?? 0, stacks = [];
  for (let s = 0; s < series.length; s++) {
    stacks[s] = Array.from({ length: n }, (_, i) => (series[s].values[i] ?? 0) + (s > 0 ? stacks[s - 1][i] : 0));
  }
  return stacks;
}
function easeOut2(t) {
  return 1 - (1 - t) ** 3;
}
function costTimeline(canvas, opts) {
  let cfg = {
    ...opts,
    height: opts.height ?? 200,
    stacked: opts.stacked ?? true,
    animate: opts.animate ?? true,
    unit: opts.unit ?? "$"
  };
  let rafId = 0;
  let hoverX = -1;
  function draw(clipFrac) {
    const w = Math.max(canvas.getBoundingClientRect().width, 200);
    const h = cfg.height;
    const ctx = chartHiDpi(canvas, w, h);
    if (!ctx) return;
    const n = cfg.labels.length;
    if (n < 2 || cfg.series.length === 0) return;
    const plotW = w - PAD2.left - PAD2.right;
    const plotH = h - PAD2.top - PAD2.bottom;
    const xStep = plotW / (n - 1);
    const gx = (i) => PAD2.left + i * xStep;
    const stacks = cfg.stacked ? buildStacks(cfg.series) : [];
    const maxVal = cfg.stacked ? Math.max(...stacks[stacks.length - 1] ?? [1]) * 1.1 : Math.max(...cfg.series.flatMap((s) => s.values)) * 1.1 || 1;
    const gy = (v) => PAD2.top + plotH - v / maxVal * plotH;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, PAD2.left + plotW * clipFrac + PAD2.right, h);
    ctx.clip();
    const borderColor = cssVar("--mn-border");
    ctx.strokeStyle = hexToRgba(borderColor.startsWith("#") ? borderColor : "#333333", 0.3);
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 0.5;
    const mutedColor = cssVar("--mn-text-muted");
    for (let g = 0; g <= GRID_LINES; g++) {
      const val = maxVal / GRID_LINES * g;
      const yy = gy(val);
      ctx.beginPath();
      ctx.moveTo(PAD2.left, yy);
      ctx.lineTo(w - PAD2.right, yy);
      ctx.stroke();
      ctx.fillStyle = mutedColor;
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(fmtY(val, cfg.unit), PAD2.left - 6, yy + 3);
    }
    ctx.setLineDash([]);
    for (let s = cfg.series.length - 1; s >= 0; s--) {
      const color = resolveColor5(cfg.series[s], s);
      const hex = color.startsWith("#") ? color : "#888888";
      const fillAlpha = cfg.stacked ? 0.25 : 0.15;
      const top = cfg.stacked ? stacks[s] : cfg.series[s].values;
      const bot = cfg.stacked && s > 0 ? stacks[s - 1] : null;
      ctx.beginPath();
      ctx.moveTo(gx(0), gy(top[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(gx(i), gy(top[i]));
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(gx(i), gy(bot ? bot[i] : 0));
      ctx.closePath();
      ctx.fillStyle = hexToRgba(hex, fillAlpha);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(gx(0), gy(top[0]));
      for (let i = 1; i < n; i++) ctx.lineTo(gx(i), gy(top[i]));
      ctx.strokeStyle = hexToRgba(hex, 0.8);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = mutedColor;
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    const skipX = Math.ceil(n / (plotW / 48));
    for (let i = 0; i < n; i += skipX) {
      ctx.fillText(cfg.labels[i], gx(i), h - PAD2.bottom + 14);
    }
    ctx.font = "9px sans-serif";
    ctx.textAlign = "left";
    const legY = h - 6;
    const legItems = cfg.series.map((s, i) => ({
      label: s.label,
      color: resolveColor5(s, i),
      width: ctx.measureText(s.label).width + 16
    }));
    const totalLegW = legItems.reduce((a, l) => a + l.width + 8, -8);
    let legX = PAD2.left + (plotW - totalLegW) / 2;
    for (const item of legItems) {
      ctx.fillStyle = item.color;
      ctx.fillRect(legX, legY - 6, 8, 8);
      ctx.fillStyle = mutedColor;
      ctx.fillText(item.label, legX + 12, legY);
      legX += item.width + 8;
    }
    if (hoverX >= PAD2.left && hoverX <= w - PAD2.right) {
      const idx = Math.round((hoverX - PAD2.left) / xStep);
      const ci = Math.max(0, Math.min(n - 1, idx));
      const rx = gx(ci);
      ctx.strokeStyle = hexToRgba(cssVar("--mn-text").startsWith("#") ? cssVar("--mn-text") : "#ffffff", 0.4);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(rx, PAD2.top);
      ctx.lineTo(rx, h - PAD2.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let s = 0; s < cfg.series.length; s++) {
        const color = resolveColor5(cfg.series[s], s);
        const hex = color.startsWith("#") ? color : "#888888";
        const yVal = cfg.stacked ? stacks[s][ci] : cfg.series[s].values[ci];
        const py = gy(yVal);
        const cr = parseInt(hex.slice(1, 3), 16);
        const cg = parseInt(hex.slice(3, 5), 16);
        const cb = parseInt(hex.slice(5, 7), 16);
        ctx.beginPath();
        ctx.arc(rx, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.25)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = hex;
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      drawTooltip(ctx, cfg, ci, rx, w);
      if (cfg.onHover) {
        const vals = {};
        cfg.series.forEach((s) => {
          vals[s.id] = s.values[ci] ?? 0;
        });
        cfg.onHover(cfg.labels[ci], vals);
      }
    }
    ctx.restore();
  }
  function drawTooltip(ctx, c, idx, rx, w) {
    const lines = [c.labels[idx], ...c.series.map((s) => `${s.label}: ${c.unit}${(s.values[idx] ?? 0).toFixed(2)}`)];
    ctx.font = "10px sans-serif";
    const tw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 16;
    const th = lines.length * 14 + 10;
    const tx = rx + 12 + tw > w ? rx - tw - 8 : rx + 12, ty = PAD2.top + 4;
    const bg = cssVar("--mn-surface"), border = cssVar("--mn-border");
    ctx.fillStyle = bg.startsWith("#") ? bg : "#1a1a1a";
    ctx.strokeStyle = border.startsWith("#") ? border : "#333333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = cssVar("--mn-text");
    lines.forEach((l, i) => {
      ctx.font = i === 0 ? "bold 10px sans-serif" : "10px sans-serif";
      ctx.fillText(l, tx + 8, ty + 14 + i * 14);
    });
  }
  function animate() {
    if (!cfg.animate) {
      draw(1);
      return;
    }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / ANIM_MS2, 1);
      draw(easeOut2(t));
      if (t < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  }
  const onMove = (e) => {
    hoverX = e.offsetX;
    draw(1);
  };
  const onLeave = () => {
    hoverX = -1;
    draw(1);
  };
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseleave", onLeave);
  function applySrOnly() {
    const hdrs = cfg.series.map((s) => escapeHtml(s.label));
    const rows = cfg.labels.map((lbl, i) => {
      const cells = cfg.series.map((s) => `<td>${cfg.unit}${(s.values[i] ?? 0).toFixed(2)}</td>`);
      return `<tr><th scope="row">${escapeHtml(lbl)}</th>${cells.join("")}</tr>`;
    }).join("");
    const tbl = `<table><caption>Cost timeline</caption><thead><tr><th>Period</th>` + hdrs.map((h) => `<th>${h}</th>`).join("") + `</tr></thead><tbody>${rows}</tbody></table>`;
    applyChartA11y(canvas, `Cost timeline: ${cfg.series.length} series over ${cfg.labels.length} periods`);
    const sr = canvas.nextElementSibling;
    if (sr?.classList.contains("mn-sr-only")) sr.innerHTML = tbl;
  }
  applySrOnly();
  animate();
  return {
    update(partial) {
      cfg = {
        ...cfg,
        ...partial,
        height: partial.height ?? cfg.height,
        stacked: partial.stacked ?? cfg.stacked,
        animate: partial.animate ?? cfg.animate,
        unit: partial.unit ?? cfg.unit
      };
      cancelAnimationFrame(rafId);
      applySrOnly();
      animate();
    },
    destroy() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      const sr = canvas.nextElementSibling;
      if (sr?.classList.contains("mn-sr-only")) sr.remove();
    }
  };
}

// src/ts/business-model-canvas.ts
var BLOCK_IDS = [
  "key-partners",
  "key-activities",
  "key-resources",
  "value-proposition",
  "customer-relationships",
  "channels",
  "customer-segments",
  "cost-structure",
  "revenue-streams"
];
var DEFAULTS3 = {
  "key-partners": { title: "Key Partners", icon: "KP" },
  "key-activities": { title: "Key Activities", icon: "KA" },
  "key-resources": { title: "Key Resources", icon: "KR" },
  "value-proposition": { title: "Value Proposition", icon: "VP" },
  "customer-relationships": { title: "Customer Relationships", icon: "CR" },
  "channels": { title: "Channels", icon: "CH" },
  "customer-segments": { title: "Customer Segments", icon: "CS" },
  "cost-structure": { title: "Cost Structure", icon: "C$" },
  "revenue-streams": { title: "Revenue Streams", icon: "R$" }
};
var AREA = {
  "key-partners": "kp",
  "key-activities": "ka",
  "key-resources": "kr",
  "value-proposition": "vp",
  "customer-relationships": "cr",
  "channels": "ch",
  "customer-segments": "cs",
  "cost-structure": "co",
  "revenue-streams": "rs"
};
function genId2() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function buildBlock(blockId, title, icon, uid2, editable) {
  const div = document.createElement("div");
  div.className = `mn-bmc__block mn-bmc__block--${AREA[blockId]}`;
  div.setAttribute("role", "group");
  div.dataset.block = blockId;
  const hdrId = `bmc-${uid2}-${blockId}-hdr`;
  div.setAttribute("aria-labelledby", hdrId);
  const hdr = document.createElement("div");
  hdr.className = "mn-bmc__header";
  hdr.id = hdrId;
  const badge = document.createElement("span");
  badge.className = "mn-bmc__icon";
  badge.textContent = icon;
  const lbl = document.createElement("span");
  lbl.className = "mn-bmc__title";
  lbl.textContent = title;
  hdr.append(badge, lbl);
  const list = document.createElement("ul");
  list.className = "mn-bmc__list";
  list.setAttribute("role", "list");
  list.setAttribute("aria-label", `${title} items`);
  div.append(hdr, list);
  if (editable) {
    const addBtn = document.createElement("button");
    addBtn.className = "mn-bmc__add";
    addBtn.type = "button";
    addBtn.setAttribute("aria-label", `Add ${title.toLowerCase()}`);
    addBtn.textContent = "+ Add";
    const wrap = document.createElement("div");
    wrap.className = "mn-bmc__input-wrap";
    wrap.hidden = true;
    const input = document.createElement("input");
    input.className = "mn-input mn-bmc__input";
    input.type = "text";
    input.placeholder = "Enter item\u2026";
    input.setAttribute("aria-label", `New ${title.toLowerCase()}`);
    const confirm = document.createElement("button");
    confirm.className = "mn-bmc__confirm";
    confirm.type = "button";
    confirm.setAttribute("aria-label", "Confirm");
    confirm.textContent = "\u21B5";
    wrap.append(input, confirm);
    div.append(addBtn, wrap);
  }
  return div;
}
function buildItemEl2(item, editable) {
  const li = document.createElement("li");
  li.className = "mn-bmc__item";
  li.setAttribute("role", "listitem");
  li.dataset.id = item.id;
  const span = document.createElement("span");
  span.className = "mn-bmc__text";
  span.textContent = item.text;
  li.append(span);
  if (editable) {
    const btn = document.createElement("button");
    btn.className = "mn-bmc__remove";
    btn.type = "button";
    btn.setAttribute("aria-label", `Remove: ${escapeHtml(item.text)}`);
    btn.textContent = "\xD7";
    li.append(btn);
  }
  return li;
}
function businessModelCanvas(el5, opts) {
  const editable = opts?.editable !== false;
  const uid2 = genId2().slice(0, 8);
  const blocks = BLOCK_IDS.map((id) => ({
    id,
    title: opts?.blocks?.[id]?.title ?? DEFAULTS3[id].title,
    icon: opts?.blocks?.[id]?.icon ?? DEFAULTS3[id].icon,
    items: [...opts?.blocks?.[id]?.items ?? []]
  }));
  el5.classList.add("mn-bmc");
  el5.setAttribute("role", "region");
  el5.setAttribute("aria-label", "Business Model Canvas");
  const blockEls = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    const bEl = buildBlock(b.id, b.title, b.icon, uid2, editable);
    blockEls.set(b.id, bEl);
    el5.append(bEl);
  }
  function notify() {
    opts?.onChange?.(blocks.map((b) => ({ ...b, items: [...b.items] })));
  }
  function findBlock(id) {
    return blocks.find((b) => b.id === id);
  }
  function renderItems() {
    for (const b of blocks) {
      const list = blockEls.get(b.id).querySelector(".mn-bmc__list");
      list.innerHTML = "";
      for (const item of b.items) list.append(buildItemEl2(item, editable));
    }
  }
  function addItem(blockId, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item = { id: genId2(), text: trimmed, blockId };
    findBlock(blockId).items.push(item);
    const list = blockEls.get(blockId).querySelector(".mn-bmc__list");
    list.append(buildItemEl2(item, editable));
    notify();
  }
  function removeItem(id) {
    const li = el5.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (li) {
      li.classList.add("mn-bmc__item--removing");
      setTimeout(() => li.remove(), 200);
    }
    for (const b of blocks) b.items = b.items.filter((i) => i.id !== id);
    notify();
  }
  function hideInput(bEl) {
    const wrap = bEl.querySelector(".mn-bmc__input-wrap");
    const addBtn = bEl.querySelector(".mn-bmc__add");
    if (wrap) wrap.hidden = true;
    if (addBtn) addBtn.hidden = false;
  }
  function handleClick(e) {
    const target = e.target;
    if (target.closest(".mn-bmc__remove")) {
      const li = target.closest(".mn-bmc__item");
      if (li?.dataset.id) removeItem(li.dataset.id);
      return;
    }
    if (target.closest(".mn-bmc__add")) {
      const bEl = target.closest(".mn-bmc__block");
      const wrap = bEl.querySelector(".mn-bmc__input-wrap");
      const addBtn = bEl.querySelector(".mn-bmc__add");
      wrap.hidden = false;
      addBtn.hidden = true;
      const input = wrap.querySelector("input");
      input.value = "";
      input.focus();
      return;
    }
    if (target.closest(".mn-bmc__confirm")) {
      const bEl = target.closest(".mn-bmc__block");
      const input = bEl.querySelector(".mn-bmc__input");
      addItem(bEl.dataset.block, input.value);
      hideInput(bEl);
    }
  }
  function handleKeydown(e) {
    const target = e.target;
    if (!target.classList.contains("mn-bmc__input")) return;
    const bEl = target.closest(".mn-bmc__block");
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(bEl.dataset.block, target.value);
      hideInput(bEl);
    } else if (e.key === "Escape") {
      hideInput(bEl);
      bEl.querySelector(".mn-bmc__add")?.focus();
    }
  }
  el5.addEventListener("click", handleClick);
  el5.addEventListener("keydown", handleKeydown);
  renderItems();
  return {
    getBlocks: () => blocks.map((b) => ({ ...b, items: [...b.items] })),
    addItem,
    removeItem,
    update(newBlocks) {
      blocks.length = 0;
      blocks.push(...newBlocks.map((b) => ({ ...b, items: [...b.items] })));
      renderItems();
      notify();
    },
    destroy() {
      el5.removeEventListener("click", handleClick);
      el5.removeEventListener("keydown", handleKeydown);
      el5.innerHTML = "";
      el5.classList.remove("mn-bmc");
      el5.removeAttribute("role");
      el5.removeAttribute("aria-label");
    }
  };
}

// src/ts/user-table.ts
var CLS = "mn-user-table";
var AVATAR_COLORS = 6;
function initials2(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
function nameHash(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i) | 0;
  return Math.abs(h) % AVATAR_COLORS;
}
function statusLabel2(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function teamsHtml(teams) {
  if (!teams || teams.length === 0) return '<span class="' + CLS + '__empty">&mdash;</span>';
  const visible = teams.slice(0, 2).map(
    (t) => `<span class="${CLS}__team">${escapeHtml(t)}</span>`
  );
  if (teams.length > 2) visible.push(`<span class="${CLS}__team ${CLS}__team--more">+${teams.length - 2}</span>`);
  return visible.join("");
}
function avatarHtml(user) {
  if (user.avatarUrl) {
    return `<img class="${CLS}__avatar" src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)}" />`;
  }
  const ci = nameHash(user.name);
  return `<div class="${CLS}__avatar ${CLS}__avatar--initials" data-color="${ci}">${escapeHtml(initials2(user.name))}</div>`;
}
function actionsHtml(user) {
  const sus = user.status === "invited" ? `<button class="${CLS}__action" data-act="resend-invite" title="Resend invite" aria-label="Resend invite to ${escapeHtml(user.name)}">&#8617;</button>` : `<button class="${CLS}__action" data-act="suspend" title="Suspend" aria-label="Suspend ${escapeHtml(user.name)}">&#8856;</button>`;
  return `<div class="${CLS}__actions"><button class="${CLS}__action" data-act="edit" title="Edit" aria-label="Edit ${escapeHtml(user.name)}">&#9998;</button>` + sus + `<button class="${CLS}__action ${CLS}__action--danger" data-act="delete" title="Delete" aria-label="Delete ${escapeHtml(user.name)}">&#10005;</button></div>`;
}
function rowHtml2(user, selectable) {
  const chk = selectable ? `<td class="${CLS}__td ${CLS}__td--check"><input type="checkbox" class="${CLS}__check" aria-label="Select ${escapeHtml(user.name)}" /></td>` : "";
  return `<tr class="${CLS}__row" role="row" tabindex="0" data-uid="${escapeHtml(user.id)}">` + chk + `<td class="${CLS}__td ${CLS}__td--user"><div class="${CLS}__identity">${avatarHtml(user)}<div class="${CLS}__name-group"><span class="${CLS}__name">${escapeHtml(user.name)}</span><span class="${CLS}__email">${escapeHtml(user.email)}</span></div></div></td><td class="${CLS}__td"><span class="${CLS}__status ${CLS}__status--${user.status}" aria-label="Status: ${statusLabel2(user.status)}">${statusLabel2(user.status)}</span></td><td class="${CLS}__td"><span class="${CLS}__role">${escapeHtml(user.role)}</span></td><td class="${CLS}__td ${CLS}__td--teams">${teamsHtml(user.teams)}</td><td class="${CLS}__td ${CLS}__td--last">${user.lastActive ? escapeHtml(user.lastActive) : "&mdash;"}</td><td class="${CLS}__td ${CLS}__td--actions">${actionsHtml(user)}</td></tr>`;
}
function userTable(el5, users, opts) {
  const o = { searchable: true, selectable: true, pageSize: 10, ...opts };
  const ac = new AbortController();
  const sig = ac.signal;
  let data = users.slice();
  let filtered = data;
  let selected = /* @__PURE__ */ new Set();
  let query = "";
  function applyFilter() {
    const q = query.toLowerCase();
    filtered = q ? data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) : data;
  }
  function renderCount() {
    const badge = el5.querySelector(`.${CLS}__count`);
    if (badge) badge.textContent = `${filtered.length} user${filtered.length !== 1 ? "s" : ""}`;
  }
  function renderBody3() {
    const tbody2 = el5.querySelector("tbody");
    if (!tbody2) return;
    tbody2.innerHTML = filtered.map((u) => rowHtml2(u, o.selectable)).join("");
    renderCount();
    if (o.selectable) {
      tbody2.querySelectorAll(`.${CLS}__check`).forEach((cb) => {
        const uid2 = cb.closest("tr")?.dataset.uid ?? "";
        cb.checked = selected.has(uid2);
      });
    }
  }
  const toolbar = o.searchable ? `<div class="${CLS}__toolbar"><input type="search" class="${CLS}__search" placeholder="Search users\u2026" aria-label="Search users" /><span class="${CLS}__count"></span></div>` : `<div class="${CLS}__toolbar"><span class="${CLS}__count"></span></div>`;
  const thCheck = o.selectable ? `<th class="${CLS}__th ${CLS}__th--check" scope="col"><input type="checkbox" class="${CLS}__check-all" aria-label="Select all" /></th>` : "";
  const head = `<thead><tr role="row">${thCheck}<th class="${CLS}__th" scope="col">User</th><th class="${CLS}__th" scope="col">Status</th><th class="${CLS}__th" scope="col">Role</th><th class="${CLS}__th ${CLS}__th--teams" scope="col">Teams</th><th class="${CLS}__th" scope="col">Last active</th><th class="${CLS}__th ${CLS}__th--actions" scope="col"><span class="mn-sr-only">Actions</span></th></tr></thead>`;
  el5.innerHTML = toolbar + `<div class="${CLS}__wrap"><table class="${CLS}" role="table">${head}<tbody></tbody></table></div>`;
  applyFilter();
  renderBody3();
  if (o.searchable) {
    const input = el5.querySelector(`.${CLS}__search`);
    const handler = debounce((e) => {
      query = e.target.value;
      applyFilter();
      renderBody3();
    }, 150);
    input?.addEventListener("input", handler, { signal: sig });
  }
  const tbody = el5.querySelector("tbody");
  tbody.addEventListener("click", (e) => {
    const target = e.target;
    const actionBtn = target.closest(`.${CLS}__action`);
    if (actionBtn) {
      e.stopPropagation();
      const uid2 = actionBtn.closest("tr")?.dataset.uid ?? "";
      const user = data.find((u) => u.id === uid2);
      const act = actionBtn.dataset.act;
      if (user && o.onAction) o.onAction(user, act);
      return;
    }
    const checkbox = target.closest(`.${CLS}__check`);
    if (checkbox) {
      const uid2 = checkbox.closest("tr")?.dataset.uid ?? "";
      if (checkbox.checked) selected.add(uid2);
      else selected.delete(uid2);
      return;
    }
    const row = target.closest(`.${CLS}__row`);
    if (row) {
      const uid2 = row.dataset.uid ?? "";
      const user = data.find((u) => u.id === uid2);
      if (user && o.onSelect) o.onSelect(user);
    }
  }, { signal: sig });
  tbody.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest(`.${CLS}__row`);
    if (!row) return;
    e.preventDefault();
    const uid2 = row.dataset.uid ?? "";
    const user = data.find((u) => u.id === uid2);
    if (user && o.onSelect) o.onSelect(user);
  }, { signal: sig });
  if (o.selectable) {
    const checkAll = el5.querySelector(`.${CLS}__check-all`);
    checkAll?.addEventListener("change", () => {
      const checked = checkAll.checked;
      selected = checked ? new Set(filtered.map((u) => u.id)) : /* @__PURE__ */ new Set();
      tbody.querySelectorAll(`.${CLS}__check`).forEach((cb) => {
        cb.checked = checked;
      });
    }, { signal: sig });
  }
  return {
    update(users2) {
      data = users2.slice();
      selected.clear();
      applyFilter();
      renderBody3();
    },
    setFilter(q) {
      query = q;
      const input = el5.querySelector(`.${CLS}__search`);
      if (input) input.value = q;
      applyFilter();
      renderBody3();
    },
    getSelected() {
      return data.filter((u) => selected.has(u.id));
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
    }
  };
}

// src/ts/customer-journey-render.ts
var STATUS_LABELS4 = {
  completed: "Completed",
  active: "Active",
  pending: "Pending",
  blocked: "Blocked"
};
function buildCard3(eng, typeIcons, ac) {
  const card = document.createElement("div");
  card.className = `mn-journey__card mn-journey__card--${eng.status}`;
  card.setAttribute("role", "listitem");
  card.setAttribute("tabindex", "0");
  card.dataset.id = eng.id;
  if (eng.date) card.dataset.date = eng.date;
  if (eng.assignee) card.dataset.assignee = eng.assignee;
  const avatar = document.createElement("div");
  avatar.className = "mn-journey__avatar";
  if (eng.avatar) {
    const img = document.createElement("img");
    img.src = eng.avatar;
    img.alt = eng.assignee ? escapeHtml(eng.assignee) : "";
    img.className = "mn-journey__avatar-img";
    avatar.appendChild(img);
  } else {
    avatar.textContent = eng.assignee ? journeyInitials(eng.assignee) : "?";
  }
  card.appendChild(avatar);
  const body = document.createElement("div");
  body.className = "mn-journey__card-body";
  const title = document.createElement("span");
  title.className = "mn-journey__title";
  title.textContent = escapeHtml(eng.title);
  body.appendChild(title);
  const badge = document.createElement("span");
  badge.className = `mn-journey__badge mn-journey__badge--${eng.status}`;
  badge.textContent = STATUS_LABELS4[eng.status];
  badge.setAttribute("aria-label", STATUS_LABELS4[eng.status]);
  body.appendChild(badge);
  const typeEl = document.createElement("span");
  typeEl.className = `mn-journey__type mn-journey__type--${eng.type}`;
  typeEl.textContent = typeIcons[eng.type] ?? "";
  typeEl.setAttribute("aria-label", eng.type);
  body.appendChild(typeEl);
  card.appendChild(body);
  return card;
}
function buildPhase(phase, typeIcons, ac) {
  const col = document.createElement("div");
  col.className = "mn-journey__phase";
  col.setAttribute("role", "group");
  col.setAttribute("aria-label", phase.label);
  const heading = document.createElement("div");
  heading.className = "mn-journey__phase-label";
  heading.textContent = escapeHtml(phase.label);
  col.appendChild(heading);
  for (const eng of phase.engagements) {
    col.appendChild(buildCard3(eng, typeIcons, ac));
  }
  return col;
}
function renderJourneyPhases(el5, phases, opts, ac, typeIcons) {
  for (const phase of phases) {
    el5.appendChild(buildPhase(phase, typeIcons, ac));
  }
}
function drawConnectors(el5, _phases) {
  const phaseEls = el5.querySelectorAll(".mn-journey__phase");
  if (phaseEls.length < 2) return;
  const elRect = el5.getBoundingClientRect();
  const w = el5.scrollWidth;
  const h = el5.scrollHeight;
  const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg2.classList.add("mn-journey__connectors");
  svg2.setAttribute("aria-hidden", "true");
  svg2.setAttribute("width", String(w));
  svg2.setAttribute("height", String(h));
  svg2.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "mn-journey-arrow");
  marker.setAttribute("markerWidth", "8");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "8");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrowPath.setAttribute("d", "M0,0 L8,3 L0,6 Z");
  arrowPath.style.fill = "var(--mn-info)";
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg2.appendChild(defs);
  for (let i = 0; i < phaseEls.length - 1; i++) {
    const srcCards = phaseEls[i].querySelectorAll(".mn-journey__card");
    const dstCards = phaseEls[i + 1].querySelectorAll(".mn-journey__card");
    if (!srcCards.length || !dstCards.length) continue;
    const src = srcCards[srcCards.length - 1].getBoundingClientRect();
    const dst = dstCards[0].getBoundingClientRect();
    const x1 = src.right - elRect.left + el5.scrollLeft;
    const y1 = src.top + src.height / 2 - elRect.top + el5.scrollTop;
    const x2 = dst.left - elRect.left + el5.scrollLeft;
    const y2 = dst.top + dst.height / 2 - elRect.top + el5.scrollTop;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("mn-journey__connector-line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.style.stroke = "var(--mn-info)";
    line.setAttribute("stroke-dasharray", "6 4");
    line.setAttribute("stroke-width", "2.5");
    line.setAttribute("marker-end", "url(#mn-journey-arrow)");
    svg2.appendChild(line);
  }
  el5.appendChild(svg2);
}

// src/ts/customer-journey.ts
var TYPE_ICONS = {
  opportunity: "\u2605",
  // star
  contract: "\u2709",
  // envelope
  ticket: "\u2691",
  // flag
  meeting: "\u260E",
  // telephone
  task: "\u2713"
  // check
};
function journeyInitials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function setupKeyboard(el5, phases, opts, ac, selectFn) {
  el5.addEventListener("keydown", (e) => {
    const target = e.target;
    if (!target.classList.contains("mn-journey__card")) return;
    const phaseEl = target.closest(".mn-journey__phase");
    if (!phaseEl) return;
    const allPhases = [...el5.querySelectorAll(".mn-journey__phase")];
    const phaseIdx = allPhases.indexOf(phaseEl);
    const cards = [...phaseEl.querySelectorAll(".mn-journey__card")];
    const cardIdx = cards.indexOf(target);
    let next = null;
    if (e.key === "ArrowRight" && phaseIdx < allPhases.length - 1) {
      const nextCards = allPhases[phaseIdx + 1].querySelectorAll(".mn-journey__card");
      next = nextCards[0] ?? null;
    } else if (e.key === "ArrowLeft" && phaseIdx > 0) {
      const prevCards = allPhases[phaseIdx - 1].querySelectorAll(".mn-journey__card");
      next = prevCards[0] ?? null;
    } else if (e.key === "ArrowDown" && cardIdx < cards.length - 1) {
      next = cards[cardIdx + 1];
    } else if (e.key === "ArrowUp" && cardIdx > 0) {
      next = cards[cardIdx - 1];
    } else if (e.key === "Enter") {
      const id = target.dataset.id ?? "";
      selectFn(id);
      const eng = phases.flatMap((p) => p.engagements).find((en) => en.id === id);
      if (eng?.onClick) eng.onClick();
      if (eng && opts.onSelect) opts.onSelect(eng);
      return;
    }
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }, { signal: ac.signal });
}
function setupTooltip(el5, ac) {
  let tip = null;
  el5.addEventListener("pointerenter", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (!card) return;
    const date = card.dataset.date ?? "";
    const assignee = card.dataset.assignee ?? "";
    if (!date && !assignee) return;
    tip = document.createElement("div");
    tip.className = "mn-journey__tooltip";
    const parts = [];
    if (assignee) parts.push(escapeHtml(assignee));
    if (date) parts.push(escapeHtml(date));
    tip.innerHTML = parts.join("<br>");
    card.appendChild(tip);
  }, { capture: true, signal: ac.signal });
  el5.addEventListener("pointerleave", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (card && tip && card.contains(tip)) {
      tip.remove();
      tip = null;
    }
  }, { capture: true, signal: ac.signal });
}
function customerJourney(el5, phases, opts) {
  const options = {
    orientation: "horizontal",
    onSelect: () => {
    },
    showConnectors: true,
    compactMode: false,
    ...opts
  };
  const ac = new AbortController();
  let selectedId = null;
  let currentPhases = [...phases];
  el5.setAttribute("role", "list");
  el5.setAttribute("aria-label", "Customer journey");
  el5.classList.add("mn-journey");
  if (options.orientation === "vertical") el5.classList.add("mn-journey--vertical");
  if (options.compactMode) el5.classList.add("mn-journey--compact");
  function render5() {
    el5.innerHTML = "";
    renderJourneyPhases(el5, currentPhases, options, ac, TYPE_ICONS);
    if (options.showConnectors && currentPhases.length > 1) {
      drawConnectors(el5, currentPhases);
    }
    if (selectedId) markSelected(selectedId);
  }
  function markSelected(id) {
    el5.querySelectorAll(".mn-journey__card--selected").forEach((c) => c.classList.remove("mn-journey__card--selected"));
    const card = el5.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (card) {
      card.classList.add("mn-journey__card--selected");
      card.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
  function selectEngagement(id) {
    selectedId = id;
    markSelected(id);
  }
  el5.addEventListener("click", (e) => {
    const card = e.target.closest?.(".mn-journey__card");
    if (!card) return;
    const id = card.dataset.id ?? "";
    selectEngagement(id);
    const eng = currentPhases.flatMap((p) => p.engagements).find((en) => en.id === id);
    if (eng?.onClick) eng.onClick();
    if (eng && opts?.onSelect) opts.onSelect(eng);
  }, { signal: ac.signal });
  setupKeyboard(el5, currentPhases, options, ac, selectEngagement);
  setupTooltip(el5, ac);
  render5();
  return {
    update(newPhases) {
      currentPhases = [...newPhases];
      render5();
    },
    selectEngagement,
    getSelected: () => selectedId,
    destroy() {
      ac.abort();
      el5.innerHTML = "";
      el5.removeAttribute("role");
      el5.removeAttribute("aria-label");
      el5.classList.remove("mn-journey", "mn-journey--vertical", "mn-journey--compact");
    }
  };
}

// src/ts/admin-shell-render.ts
function groupBySection(items) {
  const map = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = item.section ?? "";
    const arr2 = map.get(key);
    if (arr2) arr2.push(item);
    else map.set(key, [item]);
  }
  return map;
}
function buildHeader(cfg) {
  const hdr = document.createElement("div");
  hdr.className = "mn-admin-sidebar__header";
  if (cfg.icon) {
    const ico = document.createElement("span");
    ico.className = "mn-admin-sidebar__header-icon";
    ico.innerHTML = icons[cfg.icon]?.() ?? "";
    hdr.appendChild(ico);
  }
  const title = document.createElement("span");
  title.className = "mn-admin-sidebar__header-title";
  title.textContent = cfg.title;
  hdr.appendChild(title);
  if (cfg.badge) {
    const badge = document.createElement("span");
    badge.className = "mn-admin-sidebar__header-badge";
    badge.textContent = cfg.badge;
    hdr.appendChild(badge);
  }
  return hdr;
}
function buildSearch(cfg, ac, onInput) {
  const wrap = document.createElement("div");
  wrap.className = "mn-admin-sidebar__search";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "mn-admin-sidebar__search-input";
  input.placeholder = cfg.placeholder ?? "Find...";
  input.setAttribute("aria-label", cfg.placeholder ?? "Find...");
  wrap.appendChild(input);
  if (cfg.shortcut) {
    const kbd = document.createElement("kbd");
    kbd.className = "mn-admin-sidebar__search-kbd";
    kbd.textContent = cfg.shortcut;
    wrap.appendChild(kbd);
  }
  input.addEventListener("input", () => onInput(input.value), { signal: ac.signal });
  return wrap;
}
function buildNavItem(item, active, ac, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mn-admin-nav-item";
  if (active) btn.classList.add("mn-admin-nav-item--active");
  btn.dataset.navId = item.id;
  if (active) btn.setAttribute("aria-current", "page");
  const ico = document.createElement("span");
  ico.className = "mn-admin-nav-item__icon";
  ico.innerHTML = icons[item.icon]?.() ?? "";
  btn.appendChild(ico);
  const label = document.createElement("span");
  label.className = "mn-admin-nav-item__label";
  label.textContent = item.label;
  btn.appendChild(label);
  if (item.badge != null) {
    const badge = document.createElement("span");
    badge.className = "mn-admin-nav-item__badge";
    badge.textContent = String(item.badge);
    btn.appendChild(badge);
  }
  btn.addEventListener("click", () => onClick(item.id), { signal: ac.signal });
  return btn;
}
function buildTopbar(pageLabel) {
  const bar = document.createElement("div");
  bar.className = "mn-admin-topbar";
  const breadcrumb = document.createElement("span");
  breadcrumb.className = "mn-admin-topbar__breadcrumb";
  breadcrumb.textContent = "Admin";
  bar.appendChild(breadcrumb);
  const sep = document.createElement("span");
  sep.className = "mn-admin-topbar__sep";
  sep.textContent = "\u203A";
  bar.appendChild(sep);
  const title = document.createElement("span");
  title.className = "mn-admin-topbar__title";
  title.textContent = pageLabel;
  bar.appendChild(title);
  return { el: bar, breadcrumbEl: breadcrumb, titleEl: title };
}

// src/ts/admin-shell.ts
function findItem(nav, id) {
  return nav.find((n) => n.id === id);
}
function adminShell(el5, opts) {
  const ac = new AbortController();
  const collapsible = opts.collapsible ?? true;
  const showTopBar = opts.topBar ?? true;
  let activePage = opts.initialPage ?? opts.sidebar.nav[0]?.id ?? "";
  el5.innerHTML = "";
  el5.classList.add("mn-admin-shell");
  if (opts.initialCollapsed) el5.classList.add("mn-admin-shell--collapsed");
  const sidebar = document.createElement("nav");
  sidebar.className = "mn-admin-sidebar";
  sidebar.setAttribute("role", "navigation");
  sidebar.setAttribute("aria-label", "Admin navigation");
  el5.appendChild(sidebar);
  if (opts.sidebar.header) {
    sidebar.appendChild(buildHeader(opts.sidebar.header));
  }
  let searchWrap = null;
  const filterNav = (q) => {
    const lower = q.toLowerCase();
    const btns = sidebar.querySelectorAll(".mn-admin-nav-item");
    btns.forEach((btn) => {
      const label = btn.querySelector(".mn-admin-nav-item__label")?.textContent ?? "";
      btn.style.display = label.toLowerCase().includes(lower) ? "" : "none";
    });
    opts.sidebar.search?.onSearch?.(q);
  };
  if (opts.sidebar.search) {
    searchWrap = buildSearch(opts.sidebar.search, ac, filterNav);
    sidebar.appendChild(searchWrap);
  }
  if (opts.sidebar.search?.shortcut) {
    const key = opts.sidebar.search.shortcut.toLowerCase();
    document.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === key && !isInputFocused()) {
        e.preventDefault();
        const input = searchWrap?.querySelector("input");
        input?.focus();
      }
    }, { signal: ac.signal });
  }
  const navContainer = document.createElement("div");
  navContainer.className = "mn-admin-sidebar__nav";
  sidebar.appendChild(navContainer);
  function renderNav() {
    navContainer.innerHTML = "";
    const groups = groupBySection(opts.sidebar.nav);
    for (const [section, items] of groups) {
      if (section) {
        const heading = document.createElement("div");
        heading.className = "mn-admin-sidebar__section-title";
        heading.textContent = section;
        navContainer.appendChild(heading);
      }
      for (const item of items) {
        navContainer.appendChild(
          buildNavItem(item, item.id === activePage, ac, handleNav)
        );
      }
    }
  }
  function handleNav(id) {
    activePage = id;
    highlightActive();
    const item = findItem(opts.sidebar.nav, id);
    if (item && titleEl) titleEl.textContent = item.label;
    opts.onNavigate(id);
  }
  function highlightActive() {
    const btns = navContainer.querySelectorAll(".mn-admin-nav-item");
    btns.forEach((btn) => {
      const isActive = btn.dataset.navId === activePage;
      btn.classList.toggle("mn-admin-nav-item--active", isActive);
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }
  renderNav();
  if (collapsible) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mn-admin-sidebar__collapse-btn";
    toggle.setAttribute("aria-label", "Toggle sidebar");
    toggle.textContent = "\xAB";
    toggle.addEventListener("click", () => {
      el5.classList.toggle("mn-admin-shell--collapsed");
    }, { signal: ac.signal });
    sidebar.appendChild(toggle);
  }
  if (opts.sidebar.footer) {
    const footer = opts.sidebar.footer;
    if (typeof footer === "string") {
      const el22 = document.createElement("button");
      el22.type = "button";
      el22.className = "mn-admin-sidebar__footer";
      el22.textContent = footer;
      if (opts.sidebar.onFooterClick) {
        el22.addEventListener("click", opts.sidebar.onFooterClick, { signal: ac.signal });
      }
      sidebar.appendChild(el22);
    } else if (typeof footer === "object" && "label" in footer && "onClick" in footer) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mn-admin-sidebar__footer";
      btn.textContent = footer.label;
      btn.addEventListener("click", footer.onClick, { signal: ac.signal });
      sidebar.appendChild(btn);
    } else {
      sidebar.appendChild(footer);
    }
  }
  const content = document.createElement("div");
  content.className = "mn-admin-content";
  el5.appendChild(content);
  let titleEl = null;
  if (showTopBar) {
    const initLabel = findItem(opts.sidebar.nav, activePage)?.label ?? "";
    const topbar = buildTopbar(initLabel);
    titleEl = topbar.titleEl;
    content.appendChild(topbar.el);
  }
  const body = document.createElement("div");
  body.className = "mn-admin-content__body";
  content.appendChild(body);
  return {
    contentEl: body,
    setPage(id) {
      activePage = id;
      highlightActive();
      const item = findItem(opts.sidebar.nav, id);
      if (item && titleEl) titleEl.textContent = item.label;
      opts.onNavigate(id);
    },
    setTitle(title) {
      if (titleEl) titleEl.textContent = title;
    },
    collapse(val) {
      el5.classList.toggle("mn-admin-shell--collapsed", val);
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
      el5.classList.remove("mn-admin-shell", "mn-admin-shell--collapsed");
    }
  };
}
function isInputFocused() {
  const tag = document.activeElement?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

// src/ts/section-card.ts
var idCounter = 0;
function renderAction(header2, action, ac) {
  header2.querySelector(".mn-section-card__action")?.remove();
  if (!action) return;
  const el5 = document.createElement(action.href ? "a" : "button");
  el5.className = "mn-section-card__action";
  el5.textContent = escapeHtml(action.label);
  if (action.href && el5 instanceof HTMLAnchorElement) {
    el5.href = action.href;
  }
  if (action.onClick) {
    el5.addEventListener("click", (e) => {
      if (!action.href) e.preventDefault();
      action.onClick();
    }, { signal: ac.signal });
  }
  if (el5 instanceof HTMLButtonElement) {
    el5.type = "button";
  }
  header2.appendChild(el5);
}
function sectionCard(el5, opts) {
  const ac = new AbortController();
  const variant = opts.variant ?? "default";
  const titleId = `mn-sc-title-${++idCounter}`;
  const section = document.createElement("section");
  section.className = `mn-section-card mn-section-card--${variant}`;
  if (opts.padding === false) section.classList.add("mn-section-card--no-padding");
  if (opts.className) section.classList.add(opts.className);
  section.setAttribute("role", "region");
  section.setAttribute("aria-labelledby", titleId);
  const header2 = document.createElement("header");
  header2.className = "mn-section-card__header";
  const h3 = document.createElement("h3");
  h3.className = "mn-section-card__title";
  h3.id = titleId;
  h3.textContent = escapeHtml(opts.title);
  header2.appendChild(h3);
  renderAction(header2, opts.action, ac);
  section.appendChild(header2);
  const body = document.createElement("div");
  body.className = "mn-section-card__body";
  section.appendChild(body);
  el5.appendChild(section);
  return {
    bodyEl: body,
    setTitle(t) {
      h3.textContent = escapeHtml(t);
    },
    setAction(a) {
      renderAction(header2, a, ac);
    }
  };
}

// src/ts/settings-panel-items.ts
var uid = 0;
function nextId(prefix) {
  return `mn-sp-${prefix}-${++uid}`;
}
function labelGroup(label, description, forId) {
  const g = document.createElement("div");
  g.className = "mn-settings-item__label-group";
  const lbl = document.createElement("label");
  lbl.className = "mn-settings-item__label";
  lbl.textContent = escapeHtml(label);
  if (forId) lbl.htmlFor = forId;
  g.appendChild(lbl);
  if (description) {
    const desc = document.createElement("span");
    desc.className = "mn-settings-item__desc";
    desc.textContent = escapeHtml(description);
    g.appendChild(desc);
  }
  return g;
}
function renderToggle(item, ac, values) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  const id = nextId("toggle");
  row.appendChild(labelGroup(item.label, item.description, id));
  const wrap = document.createElement("div");
  wrap.className = "mn-settings-item__ctrl";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  input.className = "mn-settings-toggle";
  input.checked = item.value;
  input.setAttribute("role", "switch");
  input.setAttribute("aria-checked", String(item.value));
  if (item.disabled) input.disabled = true;
  input.addEventListener("change", () => {
    values.set(item.label, input.checked);
    input.setAttribute("aria-checked", String(input.checked));
    item.onChange(input.checked);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  wrap.appendChild(input);
  row.appendChild(wrap);
  return row;
}
function renderText(item, ac, values) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  const id = nextId("text");
  row.appendChild(labelGroup(item.label, item.description, id));
  const input = document.createElement("input");
  input.type = "text";
  input.id = id;
  input.className = "mn-settings-item__ctrl mn-settings-text";
  input.value = item.value;
  if (item.placeholder) input.placeholder = item.placeholder;
  if (item.maxLength) input.maxLength = item.maxLength;
  if (item.hint) {
    const hintId = `${id}-hint`;
    input.setAttribute("aria-describedby", hintId);
    const hint = document.createElement("span");
    hint.id = hintId;
    hint.className = "mn-settings-item__hint mn-sr-only";
    hint.textContent = item.hint;
    row.appendChild(hint);
  }
  input.addEventListener("input", () => {
    values.set(item.label, input.value);
    item.onChange(input.value);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  row.appendChild(input);
  return row;
}
function renderSelect(item, ac, values) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  const id = nextId("select");
  row.appendChild(labelGroup(item.label, item.description, id));
  const sel = document.createElement("select");
  sel.id = id;
  sel.className = "mn-settings-item__ctrl mn-settings-select";
  for (const opt of item.options) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = escapeHtml(opt.label);
    if (opt.value === item.value) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener("change", () => {
    values.set(item.label, sel.value);
    item.onChange(sel.value);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  row.appendChild(sel);
  return row;
}

// src/ts/settings-panel.ts
function renderRange(item, ac, values) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  const id = nextId("range");
  row.appendChild(labelGroup(item.label, item.description, id));
  const wrap = document.createElement("div");
  wrap.className = "mn-settings-item__ctrl mn-settings-range-wrap";
  const input = document.createElement("input");
  input.type = "range";
  input.id = id;
  input.className = "mn-settings-range";
  input.min = String(item.min);
  input.max = String(item.max);
  if (item.step) input.step = String(item.step);
  input.value = String(item.value);
  const display = document.createElement("span");
  display.className = "mn-settings-range__value";
  display.textContent = item.format ? item.format(item.value) : String(item.value);
  input.addEventListener("input", () => {
    const v = Number(input.value);
    display.textContent = item.format ? item.format(v) : String(v);
    values.set(item.label, v);
    item.onChange(v);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  wrap.appendChild(input);
  wrap.appendChild(display);
  row.appendChild(wrap);
  return row;
}
function renderRadio(item, ac, values) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  const name = nextId("radio");
  row.appendChild(labelGroup(item.label, item.description));
  const group = document.createElement("div");
  group.className = "mn-settings-item__ctrl mn-settings-radio-group";
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", item.label);
  for (const opt of item.options) {
    const label = document.createElement("label");
    label.className = "mn-settings-radio";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = opt.value;
    if (opt.value === item.value) input.checked = true;
    input.addEventListener("change", () => {
      values.set(item.label, input.value);
      item.onChange(input.value);
    }, { signal: ac.signal });
    label.appendChild(input);
    const span = document.createElement("span");
    span.textContent = escapeHtml(opt.label);
    label.appendChild(span);
    group.appendChild(label);
  }
  values.set(item.label, item.value);
  row.appendChild(group);
  return row;
}
function renderInfo(item) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  row.appendChild(labelGroup(item.label));
  const val = document.createElement("span");
  val.className = "mn-settings-item__ctrl mn-settings-info";
  if (item.mono) val.classList.add("mn-settings-info--mono");
  val.textContent = escapeHtml(item.value);
  row.appendChild(val);
  return row;
}
function renderAction2(item, ac) {
  const row = document.createElement("div");
  row.className = "mn-settings-item mn-settings-item--action";
  row.appendChild(labelGroup(item.label, item.description));
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mn-settings-item__ctrl mn-settings-action-btn";
  if (item.variant === "danger") btn.classList.add("mn-settings-action-btn--danger");
  btn.textContent = escapeHtml(item.buttonLabel);
  btn.addEventListener("click", () => item.onAction(), { signal: ac.signal });
  row.appendChild(btn);
  return row;
}
function renderCustom(item) {
  const row = document.createElement("div");
  row.className = "mn-settings-item";
  row.appendChild(labelGroup(item.label, item.description));
  const slot = document.createElement("div");
  slot.className = "mn-settings-item__ctrl";
  item.render(slot);
  row.appendChild(slot);
  return row;
}
function renderItem(item, ac, values) {
  switch (item.type) {
    case "toggle":
      return renderToggle(item, ac, values);
    case "text":
      return renderText(item, ac, values);
    case "select":
      return renderSelect(item, ac, values);
    case "range":
      return renderRange(item, ac, values);
    case "radio":
      return renderRadio(item, ac, values);
    case "info":
      return renderInfo(item);
    case "action":
      return renderAction2(item, ac);
    case "custom":
      return renderCustom(item);
  }
}
function settingsPanel(el5, opts) {
  const ac = new AbortController();
  const values = /* @__PURE__ */ new Map();
  el5.classList.add("mn-settings-panel");
  for (const section of opts.sections) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "mn-settings-section";
    if (section.id) fieldset.dataset.sectionId = section.id;
    const legend2 = document.createElement("legend");
    legend2.className = "mn-settings-section__title";
    legend2.textContent = escapeHtml(section.title);
    fieldset.appendChild(legend2);
    if (section.description) {
      const desc = document.createElement("p");
      desc.className = "mn-settings-section__desc";
      desc.textContent = escapeHtml(section.description);
      fieldset.appendChild(desc);
    }
    for (const item of section.items) {
      const key = section.id ? `${section.id}:${item.label}` : item.label;
      fieldset.appendChild(renderItem(item, ac, values));
      if (values.has(item.label)) {
        values.set(key, values.get(item.label));
      }
    }
    el5.appendChild(fieldset);
  }
  return {
    update(sectionId, itemLabel, value) {
      const key = `${sectionId}:${itemLabel}`;
      values.set(key, value);
      values.set(itemLabel, value);
    },
    getValues() {
      const result = {};
      for (const [k, v] of values) result[k] = v;
      return result;
    },
    destroy() {
      ac.abort();
      el5.innerHTML = "";
      el5.classList.remove("mn-settings-panel");
    }
  };
}

// src/ts/dashboard-strip-zones.ts
function safeColor2(el5, prop, value) {
  if (isValidColor(value)) {
    el5.style[prop] = value;
  }
}
function sectionTitle(parent, title) {
  if (!title) return;
  const el5 = createElement("div", "mn-strip__section-title");
  el5.textContent = title;
  parent.appendChild(el5);
}
function renderGaugeZone(section, zone, _animate) {
  section.classList.add("mn-strip__section--col");
  sectionTitle(section, zone.label);
  const wrap = createElement("div", "mn-strip-gauge-wrap");
  const canvas = document.createElement("canvas");
  canvas.className = "mn-strip-gauge__canvas";
  canvas.dataset.gauge = JSON.stringify(zone.gaugeConfig);
  canvas.dataset.size = String(zone.size || "sm");
  wrap.appendChild(canvas);
  section.appendChild(wrap);
  const gauge2 = new FerrariGauge(canvas);
  return {
    update() {
    },
    destroy() {
      if (gauge2) gauge2.destroy();
      wrap.remove();
    }
  };
}
function renderPipelineZone(section, zone, _animate) {
  section.classList.add("mn-strip__section--col");
  sectionTitle(section, zone.title);
  const pipe = createElement("div", "mn-strip-pipeline");
  const maxVal = zone.maxValue || Math.max(...zone.rows.map((r) => r.value), 1);
  for (const row of zone.rows) {
    const rowEl = createElement("div", "mn-strip-row");
    const label = createElement("span", "mn-strip-row__label");
    label.textContent = row.label;
    safeColor2(label, "color", row.color);
    rowEl.appendChild(label);
    const count = createElement("span", "mn-strip-row__count");
    count.textContent = String(row.value);
    rowEl.appendChild(count);
    const track = createElement("div", "mn-strip-row__track");
    const fill = createElement("div", "mn-strip-row__fill");
    safeColor2(fill, "backgroundColor", row.color);
    const pct3 = Math.min(row.value / maxVal * 100, 100);
    fill.style.width = pct3 + "%";
    track.appendChild(fill);
    rowEl.appendChild(track);
    if (row.secondary) {
      const dur = createElement("span", "mn-strip-row__dur");
      dur.textContent = row.secondary;
      rowEl.appendChild(dur);
    }
    pipe.appendChild(rowEl);
  }
  if (zone.footer) {
    const footerEl = createElement("div", "mn-strip-row mn-strip-row--e2e");
    const fLabel = createElement("span", "mn-strip-row__label");
    fLabel.textContent = zone.footer.label;
    footerEl.appendChild(fLabel);
    const fVal = createElement("span", "mn-strip-row__dur mn-strip-row__dur--e2e");
    fVal.textContent = zone.footer.value;
    footerEl.appendChild(fVal);
    pipe.appendChild(footerEl);
  }
  section.appendChild(pipe);
  return {
    update() {
    },
    destroy() {
      pipe.remove();
    }
  };
}
function renderTrendZone(section, zone, _animate) {
  section.classList.add("mn-strip__section--col");
  sectionTitle(section, zone.title);
  const kpis = createElement("div", "mn-strip-kpis");
  for (const item of zone.items) {
    const kpi2 = createElement("div", "mn-strip-kpi");
    const label = createElement("span", "mn-strip-kpi__label");
    label.textContent = item.label;
    kpi2.appendChild(label);
    const value = createElement("span", "mn-strip-kpi__value");
    value.textContent = String(item.value);
    safeColor2(value, "color", item.color);
    kpi2.appendChild(value);
    const canvas = createElement("canvas", "mn-strip-kpi__spark");
    kpi2.appendChild(canvas);
    kpis.appendChild(kpi2);
    sparkline(canvas, item.data, { color: item.color });
  }
  section.appendChild(kpis);
  return {
    update() {
    },
    destroy() {
      kpis.remove();
    }
  };
}
function renderBoardZone(section, zone, _animate) {
  section.classList.add("mn-strip__section--col");
  sectionTitle(section, zone.title);
  let boardGauge = null;
  const els = [];
  const row = createElement("div", "mn-strip-board-row");
  els.push(row);
  if (zone.stats) {
    const board = createElement("div", "mn-strip-board");
    for (const stat2 of zone.stats) {
      const cell = createElement("div", "mn-strip-board__cell");
      const lbl = createElement("span", "mn-strip-board__label");
      lbl.textContent = stat2.label;
      cell.appendChild(lbl);
      const val = createElement("span", "mn-strip-board__val");
      val.textContent = String(stat2.value);
      cell.appendChild(val);
      board.appendChild(cell);
    }
    row.appendChild(board);
  }
  if (zone.gauge) {
    const wrap = createElement("div", "mn-strip-gauge-wrap");
    const canvas = document.createElement("canvas");
    canvas.className = "mn-strip-gauge__canvas";
    canvas.dataset.gauge = JSON.stringify(zone.gauge);
    canvas.dataset.size = String(zone.gaugeSize || "sm");
    wrap.appendChild(canvas);
    row.appendChild(wrap);
    boardGauge = new FerrariGauge(canvas);
  }
  section.appendChild(row);
  return {
    update() {
    },
    destroy() {
      if (boardGauge) boardGauge.destroy();
      for (const el5 of els) el5.remove();
    }
  };
}

// src/ts/dashboard-strip.ts
function renderZone(section, zone, animate) {
  switch (zone.type) {
    case "gauge":
      return renderGaugeZone(section, zone, animate);
    case "pipeline":
      return renderPipelineZone(section, zone, animate);
    case "trend":
      return renderTrendZone(section, zone, animate);
    case "board":
      return renderBoardZone(section, zone, animate);
    default:
      console.warn("[Maranello] dashboardStrip: unknown zone type");
      return { update() {
      }, destroy() {
      } };
  }
}
function dashboardStrip(container, opts) {
  const root = typeof container === "string" ? document.getElementById(container) || document.querySelector(container) : container;
  if (!root) {
    console.warn("[Maranello] dashboardStrip: container not found");
    return null;
  }
  const strip = createElement("div", "mn-strip mn-strip--dashboard");
  strip.setAttribute("role", "region");
  strip.setAttribute("aria-label", opts.ariaLabel || "Dashboard strip");
  const inner = createElement("div", "mn-strip__inner");
  strip.appendChild(inner);
  const animate = opts.animate !== false;
  const zoneControllers = [];
  function gridCols(zones) {
    return zones.map((z) => {
      if (z.type === "gauge") return "auto";
      if (z.type === "board") return "auto";
      if (z.type === "pipeline") return "2fr";
      return "1fr";
    }).join(" ");
  }
  function buildZones() {
    inner.textContent = "";
    zoneControllers.length = 0;
    inner.style.display = "grid";
    inner.style.gridTemplateColumns = gridCols(opts.zones);
    for (let i = 0; i < opts.zones.length; i++) {
      const section = createElement("div", "mn-strip__section");
      section.setAttribute("data-section", opts.zones[i].type);
      inner.appendChild(section);
      zoneControllers.push(renderZone(section, opts.zones[i], animate));
    }
  }
  root.appendChild(strip);
  buildZones();
  return {
    updateZone(index, data) {
      if (index < 0 || index >= opts.zones.length) return;
      Object.assign(opts.zones[index], data);
      const section = inner.querySelectorAll(
        ".mn-strip__section"
      )[index];
      if (!section || !zoneControllers[index]) return;
      zoneControllers[index].destroy();
      section.textContent = "";
      zoneControllers[index] = renderZone(section, opts.zones[index], false);
    },
    destroy() {
      for (const c of zoneControllers) c.destroy();
      zoneControllers.length = 0;
      strip.remove();
    }
  };
}

// src/ts/heatmap.ts
var DEFAULT_SCALE = ["#1a1a2e", "#DC0000", "#FFC72C", "#00A651"];
var EVENT_NAME = "mn-heatmap-cell-click";
function parseHex2(hex) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function interpolateColor(scale, t) {
  const ct = clamp(t, 0, 1);
  const idx = ct * (scale.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, scale.length - 1);
  const f = idx - lo;
  const cLo = parseHex2(scale[lo]);
  const cHi = parseHex2(scale[hi]);
  const r = Math.round(lerp(cLo[0], cHi[0], f));
  const g = Math.round(lerp(cLo[1], cHi[1], f));
  const b = Math.round(lerp(cLo[2], cHi[2], f));
  return `rgb(${r},${g},${b})`;
}
function contrastText2(bg) {
  const match = bg.match(/(\d+)/g);
  if (!match || match.length < 3) return "var(--mn-text)";
  const lum = (0.299 * Number(match[0]) + 0.587 * Number(match[1]) + 0.114 * Number(match[2])) / 255;
  return lum > 0.5 ? "var(--mn-text-inverse)" : "#fff";
}
function resolveRange(rows, min, max) {
  let lo = min ?? Infinity;
  let hi = max ?? -Infinity;
  if (min === void 0 || max === void 0) {
    for (const row of rows) {
      for (const cell of row.cells) {
        if (min === void 0 && cell.value < lo) lo = cell.value;
        if (max === void 0 && cell.value > hi) hi = cell.value;
      }
    }
  }
  if (lo === hi) hi = lo + 1;
  return [lo, hi];
}
function cellColor(cell, scale, min, max) {
  if (cell.color && isValidColor(cell.color)) return cell.color;
  return interpolateColor(scale, (cell.value - min) / (max - min));
}
function cellAriaLabel(row, cell, colLabel) {
  if (cell.tooltip) return cell.tooltip;
  const col = colLabel ?? (cell.label ?? "");
  return `${escapeHtml(row.label)}, ${escapeHtml(col)}: ${cell.value}`;
}
function attachCellListeners(cellEl, opts, row, cell, ri, ci, ac) {
  if (opts.onCellClick) {
    cellEl.addEventListener("click", () => {
      opts.onCellClick(row, cell, ri, ci);
    }, { signal: ac.signal });
  }
  cellEl.addEventListener("click", () => {
    cellEl.dispatchEvent(new CustomEvent(EVENT_NAME, {
      bubbles: true,
      detail: { row, cell, rowIndex: ri, colIndex: ci }
    }));
  }, { signal: ac.signal });
  cellEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cellEl.click();
    }
  }, { signal: ac.signal });
  if (opts.onCellHover) {
    cellEl.addEventListener("mouseenter", () => {
      opts.onCellHover(row, cell, ri, ci);
    }, { signal: ac.signal });
  }
}
function buildGrid(container, opts, ac) {
  const scale = (opts.colorScale ?? DEFAULT_SCALE).filter((c) => isValidColor(c));
  const safeScale = scale.length >= 2 ? scale : DEFAULT_SCALE;
  const showValues = opts.showValues !== false;
  const sizeClass = opts.cellSize ? ` mn-cap-heatmap--${opts.cellSize}` : "";
  const [min, max] = resolveRange(opts.rows, opts.minValue, opts.maxValue);
  const root = createElement("div", `mn-cap-heatmap${sizeClass}`, {
    role: "grid",
    "aria-label": opts.ariaLabel ?? "Heatmap"
  });
  if (opts.columnLabels && opts.columnLabels.length > 0) {
    const headerRow = createElement("div", "mn-cap-grid__header", { role: "row" });
    headerRow.appendChild(createElement("span", "mn-cap-grid__row-label"));
    for (const label of opts.columnLabels) {
      headerRow.appendChild(createElement("span", "mn-cap-grid__col-label", {
        role: "columnheader",
        text: label
      }));
    }
    root.appendChild(headerRow);
  }
  for (let ri = 0; ri < opts.rows.length; ri++) {
    const row = opts.rows[ri];
    const rowEl = createElement("div", "mn-cap-grid__row", { role: "row" });
    rowEl.appendChild(createElement("span", "mn-cap-grid__row-label", { text: row.label }));
    for (let ci = 0; ci < row.cells.length; ci++) {
      const cell = row.cells[ci];
      const bg = cellColor(cell, safeScale, min, max);
      const colLabel = opts.columnLabels ? opts.columnLabels[ci] : void 0;
      const cellEl = createElement("div", "mn-cap-grid__cell", {
        role: "gridcell",
        tabindex: "0",
        "aria-label": cellAriaLabel(row, cell, colLabel)
      });
      cellEl.style.backgroundColor = bg;
      cellEl.style.color = contrastText2(bg);
      if (showValues) cellEl.textContent = String(cell.value);
      attachCellListeners(cellEl, opts, row, cell, ri, ci, ac);
      rowEl.appendChild(cellEl);
    }
    root.appendChild(rowEl);
  }
  container.appendChild(root);
}
function heatmap(container, options) {
  const el5 = typeof container === "string" ? document.getElementById(container) : container;
  if (!el5) {
    console.warn(`[Maranello] heatmap: container not found \u2014 "${container}"`);
    return null;
  }
  let ac = new AbortController();
  buildGrid(el5, options, ac);
  return {
    update(rows, columnLabels) {
      ac.abort();
      ac = new AbortController();
      el5.textContent = "";
      buildGrid(el5, { ...options, rows, columnLabels: columnLabels ?? options.columnLabels }, ac);
    },
    destroy() {
      ac.abort();
      el5.textContent = "";
    }
  };
}

// src/ts/ai-chat-iife.ts
function aiChat(container, opts) {
  const full = {
    onSend: opts?.onSend ?? null,
    onQuickAction: opts?.onQuickAction ?? null,
    quickActions: opts?.quickActions ?? [],
    placeholder: opts?.placeholder ?? "Type a message\u2026",
    title: opts?.title ?? "AI Assistant",
    welcomeMessage: opts?.welcomeMessage ?? null,
    avatar: opts?.avatar ?? "https://github.com/Roberdan.png",
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

// src/ts/maranello-exports.ts
function registerExtras(M2) {
  M2.SPEEDO_FONT = SPEEDO_FONT;
  M2.SPEEDO_SIZES = SPEEDO_SIZES;
  M2.SPEEDO_SWEEP = SWEEP;
  M2.SPEEDO_START = START;
  M2.easeOutCubic = easeOutCubic;
  M2.valueToAngle = valueToAngle;
  M2.speedoPalette = speedoPalette;
  M2.drawSpeedometer = drawSpeedometer;
  M2.hexLum = hexLum2;
  M2.createEl = createEl;
  M2.clampVal = clampVal;
  M2.normalizeHex = normalizeHex;
  M2.buildTicks = buildTicks;
  M2.cleanupTimers = cleanupTimers;
  M2.addHBarListener = addListener;
  M2.showHBarTip = showTip;
  M2.hideHBarTip = hideTip;
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
  M2.renderPanelBody = renderBody2;
  M2.A11Y_DEFAULTS = DEFAULTS;
  M2.loadA11ySettings = loadSettings;
  M2.saveA11ySettings = saveSettings;
  M2.applyA11ySettings = applySettings;
  M2.buildA11yPanel = buildPanel;
  M2.MAP_DPR = DPR;
  M2.MAP_TAU = TAU;
  M2.CONTINENTS = CONTINENTS;
  M2.detectMapTheme = detectTheme;
  M2.getMarkerColors = getMarkerColors;
  M2.projectLatLon = project;
  M2.hexToRgba = hexToRgba2;
  M2.getVisibleProjected = getVisibleProjected;
  M2.clusterMarkers = clusterMarkers;
  M2.markerRadius = markerRadius;
  M2.drawMarker = drawMarker;
  M2.renderMapLegend = renderLegend;
  M2.hitTest = hitTest;
  M2.showMapTip = showTip2;
  M2.hideMapTip = hideTip2;
  M2.attachMapEvents = attachEvents;
  M2.activityFeed = activityFeed;
  M2.dateRangePicker = dateRangePicker;
  M2.bulletChart = bulletChart;
  M2.notificationCenter = notificationCenter;
  M2.waterfallChart = waterfallChart;
  M2.confidenceChart = confidenceChart;
  M2.decisionMatrix = decisionMatrix;
  M2.renderSourceCards = renderSourceCards;
  M2.bcgMatrix = bcgMatrix;
  M2.nineBoxMatrix = nineBoxMatrix;
  M2.swotMatrix = swotMatrix;
  M2.approvalChain = approvalChain;
  M2.agentTrace = agentTrace;
  M2.tokenMeter = tokenMeter;
  M2.streamingText = streamingText;
  M2.riskMatrix = riskMatrix;
  M2.kpiScorecard = kpiScorecard;
  M2.cohortGrid = cohortGrid;
  M2.auditLog = auditLog;
  M2.agentCostBreakdown = agentCostBreakdown;
  M2.costTimeline = costTimeline;
  M2.businessModelCanvas = businessModelCanvas;
  M2.userTable = userTable;
  M2.initForms = initForms;
  M2.forms = forms;
  M2.validateField = validateField;
  M2.validateForm = validateForm;
  M2.initLiveValidation = initLiveValidation;
  M2.addValidator = addValidator;
  M2.initPasswordToggle = initPasswordToggle;
  M2.initFileUpload = initFileUpload;
  M2.initFormSteps = initFormSteps;
  M2.initInlineEdit = initInlineEdit;
  M2.StateScaffold = StateScaffold;
  M2.toggleNotifications = toggleNotifications;
  M2.initDrillDown = initDrillDown;
  M2.AsyncSelect = AsyncSelect;
  M2.FacetWorkbench = FacetWorkbench;
  M2.EntityWorkbench = EntityWorkbench;
  M2.ViewRegistry = ViewRegistry;
  M2.NavigationModel = NavigationModel;
  M2.AppShellController = AppShellController;
  M2.PanelOrchestrator = PanelOrchestrator;
  M2.DashboardRenderer = DashboardRenderer;
  M2.customerJourney = customerJourney;
  M2.adminShell = adminShell;
  M2.sectionCard = sectionCard;
  M2.settingsPanel = settingsPanel;
  M2.dashboardStrip = dashboardStrip;
  M2.heatmap = heatmap;
}

// src/ts/maranello.ts
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
M.themeRotary = themeRotary;
M.getAccent = getAccent;
M.cssVar = cssVar;
M.palette = palette;
M.setLocale = setLocale;
M.getLocale = getLocale;
M.resetLocale = resetLocale;
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
M.header = { init: header };
M.headerShell = headerShell;
M.themePicker = themePicker;
M.filterPanel = filterPanel;
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
M.createLayout = createLayout;
try {
  _savedTheme = localStorage.getItem("mn-theme");
  if (_savedTheme) setTheme(_savedTheme);
} catch (_e) {
}
var _savedTheme;
function _initLayout() {
  const gridEl = document.getElementById("mn-grid");
  if (gridEl && gridEl.hasAttribute("data-mn-auto-layout")) {
    M.layout = createLayout(gridEl);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", _initLayout, { once: true });
} else _initLayout();
M.socialGraph = socialGraph;
M.sparkline = sparkline;
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
M.openSearchDrawer = openSearchDrawer;
M.initTagsField = initTagsField;
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
M._a11yDom = true;
function _mountA11y() {
  if (document.querySelector(".mn-a11y-fab") || document.querySelector("mn-a11y")) return;
  M._a11yCtrl = a11yPanel();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", _mountA11y, { once: true });
} else requestAnimationFrame(_mountA11y);
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
M.autoResize = autoResize;
M.autoResizeAll = autoResizeAll;
M.initSidebarToggle = initSidebarToggle;
M.initSidebarToggleAuto = initSidebarToggleAuto;
M.charts = { sparkline, donut, barChart, areaChart, radar, halfGauge, bubble, liveGraph, hBarChart };
registerExtras(M);

// src/ts/index.ts
var VERSION = "5.14.1";
export {
  AppShellController,
  AsyncSelect,
  COLOR,
  CONTINENTS,
  DEFAULTS,
  DPR,
  DURATION,
  DashboardRenderer,
  EASE,
  EntityWorkbench,
  EventBus,
  FONT,
  FacetWorkbench,
  FerrariGauge,
  GAUGE_SIZES,
  ICON_SPARK,
  M as Maranello,
  NavigationModel,
  PanelOrchestrator,
  RADIUS,
  SCOPE_COLOR,
  SERIES,
  SHADOW,
  SPACE,
  SPEEDO_FONT,
  SPEEDO_SIZES,
  START,
  SWEEP,
  StateScaffold,
  TAU,
  TEXT_SIZE,
  VERSION,
  ViewRegistry,
  Z_INDEX,
  a11yPanel,
  actionIcons,
  activityFeed,
  addListener,
  addValidator,
  adminShell,
  agentCostBreakdown,
  agentTrace,
  applySettings,
  approvalChain,
  areaChart,
  attachEvents,
  auditLog,
  autoBind,
  autoBindSliders,
  autoContrast,
  autoResize,
  autoResizeAll,
  autoTextColor,
  azIcons,
  barChart,
  bcgMatrix,
  bind,
  bindChart,
  bindControl,
  bubble,
  buildDOM,
  buildGaugePalette,
  buildPanel,
  buildSeries,
  buildTicks,
  buildUI,
  bulletChart,
  businessModelCanvas,
  chartHiDpi,
  chartInteract,
  clamp,
  clampVal,
  cleanupTimers,
  closeDetailPanel,
  closeDrawer,
  closeModal,
  clusterMarkers,
  cohortGrid,
  commandPalette,
  confidenceChart,
  costTimeline,
  createDetailPanel,
  createEl,
  createElement,
  createGauge,
  createGaugesInContainer,
  createLayout,
  cruiseLever,
  cssVar,
  customerJourney,
  cycleTheme,
  dashboardStrip,
  dataIcons,
  dataTable,
  datePicker,
  dateRangePicker,
  debounce,
  decisionMatrix,
  defaultMessages,
  detectTheme,
  donut,
  drawMarker,
  drawSpeedometer,
  easeOutCubic,
  editors,
  emit,
  eventBus,
  filterPanel,
  flipCounter,
  formatDate,
  formatDateSimple,
  formatNumber,
  formatTime,
  forms,
  funnel,
  gantt,
  getAccent,
  getCanvasSize,
  getFieldInput,
  getIcon,
  getInitials,
  getLocale,
  getMarkerColors,
  getTheme,
  getVisibleProjected,
  gridLayout,
  hBarChart,
  halfGauge,
  header,
  headerShell,
  heatmap,
  hexLum,
  hexToRgba2 as hexToRgba,
  hiDpiCanvas,
  hideTip,
  hitTest,
  iconCatalog,
  icons,
  initAutoResize,
  initCharCounter,
  initDrillDown,
  initDropdown,
  initFileUpload,
  initFormSteps,
  initForms,
  initGauges,
  initInlineEdit,
  initLiveValidation,
  initMessages,
  initNavTracking,
  initOrgTree,
  initPasswordToggle,
  initPersonField,
  initRotary,
  initScrollReveal,
  initSearchClear,
  initSidebarToggle,
  initSidebarToggleAuto,
  initSlider,
  initTabs,
  initTagInput,
  initTagsField,
  initThemeToggle,
  kpiScorecard,
  lerp,
  liveGraph,
  loadSettings,
  loginScreen,
  manettino,
  mapView,
  mapboxView,
  markerRadius,
  navIcons,
  networkMessages,
  neuralNodes,
  nineBoxMatrix,
  normalizeBars,
  normalizeHex,
  notificationCenter,
  objectIcons,
  off,
  okrPanel,
  on,
  onDrillDown,
  openDetailPanel,
  openDrawer,
  openModal,
  openSearchDrawer,
  palette,
  profileMenu,
  progressRing,
  project,
  radar,
  redrawAll,
  registerDatePicker,
  reinitAll,
  relativeLuminance,
  renderBody2 as renderBody,
  renderContent,
  renderHBar,
  renderIcon,
  renderLegend,
  renderPersonResults,
  renderSkeleton,
  renderSourceCards,
  renderers,
  resetLocale,
  resolveContainer3 as resolveContainer,
  riskMatrix,
  saveSettings,
  sectionCard,
  setLocale,
  setTheme,
  settingsPanel,
  showTip,
  showToast,
  socialGraph,
  sparkline,
  sparklineInteract,
  speedoPalette,
  speedometer,
  statusIcons,
  steppedRotary,
  streamingText,
  swotMatrix,
  systemStatus,
  themePicker,
  themeRotary,
  throttle,
  toast,
  toggleLever,
  toggleNotifications,
  tokenMeter,
  updateGauge,
  updateStatusSelectColor,
  userTable,
  validateField,
  validateForm,
  validators,
  valueToAngle,
  waterfallChart
};
//# sourceMappingURL=index.js.map
