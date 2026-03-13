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
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">12 chart types — pure Canvas 2D, zero dependencies. fightthestroke foundation telemetry.</p>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Sparklines</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-2xl)">
        ${sparkWrap('spark-1','Monthly donations','Default')}
        ${sparkWrap('spark-2','Therapy sessions','Small')}
        ${sparkWrap('spark-3','Volunteer hours','Large (red)')}
        ${sparkWrap('spark-4','Children helped','XL (green)')}
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Donut Charts</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end">
        ${donutWrap('donut-sm',80,80,'87%','Quality')}
        ${donutWrap('donut-md',140,140,'92','Therapy')}
      </div>
      ${legendRow(`${swatch('#FFC72C','Therapy')}${swatch('#4EA8DE','Research')}${swatch('#00A651','Community')}${swatch('#616161','Admin')}${swatch('#FFC72C','Completed')}${swatch('#2a2a2a','Remaining')}`,'margin-bottom:var(--space-2xl)')}

      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Donations by Region — Bar Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">Donations<br>EUR (thousands)</div>
            <canvas id="bar-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Regions</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Therapy Trend — Area Chart</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">Sessions count</div>
            <canvas id="area-chart-demo" width="460" height="200" style="width:100%;height:200px"></canvas>
          </div>
          <div style="${axisLabel()}">Monthly trend</div>
          ${legendRow(`${swatch('#FFC72C','Donations')}${swatch('#00A651','Sessions')}${swatch('#DC0000','At Risk')}`)}
        </div>
      </div>

      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg)">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Program Effectiveness — Radar</div>
          <canvas id="radar-demo" width="220" height="220"></canvas>
          <div id="radar-score" class="mn-micro" style="color:var(--avorio);text-align:center;margin-top:var(--space-sm)">Overall score —</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div class="mn-label" style="margin-bottom:var(--space-md)">Children Risk/Impact — Bubble</div>
          <div style="display:flex;gap:var(--space-sm);align-items:stretch">
            <div style="${axisLabel('y')}">Impact score (%)</div>
            <canvas id="bubble-demo" width="440" height="220" style="width:100%;height:220px"></canvas>
          </div>
          <div style="${axisLabel()}">Risk score (%)</div>
        </div>
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Half Gauges (Semicircular)</h3>
      <div style="display:flex;gap:var(--space-2xl);flex-wrap:wrap;align-items:flex-end;margin-bottom:var(--space-2xl)">
        ${halfWrap('hg-sm',100,60,'68%','utilization')}
        ${halfWrap('hg-md',180,108,'87','quality')}
        ${halfWrap('hg-lg',260,156,'4.2MW','power')}
      </div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Live Trends</h3>
      <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <span class="mn-label">Donations Trend</span>
            <span class="mn-micro" style="color:var(--mn-accent)">+12% ↑</span>
          </div>
          <canvas id="trend-1" width="460" height="60" style="width:100%;height:60px"></canvas>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-lg);flex:1;min-width:260px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <span class="mn-label">Therapy Sessions</span>
            <span class="mn-micro" style="color:var(--verde-racing)">+8% ↑</span>
          </div>
          <canvas id="trend-2" width="460" height="60" style="width:100%;height:60px"></canvas>
        </div>
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
  return `<div style="text-align:center"><canvas id="${id}" width="100" height="32"></canvas><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${size}<br>${label}</div></div>`;
}
function donutWrap(id, w, h, val, label) {
  return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${val} — ${label}</div></div>`;
}
function halfWrap(id, w, h, val, unit) {
  return `<div style="text-align:center"><canvas id="${id}" width="${w}" height="${h}"></canvas><div class="mn-micro" style="color:var(--mn-accent)">${val} <span style="color:var(--grigio-chiaro)">${unit}</span></div></div>`;
}
function ringWrap(id, sz, pct, label) {
  return `<div style="text-align:center"><div id="${id}" style="width:${sz}px;height:${sz}px;display:inline-block"></div><div class="mn-micro" style="color:var(--grigio-chiaro);margin-top:4px">${pct} ${label}</div></div>`;
}
function swatch(color, label) {
  return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;color:var(--avorio);padding:2px 0"><span style="width:10px;height:10px;background:${color};border-radius:999px;box-shadow:0 0 0 1px rgba(255,255,255,0.12)"></span>${label}</span>`;
}
function legendRow(content, extra = '') {
  return `<div style="display:flex;flex-wrap:wrap;gap:var(--space-md);align-items:center;margin-top:var(--space-sm);padding-top:var(--space-xs);border-top:1px solid rgba(255,255,255,0.08);${extra}">${content}</div>`;
}
function axisLabel(kind = 'x') {
  return kind === 'y'
    ? 'min-width:18px;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:rotate(180deg);color:var(--grigio-chiaro);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase'
    : 'margin-top:var(--space-sm);text-align:center;color:var(--grigio-chiaro);font-size:0.68rem;letter-spacing:0.04em;text-transform:uppercase';
}

function initCharts(section) {
  const C = window.Maranello?.charts;
  if (!C) { console.warn('[charts] Maranello.charts not ready'); return; }
  const g = id => section.querySelector(`#${id}`);
  const sparkData = [47,52,48,61,58,66,72,68,75,70,80,84];
  const barData = [{ label: 'Lombardia', value: 420, color: '#FFC72C' }, { label: 'Lazio', value: 310, color: '#FFC72C' }, { label: 'Toscana', value: 280, color: '#FFC72C' }, { label: 'Veneto', value: 195, color: '#FFC72C' }, { label: 'Piemonte', value: 165, color: '#FFC72C' }];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const areaData = [{ label: 'Donations', color: '#FFC72C', data: [120,145,132,178,195,210,188,225,247,260,238,275] }, { label: 'Sessions', color: '#00A651', data: [80,95,90,110,105,125,118,135,140,150,145,160] }, { label: 'At Risk', color: '#DC0000', data: [12,8,15,10,7,11,9,6,8,5,7,4] }];
  const donutSmall = [{ label: 'Therapy', value: 45, color: '#FFC72C' }, { label: 'Research', value: 25, color: '#4EA8DE' }, { label: 'Community', value: 20, color: '#00A651' }, { label: 'Admin', value: 10, color: '#616161' }];
  const donutLarge = [{ label: 'Completed', value: 92, color: '#FFC72C' }, { label: 'Remaining', value: 8, color: '#2a2a2a' }];
  const radarData = [{ label: 'Mobility', value: 85 }, { label: 'Speech', value: 72 }, { label: 'Cognition', value: 68 }, { label: 'Social', value: 90 }, { label: 'Motor', value: 78 }, { label: 'Emotional', value: 82 }];
  const bubbleData = [{ x: 30, y: 70, z: 18, color: '#FFC72C', label: 'Milano' }, { x: 55, y: 55, z: 14, color: '#00A651', label: 'Roma' }, { x: 75, y: 80, z: 22, color: '#4EA8DE', label: 'Torino' }, { x: 45, y: 30, z: 10, color: '#DC0000', label: 'At Risk' }, { x: 85, y: 45, z: 16, color: '#D4622B', label: 'Firenze' }];

  C.sparkline(g('spark-1'), sparkData, { color: '#FFC72C', width: 100, height: 32 });
  C.sparkline(g('spark-2'), [30,35,28,40,38,45], { color: '#4EA8DE', width: 100, height: 32 });
  C.sparkline(g('spark-3'), [80,75,90,85,95,88,100,92], { color: '#DC0000', width: 100, height: 32 });
  C.sparkline(g('spark-4'), [200,220,215,240,260,255,280,300], { color: '#00A651', width: 100, height: 32 });
  C.donut(g('donut-sm'), donutSmall, { width: 80, height: 80 });
  C.donut(g('donut-md'), donutLarge, { width: 140, height: 140 });
  C.barChart(g('bar-chart-demo'), barData, { width: 460, height: 200, color: '#FFC72C' });
  C.areaChart(g('area-chart-demo'), areaData, { width: 460, height: 200 });
  C.radar(g('radar-demo'), radarData, { width: 220, height: 220, color: '#FFC72C' });
  C.bubble(g('bubble-demo'), bubbleData, { width: 440, height: 220 });
  C.halfGauge(g('hg-sm'), { value: 68, max: 100, width: 100, height: 60 });
  C.halfGauge(g('hg-md'), { value: 87, max: 100, width: 180, height: 108 });
  C.halfGauge(g('hg-lg'), { value: 75, max: 100, width: 260, height: 156 });

  C.sparkline(g('trend-1'), [42,48,55,52,61,58,65,63,70,68,72,75,80,84,88], { color: '#FFC72C', width: 460, height: 60 });
  C.sparkline(g('trend-2'), [25,29,33,31,37,35,39,38,42,41,44,46,48,50,52], { color: '#00A651', width: 460, height: 60 });

  const M = window.Maranello;
  g('radar-score').innerHTML = `<span style="color:var(--mn-accent)">${Math.round(radarData.reduce((sum, { value }) => sum + value, 0) / radarData.length)}/100</span> overall score`;
  if (M.progressRing) {
    M.progressRing(g('ring-1'), { value: 72, max: 100, size: 60 });
    M.progressRing(g('ring-2'), { value: 45, max: 100, size: 80 });
    M.progressRing(g('ring-3'), { value: 92, max: 100, size: 100, color: '#00A651' });
  }

  const f1 = M.flipCounter?.(section.querySelector('#flip-1'), { value: 847 });
  const f2 = M.flipCounter?.(section.querySelector('#flip-2'), { value: 4280 });
  const f3 = M.flipCounter?.(section.querySelector('#flip-3'), { value: 92 });
  section.querySelector('#flip-inc')?.addEventListener('click', () => [f1, f2, f3].forEach(f => f?.increment?.()));
  section.querySelector('#flip-rand')?.addEventListener('click', () => {
    f1?.setValue?.(Math.floor(Math.random() * 1200));
    f2?.setValue?.(Math.floor(Math.random() * 6000));
    f3?.setValue?.(Math.floor(Math.random() * 100));
  });

  if (M.chartInteract) {
    const barPad = { top: 8, bottom: 22, left: 8, right: 8 }, barMax = Math.max(...barData.map(({ value }) => value)) * 1.15;
    const barChartW = 460 - barPad.left - barPad.right, barChartH = 200 - barPad.top - barPad.bottom, slotW = barChartW / barData.length, barW = slotW * 0.7;
    const areaPad = { top: 8, bottom: 8, left: 8, right: 8 }, areaMax = Math.max(...areaData.flatMap(({ data }) => data)) * 1.15;
    const bubblePad = { top: 12, bottom: 12, left: 12, right: 12 }, bubbleMaxX = Math.max(...bubbleData.map(({ x }) => x)) * 1.1, bubbleMaxY = Math.max(...bubbleData.map(({ y }) => y)) * 1.1, bubbleMaxZ = Math.max(...bubbleData.map(({ z }) => z));
    const bubbleGx = v => bubblePad.left + (v / bubbleMaxX) * (440 - bubblePad.left - bubblePad.right);
    const bubbleGy = v => 220 - bubblePad.bottom - (v / bubbleMaxY) * (220 - bubblePad.top - bubblePad.bottom);
    const bubbleGr = v => Math.max(4, (v / bubbleMaxZ) * 30);
    const donutMeta = (segments, size) => {
      const startAngle = -Math.PI / 2, gap = 0.02, outerRadius = size / 2 - 4, innerRadius = outerRadius * 0.75, total = segments.reduce((sum, { value }) => sum + value, 0);
      let angle = startAngle;
      return { type: 'donut', center: { x: size / 2, y: size / 2 }, innerRadius, outerRadius, segments: segments.map(seg => { const sweep = (seg.value / total) * (Math.PI * 2 - gap * segments.length), next = angle + sweep, item = { ...seg, pct: Math.round(seg.value / total * 100), start: angle, end: next }; angle = next + gap; return item; }) };
    };
    const radarMax = 100, radarCx = 110, radarCy = 110, radarRadius = 80, radarStep = (Math.PI * 2) / radarData.length;
    const bind = (id, meta, colors) => { const el = g(id); if (el) M.chartInteract(el, meta, colors); };
    bind('donut-sm', donutMeta(donutSmall, 80), donutSmall.map(({ color }) => color));
    bind('donut-md', donutMeta(donutLarge, 140), donutLarge.map(({ color }) => color));
    bind('bar-chart-demo', { type: 'bar', data: barData, labels: barData.map(({ label }) => label), pad: barPad, gx: i => barPad.left + i * slotW + slotW / 2, gy: v => 200 - barPad.bottom - (v / barMax) * barChartH, barRects: barData.map((_, i) => ({ x: barPad.left + i * slotW + slotW * 0.15, w: barW })) }, barData.map(({ color }) => color));
    bind('area-chart-demo', { type: 'area', datasets: areaData, labels: months, pad: areaPad, maxLen: months.length, gx: i => areaPad.left + (i / (months.length - 1)) * (460 - areaPad.left - areaPad.right), gy: v => 200 - areaPad.bottom - (v / areaMax) * (200 - areaPad.top - areaPad.bottom) }, areaData.map(({ color }) => color));
    bind('radar-demo', { type: 'radar', data: radarData, max: radarMax, points: radarData.map(({ value }, i) => ({ x: radarCx + Math.cos(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, y: radarCy + Math.sin(-Math.PI / 2 + i * radarStep) * (value / radarMax) * radarRadius, r: 10 })) }, ['#FFC72C']);
    bind('bubble-demo', { type: 'bubble', data: bubbleData, points: bubbleData.map(({ x, y, z }) => ({ x: bubbleGx(x), y: bubbleGy(y), r: bubbleGr(z) })) }, bubbleData.map(({ color }) => color));
  }
  if (M.sparklineInteract) {
    [['spark-1', sparkData], ['spark-2', [30,35,28,40,38,45]], ['spark-3', [80,75,90,85,95,88,100,92]], ['spark-4', [200,220,215,240,260,255,280,300]]].forEach(([id, data]) => {
      const el = g(id);
      if (el) M.sparklineInteract(el, data, { color: '#FFC72C' });
    });
  }
}
