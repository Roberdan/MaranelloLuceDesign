/**
 * Map section — therapy center locations across Italy (canvas-based)
 */
export function createMapSection() {
  const section = document.createElement('section');
  section.id = 'map';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">17 — Geography</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Map Visualization</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Canvas-based interactive world map with clustered markers, zoom/pan,
        and theme-aware styling. Shows therapy center locations across Italy.
      </p>

      <div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-md)">Therapy Center Network</h4>
        <div id="map-canvas-container" style="width:100%;min-height:400px;border-radius:6px;overflow:hidden;background:var(--nero-profondo)">
          <p class="mn-micro" style="color:var(--grigio-medio);padding:var(--space-lg)">Loading map…</p>
        </div>

        <!-- Legend -->
        <div style="display:flex;gap:var(--space-xl);margin-top:var(--space-md)">
          ${legendDot('#00A651', 'Active')}
          ${legendDot('#FFC72C', 'Warning')}
          ${legendDot('#DC0000', 'Danger')}
          ${legendDot('#8B5CF6', 'Planned')}
        </div>
      </div>

      <div class="mn-grid-2">
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">
            Centers by City
          </h4>
          ${cityRow('Milano', 3, 'active')}
          ${cityRow('Roma', 2, 'active')}
          ${cityRow('Torino', 1, 'active')}
          ${cityRow('Firenze', 1, 'active')}
          ${cityRow('Bologna', 1, 'planned')}
        </div>
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">
            Network Statistics
          </h4>
          ${statRow('Total Centers', '8')}
          ${statRow('Active Centers', '7')}
          ${statRow('Planned Openings', '1')}
          ${statRow('Cities Covered', '5')}
          ${statRow('Regions Reached', '4')}
          ${statRow('Avg Capacity', '120 children')}
        </div>
      </div>
    </div>
  `;

  /* Mount canvas map after DOM insertion */
  requestAnimationFrame(() => mountMap(section));
  return section;
}

const MAP_MARKERS = [
  { id: 'm1', lat: 45.464, lon: 9.190, label: 'Milano Center 1', detail: 'Active · 120 children', color: '#00A651' },
  { id: 'm2', lat: 45.510, lon: 9.280, label: 'Milano Center 2', detail: 'Active · 85 children', color: '#00A651' },
  { id: 'm3', lat: 45.420, lon: 9.120, label: 'Milano Center 3', detail: 'Active · 95 children', color: '#00A651' },
  { id: 'r1', lat: 41.902, lon: 12.496, label: 'Roma Center 1', detail: 'Active · 110 children', color: '#00A651' },
  { id: 'r2', lat: 41.850, lon: 12.600, label: 'Roma Center 2', detail: 'Active · 72 children', color: '#00A651' },
  { id: 't1', lat: 45.070, lon: 7.687, label: 'Torino Center', detail: 'Active · 64 children', color: '#00A651' },
  { id: 'f1', lat: 43.769, lon: 11.255, label: 'Firenze Center', detail: 'Warning · capacity 92%', color: '#FFC72C' },
  { id: 'b1', lat: 44.494, lon: 11.343, label: 'Bologna (Planned)', detail: 'Opening Q3 2026', color: '#8B5CF6' },
];

function mountMap(section) {
  const container = section.querySelector('#map-canvas-container');
  if (!container) return;

  const M = window.Maranello;
  if (M && typeof M.mapView === 'function') {
    try {
      container.innerHTML = '';
      M.mapView(container, {
        markers: MAP_MARKERS,
        zoom: 6,
        padding: 40,
        onClick: (m) => console.log('[map] clicked:', m.label),
      });
      return;
    } catch (err) {
      console.warn('[map] Maranello.mapView error:', err);
    }
  }

  /* Fallback: plain marker list if mapView unavailable */
  container.innerHTML = `
    <div style="padding:var(--space-xl)">
      <p class="mn-micro" style="color:var(--grigio-medio);margin-bottom:var(--space-md)">
        Map canvas unavailable — marker list:
      </p>
      ${MAP_MARKERS.map(m => `
        <div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-xs) 0">
          <span style="width:8px;height:8px;border-radius:50%;background:${statusColor(m.status)};display:inline-block;flex-shrink:0"></span>
          <span class="mn-body" style="font-size:0.85rem">${m.label}</span>
          <span class="mn-micro" style="color:var(--grigio-medio)">${m.lat.toFixed(2)}, ${m.lon.toFixed(2)}</span>
        </div>`).join('')}
    </div>`;
}

function statusColor(s) {
  return s === 'active' ? '#00A651' : s === 'warning' ? '#FFC72C' : s === 'planned' ? '#8B5CF6' : '#DC0000';
}

function legendDot(color, label) {
  return `<div style="display:flex;align-items:center;gap:6px">
    <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block"></span>
    <span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span>
  </div>`;
}

function cityRow(city, count, status) {
  const color = status === 'planned' ? 'var(--grigio-medio)' : 'var(--verde-racing)';
  const badge = status === 'planned' ? 'Planned' : 'Active';
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)">
    <span class="mn-body">${city}</span>
    <div style="display:flex;align-items:center;gap:var(--space-sm)">
      <span class="mn-micro" style="color:${color}">${badge}</span>
      <span class="mn-label" style="color:var(--mn-accent)">${count}</span>
    </div>
  </div>`;
}

function statRow(label, value) {
  return `<div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)">
    <span class="mn-micro">${label}</span>
    <span class="mn-label" style="color:var(--mn-accent)">${value}</span>
  </div>`;
}
