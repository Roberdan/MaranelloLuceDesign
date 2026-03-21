/**
 * Maranello Luce Design System — Demo App
 * Hash-based SPA routing: one section at a time.
 * Dynamic imports: only the current section's JS loads on demand.
 * Works on local dev server AND GitHub Pages static hosting.
 */

const root = document.getElementById('demo-root');
if (!root) throw new Error('Missing #demo-root');

// Dynamic import map — sections load only when navigated to (browser caches modules)
const SECTIONS = new Map([
  ['hero',           () => import('./sections/hero.js').then(m => m.createHeroSection)],
  ['tokens',         () => import('./sections/tokens.js').then(m => m.createTokensSection)],
  ['cards',          () => import('./sections/cards.js').then(m => m.createCardsSection)],
  ['dashboard',      () => import('./sections/dashboard.js').then(m => m.createDashboardSection)],
  ['dashboard-classic', () => import('./sections/dashboard-classic.js').then(m => m.createDashboardClassicSection)],
  ['charts',         () => import('./sections/charts.js').then(m => m.createChartsSection)],
  ['network',        () => import('./sections/network.js').then(m => m.createNetworkSection)],
  ['controls',       () => import('./sections/controls.js').then(m => m.createControlsSection)],
  ['forms',          () => import('./sections/forms.js').then(m => m.createFormsSection)],
  ['tables',         () => import('./sections/tables.js').then(m => m.createTablesSection)],
  ['gauges',         () => import('./sections/gauges.js').then(m => m.createGaugesSection)],
  ['cockpit',        () => import('./sections/cockpit.js').then(m => m.createCockpitSection)],
  ['telemetry',      () => import('./sections/telemetry.js').then(m => m.createTelemetrySection)],
  ['gantt',          () => import('./sections/gantt.js').then(m => m.createGanttSection)],
  ['icons',          () => import('./sections/icons.js').then(m => m.createIconsSection)],
  ['animations',     () => import('./sections/animations.js').then(m => m.createAnimationsSection)],
  ['heatmap',        () => import('./sections/heatmap.js').then(m => m.createHeatmapSection)],
  ['treemap',        () => import('./sections/treemap.js').then(m => m.createTreemapSection)],
  ['layouts',        () => import('./sections/layouts.js').then(m => m.createLayoutsSection)],
  ['detail-panel',   () => import('./sections/detail-panel.js').then(m => m.createDetailPanelSection)],
  ['interactive',    () => import('./sections/interactive.js').then(m => m.createInteractiveSection)],
  ['okr',            () => import('./sections/okr-panel.js').then(m => m.createOkrSection)],
  ['map',            () => import('./sections/map.js').then(m => m.createMapSection)],
  ['social-graph',   () => import('./sections/social-graph.js').then(m => m.createSocialGraphSection)],
  ['advanced',       () => import('./sections/advanced.js').then(m => m.createAdvancedSection)],
  ['mesh-network',   () => import('./sections/mesh-network.js').then(m => m.createMeshNetworkSection)],
  ['convergio',      () => import('./sections/convergio.js').then(m => m.createConvergioSection)],
  ['web-components', () => import('./sections/web-components.js').then(m => m.createWebComponentsSection)],
  ['launch',         () => import('./sections/launch.js').then(m => m.createLaunchSection)],
  ['accessibility',  () => import('./sections/accessibility.js').then(m => m.createAccessibilitySection)],
  ['api-reference',  () => import('./sections/api-reference.js').then(m => m.createApiReferenceSection)],
  ['data-binding',   () => import('./sections/data-binding.js').then(m => m.createDataBindingSection)],
  ['overlays',       () => import('./sections/overlays.js').then(m => m.createOverlaysSection)],
  ['org-tree',       () => import('./sections/org-tree.js').then(m => m.createOrgTreeSection)],
  ['dashboard-widgets', () => import('./sections/dashboard-widgets.js').then(m => m.createDashboardWidgetsSection)],
  ['analytics',         () => import('./sections/analytics.js').then(m => m.createAnalyticsSection)],
  ['strategy',          () => import('./sections/strategy.js').then(m => m.createStrategySection)],
  ['agentic',           () => import('./sections/agentic.js').then(m => m.createAgenticSection)],
  ['bi-dashboard',      () => import('./sections/bi-dashboard.js').then(m => m.createBiDashboardSection)],
  ['platform-admin',    () => import('./sections/platform-admin.js').then(m => m.createPlatformAdminSection)],
  ['finops',            () => import('./sections/finops.js').then(m => m.createFinOpsSection)],
  ['customer-journey',  () => import('./sections/customer-journey.js').then(m => m.createCustomerJourneySection)],
  ['admin-components',  () => import('./sections/admin-components.js').then(m => m.createAdminComponentsSection)],
]);

const SECTION_KEYS = [...SECTIONS.keys()];

const SECTION_LABELS = {
  'hero': 'Home', 'tokens': 'Tokens', 'cards': 'Cards', 'dashboard': 'Dashboard', 'dashboard-classic': 'Dash Classic',
  'charts': 'Charts', 'network': 'Network', 'controls': 'Controls', 'forms': 'Forms',
  'tables': 'Tables', 'gauges': 'Gauges', 'cockpit': 'Cockpit', 'telemetry': 'Telemetry',
  'gantt': 'Gantt', 'icons': 'Icons', 'animations': 'Anim', 'heatmap': 'Heatmap',
  'treemap': 'Treemap', 'layouts': 'Layouts', 'detail-panel': 'Detail',
  'interactive': 'Chat', 'okr': 'OKR', 'map': 'Map', 'social-graph': 'Social',
  'advanced': 'Advanced', 'mesh-network': 'Mesh', 'convergio': 'Convergio',
  'web-components': 'WC', 'launch': 'Launch', 'accessibility': 'A11y',
  'api-reference': 'API', 'data-binding': 'Binding', 'overlays': 'Overlays',
  'org-tree': 'Org',
  'dashboard-widgets': 'Widgets',
  'analytics': 'Analytics',
  'strategy': 'Strategy',
  'agentic': 'Agentic',
  'bi-dashboard': 'BI',
  'platform-admin': 'Admin',
  'finops': 'FinOps',
  'customer-journey': 'Journey',
  'admin-components': 'Admin WC',
};

function safeErr(name, err) {
  console.error(`[demo] ${name} crashed:`, err);
  const el = document.createElement('section');
  el.className = 'mn-section-dark';
  el.innerHTML = `<div class="mn-container" style="padding:var(--space-xl)">
    <p style="color:var(--mn-error)">Section "${name}" failed to render</p>
    <pre class="mn-micro" style="color:var(--mn-text-muted)">${String(err?.message ?? err)}</pre></div>`;
  return el;
}

function updateHeaderNav(name) {
  const idx = SECTION_KEYS.indexOf(name);
  const prev = idx > 0 ? SECTION_KEYS[idx - 1] : null;
  const next = idx < SECTION_KEYS.length - 1 ? SECTION_KEYS[idx + 1] : null;
  const prevBtn = document.getElementById('demo-pg-prev');
  const nextBtn = document.getElementById('demo-pg-next');
  const label = document.getElementById('demo-pg-label');
  if (prevBtn) {
    prevBtn.disabled = !prev;
    prevBtn.title = prev ? (SECTION_LABELS[prev] || prev) : '';
    prevBtn.setAttribute('aria-label', prev ? `Previous: ${SECTION_LABELS[prev] || prev}` : 'Previous section');
  }
  if (nextBtn) {
    nextBtn.disabled = !next;
    nextBtn.title = next ? (SECTION_LABELS[next] || next) : '';
    nextBtn.setAttribute('aria-label', next ? `Next: ${SECTION_LABELS[next] || next}` : 'Next section');
  }
  if (label) label.textContent = `${idx + 1} / ${SECTION_KEYS.length}`;
}

function initHeaderNav() {
  document.getElementById('demo-pg-prev')?.addEventListener('click', () => {
    const idx = SECTION_KEYS.indexOf(currentSection());
    if (idx > 0) window.location.hash = SECTION_KEYS[idx - 1];
  });
  document.getElementById('demo-pg-next')?.addEventListener('click', () => {
    const idx = SECTION_KEYS.indexOf(currentSection());
    if (idx < SECTION_KEYS.length - 1) window.location.hash = SECTION_KEYS[idx + 1];
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input,textarea,select,[contenteditable]')) return;
    const idx = SECTION_KEYS.indexOf(currentSection());
    if (e.key === 'ArrowRight' && idx < SECTION_KEYS.length - 1) window.location.hash = SECTION_KEYS[idx + 1];
    else if (e.key === 'ArrowLeft' && idx > 0) window.location.hash = SECTION_KEYS[idx - 1];
  });
}

function currentSection() {
  const hash = window.location.hash.replace('#', '').trim();
  return SECTIONS.has(hash) ? hash : 'hero';
}

function setActiveNav(name) {
  document.querySelectorAll('.demo-nav__links a').forEach((a) => {
    a.classList.toggle('demo-nav__link--active', a.getAttribute('href') === '#' + name);
  });
  updateHeaderNav(name);
}

// Loading placeholder while dynamic import resolves
function showLoader() {
  root.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
    <div class="mn-spinner mn-spinner--lg"><div class="mn-spinner__ring"></div></div>
  </div>`;
}

async function render(name) {
  setActiveNav(name);
  showLoader();
  try {
    const factory = await SECTIONS.get(name)();
    // Clear after load (stops canvas/RAF of removed elements)
    while (root.firstChild) root.removeChild(root.firstChild);
    root.appendChild(factory());
  } catch (err) {
    while (root.firstChild) root.removeChild(root.firstChild);
    root.appendChild(safeErr(name, err));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Hash navigation
window.addEventListener('hashchange', () => render(currentSection()));

// Theme label sync — reads body class directly so it works before Maranello IIFE loads
function getActiveTheme() {
  const cl = document.body.classList;
  if (cl.contains('mn-avorio')) return 'avorio';
  if (cl.contains('mn-colorblind')) return 'colorblind';
  if (cl.contains('mn-nero')) return 'nero';
  return window.Maranello?.getTheme?.() ?? 'editorial';
}

function updateThemeLabel() {
  const label = document.getElementById('demo-theme-label');
  if (!label) return;
  const lang = document.documentElement.lang || 'en';
  const prefix = lang === 'it' ? 'CORRENTE:' : 'CURRENT:';
  const names = {
    en: { nero: 'Nero', avorio: 'Avorio', colorblind: 'Colorblind', editorial: 'Editorial' },
    it: { nero: 'Nero', avorio: 'Avorio', colorblind: 'Daltonismo', editorial: 'Editoriale' }
  };
  const map = names[lang] ?? names.en;
  label.textContent = `${prefix} ${map[getActiveTheme()] ?? getActiveTheme()}`;
}

document.addEventListener('mn-theme-change', () => {
  updateThemeLabel();
});

requestAnimationFrame(updateThemeLabel);

// Wire header prev/next buttons once
initHeaderNav();

// Initial render
render(currentSection());
