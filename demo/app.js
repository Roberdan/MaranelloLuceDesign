/**
 * Maranello Luce Design System — Demo App
 * Lazy-loads sections via IntersectionObserver: sections render only when
 * entering the viewport, avoiding 34 simultaneous canvas/RAF renders on load.
 */
import { createHeroSection } from './sections/hero.js';
import { createTokensSection } from './sections/tokens.js';
import { createCardsSection } from './sections/cards.js';
import { createDashboardSection } from './sections/dashboard.js';
import { createChartsSection } from './sections/charts.js';
import { createNetworkSection } from './sections/network.js';
import { createControlsSection } from './sections/controls.js';
import { createFormsSection } from './sections/forms.js';
import { createTablesSection } from './sections/tables.js';
import { createGaugesSection } from './sections/gauges.js';
import { createCockpitSection } from './sections/cockpit.js';
import { createTelemetrySection } from './sections/telemetry.js';
import { createGanttSection } from './sections/gantt.js';
import { createIconsSection } from './sections/icons.js';
import { createAnimationsSection } from './sections/animations.js';
import { createHeatmapSection } from './sections/heatmap.js';
import { createTreemapSection } from './sections/treemap.js';
import { createLayoutsSection } from './sections/layouts.js';
import { createDetailPanelSection } from './sections/detail-panel.js';
import { createInteractiveSection } from './sections/interactive.js';
import { createOkrSection } from './sections/okr-panel.js';
import { createMapSection } from './sections/map.js';
import { createSocialGraphSection } from './sections/social-graph.js';
import { createAdvancedSection } from './sections/advanced.js';
import { createMeshNetworkSection } from './sections/mesh-network.js';
import { createConvergioSection } from './sections/convergio.js';
import { createWebComponentsSection } from './sections/web-components.js';
import { createLaunchSection } from './sections/launch.js';
import { createAccessibilitySection } from './sections/accessibility.js';
import { createApiReferenceSection } from './sections/api-reference.js';
import { createDataBindingSection } from './sections/data-binding.js';
import { createOverlaysSection } from './sections/overlays.js';
import { createOrgTreeSection } from './sections/org-tree.js';
import { createGlassSection } from './sections/section-glass.js';

const root = document.getElementById('demo-root');
if (!root) throw new Error('Missing #demo-root');

function safe(fn, name) {
  try { return fn(); } catch (e) {
    console.error(`[demo] ${name} crashed:`, e);
    const el = document.createElement('section');
    el.className = 'mn-section-dark';
    el.innerHTML = `<div class="mn-container" style="padding:var(--space-xl)">
      <p style="color:var(--rosso-corsa)">⚠ Section "${name}" failed to render</p>
      <pre class="mn-micro" style="color:var(--grigio-medio)">${e.message}</pre></div>`;
    return el;
  }
}

/** Sections loaded immediately (above-the-fold). */
const EAGER = ['hero', 'tokens'];

const FACTORIES = [
  ['hero', createHeroSection],
  ['tokens', createTokensSection],
  ['cards', createCardsSection],
  ['dashboard', createDashboardSection],
  ['charts', createChartsSection],
  ['network', createNetworkSection],
  ['controls', createControlsSection],
  ['forms', createFormsSection],
  ['tables', createTablesSection],
  ['gauges', createGaugesSection],
  ['cockpit', createCockpitSection],
  ['telemetry', createTelemetrySection],
  ['gantt', createGanttSection],
  ['icons', createIconsSection],
  ['animations', createAnimationsSection],
  ['heatmap', createHeatmapSection],
  ['treemap', createTreemapSection],
  ['layouts', createLayoutsSection],
  ['detail-panel', createDetailPanelSection],
  ['interactive', createInteractiveSection],
  ['okr', createOkrSection],
  ['map', createMapSection],
  ['social-graph', createSocialGraphSection],
  ['advanced', createAdvancedSection],
  ['mesh-network', createMeshNetworkSection],
  ['convergio', createConvergioSection],
  ['web-components', createWebComponentsSection],
  ['glass', createGlassSection],
  ['launch', createLaunchSection],
  ['accessibility', createAccessibilitySection],
  ['api-reference', createApiReferenceSection],
  ['data-binding', createDataBindingSection],
  ['overlays', createOverlaysSection],
  ['org-tree', createOrgTreeSection],
];

const fragment = document.createDocumentFragment();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const placeholder = entry.target;
    const name = placeholder.dataset.section;
    const factory = placeholder._factory;
    if (!factory) return;
    observer.unobserve(placeholder);
    const real = safe(factory, name);
    placeholder.replaceWith(real);
  });
}, { rootMargin: '200px' });

for (const [name, factory] of FACTORIES) {
  if (EAGER.includes(name)) {
    fragment.appendChild(safe(factory, name));
    continue;
  }
  // Placeholder: preserves anchor + approximate scroll height
  const placeholder = document.createElement('section');
  placeholder.id = name;
  placeholder.dataset.section = name;
  placeholder._factory = factory;
  placeholder.style.cssText = 'min-height:60vh;display:flex;align-items:center;justify-content:center';
  placeholder.innerHTML = `<span class="mn-micro" style="color:var(--grigio-scuro)">Loading…</span>`;
  fragment.appendChild(placeholder);
  observer.observe(placeholder);
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
      <p class="mn-micro" style="color:var(--grigio-scuro);margin-top:var(--space-sm)">v3.3.0 — 4 themes · 87 APIs · 25 Web Components</p>
    </div>`;
  return footer;
}
