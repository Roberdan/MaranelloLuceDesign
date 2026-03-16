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

// src/ts/controls/index.ts
var index_exports = {};
__export(index_exports, {
  closeDetailPanel: () => closeDetailPanel,
  closeDrawer: () => closeDrawer,
  cruiseLever: () => cruiseLever,
  initDrillDown: () => initDrillDown,
  initOrgTree: () => initOrgTree,
  manettino: () => manettino,
  openDetailPanel: () => openDetailPanel,
  openDrawer: () => openDrawer,
  steppedRotary: () => steppedRotary,
  toggleLever: () => toggleLever,
  toggleNotifications: () => toggleNotifications
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
function openDrawer(id, triggerEl) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.add("mn-drawer--open");
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  const trigger = triggerEl ?? document.activeElement;
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-drawer__backdrop")) {
    backdrop.classList.add("mn-drawer__backdrop--visible");
    backdrop.addEventListener(
      "click",
      () => closeDrawer(id, trigger),
      { once: true }
    );
  }
  const onKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDrawer(id, trigger);
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first2 = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first2) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first2.focus();
    }
  };
  drawer.addEventListener("keydown", onKey);
  drawer._mnDrawerKeyHandler = onKey;
  const first = drawer.querySelector("button, [href], input, [tabindex]");
  if (first) first.focus();
}
function closeDrawer(id, triggerEl) {
  const drawer = document.getElementById(id);
  if (!drawer) return;
  drawer.classList.remove("mn-drawer--open");
  drawer.removeAttribute("role");
  drawer.removeAttribute("aria-modal");
  const backdrop = drawer.previousElementSibling;
  if (backdrop && backdrop.classList.contains("mn-drawer__backdrop")) {
    backdrop.classList.remove("mn-drawer__backdrop--visible");
  }
  const handler = drawer._mnDrawerKeyHandler;
  if (typeof handler === "function") {
    drawer.removeEventListener("keydown", handler);
    delete drawer._mnDrawerKeyHandler;
  }
  if (triggerEl && typeof triggerEl.focus === "function") triggerEl.focus();
}
function initOrgTree(container) {
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  container.querySelectorAll(".mn-org-tree__toggle").forEach((toggle) => {
    if (toggle.classList.contains("mn-org-tree__toggle--leaf")) return;
    const item = toggle.closest(".mn-org-tree__item");
    const children = item?.querySelector(".mn-org-tree__children");
    const isCollapsed = children?.classList.contains("mn-org-tree__children--collapsed") ?? true;
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!item || !children) return;
      const collapsed = children.classList.contains("mn-org-tree__children--collapsed");
      children.classList.toggle("mn-org-tree__children--collapsed");
      toggle.classList.toggle("mn-org-tree__toggle--expanded", collapsed);
      toggle.setAttribute("aria-expanded", String(collapsed));
    }, sig);
  });
  const nodes = container.querySelectorAll(".mn-org-tree__node");
  nodes.forEach((node, idx) => {
    node.setAttribute("tabindex", idx === 0 ? "0" : "-1");
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
    }, sig);
    node.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = idx + 1 < nodes.length ? idx + 1 : idx;
        nodes[next].focus();
        nodes[next].setAttribute("tabindex", "0");
        node.setAttribute("tabindex", "-1");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : 0;
        nodes[prev].focus();
        nodes[prev].setAttribute("tabindex", "0");
        node.setAttribute("tabindex", "-1");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const toggle = node.closest(".mn-org-tree__item")?.querySelector(".mn-org-tree__toggle");
        if (toggle && toggle.getAttribute("aria-expanded") === "false") toggle.click();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const toggle = node.closest(".mn-org-tree__item")?.querySelector(".mn-org-tree__toggle");
        if (toggle && toggle.getAttribute("aria-expanded") === "true") toggle.click();
      }
    }, sig);
  });
  return { destroy: () => ac.abort() };
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
    const initiallyOpen = contentEl.classList.contains("mn-drill-down__content--open");
    trigger.setAttribute("aria-expanded", String(initiallyOpen));
    trigger.addEventListener("click", () => {
      const isOpen = contentEl.classList.contains("mn-drill-down__content--open");
      contentEl.classList.toggle("mn-drill-down__content--open");
      trigger.classList.toggle("mn-drill-down--expanded");
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

// src/ts/core/utils.ts
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
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
    root.setAttribute("aria-valuenow", String(current));
    root.setAttribute("aria-valuetext", positions[current]);
    if (onChange) onChange(current, positions[current]);
  }
  root.setAttribute("tabindex", "0");
  root.setAttribute("role", "slider");
  root.setAttribute("aria-label", opts?.label ?? "Cruise lever");
  root.setAttribute("aria-valuemin", "0");
  root.setAttribute("aria-valuemax", String(total - 1));
  root.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        setPos(current + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        e.preventDefault();
        setPos(current - 1);
        break;
      case "Home":
        e.preventDefault();
        setPos(0);
        break;
      case "End":
        e.preventDefault();
        setPos(total - 1);
        break;
    }
  });
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
  let on = opts?.initial ?? false;
  const onChange = opts?.onChange ?? null;
  const root = createElement("div", "mn-ctrl-toggle");
  if (on) root.classList.add("mn-ctrl-toggle--on");
  addLabel(root, opts?.label);
  const body = createElement("div", "mn-ctrl-toggle__body");
  body.appendChild(createElement("div", "mn-ctrl-toggle__lever"));
  body.appendChild(createElement("div", "mn-ctrl-toggle__indicator"));
  root.appendChild(body);
  container.appendChild(root);
  root.setAttribute("tabindex", "0");
  root.setAttribute("role", "switch");
  root.setAttribute("aria-label", opts?.label ?? "Toggle");
  root.setAttribute("aria-checked", String(on));
  function toggle() {
    on = !on;
    root.classList.toggle("mn-ctrl-toggle--on", on);
    root.setAttribute("aria-checked", String(on));
    if (onChange) onChange(on);
    eventBus.emit("toggle-change", { on });
  }
  body.addEventListener("click", toggle);
  root.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      toggle();
      e.preventDefault();
    }
  });
  return {
    getValue: () => on,
    setValue: (v) => {
      if (!!v !== on) toggle();
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
  const ARC = 240, START = -120;
  const angleFor = (i) => START + (total > 1 ? i / (total - 1) * ARC : 0);
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
    posEls.forEach((el, i) => el.classList.toggle("mn-ctrl-manettino__pos--active", i === current));
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
  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START, total, set, () => current);
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
  const ARC = 180, START = -90;
  const angleFor = (i) => START + (total > 1 ? i / (total - 1) * ARC : 0);
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
    posEls.forEach((el, i) => el.classList.toggle("mn-ctrl-stepped__pos--active", i === current));
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
  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START, total, set, () => current);
  return {
    getValue: () => current,
    setValue: (idx) => set(idx),
    destroy: () => {
      cleanup();
      container.removeChild(root);
    }
  };
}
//# sourceMappingURL=index.cjs.map
