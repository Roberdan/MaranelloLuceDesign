/**
 * Maranello Luce Design - Command palette (Cmd+K style)
 * Provides a searchable command overlay with keyboard navigation.
 * ARIA combobox pattern with listbox results.
 */

import type { CommandPaletteController } from './core/types';
import { eventBus } from './core/events';

/** Get visible (non-hidden) items from the palette. */
function getVisibleItems(palette: HTMLElement): HTMLElement[] {
  const all = palette.querySelectorAll<HTMLElement>('.mn-command-palette__item');
  return Array.from(all).filter((el) => el.style.display !== 'none');
}

/** Clear active state from all items. */
function clearActive(palette: HTMLElement): void {
  palette.querySelectorAll('.mn-command-palette__item').forEach((el) => {
    el.classList.remove('mn-command-palette__item--active');
    el.setAttribute('aria-selected', 'false');
  });
}

/** Activate an item by index and update aria-activedescendant on input. */
function activateItem(
  input: HTMLInputElement,
  items: HTMLElement[],
  index: number,
): void {
  items.forEach((el, i) => {
    const active = i === index;
    el.classList.toggle('mn-command-palette__item--active', active);
    el.setAttribute('aria-selected', String(active));
  });
  const target = items[index];
  if (target) {
    input.setAttribute('aria-activedescendant', target.id || '');
    target.scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Initialize a command palette on an existing DOM element.
 * Registers Ctrl/Cmd+K global shortcut.
 * Emits 'command-select' event when an item is chosen.
 */
export function commandPalette(id: string): CommandPaletteController {
  const palette = document.getElementById(id);
  if (!palette) return { open: () => {}, close: () => {} };

  const input = palette.querySelector<HTMLInputElement>('.mn-command-palette__input');
  const listEl = palette.querySelector<HTMLElement>('.mn-command-palette__list');
  const items = palette.querySelectorAll<HTMLElement>('.mn-command-palette__item');
  let activeIndex = -1;

  /* Assign ARIA roles and IDs */
  if (listEl) {
    listEl.setAttribute('role', 'listbox');
    const listId = id + '-list';
    listEl.id = listId;
    if (input) input.setAttribute('aria-owns', listId);
  }

  if (input) {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-activedescendant', '');
  }

  items.forEach((item, i) => {
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    if (!item.id) item.id = id + '-item-' + i;
  });

  function open(): void {
    palette!.classList.add('mn-command-palette--open');
    if (input) {
      input.value = '';
      input.setAttribute('aria-expanded', 'true');
      input.focus();
    }
    activeIndex = -1;
    clearActive(palette!);
    filterItems('');
  }

  function close(): void {
    palette!.classList.remove('mn-command-palette--open');
    if (input) {
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-activedescendant', '');
    }
    activeIndex = -1;
  }

  function selectItem(item: HTMLElement): void {
    const text = item.querySelector<HTMLElement>('.mn-command-palette__item-text');
    eventBus.emit('command-select', { text: text?.textContent ?? '' });
    close();
  }

  function filterItems(query: string): void {
    const q = query.toLowerCase();
    items.forEach((item) => {
      const text = item.querySelector<HTMLElement>('.mn-command-palette__item-text');
      const match = !q || (text?.textContent?.toLowerCase().includes(q) ?? false);
      item.style.display = match ? '' : 'none';
    });
    activeIndex = -1;
    clearActive(palette!);
  }

  if (input) {
    input.addEventListener('input', () => filterItems(input.value));

    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const visible = getVisibleItems(palette!);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          activeIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0;
          activateItem(input, visible, activeIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          activeIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1;
          activateItem(input, visible, activeIndex);
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < visible.length) {
            selectItem(visible[activeIndex]);
          }
          break;
        case 'Escape':
          close();
          break;
      }
    });
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette!.classList.contains('mn-command-palette--open') ? close() : open();
    }
  });

  items.forEach((item) => {
    item.addEventListener('click', () => selectItem(item));
  });

  return { open, close };
}
