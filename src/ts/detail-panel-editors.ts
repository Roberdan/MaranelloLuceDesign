/**
 * Maranello Luce Design - Detail panel field editors (edit mode)
 * Creates editable DOM elements for each field type.
 */

import type { DetailField, DetailEditor } from './core/types';
import { createElement } from './core/utils';
import { updateStatusSelectColor, renderPersonResults } from './detail-panel-renderers';

/** Date picker integration type (lazy-loaded from date-picker module). */
type DatePickerFn = (
  anchor: HTMLElement,
  opts: { value?: string; min?: string; max?: string; onSelect: (d: string) => void },
) => void;

let datePickerFn: DatePickerFn | null = null;

/** Register a date picker function for calendar button support. */
export function registerDatePicker(fn: DatePickerFn): void {
  datePickerFn = fn;
}

// --- Editor factories ---

const editors: Record<string, DetailEditor> = {
  text(val, field, onChange) {
    const input = createElement('input', 'mn-form-input mn-form-input--sm mn-detail-panel__edit-input');
    input.type = 'text';
    input.value = val ? String(val) : '';
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    input.addEventListener('input', () => onChange(input.value));
    return input;
  },

  number(val, field, onChange) {
    const input = createElement('input', 'mn-form-input mn-form-input--sm mn-detail-panel__edit-input');
    input.type = 'number';
    input.value = val !== undefined && val !== null ? String(val) : '';
    if (field.min !== undefined) input.min = String(field.min);
    if (field.max !== undefined) input.max = String(field.max);
    if (field.step) input.step = String(field.step);
    input.addEventListener('input', () => onChange(parseFloat(input.value) || 0));
    return input;
  },

  date(val, field, onChange) {
    const wrap = createElement('div', 'mn-detail-panel__date-wrap');
    const input = createElement('input', 'mn-form-input mn-form-input--sm mn-detail-panel__edit-input');
    input.type = 'text';
    input.value = val ? String(val) : '';
    input.placeholder = 'YYYY-MM-DD';
    wrap.appendChild(input);

    const calBtn = createElement('button', 'mn-detail-panel__cal-btn');
    calBtn.type = 'button';
    calBtn.innerHTML = '\uD83D\uDCC5';
    calBtn.title = 'Open calendar';
    wrap.appendChild(calBtn);

    input.addEventListener('input', () => onChange(input.value));
    calBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (datePickerFn) {
        datePickerFn(wrap, {
          value: input.value,
          min: field.min != null ? String(field.min) : undefined,
          max: field.max != null ? String(field.max) : undefined,
          onSelect(dateStr: string) {
            input.value = dateStr;
            onChange(dateStr);
          },
        });
      }
    });
    return wrap;
  },

  select(val, field, onChange) {
    const sel = createElement('select', 'mn-form-select mn-form-select--sm mn-detail-panel__edit-input');
    for (const opt of field.options ?? []) {
      const o = createElement('option');
      const optVal = typeof opt === 'string' ? opt : opt.value;
      const optLabel = typeof opt === 'string' ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? '')) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    return sel;
  },

  status(val, field, onChange) {
    const sel = createElement(
      'select',
      'mn-form-select mn-form-select--sm mn-detail-panel__edit-input mn-detail-panel__status-select',
    );
    for (const opt of field.options ?? []) {
      const o = createElement('option');
      const optVal = typeof opt === 'string' ? opt : opt.value;
      const optLabel = typeof opt === 'string' ? opt : opt.label;
      o.value = optVal;
      o.textContent = optLabel;
      if (optVal === String(val ?? '')) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => {
      updateStatusSelectColor(sel, field.statusColors);
      onChange(sel.value);
    });
    setTimeout(() => updateStatusSelectColor(sel, field.statusColors), 0);
    return sel;
  },

  person(val, field, onChange) {
    const wrap = createElement('div', 'mn-detail-panel__person-edit');
    const input = createElement('input', 'mn-form-input mn-form-input--sm mn-detail-panel__edit-input');
    input.type = 'text';
    input.value = val ? String(val) : '';
    input.placeholder = 'Search people\u2026';
    wrap.appendChild(input);

    const results = createElement('div', 'mn-detail-panel__person-results');
    wrap.appendChild(results);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    input.addEventListener('input', () => {
      onChange(input.value);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      const query = input.value.trim();
      if (query.length < 2 || !field.onSearch) {
        results.innerHTML = '';
        results.classList.remove('mn-detail-panel__person-results--open');
        return;
      }
      debounceTimer = setTimeout(() => {
        const searchFn = field.onSearch;
        if (!searchFn) return;
        const res = searchFn(query);
        if (res && typeof (res as Promise<unknown>).then === 'function') {
          (res as Promise<Array<string | { name: string; email?: string }>>).then((items) => {
            renderPersonResults(results, items, input, (v) => onChange(v));
          });
        } else if (Array.isArray(res)) {
          renderPersonResults(results, res, input, (v) => onChange(v));
        }
      }, 300);
    });

    input.addEventListener('blur', () => {
      setTimeout(() => results.classList.remove('mn-detail-panel__person-results--open'), 200);
    });
    return wrap;
  },

  score(val, field, onChange) {
    const wrap = createElement('div', 'mn-detail-panel__score-stepper');
    const btnMinus = createElement('button', 'mn-detail-panel__score-btn');
    btnMinus.type = 'button';
    btnMinus.textContent = '\u2212';

    const display = createElement('span', 'mn-detail-panel__score-value');
    let current = parseInt(String(val ?? ''), 10) || (field.min ?? 0);
    display.textContent = String(current);

    const btnPlus = createElement('button', 'mn-detail-panel__score-btn');
    btnPlus.type = 'button';
    btnPlus.textContent = '+';

    function update(delta: number): void {
      current = Math.max(field.min ?? 0, Math.min(field.max ?? 5, current + delta));
      display.textContent = String(current);
      onChange(current);
    }

    btnMinus.addEventListener('click', () => update(-1));
    btnPlus.addEventListener('click', () => update(1));
    wrap.appendChild(btnMinus);
    wrap.appendChild(display);
    wrap.appendChild(btnPlus);
    return wrap;
  },

  textarea(val, field, onChange) {
    const ta = createElement('textarea', 'mn-form-textarea mn-form-textarea--sm mn-detail-panel__edit-textarea');
    ta.value = val != null ? String(val) : '';
    ta.rows = field.rows ?? 3;
    if (field.maxLength) ta.maxLength = field.maxLength;
    if (field.placeholder) ta.placeholder = field.placeholder;
    ta.addEventListener('input', () => onChange(ta.value));
    return ta;
  },
};

export { editors };
