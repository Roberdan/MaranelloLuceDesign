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
export function buildGaugePalette(accent: string): GaugeRenderPalette {
  const D: GaugeRenderPalette = {
    numbers: '#c8c8c8', centerValue: '#fafafa', centerUnit: '#9e9e9e',
    centerLabel: '#666', muted: '#666', dimmed: '#555', subDialLabel: '#888',
    tickMajor: '#D4A826', tickHalf: '#9A7B1C', tickMinor: '#5a4a14',
    highlightRing: 'rgba(255,255,255,0.04)', trackAlpha: 'rgba(255,255,255,0.06)',
    arcDot: '#fff', needleTail: '#555', needleTip: '#fff',
    capOuter: ['#888', '#555', '#333', '#1a1a1a'],
    capInner: ['#aaa', '#666', '#2a2a2a'], capCenter: '#444',
    subDialBg: ['#222', '#111'], subDialBorder: '#3a3a3a',
    subDialTrack: 'rgba(255,255,255,0.08)',
    odometerBg: '#1a1a1a', odometerBorder: '#333', odometerText: '#fafafa',
    ledLabel: null, axisLabel: '#888', axisTitle: '#9e9e9e',
    gridScale: '#666', sparkMonth: '#555', sparkLabel: '#666',
    quadrant: '#888', quadrantDim: '#555', quadrantHi: accent,
  };

  const cl = document.body.classList;
  if (cl.contains('mn-avorio')) {
    return { ...D,
      /* Text / numbers — dark on light surface */
      numbers: '#3a3530', centerValue: '#1a1a1a', centerUnit: '#666660',
      centerLabel: '#4a4540', muted: '#666660', dimmed: '#7a7570',
      subDialLabel: '#5a5550', axisLabel: '#4a4540', axisTitle: '#5a5550',
      gridScale: '#8a8580', sparkMonth: '#8a8580', sparkLabel: '#7a7570',
      quadrant: '#a0a09a', quadrantDim: '#b0aba4',
      /* Ticks — darker gold for contrast on ivory */
      tickMajor: '#a07818', tickHalf: '#806010', tickMinor: '#604808',
      /* Bezel chrome — warm silver instead of dark chrome */
      capOuter: ['#d0cfc9', '#b8b4ae', '#a09e98', '#888582'],
      capInner: ['#d8d4ce', '#c0bcb6', '#a8a49e'], capCenter: '#b0aba4',
      /* Needle */
      needleTail: '#a8a49e', needleTip: '#1a1a1a',
      /* Highlight / track */
      highlightRing: 'rgba(0,0,0,0.04)', trackAlpha: 'rgba(0,0,0,0.06)',
      /* Sub-dials and odometer */
      subDialBg: ['#e8e4dc', '#ddd8ce'], subDialBorder: '#c0b9ad',
      subDialTrack: 'rgba(0,0,0,0.08)',
      odometerBg: '#f0ede6', odometerBorder: '#ccc', odometerText: '#1a1a1a',
    };
  }
  if (cl.contains('mn-sugar')) {
    return { ...D,
      numbers: '#333', centerValue: '#111', centerUnit: '#666',
      centerLabel: '#444', muted: '#666', dimmed: '#777',
      subDialLabel: '#555', axisLabel: '#444', axisTitle: '#555',
      gridScale: '#888', sparkMonth: '#888', sparkLabel: '#777',
      quadrant: '#999', quadrantDim: '#aaa',
      tickMajor: '#888', tickHalf: '#aaa', tickMinor: '#ccc',
      capOuter: ['#D0D0D5', '#C0C0C5', '#B0B0B5', '#A0A0A5'],
      capInner: ['#D8D8DC', '#C8C8CC', '#B0B0B5'], capCenter: '#C0C0C5',
      needleTail: '#999', needleTip: '#111',
      highlightRing: 'rgba(0,0,0,0.06)', trackAlpha: 'rgba(0,0,0,0.08)',
      subDialBg: ['#d0d0d5', '#c0c0c5'], subDialBorder: '#b0b0b5',
      subDialTrack: 'rgba(0,0,0,0.10)',
      odometerBg: '#e4e4e8', odometerBorder: '#d0d0d5', odometerText: '#111',
    };
  }
  if (cl.contains('mn-colorblind')) {
    return { ...D,
      tickMajor: '#FFB000', tickHalf: '#B87E00', tickMinor: '#7A5400',
      quadrantHi: '#0072B2',
    };
  }
  if (cl.contains('mn-nero')) {
    return { ...D,
      numbers: '#e0e0e0', subDialBg: ['#1a1a1a', '#0a0a0a'],
      subDialBorder: '#2a2a2a', odometerBg: '#0a0a0a', odometerBorder: '#222',
    };
  }
  return D;
}
