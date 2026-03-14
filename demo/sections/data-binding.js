/**
 * Data Binding section — showcase emit/on/off, bind(), autoBind.
 * Live demo: sliders control gauge values via Maranello data-binding API.
 */
export function createDataBindingSection() {
  const section = document.createElement('section');
  section.id = 'data-binding';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">28 — Data Binding</p>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Data Binding</h2>
      <p class="mn-body mn-mb-2xl">Reactive pub/sub bus: emit/on/off, bind(), and autoBind wiring slider inputs to live gauges.</p>

      <div class="mn-grid-2 mn-mb-2xl" style="gap:var(--space-xl)">

        <!-- Slider → Gauge binding demo -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Slider → Gauge Binding</h4>
          <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Drag a slider — the gauge updates via <code>Maranello.emit</code> and <code>Maranello.updateGauge</code>.</p>
          <div style="display:flex;flex-direction:column;gap:var(--space-lg)">
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Agent Utilization</span>
                <span id="db-util-val" style="color:var(--mn-accent);font-weight:700">72%</span>
              </label>
              <input id="db-util-slider" class="mn-slider" type="range" min="0" max="100" value="72"
                data-bind-event="db:utilization" style="width:100%">
            </div>
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Token Health</span>
                <span id="db-token-val" style="color:var(--mn-accent);font-weight:700">88%</span>
              </label>
              <input id="db-token-slider" class="mn-slider" type="range" min="0" max="100" value="88"
                data-bind-event="db:token-health" style="width:100%">
            </div>
            <div>
              <label class="mn-label" style="display:flex;justify-content:space-between;margin-bottom:var(--space-xs)">
                <span>Gate Coverage</span>
                <span id="db-gate-val" style="color:var(--mn-accent);font-weight:700">65%</span>
              </label>
              <input id="db-gate-slider" class="mn-slider" type="range" min="0" max="100" value="65"
                data-bind-event="db:gate-coverage" style="width:100%">
            </div>
          </div>
        </div>

        <!-- Live event log -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Event Bus Log</h4>
          <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Events emitted via <code>Maranello.emit</code> appear here in real time.</p>
          <div id="db-event-log" style="font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6;height:180px;overflow-y:auto;background:rgba(0,0,0,0.4);border:1px solid var(--grigio-scuro);border-radius:6px;padding:var(--space-sm)">
            <span style="color:var(--grigio-medio)">Move a slider to see events…</span>
          </div>
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md)">
            <button id="db-clear-log" class="mn-btn mn-btn--ghost" style="font-size:12px;padding:4px 12px">Clear log</button>
            <button id="db-emit-test" class="mn-btn mn-btn--accent" style="font-size:12px;padding:4px 12px">Emit test event</button>
          </div>
        </div>
      </div>

      <!-- emit/on/off code reference -->
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">API Quick Reference</h4>
        <div class="mn-grid-3" style="gap:var(--space-lg)">
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">emit / on / off</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">Maranello.emit('my:event', {v:42});
const h = Maranello.on('my:event', d=>{});
Maranello.off('my:event', h);</pre>
          </div>
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">bind() — manual wiring</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">Maranello.bind(sliderEl, {
  event: 'util:update',
  transform: v => Number(v)
});</pre>
          </div>
          <div>
            <p class="mn-micro" style="color:var(--grigio-alluminio);margin-bottom:var(--space-xs);font-weight:600">autoBind — declarative</p>
            <pre style="margin:0;font-size:11px;color:var(--grigio-chiaro);background:rgba(0,0,0,0.3);padding:var(--space-sm);border-radius:4px;overflow:auto">&lt;input data-bind-event="util:update"
       data-bind-transform="number"&gt;
Maranello.autoBind(container);</pre>
          </div>
        </div>
      </div>

      <!-- Live gauge display -->
      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Live Gauges (bound to sliders above)</h4>
        <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;justify-content:center;align-items:flex-end">
          <div style="text-align:center">
            <mn-gauge id="db-gauge-util" value="72" max="100" unit="%" label="Utilization" size="sm"></mn-gauge>
          </div>
          <div style="text-align:center">
            <mn-gauge id="db-gauge-token" value="88" max="100" unit="%" label="Token Health" size="sm"></mn-gauge>
          </div>
          <div style="text-align:center">
            <mn-gauge id="db-gauge-gate" value="65" max="100" unit="%" label="Gate Coverage" size="sm"></mn-gauge>
          </div>
        </div>
      </div>
    </div>
  `;
  requestAnimationFrame(() => initDataBinding(section));
  return section;
}

function appendLog(log, text) {
  const ts = new Date().toLocaleTimeString('en-GB', { hour12: false });
  const line = document.createElement('div');
  line.style.cssText = 'color:var(--giallo-ferrari)';
  line.textContent = `[${ts}] ${text}`;
  // Remove placeholder on first entry
  const placeholder = log.querySelector('span');
  if (placeholder) placeholder.remove();
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  // Cap log at 50 entries
  while (log.children.length > 50) log.removeChild(log.firstChild);
}

function initDataBinding(section) {
  const M = window.Maranello;
  const log = section.querySelector('#db-event-log');
  if (!log) return;

  // Slider configs: [sliderId, labelId, gaugeId, eventName]
  const sliders = [
    ['#db-util-slider', '#db-util-val', '#db-gauge-util', 'db:utilization'],
    ['#db-token-slider', '#db-token-val', '#db-gauge-token', 'db:token-health'],
    ['#db-gate-slider', '#db-gate-val', '#db-gauge-gate', 'db:gate-coverage'],
  ];

  sliders.forEach(([sliderId, labelId, gaugeId, eventName]) => {
    const slider = section.querySelector(sliderId);
    const valueLabel = section.querySelector(labelId);
    const gauge = section.querySelector(gaugeId);
    if (!slider) return;

    slider.addEventListener('input', () => {
      const value = Number(slider.value);
      // Update the label
      if (valueLabel) valueLabel.textContent = `${value}%`;
      // Update gauge WC attribute directly
      if (gauge) gauge.setAttribute('value', String(value));
      // Emit via Maranello bus if available
      if (M?.emit) {
        try { M.emit(eventName, { value, source: 'slider' }); } catch (_) { /* noop */ }
      }
      // Log the event
      appendLog(log, `${eventName} → ${value}`);
    });

    // Wire up autoBind if API available
    if (M?.autoBind) {
      try { M.autoBind(section.querySelector(sliderId.replace('#', '').split('-').slice(0, 2).join('-'))); } catch (_) { /* graceful fallback */ }
    }
  });

  // Subscribe to own events to verify round-trip
  if (M?.on) {
    sliders.forEach(([, , , eventName]) => {
      try {
        M.on(eventName, (data) => {
          // Visual confirmation — gauge already updated above; just log if source isn't slider
          if (data?.source !== 'slider') appendLog(log, `[on] ${eventName} ← ${JSON.stringify(data)}`);
        });
      } catch (_) { /* noop */ }
    });
  }

  // Emit test button
  const testBtn = section.querySelector('#db-emit-test');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      const payload = { value: Math.round(Math.random() * 100), source: 'test' };
      appendLog(log, `emit db:test-event → ${JSON.stringify(payload)}`);
      if (M?.emit) {
        try { M.emit('db:test-event', payload); } catch (_) { /* noop */ }
      }
    });
  }

  // Clear log button
  const clearBtn = section.querySelector('#db-clear-log');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      log.innerHTML = '<span style="color:var(--grigio-medio)">Log cleared.</span>';
    });
  }
}
