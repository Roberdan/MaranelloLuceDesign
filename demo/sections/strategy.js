/**
 * Strategy section — BCG Matrix, Nine-Box (GE-McKinsey), Business Model Canvas,
 * SWOT Matrix, Decision Matrix for vendor scoring.
 */
const BCG_ITEMS = [
  { id: 'claude',   label: 'Claude API',   marketShare: 0.72, growthRate: 42,  size: 8 },
  { id: 'embed',    label: 'Embeddings',   marketShare: 0.58, growthRate: 28,  size: 5 },
  { id: 'finetune', label: 'Fine-tuning',  marketShare: 0.35, growthRate: 15,  size: 4 },
  { id: 'batch',    label: 'Batch Proc.',  marketShare: 0.61, growthRate:  6,  size: 6 },
  { id: 'vision',   label: 'Vision API',   marketShare: 0.28, growthRate: 35,  size: 5 },
  { id: 'legacy',   label: 'Legacy NLP',   marketShare: 0.18, growthRate: -2,  size: 3 },
];

const NINE_BOX_ITEMS = [
  { id: 'i1', label: 'Conversational AI', subtitle: 'Core product',  x: 3, y: 3 },
  { id: 'i2', label: 'RAG Pipeline',      subtitle: 'Infra layer',   x: 3, y: 2 },
  { id: 'i3', label: 'Vision Module',     subtitle: 'Expanding',     x: 2, y: 3 },
  { id: 'i4', label: 'Voice Interface',   subtitle: 'Early stage',   x: 2, y: 2 },
  { id: 'i5', label: 'Code Assistant',    subtitle: 'High value',    x: 3, y: 1 },
  { id: 'i6', label: 'Analytics Dash',    subtitle: 'Mature',        x: 1, y: 2 },
  { id: 'i7', label: 'Legacy Connectors', subtitle: 'Sunset',        x: 1, y: 1 },
  { id: 'i8', label: 'Agent SDK',         subtitle: 'Rapid growth',  x: 2, y: 3 },
];

const SWOT_ITEMS = [
  { id: 'sw1', quadrant: 'strengths',     text: 'State-of-the-art model quality' },
  { id: 'sw2', quadrant: 'strengths',     text: 'Broad API surface and SDKs' },
  { id: 'sw3', quadrant: 'strengths',     text: 'Strong enterprise SLAs' },
  { id: 'sw4', quadrant: 'weaknesses',    text: 'High inference cost at scale' },
  { id: 'sw5', quadrant: 'weaknesses',    text: 'Latency variance at peak load' },
  { id: 'sw6', quadrant: 'opportunities', text: 'Agentic workflow adoption wave' },
  { id: 'sw7', quadrant: 'opportunities', text: 'Vertical AI SaaS expansion' },
  { id: 'sw8', quadrant: 'threats',       text: 'Open-source model commoditization' },
  { id: 'sw9', quadrant: 'threats',       text: 'Regulatory compliance overhead' },
];

const BMC_BLOCKS = {
  'value-proposition': { items: [
    { id: 'vp1', text: 'Fastest frontier models at enterprise SLAs', blockId: 'value-proposition' },
    { id: 'vp2', text: 'Agentic workflows with tool use + RAG',      blockId: 'value-proposition' },
    { id: 'vp3', text: 'Constitutional AI — safe by design',         blockId: 'value-proposition' },
  ]},
  'customer-segments': { items: [
    { id: 'cs1', text: 'Enterprise engineering teams',              blockId: 'customer-segments' },
    { id: 'cs2', text: 'B2B SaaS builders',                         blockId: 'customer-segments' },
    { id: 'cs3', text: 'Regulated industries (finance, health)',     blockId: 'customer-segments' },
  ]},
  'key-partners':   { items: [
    { id: 'kp1', text: 'Cloud providers (AWS, GCP, Azure)', blockId: 'key-partners' },
    { id: 'kp2', text: 'Data annotation vendors',           blockId: 'key-partners' },
  ]},
  'revenue-streams': { items: [
    { id: 'rs1', text: 'Pay-per-token API pricing',         blockId: 'revenue-streams' },
    { id: 'rs2', text: 'Enterprise subscription tiers',     blockId: 'revenue-streams' },
    { id: 'rs3', text: 'Professional services + training',  blockId: 'revenue-streams' },
  ]},
  'cost-structure': { items: [
    { id: 'co1', text: 'GPU compute (training + inference)', blockId: 'cost-structure' },
    { id: 'co2', text: 'R&D and safety research teams',      blockId: 'cost-structure' },
    { id: 'co3', text: 'Customer success and support',       blockId: 'cost-structure' },
  ]},
};

const DM_CRITERIA    = [
  { id: 'c1', label: 'Model Quality',    weight: 30 },
  { id: 'c2', label: 'Cost Efficiency',  weight: 25 },
  { id: 'c3', label: 'Latency',          weight: 20 },
  { id: 'c4', label: 'Safety / AI',      weight: 15 },
  { id: 'c5', label: 'Compliance',       weight: 10 },
];
const DM_ALTERNATIVES = [
  { id: 'a1', label: 'Claude 3.5 Sonnet', scores: { c1: 9, c2: 7, c3: 8, c4: 10, c5: 9 } },
  { id: 'a2', label: 'GPT-4o',            scores: { c1: 9, c2: 6, c3: 8, c4:  7, c5: 8 } },
  { id: 'a3', label: 'Gemini 1.5 Pro',    scores: { c1: 8, c2: 7, c3: 7, c4:  7, c5: 7 } },
  { id: 'a4', label: 'Llama 3.1 70B',     scores: { c1: 7, c2: 9, c3: 6, c4:  5, c5: 5 } },
];

export function createStrategySection() {
  const section = document.createElement('section');
  section.id = 'strategy';
  section.className = 'mn-section-dark';

  const stars   = BCG_ITEMS.filter(i => i.marketShare >= 0.5 && i.growthRate >= 10).length;
  const cows    = BCG_ITEMS.filter(i => i.marketShare >= 0.5 && i.growthRate <  10).length;
  const qmarks  = BCG_ITEMS.filter(i => i.marketShare <  0.5 && i.growthRate >= 10).length;
  const dogs    = BCG_ITEMS.filter(i => i.marketShare <  0.5 && i.growthRate <  10).length;

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">36 — Strategy &amp; Consulting</p>
      <div class="mn-watermark">STRATEGY</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Strategic Frameworks</h2>
      <p class="mn-body mn-mb-2xl">BCG portfolio matrix, GE-McKinsey nine-box, SWOT, Business Model Canvas, and AI vendor decision matrix.</p>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
          <span class="mn-label" style="color:var(--mn-accent)">BCG Portfolio Matrix</span>
          <div style="display:flex;gap:var(--space-sm);align-items:center">
            <span class="mn-micro" style="color:var(--mn-text-muted);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--signal-ok) 15%,transparent);color:var(--signal-ok)">★ Stars ${stars}</span>
            <span class="mn-micro" style="color:var(--mn-text-muted);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--signal-info) 15%,transparent);color:var(--signal-info)">◉ Cash Cows ${cows}</span>
            <span class="mn-micro" style="color:var(--mn-text-muted);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--signal-warning) 15%,transparent);color:var(--signal-warning)">? Q-Marks ${qmarks}</span>
            <span class="mn-micro" style="color:var(--mn-text-muted);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--mn-text-muted) 12%,transparent)">✕ Dogs ${dogs}</span>
            <div id="str-bcg-badge" class="mn-micro" style="background:var(--mn-accent);color:var(--mn-accent-text);padding:2px 10px;border-radius:999px;display:none"></div>
          </div>
        </div>
        <canvas id="str-bcg" style="display:block;width:100%;height:340px"></canvas>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.bcgMatrix(canvas, { items, shareThreshold:0.5, growthThreshold:10, onClick });</pre>
        </details>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">GE-McKinsey Nine-Box</span>
          <div id="str-9box-status" class="mn-micro" style="color:var(--mn-text-muted)">Click item to select · arrows or click cell to move</div>
        </div>
        <div id="str-9box"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.nineBoxMatrix(el, { items, xLabel, yLabel, onSelect, onMove });</pre>
        </details>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <div style="display:flex;flex-direction:column;gap:2px">
            <span class="mn-label" style="color:var(--mn-accent)">AI Vendor Decision Matrix</span>
            <span class="mn-micro" style="color:var(--mn-text-muted)">Weighted scoring · click row to compare</span>
          </div>
          <button class="mn-btn mn-btn--ghost" id="str-dm-reset" style="font-size:var(--text-micro)">Reset scores</button>
        </div>
        <div id="str-dm"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.decisionMatrix(el, { criteria, alternatives, scores, editable:true, onSelect });</pre>
        </details>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">Business Model Canvas — Osterwalder</span>
          <button class="mn-btn mn-btn--ghost" id="str-bmc-export" style="font-size:var(--text-micro)">Export JSON</button>
        </div>
        <div id="str-bmc"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.businessModelCanvas(el, { editable:true, blocks, onChange });</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">SWOT Analysis</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="str-swot-export" style="font-size:var(--text-micro)">Export JSON</button>
            <button class="mn-btn mn-btn--ghost" id="str-swot-reset"  style="font-size:var(--text-micro)">Reset</button>
          </div>
        </div>
        <div id="str-swot"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.swotMatrix(el, { items, editable:true, onChange });</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    const M = window.Maranello;
    if (!M) return;

    /* ── BCG Matrix ── */
    if (M.bcgMatrix) {
      const bcgCanvas = section.querySelector('#str-bcg');
      if (bcgCanvas) {
        if (bcgCanvas.clientWidth > 0) { bcgCanvas.width = bcgCanvas.clientWidth; bcgCanvas.height = bcgCanvas.clientHeight || 340; }
        const bcgBadge = section.querySelector('#str-bcg-badge');
        M.bcgMatrix(bcgCanvas, {
          items: BCG_ITEMS, shareThreshold: 0.5, growthThreshold: 10, animate: true,
          onHover: (item) => { if (!item) return; bcgBadge.textContent = item.label; bcgBadge.style.display = ''; },
          onClick: (item) => M.toast({ type: 'info', title: item.label, message: `Share: ${(item.marketShare*100).toFixed(0)}% | Growth: ${item.growthRate}%` }),
        });
      }
    }

    /* ── Nine-Box Matrix ── */
    if (M.nineBoxMatrix) {
      const statusEl = section.querySelector('#str-9box-status');
      M.nineBoxMatrix(section.querySelector('#str-9box'), {
        items: NINE_BOX_ITEMS, xLabel: 'Competitive Strength', yLabel: 'Market Attractiveness',
        xAxisLabels: ['Low', 'Medium', 'High'], yAxisLabels: ['Low', 'Medium', 'High'],
        onSelect: (item) => { statusEl.textContent = `Selected: ${item.label} — use arrows or click cell to move`; },
        onMove: (item, x, y) => {
          const tierMap = { '3,3':'invest','3,2':'invest','2,3':'invest','2,2':'selective','1,3':'selective','3,1':'selective','1,2':'divest','2,1':'divest','1,1':'divest' };
          const tier = { invest:'Invest', selective:'Selective', divest:'Divest' }[tierMap[`${x},${y}`]] || 'Selective';
          statusEl.textContent = `Moved: ${item.label} → zone ${tier}`;
          M.toast({ type: 'success', title: 'Item moved', message: `${item.label} → ${tier}` });
        },
      });
    }

    /* ── Decision Matrix ── */
    if (M.decisionMatrix) {
      const dmCtrl = M.decisionMatrix(section.querySelector('#str-dm'), {
        criteria: DM_CRITERIA, alternatives: DM_ALTERNATIVES,
        editable: true,
      });
      section.querySelector('#str-dm-reset').addEventListener('click', () => {
        dmCtrl.update(DM_ALTERNATIVES);
        M.toast({ type: 'info', title: 'Scores reset', message: 'Restored default vendor scores' });
      });
    }

    /* ── Business Model Canvas ── */
    if (M.businessModelCanvas) {
      const bmcCtrl = M.businessModelCanvas(section.querySelector('#str-bmc'), {
        editable: true, blocks: BMC_BLOCKS,
        onChange: (blocks) => M.toast({ type: 'info', title: 'Canvas updated', message: `${blocks.reduce((n,b) => n+b.items.length, 0)} items across 9 blocks` }),
      });
      section.querySelector('#str-bmc-export').addEventListener('click', () => {
        console.log('BMC:', JSON.stringify(bmcCtrl.getBlocks(), null, 2));
        M.toast({ type: 'info', title: 'BMC exported', message: 'Check browser console' });
      });
    }

    /* ── SWOT Matrix ── */
    if (M.swotMatrix) {
      const swotCtrl = M.swotMatrix(section.querySelector('#str-swot'), { items: SWOT_ITEMS, editable: true, onChange: () => {} });
      section.querySelector('#str-swot-export').addEventListener('click', () => {
        console.log('SWOT:', JSON.stringify(swotCtrl.getItems(), null, 2));
        M.toast({ type: 'info', title: 'SWOT exported', message: `${swotCtrl.getItems().length} items — check console` });
      });
      section.querySelector('#str-swot-reset').addEventListener('click', () => {
        swotCtrl.update(SWOT_ITEMS);
        M.toast({ type: 'info', title: 'SWOT reset', message: 'Restored default items' });
      });
    }
  });

  return section;
}
