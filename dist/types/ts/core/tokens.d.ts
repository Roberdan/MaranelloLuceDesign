/**
 * Maranello Luce Design - Design token name constants
 * Maps to CSS custom properties defined in the theme stylesheets.
 */
export declare const COLOR: {
    readonly ROSSO_CORSA: "--rosso-corsa";
    readonly GIALLO_FERRARI: "--giallo-ferrari";
    readonly VERDE_BANDIERA: "--verde-bandiera";
    readonly NERO_ASSOLUTO: "--nero-assoluto";
    readonly NERO_SOFT: "--nero-soft";
    readonly BIANCO_PURO: "--bianco-puro";
    readonly BIANCO_CALDO: "--bianco-caldo";
    readonly GRIGIO_CHIARO: "--grigio-chiaro";
    readonly GRIGIO_MEDIO: "--grigio-medio";
    readonly GRIGIO_SCURO: "--grigio-scuro";
    readonly SIGNAL_DANGER: "--signal-danger";
    readonly SIGNAL_WARNING: "--signal-warning";
    readonly SIGNAL_SUCCESS: "--signal-success";
    readonly SIGNAL_INFO: "--signal-info";
    readonly CHART_DEFAULT: "--chart-default";
};
export declare const FONT: {
    readonly BODY: "--font-body";
    readonly MONO: "--font-mono";
    readonly DISPLAY: "--font-display";
};
export declare const TEXT_SIZE: {
    readonly NANO: "--text-nano";
    readonly MICRO: "--text-micro";
    readonly SMALL: "--text-small";
    readonly BASE: "--text-base";
    readonly LARGE: "--text-large";
    readonly XL: "--text-xl";
    readonly XXL: "--text-xxl";
};
export declare const SPACE: {
    readonly XXS: "--space-xxs";
    readonly XS: "--space-xs";
    readonly SM: "--space-sm";
    readonly MD: "--space-md";
    readonly LG: "--space-lg";
    readonly XL: "--space-xl";
    readonly XXL: "--space-xxl";
};
export declare const DURATION: {
    readonly FAST: "--duration-fast";
    readonly SM: "--duration-sm";
    readonly MD: "--duration-md";
    readonly LG: "--duration-lg";
};
export declare const EASE: {
    readonly IN: "--ease-in";
    readonly OUT: "--ease-out";
    readonly IN_OUT: "--ease-in-out";
};
export declare const RADIUS: {
    readonly SM: "--radius-sm";
    readonly MD: "--radius-md";
    readonly LG: "--radius-lg";
    readonly FULL: "--radius-full";
};
export declare const SHADOW: {
    readonly SM: "--shadow-sm";
    readonly MD: "--shadow-md";
    readonly LG: "--shadow-lg";
};
export declare const SCOPE_COLOR: {
    readonly LOCAL: "--scope-local";
    readonly TEAM: "--scope-team";
    readonly GLOBAL: "--scope-global";
};
export declare const Z_INDEX: {
    readonly DROPDOWN: "--z-dropdown";
    readonly MODAL: "--z-modal";
    readonly TOAST: "--z-toast";
    readonly TOOLTIP: "--z-tooltip";
};
/** Token value type for all token constants. */
export type TokenName = string & {
    readonly __brand?: 'css-custom-property';
};
