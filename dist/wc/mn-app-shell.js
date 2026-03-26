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
        const marker = document.createComment("mn-swap");
        parent.insertBefore(marker, first.handle.container);
        parent.insertBefore(first.handle.container, second.handle.container);
        parent.insertBefore(second.handle.container, marker);
        parent.removeChild(marker);
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
    const el = document.createElement("div");
    el.className = "mn-panel-view";
    el.dataset.viewId = viewId;
    return el;
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
    const backdrop = document.createElement("div");
    backdrop.id = id;
    backdrop.className = "mn-modal-backdrop";
    const modal = document.createElement("div");
    modal.className = "mn-modal";
    modal.appendChild(container);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
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
      const current = this.current();
      if (current) {
        this.notify(current, "remove");
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

// src/wc/mn-app-shell.js
var SLOT_NAMES2 = ["nav", "toolbar", "filter-bar", "main", "secondary", "detail", "bottom", "overlay"];
var VALID_LAYOUTS = /* @__PURE__ */ new Set(["full", "split", "stacked", "docked-bottom", "dual-panel", "side-detail"]);
var MnAppShell = class extends HTMLElement {
  static get observedAttributes() {
    return ["layout"];
  }
  constructor() {
    super();
    this._controller = null;
    this._orchestrator = null;
    this._ownsOrchestrator = false;
  }
  connectedCallback() {
    if (this._controller) return;
    this._controller = new AppShellController(this, {
      layout: this._resolveLayout(this.getAttribute("layout"))
    });
    this._mountSlots();
    if (!this._orchestrator) {
      this._orchestrator = new PanelOrchestrator(
        ViewRegistry.getInstance(),
        new NavigationModel(),
        this._controller
      );
      this._ownsOrchestrator = true;
    }
  }
  disconnectedCallback() {
    if (this._ownsOrchestrator) this._orchestrator?.destroy();
    this._orchestrator = null;
    this._ownsOrchestrator = false;
    this._controller?.destroy();
    this._controller = null;
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "layout" && oldVal !== newVal && this._controller) {
      this._controller.setLayout(this._resolveLayout(newVal));
    }
  }
  set orchestrator(value) {
    this._orchestrator = value;
    this._ownsOrchestrator = false;
  }
  get orchestrator() {
    return this._orchestrator;
  }
  _resolveLayout(raw) {
    return VALID_LAYOUTS.has(raw) ? raw : "full";
  }
  _mountSlots() {
    if (!this._controller) return;
    SLOT_NAMES2.forEach((name) => {
      const container = this._controller.getSlot(name);
      if (!container || container.querySelector(`:scope > slot[name="${name}"]`)) return;
      const slot = document.createElement("slot");
      slot.name = name;
      container.append(slot);
    });
  }
};
if (!customElements.get("mn-app-shell")) {
  customElements.define("mn-app-shell", MnAppShell);
}
//# sourceMappingURL=mn-app-shell.js.map
