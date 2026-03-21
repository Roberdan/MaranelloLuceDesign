import type { Placement } from './view-registry';
export type LayoutMode = 'full' | 'split' | 'stacked' | 'docked-bottom' | 'dual-panel' | 'side-detail';
export interface AppShellConfig {
    layout?: LayoutMode;
    sidebarCollapsed?: boolean;
    bottomDockHeight?: string;
}
export declare class AppShellController {
    private readonly container;
    private readonly slots;
    private layout;
    constructor(container: HTMLElement, config?: AppShellConfig);
    setLayout(mode: LayoutMode): void;
    getLayout(): LayoutMode;
    toggleSidebar(): void;
    isSidebarCollapsed(): boolean;
    setBottomDock(open: boolean): void;
    getSlot(name: string): HTMLElement | null;
    /** Resolves a Placement to the corresponding shell slot element. Returns null for modal or unknown placements. */
    getSlotForPlacement(placement: Placement): HTMLElement | null;
    destroy(): void;
}
