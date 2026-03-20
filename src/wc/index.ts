/**
 * Maranello Luce Design - Web Components registry
 * Each WC self-registers via customElements.define() on import.
 *
 * Usage:
 *   import { registerAll } from '@maranello/wc';
 *   registerAll(); // ensures all WCs are loaded and registered
 */

const WC_TAGS = [
  'mn-app-shell',
  'mn-a11y',
  'mn-async-select',
  'mn-chart',
  'mn-chat',
  'mn-command-palette',
  'mn-dashboard',
  'mn-data-table',
  'mn-date-picker',
  'mn-detail-panel',
  'mn-entity-workbench',
  'mn-ferrari-control',
  'mn-facet-workbench',
  'mn-funnel',
  'mn-gantt',
  'mn-gauge',
  'mn-hbar',
  'mn-login',
  'mn-map',
  'mn-mapbox',
  'mn-modal',
  'mn-okr',
  'mn-profile',
  'mn-speedometer',
  'mn-state-scaffold',
  'mn-system-status',
  'mn-tab',
  'mn-tabs',
  'mn-theme-rotary',
  'mn-section-nav',
  'mn-theme-toggle',
  'mn-toast',
] as const;

type WcTag = (typeof WC_TAGS)[number];

let _loaded = false;

/** Import all WC modules (side-effect: each calls customElements.define). */
export async function registerAll(): Promise<void> {
  if (_loaded) return;
  _loaded = true;
  await Promise.all([
    import('./mn-app-shell.js'),
    import('./mn-a11y.js'),
    import('./mn-async-select.js'),
    import('./mn-chart.js'),
    import('./mn-chat.js'),
    import('./mn-command-palette.js'),
    import('./mn-dashboard.js'),
    import('./mn-data-table.js'),
    import('./mn-date-picker.js'),
    import('./mn-detail-panel.js'),
    import('./mn-entity-workbench.js'),
    import('./mn-ferrari-control.js'),
    import('./mn-facet-workbench.js'),
    import('./mn-funnel.js'),
    import('./mn-gantt.js'),
    import('./mn-gauge.js'),
    import('./mn-hbar.js'),
    import('./mn-login.js'),
    import('./mn-map.js'),
    import('./mn-mapbox.js'),
    import('./mn-modal.js'),
    import('./mn-okr.js'),
    import('./mn-profile.js'),
    import('./mn-speedometer.js'),
    import('./mn-state-scaffold.js'),
    import('./mn-system-status.js'),
    import('./mn-tabs.js'), // also registers mn-tab
    import('./mn-section-nav.js'),
    import('./mn-theme-rotary.js'),
    import('./mn-theme-toggle.js'),
    import('./mn-toast.js'),
  ]);

  // Auto-inject a11y FAB if not already in DOM
  if (typeof document !== 'undefined' && !document.querySelector('mn-a11y')) {
    document.body.appendChild(document.createElement('mn-a11y'));
  }
}

/** Check if a specific WC tag is already registered. */
export function isRegistered(tag: WcTag): boolean {
  return !!customElements.get(tag);
}

/** Get list of all WC tags managed by this design system. */
export function getAvailableTags(): readonly string[] {
  return WC_TAGS;
}

/** Get list of currently registered WC tags. */
export function getRegistered(): string[] {
  return WC_TAGS.filter((tag) => !!customElements.get(tag));
}
