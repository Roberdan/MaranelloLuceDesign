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

const INIT_ATTR = 'data-mn-cp-init';

/** Initialize a command palette. Ctrl/Cmd+K shortcut. Emits 'command-select'. Safe to re-init. */
export function commandPalette(id: string): CommandPaletteController {
  const palette = document.getElementById(id);
  if (!palette) return { open: () => {}, close: () => {}, destroy: () => {} };

  // Guard against double-init: destroy previous instance listeners
  if (palette.getAttribute(INIT_ATTR)) {
    const prev = (palette as unknown as Record<string, unknown>)._mnCpDestroy;
    if (typeof prev === 'function') (prev as () => void)();
  }
  palette.setAttribute(INIT_ATTR, '1');

  const input = palette.querySelector<HTMLInputElement>('.mn-command-palette__input');
  const listEl = palette.querySelector<HTMLElement>('.mn-command-palette__list');
  const items = palette.querySelectorAll<HTMLElement>('.mn-command-palette__item');
  let activeIndex = -1;

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
    if (input) { input.value = ''; input.setAttribute('aria-expanded', 'true'); input.focus(); }
    activeIndex = -1;
    clearActive(palette!);
    filterItems('');
  }
  function close(): void {
    palette!.classList.remove('mn-command-palette--open');
    if (input) { input.setAttribute('aria-expanded', 'false'); input.setAttribute('aria-activedescendant', ''); }
    activeIndex = -1;
  }
  function selectItem(item: HTMLElement): void {
    eventBus.emit('command-select', { text: item.querySelector<HTMLElement>('.mn-command-palette__item-text')?.textContent ?? '' });
    close();
  }
  function filterItems(query: string): void {
    const q = query.toLowerCase();
    items.forEach((item) => {
      const text = item.querySelector<HTMLElement>('.mn-command-palette__item-text');
      item.style.display = (!q || (text?.textContent?.toLowerCase().includes(q) ?? false)) ? '' : 'none';
    });
    activeIndex = -1;
    clearActive(palette!);
  }

  function onInputChange(): void { filterItems(input!.value); }
  function onInputKeyDown(e: KeyboardEvent): void {
    const visible = getVisibleItems(palette!);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); activeIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0; activateItem(input!, visible, activeIndex); break;
      case 'ArrowUp': e.preventDefault(); activeIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1; activateItem(input!, visible, activeIndex); break;
      case 'Enter': e.preventDefault(); if (activeIndex >= 0 && activeIndex < visible.length) selectItem(visible[activeIndex]); break;
      case 'Escape': close(); break;
    }
  }
  if (input) {
    input.addEventListener('input', onInputChange);
    input.addEventListener('keydown', onInputKeyDown);
  }

  function onGlobalKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette!.classList.contains('mn-command-palette--open') ? close() : open();
    }
  }
  document.addEventListener('keydown', onGlobalKeyDown);

  const itemClickHandlers: (() => void)[] = [];
  items.forEach((item) => {
    const handler = () => selectItem(item);
    itemClickHandlers.push(handler);
    item.addEventListener('click', handler);
  });

  function destroy(): void {
    document.removeEventListener('keydown', onGlobalKeyDown);
    if (input) { input.removeEventListener('input', onInputChange); input.removeEventListener('keydown', onInputKeyDown); }
    items.forEach((item, i) => item.removeEventListener('click', itemClickHandlers[i]));
    palette!.removeAttribute(INIT_ATTR);
    delete (palette as unknown as Record<string, unknown>)._mnCpDestroy;
    close();
  }
  (palette as unknown as Record<string, unknown>)._mnCpDestroy = destroy;

  return { open, close, destroy };
}
