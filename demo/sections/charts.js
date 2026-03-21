/**
 * Charts section — all canvas chart types: sparkline, donut, bar, area,
 * radar, bubble, halfGauge, liveGraph, progressRing, flipCounter
 */
export function createChartsSection() {
  const section = document.createElement('section');
  section.id = 'charts';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">03 — Data Visualization</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Charts &amp; Data</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">12 chart types — pure Canvas 2D, zero dependencies. Maranello Luce agent telemetry.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>Maranello.charts.sparkline(canvas, [10, 20, 30, 40], { color: '#FFC72C' });
Maranello.charts.donut(canvas, [{ label: 'A', value: 30 }, { label: 'B', value: 70 }]);</code></pre>
      </details>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Sparklines</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${sparkWrap('spark-1','Monthly token spend','Default')}
        ${sparkWrap('spark-2','Inference runs','Small')}
        ${sparkWrap('spark-3','Agent handoffs','Large (red)')}
        ${sparkWrap('spark-4','Tasks completed','XL (green)')}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Donut Charts</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end">
        ${donutWrap('donut-sm',80,80,'87%','Budget Mix')}
        ${donutWrap('donut-md',140,140,'96','Accuracy')}
      </div>
      ${legendRow(`${swatch('var(--mn-accent)','Inference')}${swatch('var(--signal-info)','Training')}${swatch('var(--signal-ok)','Embeddings')}${swatch('var(--mn-text-muted)','Storage')}${swatch('var(--mn-accent)','Completed')}${swatch('var(--mn-border)','Remaining')}`,'margin-bottom:var(--space-2xl)')}
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Token Spend by Region — Bar Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">$ (thousands)</div>
            <canvas id="bar-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Regions</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Inference Runs — Area Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">Runs</div>
            <canvas id="area-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Monthly trend</div>
          ${legendRow(`${swatch('var(--mn-accent)','Token Spend')}${swatch('var(--signal-ok)','Runs')}${swatch('var(--signal-danger)','Retries')}`)}
        </div>
      </div>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg)">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Pipeline Effectiveness — Radar</div>
          <canvas id="radar-demo" width="220" height="220"></canvas>
          <div id="radar-score" class="mn-micro" style="color:var(--mn-text-muted);text-align:center;margin-top:var(--space-sm)">Overall score —</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Region Accuracy / Load — Bubble</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">Accuracy score (%)</div>
            <canvas id="bubble-demo" width="440" height="220" style="width:100%;height:220px"></canvas>
          </div>
          <div style="${axisLabel()}">Load score (%)</div>
        </div>
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Half Gauges (Semicircular)</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-2xl)">
        ${halfWrap('hg-sm',100,60,'68%','route saturation')}
        ${halfWrap('hg-md',180,108,'96','accuracy')}
        ${halfWrap('hg-lg',260,156,'4.2k/s','tokens')}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Progress Rings</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${ringWrap('ring-1',60,'72%','Budget')}
        ${ringWrap('ring-2',80,'45%','Capacity')}
        ${ringWrap('ring-3',100,'96%','Accuracy')}
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Flip Counters</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-lg)">
        <div style="text-align:center"><div id="flip-1"></div><span class="mn-micro" style="color:var(--mn-text-muted)">Tasks Completed</span></div>
        <div style="text-align:center"><div id="flip-2"></div><span class="mn-micro" style="color:var(--mn-text-muted)">Inference Runs</span></div>
        <div style="text-align:center"><div id="flip-3"></div><span class="mn-micro" style="color:var(--mn-text-muted)">Accuracy Score</span></div>
      </div>
      <div style="display:flex;gap:var(--space-md)">
        <button class="mn-btn mn-btn--accent" id="flip-inc">Increment</button>
        <button class="mn-btn mn-btn--ghost" id="flip-rand">Random</button>
      </div>
      <h3 class="mn-title-sub" style="margin-top:var(--space-2xl);margin-bottom:var(--space-md)">Live Graph — Real-time Streaming</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:flex-start;margin-bottom:var(--space-lg)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <span class="mn-label">Inference Latency (ms)</span>
            <button id="live-toggle" class="mn-btn mn-btn--ghost" style="padding:4px 12px;font-size:var(--text-micro)">Pause</button>
          </div>
          <canvas id="live-graph-1" width="460" height="80" style="width:100%;height:80px"></canvas>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Token Budget Consumption</div>
          <canvas id="live-graph-2" width="460" height="80" style="width:100%;height:80px"></canvas>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => initCharts(section), 120);
  return section;
}

function sparkWrap(id, label, size) { return `<div style="text-align:center"><canvas id="${id}" width="100" height="32"></canvas><div class="mn-micro" style="color:var(--mn-text-muted);margin-top:4px">${size}<br>${label}</div></div>`; }
function donutWrap(id, w, h, val, label) { return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--mn-text-muted);margin-top:4px">${val} — ${label}</div></div>`; }
function halfWrap(id, w, h, val, unit) { return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--mn-accent)">${val} <span style="color:var(--mn-text-muted)">${unit}</span></div></div>`; }
function ringWrap(id, sz, pct, label) { return `<div style="text-align:center"><div id="${id}" style="width:${sz}px;height:${sz}px;display:inline-block"></div><div class="mn-micro" style="color:var(--mn-text-muted);margin-top:4px">${pct} ${label}</div></div>`; }
function swatch(color, label) { return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;color:var(--mn-text);padding:2px 0"><span style="width:10px;height:10px;background:${color};border-radius:999px;box-shadow:0 0 0 1px rgba(255,255,255,0.12)"></span>${label}</span>`; }
function legendRow(content, extra = '') { return `<div style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center;margin-top:var(--space-sm);padding-top:var(--space-xs);border-top:1px solid rgba(255,255,255,0.08);${extra}">${content}</div>`; }
function axisLabel(kind = 'x') { return kind === 'y' ? 'min-width:18px;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:rotate(180deg);color:var(--mn-text-muted);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase' : 'margin-top:var(--space-sm);text-align:center;color:var(--mn-text-muted);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase'; }

function initCharts(section) {
  const C = window.Maranello?.charts;
  if (!C) { console.warn('[charts] Maranello.charts not ready'); return; }
  const g = id => section.querySelector(`#${id}`);
  const M = window.Maranello;
  const p = M.palette?.() ?? {};
  const accent = p.accent || '#FFC72C';
  const ok = p.signalOk || '#00A651';
  const danger = p.signalDanger || '#DC0000';
  const info = p.signalInfo || '#4EA8DE';
  const muted = p.textMuted || '#616161';
  const border = p.border || '#2a2a2a';
  const warning = p.signalWarning || '#D4622B';
  const sparkData = [48,52,50,60,58,63,69,72,75,78,82,88];
  const barData = [{ label: 'us-east-1', value: 420, color: accent }, { label: 'eu-west-1', value: 310, color: accent }, { label: 'ap-southeast-1', value: 280, color: accent }, { label: 'us-west-2', value: 195, color: accent }, { label: 'sa-east-1', value: 165, color: accent }];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const areaData = [{ label: 'Token Spend', color: accent, data: [120,145,132,178,195,210,188,225,247,260,238,275] }, { label: 'Runs', color: ok, data: [820,860,910,980,1020,1080,1045,1120,1160,1210,1185,1240] }, { label: 'Retries', color: danger, data: [34,28,32,26,24,22,20,18,16,15,17,14] }];
  const donutSmall = [{ label: 'Inference', value: 45, color: accent }, { label: 'Training', value: 20, color: info }, { label: 'Embeddings', value: 20, color: ok }, { label: 'Storage', value: 15, color: muted }];
  const donutLarge = [{ label: 'Completed', value: 96, color: accent }, { label: 'Remaining', value: 4, color: border }];
  const radarData = [{ label: 'Accuracy', value: 96 }, { label: 'Latency', value: 82 }, { label: 'Routing', value: 91 }, { label: 'Recovery', value: 88 }, { label: 'Safety', value: 94 }, { label: 'Throughput', value: 86 }];
  const bubbleData = [{ x: 30, y: 96, z: 18, color: accent, label: 'us-east-1' }, { x: 55, y: 92, z: 14, color: ok, label: 'eu-west-1' }, { x: 75, y: 89, z: 22, color: info, label: 'ap-southeast-1' }, { x: 45, y: 84, z: 10, color: danger, label: 'retry queue' }, { x: 85, y: 87, z: 16, color: warning, label: 'canary lane' }];
  C.sparkline(g('spark-1'), sparkData, { color: accent, width: 100, height: 32 });
  C.sparkline(g('spark-2'), [320,360,410,480,530,610], { color: info, width: 100, height: 32 });
  C.sparkline(g('spark-3'), [80,92,88,104,110,118,126,134], { color: danger, width: 100, height: 32 });
  C.sparkline(g('spark-4'), [4200,5100,6200,7400,8900,10400,11800,14560], { color: ok, width: 100, height: 32 });
  C.donut(g('donut-sm'), donutSmall, { width: 80, height: 80 });
  C.donut(g('donut-md'), donutLarge, { width: 140, height: 140 });
  C.barChart(g('bar-chart-demo'), barData, { width: 460, height: 200, color: accent });
  C.areaChart(g('area-chart-demo'), areaData, { width: 460, height: 200 });
  C.radar(g('radar-demo'), radarData, { width: 220, height: 220, color: accent });
  C.bubble(g('bubble-demo'), bubbleData, { width: 440, height: 220 });
  C.halfGauge(g('hg-sm'), { value: 68, max: 100, width: 100, height: 60 });
  C.halfGauge(g('hg-md'), { value: 96, max: 100, width: 180, height: 108 });
  C.halfGauge(g('hg-lg'), { value: 84, max: 100, width: 260, height: 156 });
  // liveGraph — two real-time streams with interval updates
  const lgData1 = Array.from({ length: 60 }, () => 80 + Math.random() * 60);
  const lgData2 = Array.from({ length: 60 }, () => 30 + Math.random() * 50);
  if (C.liveGraph) {
    C.liveGraph(g('live-graph-1'), lgData1, { color: accent, showRedLine: true, redLineValue: 120, unitLabel: 'ms' });
    C.liveGraph(g('live-graph-2'), lgData2, { color: info, showRedLine: true, redLineValue: 70, unitLabel: '%' });
    let live = true;
    const tick = setInterval(() => {
      if (!live) return;
      lgData1.shift(); lgData1.push(80 + Math.random() * 60);
      lgData2.shift(); lgData2.push(30 + Math.random() * 50);
      C.liveGraph(g('live-graph-1'), lgData1, { color: accent, showRedLine: true, redLineValue: 120, unitLabel: 'ms' });
      C.liveGraph(g('live-graph-2'), lgData2, { color: info, showRedLine: true, redLineValue: 70, unitLabel: '%' });
    }, 800);
    const btn = g('live-toggle');
    if (btn) btn.addEventListener('click', () => { live = !live; btn.textContent = live ? 'Pause' : 'Resume'; });
    section.addEventListener('mn-section-destroy', () => clearInterval(tick));
  }
  g('radar-score').innerHTML = `<span style="color:var(--mn-accent)">${Math.round(radarData.reduce((sum, { value }) => sum + value, 0) / radarData.length)}/100</span> accuracy score`;
  if (M.progressRing) {
    M.progressRing(g('ring-1'), { value: 72, max: 100, size: 60 });
    M.progressRing(g('ring-2'), { value: 45, max: 100, size: 80 });
    M.progressRing(g('ring-3'), { value: 96, max: 100, size: 100, color: ok });
  }
  const f1 = M.flipCounter?.(section.querySelector('#flip-1'), { value: 14560 });
  const f2 = M.flipCounter?.(section.querySelector('#flip-2'), { value: 98240 });
  const f3 = M.flipCounter?.(section.querySelector('#flip-3'), { value: 96 });
  section.querySelector('#flip-inc')?.addEventListener('click', () => [f1, f2, f3].forEach(f => f?.increment?.()));
  section.querySelector('#flip-rand')?.addEventListener('click', () => { f1?.setValue?.(Math.floor(Math.random() * 22000)); f2?.setValue?.(Math.floor(Math.random() * 140000)); f3?.setValue?.(Math.floor(Math.random() * 100)); });
  if (M.chartInteract) {
    const barPad = { top: 8, bottom: 22, left: 8, right: 8 }, barMax = Math.max(...barData.map(({ value }) => value)) * 1.15;
    const barChartW = 460 - barPad.left - barPad.right, barChartH = 200 - barPad.top - barPad.bottom, slotW = barChartW / barData.length, barW = slotW * 0.7;
    const areaPad = { top: 8, bottom: 8, left: 8, right: 8 }, areaMax = Math.max(...areaData.flatMap(({ data }) => data)) * 1.15;
    const bubblePad = { top: 12, bottom: 12, left: 12, right: 12 }, bubbleMaxX = Math.max(...bubbleData.map(({ x }) => x)) * 1.1, bubbleMaxY = Math.max(...bubbleData.map(({ y }) => y)) * 1.1, bubbleMaxZ = Math.max(...bubbleData.map(({ z }) => z));
    const bubbleGx = v => bubblePad.left + (v / bubbleMaxX) * (440 - bubblePad.left - bubblePad.right);
    const bubbleGy = v => 220 - bubblePad.bottom - (v / bubbleMaxY) * (220 - bubblePad.top - bubblePad.bottom);
    const bubbleGr = v => Math.max(4, (v / bubbleMaxZ) * 30);
    const donutMeta = (segments, size) => { const startAngle = -Math.PI / 2, gap = 0.02, outerRadius = size / 2 - 4, innerRadius = outerRadius * 0.75, total = segments.reduce((sum, { value }) => sum + value, 0); let angle = startAngle; return { type: 'donut', center: { x: size / 2, y: size / 2 }, innerRadius, outerRadius, segments: segments.map(seg => { const sweep = (seg.value / total) * (Math.PI * 2 - gap * segments.length), next = angle + sweep, item = { ...seg, pct: Math.round(seg.value / total * 100), start: angle, end: next }; angle = next + gap; return item; }) }; };
    const radarMax = 100, radarCx = 110, radarCy = 110, radarRadius = 80, radarStep = (Math.PI * 2) / radarData.length;
    const bind = (id, meta, colors) => { const el = g(id); if (el) M.chartInteract(el, meta, colors); };
    bind('donut-sm', donutMeta(donutSmall, 80), donutSmall.map(({ color }) => color));
    bind('donut-md', donutMeta(donutLarge, 140), donutLarge.map(({ color }) => color));
    bind('bar-chart-demo', { type: 'bar', data: barData, labels: barData.map(({ label }) => label), pad: barPad, gx: i => barPad.left + i * slotW + slotW / 2, gy: v => 200 - barPad.bottom - (v / barMax) * barChartH, barRects: barData.map((_, i) => ({ x: barPad.left + i * slotW + slotW * 0.15, w: barW })) }, barData.map(({ color }) => color));
    bind('area-chart-demo', { type: 'area', datasets: areaData, labels: months, pad: areaPad, maxLen: months.length, gx: i => areaPad.left + (i / (months.length - 1)) * (460 - areaPad.left - areaPad.right), gy: v => 200 - areaPad.bottom - (v / areaMax) * (200 - areaPad.top - areaPad.bottom) }, areaData.map(({ color }) => color));
    bind('radar-demo', { type: 'radar', data: radarData, max: radarMax, points: radarData.map(({ value }, i) => ({ x: radarCx + Math.cos(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, y: radarCy + Math.sin(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, r: 10 })) }, [accent]);
    bind('bubble-demo', { type: 'bubble', data: bubbleData, points: bubbleData.map(({ x, y, z }) => ({ x: bubbleGx(x), y: bubbleGy(y), r: bubbleGr(z) })) }, bubbleData.map(({ color }) => color));
  }
  if (M.sparklineInteract) [['spark-1', sparkData], ['spark-2', [320,360,410,480,530,610]], ['spark-3', [80,92,88,104,110,118,126,134]], ['spark-4', [4200,5100,6200,7400,8900,10400,11800,14560]]].forEach(([id, data]) => { const el = g(id); if (el) M.sparklineInteract(el, data, { color: accent }); });
  addKeyboardAccess(section);
}

/**
 * Make chart canvases keyboard-accessible.
 * tabindex="0" allows focus via Tab; Enter/Space synthesise a click so
 * chartInteract / sparklineInteract tooltip handlers fire on keyboard.
 * Role "img" + aria-label give screen readers a meaningful description.
 */
const CHART_A11Y = [
  ['spark-1', 'Sparkline: monthly token spend'],
  ['spark-2', 'Sparkline: inference runs'],
  ['spark-3', 'Sparkline: agent handoffs'],
  ['spark-4', 'Sparkline: tasks completed'],
  ['donut-sm', 'Donut chart: budget mix by category'],
  ['donut-md', 'Donut chart: accuracy completed vs remaining'],
  ['bar-chart-demo', 'Bar chart: token spend by region'],
  ['area-chart-demo', 'Area chart: inference runs over 12 months'],
  ['radar-demo', 'Radar chart: pipeline effectiveness across 6 axes'],
  ['bubble-demo', 'Bubble chart: region accuracy vs load'],
  ['hg-sm', 'Half gauge: route saturation 68%'],
  ['hg-md', 'Half gauge: accuracy 96%'],
  ['hg-lg', 'Half gauge: tokens 84%'],
  ['trend-1', 'Sparkline trend: token spend 15 months'],
  ['trend-2', 'Sparkline trend: inference runs 15 months'],
  ['live-graph-1', 'Live graph: inference latency streaming (ms)'],
  ['live-graph-2', 'Live graph: token budget consumption streaming (%)'],
];

function addKeyboardAccess(section) {
  CHART_A11Y.forEach(([id, label]) => {
    const el = section.querySelector(`#${id}`);
    if (!el) return;
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', label);
    // Enter or Space fires a click at the canvas centre so tooltip handlers activate
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }));
    });
  });
}
