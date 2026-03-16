/**
 * Maranello Luce Design - Agent Trace
 * Headless component for displaying AI agent execution traces.
 */
import { escapeHtml } from './core/sanitize';

export type TraceStepStatus = 'pending' | 'running' | 'done' | 'error';
export type TraceStepKind = 'tool' | 'reasoning' | 'result' | 'handoff';

export interface TraceStep {
  id: string;
  kind: TraceStepKind;
  label: string;
  status: TraceStepStatus;
  durationMs?: number;
  input?: string;
  output?: string;
  timestamp?: string;
}

export interface AgentTraceOptions {
  maxVisible?: number;
  onSelect?: (step: TraceStep) => void;
}

export interface AgentTraceController {
  add: (step: TraceStep) => void;
  update: (id: string, partial: Partial<TraceStep>) => void;
  clear: () => void;
  destroy: () => void;
}

const KIND_LABELS: Record<TraceStepKind, string> = {
  tool: 'T',
  reasoning: 'R',
  result: 'Res',
  handoff: 'H',
};

const MAX_DISPLAY_LEN = 500;

function truncate(text: string | undefined): string {
  if (!text) return '';
  return text.length > MAX_DISPLAY_LEN
    ? text.slice(0, MAX_DISPLAY_LEN) + '...'
    : text;
}

function buildStepHtml(step: TraceStep, expanded: boolean): string {
  const kindLabel = escapeHtml(KIND_LABELS[step.kind]);
  const label = escapeHtml(step.label);
  const duration = step.durationMs != null ? `${step.durationMs}ms` : '';
  const timestamp = step.timestamp ? escapeHtml(step.timestamp) : '';
  const inputText = escapeHtml(truncate(step.input));
  const outputText = escapeHtml(truncate(step.output));
  const hasBody = step.input || step.output;
  const ariaExp = hasBody ? ` aria-expanded="${expanded}"` : '';
  const pulseClass = step.status === 'running' ? ' mn-agent-trace__pulse' : '';

  let body = '';
  if (hasBody && expanded) {
    body = '<div class="mn-agent-trace__body">';
    if (step.input) {
      body += `<div class="mn-agent-trace__section">` +
        `<span class="mn-agent-trace__section-label">Input</span>` +
        `<pre class="mn-agent-trace__pre">${inputText}</pre></div>`;
    }
    if (step.output) {
      body += `<div class="mn-agent-trace__section">` +
        `<span class="mn-agent-trace__section-label">Output</span>` +
        `<pre class="mn-agent-trace__pre">${outputText}</pre></div>`;
    }
    body += '</div>';
  }

  return `<div class="mn-agent-trace__header" role="button" tabindex="0"${ariaExp}>` +
    `<span class="mn-agent-trace__kind mn-agent-trace__kind--${step.kind}">${kindLabel}</span>` +
    `<span class="mn-agent-trace__label">${label}</span>` +
    (timestamp ? `<span class="mn-agent-trace__timestamp">${timestamp}</span>` : '') +
    (duration ? `<span class="mn-agent-trace__duration">${duration}</span>` : '') +
    `<span class="mn-agent-trace__dot mn-agent-trace__dot--${step.status}${pulseClass}"></span>` +
    `</div>${body}`;
}

function createStepEl(step: TraceStep): HTMLElement {
  const div = document.createElement('div');
  div.className = `mn-agent-trace__step mn-agent-trace__step--${step.status}`;
  div.setAttribute('role', 'listitem');
  div.dataset.id = step.id;
  div.innerHTML = buildStepHtml(step, false);
  return div;
}

export function agentTrace(
  el: HTMLElement,
  steps?: TraceStep[],
  opts?: AgentTraceOptions,
): AgentTraceController {
  const ac = new AbortController();
  const signal = ac.signal;
  const stepsArr: TraceStep[] = [];
  const expandedSet = new Set<string>();

  el.classList.add('mn-agent-trace');
  el.setAttribute('role', 'list');

  function toggleStep(stepId: string): void {
    if (expandedSet.has(stepId)) {
      expandedSet.delete(stepId);
    } else {
      expandedSet.add(stepId);
    }
    const stepEl = el.querySelector(`[data-id="${stepId}"]`);
    const step = stepsArr.find(s => s.id === stepId);
    if (!stepEl || !step) return;
    const isOpen = expandedSet.has(stepId);
    stepEl.classList.toggle('mn-agent-trace__step--open', isOpen);
    stepEl.innerHTML = buildStepHtml(step, isOpen);
    if (opts?.onSelect && isOpen) opts.onSelect(step);
  }

  el.addEventListener('click', (e: MouseEvent) => {
    const header = (e.target as HTMLElement).closest('.mn-agent-trace__header');
    if (!header) return;
    const stepEl = header.closest<HTMLElement>('[data-id]');
    if (stepEl?.dataset.id) toggleStep(stepEl.dataset.id);
  }, { signal });

  el.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const header = (e.target as HTMLElement).closest('.mn-agent-trace__header');
    if (!header) return;
    e.preventDefault();
    const stepEl = header.closest<HTMLElement>('[data-id]');
    if (stepEl?.dataset.id) toggleStep(stepEl.dataset.id);
  }, { signal });

  function autoScroll(): void {
    el.scrollTop = el.scrollHeight;
  }

  function add(step: TraceStep): void {
    stepsArr.push(step);
    const node = createStepEl(step);
    el.appendChild(node);
    autoScroll();
  }

  function update(id: string, partial: Partial<TraceStep>): void {
    const idx = stepsArr.findIndex(s => s.id === id);
    if (idx === -1) return;
    const step = { ...stepsArr[idx], ...partial };
    stepsArr[idx] = step;
    const node = el.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (!node) return;
    node.className = `mn-agent-trace__step mn-agent-trace__step--${step.status}`;
    if (expandedSet.has(id)) node.classList.add('mn-agent-trace__step--open');
    node.innerHTML = buildStepHtml(step, expandedSet.has(id));
  }

  function clear(): void {
    stepsArr.length = 0;
    expandedSet.clear();
    el.innerHTML = '';
  }

  function destroy(): void {
    ac.abort();
    clear();
    el.classList.remove('mn-agent-trace');
    el.removeAttribute('role');
  }

  if (steps) {
    for (const s of steps) add(s);
  }

  return { add, update, clear, destroy };
}
