/**
 * Maranello Luce Design - Design token name constants
 * Maps to CSS custom properties defined in the theme stylesheets.
 */

// --- Color tokens ---

export const SEMANTIC_COLOR = {
  ACCENT: '--mn-accent',
  ACCENT_HOVER: '--mn-accent-hover',
  ERROR: '--mn-error',
  WARNING: '--mn-warning',
  SUCCESS: '--mn-success',
  INFO: '--mn-info',
  SURFACE: '--mn-surface',
  SURFACE_RAISED: '--mn-surface-raised',
  SURFACE_SUNKEN: '--mn-surface-sunken',
  TEXT: '--mn-text',
  TEXT_MUTED: '--mn-text-muted',
  TEXT_TERTIARY: '--mn-text-tertiary',
  BORDER: '--mn-border',
  BORDER_SUBTLE: '--mn-border-subtle',
  FOCUS_RING: '--mn-focus-ring',
} as const;

/** @deprecated Use `SEMANTIC_COLOR` keys instead. */
export const COLOR = {
  /** @deprecated Use `SEMANTIC_COLOR.ERROR`. */
  ROSSO_CORSA: '--mn-error',
  /** @deprecated Use `SEMANTIC_COLOR.ACCENT`. */
  GIALLO_FERRARI: '--mn-accent',
  VERDE_BANDIERA: '--verde-bandiera',
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  NERO_ASSOLUTO: '--mn-text-inverse',
  /** @deprecated Use `SEMANTIC_COLOR.SURFACE_RAISED`. */
  NERO_SOFT: '--mn-surface-raised',
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  BIANCO_PURO: '--mn-text',
  /** @deprecated Use `SEMANTIC_COLOR.TEXT`. */
  BIANCO_CALDO: '--mn-text',
  /** @deprecated Use `SEMANTIC_COLOR.TEXT_TERTIARY`. */
  GRIGIO_CHIARO: '--mn-text-tertiary',
  /** @deprecated Use `SEMANTIC_COLOR.TEXT_MUTED`. */
  GRIGIO_MEDIO: '--mn-text-muted',
  /** @deprecated Use `SEMANTIC_COLOR.BORDER`. */
  GRIGIO_SCURO: '--mn-border',
  SIGNAL_DANGER: '--signal-danger',
  SIGNAL_WARNING: '--signal-warning',
  SIGNAL_SUCCESS: '--signal-success',
  SIGNAL_INFO: '--signal-info',
  /** @deprecated Use `SEMANTIC_COLOR.ACCENT`. */
  CHART_DEFAULT: '--mn-accent',
} as const;

// --- Typography tokens ---

export const FONT = {
  BODY: '--font-body',
  MONO: '--font-mono',
  DISPLAY: '--font-display',
} as const;

export const TEXT_SIZE = {
  NANO: '--text-nano',
  MICRO: '--text-micro',
  SMALL: '--text-small',
  BASE: '--text-base',
  LARGE: '--text-large',
  XL: '--text-xl',
  XXL: '--text-xxl',
} as const;

// --- Spacing tokens ---

export const SPACE = {
  XXS: '--space-xxs',
  XS: '--space-xs',
  SM: '--space-sm',
  MD: '--space-md',
  LG: '--space-lg',
  XL: '--space-xl',
  XXL: '--space-xxl',
} as const;

// --- Motion tokens ---

export const DURATION = {
  FAST: '--duration-fast',
  SM: '--duration-sm',
  MD: '--duration-md',
  LG: '--duration-lg',
} as const;

export const EASE = {
  IN: '--ease-in',
  OUT: '--ease-out',
  IN_OUT: '--ease-in-out',
} as const;

// --- Border tokens ---

export const RADIUS = {
  SM: '--radius-sm',
  MD: '--radius-md',
  LG: '--radius-lg',
  FULL: '--radius-full',
} as const;

// --- Shadow tokens ---

export const SHADOW = {
  SM: '--shadow-sm',
  MD: '--shadow-md',
  LG: '--shadow-lg',
} as const;

// --- Scope color tokens (OKR / org) ---

export const SCOPE_COLOR = {
  LOCAL: '--scope-local',
  TEAM: '--scope-team',
  GLOBAL: '--scope-global',
} as const;

// --- Z-index tokens ---

export const Z_INDEX = {
  DROPDOWN: '--z-dropdown',
  MODAL: '--z-modal',
  TOAST: '--z-toast',
  TOOLTIP: '--z-tooltip',
} as const;

/** Token value type for all token constants. */
export type TokenName = string & { readonly __brand?: 'css-custom-property' };
