/**
 * layout.ts — Lightweight 4-slot layout state machine.
 * CSP-safe: zero inline handlers. All listeners via addEventListener.
 *
 * Slots: #mn-slot-strip, #mn-slot-left, #mn-slot-center, #mn-slot-right
 * Grid: #mn-grid (CSS :has()-based column collapse in layouts-mn-layout.css)
 *
 * Slot independence: each toggle affects ONLY its slot.
 * showView() only touches slots declared in the view config.
 * Strip is exclusively controlled by toggleStrip() — showView never touches it.
 */

import { SlotState } from './layout-slot';
import type { SlotConfig } from './layout-slot';
export type { SlotConfig } from './layout-slot';

export interface LayoutViewConfig {
  label: string;
  fullpage?: boolean;
  buttonId?: string;
  left?: false | SlotConfig;
  right?: false | SlotConfig;
  strip?: false | SlotConfig;
  center?: (slot: HTMLElement) => void;
}

export interface LayoutState {
  view: string;
  fullpage: boolean;
  strip: boolean;
  left: boolean;
  right: boolean;
}

export interface LayoutPersistState {
  view: string;
  strip: boolean;
  left: boolean;
  right: boolean;
  leftPanelId?: string;
  rightPanelId?: string;
  stripPanelId?: string;
}

export interface LayoutOptions {
  onStateChange?: (state: LayoutPersistState) => void;
  initialState?: Partial<LayoutPersistState>;
}

export interface LayoutController {
  register(viewId: string, config: LayoutViewConfig): void;
  showView(viewId: string): void;
  toggleStrip(config?: SlotConfig): void;
  toggleLeft(config?: SlotConfig): void;
  toggleRight(config?: SlotConfig): void;
  openRight(config?: SlotConfig): void;
  closeRight(): void;
  wireButtons(): void;
  readonly state: Readonly<LayoutState>;
  destroy(): void;
}

function initVisible(domId: string, init: Partial<LayoutPersistState> | undefined, key: 'strip' | 'left' | 'right', fallback: boolean): boolean {
  if (init && typeof init[key] === 'boolean') return init[key];
  const el = document.getElementById(domId);
  return el ? !el.hidden : fallback;
}

export function createLayout(gridEl?: HTMLElement, options?: LayoutOptions): LayoutController {
  const maybeGrid = gridEl ?? document.getElementById('mn-grid');
  if (!maybeGrid) throw new Error('createLayout: grid element not found');
  const grid: HTMLElement = maybeGrid;

  const onChange = options && options.onStateChange;
  const init = options && options.initialState;

  const views = new Map<string, LayoutViewConfig>();
  const btnCleanups: Array<() => void> = [];

  const strip = new SlotState('mn-slot-strip', initVisible('mn-slot-strip', init, 'strip', true), init && init.stripPanelId);
  const left = new SlotState('mn-slot-left', initVisible('mn-slot-left', init, 'left', false), init && init.leftPanelId);
  const right = new SlotState('mn-slot-right', initVisible('mn-slot-right', init, 'right', false), init && init.rightPanelId);

  const state: LayoutState = {
    view: init && init.view ? init.view : '',
    fullpage: false,
    strip: strip.visible,
    left: left.visible,
    right: right.visible,
  };

  // Apply initial overrides to DOM
  if (init) { strip.sync(); left.sync(); right.sync(); }

  function syncState(): void {
    state.strip = strip.visible;
    state.left = left.visible;
    state.right = right.visible;
  }

  function persistState(): LayoutPersistState {
    const s: LayoutPersistState = { view: state.view, strip: state.strip, left: state.left, right: state.right };
    if (left.panelId) s.leftPanelId = left.panelId;
    if (right.panelId) s.rightPanelId = right.panelId;
    if (strip.panelId) s.stripPanelId = strip.panelId;
    return s;
  }

  function fireEvent(): void {
    grid.dispatchEvent(new CustomEvent('layout-changed', { detail: { ...state }, bubbles: true }));
    if (onChange) onChange(persistState());
  }

  function syncCenter(): void {
    const center = document.getElementById('mn-slot-center');
    if (center && state.view) {
      const children = center.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        if (child.dataset && 'view' in child.dataset) {
          child.hidden = child.dataset.view !== state.view;
        }
      }
    }
  }

  const ctrl: LayoutController = {
    register(viewId: string, config: LayoutViewConfig): void {
      views.set(viewId, config);
    },

    showView(viewId: string): void {
      const config = views.get(viewId);
      if (!config) throw new Error(`createLayout.showView: unknown view "${viewId}"`);

      // Fullpage transitions
      if (state.fullpage && !config.fullpage) {
        strip.restore(); left.restore(); right.restore();
        strip.sync();
      }
      if (!state.fullpage && config.fullpage) {
        strip.save(); left.save(); right.save();
      }

      state.view = viewId;

      if (config.fullpage) {
        state.fullpage = true;
        strip.visible = false; left.visible = false; right.visible = false;
        left.sync(); right.sync();
        const el = document.getElementById('mn-slot-strip');
        if (el) el.hidden = true;
        grid.classList.add('mn-layout--fullpage');
      } else {
        state.fullpage = false;
        grid.classList.remove('mn-layout--fullpage');
        left.applyConfig(config.left);
        right.applyConfig(config.right);
        // Strip is NEVER modified by showView
        left.sync(); right.sync();
      }

      syncState();
      syncCenter();
      fireEvent();

      if (config.center) {
        const center = document.getElementById('mn-slot-center');
        if (center) config.center(center);
      }
    },

    toggleStrip(config?: SlotConfig): void {
      if (state.fullpage) return;
      strip.toggle(config);
      syncState();
      fireEvent();
    },

    toggleLeft(config?: SlotConfig): void {
      if (state.fullpage || left.locked) return;
      left.toggle(config);
      syncState();
      fireEvent();
    },

    toggleRight(config?: SlotConfig): void {
      if (state.fullpage || right.locked) return;
      right.toggle(config);
      syncState();
      fireEvent();
    },

    openRight(config?: SlotConfig): void {
      if (state.fullpage || right.locked) return;
      right.open(config);
      syncState();
      fireEvent();
    },

    closeRight(): void {
      right.close();
      syncState();
      fireEvent();
    },

    wireButtons(): void {
      for (const [viewId, config] of views) {
        if (!config.buttonId) continue;
        const btn = document.getElementById(config.buttonId);
        if (!btn) continue;
        const handler = (): void => { ctrl.showView(viewId); };
        btn.addEventListener('click', handler);
        btnCleanups.push(() => btn.removeEventListener('click', handler));
      }
    },

    get state(): Readonly<LayoutState> {
      return Object.freeze({ ...state });
    },

    destroy(): void {
      for (const fn of btnCleanups) fn();
      btnCleanups.length = 0;
      views.clear();
    },
  };

  return ctrl;
}
