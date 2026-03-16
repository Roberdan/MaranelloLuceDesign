const M = () => window.Maranello || {};
const STATUS_COLORS = { Active: 'var(--mn-verde)', Paused: 'var(--mn-giallo)', Completed: 'var(--mn-accent)' };
const DEPLOYMENTS = [
  { id: 'pipe-east', name: 'Pipeline Alpha', status: 'Active', region: 'us-east-1', lead: 'Agent Opus', start: '2026-01-15', runs: 47000, completion: '78%' },
  { id: 'pipe-west', name: 'Pipeline Beta', status: 'Paused', region: 'eu-west-1', lead: 'Agent Sonnet', start: '2026-02-01', runs: 32000, completion: '42%' },
  { id: 'pipe-apac', name: 'Pipeline Gamma', status: 'Active', region: 'ap-southeast-1', lead: 'Agent Haiku', start: '2026-03-10', runs: 28000, completion: '65%' },
];
const ACTIVITIES = [
  { id: 'ACT-001', activity: 'Prompt intake', type: 'Routing', progress: '100%', owner: 'Agent Opus' },
  { id: 'ACT-002', activity: 'Model selection', type: 'Routing', progress: '78%', owner: 'GPT Router' },
  { id: 'ACT-003', activity: 'Inference window', type: 'Runtime', progress: '45%', owner: 'Agent Sonnet' },
  { id: 'ACT-004', activity: 'Eval replay pack', type: 'Validation', progress: '60%', owner: 'Eval Judge' },
  { id: 'ACT-005', activity: 'Release review', type: 'Approval', progress: '0%', owner: 'Agent Haiku' },
];

export function createDetailPanelSection() {
  const section = document.createElement('section');
  section.id = 'detail-panel';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">16 — Detail &amp; Drill-Down</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Detail Panel System</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">Interactive slide-over panels with drill-down navigation, inline field editors, and JS-driven deployment tables.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>Maranello.openDetailPanel({
  title: 'Pipeline Alpha',
  fields: [
    { label: 'Region', value: 'us-east-1' },
    { label: 'Status', value: 'Running' }
  ]
});</code></pre>
      </details>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Interactive Detail Panel</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Click a deployment card to drill down into its detail panel.</p>
      <div id="dp-card-grid" class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${DEPLOYMENTS.map(deploymentCard).join('')}</div>
      <div id="dp-panel-host"></div>
      <div style="margin-bottom:var(--space-2xl)">
        <p class="mn-micro" style="color:var(--mn-text-muted);margin-bottom:var(--space-md)">Or open programmatically via <code>openDetailPanel</code>:</p>
        <button class="mn-btn mn-btn--ghost" id="dp-open-btn">openDetailPanel('pipe-east')</button>
      </div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Inline Editors</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Field-level editors rendered via <code>Maranello.editors</code> factories.</p>
      <div id="dp-editors-host" class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"></div>
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Data Table (JS-driven)</h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">Sortable pipeline activities with row-click interaction.</p>
      <div id="dp-table-host" style="margin-bottom:var(--space-2xl)"></div>
    </div>
  `;
  requestAnimationFrame(() => initDetailPanel(section));
  return section;
}

function deploymentCard(p) {
  const dot = STATUS_COLORS[p.status] || 'var(--mn-grigio-2)';
  return `<div class="mn-card-dark mn-hover-lift" style="padding:var(--space-xl);cursor:pointer" data-drilldown="${p.id}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)"><h4 class="mn-label" style="color:var(--mn-accent)">${p.name}</h4><span class="mn-badge" style="background:${dot};color:var(--mn-nero);font-size:0.7rem;padding:2px 8px;border-radius:4px">${p.status}</span></div><p class="mn-micro" style="margin-bottom:var(--space-sm)">${p.region} · ${p.runs.toLocaleString('en-US')} runs</p><p class="mn-micro" style="color:var(--mn-grigio-2)">Lead: ${p.lead}</p></div>`;
}

function initDetailPanel(section) { initDrillDown(section); initEditors(section); initDataTable(section); initOpenBtn(section); }
function initDrillDown(section) {
  const host = section.querySelector('#dp-panel-host'); const api = M(); if (!host || typeof api.onDrillDown !== 'function' || typeof api.createDetailPanel !== 'function') return;
  let activePanel = null;
  api.onDrillDown('#dp-card-grid [data-drilldown]', (_el, ctx) => {
    const dep = DEPLOYMENTS.find((item) => item.id === ctx.drilldown); if (!dep) return;
    if (activePanel) activePanel.destroy(); host.innerHTML = '';
    activePanel = api.createDetailPanel(host, { title: dep.name, tabs: ['Overview', 'Runtime', 'Quality'], schema: buildSchema(), data: buildData(dep), editable: true, onClose() { activePanel.close(); }, onSave(changes) { console.log('[detail-panel] saved:', changes); activePanel.showToast('Changes saved', 'success'); } });
    activePanel.open();
  });
}
function buildSchema() {
  return [
    { tab: 'Overview', section: 'Pipeline Info', fields: [{ key: 'name', label: 'Pipeline Name', type: 'text' }, { key: 'status', label: 'Status', type: 'status', options: ['Active', 'Paused', 'Completed'], statusColors: STATUS_COLORS }, { key: 'region', label: 'Region', type: 'text' }, { key: 'start', label: 'Start Date', type: 'date' }, { key: 'lead', label: 'Pipeline Lead', type: 'text' }, { key: 'runs', label: 'Total Runs', type: 'number' }] },
    { tab: 'Overview', section: 'Progress', fields: [{ key: 'completion', label: 'Completion Rate', type: 'text', editable: false }] },
    { tab: 'Runtime', section: 'Deployment Runtime', fields: [{ key: 'model', label: 'Primary Model', type: 'text' }, { key: 'rpm', label: 'Runs per Minute', type: 'number' }, { key: 'latency', label: 'Avg Latency', type: 'text' }, { key: 'totalCompleted', label: 'Completed Tasks', type: 'number', editable: false }] },
    { tab: 'Quality', section: 'Outcome Metrics', fields: [{ key: 'accuracy', label: 'Accuracy Score', type: 'text', editable: false }, { key: 'satisfaction', label: 'User Satisfaction', type: 'text', editable: false }, { key: 'score', label: 'Readiness Score', type: 'score', min: 0, max: 10, step: 0.1 }] },
  ];
}
function buildData(dep) {
  return { name: dep.name, status: dep.status, region: dep.region, start: dep.start, lead: dep.lead, runs: dep.runs, completion: dep.completion, model: 'Claude Sonnet', rpm: 320, latency: '172 ms', totalCompleted: 14560, accuracy: '96%', satisfaction: '94%', score: 9.6 };
}
function initEditors(section) {
  const host = section.querySelector('#dp-editors-host'); if (!host) return; const eds = M().editors; if (!eds) return;
  const fields = [{ key: 'name', label: 'Pipeline Name', type: 'text', val: 'Pipeline Alpha' }, { key: 'status', label: 'Status', type: 'select', val: 'Active', options: ['Active', 'Paused', 'Completed'] }, { key: 'start', label: 'Start Date', type: 'date', val: '2026-01-15' }, { key: 'lead', label: 'Lead', type: 'text', val: 'Agent Opus' }];
  const log = document.createElement('p'); log.className = 'mn-micro'; log.style.cssText = 'color:var(--mn-giallo);margin-top:var(--space-md);min-height:1.5em';
  fields.forEach((f) => {
    const row = document.createElement('div'); row.className = 'mn-detail-panel__field'; row.style.marginBottom = 'var(--space-md)';
    const label = document.createElement('span'); label.className = 'mn-detail-panel__field-label'; label.textContent = f.label;
    if (f.type === 'select') {
      const dd = document.createElement('div'); dd.className = 'mn-dropdown';
      dd.innerHTML = `<button class="mn-dropdown__trigger" style="width:100%;text-align:left;padding:8px 12px;background:var(--nero-carbon,#111);border:1.5px solid var(--grigio-scuro,#333);border-radius:4px;color:var(--grigio-alluminio,#ccc);font-size:0.85rem;cursor:pointer">${f.val} ▾</button><div class="mn-dropdown__menu" style="min-width:100%">${f.options.map((o) => `<button class="mn-dropdown__item${o === f.val ? ' mn-dropdown__item--active' : ''}">${o}</button>`).join('')}</div>`;
      row.append(label, dd); host.appendChild(row); const M2 = window.Maranello; if (M2?.initDropdown) requestAnimationFrame(() => M2.initDropdown(dd)); dd.addEventListener('click', (e) => { const item = e.target.closest('.mn-dropdown__item'); if (item) log.textContent = `✎ ${f.label}: "${item.textContent}"`; });
    } else {
      const editorFn = eds[f.type] || eds.text; const input = editorFn(f.val, f, (val) => { log.textContent = `✎ ${f.label}: "${val}"`; }); row.append(label, input); host.appendChild(row);
    }
  });
  host.appendChild(log);
}
function initDataTable(section) {
  const host = section.querySelector('#dp-table-host'); const api = M(); if (!host || typeof api.dataTable !== 'function') return;
  api.dataTable(host, { columns: [{ key: 'id', label: 'ID', width: '80px', sortable: true }, { key: 'activity', label: 'Activity', sortable: true }, { key: 'type', label: 'Type', width: '140px', sortable: true }, { key: 'progress', label: 'Progress', width: '100px', sortable: true }, { key: 'owner', label: 'Owner', width: '120px', sortable: true }], data: ACTIVITIES, onRowClick(row) { console.log('[data-table] row clicked:', row); } });
}
function initOpenBtn(section) {
  const btn = section.querySelector('#dp-open-btn'); const api = M(); if (!btn || typeof api.openDetailPanel !== 'function') return;
  btn.addEventListener('click', () => api.openDetailPanel('pipe-east'));
}
