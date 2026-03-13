/**
 * Gauges section — Ferrari Binnacle instrument cluster
 * Uses data-gauge JSON attributes + Maranello.initGauges()
 */
export function createGaugesSection() {
  const section = document.createElement('section');
  section.id = 'gauges';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">08 — Instrumentation</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Instrument Binnacle</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Every gauge tells a complete story. Ferrari-style complications show layered data —
        needle, sub-dials, arc bars, odometer, crosshair and trend indicators.
      </p>

      <!-- ── Main binnacle ── -->
      <div class="mn-binnacle">
        <div class="mn-binnacle__header">
          <span class="mn-binnacle__title">FightTheStroke / Instrument Binnacle</span>
          <span class="mn-binnacle__badge">◈ Aligned</span>
        </div>
        <div class="mn-binnacle__instruments">

          <!-- LEFT: Therapy Utilization -->
          <div class="mn-gauge">
            <div class="mn-gauge__instrument mn-gauge__instrument--sm">
              <div class="mn-gauge__dial">
                <canvas class="mn-gauge__canvas" data-gauge='${utilGauge()}'></canvas>
                <div class="mn-gauge__glass"></div>
              </div>
            </div>
            <span class="mn-gauge__label">Utilization</span>
          </div>

          <!-- CENTER: Quality Score (hero) -->
          <div class="mn-gauge">
            <div class="mn-gauge__instrument" style="width:300px;height:300px">
              <div class="mn-gauge__dial">
                <canvas class="mn-gauge__canvas" data-gauge='${heroGauge()}'></canvas>
                <div class="mn-gauge__glass"></div>
              </div>
            </div>
            <span class="mn-gauge__label">6Q Completeness</span>
          </div>

          <!-- RIGHT: Portfolio Map -->
          <div class="mn-gauge">
            <div class="mn-gauge__instrument" style="width:220px;height:220px">
              <div class="mn-gauge__dial">
                <canvas class="mn-gauge__canvas" data-gauge='${portfolioGauge()}'></canvas>
                <div class="mn-gauge__glass"></div>
              </div>
            </div>
            <span class="mn-gauge__label">Portfolio Map</span>
          </div>

        </div>
      </div>

      <!-- ── Mini complications row ── -->
      <div style="display:flex;justify-content:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-2xl)">

        <div class="mn-gauge">
          <div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px">
            <div class="mn-gauge__dial mn-gauge__dial--warning">
              <canvas class="mn-gauge__canvas" data-gauge='${riskGauge()}'></canvas>
              <div class="mn-gauge__glass"></div>
            </div>
          </div>
          <span class="mn-gauge__label">Risk Level</span>
        </div>

        <div class="mn-gauge">
          <div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px">
            <div class="mn-gauge__dial">
              <canvas class="mn-gauge__canvas" data-gauge='${dataQualityGauge()}'></canvas>
              <div class="mn-gauge__glass"></div>
            </div>
          </div>
          <span class="mn-gauge__label">Data Quality</span>
        </div>

        <div class="mn-gauge">
          <div class="mn-gauge__instrument mn-gauge__instrument--sm" style="width:160px;height:160px">
            <div class="mn-gauge__dial">
              <canvas class="mn-gauge__canvas" data-gauge='${kpiGauge()}'></canvas>
              <div class="mn-gauge__glass"></div>
            </div>
          </div>
          <span class="mn-gauge__label">KPI Coverage</span>
        </div>

        <div class="mn-gauge">
          <div class="mn-gauge__instrument" style="width:220px;height:220px">
            <div class="mn-gauge__dial">
              <canvas class="mn-gauge__canvas" data-gauge='${trendGauge()}'></canvas>
              <div class="mn-gauge__glass"></div>
            </div>
          </div>
          <span class="mn-gauge__label">Quality Trend</span>
        </div>

      </div>
    </div>
  `;

  setTimeout(() => {
    if (window.Maranello?.initGauges) {
      window.Maranello.initGauges({ selector: '#gauges .mn-gauge__canvas', threshold: 0.1 });
    } else {
      console.warn('[gauges] Maranello.initGauges not ready');
    }
  }, 300);

  return section;
}

function utilGauge() {
  return JSON.stringify({
    value: 87, max: 100, color: '#00A651', ticks: 10, subticks: 5,
    startAngle: -225, endAngle: 45, showNeedle: true,
    numbers: [0, 20, 40, 60, 80, 100],
    complications: {
      innerRing: { value: 234, max: 300, color: '#FFC72C', label: 'Children' },
      odometer: { digits: ['2','3','4'], highlightLast: true, label: 'children' },
      statusLed: { color: '#00A651', label: 'HEALTHY' }
    }
  });
}

function heroGauge() {
  return JSON.stringify({
    value: 78, max: 100, color: '#FFC72C', ticks: 10, subticks: 5,
    startAngle: -225, endAngle: 45, showNeedle: true,
    numbers: [0,10,20,30,40,50,60,70,80,90,100],
    complications: {
      arcBar: { value: 847, max: 1000, colorStops: ['#DC0000','#FFC72C','#00A651'],
        labelLeft: '0', labelRight: '1000', labelCenter: '847 children' },
      subDials: [
        { x: -0.28, y: 0.18, value: 72, max: 100, color: '#448AFF', label: 'Therapy' },
        { x:  0.28, y: 0.18, value: 91, max: 100, color: '#DC0000', label: 'Quality' }
      ],
      trend: { direction: 'up', delta: '+5', color: '#00A651' },
      centerLabel: 'FOUNDATION', centerValue: '78', centerUnit: '/ 100'
    }
  });
}

function portfolioGauge() {
  return JSON.stringify({
    value: 0, max: 100, color: '#448AFF', ticks: 0, subticks: 0,
    startAngle: 0, endAngle: 0, showNeedle: false,
    complications: {
      crosshair: {
        x: 0.35, y: -0.25, dotColor: '#FFC72C', gridColor: '#5a4a20',
        labelTop: 'ACTIVE', labelBottom: 'CLOSED', labelLeft: 'LOW', labelRight: 'HIGH',
        title: 'IMPACT',
        scatterDots: [
          { x: 0.55, y: -0.40, color: '#00E676', r: 7 },
          { x: 0.70, y: -0.55, color: '#00E676', r: 6 },
          { x: 0.30, y: -0.10, color: '#FFD54F', r: 6 },
          { x: 0.15, y: -0.50, color: '#64B5F6', r: 5 },
          { x: -0.20, y: -0.30, color: '#64B5F6', r: 5 },
          { x: 0.60, y: -0.20, color: '#00E676', r: 6 },
          { x: 0.40, y: -0.65, color: '#00E676', r: 7 }
        ]
      },
      quadrantCounts: { tl: 3, tr: 18, bl: 2, br: 5 },
      statusLed: { color: '#00A651', label: '28 PROG' }
    }
  });
}

function riskGauge() {
  return JSON.stringify({
    value: 15, max: 100, color: '#DC0000', ticks: 10, subticks: 5,
    startAngle: -225, endAngle: 45, showNeedle: true,
    numbers: [0, 25, 50, 75, 100],
    complications: {
      centerLabel: 'AT RISK', centerValue: '15', centerUnit: '%',
      statusLed: { color: '#DC0000', label: 'ALERT' },
      trend: { direction: 'up', delta: '+3', color: '#DC0000' }
    }
  });
}

function dataQualityGauge() {
  return JSON.stringify({
    value: 91, max: 100, color: '#00A651', ticks: 10, subticks: 5,
    startAngle: -225, endAngle: 45, showNeedle: true,
    numbers: [0, 25, 50, 75, 100],
    complications: {
      centerLabel: 'DATA', centerValue: '91', centerUnit: '%',
      innerRing: { value: 88, max: 100, color: '#448AFF', label: 'PREV' },
      statusLed: { color: '#00A651', label: 'PASS' }
    }
  });
}

function kpiGauge() {
  return JSON.stringify({
    value: 72, max: 100, color: '#FFC72C', ticks: 10, subticks: 5,
    startAngle: -225, endAngle: 45, showNeedle: true,
    numbers: [0, 25, 50, 75, 100],
    complications: {
      centerLabel: 'KPI', centerValue: '72', centerUnit: '%',
      arcBar: { value: 18, max: 24, colorStops: ['#DC0000','#FFC72C','#00A651'], labelCenter: '18/24' },
      statusLed: { color: '#FFC72C', label: 'WARN' }
    }
  });
}

function trendGauge() {
  return JSON.stringify({
    value: 0, max: 100, color: '#FFC72C', ticks: 0, subticks: 0,
    startAngle: 0, endAngle: 0, showNeedle: false,
    complications: {
      multigraph: {
        mode: 'sparkline',
        data: [42,48,55,52,61,58,65,63,70,68,72,75],
        color: '#FFC72C', label: 'TREND',
        months: ['A','M','J','J','A','S','O','N','D','J','F','M']
      },
      centerLabel: 'FY26', centerValue: '75', centerUnit: 'score',
      trend: { direction: 'up', delta: '+33', color: '#00A651' }
    }
  });
}
