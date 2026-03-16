/**
 * Dashboard Widgets section — activityFeed, dateRangePicker, bulletChart, notificationCenter
 */

const FEED_ITEMS = [
  { id: '1', title: 'Pipeline Alpha promoted to production', meta: '2 min ago', type: 'success' },
  { id: '2', title: 'Token budget warning — us-east-1', body: 'Spend reached 85% of monthly cap.', meta: '18 min ago', type: 'warning' },
  { id: '3', title: 'Agent Sonnet failover triggered', body: 'Primary model unreachable. Rerouted to backup.', meta: '1 hr ago', type: 'danger' },
  { id: '4', title: 'Embedding refresh completed — eu-west-1', meta: '3 hr ago', type: 'info' },
  { id: '5', title: 'Config snapshot saved', meta: '6 hr ago', type: 'default' },
];

const BULLET_KPIS = [
  { label: 'Inference runs', value: 7800, target: 9000, max: 12000, unit: 'k' },
  { label: 'Accuracy', value: 94, target: 90, max: 100, unit: '%' },
  { label: 'P95 latency', value: 340, target: 400, max: 600, unit: 'ms' },
];

const NOTIFS = [
  { id: 'n1', title: 'Deploy #1042 succeeded', type: 'success', timestamp: '1 min ago' },
  { id: 'n2', title: 'Token budget at 85%', body: 'us-east-1 approaching monthly limit.', type: 'warning', timestamp: '18 min ago' },
  { id: 'n3', title: 'Agent failover triggered', body: 'Sonnet primary unreachable — rerouted.', type: 'danger', timestamp: '1 hr ago' },
  { id: 'n4', title: 'Embedding refresh complete', type: 'default', timestamp: '3 hr ago' },
];

export function createDashboardWidgetsSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'dashboard-widgets';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">34 — Dashboard Widgets</p>
      <div class="mn-watermark">WIDGETS</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Dashboard Components</h2>
      <p class="mn-body mn-mb-2xl">Activity feed, date range picker, bullet chart, and notification center — business dashboard essentials.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl)">

        <!-- Activity Feed -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
            <span class="mn-label" style="color:var(--mn-accent)">Activity Feed</span>
            <button class="mn-btn mn-btn--ghost" id="dwg-add-event" style="font-size:var(--text-micro)">+ Add event</button>
          </div>
          <div id="dwg-feed"></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;padding:var(--space-sm) 0;color:var(--mn-text-muted)">const feed = M.activityFeed(el, items, { maxItems: 20 });
feed.prepend({ id, title, type: 'success', meta: 'now' });</pre>
          </details>
        </div>

        <!-- Notification Center -->
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg)">
            <span class="mn-label" style="color:var(--mn-accent)">Notification Center</span>
            <button class="mn-btn mn-btn--ghost mn-notif-trigger--has-unread" id="dwg-bell" style="font-size:var(--text-micro);position:relative">
              Bell / Open panel
            </button>
          </div>
          <p class="mn-micro" style="color:var(--mn-text-muted);margin-bottom:var(--space-md)">Click the button to open the notification panel. Unread dot on trigger updates automatically.</p>
          <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap">
            <button class="mn-btn mn-btn--ghost" id="dwg-notif-add" style="font-size:var(--text-micro)">Add notification</button>
            <button class="mn-btn mn-btn--ghost" id="dwg-notif-mark-all" style="font-size:var(--text-micro)">Mark all read</button>
          </div>
          <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;padding:var(--space-sm) 0;color:var(--mn-text-muted)">const nc = M.notificationCenter(bellEl, { maxVisible: 50 });
nc.add({ id, title, type: 'warning', body: '…' });</pre>
          </details>
        </div>

      </div>

      <!-- Bullet Charts -->
      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <span class="mn-label" style="display:block;margin-bottom:var(--space-lg);color:var(--mn-accent)">Bullet Charts — Target vs Actual</span>
        <div id="dwg-bullets" style="display:flex;flex-direction:column;gap:var(--space-lg)"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;padding:var(--space-sm) 0;color:var(--mn-text-muted)">M.bulletChart(canvas, { value: 7800, target: 9000, max: 12000, label: 'Runs', unit: 'k' });</pre>
        </details>
      </div>

      <!-- Date Range Picker -->
      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <span class="mn-label" style="display:block;margin-bottom:var(--space-lg);color:var(--mn-accent)">Date Range Picker</span>
        <div style="display:flex;gap:var(--space-xl);flex-wrap:wrap;align-items:flex-start">
          <div style="flex:1;min-width:220px">
            <p class="mn-micro" style="color:var(--mn-text-muted);margin-bottom:var(--space-md)">Click to open the calendar, select from–to dates.</p>
            <div id="dwg-drp" style="max-width:300px"></div>
          </div>
          <div style="flex:1;min-width:200px">
            <p class="mn-micro" style="color:var(--mn-text-muted);margin-bottom:var(--space-sm)">Selected range:</p>
            <div id="dwg-drp-value" class="mn-micro" style="color:var(--mn-accent);font-family:var(--font-mono)">none</div>
          </div>
        </div>
        <details class="mn-code-snippet" style="margin-top:var(--space-lg)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;padding:var(--space-sm) 0;color:var(--mn-text-muted)">const drp = M.dateRangePicker(el, { onChange: ({ from, to }) => console.log(from, to) });</pre>
        </details>
      </div>

    </div>`;

  requestAnimationFrame(() => {
    /* Activity Feed */
    const feedEl = section.querySelector('#dwg-feed');
    const feed = M.activityFeed(feedEl, FEED_ITEMS, { maxItems: 10, animate: true });
    let eventCounter = FEED_ITEMS.length + 1;
    section.querySelector('#dwg-add-event').addEventListener('click', () => {
      feed.prepend({
        id: String(eventCounter++),
        title: `New event — run #${eventCounter}`,
        meta: 'just now',
        type: ['success', 'warning', 'info', 'default'][eventCounter % 4],
      });
    });

    /* Notification Center */
    const bellEl = section.querySelector('#dwg-bell');
    const nc = M.notificationCenter(bellEl, { maxVisible: 50 });
    NOTIFS.forEach(n => nc.add(n));
    let notifCounter = NOTIFS.length + 1;
    section.querySelector('#dwg-notif-add').addEventListener('click', () => {
      const types = ['success', 'warning', 'danger', 'default'];
      nc.add({
        id: `n${notifCounter++}`,
        title: `Alert #${notifCounter} — threshold exceeded`,
        body: 'Automated system notification.',
        type: types[notifCounter % 4],
        timestamp: 'just now',
      });
    });
    section.querySelector('#dwg-notif-mark-all').addEventListener('click', () => nc.markAllRead());

    /* Bullet Charts */
    const bulletsEl = section.querySelector('#dwg-bullets');
    BULLET_KPIS.forEach(kpi => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:120px 1fr;align-items:center;gap:var(--space-md)';
      const labelEl = document.createElement('span');
      labelEl.className = 'mn-micro';
      labelEl.style.color = 'var(--mn-text-muted)';
      labelEl.textContent = kpi.label;
      const canvasWrap = document.createElement('div');
      canvasWrap.style.cssText = 'position:relative;height:36px;width:100%';
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:36px';
      canvasWrap.appendChild(canvas);
      row.appendChild(labelEl);
      row.appendChild(canvasWrap);
      bulletsEl.appendChild(row);
      // No label in opts since we show it in the grid label col
      M.bulletChart(canvas, { ...kpi, label: undefined });
    });

    /* Date Range Picker */
    const drpEl = section.querySelector('#dwg-drp');
    const drpValue = section.querySelector('#dwg-drp-value');
    M.dateRangePicker(drpEl, {
      placeholder: 'Select reporting period…',
      onChange: ({ from, to }) => {
        drpValue.textContent = from && to ? `${from}  →  ${to}` : 'none';
      },
    });
  });

  return section;
}
