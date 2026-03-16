/**
 * Maranello Luce Design - Cohort retention grid
 * Heatmap table showing cohort retention over time periods.
 */
export interface CohortRow {
    label: string;
    initialSize: number;
    retention: number[];
}
export interface CohortGridOptions {
    periodLabels?: string[];
    showAbsolute?: boolean;
    onHover?: (row: CohortRow, periodIdx: number, value: number) => void;
    colorHigh?: string;
    colorLow?: string;
}
export interface CohortGridController {
    update: (rows: CohortRow[], opts?: Partial<CohortGridOptions>) => void;
    destroy: () => void;
}
/**
 * Create a cohort retention heatmap grid inside the given element.
 * Renders a table with color-interpolated cells based on retention rates.
 */
export declare function cohortGrid(el: HTMLElement, rows: CohortRow[], opts?: CohortGridOptions): CohortGridController;
