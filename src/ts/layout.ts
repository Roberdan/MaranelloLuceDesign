/**
 * layout.ts — Lightweight 4-slot layout state machine.
 * CSP-safe: zero inline handlers. All listeners via addEventListener.
 *
 * Slots: #mn-slot-strip, #mn-slot-left, #mn-slot-center, #mn-slot-right
 * Grid: #mn-grid (CSS :has()-based column collapse in layouts-mn-layout.css)
 */

export interface LayoutViewConfig {
  label: string;
  fullpage?: boolean;
  buttonId?: string;
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

  /** Re-query slots from the live DOM — never cache stale refs. */
  function getSlot(id: string): HTMLElement | null {
    return grid.querySelector(`#${id}`);
  }

  const views = new Map<string, LayoutViewConfig>();
  const buttonCleanups: Array<() => void> = [];

  const state: LayoutState = {
    view: '',
    fullpage: false,
    strip: true,
    left: false,
    right: false,
  };

  // Sidebar state saved when entering fullpage, restored on exit
  let savedStrip = true;

  function syncDOM(): void {
    const strip = getSlot('mn-slot-strip');
    const left = getSlot('mn-slot-left');
    const right = getSlot('mn-slot-right');
    const center = getSlot('mn-slot-center');

    if (strip) strip.hidden = !state.strip;
    if (left) left.hidden = !state.left;
    if (right) right.hidden = !state.right;
    grid.classList.toggle('mn-layout--fullpage', state.fullpage);

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

  // Initial DOM sync — left and right hidden, strip visible
  syncDOM();

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
      state.right = false; // detail is per-engagement

      if (config.fullpage) {
        state.fullpage = true;
        state.strip = false;
        state.left = false;
      } else {
        state.fullpage = false;
      }

      applyState();
    },

    toggleStrip(): void {
      if (state.fullpage) return;
      state.strip = !state.strip;
      applyState();
    },

    toggleLeft(): void {
      if (state.fullpage) return;
      state.left = !state.left;
      applyState();
    },

    toggleRight(): void {
      if (state.fullpage) return;
      state.right = !state.right;
      applyState();
    },

    openRight(): void {
      if (state.fullpage) return;
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
