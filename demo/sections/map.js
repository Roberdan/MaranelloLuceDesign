/**
 * Map section — deployment regions across the globe (canvas-based)
 */
export function createMapSection() {
  const section = document.createElement('section');
  section.id = 'map';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container"><p class="mn-section-number">17 — Geography</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Map Visualization</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Canvas-based interactive world map with clustered markers, zoom/pan, and theme-aware styling. Shows Maranello Luce deployment regions across the globe.</p><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)"><h4 class="mn-label" style="margin-bottom:var(--space-md)">Regional Footprint</h4><div id="map-canvas-container" style="width:100%;height:400px;border-radius:6px;overflow:hidden;background:var(--nero-profondo)"><p class="mn-micro" style="color:var(--grigio-medio);padding:var(--space-lg)">Loading map…</p></div><div style="display:flex;gap:var(--space-xl);margin-top:var(--space-md)">${legendDot('#00A651', 'Active')}${legendDot('#FFC72C', 'Warning')}${legendDot('#DC0000', 'Danger')}${legendDot('#8B5CF6', 'Planned')}</div></div><div class="mn-grid-2"><div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">Regions by Zone</h4>${regionRow('us-east-1', 3, 'active')}${regionRow('eu-west-1', 2, 'active')}${regionRow('ap-southeast-1', 1, 'active')}${regionRow('us-west-2', 1, 'warning')}${regionRow('sa-east-1', 1, 'planned')}</div><div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">Network Statistics</h4>${statRow('Total Regions', '8')}${statRow('Active Regions', '6')}${statRow('Planned Expansions', '1')}${statRow('Continents Covered', '4')}${statRow('Availability Zones', '12')}${statRow('Avg Runtime', '24.8h')}</div></div></div>`;
  requestAnimationFrame(() => mountMap(section));
  return section;
}

// color must be semantic key: 'active' | 'warning' | 'danger' (mapView theme-mapped)
const MAP_MARKERS = [
  { id: 'm1', lat: 38.90, lon: -77.04, label: 'us-east-1', detail: 'Active · 120 live agents', color: 'active', size: 8, status: 'active' },
  { id: 'm2', lat: 40.71, lon: -74.00, label: 'us-east-2', detail: 'Active · 85 live agents', color: 'active', size: 8, status: 'active' },
  { id: 'm3', lat: 37.77, lon: -122.42, label: 'us-west-2', detail: 'Warning · cache warmup pending', color: 'warning', size: 8, status: 'warning' },
  { id: 'r1', lat: 53.35, lon: -6.26, label: 'eu-west-1', detail: 'Active · 110 live agents', color: 'active', size: 8, status: 'active' },
  { id: 'r2', lat: 50.11, lon: 8.68, label: 'eu-central-1', detail: 'Active · 72 live agents', color: 'active', size: 8, status: 'active' },
  { id: 't1', lat: 1.35, lon: 103.82, label: 'ap-southeast-1', detail: 'Active · 64 live agents', color: 'active', size: 8, status: 'active' },
  { id: 'f1', lat: -33.87, lon: 151.21, label: 'ap-southeast-2', detail: 'Warning · token budget 92%', color: 'warning', size: 8, status: 'warning' },
  { id: 'b1', lat: -23.55, lon: -46.63, label: 'sa-east-1', detail: 'Danger · critical latency spike', color: 'danger', size: 8, status: 'danger' },
];

function mountMap(section) {
  const container = section.querySelector('#map-canvas-container');
  if (!container) return;
  const M = window.Maranello;
  if (M && typeof M.mapView === 'function') {
    try {
      container.innerHTML = '';
      M.mapView(container, { markers: MAP_MARKERS, zoom: 1, padding: 30, onClick: (m) => console.log('[map] clicked:', m.label) });
      setTimeout(() => { const ctrl = M.mapView.__lastCtrl; if (ctrl?.setZoom) ctrl.setZoom(1); }, 500);
      return;
    } catch (err) { console.warn('[map] Maranello.mapView error:', err); }
  }
  container.innerHTML = `<div style="padding:var(--space-xl)"><p class="mn-micro" style="color:var(--grigio-medio);margin-bottom:var(--space-md)">Map canvas unavailable — marker list:</p>${MAP_MARKERS.map(m => `<div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-xs) 0"><span style="width:8px;height:8px;border-radius:50%;background:${statusColor(m.status)};display:inline-block;flex-shrink:0"></span><span class="mn-body" style="font-size:0.85rem">${m.label}</span><span class="mn-micro" style="color:var(--grigio-medio)">${m.lat.toFixed(2)}, ${m.lon.toFixed(2)}</span></div>`).join('')}</div>`;
}
function statusColor(s) { return s === 'active' ? '#00A651' : s === 'warning' ? '#FFC72C' : s === 'planned' ? '#8B5CF6' : '#DC0000'; }
function legendDot(color, label) { return `<div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block"></span><span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span></div>`; }
function regionRow(region, count, status) { const color = status === 'planned' ? 'var(--grigio-medio)' : status === 'warning' ? 'var(--mn-accent)' : 'var(--verde-racing)'; const badge = status === 'planned' ? 'Planned' : status === 'warning' ? 'Warning' : 'Active'; return `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)"><span class="mn-body">${region}</span><div style="display:flex;align-items:center;gap:var(--space-sm)"><span class="mn-micro" style="color:${color}">${badge}</span><span class="mn-label" style="color:var(--mn-accent)">${count}</span></div></div>`; }
function statRow(label, value) { return `<div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--grigio-scuro)"><span class="mn-micro">${label}</span><span class="mn-label" style="color:var(--mn-accent)">${value}</span></div>`; }
