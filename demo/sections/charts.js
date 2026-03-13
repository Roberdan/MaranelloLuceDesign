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
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        12 chart types — pure Canvas 2D, zero dependencies. fightthestroke foundation telemetry.
      </p>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Sparklines</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${sparkWrap('spark-1','Monthly donations','Default')}
        ${sparkWrap('spark-2','Therapy sessions','Small')}
        ${sparkWrap('spark-3','Volunteer hours','Large (red)')}
        ${sparkWrap('spark-4','Children helped','XL (green)')}
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Donut Charts</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-2xl)">
        ${donutWrap('donut-sm',80,80,'87%','Quality')}
        ${donutWrap('donut-md',140,140,'92','Therapy')}
      </div>

      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Donations by Region — Bar Chart</div>
          <canvas id="bar-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Therapy Trend — Area Chart</div>
          <canvas id="area-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          <div style="display:flex;gap:var(--space-md);margin-top:var(--space-sm)">
            ${swatch('#FFC72C','Donations')}${swatch('#00A651','Sessions')}${swatch('#DC0000','At Risk')}
          </div>
        </div>
      </div>

      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg)">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Program Effectiveness — Radar</div>
          <canvas id="radar-demo" width="220" height="220"></canvas>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Children Risk/Impact — Bubble</div>
          <canvas id="bubble-demo" width="440" height="220" style="width:100%;height:220px"></canvas>
        </div>
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Half Gauges (Semicircular)</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-2xl)">
        ${halfWrap('hg-sm',100,60,'68%','utilization')}
        ${halfWrap('hg-md',180,108,'87','quality')}
        ${halfWrap('hg-lg',260,156,'4.2MW','power')}
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Live Graphs</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        ${liveWrap('live-1','Donations live')}
        ${liveWrap('live-2','Sessions live')}
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Progress Rings</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${ringWrap('ring-1',60,'72%','Donations')}
        ${ringWrap('ring-2',80,'45%','Volunteers')}
        ${ringWrap('ring-3',100,'92%','Therapy')}
      </div>


      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Flip Counters</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-lg)">
        <div style="text-align:center"><div id="flip-1"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Children Helped</span></div>
        <div style="text-align:center"><div id="flip-2"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Therapy Hours</span></div>
        <div style="text-align:center"><div id="flip-3"></div><span class="mn-micro" style="color:var(--grigio-chiaro)">Quality Score</span></div>
      </div>
      <div style="display:flex;gap:var(--space-md)">
        <button class="mn-btn mn-btn--accent" id="flip-inc">Increment</button>
        <button class="mn-btn mn-btn--ghost" id="flip-rand">Random</button>
      </div>
    </div>
  `;

  setTimeout(() => initCharts(section), 120);
  return section;
}

function sparkWrap(id, label, size) {
  return `<div style="text-align:center">
    <canvas id="${id}" width="100" height="32"></canvas>
    <div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${size}<br>${label}</div>
  </div>`;
}
function donutWrap(id, w, h, val, label) {
  return `<div style="text-align:center">
    <canvas id="${id}" width="${w}" height="${h}"></canvas>
    <div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${val} — ${label}</div>
  </div>`;
}
function halfWrap(id, w, h, val, unit) {
  return `<div style="text-align:center">
    <canvas id="${id}" width="${w}" height="${h}"></canvas>
    <div class="mn-micro" style="color:var(--mn-accent)">${val} <span style="color:var(--grigio-chiaro)">${unit}</span></div>
  </div>`;
}
function liveWrap(id, label) {
  return `<div class="mn-card-dark" style="padding:var(--space-md)">
    <div class="mn-label" style="margin-bottom:var(--space-sm)">${label}</div>
    <canvas id="${id}" width="200" height="60"></canvas>
  </div>`;
}
function ringWrap(id, sz, pct, label) {
  return `<div style="text-align:center">
    <div id="${id}" style="width:${sz}px;height:${sz}px;display:inline-block"></div>
    <div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${pct} ${label}</div>
  </div>`;
}
function swatch(color, label) {
  return `<span style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--grigio-chiaro)">
    <span style="width:10px;height:10px;background:${color};border-radius:2px"></span>${label}</span>`;
}

function initCharts(section) {
  const C = window.Maranello?.charts;
  if (!C) { console.warn('[charts] Maranello.charts not ready'); return; }

  const g = id => section.querySelector(`#${id}`);

  const sparkData = [47,52,48,61,58,66,72,68,75,70,80,84];
  C.sparkline(g('spark-1'), sparkData, { color: '#FFC72C', width: 100, height: 32 });
  C.sparkline(g('spark-2'), [30,35,28,40,38,45], { color: '#4EA8DE', width: 100, height: 32 });
  C.sparkline(g('spark-3'), [80,75,90,85,95,88,100,92], { color: '#DC0000', width: 100, height: 32 });
  C.sparkline(g('spark-4'), [200,220,215,240,260,255,280,300], { color: '#00A651', width: 100, height: 32 });

  C.donut(g('donut-sm'),
    [{ label: 'Therapy', value: 45, color: '#FFC72C' }, { label: 'Research', value: 25, color: '#4EA8DE' },
     { label: 'Community', value: 20, color: '#00A651' }, { label: 'Admin', value: 10, color: '#616161' }],
    { width: 80, height: 80 });
  C.donut(g('donut-md'),
    [{ label: 'Completed', value: 92, color: '#FFC72C' }, { label: 'Remaining', value: 8, color: '#2a2a2a' }],
    { width: 140, height: 140 });

  C.barChart(g('bar-chart-demo'),
    [{ label: 'Lombardia', value: 420 }, { label: 'Lazio', value: 310 }, { label: 'Toscana', value: 280 },
     { label: 'Veneto', value: 195 }, { label: 'Piemonte', value: 165 }],
    { width: 460, height: 200, color: '#FFC72C' });

  C.areaChart(g('area-chart-demo'),
    [{ label: 'Donations', color: '#FFC72C', data: [120,145,132,178,195,210,188,225,247,260,238,275] },
     { label: 'Sessions', color: '#00A651', data: [80,95,90,110,105,125,118,135,140,150,145,160] },
     { label: 'At Risk', color: '#DC0000', data: [12,8,15,10,7,11,9,6,8,5,7,4] }],
    { width: 460, height: 200 });

  C.radar(g('radar-demo'),
    [{ label: 'Mobility', value: 85 }, { label: 'Speech', value: 72 }, { label: 'Cognition', value: 68 },
     { label: 'Social', value: 90 }, { label: 'Motor', value: 78 }, { label: 'Emotional', value: 82 }],
    { width: 220, height: 220, color: '#FFC72C' });

  C.bubble(g('bubble-demo'),
    [{ x: 30, y: 70, r: 18, color: '#FFC72C', label: 'Milano' },
     { x: 55, y: 55, r: 14, color: '#00A651', label: 'Roma' },
     { x: 75, y: 80, r: 22, color: '#4EA8DE', label: 'Torino' },
     { x: 45, y: 30, r: 10, color: '#DC0000', label: 'At Risk' },
     { x: 85, y: 45, r: 16, color: '#D4622B', label: 'Firenze' }],
    { width: 440, height: 220 });

  C.halfGauge(g('hg-sm'), { value: 68, max: 100, width: 100, height: 60 });
  C.halfGauge(g('hg-md'), { value: 87, max: 100, width: 180, height: 108 });
  C.halfGauge(g('hg-lg'), { value: 75, max: 100, width: 260, height: 156 });

  const liveData = [42, 48, 55, 52, 61, 58, 65, 63, 70, 68];
  C.liveGraph(g('live-1'), [...liveData], { width: 200, height: 60, color: '#FFC72C' });
  C.liveGraph(g('live-2'), liveData.map(v => Math.round(v * 0.6)), { width: 200, height: 60, color: '#00A651' });

  const M = window.Maranello;
  if (M.progressRing) {
    M.progressRing(g('ring-1'), { value: 72, max: 100, size: 60 });
    M.progressRing(g('ring-2'), { value: 45, max: 100, size: 80 });
    M.progressRing(g('ring-3'), { value: 92, max: 100, size: 100, color: '#00A651' });
  }

  const f1 = M.flipCounter?.(section.querySelector('#flip-1'), { value: 847 });
  const f2 = M.flipCounter?.(section.querySelector('#flip-2'), { value: 4280 });
  const f3 = M.flipCounter?.(section.querySelector('#flip-3'), { value: 92 });

  section.querySelector('#flip-inc')?.addEventListener('click', () => {
    [f1, f2, f3].forEach(f => f?.increment?.());
  });
  section.querySelector('#flip-rand')?.addEventListener('click', () => {
    f1?.set?.(Math.floor(Math.random() * 1200));
    f2?.set?.(Math.floor(Math.random() * 6000));
    f3?.set?.(Math.floor(Math.random() * 100));
  });

  // Wire chart interactivity (hover tooltips + click)
  if (M.chartInteract) {
    ['bar-chart-demo', 'area-chart-demo', 'radar-demo', 'bubble-demo'].forEach(id => {
      const el = g(id);
      if (el) M.chartInteract(el, { showTooltip: true });
    });
  }
  if (M.sparklineInteract) {
    const sparkPairs = [
      ['spark-1', sparkData],
      ['spark-2', [30,35,28,40,38,45]],
      ['spark-3', [80,75,90,85,95,88,100,92]],
      ['spark-4', [200,220,215,240,260,255,280,300]],
    ];
    sparkPairs.forEach(([id, data]) => {
      const el = g(id);
      if (el) M.sparklineInteract(el, data, { color: '#FFC72C' });
    });
  }
}
