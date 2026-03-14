/**
 * Org Tree section — initOrgTree with expand/collapse and keyboard navigation demo.
 * Uses window.Maranello.initOrgTree.
 */
export function createOrgTreeSection() {
  const section = document.createElement('section');
  section.id = 'org-tree';
  section.className = 'mn-section-dark';
  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">28 — Org Tree</p>
      <div class="mn-watermark">ORG</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Organisation Tree</h2>
      <p class="mn-body mn-mb-xl">Hierarchical structure viewer with expand/collapse and full keyboard navigation.</p>
      <p class="mn-micro mn-mb-2xl" style="color:var(--grigio-medio)">
        Keyboard: <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Tab</kbd> to focus nodes &nbsp;
        <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Enter / Space</kbd> to expand/collapse &nbsp;
        <kbd style="padding:2px 6px;border:1px solid var(--grigio-scuro);border-radius:4px;font-family:monospace">Arrow keys</kbd> to navigate siblings
      </p>
      <div class="mn-flex-wrap mn-gap-md mn-mb-xl">
        <button class="mn-btn mn-btn--accent" id="org-expand-all">Expand All</button>
        <button class="mn-btn mn-btn--ghost" id="org-collapse-all">Collapse All</button>
      </div>
      <div id="org-tree-root" class="mn-org-tree" role="tree" aria-label="Agent organisation tree"
           style="max-width:860px;overflow-x:auto"></div>
    </div>`;

  requestAnimationFrame(() => initOrgTree(section));
  return section;
}

/** Org tree data — fictional Maranello Luce agent hierarchy. */
const ORG_DATA = {
  id: 'node-ceo',
  label: 'Mirror Operations',
  role: 'Platform Root',
  children: [
    {
      id: 'node-inference',
      label: 'Inference Cluster',
      role: 'Model Execution',
      children: [
        { id: 'node-opus', label: 'Agent Opus 4.6', role: 'Complex reasoning', children: [] },
        { id: 'node-sonnet', label: 'Agent Sonnet 4.6', role: 'Coordinator', children: [] },
        { id: 'node-haiku', label: 'Agent Haiku 4.5', role: 'Utility & speed', children: [] },
      ],
    },
    {
      id: 'node-routing',
      label: 'Routing Layer',
      role: 'Traffic Management',
      children: [
        { id: 'node-eu', label: 'eu-west-1', role: 'EU gateway', children: [] },
        { id: 'node-us', label: 'us-east-1', role: 'US primary', children: [] },
        { id: 'node-ap', label: 'ap-southeast-1', role: 'APAC gateway', children: [] },
      ],
    },
    {
      id: 'node-ops',
      label: 'Ops & Monitoring',
      role: 'Observability',
      children: [
        { id: 'node-telemetry', label: 'Telemetry Service', role: 'Metrics & tracing', children: [] },
        { id: 'node-alerts', label: 'Alert Manager', role: 'PagerDuty integration', children: [] },
      ],
    },
  ],
};

function initOrgTree(section) {
  const M = window.Maranello;
  const container = section.querySelector('#org-tree-root');
  if (!container) return;

  if (M?.initOrgTree) {
    try {
      // Render the tree DOM first — initOrgTree(container) wires behaviors on existing DOM
      renderFallback(container);
      const ctrl = M.initOrgTree(container);
      section.querySelector('#org-expand-all')?.addEventListener('click', () => ctrl?.expandAll?.());
      section.querySelector('#org-collapse-all')?.addEventListener('click', () => ctrl?.collapseAll?.());
    } catch (e) {
      console.warn('[org-tree] initOrgTree error:', e);
      renderFallback(container);
      wireButtons(section, null);
    }
  } else {
    // Fallback: render minimal tree manually so the section is never empty
    renderFallback(container);
    wireButtons(section, null);
  }
}

/** Minimal DOM fallback when initOrgTree is unavailable. */
function renderFallback(container) {
  container.innerHTML = buildNodeHtml(ORG_DATA, 0);
  container.querySelectorAll('.org-node__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nodeEl = btn.closest('.org-node');
      const children = nodeEl?.querySelector('.org-node__children');
      if (!children) return;
      const expanded = children.style.display !== 'none';
      children.style.display = expanded ? 'none' : '';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.textContent = expanded ? '+' : '−';
    });
    // Keyboard: Enter / Space trigger toggle
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
  });
}

function buildNodeHtml(node, depth) {
  const indent = depth * 24;
  const hasChildren = node.children && node.children.length > 0;
  const childrenHtml = hasChildren ? node.children.map((c) => buildNodeHtml(c, depth + 1)).join('') : '';
  return `
    <div class="org-node" id="${node.id}" style="margin-left:${indent}px">
      <div class="org-node__row mn-card-dark" style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) var(--space-md);margin-bottom:var(--space-xs);cursor:${hasChildren ? 'pointer' : 'default'}">
        ${hasChildren ? `<button class="org-node__toggle mn-btn mn-btn--ghost" style="width:24px;height:24px;padding:0;font-size:1rem;line-height:1;flex-shrink:0" aria-expanded="true" aria-controls="${node.id}-children">−</button>` : '<span style="width:24px;flex-shrink:0"></span>'}
        <span class="mn-label" style="flex:1">${node.label}</span>
        <span class="mn-micro" style="color:var(--grigio-medio)">${node.role}</span>
      </div>
      ${hasChildren ? `<div class="org-node__children" id="${node.id}-children">${childrenHtml}</div>` : ''}
    </div>`;
}

function wireButtons(section, ctrl) {
  const container = section.querySelector('#org-tree-root');
  section.querySelector('#org-expand-all')?.addEventListener('click', () => {
    if (ctrl?.expandAll) { ctrl.expandAll(); return; }
    container?.querySelectorAll('.org-node__children').forEach((el) => { el.style.display = ''; });
    container?.querySelectorAll('.org-node__toggle').forEach((btn) => { btn.setAttribute('aria-expanded', 'true'); btn.textContent = '−'; });
  });
  section.querySelector('#org-collapse-all')?.addEventListener('click', () => {
    if (ctrl?.collapseAll) { ctrl.collapseAll(); return; }
    container?.querySelectorAll('.org-node__children').forEach((el) => { el.style.display = 'none'; });
    container?.querySelectorAll('.org-node__toggle').forEach((btn) => { btn.setAttribute('aria-expanded', 'false'); btn.textContent = '+'; });
  });
}
