/**
 * Maranello Luce Design — Grid Layout Helper
 * Applies preset grid templates to a container element.
 */
export type GridTemplateName = 'overview-4col' | 'sidebar-main' | 'triple-equal' | 'dashboard-kpi' | 'focus-detail' | 'masonry-auto';
export interface GridLayoutOptions {
    gap?: string;
    padding?: string;
    animate?: boolean;
}
export interface GridLayoutController {
    setTemplate: (name: GridTemplateName) => void;
    getTemplate: () => GridTemplateName;
    destroy: () => void;
}
export declare function gridLayout(container: HTMLElement | string, template?: GridTemplateName, options?: GridLayoutOptions): GridLayoutController | null;
