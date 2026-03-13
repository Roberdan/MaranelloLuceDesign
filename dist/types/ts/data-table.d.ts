/**
 * Maranello Luce Design - Data table factory
 * Creates a full-featured data table with sorting, filtering,
 * grouping, pagination, and crosshair highlighting.
 */
import type { DataTableOptions, DataTableController } from './core/types';
/** Create a data table in the given container. */
export declare function dataTable<RowT extends Record<string, unknown>>(container: HTMLElement | string, opts: DataTableOptions<RowT>): DataTableController<RowT> | null;
