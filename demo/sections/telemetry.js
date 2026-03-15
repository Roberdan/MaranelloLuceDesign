/**
 * Telemetry section — service monitoring with SVG gauges + signal panel.
 * Pure HTML/SVG — no JS API dependency.
 */
const GAUGES = [
  { label: 'API Latency', value: 182, max: 400, unit: 'ms', color: '#FFC72C', sub: 'Gateway p95' },
  { label: 'Throughput', value: 2840, max: 4000, unit: 'req/s', color: '#00A651', sub: 'Pipeline runs' },
  { label: 'GPU Usage', value: 68, max: 100, unit: '%', color: '#4EA8DE', sub: 'Worker pool' },
  { label: 'Error Rate', value: 1.4, max: 5, unit: '%', color: '#DC0000', sub: 'Model router' },
];

const SERVICES = [
  { name: 'Gateway', detail: '212 ms p95 latency', tone: 'green' },
  { name: 'Model Router', detail: '2797 routed req/sec', tone: 'green' },
  { name: 'Vector Store', detail: '57% cache pressure', tone: 'amber' },
  { name: 'Inference Queue', detail: '258 token windows', tone: 'green' },
  { name: 'Eval Service', detail: '1.5% failed evals', tone: 'green' },
  { name: 'Budget Sentinel', detail: 'Night digest idle', tone: 'off' },
];

function svgGauge(g) {
  const pct = Math.min(1, g.value / g.max);
  const r = 52, circ = 2 * Math.PI * r, arc = circ * 0.75;
  const dash = arc * pct;
  const display = g.unit === '%' && g.value < 10 ? g.value.toFixed(1) : Math.round(g.value).toLocaleString('en-US');
  return `<div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;flex:1 1 160px;min-width:160px">
    <p class="mn-label" style="margin-bottom:var(--space-sm)">${g.label}</p>
    <svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto">
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--grigio-scuro,#333)" stroke-width="8"
        stroke-dasharray="${arc} ${circ}" stroke-dashoffset="0" stroke-linecap="round"
        transform="rotate(135 60 60)"/>
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="${g.color}" stroke-width="8"
        stroke-dasharray="${dash} ${circ}" stroke-dashoffset="0" stroke-linecap="round"
        transform="rotate(135 60 60)" style="transition:stroke-dasharray 1s ease">
        <animate attributeName="stroke-dasharray" from="0 ${circ}" to="${dash} ${circ}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.25 0.46 0.45 0.94"/>
      </circle>
      <text x="60" y="56" text-anchor="middle" fill="${g.color}" font-family="var(--font-display,Outfit,sans-serif)" font-size="22" font-weight="700">${display}</text>
      <text x="60" y="72" text-anchor="middle" fill="var(--grigio-medio,#666)" font-family="var(--font-body,Inter,sans-serif)" font-size="10">${g.unit}</text>
    </svg>
    <p class="mn-micro" style="color:var(--grigio-medio);margin-top:var(--space-xs)">${g.sub}</p>
  </div>`;
}

function serviceRow(s) {
  const color = s.tone === 'green' ? '#00A651' : s.tone === 'amber' ? '#FFC72C' : s.tone === 'red' ? '#DC0000' : 'var(--grigio-scuro)';
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid rgba(255,255,255,0.06)">
    <div style="display:flex;align-items:center;gap:var(--space-sm)">
      <span style="width:10px;height:10px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color}60;flex-shrink:0"></span>
      <div>
        <span class="mn-label">${s.name}</span>
        <div class="mn-micro" style="color:var(--grigio-medio)">${s.detail}</div>
      </div>
    </div>
    <span class="mn-micro" style="color:var(--mn-text-muted);text-transform:uppercase;letter-spacing:0.08em">${s.tone === 'off' ? 'IDLE' : s.tone.toUpperCase()}</span>
  </div>`;
}

export function createTelemetrySection() {
  const section = document.createElement('section');
  section.id = 'telemetry';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">09B — Live Telemetry</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Telemetry Deck</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Unified monitoring for agent orchestration, token routing, and inference pipelines.
      </p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;div class="mn-signal-panel"&gt;
  &lt;div class="mn-signal-panel__eyebrow"&gt;us-east-1&lt;/div&gt;
  &lt;div class="mn-signal-panel__title"&gt;Gateway&lt;/div&gt;
  &lt;div class="mn-status mn-status--active"&gt;
    &lt;span class="mn-status__dot"&gt;&lt;/span&gt;Running
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
      </details>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);margin-bottom:var(--space-2xl)">
        ${GAUGES.map(svgGauge).join('')}
      </div>
      <div class="mn-signal-panel" style="padding:var(--space-xl)">
        <p class="mn-micro" style="color:var(--mn-accent);letter-spacing:0.1em;margin-bottom:var(--space-xs)">SIGNAL PANEL</p>
        <h3 class="mn-label" style="margin-bottom:var(--space-md)">Service Readiness</h3>
        ${SERVICES.map(serviceRow).join('')}
      </div>
    </div>
  `;
  return section;
}
