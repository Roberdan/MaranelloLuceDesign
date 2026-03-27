/**
 * Maranello Luce Design - Extended domain icons (A-Z supplement)
 * Icons from the original icons-az.js, scrubbed of domain-specific names.
 *
 * Scrub log:
 *   engagement -> project
 *   studio     -> workspace
 *   rtbReport  -> (skipped, identical SVG exists as 'report' in icons-objects)
 *   mvp        -> (skipped, identical SVG exists as 'layers' in icons-objects)
 *
 * Icons already present in other sub-modules are NOT duplicated here.
 * Only genuinely new icons are exported.
 */
import { svg } from './icon-svg';

/** Extended icon map with scrubbed, generic names. */
export const azIcons = {
  /** Generic project board icon (was: engagement). */
  project: () =>
    svg(
      '<rect x="3" y="4" width="18" height="16" rx="2"/>'
      + '<path d="M9 4v16"/><path d="M3 9h6"/><path d="M3 14h6"/>'
      + '<circle cx="16" cy="12" r="3"/><path d="M16 9v0"/>',
    ),

  /** Generic workspace/location icon (was: studio). */
  workspace: () =>
    svg(
      '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>'
      + '<path d="M9 21v-6h6v6"/>'
      + '<line x1="9" y1="10" x2="9" y2="10.01"/>'
      + '<line x1="15" y1="10" x2="15" y2="10.01"/>',
    ),

  /** Now/Next dual-panel icon. */
  nowNext: () =>
    svg(
      '<rect x="2" y="5" width="8" height="14" rx="1"/>'
      + '<rect x="14" y="5" width="8" height="14" rx="1"/>'
      + '<circle cx="6" cy="10" r="2" fill="currentColor" opacity="0.4"/>'
      + '<path d="M17 10l2 2-2 2"/>',
    ),
} as const;

/** Type for the azIcons map keys. */
export type AzIconName = keyof typeof azIcons;
