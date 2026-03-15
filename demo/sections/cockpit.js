/**
 * Cockpit section — speedometers and system status demo.
 */
export function createCockpitSection() {
  const section = document.createElement('section');
  section.id = 'cockpit';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">09 — Cockpit</p>
      <h2 class="mn-title-section mn-mb-sm">Cockpit Instruments</h2>
      <p class="mn-body mn-mb-2xl">Maranello Luce platform cockpit with live-style telemetry dials and AI service health visibility.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;canvas id="my-dial"&gt;&lt;/canvas&gt;

Maranello.speedometer(document.querySelector('#my-dial'), {
  value: 78, max: 100, unit: '%', size: 'md',
  arcColor: '#FFC72C', needleColor: '#DC0000', animate: true
});</code></pre>
      </details>
      <div class="mn-divider-gold mn-mb-lg"></div>
      <h3 class="mn-title-sub mn-mb-sm">Performance Dials</h3>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:flex-end;justify-content:space-between">
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:220px;flex:1"><p class="mn-label mn-mb-sm">Routing Throughput</p><canvas id="cockpit-speed-therapy" width="220" height="220"></canvas></div>
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:320px;flex:1"><p class="mn-label mn-mb-sm">Accuracy Score</p><canvas id="cockpit-speed-impact" width="320" height="320"></canvas></div>
        <div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;min-width:140px;flex:1"><p class="mn-label mn-mb-sm">Agent Load</p><canvas id="cockpit-speed-volunteer" width="120" height="120"></canvas></div>
      </div>
      <h3 class="mn-title-sub mn-mb-sm">System Status</h3>
      <p class="mn-micro mn-mb-lg">Endpoints are fictional and expected to appear degraded/offline in demo mode.</p>
      <div id="cockpit-system-status"></div>
    </div>
  `;
  requestAnimationFrame(() => initCockpit(section));
  return section;
}

function initCockpit(section) {
  const M = window.Maranello;
  if (!M) return;
  const throughputCanvas = section.querySelector('#cockpit-speed-therapy');
  const accuracyCanvas = section.querySelector('#cockpit-speed-impact');
  const loadCanvas = section.querySelector('#cockpit-speed-volunteer');
  const statusContainer = section.querySelector('#cockpit-system-status');
  if (M.speedometer) {
    if (throughputCanvas instanceof HTMLCanvasElement) M.speedometer(throughputCanvas, { value: 78, max: 100, unit: '%', size: 'md', ticks: [0, 25, 50, 75, 100], needleColor: '#DC0000', arcColor: '#FFC72C', bar: { value: 65, max: 100 }, subLabel: 'Target: 80%', animate: true });
    if (accuracyCanvas instanceof HTMLCanvasElement) M.speedometer(accuracyCanvas, { value: 96, max: 100, unit: 'pts', size: 'lg', ticks: [0, 20, 40, 60, 80, 100], needleColor: '#DC0000', arcColor: '#00A651', subLabel: 'Above Target', animate: true });
    if (loadCanvas instanceof HTMLCanvasElement) M.speedometer(loadCanvas, { value: 61, max: 100, unit: '%', size: 'sm', ticks: [0, 25, 50, 75, 100], needleColor: '#DC0000', arcColor: '#4EA8DE', subLabel: 'Healthy', animate: true });
  }
  if (M.systemStatus && statusContainer instanceof HTMLElement) {
    M.systemStatus(statusContainer, {
      version: 'v3.0.0', environment: 'Production', pollInterval: 10000,
      services: [
        { name: 'Gateway', url: 'https://api.maranelloluce.ai/gateway' },
        { name: 'Model Router', url: 'https://route.maranelloluce.ai' },
        { name: 'Vector DB', url: 'https://vectors.maranelloluce.ai' },
        { name: 'Cache', url: 'https://cache.maranelloluce.ai' },
      ],
      onClick: service => console.log('[cockpit] service clicked:', service?.name || service),
    });
  }
}
