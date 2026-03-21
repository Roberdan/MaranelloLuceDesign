import { StateScaffold } from './state-scaffold';
import { createDashboardWidget, type DashboardWidgetType, type WidgetController } from './dashboard-widgets';

export type WidgetType = DashboardWidgetType;

export interface DashboardWidget {
  type: WidgetType;
  dataKey: string;
  span?: number;
  options?: Record<string, unknown>;
}

export interface DashboardRow {
  columns: DashboardWidget[];
}

export interface DashboardSchema {
  rows: DashboardRow[];
}

interface WidgetRecord {
  key: string;
  wrapper: HTMLElement;
  body: HTMLElement;
  widgetHost: HTMLElement;
  scaffold: StateScaffold;
  controller: WidgetController;
  rendered: boolean;
}

function clampSpan(value: number | undefined): number {
  if (!value || Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(12, Math.round(value)));
}

export class DashboardRenderer {
  private container: HTMLElement;
  private schema: DashboardSchema;
  private data: Record<string, unknown>;
  private widgets: WidgetRecord[] = [];

  constructor(container: HTMLElement, options: { schema: DashboardSchema; data?: Record<string, unknown> }) {
    this.container = container;
    this.schema = options.schema;
    this.data = { ...(options.data || {}) };
    this.renderAll();
  }

  setData(key: string, value: unknown): void {
    this.data[key] = value;
    this.widgets.filter((widget) => widget.key === key).forEach((widget) => {
      this.renderWidget(widget);
    });
  }

  setSchema(newSchema: DashboardSchema): void {
    this.destroyWidgets();
    this.schema = newSchema;
    this.renderAll();
  }

  getWidget(dataKey: string): unknown {
    return this.widgets.find((widget) => widget.key === dataKey)?.controller;
  }

  destroy(): void {
    this.destroyWidgets();
    this.container.classList.remove('mn-dashboard-renderer');
    this.container.innerHTML = '';
  }

  private renderAll(): void {
    this.container.classList.add('mn-dashboard-renderer');
    this.container.innerHTML = '';
    this.widgets = [];

    this.schema.rows.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'mn-dashboard-row';
      this.container.appendChild(rowEl);

      row.columns.forEach((column) => {
        const wrapper = document.createElement('section');
        wrapper.className = 'mn-dashboard-cell';
        wrapper.dataset.dashboardKey = column.dataKey;
        wrapper.style.gridColumn = `span ${clampSpan(column.span)}`;

        const body = document.createElement('div');
        body.className = 'mn-dashboard-body';
        wrapper.appendChild(body);
        rowEl.appendChild(wrapper);

        let record: WidgetRecord;
        const scaffold = new StateScaffold(body, {
          state: 'loading',
          onRetry: () => this.renderWidget(record),
        });
        const widgetHost = document.createElement('div');
        widgetHost.className = 'mn-dashboard-widget-host';
        scaffold.getContentHost().appendChild(widgetHost);
        const controller = createDashboardWidget(column);
        record = {
          key: column.dataKey,
          wrapper,
          body,
          widgetHost,
          scaffold,
          controller,
          rendered: false,
        };
        this.widgets.push(record);
        this.renderWidget(record);
      });
    });
  }

  private renderWidget(record: WidgetRecord): void {
    const value = this.data[record.key];
    if (value instanceof Error) {
      record.scaffold.setState('error', value.message || 'Widget failed to load.');
      return;
    }
    if (value === null || value === undefined) {
      record.scaffold.setState('loading');
      return;
    }
    if (Array.isArray(value) && value.length === 0) {
      record.scaffold.setState('empty');
      return;
    }

    record.scaffold.setState('ready');

    if (!record.rendered) {
      record.controller.render(record.widgetHost, value);
      record.rendered = true;
      return;
    }
    record.controller.update(value);
  }

  private destroyWidgets(): void {
    this.widgets.forEach((widget) => {
      widget.controller.destroy();
      widget.scaffold.destroy();
      widget.wrapper.remove();
    });
    this.widgets = [];
  }
}
