/**
 * Maranello Luce Design - Detail panel field renderers (read-only mode)
 * Renders field values as DOM elements based on field type.
 */

import type { DetailField, DetailRenderer, DetailPersonItem } from './core/types';
import { createElement } from './core/utils';

const DASH = '\u2014';

function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(/[\s.]+/)
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

function formatDateSimple(s: unknown): string {
  if (!s) return '';
  const str = String(s);
  const parts = str.split('-');
  if (parts.length < 3) return str;
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${parseInt(parts[2], 10)} ${MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

/** Update a status <select> element border/text color from a color map. */
export function updateStatusSelectColor(
  sel: HTMLSelectElement,
  colors?: Record<string, string>,
): void {
  if (!colors) return;
  const c = colors[sel.value];
  if (c) {
    sel.style.borderColor = c;
    sel.style.color = c;
  } else {
    sel.style.borderColor = '';
    sel.style.color = '';
  }
}

/** Render person search result items into a dropdown container. */
export function renderPersonResults(
  container: HTMLElement,
  items: Array<string | DetailPersonItem>,
  input: HTMLInputElement,
  onChange: (val: string) => void,
): void {
  container.innerHTML = '';
  if (!items || !items.length) {
    container.classList.remove('mn-detail-panel__person-results--open');
    return;
  }
  items.forEach((item) => {
    const row = createElement('div', 'mn-detail-panel__person-result');
    const itemName = typeof item === 'string' ? item : item.name;

    const avatar = createElement('span', 'mn-detail-panel__avatar mn-detail-panel__avatar--sm');
    avatar.textContent = getInitials(itemName);
    row.appendChild(avatar);

    const nameSpan = createElement('span');
    nameSpan.textContent = itemName;
    row.appendChild(nameSpan);

    if (typeof item !== 'string' && item.email) {
      const email = createElement('span', 'mn-detail-panel__person-email');
      email.textContent = item.email;
      row.appendChild(email);
    }

    row.addEventListener('mousedown', (e) => {
      e.preventDefault();
      input.value = itemName;
      onChange(itemName);
      container.classList.remove('mn-detail-panel__person-results--open');
    });
    container.appendChild(row);
  });
  container.classList.add('mn-detail-panel__person-results--open');
}

// --- Read-only renderers ---

const renderers: Record<string, DetailRenderer> = {
  text(val) {
    const span = createElement('span', 'mn-detail-panel__field-value');
    span.textContent = val ? String(val) : DASH;
    return span;
  },

  number(val) {
    const span = createElement('span', 'mn-detail-panel__field-value mn-detail-panel__field-value--mono');
    span.textContent = val !== undefined && val !== null ? String(val) : DASH;
    return span;
  },

  date(val) {
    const span = createElement('span', 'mn-detail-panel__field-value');
    span.textContent = val ? formatDateSimple(val) : DASH;
    return span;
  },

  badge(val, field) {
    const span = createElement('span', 'mn-tag mn-tag--sm');
    const color = field.badgeColors?.[String(val)] ?? '';
    if (color) span.style.background = color;
    span.textContent = val ? String(val) : DASH;
    return span;
  },

  status(val, field) {
    const span = createElement('span', 'mn-tag mn-tag--sm');
    const colors = field.statusColors ?? {};
    const c = colors[String(val)];
    if (c) {
      span.style.background = c;
      span.style.color = '#fff';
    }
    span.textContent = val ? String(val) : DASH;
    return span;
  },

  person(val) {
    const wrap = createElement('span', 'mn-detail-panel__field-value mn-detail-panel__person');
    if (val) {
      const avatar = createElement('span', 'mn-detail-panel__avatar');
      avatar.textContent = getInitials(String(val));
      wrap.appendChild(avatar);
      const name = createElement('span');
      name.textContent = String(val);
      wrap.appendChild(name);
    } else {
      wrap.textContent = DASH;
    }
    return wrap;
  },

  score(val) {
    const span = createElement('span', 'mn-detail-panel__field-value mn-detail-panel__field-value--mono');
    span.textContent = val !== undefined && val !== null ? String(val) : DASH;
    return span;
  },

  select(val) {
    const span = createElement('span', 'mn-detail-panel__field-value');
    span.textContent = val ? String(val) : DASH;
    return span;
  },

  textarea(val) {
    const div = createElement('div', 'mn-detail-panel__field-value mn-detail-panel__field-value--block');
    div.textContent = val ? String(val) : DASH;
    return div;
  },

  readonly(val) {
    const span = createElement('span', 'mn-detail-panel__field-value mn-detail-panel__field-value--muted');
    span.textContent = val ? String(val) : DASH;
    return span;
  },

  custom(val, field, data) {
    if (field.render) return field.render(val, data);
    return renderers.text(val, field, data);
  },
};

export { renderers, getInitials, formatDateSimple };
