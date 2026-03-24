"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_mn_theme_toggle = require("./mn-theme-toggle.cjs");
let _headerShellFactory = null;
function getGlobalHeaderShell() {
  try {
    return globalThis.Maranello?.headerShell?.init ?? null;
  } catch (_) {
    return null;
  }
}
function normalizeConfig(value) {
  return value && typeof value === "object" ? value : { sections: [] };
}
async function importHeaderShellModule() {
  try {
    const sourceModule = await import("../index.cjs");
    if (typeof sourceModule.headerShell === "function") return sourceModule.headerShell;
  } catch (_) {
  }
  const distModule = await import("../../dist/esm/index.js");
  return distModule.headerShell;
}
async function resolveHeaderShell() {
  if (_headerShellFactory) return _headerShellFactory;
  const globalHeaderShell = getGlobalHeaderShell();
  if (typeof globalHeaderShell === "function") {
    _headerShellFactory = globalHeaderShell;
    return _headerShellFactory;
  }
  _headerShellFactory = await importHeaderShellModule();
  return _headerShellFactory;
}
class MnHeaderShell extends HTMLElement {
  constructor() {
    super();
    this._config = { sections: [] };
    this._controller = null;
    this._renderVersion = 0;
    this._readyPromise = Promise.resolve(this);
  }
  connectedCallback() {
    this._render();
  }
  disconnectedCallback() {
    this._cleanup();
  }
  /** @returns {HeaderShellOptions} */
  get config() {
    return this._config;
  }
  /** @param {HeaderShellOptions} value */
  set config(value) {
    this._config = normalizeConfig(value);
    if (this.isConnected) this._render();
  }
  get controller() {
    return this._controller;
  }
  whenReady() {
    return this._readyPromise;
  }
  getState() {
    return this._controller?.getState() ?? {
      query: "",
      filters: {},
      activeActionId: "",
      themeMode: "nero"
    };
  }
  setQuery(query) {
    this._controller?.setQuery(query);
  }
  setFilter(groupId, values) {
    this._controller?.setFilter(groupId, values);
  }
  _render() {
    const renderVersion = this._renderVersion + 1;
    this._renderVersion = renderVersion;
    this._readyPromise = (async () => {
      this._cleanup();
      const headerShell = await resolveHeaderShell();
      if (!this.isConnected || renderVersion !== this._renderVersion) return this;
      this._controller = headerShell(this, normalizeConfig(this._config));
      this.dispatchEvent(new CustomEvent("mn-header-shell-ready", {
        detail: { controller: this._controller },
        bubbles: true,
        composed: true
      }));
      return this;
    })();
    return this._readyPromise;
  }
  _cleanup() {
    this._controller?.destroy?.();
    this._controller = null;
  }
}
if (!customElements.get("mn-header-shell")) {
  customElements.define("mn-header-shell", MnHeaderShell);
}
