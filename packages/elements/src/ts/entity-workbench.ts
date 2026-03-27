import type { AsyncDataProvider } from './async-select';
import { AsyncSelect } from './async-select';
import { BackStack } from './entity-workbench-backstack';
import { renderWorkbench, switchTab, updateSaveState, type RenderContext } from './entity-workbench-render';
import { validateField as validateFormField } from './forms-validate';

export interface EntityField {
  key: string;
  label: string;
  type: string;
  options?: Record<string, unknown>;
  required?: boolean;
  readOnly?: boolean;
  provider?: AsyncDataProvider;
  compute?: (data: Record<string, unknown>) => unknown;
  fields?: EntityField[];
}

export interface EntitySection { title?: string; fields: EntityField[] }
export interface EntityTab { id: string; label: string; sections: EntitySection[] }
export interface EntitySchema { tabs: EntityTab[] }

export interface EntityWorkbenchOptions {
  schema: EntitySchema;
  data: Record<string, unknown>;
  editable?: boolean;
  actions?: Array<{ id: string; label: string; icon?: string; variant?: string }>;
  onSave?: (data: Record<string, unknown>) => void | Promise<void>;
  onClose?: () => void;
  onAction?: (actionId: string, data: Record<string, unknown>) => void;
}

interface StackEntry {
  schema: EntitySchema;
  data: Record<string, unknown>;
  base: Record<string, unknown>;
  label: string;
}

export class EntityWorkbench {
  private readonly stack = new BackStack<StackEntry>();
  private readonly asyncControls: AsyncSelect[] = [];
  private readonly fieldEls = new Map<string, HTMLElement>();
  private readonly renderedTabs = new Set<string>();
  private currentSchema: EntitySchema;
  private baseData: Record<string, unknown>;
  private currentData: Record<string, unknown>;
  private activeTab = '';
  private readonly rootLabel: string;

  constructor(private readonly container: HTMLElement, private readonly options: EntityWorkbenchOptions) {
    this.currentSchema = options.schema;
    this.baseData = clone(options.data);
    this.currentData = clone(options.data);
    this.activeTab = options.schema.tabs[0]?.id ?? '';
    this.rootLabel = getLabel(this.currentData, 1);
    this.render();
  }

  isDirty(): boolean { return Object.keys(this.getModifiedData()).length > 0; }
  canGoBack(): boolean { return this.stack.canGoBack(); }
  getCurrentDepth(): number { return this.stack.depth() + 1; }

  getModifiedData(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === 'group' || field.type === 'computed') return;
      const curr = getValue(this.currentData, field.key);
      const base = getValue(this.baseData, field.key);
      if (!same(curr, base)) setValue(out, field.key, curr);
    });
    return out;
  }

  validate(): { valid: boolean; errors: Map<string, string> } {
    this.ensureAllTabsRendered();
    const errors = new Map<string, string>();
    collectFields(this.currentSchema.tabs).forEach((field) => {
      if (field.type === 'group' || field.type === 'computed') return;
      const host = this.fieldEls.get(field.key);
      if (!host) return;
      const input = host.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        '.mn-form-input, .mn-form-select, .mn-form-textarea',
      );
      if (input) {
        const rules = [field.required ? 'required' : '', patternRule(field)].filter(Boolean).join(',');
        if (rules) input.setAttribute('data-validate', rules);
      }
      if (!validateFormField(host)) errors.set(field.key, host.querySelector('.mn-field__error')?.textContent || 'Invalid value');
      const custom = field.options?.custom as ((value: unknown, data: Record<string, unknown>) => string | null) | undefined;
      const message = custom?.(getValue(this.currentData, field.key), this.currentData);
      if (message) {
        errors.set(field.key, message);
        const err = host.querySelector<HTMLElement>('.mn-field__error');
        if (err) err.textContent = message;
      }
    });
    return { valid: errors.size === 0, errors };
  }

  pushEntity(schema: EntitySchema, data: Record<string, unknown>): void {
    this.stack.push({
      schema: this.currentSchema,
      data: clone(this.currentData),
      base: clone(this.baseData),
      label: getLabel(this.currentData, this.getCurrentDepth()),
    });
    this.currentSchema = schema;
    this.baseData = clone(data);
    this.currentData = clone(data);
    this.activeTab = schema.tabs[0]?.id ?? '';
    this.render();
  }

  popEntity(): boolean {
    const prev = this.stack.pop();
    if (!prev) return false;
    this.currentSchema = prev.schema;
    this.currentData = prev.data;
    this.baseData = prev.base;
    this.activeTab = this.currentSchema.tabs[0]?.id ?? '';
    this.render();
    return true;
  }

  destroy(): void {
    this.asyncControls.splice(0).forEach((ctrl) => ctrl.destroy());
    this.fieldEls.clear();
    this.renderedTabs.clear();
    this.container.innerHTML = '';
  }

  private buildRenderContext(): RenderContext {
    return {
      container: this.container,
      schema: this.currentSchema,
      activeTab: this.activeTab,
      data: this.currentData,
      editable: this.options.editable !== false,
      actions: this.options.actions ?? [],
      breadcrumb: this.buildBreadcrumb(),
      isDirty: this.isDirty(),
      fieldEls: this.fieldEls,
      asyncControls: this.asyncControls,
      renderedTabs: this.renderedTabs,
      onTab: (tabId) => this.handleTabSwitch(tabId),
      onField: (field, value) => this.onFieldChange(field, value),
      onSave: () => void this.handleSave(),
      onCancel: () => this.handleCancel(),
      onAction: (id) => this.options.onAction?.(id, this.currentData),
    };
  }

  private buildBreadcrumb(): string {
    return [
      this.rootLabel,
      ...this.stack.path().map((v) => v.label),
      getLabel(this.currentData, this.getCurrentDepth()),
    ].join(' / ');
  }

  /** Switch tab via CSS display toggle — no DOM rebuild. */
  private handleTabSwitch(tabId: string): void {
    this.activeTab = tabId;
    switchTab(this.container, tabId, this.buildRenderContext());
  }

  /** Force-render any tabs not yet lazily rendered (needed for validate). */
  private ensureAllTabsRendered(): void {
    const ctx = this.buildRenderContext();
    for (const tab of this.currentSchema.tabs) {
      if (!this.renderedTabs.has(tab.id)) {
        switchTab(this.container, tab.id, ctx);
      }
    }
    // Restore the active tab visibility
    switchTab(this.container, this.activeTab, ctx);
  }

  private render(): void {
    this.destroy();
    renderWorkbench(this.buildRenderContext());
  }

  private onFieldChange(field: EntityField, value: unknown): void {
    setValue(this.currentData, field.key, value);
    updateSaveState(this.container, this.isDirty());
    // Update breadcrumb text when a label-relevant field changes
    if (field.key === 'name' || field.key === 'title') {
      const breadcrumbEl = this.container.querySelector('.mn-entity-workbench__breadcrumb');
      if (breadcrumbEl) breadcrumbEl.textContent = this.buildBreadcrumb();
    }
  }

  private async handleSave(): Promise<void> {
    if (!this.validate().valid) return;
    await this.options.onSave?.(this.getModifiedData());
    this.baseData = clone(this.currentData);
    this.render();
  }

  private handleCancel(): void {
    if (this.isDirty() && typeof window !== 'undefined' && !window.confirm('Discard unsaved changes?')) return;
    this.currentData = clone(this.baseData);
    this.render();
    this.options.onClose?.();
  }
}

function collectFields(tabs: EntityTab[]): EntityField[] {
  return tabs.flatMap((tab) => tab.sections.flatMap((section) => section.fields.flatMap((field) => field.type === 'group' ? (field.fields ?? []) : [field])));
}

function patternRule(field: EntityField): string {
  const pattern = field.options?.pattern;
  return typeof pattern === 'string' && pattern.length ? `pattern:${pattern}` : '';
}

function getValue(data: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => (acc as Record<string, unknown> | undefined)?.[part], data);
}

function setValue(data: Record<string, unknown>, key: string, value: unknown): void {
  const parts = key.split('.');
  const last = parts.pop();
  if (!last) return;
  let cursor: Record<string, unknown> = data;
  parts.forEach((part) => { cursor[part] = (cursor[part] as Record<string, unknown>) ?? {}; cursor = cursor[part] as Record<string, unknown>; });
  cursor[last] = value;
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function same(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }

function getLabel(data: Record<string, unknown>, depth: number): string {
  const value = data.name ?? data.title ?? data.id;
  return value != null ? String(value) : `Entity ${depth}`;
}
