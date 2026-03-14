/**
 * Maranello Luce Design - FerrariGauge engine (main class)
 * Theme-aware canvas gauge with animated needle, sub-dials, and complications.
 */
import type { GaugeDrawState } from './gauge-engine-draw';
import { drawGauge } from './gauge-engine-draw';
import { buildGaugePalette } from './gauge-engine-palette';
import { drawComplications } from './gauge-engine-complications';
import { getAccent } from './core/utils';

/** Size presets for the gauge canvas. */
const SIZES: Record<string, number> = { sm: 120, md: 220, lg: 320 };

/** FerrariGauge: full-featured canvas gauge with animation support. */
export class FerrariGauge {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: Record<string, unknown>;
  dpr: number;
  size!: number;
  cx!: number;
  cy!: number;
  radius!: number;
  density!: 'sm' | 'md' | 'lg';

  private srSpan: HTMLSpanElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.config = JSON.parse(canvas.dataset.gauge || '{}');
    this.dpr = window.devicePixelRatio || 1;
    this.init();
  }

  get palette() {
    const accent = getAccent();
    return buildGaugePalette(accent);
  }

  /** Initialize canvas size from data attribute or parent bounds. */
  init(): void {
    const sizeKey = this.canvas.dataset.size;
    let size: number;
    if (sizeKey && SIZES[sizeKey]) {
      size = SIZES[sizeKey];
    } else {
      const rect = (this.canvas.parentElement || this.canvas).getBoundingClientRect();
      size = Math.min(rect.width, rect.height);
    }
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    this.ctx.scale(this.dpr, this.dpr);
    this.size = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.radius = size * 0.40;
    this.density = size <= 140 ? 'sm' : size <= 260 ? 'md' : 'lg';
    this.initA11y();
    this.animate();
  }

  /** Set up ARIA attributes and screen-reader helpers on the canvas. */
  private initA11y(): void {
    this.canvas.setAttribute('role', 'img');
    const label = this.buildA11yLabel();
    this.canvas.setAttribute('aria-label', label);
    this.canvas.textContent = label;

    // Insert sr-only span after canvas for assistive tech
    if (!this.srSpan) {
      this.srSpan = document.createElement('span');
      this.srSpan.className = 'mn-sr-only';
      this.canvas.parentElement?.insertBefore(this.srSpan, this.canvas.nextSibling);
    }
    this.srSpan.textContent = label;
  }

  /** Build an accessible label from gauge config values. */
  private buildA11yLabel(): string {
    const c = this.config;
    const value = c.value ?? 0;
    const unit = (c.unit as string) || '';
    const label = (c.label as string) || '';
    const suffix = unit ? `${value}${unit}` : String(value);
    return label ? `Gauge: ${suffix}, ${label}` : `Gauge: ${suffix}`;
  }

  /** Sync aria-label and sr-only span with current config. */
  private updateA11y(): void {
    const label = this.buildA11yLabel();
    this.canvas.setAttribute('aria-label', label);
    this.canvas.textContent = label;
    if (this.srSpan) this.srSpan.textContent = label;
  }

  /** Redraw at full progress. */
  redraw(): void { this.updateA11y(); this.draw(1); }

  /** Animate from 0 to full with ease-in-out-cubic. */
  animate(): void {
    const duration = 1400;
    const start = performance.now();
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      this.draw(ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** Convert degrees to radians. */
  rad(deg: number): number { return deg * Math.PI / 180; }

  /** Draw the gauge at a given animation progress (0..1). */
  draw(progress: number): void {
    const state: GaugeDrawState = {
      ctx: this.ctx, cx: this.cx, cy: this.cy,
      radius: this.radius, size: this.size,
      config: this.config, palette: this.palette,
      density: this.density, rad: this.rad,
    };
    drawGauge(state, progress);
    drawComplications(state, progress);
  }
}
