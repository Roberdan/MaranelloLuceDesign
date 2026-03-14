/**
 * Maranello Luce Design - Dialog and widget controls
 * Dropdown, tabs init with full keyboard navigation and ARIA support.
 * Modal and toast live in dedicated modules (modal.ts, toast.ts).
 */

import { createElement } from './core/utils';

// --- Dropdown ---

export interface DropdownController {
  open: () => void;
  close: () => void;
}

/**
 * Initialize a dropdown element with keyboard navigation and ARIA roles.
 * Expects `.mn-dropdown__trigger`, `.mn-dropdown__menu`, and `.mn-dropdown__item` children.
 */
export function initDropdown(el: HTMLElement): DropdownController {
  const trigger = el.querySelector<HTMLElement>('.mn-dropdown__trigger');
  const menu = el.querySelector<HTMLElement>('.mn-dropdown__menu');
  const items = el.querySelectorAll<HTMLElement>('.mn-dropdown__item');

  if (!trigger) throw new Error('Dropdown: missing .mn-dropdown__trigger');

  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  if (menu) menu.setAttribute('role', 'listbox');
  items.forEach((item) => {
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
  });

  function openMenu(): void {
    el.classList.add('mn-dropdown--open');
    trigger!.setAttribute('aria-expanded', 'true');
    if (items[0]) items[0].focus();
  }

  function closeMenu(): void {
    el.classList.remove('mn-dropdown--open');
    trigger!.setAttribute('aria-expanded', 'false');
    trigger!.focus();
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (el.classList.contains('mn-dropdown--open')) closeMenu();
    else openMenu();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu();
    }
  });

  items.forEach((item, idx) => {
    item.setAttribute('tabindex', '-1');

    item.addEventListener('click', () => {
      items.forEach((i) => {
        i.classList.remove('mn-dropdown__item--active');
        i.setAttribute('aria-selected', 'false');
      });
      item.classList.add('mn-dropdown__item--active');
      item.setAttribute('aria-selected', 'true');
      if (trigger!.childNodes[0]) {
        trigger!.childNodes[0].textContent = `${item.textContent ?? ''} `;
      }
      closeMenu();
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items[idx + 1]) items[idx + 1].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) items[idx - 1].focus();
        else trigger!.focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  document.addEventListener('click', () => {
    if (el.classList.contains('mn-dropdown--open')) closeMenu();
  });

  return { open: openMenu, close: closeMenu };
}

// --- Tabs ---

export interface TabsController {
  activate: (index: number) => void;
}

/**
 * Initialize a tab group with keyboard navigation.
 * Expects `.mn-tabs__tab` and `.mn-tabs__panel` children.
 */
export function initTabs(el: HTMLElement): TabsController {
  const tabs = el.querySelectorAll<HTMLElement>('.mn-tabs__tab');
  const panels = el.querySelectorAll<HTMLElement>('.mn-tabs__panel');

  function activate(idx: number): void {
    tabs.forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle('mn-tabs__tab--active', active);
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach((p, i) => {
      p.classList.toggle('mn-tabs__panel--active', i === idx);
    });
  }

  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    if (panels[i]) {
      const panelId = panels[i].id || `mn-tabpanel-${Math.random().toString(36).slice(2, 8)}`;
      panels[i].id = panelId;
      tab.setAttribute('aria-controls', panelId);
    }
    tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (i + 1) % tabs.length;
        activate(next);
        tabs[next].focus();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (i - 1 + tabs.length) % tabs.length;
        activate(prev);
        tabs[prev].focus();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        activate(0);
        tabs[0].focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        activate(tabs.length - 1);
        tabs[tabs.length - 1].focus();
      }
    });
  });

  let activeIdx = 0;
  tabs.forEach((t, i) => {
    if (t.classList.contains('mn-tabs__tab--active')) activeIdx = i;
  });
  activate(activeIdx);

  return { activate };
}
