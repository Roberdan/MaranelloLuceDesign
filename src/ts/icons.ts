/**
 * Maranello Luce Design - Icon catalog (barrel export)
 * Consolidates all icon sub-modules into a single catalog.
 */

import type { IconCatalog, RenderIconOptions } from './core/types';
import { navIcons } from './icons-nav';
import { statusIcons } from './icons-status';
import { actionIcons } from './icons-actions';
import { dataIcons } from './icons-data';
import { objectIcons } from './icons-objects';
import { platformIcons } from './icons-platform';

/** Full icon catalog merging all icon groups. */
export const icons: IconCatalog = {
  ...navIcons,
  ...statusIcons,
  ...actionIcons,
  ...dataIcons,
  ...objectIcons,
  ...platformIcons,
};

/** Render an icon into a target element. */
export function renderIcon(
  target: string | Element,
  name: string,
  opts?: RenderIconOptions,
): void {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el || !icons[name]) return;
  const sizeClass = opts?.size ? ` mn-icon--${opts.size}` : '';
  const extraClass = opts?.class ? ` ${opts.class}` : '';
  const svg = icons[name]();
  const ariaAttr = opts?.ariaLabel
    ? `role="img" aria-label="${opts.ariaLabel}"`
    : 'aria-hidden="true"';
  const a11ySvg = svg.replace('<svg ', `<svg ${ariaAttr} `);
  el.innerHTML = `<span class="mn-icon${sizeClass}${extraClass}">${a11ySvg}</span>`;
}

/** Get all available icon names. */
export function iconCatalog(): string[] {
  return Object.keys(icons);
}

export { navIcons } from './icons-nav';
export { statusIcons } from './icons-status';
export { actionIcons } from './icons-actions';
export { dataIcons } from './icons-data';
export { objectIcons } from './icons-objects';
export { platformIcons } from './icons-platform';
