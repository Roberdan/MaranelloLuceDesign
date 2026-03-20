/**
 * <mn-theme-toggle> — Web Component theme switcher button
 * Cycles through nero/avorio/colorblind/editorial themes.
 * Applies body class and dispatches change events.
 *
 * @attr {string} mode - Current theme: nero | avorio | colorblind | editorial
 * @fires mn-theme-change - {detail: {theme}}
 * @version 1.5.0
 */
const _base = new URL('.', import.meta.url).href;
function cssLink(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL(path, _base).href;
  return link;
}

// Dual-mode resolver: ESM import or globalThis fallback
const resolve = (path, fallback = null) => {
  try { return globalThis.Maranello?.[path] ?? fallback; } catch { return fallback; }
};
class MnThemeToggle extends HTMLElement {
  static get observedAttributes() {
    return ['mode'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._modes = ['editorial', 'nero', 'avorio', 'colorblind', 'sugar'];
    this._icons = ['\u25D1', '\u25CF', '\u25CB', '\u25D0', '\u2B22'];
    this._labels = ['Editorial (mixed)', 'Full Nero', 'Full Avorio', 'Colorblind-safe', 'Sugar'];
    this._idx = 1; // default: nero

    const tokens = cssLink("../css/tokens.css");

    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block }
      .mn-theme-btn { width: 40px; height: 40px; border-radius: 50%;
        border: 1px solid var(--mn-border);
        background: var(--mn-surface-raised); cursor: pointer;
        font-size: 1.3rem; color: var(--mn-text-tertiary);
        display: flex; align-items: center; justify-content: center;
        transition: background .15s, transform .15s, border-color .15s;
        box-shadow: 0 2px 8px rgba(0,0,0,.3) }
      .mn-theme-btn:hover { background: var(--mn-border);
        transform: scale(1.08) }
      .mn-theme-btn:focus-visible { outline: 2px solid var(--mn-accent);
        outline-offset: 2px }
    `;

    this._btn = document.createElement('button');
    this._btn.className = 'mn-theme-btn';
    this._btn.setAttribute('aria-label', 'Toggle theme');
    this._onBtnClick = () => this._cycle();
    this._btn.addEventListener('click', this._onBtnClick);

    this.shadowRoot.append(tokens, style, this._btn);
  }

  connectedCallback() {
    // Re-attach click handler in case element was moved in DOM (disconnected + reconnected)
    this._btn.addEventListener('click', this._onBtnClick);
    // Priority: attribute > localStorage > default (nero)
    const attr = this.getAttribute('mode');
    let saved = null;
    try { saved = localStorage.getItem('mn-theme'); } catch (_) { /* storage blocked */ }
    const mode = attr || saved;
    if (mode) {
      const idx = this._modes.indexOf(mode);
      if (idx >= 0) this._idx = idx;
    }
    this._applyTheme(false);
  }

  disconnectedCallback() {
    this._btn.removeEventListener('click', this._onBtnClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'mode' && oldVal !== newVal) {
      const idx = this._modes.indexOf(newVal);
      if (idx >= 0 && idx !== this._idx) {
        this._idx = idx;
        this._applyTheme(false);
      }
    }
  }

  /* ── Private ────────────────────────────────────────────── */

  _cycle() {
    this._idx = (this._idx + 1) % this._modes.length;
    this._applyTheme(true);
  }

  _applyTheme(emit) {
    const mode = this._modes[this._idx];
    const setTheme = resolve('setTheme');
    if (typeof setTheme === 'function') setTheme(mode);
    else {
      document.body.classList.remove('mn-nero', 'mn-avorio', 'mn-colorblind', 'mn-sugar');
      if (mode !== 'editorial') document.body.classList.add(`mn-${mode}`);
      try { localStorage.setItem('mn-theme', mode); } catch (_) { /* storage blocked */ }
    }
    this._btn.textContent = this._icons[this._idx];
    this._btn.title = this._labels[this._idx];

    if (emit) {
      this.dispatchEvent(new CustomEvent('mn-theme-change', {
        detail: { theme: mode },
        bubbles: true, composed: true,
      }));
    }

    // Notify Maranello subsystems if available
    requestAnimationFrame(() => {
      const autoContrast = resolve('autoContrast');
      if (typeof autoContrast === 'function') {
        autoContrast('.mn-treemap__cell');
      }
    });
  }
}

customElements.define('mn-theme-toggle', MnThemeToggle);
