/**
 * Gantt section — therapy program timeline with dependencies
 */
export function createGanttSection() {
  const section = document.createElement('section');
  section.id = 'gantt';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">09 — Project Management</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Gantt Timeline</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Interactive Gantt chart for therapy program scheduling. Drag to pan,
        scroll to zoom, click tasks for details.
      </p>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">
        2026 Therapy Program Schedule
      </h3>
      <div class="mn-card-dark" style="padding:var(--space-lg);margin-bottom:var(--space-2xl)">
        <mn-gantt tasks='${therapyTasks()}'></mn-gantt>
      </div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">
        Research Initiative Timeline
      </h3>
      <div class="mn-card-dark" style="padding:var(--space-lg)">
        <mn-gantt tasks='${researchTasks()}'></mn-gantt>
      </div>

      <div class="mn-grid-3" style="margin-top:var(--space-2xl)">
        ${timelineStat('Active Programs', '8', 'across 5 cities')}
        ${timelineStat('Dependencies', '6', 'cross-program links')}
        ${timelineStat('Avg Duration', '4.2', 'months per phase')}
      </div>
    </div>
  `;
  return section;
}

function esc(str) { return str.replace(/'/g, '&#39;'); }

function therapyTasks() {
  const b = '2026-';
  const tasks = [
    { id: 't1', title: 'Initial Assessment', start: b+'01-15', end: b+'02-28', progress: 100, color: '#FFC72C' },
    { id: 't2', title: 'Physical Therapy Phase 1', start: b+'03-01', end: b+'05-15', progress: 75, color: '#4EA8DE', dependencies: ['t1'] },
    { id: 't3', title: 'Cognitive Exercises', start: b+'03-15', end: b+'06-30', progress: 60, color: '#00A651', dependencies: ['t1'] },
    { id: 't4', title: 'Speech & Language', start: b+'04-01', end: b+'07-31', progress: 40, color: '#D4622B', dependencies: ['t2'] },
    { id: 't5', title: 'Family Training', start: b+'05-01', end: b+'07-15', progress: 25, color: '#8B5CF6', dependencies: ['t2','t3'] },
    { id: 't6', title: 'Physical Therapy Phase 2', start: b+'06-01', end: b+'08-31', progress: 10, color: '#4EA8DE', dependencies: ['t2'] },
    { id: 't7', title: 'Progress Evaluation', start: b+'08-01', end: b+'08-31', progress: 0, color: '#DC0000', dependencies: ['t4','t5','t6'] },
    { id: 't8', title: 'Maintenance Program', start: b+'09-01', end: b+'11-30', progress: 0, color: '#FFC72C', dependencies: ['t7'] },
  ];
  return esc(JSON.stringify(tasks));
}

function researchTasks() {
  const b = '2026-';
  const tasks = [
    { id: 'r1', title: 'Literature Review', start: b+'02-01', end: b+'03-31', progress: 90, color: '#FFC72C' },
    { id: 'r2', title: 'Protocol Design', start: b+'03-15', end: b+'04-30', progress: 70, color: '#4EA8DE', dependencies: ['r1'] },
    { id: 'r3', title: 'Ethics Approval', start: b+'04-15', end: b+'05-31', progress: 50, color: '#DC0000', dependencies: ['r2'] },
    { id: 'r4', title: 'Data Collection', start: b+'06-01', end: b+'09-30', progress: 15, color: '#00A651', dependencies: ['r3'] },
    { id: 'r5', title: 'Analysis & Report', start: b+'10-01', end: b+'11-30', progress: 0, color: '#8B5CF6', dependencies: ['r4'] },
  ];
  return esc(JSON.stringify(tasks));
}

function timelineStat(label, value, sub) {
  return `<div class="mn-card-dark" style="padding:var(--space-xl);text-align:center">
    <div class="mn-label" style="color:var(--grigio-chiaro);margin-bottom:var(--space-sm)">${label}</div>
    <div style="font-family:var(--font-display);font-size:var(--text-h1);font-weight:700;color:var(--mn-accent)">${value}</div>
    <div class="mn-micro" style="margin-top:var(--space-xs)">${sub}</div>
  </div>`;
}
