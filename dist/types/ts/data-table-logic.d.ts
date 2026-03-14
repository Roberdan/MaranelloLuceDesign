/**
 * Maranello Luce Design - Data table logic
 * Sorting, filtering, grouping, and rendering orchestration.
 */
import type { DataTableOptions } from './core/types';
import type { DataTableState } from './data-table-render';
export declare function compare(a: unknown, b: unknown, dir: number): number;
export declare function matchFilter(val: unknown, query: string): boolean;
export declare function handleSort(key: string, ci: number, state: DataTableState, headerRow: HTMLElement, renderFn: () => void, onSort?: (key: string, dir: 'asc' | 'desc') => void): void;
export declare function handleFilter(key: string, val: string, state: DataTableState, renderFn: () => void, onFilter?: (filters: Record<string, string>) => void): void;
export declare function getProcessedData<RowT extends Record<string, unknown>>(state: DataTableState<RowT>): RowT[];
interface GroupResult<RowT> {
    groups: Record<string, RowT[]>;
    order: string[];
}
export declare function getGroupedData<RowT extends Record<string, unknown>>(rows: RowT[], groupBy?: string, groupOrder?: string[]): GroupResult<RowT> | null;
export declare function render<RowT extends Record<string, unknown>>(state: DataTableState<RowT>, opts: DataTableOptions<RowT>, tbody: HTMLTableSectionElement, paginationEl: HTMLDivElement | null, liveRegion?: HTMLElement): void;
export {};
