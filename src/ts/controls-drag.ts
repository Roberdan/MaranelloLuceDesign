/** Maranello Luce Design - Drag interaction controls (rotary knob + slider) */

import type { RotaryOptions, RotaryController, SliderOptions, SliderController } from './core/types';
import { eventBus } from './core/events';
import { clamp } from './core/utils';

/** Initialize a rotary knob with drag, click, and keyboard support. */
export function initRotary(el: HTMLElement, options?: RotaryOptions): RotaryController {
  const opts: Required<Pick<RotaryOptions, 'steps' | 'initial' | 'snap'>> & RotaryOptions = {
    steps: ['WET', 'COMFORT', 'SPORT', 'RACE', 'ESC OFF'],
    initial: 2,
    snap: true,
    ...options,
  };

  const housing = el.querySelector<HTMLElement>('.mn-rotary__housing');
  const pointer = el.querySelector<HTMLElement>('.mn-rotary__pointer');
  const valueEl = el.querySelector<HTMLElement>('.mn-rotary__value');

  if (!housing || !pointer) throw new Error('Rotary: missing .mn-rotary__housing or __pointer');
  let current = opts.initial!;
  const totalSteps = opts.steps!.length;
  const angleRange = 240, startAngle = -120;

  function setStep(idx: number): void {
    idx = clamp(idx, 0, totalSteps - 1);
    current = idx;
    const angle = startAngle + (idx / (totalSteps - 1)) * angleRange;
    pointer!.style.transform = `rotate(${angle}deg)`;
    if (valueEl) valueEl.textContent = opts.steps![idx];
    opts.onChange?.(opts.steps![idx], idx);
  }

  setStep(current);
  let dragging = false, centerX = 0, centerY = 0;

  function getCenter(): void {
    const rect = housing!.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
  }

  function getClientPoint(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if ('touches' in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function angleFromEvent(e: MouseEvent | TouchEvent): number {
    const point = getClientPoint(e);
    return Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI) + 90;
  }

  function stepFromAngle(deg: number): number {
    const norm = ((deg - startAngle) % 360 + 360) % 360;
    const idx = Math.round((norm / angleRange) * (totalSteps - 1));
    return clamp(idx, 0, totalSteps - 1);
  }

  function onStart(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    dragging = true;
    getCenter();
    housing!.style.cursor = 'grabbing';
  }

  function onMove(e: MouseEvent | TouchEvent): void {
    if (!dragging) return;
    const deg = angleFromEvent(e);
    if (opts.snap) setStep(stepFromAngle(deg));
    else pointer!.style.transform = `rotate(${deg - 90}deg)`;
  }

  function onEnd(): void {
    dragging = false;
    housing!.style.cursor = 'pointer';
  }

  housing.addEventListener('mousedown', onStart);
  housing.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);

  housing.addEventListener('click', () => { if (!dragging) setStep((current + 1) % totalSteps); });
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'slider');
  el.setAttribute('aria-valuemin', '0');
  el.setAttribute('aria-valuemax', String(totalSteps - 1));
  el.setAttribute('aria-valuenow', String(current));
  el.setAttribute('aria-valuetext', opts.steps![current]);

  el.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setStep(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setStep(current - 1);
    }
    el.setAttribute('aria-valuenow', String(current));
    el.setAttribute('aria-valuetext', opts.steps![current]);
  });

  return {
    setStep,
    getValue: () => opts.steps![current],
    destroy: () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchend', onEnd);
    },
  };
}

/** Initialize a slider with drag, touch, and keyboard support. */
export function initSlider(el: HTMLElement, options?: SliderOptions): SliderController {
  const opts = {
    min: 0, max: 100, value: 50, step: 1,
    onChange: undefined as ((v: number) => void) | undefined,
    label: null as string | null,
    unit: '',
    ...options,
  };

  const track = el.querySelector<HTMLElement>('.mn-slider__track') ?? el;
  let fill = el.querySelector<HTMLElement>('.mn-slider__fill');
  let thumb = el.querySelector<HTMLElement>('.mn-slider__thumb');
  const valueEl = el.querySelector<HTMLElement>('.mn-slider__value');

  if (!fill) {
    fill = document.createElement('div');
    fill.className = 'mn-slider__fill';
    track.appendChild(fill);
  }
  if (!thumb) {
    thumb = document.createElement('div');
    thumb.className = 'mn-slider__thumb';
    track.appendChild(thumb);
  }

  const fillEl = fill, thumbEl = thumb;
  let current = opts.value, dragging = false;
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'slider');
  el.setAttribute('aria-valuemin', String(opts.min));
  el.setAttribute('aria-valuemax', String(opts.max));
  el.setAttribute('aria-valuenow', String(current));
  if (opts.label) el.setAttribute('aria-label', opts.label);

  function pctFromValue(v: number): number {
    return ((v - opts.min) / (opts.max - opts.min)) * 100;
  }

  function valueFromPct(pct: number): number {
    const raw = opts.min + (pct / 100) * (opts.max - opts.min);
    return Math.round(raw / opts.step) * opts.step;
  }

  function render(): void {
    const pct = pctFromValue(current);
    fillEl.style.width = `${pct}%`;
    thumbEl.style.left = `${pct}%`;
    if (valueEl) valueEl.textContent = String(current);
    el.setAttribute('aria-valuenow', String(current));
    if (opts.label) el.setAttribute('aria-valuetext', `${current}${opts.unit}`);
  }

  function getPointerX(e: MouseEvent | TouchEvent): number {
    if ('touches' in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return touch.clientX;
    }
    return e.clientX;
  }

  function setFromX(clientX: number): void {
    const rect = track.getBoundingClientRect();
    const pct = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const newVal = valueFromPct(pct);
    if (newVal !== current) {
      current = newVal;
      render();
      opts.onChange?.(current);
      eventBus.emit('slider-change', { element: el, value: current });
    }
  }

  function onStart(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    dragging = true;
    el.classList.add('mn-slider--active');
    setFromX(getPointerX(e));
  }

  function onMove(e: MouseEvent | TouchEvent): void {
    if (!dragging) return;
    setFromX(getPointerX(e));
  }

  function onEnd(): void {
    dragging = false;
    el.classList.remove('mn-slider--active');
  }

  track.addEventListener('mousedown', onStart);
  track.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);

  el.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      current = Math.min(opts.max, current + opts.step);
      render();
      opts.onChange?.(current);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      current = Math.max(opts.min, current - opts.step);
      render();
      opts.onChange?.(current);
    }
  });

  render();

  return {
    getValue: () => current,
    setValue: (v: number) => {
      current = clamp(v, opts.min, opts.max);
      render();
    },
  };
}
