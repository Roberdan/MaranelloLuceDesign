/**
 * layout.ts — Lightweight 4-slot layout state machine.
 * CSP-safe: zero inline handlers. All listeners via addEventListener.
 *
 * Slots: #mn-slot-strip, #mn-slot-left, #mn-slot-center, #mn-slot-right
 * Grid: #mn-grid (CSS :has()-based column collapse in layouts-mn-layout.css)
 */

/** Slot routing config: boolean or object with content callback. */
export interface SlotConfig {
  panel?: string;
  content?: (slot: HTMLElement) => void;
}

export interface LayoutViewConfig {
  label: string;
  fullpage?: boolean;
  buttonId?: string;
  /** Slot routing — true: allow toggle, false: force closed, object: open + render content */
  left?: boolean | SlotConfig;
  right?: boolean | SlotConfig;
  strip?: boolean | SlotConfig;
  center?: (slot: HTMLElement) => void;
}

export interface LayoutState {
  view: string;
  fullpage: boolean;
  strip: boolean;
  left: boolean;
  right: boolean;
}

export interface LayoutController {
  register(viewId: string, config: LayoutViewConfig): void;
  showView(viewId: string): void;
  toggleStrip(): void;
  toggleLeft(): void;
  toggleRight(): void;
  openRight(): void;
  closeRight(): void;
  wireButtons(): void;
  readonly state: Readonly<LayoutState>;
  destroy(): void;
}

/** Create a layout controller bound to a grid element. */
export function createLayout(gridEl?: HTMLElement): LayoutController {
  const maybeGrid = gridEl ?? document.getElementById('mn-grid');
  if (!maybeGrid) {
    throw new Error('createLayout: grid element not found');
  }
  const grid: HTMLElement = maybeGrid;

  const views = new Map<string, LayoutViewConfig>();
  const buttonCleanups: Array<() => void> = [];

  // Read initial hidden state from DOM — no flash, no override
  const initStrip = document.getElementById('mn-slot-strip');
  const initLeft = document.getElementById('mn-slot-left');
  const initRight = document.getElementById('mn-slot-right');

  const state: LayoutState = {
    view: '',
    fullpage: false,
    strip: initStrip ? !initStrip.hidden : true,
    left: initLeft ? !initLeft.hidden : false,
    right: initRight ? !initRight.hidden : false,
  };

  let savedStrip = state.strip;

  // Slot lock: when a view config sets slot to false, manual toggles are blocked
  let stripLocked = false;
  let leftLocked = false;
  let rightLocked = false;

  /**
   * Sync DOM to match internal state. Uses document.getElementById
   * exclusively — querySelector('#id') is unreliable on Safari/WebKit.
   */
  function syncDOM(): void {
    const strip = document.getElementById('mn-slot-strip');
    const left = document.getElementById('mn-slot-left');
    const right = document.getElementById('mn-slot-right');
    const center = document.getElementById('mn-slot-center');

    if (strip) strip.hidden = !state.strip;
    if (left) left.hidden = !state.left;
    if (right) right.hidden = !state.right;

    if (state.fullpage) {
      grid.classList.add('mn-layout--fullpage');
    } else {
      grid.classList.remove('mn-layout--fullpage');
    }

    // Toggle view children inside center slot
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

  /** Resolve slot config to open/closed boolean. */
  function resolveSlot(cfg: boolean | SlotConfig | undefined, fallback: boolean): boolean {
    if (cfg === undefined) return fallback;
    if (typeof cfg === 'boolean') return cfg;
    return true; // object config = open
  }

  /** Call content callback if slot config has one. */
  function renderSlot(cfg: boolean | SlotConfig | undefined, slotId: string): void {
    if (typeof cfg === 'object' && cfg !== null && cfg.content) {
      const el = document.getElementById(slotId);
      if (el) cfg.content(el);
    }
  }

  function fireEvent(): void {
    grid.dispatchEvent(
      new CustomEvent('layout-changed', {
        detail: { ...state },
        bubbles: true,
      }),
    );
  }

  function applyState(): void {
    syncDOM();
    fireEvent();
  }

  const controller: LayoutController = {
    register(viewId: string, config: LayoutViewConfig): void {
      views.set(viewId, config);
    },

    showView(viewId: string): void {
      const config = views.get(viewId);
      if (!config) {
        throw new Error(`createLayout.showView: unknown view "${viewId}"`);
      }

      // Exiting fullpage? Restore saved strip state
      if (state.fullpage && !config.fullpage) {
        state.strip = savedStrip;
      }

      // Entering fullpage? Save current strip state
      if (!state.fullpage && config.fullpage) {
        savedStrip = state.strip;
      }

      state.view = viewId;

      if (config.fullpage) {
        state.fullpage = true;
        state.strip = false;
        state.left = false;
        state.right = false;
        stripLocked = true;
        leftLocked = true;
        rightLocked = true;
      } else {
        state.fullpage = false;

        // Apply slot routing from view config
        state.strip = resolveSlot(config.strip, state.strip);
        state.left = resolveSlot(config.left, state.left);
        state.right = resolveSlot(config.right, false);

        // Lock slots set to false — manual toggles blocked
        stripLocked = config.strip === false;
        leftLocked = config.left === false;
        rightLocked = config.right === false;
      }

      applyState();

      // Render slot content callbacks
      renderSlot(config.left, 'mn-slot-left');
      renderSlot(config.right, 'mn-slot-right');
      renderSlot(config.strip, 'mn-slot-strip');

      if (config.center) {
        const center = document.getElementById('mn-slot-center');
        if (center) config.center(center);
      }
    },

    toggleStrip(): void {
      if (state.fullpage || stripLocked) return;
      state.strip = !state.strip;
      applyState();
    },

    toggleLeft(): void {
      if (state.fullpage || leftLocked) return;
      state.left = !state.left;
      applyState();
    },

    toggleRight(): void {
      if (state.fullpage || rightLocked) return;
      state.right = !state.right;
      applyState();
    },

    openRight(): void {
      if (state.fullpage || rightLocked) return;
      state.right = true;
      applyState();
    },

    closeRight(): void {
      state.right = false;
      applyState();
    },

    wireButtons(): void {
      for (const [viewId, config] of views) {
        if (!config.buttonId) continue;
        const btn = document.getElementById(config.buttonId);
        if (!btn) continue;

        const handler = (): void => {
          controller.showView(viewId);
        };
        btn.addEventListener('click', handler);
        buttonCleanups.push(() => btn.removeEventListener('click', handler));
      }
    },

    get state(): Readonly<LayoutState> {
      return state;
    },

    destroy(): void {
      for (const cleanup of buttonCleanups) cleanup();
      buttonCleanups.length = 0;
      views.clear();
    },
  };

  return controller;
}
