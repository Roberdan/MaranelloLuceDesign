/**
 * Telemetry section — live monitoring dashboard.
 */
const GAUGES = [
  { key: 'latency', label: 'API Latency', unit: 'ms', value: 182, min: 90, max: 400, ticks: [0, 100, 200, 300, 400], arcColor: '#FFC72C', needleColor: '#DC0000', subLabel: 'Gateway p95', jitter: 22 },
  { key: 'throughput', label: 'Inference Throughput', unit: 'req/s', value: 2840, min: 1800, max: 4000, ticks: [0, 1000, 2000, 3000, 4000], arcColor: '#00A651', needleColor: '#FFC72C', subLabel: 'Pipeline runs', jitter: 180 },
  { key: 'memory', label: 'GPU Usage', unit: '%', value: 68, min: 42, max: 92, ticks: [0, 25, 50, 75, 100], arcColor: '#4EA8DE', needleColor: '#DC0000', subLabel: 'Worker pool', jitter: 5 },
  { key: 'errors', label: 'Error Rate', unit: '%', value: 1.4, min: 0.2, max: 5, ticks: [0, 1, 2, 3, 4, 5], arcColor: '#DC0000', needleColor: '#FFC72C', subLabel: 'Model router', jitter: 0.3, decimals: 1 },
];
const SPARKS = [
  { key: 'requests', label: 'Requests / sec', unit: 'req/s', color: '#FFC72C', data: [820, 850, 840, 876, 904, 918, 930, 955, 968, 982, 990, 1018], range: [720, 1160], delta: 44 },
  { key: 'tokens', label: 'Tokens / min', unit: 'tok/min', color: '#4EA8DE', data: [154, 160, 162, 170, 174, 179, 183, 190, 196, 201, 206, 212], range: [110, 260], delta: 18 },
];
const SERVICES = [
  { name: 'Gateway', tone: 'green', detail: 'p95 latency within target' },
  { name: 'Model Router', tone: 'green', detail: 'Fallback sync healthy' },
  { name: 'Vector Store', tone: 'amber', detail: 'Embedding compaction in progress' },
  { name: 'Inference Queue', tone: 'green', detail: 'Burst traffic nominal' },
  { name: 'Eval Service', tone: 'green', detail: 'Judge prompts stable' },
  { name: 'Budget Sentinel', tone: 'off', detail: 'Night digest idle' },
];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const last = (values) => values[values.length - 1];
function formatValue(metric) { const value = metric.decimals ? metric.value.toFixed(metric.decimals) : Math.round(metric.value).toLocaleString('en-US'); return `${value} ${metric.unit}`; }
function createGaugeCard(metric) { return `<div class="mn-card-dark" style="padding:var(--space-lg);text-align:center;flex:1 1 170px;min-width:170px;display:flex;flex-direction:column;align-items:center;gap:var(--space-sm)"><p class="mn-label">${metric.label}</p><canvas id="telemetry-gauge-${metric.key}" width="140" height="140" aria-label="${metric.label} gauge"></canvas><div><p class="mn-title-sub" id="telemetry-output-${metric.key}" style="margin-bottom:4px"></p><p class="mn-micro" style="color:var(--grigio-medio)">${metric.subLabel}</p></div></div>`; }
function createSparkCard(spark) { return `<div class="mn-card-dark" style="padding:var(--space-lg)"><div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-start;margin-bottom:var(--space-md)"><div><p class="mn-label" style="margin-bottom:4px">${spark.label}</p><p class="mn-micro" style="color:var(--grigio-medio)">Maranello Luce live platform traffic</p></div><p class="mn-title-sub" id="telemetry-spark-output-${spark.key}"></p></div><canvas id="telemetry-spark-${spark.key}" width="520" height="56" style="width:100%;height:56px"></canvas></div>`; }
function createServiceRow(service, index) { return `<div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:center;padding:10px 0;border-top:${index ? '1px solid rgba(255,255,255,0.08)' : 'none'}"><div style="display:flex;align-items:center;gap:var(--space-sm)"><span id="telemetry-service-tone-${index}" class="mn-led mn-led--${service.tone}" aria-hidden="true"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span></span><div><p class="mn-label" style="margin-bottom:2px">${service.name}</p><p class="mn-micro" id="telemetry-service-detail-${index}" style="color:var(--grigio-medio)">${service.detail}</p></div></div><span class="mn-micro" id="telemetry-service-state-${index}" style="color:var(--grigio-chiaro);text-transform:uppercase;letter-spacing:0.08em">${service.tone}</span></div>`; }

export function createTelemetrySection() {
  const section = document.createElement('section');
  section.id = 'telemetry';
  section.className = 'mn-section-dark';
  section.innerHTML = `<div class="mn-container"><p class="mn-section-number">09B — Live Telemetry</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Maranello Luce Telemetry Deck</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Unified live monitoring for agent orchestration, token routing, model evaluation, and inference pipelines.</p><div style="display:flex;flex-wrap:wrap;gap:var(--space-lg);margin-bottom:var(--space-2xl)">${GAUGES.map(createGaugeCard).join('')}</div><div class="mn-divider-gold" style="margin-bottom:var(--space-2xl)"></div><div style="display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:var(--space-lg)"><div style="display:grid;gap:var(--space-lg)">${SPARKS.map(createSparkCard).join('')}</div><aside class="mn-signal-panel"><p class="mn-signal-panel__eyebrow">Signal panel</p><h3 class="mn-signal-panel__title" style="margin-bottom:var(--space-sm)">Service readiness</h3><p class="mn-micro" style="color:var(--grigio-medio);margin-bottom:var(--space-sm)">Illustrative operating signals for the Maranello Luce runtime stack.</p>${SERVICES.map(createServiceRow).join('')}</aside></div></div>`;
  requestAnimationFrame(() => initTelemetry(section));
  return section;
}

function initTelemetry(section) {
  const api = window.Maranello; const charts = api?.charts; if (!api?.speedometer || !charts?.sparkline) return;
  const gauges = GAUGES.map((metric) => { const canvas = section.querySelector(`#telemetry-gauge-${metric.key}`); const output = section.querySelector(`#telemetry-output-${metric.key}`); if (!(canvas instanceof HTMLCanvasElement) || !(output instanceof HTMLElement)) return null; const controller = api.speedometer(canvas, { value: metric.value, max: metric.max, unit: metric.unit, size: 'sm', ticks: metric.ticks, needleColor: metric.needleColor, arcColor: metric.arcColor, bar: { value: metric.value, max: metric.max }, subLabel: metric.subLabel, animate: true }); canvas.style.width = '140px'; canvas.style.height = '140px'; output.textContent = formatValue(metric); return { metric, controller, output }; }).filter(Boolean);
  const sparks = SPARKS.map((spark) => ({ ...spark, data: [...spark.data], canvas: section.querySelector(`#telemetry-spark-${spark.key}`), output: section.querySelector(`#telemetry-spark-output-${spark.key}`) })).filter((spark) => spark.canvas instanceof HTMLCanvasElement && spark.output instanceof HTMLElement);
  const services = SERVICES.map((service, index) => ({ ...service, toneEl: section.querySelector(`#telemetry-service-tone-${index}`), detailEl: section.querySelector(`#telemetry-service-detail-${index}`), stateEl: section.querySelector(`#telemetry-service-state-${index}`) }));
  const paintSpark = (spark) => { charts.sparkline(spark.canvas, spark.data, { color: spark.color, width: spark.canvas.clientWidth || 520, height: 56, lineWidth: 2, fillOpacity: 0.18 }); spark.output.textContent = `${Math.round(last(spark.data))} ${spark.unit}`; };
  const setService = (ref, tone, detail) => { if (!(ref.toneEl instanceof HTMLElement) || !(ref.detailEl instanceof HTMLElement) || !(ref.stateEl instanceof HTMLElement)) return; ref.toneEl.className = `mn-led mn-led--${tone}`; ref.detailEl.textContent = detail; ref.stateEl.textContent = tone === 'off' ? 'idle' : tone; };
  sparks.forEach(paintSpark); services.forEach((service) => setService(service, service.tone, service.detail)); clearInterval(section._mnTelemetryTimer);
  section._mnTelemetryTimer = window.setInterval(() => {
    gauges.forEach(({ metric, controller, output }) => { const drift = (Math.random() - 0.5) * metric.jitter * 2; const next = clamp(metric.value + drift, metric.min, metric.max); metric.value = metric.decimals ? Number(next.toFixed(metric.decimals)) : Math.round(next); controller.setValue(metric.value); controller.setBar(metric.value / metric.max); output.textContent = formatValue(metric); });
    sparks.forEach((spark, index) => { const next = clamp(last(spark.data) + (Math.random() - 0.5) * spark.delta, spark.range[0], spark.range[1]); const bias = index === 0 ? gauges[1].metric.value / 220 : gauges[2].metric.value / 8; spark.data.push(Math.round(clamp(next + bias, spark.range[0], spark.range[1]))); if (spark.data.length > 18) spark.data.shift(); paintSpark(spark); });
    const latency = gauges[0].metric.value; const throughput = gauges[1].metric.value; const memory = gauges[2].metric.value; const errors = gauges[3].metric.value;
    setService(services[0], latency > 250 ? 'amber' : 'green', `${Math.round(latency)} ms p95 latency`);
    setService(services[1], throughput < 2400 ? 'amber' : 'green', `${Math.round(throughput)} routed req/sec`);
    setService(services[2], memory > 80 ? 'amber' : 'green', `${Math.round(memory)}% vector cache pressure`);
    setService(services[3], last(sparks[1].data) > 180 ? 'green' : 'amber', `${Math.round(last(sparks[1].data))} token windows active`);
    setService(services[4], errors > 2.8 ? 'red' : 'green', `${errors.toFixed(1)}% failed evals`);
    setService(services[5], last(sparks[0].data) > 980 ? 'green' : 'off', last(sparks[0].data) > 980 ? 'Digest workers active' : 'Night digest idle');
  }, 2600);
}
