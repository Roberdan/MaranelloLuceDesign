/**
 * Maranello Luce Design - Data component type definitions
 * Extracted from: data-table-render, data-table-logic, data-table,
 *   data-binding-events, data-binding, date-picker
 */

// --- Data Table ---

export type DataTableColumnAlign = 'left' | 'center' | 'right';
export type DataTableColumnType =
  | 'text' | 'number' | 'date' | 'status' | 'badge' | 'progress' | 'person'
  | 'tag' | 'metric' | 'action' | 'link' | 'icon' | 'custom';

export interface DataTableColumn<RowT = Record<string, unknown>> {
  key: string;
  label?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  minWidth?: number;
  align?: DataTableColumnAlign;
  type?: DataTableColumnType;
  render?: (value: unknown, row: RowT) => string | HTMLElement;
}

export interface DataTableOptions<RowT = Record<string, unknown>> {
  columns: DataTableColumn<RowT>[];
  data?: RowT[];
  groupBy?: string;
  groupOrder?: string[];
  pageSize?: number;
  selectable?: boolean;
  crosshair?: boolean;
  stickyHeader?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: RowT, index: number) => void;
  onCellClick?: (row: RowT, column: DataTableColumn<RowT>, value: unknown) => void;
  onDrillDown?: (row: RowT, event: Event) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  showFilters?: boolean;
  stripedRows?: boolean;
  resizableColumns?: boolean;
  ariaLabel?: string;
}

export interface DataTableController<RowT = Record<string, unknown>> {
  setData: (data: RowT[]) => void;
  addRow: (row: RowT) => void;
  removeRow: (index: number) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  setGroup: (key: string | null) => void;
  getSelected: () => RowT[];
  getFilteredData: () => RowT[];
  refresh: () => void;
  destroy: () => void;
}

// --- Data Binding ---

export interface BindOptions {
  event?: string;
  transform?: (value: unknown) => unknown;
  debounce?: number;
}

export type EventHandler = (detail: unknown) => void;

// --- Date Picker ---

export interface DatePickerOptions {
  value?: string;
  min?: string;
  max?: string;
  onSelect?: (dateStr: string) => void;
}

export interface DatePickerController {
  close: () => void;
}
