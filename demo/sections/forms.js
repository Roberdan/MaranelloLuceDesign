const SEARCH_SUGGESTIONS = [
  'Pipeline Alpha — production route',
  'Agent Sonnet failover policy',
  'Embedding refresh / eu-west-1',
  'Token budget alert — March 2026',
];
const INITIAL_TAGS = ['Pipeline Alpha', 'us-east-1', 'Claude Sonnet'];
const MAGNIFIER_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

export function createFormsSection() {
  const section = document.createElement('section');
  section.id = 'forms';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">05 — Data Entry</p>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Forms &amp; Inputs</h2>
      <p class="mn-body mn-mb-2xl">Wizard, tags, search, date pickers, and agent configuration forms.</p>
      <details class="mn-code-snippet">
        <summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary>
        <pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;form class="mn-form"&gt;
  &lt;div class="mn-field"&gt;&lt;label&gt;Email&lt;/label&gt;&lt;input class="mn-input" type="email" required&gt;&lt;/div&gt;
&lt;/form&gt;
Maranello.initForms();</code></pre>
      </details>
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Agent Configuration Wizard</h4>
        <div id="wizard-steps" style="display:flex;gap:var(--space-lg);margin-bottom:var(--space-xl)">
          ${[1, 2, 3].map(n => `<div class="mn-wizard-step" data-step="${n}" style="display:flex;align-items:center;gap:var(--space-xs);opacity:${n === 1 ? 1 : 0.4}"><span style="width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;background:${n === 1 ? 'var(--mn-accent)' : 'var(--grigio-scuro)'};color:${n === 1 ? 'var(--nero)' : 'var(--grigio-chiaro)'}">${n}</span><span class="mn-micro">${['Agent Profile', 'Routing Policy', 'Confirmation'][n - 1]}</span></div>`).join('')}
        </div>
        <div id="wizard-panel-1" class="mn-wizard-panel"><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Agent Name</label><input class="mn-input" type="text" placeholder="router-agent-prod" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Notification Email</label><input class="mn-input" type="email" placeholder="ops@maranelloluce.ai" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Environment</label><input class="mn-input" type="text" placeholder="production-us-east-1" style="width:100%"></div></div></div>
        <div id="wizard-panel-2" class="mn-wizard-panel" style="display:none"><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Primary Model</label><select class="mn-select" style="width:100%"><option>Select a model…</option><option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option><option>Agent Haiku</option></select></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Capabilities</label><div style="display:flex;gap:var(--space-md);flex-wrap:wrap">${['Batch', 'Streaming', 'Fallback'].map(l => `<label class="mn-checkbox"><input type="checkbox"> <span class="mn-micro">${l}</span></label>`).join('')}</div></div></div></div>
        <div id="wizard-panel-3" class="mn-wizard-panel" style="display:none"><p class="mn-body" style="margin-bottom:var(--space-md)">Review your configuration and submit the runtime policy.</p><p class="mn-micro" style="color:var(--grigio-chiaro)">By submitting you agree to Maranello Luce platform terms.</p></div>
        <div style="display:flex;gap:var(--space-md);padding-top:var(--space-lg)"><button id="wizard-back" class="mn-btn mn-btn--ghost" disabled>Back</button><button id="wizard-next" class="mn-btn mn-btn--accent">Next</button></div>
      </div>
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Validation States</h4>
        <p class="mn-micro" style="color:var(--grigio-chiaro);margin-bottom:var(--space-lg)">Live validation using Maranello.validateField — try submitting with empty or malformed values.</p>
        <form id="validation-demo-form" onsubmit="return false" novalidate style="display:flex;flex-direction:column;gap:var(--space-md)">
          <div>
            <label class="mn-label" for="vd-name" style="display:block;margin-bottom:var(--space-xs)">Agent Name <span style="color:var(--rosso-corsa)">*</span></label>
            <input id="vd-name" class="mn-input" type="text" placeholder="router-agent-prod" required aria-required="true" style="width:100%">
            <span id="vd-name-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div>
            <label class="mn-label" for="vd-email" style="display:block;margin-bottom:var(--space-xs)">Operator Email <span style="color:var(--rosso-corsa)">*</span></label>
            <input id="vd-email" class="mn-input" type="email" placeholder="ops@maranelloluce.ai" required aria-required="true" style="width:100%">
            <span id="vd-email-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div>
            <label class="mn-label" for="vd-model" style="display:block;margin-bottom:var(--space-xs)">Primary Model <span style="color:var(--rosso-corsa)">*</span></label>
            <select id="vd-model" class="mn-select" required aria-required="true" style="width:100%">
              <option value="">Select a model…</option>
              <option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option>
            </select>
            <span id="vd-model-err" class="mn-field-error" role="alert" style="display:none;color:var(--rosso-corsa);font-size:var(--text-micro);margin-top:4px"></span>
          </div>
          <div style="display:flex;gap:var(--space-md);padding-top:var(--space-sm)">
            <button id="vd-submit" class="mn-btn mn-btn--accent" type="submit">Validate &amp; Submit</button>
            <button class="mn-btn mn-btn--ghost" type="reset">Reset</button>
          </div>
          <div id="vd-success" style="display:none;padding:var(--space-sm) var(--space-md);border-radius:6px;background:rgba(0,166,81,0.15);border:1px solid var(--verde-racing);color:var(--verde-racing)" role="status">Form valid — agent registered successfully.</div>
        </form>
      </div>
      <div class="mn-grid-2 mn-mb-2xl" style="gap:var(--space-xl)">
        <div style="display:flex;flex-direction:column;gap:var(--space-xl)">
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Tag Input</h4><div id="tag-input-wrap" class="mn-tag-input" style="display:flex;flex-wrap:wrap;gap:var(--space-xs);padding:var(--space-sm);border:1px solid var(--grigio-scuro);border-radius:6px;min-height:40px;align-items:center">${INITIAL_TAGS.map(t => tagChip(t)).join('')}<input id="tag-field" class="mn-tag-input__field" type="text" placeholder="Add tag…" style="border:none;background:transparent;color:inherit;outline:none;flex:1;min-width:80px;font-size:var(--font-sm)"></div></div>
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Search Bar</h4><div class="mn-search-bar" style="position:relative"><div style="position:relative;display:flex;align-items:center"><span style="position:absolute;left:10px;display:flex;color:var(--grigio-chiaro)">${MAGNIFIER_SVG}</span><input id="search-field" class="mn-input" type="search" placeholder="Search pipelines, agents…" style="width:100%;padding-left:34px"></div><ul id="search-suggestions" class="mn-search-bar__list" style="display:none;position:absolute;top:100%;left:0;right:0;margin:var(--space-xs) 0 0;padding:var(--space-xs);list-style:none;background:var(--nero-soft,#141414);border:1px solid var(--mn-accent,#FFC72C);border-radius:6px;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.5)">${SEARCH_SUGGESTIONS.map(s => `<li class="mn-search-bar__item" style="padding:var(--space-sm) var(--space-md);border-radius:4px;cursor:pointer;color:var(--bianco-caldo,#f5f5f5);font-size:0.85rem;transition:background 0.15s">${s}</li>`).join('')}</ul></div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-xl)">
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Date Range</h4><div style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs);color:var(--grigio-alluminio,#c0c0c0)">Start Date</label><input id="dp-start" class="mn-input" type="text" placeholder="YYYY-MM-DD" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs);color:var(--grigio-alluminio,#c0c0c0)">End Date</label><input id="dp-end" class="mn-input" type="text" placeholder="YYYY-MM-DD" style="width:100%"></div></div></div>
          <div class="mn-card-dark" style="padding:var(--space-xl)"><h4 class="mn-label" style="margin-bottom:var(--space-lg);color:var(--mn-accent)">Quick Agent Setup</h4><form onsubmit="return false" style="display:flex;flex-direction:column;gap:var(--space-md)"><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Agent Name</label><input class="mn-input" type="text" placeholder="validator-canary" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Notification Email</label><input class="mn-input" type="email" placeholder="signals@maranelloluce.ai" style="width:100%"></div><div><label class="mn-label" style="display:block;margin-bottom:var(--space-xs)">Primary Model</label><select class="mn-select" style="width:100%"><option>Select…</option><option>Claude Sonnet</option><option>GPT-5.1</option><option>Gemini 2.5</option></select></div><div style="display:flex;gap:var(--space-md);padding-top:var(--space-sm)"><button class="mn-btn mn-btn--accent" type="submit">Register</button><button class="mn-btn mn-btn--ghost" type="reset">Clear</button></div></form></div>
        </div>
      </div>
    </div>
  `;
  requestAnimationFrame(() => initForms(section));
  return section;
}

function tagChip(text) { return `<span class="mn-tag-input__chip" style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:4px;background:var(--mn-accent);color:var(--nero);font-size:var(--font-xs);font-weight:600">${text}<button type="button" class="mn-tag-input__remove" style="background:none;border:none;cursor:pointer;color:inherit;font-size:14px;line-height:1;padding:0 0 0 2px">&times;</button></span>`; }

function initForms(section) {
  const M = window.Maranello;
  let step = 1;
  const back = section.querySelector('#wizard-back');
  const next = section.querySelector('#wizard-next');
  const setStep = (n) => {
    step = n;
    for (let i = 1; i <= 3; i++) {
      const panel = section.querySelector(`#wizard-panel-${i}`);
      const indicator = section.querySelector(`.mn-wizard-step[data-step="${i}"]`);
      if (panel) panel.style.display = i === step ? '' : 'none';
      if (indicator) {
        indicator.style.opacity = i <= step ? 1 : 0.4;
        const dot = indicator.querySelector('span');
        if (dot) { dot.style.background = i <= step ? 'var(--mn-accent)' : 'var(--grigio-scuro)'; dot.style.color = i <= step ? 'var(--nero)' : 'var(--grigio-chiaro)'; }
      }
    }
    back.disabled = step === 1;
    next.textContent = step === 3 ? 'Submit' : 'Next';
  };
  next.addEventListener('click', () => { if (step < 3) setStep(step + 1); });
  back.addEventListener('click', () => { if (step > 1) setStep(step - 1); });
  const tagWrap = section.querySelector('#tag-input-wrap');
  const tagField = section.querySelector('#tag-field');
  tagWrap.addEventListener('click', (e) => { if (e.target.classList.contains('mn-tag-input__remove')) e.target.parentElement.remove(); else tagField.focus(); });
  tagField.addEventListener('keydown', (e) => { if (e.key === 'Enter' && tagField.value.trim()) { e.preventDefault(); tagField.insertAdjacentHTML('beforebegin', tagChip(tagField.value.trim())); tagField.value = ''; } });
  const searchField = section.querySelector('#search-field');
  const suggestions = section.querySelector('#search-suggestions');
  searchField.addEventListener('focus', () => { suggestions.style.display = ''; });
  searchField.addEventListener('blur', () => { setTimeout(() => { suggestions.style.display = 'none'; }, 150); });
  suggestions.querySelectorAll('.mn-search-bar__item').forEach(li => { li.addEventListener('mousedown', () => { searchField.value = li.textContent; suggestions.style.display = 'none'; }); li.addEventListener('mouseenter', () => { li.style.background = 'var(--grigio-scuro)'; }); li.addEventListener('mouseleave', () => { li.style.background = ''; }); });
  if (M && M.datePicker) ['dp-start', 'dp-end'].forEach(id => { const input = section.querySelector(`#${id}`); if (input) M.registerDatePicker(input, { value: '', onChange: (d) => { input.value = d; } }); });
  initValidationDemo(M, section);
}

function setFieldError(input, errSpan, message) {
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    input.style.borderColor = 'var(--rosso-corsa)';
    errSpan.textContent = message;
    errSpan.style.display = 'block';
  } else {
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
    errSpan.style.display = 'none';
  }
}

function initValidationDemo(M, section) {
  const form = section.querySelector('#validation-demo-form');
  if (!form) return;
  const nameInput = form.querySelector('#vd-name');
  const emailInput = form.querySelector('#vd-email');
  const modelSelect = form.querySelector('#vd-model');
  const nameErr = form.querySelector('#vd-name-err');
  const emailErr = form.querySelector('#vd-email-err');
  const modelErr = form.querySelector('#vd-model-err');
  const success = form.querySelector('#vd-success');

  // Live validation on blur
  nameInput.addEventListener('blur', () => {
    const msg = nameInput.value.trim() === '' ? 'Agent name is required.' : '';
    setFieldError(nameInput, nameErr, msg);
  });
  emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    const msg = val === '' ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Enter a valid email address.' : '';
    setFieldError(emailInput, emailErr, msg);
  });
  modelSelect.addEventListener('change', () => {
    const msg = modelSelect.value === '' ? 'Select a primary model.' : '';
    setFieldError(modelSelect, modelErr, msg);
  });

  // Reset clears error states
  form.addEventListener('reset', () => {
    [nameInput, emailInput, modelSelect].forEach((el) => {
      el.removeAttribute('aria-invalid');
      el.style.borderColor = '';
    });
    [nameErr, emailErr, modelErr].forEach((el) => { el.style.display = 'none'; });
    if (success) success.style.display = 'none';
  });

  form.querySelector('#vd-submit').addEventListener('click', () => {
    const nameMsg = nameInput.value.trim() === '' ? 'Agent name is required.' : '';
    const val = emailInput.value.trim();
    const emailMsg = val === '' ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Enter a valid email address.' : '';
    const modelMsg = modelSelect.value === '' ? 'Select a primary model.' : '';
    setFieldError(nameInput, nameErr, nameMsg);
    setFieldError(emailInput, emailErr, emailMsg);
    setFieldError(modelSelect, modelErr, modelMsg);
    const valid = !nameMsg && !emailMsg && !modelMsg;
    if (success) success.style.display = valid ? 'block' : 'none';
    if (valid && M?.validateField) {
      // Use Maranello API if available for enhanced validation feedback
      try { M.validateField(nameInput); M.validateField(emailInput); } catch (_) { /* graceful fallback */ }
    }
  });
}
