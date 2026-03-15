const MINI_TIMELINE = [
  { name: 'Pipeline Alpha', start: 1, end: 8, status: 'active', dates: '08 Jan — 28 Mar' },
  { name: 'Pipeline Beta', start: 4, end: 10, status: 'planned', dates: '02 Feb — 10 May' },
  { name: 'Pipeline Gamma', start: 2, end: 5, status: 'at-risk', dates: '20 Jan — 18 Feb' },
  { name: 'Pipeline Delta', start: 6, end: 11, status: 'completed', dates: '14 Mar — 31 May' },
  { name: 'Pipeline Epsilon', start: 9, end: 13, status: 'planned', dates: '01 May — 22 Jun' },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function createGanttSection() {
  const section = document.createElement('section');
  section.id = 'gantt';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <style>
      #gantt .mn-mini-gantt{display:grid;gap:var(--space-sm)}
      #gantt .mn-mini-gantt__head{display:grid;grid-template-columns:180px repeat(6,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm);color:var(--grigio-medio);font-size:var(--text-micro);text-transform:uppercase;letter-spacing:.08em}
      #gantt .mn-mini-gantt__row{display:grid;grid-template-columns:180px 1fr;gap:var(--space-md);align-items:center}
      #gantt .mn-mini-gantt__track{position:relative;height:28px;border-radius:999px;background:linear-gradient(90deg,rgba(0,0,0,.04),rgba(0,0,0,.08));overflow:hidden}
      #gantt .mn-mini-gantt__track::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(16.66% - 1px),rgba(255,255,255,.15) calc(16.66% - 1px) 16.66%)}
      #gantt .mn-mini-gantt__bar{position:absolute;top:4px;bottom:4px;border-radius:999px}
      #gantt .mn-mini-gantt__bar--active{background:#00A651}#gantt .mn-mini-gantt__bar--planned{background:#FFC72C}#gantt .mn-mini-gantt__bar--at-risk{background:#DC0000}#gantt .mn-mini-gantt__bar--completed{background:#4EA8DE}
    </style>
    <div class="mn-container"><p class="mn-section-number">09 — Project Management</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Gantt Timeline</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Interactive pipeline timelines plus a compact inline planner for weekly release checks.</p><details class="mn-code-snippet"><summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary><pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;mn-gantt tasks='[
  {"id":"t1","title":"Deploy","start":"2026-01-01","end":"2026-01-31","progress":0.75},
  {"id":"t2","title":"Eval","start":"2026-02-01","end":"2026-02-28","dependencies":["t1"]}
]'&gt;&lt;/mn-gantt&gt;</code></pre></details><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">2026 Runtime Pipeline Schedule</h3><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)"><mn-gantt tasks='${runtimeTasks()}'></mn-gantt></div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Mini Gantt Timeline</h3><div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)">${miniGantt()}</div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Model Rollout Timeline</h3><div class="mn-card-dark" style="padding:var(--space-lg)"><mn-gantt tasks='${modelTasks()}'></mn-gantt></div><div class="mn-grid-3" style="margin-top:var(--space-2xl)">${timelineStat('Active Pipelines', '8', 'across 5 regions')}${timelineStat('Dependencies', '6', 'cross-lane links')}${timelineStat('Avg Duration', '4.2', 'weeks per phase')}</div></div>`;
  return section;
}
function miniGantt() { return `<div class="mn-mini-gantt"><div class="mn-mini-gantt__head"><span>Pipeline</span>${MONTHS.map((month) => `<span>${month}</span>`).join('')}</div>${MINI_TIMELINE.map((item) => { const left = ((item.start - 1) / 12) * 100; const width = ((item.end - item.start + 1) / 12) * 100; return `<div class="mn-mini-gantt__row"><div><strong>${item.name}</strong><div class="mn-micro" style="color:var(--grigio-medio)">${item.dates}</div></div><div class="mn-mini-gantt__track"><span class="mn-mini-gantt__bar mn-mini-gantt__bar--${item.status}" style="left:${left}%;width:${width}%" title="${item.dates}"></span></div></div>`; }).join('')}</div>`; }
function esc(str) { return str.replace(/'/g, '&#39;'); }
function runtimeTasks() { return esc(JSON.stringify([{ id: 't1', title: 'Prompt Intake', start: '2026-01-15', end: '2026-02-28', progress: 100, color: '#FFC72C' }, { id: 't2', title: 'Model Routing', start: '2026-03-01', end: '2026-05-15', progress: 75, color: '#4EA8DE', dependencies: ['t1'] }, { id: 't3', title: 'Inference Window', start: '2026-03-15', end: '2026-06-30', progress: 60, color: '#00A651', dependencies: ['t1'] }, { id: 't4', title: 'Eval & Replay', start: '2026-04-01', end: '2026-07-31', progress: 40, color: '#D4622B', dependencies: ['t2'] }, { id: 't5', title: 'Guardrail Audit', start: '2026-05-01', end: '2026-07-15', progress: 25, color: '#8B5CF6', dependencies: ['t2', 't3'] }, { id: 't6', title: 'Canary Rollout', start: '2026-06-01', end: '2026-08-31', progress: 10, color: '#4EA8DE', dependencies: ['t2'] }, { id: 't7', title: 'Release Review', start: '2026-08-01', end: '2026-08-31', progress: 0, color: '#DC0000', dependencies: ['t4', 't5', 't6'] }, { id: 't8', title: 'Production Scale', start: '2026-09-01', end: '2026-11-30', progress: 0, color: '#FFC72C', dependencies: ['t7'] }])); }
function modelTasks() { return esc(JSON.stringify([{ id: 'r1', title: 'Benchmark Review', start: '2026-02-01', end: '2026-03-31', progress: 90, color: '#FFC72C' }, { id: 'r2', title: 'Routing Policy Design', start: '2026-03-15', end: '2026-04-30', progress: 70, color: '#4EA8DE', dependencies: ['r1'] }, { id: 'r3', title: 'Safety Approval', start: '2026-04-15', end: '2026-05-31', progress: 50, color: '#DC0000', dependencies: ['r2'] }, { id: 'r4', title: 'Canary Deployment', start: '2026-06-01', end: '2026-09-30', progress: 15, color: '#00A651', dependencies: ['r3'] }, { id: 'r5', title: 'Global Rollout', start: '2026-10-01', end: '2026-11-30', progress: 0, color: '#8B5CF6', dependencies: ['r4'] }])); }
function timelineStat(label, value, sub) { return `<div class="mn-card-dark" style="padding:var(--space-xl);text-align:center"><div class="mn-label" style="color:var(--mn-text-muted);margin-bottom:var(--space-sm)">${label}</div><div style="font-family:var(--font-display);font-size:var(--text-h1);font-weight:700;color:var(--mn-accent)">${value}</div><div class="mn-micro" style="margin-top:var(--space-xs)">${sub}</div></div>`; }
