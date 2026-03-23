export interface HeatmapCell {
    value: number;
    label?: string;
    color?: string;
    tooltip?: string;
}
export interface HeatmapRow {
    label: string;
    cells: HeatmapCell[];
}
export interface HeatmapOptions {
    rows: HeatmapRow[];
    columnLabels?: string[];
    colorScale?: string[];
    minValue?: number;
    maxValue?: number;
    showValues?: boolean;
    cellSize?: 'sm' | 'md' | 'lg';
    onCellClick?: (row: HeatmapRow, cell: HeatmapCell, rowIndex: number, colIndex: number) => void;
    onCellHover?: (row: HeatmapRow, cell: HeatmapCell, rowIndex: number, colIndex: number) => void;
    ariaLabel?: string;
}
export interface HeatmapController {
    update: (rows: HeatmapRow[], columnLabels?: string[]) => void;
    destroy: () => void;
}
/**
 * Create a heatmap grid inside the given container.
 * Returns a controller for updates and cleanup, or null if container not found.
 */
export declare function heatmap(container: HTMLElement | string, options: HeatmapOptions): HeatmapController | null;
