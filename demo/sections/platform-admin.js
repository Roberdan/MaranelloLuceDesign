/**
 * Platform Admin section — userTable, auditLog, system health indicators.
 * Typical SaaS platform administration UI.
 */

const DEMO_USERS = [
  { id: 'u1', name: 'Laura Chen',    email: 'laura@example.com',   role: 'admin',   status: 'active',   lastActive: '2m ago',   teams: ['Engineering', 'AI'] },
  { id: 'u2', name: 'Marco Rossi',   email: 'marco@example.com',   role: 'member',  status: 'active',   lastActive: '1h ago',   teams: ['Product'] },
  { id: 'u3', name: 'Sara Bianchi',  email: 'sara@example.com',    role: 'viewer',  status: 'active',   lastActive: 'Yesterday', teams: ['Design'] },
  { id: 'u4', name: 'Luca Ferrari',  email: 'luca@example.com',    role: 'billing', status: 'inactive', lastActive: 'Jan 8',     teams: ['Finance'] },
  { id: 'u5', name: 'Anna Neri',     email: 'anna@example.com',    role: 'member',  status: 'suspended',lastActive: 'Dec 12',    teams: ['Sales', 'CS'] },
  { id: 'u6', name: 'Dev Bot',       email: 'bot@example.com',     role: 'member',  status: 'invited',  lastActive: '—',         teams: [] },
  { id: 'u7', name: 'Paolo Verdi',   email: 'paolo@example.com',   role: 'member',  status: 'active',   lastActive: '3h ago',    teams: ['Engineering'] },
  { id: 'u8', name: 'Elena Russo',   email: 'elena@example.com',   role: 'admin',   status: 'active',   lastActive: '30m ago',   teams: ['Engineering', 'Security'] },
];

const AUDIT_ENTRIES = [
  { id: 'a1', timestamp: '09:42:11', actor: 'laura@example.com',  actorRole: 'admin',   action: 'Updated user role',   resource: 'user:marco@example.com',  severity: 'info',    ipAddress: '192.168.1.10' },
  { id: 'a2', timestamp: '09:38:05', actor: 'system',             actorRole: 'agent',   action: 'Budget alert triggered', resource: 'budget:claude-sonnet',   severity: 'warning', metadata: { threshold: '80%', current: '$3,840', budget: '$4,800' } },
  { id: 'a3', timestamp: '09:31:22', actor: 'elena@example.com',  actorRole: 'admin',   action: 'Deployed model config', resource: 'model:claude-sonnet-4-6', severity: 'success', ipAddress: '192.168.1.42' },
  { id: 'a4', timestamp: '09:15:00', actor: 'api-key:prod-01',    actorRole: 'api-key', action: 'Rate limit exceeded',   resource: 'endpoint:/v1/messages',   severity: 'error',   metadata: { limit: '1000/min', actual: '1247/min' } },
  { id: 'a5', timestamp: '09:02:44', actor: 'laura@example.com',  actorRole: 'admin',   action: 'Suspended user',        resource: 'user:anna@example.com',   severity: 'warning', ipAddress: '192.168.1.10' },
  { id: 'a6', timestamp: '08:55:18', actor: 'system',             actorRole: 'agent',   action: 'DB backup completed',   resource: 'storage:prod-backup',     severity: 'success' },
  { id: 'a7', timestamp: '08:30:00', actor: 'luca@example.com',   actorRole: 'billing', action: 'Invoice downloaded',    resource: 'invoice:INV-2026-042',    severity: 'info',    ipAddress: '10.0.0.5' },
  { id: 'a8', timestamp: '08:12:33', actor: 'system',             actorRole: 'monitor', action: 'Auth failure cluster',  resource: 'region:eu-west-1',        severity: 'critical',metadata: { attempts: '47', window: '5min', source: '185.x.x.x' } },
];

export function createPlatformAdminSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'platform-admin';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">39 — Platform Admin</p>
      <div class="mn-watermark">ADMIN</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Platform Administration</h2>
      <p class="mn-body mn-mb-2xl">User management, audit log, and operational controls — built for internal admin teams.</p>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <span class="mn-label" style="color:var(--mn-accent)">User Management</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="adm-invite" style="font-size:var(--text-micro)">+ Invite</button>
            <button class="mn-btn mn-btn--ghost" id="adm-export" style="font-size:var(--text-micro)">Export CSV</button>
          </div>
        </div>
        <div id="adm-users"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const ctrl = M.userTable(el, users, { searchable: true, onAction, onSelect });</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <span class="mn-label" style="color:var(--mn-accent)">Audit Log</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="adm-audit-add" style="font-size:var(--text-micro)">+ Simulate event</button>
            <button class="mn-btn mn-btn--ghost" id="adm-audit-clear" style="font-size:var(--text-micro)">Clear</button>
          </div>
        </div>
        <div id="adm-audit"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const log = M.auditLog(el, entries, { live: true, onSelect });
log.prepend({ actor, action, severity: 'warning' });</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    /* ── User Table ── */
    const usersEl = section.querySelector('#adm-users');
    if (M.userTable) {
      M.userTable(usersEl, DEMO_USERS, {
        searchable: true, selectable: true,
        onSelect: (user) => M.toast({ type: 'info', title: user.name, message: `${user.role} · ${user.status}` }),
        onAction: (user, action) => {
          const msgs = { edit: 'Opening editor...', suspend: `Suspending ${user.name}`, delete: `Delete ${user.name}?`, 'resend-invite': `Invite resent to ${user.email}` };
          M.toast({ type: action === 'delete' ? 'error' : action === 'suspend' ? 'warning' : 'info', title: action, message: msgs[action] });
        },
      });
    } else {
      usersEl.innerHTML = '<p class="mn-micro" style="color:var(--mn-text-muted);padding:var(--space-md)">userTable: loading...</p>';
    }
    section.querySelector('#adm-invite').addEventListener('click', () => M.toast({ type: 'info', title: 'Invite user', message: 'Opening invite dialog...' }));
    section.querySelector('#adm-export').addEventListener('click', () => M.toast({ type: 'success', title: 'Exported', message: `${DEMO_USERS.length} users to CSV` }));

    /* ── Audit Log ── */
    const auditCtrl = M.auditLog(section.querySelector('#adm-audit'), AUDIT_ENTRIES, {
      filterable: true, live: true,
      onSelect: (entry) => M.toast({ type: 'info', title: entry.action, message: `${entry.actor} · ${entry.timestamp}` }),
    });
    const SEVERITIES = ['info', 'warning', 'error', 'success', 'critical'];
    const SIM_ACTIONS = ['Config updated', 'API key rotated', 'Agent deployed', 'Memory limit hit', 'Backup started'];
    let simIdx = 0;
    section.querySelector('#adm-audit-add').addEventListener('click', () => {
      const sev = SEVERITIES[simIdx % SEVERITIES.length];
      const action = SIM_ACTIONS[simIdx % SIM_ACTIONS.length];
      simIdx++;
      auditCtrl.prepend({ id: `sim-${simIdx}`, timestamp: new Date().toLocaleTimeString('en', { hour12: false }),
        actor: 'demo@example.com', actorRole: 'admin', action, resource: `resource:${simIdx}`,
        severity: sev, ipAddress: '10.0.0.' + simIdx });
    });
    section.querySelector('#adm-audit-clear').addEventListener('click', () => auditCtrl.clear());
  });

  return section;
}
