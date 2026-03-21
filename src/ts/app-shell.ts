import type { Placement } from './view-registry';

export type LayoutMode = 'full' | 'split' | 'stacked' | 'docked-bottom' | 'dual-panel' | 'side-detail';

export interface AppShellConfig {
  layout?: LayoutMode;
  sidebarCollapsed?: boolean;
  bottomDockHeight?: string;
}

type SlotName = 'nav' | 'toolbar' | 'filter-bar' | 'main' | 'secondary' | 'detail' | 'bottom' | 'overlay';

const SLOT_NAMES: readonly SlotName[] = [
  'nav', 'toolbar', 'filter-bar', 'main', 'secondary', 'detail', 'bottom', 'overlay',
] as const;

const LAYOUTS: readonly LayoutMode[] = ['full', 'split', 'stacked', 'docked-bottom', 'dual-panel', 'side-detail'];

/** Maps Placement values from ViewRegistry to AppShell slot names. */
const PLACEMENT_TO_SLOT: ReadonlyMap<Placement, SlotName> = new Map<Placement, SlotName>([
  ['page', 'main'],
  ['side-panel', 'detail'],
  ['bottom-dock', 'bottom'],
  ['overlay', 'overlay'],
  ['workspace', 'secondary'],
  // 'modal' intentionally omitted — modals use the modal system, not a slot
]);

export class AppShellController {
  private readonly container: HTMLElement;
  private readonly slots = new Map<SlotName, HTMLElement>();
  private layout: LayoutMode = 'full';

  constructor(container: HTMLElement, config: AppShellConfig = {}) {
    this.container = container;
    this.container.classList.add('mn-app-shell');
    if (config.bottomDockHeight) {
      this.container.style.setProperty('--mn-app-shell-bottom-height', config.bottomDockHeight);
    }
    for (const name of SLOT_NAMES) {
      const existing = this.container.querySelector<HTMLElement>(`:scope > .mn-app-shell__${name}`);
      const slot = existing ?? document.createElement('div');
      slot.classList.add(`mn-app-shell__${name}`);
      slot.dataset.slot = name;
      if (!existing) this.container.append(slot);
      this.slots.set(name, slot);
    }
    this.setLayout(config.layout ?? 'full');
    this.container.classList.toggle('mn-app-shell--sidebar-collapsed', !!config.sidebarCollapsed);
    this.setBottomDock(false);
  }

  setLayout(mode: LayoutMode): void {
    for (const name of LAYOUTS) this.container.classList.remove(`mn-app-shell--${name}`);
    this.layout = mode;
    this.container.classList.add(`mn-app-shell--${mode}`);
  }

  getLayout(): LayoutMode {
    return this.layout;
  }

  toggleSidebar(): void {
    this.container.classList.toggle('mn-app-shell--sidebar-collapsed');
  }

  isSidebarCollapsed(): boolean {
    return this.container.classList.contains('mn-app-shell--sidebar-collapsed');
  }

  setBottomDock(open: boolean): void {
    this.container.classList.toggle('mn-app-shell--bottom-open', open);
  }

  getSlot(name: string): HTMLElement | null {
    return this.slots.get(name as SlotName) ?? null;
  }

  /** Resolves a Placement to the corresponding shell slot element. Returns null for modal or unknown placements. */
  getSlotForPlacement(placement: Placement): HTMLElement | null {
    const slotName = PLACEMENT_TO_SLOT.get(placement);
    if (!slotName) return null;
    return this.slots.get(slotName) ?? null;
  }

  destroy(): void {
    this.container.classList.remove('mn-app-shell', 'mn-app-shell--sidebar-collapsed', 'mn-app-shell--bottom-open');
    for (const mode of LAYOUTS) this.container.classList.remove(`mn-app-shell--${mode}`);
    for (const slot of this.slots.values()) slot.remove();
    this.slots.clear();
  }
}
