import type { Placement } from './view-registry';
import { ViewRegistry } from './view-registry';
import { NavigationModel } from './navigation-model';
import type { AppShellController } from './app-shell';
export interface PanelHandle {
    viewId: string;
    placement: Placement;
    container: HTMLElement;
    close(): void;
    moveTo(placement: Placement): void;
}
export declare class PanelOrchestrator {
    private readonly registry;
    private readonly navigation;
    private readonly shell?;
    private readonly openViews;
    constructor(registry: ViewRegistry, navigation: NavigationModel, shell?: AppShellController | undefined);
    open(viewId: string, target?: Placement, data?: unknown): PanelHandle;
    close(viewId: string): void;
    move(viewId: string, newTarget: Placement): void;
    stack(viewId: string): void;
    swap(viewId1: string, viewId2: string): void;
    getOpen(): Map<string, {
        placement: Placement;
        handle: PanelHandle;
    }>;
    isOpen(viewId: string): boolean;
    closeAll(): void;
    destroy(): void;
    private createViewContainer;
    private mountView;
    private createModalHost;
    private ensureSlot;
    private ensureFallbackSlot;
    private unmount;
}
