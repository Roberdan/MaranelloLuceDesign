/**
 * Maranello Luce Design - Speedometer palette, constants, and types
 * Shared between speedometer.ts and speedometer-draw.ts.
 */
export declare const SPEEDO_FONT = "'Barlow Condensed', 'Outfit', sans-serif";
export declare const SPEEDO_SIZES: Record<string, number>;
export declare const SWEEP: number;
export declare const START: number;
export declare function easeOutCubic(t: number): number;
export declare function valueToAngle(v: number, max: number): number;
export interface SpeedoPalette {
    needle: string | null;
    arc: string | null;
    barStops: string[] | null;
    bg: string[];
    border: string;
    minorTick: string;
    majStroke: string;
    majText: string;
    capFill: string;
    capStroke: string;
    value: string;
    unit: string;
    subLabel: string;
    barBg: string;
    barDim: string;
    barBright: string;
}
export declare function speedoPalette(): SpeedoPalette;
export interface SpeedoBarDrawOptions {
    value?: number;
    colorStops?: string[];
    label?: string;
    labelLeft?: string;
    labelRight?: string;
}
export interface SpeedoDrawOptions {
    max: number;
    unit: string;
    ticks: number[];
    minorTicks: number;
    needleColor: string;
    arcColor: string;
    arcStart: number;
    arcEnd: number | null;
    bar: SpeedoBarDrawOptions | null;
    subLabel: string | null;
}
