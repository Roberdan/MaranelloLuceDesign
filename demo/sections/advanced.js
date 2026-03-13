/**
 * Advanced section — Extended Components: tooltip, modal, toast,
 * dropdown, tabs, breadcrumb, avatar, spinner, badge.
 */
export function createAdvancedSection() {
  const section = document.createElement('section');
  section.id = 'advanced';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">06 / INTERFACE · PATTERNS</p>
      <div class="mn-watermark">INTERFACCIA</div>
      <h2 class="mn-title-section mn-mb-sm">Extended Components</h2>
      <p class="mn-body mn-mb-2xl">Tooltip, modal, toast, dropdown, tabs, breadcrumb, avatar, spinner — every pattern a dashboard needs.</p>

      <div class="demo-section-label mn-mt-2xl">Breadcrumb</div>
      <nav class="mn-breadcrumb mn-mb-2xl" aria-label="Breadcrumb">
        <a href="#" class="mn-breadcrumb__item">Portfolio</a>
        <span class="mn-breadcrumb__sep">▸</span>
        <a href="#" class="mn-breadcrumb__item">Milano Center</a>
        <span class="mn-breadcrumb__sep">▸</span>
        <span class="mn-breadcrumb__item mn-breadcrumb__item--active">Therapy Hub</span>
      </nav>

      <div class="demo-section-label">Tooltips</div>
      <div class="mn-flex-wrap mn-gap-xl mn-mb-2xl">
        <span class="mn-tooltip-wrap">
          <button class="mn-machined-btn">Hover me</button>
          <span class="mn-tooltip" role="tooltip">Quality score: 92%</span>
        </span>
        <span class="mn-tooltip-wrap">
          <span class="mn-status mn-status--warning"><span class="mn-status__dot"></span> At Risk</span>
          <span class="mn-tooltip mn-tooltip--bottom" role="tooltip">3 checks failing since Mar 8</span>
        </span>
        <span class="mn-tooltip-wrap">
          <span class="mn-tag mn-tag--active">Therapy</span>
          <span class="mn-tooltip" role="tooltip">234 children enrolled in movement therapy</span>
        </span>
      </div>

      <div class="demo-section-label">Avatars</div>
      <div class="mn-flex-wrap mn-gap-lg mn-mb-lg" style="align-items:center">
        <div class="mn-avatar mn-avatar--xs">MR</div>
        <div class="mn-avatar mn-avatar--sm">JS</div>
        <div class="mn-avatar">AK<span class="mn-avatar__status mn-avatar__status--online"></span></div>
        <div class="mn-avatar mn-avatar--lg">YT<span class="mn-avatar__status mn-avatar__status--busy"></span></div>
        <div class="mn-avatar mn-avatar--xl">LP<span class="mn-avatar__status mn-avatar__status--away"></span></div>
      </div>
      <div class="mn-flex-wrap mn-gap-lg mn-mb-2xl" style="align-items:center">
        <span class="mn-micro mn-text-muted">Group:</span>
        <div class="mn-avatar-group">
          <div class="mn-avatar mn-avatar--sm">MR</div>
          <div class="mn-avatar mn-avatar--sm">JS</div>
          <div class="mn-avatar mn-avatar--sm">AK</div>
          <div class="mn-avatar mn-avatar--sm">+4</div>
        </div>
      </div>

      <div class="demo-section-label">Badges & Tags</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl" style="align-items:center">
        <span class="mn-tag mn-tag--active">Active</span>
        <span class="mn-tag">Therapy</span>
        <span class="mn-tag mn-tag--sm">Research</span>
        <span class="mn-tag mn-tag--xs">Q1 2026</span>
        <span class="mn-status mn-status--success"><span class="mn-status__dot"></span>Online</span>
        <span class="mn-status mn-status--danger"><span class="mn-status__dot mn-anim-pulseDot"></span>Live Alert</span>
        <span class="mn-status mn-status--warning"><span class="mn-status__dot"></span>At Risk</span>
      </div>

      <div class="demo-section-label">Dropdown</div>
      <div class="mn-mb-2xl">
        <div class="mn-dropdown" id="adv-dropdown">
          <button class="mn-dropdown__trigger">Milano Center ▾</button>
          <div class="mn-dropdown__menu">
            <button class="mn-dropdown__item mn-dropdown__item--active">Milano Center</button>
            <button class="mn-dropdown__item">Roma Studio</button>
            <button class="mn-dropdown__item">Torino Hub</button>
            <div class="mn-dropdown__divider"></div>
            <button class="mn-dropdown__item">All Centers</button>
          </div>
        </div>
      </div>

      <div class="demo-section-label">Tabs</div>
      <div class="mn-tabs mn-mb-2xl" id="adv-tabs" style="max-width:600px">
        <div class="mn-tabs__list" role="tablist">
          <button class="mn-tabs__tab mn-tabs__tab--active" role="tab">Overview</button>
          <button class="mn-tabs__tab" role="tab">Activities</button>
          <button class="mn-tabs__tab" role="tab">Resources</button>
          <button class="mn-tabs__tab" role="tab">Quality</button>
        </div>
        <div class="mn-tabs__panel mn-tabs__panel--active" role="tabpanel">
          <p class="mn-micro mn-text-muted">47 active programs · 87% utilization · 65/100 quality score</p>
        </div>
        <div class="mn-tabs__panel" role="tabpanel">
          <p class="mn-micro mn-text-muted">128 therapy activities running across MVP, MVE, and Technical Advisory types</p>
        </div>
        <div class="mn-tabs__panel" role="tabpanel">
          <p class="mn-micro mn-text-muted">46.4 FTE allocated · 12 specialists across 3 time zones</p>
        </div>
        <div class="mn-tabs__panel" role="tabpanel">
          <p class="mn-micro mn-text-muted">9 quality checks: 6 passing, 2 warnings, 1 critical</p>
        </div>
      </div>

      <div class="demo-section-label">Spinners</div>
      <div class="mn-flex-wrap mn-gap-2xl mn-mb-2xl" style="align-items:center">
        <div class="mn-text-center">
          <div class="mn-spinner mn-spinner--sm"><div class="mn-spinner__ring"></div></div>
          <div class="mn-spinner__label">Small</div>
        </div>
        <div class="mn-text-center">
          <div class="mn-spinner"><div class="mn-spinner__ring"></div></div>
          <div class="mn-spinner__label">Default</div>
        </div>
        <div class="mn-text-center">
          <div class="mn-spinner mn-spinner--lg"><div class="mn-spinner__ring"></div></div>
          <div class="mn-spinner__label">Large</div>
        </div>
        <div class="mn-text-center">
          <div class="mn-spinner mn-spinner--gauge"><div class="mn-spinner__ring"></div></div>
          <div class="mn-spinner__label">Gauge</div>
        </div>
      </div>

      <div class="demo-section-label">Modal</div>
      <div class="mn-mb-2xl">
        <button class="mn-machined-btn" id="adv-modal-open"><span class="mn-machined-btn__indicator"></span>Open Modal</button>
      </div>

      <div class="mn-modal-backdrop" id="adv-modal">
        <div class="mn-modal">
          <div class="mn-modal__header">
            <span class="mn-modal__title">Engagement Detail</span>
            <button class="mn-modal__close" id="adv-modal-close" aria-label="Close">✕</button>
          </div>
          <div class="mn-modal__body">
            <p><strong>Milano Therapy Hub</strong> — MVP program in Milano Center.</p>
            <p style="margin-top:var(--space-md)">Quality: 92% · FTE: 2.4 · Status: Active</p>
            <p style="margin-top:var(--space-md)">Click outside or press Escape to close.</p>
          </div>
          <div class="mn-modal__footer">
            <button class="mn-btn mn-btn--ghost mn-btn--sm" id="adv-modal-cancel">Cancel</button>
            <button class="mn-btn mn-btn--accent mn-btn--sm" id="adv-modal-confirm">View Full Detail</button>
          </div>
        </div>
      </div>

      <div class="demo-section-label">Toast Notifications</div>
      <div class="mn-flex-wrap mn-gap-md mn-mb-2xl">
        <button class="mn-machined-btn" id="adv-toast-success">Success Toast</button>
        <button class="mn-machined-btn mn-machined-btn--amber" id="adv-toast-warning">Warning Toast</button>
        <button class="mn-machined-btn" id="adv-toast-danger">Error Toast</button>
        <button class="mn-machined-btn mn-machined-btn--off" id="adv-toast-info">Info Toast</button>
      </div>

      <div class="demo-section-label">Command Palette (⌘K)</div>
      <div class="mn-mb-2xl">
        <button class="mn-machined-btn" id="adv-cmd-palette"><span class="mn-machined-btn__indicator"></span>Open Palette</button>
        <span class="mn-micro mn-text-muted" style="margin-left:var(--space-md)">or press ⌘K / Ctrl+K</span>
      </div>

      <div class="demo-section-label">Drawer Panel</div>
      <div class="mn-mb-2xl">
        <button class="mn-machined-btn" id="adv-drawer-open"><span class="mn-machined-btn__indicator"></span>Open Drawer</button>
      </div>
    </div>
  `;

  requestAnimationFrame(() => initAdvanced(section));
  return section;
}

function initAdvanced(section) {
  const M = window.Maranello;

  if (M?.initDropdown) M.initDropdown(section.querySelector('#adv-dropdown'));
  if (M?.initTabs) M.initTabs(section.querySelector('#adv-tabs'));

  const openModal = () => {
    if (M?.openModal) { M.openModal('adv-modal'); return; }
    section.querySelector('#adv-modal')?.classList.add('mn-modal-backdrop--open');
  };
  const closeModal = () => {
    if (M?.closeModal) { M.closeModal('adv-modal'); return; }
    section.querySelector('#adv-modal')?.classList.remove('mn-modal-backdrop--open');
  };

  section.querySelector('#adv-modal-open')?.addEventListener('click', openModal);
  section.querySelector('#adv-modal-close')?.addEventListener('click', closeModal);
  section.querySelector('#adv-modal-cancel')?.addEventListener('click', closeModal);
  section.querySelector('#adv-modal-confirm')?.addEventListener('click', closeModal);
  section.querySelector('#adv-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  if (M?.toast) {
    const toasts = [
      ['adv-toast-success', { type: 'success', title: 'Donation Confirmed', message: 'EUR 250 received for Summer Therapy Fund.' }],
      ['adv-toast-warning', { type: 'warning', title: 'Low Capacity', message: 'Milano Center is at 92% capacity.' }],
      ['adv-toast-danger',  { type: 'danger',  title: 'Service Alert',   message: 'Research Database is experiencing delays.' }],
      ['adv-toast-info',    { type: 'info',    title: 'New Volunteer',   message: 'A new volunteer registered in Torino.' }],
    ];
    toasts.forEach(([id, opts]) => {
      section.querySelector('#' + id)?.addEventListener('click', () => M.toast(opts));
    });
  }

  // Command Palette
  if (M?.commandPalette) {
    M.commandPalette({
      commands: [
        { id: 'theme-nero', label: 'Switch to Nero theme', action: () => M.setTheme?.('nero') },
        { id: 'theme-avorio', label: 'Switch to Avorio theme', action: () => M.setTheme?.('avorio') },
        { id: 'go-charts', label: 'Go to Charts', action: () => document.querySelector('#charts')?.scrollIntoView({ behavior: 'smooth' }) },
        { id: 'go-gauges', label: 'Go to Gauges', action: () => document.querySelector('#gauges')?.scrollIntoView({ behavior: 'smooth' }) },
      ],
    });
    section.querySelector('#adv-cmd-palette')?.addEventListener('click', () => {
      document.querySelector('.mn-command-palette')?.classList.add('mn-command-palette--open');
    });
  }

  // Drawer
  section.querySelector('#adv-drawer-open')?.addEventListener('click', () => {
    if (M?.openDrawer) M.openDrawer({ title: 'Detail Drawer', content: '<p class="mn-body">Drawer panel for side content. Close with × or click outside.</p>' });
  });
}
