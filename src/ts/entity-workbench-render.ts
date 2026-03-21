import { AsyncSelect } from './async-select';
import { editors } from './detail-panel-editors';
import { renderers } from './detail-panel-renderers';
import type { DetailField } from './core/types';
import type { EntityField, EntitySchema, EntityTab } from './entity-workbench';

export interface RenderContext {
  container: HTMLElement;
  schema: EntitySchema;
  activeTab: string;
  data: Record<string, unknown>;
  editable: boolean;
  actions: Array<{ id: string; label: string; variant?: string }>;
  breadcrumb: string;
  isDirty: boolean;
  fieldEls: Map<string, HTMLElement>;
  asyncControls: AsyncSelect[];
  renderedTabs: Set<string>;
  onTab: (tabId: string) => void;
  onField: (field: EntityField, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  onAction: (id: string) => void;
}

export function renderWorkbench(ctx: RenderContext): void {
  ctx.container.innerHTML = '';
  ctx.container.className = 'mn-entity-workbench';
  ctx.container.append(
    renderBreadcrumb(ctx.breadcrumb),
    renderTabs(ctx),
    renderBody(ctx),
    renderActions(ctx),
  );
}

/** Toggle tab visibility without rebuilding DOM. */
export function switchTab(container: HTMLElement, tabId: string, ctx: RenderContext): void {
  const tabButtons = container.querySelectorAll('.mn-entity-workbench__tab');
  tabButtons.forEach((btn) => {
    btn.classList.toggle('mn-entity-workbench__tab--active', btn.textContent === labelForTab(ctx.schema, tabId));
  });
  const panels = container.querySelectorAll<HTMLElement>('.mn-entity-workbench__tab-panel');
  panels.forEach((panel) => {
    panel.style.display = panel.dataset.tab === tabId ? '' : 'none';
  });
  // Lazy-render: if tab panel not yet populated, render it now
  if (!ctx.renderedTabs.has(tabId)) {
    const panel = container.querySelector<HTMLElement>(`.mn-entity-workbench__tab-panel[data-tab="${tabId}"]`);
    const tab = ctx.schema.tabs.find((t) => t.id === tabId);
    if (panel && tab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tabId);
    }
  }
}

/** Update the save button disabled state without full re-render. */
export function updateSaveState(container: HTMLElement, isDirty: boolean): void {
  const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save"]');
  if (saveBtn) saveBtn.disabled = !isDirty;
}

function labelForTab(schema: EntitySchema, tabId: string): string {
  return schema.tabs.find((t) => t.id === tabId)?.label ?? '';
}

function renderBreadcrumb(content: string): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'mn-entity-workbench__breadcrumb';
  nav.textContent = content;
  return nav;
}

function renderTabs(ctx: RenderContext): HTMLElement {
  const tabs = document.createElement('div');
  tabs.className = 'mn-entity-workbench__tabs';
  ctx.schema.tabs.forEach((tab) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mn-entity-workbench__tab${tab.id === ctx.activeTab ? ' mn-entity-workbench__tab--active' : ''}`;
    btn.textContent = tab.label;
    btn.addEventListener('click', () => ctx.onTab(tab.id));
    tabs.appendChild(btn);
  });
  return tabs;
}

function renderBody(ctx: RenderContext): HTMLElement {
  const body = document.createElement('div');
  body.className = 'mn-entity-workbench__body';
  ctx.schema.tabs.forEach((tab) => {
    const panel = document.createElement('div');
    panel.className = 'mn-entity-workbench__tab-panel';
    panel.dataset.tab = tab.id;
    panel.style.display = tab.id === ctx.activeTab ? '' : 'none';
    if (tab.id === ctx.activeTab) {
      renderTabContent(panel, tab, ctx);
      ctx.renderedTabs.add(tab.id);
    }
    body.appendChild(panel);
  });
  return body;
}

function renderTabContent(panel: HTMLElement, tab: EntityTab, ctx: RenderContext): void {
  tab.sections.forEach((section) => {
    const sec = document.createElement('section');
    sec.className = 'mn-entity-workbench__section';
    if (section.title) {
      const title = document.createElement('h3');
      title.className = 'mn-entity-workbench__section-title';
      title.textContent = section.title;
      sec.appendChild(title);
    }
    section.fields.forEach((field) => sec.appendChild(renderField(ctx, field)));
    panel.appendChild(sec);
  });
}

function renderField(ctx: RenderContext, field: EntityField): HTMLElement {
  if (field.type === 'group') return renderGroup(ctx, field);
  const row = document.createElement('div');
  row.className = 'mn-field mn-entity-workbench__field';
  row.innerHTML = `<label class="mn-field__label">${field.label}${field.required ? ' *' : ''}</label><div class="mn-entity-workbench__control"></div><div class="mn-field__error"></div>`;
  ctx.fieldEls.set(field.key, row);
  const control = row.querySelector('.mn-entity-workbench__control') as HTMLElement;
  const readOnly = !ctx.editable || field.readOnly || field.type === 'computed';
  const value = field.type === 'computed' ? field.compute?.(ctx.data) : getValue(ctx.data, field.key);
  if (field.type === 'async-select' && !readOnly && field.provider) {
    const picker = new AsyncSelect(control, {
      provider: field.provider,
      onSelect: (item) => {
        const stored = field.provider?.getId ? field.provider.getId(item) : item;
        ctx.onField(field, stored);
      },
    });
    const input = control.querySelector<HTMLInputElement>('.mn-async-select__input');
    if (input && value != null) input.value = String(value);
    ctx.asyncControls.push(picker);
    return row;
  }
  if (!readOnly && editors[field.type]) {
    control.appendChild(editors[field.type](value, toDetail(field), (next) => ctx.onField(field, next)));
    return row;
  }
  control.appendChild((renderers[field.type] ?? renderers.readonly)(value, toDetail(field), ctx.data));
  return row;
}

function renderGroup(ctx: RenderContext, field: EntityField): HTMLElement {
  const wrap = document.createElement('fieldset');
  wrap.className = 'mn-entity-workbench__group';
  wrap.innerHTML = `<legend class="mn-entity-workbench__group-title">${field.label}</legend>`;
  (field.fields ?? []).forEach((sub) => wrap.appendChild(renderField(ctx, sub)));
  return wrap;
}

function renderActions(ctx: RenderContext): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'mn-entity-workbench__actions';
  bar.append(makeAction('save', 'Save', ctx.isDirty ? '' : 'disabled', () => ctx.onSave()));
  bar.append(makeAction('cancel', 'Cancel', '', () => ctx.onCancel()));
  ctx.actions.forEach((action) => {
    bar.append(makeAction(action.id, action.label, action.variant ?? 'ghost', () => ctx.onAction(action.id)));
  });
  return bar;
}

function makeAction(id: string, label: string, variant: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `mn-btn mn-btn--sm mn-btn--${variant} mn-entity-workbench__action`;
  btn.dataset.action = id;
  btn.textContent = label;
  btn.disabled = variant === 'disabled';
  btn.addEventListener('click', onClick);
  return btn;
}

function toDetail(field: EntityField): DetailField {
  return {
    key: field.key,
    label: field.label,
    type: field.type as DetailField['type'],
    options: field.options?.options as Array<string | { value: string; label: string }> | undefined,
  };
}

function getValue(data: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => (acc as Record<string, unknown> | undefined)?.[part], data);
}
