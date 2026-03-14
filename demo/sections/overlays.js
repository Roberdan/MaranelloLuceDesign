/**
 * Overlays section — mn-modal, mn-toast, mn-drawer interactive demos.
 * Uses window.Maranello.openModal, toast, openDrawer, closeDrawer.
 */
export function createOverlaysSection() {
  const section = document.createElement('section');
  section.id = 'overlays';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">27 — Overlays &amp; Notifications</p>
      <div class="mn-watermark">OVERLAY</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Modals, Toasts &amp; Drawers</h2>
      <p class="mn-body mn-mb-2xl">Contextual overlays: confirmation dialogs, non-blocking notifications, and slide-out panels.</p>

      <div class="mn-demo-section-label mn-mt-xl">Modal Dialogs</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--accent" id="ovl-modal-info">Info Modal</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-modal-confirm">Confirm Modal</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-modal-danger">Danger Modal</button>
      </div>

      <div class="mn-demo-section-label">Toast Notifications</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-info">Info Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-success">Success Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-warning">Warning Toast</button>
        <button class="mn-btn mn-btn--ghost" id="ovl-toast-error">Error Toast</button>
      </div>

      <div class="mn-demo-section-label">Command Palette</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-cmd-palette">Open Command Palette <span class="mn-micro" style="opacity:.6;margin-left:var(--space-xs)">⌘K</span></button>
      </div>

      <div class="mn-demo-section-label">Slide-out Drawer</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-btn mn-btn--ghost" id="ovl-drawer-open">Open Drawer</button>
      </div>

      <!-- Drawer DOM anchor -->
      <div id="ovl-drawer-host"></div>
    </div>`;

  requestAnimationFrame(() => initOverlays(section));
  return section;
}

function initOverlays(section) {
  const M = window.Maranello;
  if (!M) { console.warn('[overlays] Maranello not loaded'); return; }

  // --- Modal ---
  section.querySelector('#ovl-modal-info')?.addEventListener('click', () => {
    if (!M.openModal) return;
    M.openModal({ title: 'Pipeline Report', content: '<p>Agent throughput is <strong>96%</strong> above baseline. All routing lanes nominal.</p>', confirmLabel: 'Acknowledge', onConfirm: () => M.closeModal?.() });
  });
  section.querySelector('#ovl-modal-confirm')?.addEventListener('click', () => {
    if (!M.openModal) return;
    M.openModal({ title: 'Rebalance Routes?', content: '<p>This will redistribute 3 active lanes across us-east-1 and eu-west-1. Ongoing tasks will not be interrupted.</p>', confirmLabel: 'Rebalance', cancelLabel: 'Cancel', onConfirm: () => { M.closeModal?.(); M.toast?.({ title: 'Rebalance scheduled', type: 'success', duration: 3000 }); }, onCancel: () => M.closeModal?.() });
  });
  section.querySelector('#ovl-modal-danger')?.addEventListener('click', () => {
    if (!M.openModal) return;
    M.openModal({ title: 'Terminate Agent?', content: '<p style="color:var(--rosso-corsa)">This action cannot be undone. Agent <strong>opus-07</strong> will be stopped immediately.</p>', confirmLabel: 'Terminate', cancelLabel: 'Cancel', danger: true, onConfirm: () => { M.closeModal?.(); M.toast?.({ title: 'Agent terminated', type: 'error', duration: 4000 }); }, onCancel: () => M.closeModal?.() });
  });

  // --- Toasts ---
  section.querySelector('#ovl-toast-info')?.addEventListener('click', () => M.toast?.({ title: 'Pipeline scheduled', message: 'Route optimization will run at 02:00 UTC.', type: 'info', duration: 4000 }));
  section.querySelector('#ovl-toast-success')?.addEventListener('click', () => M.toast?.({ title: 'Model deployed', message: 'gpt-4-turbo is live on us-east-1.', type: 'success', duration: 4000 }));
  section.querySelector('#ovl-toast-warning')?.addEventListener('click', () => M.toast?.({ title: 'High latency detected', message: 'ap-southeast-1 p99 > 2s. Consider scaling.', type: 'warning', duration: 4000 }));
  section.querySelector('#ovl-toast-error')?.addEventListener('click', () => M.toast?.({ title: 'Inference failure', message: 'Agent haiku-03 exceeded retry limit.', type: 'error', duration: 5000 }));

  // --- Command Palette ---
  section.querySelector('#ovl-cmd-palette')?.addEventListener('click', () => {
    if (!M.commandPalette) return;
    M.commandPalette({
      placeholder: 'Search pipelines, agents, routes…',
      items: [
        { label: 'Show active pipelines', action: () => M.toast?.({ title: 'Active pipelines: 12', type: 'info', duration: 3000 }) },
        { label: 'Open token dashboard', action: () => M.toast?.({ title: 'Token dashboard opened', type: 'success', duration: 3000 }) },
        { label: 'Trigger route rebalance', action: () => M.toast?.({ title: 'Rebalance queued', type: 'warning', duration: 3000 }) },
        { label: 'View agent logs', action: () => M.toast?.({ title: 'Logs viewer opened', type: 'info', duration: 3000 }) },
      ],
    });
  });

  // --- Drawer ---
  // openDrawer API expects a string element id, not a DOM element
  section.querySelector('#ovl-drawer-open')?.addEventListener('click', () => {
    if (!M.openDrawer) return;
    M.openDrawer('ovl-drawer-host');
    setTimeout(() => {
      const btn = document.getElementById('ovl-drawer-close-btn');
      btn?.addEventListener('click', () => M.closeDrawer?.('ovl-drawer-host'));
    }, 100);
  });
}
