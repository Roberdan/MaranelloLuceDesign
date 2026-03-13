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
/** Extended icon map with scrubbed, generic names. */
export declare const azIcons: {
    /** Generic project board icon (was: engagement). */
    readonly project: () => string;
    /** Generic workspace/location icon (was: studio). */
    readonly workspace: () => string;
    /** Now/Next dual-panel icon. */
    readonly nowNext: () => string;
};
/** Type for the azIcons map keys. */
export type AzIconName = keyof typeof azIcons;
