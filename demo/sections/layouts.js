/**
 * Layouts section — sidebar, notifications, hbar chart, funnel pipeline
 */
export function createLayoutsSection() {
  const section = document.createElement('section');
  section.id = 'layouts';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">15 — Navigation & Layouts</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Navigation &amp; Layouts</h2>
      <p class="mn-body" style="margin-bottom:var(--space-2xl)">
        Sidebar navigation, notification center, horizontal bar chart ranking, and funnel pipeline.
      </p>

      <!-- Two-column: sidebar + notifications -->
      <div class="mn-grid-2" style="margin-bottom:var(--space-2xl);align-items:start">

        <!-- Sidebar preview -->
        <div>
          <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Sidebar Navigation</p>
          <div class="mn-sidebar" style="position:relative;height:340px;border-radius:8px">
            <div class="mn-sidebar__header">
              <span class="mn-sidebar__brand">Fight<span style="color:var(--giallo-ferrari)">Stroke</span></span>
            </div>
            <nav class="mn-sidebar__nav">
              <div class="mn-sidebar__group">
                <div class="mn-sidebar__group-label">Portfolio</div>
                <a class="mn-sidebar__item mn-sidebar__item--active">
                  <span class="mn-sidebar__item-label">Dashboard</span>
                </a>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Analytics</span>
                </a>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Resources</span>
                </a>
              </div>
              <div class="mn-sidebar__group">
                <div class="mn-sidebar__group-label">Management</div>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Engagements</span>
                </a>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Quality</span>
                </a>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Impact</span>
                </a>
              </div>
              <div class="mn-sidebar__group">
                <div class="mn-sidebar__group-label">System</div>
                <a class="mn-sidebar__item">
                  <span class="mn-sidebar__item-label">Admin</span>
                </a>
              </div>
            </nav>
            <div class="mn-sidebar__footer">
              <span class="mn-micro" style="color:var(--grigio-medio)">v9.3.0</span>
            </div>
          </div>
        </div>

        <!-- Notification panel -->
        <div>
          <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Notification Center</p>
          <div class="mn-card-dark" style="padding:0;overflow:hidden;border-radius:8px">
            <div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--grigio-scuro);display:flex;justify-content:space-between">
              <span class="mn-label">Notifications</span>
              <span class="mn-micro" style="color:var(--mn-accent)">3 unread</span>
            </div>
            ${notifItem('Quality alert: Milano Hub dropped to 72%', '2 min ago', true, '#DC0000')}
            ${notifItem('RTB report generated for EMEA Studio 3', '15 min ago', true, '#FFC72C')}
            ${notifItem('Sync completed — 47 engagements updated', '1 hour ago', false, '#00A651')}
          </div>
        </div>
      </div>

      <!-- Horizontal bar chart: Team Health Ranking -->
      <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Team Health Ranking</p>
      <div class="mn-card-dark" style="padding:var(--space-xl);margin-bottom:var(--space-2xl)" id="layouts-hbar">
        ${hbarRows()}
      </div>

      <!-- Funnel pipeline -->
      <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-md)">Engagement Pipeline</p>
      <div class="mn-card-dark" style="padding:var(--space-xl)" id="layouts-funnel">
        ${funnelRows()}
      </div>

      <!-- Org Tree -->
      <p class="mn-label" style="color:var(--mn-accent);margin-top:var(--space-2xl);margin-bottom:var(--space-md)">Organization Tree</p>
      <div class="mn-card-dark" style="padding:var(--space-xl)" id="layouts-org-tree"></div>
    </div>
  `;

  section.addEventListener('mn-ready', () => tryRenderCharts(section));
  setTimeout(() => tryRenderCharts(section), 200);
  return section;
}

function notifItem(title, time, unread, accentColor) {
  const bg = unread ? 'background:rgba(255,199,44,0.04)' : '';
  return `<div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--grigio-scuro);display:flex;gap:var(--space-md);align-items:flex-start;${bg}">
    <div style="width:8px;height:8px;border-radius:50%;background:${accentColor};margin-top:5px;flex-shrink:0"></div>
    <div>
      <div class="mn-body" style="font-size:0.85rem">${title}</div>
      <div class="mn-micro" style="color:var(--grigio-medio);margin-top:2px">${time}</div>
    </div>
  </div>`;
}

const TEAMS = [
  { name: 'Team Alpha', pct: 94, color: '#00A651' },
  { name: 'Team Beta', pct: 87, color: '#00A651' },
  { name: 'Team Gamma', pct: 81, color: '#4EA8DE' },
  { name: 'Team Delta', pct: 74, color: '#FFC72C' },
  { name: 'Team Epsilon', pct: 68, color: '#FFC72C' },
  { name: 'Team Zeta', pct: 52, color: '#DC0000' },
  { name: 'Team Eta', pct: 41, color: '#DC0000' },
];

function hbarRows() {
  return TEAMS.map(t => `
    <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm)">
      <span class="mn-micro" style="width:110px;color:var(--grigio-chiaro);flex-shrink:0">${t.name}</span>
      <div style="flex:1;height:12px;background:var(--grigio-scuro);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${t.pct}%;background:${t.color};border-radius:4px;transition:width 0.6s ease"></div>
      </div>
      <span class="mn-micro" style="width:36px;text-align:right;color:${t.color}">${t.pct}%</span>
    </div>`).join('');
}

const FUNNEL_STAGES = [
  { label: 'Prospect', count: 47, color: '#4EA8DE', pct: 100 },
  { label: 'Exploration', count: 32, color: '#FFC72C', pct: 68 },
  { label: 'Sprint', count: 21, color: '#00A651', pct: 45 },
  { label: 'Wrap-Up', count: 12, color: '#D4622B', pct: 26 },
  { label: 'Completed', count: 6, color: '#8B5CF6', pct: 13 },
];

function funnelRows() {
  return FUNNEL_STAGES.map(s => `
    <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)">
      <span class="mn-micro" style="width:90px;flex-shrink:0;color:var(--grigio-chiaro)">${s.label}</span>
      <div style="flex:1;height:28px;background:var(--grigio-scuro);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${s.pct}%;background:${s.color};opacity:0.85;display:flex;align-items:center;padding-left:var(--space-sm);transition:width 0.6s ease">
          <span class="mn-micro" style="color:#fff;font-weight:600">${s.count}</span>
        </div>
      </div>
      <span class="mn-micro" style="width:28px;text-align:right;color:var(--grigio-medio)">${s.pct}%</span>
    </div>`).join('');
}

function tryRenderCharts(section) {
  const M = window.Maranello;
  if (!M) return;

  const hbarEl = section.querySelector('#layouts-hbar');
  if (M.hBarChart && hbarEl && !hbarEl.dataset.rendered) {
    hbarEl.dataset.rendered = '1';
    try {
      hbarEl.innerHTML = '';
      M.hBarChart(hbarEl, TEAMS.map(t => ({ label: t.name, value: t.pct, color: t.color })), { title: 'Team Health Ranking', unit: '%' });
    } catch (_) { /* CSS fallback already rendered */ }
  }

  const funnelEl = section.querySelector('#layouts-funnel');
  if (M.funnel && funnelEl && !funnelEl.dataset.rendered) {
    funnelEl.dataset.rendered = '1';
    try {
      funnelEl.innerHTML = '';
      M.funnel(funnelEl, FUNNEL_STAGES.map(s => ({ label: s.label, value: s.count, color: s.color })), {});
    } catch (_) { /* CSS fallback already rendered */ }
  }

  if (M.initOrgTree) {
    const treeEl = section.querySelector('#layouts-org-tree');
    if (treeEl && !treeEl.dataset.rendered) {
      treeEl.dataset.rendered = '1';
      M.initOrgTree(treeEl, {
        data: {
          name: 'Board of Directors', role: 'Governance',
          children: [
            { name: 'Francesca Fedeli', role: 'CEO',
              children: [
                { name: 'Therapy Division', role: 'Director',
                  children: [
                    { name: 'Milano Center', role: 'Lead' },
                    { name: 'Roma Center', role: 'Lead' },
                    { name: 'Torino Center', role: 'Lead' },
                  ]
                },
                { name: 'Research', role: 'Director',
                  children: [
                    { name: 'Clinical Trials', role: 'PI' },
                    { name: 'Data Science', role: 'Lead' },
                  ]
                },
                { name: 'Operations', role: 'COO',
                  children: [
                    { name: 'Fundraising', role: 'Manager' },
                    { name: 'Volunteers', role: 'Coordinator' },
                  ]
                },
              ]
            }
          ]
        }
      });
    }
  }
}
