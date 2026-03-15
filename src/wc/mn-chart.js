/**
 * Maranello Design System — <mn-chart> Web Component
 * Universal chart element supporting all Maranello chart types.
 * Dual-mode: ESM dynamic import OR window.Maranello fallback for CDN users.
 *
 * @attr {string} type    - Chart type: sparkline | donut | barChart | areaChart |
 *                          radar | bubble | heatmap | treemap | halfGauge | liveGraph
 * @attr {string} data    - JSON data for the chart
 * @attr {string} options - JSON options object
 * @attr {number} width   - Canvas width in px (default 300)
 * @attr {number} height  - Canvas height in px (default 200)
 * @fires mn-chart-ready  - Dispatched when chart is rendered
 * @version 2.0.0
 */

/**
 * Resolve chart factories. Try dynamic ESM import first;
 * if the module is unavailable (CDN mode), fall back to window.Maranello.charts.
 * @returns {Promise<Record<string, Function>|null>}
 */
async function resolveCharts() {
  // CDN fast-path: window.Maranello already populated
  if (window.Maranello?.charts) return window.Maranello.charts;

  // ESM mode: dynamic import from dist/esm/charts (relative to dist/wc/)
  try {
    const mod = await import('../esm/charts/index.js');
    return mod;
  } catch {
    // not available as ESM module — wait for CDN globals
  }

  return null;
}

const _base = new URL('.', import.meta.url).href;

/** @param {string} path */
function cssLink(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, _base).href;
  return link;
}

class MnChart extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'data', 'options', 'width', 'height'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /** @type {object|null} */
    this._ctrl = null;
    this._initAttempts = 0;
    /** @type {Record<string, Function>|null} */
    this._charts = null;

    const style = document.createElement('style');
    style.textContent = ':host{display:inline-block}canvas{display:block}.mn-chart__root{position:relative}';

    this._container = document.createElement('div');
    this._container.className = 'mn-chart__root';

    this._canvas = document.createElement('canvas');
    this._container.append(this._canvas);

    this.shadowRoot.append(
      cssLink('../css/tokens.css'),
      cssLink('../css/charts.css'),
      cssLink('../css/charts-base.css'),
      style,
      this._container,
    );
  }

  connectedCallback() {
    this.setAttribute('role', 'img');
    if (!this.hasAttribute('aria-label')) {
      const type = this.getAttribute('type') || 'chart';
      this.setAttribute('aria-label', `${type} visualization`);
    }
    this._init();
  }

  disconnectedCallback() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._ctrl?.destroy?.();
    this._ctrl = null;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this._charts) {
      this._rebuild();
    } else if (name === 'type' && !this._ctrl) {
      // update aria-label when type changes before init
      this.setAttribute('aria-label', `${newVal || 'chart'} visualization`);
    }
  }

  /* ── Public API ─────────────────────────────────────────── */

  /**
   * Update chart data/options imperatively.
   * @param {unknown[]} [data]
   * @param {Record<string, unknown>} [opts]
   */
  update(data, opts) {
    if (this._ctrl?.update) {
      this._ctrl.update(data, opts);
    } else {
      if (data) this.setAttribute('data', JSON.stringify(data));
      if (opts) this.setAttribute('options', JSON.stringify(opts));
    }
  }

  /* ── Internals ──────────────────────────────────────────── */

  /**
   * @param {string} attr
   * @param {unknown} fallback
   */
  _parseJSON(attr, fallback) {
    try { return JSON.parse(this.getAttribute(attr) || ''); }
    catch { return fallback; }
  }

  async _init() {
    this.setAttribute('aria-busy', 'true');
    // Resolve chart factories (ESM or CDN window.Maranello)
    let charts = await resolveCharts();

    // CDN fallback: poll up to 60 frames for window.Maranello
    while (!charts && ++this._initAttempts < 60) {
      await new Promise((r) => requestAnimationFrame(r));
      charts = window.Maranello?.charts ?? null;
    }

    if (!charts) {
      console.warn('<mn-chart>: chart library not available (ESM or window.Maranello)');
      this.removeAttribute('aria-busy');
      return;
    }
    this._charts = charts;

    const type = this.getAttribute('type') || 'sparkline';
    const factory = charts[type];
    if (typeof factory !== 'function') {
      console.warn(`<mn-chart>: unknown chart type "${type}"`);
      this.removeAttribute('aria-busy');
      return;
    }

    const hasExplicitSize = this.hasAttribute('width') || this.hasAttribute('height');

    if (hasExplicitSize) {
      const w = parseInt(this.getAttribute('width') || '300', 10);
      const h = parseInt(this.getAttribute('height') || '200', 10);
      this._canvas.width = w;
      this._canvas.height = h;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
    } else {
      const rect = this.getBoundingClientRect();
      const w = rect.width || 300;
      const h = rect.height || 200;
      this._canvas.width = w;
      this._canvas.height = h;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
    }

    const data = this._parseJSON('data', []);
    const opts = this._parseJSON('options', {});
    const cw = this._canvas.width, ch = this._canvas.height;
    this._ctrl = factory(this._canvas, data, { ...opts, width: cw, height: ch });

    if (!hasExplicitSize && window.ResizeObserver) {
      this._attachResizeObserver(factory);
    }

    this.dispatchEvent(new CustomEvent('mn-chart-ready', { bubbles: true, composed: true }));
    this.removeAttribute('aria-busy');
  }

  _attachResizeObserver(factory) {
    let tid = null;
    this._resizeObs = new ResizeObserver(() => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        const r = this.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        this._ctrl?.destroy?.();
        this._canvas.width = r.width;
        this._canvas.height = r.height;
        this._canvas.style.width = `${r.width}px`;
        this._canvas.style.height = `${r.height}px`;
        const data = this._parseJSON('data', []);
        const opts = this._parseJSON('options', {});
        this._ctrl = factory(this._canvas, data, { ...opts, width: r.width, height: r.height });
      }, 150);
    });
    this._resizeObs.observe(this);
  }

  _rebuild() {
    this._resizeObs?.disconnect();
    this._resizeObs = null;
    this._ctrl?.destroy?.();
    this._ctrl = null;
    this._canvas.getContext('2d')?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._initAttempts = 0;
    this._charts = null;
    this._init();
  }
}

customElements.define('mn-chart', MnChart);
