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
        <summary class="mn-label" style="cursor:pointer;color:#FFC72C;margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid #FFC72C"><code>&lt;canvas id="my-dial"&gt;&lt;/canvas&gt;

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
      <h3 class="mn-title-sub mn-mb-sm">Dashboard Strip</h3>
      <p class="mn-micro mn-mb-lg">The main instrument nacelle: broad strip, primary display bars, and compact secondary board.</p>
      <div class="mn-strip mn-mb-2xl">
        <div class="mn-strip__inner">
          <div class="mn-strip__section--pod"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:120px;height:120px;padding:5px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${dashboardStripGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div></div>
          <div class="mn-strip__divider"></div>
          <div class="mn-strip__section" style="padding:var(--space-sm) 0">
            <div class="mn-flex-between mn-mb-sm"><span class="mn-label mn-strip__label">PRIMARY DISPLAY</span><span class="mn-label mn-strip__label">MAIN DASHBOARD SHELL</span></div>
            <div class="mn-flex-col mn-gap-xs">
              <div class="mn-flex-center mn-gap-sm"><span class="mn-micro mn-bar-metric">72</span><div class="mn-bar-track"><div style="width:72%;height:100%;background:linear-gradient(90deg,#DC0000,#FFC72C);border-radius:3px"></div></div></div>
              <div class="mn-flex-center mn-gap-sm"><span class="mn-micro mn-bar-metric">86</span><div class="mn-bar-track"><div style="width:86%;height:100%;background:linear-gradient(90deg,#FFC72C,#00A651);border-radius:3px"></div></div></div>
              <div class="mn-flex-center mn-gap-sm"><span class="mn-micro mn-bar-metric">56</span><div class="mn-bar-track"><div style="width:56%;height:100%;background:linear-gradient(90deg,#DC0000,#FFC72C);border-radius:3px"></div></div></div>
              <div class="mn-flex-center mn-gap-sm"><span class="mn-micro mn-bar-metric">44</span><div class="mn-bar-track"><div style="width:44%;height:100%;background:linear-gradient(90deg,#DC0000,#DC0000);border-radius:3px"></div></div></div>
              <div class="mn-flex-center mn-gap-sm"><span class="mn-micro mn-bar-metric">68</span><div class="mn-bar-track"><div style="width:68%;height:100%;background:linear-gradient(90deg,#DC0000,#FFC72C);border-radius:3px"></div></div></div>
            </div>
          </div>
          <div class="mn-strip__divider"></div>
          <div class="mn-strip__section" style="flex:0 0 220px"><span class="mn-label mn-strip__label mn-block mn-mb-sm">SECONDARY BOARD</span><div class="mn-grid-3 mn-gap-xs"><div class="mn-strip__board-cell"><div class="mn-micro mn-strip__dim">KPI</div><div class="mn-strip__value">94</div></div><div class="mn-strip__board-cell"><div class="mn-micro mn-strip__dim">RUNWAY</div><div class="mn-strip__value">13d</div></div><div class="mn-strip__board-cell"><div class="mn-micro mn-strip__dim">ALERTS</div><div class="mn-strip__value" style="color:#DC0000">04</div></div></div></div>
          <div class="mn-strip__divider"></div>
          <div class="mn-strip__section--pod"><div class="mn-flex-center mn-gap-sm"><div class="mn-pod" style="width:50px;height:50px"><div class="mn-pod__face"><div class="mn-pod__indicator" style="background:#00A651;box-shadow:0 0 8px #00A651,0 0 3px #00A651"></div></div></div><div class="mn-pod" style="width:50px;height:50px"><div class="mn-pod__face"><div class="mn-pod__indicator mn-pod__indicator--red"></div></div></div></div></div>
        </div>
      </div>
      <h3 class="mn-title-sub mn-mb-sm">KPI Instrument Cluster</h3>
      <p class="mn-micro mn-mb-lg">Complications layer utilization, score and portfolio-map insights in a Ferrari-like binnacle.</p>
      <div class="mn-binnacle">
        <div class="mn-binnacle__header"><span class="mn-binnacle__title">Maranello Luce / Instrument Binnacle</span><span class="mn-binnacle__badge">◈ Aligned</span></div>
        <div class="mn-binnacle__instruments">
          <div style="flex:0 0 auto;align-self:flex-end;margin-bottom:var(--space-sm)"><div class="mn-signal-panel"><div class="mn-signal-panel__eyebrow">LEFT SIGNAL</div><div class="mn-signal-panel__title">QUALITY / CLOSED LOOP</div></div></div>
          <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${utilizationGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Utilization</span></div>
          <div class="mn-gauge"><div class="mn-gauge__instrument" style="width:300px;height:300px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${qualityScoreGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Quality Score</span></div>
          <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${portfolioMapGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Portfolio Map</span></div>
          <div style="flex:0 0 auto;align-self:flex-end;margin-bottom:var(--space-sm)"><div class="mn-signal-panel"><div class="mn-signal-panel__eyebrow">RIGHT SIGNAL</div><div class="mn-signal-panel__title">DRIFT / TUNED RESPONSE</div></div></div>
        </div>
      </div>
      <div class="mn-flex-center mn-gap-lg mn-flex-wrap mn-mt-2xl mn-mb-2xl">
        <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial mn-gauge__dial--warning"><canvas class="mn-gauge__canvas" data-gauge='${riskLevelGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Risk Level</span></div>
        <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${dataQualityGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Data Quality</span></div>
        <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${kpiCoverageGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">KPI Coverage</span></div>
        <div class="mn-gauge"><div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px"><div class="mn-gauge__dial"><canvas class="mn-gauge__canvas" data-gauge='${qualityTrendGauge()}'></canvas><div class="mn-gauge__glass"></div></div></div><span class="mn-gauge__label">Quality Trend</span></div>
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
  if (section instanceof HTMLElement) M.initGauges ? M.initGauges(section) : M.createGaugesInContainer?.(section);
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

function dashboardStripGauge() {
  return JSON.stringify({ value: 92, max: 100, color: '#00A651', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 50, 100], complications: { centerValue: '92', centerUnit: 'OPS', statusLed: { color: '#00A651', label: 'LIVE' } } });
}
function utilizationGauge() {
  return JSON.stringify({ value: 87, max: 100, color: '#00A651', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 20, 40, 60, 80, 100], complications: { innerRing: { value: 46.4, max: 60, color: '#FFC72C', label: 'FTE' }, odometer: { digits: ['4', '6', '.', '4'], highlightLast: true, label: 'FTE' }, statusLed: { color: '#00A651', label: 'HEALTHY' } } });
}
function qualityScoreGauge() {
  return JSON.stringify({ value: 65, max: 100, color: '#FFC72C', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], complications: { arcBar: { value: 408, max: 600, colorStops: ['#DC0000', '#FFC72C', '#00A651'], labelLeft: '0', labelRight: '600', labelCenter: '408 pts' }, subDials: [{ x: -0.28, y: 0.18, value: 72, max: 100, color: '#448AFF', label: '6Q' }, { x: 0.28, y: 0.18, value: 58, max: 100, color: '#DC0000', label: 'KPI' }], trend: { direction: 'up', delta: '+5', color: '#00A651' }, centerLabel: 'QUALITY', centerValue: '65', centerUnit: '/ 100' } });
}
function portfolioMapGauge() {
  return JSON.stringify({ value: 0, max: 100, color: '#448AFF', ticks: 0, subticks: 0, startAngle: 0, endAngle: 0, showNeedle: false, complications: { crosshair: { x: 0.35, y: -0.25, dotColor: '#FFC72C', gridColor: '#D4A826', labelTop: 'ACTIVE', labelBottom: 'CLOSED', labelLeft: 'LOW', labelRight: 'HIGH', title: 'IMPACT', scatterDots: [{ x: 0.55, y: -0.4, color: '#00A651', r: 5 }, { x: 0.7, y: -0.55, color: '#00A651', r: 4 }, { x: 0.3, y: -0.1, color: '#FFC72C', r: 4 }, { x: 0.15, y: -0.5, color: '#448AFF', r: 3 }, { x: -0.2, y: -0.3, color: '#448AFF', r: 3 }, { x: 0.6, y: -0.2, color: '#00A651', r: 4 }, { x: 0.4, y: -0.65, color: '#00A651', r: 5 }, { x: -0.1, y: 0.15, color: '#DC0000', r: 3 }, { x: 0.25, y: 0.3, color: '#DC0000', r: 3 }, { x: 0.5, y: -0.35, color: '#FFC72C', r: 4 }, { x: 0.8, y: -0.6, color: '#00A651', r: 6 }, { x: 0.45, y: -0.5, color: '#00A651', r: 4 }] }, quadrantCounts: { tl: 5, tr: 32, bl: 2, br: 8 }, statusLed: { color: '#00A651', label: '47 ENG' } } });
}
function riskLevelGauge() {
  return JSON.stringify({ value: 15, max: 100, color: '#DC0000', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: 'AT RISK', centerValue: '15', centerUnit: '%', statusLed: { color: '#DC0000', label: 'ALERT' }, trend: { direction: 'up', delta: '+3', color: '#DC0000' } } });
}
function dataQualityGauge() {
  return JSON.stringify({ value: 91, max: 100, color: '#00A651', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: 'DATA', centerValue: '91', centerUnit: '%', innerRing: { value: 88, max: 100, color: '#448AFF', label: 'PREV' }, statusLed: { color: '#00A651', label: 'PASS' } } });
}
function kpiCoverageGauge() {
  return JSON.stringify({ value: 72, max: 100, color: '#FFC72C', ticks: 10, subticks: 5, startAngle: -225, endAngle: 45, showNeedle: true, numbers: [0, 25, 50, 75, 100], complications: { centerLabel: 'KPI', centerValue: '72', centerUnit: '%', arcBar: { value: 18, max: 24, colorStops: ['#DC0000', '#FFC72C', '#00A651'], labelCenter: '18/24' }, statusLed: { color: '#FFC72C', label: 'WARN' } } });
}
function qualityTrendGauge() {
  return JSON.stringify({ value: 0, max: 100, color: '#FFC72C', ticks: 0, subticks: 0, startAngle: 0, endAngle: 0, showNeedle: false, complications: { multigraph: { mode: 'sparkline', data: [42, 48, 55, 52, 61, 58, 65, 63, 70, 68, 72, 75], color: '#FFC72C', label: 'TREND', months: ['A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M'] }, centerLabel: 'FY26', centerValue: '75', centerUnit: 'score', trend: { direction: 'up', delta: '+33', color: '#00A651' } } });
}
