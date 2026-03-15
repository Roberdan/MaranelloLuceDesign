/**
 * Web Components section — lazy-loads each WC module via IntersectionObserver.
 * Cards render as placeholders; module + live preview inject on scroll-near.
 */
const SMALL_TABLE_COLUMNS = esc(JSON.stringify([{ key: 'program', label: 'Pipeline' }, { key: 'status', label: 'Status', type: 'status' }]));
const SMALL_TABLE_ROWS = esc(JSON.stringify([{ program: 'Pipeline Alpha', status: 'Active' }, { program: 'Pipeline Beta', status: 'Planned' }]));
const GANTT_TASKS = esc(JSON.stringify([{ id: 'g1', title: 'Route', start: '2026-04-01', end: '2026-04-06', progress: 1, color: '#FFC72C' }, { id: 'g2', title: 'Infer', start: '2026-04-07', end: '2026-04-20', progress: 0.72, color: '#4EA8DE', dependencies: ['g1'] }]));
const OKR_OBJECTIVES = esc(JSON.stringify([{ title: 'Reduce latency', progress: 78, status: 'on-track', keyResults: [{ title: 'Keep p95 under 180 ms', current: 172, target: 180 }] }]));
const OKR_OPTIONS = esc(JSON.stringify({ title: 'Spring OKR', period: 'Q2 2026' }));
const MAP_MARKERS = esc(JSON.stringify([{ id: 'm1', lat: 38.90, lon: -77.04, label: 'us-east-1', detail: 'Primary routing mesh', color: 'active', size: 8 }, { id: 'm2', lat: 53.35, lon: -6.26, label: 'eu-west-1', detail: 'Evaluation cluster', color: 'warning', size: 8 }]));
const PROFILE_SECTIONS = esc(JSON.stringify([{ items: [{ label: 'Runtime overview' }, { label: 'Settings' }] }, { items: [{ label: 'Switch theme' }, { label: 'Sign out' }] }]));
const DETAIL_SECTIONS = esc(JSON.stringify({ data: { region: 'us-east-1', pipeline: 'Pipeline Alpha', readiness: 'Ready' } }));
const COMMAND_ITEMS = esc(JSON.stringify([{ text: 'Open routing board', icon: '■' }, { text: 'Jump to eu-west-1', icon: '⌘' }, { text: 'Launch eval pack', icon: '◆' }]));
const HBAR_DATA = esc(JSON.stringify([{ label: 'Opus', value: 82 }, { label: 'Sonnet', value: 68 }]));
const FUNNEL_STAGES = esc(JSON.stringify([{ label: 'Draft', value: 120 }, { label: 'Validated', value: 84 }, { label: 'Running', value: 56 }]));

// mn-tab is registered by mn-tabs.js
const TAG_TO_MODULE = { 'mn-tab': 'mn-tabs' };

const GROUPS = [
  { title: 'Charts', items: [
    { tag: 'mn-chart', desc: 'Canvas chart host for sparkline snapshots and dashboard trends.', size: 'wide', preview: `<mn-chart type="sparkline" width="220" height="64" data='[72,78,76,88,94,91,99]'></mn-chart>` },
    { tag: 'mn-gauge', desc: 'Ferrari-inspired dial for readiness, utilization, or routing confidence.', preview: `<mn-gauge value="78" max="100" unit="%" label="Readiness" size="sm"></mn-gauge>` },
    { tag: 'mn-speedometer', desc: 'Needle instrument for pace, throughput, or agent load.', preview: `<mn-speedometer value="84" max="120" unit="" label="Flow" size="sm"></mn-speedometer>` },
    { tag: 'mn-hbar', desc: 'Horizontal bar comparisons for model performance and team load.', size: 'wide', preview: `<mn-hbar data='${HBAR_DATA}' options='{"unit":"%"}'></mn-hbar>` },
    { tag: 'mn-funnel', desc: 'Draft-to-runtime funnel with conversion-aware stages.', size: 'wide', preview: `<mn-funnel stages='${FUNNEL_STAGES}' show-conversion></mn-funnel>` },
    { tag: 'mn-gantt', desc: 'Interactive timeline for regional launches and pipeline phases.', size: 'wide', preview: `<mn-gantt tasks='${GANTT_TASKS}' zoom="18" label-width="100"></mn-gantt>` },
    { tag: 'mn-okr', desc: 'Objective cards with key-result progress and portfolio framing.', size: 'tall', preview: `<mn-okr objectives='${OKR_OBJECTIVES}' options='${OKR_OPTIONS}'></mn-okr>` },
    { tag: 'mn-map', desc: 'Canvas map for region locations and routing clusters.', size: 'wide', preview: `<mn-map markers='${MAP_MARKERS}' center='[0,25]' zoom="1"></mn-map>` },
    { tag: 'mn-mapbox', desc: 'Mapbox GL surface for token-enabled geographic storytelling.', size: 'wide', preview: `<mn-mapbox center="0,25" zoom="1" markers='[]' style="display:block;height:96px;border-radius:12px;background:linear-gradient(135deg,#1f1f1f,#101010)"></mn-mapbox>` },
  ] },
  { title: 'Controls', items: [
    { tag: 'mn-ferrari-control', desc: 'Cockpit-grade control wrapper for slider, rotary, and lever inputs.', preview: `<mn-ferrari-control type="slider" options='{"label":"Budget","min":0,"max":100,"value":72}'></mn-ferrari-control>` },
    { tag: 'mn-theme-toggle', desc: 'Cycles the four demo themes with a compact branded switch.', preview: `<div class="mn-wc-theme-mock" style="display:flex;align-items:center;gap:8px;pointer-events:none" aria-hidden="true"><span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:var(--mn-accent,#FFC72C);color:#111;font-size:1rem">&#9680;</span><span class="mn-micro" style="color:var(--grigio-chiaro)">Theme Toggle</span></div>` },
    { tag: 'mn-date-picker', desc: 'Date selector with min/max rules and deployment windows.', preview: `<mn-date-picker value="2026-04-14" min="2026-04-01" max="2026-05-31"></mn-date-picker>` },
    { tag: 'mn-command-palette', desc: 'Keyboard-first action launcher for quick navigation and commands.', preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-palette">Open palette</button><mn-command-palette id="wc-palette" items='${COMMAND_ITEMS}' placeholder="Type a command"></mn-command-palette>` },
    { tag: 'mn-a11y', desc: 'Floating accessibility hub for contrast, motion, and focus settings.', preview: `<div class="mn-micro" style="color:var(--grigio-chiaro);text-align:center">Floating FAB preview</div><mn-a11y></mn-a11y>` },
  ] },
  { title: 'Data', items: [
    { tag: 'mn-data-table', desc: 'Sortable data table for compact pipeline snapshots.', size: 'wide', preview: `<mn-data-table columns='${SMALL_TABLE_COLUMNS}' data='${SMALL_TABLE_ROWS}' page-size="2" compact></mn-data-table>` },
    { tag: 'mn-system-status', desc: 'Operational pill and panel for runtime services and integrations.', preview: `<mn-system-status services='[{"name":"Gateway"},{"name":"Model Router"}]' poll-interval="0" version="v3.2" environment="demo"></mn-system-status>` },
    { tag: 'mn-profile', desc: 'Avatar-triggered user menu for operators and model owners.', preview: `<mn-profile name="Agent Opus" email="agent.opus@maranelloluce.ai" sections='${PROFILE_SECTIONS}'><div style="width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--mn-accent);color:#111;font-weight:700">AO</div></mn-profile>` },
    { tag: 'mn-login', desc: 'SSO-ready sign-in shell with optional health signals.', size: 'tall', preview: `<mn-login title="Maranello Luce Ops" subtitle="Agent Portal"></mn-login>` },
  ] },
  { title: 'Layout', items: [
    { tag: 'mn-tabs', desc: 'Tabbed interface container for dashboard subsections.', preview: `<mn-tabs active="0"><mn-tab label="Overview"><p class="mn-micro">us-east-1 / 18 live runs</p></mn-tab><mn-tab label="Risk"><p class="mn-micro">2 validators need follow-up</p></mn-tab></mn-tabs>` },
    { tag: 'mn-tab', desc: 'Child panel element used to label and slot tab content.', preview: `<mn-tabs active="0"><mn-tab label="Runtime"><p class="mn-micro">A single lane powering the parent tabs shell.</p></mn-tab></mn-tabs>` },
    { tag: 'mn-detail-panel', desc: 'Slide-over inspection panel for pipeline metadata.', preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-detail">Open detail</button><mn-detail-panel id="wc-detail" title="Pipeline detail" sections='${DETAIL_SECTIONS}'></mn-detail-panel>` },
    { tag: 'mn-modal', desc: 'Modal dialog for confirmations, alerts, and quick approvals.', preview: `<button class="mn-btn mn-btn--ghost" data-open="wc-modal">Open modal</button><mn-modal id="wc-modal" title="Release review">The us-east-1 deployment lane is ready for final sign-off.</mn-modal>` },
  ] },
  { title: 'Interactive', items: [
    { tag: 'mn-toast', desc: 'Auto-dismissing toast notifications for operator feedback.', preview: `<button class="mn-btn mn-btn--ghost" data-toast>Spawn toast</button><div class="mn-wc-toast-stack"><div class="mn-toast mn-toast--success" style="position:relative;margin-top:8px"><div class="mn-toast__content"><strong class="mn-toast__title">Runbook synced</strong><p class="mn-toast__message mn-micro">State refreshed across runtime board.</p></div></div></div>` },
    { tag: 'mn-chat', desc: 'Conversational assistant surface for pipeline support and routing triage.', size: 'tall', preview: `<mn-chat style="height:200px;display:block"></mn-chat>` },
  ] },
];

const FLAT_ITEMS = GROUPS.flatMap(g => g.items);

export function createWebComponentsSection() {
  const section = document.createElement('section');
  section.id = 'web-components';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <style>
      #web-components .mn-wc-group{margin-bottom:var(--space-2xl)}
      #web-components .mn-wc-preview{position:relative;display:grid;place-items:center;min-height:120px;padding:var(--space-md);border:1px solid var(--grigio-scuro);border-radius:var(--radius-lg);background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));overflow:hidden}
      #web-components .mn-wc-preview--wide{min-height:150px;align-items:stretch}
      #web-components .mn-wc-preview--tall{min-height:180px;align-items:stretch}
      #web-components .mn-wc-preview :is(mn-chart,mn-data-table,mn-funnel,mn-gantt,mn-hbar,mn-login,mn-map,mn-mapbox,mn-okr){display:block;width:100%}
      #web-components .mn-wc-toast-stack{display:grid;gap:var(--space-sm);justify-items:center;margin-top:var(--space-sm)}
      #web-components .mn-wc-meta{display:grid;gap:6px}
      #web-components .mn-wc-placeholder{display:flex;align-items:center;justify-content:center;gap:8px;opacity:0.4}
    </style>
    <div class="mn-container"><p class="mn-section-number">14 — Web Components</p><h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">24 Web Components / Catalog View</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">A complete Maranello Luce-flavored catalog of the <code>mn-*</code> layer: charts, controls, data surfaces, layout shells, and interactive widgets.</p>${GROUPS.map(groupBlock).join('')}</div>`;
  requestAnimationFrame(() => initCatalog(section));
  return section;
}

function groupBlock(group) {
  return `<div class="mn-wc-group"><div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-end;flex-wrap:wrap;margin-bottom:var(--space-lg)"><h3 class="mn-title-sub" style="margin:0">${group.title}</h3><span class="mn-tag mn-tag--xs">${group.items.length} components</span></div><div class="mn-grid-3">${group.items.map(card).join('')}</div></div>`;
}

function card(item) {
  const idx = FLAT_ITEMS.indexOf(item);
  return `<article class="mn-card-dark" style="padding:var(--space-lg)" data-wc-idx="${idx}"><div class="mn-wc-preview mn-wc-preview--${item.size || 'base'}"><div class="mn-wc-placeholder"><span class="mn-spinner mn-spinner--sm"><span class="mn-spinner__ring"></span></span><span class="mn-micro">${item.tag}</span></div></div><div class="mn-wc-meta" style="margin-top:var(--space-md)"><code class="mn-micro" style="color:var(--mn-accent)">&lt;${item.tag}&gt;</code><p class="mn-card__text">${item.desc}</p></div></article>`;
}

async function initCatalog(section) {
  // Map stores promises so all cards sharing a module await the SAME import — prevents race condition
  const loadedPromises = new Map();

  const loadCard = async (article) => {
    const idx = parseInt(article.dataset.wcIdx ?? '-1', 10);
    if (idx < 0 || idx >= FLAT_ITEMS.length) return;
    const item = FLAT_ITEMS[idx];
    const mod = TAG_TO_MODULE[item.tag] ?? item.tag;
    if (!loadedPromises.has(mod)) {
      loadedPromises.set(mod, import(`../../src/wc/${mod}.js`).catch(() => null));
    }
    await loadedPromises.get(mod);
    // Wait for custom element registration before injecting preview HTML
    if (item.tag !== 'mn-tab') {
      await customElements.whenDefined(item.tag).catch(() => null);
    }
    const previewEl = article.querySelector('.mn-wc-preview');
    if (previewEl) {
      previewEl.innerHTML = item.preview;
      // Wire event handlers for this card
      previewEl.querySelectorAll('[data-open]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-open');
          const t = previewEl.querySelector('#' + targetId) || section.querySelector('#' + targetId);
          if (!t) return;
          if (typeof t.open === 'function') { t.open(); return; }
          if (typeof t.show === 'function') { t.show(); return; }
          if (typeof t.toggle === 'function') { t.toggle(true); return; }
          t.setAttribute('open', '');
        });
      });
      previewEl.querySelectorAll('[data-toast]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const stack = btn.parentElement?.querySelector('.mn-wc-toast-stack');
          if (!stack) return;
          const toast = document.createElement('mn-toast');
          toast.setAttribute('title', 'Runbook synced');
          toast.setAttribute('message', 'Pipeline Alpha state refreshed across the runtime board.');
          toast.setAttribute('type', 'success');
          toast.setAttribute('duration', '2600');
          stack.appendChild(toast);
        });
      });
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { observer.unobserve(e.target); loadCard(e.target); } });
  }, { rootMargin: '400px 0px' });

  section.querySelectorAll('article[data-wc-idx]').forEach((a) => observer.observe(a));
}

function esc(value) { return String(value).replace(/'/g, '&#39;'); }
