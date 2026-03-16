/**
 * Unit tests for approval-chain component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const SAMPLE_STEPS = [
  { id: 'step-1', name: 'Elena Marchetti', role: 'CFO', status: 'approved' as const, timestamp: '2026-03-10 09:15' },
  { id: 'step-2', name: 'Marco Bianchi', role: 'CTO', status: 'current' as const },
  { id: 'step-3', name: 'Sara Fontana', role: 'CEO', status: 'pending' as const },
];

describe('approvalChain', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  async function create(
    steps = SAMPLE_STEPS,
    opts?: Parameters<typeof import('../../src/ts/approval-chain').approvalChain>[2],
  ) {
    const { approvalChain } = await import('../../src/ts/approval-chain');
    return approvalChain(container, steps, opts);
  }

  it('sets role=list and aria-label on container', async () => {
    await create();
    expect(container.getAttribute('role')).toBe('list');
    expect(container.getAttribute('aria-label')).toBe('Approval chain');
  });

  it('adds mn-approval class to container', async () => {
    await create();
    expect(container.classList.contains('mn-approval')).toBe(true);
  });

  it('renders one node per step', async () => {
    await create();
    const nodes = container.querySelectorAll('.mn-approval__node');
    expect(nodes.length).toBe(3);
  });

  it('renders connectors between nodes', async () => {
    await create();
    const connectors = container.querySelectorAll('.mn-approval__connector');
    expect(connectors.length).toBe(2);
  });

  it('marks first connector as done (previous step approved)', async () => {
    await create();
    const connectors = container.querySelectorAll('.mn-approval__connector');
    expect(connectors[0]?.classList.contains('mn-approval__connector--done')).toBe(true);
  });

  it('marks second connector as pending (previous step is current)', async () => {
    await create();
    const connectors = container.querySelectorAll('.mn-approval__connector');
    expect(connectors[1]?.classList.contains('mn-approval__connector--pending')).toBe(true);
  });

  it('shows initials in avatar', async () => {
    await create();
    const avatars = container.querySelectorAll('.mn-approval__avatar');
    expect(avatars[0]?.textContent).toContain('EM');
    expect(avatars[1]?.textContent).toContain('MB');
  });

  it('applies status class to node', async () => {
    await create();
    const nodes = container.querySelectorAll('.mn-approval__node');
    expect(nodes[0]?.classList.contains('mn-approval__node--approved')).toBe(true);
    expect(nodes[1]?.classList.contains('mn-approval__node--current')).toBe(true);
    expect(nodes[2]?.classList.contains('mn-approval__node--pending')).toBe(true);
  });

  it('shows badge with status icon and aria-label', async () => {
    await create();
    const badges = container.querySelectorAll('.mn-approval__badge');
    expect(badges[0]?.textContent).toBe('\u2713');
    expect(badges[0]?.getAttribute('aria-label')).toBe('Approved');
    expect(badges[2]?.getAttribute('aria-label')).toBe('Pending');
  });

  it('renders role text when provided', async () => {
    await create();
    const roles = container.querySelectorAll('.mn-approval__role');
    expect(roles[0]?.textContent).toBe('CFO');
  });

  it('renders timestamp when provided', async () => {
    await create();
    const ts = container.querySelector('.mn-approval__timestamp');
    expect(ts?.textContent).toBe('2026-03-10 09:15');
  });

  it('shows action buttons on current step when editable', async () => {
    const spy = vi.fn();
    await create(SAMPLE_STEPS, { editable: true, onAction: spy });
    const actions = container.querySelector('.mn-approval__actions');
    expect(actions).not.toBeNull();
    const btns = actions!.querySelectorAll('button');
    expect(btns.length).toBe(3);
    expect(btns[0]?.textContent).toBe('Approve');
  });

  it('fires onAction when action button clicked', async () => {
    const spy = vi.fn();
    await create(SAMPLE_STEPS, { editable: true, onAction: spy });
    const approveBtn = container.querySelector('.mn-approval__btn--approve') as HTMLElement;
    approveBtn?.click();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][1]).toBe('approve');
  });

  it('does not show action buttons when not editable', async () => {
    await create(SAMPLE_STEPS, { editable: false });
    const actions = container.querySelector('.mn-approval__actions');
    expect(actions).toBeNull();
  });

  it('setStatus patches node in-place', async () => {
    const ctrl = await create();
    ctrl.setStatus('step-2', 'approved', '2026-03-11 14:30');
    const node = container.querySelector('[data-id="step-2"]');
    expect(node?.classList.contains('mn-approval__node--approved')).toBe(true);
    const ts = node?.querySelector('.mn-approval__timestamp');
    expect(ts?.textContent).toBe('2026-03-11 14:30');
  });

  it('update replaces all steps', async () => {
    const ctrl = await create();
    const newSteps = [
      { id: 'only', name: 'Giulia Rossi', status: 'current' as const },
    ];
    ctrl.update(newSteps);
    const nodes = container.querySelectorAll('.mn-approval__node');
    expect(nodes.length).toBe(1);
    expect(nodes[0]?.textContent).toContain('Giulia Rossi');
  });

  it('adds vertical class for vertical orientation', async () => {
    await create(SAMPLE_STEPS, { orientation: 'vertical' });
    expect(container.classList.contains('mn-approval--vertical')).toBe(true);
  });

  it('destroy clears container and removes attributes', async () => {
    const ctrl = await create();
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.getAttribute('role')).toBeNull();
    expect(container.classList.contains('mn-approval')).toBe(false);
  });
});
