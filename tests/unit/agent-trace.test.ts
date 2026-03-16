/**
 * Unit tests for agent-trace component.
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { agentTrace, type TraceStep } from '../../src/ts/agent-trace';

function makeStep(overrides: Partial<TraceStep> = {}): TraceStep {
  return {
    id: 'step-001',
    kind: 'tool',
    label: 'Read file src/ts/index.ts',
    status: 'done',
    durationMs: 120,
    timestamp: '14:22:05',
    ...overrides,
  };
}

let container: HTMLDivElement;

beforeEach(() => { container = document.createElement('div'); });

describe('agentTrace', () => {
  it('renders initial steps as list items', () => {
    const steps = [makeStep(), makeStep({ id: 'step-002', label: 'Grep for imports' })];
    const ctrl = agentTrace(container, steps);
    expect(container.querySelectorAll('[role="listitem"]').length).toBe(2);
    ctrl.destroy();
  });

  it('sets role=list and mn-agent-trace class on container', () => {
    const ctrl = agentTrace(container);
    expect(container.getAttribute('role')).toBe('list');
    expect(container.classList.contains('mn-agent-trace')).toBe(true);
    ctrl.destroy();
  });

  it('add appends a new step to the trace', () => {
    const ctrl = agentTrace(container);
    ctrl.add(makeStep());
    expect(container.querySelectorAll('[role="listitem"]').length).toBe(1);
    ctrl.destroy();
  });

  it('renders step kind badge', () => {
    const ctrl = agentTrace(container, [makeStep({ kind: 'reasoning' })]);
    expect(container.innerHTML).toContain('mn-agent-trace__kind--reasoning');
    expect(container.innerHTML).toContain('>R<');
    ctrl.destroy();
  });

  it('renders step status dot', () => {
    const ctrl = agentTrace(container, [makeStep({ status: 'error' })]);
    expect(container.innerHTML).toContain('mn-agent-trace__dot--error');
    ctrl.destroy();
  });

  it('renders running step with pulse class', () => {
    const ctrl = agentTrace(container, [makeStep({ status: 'running' })]);
    expect(container.innerHTML).toContain('mn-agent-trace__pulse');
    ctrl.destroy();
  });

  it('renders duration when provided', () => {
    const ctrl = agentTrace(container, [makeStep({ durationMs: 450 })]);
    expect(container.innerHTML).toContain('450ms');
    ctrl.destroy();
  });

  it('update changes step status and re-renders', () => {
    const ctrl = agentTrace(container, [makeStep({ id: 's1', status: 'running' })]);
    ctrl.update('s1', { status: 'done', durationMs: 200 });
    const stepEl = container.querySelector('[data-id="s1"]');
    expect(stepEl?.className).toContain('mn-agent-trace__step--done');
    expect(container.innerHTML).toContain('200ms');
    ctrl.destroy();
  });

  it('update is a no-op for unknown step id', () => {
    const ctrl = agentTrace(container, [makeStep()]);
    const htmlBefore = container.innerHTML;
    ctrl.update('nonexistent', { status: 'error' });
    expect(container.innerHTML).toBe(htmlBefore);
    ctrl.destroy();
  });

  it('clear removes all steps', () => {
    const ctrl = agentTrace(container, [makeStep(), makeStep({ id: 's2' })]);
    ctrl.clear();
    expect(container.querySelectorAll('[role="listitem"]').length).toBe(0);
    ctrl.destroy();
  });

  it('destroy clears container and removes role/class', () => {
    const ctrl = agentTrace(container, [makeStep()]);
    ctrl.destroy();
    expect(container.innerHTML).toBe('');
    expect(container.classList.contains('mn-agent-trace')).toBe(false);
    expect(container.getAttribute('role')).toBeNull();
  });

  it('renders input/output when step is expanded via click', () => {
    const step = makeStep({ input: 'query: find imports', output: '42 results found' });
    const ctrl = agentTrace(container, [step]);
    const header = container.querySelector('.mn-agent-trace__header') as HTMLElement;
    header.click();
    expect(container.innerHTML).toContain('find imports');
    expect(container.innerHTML).toContain('42 results found');
    ctrl.destroy();
  });

  it('fires onSelect callback when step is expanded', () => {
    const onSelect = vi.fn();
    const step = makeStep({ input: 'some input' });
    const ctrl = agentTrace(container, [step], { onSelect });
    const header = container.querySelector('.mn-agent-trace__header') as HTMLElement;
    header.click();
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'step-001' }));
    ctrl.destroy();
  });

  it('truncates long input/output to 500 characters', () => {
    const longText = 'A'.repeat(600);
    const step = makeStep({ input: longText });
    const ctrl = agentTrace(container, [step]);
    const header = container.querySelector('.mn-agent-trace__header') as HTMLElement;
    header.click();
    expect(container.innerHTML).toContain('...');
    ctrl.destroy();
  });
});
