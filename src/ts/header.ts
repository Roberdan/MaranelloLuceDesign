/**
 * Maranello Luce Design - Header (3-zone navbar)
 * Lightweight flex navbar with brand, nav buttons, search, and profile zones.
 */

import { profileMenu } from './profile-menu';
import type { ProfileMenuSection } from './core/types';

export interface HeaderBrand {
  label: string;
  logo?: string;
  href?: string;
}

export interface HeaderButton {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface HeaderSearch {
  type: 'search';
  placeholder?: string;
  shortcut?: string;
  onSearch?: (query: string) => void;
  filterButton?: { label: string; onClick: () => void };
}

export interface HeaderProfile {
  type: 'profile';
  name: string;
  avatarUrl?: string;
  sections?: ProfileMenuSection[];
}

type HeaderItem = HeaderButton | 'separator' | HeaderProfile;

export interface HeaderOptions {
  brand?: HeaderBrand;
  left?: (HeaderButton | 'separator')[];
  center?: HeaderSearch;
  right?: (HeaderItem)[];
}

export interface HeaderController {
  setActive(buttonId: string): void;
  destroy(): void;
}

function isProfile(item: HeaderItem): item is HeaderProfile {
  return typeof item === 'object' && 'type' in item && item.type === 'profile';
}

function isSeparator(item: HeaderItem): item is 'separator' {
  return item === 'separator';
}

function createButton(btn: HeaderButton): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'mn-header__btn';
  el.dataset.headerId = btn.id;
  if (btn.label) {
    el.title = btn.label;
    el.setAttribute('aria-label', btn.label);
  }
  if (btn.active) el.classList.add('mn-header__btn--active');
  if (btn.icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'mn-header__btn-icon';
    iconSpan.innerHTML = btn.icon;
    el.appendChild(iconSpan);
  }
  const labelSpan = document.createElement('span');
  labelSpan.textContent = btn.label;
  el.appendChild(labelSpan);
  if (btn.onClick) el.addEventListener('click', btn.onClick);
  el.addEventListener('click', () => {
    el.dispatchEvent(new CustomEvent('header-button-click', {
      detail: { id: btn.id, label: btn.label },
      bubbles: true,
    }));
  });
  return el;
}

function createSep(): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'mn-header__sep';
  el.setAttribute('role', 'separator');
  return el;
}

export function header(container: HTMLElement, options?: HeaderOptions): HeaderController {
  const opts = options ?? {};
  const nav = document.createElement('nav');
  nav.className = 'mn-header';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  const leftZone = document.createElement('div');
  leftZone.className = 'mn-header__zone mn-header__zone--left';

  const centerZone = document.createElement('div');
  centerZone.className = 'mn-header__zone mn-header__zone--center';

  const rightZone = document.createElement('div');
  rightZone.className = 'mn-header__zone mn-header__zone--right';

  // Brand
  if (opts.brand) {
    const tag = opts.brand.href ? 'a' : 'span';
    const brand = document.createElement(tag);
    brand.className = 'mn-header__brand';
    if (opts.brand.href && brand instanceof HTMLAnchorElement) {
      brand.href = opts.brand.href;
    }
    if (opts.brand.logo) {
      const logoSpan = document.createElement('span');
      logoSpan.className = 'mn-header__brand-logo';
      logoSpan.innerHTML = opts.brand.logo;
      brand.appendChild(logoSpan);
    }
    const labelSpan = document.createElement('span');
    labelSpan.textContent = opts.brand.label;
    brand.appendChild(labelSpan);
    leftZone.appendChild(brand);
  }

  // Left buttons
  if (opts.left) {
    for (const item of opts.left) {
      leftZone.appendChild(item === 'separator' ? createSep() : createButton(item));
    }
  }

  // Center search
  if (opts.center) {
    const searchWrap = document.createElement('div');
    searchWrap.className = 'mn-header__search';
    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'mn-header__search-input';
    input.placeholder = opts.center.placeholder ?? 'Search...';
    if (opts.center.onSearch) {
      const cb = opts.center.onSearch;
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') cb(input.value);
      });
    }
    searchWrap.appendChild(input);
    if (opts.center.shortcut) {
      const kbd = document.createElement('kbd');
      kbd.className = 'mn-header__shortcut';
      kbd.textContent = opts.center.shortcut;
      searchWrap.appendChild(kbd);
    }
    if (opts.center.filterButton) {
      const fb = document.createElement('button');
      fb.type = 'button';
      fb.className = 'mn-header__filter-btn mn-header__btn';
      fb.textContent = opts.center.filterButton.label;
      fb.addEventListener('click', opts.center.filterButton.onClick);
      searchWrap.appendChild(fb);
    }
    centerZone.appendChild(searchWrap);
  }

  // Right items
  const cleanups: (() => void)[] = [];
  if (opts.right) {
    for (const item of opts.right) {
      if (isSeparator(item)) {
        rightZone.appendChild(createSep());
      } else if (isProfile(item)) {
        const wrap = document.createElement('div');
        wrap.className = 'mn-header__profile';
        const ctrl = profileMenu(wrap, {
          name: item.name,
          avatarUrl: item.avatarUrl,
          sections: item.sections,
        });
        cleanups.push(() => ctrl.destroy());
        rightZone.appendChild(wrap);
      } else {
        rightZone.appendChild(createButton(item as HeaderButton));
      }
    }
  }

  nav.appendChild(leftZone);
  nav.appendChild(centerZone);
  nav.appendChild(rightZone);
  container.appendChild(nav);

  return {
    setActive(buttonId: string): void {
      nav.querySelectorAll('.mn-header__btn[data-header-id]').forEach(el => {
        el.classList.toggle('mn-header__btn--active', el.getAttribute('data-header-id') === buttonId);
      });
    },
    destroy(): void {
      cleanups.forEach(fn => fn());
      nav.remove();
    },
  };
}
