const KPI_CARDS = [
  { value: '312', unit: 'agents', label: 'Active runtimes', delta: '↑ 12%', hint: 'vs. last routing window' },
  { value: '96', unit: '%', label: 'Accuracy score', delta: '↑ 2.4%', hint: 'eval gate trend' },
  { value: '14.6k', unit: 'tasks', label: 'Completed tasks', delta: '↑ 18%', hint: '24h orchestration volume' },
  { value: '84', unit: '%', label: 'Budget efficiency', delta: '↑ 5%', hint: 'token spend vs. target' },
];
const CONTENT_CARDS = [
  { title: 'us-east-1 routing mesh', body: 'Low-latency orchestration lane combining prompt caching, fallback rules, and canary model routing for interactive workloads.', tags: ['us-east-1', 'Routing', 'Low latency'] },
  { title: 'eu-west-1 evaluation lane', body: 'Quality-gated batch evaluations with replay support, structured scoring, and rollback checkpoints for critical inference releases.', tags: ['eu-west-1', 'Evaluation', 'Quality gate'] },
  { title: 'ap-southeast-1 research cluster', body: 'Long-context model experiments, embeddings refresh, and synthetic dataset generation for asynchronous agent workflows.', tags: ['ap-southeast-1', 'Research', 'Async runs'] },
];
const ACTION_CARDS = [
  { icon: '↗', title: 'Escalate failed runs', body: 'Route pipelines with degraded accuracy or rising retry depth to the validator queue within the next control loop.', cta: 'Open failure queue' },
  { icon: '✦', title: 'Launch eval sweep', body: 'Trigger a fresh benchmark pack across Claude, GPT, and Gemini routing policies before the next production deploy.', cta: 'Run benchmark pack' },
];
const PROFILES = [
  { name: 'Agent Opus', role: 'Strategic planner · Claude Opus', initials: 'AO', status: 'Routing primary', tone: 'var(--mn-accent)' },
  { name: 'Agent Sonnet', role: 'Execution engine · Claude Sonnet', initials: 'AS', status: 'Serving batch runs', tone: 'var(--verde-racing)' },
  { name: 'Agent Haiku', role: 'Rapid monitor · Claude Haiku', initials: 'AH', status: 'Watching canaries', tone: 'var(--status-info)' },
];
const SIGNALS = [
  { eyebrow: 'us-east-1', title: 'Gateway lane', leds: [['API gateway', 'active'], ['Model router', 'active'], ['Cache tier', 'info']] },
  { eyebrow: 'eu-west-1', title: 'Evaluation deck', leds: [['Replay jobs', 'active'], ['Judge models', 'warning'], ['Audit log', 'active']] },
  { eyebrow: 'ap-southeast-1', title: 'Inference lane', leds: [['Batch queue', 'active'], ['GPU pool', 'info'], ['Failover mesh', 'danger']] },
];
const PODS = [{ label: 'OP', tone: 'green' }, { label: 'SO', tone: 'gold' }, { label: 'HA', tone: 'red' }, { label: 'GP', tone: 'green' }, { label: 'GM', tone: 'gold' }];

export function createCardsSection() {
  const section = document.createElement('section');
  section.id = 'cards';
  section.className = 'mn-section-light';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">02 — Components</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Cards & Signal Surfaces</h2>
      <p class="mn-body" style="margin-bottom:var(--space-xl)">A richer, extended card gallery for Maranello Luce deployment regions: KPI tiles, operational media, model profiles, and dashboard micro-panels built to feel cinematic but still highly readable.</p>
      <div class="mn-tag-group" style="justify-content:center;margin-bottom:var(--space-2xl)"><span class="mn-tag mn-tag--active">Maranello Luce</span><span class="mn-tag">Deployment Regions</span><span class="mn-tag">Model Profiles</span><span class="mn-tag">Quality Gates</span><span class="mn-tag mn-tag--xs">dashboard</span></div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">KPI stat cards</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">${KPI_CARDS.map(statCard).join('')}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Content cards</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${CONTENT_CARDS.map(contentCard).join('')}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Media & actions</h3>
      <div class="mn-grid-2" style="margin-bottom:var(--space-2xl)">${videoCard()}<div style="display:grid;gap:var(--space-lg)">${ACTION_CARDS.map(actionCard).join('')}</div></div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Model profiles</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${PROFILES.map(profileCard).join('')}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Signal panels</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">${SIGNALS.map(signalCard).join('')}</div>
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-lg)">Pod group strip</h3>
      <div class="mn-grid-2">
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-start;flex-wrap:wrap;margin-bottom:var(--space-lg)"><div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Model pod strip</div><p class="mn-card__text">Small pods summarise the multi-model routing stack active in the us-east-1 region today.</p></div><span class="mn-tag mn-tag--light mn-tag--xs">5 active pods</span></div>
          <div class="mn-pod-group" style="justify-content:center;padding:var(--space-lg) 0 var(--space-xl)">${PODS.map(pod).join('')}</div>
        </div>
        <div class="mn-card-dark" style="padding:var(--space-xl);display:flex;flex-direction:column;justify-content:space-between">
          <div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Pipeline handoff card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">Afternoon routing / Pipeline Alpha & Beta</h4><p class="mn-card__text" style="margin-bottom:var(--space-lg)">18 eval sweeps, 4 canary promotions, and 2 rollback checks need synchronized model routing, cache warming, and validator coverage.</p></div>
          <div style="display:flex;justify-content:space-between;gap:var(--space-md);align-items:flex-end;flex-wrap:wrap"><div><div class="mn-micro" style="color:var(--grigio-chiaro)">Readiness</div><div style="font-family:var(--font-display);font-size:var(--text-h2);color:var(--mn-accent);line-height:1">91%</div></div><button class="mn-btn mn-btn--accent">Dispatch runbook</button></div>
        </div>
      </div>
    </div>
  `;
  return section;
}

function statCard(item) { return `<div class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm);margin-bottom:var(--space-md)"><span class="mn-tag mn-tag--light mn-tag--xs">${item.hint}</span><span class="mn-micro" style="color:${item.delta.includes('↓') ? 'var(--rosso-corsa)' : 'var(--verde-racing)'}">${item.delta}</span></div><div class="mn-stat"><div class="mn-stat__value">${item.value}</div><div class="mn-stat__unit">${item.unit}</div><div class="mn-stat__label">${item.label}</div></div></div>`; }
function contentCard(item) { return `<article class="mn-card-dark"><div class="mn-card__content"><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">Pipeline card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">${item.title}</h4><p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p><footer class="mn-tag-group">${item.tags.map((tag) => `<span class="mn-tag mn-tag--light mn-tag--xs">${tag}</span>`).join('')}</footer></div></article>`; }
function videoCard() { return `<article class="mn-card-dark" style="padding:var(--space-lg)"><div class="mn-video-card" style="background:linear-gradient(135deg, rgba(255,199,44,0.22), rgba(220,0,0,0.18)),radial-gradient(circle at 24% 20%, rgba(255,255,255,0.16), transparent 34%),linear-gradient(160deg, #1f1f1f, #0a0a0a 72%);margin-bottom:var(--space-lg)"><span class="mn-tag mn-tag--light mn-tag--xs" style="position:absolute;top:var(--space-md);right:var(--space-md)">04:32</span><span class="mn-video-card__play"></span><span class="mn-video-card__label">Watch inference walkthrough</span></div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm)">mn-video-card</div><h4 class="mn-card__title" style="font-size:var(--text-h4)">us-east-1 routing mesh / failover protocol</h4><p class="mn-card__text">Gradient media placeholder for platform tours, model routing explainers, or release runbooks.</p></article>`; }
function actionCard(item) { return `<article class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-md);margin-bottom:var(--space-md)"><div><div class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-xs)">Action card</div><h4 class="mn-card__title" style="font-size:var(--text-h4);margin-bottom:var(--space-xs)">${item.title}</h4></div><span style="width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,0.06);font-size:1.1rem">${item.icon}</span></div><p class="mn-card__text" style="margin-bottom:var(--space-lg)">${item.body}</p><button class="mn-btn mn-btn--accent">${item.cta}</button></article>`; }
function profileCard(item) { return `<article class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)"><div style="width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:${item.tone};color:#111;font-family:var(--font-display);font-weight:700">${item.initials}</div><div><h4 class="mn-card__title" style="font-size:var(--text-h5);margin-bottom:2px">${item.name}</h4><p class="mn-card__text">${item.role}</p></div></div><div class="mn-status mn-status--active"><span class="mn-status__dot"></span>${item.status}</div></article>`; }
function signalCard(item) { return `<div class="mn-signal-panel"><div class="mn-signal-panel__eyebrow">${item.eyebrow}</div><div class="mn-signal-panel__title" style="margin-bottom:var(--space-md)">${item.title}</div><div style="display:grid;gap:var(--space-sm)">${item.leds.map(([label, status]) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-md)"><span class="mn-micro" style="color:var(--grigio-chiaro)">${label}</span><span class="mn-status mn-status--${status} mn-status--sm"><span class="mn-status__dot"></span>${status}</span></div>`).join('')}</div></div>`; }
function pod(item) { return `<div class="mn-pod"><div class="mn-pod__face"><span class="mn-pod__indicator mn-pod__indicator--${item.tone}"></span></div><div class="mn-pod__label">${item.label}</div></div>`; }
