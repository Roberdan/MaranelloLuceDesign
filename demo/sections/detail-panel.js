/**
 * Detail Panel section — drill-down panels, inline editors, data tables
 */

const M = () => window.Maranello;

const STATUS_COLORS = {
  Active: 'var(--mn-verde)',
  Paused: 'var(--mn-giallo)',
  Completed: 'var(--mn-accent)',
};

const PROGRAMS = [
  { id: 'prog-milano', name: 'Milano Movement Therapy', status: 'Active',
    city: 'Milano', lead: 'Dr. Maria Rossi', start: '2026-01-15', enrolled: 47, completion: '78%' },
  { id: 'prog-roma', name: 'Roma Speech Program', status: 'Paused',
    city: 'Roma', lead: 'Dr. Luca Bianchi', start: '2026-02-01', enrolled: 32, completion: '42%' },
  { id: 'prog-torino', name: 'Torino Cognitive Lab', status: 'Active',
    city: 'Torino', lead: 'Dr. Anna Verdi', start: '2026-03-10', enrolled: 28, completion: '65%' },
];

const ACTIVITIES = [
  { id: 'ACT-001', activity: 'Initial Assessment', type: 'Assessment', progress: '100%', owner: 'Dr. Rossi' },
  { id: 'ACT-002', activity: 'Physical Therapy Block A', type: 'Physical Therapy', progress: '78%', owner: 'Marco Neri' },
  { id: 'ACT-003', activity: 'Speech Development', type: 'Speech Therapy', progress: '45%', owner: 'Dr. Bianchi' },
  { id: 'ACT-004', activity: 'Family Training Workshop', type: 'Family Training', progress: '60%', owner: 'Sara Conti' },
  { id: 'ACT-005', activity: 'Mid-term Evaluation', type: 'Evaluation', progress: '0%', owner: 'Dr. Verdi' },
];

/* ── Section entry point ─────────────────────────────────────────── */

export function createDetailPanelSection() {
  const section = document.createElement('section');
  section.id = 'detail-panel';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">16 — Detail &amp; Drill-Down</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">
        Detail Panel System
      </h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Interactive slide-over panels with drill-down navigation,
        inline field editors, and JS-driven data tables.
      </p>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">
        Interactive Detail Panel
      </h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">
        Click a program card to drill down into its detail panel.
      </p>
      <div id="dp-card-grid" class="mn-grid-3" style="margin-bottom:var(--space-2xl)">
        ${PROGRAMS.map(programCard).join('')}
      </div>
      <div id="dp-panel-host"></div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">
        Inline Editors
      </h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">
        Field-level editors rendered via <code>Maranello.editors</code> factories.
      </p>
      <div id="dp-editors-host" class="mn-card-dark"
           style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"></div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">
        Data Table (JS-driven)
      </h3>
      <p class="mn-micro" style="margin-bottom:var(--space-lg)">
        Sortable therapy activities with row-click interaction.
      </p>
      <div id="dp-table-host" style="margin-bottom:var(--space-2xl)"></div>
    </div>
  `;

  requestAnimationFrame(() => initDetailPanel(section));
  return section;
}

/* ── Card template ───────────────────────────────────────────────── */

function programCard(p) {
  const dot = STATUS_COLORS[p.status] || 'var(--mn-grigio-2)';
  return `
    <div class="mn-card-dark mn-hover-lift"
         style="padding:var(--space-xl);cursor:pointer"
         data-drilldown="${p.id}" data-name="${p.name}" data-status="${p.status}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
        <h4 class="mn-label" style="color:var(--mn-accent)">${p.name}</h4>
        <span class="mn-badge" style="background:${dot};color:var(--mn-nero);
              font-size:0.7rem;padding:2px 8px;border-radius:4px">${p.status}</span>
      </div>
      <p class="mn-micro" style="margin-bottom:var(--space-sm)">
        ${p.city} · ${p.enrolled} enrolled
      </p>
      <p class="mn-micro" style="color:var(--mn-grigio-2)">Lead: ${p.lead}</p>
    </div>`;
}

/* ── Init orchestrator ───────────────────────────────────────────── */

function initDetailPanel(section) {
  initDrillDown(section);
  initEditors(section);
  initDataTable(section);
}

/* ── Demo 1: Drill-down detail panel ─────────────────────────────── */

function initDrillDown(section) {
  const host = section.querySelector('#dp-panel-host');
  if (!host) return;

  let activePanel = null;

  M().onDrillDown('#dp-card-grid [data-drilldown]', (_el, ctx) => {
    const prog = PROGRAMS.find(p => p.id === ctx.drilldown);
    if (!prog) return;

    if (activePanel) { activePanel.destroy(); }
    host.innerHTML = '';

    activePanel = M().createDetailPanel(host, {
      title: prog.name,
      tabs: ['Overview', 'Activities', 'Quality'],
      schema: buildSchema(),
      data: buildData(prog),
      editable: true,
      onClose() { activePanel.close(); },
      onSave(changes) {
        // eslint-disable-next-line no-console
        console.log('[detail-panel] saved:', changes);
        activePanel.showToast('Changes saved', 'success');
      },
    });
    activePanel.open();
  });
}

function buildSchema() {
  return [
    { tab: 'Overview', section: 'Program Info', fields: [
      { key: 'name', label: 'Program Name', type: 'text' },
      { key: 'status', label: 'Status', type: 'status',
        options: ['Active', 'Paused', 'Completed'], statusColors: STATUS_COLORS },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'start', label: 'Start Date', type: 'date' },
      { key: 'lead', label: 'Program Lead', type: 'text' },
      { key: 'enrolled', label: 'Children Enrolled', type: 'number' },
    ] },
    { tab: 'Overview', section: 'Progress', fields: [
      { key: 'completion', label: 'Completion Rate', type: 'text', editable: false },
    ] },
    { tab: 'Activities', section: 'Therapy Schedule', fields: [
      { key: 'weekly', label: 'Weekly Sessions', type: 'number' },
      { key: 'duration', label: 'Session Duration', type: 'text' },
      { key: 'totalCompleted', label: 'Total Completed', type: 'number', editable: false },
    ] },
    { tab: 'Quality', section: 'Outcome Metrics', fields: [
      { key: 'mobility', label: 'Mobility Improvement', type: 'text', editable: false },
      { key: 'satisfaction', label: 'Family Satisfaction', type: 'text', editable: false },
      { key: 'score', label: 'Coordination Score', type: 'score', min: 0, max: 10, step: 0.1 },
    ] },
  ];
}

function buildData(prog) {
  return {
    name: prog.name, status: prog.status, city: prog.city,
    start: prog.start, lead: prog.lead, enrolled: prog.enrolled,
    completion: prog.completion, weekly: 3, duration: '45 min',
    totalCompleted: 312, mobility: '62%', satisfaction: '94%', score: 7.8,
  };
}

/* ── Demo 2: Inline editors ──────────────────────────────────────── */

function initEditors(section) {
  const host = section.querySelector('#dp-editors-host');
  if (!host) return;

  const eds = M().editors;
  if (!eds) return;

  const fields = [
    { key: 'name', label: 'Program Name', type: 'text', val: 'Milano Movement Therapy' },
    { key: 'status', label: 'Status', type: 'select', val: 'Active',
      options: ['Active', 'Paused', 'Completed'] },
    { key: 'start', label: 'Start Date', type: 'date', val: '2026-01-15' },
    { key: 'lead', label: 'Lead', type: 'text', val: 'Dr. Maria Rossi' },
  ];

  const log = document.createElement('p');
  log.className = 'mn-micro';
  log.style.cssText = 'color:var(--mn-giallo);margin-top:var(--space-md);min-height:1.5em';

  fields.forEach(f => {
    const row = document.createElement('div');
    row.className = 'mn-detail-panel__field';
    row.style.marginBottom = 'var(--space-md)';

    const label = document.createElement('span');
    label.className = 'mn-detail-panel__field-label';
    label.textContent = f.label;

    if (f.type === 'select') {
      // Use themed mn-dropdown instead of native select
      const dd = document.createElement('div');
      dd.className = 'mn-dropdown';
      dd.innerHTML = `<button class="mn-dropdown__trigger" style="width:100%;text-align:left;padding:8px 12px;background:var(--nero-carbon,#111);border:1.5px solid var(--grigio-scuro,#333);border-radius:4px;color:var(--grigio-alluminio,#ccc);font-size:0.85rem;cursor:pointer">${f.val} ▾</button>
        <div class="mn-dropdown__menu" style="min-width:100%">
          ${f.options.map(o => `<button class="mn-dropdown__item${o === f.val ? ' mn-dropdown__item--active' : ''}">${o}</button>`).join('')}
        </div>`;
      row.append(label, dd);
      host.appendChild(row);
      const M2 = window.Maranello;
      if (M2?.initDropdown) {
        requestAnimationFrame(() => M2.initDropdown(dd));
      }
      dd.addEventListener('click', (e) => {
        const item = e.target.closest('.mn-dropdown__item');
        if (item) { log.textContent = `✎ ${f.label}: "${item.textContent}"`; }
      });
    } else {
      const editorFn = eds[f.type] || eds.text;
      const input = editorFn(f.val, f, (val) => {
        log.textContent = `✎ ${f.label}: "${val}"`;
      });
      row.append(label, input);
      host.appendChild(row);
    }
  });

  host.appendChild(log);
}

/* ── Demo 3: JS-driven data table ────────────────────────────────── */

function initDataTable(section) {
  const host = section.querySelector('#dp-table-host');
  if (!host) return;

  M().dataTable(host, {
    columns: [
      { key: 'id', label: 'ID', width: '80px', sortable: true },
      { key: 'activity', label: 'Activity', sortable: true },
      { key: 'type', label: 'Type', width: '140px', sortable: true },
      { key: 'progress', label: 'Progress', width: '100px', sortable: true },
      { key: 'owner', label: 'Owner', width: '120px', sortable: true },
    ],
    data: ACTIVITIES,
    onRowClick(row) {
      // eslint-disable-next-line no-console
      console.log('[data-table] row clicked:', row);
    },
  });
}
