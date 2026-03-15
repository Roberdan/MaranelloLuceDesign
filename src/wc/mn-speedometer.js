/**
 * Maranello Design System — <mn-speedometer> Web Component
 * Tachometer gauge with animated needle and optional arc bar.
 *
 * @attr {number} value - Current speedometer value
 * @attr {number} max   - Maximum scale value (default 320)
 * @attr {string} size  - Gauge size: sm | md | lg (default md)
 * @attr {string} label - Sub-label text beneath the value
 * @attr {string} unit  - Unit label (default "km/h")
 * @fires mn-speedometer-ready - Dispatched when speedometer is initialized
 * @version 2.0.0
 */

// Dual-mode: ESM import or CDN fallback
let _engine = null;

function getEngine() {
  if (_engine) return _engine;
  if (globalThis.Maranello) {
    _engine = globalThis.Maranello;
    return _engine;
  }
  return null;
}

const _base = new URL('.', import.meta.url).href;
function cssLink(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, _base).href;
  return link;
}

class MnSpeedometer extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'max', 'size', 'label', 'unit'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._ctrl = null;
    this._mo = null;

    const style = document.createElement('style');
    style.textContent = ':host{display:inline-block}canvas{display:block}';

    this._canvas = document.createElement('canvas');
    this._canvas.className = 'mn-speedometer__canvas';
    this._canvas.setAttribute('role', 'img');

    this.shadowRoot.append(
      cssLink('../css/tokens.css'),
      cssLink('../css/gauge.css'),
      style,
      this._canvas,
    );
  }

  connectedCallback() {
    this.setAttribute('role', 'meter');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', this.getAttribute('max') || '320');
    this.setAttribute('aria-valuenow', this.getAttribute('value') || '0');
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', this.getAttribute('label') || 'Speedometer');
    }
    this._init();
  }

  disconnectedCallback() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._teardownObserver();
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (name === 'value') this.setAttribute('aria-valuenow', newVal || '0');
    if (name === 'max') this.setAttribute('aria-valuemax', newVal || '320');
    if (name === 'label') this.setAttribute('aria-label', newVal || 'Speedometer');
    if (!this._ctrl) return;
    if (name === 'value') {
      this._ctrl.setValue(Number(newVal));
    } else {
      this._rebuild();
    }
  }

  /* ── Public API ───────────────────────────────────────────── */

  setValue(n) { this._ctrl?.setValue?.(Number(n)); }
  setBar(n)   { this._ctrl?.setBar?.(Number(n)); }

  /* ── Internals ────────────────────────────────────────────── */

  _sizeValue() {
    const map = { sm: 120, md: 220, lg: 320 };
    const key = this.getAttribute('size') || 'md';
    if (key === 'fluid') {
      const rect = this.getBoundingClientRect();
      return Math.min(rect.width, rect.height) || 220;
    }
    return map[key] || 220;
  }

  _buildOpts() {
    return {
      value: Number(this.getAttribute('value') || 0),
      max:   Number(this.getAttribute('max') || 320),
      unit:  this.getAttribute('unit') || 'km/h',
      size:  this.getAttribute('size') || 'md',
      subLabel: this.getAttribute('label') || undefined,
      animate: true,
    };
  }

  _init() {
    const M = getEngine();
    if (!M?.speedometer) {
      this._waitForEngine(() => this._init());
      return;
    }
    this._teardownObserver();

    const px = this._sizeValue();
    this._canvas.width  = px;
    this._canvas.height = px;
    this._canvas.style.width  = px + 'px';
    this._canvas.style.height = px + 'px';

    this._ctrl = M.speedometer(this._canvas, this._buildOpts());

    const sizeKey = this.getAttribute('size');
    if ((sizeKey === 'fluid' || !sizeKey) && window.ResizeObserver) {
      this._attachResizeObserver(M);
    }

    this.dispatchEvent(new CustomEvent('mn-speedometer-ready', {
      bubbles: true, composed: true,
    }));
  }

  _attachResizeObserver(M) {
    let tid = null;
    this._resizeObs = new ResizeObserver(() => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        const rect = this.getBoundingClientRect();
        const px = Math.min(rect.width, rect.height);
        if (px <= 0) return;
        this._ctrl?.destroy?.();
        this._canvas.width  = px;
        this._canvas.height = px;
        this._canvas.style.width  = px + 'px';
        this._canvas.style.height = px + 'px';
        this._ctrl = M.speedometer(this._canvas, { ...this._buildOpts(), size: px });
      }, 150);
    });
    this._resizeObs.observe(this);
  }

  _rebuild() {
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._init();
  }

  _waitForEngine(cb) {
    requestAnimationFrame(() => {
      if (getEngine()) { cb(); return; }
      if (this._mo) return;
      this._mo = new MutationObserver(() => {
        if (getEngine()) { this._teardownObserver(); cb(); }
      });
      this._mo.observe(document.head, { childList: true });
    });
  }

  _teardownObserver() {
    this._mo?.disconnect();
    this._mo = null;
  }
}

customElements.define('mn-speedometer', MnSpeedometer);
