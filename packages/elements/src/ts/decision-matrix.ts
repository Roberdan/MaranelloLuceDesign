// Decision Matrix — weighted scoring table with optional inline editing
// WCAG 2.2 AA: role="grid", scope attrs, keyboard nav, visible focus

import { escapeHtml } from './core/sanitize';

/** Deep clone plain data — avoids deepClone (Safari < 15.4). */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export interface DecisionCriterion {
  id: string;
  label: string;
  weight: number;
}

export interface DecisionAlternative {
  id: string;
  label: string;
  scores: Record<string, number>;
}

export interface DecisionMatrixOptions {
  criteria: DecisionCriterion[];
  alternatives: DecisionAlternative[];
  editable?: boolean;
  onChange?: (alternatives: DecisionAlternative[]) => void;
}

export interface DecisionMatrixController {
  update: (alternatives: DecisionAlternative[]) => void;
  getScores: () => DecisionAlternative[];
  destroy: () => void;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function weightedTotal(
  alt: DecisionAlternative,
  criteria: DecisionCriterion[],
): number {
  let num = 0;
  let den = 0;
  for (const c of criteria) {
    const s = alt.scores[c.id] ?? 0;
    num += s * c.weight;
    den += c.weight;
  }
  return den > 0 ? (num / den) * 10 : 0;
}

function scoreBg(score: number): string {
  if (score >= 7) {
    return 'background:color-mix(in srgb, var(--signal-ok) 15%, transparent)';
  }
  if (score >= 4) {
    return 'background:color-mix(in srgb, var(--signal-warning) 15%, transparent)';
  }
  return 'background:color-mix(in srgb, var(--signal-danger) 15%, transparent)';
}

function rankAlternatives(
  alts: DecisionAlternative[],
  criteria: DecisionCriterion[],
): Map<string, number> {
  const totals = alts.map((a) => ({
    id: a.id,
    total: weightedTotal(a, criteria),
  }));
  totals.sort((a, b) => b.total - a.total);
  const ranks = new Map<string, number>();
  totals.forEach((t, i) => ranks.set(t.id, i + 1));
  return ranks;
}

export function decisionMatrix(
  el: HTMLElement,
  opts: DecisionMatrixOptions,
): DecisionMatrixController {
  let alternatives = deepClone(opts.alternatives);
  const { criteria, editable = false, onChange } = opts;
  let activeInput: HTMLInputElement | null = null;

  function commitEdit(): void {
    if (!activeInput) return;
    const altId = activeInput.dataset.alt ?? '';
    const critId = activeInput.dataset.crit ?? '';
    const val = clamp(parseInt(activeInput.value, 10) || 1, 1, 10);
    const alt = alternatives.find((a) => a.id === altId);
    if (alt) {
      alt.scores[critId] = val;
      onChange?.(deepClone(alternatives));
    }
    activeInput = null;
    render();
  }

  function openEdit(td: HTMLElement, altId: string, critId: string): void {
    if (activeInput) commitEdit();
    const current = alternatives.find((a) => a.id === altId)?.scores[critId] ?? 5;
    td.textContent = '';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '10';
    input.value = String(current);
    input.className = 'mn-decision-matrix__edit-input';
    input.dataset.alt = altId;
    input.dataset.crit = critId;
    input.setAttribute('aria-label', `Edit score for ${critId}: 1-10`);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commitEdit();
      if (e.key === 'Escape') { activeInput = null; render(); }
    });
    input.addEventListener('blur', () => commitEdit());
    td.appendChild(input);
    activeInput = input;
    input.focus();
    input.select();
  }

  function handleKeydown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (!target.matches('td[data-alt]')) return;
    if (e.key === 'Enter' && editable) {
      const altId = target.dataset.alt ?? '';
      const critId = target.dataset.crit ?? '';
      openEdit(target, altId, critId);
    }
  }

  function handleClick(e: MouseEvent): void {
    if (!editable) return;
    const target = (e.target as HTMLElement).closest<HTMLElement>('td[data-alt]');
    if (!target) return;
    const altId = target.dataset.alt ?? '';
    const critId = target.dataset.crit ?? '';
    if (altId && critId) openEdit(target, altId, critId);
  }

  function render(): void {
    const ranks = rankAlternatives(alternatives, criteria);
    const winnerId = [...ranks.entries()].find(([, r]) => r === 1)?.[0] ?? '';

    const headCells = criteria
      .map(
        (c) =>
          `<th scope="col">${escapeHtml(c.label)}<br>` +
          `<span class="mn-decision-matrix__weight">(w:${c.weight})</span></th>`,
      )
      .join('');

    const rows = alternatives
      .map((alt) => {
        const isWinner = alt.id === winnerId;
        const cls = isWinner ? ' class="mn-decision-matrix__row--winner"' : '';
        const total = weightedTotal(alt, criteria).toFixed(1);
        const rank = ranks.get(alt.id) ?? 0;
        const scoreCells = criteria
          .map((c) => {
            const s = alt.scores[c.id] ?? 0;
            const label = `${escapeHtml(c.label)}: ${s}/10`;
            const tab = editable ? ' tabindex="0"' : '';
            return (
              `<td data-alt="${escapeHtml(alt.id)}" data-crit="${escapeHtml(c.id)}"` +
              ` aria-label="${label}" style="${scoreBg(s)}"${tab}>` +
              `<span class="mn-decision-matrix__score">${s}</span></td>`
            );
          })
          .join('');
        return (
          `<tr${cls}><td>${escapeHtml(alt.label)}</td>${scoreCells}` +
          `<td><span class="mn-decision-matrix__total">${total}</span> ` +
          `<span class="mn-decision-matrix__rank">#${rank}</span></td></tr>`
        );
      })
      .join('');

    el.innerHTML =
      `<div class="mn-decision-matrix__wrap">` +
      `<table class="mn-decision-matrix" role="grid" aria-label="Decision matrix">` +
      `<thead><tr><th scope="col">Alternative</th>${headCells}` +
      `<th scope="col">Score</th></tr></thead>` +
      `<tbody>${rows}</tbody></table></div>`;

    el.querySelector('table')?.addEventListener('keydown', handleKeydown);
    el.querySelector('table')?.addEventListener('click', handleClick);
  }

  render();

  return {
    update(alts: DecisionAlternative[]): void {
      alternatives = deepClone(alts);
      render();
    },
    getScores(): DecisionAlternative[] {
      return deepClone(alternatives);
    },
    destroy(): void {
      el.innerHTML = '';
    },
  };
}
