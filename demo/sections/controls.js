const TEMP_BADGES = [
  ['20°', '#DC0000', ''], ['18°', '#4EA8DE', ''], ['24°', '#FFC72C', ''],
  ['–', 'var(--grigio-scuro)', ''], ['22°', '#DC0000', ' mn-temp-badge--lg'], ['16°', '#4EA8DE', ''],
];

export function createControlsSection() {
  const section = document.createElement('section');
  section.id = 'controls';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <style>
      #controls .mn-temp-badge{--temp-size:44px;display:inline-flex;align-items:center;justify-content:center;width:var(--temp-size);height:var(--temp-size);border-radius:50%;border:2px solid var(--temp-color);background:rgba(0,0,0,.55);color:var(--bianco-caldo);font-family:var(--font-display);font-size:.9rem;font-weight:700;line-height:1;text-align:center;box-shadow:0 0 0 1px rgba(255,255,255,.06) inset}
      #controls .mn-temp-badge--lg{--temp-size:56px;border-width:3px;font-size:1.1rem}
    </style>
    <div class="mn-container">
      <p class="mn-section-number">05 / INTERIOR · CONTROLS</p>
      <div class="mn-watermark">COMANDI</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Ferrari Controls</h2>
      <p class="mn-body mn-mb-2xl">Every switch, knob and button feels milled from solid aluminum. Haptic precision in every interaction.</p>
      <div class="demo-section-label mn-mt-2xl">Machined Aluminum Buttons</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-lg" style="align-items:center">
        <button class="mn-machined-btn"><span class="mn-machined-btn__indicator"></span>Engine Start</button>
        <button class="mn-machined-btn mn-machined-btn--amber"><span class="mn-machined-btn__indicator"></span>Launch Control</button>
        <button class="mn-machined-btn mn-machined-btn--off"><span class="mn-machined-btn__indicator"></span>Standby</button>
        <button class="mn-machined-btn mn-machined-btn--pressed"><span class="mn-machined-btn__indicator"></span>Pressed</button>
        <button class="mn-machined-btn" disabled><span class="mn-machined-btn__indicator"></span>Disabled</button>
      </div>
      <div class="demo-section-label">Toggle Switches</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        ${toggle('Auto-refresh', true)}${toggle('Night Mode', false)}${toggle('Alerts', true)}
      </div>
      <div class="demo-section-label">LED Indicators</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        ${led('green', 'System Online')}${led('amber', 'Processing')}${led('red mn-anim-blink', 'Critical Alert')}${led('off', 'Offline')}
      </div>
      <div class="demo-section-label">Temperature Badges</div>
      <div class="mn-mb-2xl" style="display:flex;gap:var(--space-lg);flex-wrap:wrap">${TEMP_BADGES.map(([label, color, mod]) => `<span class="mn-temp-badge${mod}" style="--temp-color:${color}">${label}</span>`).join('')}</div>
      <div class="demo-section-label">Slider Controls</div>
      <div class="mn-flex-col mn-gap-lg mn-mb-2xl" style="max-width:420px">${slider('ctrl-slider-1', 'Routing Intensity', 72)}${slider('ctrl-slider-2', 'Agent Capacity', 45)}</div>
      <div class="demo-section-label">Rotary Selectors</div>
      <div class="mn-flex-center mn-gap-2xl mn-flex-wrap mn-mb-2xl"><div id="ctrl-rotary-1"></div><div id="ctrl-rotary-2"></div></div>
      <div class="mn-divider-gold mn-my-2xl"></div>
      <h3 class="mn-title-sub mn-mb-sm">Advanced Cockpit Controls</h3>
      <p class="mn-caption mn-text-dim mn-mb-lg">Manettino, cruise lever, 3D toggle, stepped rotary — machined from solid aluminum.</p>
      <div class="mn-flex-wrap mn-gap-2xl mn-mb-2xl" style="align-items:flex-end">
        ${controlSlot('Manettino', 'ctrl-manettino')}${controlSlot('Cruise Lever', 'ctrl-cruise')}${controlSlot('Toggle Lever (On)', 'ctrl-lever-on')}${controlSlot('Toggle Lever (Off)', 'ctrl-lever-off')}${controlSlot('Stepped Rotary', 'ctrl-stepped')}
      </div>
      <div class="demo-section-label">Button Cluster (Steering Style)</div>
      <div class="mn-mb-2xl"><div class="mn-btn-cluster" style="--cluster-cols:4">${clusterButton('dashboard', true)}${clusterButton('chart')}${clusterButton('users')}${clusterButton('settings')}</div></div>
      <div class="demo-section-label">Segmented Control</div>
      <div class="mn-mb-2xl"><div class="mn-segmented" role="tablist" aria-label="View mode"><button class="mn-segmented__item" role="tab">Day</button><button class="mn-segmented__item mn-segmented__item--active" role="tab" aria-selected="true">Week</button><button class="mn-segmented__item" role="tab">Month</button><button class="mn-segmented__item" role="tab">Quarter</button></div></div>
      <div class="demo-section-label">Drag Rotary</div>
      <div class="mn-flex-center mn-gap-2xl mn-mb-2xl">
        <div id="ctrl-drag-rotary" class="mn-rotary" style="width:140px">
          <div class="mn-rotary__housing" style="width:120px;height:120px;border-radius:50%;background:var(--nero-2);border:2px solid var(--grigio-scuro);position:relative;margin:0 auto">
            <div class="mn-rotary__dial" style="position:absolute;inset:0;border-radius:50%"></div>
            <div class="mn-rotary__pointer" style="position:absolute;top:10%;left:50%;width:2px;height:40%;background:var(--mn-accent);transform-origin:bottom center"></div>
            <div class="mn-rotary__notches"></div>
          </div>
          <div class="mn-rotary__value mn-micro" style="text-align:center;margin-top:var(--space-xs);color:var(--mn-accent);font-weight:600"></div>
          <span class="mn-rotary__label mn-micro" style="display:block;text-align:center;margin-top:2px;color:var(--grigio-chiaro)">Drive Mode</span>
        </div>
      </div>
    </div>`;
  requestAnimationFrame(() => initControls(section));
  return section;
}

function initControls(section) {
  const M = window.Maranello;
  if (!M) return;
  if (M.initSlider) [['#ctrl-slider-1', 72, 'Routing Intensity', '#slider-1-val'], ['#ctrl-slider-2', 45, 'Agent Capacity', '#slider-2-val']].forEach(([id, value, label, out]) => {
    M.initSlider(section.querySelector(id), { value, min: 0, max: 100, label, onChange: (v) => { const el = section.querySelector(out); if (el) el.textContent = String(v); } });
  });
  if (M.initRotary) [{ id: '#ctrl-rotary-1', positions: ['Draft', 'Route', 'Infer', 'Validate', 'Archive'], label: 'Pipeline Stage', initial: 2 }, { id: '#ctrl-rotary-2', positions: ['Daily', 'Weekly', 'Monthly', 'Quarterly'], label: 'Report Frequency', initial: 1 }].forEach((cfg) => M.initRotary(section.querySelector(cfg.id), cfg));
  if (M.manettino) M.manettino(section.querySelector('#ctrl-manettino'), { positions: ['Draft', 'Route', 'Infer', 'Validate', 'Archive'], label: 'Pipeline Stage', initial: 2 });
  if (M.cruiseLever) M.cruiseLever(section.querySelector('#ctrl-cruise'), { positions: ['Off', 'Low', 'Medium', 'High', 'Urgent'], label: 'Priority', initial: 1 });
  if (M.toggleLever) [['#ctrl-lever-on', 'Auto-Assign', true], ['#ctrl-lever-off', 'Notifications', false]].forEach(([id, label, state]) => M.toggleLever(section.querySelector(id), { label, state }));
  if (M.steppedRotary) M.steppedRotary(section.querySelector('#ctrl-stepped'), { positions: ['S', 'M', 'L', 'XL'], label: 'Effort', initial: 1 });
  if (M.initDragRotary) M.initDragRotary(section.querySelector('#ctrl-drag-rotary'), { steps: ['Off', 'Eco', 'Normal', 'Sport', 'Race'], initial: 2 });
  if (M.icons) [['dashboard', M.icons.dashboard], ['chart', M.icons.barChart], ['users', M.icons.user], ['settings', M.icons.settings ?? M.icons.filter]].forEach(([id, fn]) => { const el = section.querySelector(`#ic-cluster-${id}`); if (el && fn) el.innerHTML = fn(); });
  activate(section, '.mn-btn-cluster__item', 'mn-btn-cluster__item--active');
  activate(section, '.mn-segmented__item', 'mn-segmented__item--active', (btn) => btn.setAttribute('aria-selected', 'true'), (btn) => btn.removeAttribute('aria-selected'));
}

function activate(section, selector, activeClass, onSet = () => {}, onUnset = () => {}) {
  section.querySelectorAll(selector).forEach((btn) => btn.addEventListener('click', () => {
    section.querySelectorAll(selector).forEach((item) => { item.classList.remove(activeClass); onUnset(item); });
    btn.classList.add(activeClass); onSet(btn);
  }));
}
function toggle(label, checked) { return `<label class="mn-toggle${checked ? ' mn-toggle--on' : ''}"><input type="checkbox"${checked ? ' checked' : ''}><span class="mn-toggle__track"><span class="mn-toggle__thumb"></span></span><span class="mn-toggle__label">${label}</span></label>`; }
function led(tone, text) { return `<span class="mn-led mn-led--${tone}"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">${text}</span></span>`; }
function slider(id, label, value) { return `<div><span class="mn-micro" style="color:var(--grigio-chiaro);display:block;margin-bottom:var(--space-xs)">${label}</span><div id="${id}" class="mn-slider" style="height:8px;border-radius:4px;background:var(--grigio-scuro);cursor:pointer;position:relative"><div class="mn-slider__track" style="position:absolute;inset:0;border-radius:4px"></div></div><div class="mn-micro" style="color:var(--grigio-medio);margin-top:var(--space-xs)"><span id="${id.replace('ctrl-', '')}-val">${value}</span>%</div></div>`; }
function controlSlot(label, id) { return `<div><div class="demo-section-label mn-mb-sm">${label}</div><div id="${id}"></div></div>`; }
function clusterButton(id, active = false) { return `<button class="mn-btn-cluster__item${active ? ' mn-btn-cluster__item--active' : ''}" aria-label="${id}"><span class="mn-icon mn-icon--sm" id="ic-cluster-${id}"></span></button>`; }
