/**
 * Maranello Luce Design - Approval Chain
 * Headless approval workflow visualization with accessible step rendering.
 */
import { escapeHtml } from './core/sanitize';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'skipped' | 'current';

export interface ApprovalStep {
  id: string;
  name: string;
  role?: string;
  status: ApprovalStatus;
  timestamp?: string;
  comment?: string;
}

export interface ApprovalChainOptions {
  onAction?: (step: ApprovalStep, action: 'approve' | 'reject' | 'skip') => void;
  editable?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export interface ApprovalChainController {
  update: (steps: ApprovalStep[]) => void;
  setStatus: (id: string, status: ApprovalStatus, timestamp?: string) => void;
  destroy: () => void;
}

const STATUS_ICONS: Record<ApprovalStatus, string> = {
  approved: '\u2713',
  rejected: '\u2717',
  skipped: '\u2192',
  current: '\u25CF',
  pending: '\u25CB',
};

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  approved: 'Approved',
  rejected: 'Rejected',
  skipped: 'Skipped',
  current: 'Current reviewer',
  pending: 'Pending',
};

/** Extract initials from a full name (max 2 chars). */
function getInitials(name: string): string {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/** Build a single approval node element. */
function buildNode(
  step: ApprovalStep,
  editable: boolean,
  ac: AbortController,
  onAction?: ApprovalChainOptions['onAction'],
): HTMLElement {
  const node = document.createElement('div');
  node.className = `mn-approval__node mn-approval__node--${step.status}`;
  node.dataset.id = step.id;
  if (step.comment) node.title = step.comment;

  const avatar = document.createElement('div');
  avatar.className = `mn-approval__avatar mn-approval__avatar--${step.status}`;
  avatar.textContent = getInitials(step.name);

  const badge = document.createElement('span');
  badge.className = `mn-approval__badge mn-approval__badge--${step.status}`;
  badge.textContent = STATUS_ICONS[step.status];
  badge.setAttribute('aria-label', STATUS_LABELS[step.status]);
  avatar.appendChild(badge);
  node.appendChild(avatar);

  const nameEl = document.createElement('span');
  nameEl.className = 'mn-approval__name';
  nameEl.textContent = escapeHtml(step.name);
  node.appendChild(nameEl);

  if (step.role) {
    const roleEl = document.createElement('span');
    roleEl.className = 'mn-approval__role';
    roleEl.textContent = escapeHtml(step.role);
    node.appendChild(roleEl);
  }

  if (step.timestamp) {
    const ts = document.createElement('span');
    ts.className = 'mn-approval__timestamp';
    ts.textContent = escapeHtml(step.timestamp);
    node.appendChild(ts);
  }

  if (editable && step.status === 'current' && onAction) {
    const actions = document.createElement('div');
    actions.className = 'mn-approval__actions';
    const btns: Array<{ label: string; action: 'approve' | 'reject' | 'skip'; cls: string }> = [
      { label: 'Approve', action: 'approve', cls: 'mn-approval__btn--approve' },
      { label: 'Reject', action: 'reject', cls: 'mn-approval__btn--reject' },
      { label: 'Skip', action: 'skip', cls: 'mn-approval__btn--skip' },
    ];
    for (const b of btns) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `mn-approval__btn ${b.cls}`;
      btn.textContent = b.label;
      btn.addEventListener('click', () => onAction(step, b.action), { signal: ac.signal });
      actions.appendChild(btn);
    }
    node.appendChild(actions);
  }
  return node;
}

/** Build a connector element between two steps. */
function buildConnector(prevStatus: ApprovalStatus): HTMLElement {
  const conn = document.createElement('div');
  conn.className = 'mn-approval__connector';
  const isDone = prevStatus === 'approved' || prevStatus === 'rejected' || prevStatus === 'skipped';
  if (isDone) {
    conn.classList.add('mn-approval__connector--done');
  } else {
    conn.classList.add('mn-approval__connector--pending');
  }
  return conn;
}

/** Render the full approval chain into the container. */
function render(
  el: HTMLElement,
  steps: ApprovalStep[],
  opts: ApprovalChainOptions,
  ac: AbortController,
): void {
  el.innerHTML = '';
  for (let i = 0; i < steps.length; i++) {
    if (i > 0) {
      el.appendChild(buildConnector(steps[i - 1].status));
    }
    el.appendChild(buildNode(steps[i], opts.editable ?? false, ac, opts.onAction));
  }
}

/** Update a single node in-place without full re-render. */
function patchNode(el: HTMLElement, id: string, status: ApprovalStatus, timestamp?: string): void {
  const node = el.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`);
  if (!node) return;

  /* Strip old status class and apply new one */
  node.className = node.className.replace(/mn-approval__node--\w+/, `mn-approval__node--${status}`);

  const avatar = node.querySelector<HTMLElement>('.mn-approval__avatar');
  if (avatar) {
    avatar.className = avatar.className
      .replace(/mn-approval__avatar--\w+/, `mn-approval__avatar--${status}`);
  }

  const badge = node.querySelector<HTMLElement>('.mn-approval__badge');
  if (badge) {
    badge.className = badge.className
      .replace(/mn-approval__badge--\w+/, `mn-approval__badge--${status}`);
    badge.textContent = STATUS_ICONS[status];
    badge.setAttribute('aria-label', STATUS_LABELS[status]);
  }

  /* Update or add timestamp */
  if (timestamp) {
    let ts = node.querySelector<HTMLElement>('.mn-approval__timestamp');
    if (!ts) {
      ts = document.createElement('span');
      ts.className = 'mn-approval__timestamp';
      node.appendChild(ts);
    }
    ts.textContent = escapeHtml(timestamp);
  }

  /* Remove action buttons when no longer current */
  if (status !== 'current') {
    node.querySelector('.mn-approval__actions')?.remove();
  }
}

/**
 * Create an approval chain visualization inside a container element.
 * Renders step nodes with avatars, status badges, and connectors.
 */
export function approvalChain(
  el: HTMLElement,
  steps: ApprovalStep[],
  opts?: ApprovalChainOptions,
): ApprovalChainController {
  const options: ApprovalChainOptions = {
    editable: false,
    orientation: 'horizontal',
    ...opts,
  };
  const ac = new AbortController();

  el.setAttribute('role', 'list');
  el.setAttribute('aria-label', 'Approval chain');
  el.classList.add('mn-approval');
  if (options.orientation === 'vertical') {
    el.classList.add('mn-approval--vertical');
  }

  let currentSteps = [...steps];
  render(el, currentSteps, options, ac);

  return {
    update(newSteps: ApprovalStep[]) {
      currentSteps = [...newSteps];
      render(el, currentSteps, options, ac);
    },
    setStatus(id: string, status: ApprovalStatus, timestamp?: string) {
      const idx = currentSteps.findIndex(s => s.id === id);
      if (idx < 0) return;
      currentSteps[idx] = { ...currentSteps[idx], status, timestamp: timestamp ?? currentSteps[idx].timestamp };
      patchNode(el, id, status, timestamp);
    },
    destroy() {
      ac.abort();
      el.innerHTML = '';
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
      el.classList.remove('mn-approval', 'mn-approval--vertical');
    },
  };
}
