/**
 * Maranello Luce Design - Data table renderers
 * Cell renderers, row builders, pagination, and DOM helpers.
 */
import type { DataTableOptions } from './core/types';
export interface DataTableStatusMeta {
    cls: string;
    icon: string;
}
export interface DataTableState<RowT = Record<string, unknown>> {
    data: RowT[];
    sortKey: string | null;
    sortDir: number;
    filters: Record<string, string>;
    page: number;
    expandedGroups: Record<string, boolean>;
    selected: number | null;
    colHighlight: number;
}
export declare const STATUS_MAP: Record<string, DataTableStatusMeta>;
export declare function el(tag: string, cls: string, attrs?: Record<string, string>): HTMLElement;
export declare function escHtml(s: unknown): string;
export declare const cellRenderers: Record<string, (val: unknown, row?: unknown, col?: unknown) => string>;
export declare function buildRow<RowT extends Record<string, unknown>>(row: RowT, rowIdx: number, opts: DataTableOptions<RowT>, state: DataTableState<RowT>, tbody: HTMLTableSectionElement): HTMLTableRowElement;
export declare function buildGroupHeader(groupName: string, count: number, isExpanded: boolean, colSpan: number, state: DataTableState, renderFn: () => void): HTMLTableRowElement;
export declare function buildPagination(totalRows: number, paginationEl: HTMLDivElement | null, pageSize: number, state: DataTableState, renderFn: () => void): void;
export declare function buildEmptyRow(emptyMessage: string, colSpan: number): HTMLTableRowElement;
export declare function positionColHighlight(ci: number, headerRow: HTMLElement, scrollWrap: HTMLElement, colHighlightEl: HTMLElement): void;
