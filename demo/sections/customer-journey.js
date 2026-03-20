/**
 * Customer Journey section — interactive swimlane visualization.
 * Maranello Luce sample: Meridian Consulting Group engagement history.
 */

const PHASES = [
  {
    id: 'lead', label: 'Lead Generation',
    engagements: [
      { id: 'e1', title: 'Primo incontro commerciale', status: 'completed', type: 'meeting', assignee: 'Marco Bianchi', date: '2025-09-12' },
      { id: 'e2', title: 'Qualifica esigenze IT', status: 'completed', type: 'meeting', assignee: 'Elena Rossi', date: '2025-09-18' },
    ],
  },
  {
    id: 'opportunity', label: 'Opportunity',
    engagements: [
      { id: 'e3', title: 'Proposta BPM Enterprise', status: 'completed', type: 'opportunity', assignee: 'Luca Ferretti', date: '2025-10-02' },
      { id: 'e4', title: 'Demo piattaforma', status: 'completed', type: 'meeting', assignee: 'Sara Conti', date: '2025-10-10' },
      { id: 'e5', title: 'Negoziazione contratto', status: 'completed', type: 'opportunity', assignee: 'Marco Bianchi', date: '2025-10-22' },
    ],
  },
  {
    id: 'contract', label: 'Contract',
    engagements: [
      { id: 'e6', title: 'Bozza contratto Enterprise', status: 'active', type: 'contract', assignee: 'Ufficio Legale', date: '2025-11-05' },
      { id: 'e7', title: 'Revisione legale', status: 'pending', type: 'contract', assignee: 'Anna Marchetti' },
      { id: 'e8', title: 'Firma digitale', status: 'pending', type: 'contract' },
    ],
  },
  {
    id: 'onboarding', label: 'Onboarding',
    engagements: [
      { id: 'e9', title: 'Kickoff progetto', status: 'pending', type: 'meeting' },
      { id: 'e10', title: 'Formazione piattaforma', status: 'pending', type: 'task' },
      { id: 'e11', title: 'Go-live produzione', status: 'pending', type: 'task' },
    ],
  },
  {
    id: 'support', label: 'Support',
    engagements: [
      { id: 'e12', title: 'Ticket #1001 — SLA breach alert', status: 'completed', type: 'ticket', assignee: 'Paolo Verdi', date: '2025-12-03' },
      { id: 'e13', title: 'Ticket #1044 — Integrazione API', status: 'active', type: 'ticket', assignee: 'Chiara Neri', date: '2026-01-15' },
    ],
  },
];

/** Build flat stat pills (no 3D neumorphic balls). */
function buildSummaryStrip(container) {
  const strip = document.createElement('div');
  strip.style.cssText = 'display:flex;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-xl)';
  const total = PHASES.reduce((n, p) => n + p.engagements.length, 0);
  const done = PHASES.reduce((n, p) => n + p.engagements.filter(e => e.status === 'completed').length, 0);
  const active = PHASES.reduce((n, p) => n + p.engagements.filter(e => e.status === 'active').length, 0);

  const stats = [
    { label: 'FASI', value: PHASES.length },
    { label: 'TOTALI', value: total },
    { label: 'COMPLETATE', value: done },
    { label: 'IN CORSO', value: active },
    { label: 'IN ATTESA', value: total - done - active },
  ];

  for (const s of stats) {
    const pill = document.createElement('div');
    pill.style.cssText = 'text-align:center;padding:var(--space-sm) var(--space-md);background:var(--mn-surface-raised);border-radius:var(--radius-md);border:1px solid var(--mn-border)';
    pill.innerHTML = `<div style="font-size:var(--text-h3);font-weight:700;color:var(--mn-text)">${s.value}</div><div class="mn-micro" style="color:var(--mn-text-muted)">${s.label}</div>`;
    strip.appendChild(pill);
  }
  container.appendChild(strip);
}

export function createCustomerJourneySection() {
  const M = window.Maranello ?? {};
  const section = document.createElement('section');
  section.id = 'customer-journey';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">42 — Customer Journey</p>
      <div class="mn-watermark">JOURNEY</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Customer Journey — Meridian Consulting Group</h2>
      <p class="mn-body mn-mb-sm">Percorso cliente completo — dalla lead generation al supporto post-vendita</p>
      <p class="mn-caption mn-mb-lg">Swimlane visualization of the full client engagement lifecycle.</p>

      <div id="cj-summary"></div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <span class="mn-label" style="color:var(--mn-accent)">Journey Swimlane</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="cj-compact" style="font-size:var(--text-micro)" aria-pressed="false">Compact</button>
            <button class="mn-btn mn-btn--ghost" id="cj-vertical" style="font-size:var(--text-micro)" aria-pressed="false">Vertical</button>
          </div>
        </div>
        <div id="cj-root"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Headless usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.customerJourney(el, phases, {
  onSelect: (eng) => console.log(eng.title),
  showConnectors: true,
});
ctrl.update(newPhases);   // re-render
ctrl.selectEngagement('e3');
ctrl.destroy();</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <span class="mn-label" style="color:var(--mn-accent);display:block;margin-bottom:var(--space-md)">Web Component</span>
        <mn-customer-journey phases='${JSON.stringify(PHASES)}'></mn-customer-journey>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">WC usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">&lt;mn-customer-journey
  phases='[{"id":"lead","label":"Lead Generation","engagements":[...]}]'
  orientation="horizontal"
  show-connectors
&gt;&lt;/mn-customer-journey&gt;</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    buildSummaryStrip(section.querySelector('#cj-summary'));

    const root = section.querySelector('#cj-root');
    if (!M || !M.customerJourney) {
      root.innerHTML = '<p class="mn-micro" style="color:var(--mn-text-muted);padding:var(--space-md)">customerJourney: not yet in IIFE bundle — rebuild with npm run build</p>';
      return;
    }

    let ctrl = M.customerJourney(root, PHASES, {
      onSelect: (eng) => {
        M.toast({ type: 'info', title: eng.title, message: `${eng.type} — ${eng.status}${eng.assignee ? ' — ' + eng.assignee : ''}` });
      },
      showConnectors: true,
    });

    /* Compact toggle */
    const compactBtn = section.querySelector('#cj-compact');
    const verticalBtn = section.querySelector('#cj-vertical');
    compactBtn.addEventListener('click', () => {
      const pressed = compactBtn.getAttribute('aria-pressed') === 'true';
      compactBtn.setAttribute('aria-pressed', String(!pressed));
      verticalBtn.setAttribute('aria-pressed', 'false');
      ctrl.destroy();
      ctrl = M.customerJourney(root, PHASES, {
        compactMode: !pressed, showConnectors: true,
        onSelect: (eng) => M.toast({ type: 'info', title: eng.title, message: eng.status }),
      });
    });

    /* Vertical toggle */
    verticalBtn.addEventListener('click', () => {
      const pressed = verticalBtn.getAttribute('aria-pressed') === 'true';
      verticalBtn.setAttribute('aria-pressed', String(!pressed));
      compactBtn.setAttribute('aria-pressed', 'false');
      ctrl.destroy();
      ctrl = M.customerJourney(root, PHASES, {
        orientation: !pressed ? 'vertical' : 'horizontal', showConnectors: true,
        onSelect: (eng) => M.toast({ type: 'info', title: eng.title, message: eng.status }),
      });
    });
  });

  return section;
}
