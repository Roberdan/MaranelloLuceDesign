export function createLaunchSection() {
  const section = document.createElement('section');
  section.id = 'launch';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <section style="min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--arancio-caldo,#FF8A3D),var(--rosso-corsa));padding:var(--space-3xl) 0">
      <div style="position:absolute;inset:auto 0 12%;text-align:center;font-family:var(--font-display);font-size:clamp(5rem,18vw,14rem);font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.08);pointer-events:none">LAUNCH</div>
      <div class="mn-container" style="position:relative;z-index:1;text-align:center;color:var(--mn-text)">
        <div class="mn-label" style="color:rgba(255,255,255,.72);margin-bottom:var(--space-sm)">OPEN SOURCE DASHBOARD KIT</div>
        <h2 class="mn-title-section" style="margin-bottom:var(--space-md);color:var(--mn-text)">READY TO EXPLORE?</h2>
        <p class="mn-body" style="max-width:640px;margin:0 auto var(--space-lg);color:rgba(255,255,255,.88)">Maranello Luce Design is open source. Build beautiful dashboards today.</p>
        <details class="mn-code-snippet" style="max-width:540px;margin:0 auto var(--space-2xl);text-align:left"><summary class="mn-label" style="cursor:pointer;color:rgba(255,255,255,.9);margin-bottom:var(--space-sm)">⟨/⟩ Install</summary><pre style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;background:rgba(0,0,0,.4);border-radius:8px;border-left:3px solid rgba(255,255,255,.5)"><code>npm install github:Roberdan/MaranelloLuceDesign#v4.2.0</code></pre></details>
        <div style="display:flex;justify-content:center;gap:var(--space-md);flex-wrap:wrap">
          <a href="#api-reference" class="mn-btn mn-btn--white">GET STARTED</a>
          <a href="https://github.com/Roberdan/MaranelloLuceDesign" class="mn-btn mn-btn--ghost-light">VIEW ON GITHUB</a>
        </div>
      </div>
    </section>`;
  return section;
}
