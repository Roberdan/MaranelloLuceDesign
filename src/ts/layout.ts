/**
 * layout.ts — Lightweight 4-slot layout state machine.
 * CSP-safe: zero inline handlers. All listeners via addEventListener.
 *
 * Slots: #mn-slot-strip, #mn-slot-left, #mn-slot-center, #mn-slot-right
 * Grid: #mn-grid (CSS :has()-based column collapse in layouts-mn-layout.css)
 *
 * Slot independence: each toggle affects ONLY its slot.
 * showView() only touches slots declared in the view config.
 * Manual toggles persist across view switches unless overridden by config.
 */

/** Slot routing config: object with optional render callback. */
export interface SlotConfig {
  id?: string;
  render?: (slot: HTMLElement) => void;
}

export interface LayoutViewConfig {
  label: string;
  fullpage?: boolean;
  buttonId?: string;
  /** Slot routing — undefined: don't touch, false: force closed, object: open + render */
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

  // Track whether each slot was opened by a view config (view-driven)
  // or by manual toggle. View-driven slots close on view switch;
  // manual toggles persist.
  let leftViewDriven = false;
  let rightViewDriven = false;
  let stripViewDriven = false;

  // Manual toggle render callbacks — persisted so content survives view switches
  let leftManualRender: ((slot: HTMLElement) => void) | null = null;
  let rightManualRender: ((slot: HTMLElement) => void) | null = null;
  let stripManualRender: ((slot: HTMLElement) => void) | null = null;

  // Fullpage saves/restores
  let savedStrip = state.strip;
  let savedLeft = state.left;
  let savedRight = state.right;

  /**
   * Apply hidden to a single slot. Only writes if the value differs
   * from the current DOM — prevents side effects on unrelated slots.
   */
  function setSlotHidden(slotId: string, hidden: boolean): void {
    const el = document.getElementById(slotId);
    if (el && el.hidden !== hidden) el.hidden = hidden;
  }

  /**
   * Sync left, right, fullpage, and center views to DOM.
   * Strip is NEVER written here — only toggleStrip() and fullpage control strip.
   */
  function syncDOM(): void {
    setSlotHidden('mn-slot-left', !state.left);
    setSlotHidden('mn-slot-right', !state.right);

    if (state.fullpage) {
      grid.classList.add('mn-layout--fullpage');
      // Fullpage hides everything including strip
      setSlotHidden('mn-slot-strip', true);
    } else {
      grid.classList.remove('mn-layout--fullpage');
    }

    // Toggle view children inside center slot
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

  /** Call a render callback on a slot element. */
  function renderToSlot(slotId: string, render: (el: HTMLElement) => void): void {
    const el = document.getElementById(slotId);
    if (el) render(el);
  }

  /** Apply a slot config from showView: false = close, object = open + render. */
  function applySlotConfig(
    cfg: false | SlotConfig | undefined,
    slotId: string,
    setOpen: (v: boolean) => void,
    setViewDriven: (v: boolean) => void,
    wasViewDriven: boolean,
  ): void {
    if (cfg === undefined) {
      // Config doesn't mention this slot — close if previous view owned it
      if (wasViewDriven) {
        setOpen(false);
        setViewDriven(false);
      }
      // Manual toggle state persists unchanged
      return;
    }
    if (cfg === false) {
      setOpen(false);
      setViewDriven(false);
      return;
    }
    // Object config — open and render
    setOpen(true);
    setViewDriven(true);
    if (cfg.render) renderToSlot(slotId, cfg.render);
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

      // Fullpage transitions
      if (state.fullpage && !config.fullpage) {
        state.strip = savedStrip;
        state.left = savedLeft;
        state.right = savedRight;
        // Restore strip DOM since syncDOM doesn't write it
        setSlotHidden('mn-slot-strip', !state.strip);
      }
      if (!state.fullpage && config.fullpage) {
        savedStrip = state.strip;
        savedLeft = state.left;
        savedRight = state.right;
      }

      state.view = viewId;

      if (config.fullpage) {
        state.fullpage = true;
        state.strip = false;
        state.left = false;
        state.right = false;
      } else {
        state.fullpage = false;

        // Apply left/right independently — only declared slots change
        // Strip is NEVER modified by showView — only toggleStrip() controls it
        applySlotConfig(
          config.left, 'mn-slot-left',
          (v) => { state.left = v; },
          (v) => { leftViewDriven = v; },
          leftViewDriven,
        );
        applySlotConfig(
          config.right, 'mn-slot-right',
          (v) => { state.right = v; },
          (v) => { rightViewDriven = v; },
          rightViewDriven,
        );
      }

      applyState();

      // Render center content
      if (config.center) {
        renderToSlot('mn-slot-center', config.center);
      }
    },

    // Independent toggles — each writes ONLY its own slot, never others
    toggleStrip(config?: SlotConfig): void {
      if (state.fullpage) return;
      state.strip = !state.strip;
      stripViewDriven = false;
      if (config && config.render) stripManualRender = config.render;
      setSlotHidden('mn-slot-strip', !state.strip);
      fireEvent();
      if (state.strip) {
        const render = (config && config.render) || stripManualRender;
        if (render) renderToSlot('mn-slot-strip', render);
      }
    },

    toggleLeft(config?: SlotConfig): void {
      if (state.fullpage) return;
      state.left = !state.left;
      leftViewDriven = false;
      if (config && config.render) leftManualRender = config.render;
      setSlotHidden('mn-slot-left', !state.left);
      fireEvent();
      if (state.left) {
        const render = (config && config.render) || leftManualRender;
        if (render) renderToSlot('mn-slot-left', render);
      }
    },

    toggleRight(config?: SlotConfig): void {
      if (state.fullpage) return;
      state.right = !state.right;
      rightViewDriven = false;
      if (config && config.render) rightManualRender = config.render;
      setSlotHidden('mn-slot-right', !state.right);
      fireEvent();
      if (state.right) {
        const render = (config && config.render) || rightManualRender;
        if (render) renderToSlot('mn-slot-right', render);
      }
    },

    openRight(config?: SlotConfig): void {
      if (state.fullpage) return;
      state.right = true;
      rightViewDriven = false;
      if (config && config.render) rightManualRender = config.render;
      setSlotHidden('mn-slot-right', !state.right);
      fireEvent();
      const render = (config && config.render) || rightManualRender;
      if (render) renderToSlot('mn-slot-right', render);
    },

    closeRight(): void {
      state.right = false;
      rightViewDriven = false;
      setSlotHidden('mn-slot-right', !state.right);
      fireEvent();
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
      leftManualRender = null;
      rightManualRender = null;
      stripManualRender = null;
    },
  };

  return controller;
}
