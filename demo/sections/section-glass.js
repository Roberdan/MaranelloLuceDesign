/**
 * Glass & Theme Rotary section — Liquid glass showcase + dual-level rotary demo
 */

export function createGlassSection() {
  const section = document.createElement('section');
  section.id = 'glass';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">✦ — Liquid Glass</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-2xl)">Glass Theme &amp; Rotary</h2>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2xl);align-items:start">
        <!-- Left: Theme Rotary -->
        <div>
          <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Dual-Level Theme Rotary</h3>
          <p class="mn-body" style="margin-bottom:var(--space-lg);color:var(--grigio-chiaro)">
            Outer ring selects theme (ED / NR / AV / CB). Center button toggles glass overlay.
          </p>
          <div id="glass-rotary-mount" style="display:flex;justify-content:center;padding:var(--space-xl) 0"></div>
          <div id="glass-status" class="mn-micro" style="text-align:center;color:var(--grigio-medio);margin-top:var(--space-sm)">
            Theme: editorial · Glass: off
          </div>
        </div>

        <!-- Right: Glass Preview Cards -->
        <div>
          <h3 class="mn-title-sub" style="margin-bottom:var(--space-lg)">Glass Surface Preview</h3>
          <div style="display:flex;flex-direction:column;gap:var(--space-md)">
            <div class="mn-card" style="padding:var(--space-lg)">
              <div class="mn-card__title">Revenue Pipeline</div>
              <div class="mn-card__text">Glass surfaces adapt to each theme variant with translucent tints and backdrop blur.</div>
            </div>
            <div class="mn-card" style="padding:var(--space-lg)">
              <div class="mn-card__title">Team Velocity</div>
              <div class="mn-card__text">Toggle glass mode to see cards, inputs, and panels become translucent with depth.</div>
            </div>
            <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
              <button class="mn-btn">Primary</button>
              <button class="mn-btn mn-btn--ghost">Ghost</button>
              <span class="mn-tag">Tag</span>
              <span class="mn-tag mn-tag--active">Active</span>
            </div>
            <input class="mn-input" placeholder="Glass input preview…" style="width:100%">
          </div>
        </div>
      </div>

      <!-- Glass API Reference -->
      <div style="margin-top:var(--space-2xl)">
        <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Glass API</h3>
        <div class="mn-table-wrap">
          <table class="mn-table">
            <thead><tr><th>Function</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>setGlass(true)</code></td><td>Enable glass overlay on current theme</td></tr>
              <tr><td><code>toggleGlass()</code></td><td>Toggle glass on/off, returns new state</td></tr>
              <tr><td><code>getGlass()</code></td><td>Check if glass mode is active</td></tr>
              <tr><td><code>themeRotary({container})</code></td><td>Create dual-level rotary controller</td></tr>
              <tr><td><code>&lt;mn-theme-rotary&gt;</code></td><td>Web Component with shadow DOM</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Web Component demo -->
      <div style="margin-top:var(--space-2xl)">
        <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Web Component</h3>
        <div style="display:flex;justify-content:center;padding:var(--space-xl) 0">
          <mn-theme-rotary size="160"></mn-theme-rotary>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const mount = section.querySelector('#glass-rotary-mount');
    const status = section.querySelector('#glass-status');
    if (!mount) return;

    if (window.Maranello?.themeRotary) {
      window.Maranello.themeRotary({
        container: mount,
        size: 160,
        onChange: (theme, glass) => {
          if (status) status.textContent = `Theme: ${theme} · Glass: ${glass ? 'on' : 'off'}`;
        },
      });
    }
  });

  return section;
}
