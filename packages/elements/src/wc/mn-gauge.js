/**
 * Maranello Design System — <mn-gauge> Web Component
 * Ferrari gauge instrument with canvas rendering and glass overlay.
 *
 * Dual-mode: ESM import (bundlers) or window.Maranello CDN fallback.
 *
 * @attr {number}  value  - Current gauge value
 * @attr {number}  max    - Maximum scale value (default 100)
 * @attr {string}  unit   - Unit label (e.g. "km/h", "%")
 * @attr {string}  label  - Bottom label text
 * @attr {string}  size   - Gauge size: sm | md | lg (default md)
 * @attr {string}  config - JSON string for full complication config
 * @fires mn-gauge-ready  - Dispatched when gauge engine is initialized
 * @version 1.5.0
 */

const _base = new URL('.', import.meta.url).href;

/** Resolve FerrariGauge: CDN-first (if IIFE loaded), ESM fallback. */
async function resolveEngine() {
  if (window.Maranello?.FerrariGauge) return window.Maranello.FerrariGauge;
  try {
    const mod = await import(new URL('../ts/gauge-engine.js', _base).href);
    if (mod?.FerrariGauge) return mod.FerrariGauge;
  } catch { /* ESM not available */ }
  return null;
}

function cssLink(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, _base).href;
  return link;
}

/** Size in pixels for a given size key. */
const SIZE_MAP = { sm: 120, md: 220, lg: 320 };

class MnGauge extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'max', 'unit', 'label', 'size', 'config'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /** @type {InstanceType<import('../ts/gauge-engine').FerrariGauge> | null} */
    this._gauge = null;
    this._ready = false;

    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; position: relative; }
      .mn-gauge__wrap { position: relative; }
      canvas { display: block; }
      .mn-gauge__glass {
        position: absolute; inset: 0;
        border-radius: 50%;
        background: radial-gradient(
          ellipse 70% 50% at 50% 35%,
          var(--mn-hover-bg) 0%,
          transparent 100%
        );
        pointer-events: none;
      }
    `;

    this._wrap = document.createElement('div');
    this._wrap.className = 'mn-gauge__wrap';

    this._canvas = document.createElement('canvas');
    this._canvas.className = 'mn-gauge__canvas';

    this._glass = document.createElement('div');
    this._glass.className = 'mn-gauge__glass';

    this._wrap.append(this._canvas, this._glass);
    this.shadowRoot.append(
      cssLink('../css/tokens.css'),
      cssLink('../css/gauge.css'),
      style,
      this._wrap
    );
  }

  connectedCallback() {
    this.setAttribute('role', 'meter');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', this.getAttribute('max') || '100');
    this.setAttribute('aria-valuenow', this.getAttribute('value') || '0');
    if (this.getAttribute('label')) {
      this.setAttribute('aria-label', this.getAttribute('label'));
    }
    this._init();
  }

  disconnectedCallback() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._gauge?.destroy?.();
    this._gauge = null;
    this._ready = false;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'value') this.setAttribute('aria-valuenow', newVal || '0');
    if (name === 'max')   this.setAttribute('aria-valuemax', newVal || '100');
    if (name === 'label') this.setAttribute('aria-label', newVal || '');
    if (!this._gauge) return;
    this._applyConfig();
    this._gauge.redraw();
  }

  /* ── Public API ─────────────────────────────────────────── */

  animateTo(value) {
    if (!this._gauge) return;
    this._gauge.config.value = Number(value);
    this._gauge.animate();
  }

  redraw() {
    this._gauge?.redraw?.();
  }

  /* ── Internals ──────────────────────────────────────────── */

  _parseJSON(attr, fallback) {
    try { return JSON.parse(this.getAttribute(attr) || ''); }
    catch { return fallback; }
  }

  _sizeValue() {
    const key = this.getAttribute('size') || 'md';
    if (key === 'fluid') {
      const rect = this.getBoundingClientRect();
      return Math.min(rect.width, rect.height) || SIZE_MAP.md;
    }
    return SIZE_MAP[key] ?? SIZE_MAP.md;
  }

  _applyConfig() {
    if (!this._gauge) return;
    const cfg = this._gauge.config;
    const custom = this._parseJSON('config', null);
    if (custom && typeof custom === 'object') Object.assign(cfg, custom);
    if (this.hasAttribute('value')) cfg.value = Number(this.getAttribute('value'));
    if (this.hasAttribute('max'))   cfg.max   = Number(this.getAttribute('max'));
    if (this.hasAttribute('unit'))  cfg.unit  = this.getAttribute('unit');
    if (this.hasAttribute('label')) cfg.label = this.getAttribute('label');
  }

  async _init() {
    const FerrariGauge = await resolveEngine();
    if (!FerrariGauge) {
      console.warn('[mn-gauge] FerrariGauge engine not available (ESM or window.Maranello)');
      return;
    }

    const px = this._sizeValue();
    this._canvas.width  = px;
    this._canvas.height = px;
    this._canvas.style.width  = px + 'px';
    this._canvas.style.height = px + 'px';
    this._glass.style.width   = px + 'px';
    this._glass.style.height  = px + 'px';

    this._gauge = new FerrariGauge(this._canvas);

    const cfg = this._gauge.config;
    cfg.max   = Number(this.getAttribute('max') || 100);
    cfg.value = 0;
    cfg.unit  = this.getAttribute('unit')  || '';
    cfg.label = this.getAttribute('label') || '';

    const custom = this._parseJSON('config', null);
    if (custom && typeof custom === 'object') Object.assign(cfg, custom);

    this._ready = true;

    const targetValue = Number(this.getAttribute('value') || 0);
    if (targetValue) {
      cfg.value = targetValue;
      this._gauge.animate();
    } else {
      this._gauge.redraw();
    }

    this.dispatchEvent(new CustomEvent('mn-gauge-ready', {
      bubbles: true, composed: true,
    }));

    const sizeKey = this.getAttribute('size');
    if ((sizeKey === 'fluid' || !sizeKey) && window.ResizeObserver) {
      this._attachResizeObserver();
    }
  }

  _attachResizeObserver() {
    let tid = null;
    this._resizeObs = new ResizeObserver(() => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        if (!this._gauge) return;
        const rect = this.getBoundingClientRect();
        const px = Math.min(rect.width, rect.height);
        if (px <= 0 || px === this._gauge.size) return;
        this._canvas.width  = px;
        this._canvas.height = px;
        this._canvas.style.width  = px + 'px';
        this._canvas.style.height = px + 'px';
        this._glass.style.width   = px + 'px';
        this._glass.style.height  = px + 'px';
        this._gauge.init();
      }, 150);
    });
    this._resizeObs.observe(this);
  }
}

customElements.define('mn-gauge', MnGauge);
