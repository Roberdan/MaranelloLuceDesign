/**
 * Maranello Luce Design - Speedometer palette, constants, and types
 * Shared between speedometer.ts and speedometer-draw.ts.
 */

export const SPEEDO_FONT = "'Barlow Condensed', 'Outfit', sans-serif";
export const SPEEDO_SIZES: Record<string, number> = { sm: 120, md: 220, lg: 320 };
export const SWEEP = Math.PI * 1.5;
export const START = Math.PI * 0.75;

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function valueToAngle(v: number, max: number): number {
  return START + (Math.min(Math.max(v, 0), max) / max) * SWEEP;
}

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

export function speedoPalette(): SpeedoPalette {
  const cl = document.body.classList;
  const isCB = cl.contains('mn-colorblind');
  const isNero = cl.contains('mn-nero');
  const D: SpeedoPalette = {
    needle: null, arc: null, barStops: null,
    bg: ['#0d0d0d', '#1a1a1a', '#2c2c2c'], border: '#3a3a3a',
    minorTick: '#444', majStroke: '#aaa', majText: '#c8c8c8',
    capFill: '#2a2a2a', capStroke: '#555',
    value: '#fafafa', unit: '#888', subLabel: '#666',
    barBg: '#1a1a1a', barDim: '#666', barBright: '#aaa',
  };
  if (isCB) {
    return { ...D, needle: '#4D9DE0', arc: '#7EC8E3',
      barStops: ['#E15759', '#EDC948', '#59A14F'] };
  }
  if (isNero) {
    return { ...D, bg: ['#050505', '#111', '#1a1a1a'], border: '#2a2a2a',
      minorTick: '#333', capFill: '#1a1a1a', capStroke: '#444', barBg: '#111' };
  }
  return D;
}

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
