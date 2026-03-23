import './mn-theme-toggle.js';

/**
 * @typedef {import('../ts/header-shell').HeaderShellOptions} HeaderShellOptions
 * @typedef {import('../ts/header-shell').HeaderShellController} HeaderShellController
 */

let _headerShellFactoryPromise = null;

function getGlobalHeaderShell() {
  try {
    return globalThis.Maranello?.headerShell?.init ?? null;
  } catch (_) {
    return null;
  }
}

function normalizeConfig(value) {
  return value && typeof value === 'object' ? value : { sections: [] };
}

async function importHeaderShellModule() {
  try {
    const sourceModule = await import('../ts/header-shell.js');
    if (typeof sourceModule.headerShell === 'function') return sourceModule.headerShell;
  } catch (_) {}
  const distModule = await import('../../dist/esm/index.js');
  return distModule.headerShell;
}

function resolveHeaderShell() {
  if (_headerShellFactoryPromise) return _headerShellFactoryPromise;
  _headerShellFactoryPromise = (async () => {
    const globalHeaderShell = getGlobalHeaderShell();
    if (typeof globalHeaderShell === 'function') return globalHeaderShell;
    return importHeaderShellModule();
  })();
  return _headerShellFactoryPromise;
}

/**
 * <mn-header-shell> wraps the rich imperative `headerShell()` API in a light-DOM
 * Web Component and keeps the approved responsive shell layout reusable.
 *
 * Primary API is the `config` property (JS object), not HTML attributes:
 * @example
 * const shell = document.querySelector('mn-header-shell');
 * shell.config = {
 *   sections: [
 *     { type: 'brand', label: 'Maranello Luce', logoSrc: '/logo.svg' },
 *     { type: 'spacer' },
 *     { type: 'search', placeholder: 'Filter by name…' },
 *     { type: 'theme' },
 *     { type: 'profile', name: 'Roberdan D.' },
 *   ],
 * };
 *
 * `mn-header-shell` auto-loads the `mn-theme-toggle` dependency used by the
 * theme section, emits `header-shell-search` live while the user types, and
 * preserves bubbling `header-shell-*` events from the internal shell markup.
 */
class MnHeaderShell extends HTMLElement {
  constructor() {
    super();
    /** @type {HeaderShellOptions} */
    this._config = { sections: [] };
    /** @type {HeaderShellController | null} */
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
      query: '',
      filters: {},
      activeActionId: '',
      themeMode: 'nero',
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
      this.dispatchEvent(new CustomEvent('mn-header-shell-ready', {
        detail: { controller: this._controller },
        bubbles: true,
        composed: true,
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

if (!customElements.get('mn-header-shell')) {
  customElements.define('mn-header-shell', MnHeaderShell);
}
