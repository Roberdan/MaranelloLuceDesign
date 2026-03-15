/**
 * Tokens section — complete design token showcase
 */

function swatch(name, varName) {
  return `<div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs)">
    <div style="width:36px;height:36px;border-radius:var(--radius-sm);background:var(${varName});border:1px solid var(--grigio-scuro)"></div>
    <div>
      <div class="mn-micro" style="font-weight:600">${name}</div>
      <div class="mn-micro" style="color:var(--grigio-medio)">${varName}</div>
    </div>
  </div>`;
}

function typeSample(cls, text) {
  return `<div style="margin-bottom:var(--space-md)">
    <span class="mn-micro" style="color:var(--grigio-medio)">.${cls}</span>
    <div class="${cls}" style="text-align:left;max-width:none;margin:0">${text}</div>
  </div>`;
}

export function createTokensSection() {
  const section = document.createElement('section');
  section.id = 'tokens';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">01 — Design Tokens</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Colors & Typography</h2>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>.element {
  color: var(--mn-text);
  background: var(--mn-surface);
  border-color: var(--mn-accent); /* #FFC72C editorial/nero, #DC0000 avorio */
  font-family: var(--font-display); /* Outfit */
}</code></pre>
      </details>

      <!-- Nero Scale -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Nero Scale (Dark)</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch('Assoluto', '--nero-assoluto')}
          ${swatch('Profondo', '--nero-profondo')}
          ${swatch('Carbon', '--nero-carbon')}
          ${swatch('Soft', '--nero-soft')}
        </div>
        <div>
          ${swatch('Nero 1', '--nero-1')}
          ${swatch('Nero 2', '--nero-2')}
          ${swatch('Nero 3', '--nero-3')}
        </div>
        <div>
          <h4 class="mn-label" style="margin-bottom:var(--space-sm);color:var(--mn-accent)">Grigio Scale</h4>
          ${swatch('Grigio Scuro', '--grigio-scuro')}
          ${swatch('Grigio Medio', '--grigio-medio')}
          ${swatch('Grigio Chiaro', '--grigio-chiaro')}
          ${swatch('Grigio 4', '--grigio-4')}
        </div>
        <div>
          <h4 class="mn-label" style="margin-bottom:var(--space-sm);color:var(--mn-accent)">Avorio Scale</h4>
          ${swatch('Bianco Caldo', '--bianco-caldo')}
          ${swatch('Avorio', '--avorio')}
          ${swatch('Avorio Scuro', '--avorio-scuro')}
        </div>
      </div>

      <!-- Accent Colors -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Accent Colors</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch('Giallo Ferrari', '--giallo-ferrari')}
          ${swatch('MN Accent', '--mn-accent')}
        </div>
        <div>
          ${swatch('Rosso Corsa', '--rosso-corsa')}
          ${swatch('Arancio Warm', '--arancio-warm')}
        </div>
        <div>
          ${swatch('Verde Racing', '--verde-racing')}
          ${swatch('Verde', '--verde')}
        </div>
        <div>
          ${swatch('Blu Info', '--blu-info')}
        </div>
      </div>

      <!-- Signal / Semantic Colors -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Signal & Semantic</h3>
      <div class="mn-grid-4" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch('Active', '--status-active')}
          ${swatch('Signal Success', '--signal-success')}
        </div>
        <div>
          ${swatch('Warning', '--status-warning')}
          ${swatch('Signal Warning', '--signal-warning')}
        </div>
        <div>
          ${swatch('Danger', '--status-danger')}
          ${swatch('Signal Danger', '--signal-danger')}
        </div>
        <div>
          ${swatch('Info', '--status-info')}
          ${swatch('Signal Info', '--signal-info')}
        </div>
      </div>

      <!-- Surface / Border Tokens -->
      <h3 class="mn-title-sub" style="margin-bottom:var(--space-md)">Surfaces & Borders</h3>
      <div class="mn-grid-3" style="margin-bottom:var(--space-2xl)">
        <div>
          ${swatch('Superficie 1', '--superficie-1')}
          ${swatch('Superficie 2', '--superficie-2')}
          ${swatch('Superficie 3', '--superficie-3')}
        </div>
        <div>
          ${swatch('Bordo', '--bordo')}
          ${swatch('Bordo Light', '--bordo-light')}
        </div>
        <div>
          ${swatch('Chart Default', '--chart-default')}
          ${swatch('Chart Alt', '--chart-alt')}
        </div>
      </div>

      <!-- Typography Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Typography Scale</h3>
      <div style="max-width:700px;margin:0 auto;margin-bottom:var(--space-2xl)">
        ${typeSample('mn-watermark', 'Watermark')}
        ${typeSample('mn-title-hero', 'Hero Title')}
        ${typeSample('mn-title-section', 'Section Title')}
        ${typeSample('mn-title-sub', 'Sub Title')}
        ${typeSample('mn-body', 'Body text for paragraphs and content')}
        ${typeSample('mn-label', 'Label Text')}
        ${typeSample('mn-caption', 'Caption text for supporting context')}
        ${typeSample('mn-micro', 'Micro — smallest text size')}
      </div>

      <!-- Spacing Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Spacing Scale</h3>
      <div style="display:flex;gap:var(--space-md);flex-wrap:wrap;justify-content:center;margin-bottom:var(--space-2xl)">
        ${['2xs','xs','sm','md','lg','xl','2xl','3xl'].map(s =>
          `<div style="text-align:center">
            <div style="width:var(--space-${s});height:var(--space-${s});background:var(--mn-accent);border-radius:var(--radius-sm);margin:0 auto var(--space-xs)"></div>
            <span class="mn-micro">${s}</span>
          </div>`
        ).join('')}
      </div>

      <!-- Radius Scale -->
      <h3 class="mn-title-sub" style="text-align:center;margin-bottom:var(--space-xl)">Border Radius</h3>
      <div style="display:flex;gap:var(--space-lg);flex-wrap:wrap;justify-content:center">
        ${['sm','md','lg','xl','full'].map(r =>
          `<div style="text-align:center">
            <div style="width:48px;height:48px;background:var(--mn-accent);border-radius:var(--radius-${r});margin:0 auto var(--space-xs)"></div>
            <span class="mn-micro">${r}</span>
          </div>`
        ).join('')}
      </div>
    </div>
  `;
  return section;
}
