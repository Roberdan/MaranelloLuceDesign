/**
 * Maranello Luce Design - Ferrari-style controls
 * Manettino rotary dial, toggle lever, cruise lever, stepped dial.
 */

import type {
  ManettinoOptions,
  FerrariToggleOptions,
  CruiseLeverOptions,
  SteppedDialOptions,
  IndexedControlController,
  BooleanControlController,
} from './core/types';
import { clamp, createElement } from './core/utils';
import { eventBus } from './core/events';

/** Inject ferrari control styles once. */
function ensureStyles(): void {
  const STYLE_ID = 'mn-ctrl-ferrari-css';
  if (document.getElementById(STYLE_ID)) return;
  const sheet = document.createElement('style');
  sheet.id = STYLE_ID;
  sheet.textContent = [
    '.mn-ctrl-label{font-family:var(--font-body,sans-serif);font-size:var(--text-micro,.65rem);color:var(--grigio-chiaro,#aaa);text-transform:uppercase;letter-spacing:.08em;margin-bottom:var(--space-xs,4px);display:block;text-align:center}',
    '.mn-ctrl-lever{display:inline-flex;flex-direction:column;align-items:center;user-select:none}',
    '.mn-ctrl-lever__body{display:flex;align-items:stretch;gap:var(--space-sm,8px);height:120px;position:relative}',
    '.mn-ctrl-lever__track{width:14px;border-radius:7px;background:linear-gradient(180deg,var(--nero-soft,#1a1a1a),var(--nero-assoluto,#000));box-shadow:inset 0 1px 3px rgba(0,0,0,.6);position:relative;cursor:pointer}',
    '.mn-ctrl-lever__knob{position:absolute;left:50%;width:30px;height:18px;border-radius:4px;background:linear-gradient(180deg,var(--grigio-chiaro,#bbb),var(--grigio-scuro,#555));box-shadow:0 2px 4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);transform:translate(-50%,-50%);cursor:pointer;transition:top var(--duration-sm,.15s) var(--ease-out,ease-out)}',
    '.mn-ctrl-lever__positions{display:flex;flex-direction:column;justify-content:space-between;height:100%}',
    '.mn-ctrl-lever__pos{font-family:var(--font-body,sans-serif);font-size:var(--text-nano,.55rem);color:var(--grigio-medio,#777);text-transform:uppercase;letter-spacing:.06em;cursor:pointer;transition:color var(--duration-sm,.15s)}',
    '.mn-ctrl-lever__pos--active{color:var(--giallo-ferrari,#FFC72C);font-weight:700}',
    '.mn-ctrl-toggle{display:inline-flex;flex-direction:column;align-items:center;user-select:none}',
    '.mn-ctrl-toggle__body{position:relative;width:52px;height:28px;border-radius:14px;background:linear-gradient(180deg,var(--nero-assoluto,#000),var(--nero-soft,#1a1a1a));box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.05);cursor:pointer}',
    '.mn-ctrl-toggle__lever{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--grigio-chiaro,#bbb),var(--grigio-scuro,#555));box-shadow:0 2px 4px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.35);transition:left var(--duration-sm,.15s) var(--ease-out,ease-out)}',
    '.mn-ctrl-toggle--on .mn-ctrl-toggle__lever{left:27px}',
    '.mn-ctrl-toggle--on .mn-ctrl-toggle__body{box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 0 8px rgba(255,199,44,.25)}',
    '.mn-ctrl-toggle__indicator{position:absolute;top:50%;right:8px;width:5px;height:5px;border-radius:50%;background:var(--grigio-scuro,#444);transform:translateY(-50%);transition:background var(--duration-sm,.15s),box-shadow var(--duration-sm,.15s)}',
    '.mn-ctrl-toggle--on .mn-ctrl-toggle__indicator{background:var(--giallo-ferrari,#FFC72C);box-shadow:0 0 4px var(--giallo-ferrari,#FFC72C)}',
  ].join('\n');
  document.head.appendChild(sheet);
}

function addLabel(root: HTMLElement, text: string | undefined): void {
  if (!text) return;
  const lbl = createElement('span', 'mn-ctrl-label');
  lbl.textContent = text;
  root.appendChild(lbl);
}

/** Create a cruise lever control. */
export function cruiseLever(
  container: HTMLElement,
  opts?: CruiseLeverOptions,
): IndexedControlController {
  ensureStyles();
  const positions = opts?.positions ?? ['OFF', 'SET', 'RES'];
  let current = clamp(opts?.initial ?? 0, 0, positions.length - 1);
  const onChange = opts?.onChange ?? null;
  const total = positions.length;
  const root = createElement('div', 'mn-ctrl-lever');
  addLabel(root, opts?.label);

  const body = createElement('div', 'mn-ctrl-lever__body');
  const posBox = createElement('div', 'mn-ctrl-lever__positions');
  const posEls = positions.map((p, i) => {
    const pe = createElement('span', 'mn-ctrl-lever__pos');
    pe.textContent = p;
    pe.dataset.index = String(i);
    posBox.appendChild(pe);
    return pe;
  });
  const track = createElement('div', 'mn-ctrl-lever__track');
  const knob = createElement('div', 'mn-ctrl-lever__knob');
  track.appendChild(knob);
  body.appendChild(posBox);
  body.appendChild(track);
  root.appendChild(body);
  container.appendChild(root);

  function setPos(idx: number): void {
    current = clamp(idx, 0, total - 1);
    knob.style.top = ((1 - current / (total - 1)) * 100) + '%';
    posEls.forEach((pe, i) =>
      pe.classList.toggle('mn-ctrl-lever__pos--active', i === current),
    );
    root.setAttribute('aria-valuenow', String(current));
    root.setAttribute('aria-valuetext', positions[current]);
    if (onChange) onChange(current, positions[current]);
  }

  /* ARIA slider + keyboard */
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'slider');
  root.setAttribute('aria-label', opts?.label ?? 'Cruise lever');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', String(total - 1));
  root.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': case 'ArrowRight': e.preventDefault(); setPos(current + 1); break;
      case 'ArrowDown': case 'ArrowLeft': e.preventDefault(); setPos(current - 1); break;
      case 'Home': e.preventDefault(); setPos(0); break;
      case 'End': e.preventDefault(); setPos(total - 1); break;
    }
  });
  setPos(current);
  posEls.forEach((pe) =>
    pe.addEventListener('click', () => setPos(Number(pe.dataset.index))),
  );
  track.addEventListener('click', (e: MouseEvent) => {
    const rect = track.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setPos(Math.round((1 - y / rect.height) * (total - 1)));
  });

  return {
    getValue: () => current,
    setValue: setPos,
    destroy: () => root.remove(),
  };
}

/** Create a toggle lever (on/off switch). */
export function toggleLever(
  container: HTMLElement,
  opts?: FerrariToggleOptions,
): BooleanControlController {
  ensureStyles();
  let on = opts?.initial ?? false;
  const onChange = opts?.onChange ?? null;
  const root = createElement('div', 'mn-ctrl-toggle');
  if (on) root.classList.add('mn-ctrl-toggle--on');
  addLabel(root, opts?.label);

  const body = createElement('div', 'mn-ctrl-toggle__body');
  body.appendChild(createElement('div', 'mn-ctrl-toggle__lever'));
  body.appendChild(createElement('div', 'mn-ctrl-toggle__indicator'));
  root.appendChild(body);
  container.appendChild(root);
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'switch');
  root.setAttribute('aria-label', opts?.label ?? 'Toggle');
  root.setAttribute('aria-checked', String(on));

  function toggle(): void {
    on = !on;
    root.classList.toggle('mn-ctrl-toggle--on', on);
    root.setAttribute('aria-checked', String(on));
    if (onChange) onChange(on);
    eventBus.emit('toggle-change', { on });
  }
  body.addEventListener('click', toggle);
  root.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') { toggle(); e.preventDefault(); }
  });

  return {
    getValue: () => on,
    setValue: (v: boolean) => { if (!!v !== on) toggle(); },
    destroy: () => { container.removeChild(root); },
  };
}
