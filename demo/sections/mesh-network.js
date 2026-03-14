export function meshNetworkSection() {
  return `
    <section class="demo-section" id="mesh-network">
      <h2 class="demo-section__title">◆ Mesh Network</h2>
      <p class="demo-section__desc">Convergio-style mesh node visualization for distributed AI agent orchestration.</p>

      <div class="mn-mesh-network">
        <div class="mn-mesh-network__toolbar mn-mesh-network__top">
          <span class="mn-mesh-network__title">◆ MESH NETWORK</span>
          <div class="mn-mesh-network__legend">
            <span class="mn-mesh-status mn-mesh-status--on"></span> On
            <span class="mn-mesh-status mn-mesh-status--off"></span> Off
            <span class="mn-mesh-status mn-mesh-status--sync"></span> Sync
            <span class="mn-mesh-status mn-mesh-status--drift"></span> Drift
          </div>
          <div class="mn-mesh-network__actions">
            <button class="mn-mesh-network__action">+ ADD PEER</button>
            <button class="mn-mesh-network__action">🔍 DISCOVER</button>
            <button class="mn-mesh-network__action">↻ FULL SYNC</button>
            <button class="mn-mesh-network__action">↑ PUSH</button>
            <span class="mn-mesh-node__stats">3/3 online</span>
          </div>
        </div>

        <div class="mn-mesh-network__grid">
          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--signal-ok);">
            <div class="mn-mesh-node__header">
              <span aria-hidden="true">🍎</span>
              <h4 class="mn-mesh-node__name">M1-MARIO</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">● Worker · Local</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
            </div>
            <p class="mn-mesh-node__stats">CPU</p>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 12%"></span></span>
              <span class="mn-mesh-bar__label">12%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 48%"></span></span>
              <span class="mn-mesh-bar__label">48%</span>
            </div>
            <p class="mn-mesh-node__stats">3 active tasks · drift 0.2%</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↻</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↑</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">⌁</span></button>
            </div>
          </article>

          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--giallo);">
            <div class="mn-mesh-node__header">
              <span aria-hidden="true">🍎</span>
              <h4 class="mn-mesh-node__name">M3-MAX</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">● Coordinator · Local</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
              <span class="mn-mesh-badge mn-mesh-badge--ollama">Ollama</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 31%"></span></span>
              <span class="mn-mesh-bar__label">31%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 74%"></span></span>
              <span class="mn-mesh-bar__label">74%</span>
            </div>
            <p class="mn-mesh-node__stats">5 active tasks · 2 delegated · sync 98%</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↻</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↑</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">⚡</span></button>
            </div>
          </article>

          <article class="mn-mesh-node" style="--mn-mesh-border-accent: var(--azzurro-chiaro, #4EA8DE);">
            <div class="mn-mesh-node__header">
              <span aria-hidden="true">🐧</span>
              <h4 class="mn-mesh-node__name">OMARCHY</h4>
              <span class="mn-mesh-status mn-mesh-status--on" title="online"></span>
            </div>
            <p class="mn-mesh-node__role">● Worker · Remote</p>
            <div class="mn-mesh-badges">
              <span class="mn-mesh-badge mn-mesh-badge--claude">Claude</span>
              <span class="mn-mesh-badge mn-mesh-badge--copilot">Copilot</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">CPU</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--cpu" style="width: 1%"></span></span>
              <span class="mn-mesh-bar__label">1%</span>
            </div>
            <div class="mn-mesh-bar">
              <span class="mn-mesh-bar__label">RAM</span>
              <span class="mn-mesh-bar__track"><span class="mn-mesh-bar__fill mn-mesh-bar__fill--ram" style="width: 63%"></span></span>
              <span class="mn-mesh-bar__label">63%</span>
            </div>
            <p class="mn-mesh-node__stats">0 active tasks · cold standby · latency 21ms</p>
            <div class="mn-mesh-node__actions">
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↻</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">↑</span></button>
              <button class="mn-mesh-action"><span class="mn-icon mn-icon--xs">☁</span></button>
            </div>
          </article>
        </div>

        <div class="mn-mesh-network__footer mn-mesh-network__bottom">
          <span class="mn-mesh-network__title">◆ AUGMENTED BRAIN</span>
          <span class="mn-mesh-node__stats">3/3 online · 8 sessions · 2 plans · 12 tasks · 36 synapses</span>
        </div>
      </div>
    </section>
  `;
}

export function createMeshNetworkSection() {
  const template = document.createElement('template');
  template.innerHTML = meshNetworkSection().trim();
  const section = template.content.firstElementChild;
  section.classList.add('mn-section-dark');
  section.innerHTML = `<div class="mn-container">${section.innerHTML}</div>`;
  return section;
}
