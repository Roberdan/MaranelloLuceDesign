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
        <span class="mn-micro" style="display:inline-block;padding:4px 16px;border:1px solid var(--mn-accent);border-radius:999px;color:var(--mn-accent);letter-spacing:0.12em;font-weight:600;margin-bottom:var(--space-lg)">INTERACTIVE DEMO</span>
      </div>

      <p class="mn-section-number" style="letter-spacing:0.2em;margin-bottom:var(--space-md)">MARANELLO LUCE DESIGN SYSTEM</p>

      <h1 class="mn-title-hero" style="font-size:clamp(3rem,8vw,6rem);margin-bottom:var(--space-sm);line-height:0.95">
        <span style="color:var(--mn-accent)">Mirror</span><span style="color:var(--bianco-caldo,#f5f5f5)">Design</span>
      </h1>

      <div class="mn-divider-gold--accent mn-divider-gold" style="margin:var(--space-lg) auto"></div>

      <h2 class="mn-title-sub" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xl);font-weight:400;letter-spacing:0.1em">
        MIRRORDESIGN OPERATIONS DASHBOARD
      </h2>

      <p class="mn-body" style="max-width:640px;margin:0 auto var(--space-2xl);color:var(--grigio-medio);line-height:1.7">
        A fictional demonstration of the Maranello Luce Design System — Ferrari-inspired
        dashboards for agent orchestration, model routing, token budgets, and inference pipelines.
        Maranello Luce is an <strong style="color:var(--grigio-chiaro)">agentic AI operations platform</strong>.
      </p>

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
          <div class="mn-micro" style="color:var(--azzurro-chiaro,#4EA8DE);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">PRECISION</div>
          <div class="mn-micro" style="color:var(--grigio-medio);font-size:0.6rem">90+ Components</div>
        </div>
        <div style="text-align:center">
          <canvas id="hero-speedo-4" width="140" height="140" style="width:140px;height:140px"></canvas>
          <div class="mn-micro" style="color:var(--rosso-corsa,#DC0000);margin-top:var(--space-xs);font-weight:600;letter-spacing:0.1em">ELEGANCE</div>
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

      <div style="margin-top:var(--space-2xl);display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap">
        <button class="mn-btn mn-btn--accent" onclick="document.getElementById('dashboard').scrollIntoView({behavior:'smooth'})">Explore Dashboard ↓</button>
        <button class="mn-btn mn-btn--ghost-light" onclick="document.getElementById('charts').scrollIntoView({behavior:'smooth'})">View Charts</button>
      </div>

      <p class="mn-micro" style="margin-top:var(--space-3xl);color:var(--grigio-scuro)">
        Scroll to explore 25+ component sections · (c) Roberdan 2026 · MIT License
      </p>
    </div>
  `;

  setTimeout(() => {
    const M = window.Maranello;
    if (M?.speedometer) {
      M.speedometer(section.querySelector('#hero-speedo-1'), {
        value: 100, max: 100, unit: '%', size: 'sm',
        ticks: [0, 25, 50, 75, 100], needleColor: '#FFC72C', arcColor: '#FFC72C',
        subLabel: 'AA', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-2'), {
        value: 95, max: 100, unit: '%', size: 'sm',
        ticks: [0, 25, 50, 75, 100], needleColor: '#00A651', arcColor: '#00A651',
        subLabel: '0 deps', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-3'), {
        value: 90, max: 100, unit: '', size: 'sm',
        ticks: [0, 25, 50, 75, 100], needleColor: '#4EA8DE', arcColor: '#4EA8DE',
        subLabel: '90+', animate: true,
      });
      M.speedometer(section.querySelector('#hero-speedo-4'), {
        value: 100, max: 100, unit: '%', size: 'sm',
        ticks: [0, 25, 50, 75, 100], needleColor: '#DC0000', arcColor: '#DC0000',
        subLabel: 'Luce', animate: true,
      });
    }
  }, 300);

  return section;
}
