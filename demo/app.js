/**
 * Maranello Luce Design System — Demo App
 * Hash-based SPA routing: one section at a time.
 * Works on local dev server AND GitHub Pages static hosting.
 * URL: demo/#charts, demo/#gauges, etc. (hash never hits the server)
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

const SECTIONS = new Map([
  ['hero',         createHeroSection],
  ['tokens',       createTokensSection],
  ['cards',        createCardsSection],
  ['dashboard',    createDashboardSection],
  ['charts',       createChartsSection],
  ['network',      createNetworkSection],
  ['controls',     createControlsSection],
  ['forms',        createFormsSection],
  ['tables',       createTablesSection],
  ['gauges',       createGaugesSection],
  ['cockpit',      createCockpitSection],
  ['telemetry',    createTelemetrySection],
  ['gantt',        createGanttSection],
  ['icons',        createIconsSection],
  ['animations',   createAnimationsSection],
  ['heatmap',      createHeatmapSection],
  ['treemap',      createTreemapSection],
  ['layouts',      createLayoutsSection],
  ['detail-panel', createDetailPanelSection],
  ['interactive',  createInteractiveSection],
  ['okr',          createOkrSection],
  ['map',          createMapSection],
  ['social-graph', createSocialGraphSection],
  ['advanced',     createAdvancedSection],
  ['mesh-network', createMeshNetworkSection],
  ['convergio',    createConvergioSection],
  ['web-components', createWebComponentsSection],
  ['glass',        createGlassSection],
  ['launch',       createLaunchSection],
  ['accessibility', createAccessibilitySection],
  ['api-reference', createApiReferenceSection],
  ['data-binding', createDataBindingSection],
  ['overlays',     createOverlaysSection],
  ['org-tree',     createOrgTreeSection],
]);

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

function currentSection() {
  const hash = window.location.hash.replace('#', '').trim();
  return SECTIONS.has(hash) ? hash : 'hero';
}

function setActiveNav(name) {
  document.querySelectorAll('.demo-nav__links a').forEach((a) => {
    a.classList.toggle('demo-nav__link--active', a.getAttribute('href') === '#' + name);
  });
}

function makeSectionNav(current) {
  const el = document.createElement('mn-section-nav');
  el.setAttribute('sections', [...SECTIONS.keys()].join(','));
  el.setAttribute('current', current);
  return el;
}

function render(name) {
  // Clear previous section (stops canvas/RAF of removed elements)
  while (root.firstChild) root.removeChild(root.firstChild);
  root.appendChild(makeSectionNav(name));
  root.appendChild(safe(SECTIONS.get(name), name));
  root.appendChild(makeSectionNav(name));
  window.scrollTo({ top: 0, behavior: 'instant' });
  setActiveNav(name);
}

// Hash navigation
window.addEventListener('hashchange', () => render(currentSection()));

// Nav smooth-scroll removed: sections are now separate pages
// (clicking a nav link changes hash, hashchange fires, section renders)

// Theme label sync
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

// Initial render
render(currentSection());
