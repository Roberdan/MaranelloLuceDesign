/**
 * OKR Panel section — objectives and key results dashboard
 */
export function createOkrSection() {
  const section = document.createElement('section');
  section.id = 'okr';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">11 — Strategy</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">OKR Dashboard</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Objective and Key Result tracking with progress visualization,
        hero gauge, and scope tokens.
      </p>

      <div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)">
        <div id="okr-panel-root"></div>
      </div>

      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">
        Regional Progress
      </h3>
      <div class="mn-grid-2">
        ${regionCard('Northern Italy', [
          { kr: 'Open 3 new therapy centers', pct: 67 },
          { kr: 'Train 50 local therapists', pct: 82 },
          { kr: 'Reach 200 new families', pct: 45 },
        ])}
        ${regionCard('Central Italy', [
          { kr: 'Launch mobile therapy unit', pct: 90 },
          { kr: 'Partner with 5 hospitals', pct: 60 },
          { kr: 'Publish 2 research papers', pct: 50 },
        ])}
      </div>
    </div>
  `;

  requestAnimationFrame(() => initOkr(section));
  return section;
}

function initOkr(section) {
  const M = window.Maranello;
  if (!M?.okrPanel) return;
  const root = section.querySelector('#okr-panel-root');
  if (!root) return;

  M.okrPanel(root, {
    title: 'Q1 2026 Objectives',
    period: 'Jan — Mar 2026',
    objectives: [
      {
        title: 'Expand Therapy Access in Northern Italy',
        progress: 62,
        status: 'at-risk',
        keyResults: [
          { title: 'Open centers in Torino and Bologna', current: 1.5, target: 2 },
          { title: 'Enroll 500 children in therapy programs', current: 340, target: 500 },
          { title: 'Achieve 90% family satisfaction score', current: 85, target: 90, unit: '%' },
          { title: 'Reduce wait time to under 2 weeks', current: 22, target: 14 },
        ],
      },
      {
        title: 'Strengthen Research Partnerships',
        progress: 55,
        status: 'at-risk',
        keyResults: [
          { title: 'Publish 4 peer-reviewed papers', current: 2, target: 4 },
          { title: 'Secure 3 university collaborations', current: 2, target: 3 },
          { title: 'Launch Brain Research Initiative pilot', current: 0.3, target: 1 },
        ],
      },
      {
        title: 'Grow Volunteer Network',
        progress: 78,
        status: 'on-track',
        keyResults: [
          { title: 'Recruit 100 new volunteers', current: 85, target: 100 },
          { title: 'Achieve 80% volunteer retention rate', current: 58, target: 80, unit: '%' },
        ],
      },
    ],
  });
}

function regionCard(region, keyResults) {
  const krs = keyResults.map(kr => `
    <div style="margin-bottom:var(--space-md)">
      <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
        <span class="mn-micro">${kr.kr}</span>
        <span class="mn-micro" style="color:var(--mn-accent)">${kr.pct}%</span>
      </div>
      <div style="height:4px;border-radius:2px;background:var(--grigio-scuro)">
        <div style="height:100%;width:${kr.pct}%;border-radius:2px;background:var(--mn-accent);transition:width 1s ease"></div>
      </div>
    </div>
  `).join('');

  return `<div class="mn-card-dark" style="padding:var(--space-xl)">
    <h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">${region}</h4>
    ${krs}
  </div>`;
}
