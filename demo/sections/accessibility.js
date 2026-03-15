/**
 * Accessibility section — themed panel with floating FAB + inline preview.
 */
const STORAGE_KEY = 'mn-a11y-settings';
const STYLE_ID = 'mn-a11y-demo-style';
const FONT_ID = 'mn-a11y-demo-font';
const FAB_ID = 'mn-a11y-demo-fab';
const FLOAT_ID = 'mn-a11y-demo-floating';
const VOICES = ['Balanced Voice', 'Calm Guide', 'Clarity Boost', 'Low Stimulation'];
const PROFILES = [
  { id: 'dyslexia', label: 'Dyslexia', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"/></svg>', tone: '#448AFF', flags: ['dyslexiaFont', 'largeText', 'highSpacing'] },
  { id: 'adhd', label: 'ADHD', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', tone: '#8B5CF6', flags: ['reducedMotion', 'focusIndicators', 'mutedColors'] },
  { id: 'visual', label: 'Visual', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', tone: '#FFB300', flags: ['highContrast', 'largeText', 'focusIndicators'] },
  { id: 'motor', label: 'Motor', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 11V6a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V4a2 2 0 00-2-2 2 2 0 00-2 2v2"/><path d="M10 10.5V6a2 2 0 00-2-2 2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 012 2v7.1a2 2 0 01-.6 1.4L15 23"/><path d="M6 15a2 2 0 00-2 2v0a2 2 0 002 2h12"/></svg>', tone: '#00A651', flags: ['largerClickTargets', 'reducedMotion'] },
  { id: 'autism', label: 'Autism', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>', tone: '#14B8A6', flags: ['reducedMotion', 'mutedColors', 'consistentLayout'] },
  { id: 'hearing', label: 'Hearing', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 15l6-6 4 4 8-8"/><line x1="2" y1="2" x2="22" y2="22" stroke-width="2"/></svg>', tone: '#F43F5E', flags: ['visualAlerts', 'captionsPreference'] },
  { id: 'motor-plus', label: 'Motor+', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>', tone: '#16A34A', flags: ['largerClickTargets', 'reducedMotion', 'keyboardOnly'] },
];
const TOGGLES = [['largeText', 'Large Text'], ['highContrast', 'High Contrast'], ['reducedMotion', 'Reduced Motion'], ['dyslexiaFont', 'Dyslexia Font'], ['focusIndicators', 'Focus Indicators']];
const BODY_CLASSES = { largeText: 'mn-a11y-large-text', highContrast: 'mn-a11y-high-contrast', reducedMotion: 'mn-a11y-reduced-motion', dyslexiaFont: 'mn-a11y-dyslexia-font', focusIndicators: 'mn-a11y-focus', highSpacing: 'mn-a11y-high-spacing', largerClickTargets: 'mn-a11y-click-targets', mutedColors: 'mn-a11y-muted-colors', consistentLayout: 'mn-a11y-consistent-layout', visualAlerts: 'mn-a11y-visual-alerts', captionsPreference: 'mn-a11y-captions', keyboardOnly: 'mn-a11y-keyboard-only' };

export function createAccessibilitySection() {
  ensureStyles();
  const state = loadState();
  const section = document.createElement('section');
  section.id = 'accessibility';
  section.className = 'mn-section-light';
  section.setAttribute('aria-label', 'Accessibility Settings');
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">15 — Accessibility</p>
      <h2 class="mn-title-section" style="margin-bottom:var(--space-lg)">Accessibility</h2>
      <p class="mn-body" style="margin-bottom:var(--space-lg)">Accessibility controls with quick profiles, focused toggles, a themed voice selector, and a persistent gold FAB.</p>
      <p class="mn-micro" style="margin-bottom:var(--space-xl);color:var(--grigio-medio)">The live panel is shown inline below for preview, while the floating action button opens the same interface as a slide-up overlay from the bottom-right.</p>
      <div class="mn-a11y-demo-stage">${panelMarkup('inline')}</div>
    </div>`;
  requestAnimationFrame(() => mountSection(section, state));
  return section;
}

function mountSection(section, state) {
  const floating = mountFloatingPanel();
  const fab = mountFab();
  const panels = [section.querySelector('[data-a11y-panel="inline"]'), floating].filter(Boolean);
  panels.forEach((panel) => {
    initVoiceDropdown(panel);
    panel.addEventListener('click', (event) => handlePanelClick(event, state, { fab, floating }));
  });
  fab.addEventListener('click', () => toggleFloating(floating, fab, !floating.classList.contains('mn-a11y-demo-panel--open')));
  document.addEventListener('click', (event) => {
    if (!floating.classList.contains('mn-a11y-demo-panel--open')) return;
    if (floating.contains(event.target) || fab.contains(event.target)) return;
    toggleFloating(floating, fab, false);
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') toggleFloating(floating, fab, false); });
  const syncPosition = () => positionFloating(fab, floating);
  syncPosition();
  window.addEventListener('resize', syncPosition, { passive: true });
  render(state, panels, fab);
}

function handlePanelClick(event, state, ctx) {
  const profile = event.target.closest('[data-profile]');
  const toggle = event.target.closest('[data-toggle]');
  const option = event.target.closest('[data-voice-option]');
  if (profile) state.profiles = state.profiles.includes(profile.dataset.profile) ? state.profiles.filter((id) => id !== profile.dataset.profile) : [...state.profiles, profile.dataset.profile];
  if (toggle) {
    const next = !derive(state)[toggle.dataset.toggle];
    state.manual[toggle.dataset.toggle] = next;
  }
  if (option) state.voice = option.dataset.voice;
  if (event.target.closest('[data-reset]')) resetState(state);
  if (event.target.closest('[data-close]') && !event.target.disabled) toggleFloating(ctx.floating, ctx.fab, false);
  render(state, document.querySelectorAll('[data-a11y-panel]'), ctx.fab);
}

function render(state, panels, fab) {
  const effective = derive(state);
  saveState(state);
  applyBodySettings(effective);
  panels.forEach((panel) => {
    panel.querySelectorAll('[data-profile]').forEach((button) => button.classList.toggle('mn-a11y-demo-profile--active', state.profiles.includes(button.dataset.profile)));
    panel.querySelectorAll('[data-toggle]').forEach((button) => {
      const on = effective[button.dataset.toggle];
      button.classList.toggle('mn-a11y-demo-switch--on', on);
      button.setAttribute('aria-checked', String(on));
    });
    const trigger = panel.querySelector('[data-voice-label]');
    if (trigger) trigger.textContent = `${state.voice} `;
    panel.querySelectorAll('[data-voice-option]').forEach((button) => {
      const active = button.dataset.voice === state.voice;
      button.classList.toggle('mn-dropdown__item--active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const summary = panel.querySelector('[data-summary]');
    if (summary) summary.textContent = summaryText(state, effective);
  });
  fab.classList.toggle('mn-a11y-demo-fab--active', document.getElementById(FLOAT_ID)?.classList.contains('mn-a11y-demo-panel--open'));
}

function panelMarkup(mode) {
  const inline = mode === 'inline';
  return `<div class="mn-card-dark mn-a11y-demo-panel${inline ? ' mn-a11y-demo-panel--inline' : ''}"${inline ? '' : ` id="${FLOAT_ID}" aria-modal="true"`} data-a11y-panel="${mode}" role="dialog" aria-label="Accessibility settings">
    <div class="mn-a11y-demo-header"><div><p class="mn-label" style="color:var(--mn-accent);margin-bottom:4px">Accessibility Settings</p><p class="mn-micro">Profiles, quick settings, and a themed voice selector.</p></div><button class="mn-a11y-demo-close" type="button" data-close ${inline ? 'disabled aria-disabled="true" title="Inline preview stays visible"' : 'aria-label="Close accessibility settings"'}>${inline ? '—' : '×'}</button></div>
    <div class="mn-a11y-demo-label">Quick Profiles</div><div class="mn-a11y-demo-grid">${PROFILES.map((item) => `<button class="mn-a11y-demo-profile" type="button" data-profile="${item.id}" style="--tone:${item.tone}"><span class="mn-a11y-demo-profile__icon">${item.icon}</span><span>${item.label}</span></button>`).join('')}</div>
    <div class="mn-a11y-demo-label">Quick Settings</div><div class="mn-a11y-demo-list">${TOGGLES.map(([id, label]) => `<div class="mn-a11y-demo-row"><span>${label}</span><button class="mn-a11y-demo-switch" type="button" data-toggle="${id}" role="switch" aria-checked="false" aria-label="${label}"><span></span></button></div>`).join('')}</div>
    <div class="mn-a11y-demo-label">Voice Selector</div>${voiceMarkup()}
    <div class="mn-a11y-demo-footer"><button class="mn-btn mn-btn--ghost mn-a11y-demo-reset" type="button" data-reset>Reset to Defaults</button><p class="mn-micro" data-summary></p></div>
  </div>`;
}

function voiceMarkup() {
  return `<div class="mn-dropdown mn-a11y-demo-voice" data-voice-dropdown><button class="mn-dropdown__trigger" type="button"><span data-voice-label>${VOICES[0]} </span></button><div class="mn-dropdown__menu">${VOICES.map((voice) => `<button class="mn-dropdown__item" type="button" data-voice-option data-voice="${voice}">${voice}</button>`).join('')}</div></div>`;
}

function mountFab() {
  document.getElementById(FAB_ID)?.remove();
  const fab = document.createElement('button');
  fab.id = FAB_ID;
  fab.className = 'mn-a11y-demo-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Open accessibility settings');
  fab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2" fill="currentColor" stroke="none"/><path d="M6 10h12M12 10v5M9.5 20l2.5-5 2.5 5"/></svg>`;
  document.body.appendChild(fab);
  return fab;
}

function mountFloatingPanel() {
  document.getElementById(FLOAT_ID)?.remove();
  const shell = document.createElement('div');
  shell.innerHTML = panelMarkup('floating');
  document.body.appendChild(shell.firstElementChild);
  return document.getElementById(FLOAT_ID);
}

function toggleFloating(panel, fab, open) {
  panel.classList.toggle('mn-a11y-demo-panel--open', open);
  fab.setAttribute('aria-expanded', String(open));
}

function positionFloating(fab, panel) {
  const chat = document.querySelector('.mn-chat-fab');
  const bottom = chat ? Math.max(92, Math.round(window.innerHeight - chat.getBoundingClientRect().top + 16)) : 24;
  fab.style.bottom = `${bottom}px`;
  panel.style.bottom = `${bottom + 64}px`;
}

function derive(state) {
  const profileFlags = Object.fromEntries(Object.keys(BODY_CLASSES).map((key) => [key, false]));
  state.profiles.forEach((id) => PROFILES.find((profile) => profile.id === id)?.flags.forEach((flag) => { profileFlags[flag] = true; }));
  const merged = { ...profileFlags };
  Object.keys(state.manual).forEach((key) => { if (state.manual[key] !== null) merged[key] = state.manual[key]; });
  return merged;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch { /* ignore */ }
  return normalizeState(seedFromMaranello());
}

function seedFromMaranello() {
  const seed = window.Maranello?.loadA11ySettings?.() || (() => {
    if (!window.Maranello?.a11yPanel) return null;
    try { const ctrl = window.Maranello.a11yPanel(); const current = ctrl?.getSettings?.(); ctrl?.destroy?.(); return current; }
    catch { return null; }
  })();
  return { profiles: [], voice: VOICES[0], manual: { largeText: seed ? ['lg', 'xl'].includes(seed.fontSize) : null, highContrast: seed?.highContrast ?? null, reducedMotion: seed?.reducedMotion ?? null, dyslexiaFont: null, focusIndicators: seed?.focusVisible ?? null } };
}

function normalizeState(value = {}) {
  return { profiles: Array.isArray(value.profiles) ? value.profiles : [], voice: VOICES.includes(value.voice) ? value.voice : VOICES[0], manual: { largeText: value.manual?.largeText ?? null, highContrast: value.manual?.highContrast ?? null, reducedMotion: value.manual?.reducedMotion ?? null, dyslexiaFont: value.manual?.dyslexiaFont ?? null, focusIndicators: value.manual?.focusIndicators ?? null } };
}

function resetState(state) {
  state.profiles = [];
  state.voice = VOICES[0];
  Object.keys(state.manual).forEach((key) => { state.manual[key] = null; });
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function applyBodySettings(effective) {
  Object.entries(BODY_CLASSES).forEach(([key, klass]) => document.body.classList.toggle(klass, Boolean(effective[key])));
  if (effective.dyslexiaFont && !document.getElementById(FONT_ID)) {
    const style = document.createElement('style');
    style.id = FONT_ID;
    style.textContent = "@font-face{font-family:'OpenDyslexic';font-style:normal;font-weight:400;font-display:swap;src:url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff2') format('woff2'),url('https://cdn.jsdelivr.net/fontsource/fonts/opendyslexic@latest/latin-400-normal.woff') format('woff');}";
    document.head.appendChild(style);
  }
}

function summaryText(state, effective) {
  const labels = PROFILES.filter((profile) => state.profiles.includes(profile.id)).map((profile) => profile.label);
  const flags = TOGGLES.filter(([key]) => effective[key]).map(([, label]) => label);
  const extra = [['highSpacing', 'Higher spacing'], ['largerClickTargets', 'Large click targets'], ['mutedColors', 'Muted colors'], ['consistentLayout', 'Consistent layout'], ['visualAlerts', 'Visual alerts'], ['captionsPreference', 'Captions preferred'], ['keyboardOnly', 'Keyboard-only mode']].filter(([key]) => effective[key]).map(([, label]) => label);
  const active = [...labels, ...flags, ...extra];
  return active.length ? `Active: ${active.join(' · ')} · Voice: ${state.voice}` : `Defaults active · Voice: ${state.voice}`;
}

function initVoiceDropdown(panel) {
  const dropdown = panel.querySelector('[data-voice-dropdown]');
  if (!dropdown) return;
  if (window.Maranello?.initDropdown) { window.Maranello.initDropdown(dropdown); return; }
  const trigger = dropdown.querySelector('.mn-dropdown__trigger');
  trigger?.addEventListener('click', (event) => { event.stopPropagation(); dropdown.classList.toggle('mn-dropdown--open'); });
  document.addEventListener('click', () => dropdown.classList.remove('mn-dropdown--open'));
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .mn-a11y-demo-stage{max-width:720px}.mn-a11y-demo-panel{padding:var(--space-xl);border:1px solid var(--grigio-scuro);border-radius:var(--radius-xl);background:linear-gradient(180deg,#20201d,#121212);box-shadow:0 24px 48px rgba(0,0,0,.36);display:grid;gap:var(--space-md)}.mn-a11y-demo-panel--inline{position:relative}.mn-a11y-demo-panel:not(.mn-a11y-demo-panel--inline){position:fixed;right:24px;width:min(380px,calc(100vw - 32px));z-index:1050;opacity:0;transform:translateY(24px) scale(.98);pointer-events:none;transition:opacity .22s ease,transform .22s ease}.mn-a11y-demo-panel--open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.mn-a11y-demo-header,.mn-a11y-demo-row,.mn-a11y-demo-footer{display:flex;align-items:center;justify-content:space-between;gap:var(--space-md)}.mn-a11y-demo-header{align-items:flex-start}.mn-a11y-demo-label{font:600 var(--text-micro)/1 var(--font-display);letter-spacing:.08em;text-transform:uppercase;color:var(--mn-accent)}.mn-a11y-demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-sm)}.mn-a11y-demo-profile{display:grid;justify-items:start;gap:6px;padding:14px;border:1px solid color-mix(in srgb,var(--tone) 54%,#fff 12%);border-radius:var(--radius-lg);background:linear-gradient(180deg,color-mix(in srgb,var(--tone) 30%,#111),color-mix(in srgb,var(--tone) 14%,#111));color:var(--bianco-caldo);font:600 var(--text-small)/1.2 var(--font-body);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);cursor:pointer}.mn-a11y-demo-profile--active{transform:translateY(-1px);box-shadow:0 0 0 2px color-mix(in srgb,var(--tone) 70%,#fff 18%),0 18px 28px rgba(0,0,0,.24)}.mn-a11y-demo-profile__icon{font-size:1.2rem}.mn-a11y-demo-list{display:grid;gap:var(--space-sm)}.mn-a11y-demo-row{padding:12px 14px;border:1px solid var(--grigio-scuro);border-radius:var(--radius-md);background:rgba(255,255,255,.03)}.mn-a11y-demo-switch,.mn-a11y-demo-close,.mn-a11y-demo-fab{border:none;cursor:pointer}.mn-a11y-demo-switch{width:48px;height:28px;border-radius:999px;background:rgba(255,255,255,.14);padding:3px;transition:background .2s ease}.mn-a11y-demo-switch span{display:block;width:22px;height:22px;border-radius:999px;background:#fff;transition:transform .2s ease}.mn-a11y-demo-switch--on{background:var(--mn-accent)}.mn-a11y-demo-switch--on span{transform:translateX(20px);background:#111}.mn-a11y-demo-close{width:36px;height:36px;border-radius:999px;background:rgba(255,255,255,.06);color:var(--bianco-caldo);font-size:1.25rem}.mn-a11y-demo-close:disabled{opacity:.5;cursor:not-allowed}.mn-a11y-demo-footer{align-items:flex-end}.mn-a11y-demo-footer p{max-width:320px;text-align:right}.mn-a11y-demo-voice,.mn-a11y-demo-voice .mn-dropdown__trigger,.mn-a11y-demo-voice .mn-dropdown__menu{width:100%}.mn-a11y-demo-voice .mn-dropdown__menu{max-height:220px;overflow:auto}.mn-a11y-demo-fab{position:fixed;right:24px;width:48px;height:48px;border-radius:999px;background:var(--mn-accent);color:#111;box-shadow:0 18px 30px rgba(0,0,0,.32);display:grid;place-items:center;z-index:1040}.mn-a11y-demo-fab svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mn-a11y-demo-fab--active{box-shadow:0 0 0 3px color-mix(in srgb,var(--mn-accent) 35%,transparent),0 18px 30px rgba(0,0,0,.32)}body.mn-a11y-large-text{font-size:1.2em}body.mn-a11y-high-spacing{line-height:1.85;letter-spacing:.01em}body.mn-a11y-high-contrast .mn-card-dark,body.mn-a11y-high-contrast .mn-dropdown__trigger,body.mn-a11y-high-contrast .mn-dropdown__menu,body.mn-a11y-high-contrast .mn-a11y-demo-row{border-color:var(--bianco-puro)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}body.mn-a11y-reduced-motion *,body.mn-a11y-reduced-motion *::before,body.mn-a11y-reduced-motion *::after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}body.mn-a11y-dyslexia-font{font-family:'OpenDyslexic','Inter',sans-serif}body.mn-a11y-focus :is(a,button,input,textarea,select,[tabindex]:not([tabindex='-1'])):focus-visible{outline:3px solid var(--mn-accent)!important;outline-offset:3px}body.mn-a11y-click-targets :is(button,a,.mn-dropdown__item,.mn-dropdown__trigger){min-height:44px;min-width:44px}body.mn-a11y-muted-colors #demo-root{filter:saturate(.82) contrast(.98)}body.mn-a11y-consistent-layout .mn-card-dark,body.mn-a11y-consistent-layout .mn-a11y-demo-panel{backdrop-filter:none}body.mn-a11y-visual-alerts .mn-a11y-demo-panel::after{content:'Visual alerts on';position:absolute;top:16px;right:56px;padding:4px 10px;border-radius:999px;background:rgba(244,63,94,.16);color:#FDA4AF;font:600 10px/1 var(--font-display);letter-spacing:.06em;text-transform:uppercase}body.mn-a11y-captions .mn-a11y-demo-panel .mn-a11y-demo-label::after{content:' captions';color:var(--grigio-chiaro)}body.mn-a11y-keyboard-only{cursor:default}@media (max-width:720px){.mn-a11y-demo-footer{align-items:stretch;flex-direction:column}.mn-a11y-demo-footer p{max-width:none;text-align:left}}
  `;
  document.head.appendChild(style);
}
