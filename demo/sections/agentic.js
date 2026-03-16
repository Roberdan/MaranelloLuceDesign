/**
 * Agentic AI — rich composition: live KPI strip, agent trace + latency sparkline,
 * token meter, streaming output with model badge, human-in-the-loop approval chain.
 */

const DEMO_STEPS = [
  { id: 's1', kind: 'tool',      label: 'web_search',              status: 'done',    durationMs: 312, timestamp: '09:00:01', input: '{"query":"Q4 2025 AI infrastructure costs","n":5}', output: '{"results":5}' },
  { id: 's2', kind: 'reasoning', label: 'Analyze search results',  status: 'done',    durationMs: 890, timestamp: '09:00:02', output: 'Found 3 relevant sources. Proceeding.' },
  { id: 's3', kind: 'tool',      label: 'read_document',           status: 'done',    durationMs: 145, timestamp: '09:00:03', input: '{"doc_id":"finops-q4-2025"}', output: '{"inference_cost":28400}' },
  { id: 's4', kind: 'tool',      label: 'run_sql',                 status: 'error',   durationMs:  50, timestamp: '09:00:04', output: 'Error: relation "cost_breakdown" does not exist' },
  { id: 's5', kind: 'reasoning', label: 'Retry with fallback API', status: 'running',                  timestamp: '09:00:05', input: 'Falling back to REST cost endpoint.' },
];

const APPROVALS = [
  { id: 'a1', name: 'Research Agent',  role: 'AI Agent',      status: 'approved', timestamp: '09:00:02', comment: 'web_search completed — 5 results retrieved' },
  { id: 'a2', name: 'SQL Adapter',     role: 'System',        status: 'rejected', timestamp: '09:00:04', comment: 'DB query failed — fallback triggered' },
  { id: 'a3', name: 'Analysis Agent',  role: 'AI Agent',      status: 'approved', timestamp: '09:00:05', comment: 'FinOps synthesis ready for human review' },
  { id: 'a4', name: 'Elena Russo',     role: 'FinOps Lead',   status: 'current',  comment: 'Awaiting final report approval' },
];

const STREAM_TEXT = `Based on the Q4 2025 analysis, **inference costs** represent the largest budget category at €28,400 — a **23% increase** QoQ driven by embedding workloads.

Key recommendations:
1. Implement tiered prompt caching to reduce redundant \`API calls\` by ~40%
2. Route classification tasks to \`Haiku 4.5\` — 10× cheaper at similar accuracy
3. Set hard budget alerts at 80% threshold [1]

Projected savings from these optimizations: **€8,000–€12,000 per quarter** [2].`;

const TOKEN_USAGE = { prompt: 4820, completion: 612, cached: 2100, budget: 8000, costPerMToken: 3.0 };
const LATENCY_VALS = [312, 890, 145, 50];

/** SVG arc gauge KPI card — telemetry-style, semantic tokens, animated. */
function agKpiCard(id, label, val, sub, pct, color) {
  const c = +(2 * Math.PI * 46).toFixed(1), a = +(c * .75).toFixed(1), f = +(a * Math.min(1.02, pct)).toFixed(1);
  return `<div class="mn-card-dark" style="padding:var(--space-lg);text-align:center"><svg width="110" height="110" viewBox="0 0 120 120" style="display:block;margin:0 auto;overflow:visible"><circle cx="60" cy="60" r="46" fill="none" style="stroke:var(--mn-border)" stroke-width="7" stroke-dasharray="${a} ${c}" stroke-linecap="round" transform="rotate(135 60 60)"/><circle id="${id}" cx="60" cy="60" r="46" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="${f} ${c}" stroke-linecap="round" transform="rotate(135 60 60)" style="transition:stroke-dasharray .8s ease"><animate attributeName="stroke-dasharray" from="0 ${c}" to="${f} ${c}" dur="1s" fill="freeze"/></circle><text id="${id}-val" x="60" y="56" text-anchor="middle" style="fill:${color};font-family:var(--font-display,Outfit,sans-serif)" font-size="16" font-weight="700">${val}</text><text x="60" y="70" text-anchor="middle" style="fill:var(--mn-text-muted);font-family:var(--font-body,Inter,sans-serif)" font-size="9">${sub}</text></svg><div class="mn-micro" style="color:var(--mn-text-muted);margin-top:var(--space-xs)">${label}</div></div>`;
}

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
      <p class="mn-body mn-mb-2xl">Agent execution trace, token budget, streaming output, and human-in-the-loop approval — built for production AI pipelines.</p>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-md);margin-bottom:var(--space-2xl)">
        ${agKpiCard('ag-arc-steps','Steps traced','5','complete',0.5,'var(--mn-accent)')}
        ${agKpiCard('ag-arc-tokens','Token budget',(+(TOKEN_USAGE.prompt+TOKEN_USAGE.completion)/1000).toFixed(1)+'k','used',(TOKEN_USAGE.prompt+TOKEN_USAGE.completion)/TOKEN_USAGE.budget,'var(--signal-info)')}
        ${agKpiCard('ag-arc-cost','Est. cost','$0.025','per run',0.25,'var(--signal-ok)')}
        ${agKpiCard('ag-arc-cache','Cache hit','38.7%','ratio',0.387,'var(--signal-warning)')}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl);margin-bottom:var(--space-2xl)">
        <div class="mn-card-dark" style="padding:var(--space-xl)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <div style="display:flex;flex-direction:column;gap:2px">
              <span class="mn-label" style="color:var(--mn-accent)">Agent Execution Trace</span>
              <span class="mn-micro" style="color:var(--mn-text-muted)">claude-sonnet-4-6 · session #4821</span>
            </div>
            <div style="display:flex;gap:var(--space-sm)">
              <button class="mn-btn mn-btn--ghost" id="ag-trace-add" style="font-size:var(--text-micro)">+ Step</button>
              <button class="mn-btn mn-btn--ghost" id="ag-trace-clear" style="font-size:var(--text-micro)">Clear</button>
            </div>
          </div>
          <div id="ag-trace"></div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const t = M.agentTrace(el, steps, { onSelect });
t.add(step); t.update(id, { status:'done', durationMs:120 });</pre>
          </details>
        </div>

        <div class="mn-card-dark" style="padding:var(--space-xl);display:flex;flex-direction:column">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
            <span class="mn-label" style="color:var(--mn-accent)">Token Budget Meter</span>
            <button class="mn-btn mn-btn--ghost" id="ag-token-sim" style="font-size:var(--text-micro)">Simulate</button>
          </div>
          <div id="ag-token"></div>
          <div style="margin-top:var(--space-lg);padding-top:var(--space-md);border-top:1px solid var(--mn-border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xs)">
              <span class="mn-micro" style="color:var(--mn-text-muted)">Step latency trend (ms)</span>
              <span class="mn-micro" id="ag-lat-label" style="color:var(--mn-accent);font-variant-numeric:tabular-nums"></span>
            </div>
            <canvas id="ag-latency" style="display:block;width:100%;height:56px"></canvas>
          </div>
          <details class="mn-code-snippet" style="margin-top:var(--space-md)">
            <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
            <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const m = M.tokenMeter(el, usage, { showCost:true });
m.update({ prompt:5000, completion:800, cached:2000 });</pre>
          </details>
        </div>
      </div>

      <div class="mn-card-dark mn-mb-2xl" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <div style="display:flex;align-items:center;gap:var(--space-sm)">
            <div style="width:30px;height:30px;border-radius:var(--radius-full);background:var(--mn-accent);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:#000;flex-shrink:0;font-family:var(--font-display)">C</div>
            <div style="display:flex;flex-direction:column;gap:2px">
              <span class="mn-label" style="color:var(--mn-accent)">Streaming LLM Output</span>
              <span class="mn-micro" style="color:var(--mn-text-muted)">claude-sonnet-4-6 · streaming</span>
            </div>
          </div>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="ag-stream-play" style="font-size:var(--text-micro)">▶ Play</button>
            <button class="mn-btn mn-btn--ghost" id="ag-stream-reset" style="font-size:var(--text-micro)">Reset</button>
          </div>
        </div>
        <div style="border-left:2px solid var(--mn-accent);padding-left:var(--space-md)">
          <div id="ag-stream" class="mn-stream" style="min-height:80px;padding:var(--space-xs) 0"></div>
        </div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const s = M.streamingText(el, { onCitationClick: n => showSource(n) });
s.append(chunk); s.done();</pre>
        </details>
      </div>

      <div class="mn-card-dark" style="padding:var(--space-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)">
          <div style="display:flex;flex-direction:column;gap:2px">
            <span class="mn-label" style="color:var(--mn-accent)">Human-in-the-Loop Approval</span>
            <span class="mn-micro" style="color:var(--mn-text-muted)">4-step multi-agent workflow — awaiting human sign-off</span>
          </div>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="mn-btn mn-btn--ghost" id="ag-approve" style="font-size:var(--text-micro)">Approve ✓</button>
            <button class="mn-btn mn-btn--ghost" id="ag-reject" style="font-size:var(--text-micro)">Reject ✗</button>
          </div>
        </div>
        <div id="ag-approval"></div>
        <details class="mn-code-snippet" style="margin-top:var(--space-md)">
          <summary class="mn-micro" style="cursor:pointer;color:var(--mn-text-muted)">Usage</summary>
          <pre style="font-family:var(--font-mono);font-size:var(--text-micro);padding:var(--space-sm) 0;color:var(--mn-text-muted);overflow-x:auto">const chain = M.approvalChain(el, steps, { editable:true, onAction });
chain.setStatus(id, 'approved', timestamp);</pre>
        </details>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    let latencyData = LATENCY_VALS.slice();
    let extraStep = DEMO_STEPS.length;

    /** Update SVG arc progress + centre text. */
    function updateArc(id, pct, newVal) {
      const arc = section.querySelector(`#${id}`);
      if (!arc) return;
      const c = +(2 * Math.PI * 46).toFixed(1), a = +(c * .75).toFixed(1);
      arc.setAttribute('stroke-dasharray', `${+(a * Math.min(1.02, pct)).toFixed(1)} ${c}`);
      if (newVal !== undefined) { const t = section.querySelector(`#${id}-val`); if (t) t.textContent = newVal; }
    }

    /** Refresh KPI strip arcs from token usage object. */
    function refreshKpis(usage) {
      const totalTok = (usage.prompt ?? TOKEN_USAGE.prompt) + (usage.completion ?? TOKEN_USAGE.completion);
      const cost = (totalTok / 1_000_000) * TOKEN_USAGE.costPerMToken;
      const cacheRatio = ((usage.cached ?? TOKEN_USAGE.cached) / totalTok * 100).toFixed(1);
      updateArc('ag-arc-tokens', totalTok / TOKEN_USAGE.budget, (totalTok / 1000).toFixed(1) + 'k');
      updateArc('ag-arc-cost', Math.min(1, cost / 0.1), '$' + cost.toFixed(3));
      updateArc('ag-arc-cache', parseFloat(cacheRatio) / 100, cacheRatio + '%');
    }

    /* Agent Trace */
    const traceCtrl = M.agentTrace(section.querySelector('#ag-trace'), DEMO_STEPS, {
      onSelect: (step) => M.toast({ type: 'info', title: step.label, message: `${step.status}${step.durationMs ? ' · ' + step.durationMs + 'ms' : ''}` }),
    });
    section.querySelector('#ag-trace-add').addEventListener('click', () => {
      extraStep++;
      const kinds = ['tool', 'reasoning', 'tool'];
      const labels = ['call_api', 'validate_output', 'write_report', 'summarize', 'fetch_context'];
      traceCtrl.add({ id: `s${extraStep}`, kind: kinds[extraStep % 3], label: labels[extraStep % labels.length],
        status: 'running', timestamp: new Date().toLocaleTimeString('en', { hour12: false }) });
      updateArc('ag-arc-steps', Math.min(1, extraStep / 10), String(extraStep));
      const ms = Math.round(Math.random() * 600 + 80);
      setTimeout(() => {
        traceCtrl.update(`s${extraStep}`, { status: 'done', durationMs: ms });
        latencyData = [...latencyData.slice(-7), ms];
        renderSparkline();
        section.querySelector('#ag-lat-label').textContent = ms + 'ms';
      }, 1100);
    });
    section.querySelector('#ag-trace-clear').addEventListener('click', () => {
      traceCtrl.clear();
      updateArc('ag-arc-steps', 0, '0');
    });

    /* Token Meter */
    const meterCtrl = M.tokenMeter(section.querySelector('#ag-token'), TOKEN_USAGE, { showCost: true, showBreakdown: true });
    section.querySelector('#ag-token-sim').addEventListener('click', () => {
      const u = { prompt: Math.round(Math.random() * 6000 + 1000), completion: Math.round(Math.random() * 1000 + 200),
        cached: Math.round(Math.random() * 3000), budget: 8000, costPerMToken: 3.0 };
      meterCtrl.update(u);
      refreshKpis(u);
    });
    refreshKpis(TOKEN_USAGE);

    /* Latency sparkline */
    const latCanvas = section.querySelector('#ag-latency');
    function renderSparkline() {
      if (M.charts?.sparkline) M.charts.sparkline(latCanvas, latencyData, { color: '--mn-accent', filled: true });
    }
    renderSparkline();
    section.querySelector('#ag-lat-label').textContent = latencyData[latencyData.length - 1] + 'ms';

    /* Streaming Text */
    const streamCtrl = M.streamingText(section.querySelector('#ag-stream'), {
      onCitationClick: (n) => M.toast({ type: 'info', title: `Source [${n}]`, message: 'Navigating to citation...' }),
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

    /* Approval Chain */
    const approvalCtrl = M.approvalChain(section.querySelector('#ag-approval'), APPROVALS, {
      editable: true,
      onAction: (step, action) => M.toast({ type: action === 'approve' ? 'success' : 'error', title: `${step.name} — ${action}d`, message: step.comment ?? '' }),
    });
    section.querySelector('#ag-approve').addEventListener('click', () => {
      approvalCtrl.setStatus('a4', 'approved', new Date().toLocaleTimeString('en', { hour12: false }));
      M.toast({ type: 'success', title: 'Report approved', message: 'Elena Russo approved the FinOps report' });
    });
    section.querySelector('#ag-reject').addEventListener('click', () => {
      approvalCtrl.setStatus('a4', 'rejected', new Date().toLocaleTimeString('en', { hour12: false }));
      M.toast({ type: 'error', title: 'Report rejected', message: 'Returned to Analysis Agent for revision' });
    });
  });

  return section;
}
