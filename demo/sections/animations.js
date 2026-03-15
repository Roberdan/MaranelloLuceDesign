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
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;div class="mn-anim-fadeInUp"&gt;Fades in from below&lt;/div&gt;
&lt;div class="mn-anim-fadeIn"&gt;Simple fade&lt;/div&gt;
&lt;div class="mn-anim-slideInLeft"&gt;Slides from left&lt;/div&gt;
&lt;span class="mn-anim-pulseDot"&gt;&lt;/span&gt; &lt;!-- live status dot --&gt;</code></pre>
      </details>

      <div class="mn-demo-section-label mn-mt-2xl">Entrance Animations</div>
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

      <div class="mn-demo-section-label">Attention Animations</div>
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

      <div class="mn-demo-section-label">Skeleton Loading</div>
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

      <div class="mn-demo-section-label">Hover Effects</div>
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

      <div class="mn-demo-section-label">Composable Dashboard Grid</div>
      <!-- Dashboard header toolbar -->
      <div style="display:flex;align-items:center;gap:var(--space-md);padding:12px 16px;background:linear-gradient(180deg,rgba(255,199,44,0.06),transparent);border:1px solid var(--grigio-scuro,#333);border-radius:var(--radius-md) var(--radius-md) 0 0;margin-bottom:0">
        <div style="display:flex;gap:var(--space-sm);align-items:center">
          <button class="mn-btn-cluster__item mn-btn-cluster__item--active" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="Grid view" aria-label="Grid view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="5" height="5"/><rect x="9.5" y="1.5" width="5" height="5"/><rect x="1.5" y="9.5" width="5" height="5"/><rect x="9.5" y="9.5" width="5" height="5"/></svg>
          </button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="List view" aria-label="List view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="3"/><line x1="3" y1="8" x2="13" y2="8"/><line x1="3" y1="13" x2="13" y2="13"/></svg>
          </button>
          <button class="mn-btn-cluster__item" style="padding:6px 8px;display:flex;align-items:center;justify-content:center" title="Compact view" aria-label="Compact view">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2" width="13" height="3"/><rect x="1.5" y="7" width="13" height="3"/><rect x="1.5" y="12" width="13" height="2.5"/></svg>
          </button>
          <button class="mn-btn mn-btn--ghost mn-btn--sm" style="padding:6px 10px">Filters</button>
        </div>
        <div style="flex:1;display:flex;justify-content:center">
          <div style="display:flex;align-items:center;gap:var(--space-sm);max-width:400px;width:100%;background:var(--superficie-1);border:1px solid var(--grigio-scuro);border-radius:var(--radius-md);padding:var(--space-xs) var(--space-md)">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--grigio-medio)" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><line x1="10.4" y1="10.4" x2="14" y2="14"/></svg>
            <input type="text" placeholder="Filter by name, program..." style="flex:1;background:none;border:none;color:var(--mn-text-muted);font-family:var(--font-body);outline:none">
          </div>
        </div>
        <div style="display:flex;gap:var(--space-sm);align-items:center">
          <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-size:0.65rem;color:var(--grigio-medio)">⌘K</kbd>
          <button class="mn-machined-btn" style="padding:4px 8px;display:flex;align-items:center;justify-content:center" title="Sort" aria-label="Sort">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 3h8"/><path d="M6 8h6"/><path d="M8 13h4"/><path d="M4 3v10"/></svg>
          </button>
          <button class="mn-machined-btn" style="padding:4px 8px;display:flex;align-items:center;justify-content:center" title="Settings" aria-label="Settings">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.1 3.1l1 1M11.9 11.9l1 1M12.9 3.1l-1 1M4.1 11.9l-1 1"/></svg>
          </button>
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
