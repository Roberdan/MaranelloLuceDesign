/** Maranello Luce Design - Person search field widget */
import { AsyncSelect } from './async-select';

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
  el.classList.add('mn-person-field');
  let selectedId = '';
  const asyncSelect = new AsyncSelect<PersonResult>(el, {
    provider: {
      search: (query) => searchFn(query),
      renderItem: (person) => {
        const initials = person.initials ?? deriveInitials(person.name);
        const suffix = person.email ? ` • ${person.email}` : '';
        return `${initials} ${person.name}${suffix}`;
      },
      getLabel: (person) => person.name,
      getId: (person) => person.id,
    },
    placeholder,
    debounceMs: 300,
    minChars: 1,
    onSelect: (person) => {
      selectedId = person.id;
      onSelect?.({ id: person.id, name: person.name });
    },
  });
  const input = el.querySelector<HTMLInputElement>('.mn-async-select__input');
  if (input) {
    input.classList.add('mn-input', 'mn-person-field__input');
    if (opts.value) input.value = opts.value;
  }

  function destroy(): void {
    asyncSelect.destroy();
    el.classList.remove('mn-person-field');
  }

  return {
    getValue: () => input?.value ?? '',
    setValue: (name: string) => {
      if (input) input.value = name;
      selectedId = '';
    },
    destroy,
  };
}
