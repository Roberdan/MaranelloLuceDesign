/**
 * Maranello Luce Design - Ferrari dial controls
 * Manettino rotary switch and stepped rotary dial.
 */

import type {
  ManettinoOptions,
  SteppedDialOptions,
  IndexedControlController,
} from './core/types';
import { clamp, createElement } from './core/utils';
import { eventBus } from './core/events';

const MANETTINO_STYLE_ID = 'mn-ctrl-manettino-css';
const STEPPED_STYLE_ID = 'mn-ctrl-stepped-css';

function ensureManettinoStyles(): void {
  if (document.getElementById(MANETTINO_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = MANETTINO_STYLE_ID;
  s.textContent = [
    '.mn-ctrl-manettino{display:inline-flex;flex-direction:column;align-items:center;user-select:none}',
    '.mn-ctrl-manettino__dial{position:relative;width:160px;height:160px}',
    '.mn-ctrl-manettino__knob{position:absolute;top:50%;left:50%;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 40% 35%,var(--mn-ctrl-manettino-tint)),var(--mn-surface-raised));box-shadow:0 3px 8px rgba(0,0,0,.55),inset 0 1px 1px rgba(255,255,255,.2);transform:translate(-50%,-50%);cursor:grab;transition:box-shadow var(--duration-sm,.15s)}',
    '.mn-ctrl-manettino__knob:active{cursor:grabbing;box-shadow:0 1px 4px rgba(0,0,0,.7),inset 0 1px 1px rgba(255,255,255,.15)}',
    '.mn-ctrl-manettino__pointer{position:absolute;top:6px;left:50%;width:2px;height:18px;background:var(--mn-text);border-radius:1px;transform:translateX(-50%);pointer-events:none}',
    '.mn-ctrl-manettino__ring{position:absolute;top:50%;left:50%;width:80px;height:80px;border-radius:50%;border:2px solid var(--mn-border);transform:translate(-50%,-50%);pointer-events:none}',
    '.mn-ctrl-manettino__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--mn-text-muted);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);white-space:nowrap;transition:color var(--duration-sm,.15s)}',
    '.mn-ctrl-manettino__pos--active{color:var(--mn-text);font-weight:700}',
  ].join('\n');
  document.head.appendChild(s);
}

function ensureSteppedStyles(): void {
  if (document.getElementById(STEPPED_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STEPPED_STYLE_ID;
  s.textContent = [
    '.mn-ctrl-stepped{display:inline-flex;flex-direction:column;align-items:center;user-select:none}',
    '.mn-ctrl-stepped__dial{position:relative;width:100px;height:100px}',
    '.mn-ctrl-stepped__knob{position:absolute;top:50%;left:50%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 35%,var(--mn-border),var(--mn-surface-raised));box-shadow:0 2px 6px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.15);transform:translate(-50%,-50%);cursor:grab;transition:box-shadow var(--duration-sm,.15s)}',
    '.mn-ctrl-stepped__knob:active{cursor:grabbing}',
    '.mn-ctrl-stepped__pointer{position:absolute;top:4px;left:50%;width:2px;height:12px;background:var(--mn-text);border-radius:1px;transform:translateX(-50%);pointer-events:none}',
    '.mn-ctrl-stepped__tick{position:absolute;width:2px;height:8px;border-radius:1px;background:var(--mn-border);pointer-events:none;transition:background var(--duration-sm,.15s)}',
    '.mn-ctrl-stepped__tick--active{background:var(--mn-accent)}',
    '.mn-ctrl-stepped__pos{position:absolute;font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--mn-text-muted);text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transform:translate(-50%,-50%);transition:color var(--duration-sm,.15s)}',
    '.mn-ctrl-stepped__pos--active{color:var(--mn-accent);font-weight:700}',
  ].join('\n');
  document.head.appendChild(s);
}

function addLabel(root: HTMLElement, text: string | undefined): void {
  if (!text) return;
  const lbl = createElement('span', 'mn-ctrl-label');
  lbl.textContent = text;
  root.appendChild(lbl);
}

function setupDragRotary(
  knobEl: HTMLElement,
  dial: HTMLElement,
  root: HTMLElement,
  arcDeg: number,
  startDeg: number,
  total: number,
  setFn: (idx: number) => void,
  currentFn: () => number,
): () => void {
  let dragging = false;
  function dStart(e: MouseEvent | TouchEvent): void { dragging = true; e.preventDefault(); }
  function dMove(e: MouseEvent | TouchEvent): void {
    if (!dragging) return;
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    let deg = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    if (deg < startDeg) deg += 360;
    setFn(clamp(Math.round(((deg - startDeg) / arcDeg) * (total - 1)), 0, total - 1));
  }
  function dEnd(): void { dragging = false; }
  knobEl.addEventListener('mousedown', dStart);
  knobEl.addEventListener('touchstart', dStart, { passive: false });
  document.addEventListener('mousemove', dMove);
  document.addEventListener('touchmove', dMove, { passive: true });
  document.addEventListener('mouseup', dEnd);
  document.addEventListener('touchend', dEnd);
  root.addEventListener('keydown', (e: KeyboardEvent) => {
    const cur = currentFn();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { setFn(cur - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { setFn(cur + 1); e.preventDefault(); }
  });
  return () => {
    document.removeEventListener('mousemove', dMove);
    document.removeEventListener('touchmove', dMove);
    document.removeEventListener('mouseup', dEnd);
    document.removeEventListener('touchend', dEnd);
  };
}

/** Create a manettino rotary dial control. */
export function manettino(
  container: HTMLElement,
  opts?: ManettinoOptions,
): IndexedControlController {
  ensureManettinoStyles();
  const positions = opts?.positions ?? ['WET', 'COMFORT', 'SPORT', 'RACE', 'ESC OFF'];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const ARC = 240, START = -120;
  const angleFor = (i: number) => START + (total > 1 ? (i / (total - 1)) * ARC : 0);

  const root = createElement('div', 'mn-ctrl-manettino');
  if (opts?.tint) root.style.setProperty('--mn-ctrl-manettino-tint', opts.tint);
  addLabel(root, opts?.label);
  const dial = createElement('div', 'mn-ctrl-manettino__dial');
  dial.appendChild(createElement('div', 'mn-ctrl-manettino__ring'));
  const knobEl = createElement('div', 'mn-ctrl-manettino__knob');
  knobEl.appendChild(createElement('div', 'mn-ctrl-manettino__pointer'));
  dial.appendChild(knobEl);

  const LABEL_R = 70;
  const posEls = positions.map((p, i) => {
    const rad = ((angleFor(i) - 90) * Math.PI) / 180;
    const pe = createElement('span', 'mn-ctrl-manettino__pos');
    pe.textContent = p;
    pe.dataset.index = String(i);
    pe.style.left = 80 + Math.cos(rad) * LABEL_R + 'px';
    pe.style.top = 80 + Math.sin(rad) * LABEL_R + 'px';
    dial.appendChild(pe);
    return pe;
  });
  root.appendChild(dial);
  container.appendChild(root);
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'slider');
  root.setAttribute('aria-label', opts?.label ?? 'Manettino');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', String(total - 1));

  function refresh(): void {
    knobEl.style.transform = `translate(-50%,-50%) rotate(${angleFor(current)}deg)`;
    root.setAttribute('aria-valuenow', String(current));
    root.setAttribute('aria-valuetext', positions[current]);
    posEls.forEach((el, i) => el.classList.toggle('mn-ctrl-manettino__pos--active', i === current));
  }
  function set(idx: number): void {
    const next = clamp(idx, 0, total - 1);
    if (next === current) return;
    current = next;
    refresh();
    if (onChange) onChange(current, positions[current]);
    eventBus.emit('manettino-change', { index: current, label: positions[current] });
  }
  refresh();
  dial.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (target?.dataset.index != null) set(Number(target.dataset.index));
  });

  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START, total, set, () => current);
  return {
    getValue: () => current,
    setValue: (idx: number) => set(idx),
    destroy: () => { cleanup(); container.removeChild(root); },
  };
}

/** Create a stepped rotary dial control. */
export function steppedRotary(
  container: HTMLElement,
  opts?: SteppedDialOptions,
): IndexedControlController {
  ensureSteppedStyles();
  const positions = opts?.positions ?? ['0', '1', '2', 'A'];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const ARC = 180, START = -90;
  const angleFor = (i: number) => START + (total > 1 ? (i / (total - 1)) * ARC : 0);

  const root = createElement('div', 'mn-ctrl-stepped');
  addLabel(root, opts?.label);
  const dial = createElement('div', 'mn-ctrl-stepped__dial');
  const TICK_R = 30, LABEL_R = 44;
  const tickEls: HTMLDivElement[] = [];
  positions.forEach((_, i) => {
    const rad = ((angleFor(i) - 90) * Math.PI) / 180;
    const tick = createElement('div', 'mn-ctrl-stepped__tick');
    tick.style.left = 50 + Math.cos(rad) * TICK_R + 'px';
    tick.style.top = 50 + Math.sin(rad) * TICK_R + 'px';
    tick.style.transform = `translate(-50%,-50%) rotate(${angleFor(i)}deg)`;
    dial.appendChild(tick);
    tickEls.push(tick);
  });
  const knobEl = createElement('div', 'mn-ctrl-stepped__knob');
  knobEl.appendChild(createElement('div', 'mn-ctrl-stepped__pointer'));
  dial.appendChild(knobEl);
  const posEls = positions.map((p, i) => {
    const rad = ((angleFor(i) - 90) * Math.PI) / 180;
    const pe = createElement('span', 'mn-ctrl-stepped__pos');
    pe.textContent = p;
    pe.dataset.index = String(i);
    pe.style.left = 50 + Math.cos(rad) * LABEL_R + 'px';
    pe.style.top = 50 + Math.sin(rad) * LABEL_R + 'px';
    dial.appendChild(pe);
    return pe;
  });
  root.appendChild(dial);
  container.appendChild(root);
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'slider');
  root.setAttribute('aria-label', opts?.label ?? 'Stepped rotary');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', String(total - 1));

  function refresh(): void {
    knobEl.style.transform = `translate(-50%,-50%) rotate(${angleFor(current)}deg)`;
    root.setAttribute('aria-valuenow', String(current));
    root.setAttribute('aria-valuetext', positions[current]);
    posEls.forEach((el, i) => el.classList.toggle('mn-ctrl-stepped__pos--active', i === current));
    tickEls.forEach((t, i) => t.classList.toggle('mn-ctrl-stepped__tick--active', i === current));
  }
  function set(idx: number): void {
    const next = clamp(idx, 0, total - 1);
    if (next === current) return;
    current = next;
    refresh();
    if (onChange) onChange(current, positions[current]);
    eventBus.emit('stepped-change', { index: current, label: positions[current] });
  }
  refresh();
  dial.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (target?.dataset.index != null) set(Number(target.dataset.index));
  });

  const cleanup = setupDragRotary(knobEl, dial, root, ARC, START, total, set, () => current);
  return {
    getValue: () => current,
    setValue: (idx: number) => set(idx),
    destroy: () => { cleanup(); container.removeChild(root); },
  };
}
