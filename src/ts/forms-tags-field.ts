/**
 * Maranello Luce Design - Tags field widget
 * Standalone tag input with chip display, add/remove, and max limit.
 */

import { escapeHtml } from './core/sanitize';

export interface TagsFieldOptions {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export interface TagsFieldApi {
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  getTags: () => string[];
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

  /* Focus input when clicking the wrapper */
  el.addEventListener('click', () => input.focus());

  function notify(): void {
    if (onChange) onChange(tags.slice());
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
    /* Remove matching chip from DOM */
    const chips = chipsContainer.querySelectorAll('.mn-chip');
    chips.forEach((chip) => {
      const text = chip.firstChild?.textContent ?? '';
      if (text === value) chip.remove();
    });
    updatePlaceholder();
    notify();
  }

  function updatePlaceholder(): void {
    input.placeholder = tags.length > 0 ? '' : placeholder;
  }

  /* Keyboard: Enter adds tag */
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input.value);
      input.value = '';
    }
  });

  /* Pre-populate initial tags */
  if (opts?.initialTags) {
    opts.initialTags.forEach((t) => addTag(t));
  }

  function destroy(): void {
    el.innerHTML = '';
    el.classList.remove('mn-tags-field');
    tags.length = 0;
  }

  return { addTag, removeTag, getTags: () => tags.slice(), destroy };
}
