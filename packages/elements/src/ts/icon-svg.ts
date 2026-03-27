/**
 * Shared SVG wrapper for icon definitions.
 * Deduplicates the common 24x24 stroke-icon boilerplate across 150+ icons.
 */

const D = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

/** Wrap inner SVG content with the standard icon shell. */
export function svg(inner: string, strokeWidth = 1.5): string {
  return `<svg ${D} stroke-width="${strokeWidth}">${inner}</svg>`;
}
