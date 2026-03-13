import { type SpeedoDrawOptions } from './speedometer-palette';
export { SPEEDO_SIZES, SWEEP, START, easeOutCubic, valueToAngle } from './speedometer-palette';
export type { SpeedoPalette, SpeedoDrawOptions, SpeedoBarDrawOptions } from './speedometer-palette';
/** Full-frame speedometer canvas draw. */
export declare function drawSpeedometer(ctx: CanvasRenderingContext2D, dim: number, s: number, cx: number, cy: number, R: number, curAngle: number, curVal: number, barVal: number, opts: SpeedoDrawOptions): void;
