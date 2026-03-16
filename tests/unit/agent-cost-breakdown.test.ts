/**
 * Unit tests for agent-cost-breakdown component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { agentCostBreakdown, type AgentCostRow } from '../../src/ts/agent-cost-breakdown';

const ROWS: AgentCostRow[] = [
  { id: 'r1', agentName: 'Coordinator', model: 'Claude Sonnet 4', totalTokens: 1_200_000, cachedTokens: 400_000, cost: 12.50, costDelta: 5.2, calls: 340, avgLatencyMs: 820, budget: 20, tags: ['orchestration'] },
  { id: 'r2', agentName: 'Planner', model: 'Claude Opus 4', totalTokens: 800_000, cost: 45.00, calls: 120, budget: 40 },
  { id: 'r3', agentName: 'Reviewer', model: 'Claude Haiku 4', totalTokens: 500_000, cost: 1.80, costDelta: -3.1, calls: 900, tags: ['validation', 'quality'] },
];

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

describe('agentCostBreakdown', () => {
  it('renders a table with rows for each agent', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    const trs = container.querySelectorAll('tbody tr');
    expect(trs.length).toBe(3);
    ctrl.destroy();
  });

  it('displays agent names in the table', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    expect(container.innerHTML).toContain('Coordinator');
    expect(container.innerHTML).toContain('Planner');
    expect(container.innerHTML).toContain('Reviewer');
    ctrl.destroy();
  });

  it('renders a footer row with totals', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    const footer = container.querySelector('tfoot');
    expect(footer).toBeTruthy();
    expect(footer!.innerHTML).toContain('Total');
    ctrl.destroy();
  });

  it('shows model data attribute (sonnet/opus/haiku)', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    expect(container.querySelector('[data-model="sonnet"]')).toBeTruthy();
    expect(container.querySelector('[data-model="opus"]')).toBeTruthy();
    expect(container.querySelector('[data-model="haiku"]')).toBeTruthy();
    ctrl.destroy();
  });

  it('renders budget bar with alert class when cost > 80%', () => {
    const highBudget: AgentCostRow[] = [
      { id: 'hb', agentName: 'Heavy Agent', model: 'Claude Opus 4', totalTokens: 100, cost: 95, calls: 10, budget: 100 },
    ];
    const ctrl = agentCostBreakdown(container, highBudget);
    expect(container.innerHTML).toContain('mn-cost-breakdown__budget--alert');
    ctrl.destroy();
  });

  it('fires onBudgetAlert for agents exceeding 80% budget', () => {
    const onBudgetAlert = vi.fn();
    const ctrl = agentCostBreakdown(container, ROWS, { onBudgetAlert });
    // Planner: cost 45 > budget 40 * 0.8 = 32 => alert
    expect(onBudgetAlert).toHaveBeenCalled();
    const alerted = onBudgetAlert.mock.calls.map((c: [AgentCostRow]) => c[0].agentName);
    expect(alerted).toContain('Planner');
    ctrl.destroy();
  });

  it('renders cost delta arrows', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    const html = container.innerHTML;
    // Up arrow for positive delta, down arrow for negative
    expect(html).toContain('\u25B2');
    expect(html).toContain('\u25BC');
    ctrl.destroy();
  });

  it('renders tag pills (max 2)', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    expect(container.innerHTML).toContain('orchestration');
    expect(container.innerHTML).toContain('validation');
    ctrl.destroy();
  });

  it('update replaces data and re-renders', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    ctrl.update([ROWS[0]]);
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
    ctrl.destroy();
  });

  it('destroy clears container', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
  });

  it('displays period label in header', () => {
    const ctrl = agentCostBreakdown(container, ROWS, { period: 'March 2026' });
    expect(container.innerHTML).toContain('March 2026');
    ctrl.destroy();
  });

  it('displays total cost in header', () => {
    const ctrl = agentCostBreakdown(container, ROWS);
    // Total: 12.50 + 45.00 + 1.80 = 59.30
    expect(container.innerHTML).toContain('$59.30');
    ctrl.destroy();
  });
});
