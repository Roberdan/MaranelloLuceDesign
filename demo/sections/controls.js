/**
 * Controls section — Ferrari controls showcase: sliders, rotary dials,
 * manettino, cruise lever, toggle lever, stepped rotary, button cluster.
 */
export function createControlsSection() {
  const section = document.createElement('section');
  section.id = 'controls';
  section.className = 'mn-section-dark';
  section.innerHTML = `
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
        <label class="mn-toggle mn-toggle--on">
          <input type="checkbox" checked>
          <span class="mn-toggle__track"><span class="mn-toggle__thumb"></span></span>
          <span class="mn-toggle__label">Auto-refresh</span>
        </label>
        <label class="mn-toggle">
          <input type="checkbox">
          <span class="mn-toggle__track"><span class="mn-toggle__thumb"></span></span>
          <span class="mn-toggle__label">Night Mode</span>
        </label>
        <label class="mn-toggle mn-toggle--on">
          <input type="checkbox" checked>
          <span class="mn-toggle__track"><span class="mn-toggle__thumb"></span></span>
          <span class="mn-toggle__label">Alerts</span>
        </label>
      </div>

      <div class="demo-section-label">LED Indicators</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl" style="align-items:center">
        <span class="mn-led mn-led--green"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">System Online</span></span>
        <span class="mn-led mn-led--amber"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">Processing</span></span>
        <span class="mn-led mn-led--red mn-anim-blink"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">Critical Alert</span></span>
        <span class="mn-led mn-led--off"><span class="mn-led__housing"><span class="mn-led__bulb"></span></span><span class="mn-led__text">Offline</span></span>
      </div>

      <div class="demo-section-label">Slider Controls</div>
      <div class="mn-flex-col mn-gap-lg mn-mb-2xl" style="max-width:420px">
        <div id="ctrl-slider-1"></div>
        <div id="ctrl-slider-2"></div>
      </div>

      <div class="demo-section-label">Rotary Selectors</div>
      <div class="mn-flex-center mn-gap-2xl mn-flex-wrap mn-mb-2xl">
        <div id="ctrl-rotary-1"></div>
        <div id="ctrl-rotary-2"></div>
      </div>

      <div class="mn-divider-gold mn-my-2xl"></div>
      <h3 class="mn-title-sub mn-mb-sm">Advanced Cockpit Controls</h3>
      <p class="mn-caption mn-text-dim mn-mb-lg">Manettino, cruise lever, 3D toggle, stepped rotary — machined from solid aluminum.</p>

      <div class="mn-flex-wrap mn-gap-2xl mn-mb-2xl" style="align-items:flex-end">
        <div>
          <div class="demo-section-label mn-mb-sm">Manettino</div>
          <div id="ctrl-manettino"></div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Cruise Lever</div>
          <div id="ctrl-cruise"></div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Toggle Lever (On)</div>
          <div id="ctrl-lever-on"></div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Toggle Lever (Off)</div>
          <div id="ctrl-lever-off"></div>
        </div>
        <div>
          <div class="demo-section-label mn-mb-sm">Stepped Rotary</div>
          <div id="ctrl-stepped"></div>
        </div>
      </div>

      <div class="demo-section-label">Button Cluster (Steering Style)</div>
      <div class="mn-mb-2xl">
        <div class="mn-btn-cluster" id="ctrl-btn-cluster" style="--cluster-cols:4">
          <button class="mn-btn-cluster__item mn-btn-cluster__item--active" aria-label="Dashboard">
            <span class="mn-icon mn-icon--sm" id="ic-cluster-dashboard"></span>
          </button>
          <button class="mn-btn-cluster__item" aria-label="Chart">
            <span class="mn-icon mn-icon--sm" id="ic-cluster-chart"></span>
          </button>
          <button class="mn-btn-cluster__item" aria-label="Users">
            <span class="mn-icon mn-icon--sm" id="ic-cluster-users"></span>
          </button>
          <button class="mn-btn-cluster__item" aria-label="Settings">
            <span class="mn-icon mn-icon--sm" id="ic-cluster-settings"></span>
          </button>
        </div>
      </div>

      <div class="demo-section-label">Segmented Control</div>
      <div class="mn-mb-2xl">
        <div class="mn-segmented" role="tablist" aria-label="View mode">
          <button class="mn-segmented__item" role="tab">Day</button>
          <button class="mn-segmented__item mn-segmented__item--active" role="tab" aria-selected="true">Week</button>
          <button class="mn-segmented__item" role="tab">Month</button>
          <button class="mn-segmented__item" role="tab">Quarter</button>
        </div>
      </div>

      <div class="demo-section-label">Drag Rotary</div>
      <div class="mn-flex-center mn-gap-2xl mn-mb-2xl">
        <div id="ctrl-drag-rotary"></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => initControls(section));
  return section;
}

function initControls(section) {
  const M = window.Maranello;
  if (!M) return;

  if (M.initSlider) {
    M.initSlider(section.querySelector('#ctrl-slider-1'), {
      value: 72, min: 0, max: 100, label: 'Therapy Intensity', fill: 'warm',
      onChange: (v) => {},
    });
    M.initSlider(section.querySelector('#ctrl-slider-2'), {
      value: 45, min: 0, max: 100, label: 'Volunteer Capacity', fill: 'cool',
      onChange: (v) => {},
    });
  }

  if (M.initRotary) {
    M.initRotary(section.querySelector('#ctrl-rotary-1'), {
      positions: ['Intake', 'Review', 'Therapy', 'Monitor', 'Archive'],
      label: 'Program Stage', initial: 2,
    });
    M.initRotary(section.querySelector('#ctrl-rotary-2'), {
      positions: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
      label: 'Report Frequency', initial: 1,
    });
  }

  if (M.manettino) {
    M.manettino(section.querySelector('#ctrl-manettino'), {
      positions: ['Intake', 'Review', 'Therapy', 'Monitor', 'Archive'],
      label: 'Program Stage', initial: 2,
    });
  }

  if (M.cruiseLever) {
    M.cruiseLever(section.querySelector('#ctrl-cruise'), {
      positions: ['Off', 'Low', 'Medium', 'High', 'Urgent'],
      label: 'Priority', initial: 1,
    });
  }

  if (M.toggleLever) {
    M.toggleLever(section.querySelector('#ctrl-lever-on'), { label: 'Auto-Assign', state: true });
    M.toggleLever(section.querySelector('#ctrl-lever-off'), { label: 'Notifications', state: false });
  }

  if (M.steppedRotary) {
    M.steppedRotary(section.querySelector('#ctrl-stepped'), {
      positions: ['S', 'M', 'L', 'XL'], label: 'Effort', initial: 1,
    });
  }

  if (M.initDragRotary) {
    M.initDragRotary(section.querySelector('#ctrl-drag-rotary'), {
      positions: ['Off', 'Eco', 'Normal', 'Sport', 'Race'],
      label: 'Drive Mode', initial: 2,
    });
  }

  if (M.icons) {
    const ic = M.icons;
    const pairs = [
      ['ic-cluster-dashboard', ic.dashboard],
      ['ic-cluster-chart', ic.barChart],
      ['ic-cluster-users', ic.user],
      ['ic-cluster-settings', ic.settings ?? ic.filter],
    ];
    pairs.forEach(([id, fn]) => {
      const el = section.querySelector('#' + id);
      if (el && fn) el.innerHTML = fn();
    });
  }

  section.querySelectorAll('.mn-btn-cluster__item').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.mn-btn-cluster__item').forEach(b => b.classList.remove('mn-btn-cluster__item--active'));
      btn.classList.add('mn-btn-cluster__item--active');
    });
  });

  section.querySelectorAll('.mn-segmented__item').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.mn-segmented__item').forEach(b => {
        b.classList.remove('mn-segmented__item--active');
        b.removeAttribute('aria-selected');
      });
      btn.classList.add('mn-segmented__item--active');
      btn.setAttribute('aria-selected', 'true');
    });
  });
}
