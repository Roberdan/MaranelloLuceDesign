const KPI_CARDS = [
  { label: 'Active Agents', value: '847', yoy: 12.4, qoq: 3.2 },
  { label: 'Token Spend', value: '$124.8K', yoy: -2.1, qoq: -8.2 },
  { label: 'Automation Rate', value: '87.3%', yoy: 5.1, qoq: 2.8 },
  { label: 'Pipeline SLA', value: '99.7%', yoy: 0.3, qoq: { value: 0.1, trend: 'flat' } },
];

const SPARKS = [
  { id: 'runs', label: 'Pipeline Runs Trend', unit: 'runs', color: '#FFC72C', data: [48, 52, 57, 61, 66, 68, 72, 75, 79, 84] },
  { id: 'tokens', label: 'Token Spend Trend', unit: 'k USD', color: '#00A651', data: [88, 91, 95, 98, 102, 106, 109, 113, 118, 124] },
];

export function createDashboardSection() {
  const section = document.createElement('section');
  section.id = 'dashboard';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">04 — Dashboard</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Dashboard Strip</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">KPI stat cards, live telemetry, and a sortable pipeline operations view built with Maranello Luce demo data.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;div class="mn-card-dark mn-stat"&gt;
  &lt;div class="mn-stat__label"&gt;Active Agents&lt;/div&gt;
  &lt;div class="mn-stat__value"&gt;847&lt;/div&gt;
  &lt;div class="mn-stat__delta"&gt;↑ 12.4% Y/Y&lt;/div&gt;
  &lt;div class="mn-stat__delta"&gt;↑ 3.2% Q/Q&lt;/div&gt;
&lt;/div&gt;</code></pre>
      </details>
      <div class="mn-grid-4" style="margin-bottom:var(--space-xl)">${KPI_CARDS.map(kpiCard).join('')}</div>
      ${livePanel()}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:var(--space-md);margin:var(--space-2xl) 0 var(--space-xl)"><div><h3 class="mn-title-sub">Maranello Luce Pipeline Desk</h3><p class="mn-micro" style="color:var(--grigio-medio)">Operations overview · March 2026</p></div><div style="display:flex;gap:var(--space-sm)"><button class="mn-btn mn-btn--ghost-light mn-btn--sm">Export</button><button class="mn-btn mn-btn--accent mn-btn--sm">+ Pipeline</button></div></div>
      <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-bottom:var(--space-xl)"><span class="mn-tag mn-tag--light mn-tag--active">All (47)</span><span class="mn-tag mn-tag--light">Running (29)</span><span class="mn-tag mn-tag--light">Queued (9)</span><span class="mn-tag mn-tag--light">Canary (6)</span><span class="mn-tag mn-tag--light">Blocked (3)</span></div>
      <div class="mn-card-dark" style="padding:0;overflow:hidden;margin-bottom:var(--space-xl)"><div class="mn-table-wrap"><table class="mn-table"><thead><tr><th>ID</th><th>Pipeline</th><th>Stage</th><th>Owner</th><th>Status</th><th>Accuracy</th><th>Agents</th></tr></thead><tbody>${tableRow('#66464', 'Pipeline Alpha', 'Route → Infer', 'Agent Opus', 'active', 'Running', 97, 'mn-progress__fill--green', 14)}${tableRow('#68210', 'Pipeline Beta', 'Eval → Retry', 'Agent Sonnet', 'warning', 'At Risk', 81, 'mn-progress__fill--yellow', 22)}${tableRow('#71055', 'Pipeline Gamma', 'Deploy canary', 'Agent Haiku', 'active', 'Running', 93, 'mn-progress__fill--green', 9)}${tableRow('#72340', 'Pipeline Delta', 'Guardrail audit', 'Validator Mesh', 'danger', 'Blocked', 54, 'mn-progress__fill--red', 6)}${tableRow('#73890', 'Pipeline Epsilon', 'Prompt ingest', 'Research Queue', 'info', 'Queued', 76, 'mn-progress__fill--blue', 11)}</tbody></table></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-md);flex-wrap:wrap"><span class="mn-micro" style="color:var(--grigio-medio)">Showing 5 of 47 pipeline runs</span><div style="display:flex;gap:var(--space-xs)"><button class="mn-dot mn-dot--active" aria-label="Page 1"></button><button class="mn-dot" aria-label="Page 2"></button><button class="mn-dot" aria-label="Page 3"></button><button class="mn-dot" aria-label="Page 4"></button></div></div>
    </div>
  `;
  requestAnimationFrame(() => initDashboard(section));
  return section;
}

function livePanel() {
  return `<div class="mn-card-dark" style="padding:var(--space-lg);display:flex;gap:var(--space-xl);align-items:center;justify-content:space-between;flex-wrap:wrap"><div style="display:grid;gap:var(--space-sm);min-width:220px"><span style="display:inline-flex;align-items:center;justify-content:center;width:max-content;padding:6px 12px;border:1px solid var(--mn-accent);border-radius:999px;color:var(--mn-accent);font:600 var(--text-micro)/1 var(--font-display);letter-spacing:.08em;text-transform:uppercase">Mode: Active</span><div style="font-family:var(--font-display);font-size:clamp(2rem,4vw,3.5rem);font-weight:700;line-height:1;color:var(--mn-text)">47 <span style="font-size:var(--text-caption);color:var(--mn-text-muted)">pipelines</span></div><div style="display:flex;gap:var(--space-md);flex-wrap:wrap;color:var(--mn-text-muted)"><span class="mn-label" style="color:var(--mn-accent)">Routing: Healthy</span><span class="mn-micro">$124k spend</span></div></div><div style="display:flex;gap:var(--space-lg);flex:1 1 320px;flex-wrap:wrap">${SPARKS.map((spark) => {
    const min = Math.min(...spark.data);
    const max = Math.max(...spark.data);
    return `<div style="flex:1 1 180px;min-width:180px"><div class="mn-micro" style="color:var(--mn-text-muted);margin-bottom:var(--space-xs)">${spark.label}</div><canvas id="dashboard-spark-${spark.id}" style="width:100%;height:52px;display:block"></canvas><div style="display:flex;justify-content:space-between;margin-top:var(--space-xs)"><span class="mn-micro" style="color:var(--grigio-medio)">Min ${min} ${spark.unit}</span><span class="mn-micro" style="color:var(--grigio-medio)">Max ${max} ${spark.unit}</span></div><div style="display:flex;justify-content:space-between"><span class="mn-micro" style="color:var(--grigio-medio)">24h ago</span><span class="mn-micro" style="color:var(--grigio-medio)">now</span></div></div>`;
  }).join('')}</div><div style="display:grid;gap:var(--space-xs);text-align:right;min-width:140px"><div style="font-family:var(--font-display);font-size:clamp(1.25rem,3vw,2rem);letter-spacing:.08em">10:10 MON 25</div><div class="mn-label" style="color:var(--verde-racing)">96% Accuracy Score</div><div class="mn-micro" style="color:var(--mn-accent)">3 blocked lanes</div></div></div>`;
}

function initDashboard(section) {
  const M = window.Maranello;
  const charts = M?.charts;
  if (!charts?.sparkline) return;
  SPARKS.forEach((spark) => {
    const canvas = section.querySelector(`#dashboard-spark-${spark.id}`);
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const min = Math.min(...spark.data);
    const max = Math.max(...spark.data);
    const labels = spark.data.map((_, i) => (i === 0 ? '24h ago' : i === spark.data.length - 1 ? 'now' : `${spark.data.length - 1 - i}h ago`));

    charts.sparkline(canvas, spark.data, { color: spark.color, lineWidth: 2, fillOpacity: 0.18 });

    if (M.chartInteract) {
      // Read dimensions AFTER sparkline renders so chartHiDpi has set the exact CSS size
      const w = canvas.clientWidth || 220;
      const h = canvas.clientHeight || 52;
      const pad = { top: 2, right: 2, bottom: 2, left: 2 };
      const range = max - min || 1;
      M.chartInteract(canvas, {
        type: 'area',
        datasets: [{ label: spark.label, data: spark.data, color: spark.color }],
        labels,
        pad,
        maxLen: spark.data.length,
        gx: (idx) => pad.left + (idx / (spark.data.length - 1)) * (w - pad.left - pad.right),
        gy: (value) => h - pad.bottom - ((value - min) / range) * (h - pad.top - pad.bottom),
      }, [spark.color]);
    }
  });
}

function kpiCard(kpi) {
  const yoy = trendLabel(kpi.yoy, 'Y/Y');
  const qoq = trendLabel(kpi.qoq, 'Q/Q');
  return `<div class="mn-card-dark mn-stat" style="padding:var(--space-lg)"><div class="mn-stat__label" style="color:var(--grigio-medio);margin-bottom:var(--space-xs)">${kpi.label}</div><div class="mn-stat__value" style="font-size:2rem;font-weight:700;font-family:var(--font-display);color:var(--mn-text);margin-bottom:var(--space-sm)">${kpi.value}</div><div style="display:flex;gap:var(--space-lg);flex-wrap:wrap"><span class="mn-stat__delta" style="color:${yoy.color}">${yoy.text} <span style="color:var(--grigio-medio)">${yoy.period}</span></span><span class="mn-stat__delta" style="color:${qoq.color}">${qoq.text} <span style="color:var(--grigio-medio)">${qoq.period}</span></span></div></div>`;
}

function trendLabel(value, period) {
  const normalized = typeof value === 'number' ? { value, trend: undefined } : value;
  const rounded = Math.abs(normalized.value).toFixed(1);
  if (normalized.trend === 'flat') return { text: `→ ${rounded}%`, color: 'var(--grigio-medio)', period };
  if (normalized.value > 0) return { text: `↑ ${rounded}%`, color: 'var(--verde-racing)', period };
  if (normalized.value < 0) return { text: `↓ ${rounded}%`, color: 'var(--rosso-corsa)', period };
  return { text: `→ ${rounded}%`, color: 'var(--grigio-medio)', period };
}

function tableRow(id, name, stage, owner, statusKey, statusLabel, accuracy, fillClass, agents) {
  return `<tr><td class="mn-table__cell-id">${id}</td><td class="mn-table__cell-primary"><strong>${name}</strong></td><td><span class="mn-tag mn-tag--light mn-tag--xs">${stage}</span></td><td class="mn-table__cell-secondary">${owner}</td><td><span class="mn-status mn-status--${statusKey}"><span class="mn-status__dot"></span> ${statusLabel}</span></td><td><div style="display:flex;align-items:center;gap:var(--space-xs)"><div class="mn-progress" style="width:60px"><div class="mn-progress__fill ${fillClass}" style="width:${accuracy}%"></div></div><span class="mn-micro" style="color:var(--grigio-medio)">${accuracy}%</span></div></td><td class="mn-table__cell-value">${agents}</td></tr>`;
}
