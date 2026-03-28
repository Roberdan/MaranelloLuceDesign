/**
 * @maranello/tokens - Style reading utilities
 * Read live CSS custom property values from the document.
 */

/** Read a CSS custom property value, with fallback.
 *  Reads from document.body so theme overrides (body.mn-sugar, body.mn-avorio)
 *  are resolved -- :root tokens still inherit via cascade. */
export function cssVar(name: string, fallback: string = ''): string {
  const el = document.body ?? document.documentElement;
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/**
 * Read live token colors from CSS custom properties.
 * Use includePrimitives only for legacy consumers during migration.
 */
export function palette(
  el: Element = document.documentElement,
  opts?: { includePrimitives?: boolean },
): Record<string, string> {
  const read = (name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();
  const semantic = {
    surface: read('--mn-surface'),
    surfaceRaised: read('--mn-surface-raised'),
    surfaceSunken: read('--mn-surface-sunken'),
    surfaceInput: read('--mn-surface-input'),
    surfaceOverlay: read('--mn-surface-overlay'),
    text: read('--mn-text'),
    textMuted: read('--mn-text-muted'),
    textTertiary: read('--mn-text-tertiary'),
    border: read('--mn-border'),
    borderSubtle: read('--mn-border-subtle'),
    accent: read('--mn-accent'),
    accentHover: read('--mn-accent-hover'),
    signalOk: read('--signal-ok'),
    signalWarning: read('--signal-warning'),
    signalDanger: read('--signal-danger'),
    signalInfo: read('--signal-info'),
    hoverBg: read('--mn-hover-bg'),
    focusRing: read('--mn-focus-ring'),
  };
  if (!opts?.includePrimitives) return semantic;
  return {
    ...semantic,
    giallo: read('--mn-accent'),
    rosso: read('--mn-error'),
    verde: read('--signal-ok'),
    azzurro: read('--signal-info'),
    biancoCaldo: read('--mn-text'),
    grigioChiaro: read('--mn-text-tertiary'),
    grigioMedio: read('--mn-text-muted'),
    neroAssoluto: read('--mn-text-inverse'),
  };
}
