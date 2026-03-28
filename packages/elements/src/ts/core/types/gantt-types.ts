/**
 * Maranello Luce Design - Gantt type definitions
 * Extracted from: gantt-defaults, gantt-utils, gantt-layout,
 *   gantt-canvas, gantt-header, gantt-sidebar, gantt-events, gantt-api
 */

export interface GanttTask {
  id: string | number;
  title: string;
  start: string;
  end: string;
  children?: GanttTask[];
  [key: string]: unknown;
}

export interface GanttPalette {
  [stage: string]: string;
}

export interface GanttSeverityColor {
  min: number;
  color: string;
}

export interface GanttDefaults {
  labelWidth: number;
  rowHeight: number;
  childRowHeight: number;
  headerHeight: number;
  barHeight: number;
  childBarHeight: number;
  barRadius: number;
  basePxPerMonth: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  zoomStep: number;
  showToday: boolean;
  showGrid: boolean;
  showProgress: boolean;
  today: Date | null;
  palette: GanttPalette[] | null;
  childPalette: Record<string, string> | null;
  severityColors?: GanttSeverityColor[];
  onSelect?: ((task: GanttTask, type: string) => void) | null;
  onExpand?: ((task: Record<string, unknown>, expanded: boolean) => void) | null;
  onClick?: ((task: GanttTask, type: string) => void) | null;
  onTaskClick?: (task: GanttTask) => void;
  onTaskHover?: (task: GanttTask | null) => void;
  onZoomChange?: (zoom: number) => void;
}

export interface GanttOptions extends Partial<GanttDefaults> {
  tasks?: GanttTask[];
  startDate?: string;
  endDate?: string;
  showToday?: boolean;
  editable?: boolean;
  groupBy?: string;
  locale?: string;
}

export interface GanttRow {
  task: GanttTask;
  type: 'parent' | 'child';
  hasChildren?: boolean;
  parent?: GanttTask;
  level?: number;
  expanded?: boolean;
  y?: number;
  height?: number;
}

export interface GanttRange {
  start: Date;
  end: Date;
  totalDays: number;
  months: GanttMonthRange[];
}

export interface GanttMonthRange {
  year: number;
  month: number;
  days: number;
  startDay: number;
  label: string;
}

export interface GanttController {
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  expandAll: () => void;
  collapseAll: () => void;
  setTasks: (tasks: GanttTask[]) => void;
  select: (taskId: string | number) => void;
  scrollToToday: () => void;
  render: () => void;
  destroy: () => void;
}
