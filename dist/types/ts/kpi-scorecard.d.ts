export type KpiStatus = 'green' | 'yellow' | 'red' | 'neutral';
export interface KpiRow {
    id: string;
    label: string;
    unit?: string;
    target: number;
    actual: number;
    trend?: number[];
    status?: KpiStatus;
    format?: 'number' | 'percent' | 'currency';
}
export interface KpiScorecardOptions {
    currency?: string;
    onSelect?: (row: KpiRow) => void;
    animate?: boolean;
}
export interface KpiScorecardController {
    update: (rows: KpiRow[]) => void;
    destroy: () => void;
}
/** Create a KPI Scorecard table inside the given element. */
export declare function kpiScorecard(el: HTMLElement, rows: KpiRow[], opts?: KpiScorecardOptions): KpiScorecardController;
