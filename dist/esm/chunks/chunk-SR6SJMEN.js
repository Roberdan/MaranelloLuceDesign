/* Maranello Luce Design v4.11.0 | MPL-2.0 | github.com/Roberdan/MaranelloLuceDesign */

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

export {
  EventBus,
  eventBus
};
//# sourceMappingURL=chunk-SR6SJMEN.js.map
