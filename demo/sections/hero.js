/**
 * Hero section — stunning above-the-fold showcase
 * Uses mn-title-hero typography + inline gauges + KPI strip
 */
export function createHeroSection() {
  const section = document.createElement('section');
  section.id = 'hero';
  section.className = 'mn-section-dark';
  section.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden';
  section.innerHTML = `
    <div style="position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(255,199,44,0.06) 0%,transparent 70%);pointer-events:none"></div>

    <div class="mn-container" style="text-align:center;position:relative;z-index:1">
      <div style="margin-bottom:var(--space-xl)">
        <span class="mn-micro" style="display:inline-flex;align-items:center;gap:6px;padding:4px 16px;border:1px solid var(--mn-accent);border-radius:999px;color:var(--mn-accent);letter-spacing:0.12em;font-weight:600;margin-bottom:var(--space-lg)">INTERACTIVE DEMO · <span style="color:var(--mn-error)">BETA</span></span>
      </div>

      <p class="mn-section-number" style="letter-spacing:0.2em;margin-bottom:var(--space-md)">MARANELLO LUCE DESIGN SYSTEM · FOR AI AGENTS</p>

      <h1 class="mn-title-hero" style="font-size:clamp(3rem,8vw,6rem);margin-bottom:var(--space-sm);line-height:0.95">
        <span style="color:var(--mn-accent)">Maranello</span> <span style="color:var(--mn-text)">Luce</span> <span style="color:var(--grigio-alluminio)">Design</span>
      </h1>

      <div class="mn-divider-gold--accent mn-divider-gold" style="margin:var(--space-lg) auto"></div>

      <h2 class="mn-title-sub" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xl);font-weight:400;letter-spacing:0.1em">
        DESIGN SYSTEM FOR AGENTIC AI DASHBOARDS
      </h2>

      <p class="mn-body" style="max-width:640px;margin:0 auto var(--space-lg);color:var(--grigio-medio);line-height:1.7">
        Inspired by the <a href="https://www.ferrari.com/it-IT/auto/ferrari-luce" target="_blank" style="color:var(--mn-accent);text-decoration:none;border-bottom:1px solid rgba(255,199,44,0.4)">Ferrari Luce</a> interior design language —
        warm leather tones, precision instruments, and cockpit-grade controls.
        90+ components, 5 themes, Canvas 2D engines for <strong style="color:var(--mn-text-muted)">agentic AI operations</strong>.
      </p>
      <p class="mn-micro" style="max-width:640px;margin:0 auto var(--space-lg);color:var(--grigio-medio);text-align:center">
        Part of <a href="https://github.com/Roberdan/MyConvergio" target="_blank" style="color:var(--mn-accent);text-decoration:none">Convergio</a> · Aligned with the <a href="https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md" target="_blank" style="color:var(--mn-accent);text-decoration:none">Agentic Manifesto</a>
      </p>

      <div style="display:flex;gap:var(--space-md);justify-content:center;align-items:center;margin-bottom:var(--space-xl)">
        <a href="https://github.com/Roberdan/MaranelloLuceDesign" target="_blank" style="text-decoration:none">
          <img src="https://img.shields.io/github/stars/Roberdan/MaranelloLuceDesign?style=social" alt="GitHub Stars">
        </a>
        <a href="https://github.com/Roberdan/MaranelloLuceDesign" target="_blank" style="color:var(--mn-accent);text-decoration:none;font-family:var(--font-display);font-size:var(--text-micro);letter-spacing:0.08em;text-transform:uppercase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:4px"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          VIEW ON GITHUB
        </a>
      </div>

      <div class="mn-card-dark" style="max-width:640px;margin:0 auto var(--space-2xl);padding:var(--space-lg) var(--space-xl);border-left:3px solid var(--mn-accent);text-align:left">
        <p class="mn-label" style="color:var(--mn-accent);margin-bottom:var(--space-sm);letter-spacing:0.1em">FROM THE AGENTIC MANIFESTO</p>
        <p class="mn-body" style="color:var(--mn-text-muted);font-style:italic;line-height:1.8;margin-bottom:var(--space-sm)">
          &ldquo;Intent is human, momentum is agent. Impact must reach every mind and body.
          We design from the edge first: disability, language, connectivity.&rdquo;
        </p>
        <p class="mn-micro" style="color:var(--grigio-medio)">
          &mdash; Roberto D&rsquo;Angelo · Claude 3 · OpenAI o3 &middot; Milano, June 2025
          &middot; <a href="https://github.com/Roberdan/MyConvergio/blob/master/AgenticManifesto.md" target="_blank" style="color:var(--mn-accent);text-decoration:none">Read full manifesto</a>
        </p>
      </div>

      <div style="display:flex;gap:var(--space-2xl);justify-content:center;flex-wrap:wrap;margin-bottom:var(--space-2xl)">
        <div style="text-align:center">
          <canvas id="hero-speedo-1" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--mn-accent);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">INCLUSION</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">WCAG 2.2 AA</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-2" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--verde-racing);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">PERFORMANCE</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">Zero Dependencies</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-3" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--signal-info);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">PRECISION</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">90+ Components</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-4" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--signal-danger);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">ELEGANCE</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">Ferrari Luce DNA</div>
        </div>
      </div>

      <div class="mn-stat-row">
        <div class="mn-stat">
          <div class="mn-stat__value" style="color:var(--mn-accent)">284.7</div>
          <div class="mn-stat__unit">$k</div>
          <div class="mn-stat__label">Total Token Spend</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value">312</div>
          <div class="mn-stat__unit">agents</div>
          <div class="mn-stat__label">Active Agents</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value" style="color:var(--verde-racing)">14,560</div>
          <div class="mn-stat__unit">tasks</div>
          <div class="mn-stat__label">Tasks Completed</div>
        </div>
        <div class="mn-stat">
          <div class="mn-stat__value">18,340</div>
          <div class="mn-stat__unit">hrs</div>
          <div class="mn-stat__label">Compute Hours</div>
        </div>
      </div>

      <details class="mn-code-snippet" style="max-width:640px;margin:var(--space-2xl) auto 0;text-align:left">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Install</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>npm install github:Roberdan/MaranelloLuceDesign#v4.2.0

&lt;!-- CDN --&gt;
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v4.2.0/dist/css/index.css"&gt;
&lt;script src="https://cdn.jsdelivr.net/gh/Roberdan/MaranelloLuceDesign@v4.2.0/dist/iife/maranello.min.js"&gt;&lt;/script&gt;</code></pre>
      </details>

      <div style="margin-top:var(--space-2xl);display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap">
        <button class="mn-btn mn-btn--accent" onclick="document.getElementById('dashboard').scrollIntoView({behavior:'smooth'})">Explore Dashboard ↓</button>
        <button class="mn-btn mn-btn--ghost-light" onclick="document.getElementById('charts').scrollIntoView({behavior:'smooth'})">View Charts</button>
      </div>

      <p class="mn-micro" style="margin-top:var(--space-3xl);color:var(--grigio-scuro)">
        Scroll to explore 25+ component sections · (c) Roberdan 2026 · MPL-2.0 License
      </p>
    </div>
  `;

  setTimeout(() => {
    const M = window.Maranello;
    if (M?.speedometer) {
      const p = M.palette();
      const accent = p.accent;
      const success = p.signalOk;
      const info = p.signalInfo;
      const danger = p.signalDanger;
      const ticks = [0, 25, 50, 75, 100];
      M.speedometer(section.querySelector('#hero-speedo-1'), {
        value: 100, max: 100, unit: '%', size: 'sm',
        ticks, needleColor: accent, arcColor: accent,
        subLabel: 'AA', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-2'), {
        value: 95, max: 100, unit: '%', size: 'sm',
        ticks, needleColor: success, arcColor: success,
        subLabel: '0 deps', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-3'), {
        value: 90, max: 100, unit: '', size: 'sm',
        ticks, needleColor: info, arcColor: info,
        subLabel: '90+', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-4'), {
        value: 100, max: 100, unit: '%', size: 'sm',
        ticks, needleColor: danger, arcColor: danger,
        subLabel: 'Luce', animate: true,
      });
    }
  }, 300);

  return section;
}
