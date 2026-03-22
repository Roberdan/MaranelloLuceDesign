import { eventBus } from './core/events';
import { openModal, closeModal } from './modal';
import type { Placement } from './view-registry';
import { ViewRegistry, type ViewConfig } from './view-registry';
import { NavigationModel } from './navigation-model';
import type { AppShellController } from './app-shell';
export interface PanelHandle {
  viewId: string;
  placement: Placement;
  container: HTMLElement;
  close(): void;
  moveTo(placement: Placement): void;
}
type OpenEntry = {
  placement: Placement;
  handle: PanelHandle;
  mountResult?: unknown;
  modalId?: string;
};
export class PanelOrchestrator {
  private readonly openViews = new Map<string, OpenEntry>();

  constructor(
    private readonly registry: ViewRegistry,
    private readonly navigation: NavigationModel,
    private readonly shell?: AppShellController,
  ) {}
  open(viewId: string, target?: Placement, data?: unknown): PanelHandle {
    const existing = this.openViews.get(viewId);
    if (existing) {
      if (target && target !== existing.placement) this.move(viewId, target);
      // Remount with new data if provided
      if (data !== undefined) {
        const config = this.registry.get(viewId);
        if (config) {
          this.unmount(existing.mountResult);
          existing.mountResult = this.mountView(config, existing.handle.container, data);
        }
      }
      this.navigation.push(viewId, { placement: this.openViews.get(viewId)?.placement });
      return this.openViews.get(viewId)!.handle;
    }
    const config = this.registry.get(viewId);
    if (!config) throw new Error(`View "${viewId}" is not registered`);

    const placement = target ?? config.defaultPlacement;
    const container = this.createViewContainer(viewId);
    const mountResult = this.mountView(config, container, data);
    const modalId = placement === 'modal' ? this.createModalHost(viewId, container) : undefined;
    if (placement !== 'modal') this.ensureSlot(placement).appendChild(container);

    const handle: PanelHandle = {
      viewId,
      placement,
      container,
      close: () => this.close(viewId),
      moveTo: (next) => this.move(viewId, next),
    };
    this.openViews.set(viewId, { placement, handle, mountResult, modalId });
    this.navigation.push(viewId, { placement });
    eventBus.emit('panel-opened', { viewId, placement });
    return handle;
  }

  close(viewId: string): void {
    const entry = this.openViews.get(viewId);
    if (!entry) return;

    if (entry.modalId) closeModal(entry.modalId);
    this.unmount(entry.mountResult);
    if (entry.handle.container.parentElement) entry.handle.container.parentElement.removeChild(entry.handle.container);
    if (entry.modalId) document.getElementById(entry.modalId)?.remove();
    this.openViews.delete(viewId);
    this.navigation.remove(viewId);
    eventBus.emit('panel-closed', { viewId });
  }

  move(viewId: string, newTarget: Placement): void {
    const entry = this.openViews.get(viewId);
    if (!entry) throw new Error(`View "${viewId}" is not open`);
    if (entry.placement === newTarget) return;

    const from = entry.placement;
    if (entry.modalId) {
      closeModal(entry.modalId);
      document.getElementById(entry.modalId)?.remove();
      entry.modalId = undefined;
    } else if (entry.handle.container.parentElement) {
      entry.handle.container.parentElement.removeChild(entry.handle.container);
    }
    if (newTarget === 'modal') {
      entry.modalId = this.createModalHost(viewId, entry.handle.container);
    } else {
      this.ensureSlot(newTarget).appendChild(entry.handle.container);
    }

    entry.placement = newTarget;
    entry.handle.placement = newTarget;
    // Update navigation entry to reflect new placement
    this.navigation.replace(viewId, { placement: newTarget });
    eventBus.emit('panel-moved', { viewId, from, to: newTarget });
  }

  stack(viewId: string): void {
    const entry = this.openViews.get(viewId);
    if (!entry) {
      this.open(viewId);
      return;
    }
    const parent = entry.handle.container.parentElement;
    if (parent) parent.appendChild(entry.handle.container);
    this.navigation.push(viewId, { placement: entry.placement, stacked: true });
  }

  swap(viewId1: string, viewId2: string): void {
    const first = this.openViews.get(viewId1);
    const second = this.openViews.get(viewId2);
    if (!first || !second) throw new Error('Both views must be open to swap');
    if (first.placement === second.placement) {
      const parent = first.handle.container.parentElement;
      if (parent && parent === second.handle.container.parentElement) {
        const anchor = first.handle.container.nextSibling;
        parent.insertBefore(first.handle.container, second.handle.container);
        parent.insertBefore(second.handle.container, anchor);
      }
      return;
    }

    const firstPlacement = first.placement;
    this.move(viewId1, second.placement);
    this.move(viewId2, firstPlacement);
  }
  getOpen(): Map<string, { placement: Placement; handle: PanelHandle }> {
    return new Map([...this.openViews.entries()].map(([id, item]) => [id, { placement: item.placement, handle: item.handle }]));
  }

  isOpen(viewId: string): boolean {
    return this.openViews.has(viewId);
  }

  closeAll(): void {
    for (const viewId of [...this.openViews.keys()]) this.close(viewId);
  }
  destroy(): void {
    this.closeAll();
    this.openViews.clear();
  }

  private createViewContainer(viewId: string): HTMLDivElement {
    const el = document.createElement('div');
    el.className = 'mn-panel-view';
    el.dataset.viewId = viewId;
    return el;
  }
  private mountView(config: ViewConfig, container: HTMLElement, data?: unknown): unknown {
    if (config.factory) return config.factory(container, data);
    if (config.tag) {
      container.appendChild(document.createElement(config.tag));
      return undefined;
    }
    throw new Error(`View "${config.id}" has no factory or tag`);
  }
  private createModalHost(viewId: string, container: HTMLElement): string {
    const id = `mn-panel-modal-${viewId}`;
    const backdrop = document.createElement('div');
    backdrop.id = id;
    backdrop.className = 'mn-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'mn-modal';
    modal.appendChild(container);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    openModal(id);
    return id;
  }
  private ensureSlot(placement: Placement): HTMLElement {
    if (this.shell) {
      const shellSlot = this.shell.getSlotForPlacement(placement);
      if (shellSlot) return shellSlot;
    }
    return this.ensureFallbackSlot(placement);
  }
  private ensureFallbackSlot(placement: Placement): HTMLElement {
    const id = `mn-slot-${placement}`;
    let slot = document.getElementById(id);
    if (!slot) {
      slot = document.createElement('div');
      slot.id = id;
      slot.className = `mn-slot mn-slot--${placement}`;
      document.querySelector('body')!.appendChild(slot);
    }
    return slot;
  }
  private unmount(mountResult: unknown): void {
    if (typeof mountResult === 'function') {
      (mountResult as () => void)();
      return;
    }
    if (mountResult && typeof mountResult === 'object' && 'destroy' in mountResult) {
      const maybeDestroy = (mountResult as { destroy?: unknown }).destroy;
      if (typeof maybeDestroy === 'function') maybeDestroy.call(mountResult);
    }
  }
}
