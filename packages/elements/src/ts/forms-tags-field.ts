/**
 * Maranello Luce Design - Tags field widget
 * Standalone tag input with chip display, add/remove, autocomplete, and max limit.
 */

import { escapeHtml } from './core/sanitize';

export interface TagsFieldOptions {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
}

export interface TagsFieldApi {
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  getTags: () => string[];
  setValue: (newTags: string[]) => void;
  destroy: () => void;
}

/** Initialize a standalone tags field widget inside the given element. */
export function initTagsField(
  el: HTMLElement,
  opts?: TagsFieldOptions,
): TagsFieldApi {
  const tags: string[] = [];
  const onChange = opts?.onChange;
  const maxTags = opts?.maxTags ?? Infinity;
  const placeholder = opts?.placeholder ?? 'Add tag...';
  const suggestions = opts?.suggestions ?? [];

  /* Build DOM structure */
  el.innerHTML = '';
  el.classList.add('mn-tags-field');

  const chipsContainer = document.createElement('div');
  chipsContainer.className = 'mn-tags-field__chips';
  el.appendChild(chipsContainer);

  const input = document.createElement('input');
  input.className = 'mn-tags-field__input';
  input.type = 'text';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);
  el.appendChild(input);

  /* Autocomplete dropdown */
  const dropdown = document.createElement('div');
  dropdown.className = 'mn-tags-field__suggestions';
  dropdown.style.display = 'none';
  el.appendChild(dropdown);

  /* Focus input when clicking the wrapper */
  el.addEventListener('click', (e) => {
    if (e.target !== dropdown) input.focus();
  });

  function notify(): void {
    if (onChange) onChange(tags.slice());
  }

  function hideSuggestions(): void {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
  }

  function showSuggestions(query: string): void {
    if (!suggestions.length) return;
    const q = query.toLowerCase();
    const matches = suggestions.filter(
      (s) => s.toLowerCase().includes(q) && !tags.includes(s),
    );
    if (!matches.length) { hideSuggestions(); return; }
    dropdown.innerHTML = '';
    matches.slice(0, 8).forEach((s) => {
      const item = document.createElement('div');
      item.className = 'mn-tags-field__suggestion-item';
      item.textContent = escapeHtml(s);
      item.addEventListener('mousedown', (e) => {
        e.preventDefault(); // keep focus in input
        addTag(s);
        input.value = '';
        hideSuggestions();
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = '';
  }

  function createChip(value: string): HTMLSpanElement {
    const chip = document.createElement('span');
    chip.className = 'mn-chip';
    chip.appendChild(document.createTextNode(value));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'mn-chip__remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', 'Remove ' + escapeHtml(value));
    removeBtn.textContent = '\u00D7';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeTag(value);
    });
    chip.appendChild(removeBtn);
    return chip;
  }

  function addTag(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.indexOf(trimmed) !== -1) return;
    if (tags.length >= maxTags) return;
    tags.push(trimmed);
    chipsContainer.appendChild(createChip(trimmed));
    updatePlaceholder();
    notify();
  }

  function removeTag(value: string): void {
    const idx = tags.indexOf(value);
    if (idx === -1) return;
    tags.splice(idx, 1);
    const chips = chipsContainer.querySelectorAll('.mn-chip');
    chips.forEach((chip) => {
      if (chip.firstChild?.textContent === value) chip.remove();
    });
    updatePlaceholder();
    notify();
  }

  function setValue(newTags: string[]): void {
    /* Clear existing */
    tags.length = 0;
    chipsContainer.innerHTML = '';
    newTags.forEach((t) => addTag(t));
  }

  function updatePlaceholder(): void {
    input.placeholder = tags.length > 0 ? '' : placeholder;
  }

  /* Keyboard: Enter or comma adds tag; Backspace on empty removes last */
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value.replace(/,/g, ''));
      input.value = '';
      hideSuggestions();
    } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (q.length > 0) showSuggestions(q); else hideSuggestions();
  });

  input.addEventListener('blur', () => { setTimeout(hideSuggestions, 150); });

  /* Pre-populate initial tags */
  if (opts?.value) opts.value.forEach((t) => addTag(t));

  function destroy(): void {
    el.innerHTML = '';
    el.classList.remove('mn-tags-field');
    tags.length = 0;
  }

  return { addTag, removeTag, getTags: () => tags.slice(), setValue, destroy };
}
