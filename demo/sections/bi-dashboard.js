/**
 * BI Dashboard section — riskMatrix, kpiScorecard, approvalChain, cohortGrid
 * Business intelligence components for executive dashboards.
 */

const RISK_ITEMS = [
  { id: 'r1', label: 'Vendor lock-in',    probability: 3, impact: 4 },
  { id: 'r2', label: 'Data breach',       probability: 2, impact: 5 },
  { id: 'r3', label: 'Model drift',       probability: 4, impact: 3 },
  { id: 'r4', label: 'Cost overrun',      probability: 4, impact: 4 },
  { id: 'r5', label: 'Latency SLA',       probability: 3, impact: 3 },
  { id: 'r6', label: 'Regulatory',        probability: 2, impact: 4 },
  { id: 'r7', label: 'Team turnover',     probability: 3, impact: 2 },
];

const KPI_ROWS = [
  { id: 'k1', label: 'P95 Latency',   unit: 'ms',  target: 450,  actual: 387, trend: [510,490,460,440,420,400,387], format: 'number' },
  { id: 'k2', label: 'Error Rate',    unit: '%',   target: 0.5,  actual: 0.3, trend: [1.2,0.9,0.7,0.6,0.5,0.4,0.3], format: 'percent' },
  { id: 'k3', label: 'MRR',           unit: '',    target: 120000, actual: 134500, trend: [95000,102000,108000,115000,122000,128000,134500], format: 'currency' },
  { id: 'k4', label: 'Token Spend',   unit: '',    target: 50000, actual: 61200, trend: [32000,38000,43000,48000,54000,58000,61200], format: 'currency' },
  { id: 'k5', label: 'Agent Uptime',  unit: '%',   target: 99.9, actual: 99.7, trend: [99.5,99.6,99.7,99.8,99.9,99.8,99.7], format: 'percent' },
];

const APPROVAL_STEPS = [
  { id: 'ap1', name: 'Laura Chen',    role: 'PM',          status: 'approved',  timestamp: '09:14' },
  { id: 'ap2', name: 'Marco Rossi',   role: 'Tech Lead',   status: 'approved',  timestamp: '10:02' },
  { id: 'ap3', name: 'Sara Bianchi',  role: 'Security',    status: 'current' },
  { id: 'ap4', name: 'Luca Ferrari',  role: 'Finance',     status: 'pending' },
  { id: 'ap5', name: 'Anna Neri',     role: 'CTO',         status: 'pending' },
];

const COHORT_ROWS = [
  { label: 'Jan 2026', initialSize: 1240, retention: [1.0, 0.72, 0.58, 0.48, 0.41, 0.36] },
  { label: 'Feb 2026', initialSize: 1580, retention: [1.0, 0.74, 0.61, 0.52, 0.44, 0.39] },
  { label: 'Mar 2026', initialSize: 2100, retention: [1.0, 0.76, 0.63, 0.54, 0.46] },
  { label: 'Apr 2026', initialSize: 2450, retention: [1.0, 0.78, 0.65, 0.55] },
  { label: 'May 2026', initialSize: 3020, retention: [1.0, 0.80, 0.67] },
  { label: 'Jun 2026', initialSize: 3600, retention: [1.0, 0.82] },
  { label: 'Jul 2026', initialSize: 4100, retention: [1.0] },
];

export function createBiDashboardSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'bi-dashboard';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">38 — BI Dashboard</p>
      <div class="mn-watermark">BUSINESS</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Business Intelligence</h2>
      <p class="mn-body mn-mb-2xl">Risk matrix, KPI scorecard, approval workflow, and cohort retention grid — all interactive.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl)">

        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
            <span class="mn-label" style="color:var(--mn-accent)">Risk Matrix</span>
            <span class="mn-micro" style="color:var(--mn-text-muted)">Hover to inspect · click to detail</span>
          </div>
          <div style="position:relative"><canvas id="bi-risk" style="display:block;width:100%;height:320px"></canvas></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.riskMatrix(canvas, { items, onClick, onHover });</pre>
          </details>
        </div>

        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
            <span class="mn-label" style="color:var(--mn-accent)">KPI Scorecard</span>
            <span class="mn-micro" style="color:var(--mn-text-muted)">Click row for detail</span>
          </div>
          <div id="bi-kpi"></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.kpiScorecard(el, rows, { onSelect, currency: 'EUR' });</pre>
          </details>
        </div>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">Approval Chain — Model Deployment</span>
          <div style="display:flex;gap:var(--space-sm);align-items:center">
            <div id="bi-approval-status" class="mn-micro" style="color:var(--mn-text-muted)"></div>
            <button class="mn-btn mn-btn--ghost" id="bi-approval-approve" style="font-size:var(--text-micro)">Approve current</button>
            <button class="mn-btn mn-btn--ghost" id="bi-approval-reject" style="font-size:var(--text-micro)">Reject</button>
          </div>
        </div>
        <div id="bi-approval"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.approvalChain(el, steps, { editable: true, onAction });
ctrl.setStatus(id, 'approved', '10:30');</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
          <span class="mn-label" style="color:var(--mn-accent)">Cohort Retention Grid</span>
          <button class="mn-btn mn-btn--ghost" id="bi-cohort-toggle" style="font-size:var(--text-micro)">Show absolute</button>
        </div>
        <div id="bi-cohort"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.cohortGrid(el, rows, { periodLabels, showAbsolute: false });</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    /* ── Risk Matrix ── */
    M.riskMatrix(section.querySelector('#bi-risk'), {
      items: RISK_ITEMS, animate: true,
      onClick: (item) => M.toast({ type: 'info', title: item.label, message: `P${item.probability} × I${item.impact} = ${item.probability * item.impact}` }),
    });

    /* ── KPI Scorecard ── */
    M.kpiScorecard(section.querySelector('#bi-kpi'), KPI_ROWS, {
      currency: 'EUR',
      onSelect: (row) => M.toast({ type: 'info', title: row.label, message: `Target: ${row.target} | Actual: ${row.actual}` }),
    });

    /* ── Approval Chain ── */
    const approvalStatus = section.querySelector('#bi-approval-status');
    const steps = [...APPROVAL_STEPS];
    const approvalCtrl = M.approvalChain(section.querySelector('#bi-approval'), steps, {
      onAction: (step, action) => {
        approvalCtrl.setStatus(step.id, action === 'approve' ? 'approved' : 'rejected',
          new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }));
        const nextPending = steps.find(s => s.status === 'pending');
        if (nextPending) approvalCtrl.setStatus(nextPending.id, 'current');
        approvalStatus.textContent = `${action === 'approve' ? 'Approved' : 'Rejected'}: ${step.name}`;
        M.toast({ type: action === 'approve' ? 'success' : 'error', title: `${action === 'approve' ? 'Approved' : 'Rejected'}`, message: step.name });
      },
    });
    section.querySelector('#bi-approval-approve').addEventListener('click', () => {
      const current = steps.find(s => s.status === 'current');
      if (current) approvalCtrl.setStatus(current.id, 'approved', new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }));
    });
    section.querySelector('#bi-approval-reject').addEventListener('click', () => {
      const current = steps.find(s => s.status === 'current');
      if (current) approvalCtrl.setStatus(current.id, 'rejected');
    });

    /* ── Cohort Grid ── */
    let showAbsolute = false;
    const cohortCtrl = M.cohortGrid(section.querySelector('#bi-cohort'), COHORT_ROWS, {
      periodLabels: ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
      showAbsolute,
    });
    section.querySelector('#bi-cohort-toggle').addEventListener('click', function() {
      showAbsolute = !showAbsolute;
      this.textContent = showAbsolute ? 'Show percent' : 'Show absolute';
      cohortCtrl.update(COHORT_ROWS, { showAbsolute });
    });
  });

  return section;
}
