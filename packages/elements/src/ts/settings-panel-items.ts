/**
 * Maranello Luce Design - Settings Panel Item Renderers
 * Builds individual control rows for each settings item type.
 */
import { escapeHtml } from './core/sanitize';

export type SettingsItemType =
  | { type: 'toggle'; label: string; description?: string; value: boolean; onChange(v: boolean): void; disabled?: boolean }
  | { type: 'text'; label: string; description?: string; value: string; onChange(v: string): void; placeholder?: string; hint?: string; maxLength?: number }
  | { type: 'select'; label: string; description?: string; value: string; onChange(v: string): void; options: Array<{ value: string; label: string }> }
  | { type: 'range'; label: string; description?: string; value: number; onChange(v: number): void; min: number; max: number; step?: number; format?(v: number): string }
  | { type: 'radio'; label: string; description?: string; value: string; onChange(v: string): void; options: Array<{ value: string; label: string }> }
  | { type: 'info'; label: string; value: string; mono?: boolean }
  | { type: 'action'; label: string; description?: string; buttonLabel: string; variant?: 'default' | 'danger'; onAction(): void }
  | { type: 'custom'; label: string; description?: string; render(el: HTMLElement): void };

let uid = 0;
function nextId(prefix: string): string { return `mn-sp-${prefix}-${++uid}`; }

/** Build the label + description column for a settings row. */
function labelGroup(label: string, description?: string, forId?: string): HTMLElement {
  const g = document.createElement('div');
  g.className = 'mn-settings-item__label-group';
  const lbl = document.createElement('label');
  lbl.className = 'mn-settings-item__label';
  lbl.textContent = escapeHtml(label);
  if (forId) lbl.htmlFor = forId;
  g.appendChild(lbl);
  if (description) {
    const desc = document.createElement('span');
    desc.className = 'mn-settings-item__desc';
    desc.textContent = escapeHtml(description);
    g.appendChild(desc);
  }
  return g;
}

/** Render a toggle (checkbox styled as switch). */
function renderToggle(
  item: Extract<SettingsItemType, { type: 'toggle' }>,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  const id = nextId('toggle');
  row.appendChild(labelGroup(item.label, item.description, id));
  const wrap = document.createElement('div');
  wrap.className = 'mn-settings-item__ctrl';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.className = 'mn-settings-toggle';
  input.checked = item.value;
  input.setAttribute('role', 'switch');
  input.setAttribute('aria-checked', String(item.value));
  if (item.disabled) input.disabled = true;
  input.addEventListener('change', () => {
    values.set(item.label, input.checked);
    input.setAttribute('aria-checked', String(input.checked));
    item.onChange(input.checked);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  wrap.appendChild(input);
  row.appendChild(wrap);
  return row;
}

/** Render a text input. */
function renderText(
  item: Extract<SettingsItemType, { type: 'text' }>,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  const id = nextId('text');
  row.appendChild(labelGroup(item.label, item.description, id));
  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.className = 'mn-settings-item__ctrl mn-settings-text';
  input.value = item.value;
  if (item.placeholder) input.placeholder = item.placeholder;
  if (item.maxLength) input.maxLength = item.maxLength;
  if (item.hint) {
    const hintId = `${id}-hint`;
    input.setAttribute('aria-describedby', hintId);
    const hint = document.createElement('span');
    hint.id = hintId;
    hint.className = 'mn-settings-item__hint mn-sr-only';
    hint.textContent = item.hint;
    row.appendChild(hint);
  }
  input.addEventListener('input', () => {
    values.set(item.label, input.value);
    item.onChange(input.value);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  row.appendChild(input);
  return row;
}

/** Render a select dropdown. */
function renderSelect(
  item: Extract<SettingsItemType, { type: 'select' }>,
  ac: AbortController,
  values: Map<string, unknown>,
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'mn-settings-item';
  const id = nextId('select');
  row.appendChild(labelGroup(item.label, item.description, id));
  const sel = document.createElement('select');
  sel.id = id;
  sel.className = 'mn-settings-item__ctrl mn-settings-select';
  for (const opt of item.options) {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = escapeHtml(opt.label);
    if (opt.value === item.value) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    values.set(item.label, sel.value);
    item.onChange(sel.value);
  }, { signal: ac.signal });
  values.set(item.label, item.value);
  row.appendChild(sel);
  return row;
}

export {
  renderToggle,
  renderText,
  renderSelect,
  labelGroup,
  nextId,
};

export type { };
