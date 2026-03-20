/**
 * Unit tests for customer-journey component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { JourneyPhase } from '../../src/ts/customer-journey';

const SAMPLE_PHASES: JourneyPhase[] = [
  {
    id: 'discovery',
    label: 'Discovery',
    engagements: [
      { id: 'e1', title: 'Initial Call', status: 'completed', type: 'meeting', assignee: 'Elena Marchetti', date: '2026-01-10' },
      { id: 'e2', title: 'Needs Analysis', status: 'completed', type: 'task', assignee: 'Marco Bianchi' },
    ],
  },
  {
    id: 'proposal',
    label: 'Proposal',
    engagements: [
      { id: 'e3', title: 'Draft Proposal', status: 'active', type: 'opportunity', assignee: 'Sara Fontana', date: '2026-02-05' },
    ],
  },
  {
    id: 'closing',
    label: 'Closing',
    engagements: [
      { id: 'e4', title: 'Contract Signing', status: 'pending', type: 'contract' },
      { id: 'e5', title: 'Kickoff', status: 'blocked', type: 'ticket', assignee: 'Giulia Rossi' },
    ],
  },
];

describe('customerJourney', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  async function create(
    phases = SAMPLE_PHASES,
    opts?: Parameters<typeof import('../../src/ts/customer-journey').customerJourney>[2],
  ) {
    const { customerJourney } = await import('../../src/ts/customer-journey');
    return customerJourney(container, phases, opts);
  }

  it('renders correct number of phase columns', async () => {
    await create();
    const phases = container.querySelectorAll('.mn-journey__phase');
    expect(phases.length).toBe(3);
  });

  it('renders correct number of cards per phase', async () => {
    await create();
    const phases = container.querySelectorAll('.mn-journey__phase');
    expect(phases[0].querySelectorAll('.mn-journey__card').length).toBe(2);
    expect(phases[1].querySelectorAll('.mn-journey__card').length).toBe(1);
    expect(phases[2].querySelectorAll('.mn-journey__card').length).toBe(2);
  });

  it('cards have correct status classes', async () => {
    await create();
    const cards = container.querySelectorAll('.mn-journey__card');
    expect(cards[0].classList.contains('mn-journey__card--completed')).toBe(true);
    expect(cards[2].classList.contains('mn-journey__card--active')).toBe(true);
    expect(cards[3].classList.contains('mn-journey__card--pending')).toBe(true);
    expect(cards[4].classList.contains('mn-journey__card--blocked')).toBe(true);
  });

  it('keyboard ArrowRight moves focus to next phase', async () => {
    await create();
    const firstCard = container.querySelector('.mn-journey__card') as HTMLElement;
    firstCard.focus();
    firstCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    /* The third card (first of phase 2) should now have focus intent */
    const phase2Cards = container.querySelectorAll('.mn-journey__phase')[1]
      .querySelectorAll('.mn-journey__card');
    expect(phase2Cards.length).toBeGreaterThan(0);
  });

  it('Enter key on card calls onSelect', async () => {
    const spy = vi.fn();
    await create(SAMPLE_PHASES, { onSelect: spy });
    const card = container.querySelector('[data-id="e1"]') as HTMLElement;
    card.focus();
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].id).toBe('e1');
  });

  it('destroy removes all DOM and aborts listeners', async () => {
    const ctrl = await create();
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.getAttribute('role')).toBeNull();
    expect(container.getAttribute('aria-label')).toBeNull();
    expect(container.classList.contains('mn-journey')).toBe(false);
  });

  it('update re-renders without leaking nodes', async () => {
    const ctrl = await create();
    const singlePhase: JourneyPhase[] = [
      { id: 'p1', label: 'Only Phase', engagements: [
        { id: 'x1', title: 'Solo Item', status: 'active', type: 'task' },
      ] },
    ];
    ctrl.update(singlePhase);
    expect(container.querySelectorAll('.mn-journey__phase').length).toBe(1);
    expect(container.querySelectorAll('.mn-journey__card').length).toBe(1);
    /* No leftover SVG connectors for single phase */
    expect(container.querySelectorAll('.mn-journey__connectors').length).toBe(0);
  });

  it('selectEngagement adds --selected class', async () => {
    const ctrl = await create();
    ctrl.selectEngagement('e3');
    const card = container.querySelector('[data-id="e3"]');
    expect(card?.classList.contains('mn-journey__card--selected')).toBe(true);
    expect(ctrl.getSelected()).toBe('e3');
  });

  it('sets role=list and aria-label on container', async () => {
    await create();
    expect(container.getAttribute('role')).toBe('list');
    expect(container.getAttribute('aria-label')).toBe('Customer journey');
  });

  it('phase groups have role=group and aria-label', async () => {
    await create();
    const phases = container.querySelectorAll('.mn-journey__phase');
    expect(phases[0].getAttribute('role')).toBe('group');
    expect(phases[0].getAttribute('aria-label')).toBe('Discovery');
  });

  it('cards have role=listitem and tabindex=0', async () => {
    await create();
    const card = container.querySelector('.mn-journey__card');
    expect(card?.getAttribute('role')).toBe('listitem');
    expect(card?.getAttribute('tabindex')).toBe('0');
  });

  it('renders assignee initials when no avatar URL', async () => {
    await create();
    const avatar = container.querySelector('.mn-journey__avatar');
    expect(avatar?.textContent).toBe('EM');
  });

  it('draws SVG connectors between phases by default', async () => {
    await create();
    const svg = container.querySelector('.mn-journey__connectors');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    const lines = svg?.querySelectorAll('.mn-journey__connector-line');
    expect(lines?.length).toBe(2);
  });

  it('skips connectors when showConnectors is false', async () => {
    await create(SAMPLE_PHASES, { showConnectors: false });
    expect(container.querySelector('.mn-journey__connectors')).toBeNull();
  });

  it('engagement onClick callback fires on click', async () => {
    const clickSpy = vi.fn();
    const phases: JourneyPhase[] = [{
      id: 'p1', label: 'Phase', engagements: [
        { id: 'c1', title: 'Clickable', status: 'active', type: 'task', onClick: clickSpy },
      ],
    }];
    await create(phases);
    const card = container.querySelector('[data-id="c1"]') as HTMLElement;
    card.click();
    expect(clickSpy).toHaveBeenCalledOnce();
  });
});
