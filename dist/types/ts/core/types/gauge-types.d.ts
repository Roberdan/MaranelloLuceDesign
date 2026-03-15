/**
 * Maranello Luce Design - Gauge & Speedometer type definitions
 * Extracted from: gauge-engine-class, gauge-engine-draw,
 *   gauge-engine, speedometer-draw, speedometer
 */
export type GaugeSize = 'sm' | 'md' | 'lg' | 'fluid' | number;
export interface GaugeConfig {
    value?: number;
    min?: number;
    max?: number;
    label?: string;
    unit?: string;
    size?: GaugeSize;
    ticks?: number;
    animate?: boolean;
    severity?: boolean;
    redline?: number;
}
export interface GaugePalette {
    face: string;
    bezel: string;
    tick: string;
    tickMajor: string;
    needle: string;
    needleCap: string;
    text: string;
    label: string;
    glow: string;
}
export interface GaugeSizes {
    sm: number;
    md: number;
    lg: number;
}
export interface FerrariGaugeInstance {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    config: GaugeConfig;
    dpr: number;
    size: number;
    density: number;
    palette: GaugePalette;
    init: () => void;
    redraw: () => void;
    animate: (from: number, to: number) => void;
    draw: (progress: number) => void;
}
export interface SpeedometerBarOptions {
    value?: number;
    color?: string;
    label?: string;
}
export interface SpeedometerOptions {
    value?: number;
    max?: number;
    unit?: string;
    size?: GaugeSize;
    ticks?: number[];
    minorTicks?: number;
    needleColor?: string;
    arcColor?: string;
    arcStart?: number;
    arcEnd?: number | null;
    bar?: SpeedometerBarOptions | null;
    subLabel?: string | null;
    animate?: boolean;
}
export interface SpeedometerController {
    setValue: (v: number) => void;
    setBar: (v: number) => void;
    destroy: () => void;
}
