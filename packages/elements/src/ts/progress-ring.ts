/**
 * Maranello Luce Design - Progress ring (SVG-based)
 */
import type { ProgressRingOptions } from './core/types';
import { cssVar } from './core/utils';
import { isValidColor } from './core/sanitize';

interface ProgressRingController {
  setValue: (newVal: number) => void;
}

/** Render an animated SVG progress ring inside a container. */
export function progressRing(
  container: HTMLElement,
  opts?: ProgressRingOptions,
): ProgressRingController {
  const o = {
    value: 0,
    max: 100,
    size: 80,
    thickness: 6,
    color: cssVar('--mn-accent'),
    trackColor: 'rgba(200,200,200,0.08)',
    animate: true,
    ...opts,
  };

  const safeColor = isValidColor(o.color) ? o.color : 'var(--mn-accent)';
  const radius = (o.size - o.thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, o.value / o.max));
  const offset = circumference * (1 - pct);
  const half = o.size / 2;

  container.innerHTML =
    `<svg width="${o.size}" height="${o.size}" viewBox="0 0 ${o.size} ${o.size}">` +
    `<circle class="mn-progress-ring__track" cx="${half}" cy="${half}" r="${radius}" ` +
    `stroke-width="${o.thickness}"/>` +
    `<circle class="mn-progress-ring__fill" cx="${half}" cy="${half}" r="${radius}" ` +
    `stroke-width="${o.thickness}" stroke="${safeColor}" ` +
    `stroke-dasharray="${circumference}" ` +
    `stroke-dashoffset="${o.animate ? circumference : offset}"/>` +
    '</svg>';

  if (o.animate) {
    requestAnimationFrame(() => {
      const fill = container.querySelector('.mn-progress-ring__fill') as SVGElement | null;
      if (fill) fill.style.strokeDashoffset = String(offset);
    });
  }

  return {
    setValue(newVal: number): void {
      const newPct = Math.max(0, Math.min(1, newVal / o.max));
      const fill = container.querySelector('.mn-progress-ring__fill') as SVGElement | null;
      if (fill) fill.style.strokeDashoffset = String(circumference * (1 - newPct));
    },
  };
}
