/**
 * Maranello Luce Design System — Demo App
 * Lazy-loads section modules when they scroll into view.
 */

const sectionDefs = [
  { id: 'hero',        mod: './sections/hero.js',           fn: 'createHeroSection',        eager: true },
  { id: 'tokens',      mod: './sections/tokens.js',         fn: 'createTokensSection',      eager: true },
  { id: 'cards',       mod: './sections/cards.js',          fn: 'createCardsSection',        eager: true },
  { id: 'dashboard',   mod: './sections/dashboard.js',      fn: 'createDashboardSection' },
  { id: 'charts',      mod: './sections/charts.js',         fn: 'createChartsSection' },
  { id: 'network',     mod: './sections/network.js',        fn: 'createNetworkSection' },
  { id: 'controls',    mod: './sections/controls.js',       fn: 'createControlsSection' },
  { id: 'forms',       mod: './sections/forms.js',          fn: 'createFormsSection' },
  { id: 'tables',      mod: './sections/tables.js',         fn: 'createTablesSection' },
  { id: 'gauges',      mod: './sections/gauges.js',         fn: 'createGaugesSection' },
  { id: 'cockpit',     mod: './sections/cockpit.js',        fn: 'createCockpitSection' },
  { id: 'telemetry',   mod: './sections/telemetry.js',      fn: 'createTelemetrySection' },
  { id: 'gantt',       mod: './sections/gantt.js',          fn: 'createGanttSection' },
  { id: 'icons',       mod: './sections/icons.js',          fn: 'createIconsSection' },
  { id: 'animations',  mod: './sections/animations.js',     fn: 'createAnimationsSection' },
  { id: 'heatmap',     mod: './sections/heatmap.js',        fn: 'createHeatmapSection' },
  { id: 'treemap',     mod: './sections/treemap.js',        fn: 'createTreemapSection' },
  { id: 'layouts',     mod: './sections/layouts.js',        fn: 'createLayoutsSection' },
  { id: 'detail-panel',mod: './sections/detail-panel.js',   fn: 'createDetailPanelSection' },
  { id: 'interactive', mod: './sections/interactive.js',     fn: 'createInteractiveSection' },
  { id: 'okr',         mod: './sections/okr-panel.js',      fn: 'createOkrSection' },
  { id: 'map',         mod: './sections/map.js',            fn: 'createMapSection' },
  { id: 'social-graph',mod: './sections/social-graph.js',   fn: 'createSocialGraphSection' },
  { id: 'advanced',    mod: './sections/advanced.js',       fn: 'createAdvancedSection' },
  { id: 'mesh-network',mod: './sections/mesh-network.js',   fn: 'createMeshNetworkSection' },
  { id: 'convergio',   mod: './sections/convergio.js',      fn: 'createConvergioSection' },
  { id: 'web-components', mod: './sections/web-components.js', fn: 'createWebComponentsSection' },
  { id: 'glass',       mod: './sections/section-glass.js',  fn: 'createGlassSection' },
  { id: 'launch',      mod: './sections/launch.js',         fn: 'createLaunchSection' },
  { id: 'accessibility', mod: './sections/accessibility.js', fn: 'createAccessibilitySection' },
  { id: 'api-reference', mod: './sections/api-reference.js', fn: 'createApiReferenceSection' },
  { id: 'data-binding', mod: './sections/data-binding.js',  fn: 'createDataBindingSection' },
  { id: 'overlays',    mod: './sections/overlays.js',       fn: 'createOverlaysSection' },
  { id: 'org-tree',    mod: './sections/org-tree.js',       fn: 'createOrgTreeSection' },
];

const root = document.getElementById('demo-root');
if (!root) throw new Error('Missing #demo-root');

/* Placeholder with min-height so nav anchors work before lazy load */
function makePlaceholder(id) {
  const el = document.createElement('section');
  el.id = id;
  el.className = 'mn-section-dark';
  el.style.cssText = 'min-height:60vh;display:flex;align-items:center;justify-content:center';
  el.innerHTML = `<p class="mn-label" style="color:var(--grigio-scuro);opacity:.4">Loading ${id}…</p>`;
  return el;
}

/* Render a section, replacing its placeholder */
async function renderSection(def, placeholder) {
  try {
    const mod = await import(def.mod);
    const section = mod[def.fn]();
    if (section) {
      placeholder.replaceWith(section);
    }
  } catch (e) {
    console.error(`[demo] ${def.id} crashed:`, e);
    placeholder.className = 'mn-section-dark';
    placeholder.style.cssText = 'padding:var(--space-xl)';
    placeholder.innerHTML = `<div class="mn-container">
      <p style="color:var(--rosso-corsa)">⚠ Section "${def.id}" failed to render</p>
      <pre class="mn-micro" style="color:var(--grigio-medio)">${e.message}</pre></div>`;
  }
}

/* Mount all placeholders, eager-load first 3, lazy-load rest */
const fragment = document.createDocumentFragment();
const lazyQueue = [];

for (const def of sectionDefs) {
  const ph = makePlaceholder(def.id);
  fragment.appendChild(ph);
  if (def.eager) {
    renderSection(def, ph);
  } else {
    lazyQueue.push({ def, ph });
  }
}

fragment.appendChild(createFooter());
root.appendChild(fragment);

/* IntersectionObserver: load section when 200px from viewport */
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    const item = lazyQueue.find(q => q.ph === entry.target);
    if (item) renderSection(item.def, item.ph);
  }
}, { rootMargin: '200px' });

for (const item of lazyQueue) observer.observe(item.ph);

/* Nav smooth scroll */
document.querySelectorAll('.demo-nav__links a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/** Sync theme label next to the theme toggle. */
function updateThemeLabel() {
  const label = document.getElementById('demo-theme-label');
  if (!label) return;
  const theme = window.Maranello?.getTheme?.() ?? 'nero';
  const names = { nero: 'Nero', avorio: 'Avorio', colorblind: 'Colorblind', editorial: 'Editorial' };
  label.textContent = `Current: ${names[theme] ?? theme}`;
}

document.addEventListener('mn-theme-change', (event) => {
  const nav = document.querySelector('.demo-nav');
  if (!nav) return;
  if (event.detail?.theme === 'avorio') {
    nav.style.background = 'rgba(250,243,230,0.95)';
    nav.style.borderBottomColor = 'var(--avorio-scuro)';
  } else {
    nav.style.background = 'rgba(10,10,10,0.92)';
    nav.style.borderBottomColor = 'var(--grigio-scuro)';
  }
  updateThemeLabel();
});

requestAnimationFrame(updateThemeLabel);

function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'mn-section-dark';
  footer.style.cssText = 'padding:var(--space-2xl) var(--space-xl);text-align:center';
  footer.innerHTML = `
    <div class="mn-container">
      <div class="mn-divider-gold--accent mn-divider-gold" style="margin-bottom:var(--space-xl)"></div>
      <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Maranello Luce Design System</p>
      <p class="mn-micro" style="color:var(--grigio-medio)">Demo built with fictional Maranello Luce operations data. All data is illustrative and does not represent a real platform.</p>
      <p class="mn-micro" style="color:var(--grigio-scuro);margin-top:var(--space-sm)">v3.3.0 — 5 themes · 150 APIs · 25 Web Components</p>
    </div>`;
  return footer;
}
