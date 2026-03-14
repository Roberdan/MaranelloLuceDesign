/**
 * Maranello Luce Design - Profile menu DOM helpers
 * Avatar generation, dropdown construction.
 */

import { icons } from './icons';
import type { ProfileMenuItem, ProfileMenuSection } from './core/types';

export type { ProfileMenuItem, ProfileMenuSection };

function getIcon(name: string): string {
  if (icons[name]) return icons[name]();
  return '';
}

export function initials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function buildAvatarSpan(cls: string, name: string, url: string | null | undefined): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = cls;
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = name || 'User avatar';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
    img.onerror = () => { img.remove(); el.textContent = initials(name); };
    el.appendChild(img);
  } else {
    el.textContent = initials(name);
  }
  return el;
}

export function buildTriggerAvatar(name: string, url: string | null | undefined): HTMLSpanElement {
  return buildAvatarSpan('mn-profile-trigger__avatar', name, url);
}

export function buildLargeAvatar(name: string, url: string | null | undefined): HTMLSpanElement {
  return buildAvatarSpan('mn-profile-dropdown__avatar-lg', name, url);
}

export interface DropdownBuildResult {
  el: HTMLDivElement;
  itemEls: HTMLDivElement[];
}

export function buildDropdown(
  opts: { name: string; email: string; avatarUrl: string | null; sections: ProfileMenuSection[] },
  closeFn: () => void,
): DropdownBuildResult {
  const itemEls: HTMLDivElement[] = [];
  const dd = document.createElement('div');
  dd.className = 'mn-profile-dropdown';
  dd.setAttribute('role', 'menu');
  dd.setAttribute('aria-label', 'User menu');

  const header = document.createElement('div');
  header.className = 'mn-profile-dropdown__header';
  header.appendChild(buildLargeAvatar(opts.name, opts.avatarUrl));
  const info = document.createElement('div');
  info.className = 'mn-profile-dropdown__info';
  const nameEl = document.createElement('div');
  nameEl.className = 'mn-profile-dropdown__name';
  nameEl.textContent = opts.name || 'User';
  info.appendChild(nameEl);
  if (opts.email) {
    const emailEl = document.createElement('div');
    emailEl.className = 'mn-profile-dropdown__email';
    emailEl.textContent = opts.email;
    info.appendChild(emailEl);
  }
  header.appendChild(info);
  dd.appendChild(header);

  for (const section of opts.sections) {
    if (section.divider) {
      dd.appendChild(document.createElement('div')).className = 'mn-profile-dropdown__divider';
      continue;
    }
    const sectionEl = document.createElement('div');
    sectionEl.className = 'mn-profile-dropdown__section';
    if (section.title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'mn-profile-dropdown__section-title';
      titleEl.textContent = section.title;
      sectionEl.appendChild(titleEl);
    }
    for (const item of (section.items ?? [])) {
      const row = document.createElement('div');
      row.className = 'mn-profile-dropdown__item';
      if (item.variant === 'danger') row.classList.add('mn-profile-dropdown__item--danger');
      row.setAttribute('role', 'menuitem');
      row.setAttribute('tabindex', '-1');
      if (item.icon) {
        const ic = document.createElement('span');
        ic.className = 'mn-profile-dropdown__item-icon';
        ic.innerHTML = getIcon(item.icon);
        row.appendChild(ic);
      }
      row.appendChild(document.createTextNode(item.label ?? ''));
      if (item.badge != null && Number(item.badge) > 0) {
        const badge = document.createElement('span');
        badge.className = 'mn-profile-dropdown__item-badge';
        badge.textContent = Number(item.badge) > 99 ? '99+' : String(item.badge);
        row.appendChild(badge);
      }
      row.addEventListener('click', () => {
        if (typeof item.action === 'function') item.action();
        closeFn();
      });
      sectionEl.appendChild(row);
      itemEls.push(row);
    }
    dd.appendChild(sectionEl);
  }

  return { el: dd, itemEls };
}
