/**
 * Maranello Luce Design - Gauge color palette definitions
 * Theme-aware palette for FerrariGauge, including avorio/nero/colorblind variants.
 */
export interface GaugeRenderPalette {
    numbers: string;
    centerValue: string;
    centerUnit: string;
    centerLabel: string;
    muted: string;
    dimmed: string;
    subDialLabel: string;
    tickMajor: string;
    tickHalf: string;
    tickMinor: string;
    highlightRing: string;
    trackAlpha: string;
    arcDot: string;
    needleTail: string;
    needleTip: string;
    capOuter: string[];
    capInner: string[];
    capCenter: string;
    subDialBg: string[];
    subDialBorder: string;
    subDialTrack: string;
    odometerBg: string;
    odometerBorder: string;
    odometerText: string;
    ledLabel: null;
    axisLabel: string;
    axisTitle: string;
    gridScale: string;
    sparkMonth: string;
    sparkLabel: string;
    quadrant: string;
    quadrantDim: string;
    quadrantHi: string;
}
/** Build the gauge palette based on current body theme class. */
export declare function buildGaugePalette(accent: string): GaugeRenderPalette;
