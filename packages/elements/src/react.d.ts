/**
 * React JSX IntrinsicElements declarations for Maranello Web Components.
 * Import this file or add to tsconfig include for TypeScript support.
 */
import 'react';

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Accessibility FAB panel — settings for motion, contrast, font size */
      "mn-a11y": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      };
      /** Async search dropdown — debounced search with provider-driven results */
      "mn-async-select": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "placeholder"?: string;
        "min-chars"?: number | string;
        "debounce"?: number | string;
        onMnSelect?: (e: CustomEvent) => void;
      };
      /** Multi-type chart — sparkline, area, bar, donut, radar, bubble */
      "mn-chart": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "type"?: string;
        "data"?: string;
        "options"?: string;
        "width"?: string;
        "height"?: string;
        onMnChartReady?: (e: CustomEvent) => void;
      };
      /** AI chat interface — streaming messages, quick actions, voice input */
      "mn-chat": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "title"?: string;
        "welcome-message"?: string;
        "avatar"?: string;
        "quick-actions"?: string;
        "mode"?: string;
        onMnSend?: (e: CustomEvent) => void;
        onMnQuickAction?: (e: CustomEvent) => void;
      };
      /** Command palette — fuzzy search, keyboard navigation, action dispatch */
      "mn-command-palette": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "items"?: string;
        "placeholder"?: string;
        onMnSelect?: (e: CustomEvent) => void;
      };
      /** Customer journey map — phases with engagements, connectors, selection */
      "mn-customer-journey": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "phases"?: string;
        "selected"?: string;
        "layout"?: string;
        onSelect?: (e: CustomEvent) => void;
      };
      /** Schema-driven dashboard — rows/columns of widgets with auto loading states */
      "mn-dashboard": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        onMnWidgetClick?: (e: CustomEvent) => void;
      };
      /** Sortable filterable data table — pagination, grouping, cell types */
      "mn-data-table": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "columns"?: string;
        "data"?: string;
        "page-size"?: number | string;
        "group-by"?: string;
        "selectable"?: boolean;
        "compact"?: boolean;
        onMnRowClick?: (e: CustomEvent) => void;
        onMnSort?: (e: CustomEvent) => void;
        onMnFilter?: (e: CustomEvent) => void;
      };
      /** Date picker — calendar popup with min/max and disabled dates */
      "mn-date-picker": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "value"?: number | string;
        "min"?: number | string;
        "max"?: number | string;
        "disabled-dates"?: string;
        onMnChange?: (e: CustomEvent) => void;
      };
      /** Slide-out detail panel — tabs, sections, fields, edit mode */
      "mn-detail-panel": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "title"?: string;
        "sections"?: string;
        "open"?: boolean;
        onMnSave?: (e: CustomEvent) => void;
        onMnClose?: (e: CustomEvent) => void;
      };
      /** Entity editor — tabbed form with sections, fields, validation, save */
      "mn-entity-workbench": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "open"?: boolean;
        onMnSave?: (e: CustomEvent) => void;
        onMnClose?: (e: CustomEvent) => void;
        onMnAction?: (e: CustomEvent) => void;
      };
      /** Multi-facet filter panel — select, multi-select, search, date-range */
      "mn-facet-workbench": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        onMnFilterChange?: (e: CustomEvent) => void;
      };
      /** Ferrari-style controls — manettino, rotary, lever, toggle */
      "mn-ferrari-control": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "type"?: string;
        "options"?: string;
        onMnChange?: (e: CustomEvent) => void;
      };
      /** Funnel/pipeline chart — stages with counts, conversion rates */
      "mn-funnel": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "stages"?: string;
        "show-conversion"?: boolean;
        "animate"?: boolean;
        onMnFunnelClick?: (e: CustomEvent) => void;
        onMnFunnelReady?: (e: CustomEvent) => void;
      };
      /** Gantt timeline — tasks with hierarchy, zoom, scroll-to-today */
      "mn-gantt": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "tasks"?: string;
        "zoom"?: number | string;
        "label-width"?: number | string;
        onMnGanttSelect?: (e: CustomEvent) => void;
        onMnGanttClick?: (e: CustomEvent) => void;
        onMnGanttReady?: (e: CustomEvent) => void;
      };
      /** Ferrari-style gauge — value/max with arc, redline, complications */
      "mn-gauge": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "value"?: number | string;
        "max"?: number | string;
        "unit"?: string;
        "label"?: string;
        "size"?: number | string;
        "config"?: string;
        onMnGaugeReady?: (e: CustomEvent) => void;
      };
      /** Horizontal bar chart — sorted bars with tooltips and axis */
      "mn-hbar": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "data"?: string;
        "options"?: string;
        onMnHbarClick?: (e: CustomEvent) => void;
        onMnHbarReady?: (e: CustomEvent) => void;
      };
      /** App header shell — brand, navigation, search, filters, theme, profile */
      "mn-header-shell": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        onMnHeaderShellReady?: (e: CustomEvent) => void;
      };
      /** Kanban board — columns with draggable cards, move callbacks */
      "mn-kanban-board": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "columns"?: string;
        "cards"?: string;
        onMnKanbanCardMoved?: (e: CustomEvent) => void;
        onMnKanbanCardClick?: (e: CustomEvent) => void;
      };
      /** Geographic map — markers with clustering and click events */
      "mn-map": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "markers"?: string;
        "zoom"?: number | string;
        "center"?: string;
        "theme"?: string;
        onMnMarkerClick?: (e: CustomEvent) => void;
      };
      /** Mapbox-powered map — advanced styling, projections, stages overlay */
      "mn-mapbox": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "access-token"?: string;
        "center"?: string;
        "zoom"?: number | string;
        "markers"?: string;
        "stages"?: string;
        "projection"?: string;
        onMnMarkerClick?: (e: CustomEvent) => void;
      };
      /** Modal dialog — title, content slot, close events */
      "mn-modal": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "open"?: boolean;
        "title"?: string;
        onMnClose?: (e: CustomEvent) => void;
      };
      /** OKR panel — objectives with key results, progress, scoping */
      "mn-okr": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "objectives"?: string;
        "options"?: string;
        onMnOkrReady?: (e: CustomEvent) => void;
      };
      /** Profile menu — name, email, avatar, section-based dropdown */
      "mn-profile": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "name"?: string;
        "email"?: string;
        "avatar-url"?: string;
        "sections"?: string;
      };
      /** Section navigation — vertical/horizontal nav with active state */
      "mn-section-nav": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      };
      /** Speedometer gauge — needle, arc, ticks, bar mode */
      "mn-speedometer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "value"?: number | string;
        "max"?: number | string;
        "size"?: number | string;
        "label"?: string;
        "unit"?: string;
        onMnSpeedometerReady?: (e: CustomEvent) => void;
      };
      /** System status panel — services with health checks, polling */
      "mn-system-status": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "services"?: string;
        "poll-interval"?: number | string;
        "version"?: string;
        "environment"?: string;
        onMnServiceClick?: (e: CustomEvent) => void;
      };
      /** Tab container — manages tab switching with active state */
      "mn-tabs": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "label"?: string;
        onMnTabChange?: (e: CustomEvent) => void;
      };
      /** Theme rotary selector — Ferrari-style dial for theme switching */
      "mn-theme-rotary": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "size"?: number | string;
        onMnThemeChange?: (e: CustomEvent) => void;
      };
      /** Theme toggle — cycle or select themes with persistence */
      "mn-theme-toggle": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "mode"?: string;
        "modes"?: string;
        onMnThemeChange?: (e: CustomEvent) => void;
      };
      /** Toast notification — success/error/warning/info with auto-dismiss */
      "mn-toast": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "title"?: string;
        "message"?: string;
        "type"?: string;
        "duration"?: number | string;
      };
    }
  }
}