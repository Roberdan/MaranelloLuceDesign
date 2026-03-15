/**
 * Maranello Luce Design - Person search field widget
 * Debounced async search with avatar initials dropdown.
 */

import { escapeHtml } from './core/sanitize';
import { debounce } from './core/utils';

export interface PersonResult {
  id: string;
  name: string;
  email?: string;
  initials?: string;
}

export interface PersonFieldOptions {
  searchFn: (query: string) => Promise<PersonResult[]>;
  onSelect?: (person: { id: string; name: string }) => void;
  placeholder?: string;
  value?: string;
}

export interface PersonFieldApi {
  getValue: () => string;
  setValue: (name: string) => void;
  destroy: () => void;
}

/** Derive 2-letter initials from a full name. */
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Initialize a person search field inside the given element. */
export function initPersonField(
  el: HTMLElement,
  opts: PersonFieldOptions,
): PersonFieldApi {
  const { searchFn, onSelect, placeholder = 'Search people...' } = opts;
  let selectedId = '';

  /* Build DOM */
  el.innerHTML = '';
  el.classList.add('mn-person-field');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'mn-input mn-person-field__input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  if (opts.value) input.value = opts.value;
  el.appendChild(input);

  const dropdown = document.createElement('div');
  dropdown.className = 'mn-person-field__dropdown';
  dropdown.style.display = 'none';
  dropdown.setAttribute('role', 'listbox');
  el.appendChild(dropdown);

  function hideDropdown(): void {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
  }

  function renderResults(results: PersonResult[]): void {
    dropdown.innerHTML = '';
    if (results.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    dropdown.style.display = '';
    for (const person of results) {
      const item = document.createElement('div');
      item.className = 'mn-person-field__item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '-1');

      const initials = person.initials ?? deriveInitials(person.name);
      const avatar = document.createElement('span');
      avatar.className = 'mn-person__avatar';
      avatar.textContent = initials;
      item.appendChild(avatar);

      const info = document.createElement('div');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'mn-person-field__name';
      nameSpan.textContent = escapeHtml(person.name);
      info.appendChild(nameSpan);

      if (person.email) {
        const emailSpan = document.createElement('div');
        emailSpan.className = 'mn-person-field__email';
        emailSpan.textContent = escapeHtml(person.email);
        info.appendChild(emailSpan);
      }
      item.appendChild(info);

      item.addEventListener('click', () => {
        input.value = person.name;
        selectedId = person.id;
        hideDropdown();
        if (onSelect) onSelect({ id: person.id, name: person.name });
      });
      dropdown.appendChild(item);
    }
  }

  /* Debounced search */
  const doSearch = debounce(async () => {
    const query = input.value.trim();
    if (!query) { hideDropdown(); return; }
    try {
      const results = await searchFn(query);
      renderResults(results);
    } catch {
      hideDropdown();
    }
  }, 300);

  input.addEventListener('input', () => { doSearch(); });

  /* Escape closes dropdown */
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') { hideDropdown(); }
  });

  /* Click outside closes dropdown */
  const onDocClick = (e: MouseEvent): void => {
    if (!el.contains(e.target as Node)) hideDropdown();
  };
  document.addEventListener('click', onDocClick);

  function destroy(): void {
    document.removeEventListener('click', onDocClick);
    el.innerHTML = '';
    el.classList.remove('mn-person-field');
  }

  return {
    getValue: () => input.value,
    setValue: (name: string) => { input.value = name; selectedId = ''; },
    destroy,
  };
}
