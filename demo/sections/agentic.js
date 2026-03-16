/**
 * Agentic AI section — agentTrace, tokenMeter, streamingText
 * Interactive components for AI pipeline monitoring and UX.
 */

const DEMO_STEPS = [
  { id: 's1', kind: 'tool', label: 'web_search', status: 'done', durationMs: 312,
    input: '{"query":"Q4 2025 AI infrastructure cost benchmarks","n":5}',
    output: '{"results":[{"title":"Enterprise AI Costs Q4 2025","url":"..."}]}', timestamp: '09:00:01' },
  { id: 's2', kind: 'reasoning', label: 'Analyze search results', status: 'done', durationMs: 890,
    input: 'Evaluate retrieved documents for cost data relevance.',
    output: 'Found 3 relevant sources. Proceeding with FinOps report.', timestamp: '09:00:02' },
  { id: 's3', kind: 'tool', label: 'read_document', status: 'done', durationMs: 145,
    input: '{"doc_id":"finops-q4-2025","sections":["inference","storage"]}',
    output: '{"inference_cost":28400,"storage_cost":6800,"currency":"EUR"}', timestamp: '09:00:03' },
  { id: 's4', kind: 'tool', label: 'run_sql', status: 'error', durationMs: 50,
    input: 'SELECT * FROM cost_breakdown WHERE quarter = "Q4-2025"',
    output: 'Error: relation "cost_breakdown" does not exist', timestamp: '09:00:04' },
  { id: 's5', kind: 'reasoning', label: 'Retry with alternative query', status: 'running',
    input: 'Falling back to API cost data endpoint.', timestamp: '09:00:05' },
];

const STREAM_TEXT = `Based on the Q4 2025 analysis, **inference costs** represent the largest budget category at €28,400 — a **23% increase** QoQ driven by embedding workloads.

Key recommendations:
1. Implement tiered prompt caching to reduce redundant \`API calls\` by ~40%
2. Route classification tasks to \`Haiku 4.5\` — 10× cheaper at similar accuracy
3. Set hard budget alerts at 80% threshold [1]

The projected savings from these optimizations range from €8,000–€12,000 per quarter [2].`;

const TOKEN_USAGE = { prompt: 4820, completion: 612, cached: 2100, budget: 8000, costPerMToken: 3.0 };

export function createAgenticSection() {
  const M = window.Maranello;
  const section = document.createElement('section');
  section.id = 'agentic';
  section.className = 'mn-section-dark';

  section.innerHTML = `
    <div class="mn-container">
      <p class="mn-section-number">37 — Agentic AI</p>
      <div class="mn-watermark">AGENTIC</div>
      <h2 class="mn-title-section mn-mb-sm mn-anim-fadeInUp">Agentic AI Components</h2>
      <p class="mn-body mn-mb-2xl">Agent execution trace, token budget meter, and streaming LLM output renderer — all interactive and theme-adaptive.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl)">

        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
            <span class="mn-label" style="color:var(--mn-accent)">Agent Execution Trace</span>
            <div style="display:flex;gap:var(--space-sm)">
              <button class="mn-btn mn-btn--ghost" id="ag-trace-add" style="font-size:var(--text-micro)">+ Step</button>
              <button class="mn-btn mn-btn--ghost" id="ag-trace-clear" style="font-size:var(--text-micro)">Clear</button>
            </div>
          </div>
          <div id="ag-trace"></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const trace = M.agentTrace(el, steps, { onSelect });
trace.add(step); trace.update(id, { status: 'done', durationMs: 120 });</pre>
          </details>
        </div>

        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
            <span class="mn-label" style="color:var(--mn-accent)">Token Budget Meter</span>
            <button class="mn-btn mn-btn--ghost" id="ag-token-sim" style="font-size:var(--text-micro)">Simulate</button>
          </div>
          <div id="ag-token"></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const meter = M.tokenMeter(el, usage, { showCost: true, showBreakdown: true });
meter.update({ prompt: 5000, completion: 800, cached: 2000 });</pre>
          </details>
        </div>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
          <span class="mn-label" style="color:var(--mn-accent)">Streaming LLM Output</span>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="ag-stream-play" style="font-size:var(--text-micro)">Play</button>
            <button class="mn-btn mn-btn--ghost" id="ag-stream-reset" style="font-size:var(--text-micro)">Reset</button>
          </div>
        </div>
        <div id="ag-stream" class="mn-stream" style="min-height:80px;padding:var(--space-sm) 0"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const stream = M.streamingText(el, { onCitationClick: (n) => showSource(n) });
stream.append(chunk); stream.done();</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    /* ── Agent Trace ── */
    const traceCtrl = M.agentTrace(section.querySelector('#ag-trace'), DEMO_STEPS, {
      onSelect: (step) => M.toast({ type: 'info', title: step.label, message: `Status: ${step.status}${step.durationMs ? ' | ' + step.durationMs + 'ms' : ''}` }),
    });
    let extraStep = DEMO_STEPS.length;
    section.querySelector('#ag-trace-add').addEventListener('click', () => {
      extraStep++;
      traceCtrl.add({ id: `s${extraStep}`, kind: 'tool', label: `tool_call_${extraStep}`,
        status: 'running', timestamp: new Date().toLocaleTimeString('en', { hour12: false }) });
      setTimeout(() => traceCtrl.update(`s${extraStep}`, { status: 'done', durationMs: Math.round(Math.random() * 500 + 50) }), 1200);
    });
    section.querySelector('#ag-trace-clear').addEventListener('click', () => traceCtrl.clear());

    /* ── Token Meter ── */
    const meterCtrl = M.tokenMeter(section.querySelector('#ag-token'), TOKEN_USAGE, { showCost: true, showBreakdown: true });
    section.querySelector('#ag-token-sim').addEventListener('click', () => {
      meterCtrl.update({ prompt: Math.round(Math.random() * 6000 + 1000), completion: Math.round(Math.random() * 1000 + 200),
        cached: Math.round(Math.random() * 3000), budget: 8000, costPerMToken: 3.0 });
    });

    /* ── Streaming Text ── */
    const streamCtrl = M.streamingText(section.querySelector('#ag-stream'), {
      onCitationClick: (n) => M.toast({ type: 'info', title: `Source [${n}]`, message: 'Navigating to citation...' }),
      onDone: () => {},
    });
    let streamInterval = null;
    section.querySelector('#ag-stream-play').addEventListener('click', function() {
      if (streamInterval) return;
      streamCtrl.reset();
      const chunks = STREAM_TEXT.split('');
      let i = 0;
      streamInterval = setInterval(() => {
        if (i < chunks.length) { streamCtrl.append(chunks[i++]); }
        else { clearInterval(streamInterval); streamInterval = null; streamCtrl.done(); }
      }, 18);
    });
    section.querySelector('#ag-stream-reset').addEventListener('click', () => {
      if (streamInterval) { clearInterval(streamInterval); streamInterval = null; }
      streamCtrl.reset();
    });
  });

  return section;
}
