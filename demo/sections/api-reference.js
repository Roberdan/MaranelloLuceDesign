/**
 * Section 21 — API Reference
 * Grouped catalog of all 91 Maranello exports
 */

const groups = [
  ['Charts', 'Maranello.charts.*', [
    'sparkline','donut','barChart','areaChart','radar',
    'halfGauge','bubble','liveGraph','hBarChart']],
  ['Gauges', 'Maranello.*', [
    'FerrariGauge','speedometer','initGauges','createGauge',
    'updateGauge','buildGaugePalette','GAUGE_SIZES','createGaugesInContainer']],
  ['Controls', 'Maranello.*', [
    'initSlider','initRotary','initDragRotary','manettino',
    'cruiseLever','toggleLever','steppedRotary']],
  ['Data Viz', 'Maranello.*', [
    'funnel','gantt','dataTable','initOrgTree','okrPanel',
    'mapView','socialGraph','progressRing','flipCounter','networkMessages','neuralNodes']],
  ['Panels', 'Maranello.*', [
    'detailPanel','createDetailPanel','openDetailPanel','closeDetailPanel',
    'openDrawer','closeDrawer','openModal','closeModal','toast','commandPalette',
    'a11yPanel']],
  ['Interactive', 'Maranello.*', [
    'aiChat','loginScreen','profileMenu','datePicker',
    'registerDatePicker','editors']],
  ['Icons', 'Maranello.*', [
    'icons','renderIcon','iconCatalog','navIcons','statusIcons',
    'actionIcons','dataIcons','objectIcons','azIcons']],
  ['Data Binding', 'Maranello.*', [
    'bind','autoBind','bindChart','bindControl','autoBindSliders',
    'onDrillDown','chartInteract','sparklineInteract']],
  ['Theme', 'Maranello.*', [
    'setTheme','getTheme','cycleTheme','initThemeToggle',
    'initScrollReveal','initNavTracking','relativeLuminance','autoContrast']],
  ['Utilities', 'Maranello.*', [
    'VERSION','clamp','debounce','throttle','lerp','cssVar',
    'createElement','hiDpiCanvas','formatDate','formatNumber',
    'emit','on','off','eventBus','redrawAll','reinitAll']],
];

function apiGroup(title, ns, apis) {
  return `
    <div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-md)">
      <h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">
        ${title}
        <span class="mn-micro" style="color:var(--grigio-medio);margin-left:var(--space-sm)">${ns}</span>
      </h4>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs)">
        ${apis.map(a => `<code class="mn-tag mn-tag--xs">${a}</code>`).join('')}
      </div>
    </div>`;
}

function statsBar() {
  return `
    <div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);justify-content:center;margin-bottom:var(--space-xl)">
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">91</strong> exports
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">10</strong> chart types
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">23</strong> Web Components
      </span>
      <span class="mn-label" style="color:var(--bianco-caldo)">
        <strong style="color:var(--mn-accent);font-size:var(--text-h3)">4</strong> themes
      </span>
    </div>`;
}

function initApiRef(section) {
  const btn = section.querySelector('[data-action="try-api"]');
  const out = section.querySelector('[data-output="api-count"]');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    const M = window.Maranello;
    if (!M) {
      out.textContent = 'window.Maranello not loaded';
      out.style.color = 'var(--rosso-corsa)';
      return;
    }
    const keys = Object.keys(M).sort();
    console.log(keys);
    out.textContent = `${keys.length} keys found — logged to console`;
    out.style.color = 'var(--mn-accent)';
  });
}

export function createApiReferenceSection() {
  const section = document.createElement('section');
  section.id = 'api-reference';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <h2 class="mn-title-section">
        <span class="mn-label" style="color:var(--mn-accent)">21</span>
        API Reference
      </h2>
      <p class="mn-subtitle" style="text-align:center;margin-bottom:var(--space-xl)">
        Complete catalog of <code>window.Maranello</code> exports
      </p>

      ${statsBar()}

      <div class="mn-grid-2">
        ${groups.map(([t, ns, apis]) => apiGroup(t, ns, apis)).join('')}
      </div>

      <div style="text-align:center;margin-top:var(--space-xl)">
        <button class="mn-btn mn-btn--accent" data-action="try-api">
          Try It — Log All Exports
        </button>
        <p class="mn-micro" data-output="api-count"
           style="margin-top:var(--space-sm);color:var(--grigio-medio)">
          Click to inspect window.Maranello in console
        </p>
      </div>
    </div>
  `;

  requestAnimationFrame(() => initApiRef(section));
  return section;
}
