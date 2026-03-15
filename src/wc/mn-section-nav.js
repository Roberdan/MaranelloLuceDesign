/**
 * mn-section-nav — Section pagination bar (prev/next).
 * Attributes: sections (comma-separated ids), current (active section id).
 * Listens to mn-theme-change for automatic theming.
 */

const LABELS = {
  'hero': 'Home', 'tokens': 'Tokens', 'cards': 'Cards',
  'dashboard': 'Dashboard', 'charts': 'Charts', 'network': 'Network',
  'controls': 'Controls', 'forms': 'Forms', 'tables': 'Tables',
  'gauges': 'Gauges', 'cockpit': 'Cockpit', 'telemetry': 'Telemetry',
  'gantt': 'Gantt', 'icons': 'Icons', 'animations': 'Animations',
  'heatmap': 'Heatmap', 'treemap': 'Treemap', 'layouts': 'Layouts',
  'detail-panel': 'Detail Panel', 'interactive': 'Chat', 'okr': 'OKR',
  'map': 'Map', 'social-graph': 'Social Graph', 'advanced': 'Advanced',
  'mesh-network': 'Mesh Network', 'convergio': 'Convergio',
  'web-components': 'Web Comps', 'glass': 'Glass', 'launch': 'Launch',
  'accessibility': 'A11y', 'api-reference': 'API Ref',
  'data-binding': 'Data Binding', 'overlays': 'Overlays', 'org-tree': 'Org Tree',
};

const CSS = `
:host { display: block; width: 100%; box-sizing: border-box; }
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; height: 52px;
  background: var(--mn-snav-bg, rgba(17,17,17,0.97));
  border-top: 1px solid var(--mn-snav-border, rgba(200,200,200,0.12));
  border-bottom: 1px solid var(--mn-snav-border, rgba(200,200,200,0.12));
  font-family: var(--font-display, 'Space Grotesk', sans-serif);
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  gap: 0.5rem;
}
.btn {
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; cursor: pointer;
  color: var(--mn-snav-fg, rgba(200,200,200,0.65));
  font-family: inherit; font-size: inherit;
  letter-spacing: inherit; text-transform: inherit;
  padding: 0.4rem 0; transition: color 0.18s; min-width: 0; flex: 1;
}
.btn:hover:not([disabled]) { color: var(--mn-accent, #FFC72C); }
.btn:focus-visible { outline: 2px solid var(--mn-accent, #FFC72C); outline-offset: 2px; border-radius: 2px; }
.btn[disabled] { opacity: 0.2; cursor: default; }
.btn--prev { justify-content: flex-start; }
.btn--next { justify-content: flex-end; }
.arrow {
  flex-shrink: 0; font-size: 0.7rem;
  color: var(--mn-accent, #FFC72C);
  transition: color 0.18s;
}
.btn[disabled] .arrow { color: inherit; }
.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px; }
.center {
  flex: 0 0 auto; text-align: center;
  color: var(--mn-snav-center, rgba(200,200,200,0.38));
  font-size: 0.6rem; padding: 0 0.75rem; white-space: nowrap;
}
.center strong { color: var(--mn-accent, #FFC72C); font-weight: 700; }
/* Avorio */
:host([data-theme="avorio"]) .nav {
  background: rgba(250,243,230,0.97);
  border-color: rgba(0,0,0,0.09);
}
:host([data-theme="avorio"]) .btn { color: rgba(60,60,60,0.6); }
:host([data-theme="avorio"]) .btn:hover:not([disabled]) { color: #DC0000; }
:host([data-theme="avorio"]) .arrow { color: #DC0000; }
:host([data-theme="avorio"]) .center { color: rgba(60,60,60,0.38); }
:host([data-theme="avorio"]) .center strong { color: #DC0000; }
/* Colorblind */
:host([data-theme="colorblind"]) .btn:hover:not([disabled]) { color: #0072B2; }
:host([data-theme="colorblind"]) .arrow { color: #0072B2; }
:host([data-theme="colorblind"]) .center strong { color: #0072B2; }
/* Mobile */
@media (max-width: 480px) {
  .lbl { max-width: 88px; }
  .center { display: none; }
  .nav { padding: 0 0.75rem; }
}
`;

function lbl(id) { return LABELS[id] ?? id; }

function syncTheme(el) {
  const cls = document.body.className;
  if (cls.includes('mn-avorio')) el.setAttribute('data-theme', 'avorio');
  else if (cls.includes('mn-colorblind')) el.setAttribute('data-theme', 'colorblind');
  else el.removeAttribute('data-theme');
}

class MnSectionNav extends HTMLElement {
  static observedAttributes = ['sections', 'current', 'data-theme'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._onTheme = (e) => {
      const t = e.detail?.theme ?? 'nero';
      if (t === 'avorio' || t === 'colorblind') this.setAttribute('data-theme', t);
      else this.removeAttribute('data-theme');
    };
    document.addEventListener('mn-theme-change', this._onTheme);
    syncTheme(this);
    this._render();
  }

  disconnectedCallback() {
    document.removeEventListener('mn-theme-change', this._onTheme);
  }

  attributeChangedCallback() { this._render(); }

  _go(id) { window.location.hash = id; }

  _render() {
    const sections = (this.getAttribute('sections') ?? '').split(',').filter(Boolean);
    const current = this.getAttribute('current') ?? '';
    const idx = sections.indexOf(current);
    const prev = idx > 0 ? sections[idx - 1] : null;
    const next = idx < sections.length - 1 ? sections[idx + 1] : null;
    const pos = idx + 1;
    const total = sections.length;

    this.shadowRoot.innerHTML = `<style>${CSS}</style>
<nav class="nav" role="navigation" aria-label="Section navigation">
  <button class="btn btn--prev" ${!prev ? 'disabled' : ''}
    aria-label="${prev ? 'Precedente: ' + lbl(prev) : 'Prima sezione'}">
    <span class="arrow" aria-hidden="true">◀</span>
    <span class="lbl">${prev ? lbl(prev) : ''}</span>
  </button>
  <div class="center" aria-live="polite">
    <strong>${pos}</strong>&thinsp;/&thinsp;${total}&ensp;·&ensp;${lbl(current)}
  </div>
  <button class="btn btn--next" ${!next ? 'disabled' : ''}
    aria-label="${next ? 'Successivo: ' + lbl(next) : 'Ultima sezione'}">
    <span class="lbl">${next ? lbl(next) : ''}</span>
    <span class="arrow" aria-hidden="true">▶</span>
  </button>
</nav>`;

    if (prev) this.shadowRoot.querySelector('.btn--prev')
      .addEventListener('click', () => this._go(prev));
    if (next) this.shadowRoot.querySelector('.btn--next')
      .addEventListener('click', () => this._go(next));
  }
}

customElements.define('mn-section-nav', MnSectionNav);
