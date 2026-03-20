/**
 * Admin Components section — adminShell, sectionCard, settingsPanel.
 * Maranello Luce admin console context with realistic navigation and settings.
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '\u2302', section: 'Generale' },
  { id: 'users',     label: 'Utenti',    icon: '\u263A', section: 'Generale' },
  { id: 'audit-log', label: 'Audit Log', icon: '\u2691', section: 'Generale', badge: '3' },
  { id: 'pat',       label: 'PAT Tokens', icon: '\u2699', section: 'Sicurezza' },
  { id: 'flags',     label: 'Feature Flags', icon: '\u2690', section: 'Sicurezza' },
  { id: 'billing',   label: 'Fatturazione', icon: '\u20AC', section: 'Account' },
  { id: 'support',   label: 'Supporto',  icon: '\u260E', section: 'Account' },
];

const KPI_DATA = [
  { label: 'Utenti attivi', value: '1.247', delta: '+8.3%' },
  { label: 'Processi in corso', value: '84', delta: '+12' },
  { label: 'Ticket aperti', value: '17', delta: '-3' },
  { label: 'Uptime SLA', value: '99.94%', delta: '' },
];

/** Build a KPI strip inside the provided container. */
function buildKpiStrip(container) {
  const strip = document.createElement('div');
  strip.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-md)';
  for (const kpi of KPI_DATA) {
    const card = document.createElement('div');
    card.className = 'mn-card-dark';
    card.style.cssText = 'padding:var(--space-md);text-align:center';
    card.innerHTML = `
      <span class="mn-stat__value" style="font-size:var(--text-h3);color:var(--mn-accent)">${kpi.value}</span>
      <span class="mn-stat__label" style="display:block;font-size:var(--text-micro);color:var(--mn-text-muted);margin-top:var(--space-xs)">${kpi.label}</span>
      ${kpi.delta ? `<span class="mn-micro" style="color:var(${kpi.delta.startsWith('-') ? '--signal-warning' : '--signal-ok'})">${kpi.delta}</span>` : ''}`;
    strip.appendChild(card);
  }
  container.appendChild(strip);
}

/** Build the settings panel content. */
function buildSettings(container, M) {
  if (!M.settingsPanel) {
    container.innerHTML = '<p class="mn-micro" style="color:var(--mn-text-muted);padding:var(--space-md)">settingsPanel: not yet in IIFE bundle</p>';
    return;
  }
  M.settingsPanel(container, {
    sections: [
      {
        id: 'appearance',
        title: 'Aspetto',
        description: 'Personalizza il tema e le preferenze visive della piattaforma.',
        items: [
          {
            type: 'radio', label: 'Tema',
            value: 'nero',
            options: [
              { label: 'Nero', value: 'nero' },
              { label: 'Sugar', value: 'sugar' },
              { label: 'Avorio', value: 'avorio' },
              { label: 'Editorial', value: 'editorial' },
              { label: 'Daltonismo', value: 'colorblind' },
            ],
            onChange: (v) => { if (M.setTheme) M.setTheme(v); },
          },
          {
            type: 'select', label: 'Lingua',
            value: 'it',
            options: [
              { label: 'Italiano', value: 'it' },
              { label: 'English', value: 'en' },
            ],
            onChange: () => {},
          },
          {
            type: 'range', label: 'Dimensione font',
            min: 12, max: 20, step: 1, value: 16,
            format: (v) => `${v}px`,
            onChange: (v) => { document.documentElement.style.fontSize = `${v}px`; },
          },
          {
            type: 'toggle', label: 'Animazioni ridotte',
            description: 'Disabilita transizioni e animazioni per utenti sensibili al movimento.',
            value: false,
            onChange: (v) => { document.body.classList.toggle('mn-a11y-reduced-motion', v); },
          },
          {
            type: 'toggle', label: 'Notifiche desktop',
            description: 'Ricevi notifiche push per eventi critici.',
            value: true,
            onChange: () => {},
          },
        ],
      },
      {
        id: 'system',
        title: 'Sistema',
        items: [
          { type: 'info', label: 'Versione', value: 'v4.19.0', mono: true },
          { type: 'info', label: 'Ambiente', value: 'Production' },
        ],
      },
      {
        id: 'danger',
        title: 'Zona pericolosa',
        description: 'Azioni irreversibili. Procedere con cautela.',
        items: [
          {
            type: 'action', label: 'Ripristino impostazioni',
            description: 'Riporta tutte le preferenze ai valori predefiniti.',
            buttonLabel: 'Ripristina',
            variant: 'danger',
            onAction: () => {
              if (M.toast) M.toast({ type: 'warning', title: 'Ripristino', message: 'Impostazioni ripristinate ai valori predefiniti' });
              document.documentElement.style.fontSize = '';
              document.body.classList.remove('mn-a11y-reduced-motion');
              if (M.setTheme) M.setTheme('nero');
            },
          },
        ],
      },
    ],
  });
}

export function createAdminComponentsSection() {
  const M = window.Maranello ?? {};
  const section = document.createElement('section');
  section.id = 'admin-components';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">43 — Admin Components</p>
      <div class="mn-watermark">ADMIN</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Admin Components</h2>
      <p class="mn-body mn-mb-lg">Composable admin primitives — shell layout, section cards, and settings panel — for building internal Maranello Luce admin consoles.</p>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <span class="mn-label" style="color:var(--mn-accent);display:block;margin-bottom:var(--space-md)">Admin Shell</span>
        <div id="ac-shell" style="height:420px;border:1px solid var(--mn-border);border-radius:var(--radius-md);overflow:hidden;position:relative"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const shell = M.adminShell(el, {
  sidebar: { header: { title: 'Maranello Luce' }, nav: [...] },
  onNavigate: (pageId) => loadPage(pageId),
});
shell.contentEl.appendChild(myContent);</pre>
        </details>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <span class="mn-label" style="color:var(--mn-accent);display:block;margin-bottom:var(--space-md)">Section Card + KPI</span>
        <div id="ac-card"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const card = M.sectionCard(el, {
  title: 'Overview', action: { label: 'Esporta', onClick: fn },
});
card.bodyEl.appendChild(content);</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <span class="mn-label" style="color:var(--mn-accent);display:block;margin-bottom:var(--space-md)">Settings Panel</span>
        <div id="ac-settings"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const panel = M.settingsPanel(el, {
  sections: [{ title: 'Aspetto', items: [
    { type: 'radio', label: 'Tema', options: [...], onChange },
    { type: 'toggle', label: 'Animazioni ridotte', onChange },
  ]}],
});</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    /* Admin Shell */
    const shellEl = section.querySelector('#ac-shell');
    if (M && M.adminShell) {
      const shell = M.adminShell(shellEl, {
        sidebar: {
          header: { icon: '\u2302', title: 'Maranello Luce', badge: 'v3.2' },
          search: { placeholder: 'Cerca pagina...', shortcut: '/' },
          nav: NAV_ITEMS,
        },
        onNavigate: (id) => {
          shell.contentEl.innerHTML = '';
          const item = NAV_ITEMS.find(n => n.id === id);
          const h = document.createElement('h3');
          h.className = 'mn-label';
          h.style.cssText = 'color:var(--mn-text);padding:var(--space-lg)';
          h.textContent = item ? item.label : id;
          shell.contentEl.appendChild(h);
          const p = document.createElement('p');
          p.className = 'mn-micro';
          p.style.cssText = 'color:var(--mn-text-muted);padding:0 var(--space-lg)';
          p.textContent = `Contenuto della sezione "${item?.label ?? id}" — collegare i dati reali qui.`;
          shell.contentEl.appendChild(p);
        },
        initialPage: 'dashboard',
      });
    } else {
      shellEl.innerHTML = '<p class="mn-micro" style="color:var(--mn-text-muted);padding:var(--space-md)">adminShell: not yet in IIFE bundle</p>';
    }

    /* Section Card with KPI */
    const cardEl = section.querySelector('#ac-card');
    if (M && M.sectionCard) {
      const card = M.sectionCard(cardEl, {
        title: 'Overview piattaforma',
        action: {
          label: 'Esporta report',
          onClick: () => M.toast?.({ type: 'success', title: 'Esportazione', message: 'Report CSV generato con successo' }),
        },
      });
      buildKpiStrip(card.bodyEl);
    } else {
      cardEl.innerHTML = '<p class="mn-micro" style="color:var(--mn-text-muted);padding:var(--space-md)">sectionCard: not yet in IIFE bundle</p>';
    }

    /* Settings Panel */
    buildSettings(section.querySelector('#ac-settings'), M);
  });

  return section;
}
