/**
 * Maranello Luce Design - Settings Panel
 * Structured settings form with sections, labels, and typed controls.
 */
import { escapeHtml } from './core/sanitize';
import {
  renderToggle,
  renderText,
  renderSelect,
  labelGroup,
  nextId,
} from './settings-panel-items';
import type { SettingsItemType } from './settings-panel-items';

export type { SettingsItemType } from './settings-panel-items';

export interface SettingsPanelSection {
  id?: string;
  title: string;
  description?: string;
  items: SettingsItemType[];
}

export interface SettingsPanelOpts {
  sections: SettingsPanelSection[];
}

export interface SettingsPanelController {
  update: (sectionId: string, itemLabel: string, value: unknown) => void;
  getValues: () => Record<string, unknown>;
  destroy: () => void;
}

/** Render a range slider with optional format display. */
function renderRange(
  item: Extract<SettingsItemType, { type: 'range' }>,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  const id = nextId('range');
  row.appendChild(labelGroup(item.label, item.description, id));
  const wrap = document.createElement('div');
  wrap.className = 'mn-settings-item__ctrl mn-settings-range-wrap';
  const input = document.createElement('input');
  input.type = 'range';
  input.id = id;
  input.className = 'mn-settings-range';
  input.min = String(item.min);
  input.max = String(item.max);
  if (item.step) input.step = String(item.step);
  input.value = String(item.value);
  const display = document.createElement('span');
  display.className = 'mn-settings-range__value';
  display.textContent = item.format ? item.format(item.value) : String(item.value);
  input.addEventListener('input', () => {
    const v = Number(input.value);
    display.textContent = item.format ? item.format(v) : String(v);
    values.set(item.label, v);
    item.onChange(v);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  wrap.appendChild(input);
  wrap.appendChild(display);
  row.appendChild(wrap);
  return row;
}

/** Render a radio group. */
function renderRadio(
  item: Extract<SettingsItemType, { type: 'radio' }>,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  const name = nextId('radio');
  row.appendChild(labelGroup(item.label, item.description));
  const group = document.createElement('div');
  group.className = 'mn-settings-item__ctrl mn-settings-radio-group';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', item.label);
  for (const opt of item.options) {
    const label = document.createElement('label');
    label.className = 'mn-settings-radio';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = opt.value;
    if (opt.value === item.value) input.checked = true;
    input.addEventListener('change', () => {
      values.set(item.label, input.value);
      item.onChange(input.value);
    }, { signal: ac.signal });
    label.appendChild(input);
    const span = document.createElement('span');
    span.textContent = escapeHtml(opt.label);
    label.appendChild(span);
    group.appendChild(label);
  }
  values.set(item.label, item.value);
  row.appendChild(group);
  return row;
}

/** Render a read-only info row. */
function renderInfo(item: Extract<SettingsItemType, { type: 'info' }>): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  row.appendChild(labelGroup(item.label));
  const val = document.createElement('span');
  val.className = 'mn-settings-item__ctrl mn-settings-info';
  if (item.mono) val.classList.add('mn-settings-info--mono');
  val.textContent = escapeHtml(item.value);
  row.appendChild(val);
  return row;
}

/** Render an action button row. */
function renderAction(
  item: Extract<SettingsItemType, { type: 'action' }>,
  ac: AbortController,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item mn-settings-item--action';
  row.appendChild(labelGroup(item.label, item.description));
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mn-settings-item__ctrl mn-settings-action-btn';
  if (item.variant === 'danger') btn.classList.add('mn-settings-action-btn--danger');
  btn.textContent = escapeHtml(item.buttonLabel);
  btn.addEventListener('click', () => item.onAction(), { signal: ac.signal });
  row.appendChild(btn);
  return row;
}

/** Render a custom slot row. */
function renderCustom(item: Extract<SettingsItemType, { type: 'custom' }>): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  row.appendChild(labelGroup(item.label, item.description));
  const slot = document.createElement('div');
  slot.className = 'mn-settings-item__ctrl';
  item.render(slot);
  row.appendChild(slot);
  return row;
}

/** Dispatch item rendering by type. */
function renderItem(
  item: SettingsItemType,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  switch (item.type) {
    case 'toggle': return renderToggle(item, ac, values);
    case 'text': return renderText(item, ac, values);
    case 'select': return renderSelect(item, ac, values);
    case 'range': return renderRange(item, ac, values);
    case 'radio': return renderRadio(item, ac, values);
    case 'info': return renderInfo(item);
    case 'action': return renderAction(item, ac);
    case 'custom': return renderCustom(item);
  }
}

/**
 * Create a structured settings panel inside a container element.
 * Renders sections with titled rows and typed controls.
 */
export function settingsPanel(
  el: HTMLElement,
  opts: SettingsPanelOpts,
): SettingsPanelController {
  const ac = new AbortController();
  const values = new Map<string, unknown>();

  el.classList.add('mn-settings-panel');

  for (const section of opts.sections) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'mn-settings-section';
    if (section.id) fieldset.dataset.sectionId = section.id;

    const legend = document.createElement('legend');
    legend.className = 'mn-settings-section__title';
    legend.textContent = escapeHtml(section.title);
    fieldset.appendChild(legend);

    if (section.description) {
      const desc = document.createElement('p');
      desc.className = 'mn-settings-section__desc';
      desc.textContent = escapeHtml(section.description);
      fieldset.appendChild(desc);
    }

    for (const item of section.items) {
      const key = section.id ? `${section.id}:${item.label}` : item.label;
      fieldset.appendChild(renderItem(item, ac, values));
      /* Mirror into keyed map for getValues */
      if (values.has(item.label)) {
        values.set(key, values.get(item.label));
      }
    }

    el.appendChild(fieldset);
  }

  return {
    update(sectionId: string, itemLabel: string, value: unknown) {
      const key = `${sectionId}:${itemLabel}`;
      values.set(key, value);
      values.set(itemLabel, value);
    },
    getValues() {
      const result: Record<string, unknown> = {};
      for (const [k, v] of values) result[k] = v;
      return result;
    },
    destroy() {
      ac.abort();
      el.innerHTML = '';
      el.classList.remove('mn-settings-panel');
    },
  };
}
