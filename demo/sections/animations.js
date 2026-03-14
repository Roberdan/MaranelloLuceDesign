/**
 * Animations section — entrance animations, attention effects,
 * skeleton loading, composable dashboard grid.
 */
export function createAnimationsSection() {
  const section = document.createElement('section');
  section.id = 'animations';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">07 / MOVIMENTO · ANIMAZIONI</p>
      <div class="mn-watermark">MOVIMENTO</div>
      <h2 class="mn-title-section mn-mb-sm">Animations</h2>
      <p class="mn-body mn-mb-2xl">Subtle motion guides the eye. Every animation respects <code>prefers-reduced-motion</code>.</p>

      <div class="demo-section-label mn-mt-2xl">Entrance Animations</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl" style="align-items:stretch" id="anim-entrance-row">
        <div class="mn-panel" data-anim="mn-anim-fadeIn" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeIn</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-fadeInUp" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeInUp</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-fadeInLeft" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">fadeInLeft</span>
        </div>
        <div class="mn-panel" data-anim="mn-anim-scaleIn" style="min-width:120px;text-align:center;padding:var(--space-md);opacity:0">
          <span class="mn-micro mn-text-muted">scaleIn</span>
        </div>
      </div>
      <div class="mn-mb-lg">
        <button class="mn-btn mn-btn--ghost mn-btn--sm" id="anim-replay-entrance">↺ Replay Entrance</button>
      </div>

      <div class="demo-section-label">Attention Animations</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        <div class="mn-panel mn-anim-pulse" style="padding:var(--space-md)">
          <span class="mn-micro mn-text-muted">pulse</span>
        </div>
        <span class="mn-status mn-status--danger">
          <span class="mn-status__dot mn-anim-pulseDot"></span>
          Live Alert
        </span>
        <span class="mn-led mn-led--red mn-anim-blink">
          <span class="mn-led__housing"><span class="mn-led__bulb"></span></span>
          <span class="mn-led__text">Blink</span>
        </span>
        <span class="mn-led mn-led--amber">
          <span class="mn-led__housing"><span class="mn-led__bulb"></span></span>
          <span class="mn-led__text">Processing</span>
        </span>
      </div>

      <div class="demo-section-label">Skeleton Loading</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:flex-start">
        <div class="mn-flex-col mn-gap-sm" style="min-width:240px">
          <div class="mn-shimmer mn-shimmer--bar" style="width:80%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:60%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:90%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:50%"></div>
        </div>
        <div class="mn-flex-col mn-gap-sm" style="min-width:240px">
          <div class="mn-flex-center mn-gap-sm">
            <div class="mn-shimmer mn-shimmer--circle"></div>
            <div class="mn-flex-col mn-gap-xs" style="flex:1">
              <div class="mn-shimmer mn-shimmer--bar" style="width:70%"></div>
              <div class="mn-shimmer mn-shimmer--bar" style="width:50%"></div>
            </div>
          </div>
          <div class="mn-flex-center mn-gap-sm">
            <div class="mn-shimmer mn-shimmer--circle"></div>
            <div class="mn-flex-col mn-gap-xs" style="flex:1">
              <div class="mn-shimmer mn-shimmer--bar" style="width:85%"></div>
              <div class="mn-shimmer mn-shimmer--bar" style="width:40%"></div>
            </div>
          </div>
        </div>
        <div class="mn-panel" style="padding:var(--space-md);min-width:180px">
          <div class="mn-shimmer mn-shimmer--bar" style="width:60%;margin-bottom:var(--space-sm)"></div>
          <div class="mn-shimmer mn-shimmer--rect" style="height:80px;margin-bottom:var(--space-sm)"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:80%"></div>
          <div class="mn-shimmer mn-shimmer--bar" style="width:50%;margin-top:var(--space-xs)"></div>
        </div>
      </div>

      <div class="demo-section-label">Hover Effects</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <div class="mn-panel mn-hover-lift" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">hover-lift</span>
        </div>
        <div class="mn-panel mn-hover-glow" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">hover-glow</span>
        </div>
        <div class="mn-panel" style="padding:var(--space-md);min-width:120px;text-align:center">
          <span class="mn-micro mn-text-muted">default panel</span>
        </div>
      </div>

      <div class="demo-section-label">Composable Dashboard Grid</div>
      <!-- Dashboard header toolbar -->
      <div style="display:flex;align-items:center;gap:var(--space-md);padding:12px 16px;background:linear-gradient(180deg,rgba(255,199,44,0.06),transparent);border:1px solid var(--grigio-scuro,#333);border-radius:var(--radius-md) var(--radius-md) 0 0;margin-bottom:0">
        <span class="mn-label" style="color:var(--mn-accent);font-size:0.75rem;letter-spacing:0.06em">MARANELLO<span style="color:var(--grigio-alluminio)"> LUCE</span></span>
        <div style="display:flex;gap:2px;margin-left:var(--space-md)">
          <button class="mn-btn-cluster__item mn-btn-cluster__item--active" style="padding:6px 8px;font-size:0.6rem" title="Dashboard">▦</button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;font-size:0.6rem" title="Table">☰</button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;font-size:0.6rem" title="Cards">▧</button>
        </div>
        <div style="flex:1"></div>
        <div style="display:flex;align-items:center;gap:6px;padding:4px 12px;border:1px solid var(--grigio-scuro,#333);border-radius:4px;font-size:0.7rem;color:var(--grigio-medio)">
          <span>Filters</span><span style="color:var(--grigio-scuro)">|</span><span style="opacity:0.5">Filter by name, program…</span>
          <span class="mn-micro" style="margin-left:var(--space-lg);padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:3px;font-size:0.55rem">⌘K</span>
        </div>
        <div style="display:flex;gap:4px;margin-left:var(--space-md)">
          <button class="mn-machined-btn" style="padding:4px 8px;font-size:0.65rem" title="Refresh">↻</button>
          <button class="mn-machined-btn" style="padding:4px 8px;font-size:0.65rem" title="Settings">⚙</button>
        </div>
      </div>
      <div class="mn-dashboard mn-mb-2xl" style="border:1px solid var(--grigio-scuro,#333);border-top:0;border-radius:0 0 var(--radius-md) var(--radius-md);padding-top:var(--space-md)">
        <div class="mn-cell-3">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--bar mn-mb-sm" style="width:60%;margin:0 auto var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">3 col · KPI</span>
          </div>
        </div>
        <div class="mn-cell-6">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--rect" style="height:60px;margin-bottom:var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">6 col · Chart</span>
          </div>
        </div>
        <div class="mn-cell-3">
          <div class="mn-panel mn-hover-lift" style="text-align:center;padding:var(--space-md)">
            <div class="mn-shimmer mn-shimmer--circle" style="margin:0 auto var(--space-sm)"></div>
            <span class="mn-micro mn-text-muted">3 col · Gauge</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel mn-hover-glow" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
        <div class="mn-cell-8">
          <div class="mn-panel" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">8 col · Wide panel</span>
          </div>
        </div>
        <div class="mn-cell-4">
          <div class="mn-panel" style="text-align:center;padding:var(--space-md)">
            <span class="mn-micro mn-text-muted">4 col</span>
          </div>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => initAnimations(section));
  return section;
}

function initAnimations(section) {
  const replayBtn = section.querySelector('#anim-replay-entrance');
  const entranceRow = section.querySelector('#anim-entrance-row');
  if (!replayBtn || !entranceRow) return;

  function playEntrance() {
    const panels = entranceRow.querySelectorAll('.mn-panel[data-anim]');
    panels.forEach((panel, i) => {
      const cls = panel.dataset.anim;
      panel.classList.remove(cls);
      panel.style.opacity = '0';
      void panel.offsetWidth;
      setTimeout(() => {
        panel.style.opacity = '';
        panel.classList.add(cls);
      }, i * 120);
    });
  }

  // Play on first render
  setTimeout(playEntrance, 200);

  replayBtn.addEventListener('click', playEntrance);

  if (window.Maranello?.initScrollReveal) {
    window.Maranello.initScrollReveal();
  }
}
