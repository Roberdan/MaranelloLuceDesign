/**
 * Heatmap section — Capacity Grid + Impact Heatmap
 * Pure CSS-class rendering, no JS chart API needed.
 */

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const VOLUNTEERS = [
  { name: 'Maria Rossi', role: 'Therapist', fte: [0.8, 1.0, 1.2, 1.0, 0.6, 0.4] },
  { name: 'Luca Bianchi', role: 'Coordinator', fte: [0.5, 0.7, 0.8, 0.9, 1.0, 1.1] },
  { name: 'Giulia Conti', role: 'Researcher', fte: [0.3, 0.4, 0.6, 0.8, 0.9, 0.7] },
  { name: 'Marco Verdi', role: 'Therapist', fte: [1.0, 0.9, 0.8, 0.7, 0.5, 0] },
  { name: 'Sara Moretti', role: 'Volunteer', fte: [0, 0.2, 0.4, 0.6, 0.8, 1.0] },
  { name: 'Andrea Ricci', role: 'Data Analyst', fte: [0.6, 0.6, 0.7, 0.7, 0.8, 0.8] },
  { name: 'Elena Russo', role: 'Therapist', fte: [0.9, 1.0, 1.1, 1.2, 0.8, 0.5] },
  { name: 'Paolo Gallo', role: 'Fundraiser', fte: [0.4, 0.3, 0.5, 0.4, 0.6, 0.7] },
];

const IMPACT = {
  summary: { idle_talents: 2, over_allocated: 3, staffing_gaps: 1 },
  talent_impacts: [
    { name: 'Maria Rossi', role: 'Therapist', fte_before: 0.8, fte_after: 1.2, delta: 0.4, status: 'over' },
    { name: 'Luca Bianchi', role: 'Coordinator', fte_before: 0.7, fte_after: 0.9, delta: 0.2, status: '' },
    { name: 'Marco Verdi', role: 'Therapist', fte_before: 0.6, fte_after: 0.2, delta: -0.4, status: 'idle' },
    { name: 'Sara Moretti', role: 'Volunteer', fte_before: 0, fte_after: 0.8, delta: 0.8, status: '' },
    { name: 'Elena Russo', role: 'Therapist', fte_before: 1.0, fte_after: 1.3, delta: 0.3, status: 'over' },
  ],
  staffing_gaps: [
    { role: 'Speech Therapist', title: 'Milano Expansion', available_in_studio: ['Roma Center', 'Torino Hub'] },
  ],
};

function fteLevel(v) {
  if (v === 0) return 'empty';
  if (v < 0.5) return 'low';
  if (v <= 0.8) return 'mid';
  if (v <= 1.0) return 'high';
  return 'over';
}

function barClass(v) {
  if (v <= 0.5) return 'ok';
  if (v <= 0.8) return 'ok';
  if (v <= 1.0) return 'warn';
  return 'danger';
}

function buildCapacityGrid() {
  const cols = MONTHS.length + 1;
  const corner = '<div class="mn-cap-grid__corner">Volunteer</div>';
  const headers = MONTHS.map(m => `<div class="mn-cap-grid__month">${m} 2026</div>`).join('');

  const rows = VOLUNTEERS.map(v => {
    const label = `<div class="mn-cap-grid__label">
      <span class="mn-cap-grid__label-role">${v.name}</span>
      <span class="mn-micro" style="color:var(--grigio-medio)">${v.role}</span>
    </div>`;
    const cells = v.fte.map(f => {
      const lvl = fteLevel(f);
      return `<div class="mn-cap-grid__cell mn-cap-grid__cell--${lvl}"
        data-mn-tip="${v.name} — ${f.toFixed(1)} FTE">${f > 0 ? f.toFixed(1) : ''}</div>`;
    }).join('');
    return label + cells;
  }).join('');

  return `
    <div class="mn-cap-heatmap">
      <div class="mn-cap-heatmap__header">
        <div class="mn-cap-heatmap__title">Capacity Grid — Apr–Sep 2026</div>
        <div class="mn-cap-heatmap__legend">
          <span class="mn-micro" style="color:var(--grigio-chiaro)">FTE Load:</span>
          <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--empty"></span> 0
          <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--low"></span> &lt;0.5
          <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--mid"></span> 0.5–0.8
          <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--high"></span> 0.8–1.0
          <span class="mn-cap-heatmap__legend-bar mn-cap-grid__cell--over"></span> &gt;1.0
        </div>
      </div>
      <div class="mn-cap-grid" style="grid-template-columns:180px repeat(${MONTHS.length},1fr)">
        ${corner}${headers}${rows}
      </div>
      <div class="mn-cap-tooltip" id="mn-cap-tip"></div>
    </div>`;
}

function buildImpactHeatmap() {
  const { summary, talent_impacts, staffing_gaps } = IMPACT;

  const cards = `
    <div class="mn-heatmap__summary">
      <div class="mn-heatmap__card mn-heatmap__card--idle">
        <div class="mn-heatmap__card__number">${summary.idle_talents}</div>
        <div class="mn-heatmap__card__label">Idle Talents</div>
      </div>
      <div class="mn-heatmap__card mn-heatmap__card--over">
        <div class="mn-heatmap__card__number">${summary.over_allocated}</div>
        <div class="mn-heatmap__card__label">Over-allocated</div>
      </div>
      <div class="mn-heatmap__card mn-heatmap__card--gap">
        <div class="mn-heatmap__card__number">${summary.staffing_gaps}</div>
        <div class="mn-heatmap__card__label">Staffing Gaps</div>
      </div>
    </div>`;

  const rows = talent_impacts.map(t => {
    const rowMod = t.status ? ` mn-heatmap__row--${t.status}` : '';
    const beforeCls = barClass(t.fte_before);
    const afterCls = barClass(t.fte_after);
    const deltaCls = t.delta >= 0 ? 'positive' : 'negative';
    const deltaSign = t.delta >= 0 ? '+' : '';
    const pctBefore = Math.min(t.fte_before / 1.5 * 100, 100);
    const pctAfter = Math.min(t.fte_after / 1.5 * 100, 100);

    return `<div class="mn-heatmap__row${rowMod}">
      <div class="mn-heatmap__person">
        <span class="mn-heatmap__name">${t.name}</span>
        <span class="mn-heatmap__role">${t.role}</span>
      </div>
      <div class="mn-heatmap__bars">
        <div class="mn-heatmap__bar mn-heatmap__bar--before mn-heatmap__bar--${beforeCls}"
          style="width:${pctBefore}%">
          <span class="mn-heatmap__value">${t.fte_before.toFixed(1)}</span>
        </div>
        <div class="mn-heatmap__bar mn-heatmap__bar--after mn-heatmap__bar--${afterCls}"
          style="width:${pctAfter}%">
          <span class="mn-heatmap__value">${t.fte_after.toFixed(1)}</span>
        </div>
      </div>
      <div class="mn-heatmap__delta--${deltaCls}">${deltaSign}${t.delta.toFixed(1)}</div>
    </div>`;
  }).join('');

  const gaps = staffing_gaps.map(g =>
    `<div class="mn-heatmap__gap">
      <span class="mn-heatmap__gap-role">${g.role}</span> — ${g.title}
      <div class="mn-heatmap__gap-suggestion">
        Available in: ${g.available_in_studio.map(s => `<span class="mn-chip">${s}</span>`).join(' ')}
      </div>
    </div>`
  ).join('');

  return `
    <div class="mn-heatmap">
      <div class="mn-heatmap__title">Scenario Impact — Milano Expansion</div>
      ${cards}
      <div style="display:flex;gap:var(--space-md);margin-bottom:var(--space-md)">
        <span class="mn-chip mn-chip--active">Before</span>
        <span class="mn-chip mn-chip--active">After</span>
        <span class="mn-micro" style="align-self:center;color:var(--grigio-medio)">FTE comparison (max 1.5)</span>
      </div>
      ${rows}
      <div style="margin-top:var(--space-lg)">
        <div class="mn-label" style="margin-bottom:var(--space-sm);color:var(--mn-accent)">Staffing Gaps</div>
        ${gaps}
      </div>
    </div>`;
}

function initHeatmap(section) {
  const tip = section.querySelector('#mn-cap-tip');
  if (!tip) return;
  section.querySelectorAll('[data-mn-tip]').forEach(cell => {
    cell.addEventListener('mouseenter', e => {
      tip.textContent = e.target.dataset.mnTip;
      tip.classList.add('mn-cap-tooltip--visible');
      const r = e.target.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      tip.style.left = `${r.left - sr.left + r.width / 2}px`;
      tip.style.top = `${r.top - sr.top - 32}px`;
    });
    cell.addEventListener('mouseleave', () => {
      tip.classList.remove('mn-cap-tooltip--visible');
    });
  });
}

export function createHeatmapSection() {
  const section = document.createElement('section');
  section.id = 'heatmap';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">12 — Resource Heatmap</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Resource Heatmaps</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Capacity grid and impact analysis — pure CSS, fightthestroke foundation volunteer data.
      </p>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Capacity Grid</h3>
      <div style="margin-bottom:var(--space-2xl);position:relative;overflow-x:auto">
        ${buildCapacityGrid()}
      </div>

      <div class="mn-divider-gold" style="margin-bottom:var(--space-2xl)"></div>

      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Impact Heatmap</h3>
      ${buildImpactHeatmap()}
    </div>
  `;

  requestAnimationFrame(() => initHeatmap(section));
  return section;
}
