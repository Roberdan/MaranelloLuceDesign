/**
 * Maranello Luce Design System — Demo App
 * Lazy-loads section modules when they scroll into view.
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

const sections = [
  safe(createHeroSection, 'hero'),
  safe(createTokensSection, 'tokens'),
  safe(createCardsSection, 'cards'),
  safe(createDashboardSection, 'dashboard'),
  safe(createChartsSection, 'charts'),
  safe(createNetworkSection, 'network'),
  safe(createControlsSection, 'controls'),
  safe(createFormsSection, 'forms'),
  safe(createTablesSection, 'tables'),
  safe(createGaugesSection, 'gauges'),
  safe(createCockpitSection, 'cockpit'),
  safe(createTelemetrySection, 'telemetry'),
  safe(createGanttSection, 'gantt'),
  safe(createIconsSection, 'icons'),
  safe(createAnimationsSection, 'animations'),
  safe(createHeatmapSection, 'heatmap'),
  safe(createTreemapSection, 'treemap'),
  safe(createLayoutsSection, 'layouts'),
  safe(createDetailPanelSection, 'detail-panel'),
  safe(createInteractiveSection, 'interactive'),
  safe(createOkrSection, 'okr'),
  safe(createMapSection, 'map'),
  safe(createSocialGraphSection, 'social-graph'),
  safe(createAdvancedSection, 'advanced'),
  safe(createMeshNetworkSection, 'mesh-network'),
  safe(createConvergioSection, 'convergio'),
  safe(createWebComponentsSection, 'web-components'),
  safe(createGlassSection, 'glass'),
  safe(createLaunchSection, 'launch'),
  safe(createAccessibilitySection, 'accessibility'),
  safe(createApiReferenceSection, 'api-reference'),
  safe(createDataBindingSection, 'data-binding'),
  safe(createOverlaysSection, 'overlays'),
  safe(createOrgTreeSection, 'org-tree'),
  createFooter(),
].filter(Boolean);

const fragment = document.createDocumentFragment();
sections.forEach((section) => fragment.appendChild(section));
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
