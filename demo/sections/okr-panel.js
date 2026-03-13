/**
 * OKR Panel section — objectives and key results dashboard
 */
export function createOkrSection() {
  const section = document.createElement('section');
  section.id = 'okr';
  section.className = 'mn-section-light';
  section.innerHTML = `<div class="mn-container"><p class="mn-section-number">11 — Strategy</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">OKR Dashboard</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">Objective and Key Result tracking for agentic operations, routing quality, and model efficiency.</p><div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)"><div id="okr-panel-root"></div></div><h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Regional Progress</h3><div class="mn-grid-2">${regionCard('North America', [{ kr: 'Launch 3 new inference lanes', pct: 67 }, { kr: 'Keep p95 under 180 ms', pct: 82 }, { kr: 'Reach 200k routed tasks', pct: 45 }])}${regionCard('Europe', [{ kr: 'Ship evaluation mesh', pct: 90 }, { kr: 'Add 5 failover policies', pct: 60 }, { kr: 'Publish 2 model scorecards', pct: 50 }])}</div></div>`;
  requestAnimationFrame(() => initOkr(section));
  return section;
}
function initOkr(section) {
  const M = window.Maranello; if (!M?.okrPanel) return; const root = section.querySelector('#okr-panel-root'); if (!root) return;
  M.okrPanel(root, { title: 'Q1 2026 Objectives', period: 'Jan — Mar 2026', objectives: [
    { title: 'Expand Runtime Capacity in North America', progress: 62, status: 'at-risk', keyResults: [{ title: 'Open lanes in us-east-1 and us-west-2', current: 1.5, target: 2 }, { title: 'Route 500k tasks through production pipelines', current: 340000, target: 500000 }, { title: 'Achieve 96% user satisfaction score', current: 92, target: 96, unit: '%' }, { title: 'Reduce p95 latency to under 180 ms', current: 194, target: 180 }] },
    { title: 'Strengthen Model Evaluation', progress: 55, status: 'at-risk', keyResults: [{ title: 'Publish 4 benchmark scorecards', current: 2, target: 4 }, { title: 'Secure 3 judge-model pairings', current: 2, target: 3 }, { title: 'Launch reasoning model canary', current: 0.3, target: 1 }] },
    { title: 'Grow Agent Reliability', progress: 78, status: 'on-track', keyResults: [{ title: 'Deploy 100 new validator checks', current: 85, target: 100 }, { title: 'Achieve 80% auto-remediation rate', current: 58, target: 80, unit: '%' }] },
  ] });
}
function regionCard(region, keyResults) { const krs = keyResults.map(kr => `<div style="margin-bottom:var(--space-md)"><div style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)"><span class="mn-micro">${kr.kr}</span><span class="mn-micro" style="color:var(--mn-accent)">${kr.pct}%</span></div><div style="height:4px;border-radius:2px;background:var(--grigio-scuro)"><div style="height:100%;width:${kr.pct}%;border-radius:2px;background:var(--mn-accent);transition:width 1s ease"></div></div></div>`).join(''); return `<div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-lg)">${region}</h4>${krs}</div>`; }
