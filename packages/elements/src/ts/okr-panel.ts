/**
 * Maranello Luce Design - OKR Panel: Main Factory
 * Creates an OKR dashboard panel with hero gauge, summary cards, and objective cards.
 * @version 2.0.0
 */
import type { ObjectiveInput, OkrPanelOptions, OkrPanelController } from './okr-panel-utils';
import {
  getStatusColors, animateRings, animateSummaryRings, animateBars, animateGauge, el,
} from './okr-panel-utils';
import {
  normalizeObjective, calculateStats, createSummaryCard, createHero,
  createObjectiveCard,
} from './okr-panel-cards';

export type { OkrPanelOptions, OkrPanelController } from './okr-panel-utils';

/**
 * Create an OKR dashboard panel inside the given container.
 * Returns a controller with update() and destroy() methods.
 */
export function okrPanel(
  container: string | Element,
  opts?: OkrPanelOptions,
): OkrPanelController | null {
  const host = typeof container === 'string'
    ? document.querySelector<HTMLElement>(container) : container as HTMLElement;
  if (!host) {
    console.warn('[Maranello] okrPanel: container not found:', container);
    return null;
  }
  const el_host = host; // non-null binding for closures

  const title = opts?.title ?? 'OKR Dashboard';
  const period = opts?.period ?? '';
  let objectives = (opts?.objectives ?? []).map(normalizeObjective);

  function render(): void {
    el_host.innerHTML = '';
    const root = el('div', 'mn-okr');
    const header = el('div', 'mn-okr__header');
    header.appendChild(el('h2', 'mn-okr__title', { text: title }));
    root.appendChild(header);

    const stats = calculateStats(objectives);
    root.appendChild(createHero(stats, period));

    const summaryRow = el('div', 'mn-okr__summary-row') as HTMLDivElement;
    const total = objectives.length;
    const descriptions: Record<string, string> = {
      'on-track': '\u2265 75% progress', 'at-risk': '40-74% progress', behind: '< 40% progress',
    };
    (['on-track', 'at-risk', 'behind'] as const).forEach((s) => {
      summaryRow.appendChild(createSummaryCard(s, stats.counts[s], descriptions[s], total));
    });
    root.appendChild(summaryRow);

    const grid = el('div', 'mn-okr__grid') as HTMLDivElement;
    objectives.forEach((obj, i) => grid.appendChild(createObjectiveCard(obj, i)));
    root.appendChild(grid);
    el_host.appendChild(root);

    requestAnimationFrame(() => {
      animateRings(root);
      animateSummaryRings(root);
      animateBars(root);
      animateGauge(root);
    });
  }

  render();

  return {
    update(newObjectives: ObjectiveInput[]): void {
      objectives = newObjectives.map(normalizeObjective);
      render();
    },
    destroy(): void { el_host.innerHTML = ''; },
  };
}
