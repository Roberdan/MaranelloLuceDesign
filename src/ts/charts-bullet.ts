/**
 * Maranello Luce Design - Bullet Chart
 * Stephen Few-style target-vs-actual chart.
 * Three layers: qualitative bands → value bar (centered, narrower) → target marker.
 */

export interface BulletRange {
  max: number;
  color?: string;   // CSS color or var() string
  label?: string;
}

export interface BulletChartOptions {
  value: number;
  target: number;
  max: number;
  label?: string;
  unit?: string;
  ranges?: BulletRange[];  // custom qualitative bands; default: 3 tonal bands
  height?: number;         // logical track height px, default: 32
  animate?: boolean;       // default: true
}

function resolve(varName: string): string {
  const el = document.body ?? document.documentElement;
  return getComputedStyle(el).getPropertyValue(varName).trim() || '#888';
}

function parseColor(color: string): string {
  if (color.startsWith('var(')) {
    const name = color.slice(4, color.indexOf(')')).split(',')[0].trim();
    return resolve(name);
  }
  return color;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function colorAt(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(128,128,128,${alpha})`;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function easeOut(t: number): number { return 1 - (1 - t) ** 3; }

export function bulletChart(
  canvas: HTMLCanvasElement,
  opts: BulletChartOptions,
): void {
  const dpr = window.devicePixelRatio || 1;
  const trackH = opts.height ?? 32;
  const labelH = opts.label ? 18 : 0;
  const totalH = trackH + labelH + 4;  // 4px bottom margin for value text

  /* Use clientWidth for accurate flex-resolved width */
  const logicalW = canvas.parentElement
    ? canvas.parentElement.getBoundingClientRect().width - 4
    : (canvas.offsetWidth || 400);

  canvas.width = Math.round(logicalW * dpr);
  canvas.height = Math.round(totalH * dpr);
  canvas.style.width = `${logicalW}px`;
  canvas.style.height = `${totalH}px`;

  /* A11y */
  canvas.setAttribute('role', 'img');
  const pct = opts.max > 0 ? Math.round((opts.value / opts.max) * 100) : 0;
  canvas.setAttribute('aria-label',
    `${opts.label ?? 'Bullet chart'}: value ${opts.value}${opts.unit ?? ''}, target ${opts.target}${opts.unit ?? ''} (${pct}% of max)`);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  /* Reserve space: left padding for nothing, right for value text */
  const rightPad = 52;
  const trackW = logicalW - rightPad;
  const trackY = labelH + 2;

  /* Qualitative ranges — three neutral tonal bands using border/surface tokens.
     We intentionally avoid signal colors in the bands to keep visual noise low;
     the value bar position conveys status relative to the target marker. */
  const borderHex = parseColor('var(--mn-border)');
  const accentHex = parseColor('var(--mn-accent)');
  const textHex    = parseColor('var(--mn-text)');
  const mutedHex   = parseColor('var(--mn-text-muted)');

  const bands = opts.ranges ?? [
    { max: opts.max * 0.40, color: colorAt(borderHex, 0.45) },
    { max: opts.max * 0.70, color: colorAt(borderHex, 0.28) },
    { max: opts.max,        color: colorAt(borderHex, 0.14) },
  ];

  function draw(currentValue: number): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, logicalW, totalH);

    /* Label */
    if (opts.label) {
      ctx.font = `11px system-ui,sans-serif`;
      ctx.fillStyle = mutedHex;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(opts.label, 0, 0);
    }

    /* 1 — qualitative bands (full track height, drawn from widest to narrowest) */
    const sortedBands = [...bands].sort((a, b) => b.max - a.max);
    for (const band of sortedBands) {
      const bw = Math.min((band.max / opts.max) * trackW, trackW);
      const color = typeof band.color === 'string' && band.color.startsWith('rgba')
        ? band.color
        : colorAt(parseColor(band.color ?? 'var(--mn-border)'), 0.3);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(0, trackY, bw, trackH, 3);
      ctx.fill();
    }

    /* 2 — value bar: 44% of track height, vertically centered, rounded, accent */
    const valBarH = Math.round(trackH * 0.44);
    const valBarY = trackY + Math.round((trackH - valBarH) / 2);
    const valW = Math.max(2, Math.min((currentValue / opts.max) * trackW, trackW));
    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.roundRect(0, valBarY, valW, valBarH, 2);
    ctx.fill();

    /* 3 — target marker: 3px wide, full track height, high-contrast */
    const targetX = Math.round((opts.target / opts.max) * trackW);
    ctx.fillStyle = textHex;
    ctx.fillRect(targetX - 1, trackY, 3, trackH);

    /* 4 — value label at right */
    const displayVal = Number.isInteger(opts.value) ? Math.round(currentValue) : currentValue.toFixed(1);
    const label = `${displayVal}${opts.unit ?? ''}`;
    ctx.font = `bold 11px system-ui,sans-serif`;
    ctx.fillStyle = textHex;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(label, trackW + 6, trackY + trackH / 2);

    /* 5 — target value label (smaller, under the marker) */
    const targetLabel = `${opts.target}${opts.unit ?? ''}`;
    ctx.font = `9px system-ui,sans-serif`;
    ctx.fillStyle = mutedHex;
    ctx.textAlign = 'center';
    ctx.fillText(targetLabel, targetX, trackY + trackH + 2);
  }

  if (opts.animate === false) { draw(opts.value); return; }

  let start: number | null = null;
  function frame(ts: number): void {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / 600, 1);
    draw(easeOut(p) * opts.value);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
