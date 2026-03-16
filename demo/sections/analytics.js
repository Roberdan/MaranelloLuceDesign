/**
 * Analytics section — waterfallChart, confidenceChart, decisionMatrix, renderSourceCards
 * Realistic VirtualBPM / RAG data: scenario analysis, forecast, decision scoring.
 */

const WATERFALL_DATA = [
  { label: 'Q4 Budget', value: 120000, isTotal: true },
  { label: 'Inference', value: -28400 },
  { label: 'Training', value: -14200 },
  { label: 'Storage', value: -6800 },
  { label: 'Savings', value: +9500 },
  { label: 'Overage', value: -3100 },
  { label: 'Q4 Actual', value: 0, isTotal: true },
];

const CONFIDENCE_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  values: [62, 68, 71, 75, 79, 83, 86, 89],
  lower:  [55, 59, 61, 63, 66, 70, 72, 74],
  upper:  [69, 77, 81, 87, 91, 95, 98, 102],
};

const MATRIX_OPTS = {
  criteria: [
    { id: 'cost',     label: 'Cost efficiency',   weight: 9 },
    { id: 'latency',  label: 'P95 latency',        weight: 8 },
    { id: 'accuracy', label: 'Accuracy',           weight: 10 },
    { id: 'ops',      label: 'Ops complexity',     weight: 6 },
  ],
  alternatives: [
    { id: 'a', label: 'Sonnet 4.6',   scores: { cost: 8, latency: 9, accuracy: 9, ops: 8 } },
    { id: 'b', label: 'Opus 4.6',     scores: { cost: 5, latency: 6, accuracy: 10, ops: 7 } },
    { id: 'c', label: 'Haiku 4.5',    scores: { cost: 10, latency: 10, accuracy: 6, ops: 9 } },
    { id: 'd', label: 'GPT-5.1',      scores: { cost: 6, latency: 7, accuracy: 8, ops: 6 } },
  ],
  editable: true,
};

const SOURCE_CARDS = [
  { id: 's1', title: 'Q4 2025 Infrastructure Cost Analysis', excerpt: 'Inference costs grew 23% QoQ driven by increased embedding workloads. Recommend tiered caching strategy to reduce redundant API calls by an estimated 40%.', source: 'FinOps Report Q4-2025.pdf', score: 0.96, date: 'Dec 2025', badge: 'Report' },
  { id: 's2', title: 'Agent Model Selection Guidelines', excerpt: 'Selection criteria for production agents: latency requirements, accuracy benchmarks, and total cost of ownership analysis across major providers.', source: 'Internal Policy v3.2', score: 0.88, date: 'Feb 2026', badge: 'Policy' },
  { id: 's3', title: 'VirtualBPM SLA Contract — Clause 4.2', excerpt: 'Response time guarantees: P95 latency must not exceed 450ms for synchronous agent calls. Penalty clause applies above 1.2× threshold.', source: 'Contract MSA-2024-087', score: 0.81, date: 'Jan 2024', badge: 'Contract' },
  { id: 's4', title: 'Prompt Caching ROI Study', excerpt: 'A 3-month study across 6 enterprise deployments showed prompt caching reduces token spend by 28-41% with negligible accuracy degradation.', source: 'Research Paper arXiv:2501.xxxxx', score: 0.74, date: 'Jan 2026', badge: 'Research' },
];

export function createAnalyticsSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'analytics';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">35 — Analytics &amp; Intelligence</p>
      <div class="mn-watermark">ANALYTICS</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Analytics &amp; AI Components</h2>
      <p class="mn-body mn-mb-2xl">Financial waterfall, confidence interval forecast, decision matrix, and RAG source citation cards.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl)">

        <!-- Waterfall Chart -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <span class="mn-label" style="display:block;margin-bottom:var(--space-lg);color:var(--mn-accent)">Waterfall Chart — Budget Variance</span>
          <canvas id="anl-waterfall" style="display:block;width:100%;height:200px"></canvas>
          <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">M.waterfallChart(canvas, { segments, unit: '€' });</pre>
          </details>
        </div>

        <!-- Confidence Chart -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <span class="mn-label" style="display:block;margin-bottom:var(--space-lg);color:var(--mn-accent)">Confidence Interval — Accuracy Forecast</span>
          <canvas id="anl-confidence" style="display:block;width:100%;height:200px"></canvas>
          <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">M.confidenceChart(canvas, { labels, values, lower, upper, unit: '%' });</pre>
          </details>
        </div>
      </div>

      <!-- Decision Matrix -->
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">Decision Matrix — Model Selection</span>
          <span class="mn-micro" style="color:var(--mn-text-muted)">Click any score to edit (1–10)</span>
        </div>
        <div id="anl-matrix"></div>
        <div id="anl-matrix-result" class="mn-micro" style="margin-top:var(--space-md);color:var(--mn-text-muted)"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const mx = M.decisionMatrix(el, { criteria, alternatives, editable: true, onChange });</pre>
        </details>
      </div>

      <!-- Source Citation Cards -->
      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">RAG Source Citations</span>
          <button class="mn-btn mn-btn--ghost" id="anl-add-source" style="font-size:var(--text-micro)">+ Add source</button>
        </div>
        <div id="anl-sources"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">M.renderSourceCards(container, cards, { onSelect: (card) => console.log(card), maxVisible: 3 });</pre>
        </details>
      </div>

    </div>`;

  requestAnimationFrame(() => {
    /* Waterfall */
    const wfCanvas = section.querySelector('#anl-waterfall');
    M.waterfallChart(wfCanvas, { segments: WATERFALL_DATA, unit: '€', animate: true });

    /* Confidence */
    const cfCanvas = section.querySelector('#anl-confidence');
    M.confidenceChart(cfCanvas, { ...CONFIDENCE_DATA, unit: '%', animate: true });

    /* Decision Matrix */
    const matrixEl = section.querySelector('#anl-matrix');
    const resultEl = section.querySelector('#anl-matrix-result');
    const mx = M.decisionMatrix(matrixEl, {
      ...MATRIX_OPTS,
      onChange: (alts) => {
        const winner = alts.reduce((best, a) => {
          const score = (alt) => MATRIX_OPTS.criteria.reduce((s, c) => s + (alt.scores[c.id] || 0) * c.weight, 0);
          return score(a) > score(best) ? a : best;
        });
        resultEl.textContent = `Recommended: ${winner.label}`;
      },
    });
    void mx;

    /* Source Cards */
    const sourcesEl = section.querySelector('#anl-sources');
    let extraIdx = SOURCE_CARDS.length;
    const sc = M.renderSourceCards(sourcesEl, SOURCE_CARDS, {
      maxVisible: 3,
      onSelect: (card) => M.toast({ type: 'info', title: 'Source selected', message: card.title }),
    });
    section.querySelector('#anl-add-source').addEventListener('click', () => {
      extraIdx++;
      sc.update([...SOURCE_CARDS, {
        id: `s${extraIdx}`, title: `Synthetic result #${extraIdx}`,
        excerpt: 'Auto-generated citation for demo purposes.',
        source: 'Demo corpus', score: Math.random() * 0.4 + 0.55,
        date: 'Mar 2026', badge: 'Demo',
      }]);
    });
  });

  return section;
}
