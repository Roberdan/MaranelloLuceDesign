/**
 * FinOps section — agent cost breakdown, cost timeline, token budget monitoring.
 * AI platform cost governance and budget tracking.
 */

const COST_ROWS = [
  { id: 'r1', agentName: 'Document Analyst',  model: 'claude-opus-4-6',    totalTokens: 4_820_000, cachedTokens: 1_200_000, cost: 192.80, costDelta: 12.4,  calls: 1840, avgLatencyMs: 1820, budget: 250, tags: ['prod', 'rag'] },
  { id: 'r2', agentName: 'Code Review Bot',   model: 'claude-sonnet-4-6',  totalTokens: 8_340_000, cachedTokens: 3_100_000, cost: 125.10, costDelta: -8.2,  calls: 5620, avgLatencyMs:  940, budget: 150, tags: ['prod', 'ci'] },
  { id: 'r3', agentName: 'Support Assistant', model: 'claude-haiku-4-5',   totalTokens:22_600_000, cachedTokens: 8_400_000, cost:  90.40, costDelta:  3.1,  calls:31200, avgLatencyMs:  380, budget: 120, tags: ['prod'] },
  { id: 'r4', agentName: 'Research Agent',    model: 'claude-opus-4-6',    totalTokens: 2_150_000, cachedTokens:   380_000, cost: 258.00, costDelta: 41.2,  calls:  420, avgLatencyMs: 3400, budget: 280, tags: ['staging', 'search'] },
  { id: 'r5', agentName: 'Data Extractor',    model: 'claude-sonnet-4-6',  totalTokens: 5_900_000, cachedTokens: 2_700_000, cost:  88.50, costDelta: -2.0,  calls: 9100, avgLatencyMs:  620, budget: 100, tags: ['batch'] },
  { id: 'r6', agentName: 'SQL Generator',     model: 'claude-haiku-4-5',   totalTokens:11_200_000, cachedTokens: 5_100_000, cost:  44.80, costDelta:  0.5,  calls:18400, avgLatencyMs:  290, budget:  60, tags: ['prod', 'db'] },
  { id: 'r7', agentName: 'Eval Harness',      model: 'claude-sonnet-4-6',  totalTokens: 3_600_000, cachedTokens:   900_000, cost:  54.00, costDelta:  8.8,  calls: 2800, avgLatencyMs:  780, budget:  70, tags: ['ci', 'eval'] },
];

const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];

const TIMELINE_SERIES = [
  { id: 'opus',   label: 'Opus 4.6',    values: [140,155,168,182,190,195,210,225,218,240,252,258] },
  { id: 'sonnet', label: 'Sonnet 4.6',  values: [ 80, 88, 92, 95, 98,102,108,112,115,118,120,125] },
  { id: 'haiku',  label: 'Haiku 4.5',   values: [ 40, 42, 44, 45, 46, 47, 48, 49, 50, 50, 51, 52] },
];

export function createFinOpsSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'finops';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">40 — FinOps</p>
      <div class="mn-watermark">FINOPS</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">AI Cost Governance</h2>
      <p class="mn-body mn-mb-2xl">Per-agent token attribution, budget monitoring, and multi-model cost trends — built for FinOps teams managing LLM workloads.</p>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <span class="mn-label" style="color:var(--mn-accent)">Agent Cost Breakdown — March 2026</span>
          <div style="display:flex;gap:var(--space-sm);align-items:center">
            <span class="mn-micro" style="color:var(--mn-text-muted)" id="fin-total"></span>
            <button class="mn-btn mn-btn--ghost" id="fin-export" style="font-size:var(--text-micro)">Export CSV</button>
          </div>
        </div>
        <div id="fin-cost"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.agentCostBreakdown(el, rows, { sortable: true, onBudgetAlert, onSelect });</pre>
        </details>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <span class="mn-label" style="color:var(--mn-accent)">Cost Timeline — 12 Weeks</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost fin-stack-btn" id="fin-stacked" style="font-size:var(--text-micro)">Stacked</button>
            <button class="mn-btn mn-btn--ghost fin-stack-btn" id="fin-overlay" style="font-size:var(--text-micro)">Overlay</button>
          </div>
        </div>
        <canvas id="fin-timeline" style="display:block;width:100%;height:280px"></canvas>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.costTimeline(canvas, { labels, series, stacked: true, animate: true, unit: '$' });</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">Token Budget Meters</span>
          <span class="mn-micro" style="color:var(--mn-text-muted)">Live usage vs. monthly budget</span>
        </div>
        <div id="fin-meters" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-lg)"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.tokenMeter(el, { used, total, label, onAlert });</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    /* ── Agent Cost Breakdown ── */
    const costEl = section.querySelector('#fin-cost');
    const totalEl = section.querySelector('#fin-total');
    const costCtrl = M.agentCostBreakdown(costEl, COST_ROWS, {
      currency: 'USD',
      period: 'March 2026',
      sortable: true,
      onSelect: (row) => M.toast({ type: 'info', title: row.agentName, message: `$${row.cost.toFixed(2)} · ${row.calls.toLocaleString()} calls` }),
      onBudgetAlert: (row) => M.toast({ type: 'warning', title: 'Budget alert', message: `${row.agentName} at ${Math.round((row.cost / row.budget) * 100)}% of budget` }),
    });
    const grandTotal = COST_ROWS.reduce((s, r) => s + r.cost, 0);
    if (totalEl) totalEl.textContent = `Total: $${grandTotal.toFixed(2)}`;

    section.querySelector('#fin-export')?.addEventListener('click', () => {
      M.toast({ type: 'success', title: 'Exported', message: `${COST_ROWS.length} agents to CSV` });
    });

    /* ── Cost Timeline ── */
    const timelineCanvas = section.querySelector('#fin-timeline');
    let timelineStacked = true;
    let timelineCtrl = M.costTimeline(timelineCanvas, {
      labels: WEEKS,
      series: TIMELINE_SERIES,
      height: 280,
      stacked: true,
      animate: true,
      unit: '$',
      onHover: (label, vals) => {
        const parts = Object.entries(vals).map(([k, v]) => `${k}: $${v}`).join(' | ');
        M.toast({ type: 'info', title: label, message: parts });
      },
    });

    function rebuildTimeline(stacked) {
      if (timelineCtrl?.destroy) timelineCtrl.destroy();
      timelineCtrl = M.costTimeline(timelineCanvas, {
        labels: WEEKS, series: TIMELINE_SERIES, height: 280,
        stacked, animate: true, unit: '$',
      });
      section.querySelector('#fin-stacked').style.opacity = stacked ? '1' : '0.5';
      section.querySelector('#fin-overlay').style.opacity = stacked ? '0.5' : '1';
    }

    section.querySelector('#fin-stacked').addEventListener('click', () => { timelineStacked = true; rebuildTimeline(true); });
    section.querySelector('#fin-overlay').addEventListener('click', () => { timelineStacked = false; rebuildTimeline(false); });
    section.querySelector('#fin-stacked').style.opacity = '1';
    section.querySelector('#fin-overlay').style.opacity = '0.5';

    /* ── Token Budget Meters ── */
    const metersEl = section.querySelector('#fin-meters');
    const BUDGETS = [
      { label: 'Opus 4.6 — Production',  used: 6_970_000,  total: 8_000_000 },
      { label: 'Sonnet 4.6 — All agents', used: 17_840_000, total: 20_000_000 },
      { label: 'Haiku 4.5 — Support',    used: 22_600_000,  total: 28_000_000 },
      { label: 'Batch processing pool',  used:  9_800_000,  total: 15_000_000 },
    ];
    BUDGETS.forEach(b => {
      const wrap = document.createElement('div');
      metersEl.appendChild(wrap);
      if (M.tokenMeter) {
        M.tokenMeter(wrap, {
          used: b.used, total: b.total, label: b.label,
          onAlert: (pct) => M.toast({ type: 'warning', title: 'Token budget', message: `${b.label} at ${pct}%` }),
        });
      }
    });
  });

  return section;
}
