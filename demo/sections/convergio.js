export function convergioSection() {
  return `
    <section class="demo-section" id="convergio">
      <h2 class="demo-section__title">◆ Convergio Dashboard</h2>
      <p class="demo-section__desc">Agentic AI orchestration components — toolbars, mission cards, night agents, and the Idea Jar.</p>

      <div class="mn-convergio-toolbar">
        <div class="mn-convergio-toolbar__nav">
          <button class="mn-convergio-pill mn-convergio-pill--active">📊 OVERVIEW</button>
          <button class="mn-convergio-pill">⚙️ ADMIN</button>
          <button class="mn-convergio-pill">📋 PLANNER</button>
          <button class="mn-convergio-pill">🧠 BRAIN</button>
          <button class="mn-convergio-pill">💡 IDEA JAR</button>
        </div>
        <div class="mn-convergio-toolbar__brand">MARANELLO LUCE</div>
        <div class="mn-convergio-toolbar__status">
          <span class="mn-convergio-toolbar__dot"></span>
          <span class="mn-convergio-toolbar__dot mn-convergio-toolbar__dot--warning"></span>
          <span class="mn-optimize-badge">OPTIMIZE <span class="mn-optimize-badge__count">57</span></span>
          <span>14 Mar 2026 · 10:17</span>
        </div>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));">◆ ACTIVE MISSIONS</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-md);">
        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">F-128</p>
              <p class="mn-mission-card__title">Enterprise Intake Autopilot</p>
            </div>
            <span class="mn-mission-status mn-mission-status--progress">In Progress</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 72"></span>
            <div class="mn-mission-progress-bar">
              <span>72% complete · 18/25 tasks · SLA 4h 12m</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:72%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Agents: Planner, Validator, Reviewer · Budget burn: $1,840/day</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--delegate">Delegate</button>
            <button class="mn-mission-btn">Inspect</button>
            <button class="mn-mission-btn mn-mission-btn--cancel">Pause</button>
          </div>
        </article>

        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">OPS-73</p>
              <p class="mn-mission-card__title">Global Support Deflection Copilot</p>
            </div>
            <span class="mn-mission-status mn-mission-status--done">Healthy</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 96"></span>
            <div class="mn-mission-progress-bar">
              <span>96% complete · 48/50 intents covered · CSAT 4.8/5</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:96%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Volume: 12.4k chats/day · Automation rate: 81% · Escalations: 2.1%</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--start">Runbook</button>
            <button class="mn-mission-btn">Metrics</button>
            <button class="mn-mission-btn mn-mission-btn--reset">Recalibrate</button>
          </div>
        </article>

        <article class="mn-mission-card">
          <div class="mn-mission-card__header">
            <div>
              <p class="mn-mission-card__number">RISK-22</p>
              <p class="mn-mission-card__title">Contract Drift Sentinel</p>
            </div>
            <span class="mn-mission-status mn-mission-status--failed">At Risk</span>
          </div>
          <div class="mn-mission-card__progress">
            <span class="mn-mission-progress-ring" style="--mn-mission-progress: 41"></span>
            <div class="mn-mission-progress-bar">
              <span>41% complete · 7 unresolved policy checks · 3 blocked dependencies</span>
              <span class="mn-mission-progress-bar__track"><span class="mn-mission-progress-bar__fill" style="width:41%"></span></span>
            </div>
          </div>
          <p class="mn-mesh-node__stats">Critical: GDPR retention mapping pending legal sign-off</p>
          <div class="mn-mission-card__actions">
            <button class="mn-mission-btn mn-mission-btn--delegate">Escalate</button>
            <button class="mn-mission-btn">Open Board</button>
            <button class="mn-mission-btn mn-mission-btn--cancel">Abort Run</button>
          </div>
        </article>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));">🌙 NIGHTLY JOBS</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--space-md);">
        <article class="mn-night-agent">
          <div class="mn-night-agent__header">
            <p class="mn-mission-card__title">Data Lake Agent</p>
            <span class="mn-night-agent__toggle" data-on="true">ON</span>
          </div>
          <p class="mn-night-agent__schedule">
            <span>Scope: CRM + ERP mirrors into analytics lake</span>
            <span>Schedule: 02:00 CET · weekdays</span>
            <span>Last run: 37m · 1.8M rows synced · 0 drift alerts</span>
          </p>
          <div class="mn-night-agent__actions">
            <button class="mn-night-agent__action">Run Now</button>
            <button class="mn-night-agent__action">View Log</button>
            <button class="mn-night-agent__action">Edit Window</button>
          </div>
        </article>

        <article class="mn-night-agent">
          <div class="mn-night-agent__header">
            <p class="mn-mission-card__title">Process Optimizer</p>
            <span class="mn-night-agent__toggle" data-on="true">ON</span>
          </div>
          <p class="mn-night-agent__schedule">
            <span>Scope: Rebuild process maps + suggest automation opportunities</span>
            <span>Schedule: 03:30 CET · daily</span>
            <span>Last run: 112 workflows scored · 14 high-impact ideas generated</span>
          </p>
          <div class="mn-night-agent__actions">
            <button class="mn-night-agent__action">Preview Queue</button>
            <button class="mn-night-agent__action">Approve Batch</button>
            <button class="mn-night-agent__action">Settings</button>
          </div>
        </article>
      </div>

      <h3 style="margin: var(--mn-space-lg, var(--space-lg)) 0 var(--mn-space-md, var(--space-md));">💡 Idea Jar</h3>
      <div class="mn-idea-jar">
        <div class="mn-idea-jar__lid"></div>
        <div class="mn-idea-jar__vessel">
          <span class="mn-idea-jar__idea">💡</span>
          <span class="mn-idea-jar__idea">✨</span>
          <span class="mn-idea-jar__idea">🔮</span>
          <span class="mn-idea-jar__idea">⚡</span>
          <span class="mn-idea-jar__idea">🎯</span>
        </div>
        <div class="mn-idea-jar__count">23</div>
        <div class="mn-idea-jar__label">Ideas Captured</div>
        <button class="mn-idea-jar__add-btn">+ Add Idea</button>
      </div>
    </section>
  `;
}

export function createConvergioSection() {
  const template = document.createElement('template');
  template.innerHTML = convergioSection().trim();
  const section = template.content.firstElementChild;
  section.classList.add('mn-section-dark');
  section.innerHTML = `<div class="mn-container">${section.innerHTML}</div>`;
  return section;
}
