/**
 * Maranello Luce Design - Profile menu controller
 * Dropdown user menu with keyboard navigation and avatar display.
 */

import { buildTriggerAvatar, buildDropdown } from './profile-menu-dom';
import { throttle } from './core/utils';
import type { ProfileMenuSection } from './core/types';

export interface ProfileMenuUser {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface ProfileMenuOptions extends ProfileMenuUser {
  sections?: ProfileMenuSection[];
}

export interface ProfileMenuController {
  open: () => void;
  close: () => void;
  setUser: ((user: ProfileMenuUser) => void) & ((name: string, email?: string, avatarUrl?: string | null) => void);
  destroy: () => void;
}

export function profileMenu(trigger: HTMLElement, options?: ProfileMenuOptions): ProfileMenuController {
  const opts = {
    name: '',
    email: '',
    avatarUrl: null as string | null,
    sections: [] as ProfileMenuSection[],
    ...options,
  };

  let dropdown: HTMLDivElement | null = null;
  let isOpen = false;
  let focusIdx = -1;
  let itemEls: HTMLDivElement[] = [];

  const btn = document.createElement('button');
  btn.className = 'mn-profile-trigger';
  btn.type = 'button';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
  trigger.appendChild(btn);

  function positionDropdown(): void {
    if (!dropdown) return;
    const rect = btn.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 4}px`;
    const menuWidth = dropdown.offsetWidth || 260;
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
    dropdown.style.left = `${left}px`;
    const ddRect = dropdown.getBoundingClientRect();
    if (ddRect.bottom > window.innerHeight - 8) {
      dropdown.style.top = `${rect.top - ddRect.height - 4}px`;
    }
  }

  function setFocus(idx: number): void {
    if (!itemEls.length) return;
    focusIdx = ((idx % itemEls.length) + itemEls.length) % itemEls.length;
    itemEls.forEach((el, i) => el.classList.toggle('mn-profile-dropdown__item--focused', i === focusIdx));
    itemEls[focusIdx].focus();
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (!isOpen) return;
    switch (e.key) {
      case 'Escape': e.preventDefault(); close(); btn.focus(); break;
      case 'ArrowDown': e.preventDefault(); setFocus(focusIdx + 1); break;
      case 'ArrowUp': e.preventDefault(); setFocus(focusIdx - 1); break;
      case 'Enter':
      case ' ':
        if (focusIdx >= 0 && itemEls[focusIdx]) { e.preventDefault(); itemEls[focusIdx].click(); }
        break;
      case 'Tab': close(); break;
    }
  }

  function open(): void {
    if (isOpen) return;
    isOpen = true;
    focusIdx = -1;
    const result = buildDropdown(opts, close);
    dropdown = result.el;
    itemEls = result.itemEls;
    document.body.appendChild(dropdown);
    positionDropdown();
    btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => { dropdown?.classList.add('mn-profile-dropdown--open'); });
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onOutsideClick, true);
  }

  function close(): void {
    if (!isOpen) return;
    isOpen = false;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('mousedown', onOutsideClick, true);
    if (dropdown) {
      dropdown.classList.remove('mn-profile-dropdown--open');
      const dd = dropdown;
      setTimeout(() => { dd.parentNode?.removeChild(dd); }, 180);
      dropdown = null;
    }
    itemEls = [];
  }

  function onOutsideClick(e: MouseEvent): void {
    const target = e.target as Node | null;
    if (target && dropdown && !dropdown.contains(target) && !btn.contains(target)) close();
  }

  btn.addEventListener('click', (e) => { e.stopPropagation(); isOpen ? close() : open(); });

  const onResize = throttle((): void => { if (isOpen) positionDropdown(); }, 300);
  window.addEventListener('resize', onResize);

  const setUser = ((uOrName: ProfileMenuUser | string, email?: string, avatarUrl?: string | null) => {
    if (typeof uOrName === 'string') {
      opts.name = uOrName;
      opts.email = email ?? '';
      opts.avatarUrl = avatarUrl ?? null;
    } else {
      Object.assign(opts, uOrName);
    }
    btn.innerHTML = '';
    btn.appendChild(buildTriggerAvatar(opts.name, opts.avatarUrl));
    if (isOpen) { close(); open(); }
  }) as ProfileMenuController['setUser'];

  return {
    open,
    close,
    setUser,
    destroy(): void {
      close();
      window.removeEventListener('resize', onResize);
      btn.parentNode?.removeChild(btn);
    },
  };
}
