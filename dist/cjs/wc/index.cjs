"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  getAvailableTags: () => getAvailableTags,
  getRegistered: () => getRegistered,
  isRegistered: () => isRegistered,
  registerAll: () => registerAll
});
module.exports = __toCommonJS(index_exports);
const WC_TAGS = [
  "mn-app-shell",
  "mn-a11y",
  "mn-async-select",
  "mn-chart",
  "mn-chat",
  "mn-command-palette",
  "mn-dashboard",
  "mn-data-table",
  "mn-date-picker",
  "mn-detail-panel",
  "mn-entity-workbench",
  "mn-ferrari-control",
  "mn-facet-workbench",
  "mn-funnel",
  "mn-gantt",
  "mn-gauge",
  "mn-header-shell",
  "mn-hbar",
  "mn-login",
  "mn-map",
  "mn-mapbox",
  "mn-modal",
  "mn-okr",
  "mn-profile",
  "mn-speedometer",
  "mn-state-scaffold",
  "mn-system-status",
  "mn-tab",
  "mn-tabs",
  "mn-theme-rotary",
  "mn-section-nav",
  "mn-theme-toggle",
  "mn-toast"
];
let _loaded = false;
async function registerAll() {
  if (_loaded) return;
  try {
    await Promise.all([
      import("./mn-app-shell.js"),
      import("./mn-a11y.js"),
      import("./mn-async-select.js"),
      import("./mn-chart.js"),
      import("./mn-chat.js"),
      import("./mn-command-palette.js"),
      import("./mn-dashboard.js"),
      import("./mn-data-table.js"),
      import("./mn-date-picker.js"),
      import("./mn-detail-panel.js"),
      import("./mn-entity-workbench.js"),
      import("./mn-ferrari-control.js"),
      import("./mn-facet-workbench.js"),
      import("./mn-funnel.js"),
      import("./mn-gantt.js"),
      import("./mn-gauge.js"),
      import("./mn-header-shell.js"),
      import("./mn-hbar.js"),
      import("./mn-login.js"),
      import("./mn-map.js"),
      import("./mn-mapbox.js"),
      import("./mn-modal.js"),
      import("./mn-okr.js"),
      import("./mn-profile.js"),
      import("./mn-speedometer.js"),
      import("./mn-state-scaffold.js"),
      import("./mn-system-status.js"),
      import("./mn-tabs.js"),
      // also registers mn-tab
      import("./mn-section-nav.js"),
      import("./mn-theme-rotary.js"),
      import("./mn-theme-toggle.js"),
      import("./mn-toast.js")
    ]);
    if (typeof document !== "undefined" && !document.querySelector("mn-a11y")) {
      document.body.appendChild(document.createElement("mn-a11y"));
    }
    _loaded = true;
  } catch (err) {
    console.warn("Maranello WC registerAll failed \u2014 retry on next call", err);
  }
}
function isRegistered(tag) {
  return !!customElements.get(tag);
}
function getAvailableTags() {
  return WC_TAGS;
}
function getRegistered() {
  return WC_TAGS.filter((tag) => !!customElements.get(tag));
}
//# sourceMappingURL=index.cjs.map
