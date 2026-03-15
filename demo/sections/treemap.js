/**
 * Treemap section — manual hierarchical allocation view.
 */
const TOTAL_BUDGET = 840000;
const ALLOCATION = [
  { key: 'training', label: 'Training', value: 40, color: 'linear-gradient(135deg, #FFC72C, #D4622B)', detail: 'Model adaptation, eval packs, and synthetic datasets' },
  { key: 'inference', label: 'Inference', value: 30, color: 'linear-gradient(135deg, #4EA8DE, #1D6FA5)', detail: 'Production runs, routing, and streaming workloads' },
  { key: 'embeddings', label: 'Embeddings', value: 15, color: 'linear-gradient(135deg, #00A651, #007A3D)', detail: 'Vector refresh, retrieval, and cache warming' },
  { key: 'fine-tuning', label: 'Fine-tuning', value: 10, color: 'linear-gradient(135deg, #6B7280, #3F3F46)', detail: 'Specialized adapters and reward tuning' },
  { key: 'storage', label: 'Storage', value: 5, color: 'linear-gradient(135deg, #DC0000, #8B0000)', detail: 'Artifact retention and long-run trace storage' },
];
function dollarAmount(percent) { const amount = TOTAL_BUDGET * (percent / 100) / 1000; return `$${amount.toFixed(Number.isInteger(amount) ? 0 : 1)}k`; }
function tile(item, extraStyle = '') { return `<div class="mn-treemap__cell" role="button" tabindex="0" data-label="${item.label}" data-value="${item.value}" data-amount="${dollarAmount(item.value)}" data-detail="${item.detail}" style="background:${item.color};display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;white-space:normal;min-height:100%;${extraStyle}"><span>${item.label}</span><span class="mn-treemap__cell-value">${item.value}%</span><span class="mn-micro" style="color:rgba(255,255,255,0.85)">${dollarAmount(item.value)}</span></div>`; }
function legend(item) { return `<span class="mn-micro" style="display:inline-flex;align-items:center;gap:8px;color:var(--mn-text-muted)"><span style="width:10px;height:10px;border-radius:999px;background:${item.color}"></span>${item.label}</span>`; }
function showTooltip(tip, host, event, cell) { if (!(tip instanceof HTMLElement) || !(host instanceof HTMLElement) || !(cell instanceof HTMLElement)) return; const rect = host.getBoundingClientRect(); tip.innerHTML = `<div class="mn-chart-tooltip__label">Maranello Luce allocation</div><div class="mn-chart-tooltip__value">${cell.dataset.label} — ${cell.dataset.value}% · ${cell.dataset.amount}</div>`; tip.style.left = `${event.clientX - rect.left + 14}px`; tip.style.top = `${event.clientY - rect.top + 14}px`; tip.classList.add('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'false'); }
function hideTooltip(tip) { if (!(tip instanceof HTMLElement)) return; tip.classList.remove('mn-chart-tooltip--visible'); tip.setAttribute('aria-hidden', 'true'); }
function selectCell(cells, nextCell) { cells.forEach((cell) => { cell.style.outline = ''; cell.style.outlineOffset = ''; cell.style.boxShadow = ''; cell.style.transform = ''; cell.setAttribute('aria-pressed', 'false'); }); if (!nextCell) return; nextCell.style.outline = '2px solid rgba(255,255,255,0.9)'; nextCell.style.outlineOffset = '-2px'; nextCell.style.boxShadow = 'inset 0 0 0 1px rgba(255,199,44,0.65), 0 10px 24px rgba(0,0,0,0.25)'; nextCell.style.transform = 'scale(1.015)'; nextCell.setAttribute('aria-pressed', 'true'); }

export function createTreemapSection() {
  const [training, inference, embeddings, fineTuning, storage] = ALLOCATION;
  const section = document.createElement('section');
  section.id = 'treemap';
  section.className = 'mn-section-dark';
  section.innerHTML = `<div class="mn-container"><p class="mn-section-number">12B — Budget Treemap</p><h2 class="mn-title-section" style="margin-bottom:var(--space-sm)">Maranello Luce Compute Allocation</h2><p class="mn-body" style="margin-bottom:var(--space-2xl)">A manual treemap for the 2026 illustrative compute allocation, sized by workload weight and tuned for fast visual scanning.</p><details class="mn-code-snippet"><summary class="mn-label" style="cursor:pointer;color:var(--mn-accent);margin-bottom:var(--space-sm)">⟨/⟩ Usage</summary><pre class="mn-card-dark" style="padding:var(--space-md);font-family:var(--font-mono);font-size:var(--text-micro);overflow-x:auto;margin-bottom:var(--space-lg);border-left:3px solid var(--mn-accent)"><code>&lt;div class="mn-treemap" style="grid-template-columns:40fr 60fr"&gt;
  &lt;div class="mn-treemap__cell" style="background:#FFC72C"&gt;Training&lt;span&gt;40%&lt;/span&gt;&lt;/div&gt;
  &lt;div class="mn-treemap__cell" style="background:#4EA8DE"&gt;Inference&lt;span&gt;60%&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre></details><div class="mn-card-dark" style="padding:var(--space-xl)"><div style="display:flex;justify-content:space-between;gap:var(--space-lg);flex-wrap:wrap;align-items:flex-start;margin-bottom:var(--space-lg)"><div><h3 class="mn-title-sub" style="margin-bottom:var(--space-xs)">Total modeled compute spend: $840k</h3><p class="mn-micro" style="color:var(--grigio-medio)">Hover for allocation details. Click a tile to lock the focus area.</p></div><div style="display:flex;flex-wrap:wrap;gap:var(--space-md)">${ALLOCATION.map(legend).join('')}</div></div><div id="treemap-host" style="position:relative"><div class="mn-treemap" style="grid-template-columns:40fr 60fr;min-height:360px;background:rgba(255,255,255,0.04);padding:2px">${tile(training)}<div style="display:grid;grid-template-rows:30fr 30fr;gap:2px">${tile(inference)}<div style="display:grid;grid-template-columns:15fr 10fr 5fr;gap:2px">${tile(embeddings)}${tile(fineTuning)}${tile(storage)}</div></div></div><div id="treemap-tooltip" class="mn-chart-tooltip" aria-hidden="true"></div></div></div></div>`;
  requestAnimationFrame(() => initTreemap(section));
  return section;
}

function initTreemap(section) {
  const host = section.querySelector('#treemap-host'); const tip = section.querySelector('#treemap-tooltip'); const cells = Array.from(section.querySelectorAll('.mn-treemap__cell')); if (!(host instanceof HTMLElement) || !(tip instanceof HTMLElement) || !cells.length) return;
  let selected = null;
  cells.forEach((cell) => {
    const activate = () => { selected = cell; selectCell(cells, cell); };
    cell.addEventListener('mouseenter', (event) => showTooltip(tip, host, event, cell));
    cell.addEventListener('mousemove', (event) => showTooltip(tip, host, event, cell));
    cell.addEventListener('mouseleave', () => hideTooltip(tip));
    cell.addEventListener('focus', () => { const rect = cell.getBoundingClientRect(); showTooltip(tip, host, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 }, cell); });
    cell.addEventListener('blur', () => hideTooltip(tip));
    cell.addEventListener('click', activate);
    cell.addEventListener('keydown', (event) => { if (event.key !== 'Enter' && event.key !== ' ') return; event.preventDefault(); activate(); });
  });
  selected = cells[0]; selectCell(cells, selected);
}
